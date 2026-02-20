import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export type AuditAction =
  | 'user.login'
  | 'user.login_failed'
  | 'user.logout'
  | 'user.create'
  | 'user.update'
  | 'user.delete'
  | 'role.change'
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
  | 'data.delete'
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
 * Non-throwing — returns an empty array on error to avoid crashing the page.
 */
export async function getAuditLogs(filters?: {
  userId?: string
  action?: string
  startDate?: string
  endDate?: string
  limit?: number
}) {
  try {
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
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(filters?.limit ?? 50)

    if (filters?.userId) query = query.eq('user_id', filters.userId)
    if (filters?.action) query = query.eq('action', filters.action)
    if (filters?.startDate) query = query.gte('created_at', filters.startDate)
    if (filters?.endDate) query = query.lte('created_at', filters.endDate)

    const { data, error } = await query
    if (error) {
      console.error('[audit] Failed to fetch audit logs:', error.message)
      return []
    }

    const logs = data ?? []

    // Fetch profiles for user_ids (PostgREST cannot follow audit_logs.user_id -> profiles
    // because the FK points to auth.users, not profiles)
    const userIds = [...new Set(logs.map((l) => l.user_id).filter(Boolean))]
    const profilesMap: Record<string, { id: string; full_name: string | null; avatar_url: string | null }> = {}

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds)

      for (const p of profiles ?? []) {
        profilesMap[p.id] = p
      }
    }

    return logs.map((l) => ({
      ...l,
      profiles: profilesMap[l.user_id] ?? null,
    }))
  } catch (err) {
    console.error('[audit] Unexpected error fetching audit logs:', err)
    return []
  }
}
