'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function getContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) throw new Error('No tenant context')
  return { supabase, user, tenantId }
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
  const { supabase, user, tenantId } = await getContext()

  const entries = records.map((r) => ({
    tenant_id: tenantId,
    course_id: courseId,
    student_id: r.studentId,
    recorded_by: user.id,
    date,
    status: r.status,
    notes: r.notes || null,
  }))

  // Upsert to handle re-recording for same date
  const { error } = await supabase
    .from('attendance_records')
    .upsert(entries, { onConflict: 'tenant_id,course_id,student_id,date' })

  if (error) throw error
  revalidatePath('/teacher/attendance')
}

// ---------------------------------------------------------------------------
// Teacher: Get Attendance
// ---------------------------------------------------------------------------

export async function getAttendanceForCourse(courseId: string, date?: string) {
  const { supabase, tenantId } = await getContext()

  let query = supabase
    .from('attendance_records')
    .select('*, profiles:student_id(full_name, avatar_url)')
    .eq('tenant_id', tenantId)
    .eq('course_id', courseId)
    .order('date', { ascending: false })

  if (date) {
    query = query.eq('date', date)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getAttendanceHistory(courseId: string, startDate: string, endDate: string) {
  const { supabase, tenantId } = await getContext()

  const { data, error } = await supabase
    .from('attendance_records')
    .select('*, profiles:student_id(full_name)')
    .eq('tenant_id', tenantId)
    .eq('course_id', courseId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  if (error) throw error
  return data ?? []
}

// ---------------------------------------------------------------------------
// Student/Parent: View Attendance
// ---------------------------------------------------------------------------

export async function getStudentAttendance(studentId?: string) {
  const { supabase, user, tenantId } = await getContext()

  const targetId = studentId || user.id

  const { data, error } = await supabase
    .from('attendance_records')
    .select('*, courses(title)')
    .eq('tenant_id', tenantId)
    .eq('student_id', targetId)
    .order('date', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

export async function getAttendanceSummary(studentId?: string) {
  const { supabase, user, tenantId } = await getContext()

  const targetId = studentId || user.id

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
