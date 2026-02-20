'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath, updateTag } from 'next/cache'
import { cachedQuery } from '@/lib/cache'
import { rateLimitAction } from '@/lib/rate-limit-action'
import { logAuditEvent } from '@/lib/compliance/audit-logger'
import { sanitizeText } from '@/lib/sanitize'

async function getAdminContext() {
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

  if (!membership || !['admin', 'super_admin'].includes(membership.role)) {
    throw new Error('Admin access required')
  }

  return { supabase, user, tenantId, role: membership.role }
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

  // Query tenant_memberships and profiles separately, then merge in JS.
  // PostgREST cannot follow tenant_memberships.user_id -> profiles because
  // the FK points to auth.users, not profiles.
  const limit = filters?.limit ?? 50

  let query = supabase
    .from('tenant_memberships')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('joined_at', { ascending: false })
    .limit(limit)

  if (filters?.role) {
    query = query.eq('role', filters.role)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + limit - 1)
  }

  const { data: memberships, error } = await query
  if (error) throw error

  if (!memberships || memberships.length === 0) return []

  // Fetch profiles for the user_ids we got
  const userIds = memberships.map((m) => (m as { user_id: string }).user_id).filter(Boolean)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, first_name, last_name, avatar_url, grade_level')
    .in('id', userIds)

  type ProfileRecord = { id: string; full_name: string | null; first_name: string | null; last_name: string | null; avatar_url: string | null; grade_level: string | null }
  const profilesMap: Record<string, ProfileRecord> = {}
  for (const p of profiles ?? []) {
    profilesMap[p.id] = p
  }

  // Merge and apply search filter (search is done in JS since it spans two tables)
  let results = memberships.map((m) => {
    const membership = m as { user_id: string; [key: string]: unknown }
    return {
      ...membership,
      profiles: profilesMap[membership.user_id] ?? null,
    }
  })

  if (filters?.search) {
    const search = filters.search.toLowerCase()
    results = results.filter((r) => {
      const name = ((r.profiles as ProfileRecord | null)?.full_name || '').toLowerCase()
      return name.includes(search)
    })
  }

  return results
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

const updateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  newRole: z.enum(['student', 'teacher', 'parent', 'admin']),
})

export async function updateUserRole(userId: string, newRole: string) {
  // Validate inputs with Zod
  const parsed = updateUserRoleSchema.safeParse({ userId, newRole })
  if (!parsed.success) {
    throw new Error('Invalid input: ' + parsed.error.issues[0].message)
  }

  const { supabase, user, tenantId, role: callerRole } = await getAdminContext()

  // Prevent self-role-change
  if (userId === user.id) {
    throw new Error('You cannot change your own role.')
  }

  // Only super_admin can promote someone to admin
  if (parsed.data.newRole === 'admin' && callerRole !== 'super_admin') {
    throw new Error('Only super admins can assign the admin role.')
  }

  const { error } = await supabase
    .from('tenant_memberships')
    .update({ role: parsed.data.newRole })
    .eq('tenant_id', tenantId)
    .eq('user_id', parsed.data.userId)

  if (error) throw error

  await logAuditEvent({
    action: 'user.update',
    resourceType: 'user_role',
    resourceId: parsed.data.userId,
    details: { newRole: parsed.data.newRole, changedBy: user.id },
  })

  revalidatePath('/admin/users')
  updateTag('dashboard-stats')
}

