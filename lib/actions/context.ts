'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { headers } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserRole } from '@/lib/auth/permissions'

export interface ActionContext {
  supabase: Awaited<ReturnType<typeof createClient>>
  user: { id: string; email?: string }
  tenantId: string
  role?: UserRole
}

export interface AdminActionContext {
  admin: SupabaseClient
  user: { id: string; email?: string }
  tenantId: string
}

export interface FullActionContext {
  supabase: Awaited<ReturnType<typeof createClient>>
  admin: SupabaseClient
  user: { id: string; email?: string }
  tenantId: string
}

/**
 * Get authenticated user context for server actions.
 * Throws if user is not authenticated or tenant is not resolved.
 */
export async function getActionContext(): Promise<ActionContext> {
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
}

/**
 * Get context with admin (service-role) client instead of the user-scoped client.
 * Used by plaza-store, plaza-games, and other actions that need to bypass RLS.
 */
export async function getAdminActionContext(): Promise<AdminActionContext> {
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

  const admin = createAdminClient()
  return { admin, user, tenantId }
}

/**
 * Get context with both user-scoped and admin clients.
 * Used by actions that need RLS-scoped queries AND privileged operations.
 */
export async function getFullActionContext(): Promise<FullActionContext> {
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

  const admin = createAdminClient()
  return { supabase, admin, user, tenantId }
}

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
