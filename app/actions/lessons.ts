'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { sanitizeText, sanitizeRichText } from '@/lib/sanitize'
import { rateLimitAction } from '@/lib/rate-limit-action'
import { getActionContext, requireTeacher } from '@/lib/actions/context'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sanitizeLessonContent(content: unknown[]): unknown[] {
  if (!Array.isArray(content)) return []
  return content.map((block) => {
    if (!block || typeof block !== 'object') return block
    const sanitized = { ...(block as Record<string, unknown>) }
    // Sanitize any HTML content
    if (typeof sanitized.content === 'string') {
      sanitized.content = sanitizeRichText(sanitized.content)
    }
    // Sanitize URLs
    if (typeof sanitized.url === 'string') {
      sanitized.url = sanitizeUrl(sanitized.url)
    }
    if (typeof sanitized.src === 'string') {
      sanitized.src = sanitizeUrl(sanitized.src)
    }
    if (typeof sanitized.href === 'string') {
      sanitized.href = sanitizeUrl(sanitized.href)
    }
    return sanitized
  })
}

function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url, 'https://wolfwhale.ca')
    if (!['http:', 'https:'].includes(parsed.protocol)) return ''
    return url
  } catch {
    return ''
  }
}

// ---------------------------------------------------------------------------
// getLessons - get all lessons for a course, ordered by order_index
// ---------------------------------------------------------------------------

export async function getLessons(courseId: string) {
  const parsed = z.object({ courseId: z.string().uuid() }).safeParse({ courseId })
  if (!parsed.success) return []

  const { supabase, tenantId } = await getActionContext()

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select(`
      id,
      course_id,
      title,
      description,
      order_index,
      duration_minutes,
      learning_objectives,
      status,
      published_at,
      created_at,
      updated_at
    `)
    .eq('course_id', courseId)
    .eq('tenant_id', tenantId)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching lessons:', error)
    return []
  }

  return lessons || []
}

// ---------------------------------------------------------------------------
// getLesson - get a single lesson with full content and attachments
// ---------------------------------------------------------------------------

