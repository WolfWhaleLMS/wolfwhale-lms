import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Logout API route handler
 * Signs out the user and redirects to login page
 */
export async function POST() {
  const supabase = await createClient();

  // Sign out the user
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  // Redirect to login page
  return NextResponse.redirect(
    new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    { status: 302 }
  );
}
