'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { rateLimitAction } from '@/lib/rate-limit-action'
import { TOKEN_DAILY_CAP } from '@/lib/plaza/constants'
import type {
  StoreItem,
  InventoryItem,
  PurchaseResult,
  TokenInfo,
  TokenTransaction,
  TokenTransactionType,
  LeaderboardEntry,
} from '@/lib/plaza/types'

// ---------------------------------------------------------------------------
// Context helper
// ---------------------------------------------------------------------------

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
// Store Items
// ---------------------------------------------------------------------------

/** Get all available items in the store (with owned/equipped status) */
export async function getStoreItems(category?: string): Promise<StoreItem[]> {
  const { supabase, user, tenantId } = await getContext()

  // Get user's avatar for level check and balance
  const { data: avatar } = await supabase
    .from('plaza_avatars')
    .select('avatar_level, token_balance')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)
    .single()

  const avatarLevel = avatar?.avatar_level ?? 1
  const tokenBalance = avatar?.token_balance ?? 0

  // Build items query
  let query = supabase
    .from('plaza_avatar_items')
    .select('*')
    .or(`is_global.eq.true,tenant_id.eq.${tenantId}`)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data: items, error } = await query

  if (error) throw new Error(`Failed to get store items: ${error.message}`)
  if (!items || items.length === 0) return []

  // Get user's inventory to check ownership
  const { data: inventory } = await supabase
    .from('plaza_avatar_inventory')
    .select('item_id, is_equipped')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)

  const ownedMap = new Map<string, boolean>()
  const equippedMap = new Map<string, boolean>()
  for (const inv of inventory ?? []) {
    ownedMap.set(inv.item_id, true)
    if (inv.is_equipped) equippedMap.set(inv.item_id, true)
  }

  // Check availability dates
  const now = new Date().toISOString()

  return items
    .filter((item) => {
      // Filter out items outside availability window
      if (item.available_from && item.available_from > now) return false
      if (item.available_until && item.available_until < now) return false
      // Filter out sold-out limited editions
      if (item.max_purchases && item.current_purchases >= item.max_purchases) return false
      return true
    })
    .map((item) => ({
      ...item,
      is_owned: ownedMap.has(item.id),
      is_equipped: equippedMap.has(item.id),
      can_afford: item.is_free || tokenBalance >= item.price_tokens,
      meets_level_requirement: avatarLevel >= (item.min_avatar_level ?? 1),
    })) as StoreItem[]
}

// ---------------------------------------------------------------------------
// Purchase
// ---------------------------------------------------------------------------

