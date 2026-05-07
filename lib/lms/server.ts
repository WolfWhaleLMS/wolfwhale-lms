import { redirect } from 'next/navigation'
import type { SupabaseClient } from '@supabase/supabase-js'
import { buildLmsDashboardViews } from '@/lib/lms/read-model'
import { normalizeMembershipRole, type LmsRouteRole } from '@/lib/lms/auth'
import { loadLmsRecordsForUser } from '@/lib/lms/queries'
import { createClient } from '@/lib/supabase/server'

const rolePriority: LmsRouteRole[] = ['admin', 'teacher', 'student', 'guardian']

function routeRoleForMembership(role: string) {
  return normalizeMembershipRole(role)
}

function activeRouteRolesForUser(records: Awaited<ReturnType<typeof loadLmsRecordsForUser>>, userId: string) {
  return new Set(
    records.memberships
      .filter((membership) => membership.userId === userId && membership.status === 'active')
      .map((membership) => routeRoleForMembership(membership.role))
      .filter((role): role is LmsRouteRole => Boolean(role))
  )
}

export async function loadLmsDashboardView<Role extends LmsRouteRole>(role: Role) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect(`/login?next=/${role}`)
  }

  let records: Awaited<ReturnType<typeof loadLmsRecordsForUser>>

  try {
    records = await loadLmsRecordsForUser(supabase, user.id)
  } catch {
    redirect('/login?error=lms-access-required')
  }

  const activeRoles = activeRouteRolesForUser(records, user.id)

  if (!activeRoles.has(role)) {
    const fallbackRole = rolePriority.find((candidate) => activeRoles.has(candidate))
    redirect(fallbackRole ? `/${fallbackRole}` : '/login?error=lms-role-required')
  }

  return buildLmsDashboardViews(records)[role]
}

export async function loadDashboardForCurrentUser(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication is required.')
  }

  const records = await loadLmsRecordsForUser(supabase, user.id)
  const activeRoles = activeRouteRolesForUser(records, user.id)
  const role = rolePriority.find((candidate) => activeRoles.has(candidate))

  if (!role) {
    throw new Error('Signed-in user has no LMS role.')
  }

  return {
    role,
    records,
    views: buildLmsDashboardViews(records),
  }
}
