'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { sanitizeText } from '@/lib/sanitize'
import { rateLimitAction } from '@/lib/rate-limit-action'

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
// getModules - get all modules for a course, ordered by order_index
// ---------------------------------------------------------------------------

export async function getModules(courseId: string) {
  const parsed = z.object({ courseId: z.string().uuid() }).safeParse({ courseId })
  if (!parsed.success) return []

  const { supabase } = await getAuthUser()

  // Get modules with lesson count in a single query
  const { data: modules, error } = await supabase
    .from('modules')
    .select(`
      id,
      course_id,
      title,
      description,
      order_index,
      status,
      created_at,
      updated_at,
      lessons(count)
    `)
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching modules:', error)
    return []
  }

  return (modules || []).map((m) => ({
    ...m,
    lesson_count: (m.lessons as unknown as { count: number }[])?.[0]?.count || 0,
    lessons: undefined,
  }))
}

// ---------------------------------------------------------------------------
// getModulesWithLessons - get modules with their lessons for course detail page
// ---------------------------------------------------------------------------

export async function getModulesWithLessons(courseId: string) {
  const parsed = z.object({ courseId: z.string().uuid() }).safeParse({ courseId })
  if (!parsed.success) return { modules: [], lessons: [] }

  const { supabase } = await getAuthUser()

  // Get all modules for this course
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('id, title, description, order_index, status, created_at, updated_at')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })

  if (modulesError) {
    console.error('Error fetching modules:', modulesError)
    return { modules: [], lessons: [] }
  }

  // Get all lessons for this course
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select(`
      id,
      course_id,
      module_id,
      title,
      description,
      order_index,
      duration_minutes,
      status,
      published_at,
      created_at,
      updated_at
    `)
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })

  if (lessonsError) {
    console.error('Error fetching lessons:', lessonsError)
    return { modules: modules || [], lessons: [] }
  }

  return {
    modules: modules || [],
    lessons: lessons || [],
  }
}

// ---------------------------------------------------------------------------
// createModule
// ---------------------------------------------------------------------------

interface CreateModuleInput {
  title: string
  description?: string
  status?: string
}

export async function createModule(courseId: string, input: CreateModuleInput) {
  const createModuleSchema = z.object({
    courseId: z.string().uuid(),
    title: z.string().min(1).max(255),
    description: z.string().max(5000).optional(),
    status: z.string().max(50).optional(),
  })
  const parsed = createModuleSchema.safeParse({ courseId, ...input })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const rl = await rateLimitAction('createModule')
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
    return { error: 'Not authorized to add modules to this course' }
  }

  // Get next order_index
  const { data: existingModules } = await supabase
    .from('modules')
    .select('order_index')
    .eq('course_id', courseId)
    .order('order_index', { ascending: false })
    .limit(1)

  const nextOrderIndex =
    existingModules && existingModules.length > 0
      ? existingModules[0].order_index + 1
      : 0

  const { data: module, error } = await supabase
    .from('modules')
    .insert({
      tenant_id: tenantId,
      course_id: courseId,
      created_by: user.id,
      title: sanitizeText(input.title),
      description: input.description ? sanitizeText(input.description) : null,
      order_index: nextOrderIndex,
      status: input.status || 'draft',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating module:', error)
    return { error: 'Failed to create module' }
  }

  revalidatePath(`/teacher/courses/${courseId}`)
  return { success: true, moduleId: module.id }
}

// ---------------------------------------------------------------------------
// updateModule
// ---------------------------------------------------------------------------

