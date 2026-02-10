'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getLetterGrade } from '@/lib/config/constants'

// ============================================
// TEACHER: Get all submissions for an assignment
// ============================================
export async function getSubmissions(assignmentId: string) {
  const parsed = z.object({ assignmentId: z.string().uuid() }).safeParse({ assignmentId })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get the assignment and verify teacher ownership
  const { data: assignment } = await supabase
    .from('assignments')
    .select('*, courses:courses(id, name, created_by)')
    .eq('id', assignmentId)
    .single()

  if (!assignment) return { error: 'Assignment not found' }

  const courseData = assignment.courses as unknown as { id: string; name: string; created_by: string }
  if (courseData?.created_by !== user.id) {
    return { error: 'Not authorized to view these submissions' }
  }

  // Get submissions with student profiles
  let query = supabase
    .from('submissions')
    .select(`
      *,
      profiles:student_id(id, full_name, email, avatar_url)
    `)
    .eq('assignment_id', assignmentId)
    .order('submitted_at', { ascending: false })

  if (tenantId) {
    query = query.eq('tenant_id', tenantId)
  }

  const { data: submissions, error } = await query

  if (error) {
    console.error('Error fetching submissions:', error)
    return { error: 'Failed to fetch submissions' }
  }

  // Get grades for these submissions
  const submissionIds = (submissions || []).map((s) => s.id)
  let gradeMap: Record<string, { points_earned: number; percentage: number; feedback: string | null; letter_grade: string | null; rubric_scores: unknown }> = {}

  if (submissionIds.length > 0) {
    const { data: grades } = await supabase
      .from('grades')
      .select('submission_id, points_earned, percentage, feedback, letter_grade, rubric_scores')
      .in('submission_id', submissionIds)

    if (grades) {
      for (const g of grades) {
        gradeMap[g.submission_id] = {
          points_earned: g.points_earned,
          percentage: g.percentage,
          feedback: g.feedback,
          letter_grade: g.letter_grade,
          rubric_scores: g.rubric_scores,
        }
      }
    }
  }

  const result = (submissions || []).map((s) => ({
    ...s,
    studentName: (s.profiles as unknown as { full_name: string })?.full_name || 'Unknown Student',
    studentEmail: (s.profiles as unknown as { email: string })?.email || '',
    studentAvatar: (s.profiles as unknown as { avatar_url: string })?.avatar_url || null,
    grade: gradeMap[s.id] || null,
  }))

  return {
    data: result,
    assignment: {
      id: assignment.id,
      title: assignment.title,
      maxPoints: assignment.max_points,
      type: assignment.type,
      dueDate: assignment.due_date,
      courseId: courseData.id,
      courseName: courseData.name,
    },
  }
}

// ============================================
// STUDENT: Get own submission for an assignment
// ============================================
export async function getMySubmission(assignmentId: string) {
  const parsed = z.object({ assignmentId: z.string().uuid() }).safeParse({ assignmentId })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  let query = supabase
    .from('submissions')
    .select('*')
    .eq('assignment_id', assignmentId)
    .eq('student_id', user.id)

  if (tenantId) {
    query = query.eq('tenant_id', tenantId)
  }

  const { data: submission } = await query.maybeSingle()

  // Also get grade if exists
  let grade = null
  if (submission) {
    const { data: gradeData } = await supabase
      .from('grades')
      .select('*')
      .eq('submission_id', submission.id)
      .maybeSingle()

    grade = gradeData
  }

  return { data: submission, grade }
}

