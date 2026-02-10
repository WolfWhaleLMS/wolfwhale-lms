'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------------------
// Context helper (tenant-scoped, matches attendance.ts pattern)
// ---------------------------------------------------------------------------

async function getContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) throw new Error('No tenant context')
  return { supabase, user, tenantId }
}

// ---------------------------------------------------------------------------
// Helper: Verify parent-student relationship
// ---------------------------------------------------------------------------

async function verifyParentAccess(studentId: string) {
  const ctx = await getContext()
  const { supabase, user, tenantId } = ctx

  const { data: relationship } = await supabase
    .from('student_parents')
    .select('id, relationship, is_primary_contact, status')
    .eq('tenant_id', tenantId)
    .eq('parent_id', user.id)
    .eq('student_id', studentId)
    .eq('status', 'active')
    .single()

  if (!relationship) {
    throw new Error('Unauthorized: No active parent-student relationship')
  }

  return { ...ctx, relationship }
}

// ---------------------------------------------------------------------------
// getChildren() - returns parent's children from student_parents + profiles
// ---------------------------------------------------------------------------

export async function getChildren() {
  const { supabase, user, tenantId } = await getContext()

  const { data: relationships, error } = await supabase
    .from('student_parents')
    .select(`
      id,
      relationship,
      is_primary_contact,
      status,
      student_id
    `)
    .eq('tenant_id', tenantId)
    .eq('parent_id', user.id)
    .eq('status', 'active')

  if (error) throw error
  if (!relationships || relationships.length === 0) return []

  // Get profile data for each child
  const studentIds = relationships.map(r => r.student_id)

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url, grade_level')
    .in('id', studentIds)

  // Get enrollment counts per student
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('student_id, status')
    .eq('tenant_id', tenantId)
    .in('student_id', studentIds)
    .eq('status', 'active')

  // Get attendance summaries per student
  const { data: attendanceRecords } = await supabase
    .from('attendance_records')
    .select('student_id, status')
    .eq('tenant_id', tenantId)
    .in('student_id', studentIds)

  // Get grades per student for GPA calculation
  const { data: grades } = await supabase
    .from('grades')
    .select('student_id, percentage')
    .eq('tenant_id', tenantId)
    .in('student_id', studentIds)

  // Get missing assignments (past due, no submission)
  const now = new Date().toISOString()
  const { data: pastDueAssignments } = await supabase
    .from('assignments')
    .select(`
      id,
      course_id,
      due_date
    `)
    .eq('tenant_id', tenantId)
    .eq('status', 'assigned')
    .lt('due_date', now)

  // Get submissions for these students
  const { data: submissions } = await supabase
    .from('submissions')
    .select('assignment_id, student_id')
    .eq('tenant_id', tenantId)
    .in('student_id', studentIds)

  const submissionMap = new Map<string, Set<string>>()
  for (const sub of submissions ?? []) {
    if (!submissionMap.has(sub.student_id)) {
      submissionMap.set(sub.student_id, new Set())
    }
    submissionMap.get(sub.student_id)!.add(sub.assignment_id)
  }

  // Build enriched children array
  const children = relationships.map(rel => {
    const profile = (profiles ?? []).find(p => p.id === rel.student_id)
    const studentEnrollments = (enrollments ?? []).filter(e => e.student_id === rel.student_id)
    const studentAttendance = (attendanceRecords ?? []).filter(a => a.student_id === rel.student_id)
    const studentGrades = (grades ?? []).filter(g => g.student_id === rel.student_id)

    // Calculate attendance rate
    const totalAttendance = studentAttendance.length
    const presentCount = studentAttendance.filter(
      a => a.status === 'present' || a.status === 'online'
    ).length
    const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0

    // Calculate GPA (percentage average)
    const validGrades = studentGrades.filter(g => g.percentage != null)
    const gpa = validGrades.length > 0
      ? Math.round((validGrades.reduce((sum, g) => sum + Number(g.percentage), 0) / validGrades.length) * 10) / 10
      : 0

    // Count missing assignments (enrolled courses, past due, no submission)
    const enrolledCourseIds = new Set(studentEnrollments.map(e => (e as any).course_id))
    const studentSubmissions = submissionMap.get(rel.student_id) ?? new Set()
    const missingCount = (pastDueAssignments ?? []).filter(a =>
      enrolledCourseIds.has(a.course_id) && !studentSubmissions.has(a.id)
    ).length

    return {
      studentId: rel.student_id,
      relationship: rel.relationship,
      isPrimaryContact: rel.is_primary_contact,
      firstName: profile?.first_name ?? '',
      lastName: profile?.last_name ?? '',
      fullName: [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Student',
      avatarUrl: profile?.avatar_url,
      gradeLevel: profile?.grade_level,
      courseCount: studentEnrollments.length,
      attendanceRate,
      gpa,
      missingAssignments: missingCount,
    }
  })

  return children
}

// ---------------------------------------------------------------------------
// getChildGrades(studentId) - returns grades grouped by course
// ---------------------------------------------------------------------------

export async function getChildGrades(studentId: string) {
  const { supabase, tenantId } = await verifyParentAccess(studentId)

  const { data: gradeRecords, error } = await supabase
    .from('grades')
    .select(`
      id,
      points_earned,
      percentage,
      letter_grade,
      feedback,
      is_excused,
      is_extra_credit,
      graded_at,
      assignment_id,
      course_id,
      assignments (
        id,
        title,
        category,
        type,
        max_points,
        due_date
      ),
      courses (
        id,
        name,
        grading_policy
      )
    `)
    .eq('tenant_id', tenantId)
    .eq('student_id', studentId)
    .order('graded_at', { ascending: false })

  if (error) throw error

  // Group by course
  const courseMap = new Map<string, {
    courseId: string
    courseName: string
    gradingPolicy: any
    grades: typeof gradeRecords
    totalPercentage: number
    gradeCount: number
  }>()

  for (const grade of gradeRecords ?? []) {
    const course = grade.courses as any
    const courseId = grade.course_id
    if (!courseMap.has(courseId)) {
      courseMap.set(courseId, {
        courseId,
        courseName: course?.name ?? 'Unknown Course',
        gradingPolicy: course?.grading_policy,
        grades: [],
        totalPercentage: 0,
        gradeCount: 0,
      })
    }
    const entry = courseMap.get(courseId)!
    entry.grades.push(grade)
    if (grade.percentage != null && !grade.is_excused) {
      entry.totalPercentage += Number(grade.percentage)
      entry.gradeCount++
    }
  }

  // Compute per-course averages and letter grades
  const courseGrades = Array.from(courseMap.values()).map(entry => {
    const avgPercentage = entry.gradeCount > 0
      ? Math.round((entry.totalPercentage / entry.gradeCount) * 10) / 10
      : null

    const letterGrade = avgPercentage != null ? percentageToLetter(avgPercentage) : null

    // Group grades by assignment category
    const categoryMap = new Map<string, { total: number; count: number }>()
    for (const g of entry.grades) {
      const assignment = g.assignments as any
      const cat = assignment?.category || 'Uncategorized'
      if (!categoryMap.has(cat)) categoryMap.set(cat, { total: 0, count: 0 })
      if (g.percentage != null && !g.is_excused) {
        categoryMap.get(cat)!.total += Number(g.percentage)
        categoryMap.get(cat)!.count++
      }
    }

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      average: data.count > 0 ? Math.round((data.total / data.count) * 10) / 10 : null,
      count: data.count,
    }))

    return {
      courseId: entry.courseId,
      courseName: entry.courseName,
      averagePercentage: avgPercentage,
      letterGrade,
      categoryBreakdown,
      grades: entry.grades.map(g => {
        const assignment = g.assignments as any
        return {
          id: g.id,
          assignmentTitle: assignment?.title ?? 'Assignment',
          category: assignment?.category ?? 'Uncategorized',
          type: assignment?.type,
          maxPoints: assignment?.max_points,
          pointsEarned: g.points_earned,
          percentage: g.percentage,
          letterGrade: g.letter_grade,
          feedback: g.feedback,
          isExcused: g.is_excused,
          isExtraCredit: g.is_extra_credit,
          gradedAt: g.graded_at,
          dueDate: assignment?.due_date,
        }
      }),
    }
  })

  return courseGrades
}

