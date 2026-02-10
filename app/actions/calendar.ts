'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'assignment' | 'attendance' | 'quiz' | 'study' | 'announcement'
  courseId?: string
  courseName?: string
  link?: string
}

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

export async function getCalendarEvents(
  startDate: string,
  endDate: string
): Promise<CalendarEvent[]> {
  const { supabase, user, tenantId, role } = await getContext()
  const events: CalendarEvent[] = []

  // Get courses the user is involved with
  let courseIds: string[] = []
  let courseNames: Record<string, string> = {}

  if (role === 'student') {
    const { data: enrollments } = await supabase
      .from('course_enrollments')
      .select('course_id, courses(id, name)')
      .eq('tenant_id', tenantId)
      .eq('student_id', user.id)
      .eq('status', 'active')

    for (const e of enrollments ?? []) {
      const course = e.courses as any
      if (course) {
        courseIds.push(course.id)
        courseNames[course.id] = course.name
      }
    }
  } else if (role === 'teacher') {
    const { data: courses } = await supabase
      .from('courses')
      .select('id, name')
      .eq('tenant_id', tenantId)
      .eq('created_by', user.id)
      .eq('status', 'active')

    for (const c of courses ?? []) {
      courseIds.push(c.id)
      courseNames[c.id] = c.name
    }
  } else if (role === 'parent') {
    const { data: children } = await supabase
      .from('student_parents')
      .select('student_id')
      .eq('parent_id', user.id)
      .eq('tenant_id', tenantId)
      .eq('status', 'active')

    const childIds = (children ?? []).map(c => c.student_id)
    if (childIds.length > 0) {
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('course_id, courses(id, name)')
        .eq('tenant_id', tenantId)
        .in('student_id', childIds)
        .eq('status', 'active')

      for (const e of enrollments ?? []) {
        const course = e.courses as any
        if (course && !courseIds.includes(course.id)) {
          courseIds.push(course.id)
          courseNames[course.id] = course.name
        }
      }
    }
  } else {
    // admin / super_admin - all courses
    const { data: courses } = await supabase
      .from('courses')
      .select('id, name')
      .eq('tenant_id', tenantId)
      .eq('status', 'active')

    for (const c of courses ?? []) {
      courseIds.push(c.id)
      courseNames[c.id] = c.name
    }
  }

  if (courseIds.length === 0) return events

  // Fetch all event types in parallel
  const [assignmentRes, attendanceRes, studyRes, announcementRes] = await Promise.all([
    // Assignments with due dates in range
    supabase
      .from('assignments')
      .select('id, title, course_id, due_date')
      .in('course_id', courseIds)
      .gte('due_date', startDate)
      .lte('due_date', endDate)
      .in('status', ['assigned', 'draft']),

    // Attendance records in range (student sees own, teacher/admin sees all)
    role === 'student'
      ? supabase
          .from('attendance_records')
          .select('id, course_id, attendance_date, status')
          .eq('student_id', user.id)
          .in('course_id', courseIds)
          .gte('attendance_date', startDate)
          .lte('attendance_date', endDate)
      : supabase
          .from('attendance_records')
          .select('id, course_id, attendance_date, status')
          .in('course_id', courseIds)
          .gte('attendance_date', startDate)
          .lte('attendance_date', endDate)
          .limit(200),

    // Study sessions in range (own only)
    supabase
      .from('study_sessions')
      .select('id, duration_minutes, started_at, completed')
      .eq('user_id', user.id)
      .eq('tenant_id', tenantId)
      .gte('started_at', startDate)
      .lte('started_at', endDate),

    // Announcements in range
    supabase
      .from('announcements')
      .select('id, title, course_id, published_at')
      .eq('tenant_id', tenantId)
      .eq('status', 'published')
      .gte('published_at', startDate)
      .lte('published_at', endDate),
  ])

  // Map assignments
  for (const a of assignmentRes.data ?? []) {
    events.push({
      id: `asgn-${a.id}`,
      title: a.title,
      date: a.due_date,
      type: 'assignment',
      courseId: a.course_id,
      courseName: courseNames[a.course_id],
      link: role === 'student'
        ? `/student/assignments/${a.id}`
        : `/teacher/courses/${a.course_id}/assignments`,
    })
  }

  // Map attendance
  const attendanceDates = new Map<string, { present: number; absent: number; tardy: number }>()
  for (const att of attendanceRes.data ?? []) {
    const dateKey = att.attendance_date
    const entry = attendanceDates.get(dateKey) ?? { present: 0, absent: 0, tardy: 0 }
    if (att.status === 'present' || att.status === 'online') entry.present++
    else if (att.status === 'absent') entry.absent++
    else if (att.status === 'tardy') entry.tardy++
    attendanceDates.set(dateKey, entry)
  }
  for (const [date, counts] of attendanceDates) {
    const total = counts.present + counts.absent + counts.tardy
    const label = role === 'student'
      ? counts.present > 0 ? 'Present' : counts.tardy > 0 ? 'Tardy' : 'Absent'
      : `Attendance: ${counts.present}/${total} present`
    events.push({
      id: `att-${date}`,
      title: label,
      date,
      type: 'attendance',
      link: role === 'student' ? '/student/attendance' : '/admin/attendance',
    })
  }

  // Map study sessions
  for (const s of studyRes.data ?? []) {
    events.push({
      id: `study-${s.id}`,
      title: `Study session (${s.duration_minutes}min)${s.completed ? ' - completed' : ''}`,
      date: s.started_at.split('T')[0],
      type: 'study',
      link: '/student/study-mode',
    })
  }

  // Map announcements
  for (const ann of announcementRes.data ?? []) {
    events.push({
      id: `ann-${ann.id}`,
      title: ann.title,
      date: ann.published_at.split('T')[0],
      type: 'announcement',
      courseId: ann.course_id ?? undefined,
      courseName: ann.course_id ? courseNames[ann.course_id] : 'School-wide',
      link: '/announcements',
    })
  }

  return events
}
