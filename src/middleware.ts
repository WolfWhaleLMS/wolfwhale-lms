import { type NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';

/**
 * Helper function to determine the dashboard URL based on user role.
 * Uses roles from the tenant_memberships table:
 *   student, teacher, parent, admin, super_admin
 */
function getDashboardUrl(role: string | null): string {
  switch (role) {
    case 'student':
      return '/student/dashboard';
    case 'teacher':
      return '/teacher/dashboard';
    case 'parent':
      return '/parent/dashboard';
    case 'admin':
    case 'super_admin':
      return '/admin/dashboard';
    default:
      return '/student/dashboard';
  }
}

/**
 * Next.js middleware for handling authentication and session management.
 * Runs on every matched request to:
 * 1. Refresh the session (via getUser which validates the JWT with Supabase)
 * 2. Protect routes - redirect unauthenticated users to /login
 * 3. Redirect authenticated users away from auth pages to their dashboard
 */
export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);
  const pathname = request.nextUrl.pathname;

  // Public routes that do not require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

  // Protected route prefixes that require authentication
  const protectedPrefixes = [
    '/dashboard',
    '/student',
    '/parent',
    '/teacher',
    '/admin',
    '/platform',
  ];

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  try {
    // IMPORTANT: Use getUser() not getSession().
    // getUser() sends a request to the Supabase Auth server every time to revalidate the token.
    // getSession() only reads from the cookie and could be tampered with.
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // If user is on a protected route but not authenticated, redirect to login
    if (isProtectedRoute && (!user || error)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If user is authenticated and on an auth page, redirect to their dashboard
    if (isPublicRoute && user && !error) {
      // Look up the user's role from tenant_memberships
      const { data: membership } = await supabase
        .from('tenant_memberships')
        .select('role, tenant_id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1)
        .single();

      const redirectUrl = getDashboardUrl(membership?.role || null);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    return response;
  } catch {
    // On error, return the response as-is (don't block the user)
    return response;
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     * - api/auth routes (Supabase auth callback etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
};
