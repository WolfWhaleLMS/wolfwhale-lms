'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { rateLimitAction } from '@/lib/rate-limit-action'
import { sanitizeText } from '@/lib/sanitize'
import { AVATAR_DEFAULTS, TOKEN_DAILY_CAP, TOKEN_RATES } from '@/lib/plaza/constants'
import { getFullActionContext } from '@/lib/actions/context'
import type {
  PlazaAvatar,
  AvatarConfig,
  RoomData,
  RoomInfo,
  ChatPhrase,
  DailyLoginResult,
} from '@/lib/plaza/types'

// ---------------------------------------------------------------------------
// Zod Schemas
// ---------------------------------------------------------------------------

const createAvatarSchema = z.object({
  displayName: z.string().min(1).max(50),
})

const avatarConfigSchema = z.object({
  body_color: z.string().max(50).optional(),
  body_shape: z.string().max(50).optional(),
  eye_style: z.string().max(50).optional(),
  hat: z.string().max(100).nullable().optional(),
  outfit: z.string().max(100).nullable().optional(),
  accessory: z.string().max(100).nullable().optional(),
  trail_effect: z.string().max(100).nullable().optional(),
  emote: z.string().max(100).nullable().optional(),
  background_id: z.string().max(100).nullable().optional(),
})

const updateAvatarRoomSchema = z.object({
  roomSlug: z.string().min(1).max(100),
  x: z.number().min(0).max(10000),
  y: z.number().min(0).max(10000),
})

// ---------------------------------------------------------------------------
// Avatar CRUD
// ---------------------------------------------------------------------------

/** Create initial avatar for user (called on first plaza visit) */
export async function createAvatar(displayName: string): Promise<PlazaAvatar> {
  const rl = await rateLimitAction('createAvatar')
  if (!rl.success) throw new Error(rl.error)

  const parsed = createAvatarSchema.safeParse({ displayName })
  if (!parsed.success) throw new Error('Invalid display name')
  const safeName = sanitizeText(parsed.data.displayName).slice(0, 50)
  if (!safeName) throw new Error('Display name cannot be empty')

  const { admin, user, tenantId } = await getFullActionContext()

  // Check if avatar already exists
  const { data: existing } = await admin
    .from('plaza_avatars')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)
    .single()

  if (existing) return existing as PlazaAvatar

  const defaultConfig: AvatarConfig = {
    body_color: AVATAR_DEFAULTS.body_color,
    body_shape: AVATAR_DEFAULTS.body_shape,
    eye_style: AVATAR_DEFAULTS.eye_style,
    hat: AVATAR_DEFAULTS.hat,
    outfit: AVATAR_DEFAULTS.outfit,
    accessory: AVATAR_DEFAULTS.accessory,
    trail_effect: AVATAR_DEFAULTS.trail_effect,
    emote: AVATAR_DEFAULTS.emote,
    background_id: AVATAR_DEFAULTS.background_id,
  }

  const { data, error } = await admin
    .from('plaza_avatars')
    .insert({
      tenant_id: tenantId,
      user_id: user.id,
      display_name: safeName,
      avatar_config: defaultConfig,
      current_room: 'plaza_main',
      pos_x: AVATAR_DEFAULTS.spawn_x,
      pos_y: AVATAR_DEFAULTS.spawn_y,
      facing_direction: AVATAR_DEFAULTS.facing_direction,
    })
    .select('*')
    .single()

  if (error) {
    console.error('Failed to create avatar:', error)
    throw new Error('Failed to create avatar')
  }

  revalidatePath('/student/plaza')
  return data as PlazaAvatar
}

/** Get avatar data for current user */
export async function getMyAvatar(): Promise<PlazaAvatar | null> {
  const { admin, user, tenantId } = await getFullActionContext()

  const { data } = await admin
    .from('plaza_avatars')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)
    .single()

  return (data as PlazaAvatar) ?? null
}