/** Purchase an item from the store */
export async function purchaseItem(itemId: string): Promise<PurchaseResult> {
  const rl = await rateLimitAction('purchaseItem')
  if (!rl.success) return { success: false, error: rl.error }

  const { supabase, user, tenantId } = await getContext()

  // Get item details
  const { data: item, error: itemError } = await supabase
    .from('plaza_avatar_items')
    .select('*')
    .eq('id', itemId)
    .eq('is_active', true)
    .single()

  if (itemError || !item) return { success: false, error: 'Item not found or unavailable.' }

  // Get avatar
  const { data: avatar, error: avatarError } = await supabase
    .from('plaza_avatars')
    .select('id, token_balance, tokens_spent_total, avatar_level')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)
    .single()

  if (avatarError || !avatar) return { success: false, error: 'Avatar not found.' }

  // Check if already owned
  const { data: existing } = await supabase
    .from('plaza_avatar_inventory')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_id', itemId)
    .single()

  if (existing) return { success: false, error: 'You already own this item.' }

  // Check level requirement
  if (item.min_avatar_level && avatar.avatar_level < item.min_avatar_level) {
    return { success: false, error: `Requires avatar level ${item.min_avatar_level}.` }
  }

  // Check limited edition availability
  if (item.max_purchases && item.current_purchases >= item.max_purchases) {
    return { success: false, error: 'This limited edition item is sold out.' }
  }

  // Check availability dates
  const now = new Date().toISOString()
  if (item.available_from && item.available_from > now) {
    return { success: false, error: 'This item is not yet available.' }
  }
  if (item.available_until && item.available_until < now) {
    return { success: false, error: 'This item is no longer available.' }
  }

  // Check balance (unless free)
  const price = item.is_free ? 0 : item.price_tokens
  if (price > 0 && avatar.token_balance < price) {
    return { success: false, error: `Not enough tokens. Need ${price}, have ${avatar.token_balance}.` }
  }

  // Perform purchase
  const newBalance = avatar.token_balance - price

  // Add to inventory
  const { data: inventoryRow, error: insertError } = await supabase
    .from('plaza_avatar_inventory')
    .insert({
      tenant_id: tenantId,
      user_id: user.id,
      item_id: itemId,
      is_equipped: false,
      price_paid: price,
    })
    .select('id, item_id, is_equipped, purchased_at, price_paid')
    .single()

  if (insertError) return { success: false, error: `Purchase failed: ${insertError.message}` }

  // Deduct tokens from avatar balance
  if (price > 0) {
    await supabase
      .from('plaza_avatars')
      .update({
        token_balance: newBalance,
        tokens_spent_total: avatar.tokens_spent_total + price,
      })
      .eq('id', avatar.id)

    // Record token transaction
    await supabase.from('plaza_token_transactions').insert({
      tenant_id: tenantId,
      user_id: user.id,
      amount: -price,
      balance_after: newBalance,
      transaction_type: 'spend_store',
      source_type: 'store_purchase',
      source_id: itemId,
      description: `Purchased: ${item.name}`,
    })
  }

  // Increment purchase counter for limited edition items
  if (item.is_limited_edition) {
    await supabase
      .from('plaza_avatar_items')
      .update({ current_purchases: (item.current_purchases ?? 0) + 1 })
      .eq('id', itemId)
  }

  revalidatePath('/student/plaza')
  return {
    success: true,
    item: {
      id: inventoryRow.id,
      item_id: inventoryRow.item_id,
      name: item.name,
      description: item.description,
      category: item.category,
      slot: item.slot,
      rarity: item.rarity,
      sprite_key: item.sprite_key,
      preview_url: item.preview_url,
      is_equipped: false,
      purchased_at: inventoryRow.purchased_at,
      price_paid: price,
    },
    new_balance: newBalance,
    tokens_spent: price,
  }
}

// ---------------------------------------------------------------------------
// Equip / Unequip
// ---------------------------------------------------------------------------

/** Equip an owned item */
export async function equipItem(itemId: string): Promise<void> {
  const { supabase, user, tenantId } = await getContext()

  // Get the item from inventory
  const { data: invItem, error: invError } = await supabase
    .from('plaza_avatar_inventory')
    .select('id, item_id')
    .eq('user_id', user.id)
    .eq('item_id', itemId)
    .single()

  if (invError || !invItem) throw new Error('Item not in your inventory.')

  // Get item details for slot info
  const { data: item } = await supabase
    .from('plaza_avatar_items')
    .select('slot')
    .eq('id', itemId)
    .single()

  if (!item) throw new Error('Item not found.')

  // Unequip any existing item in the same slot
  const { data: equippedInSlot } = await supabase
    .from('plaza_avatar_inventory')
    .select('id, item_id')
    .eq('user_id', user.id)
    .eq('is_equipped', true)

  if (equippedInSlot) {
    // Check which of these share the same slot
    const equippedIds = equippedInSlot.map((e) => e.item_id)
    if (equippedIds.length > 0) {
      const { data: equippedItems } = await supabase
        .from('plaza_avatar_items')
        .select('id, slot')
        .in('id', equippedIds)

      const sameSlotItemIds = (equippedItems ?? [])
        .filter((e) => e.slot === item.slot)
        .map((e) => e.id)

      if (sameSlotItemIds.length > 0) {
        // Unequip items in the same slot
        for (const slotItemId of sameSlotItemIds) {
          await supabase
            .from('plaza_avatar_inventory')
            .update({ is_equipped: false })
            .eq('user_id', user.id)
            .eq('item_id', slotItemId)
        }
      }
    }
  }

  // Equip the new item
  const { error } = await supabase
    .from('plaza_avatar_inventory')
    .update({ is_equipped: true })
    .eq('id', invItem.id)

  if (error) throw new Error(`Failed to equip item: ${error.message}`)

  revalidatePath('/student/plaza')
}

