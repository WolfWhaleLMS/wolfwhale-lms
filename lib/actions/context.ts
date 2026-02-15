'use server'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import type { UserRole } from '@/lib/auth/permissions'

export interface ActionContext {
  supabase: Awaited<ReturnType<typeof createClient>>
  user: { id: string; email?: string }
  tenantId: string
  role?: UserRole
}

/**
 * Get authenticated user context for server actions.
 * Throws if user is not authenticated or tenant is not resolved.
 */
export const getActionContext = cache(async (): Promise<ActionContext> => {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Not authenticated')
  }

  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  if (!tenantId) {
    throw new Error('No tenant context')
  }

  const role = headersList.get('x-user-role') as UserRole | null

  return { supabase, user, tenantId, role: role || undefined }
})

/**
 * Get context with role verification.
 * Throws if user doesn't have one of the required roles.
 */
export async function requireRole(...roles: UserRole[]): Promise<ActionContext> {
  const ctx = await getActionContext()

  if (!ctx.role || !roles.includes(ctx.role)) {
    throw new Error('Insufficient permissions')
  }

  return ctx
}

/**
 * Require teacher, admin, or super_admin role.
 */
export async function requireTeacher(): Promise<ActionContext> {
  return requireRole('teacher', 'admin', 'super_admin')
}

/**
 * Require admin or super_admin role.
 */
export async function requireAdmin(): Promise<ActionContext> {
  return requireRole('admin', 'super_admin')
}
