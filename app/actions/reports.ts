'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getLetterGrade } from '@/lib/config/constants'

async function getContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) throw new Error('No tenant context')

  const { data: membership } = await supabase
    .from('tenant_memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .eq('status', 'active')
    .single()

  return { supabase, user, tenantId, role: membership?.role ?? 'student' }
}

// ---------------------------------------------------------------------------
// Teacher: Class report for a course
// ---------------------------------------------------------------------------
export async function getTeacherClassReport(courseId: string) {
  const { supabase, user, tenantId, role } = await getContext()

  if (!['teacher', 'admin', 'super_admin'].includes(role)) {
    throw new Error('Not authorized')
  }

  // Get course
  const { data: course } = await supabase
    .from('courses')
    .select('id, name, created_by')
    .eq('id', courseId)
    .eq('tenant_id', tenantId)
    .single()

  if (!course) throw new Error('Course not found')
  if (role === 'teacher' && course.created_by !== user.id) {
    throw new Error('Not authorized for this course')
  }

  // Get assignments
  const { data: assignments } = await supabase
    .from('assignments')
    .select('id, title, max_points, type, due_date')
    .eq('course_id', courseId)
    .eq('status', 'assigned')
    .order('due_date', { ascending: true })

  // Get enrollments with profiles
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('student_id, profiles:student_id(full_name)')
    .eq('course_id', courseId)

  // Get all grades for this course
  const assignmentIds = (assignments || []).map((a) => a.id)
  let grades: any[] = []
  if (assignmentIds.length > 0) {
    const { data } = await supabase
      .from('grades')
      .select('student_id, assignment_id, points_earned, percentage, letter_grade')
      .in('assignment_id', assignmentIds)
    grades = data || []
  }

  // Build student rows
  const students = (enrollments || []).map((e) => {
    const name = (e.profiles as any)?.full_name || 'Unknown'
    const studentGrades = grades.filter((g) => g.student_id === e.student_id)
    const gradeMap: Record<string, { points: number; pct: number; letter: string }> = {}
    for (const g of studentGrades) {
      gradeMap[g.assignment_id] = {
        points: g.points_earned,
        pct: g.percentage,
        letter: g.letter_grade,
      }
    }

    const gradedPcts = studentGrades.map((g) => g.percentage).filter((p: number) => p != null)
    const avg = gradedPcts.length > 0 ? gradedPcts.reduce((s: number, p: number) => s + p, 0) / gradedPcts.length : null

    return {
      studentId: e.student_id,
      name,
      grades: gradeMap,
      overallPct: avg != null ? Math.round(avg * 10) / 10 : null,
      overallLetter: avg != null ? getLetterGrade(avg) : null,
      assignmentsGraded: gradedPcts.length,
      assignmentsTotal: assignmentIds.length,
    }
  })

  return {
    course: { id: course.id, name: course.name },
    assignments: assignments || [],
    students,
    classAverage: (() => {
      const all = students.filter((s) => s.overallPct != null).map((s) => s.overallPct!)
      if (all.length === 0) return null
      return Math.round((all.reduce((s, p) => s + p, 0) / all.length) * 10) / 10
    })(),
  }
}

// ---------------------------------------------------------------------------
// Admin: School-wide report
// ---------------------------------------------------------------------------
export async function getAdminSchoolReport() {
  const { supabase, tenantId, role } = await getContext()

  if (!['admin', 'super_admin'].includes(role)) {
    throw new Error('Not authorized')
  }

  // User counts by role
  const { data: memberships } = await supabase
    .from('tenant_memberships')
    .select('role, status')
    .eq('tenant_id', tenantId)

  const roleCounts: Record<string, number> = {}
  let activeCount = 0
  for (const m of memberships || []) {
    roleCounts[m.role] = (roleCounts[m.role] || 0) + 1
    if (m.status === 'active') activeCount++
  }

  // Course count
  const { count: courseCount } = await supabase
    .from('courses')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)

  // Enrollment count
  const { count: enrollmentCount } = await supabase
    .from('course_enrollments')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)

  // Attendance (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const { data: attendance } = await supabase
    .from('attendance_records')
    .select('status')
    .eq('tenant_id', tenantId)
    .gte('date', thirtyDaysAgo.toISOString().split('T')[0])

  const attendanceCounts: Record<string, number> = {}
  for (const a of attendance || []) {
    attendanceCounts[a.status] = (attendanceCounts[a.status] || 0) + 1
  }
  const totalAttendance = (attendance || []).length
  const presentCount = (attendanceCounts['present'] || 0) + (attendanceCounts['tardy'] || 0)
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 1000) / 10 : 0

  // Course list with enrollment counts
  const { data: courses } = await supabase
    .from('courses')
    .select('id, name, status, created_at, profiles:created_by(full_name)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  const courseDetails = await Promise.all(
    (courses || []).map(async (c) => {
      const { count } = await supabase
        .from('course_enrollments')
        .select('id', { count: 'exact', head: true })
        .eq('course_id', c.id)
      return {
        name: c.name,
        teacher: (c.profiles as any)?.full_name || 'Unknown',
        status: c.status,
        students: count || 0,
        createdAt: new Date(c.created_at).toLocaleDateString('en-CA'),
      }
    })
  )

  return {
    summary: {
      totalUsers: (memberships || []).length,
      activeUsers: activeCount,
      totalCourses: courseCount || 0,
      totalEnrollments: enrollmentCount || 0,
      attendanceRate,
      roleCounts,
      attendanceCounts,
    },
    courses: courseDetails,
  }
}

