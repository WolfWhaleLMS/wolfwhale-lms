'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { rateLimitAction } from '@/lib/rate-limit-action'
import { sanitizeText } from '@/lib/sanitize'
import { logAuditEvent } from '@/lib/compliance/audit-logger'

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
// Conversations
// ---------------------------------------------------------------------------

export async function getConversations() {
  const { supabase, user, tenantId } = await getContext()

  const { data, error } = await supabase
    .from('conversation_members')
    .select(`
      conversation_id,
      conversations (
        id, subject, type, course_id, created_at, updated_at,
        messages (id, content, sender_id, created_at)
      )
    `)
    .eq('user_id', user.id)
    .eq('conversations.tenant_id', tenantId)
    .order('conversations(updated_at)', { ascending: false })

  if (error) throw error
  return data
}

export async function getConversation(conversationId: string) {
  if (!z.string().uuid().safeParse(conversationId).success) {
    throw new Error('Invalid ID')
  }

  const { supabase, user, tenantId } = await getContext()

  // Verify the user is a member of this conversation
  const { data: membership } = await supabase
    .from('conversation_members')
    .select('id')
    .eq('conversation_id', conversationId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!membership) {
    throw new Error('Not authorized - you are not a member of this conversation')
  }

  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      conversation_members (user_id, role, profiles (full_name, avatar_url)),
      messages (
        id, content, sender_id, created_at, updated_at,
        profiles:sender_id (full_name, avatar_url)
      )
    `)
    .eq('id', conversationId)
    .eq('tenant_id', tenantId)
    .single()

  if (error) throw error
  return data
}

export async function createDirectMessage(recipientId: string) {
  const parsed = z.object({ recipientId: z.string().uuid() }).safeParse({ recipientId })
  if (!parsed.success) throw new Error('Invalid input')

  const rl = await rateLimitAction('createDirectMessage')
  if (!rl.success) throw new Error(rl.error ?? 'Too many requests')

  const { supabase, user, tenantId } = await getContext()

  // Check for existing DM
  const { data: existing } = await supabase
    .from('conversations')
    .select('id, conversation_members!inner(user_id)')
    .eq('tenant_id', tenantId)
    .eq('type', 'direct')
    .eq('conversation_members.user_id', user.id)

  // Filter for conversations that also include the recipient
  if (existing) {
    for (const conv of existing) {
      const members = (conv as any).conversation_members as { user_id: string }[]
      if (members.some((m) => m.user_id === recipientId)) {
        return conv.id
      }
    }
  }

  // Create new conversation
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .insert({
      tenant_id: tenantId,
      type: 'direct',
      created_by: user.id,
    })
    .select('id')
    .single()

  if (convError) throw convError

  // Add members
  await supabase.from('conversation_members').insert([
    { conversation_id: conversation.id, user_id: user.id, role: 'member' },
    { conversation_id: conversation.id, user_id: recipientId, role: 'member' },
  ])

  revalidatePath('/messaging')
  return conversation.id
}

export async function createGroupConversation(title: string, memberIds: string[]) {
  const createGroupSchema = z.object({
    title: z.string().min(1).max(255),
    memberIds: z.array(z.string().uuid()).min(1).max(100),
  })
  const parsed = createGroupSchema.safeParse({ title, memberIds })
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const sanitizedTitle = sanitizeText(parsed.data.title)

  const { supabase, user, tenantId } = await getContext()

  // Verify all members are in the same tenant
  const { data: validMembers } = await supabase
    .from('tenant_memberships')
    .select('user_id')
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .in('user_id', memberIds)

  const validMemberIds = validMembers?.map(m => m.user_id) || []
  const invalidMembers = memberIds.filter(id => !validMemberIds.includes(id))
  if (invalidMembers.length > 0) {
    return { error: 'Some members are not in your organization' }
  }

  const { data: conversation, error } = await supabase
    .from('conversations')
    .insert({
      tenant_id: tenantId,
      type: 'group',
      subject: sanitizedTitle,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (error) throw error

  const allMembers = [user.id, ...parsed.data.memberIds.filter((id) => id !== user.id)]
  await supabase.from('conversation_members').insert(
    allMembers.map((userId) => ({
      conversation_id: conversation.id,
      user_id: userId,
      role: userId === user.id ? 'admin' : 'member',
    }))
  )

  revalidatePath('/messaging')
  return conversation.id
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export async function sendMessage(conversationId: string, content: string) {
  const parsed = z.object({
    conversationId: z.string().uuid(),
    content: z.string().min(1).max(10000),
  }).safeParse({ conversationId, content })
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const rl = await rateLimitAction('sendMessage')
  if (!rl.success) throw new Error(rl.error ?? 'Too many requests')

  const { supabase, user, tenantId } = await getContext()

  // Verify the user is a member of the conversation
  const { data: membership } = await supabase
    .from('conversation_members')
    .select('id')
    .eq('conversation_id', conversationId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!membership) {
    throw new Error('Not authorized - you are not a member of this conversation')
  }

  const sanitizedContent = sanitizeText(content)

  const { data, error } = await supabase
    .from('messages')
    .insert({
      tenant_id: tenantId,
      conversation_id: conversationId,
      sender_id: user.id,
      content: sanitizedContent,
    })
    .select('id, content, sender_id, created_at')
    .single()

  if (error) throw error

  // Update conversation updated_at
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  await logAuditEvent({
    action: 'message.send',
    resourceType: 'message',
    resourceId: data.id,
    details: { conversationId },
  })

  return data
}

export async function getMessages(conversationId: string, limit = 50, before?: string) {
  const safeLimit = Math.min(Math.max(1, limit), 200)
  const parsed = z.object({ conversationId: z.string().uuid() }).safeParse({ conversationId })
  if (!parsed.success) throw new Error('Invalid input')

  const { supabase, user, tenantId } = await getContext()

  // Verify the user is a member of this conversation
  const { data: membership } = await supabase
    .from('conversation_members')
    .select('id')
    .eq('conversation_id', conversationId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!membership) {
    throw new Error('Not authorized - you are not a member of this conversation')
  }

  let query = supabase
    .from('messages')
    .select('id, content, sender_id, created_at, updated_at, profiles:sender_id(full_name, avatar_url)')
    .eq('conversation_id', conversationId)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(safeLimit)

  if (before) {
    query = query.lt('created_at', before)
  }

  const { data, error } = await query
  if (error) throw error

  // Mark fetched messages as read
  if (data && data.length > 0) {
    const receipts = data.map((msg) => ({
      message_id: msg.id,
      user_id: user.id,
      read_at: new Date().toISOString(),
    }))
    await supabase
      .from('message_read_receipts')
      .upsert(receipts, { onConflict: 'message_id,user_id', ignoreDuplicates: true })
  }

  return data?.reverse() ?? []
}

export async function deleteMessage(messageId: string) {
  const parsed = z.object({ messageId: z.string().uuid() }).safeParse({ messageId })
  if (!parsed.success) throw new Error('Invalid input')

  const { supabase, user } = await getContext()

  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId)
    .eq('sender_id', user.id)

  if (error) throw error

  await logAuditEvent({
    action: 'message.delete',
    resourceType: 'message',
    resourceId: messageId,
  })
}
