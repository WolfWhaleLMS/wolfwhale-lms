'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { sanitizeText, sanitizeRichText } from '@/lib/sanitize'
import { rateLimitAction } from '@/lib/rate-limit-action'

// ============================================
// TEACHER: Get assignments for a course
// ============================================
export async function getAssignments(courseId: string) {
  const parsed = z.object({ courseId: z.string().uuid() }).safeParse({ courseId })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) return { error: 'No tenant context' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  let query = supabase
    .from('assignments')
    .select(`
      *,
      submissions:submissions(count)
    `)
    .eq('course_id', courseId)
    .order('due_date', { ascending: true })

  query = query.eq('tenant_id', tenantId)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching assignments:', error)
    return { error: 'Failed to fetch assignments' }
  }

  // Get average scores per assignment
  const assignmentIds = (data || []).map((a) => a.id)
  let averages: Record<string, { avg: number; count: number }> = {}

  if (assignmentIds.length > 0) {
    const { data: grades } = await supabase
      .from('grades')
      .select('assignment_id, points_earned, percentage')
      .in('assignment_id', assignmentIds)

    if (grades) {
      for (const grade of grades) {
        if (!averages[grade.assignment_id]) {
          averages[grade.assignment_id] = { avg: 0, count: 0 }
        }
        averages[grade.assignment_id].count++
        averages[grade.assignment_id].avg += grade.percentage ?? 0
      }
      for (const key of Object.keys(averages)) {
        if (averages[key].count > 0) {
          averages[key].avg = Math.round(averages[key].avg / averages[key].count)
        }
      }
    }
  }

  const assignments = (data || []).map((a) => ({
    ...a,
    submissionCount: a.submissions?.[0]?.count ?? 0,
    averageScore: averages[a.id]?.avg ?? null,
    gradedCount: averages[a.id]?.count ?? 0,
  }))

  return { data: assignments }
}

// ============================================
// Get single assignment
// ============================================
export async function getAssignment(assignmentId: string) {
  const parsed = z.object({ assignmentId: z.string().uuid() }).safeParse({ assignmentId })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) return { error: 'No tenant context' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  let query = supabase
    .from('assignments')
    .select(`
      *,
      courses:courses(id, name, created_by)
    `)
    .eq('id', assignmentId)

  query = query.eq('tenant_id', tenantId)

  const { data, error } = await query.single()

  if (error) {
    console.error('Error fetching assignment:', error)
    return { error: 'Assignment not found' }
  }

  return { data }
}

// ============================================
// TEACHER: Create assignment
// ============================================
export async function createAssignment(formData: {
  courseId: string
  title: string
  description?: string
  type: string
  dueDate?: string
  pointsPossible: number
  submissionType: string
  latePolicy?: boolean
  questions?: unknown[]
  attachments?: { url: string; fileName: string; fileSize: number; fileType: string }[]
  links?: { url: string; title: string }[]
}) {
  const createAssignmentSchema = z.object({
    courseId: z.string().uuid(),
    title: z.string().min(1).max(255),
    description: z.string().max(5000).optional(),
    type: z.string().min(1).max(50),
    dueDate: z.string().max(100).optional(),
    pointsPossible: z.number().min(0).max(1000),
    submissionType: z.string().min(1).max(50),
    latePolicy: z.boolean().optional(),
    questions: z.array(z.unknown()).optional(),
    attachments: z.array(z.object({
      url: z.string().max(2000),
      fileName: z.string().max(500),
      fileSize: z.number().min(0),
      fileType: z.string().max(100),
    })).optional(),
    links: z.array(z.object({
      url: z.string().max(2000),
      title: z.string().max(500),
    })).optional(),
  })
  const parsed = createAssignmentSchema.safeParse(formData)
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const rl = await rateLimitAction('createAssignment')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  // Sanitize user-generated text content
  const sanitizedTitle = sanitizeText(parsed.data.title)
  const sanitizedDescription = parsed.data.description ? sanitizeRichText(parsed.data.description) : null

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) return { error: 'No tenant context' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify the user is the course teacher
  const { data: course } = await supabase
    .from('courses')
    .select('created_by')
    .eq('id', parsed.data.courseId)
    .single()

  if (!course || course.created_by !== user.id) {
    return { error: 'Not authorized to create assignments for this course' }
  }

  const insertData: Record<string, unknown> = {
    course_id: parsed.data.courseId,
    title: sanitizedTitle,
    description: sanitizedDescription,
    type: parsed.data.type,
    due_date: parsed.data.dueDate || null,
    max_points: parsed.data.pointsPossible,
    submission_type: parsed.data.submissionType,
    allow_late_submission: parsed.data.latePolicy ?? false,
    status: 'assigned',
    questions: parsed.data.questions || [],
  }

  // Build combined attachments array (files + links)
  const combinedAttachments = [
    ...(parsed.data.attachments || []).map((a) => ({ ...a, type: 'file' as const })),
    ...(parsed.data.links || []).map((l) => ({ ...l, type: 'link' as const })),
  ]
  if (combinedAttachments.length > 0) {
    insertData.attachments = JSON.stringify(combinedAttachments)
  }

  insertData.tenant_id = tenantId

  const { data, error } = await supabase
    .from('assignments')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error('Error creating assignment:', error)
    return { error: 'Failed to create assignment' }
  }

  revalidatePath(`/teacher/courses/${parsed.data.courseId}/assignments`)
  revalidatePath(`/teacher/courses/${parsed.data.courseId}`)
  return { success: true, data }
}

