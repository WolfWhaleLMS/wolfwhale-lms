'use server'

import { getLetterGrade } from '@/lib/config/constants'
import { rateLimitAction } from '@/lib/rate-limit-action'
import { getActionContext } from '@/lib/actions/context'

/** Extends base context with DB-verified membership role for reports authorization. */
async function getReportsContext() {
  const ctx = await getActionContext()
  const { supabase, user, tenantId } = ctx

  const { data: membership } = await supabase
    .from('tenant_memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .eq('status', 'active')
    .single()

  return { ...ctx, role: membership?.role ?? 'student' }
}

// ---------------------------------------------------------------------------
// Teacher: Class report for a course
// ---------------------------------------------------------------------------
export async function getTeacherClassReport(courseId: string) {
  const { supabase, user, tenantId, role } = await getReportsContext()

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

  // Assignments and enrollments are independent — fetch in parallel
  const [{ data: assignments }, { data: enrollments }] = await Promise.all([
    supabase
      .from('assignments')
      .select('id, title, max_points, type, due_date')
      .eq('course_id', courseId)
      .eq('status', 'assigned')
      .order('due_date', { ascending: true }),
    supabase
      .from('course_enrollments')
      .select('student_id, profiles:student_id(full_name)')
      .eq('course_id', courseId),
  ])

  // Get all grades for this course
  const assignmentIds = (assignments || []).map((a) => a.id)
  let grades: Array<{ student_id: string; assignment_id: string; points_earned: number | null; percentage: number | null; letter_grade: string | null }> = []
  if (assignmentIds.length > 0) {
    const { data } = await supabase
      .from('grades')
      .select('student_id, assignment_id, points_earned, percentage, letter_grade')
      .in('assignment_id', assignmentIds)
    grades = data || []
  }

  // Build student rows
  const students = (enrollments || []).map((e) => {
    const name = (e.profiles as { full_name?: string } | null)?.full_name || 'Unknown'
    const studentGrades = grades.filter((g) => g.student_id === e.student_id)
    const gradeMap: Record<string, { points: number; pct: number; letter: string }> = {}
    for (const g of studentGrades) {
      gradeMap[g.assignment_id] = {
        points: g.points_earned ?? 0,
        pct: g.percentage ?? 0,
        letter: g.letter_grade ?? '',
      }
    }

    const gradedPcts = studentGrades.map((g) => g.percentage).filter((p): p is number => p != null)
    const avg = gradedPcts.length > 0 ? gradedPcts.reduce((s, p) => s + p, 0) / gradedPcts.length : null

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
  const { supabase, tenantId, role } = await getReportsContext()

  if (!['admin', 'super_admin'].includes(role)) {
    throw new Error('Not authorized')
  }

  // Fetch role counts, total user count, course count, enrollment count,
  // and attendance summary all in parallel via RPCs + count queries
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [
    { data: roleCountRows, error: roleCountError },
    { count: totalUserCount },
    { count: courseCount },
    { count: enrollmentCount },
    { data: attendanceRows, error: attendanceError },
  ] = await Promise.all([
    // RPC: get_tenant_role_counts — replaces fetching all memberships + JS counting
    supabase.rpc('get_tenant_role_counts', { p_tenant_id: tenantId }),
    // Total users (all statuses) for the summary
    supabase
      .from('tenant_memberships')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId),
    // Course count
    supabase
      .from('courses')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId),
    // Enrollment count
    supabase
      .from('course_enrollments')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId),
    // RPC: get_attendance_summary — replaces fetching 50k records + JS counting
    supabase.rpc('get_attendance_summary', {
      p_tenant_id: tenantId,
      p_start_date: thirtyDaysAgo.toISOString().split('T')[0],
      p_end_date: null,
    }),
  ])

  // Build roleCounts from RPC result
  const roleCounts: Record<string, number> = {}
  let activeCount = 0
  for (const row of roleCountRows || []) {
    roleCounts[row.role] = Number(row.count)
    activeCount += Number(row.count)
  }

  // Build attendanceCounts from RPC result
  const attendanceCounts: Record<string, number> = {}
  let totalAttendance = 0
  for (const row of attendanceRows || []) {
    attendanceCounts[row.status] = Number(row.count)
    totalAttendance += Number(row.count)
  }
  const presentCount = (attendanceCounts['present'] || 0) + (attendanceCounts['tardy'] || 0)
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 1000) / 10 : 0

  // Course list with enrollment counts — single query with embedded count
  const { data: courses } = await supabase
    .from('courses')
    .select('id, name, status, created_at, profiles:created_by(full_name), course_enrollments(count)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(500)

  const courseDetails = (courses || []).map((c) => ({
    name: c.name,
    teacher: (c.profiles as { full_name?: string } | null)?.full_name || 'Unknown',
    status: c.status,
    students: (c.course_enrollments as unknown as { count: number }[])?.[0]?.count || 0,
    createdAt: new Date(c.created_at).toLocaleDateString('en-CA'),
  }))

  return {
    summary: {
      totalUsers: totalUserCount || 0,
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
  const { supabase, user, tenantId, role } = await getReportsContext()

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

  // Attendance — use RPC instead of fetching all records and counting in JS
  const { data: attSummaryRows } = await supabase.rpc('get_student_attendance_summary', {
    p_student_id: studentId,
    p_tenant_id: tenantId,
  })

  const attCounts: Record<string, number> = {}
  let totalAtt = 0
  for (const row of attSummaryRows || []) {
    attCounts[row.status] = Number(row.count)
    totalAtt += Number(row.count)
  }
  const presentAtt = (attCounts['present'] || 0) + (attCounts['tardy'] || 0)

  // Build grade rows
  type JoinedAssignmentWithCourse = { title: string; course_id: string; courses: { name: string } | null } | null
  const gradeRows = (allGrades || []).map((g) => {
    const assignment = g.assignments as unknown as JoinedAssignmentWithCourse
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
      name: (e.courses as { name?: string } | null)?.name || 'Unknown',
      status: e.status,
    })),
  }
}
