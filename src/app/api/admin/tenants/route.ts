import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { withRole } from '@/lib/api';
import { apiResponse, apiError, getPaginationParams, getPaginationMetadata } from '@/lib/api';
import { z } from 'zod';

const createTenantSchema = z.object({
  // Tenant info
  name: z.string().min(1, 'School name is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  email: z.string().email('Invalid school email'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  timezone: z.string().max(100).optional(),
  principal: z.string().max(200).optional(),
  phone: z.string().max(30).optional(),
  subscriptionPlan: z.enum(['free', 'starter', 'growth', 'enterprise']).default('free'),
  // Admin user info
  adminName: z.string().min(1, 'Admin name is required').max(200),
  adminEmail: z.string().email('Invalid admin email'),
  adminPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * GET /api/admin/tenants
 * List all tenants (super_admin only)
 */
export const GET = withRole(['super_admin'], async (req, opts) => {
  try {
    const adminClient = createAdminClient();
    const { page, pageSize, sortBy, sortOrder } = getPaginationParams(req);
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const plan = searchParams.get('plan');

    let query = adminClient
      .from('tenants')
      .select('*', { count: 'exact' });

    // Filter by status
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Filter by plan
    if (plan && plan !== 'all') {
      query = query.eq('subscription_plan', plan);
    }

    // Filter by search
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,slug.ilike.%${search}%`
      );
    }

    const { data: tenants, count, error } = await query
      .order(sortBy || 'created_at', { ascending: sortOrder === 'asc' })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      console.error('Error fetching tenants:', error);
      throw error;
    }

    // For each tenant, get user counts
    const tenantsWithStats = await Promise.all(
      (tenants || []).map(async (tenant) => {
        // Count members by role
        const { data: memberships } = await adminClient
          .from('tenant_memberships')
          .select('role')
          .eq('tenant_id', tenant.id)
          .eq('status', 'active');

        const memberCounts = (memberships || []).reduce(
          (acc, m) => {
            acc.total++;
            if (m.role === 'student') acc.students++;
            if (m.role === 'teacher') acc.teachers++;
            if (m.role === 'admin') acc.admins++;
            return acc;
          },
          { total: 0, students: 0, teachers: 0, admins: 0 }
        );

        // Get admin emails
        const { data: adminMemberships } = await adminClient
          .from('tenant_memberships')
          .select('user_id')
          .eq('tenant_id', tenant.id)
          .eq('role', 'admin')
          .eq('status', 'active')
          .limit(1);

        let adminEmail = null;
        if (adminMemberships && adminMemberships.length > 0) {
          const { data: authData } = await adminClient.auth.admin.getUserById(
            adminMemberships[0].user_id
          );
          adminEmail = authData?.user?.email || null;
        }

        return {
          ...tenant,
          adminEmail,
          userCount: memberCounts.total,
          studentCount: memberCounts.students,
          teacherCount: memberCounts.teachers,
          adminCount: memberCounts.admins,
        };
      })
    );

    return apiResponse({
      tenants: tenantsWithStats,
      pagination: getPaginationMetadata(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return apiError('Failed to fetch tenants', 500, 'FETCH_ERROR');
  }
});

/**
 * POST /api/admin/tenants
 * Create a new tenant + admin user (super_admin only)
 */
export const POST = withRole(['super_admin'], async (req, opts) => {
  try {
    const body = await req.json();

    // Validate
    const validation = createTenantSchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        'Validation failed',
        400,
        'VALIDATION_ERROR',
        validation.error.flatten().fieldErrors
      );
    }

    const data = validation.data;
    const adminClient = createAdminClient();

    // Check if slug already exists
    const { data: existingTenant } = await adminClient
      .from('tenants')
      .select('id')
      .eq('slug', data.slug)
      .single();

    if (existingTenant) {
      return apiError('A school with this slug already exists', 409, 'SLUG_EXISTS');
    }

    // Check if admin email already exists as an auth user
    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const adminExists = existingUsers?.users?.some(
      (u) => u.email === data.adminEmail
    );
    if (adminExists) {
      return apiError('An account with this admin email already exists', 409, 'EMAIL_EXISTS');
    }

    // 1. Create the tenant
    const { data: newTenant, error: tenantError } = await adminClient
      .from('tenants')
      .insert({
        name: data.name,
        slug: data.slug,
        website_url: data.website || null,
        city: data.city || null,
        state: data.state || null,
        country: data.country || null,
        phone: data.phone || null,
        subscription_plan: data.subscriptionPlan as any,
        status: 'active',
      })
      .select()
      .single();

    if (tenantError) {
      console.error('Error creating tenant:', tenantError);
      return apiError('Failed to create school', 500, 'TENANT_CREATE_ERROR');
    }

    // 2. Create the admin auth user
    const nameParts = data.adminName.split(' ');
    const firstName = nameParts[0] || data.adminName;
    const lastName = nameParts.slice(1).join(' ') || '';

    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email: data.adminEmail,
      password: data.adminPassword,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        role: 'admin',
      },
    });

    if (authError || !authUser.user) {
      // Rollback: delete tenant
      await adminClient.from('tenants').delete().eq('id', newTenant.id);
      console.error('Error creating admin user:', authError);
      return apiError('Failed to create admin user', 500, 'AUTH_CREATE_ERROR');
    }

    // 3. Create the admin profile
    const { error: profileError } = await adminClient
      .from('profiles')
      .insert({
        id: authUser.user.id,
        first_name: firstName,
        last_name: lastName,
        timezone: data.timezone || 'UTC',
      });

    if (profileError) {
      console.error('Error creating admin profile:', profileError);
      // Continue - not fatal, profile can be created later
    }

    // 4. Create the tenant membership linking admin to tenant
    const { error: membershipError } = await adminClient
      .from('tenant_memberships')
      .insert({
        tenant_id: newTenant.id,
        user_id: authUser.user.id,
        role: 'admin',
        status: 'active',
      });

    if (membershipError) {
      console.error('Error creating tenant membership:', membershipError);
      // Rollback
      await adminClient.auth.admin.deleteUser(authUser.user.id);
      await adminClient.from('tenants').delete().eq('id', newTenant.id);
      return apiError('Failed to link admin to school', 500, 'MEMBERSHIP_CREATE_ERROR');
    }

    return apiResponse(
      {
        tenant: newTenant,
        admin: {
          id: authUser.user.id,
          email: authUser.user.email,
          name: data.adminName,
        },
      },
      201
    );
  } catch (error) {
    console.error('Error creating tenant:', error);
    return apiError('Failed to create school', 500, 'CREATE_ERROR');
  }
});