/** Update avatar appearance (equip/unequip items, change colors) */
export async function updateAvatarConfig(config: AvatarConfig): Promise<PlazaAvatar> {
  const rl = await rateLimitAction('updateAvatarConfig')
  if (!rl.success) throw new Error(rl.error)

  const parsed = avatarConfigSchema.safeParse(config)
  if (!parsed.success) throw new Error('Invalid avatar configuration')

  const { admin, user, tenantId } = await getFullActionContext()

  const { data, error } = await admin
    .from('plaza_avatars')
    .update({
      avatar_config: parsed.data as AvatarConfig,
      updated_at: new Date().toISOString(),
    })
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error) {
    console.error('Failed to update avatar config:', error)
    throw new Error('Failed to update avatar config')
  }

  revalidatePath('/student/plaza')
  return data as PlazaAvatar
}

/** Update avatar position in DB (called on room change, not every frame) */
export async function updateAvatarRoom(
  roomSlug: string,
  x: number,
  y: number
): Promise<void> {
  const parsed = updateAvatarRoomSchema.safeParse({ roomSlug, x, y })
  if (!parsed.success) throw new Error('Invalid room or position data')

  const { admin, user, tenantId } = await getFullActionContext()

  const { error } = await admin
    .from('plaza_avatars')
    .update({
      current_room: parsed.data.roomSlug,
      pos_x: parsed.data.x,
      pos_y: parsed.data.y,
      last_seen_at: new Date().toISOString(),
    })
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to update avatar room:', error)
    throw new Error('Failed to update avatar room')
  }
}

/** Set avatar online/offline status */
export async function setAvatarOnlineStatus(isOnline: boolean): Promise<void> {
  const { admin, user, tenantId } = await getFullActionContext()

  const { error } = await admin
    .from('plaza_avatars')
    .update({
      is_online: isOnline,
      last_seen_at: new Date().toISOString(),
    })
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to update online status:', error)
    throw new Error('Failed to update online status')
  }
}

/** Get all online avatars in a room */
export async function getRoomAvatars(roomSlug: string): Promise<PlazaAvatar[]> {
  const { admin, tenantId } = await getFullActionContext()

  const { data, error } = await admin
    .from('plaza_avatars')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('current_room', roomSlug)
    .eq('is_online', true)

  if (error) {
    console.error('Failed to get room avatars:', error)
    throw new Error('Failed to get room avatars')
  }

  return (data ?? []) as PlazaAvatar[]
}

// ---------------------------------------------------------------------------
// Rooms
// ---------------------------------------------------------------------------

/** Get all available rooms with occupant counts */
export async function getPlazaRooms(): Promise<RoomInfo[]> {
  const { admin, tenantId } = await getFullActionContext()

  // Get rooms accessible to this tenant (global + tenant-specific)
  const { data: rooms, error } = await admin
    .from('plaza_rooms')
    .select('id, slug, name, description, room_type, max_occupants, sort_order')
    .or(`is_global.eq.true,tenant_id.eq.${tenantId}`)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Failed to get plaza rooms:', error)
    throw new Error('Failed to get plaza rooms')
  }
  if (!rooms || rooms.length === 0) return []

  // Get online avatar counts per room
  const { data: counts } = await admin
    .from('plaza_avatars')
    .select('current_room')
    .eq('tenant_id', tenantId)
    .eq('is_online', true)

  const roomCounts = new Map<string, number>()
  for (const row of counts ?? []) {
    const slug = row.current_room
    roomCounts.set(slug, (roomCounts.get(slug) ?? 0) + 1)
  }

  return rooms.map((room) => ({
    id: room.id,
    slug: room.slug,
    name: room.name,
    description: room.description,
    room_type: room.room_type,
    max_occupants: room.max_occupants,
    current_occupants: roomCounts.get(room.slug) ?? 0,
    sort_order: room.sort_order,
  }))
}

/** Get room data (map config, buildings, decorations) */
export async function getRoomData(roomSlug: string): Promise<RoomData> {
  const { admin, tenantId } = await getFullActionContext()

  const { data, error } = await admin
    .from('plaza_rooms')
    .select('*')
    .or(`is_global.eq.true,tenant_id.eq.${tenantId}`)
    .eq('slug', roomSlug)
    .eq('is_active', true)
    .single()

  if (error || !data) throw new Error(`Room not found: ${roomSlug}`)

  return data as RoomData
}

// ---------------------------------------------------------------------------
// Chat Phrases
// ---------------------------------------------------------------------------

