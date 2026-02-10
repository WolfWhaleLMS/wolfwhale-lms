// Wolf Whale LMS - Tenant Resolution Utilities
// Phase C: Multi-tenant resolution from slug, ID, or user membership
// Uses the Supabase server client pattern from lib/supabase/server.ts

import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/lib/auth/permissions'

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------

export interface Tenant {
  id: string
  slug: string
  name: string
  description: string | null
  logo_url: string | null
  website_url: string | null
  address: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country: string
  phone: string | null
  status: string
  subscription_plan: string
  stripe_customer_id: string | null
  settings: Record<string, unknown>
  branding: { primary_color: string; secondary_color: string }
  created_at: string
  updated_at: string
}

export interface TenantMembership {
  role: UserRole
  status: string
}

export interface TenantWithRole extends Tenant {
  role: UserRole
}

// ---------------------------------------------------------------------
// Tenant resolution
// ---------------------------------------------------------------------

/**
 * Resolve a tenant by its URL slug (extracted from subdomain).
 *
 * ```ts
 * const tenant = await getTenantBySlug('lincoln-high')
 * ```
 */
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error || !data) return null

  return normalizeTenant(data)
}

/**
 * Resolve a tenant by its UUID.
 *
 * ```ts
 * const tenant = await getTenantById('550e8400-e29b-41d4-a716-446655440000')
 * ```
 */
export async function getTenantById(id: string): Promise<Tenant | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null

  return normalizeTenant(data)
}

// ---------------------------------------------------------------------
// User-tenant membership
// ---------------------------------------------------------------------

/**
 * Get the current user's role and status within a specific tenant.
 * Returns null if the user is not a member of the tenant.
 *
 * ```ts
 * const membership = await getUserTenantMembership(userId, tenantId)
 * if (membership?.role === 'admin') { ... }
 * ```
 */
export async function getUserTenantMembership(
  userId: string,
  tenantId: string,
): Promise<TenantMembership | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tenant_memberships')
    .select('role, status')
    .eq('user_id', userId)
    .eq('tenant_id', tenantId)
    .single()

  if (error || !data) return null

  return {
    role: data.role as UserRole,
    status: data.status as string,
  }
}

/**
 * Get every tenant the user belongs to, along with their role in each.
 * Only returns tenants with active memberships.
 *
 * ```ts
 * const tenants = await getUserTenants(userId)
 * // => [{ id, slug, name, ..., role: 'teacher' }, ...]
 * ```
 */
export async function getUserTenants(userId: string): Promise<TenantWithRole[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tenant_memberships')
    .select(`
      role,
      status,
      tenants (*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')

  if (error || !data) return []

  return data
    .filter((row: Record<string, unknown>) => row.tenants != null)
    .map((row: Record<string, unknown>) => ({
      ...normalizeTenant(row.tenants as Record<string, unknown>),
      role: row.role as UserRole,
    }))
}

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

/**
 * Ensures the branding field always has a valid shape, even when the DB
 * stores it as a raw JSONB value or when it is null.
 */
function normalizeTenant(raw: Record<string, unknown>): Tenant {
  const defaultBranding = { primary_color: '#1a2a4e', secondary_color: '#0a4d68' }
  const branding = raw.branding && typeof raw.branding === 'object'
    ? { ...defaultBranding, ...(raw.branding as Record<string, string>) }
    : defaultBranding

  return {
    id: raw.id as string,
    slug: raw.slug as string,
    name: raw.name as string,
    description: (raw.description as string) ?? null,
    logo_url: (raw.logo_url as string) ?? null,
    website_url: (raw.website_url as string) ?? null,
    address: (raw.address as string) ?? null,
    city: (raw.city as string) ?? null,
    state: (raw.state as string) ?? null,
    postal_code: (raw.postal_code as string) ?? null,
    country: (raw.country as string) ?? 'CA',
    phone: (raw.phone as string) ?? null,
    status: (raw.status as string) ?? 'active',
    subscription_plan: (raw.subscription_plan as string) ?? 'starter',
    stripe_customer_id: (raw.stripe_customer_id as string) ?? null,
    settings: (raw.settings as Record<string, unknown>) ?? {},
    branding,
    created_at: raw.created_at as string,
    updated_at: raw.updated_at as string,
  }
}
