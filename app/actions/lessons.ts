'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getAuthUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return { supabase, user }
}

async function getTenantId(): Promise<string> {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) throw new Error('No tenant context')
  return tenantId
}

async function requireTeacher() {
  const { supabase, user } = await getAuthUser()
  const tenantId = await getTenantId()

  const { data: membership } = await supabase
    .from('tenant_memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .eq('status', 'active')
    .single()

  if (!membership || !['teacher', 'admin', 'super_admin'].includes(membership.role)) {
    throw new Error('Not authorized - teacher role required')
  }

  return { supabase, user, tenantId, role: membership.role }
}

// ---------------------------------------------------------------------------
// getLessons - get all lessons for a course, ordered by order_index
// ---------------------------------------------------------------------------

export async function getLessons(courseId: string) {
  const { supabase } = await getAuthUser()

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
  const { supabase, user } = await getAuthUser()

  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single()

  if (error || !lesson) {
    console.error('Error fetching lesson:', error)
    return null
  }

  // Get attachments
  const { data: attachments } = await supabase
    .from('lesson_attachments')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_index', { ascending: true })

  // Get progress for this user
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('lesson_id', lessonId)
    .eq('user_id', user.id)
    .maybeSingle()

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
  const { supabase, user } = await getAuthUser()

  // Get the lesson itself
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single()

  if (error || !lesson) {
    return null
  }

  // Get all lessons in this course for navigation
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, title, order_index, status')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })

  const lessonList = allLessons || []
  const currentIndex = lessonList.findIndex((l) => l.id === lessonId)

  // Get attachments
  const { data: attachments } = await supabase
    .from('lesson_attachments')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_index', { ascending: true })

  // Get progress
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('lesson_id', lessonId)
    .eq('user_id', user.id)
    .maybeSingle()

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
  content?: any
  learning_objectives?: string[]
  duration_minutes?: number
  status?: string
}

export async function createLesson(courseId: string, input: CreateLessonInput) {
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

  const { data: lesson, error } = await supabase
    .from('lessons')
    .insert({
      tenant_id: tenantId,
      course_id: courseId,
      created_by: user.id,
      title: input.title,
      description: input.description || null,
      content: input.content || [],
      learning_objectives: input.learning_objectives || [],
      duration_minutes: input.duration_minutes || null,
      order_index: nextOrderIndex,
      status: input.status || 'draft',
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
  if (input.title !== undefined) updateData.title = input.title
  if (input.description !== undefined) updateData.description = input.description
  if (input.content !== undefined) updateData.content = input.content
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

  // Update order_index for each lesson
  const updates = lessonIds.map((lessonId, index) =>
    supabase
      .from('lessons')
      .update({ order_index: index })
      .eq('id', lessonId)
      .eq('course_id', courseId)
  )

  await Promise.all(updates)

  revalidatePath(`/teacher/courses/${courseId}`)
  return { success: true }
}

// ---------------------------------------------------------------------------
// trackProgress - student marks lesson progress
// ---------------------------------------------------------------------------

export async function trackProgress(
  lessonId: string,
  status: 'in_progress' | 'completed',
  timeSpentSeconds?: number
) {
  const { supabase, user } = await getAuthUser()
  const tenantId = await getTenantId()

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