// ============================================
// STUDENT: Submit work
// ============================================
export async function submitWork(
  assignmentId: string,
  formData: {
    content?: string
    fileUrls?: string[]
  }
) {
  const submitWorkSchema = z.object({
    assignmentId: z.string().uuid(),
    content: z.string().max(50000).optional(),
    fileUrls: z.array(z.string().max(2000)).max(20).optional(),
  })
  const parsed = submitWorkSchema.safeParse({ assignmentId, ...formData })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get assignment details
  const { data: assignment } = await supabase
    .from('assignments')
    .select('id, course_id, due_date, allow_late_submission, status')
    .eq('id', assignmentId)
    .single()

  if (!assignment) return { error: 'Assignment not found' }
  if (assignment.status !== 'assigned') return { error: 'This assignment is not accepting submissions' }

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from('course_enrollments')
    .select('id')
    .eq('student_id', user.id)
    .eq('course_id', assignment.course_id)
    .single()

  if (!enrollment) return { error: 'You are not enrolled in this course' }

  // Check for existing submission
  const { data: existing } = await supabase
    .from('submissions')
    .select('id')
    .eq('assignment_id', assignmentId)
    .eq('student_id', user.id)
    .maybeSingle()

  const now = new Date()
  const isLate = assignment.due_date ? now > new Date(assignment.due_date) : false

  if (isLate && !assignment.allow_late_submission) {
    return { error: 'This assignment does not accept late submissions' }
  }

  const submissionData: Record<string, unknown> = {
    assignment_id: assignmentId,
    student_id: user.id,
    submission_text: formData.content || null,
    file_path: formData.fileUrls || null,
    submitted_at: now.toISOString(),
    status: 'submitted',
    is_late: isLate,
  }

  if (tenantId) {
    submissionData.tenant_id = tenantId
  }

  let result
  if (existing) {
    // Update existing submission
    const { data, error } = await supabase
      .from('submissions')
      .update({
        submission_text: formData.content || null,
        file_path: formData.fileUrls || null,
        submitted_at: now.toISOString(),
        is_late: isLate,
        status: 'submitted',
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating submission:', error)
      return { error: 'Failed to update submission' }
    }
    result = data
  } else {
    // Create new submission
    const { data, error } = await supabase
      .from('submissions')
      .insert(submissionData)
      .select()
      .single()

    if (error) {
      console.error('Error creating submission:', error)
      return { error: 'Failed to submit work' }
    }
    result = data
  }

  revalidatePath(`/student/assignments/${assignmentId}`)
  revalidatePath('/student/assignments')

  return { success: true, data: result }
}

// ============================================
// TEACHER: Grade a submission
// ============================================
export async function gradeSubmission(
  submissionId: string,
  score: number,
  feedback?: string,
  rubricScores?: Record<string, number>
) {
  const gradeSubmissionSchema = z.object({
    submissionId: z.string().uuid(),
    score: z.number().min(0).max(1000),
    feedback: z.string().max(5000).optional(),
    rubricScores: z.record(z.string(), z.number().min(0).max(1000)).optional(),
  })
  const parsed = gradeSubmissionSchema.safeParse({ submissionId, score, feedback, rubricScores })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get submission details
  const { data: submission } = await supabase
    .from('submissions')
    .select('id, assignment_id, student_id, assignments:assignment_id(course_id, max_points, courses:courses(created_by))')
    .eq('id', submissionId)
    .single()

  if (!submission) return { error: 'Submission not found' }

  const assignmentData = submission.assignments as unknown as {
    course_id: string
    max_points: number
    courses: { created_by: string }
  }

  if (assignmentData?.courses?.created_by !== user.id) {
    return { error: 'Not authorized to grade this submission' }
  }

  const maxPoints = assignmentData.max_points
  const percentage = maxPoints > 0 ? (score / maxPoints) * 100 : 0
  const letterGrade = getLetterGrade(percentage)

  // Check if grade already exists
  const { data: existingGrade } = await supabase
    .from('grades')
    .select('id')
    .eq('submission_id', submissionId)
    .maybeSingle()

  const gradeData: Record<string, unknown> = {
    submission_id: submissionId,
    assignment_id: submission.assignment_id,
    student_id: submission.student_id,
    graded_by: user.id,
    points_earned: score,
    percentage,
    letter_grade: letterGrade,
    feedback: feedback || null,
    rubric_scores: rubricScores || null,
    graded_at: new Date().toISOString(),
  }

  if (tenantId) {
    gradeData.tenant_id = tenantId
  }

  let result
  if (existingGrade) {
    const { data, error } = await supabase
      .from('grades')
      .update({
        points_earned: score,
        percentage,
        letter_grade: letterGrade,
        feedback: feedback || null,
        rubric_scores: rubricScores || null,
        graded_at: new Date().toISOString(),
        graded_by: user.id,
      })
      .eq('id', existingGrade.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating grade:', error)
      return { error: 'Failed to update grade' }
    }
    result = data
  } else {
    const { data, error } = await supabase
      .from('grades')
      .insert(gradeData)
      .select()
      .single()

    if (error) {
      console.error('Error creating grade:', error)
      return { error: 'Failed to save grade' }
    }
    result = data
  }

  // Update submission status to graded
  await supabase
    .from('submissions')
    .update({ status: 'graded' })
    .eq('id', submissionId)

  revalidatePath(`/teacher/courses/${assignmentData.course_id}/assignments/${submission.assignment_id}/submissions`)
  revalidatePath('/teacher/gradebook')
  revalidatePath('/student/assignments')

  return { success: true, data: result }
}

// ============================================
// TEACHER: Return submission for revision
// ============================================
export async function returnSubmission(submissionId: string, feedback: string) {
  const parsed = z.object({
    submissionId: z.string().uuid(),
    feedback: z.string().min(1).max(5000),
  }).safeParse({ submissionId, feedback })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get submission details and verify teacher ownership
  const { data: submission } = await supabase
    .from('submissions')
    .select('id, assignment_id, student_id, assignments:assignment_id(course_id, courses:courses(created_by))')
    .eq('id', submissionId)
    .single()

  if (!submission) return { error: 'Submission not found' }

  const assignmentData = submission.assignments as unknown as {
    course_id: string
    courses: { created_by: string }
  }

  if (assignmentData?.courses?.created_by !== user.id) {
    return { error: 'Not authorized to return this submission' }
  }

  // Update submission status to returned with feedback
  const { error } = await supabase
    .from('submissions')
    .update({
      status: 'returned',
      return_feedback: feedback,
      returned_at: new Date().toISOString(),
    })
    .eq('id', submissionId)

  if (error) {
    console.error('Error returning submission:', error)
    return { error: 'Failed to return submission' }
  }

  revalidatePath(`/teacher/courses/${assignmentData.course_id}/assignments/${submission.assignment_id}/submissions`)
  revalidatePath('/student/assignments')
  revalidatePath(`/student/assignments/${submission.assignment_id}`)

  return { success: true }
}
