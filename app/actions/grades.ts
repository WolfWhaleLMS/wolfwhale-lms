'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getLetterGrade } from '@/lib/config/constants'

// ============================================
// Get grades for a course (optionally for a specific student)
// ============================================
export async function getGrades(courseId: string, studentId?: string) {
  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  let query = supabase
    .from('grades')
    .select(`
      *,
      assignments:assignment_id(id, title, type, points_possible, due_date, course_id),
      profiles:student_id(id, full_name, email)
    `)
    .order('graded_at', { ascending: false })

  if (tenantId) {
    query = query.eq('tenant_id', tenantId)
  }

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

  const { data, error } = await query

  if (error) {
    console.error('Error fetching grades:', error)
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

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get all grades for this student
  let query = supabase
    .from('grades')
    .select(`
      *,
      assignments:assignment_id(id, title, type, points_possible, due_date, course_id)
    `)
    .eq('student_id', user.id)
    .order('graded_at', { ascending: false })

  if (tenantId) {
    query = query.eq('tenant_id', tenantId)
  }

  const { data: grades, error } = await query

  if (error) {
    console.error('Error fetching student grades:', error)
    return { error: 'Failed to fetch grades' }
  }

  if (!grades || grades.length === 0) {
    return { data: [], courseGrades: [] }
  }

  // Get enrolled courses
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id, courses:courses(id, title)')
    .eq('user_id', user.id)

  const courseMap: Record<string, string> = {}
  if (enrollments) {
    for (const e of enrollments) {
      const course = e.courses as unknown as { id: string; title: string }
      if (course) {
        courseMap[course.id] = course.title
      }
    }
  }

  // Group grades by course
  const courseGradesMap: Record<string, {
    courseId: string
    courseTitle: string
    grades: typeof grades
    totalScore: number
    totalMaxScore: number
  }> = {}

  for (const grade of grades) {
    const assignment = grade.assignments as unknown as {
      id: string; title: string; type: string; points_possible: number; due_date: string; course_id: string
    }
    if (!assignment) continue

    const courseId = assignment.course_id
    if (!courseGradesMap[courseId]) {
      courseGradesMap[courseId] = {
        courseId,
        courseTitle: courseMap[courseId] || 'Unknown Course',
        grades: [],
        totalScore: 0,
        totalMaxScore: 0,
      }
    }
    courseGradesMap[courseId].grades.push(grade)
    courseGradesMap[courseId].totalScore += grade.score
    courseGradesMap[courseId].totalMaxScore += grade.max_score
  }

  const courseGrades = Object.values(courseGradesMap).map((cg) => {
    const percentage = cg.totalMaxScore > 0
      ? Math.round((cg.totalScore / cg.totalMaxScore) * 10000) / 100
      : 0
    return {
      ...cg,
      percentage,
      letterGrade: cg.totalMaxScore > 0 ? getLetterGrade(percentage) : '--',
    }
  })

  // Augment grades with course title
  const augmentedGrades = grades.map((g) => {
    const assignment = g.assignments as unknown as { course_id: string; title: string; type: string; points_possible: number }
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
  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify teacher ownership
  const { data: course } = await supabase
    .from('courses')
    .select('id, title, teacher_id')
    .eq('id', courseId)
    .single()

  if (!course || course.teacher_id !== user.id) {
    return { error: 'Not authorized to view this gradebook' }
  }

  // Get all assignments for this course
  let assignmentQuery = supabase
    .from('assignments')
    .select('id, title, type, points_possible, due_date')
    .eq('course_id', courseId)
    .eq('status', 'published')
    .order('due_date', { ascending: true })

  if (tenantId) {
    assignmentQuery = assignmentQuery.eq('tenant_id', tenantId)
  }

  const { data: assignments } = await assignmentQuery

  if (!assignments || assignments.length === 0) {
    return { data: { course, assignments: [], students: [], grades: {} } }
  }

  // Get enrolled students
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('user_id, profiles:user_id(id, full_name, email)')
    .eq('course_id', courseId)

  const students = (enrollments || []).map((e) => {
    const profile = e.profiles as unknown as { id: string; full_name: string; email: string }
    return {
      id: profile?.id || e.user_id,
      name: profile?.full_name || 'Unknown Student',
      email: profile?.email || '',
    }
  })

  // Get all grades for this course's assignments
  const assignmentIds = assignments.map((a) => a.id)

  let gradesQuery = supabase
    .from('grades')
    .select('assignment_id, student_id, score, max_score, letter_grade')
    .in('assignment_id', assignmentIds)

  if (tenantId) {
    gradesQuery = gradesQuery.eq('tenant_id', tenantId)
  }

  const { data: allGrades } = await gradesQuery

  // Build a grid: grades[studentId][assignmentId] = grade
  const grades: Record<string, Record<string, { score: number; maxScore: number; letterGrade: string }>> = {}

  if (allGrades) {
    for (const g of allGrades) {
      if (!grades[g.student_id]) {
        grades[g.student_id] = {}
      }
      grades[g.student_id][g.assignment_id] = {
        score: g.score,
        maxScore: g.max_score,
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

    let totalScore = 0
    let totalMaxScore = 0
    for (const aId of assignmentIds) {
      if (studentGrades[aId]) {
        totalScore += studentGrades[aId].score
        totalMaxScore += studentGrades[aId].maxScore
      }
    }

    const percentage = totalMaxScore > 0
      ? Math.round((totalScore / totalMaxScore) * 10000) / 100
      : 0

    studentOveralls[student.id] = {
      percentage,
      letterGrade: totalMaxScore > 0 ? getLetterGrade(percentage) : '--',
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