export async function updateModule(
  moduleId: string,
  input: Partial<CreateModuleInput>
) {
  const updateModuleSchema = z.object({
    moduleId: z.string().uuid(),
    title: z.string().min(1).max(255).optional(),
    description: z.string().max(5000).optional(),
    status: z.string().max(50).optional(),
  })
  const parsed = updateModuleSchema.safeParse({ moduleId, ...input })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const rl = await rateLimitAction('updateModule')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const { supabase, user, tenantId } = await requireTeacher()

  // Verify module ownership
  const { data: module } = await supabase
    .from('modules')
    .select('course_id, created_by')
    .eq('id', moduleId)
    .eq('tenant_id', tenantId)
    .single()

  if (!module || module.created_by !== user.id) {
    return { error: 'Not authorized to edit this module' }
  }

  const updateData: Record<string, unknown> = {}
  if (input.title !== undefined) updateData.title = sanitizeText(input.title)
  if (input.description !== undefined) updateData.description = input.description ? sanitizeText(input.description) : null
  if (input.status !== undefined) updateData.status = input.status

  const { error } = await supabase
    .from('modules')
    .update(updateData)
    .eq('id', moduleId)

  if (error) {
    console.error('Error updating module:', error)
    return { error: 'Failed to update module' }
  }

  revalidatePath(`/teacher/courses/${module.course_id}`)
  return { success: true }
}

// ---------------------------------------------------------------------------
// deleteModule
// ---------------------------------------------------------------------------

export async function deleteModule(moduleId: string) {
  const parsed = z.object({ moduleId: z.string().uuid() }).safeParse({ moduleId })
  if (!parsed.success) return { error: 'Invalid input' }

  const rl = await rateLimitAction('deleteModule')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const { supabase, user, tenantId } = await requireTeacher()

  const { data: module } = await supabase
    .from('modules')
    .select('course_id, created_by')
    .eq('id', moduleId)
    .eq('tenant_id', tenantId)
    .single()

  if (!module || module.created_by !== user.id) {
    return { error: 'Not authorized to delete this module' }
  }

  // Delete the module (lessons' module_id will be set to NULL via ON DELETE SET NULL)
  const { error } = await supabase.from('modules').delete().eq('id', moduleId)

  if (error) {
    console.error('Error deleting module:', error)
    return { error: 'Failed to delete module' }
  }

  revalidatePath(`/teacher/courses/${module.course_id}`)
  return { success: true }
}

// ---------------------------------------------------------------------------
// reorderModules
// ---------------------------------------------------------------------------

export async function reorderModules(courseId: string, moduleIds: string[]) {
  const parsed = z.object({
    courseId: z.string().uuid(),
    moduleIds: z.array(z.string().uuid()).max(500),
  }).safeParse({ courseId, moduleIds })
  if (!parsed.success) return { error: 'Invalid input' }

  const rl = await rateLimitAction('reorderModules')
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
    p_table_name: 'modules',
    p_parent_column: 'course_id',
    p_parent_id: courseId,
    p_item_ids: moduleIds,
  })

  if (rpcError) {
    console.error('Error reordering modules:', rpcError)
    return { error: 'Failed to reorder modules' }
  }

  revalidatePath(`/teacher/courses/${courseId}`)
  return { success: true }
}

// ---------------------------------------------------------------------------
// assignLessonToModule - assign or unassign a lesson to a module
// ---------------------------------------------------------------------------

export async function assignLessonToModule(
  lessonId: string,
  moduleId: string | null
) {
  const parsed = z.object({
    lessonId: z.string().uuid(),
    moduleId: z.string().uuid().nullable(),
  }).safeParse({ lessonId, moduleId })
  if (!parsed.success) return { error: 'Invalid input' }

  const rl = await rateLimitAction('assignLessonToModule')
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
    return { error: 'Not authorized to modify this lesson' }
  }

  // If moduleId is provided, verify it belongs to the same course
  if (moduleId) {
    const { data: module } = await supabase
      .from('modules')
      .select('course_id')
      .eq('id', moduleId)
      .eq('tenant_id', tenantId)
      .single()

    if (!module || module.course_id !== lesson.course_id) {
      return { error: 'Module does not belong to the same course' }
    }
  }

  const { error } = await supabase
    .from('lessons')
    .update({ module_id: moduleId })
    .eq('id', lessonId)

  if (error) {
    console.error('Error assigning lesson to module:', error)
    return { error: 'Failed to assign lesson to module' }
  }

  revalidatePath(`/teacher/courses/${lesson.course_id}`)
  return { success: true }
}
