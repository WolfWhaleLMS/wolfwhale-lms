import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Auth callback route handler for Supabase email confirmation and OAuth.
 * Exchanges the code for a session and redirects to the appropriate dashboard based on role.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || null;

  if (code) {
    const supabase = await createClient();

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // If there's a specific "next" URL, redirect there
      if (next) {
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      }

      // Get the authenticated user to determine their role
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Get user role from tenant_memberships
        const { data: membership } = await supabase
          .from('tenant_memberships')
          .select('role, tenant_id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .limit(1)
          .single();

        // Determine redirect URL based on role
        let redirectUrl = '/student/dashboard';
        switch (membership?.role) {
          case 'student':
            redirectUrl = '/student/dashboard';
            break;
          case 'teacher':
            redirectUrl = '/teacher/dashboard';
            break;
          case 'parent':
            redirectUrl = '/parent/dashboard';
            break;
          case 'admin':
          case 'super_admin':
            redirectUrl = '/admin/dashboard';
            break;
        }

        return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin));
      }
    }
  }

  // If anything went wrong, redirect to login with error
  return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin));
}
