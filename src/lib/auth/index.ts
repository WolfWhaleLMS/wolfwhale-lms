import { createClient } from '@/lib/supabase/server';
import { type Session, type User as SupabaseUser } from '@supabase/supabase-js';
import { type Profile, type UserRole } from '@/types/database.types';
import { redirect } from 'next/navigation';

/**
 * Get the current session from Supabase
 */
export async function getSession(): Promise<Session | null> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get the current user from Supabase (validates JWT with server)
 */
export async function getSupabaseUser(): Promise<SupabaseUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current user with their profile data
 * Joins with profiles table to get additional user information
 */
export async function getUser(): Promise<(Profile & { email: string }) | null> {
  const supabase = await createClient();

  // Get the authenticated user
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  // Get the user profile (profile.id = auth user id)
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (error || !profile) return null;

  return {
    ...profile,
    email: authUser.email || '',
  };
}

/**
 * Get the current user's role from tenant_memberships
 */
export async function getUserRole(): Promise<UserRole | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from('tenant_memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)
    .single();

  return (membership?.role as UserRole) || null;
}

/**
 * Get the current user's tenant ID from tenant_memberships
 */
export async function getUserTenantId(): Promise<string | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from('tenant_memberships')
    .select('tenant_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)
    .single();

  return membership?.tenant_id || null;
}

/**
 * Check if user is authenticated, redirect to login if not
 */
export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

/**
 * Check if user has one of the required roles, redirect to login if not authenticated
 * or to a 403 page if authenticated but lacking required role
 */
export async function requireRole(roles: UserRole[]) {
  const user = await requireAuth();

  const userRole = await getUserRole();
  if (!userRole || !roles.includes(userRole)) {
    redirect('/forbidden');
  }

  return userRole;
}

/**
 * Sign out the user and redirect to login page
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
