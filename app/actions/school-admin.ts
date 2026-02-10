'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

async function getAdminContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  const role = headersList.get('x-user-role')
  if (!tenantId) throw new Error('No tenant context')
  if (role !== 'admin' && role !== 'super_admin') {
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

export async function getSeatUsage() {
  const { supabase, tenantId } = await getAdminContext()

  // Get tenant's max_users limit
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('max_users, name, subscription_plan')
    .eq('id', tenantId)
    .single()

  if (tenantError) throw tenantError

  // Count current memberships
  const { count, error: countError } = await supabase
    .from('tenant_memberships')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)

  if (countError) throw countError

  const maxUsers = tenant?.max_users ?? 50
  const currentUsers = count ?? 0

  return {
    currentUsers,
    maxUsers,
    tenantName: tenant?.name ?? '',
    plan: tenant?.subscription_plan ?? 'starter',
    remaining: Math.max(0, maxUsers - currentUsers),
    isAtLimit: currentUsers >= maxUsers,
  }
}

export async function createUser(formData: {
  first_name: string
  last_name: string
  email: string
  password: string
  role: string
  grade_level?: string
}) {
  const { tenantId } = await getAdminContext()
  const adminSupabase = createAdminClient()

  // 1. Check seat limit
  const { data: tenant, error: tenantError } = await adminSupabase
    .from('tenants')
    .select('max_users, name')
    .eq('id', tenantId)
    .single()

  if (tenantError) {
    return { success: false, error: 'Failed to load tenant information.' }
  }

  const maxUsers = tenant?.max_users ?? 50

  const { count: currentCount, error: countError } = await adminSupabase
    .from('tenant_memberships')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)

  if (countError) {
    return { success: false, error: 'Failed to check user count.' }
  }

  if ((currentCount ?? 0) >= maxUsers) {
    return {
      success: false,
      error: `Your school has reached its user limit of ${maxUsers}. Please upgrade your plan to add more users.`,
    }
  }

  // 2. Validate role
  const validRoles = ['student', 'teacher', 'parent', 'admin']
  if (!validRoles.includes(formData.role)) {
    return { success: false, error: 'Invalid role selected.' }
  }

  // 3. Create auth user via Supabase Admin API
  const { data: newUser, error: authError } = await adminSupabase.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    email_confirm: true,
    user_metadata: {
      first_name: formData.first_name,
      last_name: formData.last_name,
      full_name: `${formData.first_name} ${formData.last_name}`.trim(),
    },
  })

  if (authError) {
    // Handle duplicate email
    if (authError.message?.includes('already been registered') || authError.message?.includes('already exists')) {
      return { success: false, error: 'A user with this email already exists.' }
    }
    return { success: false, error: authError.message || 'Failed to create user.' }
  }

  if (!newUser?.user) {
    return { success: false, error: 'User creation returned no data.' }
  }

  // 4. The handle_new_user trigger creates the profile automatically.
  //    Update grade_level if provided (for students).
  if (formData.grade_level && formData.role === 'student') {
    await adminSupabase
      .from('profiles')
      .update({ grade_level: formData.grade_level })
      .eq('id', newUser.user.id)
  }

  // 5. Create tenant_membership linking user to this tenant with the selected role
  const { error: membershipError } = await adminSupabase
    .from('tenant_memberships')
    .insert({
      tenant_id: tenantId,
      user_id: newUser.user.id,
      role: formData.role,
      status: 'active',
    })

  if (membershipError) {
    // Attempt cleanup: delete the auth user if membership fails
    await adminSupabase.auth.admin.deleteUser(newUser.user.id)
    return { success: false, error: 'Failed to assign user to school. ' + membershipError.message }
  }

  revalidatePath('/admin/users')
  revalidatePath('/admin/dashboard')

  return {
    success: true,
    userId: newUser.user.id,
    message: `${formData.first_name} ${formData.last_name} has been added as a ${formData.role}.`,
  }
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
    .select('*, profiles:created_by(full_name, avatar_url), course_enrollments(count)')
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
    .select('status, attendance_date')
    .eq('tenant_id', tenantId)
    .gte('attendance_date', sevenDaysAgo)

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