export async function getLesson(lessonId: string) {
  const parsed = z.object({ lessonId: z.string().uuid() }).safeParse({ lessonId })
  if (!parsed.success) return null

  const { supabase, user, tenantId } = await getActionContext()

  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .eq('tenant_id', tenantId)
    .single()

  if (error || !lesson) {
    console.error('Error fetching lesson:', error)
    return null
  }

  // Get attachments and progress in parallel (both independent)
  const [{ data: attachments }, { data: progress }] = await Promise.all([
    supabase
      .from('lesson_attachments')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index', { ascending: true }),
    supabase
      .from('lesson_progress')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  return {
    ...lesson,
    attachments: attachments || [],
    progress: progress || null,
  }
}

// ---------------------------------------------------------------------------
// getLessonWithNavigation - get lesson plus previous/next
// ---------------------------------------------------------------------------

export async function getLessonWithNavigation(lessonId: string, courseId: string) {
  const parsed = z.object({
    lessonId: z.string().uuid(),
    courseId: z.string().uuid(),
  }).safeParse({ lessonId, courseId })
  if (!parsed.success) return null

  const { supabase, user, tenantId } = await getActionContext()

  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .eq('tenant_id', tenantId)
    .single()

  if (error || !lesson) {
    return null
  }

  // Fetch navigation list, attachments, and progress in parallel (all independent)
  const [{ data: allLessons }, { data: attachments }, { data: progress }] = await Promise.all([
    supabase
      .from('lessons')
      .select('id, title, order_index, status')
      .eq('course_id', courseId)
      .eq('tenant_id', tenantId)
      .order('order_index', { ascending: true }),
    supabase
      .from('lesson_attachments')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index', { ascending: true }),
    supabase
      .from('lesson_progress')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  const lessonList = allLessons || []
  const currentIndex = lessonList.findIndex((l) => l.id === lessonId)

  return {
    ...lesson,
    attachments: attachments || [],
    progress: progress || null,
    previous:
      currentIndex > 0
        ? { id: lessonList[currentIndex - 1].id, title: lessonList[currentIndex - 1].title }
        : null,
    next:
      currentIndex < lessonList.length - 1
        ? { id: lessonList[currentIndex + 1].id, title: lessonList[currentIndex + 1].title }
        : null,
  }
}

// ---------------------------------------------------------------------------
// createLesson
// ---------------------------------------------------------------------------

interface CreateLessonInput {
  title: string
  description?: string
  content?: unknown[]
  learning_objectives?: string[]
  duration_minutes?: number
  status?: string
  module_id?: string
}

export async function createLesson(courseId: string, input: CreateLessonInput) {
  const createLessonSchema = z.object({
    courseId: z.string().uuid(),
    title: z.string().min(1).max(255),
    description: z.string().max(5000).optional(),
    content: z.unknown().optional(),
    learning_objectives: z.array(z.string().max(500)).max(20).optional(),
    duration_minutes: z.number().min(0).max(600).optional(),
    status: z.string().max(50).optional(),
    module_id: z.string().uuid().optional(),
  })
  const parsed = createLessonSchema.safeParse({ courseId, ...input })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const rl = await rateLimitAction('createLesson')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const { supabase, user, tenantId } = await requireTeacher()

  // Verify course ownership
  const { data: course } = await supabase
    .from('courses')
    .select('created_by')
    .eq('id', courseId)
    .eq('tenant_id', tenantId)
    .single()

  if (!course || course.created_by !== user.id) {
    return { error: 'Not authorized to add lessons to this course' }
  }

  // Get next order_index
  const { data: existingLessons } = await supabase
    .from('lessons')
    .select('order_index')
    .eq('course_id', courseId)
    .order('order_index', { ascending: false })
    .limit(1)

  const nextOrderIndex =
    existingLessons && existingLessons.length > 0
      ? existingLessons[0].order_index + 1
      : 0

  // If module_id is provided, verify it belongs to the same course
  if (input.module_id) {
    const { data: mod } = await supabase
      .from('modules')
      .select('course_id')
      .eq('id', input.module_id)
      .single()

    if (!mod || mod.course_id !== courseId) {
      return { error: 'Module does not belong to this course' }
    }
  }

  const { data: lesson, error } = await supabase
    .from('lessons')
    .insert({
      tenant_id: tenantId,
      course_id: courseId,
      created_by: user.id,
      title: sanitizeText(input.title),
      description: input.description ? sanitizeText(input.description) : null,
      content: sanitizeLessonContent(input.content || []),
      learning_objectives: input.learning_objectives || [],
      duration_minutes: input.duration_minutes || null,
      order_index: nextOrderIndex,
      status: input.status || 'draft',
      module_id: input.module_id || null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating lesson:', error)
    return { error: 'Failed to create lesson' }
  }

  revalidatePath(`/teacher/courses/${courseId}`)
  return { success: true, lessonId: lesson.id }
}

// ---------------------------------------------------------------------------
// updateLesson
// ---------------------------------------------------------------------------

export async function updateLesson(
  lessonId: string,
  input: Partial<CreateLessonInput>
) {
  const updateLessonSchema = z.object({
    lessonId: z.string().uuid(),
    title: z.string().min(1).max(255).optional(),
    description: z.string().max(5000).optional(),
    content: z.unknown().optional(),
    learning_objectives: z.array(z.string().max(500)).max(20).optional(),
    duration_minutes: z.number().min(0).max(600).optional(),
    status: z.string().max(50).optional(),
  })
  const parsed = updateLessonSchema.safeParse({ lessonId, ...input })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const rl = await rateLimitAction('updateLesson')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const { supabase, user, tenantId } = await requireTeacher()

  // Verify lesson ownership
  const { data: lesson } = await supabase
    .from('lessons')
    .select('course_id, created_by')
    .eq('id', lessonId)
    .eq('tenant_id', tenantId)
    .single()

  if (!lesson || lesson.created_by !== user.id) {
    return { error: 'Not authorized to edit this lesson' }
  }

  const updateData: Record<string, unknown> = {}
  if (input.title !== undefined) updateData.title = sanitizeText(input.title)
  if (input.description !== undefined) updateData.description = input.description ? sanitizeText(input.description) : null
  if (input.content !== undefined) updateData.content = sanitizeLessonContent(input.content as unknown[])
  if (input.learning_objectives !== undefined)
    updateData.learning_objectives = input.learning_objectives
  if (input.duration_minutes !== undefined)
    updateData.duration_minutes = input.duration_minutes
  if (input.status !== undefined) {
    updateData.status = input.status
    if (input.status === 'published') {
      updateData.published_at = new Date().toISOString()
    }
  }

  const { error } = await supabase
    .from('lessons')
    .update(updateData)
    .eq('id', lessonId)

  if (error) {
    console.error('Error updating lesson:', error)
    return { error: 'Failed to update lesson' }
  }

  revalidatePath(`/teacher/courses/${lesson.course_id}`)
  return { success: true }
}

// ---------------------------------------------------------------------------
// deleteLesson
// ---------------------------------------------------------------------------

export async function deleteLesson(lessonId: string) {
  const parsed = z.object({ lessonId: z.string().uuid() }).safeParse({ lessonId })
  if (!parsed.success) return { error: 'Invalid input' }

  const rl = await rateLimitAction('deleteLesson')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const { supabase, user, tenantId } = await requireTeacher()

  const { data: lesson } = await supabase
    .from('lessons')
    .select('course_id, created_by')
    .eq('id', lessonId)
    .eq('tenant_id', tenantId)
    .single()

  if (!lesson || lesson.created_by !== user.id) {
    return { error: 'Not authorized to delete this lesson' }
  }

  const { error } = await supabase.from('lessons').delete().eq('id', lessonId)

  if (error) {
    console.error('Error deleting lesson:', error)
    return { error: 'Failed to delete lesson' }
  }

  revalidatePath(`/teacher/courses/${lesson.course_id}`)
  return { success: true }
}

// ---------------------------------------------------------------------------
// reorderLessons
// ---------------------------------------------------------------------------

export async function reorderLessons(courseId: string, lessonIds: string[]) {
  const parsed = z.object({
    courseId: z.string().uuid(),
    lessonIds: z.array(z.string().uuid()).max(500),
  }).safeParse({ courseId, lessonIds })
  if (!parsed.success) return { error: 'Invalid input' }

  const rl = await rateLimitAction('reorderLessons')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const { supabase, user, tenantId } = await requireTeacher()

  // Verify course ownership
  const { data: course } = await supabase
    .from('courses')
    .select('created_by')
    .eq('id', courseId)
    .eq('tenant_id', tenantId)
    .single()

  if (!course || course.created_by !== user.id) {
    return { error: 'Not authorized' }
  }

  // Batch reorder via single RPC call instead of N individual UPDATEs
  const { error: rpcError } = await supabase.rpc('reorder_items', {
    p_table_name: 'lessons',
    p_parent_column: 'course_id',
    p_parent_id: courseId,
    p_item_ids: lessonIds,
  })

  if (rpcError) {
    console.error('Error reordering lessons:', rpcError)
    return { error: 'Failed to reorder lessons' }
  }

  revalidatePath(`/teacher/courses/${courseId}`)
  return { success: true }
}

// ---------------------------------------------------------------------------
// Attachment management
// ---------------------------------------------------------------------------

export async function addLessonAttachment(
  lessonId: string,
  attachment: {
    fileName: string
    filePath: string
    fileType: string
    fileSize: number
    displayName?: string
  }
) {
  const parsed = z.object({
    lessonId: z.string().uuid(),
    fileName: z.string().min(1).max(500),
    filePath: z.string().min(1).max(2000),
    fileType: z.string().min(1).max(100),
    fileSize: z.number().min(0),
    displayName: z.string().max(500).optional(),
  }).safeParse({ lessonId, ...attachment })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const rl = await rateLimitAction('addLessonAttachment')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const { supabase, user, tenantId } = await requireTeacher()

  // Verify lesson ownership
  const { data: lesson } = await supabase
    .from('lessons')
    .select('course_id, created_by')
    .eq('id', lessonId)
    .eq('tenant_id', tenantId)
    .single()

  if (!lesson || lesson.created_by !== user.id) {
    return { error: 'Not authorized to modify attachments for this lesson' }
  }

  // Get next order_index for attachments
  const { data: existing } = await supabase
    .from('lesson_attachments')
    .select('order_index')
    .eq('lesson_id', lessonId)
    .order('order_index', { ascending: false })
    .limit(1)

  const nextOrderIndex =
    existing && existing.length > 0 ? existing[0].order_index + 1 : 0

  const { data: record, error } = await supabase
    .from('lesson_attachments')
    .insert({
      tenant_id: tenantId,
      lesson_id: lessonId,
      file_name: attachment.fileName,
      file_path: attachment.filePath,
      file_type: attachment.fileType,
      file_size: attachment.fileSize,
      display_name: attachment.displayName || attachment.fileName,
      order_index: nextOrderIndex,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error adding attachment:', error)
    return { error: 'Failed to add attachment' }
  }

  revalidatePath(`/teacher/courses`)
  return { success: true, attachmentId: record.id }
}

export async function deleteLessonAttachment(attachmentId: string) {
  const parsed = z.object({ attachmentId: z.string().uuid() }).safeParse({ attachmentId })
  if (!parsed.success) return { error: 'Invalid input' }

  const rl = await rateLimitAction('deleteLessonAttachment')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const { supabase, user, tenantId } = await requireTeacher()

  // Verify ownership via the attachment -> lesson -> teacher chain
  const { data: attachment } = await supabase
    .from('lesson_attachments')
    .select('id, lesson_id, file_path')
    .eq('id', attachmentId)
    .single()

  if (!attachment) {
    return { error: 'Attachment not found' }
  }

  const { data: lesson } = await supabase
    .from('lessons')
    .select('created_by')
    .eq('id', attachment.lesson_id)
    .eq('tenant_id', tenantId)
    .single()

  if (!lesson || lesson.created_by !== user.id) {
    return { error: 'Not authorized to delete this attachment' }
  }

  const { error } = await supabase
    .from('lesson_attachments')
    .delete()
    .eq('id', attachmentId)

  if (error) {
    console.error('Error deleting attachment:', error)
    return { error: 'Failed to delete attachment' }
  }

  revalidatePath(`/teacher/courses`)
  return { success: true }
}

export async function getLessonAttachments(lessonId: string) {
  const parsed = z.object({ lessonId: z.string().uuid() }).safeParse({ lessonId })
  if (!parsed.success) return []

  const { supabase, tenantId } = await getActionContext()

  const { data: attachments, error } = await supabase
    .from('lesson_attachments')
    .select('*')
    .eq('lesson_id', lessonId)
    .eq('tenant_id', tenantId)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching attachments:', error)
    return []
  }

  return attachments || []
}

// ---------------------------------------------------------------------------
// trackProgress - student marks lesson progress
// ---------------------------------------------------------------------------

export async function trackProgress(
  lessonId: string,
  status: 'in_progress' | 'completed',
  timeSpentSeconds?: number
) {
  const parsed = z.object({
    lessonId: z.string().uuid(),
    status: z.enum(['in_progress', 'completed']),
    timeSpentSeconds: z.number().min(0).max(86400).optional(),
  }).safeParse({ lessonId, status, timeSpentSeconds })
  if (!parsed.success) return { error: 'Invalid input' }

  const rl = await rateLimitAction('trackProgress')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const { supabase, user, tenantId } = await getActionContext()

  // Check if progress record exists
  const { data: existing } = await supabase
    .from('lesson_progress')
    .select('id, time_spent_seconds, status')
    .eq('lesson_id', lessonId)
    .eq('user_id', user.id)
    .maybeSingle()

  const now = new Date().toISOString()

  if (existing) {
    // Update existing progress
    const updateData: Record<string, unknown> = {
      status,
      last_accessed_at: now,
    }

    if (status === 'completed') {
      updateData.completed_at = now
      updateData.progress_percentage = 100
    } else {
      updateData.progress_percentage = 50
    }

    if (timeSpentSeconds) {
      updateData.time_spent_seconds =
        (existing.time_spent_seconds || 0) + timeSpentSeconds
    }

    const { error } = await supabase
      .from('lesson_progress')
      .update(updateData)
      .eq('id', existing.id)

    if (error) {
      console.error('Error updating progress:', error)
      return { error: 'Failed to update progress' }
    }
  } else {
    // Insert new progress
    const { error } = await supabase.from('lesson_progress').insert({
      tenant_id: tenantId,
      lesson_id: lessonId,
      user_id: user.id,
      status,
      progress_percentage: status === 'completed' ? 100 : 50,
      started_at: now,
      completed_at: status === 'completed' ? now : null,
      time_spent_seconds: timeSpentSeconds || 0,
      last_accessed_at: now,
    })

    if (error) {
      console.error('Error creating progress:', error)
      return { error: 'Failed to track progress' }
    }
  }

  revalidatePath('/student/courses')
  return { success: true }
}
