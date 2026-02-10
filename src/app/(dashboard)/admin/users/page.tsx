import { requireRole, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import AdminUsersClient from './AdminUsersClient';

export default async function AdminUsersPage() {
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

  // Fetch all memberships for this tenant with profile info
  const { data: memberships } = await supabase
    .from('tenant_memberships')
    .select(`
      id,
      user_id,
      role,
      status,
      joined_at,
      profiles:user_id (
        id,
        first_name,
        last_name,
        avatar_url,
        phone
      )
    `)
    .eq('tenant_id', tenantId)
    .order('joined_at', { ascending: false });

  // Get email addresses from auth - we need to use admin or match user_ids
  // Since we're fetching via the server client with RLS, profiles are accessible.
  // For emails, we'll need to query through a different mechanism.
  // We'll resolve emails from the auth admin API via user_id lookup.
  // However, the server supabase client can't list auth users.
  // Instead, we use the admin client for this.
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const adminClient = createAdminClient();

  const userIds = (memberships || []).map((m) => m.user_id);

  // Fetch auth users in batches to get emails
  // Supabase admin.listUsers returns paginated results
  const emailMap = new Map<string, string>();
  if (userIds.length > 0) {
    // Fetch all auth users (paginated, max 1000 per page)
    const { data: authData } = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (authData?.users) {
      for (const authUser of authData.users) {
        if (userIds.includes(authUser.id)) {
          emailMap.set(authUser.id, authUser.email || '');
        }
      }
    }
  }

  // Transform memberships into user objects
  const users = (memberships || []).map((m) => {
    const profile = m.profiles as unknown as {
      id: string;
      first_name: string | null;
      last_name: string | null;
      avatar_url: string | null;
      phone: string | null;
    } | null;

    return {
      id: m.user_id,
      membershipId: m.id,
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      email: emailMap.get(m.user_id) || '',
      role: m.role as 'student' | 'teacher' | 'parent' | 'admin',
      status: m.status as 'active' | 'inactive' | 'invited' | 'suspended',
      avatarUrl: profile?.avatar_url || null,
      joinedAt: m.joined_at,
    };
  });

  return <AdminUsersClient users={users} />;
}