// ============================================
// TEACHER: Update assignment
// ============================================
export async function updateAssignment(
  assignmentId: string,
  formData: {
    title?: string
    description?: string
    type?: string
    dueDate?: string
    pointsPossible?: number
    submissionType?: string
    latePolicy?: boolean
    status?: string
    attachments?: { url: string; fileName: string; fileSize: number; fileType: string }[]
  }
) {
  const updateAssignmentSchema = z.object({
    assignmentId: z.string().uuid(),
    title: z.string().min(1).max(255).optional(),
    description: z.string().max(5000).optional(),
    type: z.string().min(1).max(50).optional(),
    dueDate: z.string().max(100).optional(),
    pointsPossible: z.number().min(0).max(1000).optional(),
    submissionType: z.string().min(1).max(50).optional(),
    latePolicy: z.boolean().optional(),
    status: z.string().min(1).max(50).optional(),
    attachments: z.array(z.object({
      url: z.string().max(2000),
      fileName: z.string().max(500),
      fileSize: z.number().min(0),
      fileType: z.string().max(100),
    })).optional(),
  })
  const parsed = updateAssignmentSchema.safeParse({ assignmentId, ...formData })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const rl = await rateLimitAction('updateAssignment')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  let assignmentLookup = supabase
    .from('assignments')
    .select('course_id, courses:courses(created_by)')
    .eq('id', assignmentId)

  if (tenantId) {
    assignmentLookup = assignmentLookup.eq('tenant_id', tenantId)
  }

  const { data: assignment } = await assignmentLookup.single()

  if (!assignment) return { error: 'Assignment not found' }

  const courseData = assignment.courses as unknown as { created_by: string }
  if (courseData?.created_by !== user.id) {
    return { error: 'Not authorized to update this assignment' }
  }

  const updateData: Record<string, unknown> = {}
  if (formData.title !== undefined) updateData.title = sanitizeText(formData.title)
  if (formData.description !== undefined) updateData.description = sanitizeRichText(formData.description)
  if (formData.type !== undefined) updateData.type = formData.type
  if (formData.dueDate !== undefined) updateData.due_date = formData.dueDate
  if (formData.pointsPossible !== undefined) updateData.max_points = formData.pointsPossible
  if (formData.submissionType !== undefined) updateData.submission_type = formData.submissionType
  if (formData.latePolicy !== undefined) updateData.allow_late_submission = formData.latePolicy ?? false
  if (formData.status !== undefined) updateData.status = formData.status
  if (formData.attachments !== undefined) updateData.attachments = JSON.stringify(formData.attachments)
  updateData.updated_at = new Date().toISOString()

  const { error } = await supabase
    .from('assignments')
    .update(updateData)
    .eq('id', assignmentId)

  if (error) {
    console.error('Error updating assignment:', error)
    return { error: 'Failed to update assignment' }
  }

  revalidatePath(`/teacher/courses/${assignment.course_id}/assignments`)
  revalidatePath(`/teacher/courses/${assignment.course_id}`)
  return { success: true }
}

