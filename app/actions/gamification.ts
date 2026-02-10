'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  processXPAward,
  getLevelFromXP,
  getTierForLevel,
  type XPEventType,
} from '@/lib/gamification/xp-engine'

async function getContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) throw new Error('No tenant context')
  return { supabase, user, tenantId }
}

// ---------------------------------------------------------------------------
// XP
// ---------------------------------------------------------------------------

export async function awardXP(eventType: XPEventType, sourceType?: string, sourceId?: string) {
  const { supabase, user, tenantId } = await getContext()

  // Get current user level
  const { data: userLevel } = await supabase
    .from('user_levels')
    .select('total_xp, current_level')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .single()

  const currentTotalXp = userLevel?.total_xp ?? 0

  // Get today's XP
  const today = new Date().toISOString().split('T')[0]
  const { data: todayEvents } = await supabase
    .from('xp_events')
    .select('xp_amount')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`)

  const dailyXpSoFar = todayEvents?.reduce((sum, e) => sum + (e.xp_amount || 0), 0) ?? 0

  // Calculate award
  const result = processXPAward(eventType, currentTotalXp, dailyXpSoFar)

  if (result.xpAwarded <= 0) return result

  // Record XP event
  await supabase.from('xp_events').insert({
    tenant_id: tenantId,
    user_id: user.id,
    event_type: eventType,
    xp_amount: result.xpAwarded,
    source_type: sourceType || null,
    source_id: sourceId || null,
  })

  // Update user level
  await supabase.from('user_levels').upsert({
    tenant_id: tenantId,
    user_id: user.id,
    total_xp: result.newTotalXp,
    current_level: result.newLevel,
    current_tier: result.newTier,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'tenant_id,user_id' })

  revalidatePath('/student/achievements')
  return result
}

export async function getUserLevel() {
  const { supabase, user, tenantId } = await getContext()

  const { data } = await supabase
    .from('user_levels')
    .select('*')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .single()

  return data ?? { total_xp: 0, current_level: 1, current_tier: 'Awakening' }
}

export async function getXPHistory(limit = 20) {
  const { supabase, user, tenantId } = await getContext()

  const { data } = await supabase
    .from('xp_events')
    .select('*')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data ?? []
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

export async function getUserAchievements() {
  const { supabase, user, tenantId } = await getContext()

  const { data } = await supabase
    .from('user_achievements')
    .select('*, achievements(*)')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .order('earned_at', { ascending: false })

  return data ?? []
}

// ---------------------------------------------------------------------------
// Leaderboard
// ---------------------------------------------------------------------------

export async function getLeaderboard(period: 'weekly' | 'monthly' | 'all_time' = 'weekly', limit = 25) {
  const { supabase, tenantId } = await getContext()

  const { data } = await supabase
    .from('leaderboard_entries')
    .select('*, profiles:user_id(full_name, avatar_url)')
    .eq('tenant_id', tenantId)
    .eq('period', period)
    .order('xp_total', { ascending: false })
    .limit(limit)

  return data ?? []
}