/** Get all available chat phrases */
export async function getChatPhrases(): Promise<ChatPhrase[]> {
  const { admin, tenantId } = await getFullActionContext()

  const { data, error } = await admin
    .from('plaza_chat_phrases')
    .select('id, phrase, category, emoji_icon, is_global, sort_order')
    .or(`is_global.eq.true,tenant_id.eq.${tenantId}`)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Failed to get chat phrases:', error)
    throw new Error('Failed to get chat phrases')
  }

  return (data ?? []) as ChatPhrase[]
}

// ---------------------------------------------------------------------------
// Daily Login
// ---------------------------------------------------------------------------

/** Record daily plaza login (awards tokens if new day) */
export async function recordDailyLogin(): Promise<DailyLoginResult> {
  const rl = await rateLimitAction('recordDailyLogin')
  if (!rl.success) throw new Error(rl.error)

  const { admin, user, tenantId } = await getFullActionContext()

  // Get current avatar
  const { data: avatar } = await admin
    .from('plaza_avatars')
    .select('id, last_daily_login, daily_login_streak, token_balance, tokens_earned_total')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)
    .single()

  if (!avatar) throw new Error('Avatar not found. Create an avatar first.')

  const today = new Date().toISOString().split('T')[0]
  const lastLogin = avatar.last_daily_login

  // Check if already logged in today
  if (lastLogin === today) {
    return {
      is_new_day: false,
      tokens_awarded: 0,
      streak: avatar.daily_login_streak,
      streak_bonus: 0,
      new_balance: avatar.token_balance,
    }
  }

  // Calculate streak
  let newStreak = 1
  if (lastLogin) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    if (lastLogin === yesterdayStr) {
      newStreak = avatar.daily_login_streak + 1
    }
  }

  // Calculate streak bonus
  let streakBonus = 0
  if (newStreak === 7) streakBonus = TOKEN_RATES.streak_7_day
  else if (newStreak === 14) streakBonus = TOKEN_RATES.streak_14_day
  else if (newStreak === 30) streakBonus = TOKEN_RATES.streak_30_day

  // Check daily token cap
  const todayStart = `${today}T00:00:00`
  const todayEnd = `${today}T23:59:59`
  const { data: todayTransactions } = await admin
    .from('plaza_token_transactions')
    .select('amount')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)
    .gt('amount', 0)
    .gte('created_at', todayStart)
    .lte('created_at', todayEnd)

  const earnedToday = todayTransactions?.reduce((sum, t) => sum + t.amount, 0) ?? 0
  const capRemaining = Math.max(0, TOKEN_DAILY_CAP - earnedToday)

  // Award tokens (respect daily cap)
  const baseTokens = Math.min(TOKEN_RATES.daily_login, capRemaining)
  const bonusTokens = Math.min(streakBonus, Math.max(0, capRemaining - baseTokens))
  const totalTokens = baseTokens + bonusTokens

  const newBalance = avatar.token_balance + totalTokens

  // Update avatar (optimistic concurrency on last_daily_login to prevent double-awarding)
  const { data: updateResult, error: updateError } = await admin
    .from('plaza_avatars')
    .update({
      last_daily_login: today,
      daily_login_streak: newStreak,
      token_balance: newBalance,
      tokens_earned_total: avatar.tokens_earned_total + totalTokens,
      is_online: true,
      last_seen_at: new Date().toISOString(),
    })
    .eq('id', avatar.id)
    .neq('last_daily_login', today)
    .select('id')

  if (updateError || !updateResult || updateResult.length === 0) {
    // Already processed by a concurrent request
    return {
      is_new_day: false,
      tokens_awarded: 0,
      streak: newStreak,
      streak_bonus: 0,
      new_balance: avatar.token_balance,
    }
  }

  // Record token transaction
  if (totalTokens > 0) {
    await admin.from('plaza_token_transactions').insert({
      tenant_id: tenantId,
      user_id: user.id,
      amount: totalTokens,
      balance_after: newBalance,
      transaction_type: 'earn_daily_login',
      source_type: 'daily_login',
      description: `Daily login (streak: ${newStreak})${streakBonus > 0 ? ` + streak bonus: ${bonusTokens}` : ''}`,
    })
  }

  revalidatePath('/student/plaza')
  return {
    is_new_day: true,
    tokens_awarded: totalTokens,
    streak: newStreak,
    streak_bonus: bonusTokens,
    new_balance: newBalance,
  }
}
