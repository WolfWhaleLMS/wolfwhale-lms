import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withRole } from '@/lib/api';
import { apiResponse, apiError, getPaginationParams, getPaginationMetadata } from '@/lib/api';
import { createUserSchema } from '@/lib/validation/schemas';
import { checkTenantLimits } from '@/lib/tenant';

/**
 * GET /api/admin/users
 * Fetch all users in tenant (admin only)
 */
export const GET = withRole(['admin', 'super_admin'], async (req, opts) => {
  try {
    const supabase = await createClient();
    const { page, pageSize, sortBy = 'created_at', sortOrder } = getPaginationParams(req);
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    let query = supabase
      .from('user_profiles')
      .select('*', { count: 'exact' })
      .eq('tenant_id', opts.tenantId);

    // Add tenant filter for platform admin
    if (opts.userRole === 'super_admin') {
      // Platform admin can see all users across tenants
      query = supabase
        .from('user_profiles')
        .select('*', { count: 'exact' });
    }

    // Filter by role
    if (role) {
      query = query.eq('role', role);
    }

    // Filter by status
    if (status) {
      query = query.eq('is_active', status === 'active');
    }

    // Filter by search
    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    const { data: users, count, error } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      throw error;
    }

    return apiResponse({
      users: users || [],
      pagination: getPaginationMetadata(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return apiError('Failed to fetch users', 500, 'FETCH_ERROR');
  }
});

/**
 * POST /api/admin/users
 * Create new user (admin only)
 */
export const POST = withRole(['admin', 'super_admin'], async (req, opts) => {
  try {
    const body = await req.json();

    // Validate request
    const validation = createUserSchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        'Validation failed',
        400,
        'VALIDATION_ERROR',
        validation.error.flatten().fieldErrors
      );
    }

    // Check tenant limits
    const limits = await checkTenantLimits(opts.tenantId);
    if (!limits.withinLimits && opts.userRole !== 'super_admin') {
      return apiError(
        `Tenant user limit (${limits.maxUsers}) exceeded`,
        409,
        'LIMIT_EXCEEDED'
      );
    }

    const supabase = await createClient();
    const data = validation.data;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', data.email)
      .single();

    if (existingUser) {
      return apiError('User with this email already exists', 409, 'CONFLICT');
    }

    // Note: In production, you would use Supabase Admin SDK to create auth user
    // This is a placeholder for the user profile
    const { data: newUser, error } = await supabase
      .from('user_profiles')
      .insert({
        tenant_id: opts.tenantId,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        role: data.role,
        grade_level: data.gradeLevel,
        date_of_birth: data.dateOfBirth,
        is_active: true,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // TODO: Send invite email if requested
    if (data.sendInviteEmail) {
      // Send invite email to user
    }

    return apiResponse(newUser, 201);
  } catch (error) {
    console.error('Error creating user:', error);
    return apiError('Failed to create user', 500, 'CREATE_ERROR');
  }
});
