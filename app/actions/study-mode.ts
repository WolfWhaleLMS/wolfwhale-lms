'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  processXPAward,
  type XPEventType,
} from '@/lib/gamification/xp-engine'
import { rateLimitAction } from '@/lib/rate-limit-action'

async function getContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) throw new Error('No tenant context')
  return { supabase, user, tenantId }
}

/**
 * Record a completed study session and award XP.
 * XP scales with duration: <20min = 5, 20-39min = 10, 40+ min = 15 (focus_session base).
 * We store sessions as xp_events with source_type = 'study_session'.
 */
export async function recordStudySession(durationMinutes: number, musicType: string) {
  const rl = await rateLimitAction('recordStudySession')
  if (!rl.success) return { xpAwarded: 0, error: rl.error }

  const { supabase, user, tenantId } = await getContext()

  // Get current user level for XP calculation
  const { data: userLevel } = await supabase
    .from('student_xp')
    .select('total_xp, current_level')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .single()

  const currentTotalXp = userLevel?.total_xp ?? 0

  // Get today's XP to respect daily cap
  const today = new Date().toISOString().split('T')[0]
  const { data: todayEvents } = await supabase
    .from('xp_transactions')
    .select('xp_amount')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`)

  const dailyXpSoFar = todayEvents?.reduce((sum, e) => sum + (e.xp_amount || 0), 0) ?? 0

  // Use focus_session event type from XP_CONFIG (15 XP base)
  const eventType: XPEventType = 'focus_session'
  const result = processXPAward(eventType, currentTotalXp, dailyXpSoFar)

  // Scale XP based on duration
  let scaledXp = result.xpAwarded
  if (durationMinutes < 20) {
    scaledXp = Math.max(1, Math.round(result.xpAwarded * 0.33))
  } else if (durationMinutes < 40) {
    scaledXp = Math.max(1, Math.round(result.xpAwarded * 0.67))
  }
  // 40+ minutes gets the full award

  if (scaledXp <= 0) {
    return { xpAwarded: 0, dailyCapReached: result.dailyCapReached }
  }

  // Record the XP event with study session metadata
  await supabase.from('xp_transactions').insert({
    tenant_id: tenantId,
    user_id: user.id,
    event_type: eventType,
    xp_amount: scaledXp,
    source_type: 'study_session',
    source_id: null,
    metadata: {
      duration_minutes: durationMinutes,
      music_type: musicType,
    },
  })

  // Update user level
  const newTotalXp = currentTotalXp + scaledXp
  const newLevel = result.newLevel
  const newTier = result.newTier

  await supabase.from('student_xp').upsert({
    tenant_id: tenantId,
    user_id: user.id,
    total_xp: newTotalXp,
    current_level: newLevel,
    current_tier: newTier,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'tenant_id,user_id' })

  revalidatePath('/student/study-mode')
  revalidatePath('/student/dashboard')

  return {
    xpAwarded: scaledXp,
    newTotalXp,
    leveledUp: result.leveledUp,
    newLevel,
    newTier,
    dailyCapReached: result.dailyCapReached,
  }
}

/**
 * Get aggregated study statistics for the current user.
 */
export async function getStudyStats() {
  const { supabase, user, tenantId } = await getContext()

  // Get all study session XP events
  const { data: sessions } = await supabase
    .from('xp_transactions')
    .select('xp_amount, created_at, metadata')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .eq('source_type', 'study_session')
    .order('created_at', { ascending: false })

  if (!sessions || sessions.length === 0) {
    return {
      totalSessions: 0,
      totalMinutes: 0,
      longestSession: 0,
      currentStreak: 0,
      weeklyMinutes: 0,
    }
  }

  const totalSessions = sessions.length

  // Extract duration from metadata
  const durations = sessions.map((s) => {
    const meta = s.metadata as Record<string, unknown> | null
    return (meta?.duration_minutes as number) ?? 0
  })

  const totalMinutes = durations.reduce((sum, d) => sum + d, 0)
  const longestSession = Math.max(...durations)

  // Calculate weekly minutes (last 7 days)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weeklyMinutes = sessions
    .filter((s) => new Date(s.created_at) >= weekAgo)
    .reduce((sum, s) => {
      const meta = s.metadata as Record<string, unknown> | null
      return sum + ((meta?.duration_minutes as number) ?? 0)
    }, 0)

  // Calculate streak: consecutive days with at least one session
  const sessionDates = [...new Set(
    sessions.map((s) => new Date(s.created_at).toISOString().split('T')[0])
  )].sort().reverse()

  let currentStreak = 0
  const todayStr = new Date().toISOString().split('T')[0]
  const yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0]

  // Streak must start from today or yesterday
  if (sessionDates[0] === todayStr || sessionDates[0] === yesterdayStr) {
    let checkDate = new Date(sessionDates[0])
    for (const dateStr of sessionDates) {
      const expected = checkDate.toISOString().split('T')[0]
      if (dateStr === expected) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
  }

  return {
    totalSessions,
    totalMinutes,
    longestSession,
    currentStreak,
    weeklyMinutes,
  }
}

/**
 * Get recent study session history.
 */
export async function getStudyHistory(limit = 20) {
  const { supabase, user, tenantId } = await getContext()

  const { data } = await supabase
    .from('xp_transactions')
    .select('xp_amount, created_at, metadata')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .eq('source_type', 'study_session')
    .order('created_at', { ascending: false })
    .limit(limit)

  return (data ?? []).map((event) => {
    const meta = event.metadata as Record<string, unknown> | null
    return {
      durationMinutes: (meta?.duration_minutes as number) ?? 0,
      musicType: (meta?.music_type as string) ?? 'silent',
      xpAwarded: event.xp_amount,
      completedAt: event.created_at,
    }
  })
}
