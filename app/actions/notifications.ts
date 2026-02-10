'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function getContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) throw new Error('No tenant context')
  return { supabase, user, tenantId }
}

export async function getNotifications(limit = 20, unreadOnly = false) {
  const { supabase, user, tenantId } = await getContext()

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (unreadOnly) {
    query = query.eq('read', false)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getUnreadCount() {
  const { supabase, user, tenantId } = await getContext()

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
  const { supabase, user } = await getContext()

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .eq('user_id', user.id)

  if (error) throw error
  revalidatePath('/notifications')
}

export async function markAllAsRead() {
  const { supabase, user, tenantId } = await getContext()

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
  const { supabase, tenantId } = await getContext()

  const { error } = await supabase.from('notifications').insert({
    tenant_id: tenantId,
    user_id: userId,
    type,
    title,
    body,
    link,
    read: false,
  })

  if (error) throw error
}