// ---------------------------------------------------------------------------
// getChildAssignments(studentId) - returns assignments with status
// ---------------------------------------------------------------------------

export async function getChildAssignments(studentId: string) {
  const { supabase, tenantId } = await verifyParentAccess(studentId)

  // Get courses the student is enrolled in
  const { data: enrollmentData } = await supabase
    .from('course_enrollments')
    .select('course_id')
    .eq('tenant_id', tenantId)
    .eq('student_id', studentId)
    .eq('status', 'active')

  const courseIds = (enrollmentData ?? []).map(e => e.course_id)
  if (courseIds.length === 0) return []

  // Get assignments for those courses
  const { data: assignments, error } = await supabase
    .from('assignments')
    .select(`
      id,
      title,
      description,
      type,
      category,
      due_date,
      max_points,
      status,
      course_id,
      courses (
        id,
        name
      )
    `)
    .eq('tenant_id', tenantId)
    .in('course_id', courseIds)
    .in('status', ['assigned', 'closed'])
    .order('due_date', { ascending: true })

  if (error) throw error

  // Get submissions for this student
  const assignmentIds = (assignments ?? []).map(a => a.id)
  const { data: submissions } = await supabase
    .from('submissions')
    .select('id, assignment_id, status, submitted_at, submitted_late')
    .eq('tenant_id', tenantId)
    .eq('student_id', studentId)
    .in('assignment_id', assignmentIds)

  // Get grades for this student's submissions
  const { data: grades } = await supabase
    .from('grades')
    .select('assignment_id, percentage, letter_grade, points_earned')
    .eq('tenant_id', tenantId)
    .eq('student_id', studentId)
    .in('assignment_id', assignmentIds)

  const submissionMap = new Map(
    (submissions ?? []).map(s => [s.assignment_id, s])
  )
  const gradeMap = new Map(
    (grades ?? []).map(g => [g.assignment_id, g])
  )

  const now = new Date()

  const enrichedAssignments = (assignments ?? []).map(a => {
    const course = a.courses as any
    const submission = submissionMap.get(a.id)
    const grade = gradeMap.get(a.id)
    const dueDate = new Date(a.due_date)
    const isPastDue = dueDate < now

    let displayStatus: 'upcoming' | 'submitted' | 'missing' | 'graded' | 'late'
    if (grade) {
      displayStatus = 'graded'
    } else if (submission) {
      displayStatus = submission.submitted_late ? 'late' : 'submitted'
    } else if (isPastDue) {
      displayStatus = 'missing'
    } else {
      displayStatus = 'upcoming'
    }

    return {
      id: a.id,
      title: a.title,
      description: a.description,
      type: a.type,
      category: a.category,
      dueDate: a.due_date,
      maxPoints: a.max_points,
      courseId: a.course_id,
      courseName: course?.name ?? 'Course',
      status: displayStatus,
      submittedAt: submission?.submitted_at ?? null,
      grade: grade ? {
        percentage: grade.percentage,
        letterGrade: grade.letter_grade,
        pointsEarned: grade.points_earned,
      } : null,
    }
  })

  return enrichedAssignments
}

