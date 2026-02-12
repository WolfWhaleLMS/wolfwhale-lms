'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { sanitizeText } from '@/lib/sanitize'
import { rateLimitAction } from '@/lib/rate-limit-action'
import { getActionContext } from '@/lib/actions/context'

export async function getNotifications(limit = 20, unreadOnly = false) {
  const safeLimit = Math.min(Math.max(1, limit), 100)
  const { supabase, user, tenantId } = await getActionContext()

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(safeLimit)

  if (unreadOnly) {
    query = query.eq('read', false)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getUnreadCount() {
  const { supabase, user, tenantId } = await getActionContext()

  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .eq('read', false)

  if (error) throw error
  return count ?? 0
}

export async function markAsRead(notificationId: string) {
  const rl = await rateLimitAction('markAsRead')
  if (!rl.success) throw new Error(rl.error ?? 'Too many requests')

  const { supabase, user } = await getActionContext()

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .eq('user_id', user.id)

  if (error) throw error
  revalidatePath('/notifications')
}

export async function markAllAsRead() {
  const rl = await rateLimitAction('markAllAsRead')
  if (!rl.success) throw new Error(rl.error ?? 'Too many requests')

  const { supabase, user, tenantId } = await getActionContext()

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .eq('read', false)

  if (error) throw error
  revalidatePath('/notifications')
}

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  body: string,
  link?: string
) {
  // Validate all inputs with Zod
  const createNotificationSchema = z.object({
    userId: z.string().uuid(),
    type: z.string().min(1).max(100),
    title: z.string().min(1).max(255),
    body: z.string().min(1).max(5000),
    link: z.string().max(2000).optional(),
  })
  const parsed = createNotificationSchema.safeParse({ userId, type, title, body, link })
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const rl = await rateLimitAction('createNotification')
  if (!rl.success) throw new Error(rl.error ?? 'Too many requests')

  const { supabase, user, tenantId } = await getActionContext()

  // Only teachers, admins, and super_admins can create notifications for others
  const { data: membership } = await supabase
    .from('tenant_memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .eq('status', 'active')
    .single()

  if (!membership || !['teacher', 'admin', 'super_admin'].includes(membership.role)) {
    throw new Error('Not authorized - only teachers and admins can create notifications')
  }

  // Verify the target user is in the same tenant
  const { data: targetMembership } = await supabase
    .from('tenant_memberships')
    .select('id')
    .eq('user_id', parsed.data.userId)
    .eq('tenant_id', tenantId)
    .eq('status', 'active')
    .maybeSingle()

  if (!targetMembership) {
    throw new Error('Target user is not a member of this tenant')
  }

  // Sanitize text content
  const sanitizedTitle = sanitizeText(parsed.data.title)
  const sanitizedBody = sanitizeText(parsed.data.body)

  const { error } = await supabase.from('notifications').insert({
    tenant_id: tenantId,
    user_id: parsed.data.userId,
    type: parsed.data.type,
    title: sanitizedTitle,
    body: sanitizedBody,
    link: parsed.data.link,
    read: false,
  })

  if (error) throw error
}
