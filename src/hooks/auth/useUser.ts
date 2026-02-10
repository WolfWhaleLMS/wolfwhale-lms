'use client';

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Profile, UserRole } from '@/types/database.types';
import { useAuth } from './useAuth';

export interface UserWithMembership extends Profile {
  email: string;
  role: UserRole | null;
  tenant_id: string | null;
}

interface UseUserReturn {
  profile: UserWithMembership | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage the current user's profile data.
 * Uses React Query for caching and automatic refetching.
 * Integrates with useAuth to get the current session.
 */
export function useUser(): UseUserReturn {
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  // Fetch user profile + membership using React Query
  const { data: profile, error, refetch } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async (): Promise<UserWithMembership | null> => {
      if (!user) return null;

      // Get profile from profiles table (profile.id = auth user id)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Get role and tenant from tenant_memberships
      const { data: membership } = await supabase
        .from('tenant_memberships')
        .select('role, tenant_id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1)
        .single();

      return {
        ...profileData,
        email: user.email || '',
        role: (membership?.role as UserRole) || null,
        tenant_id: membership?.tenant_id || null,
      };
    },
    enabled: !!user && !authLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    profile: profile || null,
    loading: authLoading,
    error: error instanceof Error ? error : null,
    refetch: handleRefetch,
  };
}
