'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getLetterGrade } from '@/lib/config/constants'

// ============================================
// TEACHER: Get all submissions for an assignment
// ============================================
export async function getSubmissions(assignmentId: string) {
  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get the assignment and verify teacher ownership
  const { data: assignment } = await supabase
    .from('assignments')
    .select('*, courses:courses(id, title, teacher_id)')
    .eq('id', assignmentId)
    .single()

  if (!assignment) return { error: 'Assignment not found' }

  const courseData = assignment.courses as unknown as { id: string; title: string; teacher_id: string }
  if (courseData?.teacher_id !== user.id) {
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
  let gradeMap: Record<string, { score: number; max_score: number; feedback: string | null; letter_grade: string | null; rubric_scores: unknown }> = {}

  if (submissionIds.length > 0) {
    const { data: grades } = await supabase
      .from('grades')
      .select('submission_id, score, max_score, feedback, letter_grade, rubric_scores')
      .in('submission_id', submissionIds)

    if (grades) {
      for (const g of grades) {
        gradeMap[g.submission_id] = {
          score: g.score,
          max_score: g.max_score,
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
      pointsPossible: assignment.points_possible,
      type: assignment.type,
      dueDate: assignment.due_date,
      courseId: courseData.id,
      courseTitle: courseData.title,
    },
  }
}

// ============================================
// STUDENT: Get own submission for an assignment
// ============================================
export async function getMySubmission(assignmentId: string) {
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
  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get assignment details
  const { data: assignment } = await supabase
    .from('assignments')
    .select('id, course_id, due_date, late_policy, status')
    .eq('id', assignmentId)
    .single()

  if (!assignment) return { error: 'Assignment not found' }
  if (assignment.status !== 'published') return { error: 'This assignment is not accepting submissions' }

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
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

  if (isLate && assignment.late_policy === 'no_late') {
    return { error: 'This assignment does not accept late submissions' }
  }

  const submissionData: Record<string, unknown> = {
    assignment_id: assignmentId,
    student_id: user.id,
    content: formData.content || null,
    file_urls: formData.fileUrls || null,
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
        content: formData.content || null,
        file_urls: formData.fileUrls || null,
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
  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get submission details
  const { data: submission } = await supabase
    .from('submissions')
    .select('id, assignment_id, student_id, assignments:assignment_id(course_id, points_possible, courses:courses(teacher_id))')
    .eq('id', submissionId)
    .single()

  if (!submission) return { error: 'Submission not found' }

  const assignmentData = submission.assignments as unknown as {
    course_id: string
    points_possible: number
    courses: { teacher_id: string }
  }

  if (assignmentData?.courses?.teacher_id !== user.id) {
    return { error: 'Not authorized to grade this submission' }
  }

  const maxScore = assignmentData.points_possible
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
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
    grader_id: user.id,
    score,
    max_score: maxScore,
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
        score,
        max_score: maxScore,
        letter_grade: letterGrade,
        feedback: feedback || null,
        rubric_scores: rubricScores || null,
        graded_at: new Date().toISOString(),
        grader_id: user.id,
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

  return { success: true, data: result }
}
