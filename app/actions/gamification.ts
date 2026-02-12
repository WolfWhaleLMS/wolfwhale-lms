'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import {
  processXPAward,
  getLevelFromXP,
  getTierForLevel,
  type XPEventType,
} from '@/lib/gamification/xp-engine'
import { rateLimitAction } from '@/lib/rate-limit-action'
import { getActionContext } from '@/lib/actions/context'

// ---------------------------------------------------------------------------
// XP
// ---------------------------------------------------------------------------

export async function awardXP(eventType: XPEventType, sourceType?: string, sourceId?: string) {
  // Validate sourceId as UUID if provided
  if (sourceId && !z.string().uuid().safeParse(sourceId).success) {
    return { xpAwarded: 0, error: 'Invalid ID' }
  }

  const rl = await rateLimitAction('awardXP')
  if (!rl.success) return { xpAwarded: 0, error: rl.error }

  const { supabase, user, tenantId } = await getActionContext()

  // Prevent duplicate XP for the same source event
  if (sourceId) {
    const { data: duplicate } = await supabase
      .from('xp_transactions')
      .select('id')
      .eq('student_id', user.id)
      .eq('tenant_id', tenantId)
      .eq('source_id', sourceId)
      .eq('source_type', sourceType || eventType)
      .limit(1)
      .maybeSingle()

    if (duplicate) return { xpAwarded: 0, newTotalXp: 0, leveledUp: false, newLevel: 0, newTier: '', dailyCapReached: false }
  }

  // Get current user level
  const { data: userLevel } = await supabase
    .from('student_xp')
    .select('total_xp, current_level')
    .eq('student_id', user.id)
    .eq('tenant_id', tenantId)
    .single()

  const currentTotalXp = userLevel?.total_xp ?? 0

  // Get today's XP
  const today = new Date().toISOString().split('T')[0]
  const { data: todayEvents } = await supabase
    .from('xp_transactions')
    .select('amount')
    .eq('student_id', user.id)
    .eq('tenant_id', tenantId)
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`)

  const dailyXpSoFar = todayEvents?.reduce((sum, e) => sum + (e.amount || 0), 0) ?? 0

  // Calculate award
  const result = processXPAward(eventType, currentTotalXp, dailyXpSoFar)

  if (result.xpAwarded <= 0) return result

  // Record XP event
  const { error: txError } = await supabase.from('xp_transactions').insert({
    tenant_id: tenantId,
    student_id: user.id,
    amount: result.xpAwarded,
    source_type: sourceType || eventType,
    source_id: sourceId || null,
    description: eventType,
  })

  if (txError) {
    console.error('Error recording XP transaction:', txError)
    return { ...result, xpAwarded: 0 }
  }

  // Update user level
  const { error: upsertError } = await supabase.from('student_xp').upsert({
    tenant_id: tenantId,
    student_id: user.id,
    total_xp: result.newTotalXp,
    current_level: result.newLevel,
    current_tier: result.newTier,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'tenant_id,student_id' })

  if (upsertError) {
    console.error('Error updating user level:', upsertError)
  }

  revalidatePath('/student/achievements')
  return result
}

export async function getUserLevel() {
  const { supabase, user, tenantId } = await getActionContext()

  const { data } = await supabase
    .from('student_xp')
    .select('*')
    .eq('student_id', user.id)
    .eq('tenant_id', tenantId)
    .single()

  return data ?? { total_xp: 0, current_level: 1, current_tier: 'Awakening' }
}

export async function getXPHistory(limit = 20) {
  const safeLimit = Math.min(Math.max(1, limit), 100)
  const { supabase, user, tenantId } = await getActionContext()

  const { data } = await supabase
    .from('xp_transactions')
    .select('*')
    .eq('student_id', user.id)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(safeLimit)

  return data ?? []
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

export async function getUserAchievements() {
  const { supabase, user, tenantId } = await getActionContext()

  const { data } = await supabase
    .from('student_achievements')
    .select('*, achievements:achievement_id(*)')
    .eq('student_id', user.id)
    .eq('tenant_id', tenantId)
    .order('unlocked_at', { ascending: false })

  return data ?? []
}

// ---------------------------------------------------------------------------
// Leaderboard
// ---------------------------------------------------------------------------

export async function getLeaderboard(period: 'weekly' | 'monthly' | 'all_time' = 'weekly', limit = 25) {
  const safeLimit = Math.min(Math.max(1, limit), 100)
  const { supabase, tenantId } = await getActionContext()

  const { data } = await supabase
    .from('leaderboard_entries')
    .select('*, profiles:user_id(full_name, avatar_url)')
    .eq('tenant_id', tenantId)
    .eq('period', period)
    .order('xp_total', { ascending: false })
    .limit(safeLimit)

  return data ?? []
}
