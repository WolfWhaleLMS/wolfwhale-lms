import { redirect } from 'next/navigation';
import { requireAuth, getUser, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { SharedNotificationsClient } from './SharedNotificationsClient';

export default async function NotificationsPage() {
  await requireAuth();
  const user = await getUser();
  const tenantId = await getUserTenantId();

  if (!user || !tenantId) {
    redirect('/login');
  }

  const supabase = await createClient();

  // Fetch all notifications for the current user
  const { data: notifications } = await supabase
    .from('notifications')
    .select('id, type, title, message, action_url, read, read_at, created_at')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  // Build notification data for client
  const notificationData = (notifications || []).map((n) => ({
    id: n.id,
    type: n.type || 'system_alert',
    title: n.title,
    message: n.message || '',
    timestamp: n.created_at,
    read: n.read || false,
    actionUrl: n.action_url || null,
  }));

  return (
    <SharedNotificationsClient
      notifications={notificationData}
      currentUserId={user.id}
      tenantId={tenantId}
    />
  );
}
