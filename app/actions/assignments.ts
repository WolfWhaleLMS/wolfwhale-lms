'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

// ============================================
// TEACHER: Get assignments for a course
// ============================================
export async function getAssignments(courseId: string) {
  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

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

  if (tenantId) {
    query = query.eq('tenant_id', tenantId)
  }

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
      .select('assignment_id, score, max_score')
      .in('assignment_id', assignmentIds)

    if (grades) {
      for (const grade of grades) {
        if (!averages[grade.assignment_id]) {
          averages[grade.assignment_id] = { avg: 0, count: 0 }
        }
        averages[grade.assignment_id].count++
        averages[grade.assignment_id].avg +=
          grade.max_score > 0 ? (grade.score / grade.max_score) * 100 : 0
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
  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  let query = supabase
    .from('assignments')
    .select(`
      *,
      courses:courses(id, title, teacher_id)
    `)
    .eq('id', assignmentId)

  if (tenantId) {
    query = query.eq('tenant_id', tenantId)
  }

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
  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify the user is the course teacher
  const { data: course } = await supabase
    .from('courses')
    .select('teacher_id')
    .eq('id', formData.courseId)
    .single()

  if (!course || course.teacher_id !== user.id) {
    return { error: 'Not authorized to create assignments for this course' }
  }

  const insertData: Record<string, unknown> = {
    course_id: formData.courseId,
    title: formData.title,
    description: formData.description || null,
    type: formData.type,
    due_date: formData.dueDate || null,
    points_possible: formData.pointsPossible,
    submission_type: formData.submissionType,
    late_policy: formData.latePolicy ? 'accept_late' : 'no_late',
    status: 'published',
    questions: formData.questions || [],
  }

  // Build combined attachments array (files + links)
  const combinedAttachments = [
    ...(formData.attachments || []).map((a) => ({ ...a, type: 'file' as const })),
    ...(formData.links || []).map((l) => ({ ...l, type: 'link' as const })),
  ]
  if (combinedAttachments.length > 0) {
    insertData.attachments = JSON.stringify(combinedAttachments)
  }

  if (tenantId) {
    insertData.tenant_id = tenantId
  }

  const { data, error } = await supabase
    .from('assignments')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error('Error creating assignment:', error)
    return { error: 'Failed to create assignment' }
  }

  revalidatePath(`/teacher/courses/${formData.courseId}/assignments`)
  revalidatePath(`/teacher/courses/${formData.courseId}`)
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
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify ownership via course
  const { data: assignment } = await supabase
    .from('assignments')
    .select('course_id, courses:courses(teacher_id)')
    .eq('id', assignmentId)
    .single()

  if (!assignment) return { error: 'Assignment not found' }

  const courseData = assignment.courses as unknown as { teacher_id: string }
  if (courseData?.teacher_id !== user.id) {
    return { error: 'Not authorized to update this assignment' }
  }

  const updateData: Record<string, unknown> = {}
  if (formData.title !== undefined) updateData.title = formData.title
  if (formData.description !== undefined) updateData.description = formData.description
  if (formData.type !== undefined) updateData.type = formData.type
  if (formData.dueDate !== undefined) updateData.due_date = formData.dueDate
  if (formData.pointsPossible !== undefined) updateData.points_possible = formData.pointsPossible
  if (formData.submissionType !== undefined) updateData.submission_type = formData.submissionType
  if (formData.latePolicy !== undefined) updateData.late_policy = formData.latePolicy ? 'accept_late' : 'no_late'
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
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify ownership via course
  const { data: assignment } = await supabase
    .from('assignments')
    .select('course_id, courses:courses(teacher_id)')
    .eq('id', assignmentId)
    .single()

  if (!assignment) return { error: 'Assignment not found' }

  const courseData = assignment.courses as unknown as { teacher_id: string }
  if (courseData?.teacher_id !== user.id) {
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

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get enrolled courses
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id, courses:courses(id, title)')
    .eq('user_id', user.id)

  if (!enrollments || enrollments.length === 0) {
    return { data: [] }
  }

  const courseIds = enrollments.map((e) => e.course_id)
  const courseMap: Record<string, string> = {}
  for (const e of enrollments) {
    const course = e.courses as unknown as { id: string; title: string }
    if (course) {
      courseMap[course.id] = course.title
    }
  }

  // Get assignments for enrolled courses
  let query = supabase
    .from('assignments')
    .select('*')
    .in('course_id', courseIds)
    .eq('status', 'published')
    .order('due_date', { ascending: true })

  if (tenantId) {
    query = query.eq('tenant_id', tenantId)
  }

  const { data: assignments, error } = await query

  if (error) {
    console.error('Error fetching student assignments:', error)
    return { error: 'Failed to fetch assignments' }
  }

  // Get student's submissions
  const assignmentIds = (assignments || []).map((a) => a.id)
  let submissionMap: Record<string, { status: string; submitted_at: string }> = {}
  let gradeMap: Record<string, { score: number; max_score: number; feedback: string | null }> = {}

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
      .select('assignment_id, score, max_score, feedback')
      .eq('student_id', user.id)
      .in('assignment_id', assignmentIds)

    if (grades) {
      for (const g of grades) {
        gradeMap[g.assignment_id] = {
          score: g.score,
          max_score: g.max_score,
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
