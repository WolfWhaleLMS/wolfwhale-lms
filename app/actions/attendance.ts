'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logAuditEvent } from '@/lib/compliance/audit-logger'
import { rateLimitAction } from '@/lib/rate-limit-action'

async function getContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) throw new Error('No tenant context')
  return { supabase, user, tenantId }
}

async function getUserRole(supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never, userId: string, tenantId: string) {
  const { data: membership } = await supabase
    .from('tenant_memberships')
    .select('role')
    .eq('user_id', userId)
    .eq('tenant_id', tenantId)
    .eq('status', 'active')
    .single()
  return membership?.role ?? null
}

type AttendanceStatus = 'present' | 'absent' | 'tardy' | 'excused' | 'online'

// ---------------------------------------------------------------------------
// Teacher: Record Attendance
// ---------------------------------------------------------------------------

export async function recordAttendance(
  courseId: string,
  date: string,
  records: { studentId: string; status: AttendanceStatus; notes?: string }[]
) {
  if (!z.string().uuid().safeParse(courseId).success) {
    throw new Error('Invalid ID')
  }

  const rl = await rateLimitAction('recordAttendance')
  if (!rl.success) throw new Error(rl.error ?? 'Too many requests')

  const { supabase, user, tenantId } = await getContext()

  // Verify caller is the course teacher or an admin/super_admin
  const role = await getUserRole(supabase, user.id, tenantId)
  if (!role) throw new Error('Not authorized')

  if (role === 'admin' || role === 'super_admin') {
    // Admins can record attendance for any course in the tenant
  } else {
    // Teachers can only record attendance for their own courses
    const { data: course } = await supabase
      .from('courses')
      .select('created_by')
      .eq('id', courseId)
      .eq('tenant_id', tenantId)
      .single()

    if (!course || course.created_by !== user.id) {
      throw new Error('Not authorized - you can only record attendance for your own courses')
    }
  }

  const entries = records.map((r) => ({
    tenant_id: tenantId,
    course_id: courseId,
    student_id: r.studentId,
    recorded_by: user.id,
    attendance_date: date,
    status: r.status,
    notes: r.notes || null,
  }))

  // Upsert to handle re-recording for same date
  const { error } = await supabase
    .from('attendance_records')
    .upsert(entries, { onConflict: 'tenant_id,course_id,student_id,attendance_date' })

  if (error) throw error

  await logAuditEvent({
    action: 'attendance.record',
    resourceType: 'attendance',
    resourceId: courseId,
    details: { date, recordCount: records.length },
  })

  revalidatePath('/teacher/attendance')
}

// ---------------------------------------------------------------------------
// Teacher: Get Attendance
// ---------------------------------------------------------------------------

