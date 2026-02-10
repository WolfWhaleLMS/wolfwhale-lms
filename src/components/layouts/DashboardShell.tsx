'use client';

import { ReactNode, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from './DashboardLayout';
import { useGradeLevel } from '@/hooks/useGradeLevel';
import { createClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types';

/**
 * Serializable user data passed from the server layout.
 * Every field is a plain value (no classes, dates, or functions).
 */
export interface DashboardUserData {
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: UserRole;
  /** Gamification – only populated for students */
  xp: number;
  level: number;
  coins: number;
  /** Unread notification count */
  notificationCount: number;
}

interface DashboardShellProps {
  children: ReactNode;
  userData: DashboardUserData;
}

/**
 * Client wrapper that sits between the server-side layout (which fetches
 * real data from Supabase) and the presentational <DashboardLayout>.
 *
 * Responsibilities:
 * - Derive the grade variant via useGradeLevel()
 * - Provide a working sign-out handler
 * - Pass real user data through to the presentational layer
 */
export function DashboardShell({ children, userData }: DashboardShellProps) {
  const router = useRouter();
  const { variant } = useGradeLevel();
  const supabase = useMemo(() => createClient(), []);

  const {
    firstName,
    lastName,
    avatarUrl,
    role,
    xp,
    level,
    coins,
    notificationCount,
  } = userData;

  const userInitials =
    `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase() || '??';

  const userName = `${firstName || ''} ${lastName || ''}`.trim() || 'User';

  /**
   * Sign out: clear the Supabase session on the client, then redirect
   * to /login. The AuthProvider's onAuthStateChange listener will also
   * fire SIGNED_OUT which pushes to /login as a fallback.
   */
  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign-out error:', err);
    } finally {
      // Always redirect even if signOut threw
      router.push('/login');
    }
  }, [supabase, router]);

  return (
    <DashboardLayout
      userRole={role}
      userLevel={level}
      userXP={xp}
      userInitials={userInitials}
      userImage={avatarUrl ?? undefined}
      userName={userName}
      userCoins={coins}
      notificationCount={notificationCount}
      gradeVariant={variant}
      onLogout={handleLogout}
    >
      {children}
    </DashboardLayout>
  );
}
