'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { sanitizeText, sanitizeRichText } from '@/lib/sanitize'
import { rateLimitAction } from '@/lib/rate-limit-action'
import { requireAdmin } from '@/lib/actions/context'

const scheduledPostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1).max(10000),
  category: z.enum(['lms_feature', 'indigenous_education', 'community', 'tip']),
  scheduledFor: z.string().min(1),
  isRecurring: z.boolean().optional(),
  recurrenceRule: z.enum(['daily', 'weekly', 'biweekly', 'monthly']).optional(),
})

export async function getScheduledPosts(status?: string) {
  const { supabase, tenantId } = await requireAdmin()

  let query = supabase
    .from('scheduled_posts')
    .select('*, profiles:created_by(full_name)')
    .eq('tenant_id', tenantId)
    .order('scheduled_for', { ascending: true })

  if (status) {
    const parsed = z.enum(['pending', 'published', 'cancelled']).safeParse(status)
    if (parsed.success) {
      query = query.eq('status', parsed.data)
    }
  }

  query = query.limit(100)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function createScheduledPost(formData: {
  title: string
  content: string
  category: string
  scheduledFor: string
  isRecurring?: boolean
  recurrenceRule?: string
}) {
  const rl = await rateLimitAction('createScheduledPost')
  if (!rl.success) throw new Error(rl.error ?? 'Too many requests')

  const parsed = scheduledPostSchema.safeParse(formData)
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, user, tenantId } = await requireAdmin()

  const sanitizedTitle = sanitizeText(parsed.data.title)
  const sanitizedContent = sanitizeRichText(parsed.data.content)

  const { data, error } = await supabase
    .from('scheduled_posts')
    .insert({
      tenant_id: tenantId,
      created_by: user.id,
      title: sanitizedTitle,
      content: sanitizedContent,
      category: parsed.data.category,
      scheduled_for: parsed.data.scheduledFor,
      is_recurring: parsed.data.isRecurring ?? false,
      recurrence_rule: parsed.data.recurrenceRule ?? null,
    })
    .select('id')
    .single()

  if (error) throw error
  revalidatePath('/admin/scheduled-posts')
  return data
}

export async function cancelScheduledPost(postId: string) {
  const parsed = z.object({ postId: z.string().uuid() }).safeParse({ postId })
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, tenantId } = await requireAdmin()

  const { error } = await supabase
    .from('scheduled_posts')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', postId)
    .eq('tenant_id', tenantId)

  if (error) throw error
  revalidatePath('/admin/scheduled-posts')
}

export async function deleteScheduledPost(postId: string) {
  const parsed = z.object({ postId: z.string().uuid() }).safeParse({ postId })
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, tenantId } = await requireAdmin()

  const { error } = await supabase
    .from('scheduled_posts')
    .delete()
    .eq('id', postId)
    .eq('tenant_id', tenantId)
    .eq('status', 'pending')

  if (error) throw error
  revalidatePath('/admin/scheduled-posts')
}

export async function seedContentLibrary() {
  const rl = await rateLimitAction('seedContentLibrary')
  if (!rl.success) throw new Error(rl.error ?? 'Too many requests')

  const { supabase, user, tenantId } = await requireAdmin()

  // Import content library dynamically to keep it server-only
  const { CONTENT_LIBRARY } = await import('@/lib/scheduled-posts/content-library')

  // Schedule one post per day starting tomorrow, cycling through the library
  const posts = CONTENT_LIBRARY.map((template, index) => {
    const scheduledDate = new Date()
    scheduledDate.setDate(scheduledDate.getDate() + index + 1)
    scheduledDate.setHours(9, 0, 0, 0) // 9 AM local

    return {
      tenant_id: tenantId,
      created_by: user.id,
      title: template.title,
      content: template.content,
      category: template.category,
      scheduled_for: scheduledDate.toISOString(),
      status: 'pending' as const,
      is_recurring: false,
    }
  })

  const { error } = await supabase.from('scheduled_posts').insert(posts)
  if (error) throw error

  revalidatePath('/admin/scheduled-posts')
  return { count: posts.length }
}