// ---------------------------------------------------------------------------
// Parent: Progress report for their child
// ---------------------------------------------------------------------------
export async function getParentProgressReport(studentId: string) {
  const { supabase, user, tenantId, role } = await getContext()

  if (role !== 'parent' && !['admin', 'super_admin'].includes(role)) {
    throw new Error('Not authorized')
  }

  // Verify parent-child relationship
  if (role === 'parent') {
    const { data: relationship } = await supabase
      .from('student_parents')
      .select('id')
      .eq('parent_id', user.id)
      .eq('student_id', studentId)
      .eq('status', 'active')
      .single()

    if (!relationship) throw new Error('Not authorized for this student')
  }

  // Student profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, grade_level')
    .eq('id', studentId)
    .single()

  // Enrollments with course names
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('course_id, status, courses:course_id(name)')
    .eq('student_id', studentId)
    .eq('tenant_id', tenantId)

  // Grades
  const { data: allGrades } = await supabase
    .from('grades')
    .select('assignment_id, points_earned, percentage, letter_grade, graded_at, assignments:assignment_id(title, course_id, courses:course_id(name))')
    .eq('student_id', studentId)
    .eq('tenant_id', tenantId)
    .order('graded_at', { ascending: false })

  // Attendance
  const { data: attendanceRecords } = await supabase
    .from('attendance_records')
    .select('status, date')
    .eq('student_id', studentId)
    .eq('tenant_id', tenantId)

  const attCounts: Record<string, number> = {}
  for (const a of attendanceRecords || []) {
    attCounts[a.status] = (attCounts[a.status] || 0) + 1
  }
  const totalAtt = (attendanceRecords || []).length
  const presentAtt = (attCounts['present'] || 0) + (attCounts['tardy'] || 0)

  // Build grade rows
  const gradeRows = (allGrades || []).map((g) => {
    const assignment = g.assignments as any
    return {
      assignment: assignment?.title || 'Unknown',
      course: assignment?.courses?.name || 'Unknown',
      score: g.points_earned,
      percentage: Math.round(g.percentage * 10) / 10,
      letter: g.letter_grade,
      date: g.graded_at ? new Date(g.graded_at).toLocaleDateString('en-CA') : '',
    }
  })

  const gradedPcts = (allGrades || []).map((g) => g.percentage).filter((p) => p != null)
  const gpa = gradedPcts.length > 0
    ? Math.round((gradedPcts.reduce((s, p) => s + p, 0) / gradedPcts.length) * 10) / 10
    : null

  return {
    student: {
      name: profile?.full_name || 'Student',
      gradeLevel: profile?.grade_level || '',
    },
    summary: {
      gpa,
      gpaLetter: gpa != null ? getLetterGrade(gpa) : null,
      activeCourses: (enrollments || []).filter((e) => e.status === 'active').length,
      totalGrades: gradedPcts.length,
      attendanceRate: totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 1000) / 10 : 0,
      attendanceCounts: attCounts,
      totalAttendanceDays: totalAtt,
    },
    grades: gradeRows,
    courses: (enrollments || []).map((e) => ({
      name: (e.courses as any)?.name || 'Unknown',
      status: e.status,
    })),
  }
}
