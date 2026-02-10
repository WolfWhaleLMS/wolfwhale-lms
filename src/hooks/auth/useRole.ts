'use client';

import { useMemo } from 'react';
import type { UserRole } from '@/types/database.types';
import { useUser } from './useUser';

interface UseRoleReturn {
  role: UserRole | null;
  loading: boolean;
  isStudent: boolean;
  isTeacher: boolean;
  isParent: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

/**
 * Hook to get the current user's role and helper functions.
 * Provides boolean flags for each role and a function to check multiple roles.
 * Roles from tenant_memberships: student, teacher, parent, admin, super_admin
 */
export function useRole(): UseRoleReturn {
  const { profile, loading } = useUser();

  const roleInfo = useMemo(() => {
    const role = profile?.role || null;

    return {
      role,
      loading,
      isStudent: role === 'student',
      isTeacher: role === 'teacher',
      isParent: role === 'parent',
      isAdmin: role === 'admin',
      isSuperAdmin: role === 'super_admin',
      hasRole: (roles: UserRole[]) => role ? roles.includes(role) : false,
    };
  }, [profile?.role, loading]);

  return roleInfo;
}
