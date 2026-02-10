'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function getAdminContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  const role = headersList.get('x-user-role')
  if (!tenantId) throw new Error('No tenant context')
  if (role !== 'school_admin' && role !== 'super_admin') {
    throw new Error('Admin access required')
  }
  return { supabase, user, tenantId, role }
}

// ---------------------------------------------------------------------------
// User Management
// ---------------------------------------------------------------------------

export async function getTenantUsers(filters?: {
  search?: string
  role?: string
  status?: string
  limit?: number
  offset?: number
}) {
  const { supabase, tenantId } = await getAdminContext()

  let query = supabase
    .from('tenant_memberships')
    .select('*, profiles:user_id(id, full_name, email, avatar_url, created_at)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(filters?.limit ?? 50)

  if (filters?.role) {
    query = query.eq('role', filters.role)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters?.limit ?? 50) - 1)
  }

  const { data, error } = await query
  if (error) throw error

  let users = data ?? []

  // Client-side filter by search (name or email)
  if (filters?.search) {
    const search = filters.search.toLowerCase()
    users = users.filter((u: any) => {
      const name = (u.profiles?.full_name || '').toLowerCase()
      const email = (u.profiles?.email || '').toLowerCase()
      return name.includes(search) || email.includes(search)
    })
  }

  return users
}

export async function getUserDetail(userId: string) {
  const { supabase, tenantId } = await getAdminContext()

  const [membershipResult, profileResult, enrollmentsResult] = await Promise.all([
    supabase
      .from('tenant_memberships')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('user_id', userId)
      .single(),
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single(),
    supabase
      .from('course_enrollments')
      .select('*, courses(name)')
      .eq('student_id', userId)
      .eq('tenant_id', tenantId),
  ])

  return {
    membership: membershipResult.data,
    profile: profileResult.data,
    enrollments: enrollmentsResult.data ?? [],
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  const { supabase, tenantId } = await getAdminContext()

  const { error } = await supabase
    .from('tenant_memberships')
    .update({ role: newRole })
    .eq('tenant_id', tenantId)
    .eq('user_id', userId)

  if (error) throw error
  revalidatePath('/admin/users')
}

export async function deactivateUser(userId: string) {
  const { supabase, tenantId } = await getAdminContext()

  const { error } = await supabase
    .from('tenant_memberships')
    .update({ is_active: false })
    .eq('tenant_id', tenantId)
    .eq('user_id', userId)

  if (error) throw error
  revalidatePath('/admin/users')
}

// ---------------------------------------------------------------------------
// Class Management
// ---------------------------------------------------------------------------

export async function getTenantClasses(filters?: {
  search?: string
  status?: string
}) {
  const { supabase, tenantId } = await getAdminContext()

  let query = supabase
    .from('courses')
    .select('*, profiles:teacher_id(full_name, avatar_url), course_enrollments(count)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query
  if (error) throw error

  let classes = data ?? []

  if (filters?.search) {
    const search = filters.search.toLowerCase()
    classes = classes.filter((c: any) =>
      c.name?.toLowerCase().includes(search) ||
      c.subject?.toLowerCase().includes(search)
    )
  }

  return classes
}

// ---------------------------------------------------------------------------
// Reports & Analytics
// ---------------------------------------------------------------------------

export async function getDashboardStats() {
  const { supabase, tenantId } = await getAdminContext()

  const [
    userCountResult,
    courseCountResult,
    activeStudentsResult,
    recentLoginsResult,
  ] = await Promise.all([
    supabase
      .from('tenant_memberships')
      .select('role', { count: 'exact' })
      .eq('tenant_id', tenantId),

    supabase
      .from('courses')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId),

    supabase
      .from('tenant_memberships')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('role', 'student'),

    supabase
      .from('audit_logs')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('action', 'user.login')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ])

  // Count by role
  const memberships = userCountResult.data ?? []
  const roleCounts: Record<string, number> = {}
  for (const m of memberships) {
    const role = (m as any).role || 'unknown'
    roleCounts[role] = (roleCounts[role] || 0) + 1
  }

  return {
    totalUsers: memberships.length,
    roleCounts,
    totalCourses: courseCountResult.count ?? 0,
    totalStudents: activeStudentsResult.count ?? 0,
    weeklyLogins: recentLoginsResult.count ?? 0,
  }
}

export async function getEnrollmentTrends() {
  const { supabase, tenantId } = await getAdminContext()

  // Get enrollments from last 30 days grouped by date
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const { data } = await supabase
    .from('course_enrollments')
    .select('created_at')
    .eq('tenant_id', tenantId)
    .gte('created_at', thirtyDaysAgo)
    .order('created_at', { ascending: true })

  // Group by date
  const trends: Record<string, number> = {}
  for (const enrollment of data ?? []) {
    const date = new Date(enrollment.created_at).toISOString().split('T')[0]
    trends[date] = (trends[date] || 0) + 1
  }

  return trends
}

export async function getAttendanceReport() {
  const { supabase, tenantId } = await getAdminContext()

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const { data } = await supabase
    .from('attendance_records')
    .select('status, date')
    .eq('tenant_id', tenantId)
    .gte('date', sevenDaysAgo)

  const records = data ?? []
  const total = records.length
  const present = records.filter((r) => r.status === 'present' || r.status === 'online').length
  const absent = records.filter((r) => r.status === 'absent').length
  const tardy = records.filter((r) => r.status === 'tardy').length

  return {
    total,
    present,
    absent,
    tardy,
    attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0,
  }
}

// ---------------------------------------------------------------------------
// School Settings
// ---------------------------------------------------------------------------

export async function getTenantSettings() {
  const { supabase, tenantId } = await getAdminContext()

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .single()

  if (error) throw error
  return data
}

export async function updateTenantSettings(settings: {
  name?: string
  logo_url?: string
  settings?: Record<string, unknown>
}) {
  const { supabase, tenantId } = await getAdminContext()

  const { error } = await supabase
    .from('tenants')
    .update(settings)
    .eq('id', tenantId)

  if (error) throw error
  revalidatePath('/admin/settings')
}
