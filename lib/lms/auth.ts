import type { SchoolRole } from '@/lib/school-launch/role-surfaces'
import { getSupabaseBrowserEnv } from '@/lib/supabase/env'

export { getSupabaseBrowserEnv }

export type MembershipRole = 'student' | 'teacher' | 'parent' | 'admin' | 'super_admin'
export type LmsRouteRole = SchoolRole

const routeRoles = new Set<LmsRouteRole>(['student', 'teacher', 'admin', 'guardian'])

export function normalizeMembershipRole(role: string | null | undefined): LmsRouteRole | null {
  if (role === 'student' || role === 'teacher' || role === 'admin') return role
  if (role === 'parent') return 'guardian'
  if (role === 'super_admin') return 'admin'

  return null
}

export function rolePathForMembershipRole(role: string | null | undefined) {
  const normalized = normalizeMembershipRole(role)

  return normalized ? `/${normalized}` : '/login'
}

export function isLmsRouteRole(value: string | null | undefined): value is LmsRouteRole {
  return Boolean(value && routeRoles.has(value as LmsRouteRole))
}

export function roleFromPath(pathname: string): LmsRouteRole | null {
  const firstSegment = pathname.split('/').filter(Boolean)[0]

  return isLmsRouteRole(firstSegment) ? firstSegment : null
}

export function isSafeAuthRedirectPath(value: string | null | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return false
  if (value.includes('..')) return false

  try {
    const url = new URL(value, 'https://wolfwhale.local')
    const role = roleFromPath(url.pathname)

    return Boolean(role && (url.pathname === `/${role}` || url.pathname.startsWith(`/${role}/`)))
  } catch {
    return false
  }
}

export function safeAuthRedirectPath(value: string | null | undefined, fallback: string) {
  return isSafeAuthRedirectPath(value) ? value ?? fallback : fallback
}