/** Unequip an item from a slot */
export async function unequipItem(slot: string): Promise<void> {
  const { supabase, user } = await getContext()

  // Get all equipped items in this slot
  const { data: equippedItems } = await supabase
    .from('plaza_avatar_inventory')
    .select('id, item_id')
    .eq('user_id', user.id)
    .eq('is_equipped', true)

  if (!equippedItems || equippedItems.length === 0) return

  // Find items matching the slot
  const equippedIds = equippedItems.map((e) => e.item_id)
  const { data: items } = await supabase
    .from('plaza_avatar_items')
    .select('id, slot')
    .in('id', equippedIds)

  const targetItemIds = (items ?? [])
    .filter((i) => i.slot === slot)
    .map((i) => i.id)

  if (targetItemIds.length === 0) return

  // Unequip
  for (const targetId of targetItemIds) {
    await supabase
      .from('plaza_avatar_inventory')
      .update({ is_equipped: false })
      .eq('user_id', user.id)
      .eq('item_id', targetId)
  }

  revalidatePath('/student/plaza')
}

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

/** Get user's inventory */
export async function getInventory(): Promise<InventoryItem[]> {
  const { supabase, user, tenantId } = await getContext()

  const { data, error } = await supabase
    .from('plaza_avatar_inventory')
    .select(`
      id,
      item_id,
      is_equipped,
      purchased_at,
      price_paid,
      plaza_avatar_items:item_id (
        name,
        description,
        category,
        slot,
        rarity,
        sprite_key,
        preview_url
      )
    `)
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)
    .order('purchased_at', { ascending: false })

  if (error) throw new Error(`Failed to get inventory: ${error.message}`)

  return (data ?? []).map((row: any) => ({
    id: row.id,
    item_id: row.item_id,
    name: row.plaza_avatar_items?.name ?? '',
    description: row.plaza_avatar_items?.description ?? null,
    category: row.plaza_avatar_items?.category ?? 'hat',
    slot: row.plaza_avatar_items?.slot ?? 'head',
    rarity: row.plaza_avatar_items?.rarity ?? 'bronze',
    sprite_key: row.plaza_avatar_items?.sprite_key ?? '',
    preview_url: row.plaza_avatar_items?.preview_url ?? null,
    is_equipped: row.is_equipped,
    purchased_at: row.purchased_at,
    price_paid: row.price_paid,
  })) as InventoryItem[]
}

// ---------------------------------------------------------------------------
// Token Info
// ---------------------------------------------------------------------------

/** Get token balance and recent transaction history */
export async function getTokenInfo(): Promise<TokenInfo> {
  const { supabase, user, tenantId } = await getContext()

  // Get avatar balance
  const { data: avatar } = await supabase
    .from('plaza_avatars')
    .select('token_balance, tokens_earned_total, tokens_spent_total')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)
    .single()

  if (!avatar) throw new Error('Avatar not found.')

  // Get today's earnings
  const today = new Date().toISOString().split('T')[0]
  const { data: todayTransactions } = await supabase
    .from('plaza_token_transactions')
    .select('amount')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)
    .gt('amount', 0)
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`)

  const earnedToday = todayTransactions?.reduce((sum, t) => sum + t.amount, 0) ?? 0

  // Get recent transactions
  const { data: recentTx } = await supabase
    .from('plaza_token_transactions')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return {
    balance: avatar.token_balance,
    tokens_earned_total: avatar.tokens_earned_total,
    tokens_spent_total: avatar.tokens_spent_total,
    tokens_earned_today: earnedToday,
    daily_cap: TOKEN_DAILY_CAP,
    daily_cap_remaining: Math.max(0, TOKEN_DAILY_CAP - earnedToday),
    recent_transactions: (recentTx ?? []) as TokenTransaction[],
  }
}

// ---------------------------------------------------------------------------
// Award Tokens
// ---------------------------------------------------------------------------

/** Award tokens (server-side, called from game completion, study sessions, etc.) */
export async function awardTokens(
  amount: number,
  transactionType: string,
  sourceType: string,
  sourceId?: string,
  description?: string
): Promise<TokenTransaction> {
  const rl = await rateLimitAction('awardTokens')
  if (!rl.success) throw new Error(rl.error)

  const { supabase, user, tenantId } = await getContext()

  if (amount <= 0) throw new Error('Amount must be positive.')

  // Get avatar
  const { data: avatar } = await supabase
    .from('plaza_avatars')
    .select('id, token_balance, tokens_earned_total')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)
    .single()

  if (!avatar) throw new Error('Avatar not found.')

  // Check daily cap
  const today = new Date().toISOString().split('T')[0]
  const { data: todayTransactions } = await supabase
    .from('plaza_token_transactions')
    .select('amount')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)
    .gt('amount', 0)
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`)

  const earnedToday = todayTransactions?.reduce((sum, t) => sum + t.amount, 0) ?? 0
  const capRemaining = Math.max(0, TOKEN_DAILY_CAP - earnedToday)
  const cappedAmount = Math.min(amount, capRemaining)

  if (cappedAmount <= 0) {
    // Daily cap reached, return a zero-amount transaction record
    return {
      id: '',
      tenant_id: tenantId,
      user_id: user.id,
      amount: 0,
      balance_after: avatar.token_balance,
      transaction_type: transactionType as TokenTransactionType,
      source_type: sourceType,
      source_id: sourceId ?? null,
      description: 'Daily token cap reached',
      created_at: new Date().toISOString(),
    }
  }

  const newBalance = avatar.token_balance + cappedAmount

  // Update avatar balance
  await supabase
    .from('plaza_avatars')
    .update({
      token_balance: newBalance,
      tokens_earned_total: avatar.tokens_earned_total + cappedAmount,
    })
    .eq('id', avatar.id)

  // Record transaction
  const { data: tx, error } = await supabase
    .from('plaza_token_transactions')
    .insert({
      tenant_id: tenantId,
      user_id: user.id,
      amount: cappedAmount,
      balance_after: newBalance,
      transaction_type: transactionType,
      source_type: sourceType,
      source_id: sourceId ?? null,
      description: description ?? null,
    })
    .select('*')
    .single()

  if (error) throw new Error(`Failed to record token transaction: ${error.message}`)

  return tx as TokenTransaction
}

