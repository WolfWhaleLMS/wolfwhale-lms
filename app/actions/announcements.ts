'use server'

import { z } from 'zod'
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

export async function getAnnouncements(courseId?: string) {
  const parsed = z.object({ courseId: z.string().uuid().optional() }).safeParse({ courseId })
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, tenantId } = await getContext()

  let query = supabase
    .from('announcements')
    .select('*, profiles:author_id(full_name, avatar_url)')
    .eq('tenant_id', tenantId)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (courseId) {
    query = query.eq('course_id', courseId)
  }

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
  const createAnnouncementSchema = z.object({
    title: z.string().min(1).max(255),
    content: z.string().min(1).max(10000),
    courseId: z.string().uuid().optional(),
    pinned: z.boolean().optional(),
  })
  const parsed = createAnnouncementSchema.safeParse(formData)
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, user, tenantId } = await getContext()

  const { data, error } = await supabase
    .from('announcements')
    .insert({
      tenant_id: tenantId,
      author_id: user.id,
      course_id: parsed.data.courseId || null,
      title: parsed.data.title,
      content: parsed.data.content,
      pinned: parsed.data.pinned || false,
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

  const { supabase, user } = await getContext()

  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', announcementId)
    .eq('author_id', user.id)

  if (error) throw error
  revalidatePath('/announcements')
}

export async function togglePinAnnouncement(announcementId: string, pinned: boolean) {
  const parsed = z.object({
    announcementId: z.string().uuid(),
    pinned: z.boolean(),
  }).safeParse({ announcementId, pinned })
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase } = await getContext()

  const { error } = await supabase
    .from('announcements')
    .update({ pinned })
    .eq('id', announcementId)

  if (error) throw error
  revalidatePath('/announcements')
}
