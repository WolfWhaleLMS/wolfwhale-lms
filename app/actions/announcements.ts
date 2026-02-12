'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { sanitizeText, sanitizeRichText } from '@/lib/sanitize'
import { rateLimitAction } from '@/lib/rate-limit-action'
import { getActionContext } from '@/lib/actions/context'

export async function getAnnouncements(courseId?: string) {
  const parsed = z.object({ courseId: z.string().uuid().optional() }).safeParse({ courseId })
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, tenantId } = await getActionContext()

  let query = supabase
    .from('announcements')
    .select('*, profiles:created_by(full_name, avatar_url)')
    .eq('tenant_id', tenantId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (courseId) {
    query = query.eq('course_id', courseId)
  }

  query = query.limit(100)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function createAnnouncement(formData: {
  title: string
  content: string
  courseId?: string
  pinned?: boolean
}) {
  const rl = await rateLimitAction('createAnnouncement')
  if (!rl.success) throw new Error(rl.error ?? 'Too many requests')

  const createAnnouncementSchema = z.object({
    title: z.string().min(1).max(255),
    content: z.string().min(1).max(10000),
    courseId: z.string().uuid().optional(),
    pinned: z.boolean().optional(),
  })
  const parsed = createAnnouncementSchema.safeParse(formData)
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  // Sanitize user-generated text content
  const sanitizedTitle = sanitizeText(parsed.data.title)
  const sanitizedContent = sanitizeRichText(parsed.data.content)

  const { supabase, user, tenantId } = await getActionContext()

  // Only teachers, admins, and super_admins can create announcements
  const { data: membership } = await supabase
    .from('tenant_memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .eq('status', 'active')
    .single()

  if (!membership || !['teacher', 'admin', 'super_admin'].includes(membership.role)) {
    throw new Error('Not authorized - only teachers and admins can create announcements')
  }

  const { data, error } = await supabase
    .from('announcements')
    .insert({
      tenant_id: tenantId,
      created_by: user.id,
      course_id: parsed.data.courseId || null,
      title: sanitizedTitle,
      content: sanitizedContent,
      is_pinned: parsed.data.pinned || false,
    })
    .select('id')
    .single()

  if (error) throw error
  revalidatePath('/announcements')
  return data
}

export async function deleteAnnouncement(announcementId: string) {
  const parsed = z.object({ announcementId: z.string().uuid() }).safeParse({ announcementId })
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, user } = await getActionContext()

  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', announcementId)
    .eq('created_by', user.id)

  if (error) throw error
  revalidatePath('/announcements')
}

export async function togglePinAnnouncement(announcementId: string, pinned: boolean) {
  const parsed = z.object({
    announcementId: z.string().uuid(),
    pinned: z.boolean(),
  }).safeParse({ announcementId, pinned })
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, user, tenantId } = await getActionContext()

  // Fetch the announcement to check ownership and tenant
  const { data: announcement } = await supabase
    .from('announcements')
    .select('created_by, tenant_id')
    .eq('id', announcementId)
    .eq('tenant_id', tenantId)
    .single()

  if (!announcement) {
    throw new Error('Announcement not found')
  }

  // Allow if user is the author, or an admin/super_admin
  if (announcement.created_by !== user.id) {
    const { data: membership } = await supabase
      .from('tenant_memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .single()

    if (!membership || !['admin', 'super_admin'].includes(membership.role)) {
      throw new Error('Not authorized - only the author or admins can pin/unpin announcements')
    }
  }

  const { error } = await supabase
    .from('announcements')
    .update({ is_pinned: pinned })
    .eq('id', announcementId)
    .eq('tenant_id', tenantId)

  if (error) throw error
  revalidatePath('/announcements')
}
