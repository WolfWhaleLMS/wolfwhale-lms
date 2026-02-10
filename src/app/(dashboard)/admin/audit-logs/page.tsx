import { requireRole, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import AdminAuditLogsClient from './AdminAuditLogsClient';

export default async function AdminAuditLogsPage() {
  await requireRole(['admin', 'super_admin']);
  const tenantId = await getUserTenantId();
  const supabase = await createClient();

  if (!tenantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">No school found for your account.</p>
      </div>
    );
  }

  // Fetch audit logs for this tenant
  const { data: logs } = await supabase
    .from('audit_logs')
    .select('id, user_id, action, resource_type, resource_id, target_user_id, details, ip_address, user_agent, created_at')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(200);

  // Fetch user profile names for all user_ids in logs
  const userIds = [...new Set(
    (logs || [])
      .flatMap((l) => [l.user_id, l.target_user_id])
      .filter(Boolean)
  )] as string[];

  const { data: profiles } = userIds.length > 0
    ? await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds)
    : { data: [] };

  const profileMap = new Map(
    (profiles || []).map((p) => [p.id, `${p.first_name || ''} ${p.last_name || ''}`.trim()])
  );

  // Transform logs
  const auditLogs = (logs || []).map((log) => ({
    id: log.id,
    timestamp: log.created_at,
    userId: log.user_id || '',
    userName: log.user_id ? (profileMap.get(log.user_id) || 'Unknown') : 'System',
    action: log.action,
    resourceType: log.resource_type || 'system',
    resourceId: log.resource_id || '',
    details: typeof log.details === 'object' && log.details !== null
      ? (log.details as Record<string, string>).description || log.action
      : log.action,
    ipAddress: log.ip_address || '',
  }));

  return <AdminAuditLogsClient logs={auditLogs} />;
}
