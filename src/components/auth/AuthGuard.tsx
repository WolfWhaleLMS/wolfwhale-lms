'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useRole } from '@/hooks/auth/useRole';
import type { UserRole } from '@/types/database.types';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  fallback?: React.ReactNode;
}

/**
 * AuthGuard component that wraps protected content.
 * Shows loading spinner while checking authentication.
 * Redirects to login if not authenticated.
 * Optionally checks for required roles.
 */
export function AuthGuard({
  children,
  requiredRoles,
  fallback
}: AuthGuardProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading, hasRole } = useRole();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push('/login');
    }

    // Redirect if user doesn't have required role
    if (!roleLoading && requiredRoles && !hasRole(requiredRoles)) {
      router.push('/forbidden');
    }
  }, [user, authLoading, role, roleLoading, requiredRoles, hasRole, router]);

  // Loading state
  if (authLoading || roleLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Missing required role
  if (requiredRoles && !hasRole(requiredRoles)) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
