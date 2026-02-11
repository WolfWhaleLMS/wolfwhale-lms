import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export type AuditAction =
  | 'user.login'
  | 'user.logout'
  | 'user.create'
  | 'user.update'
  | 'user.delete'
  | 'grade.create'
  | 'grade.update'
  | 'grade.delete'
  | 'grade.view'
  | 'attendance.record'
  | 'attendance.update'
  | 'course.create'
  | 'course.update'
  | 'course.delete'
  | 'submission.grade'
  | 'submission.view'
  | 'message.send'
  | 'message.delete'
  | 'settings.update'
  | 'data.export'
  | 'data.access'
  | 'admin.action'

interface AuditLogEntry {
  action: AuditAction
  resourceType?: string
  resourceId?: string
  details?: Record<string, unknown>
  ipAddress?: string
}

/**
 * Log an audit event. Call this from server actions/API routes.
 * Non-throwing — silently catches errors to avoid breaking the main flow.
 */
export async function logAuditEvent(entry: AuditLogEntry) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const headersList = await headers()
    const tenantId = headersList.get('x-tenant-id')

    await supabase.from('audit_logs').insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: entry.action,
      resource_type: entry.resourceType || null,
      resource_id: entry.resourceId || null,
      details: entry.details || null,
      ip_address: entry.ipAddress || headersList.get('x-forwarded-for') || null,
      created_at: new Date().toISOString(),
    })
  } catch {
    // Audit logging should never break the application
    console.error('[audit] Failed to log event:', entry.action)
  }
}

/**
 * Query audit logs (admin only).
 */
export async function getAuditLogs(filters?: {
  userId?: string
  action?: string
  startDate?: string
  endDate?: string
  limit?: number
}) {
  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !tenantId) return []

  const { data: membership } = await supabase
    .from('tenant_memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .eq('status', 'active')
    .single()

  if (!membership || !['admin', 'super_admin'].includes(membership.role)) {
    return []
  }

  let query = supabase
    .from('audit_logs')
    .select('*, profiles:user_id(full_name, avatar_url)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(filters?.limit ?? 50)

  if (filters?.userId) query = query.eq('user_id', filters.userId)
  if (filters?.action) query = query.eq('action', filters.action)
  if (filters?.startDate) query = query.gte('created_at', filters.startDate)
  if (filters?.endDate) query = query.lte('created_at', filters.endDate)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}
