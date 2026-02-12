'use server'

import { z } from 'zod'
import { sanitizeText } from '@/lib/sanitize'
import { rateLimitAction } from '@/lib/rate-limit-action'
import { getActionContext } from '@/lib/actions/context'

// ---------------------------------------------------------------------------
// Save a new conversation
// ---------------------------------------------------------------------------

export async function saveConversation(data: {
  title?: string
  courseId?: string
  lessonId?: string
  userRole: string
}) {
  const parsed = z.object({
    title: z.string().min(1).max(255).optional(),
    courseId: z.string().uuid().optional(),
    lessonId: z.string().uuid().optional(),
    userRole: z.enum(['student', 'teacher']),
  }).safeParse(data)
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const rl = await rateLimitAction('saveConversation')
  if (!rl.success) throw new Error(rl.error ?? 'Too many requests')

  try {
    const { supabase, user, tenantId } = await getActionContext()

    const { data: conversation, error } = await supabase
      .from('tutor_conversations')
      .insert({
        tenant_id: tenantId,
        user_id: user.id,
        user_role: parsed.data!.userRole,
        title: parsed.data!.title ? sanitizeText(parsed.data!.title) : 'New Conversation',
        course_id: parsed.data!.courseId || null,
        lesson_id: parsed.data!.lessonId || null,
      })
      .select('id')
      .single()

    if (error) {
      console.warn('[tutor] saveConversation failed:', error.message)
      return null
    }
    return conversation
  } catch (err) {
    console.warn('[tutor] saveConversation error:', err instanceof Error ? err.message : err)
    return null
  }
}

// ---------------------------------------------------------------------------
// Save a message to a conversation
// ---------------------------------------------------------------------------

export async function saveMessage(data: {
  conversationId: string
  role: string
  content: string
  tokenCount?: number
}) {
  const parsed = z.object({
    conversationId: z.string().uuid(),
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string().min(1).max(50000),
    tokenCount: z.number().int().min(0).optional(),
  }).safeParse(data)
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const rl = await rateLimitAction('saveMessage')
  if (!rl.success) throw new Error(rl.error ?? 'Too many requests')

  try {
    const { supabase, user } = await getActionContext()

    // Verify conversation ownership
    const { data: conversation } = await supabase
      .from('tutor_conversations')
      .select('id')
      .eq('id', parsed.data!.conversationId)
      .eq('user_id', user.id)
      .single()

    if (!conversation) {
      console.warn('[tutor] saveMessage: conversation not found or not authorized')
      return null
    }

    // Insert the message
    const { data: message, error: msgError } = await supabase
      .from('tutor_messages')
      .insert({
        conversation_id: parsed.data!.conversationId,
        role: parsed.data!.role,
        content: parsed.data!.role === 'user' ? sanitizeText(parsed.data!.content) : parsed.data!.content,
        token_count: parsed.data!.tokenCount || null,
      })
      .select('id')
      .single()

    if (msgError) {
      console.warn('[tutor] saveMessage insert failed:', msgError.message)
      return null
    }

    // Update conversation message_count and last_message_at
    const { error: updateError } = await supabase
      .from('tutor_conversations')
      .update({
        message_count: (await supabase
          .from('tutor_messages')
          .select('id', { count: 'exact', head: true })
          .eq('conversation_id', parsed.data!.conversationId)
        ).count || 0,
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', parsed.data!.conversationId)
      .eq('user_id', user.id)

    if (updateError) {
      console.warn('[tutor] saveMessage update count failed:', updateError.message)
    }

    return message
  } catch (err) {
    console.warn('[tutor] saveMessage error:', err instanceof Error ? err.message : err)
    return null
  }
}

// ---------------------------------------------------------------------------
// Get all conversations for the current user
// ---------------------------------------------------------------------------

export async function getConversations() {
  try {
    const { supabase, user, tenantId } = await getActionContext()

    const { data, error } = await supabase
      .from('tutor_conversations')
      .select('*')
      .eq('user_id', user.id)
      .eq('tenant_id', tenantId)
      .order('updated_at', { ascending: false })

    if (error) {
      // If table doesn't exist or permission denied, return empty gracefully
      console.warn('[tutor] getConversations failed:', error.message)
      return []
    }
    return data ?? []
  } catch (err) {
    // Gracefully handle missing auth context, missing tenant, or missing tables
    console.warn('[tutor] getConversations error:', err instanceof Error ? err.message : err)
    return []
  }
}

// ---------------------------------------------------------------------------
// Get all messages for a conversation
// ---------------------------------------------------------------------------

export async function getConversationMessages(conversationId: string) {
  if (!z.string().uuid().safeParse(conversationId).success) {
    return []
  }

  try {
    const { supabase, user } = await getActionContext()

    // Verify conversation ownership
    const { data: conversation } = await supabase
      .from('tutor_conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single()

    if (!conversation) {
      console.warn('[tutor] getConversationMessages: conversation not found')
      return []
    }

    const { data, error } = await supabase
      .from('tutor_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) {
      console.warn('[tutor] getConversationMessages failed:', error.message)
      return []
    }
    return data ?? []
  } catch (err) {
    console.warn('[tutor] getConversationMessages error:', err instanceof Error ? err.message : err)
    return []
  }
}

// ---------------------------------------------------------------------------
// Delete a conversation
// ---------------------------------------------------------------------------

export async function deleteConversation(conversationId: string) {
  if (!z.string().uuid().safeParse(conversationId).success) {
    throw new Error('Invalid conversation ID')
  }

  const rl = await rateLimitAction('deleteConversation')
  if (!rl.success) throw new Error(rl.error ?? 'Too many requests')

  try {
    const { supabase, user } = await getActionContext()

    const { error } = await supabase
      .from('tutor_conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', user.id)

    if (error) {
      console.warn('[tutor] deleteConversation failed:', error.message)
    }
  } catch (err) {
    console.warn('[tutor] deleteConversation error:', err instanceof Error ? err.message : err)
  }
}

// ---------------------------------------------------------------------------
// Update conversation title
// ---------------------------------------------------------------------------

export async function updateConversationTitle(conversationId: string, title: string) {
  const parsed = z.object({
    conversationId: z.string().uuid(),
    title: z.string().min(1).max(255),
  }).safeParse({ conversationId, title })
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const rl = await rateLimitAction('updateConversationTitle')
  if (!rl.success) throw new Error(rl.error ?? 'Too many requests')

  try {
    const { supabase, user } = await getActionContext()

    const { error } = await supabase
      .from('tutor_conversations')
      .update({
        title: sanitizeText(title),
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId)
      .eq('user_id', user.id)

    if (error) {
      console.warn('[tutor] updateConversationTitle failed:', error.message)
    }
  } catch (err) {
    console.warn('[tutor] updateConversationTitle error:', err instanceof Error ? err.message : err)
  }
}