export async function deactivateUser(userId: string) {
  const parsed = z.object({ userId: z.string().uuid() }).safeParse({ userId })
  if (!parsed.success) throw new Error('Invalid input')

  const { supabase, user, tenantId } = await getAdminContext()

  if (userId === user.id) {
    throw new Error('You cannot deactivate your own account.')
  }

  const { error } = await supabase
    .from('tenant_memberships')
    .update({ status: 'suspended' })
    .eq('tenant_id', tenantId)
    .eq('user_id', userId)

  if (error) throw error

  await logAuditEvent({
    action: 'user.delete',
    resourceType: 'user',
    resourceId: userId,
    details: { action: 'deactivated', deactivatedBy: user.id },
  })

  revalidatePath('/admin/users')
  updateTag('dashboard-stats')
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
  const createUserSchema = z.object({
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100),
    email: z.string().email().max(255),
    password: z.string().min(10).max(128)
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one digit'),
    role: z.enum(['student', 'teacher', 'parent', 'admin']),
    grade_level: z.string().max(50).optional(),
  })
  const parsed = createUserSchema.safeParse(formData)
  if (!parsed.success) return { success: false, error: 'Invalid input: ' + parsed.error.issues[0].message }

  const rl = await rateLimitAction('createUser')
  if (!rl.success) return { success: false, error: rl.error }

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

  await logAuditEvent({
    action: 'user.create',
    resourceType: 'user',
    resourceId: newUser.user.id,
    details: { role: formData.role },
  })

  revalidatePath('/admin/users')
  revalidatePath('/admin/dashboard')
  updateTag('dashboard-stats')

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
    classes = classes.filter((c) =>
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
  const { tenantId } = await getAdminContext()

  return cachedQuery(
    async () => {
      const supabase = createAdminClient()

      const [
        studentCount,
        teacherCount,
        parentCount,
        adminCount,
        totalUserCount,
        courseCountResult,
        recentLoginsResult,
      ] = await Promise.all([
        supabase
          .from('tenant_memberships')
          .select('id', { count: 'exact', head: true })
          .eq('tenant_id', tenantId)
          .eq('role', 'student')
          .eq('status', 'active'),
        supabase
          .from('tenant_memberships')
          .select('id', { count: 'exact', head: true })
          .eq('tenant_id', tenantId)
          .eq('role', 'teacher')
          .eq('status', 'active'),
        supabase
          .from('tenant_memberships')
          .select('id', { count: 'exact', head: true })
          .eq('tenant_id', tenantId)
          .eq('role', 'parent')
          .eq('status', 'active'),
        supabase
          .from('tenant_memberships')
          .select('id', { count: 'exact', head: true })
          .eq('tenant_id', tenantId)
          .in('role', ['admin', 'super_admin'])
          .eq('status', 'active'),
        supabase
          .from('tenant_memberships')
          .select('id', { count: 'exact', head: true })
          .eq('tenant_id', tenantId),
        supabase
          .from('courses')
          .select('id', { count: 'exact', head: true })
          .eq('tenant_id', tenantId),
        supabase
          .from('audit_logs')
          .select('id', { count: 'exact', head: true })
          .eq('tenant_id', tenantId)
          .eq('action', 'user.login')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      ])

      const roleCounts: Record<string, number> = {
        student: studentCount.count ?? 0,
        teacher: teacherCount.count ?? 0,
        parent: parentCount.count ?? 0,
        admin: adminCount.count ?? 0,
      }

      return {
        totalUsers: totalUserCount.count ?? 0,
        roleCounts,
        totalCourses: courseCountResult.count ?? 0,
        totalStudents: studentCount.count ?? 0,
        weeklyLogins: recentLoginsResult.count ?? 0,
      }
    },
    ['dashboard-stats', tenantId],
    { revalidate: 60, tags: ['dashboard-stats'] }
  )
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
  const { tenantId } = await getAdminContext()

  return cachedQuery(
    async () => {
      const supabase = createAdminClient()
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
    },
    ['attendance-report', tenantId],
    { revalidate: 60, tags: ['attendance-report'] }
  )
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
  const updateSettingsSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    logo_url: z.string().url().max(2000).optional(),
    settings: z.record(z.unknown()).optional(),
  })
  const parsed = updateSettingsSchema.safeParse(settings)
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, tenantId } = await getAdminContext()

  // Sanitize the name field if present
  const sanitizedData = { ...parsed.data }
  if (sanitizedData.name) {
    sanitizedData.name = sanitizeText(sanitizedData.name)
  }

  const { error } = await supabase
    .from('tenants')
    .update(sanitizedData)
    .eq('id', tenantId)

  if (error) throw error

  await logAuditEvent({
    action: 'settings.update',
    resourceType: 'tenant',
    resourceId: tenantId,
    details: { updatedFields: Object.keys(parsed.data) },
  })

  revalidatePath('/admin/settings')
}
