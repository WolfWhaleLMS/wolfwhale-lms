'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
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
  const { supabase, user, tenantId } = await getContext()

  const { data: conversation, error } = await supabase
    .from('conversations')
    .insert({
      tenant_id: tenantId,
      type: 'group',
      subject: title,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (error) throw error

  const allMembers = [user.id, ...memberIds.filter((id) => id !== user.id)]
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

  const { data, error } = await supabase
    .from('messages')
    .insert({
      tenant_id: tenantId,
      conversation_id: conversationId,
      sender_id: user.id,
      content,
    })
    .select('id, content, sender_id, created_at')
    .single()

  if (error) throw error

  // Update conversation updated_at
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  return data
}

export async function getMessages(conversationId: string, limit = 50, before?: string) {
  const { supabase, user, tenantId } = await getContext()

  let query = supabase
    .from('messages')
    .select('id, content, sender_id, created_at, updated_at, profiles:sender_id(full_name, avatar_url)')
    .eq('conversation_id', conversationId)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(limit)

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
  const { supabase, user } = await getContext()

  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId)
    .eq('sender_id', user.id)

  if (error) throw error
}
