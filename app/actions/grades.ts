'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getLetterGrade } from '@/lib/config/constants'
import { rateLimitAction } from '@/lib/rate-limit-action'

// ============================================
// Get grades for a course (optionally for a specific student)
// ============================================
export async function getGrades(courseId: string, studentId?: string) {
  const parsed = z.object({
    courseId: z.string().uuid(),
    studentId: z.string().uuid().optional(),
  }).safeParse({ courseId, studentId })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) return { error: 'No tenant context' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Authorization check: caller must be the course teacher, the student themselves, or an admin
  const { data: course } = await supabase
    .from('courses')
    .select('created_by')
    .eq('id', courseId)
    .single()

  if (!course) return { error: 'Course not found' }

  const isCourseTeacher = course.created_by === user.id
  const isSelf = studentId === user.id

  if (!isCourseTeacher && !isSelf) {
    // Check if user is admin/super_admin
    const { data: membership } = await supabase
      .from('tenant_memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .single()

    if (!membership || !['admin', 'super_admin'].includes(membership.role)) {
      return { error: 'Not authorized to view these grades' }
    }
  }

  let query = supabase
    .from('grades')
    .select(`
      *,
      assignments:assignment_id(id, title, type, max_points, due_date, course_id),
      profiles:student_id(id, full_name)
    `)
    .order('graded_at', { ascending: false })

  query = query.eq('tenant_id', tenantId)

  if (studentId) {
    query = query.eq('student_id', studentId)
  }

  // Filter by course through assignments
  const { data: courseAssignments } = await supabase
    .from('assignments')
    .select('id')
    .eq('course_id', courseId)

  if (!courseAssignments || courseAssignments.length === 0) {
    return { data: [] }
  }

  const assignmentIds = courseAssignments.map((a) => a.id)
  query = query.in('assignment_id', assignmentIds)
  query = query.limit(500)

  const { data, error } = await query

  if (error) {
    console.error('[grades] fetch error')
    return { error: 'Failed to fetch grades' }
  }

  return { data: data || [] }
}

// ============================================
// STUDENT: Get all grades for current student
// ============================================
export async function getStudentGrades() {
  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) return { error: 'No tenant context' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get all grades for this student
  let query = supabase
    .from('grades')
    .select(`
      *,
      assignments:assignment_id(id, title, type, max_points, due_date, course_id)
    `)
    .eq('student_id', user.id)
    .order('graded_at', { ascending: false })

  query = query.eq('tenant_id', tenantId)
  query = query.limit(500)

  const { data: grades, error } = await query

  if (error) {
    console.error('[grades] student fetch error')
    return { error: 'Failed to fetch grades' }
  }

  if (!grades || grades.length === 0) {
    return { data: [], courseGrades: [] }
  }

  // Get enrolled courses
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('course_id, courses:courses(id, name)')
    .eq('student_id', user.id)

  const courseMap: Record<string, string> = {}
  if (enrollments) {
    for (const e of enrollments) {
      const course = e.courses as unknown as { id: string; name: string }
      if (course) {
        courseMap[course.id] = course.name
      }
    }
  }

  // Group grades by course
  const courseGradesMap: Record<string, {
    courseId: string
    courseTitle: string
    grades: typeof grades
    totalPointsEarned: number
    totalPercentage: number
    gradeCount: number
  }> = {}

  for (const grade of grades) {
    const assignment = grade.assignments as unknown as {
      id: string; title: string; type: string; max_points: number; due_date: string; course_id: string
    }
    if (!assignment) continue

    const courseId = assignment.course_id
    if (!courseGradesMap[courseId]) {
      courseGradesMap[courseId] = {
        courseId,
        courseTitle: courseMap[courseId] || 'Unknown Course',
        grades: [],
        totalPointsEarned: 0,
        totalPercentage: 0,
        gradeCount: 0,
      }
    }
    courseGradesMap[courseId].grades.push(grade)
    courseGradesMap[courseId].totalPointsEarned += grade.points_earned
    courseGradesMap[courseId].totalPercentage += grade.percentage
    courseGradesMap[courseId].gradeCount++
  }

  const courseGrades = Object.values(courseGradesMap).map((cg) => {
    const avgPercentage = cg.gradeCount > 0
      ? Math.round((cg.totalPercentage / cg.gradeCount) * 100) / 100
      : 0
    return {
      ...cg,
      percentage: avgPercentage,
      letterGrade: cg.gradeCount > 0 ? getLetterGrade(avgPercentage) : '--',
    }
  })

  // Augment grades with course title
  const augmentedGrades = grades.map((g) => {
    const assignment = g.assignments as unknown as { course_id: string; title: string; type: string; max_points: number }
    return {
      ...g,
      courseTitle: assignment ? courseMap[assignment.course_id] || 'Unknown Course' : 'Unknown Course',
      assignmentTitle: assignment?.title || 'Unknown Assignment',
      assignmentType: assignment?.type || 'other',
    }
  })

  return { data: augmentedGrades, courseGrades }
}

// ============================================
// TEACHER: Get full gradebook grid
// ============================================
export async function getGradebook(courseId: string) {
  const parsed = z.object({ courseId: z.string().uuid() }).safeParse({ courseId })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) return { error: 'No tenant context' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify teacher ownership
  const { data: course } = await supabase
    .from('courses')
    .select('id, name, created_by')
    .eq('id', courseId)
    .single()

  if (!course || course.created_by !== user.id) {
    return { error: 'Not authorized to view this gradebook' }
  }

  // Get all assignments for this course
  let assignmentQuery = supabase
    .from('assignments')
    .select('id, title, type, max_points, due_date')
    .eq('course_id', courseId)
    .eq('status', 'assigned')
    .order('due_date', { ascending: true })

  assignmentQuery = assignmentQuery.eq('tenant_id', tenantId)

  const { data: assignments } = await assignmentQuery

  if (!assignments || assignments.length === 0) {
    return { data: { course, assignments: [], students: [], grades: {} } }
  }

  // Get enrolled students
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('student_id, profiles:student_id(id, full_name)')
    .eq('course_id', courseId)

  const students = (enrollments || []).map((e) => {
    const profile = e.profiles as unknown as { id: string; full_name: string }
    return {
      id: profile?.id || e.student_id,
      name: profile?.full_name || 'Unknown Student',
    }
  })

  // Get all grades for this course's assignments
  const assignmentIds = assignments.map((a) => a.id)

  let gradesQuery = supabase
    .from('grades')
    .select('assignment_id, student_id, points_earned, percentage, letter_grade')
    .in('assignment_id', assignmentIds)

  gradesQuery = gradesQuery.eq('tenant_id', tenantId)

  const { data: allGrades } = await gradesQuery

  // Build a grid: grades[studentId][assignmentId] = grade
  const grades: Record<string, Record<string, { pointsEarned: number; percentage: number; letterGrade: string }>> = {}

  if (allGrades) {
    for (const g of allGrades) {
      if (!grades[g.student_id]) {
        grades[g.student_id] = {}
      }
      grades[g.student_id][g.assignment_id] = {
        pointsEarned: g.points_earned,
        percentage: g.percentage,
        letterGrade: g.letter_grade,
      }
    }
  }

  // Calculate overall grade per student
  const studentOveralls: Record<string, { percentage: number; letterGrade: string }> = {}
  for (const student of students) {
    const studentGrades = grades[student.id]
    if (!studentGrades) {
      studentOveralls[student.id] = { percentage: 0, letterGrade: '--' }
      continue
    }

    let totalPercentage = 0
    let gradeCount = 0
    for (const aId of assignmentIds) {
      if (studentGrades[aId]) {
        totalPercentage += studentGrades[aId].percentage
        gradeCount++
      }
    }

    const percentage = gradeCount > 0
      ? Math.round((totalPercentage / gradeCount) * 100) / 100
      : 0

    studentOveralls[student.id] = {
      percentage,
      letterGrade: gradeCount > 0 ? getLetterGrade(percentage) : '--',
    }
  }

  return {
    data: {
      course,
      assignments,
      students,
      grades,
      studentOveralls,
    },
  }
}
