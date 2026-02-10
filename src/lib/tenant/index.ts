import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { NotFoundError, ValidationError } from '@/lib/api/errors';
import type { Tenant } from '@/types/database.types';

export interface CreateTenantData {
  slug: string;
  name: string;
  email: string;
  website?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
  principal?: string;
  phone?: string;
  logo_url?: string;
  subscription_tier?: 'free' | 'basic' | 'pro' | 'enterprise';
  max_users?: number;
}

export interface UpdateTenantData {
  slug?: string;
  name?: string;
  email?: string;
  website?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
  principal?: string;
  phone?: string;
  logo_url?: string;
  subscription_tier?: 'free' | 'basic' | 'pro' | 'enterprise';
  max_users?: number;
}

export interface TenantUsageStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  totalAssignments: number;
  totalStudents: number;
  storageUsedMB: number;
  apiCallsThisMonth: number;
}

/**
 * Get tenant by slug
 */
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching tenant by slug:', error);
    return null;
  }

  return data;
}

/**
 * Get tenant by ID
 */
export async function getTenantById(id: string): Promise<Tenant | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching tenant by ID:', error);
    return null;
  }

  return data;
}

/**
 * Create a new tenant
 */
export async function createTenant(data: CreateTenantData): Promise<Tenant> {
  const supabase = await createAdminClient();

  // Validate slug is unique
  const { data: existingTenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', data.slug)
    .single();

  if (existingTenant) {
    throw new ValidationError('Tenant slug already exists');
  }

  const { data: newTenant, error } = await supabase
    .from('tenants')
    .insert({
      slug: data.slug,
      name: data.name,
      email: data.email,
      website: data.website,
      city: data.city,
      state: data.state,
      country: data.country,
      timezone: data.timezone || 'UTC',
      principal: data.principal,
      phone: data.phone,
      logo_url: data.logo_url,
      subscription_tier: data.subscription_tier || 'free',
      max_users: data.max_users || 100,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating tenant:', error);
    throw new Error('Failed to create tenant');
  }

  return newTenant;
}

/**
 * Update a tenant
 */
export async function updateTenant(id: string, updateData: UpdateTenantData): Promise<Tenant> {
  const supabase = await createAdminClient();

  // If updating slug, check it's unique
  if (updateData.slug) {
    const { data: existingTenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', updateData.slug)
      .neq('id', id)
      .single();

    if (existingTenant) {
      throw new ValidationError('Tenant slug already exists');
    }
  }

  const { data: updatedTenant, error } = await supabase
    .from('tenants')
    .update({
      ...(updateData.slug && { slug: updateData.slug }),
      ...(updateData.name && { name: updateData.name }),
      ...(updateData.email && { email: updateData.email }),
      ...(updateData.website && { website: updateData.website }),
      ...(updateData.city && { city: updateData.city }),
      ...(updateData.state && { state: updateData.state }),
      ...(updateData.country && { country: updateData.country }),
      ...(updateData.timezone && { timezone: updateData.timezone }),
      ...(updateData.principal && { principal: updateData.principal }),
      ...(updateData.phone && { phone: updateData.phone }),
      ...(updateData.logo_url && { logo_url: updateData.logo_url }),
      ...(updateData.subscription_tier && { subscription_tier: updateData.subscription_tier }),
      ...(updateData.max_users && { max_users: updateData.max_users }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating tenant:', error);
    throw new Error('Failed to update tenant');
  }

  return updatedTenant;
}

/**
 * Get tenant usage statistics
 */
export async function getTenantUsageStats(tenantId: string): Promise<TenantUsageStats> {
  const supabase = await createServerClient();

  // Get all stats in parallel
  const [usersResult, coursesResult, assignmentsResult, studentsResult] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('id')
      .eq('tenant_id', tenantId),
    supabase
      .from('courses')
      .select('id')
      .eq('tenant_id', tenantId),
    supabase
      .from('assignments')
      .select('id')
      .eq('tenant_id', tenantId),
    supabase
      .from('user_profiles')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('role', 'student'),
  ]);

  // Count active users (logged in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count: activeUsersCount } = await supabase
    .from('audit_logs')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)
    .gte('created_at', thirtyDaysAgo.toISOString());

  const activeUsers = new Set();
  const { data: activeLogs } = await supabase
    .from('audit_logs')
    .select('user_id')
    .eq('tenant_id', tenantId)
    .gte('created_at', thirtyDaysAgo.toISOString());

  if (activeLogs) {
    activeLogs.forEach((log) => activeUsers.add(log.user_id));
  }

  return {
    totalUsers: usersResult.data?.length || 0,
    activeUsers: activeUsers.size,
    totalCourses: coursesResult.data?.length || 0,
    totalAssignments: assignmentsResult.data?.length || 0,
    totalStudents: studentsResult.data?.length || 0,
    storageUsedMB: 0, // Would integrate with storage API
    apiCallsThisMonth: 0, // Would track from logs
  };
}

/**
 * Check if tenant is within usage limits
 */
export async function checkTenantLimits(tenantId: string): Promise<{
  withinLimits: boolean;
  userCount: number;
  maxUsers: number;
  percentage: number;
}> {
  const tenant = await getTenantById(tenantId);

  if (!tenant) {
    throw new NotFoundError('Tenant not found');
  }

  const supabase = await createServerClient();

  const { count, error } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', tenantId);

  if (error) {
    console.error('Error checking tenant limits:', error);
    throw new Error('Failed to check tenant limits');
  }

  const userCount = count || 0;
  const maxUsers = (tenant as any).max_users || 100;
  const percentage = (userCount / maxUsers) * 100;

  return {
    withinLimits: userCount < maxUsers,
    userCount,
    maxUsers,
    percentage,
  };
}

/**
 * Deactivate a tenant
 */
export async function deactivateTenant(id: string): Promise<Tenant> {
  const supabase = await createAdminClient();

  const { data: deactivatedTenant, error } = await supabase
    .from('tenants')
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error deactivating tenant:', error);
    throw new Error('Failed to deactivate tenant');
  }

  return deactivatedTenant;
}
