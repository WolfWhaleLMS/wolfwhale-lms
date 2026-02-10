import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { withRole } from '@/lib/api';
import { apiResponse, apiError } from '@/lib/api';
import { z } from 'zod';

const updateTenantSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
  website: z.string().url().optional().or(z.literal('')),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  phone: z.string().max(30).optional(),
  status: z.enum(['active', 'suspended', 'cancelled']).optional(),
  subscriptionPlan: z.enum(['free', 'starter', 'growth', 'enterprise']).optional(),
});

function getTenantIdFromUrl(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split('/');
  return segments[segments.length - 1];
}

/**
 * GET /api/admin/tenants/[tenantId]
 * Get individual tenant details (super_admin only)
 */
export const GET = withRole(['super_admin'], async (req, opts) => {
  try {
    const tenantId = getTenantIdFromUrl(req);
    const adminClient = createAdminClient();

    const { data: tenant, error } = await adminClient
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single();

    if (error || !tenant) {
      return apiError('Tenant not found', 404, 'NOT_FOUND');
    }

    // Get member counts
    const { data: memberships } = await adminClient
      .from('tenant_memberships')
      .select('role, user_id, status')
      .eq('tenant_id', tenantId);

    const memberCounts = (memberships || []).reduce(
      (acc, m) => {
        if (m.status === 'active') {
          acc.total++;
          if (m.role === 'student') acc.students++;
          if (m.role === 'teacher') acc.teachers++;
          if (m.role === 'admin') acc.admins++;
          if (m.role === 'parent') acc.parents++;
        }
        return acc;
      },
      { total: 0, students: 0, teachers: 0, admins: 0, parents: 0 }
    );

    // Get admin user details
    const adminMemberships = (memberships || []).filter(
      (m) => m.role === 'admin' && m.status === 'active'
    );
    const adminUsers = await Promise.all(
      adminMemberships.map(async (m) => {
        const { data: authData } = await adminClient.auth.admin.getUserById(m.user_id);
        const { data: profile } = await adminClient
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', m.user_id)
          .single();

        return {
          id: m.user_id,
          email: authData?.user?.email || 'Unknown',
          name: profile
            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
            : 'Unknown',
        };
      })
    );

    return apiResponse({
      ...tenant,
      memberCounts,
      adminUsers,
    });
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return apiError('Failed to fetch tenant', 500, 'FETCH_ERROR');
  }
});

/**
 * PUT /api/admin/tenants/[tenantId]
 * Update tenant (super_admin only)
 */
export const PUT = withRole(['super_admin'], async (req, opts) => {
  try {
    const tenantId = getTenantIdFromUrl(req);
    const body = await req.json();
    const adminClient = createAdminClient();

    const validation = updateTenantSchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        'Validation failed',
        400,
        'VALIDATION_ERROR',
        validation.error.flatten().fieldErrors
      );
    }

    const data = validation.data;

    // Check tenant exists
    const { data: existing } = await adminClient
      .from('tenants')
      .select('id')
      .eq('id', tenantId)
      .single();

    if (!existing) {
      return apiError('Tenant not found', 404, 'NOT_FOUND');
    }

    // If updating slug, check uniqueness
    if (data.slug) {
      const { data: slugExists } = await adminClient
        .from('tenants')
        .select('id')
        .eq('slug', data.slug)
        .neq('id', tenantId)
        .single();

      if (slugExists) {
        return apiError('This slug is already taken', 409, 'SLUG_EXISTS');
      }
    }

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (data.name) updateData.name = data.name;
    if (data.slug) updateData.slug = data.slug;
    if (data.website !== undefined) updateData.website_url = data.website || null;
    if (data.city) updateData.city = data.city;
    if (data.state) updateData.state = data.state;
    if (data.country) updateData.country = data.country;
    if (data.phone) updateData.phone = data.phone;
    if (data.status) updateData.status = data.status;
    if (data.subscriptionPlan) updateData.subscription_plan = data.subscriptionPlan;

    const { data: updated, error } = await adminClient
      .from('tenants')
      .update(updateData)
      .eq('id', tenantId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return apiResponse(updated);
  } catch (error) {
    console.error('Error updating tenant:', error);
    return apiError('Failed to update tenant', 500, 'UPDATE_ERROR');
  }
});

/**
 * DELETE /api/admin/tenants/[tenantId]
 * Soft delete (deactivate) tenant (super_admin only)
 */
export const DELETE = withRole(['super_admin'], async (req, opts) => {
  try {
    const tenantId = getTenantIdFromUrl(req);
    const adminClient = createAdminClient();

    const { data: tenant } = await adminClient
      .from('tenants')
      .select('id, name')
      .eq('id', tenantId)
      .single();

    if (!tenant) {
      return apiError('Tenant not found', 404, 'NOT_FOUND');
    }

    // Soft delete - set status to cancelled and deleted_at timestamp
    const { data: deactivated, error } = await adminClient
      .from('tenants')
      .update({
        status: 'cancelled',
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', tenantId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Suspend all memberships
    await adminClient
      .from('tenant_memberships')
      .update({
        status: 'suspended',
        suspended_at: new Date().toISOString(),
        suspended_reason: 'Tenant deactivated',
      })
      .eq('tenant_id', tenantId);

    return apiResponse({ success: true, message: `${tenant.name} has been deactivated` });
  } catch (error) {
    console.error('Error deactivating tenant:', error);
    return apiError('Failed to deactivate tenant', 500, 'DELETE_ERROR');
  }
});