// ============================================
// TEACHER: Delete assignment
// ============================================
export async function deleteAssignment(assignmentId: string) {
  const parsed = z.object({ assignmentId: z.string().uuid() }).safeParse({ assignmentId })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const rl = await rateLimitAction('deleteAssignment')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  let deleteAssignmentQuery = supabase
    .from('assignments')
    .select('course_id, courses:courses(created_by)')
    .eq('id', assignmentId)

  if (tenantId) {
    deleteAssignmentQuery = deleteAssignmentQuery.eq('tenant_id', tenantId)
  }

  const { data: assignment } = await deleteAssignmentQuery.single()

  if (!assignment) return { error: 'Assignment not found' }

  const courseData = assignment.courses as unknown as { created_by: string }
  if (courseData?.created_by !== user.id) {
    return { error: 'Not authorized to delete this assignment' }
  }

  const { error } = await supabase
    .from('assignments')
    .delete()
    .eq('id', assignmentId)

  if (error) {
    console.error('Error deleting assignment:', error)
    return { error: 'Failed to delete assignment' }
  }

  revalidatePath(`/teacher/courses/${assignment.course_id}/assignments`)
  revalidatePath(`/teacher/courses/${assignment.course_id}`)
  return { success: true }
}

// ============================================
// STUDENT: Get all assignments across enrolled courses
// ============================================
export async function getStudentAssignments() {
  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) return { error: 'Not authenticated' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get enrolled courses
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('course_id, courses:courses(id, name)')
    .eq('student_id', user.id)

  if (!enrollments || enrollments.length === 0) {
    return { data: [] }
  }

  const courseIds = enrollments.map((e) => e.course_id)
  const courseMap: Record<string, string> = {}
  for (const e of enrollments) {
    const course = e.courses as unknown as { id: string; name: string }
    if (course) {
      courseMap[course.id] = course.name
    }
  }

  // Get assignments for enrolled courses
  let query = supabase
    .from('assignments')
    .select('*')
    .in('course_id', courseIds)
    .eq('status', 'assigned')
    .order('due_date', { ascending: true })

  query = query.eq('tenant_id', tenantId)

  const { data: assignments, error } = await query

  if (error) {
    console.error('Error fetching student assignments:', error)
    return { error: 'Failed to fetch assignments' }
  }

  // Get student's submissions
  const assignmentIds = (assignments || []).map((a) => a.id)
  let submissionMap: Record<string, { status: string; submitted_at: string }> = {}
  let gradeMap: Record<string, { points_earned: number; percentage: number; feedback: string | null }> = {}

  if (assignmentIds.length > 0) {
    const { data: submissions } = await supabase
      .from('submissions')
      .select('assignment_id, status, submitted_at')
      .eq('student_id', user.id)
      .in('assignment_id', assignmentIds)

    if (submissions) {
      for (const s of submissions) {
        submissionMap[s.assignment_id] = {
          status: s.status,
          submitted_at: s.submitted_at,
        }
      }
    }

    const { data: grades } = await supabase
      .from('grades')
      .select('assignment_id, points_earned, percentage, feedback')
      .eq('student_id', user.id)
      .in('assignment_id', assignmentIds)

    if (grades) {
      for (const g of grades) {
        gradeMap[g.assignment_id] = {
          points_earned: g.points_earned,
          percentage: g.percentage,
          feedback: g.feedback,
        }
      }
    }
  }

  const result = (assignments || []).map((a) => {
    const submission = submissionMap[a.id]
    const grade = gradeMap[a.id]
    let displayStatus = 'pending'

    if (submission?.status === 'returned') {
      displayStatus = 'returned'
    } else if (grade) {
      displayStatus = 'graded'
    } else if (submission) {
      displayStatus = submission.status === 'submitted' ? 'submitted' : submission.status
    } else if (a.due_date && new Date(a.due_date) < new Date()) {
      displayStatus = 'overdue'
    }

    return {
      ...a,
      courseTitle: courseMap[a.course_id] || 'Unknown Course',
      submissionStatus: displayStatus,
      submittedAt: submission?.submitted_at || null,
      grade: grade || null,
    }
  })

  return { data: result }
}
