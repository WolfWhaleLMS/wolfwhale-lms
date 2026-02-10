import { ReactNode } from 'react';
import { requireAuth, getUserRole, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/layouts/DashboardShell';
import type { DashboardUserData } from '@/components/layouts/DashboardShell';
import type { UserRole } from '@/types';

interface DashboardLayoutWrapperProps {
  children: ReactNode;
}

/**
 * Server-side dashboard layout.
 *
 * 1. Requires authentication (redirects to /login when no session)
 * 2. Fetches the user profile, role, and gamification data from Supabase
 * 3. Passes plain, serializable data to the client-side DashboardShell
 */
export default async function DashboardLayoutWrapper({ children }: DashboardLayoutWrapperProps) {
  // ── Auth gate ──────────────────────────────────────────────────────
  const authUser = await requireAuth(); // redirects to /login if no session

  // ── Parallel data fetches ──────────────────────────────────────────
  const supabase = await createClient();

  const [profileResult, roleResult, tenantIdResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', authUser.id)
      .single(),
    getUserRole(),
    getUserTenantId(),
  ]);

  const profile = profileResult.data;
  const role: UserRole = (roleResult as UserRole) || 'student';

  // ── Gamification data (students only) ──────────────────────────────
  let xp = 0;
  let level = 1;
  let coins = 0;

  if (role === 'student') {
    const { data: xpData } = await supabase
      .from('student_xp')
      .select('total_xp, current_level, coins')
      .eq('student_id', authUser.id)
      .limit(1)
      .single();

    if (xpData) {
      xp = xpData.total_xp ?? 0;
      level = xpData.current_level ?? 1;
      coins = xpData.coins ?? 0;
    }
  }

  // ── Unread notification count ──────────────────────────────────────
  const { count: notificationCount } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', authUser.id)
    .eq('read', false);

  // ── Build serializable user data for the client ────────────────────
  const userData: DashboardUserData = {
    firstName: profile?.first_name ?? '',
    lastName: profile?.last_name ?? '',
    avatarUrl: profile?.avatar_url ?? null,
    role,
    xp,
    level,
    coins,
    notificationCount: notificationCount ?? 0,
  };

  return (
    <DashboardShell userData={userData}>
      {children}
    </DashboardShell>
  );
}