export async function getAttendanceForCourse(courseId: string, date?: string) {
  if (!z.string().uuid().safeParse(courseId).success) {
    return []
  }

  const { supabase, user, tenantId } = await getContext()

  // Verify caller is the course teacher or an admin/super_admin
  const role = await getUserRole(supabase, user.id, tenantId)
  if (!role) throw new Error('Not authorized')

  if (role !== 'admin' && role !== 'super_admin') {
    const { data: course } = await supabase
      .from('courses')
      .select('created_by')
      .eq('id', courseId)
      .eq('tenant_id', tenantId)
      .single()

    if (!course || course.created_by !== user.id) {
      throw new Error('Not authorized to view attendance for this course')
    }
  }

  let query = supabase
    .from('attendance_records')
    .select('*, profiles:student_id(full_name, avatar_url)')
    .eq('tenant_id', tenantId)
    .eq('course_id', courseId)
    .order('attendance_date', { ascending: false })

  if (date) {
    query = query.eq('attendance_date', date)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getAttendanceHistory(courseId: string, startDate: string, endDate: string) {
  if (!z.string().uuid().safeParse(courseId).success) {
    return []
  }

  const { supabase, user, tenantId } = await getContext()

  // Verify caller is the course teacher or an admin/super_admin
  const role = await getUserRole(supabase, user.id, tenantId)
  if (!role) throw new Error('Not authorized')

  if (role !== 'admin' && role !== 'super_admin') {
    const { data: course } = await supabase
      .from('courses')
      .select('created_by')
      .eq('id', courseId)
      .eq('tenant_id', tenantId)
      .single()

    if (!course || course.created_by !== user.id) {
      throw new Error('Not authorized to view attendance history for this course')
    }
  }

  const { data, error } = await supabase
    .from('attendance_records')
    .select('*, profiles:student_id(full_name)')
    .eq('tenant_id', tenantId)
    .eq('course_id', courseId)
    .gte('attendance_date', startDate)
    .lte('attendance_date', endDate)
    .order('attendance_date', { ascending: true })

  if (error) throw error
  return data ?? []
}

// ---------------------------------------------------------------------------
// Student/Parent: View Attendance
// ---------------------------------------------------------------------------

export async function getStudentAttendance(studentId?: string) {
  if (studentId && !z.string().uuid().safeParse(studentId).success) {
    return []
  }

  const { supabase, user, tenantId } = await getContext()

  const targetId = studentId || user.id

  // If viewing another student's attendance, verify authorization
  if (targetId !== user.id) {
    const role = await getUserRole(supabase, user.id, tenantId)
    if (!role) throw new Error('Not authorized')

    if (role === 'parent') {
      // Parents can only view their linked children's attendance
      const { data: parentLink } = await supabase
        .from('student_parents')
        .select('id')
        .eq('parent_id', user.id)
        .eq('student_id', targetId)
        .eq('status', 'active')
        .maybeSingle()

      if (!parentLink) {
        throw new Error('Not authorized to view this student\'s attendance')
      }
    } else if (role === 'teacher') {
      const { data: sharedCourses } = await supabase
        .from('courses')
        .select('id, course_enrollments!inner(student_id)')
        .eq('created_by', user.id)
        .eq('tenant_id', tenantId)
        .eq('course_enrollments.student_id', targetId)
        .limit(1)

      if (!sharedCourses || sharedCourses.length === 0) {
        throw new Error('Not authorized to view this student\'s attendance')
      }
    } else if (!['admin', 'super_admin'].includes(role)) {
      throw new Error('Not authorized to view this student\'s attendance')
    }
  }

  const { data, error } = await supabase
    .from('attendance_records')
    .select('*, courses(name)')
    .eq('tenant_id', tenantId)
    .eq('student_id', targetId)
    .order('attendance_date', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

export async function getAttendanceSummary(studentId?: string) {
  if (studentId && !z.string().uuid().safeParse(studentId).success) {
    return { total: 0, present: 0, absent: 0, tardy: 0, excused: 0, rate: 0 }
  }

  const { supabase, user, tenantId } = await getContext()

  const targetId = studentId || user.id

  // If viewing another student's summary, verify authorization
  if (targetId !== user.id) {
    const role = await getUserRole(supabase, user.id, tenantId)
    if (!role) throw new Error('Not authorized')

    if (role === 'parent') {
      const { data: parentLink } = await supabase
        .from('student_parents')
        .select('id')
        .eq('parent_id', user.id)
        .eq('student_id', targetId)
        .eq('status', 'active')
        .maybeSingle()

      if (!parentLink) {
        throw new Error('Not authorized to view this student\'s attendance summary')
      }
    } else if (role === 'teacher') {
      const { data: sharedCourses } = await supabase
        .from('courses')
        .select('id, course_enrollments!inner(student_id)')
        .eq('created_by', user.id)
        .eq('tenant_id', tenantId)
        .eq('course_enrollments.student_id', targetId)
        .limit(1)

      if (!sharedCourses || sharedCourses.length === 0) {
        throw new Error('Not authorized to view this student\'s attendance summary')
      }
    } else if (!['admin', 'super_admin'].includes(role)) {
      throw new Error('Not authorized to view this student\'s attendance summary')
    }
  }

  const { data, error } = await supabase
    .from('attendance_records')
    .select('status')
    .eq('tenant_id', tenantId)
    .eq('student_id', targetId)

  if (error) throw error

  const records = data ?? []
  const total = records.length
  const present = records.filter((r) => r.status === 'present' || r.status === 'online').length
  const absent = records.filter((r) => r.status === 'absent').length
  const tardy = records.filter((r) => r.status === 'tardy').length
  const excused = records.filter((r) => r.status === 'excused').length
  const rate = total > 0 ? Math.round((present / total) * 100) : 0

  return { total, present, absent, tardy, excused, rate }
}