// ---------------------------------------------------------------------------
// Token Leaderboard
// ---------------------------------------------------------------------------

/** Get token leaderboard */
export async function getTokenLeaderboard(
  period: 'weekly' | 'monthly' | 'all_time' = 'weekly',
  limit: number = 25
): Promise<LeaderboardEntry[]> {
  const { supabase, tenantId } = await getContext()

  if (period === 'all_time') {
    // Use total tokens earned on the avatar
    const { data, error } = await supabase
      .from('plaza_avatars')
      .select('user_id, display_name, avatar_config, tokens_earned_total')
      .eq('tenant_id', tenantId)
      .order('tokens_earned_total', { ascending: false })
      .limit(limit)

    if (error) throw new Error(`Failed to get leaderboard: ${error.message}`)

    return (data ?? []).map((row, index) => ({
      user_id: row.user_id,
      display_name: row.display_name,
      avatar_config: row.avatar_config,
      value: row.tokens_earned_total,
      rank: index + 1,
    })) as LeaderboardEntry[]
  }

  // For weekly/monthly, aggregate from token transactions
  const now = new Date()
  let startDate: string

  if (period === 'weekly') {
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    startDate = weekAgo.toISOString()
  } else {
    const monthAgo = new Date(now)
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    startDate = monthAgo.toISOString()
  }

  // Get earning transactions in the period
  const { data: transactions, error } = await supabase
    .from('plaza_token_transactions')
    .select('user_id, amount')
    .eq('tenant_id', tenantId)
    .gt('amount', 0)
    .gte('created_at', startDate)

  if (error) throw new Error(`Failed to get leaderboard: ${error.message}`)

  // Aggregate by user
  const userTotals = new Map<string, number>()
  for (const tx of transactions ?? []) {
    userTotals.set(tx.user_id, (userTotals.get(tx.user_id) ?? 0) + tx.amount)
  }

  // Sort and limit
  const sorted = Array.from(userTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)

  if (sorted.length === 0) return []

  // Get avatar info for the top users
  const topUserIds = sorted.map(([uid]) => uid)
  const { data: avatars } = await supabase
    .from('plaza_avatars')
    .select('user_id, display_name, avatar_config')
    .eq('tenant_id', tenantId)
    .in('user_id', topUserIds)

  const avatarMap = new Map<string, { display_name: string; avatar_config: any }>()
  for (const av of avatars ?? []) {
    avatarMap.set(av.user_id, { display_name: av.display_name, avatar_config: av.avatar_config })
  }

  return sorted.map(([userId, value], index) => ({
    user_id: userId,
    display_name: avatarMap.get(userId)?.display_name ?? 'Unknown',
    avatar_config: avatarMap.get(userId)?.avatar_config ?? {},
    value,
    rank: index + 1,
  })) as LeaderboardEntry[]
}