// ---------------------------------------------------------------------------
// getChildCourses(studentId) - returns courses the student is enrolled in
// ---------------------------------------------------------------------------

export async function getChildCourses(studentId: string) {
  const { supabase, tenantId } = await verifyParentAccess(studentId)

  const { data, error } = await supabase
    .from('course_enrollments')
    .select(`
      id,
      status,
      grade_letter,
      grade_numeric,
      enrolled_at,
      completed_at,
      course_id,
      teacher_id,
      courses (
        id,
        name,
        subject,
        grade_level,
        semester,
        created_by,
        status
      )
    `)
    .eq('tenant_id', tenantId)
    .eq('student_id', studentId)
    .order('enrolled_at', { ascending: false })

  if (error) throw error

  // Get teacher profiles
  const teacherIds = [...new Set((data ?? []).map(e => {
    const course = e.courses as any
    return e.teacher_id || course?.created_by
  }).filter(Boolean))]

  const { data: teacherProfiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .in('id', teacherIds)

  const teacherMap = new Map(
    (teacherProfiles ?? []).map(t => [t.id, `${t.first_name ?? ''} ${t.last_name ?? ''}`.trim()])
  )

  return (data ?? []).map(enrollment => {
    const course = enrollment.courses as any
    const teacherId = enrollment.teacher_id || course?.created_by
    return {
      enrollmentId: enrollment.id,
      courseId: enrollment.course_id,
      courseName: course?.name ?? 'Course',
      subject: course?.subject,
      gradeLevel: course?.grade_level,
      semester: course?.semester,
      teacherName: teacherMap.get(teacherId) ?? 'Unknown',
      enrollmentStatus: enrollment.status,
      gradeLetter: enrollment.grade_letter,
      gradeNumeric: enrollment.grade_numeric,
      enrolledAt: enrollment.enrolled_at,
      completedAt: enrollment.completed_at,
    }
  })
}

// ---------------------------------------------------------------------------
// getChildProgress(studentId) - returns overall academic progress summary
// ---------------------------------------------------------------------------

export async function getChildProgress(studentId: string) {
  const { supabase, tenantId } = await verifyParentAccess(studentId)

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url, grade_level')
    .eq('id', studentId)
    .single()

  // Get all grades
  const { data: allGrades } = await supabase
    .from('grades')
    .select('percentage, course_id, graded_at')
    .eq('tenant_id', tenantId)
    .eq('student_id', studentId)
    .order('graded_at', { ascending: true })

  // Get enrollment data
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('course_id, status, grade_numeric')
    .eq('tenant_id', tenantId)
    .eq('student_id', studentId)

  // Get attendance
  const { data: attendance } = await supabase
    .from('attendance_records')
    .select('status, attendance_date')
    .eq('tenant_id', tenantId)
    .eq('student_id', studentId)

  // Get XP / gamification level
  const { data: userLevel } = await supabase
    .from('student_xp')
    .select('total_xp, current_level, current_tier, streak_days, coins')
    .eq('tenant_id', tenantId)
    .eq('student_id', studentId)
    .single()

  // Calculate overall GPA
  const validGrades = (allGrades ?? []).filter(g => g.percentage != null)
  const overallGPA = validGrades.length > 0
    ? Math.round((validGrades.reduce((s, g) => s + Number(g.percentage), 0) / validGrades.length) * 10) / 10
    : null

  // Calculate attendance stats
  const attendanceRecords = attendance ?? []
  const totalDays = attendanceRecords.length
  const presentDays = attendanceRecords.filter(a => a.status === 'present' || a.status === 'online').length
  const absentDays = attendanceRecords.filter(a => a.status === 'absent').length
  const tardyDays = attendanceRecords.filter(a => a.status === 'tardy').length
  const excusedDays = attendanceRecords.filter(a => a.status === 'excused').length
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

  // Active vs completed courses
  const activeEnrollments = (enrollments ?? []).filter(e => e.status === 'active')
  const completedEnrollments = (enrollments ?? []).filter(e => e.status === 'completed')

  // Grade trend: last 10 grades
  const recentGrades = validGrades.slice(-10).map(g => ({
    percentage: Number(g.percentage),
    date: g.graded_at,
  }))

  return {
    student: {
      id: profile?.id ?? studentId,
      firstName: profile?.first_name ?? '',
      lastName: profile?.last_name ?? '',
      fullName: [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Student',
      avatarUrl: profile?.avatar_url,
      gradeLevel: profile?.grade_level,
    },
    academics: {
      overallGPA,
      overallLetterGrade: overallGPA != null ? percentageToLetter(overallGPA) : null,
      totalGrades: validGrades.length,
      activeCourses: activeEnrollments.length,
      completedCourses: completedEnrollments.length,
      recentGrades,
    },
    attendance: {
      totalDays,
      presentDays,
      absentDays,
      tardyDays,
      excusedDays,
      attendanceRate,
    },
    gamification: {
      totalXP: userLevel?.total_xp ?? 0,
      currentLevel: userLevel?.current_level ?? 1,
      currentTier: userLevel?.current_tier ?? 'awakening',
      streakDays: userLevel?.streak_days ?? 0,
      longestStreak: userLevel?.streak_days ?? 0,
      coins: userLevel?.coins ?? 0,
    },
  }
}

// ---------------------------------------------------------------------------
// Utility: convert percentage to letter grade
// ---------------------------------------------------------------------------

function percentageToLetter(pct: number): string {
  if (pct >= 97) return 'A+'
  if (pct >= 93) return 'A'
  if (pct >= 90) return 'A-'
  if (pct >= 87) return 'B+'
  if (pct >= 83) return 'B'
  if (pct >= 80) return 'B-'
  if (pct >= 77) return 'C+'
  if (pct >= 73) return 'C'
  if (pct >= 70) return 'C-'
  if (pct >= 67) return 'D+'
  if (pct >= 63) return 'D'
  if (pct >= 60) return 'D-'
  return 'F'
}
