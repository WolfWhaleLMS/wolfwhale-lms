import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { withRole } from '@/lib/api';
import { apiResponse, apiError, getPaginationParams, getPaginationMetadata } from '@/lib/api';
import { z } from 'zod';

const createUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'teacher', 'parent', 'admin']),
  gradeLevel: z.string().optional(),
  dateOfBirth: z.string().optional(),
  phone: z.string().optional(),
  linkedStudentIds: z.array(z.string().uuid()).optional(),
  sendInviteEmail: z.boolean().default(true),
});

/**
 * GET /api/admin/users
 * Fetch all users in tenant (admin only)
 */
export const GET = withRole(['admin', 'super_admin'], async (req, opts) => {
  try {
    const adminClient = createAdminClient();
    const { page, pageSize, sortBy = 'joined_at', sortOrder } = getPaginationParams(req);
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    // Build query on tenant_memberships joined with profiles
    let query = adminClient
      .from('tenant_memberships')
      .select(`
        id,
        tenant_id,
        user_id,
        role,
        status,
        joined_at,
        profiles:user_id (
          id,
          first_name,
          last_name,
          avatar_url,
          phone,
          date_of_birth,
          timezone
        )
      `, { count: 'exact' });

    // Scope to tenant for admin (not super_admin)
    if (opts.userRole === 'admin') {
      query = query.eq('tenant_id', opts.tenantId);
    }

    // Filter by role
    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    // Filter by status
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: memberships, count, error } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    // Enrich with email from auth
    const enrichedUsers = await Promise.all(
      (memberships || []).map(async (m: any) => {
        let email = '';
        try {
          const { data: authData } = await adminClient.auth.admin.getUserById(m.user_id);
          email = authData?.user?.email || '';
        } catch {
          // skip
        }

        const profile = m.profiles || {};
        return {
          membershipId: m.id,
          userId: m.user_id,
          tenantId: m.tenant_id,
          role: m.role,
          status: m.status,
          joinedAt: m.joined_at,
          email,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          avatarUrl: profile.avatar_url || null,
          phone: profile.phone || null,
          dateOfBirth: profile.date_of_birth || null,
          timezone: profile.timezone || null,
        };
      })
    );

    return apiResponse({
      users: enrichedUsers,
      pagination: getPaginationMetadata(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return apiError('Failed to fetch users', 500, 'FETCH_ERROR');
  }
});

/**
 * POST /api/admin/users
 * Create new user with Supabase admin client (admin only)
 * Creates: auth user, profile, tenant_membership, and optional student_parent link
 */
export const POST = withRole(['admin', 'super_admin'], async (req, opts) => {
  try {
    const body = await req.json();

    // Validate
    const validation = createUserSchema.safeParse(body);
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

    // Check if email already exists
    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const emailExists = existingUsers?.users?.some(
      (u) => u.email === data.email
    );
    if (emailExists) {
      return apiError('A user with this email already exists', 409, 'EMAIL_EXISTS');
    }

    // 1. Create auth user
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
      },
    });

    if (authError || !authUser.user) {
      console.error('Error creating auth user:', authError);
      return apiError('Failed to create user account', 500, 'AUTH_CREATE_ERROR');
    }

    // 2. Create profile
    const { error: profileError } = await adminClient
      .from('profiles')
      .insert({
        id: authUser.user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || null,
        date_of_birth: data.dateOfBirth || null,
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Not fatal but log it
    }

    // 3. Create tenant membership
    const { error: membershipError } = await adminClient
      .from('tenant_memberships')
      .insert({
        tenant_id: opts.tenantId,
        user_id: authUser.user.id,
        role: data.role,
        status: 'active',
      });

    if (membershipError) {
      console.error('Error creating membership:', membershipError);
      // Rollback auth user
      await adminClient.auth.admin.deleteUser(authUser.user.id);
      return apiError('Failed to create user membership', 500, 'MEMBERSHIP_CREATE_ERROR');
    }

    // 4. If parent, create student_parent relationships
    if (data.role === 'parent' && data.linkedStudentIds && data.linkedStudentIds.length > 0) {
      const parentLinks = data.linkedStudentIds.map((studentId) => ({
        tenant_id: opts.tenantId,
        student_id: studentId,
        parent_id: authUser.user.id,
        relationship: 'guardian',
        status: 'active',
      }));

      const { error: linkError } = await adminClient
        .from('student_parents')
        .insert(parentLinks);

      if (linkError) {
        console.error('Error linking parent to students:', linkError);
        // Not fatal
      }
    }

    return apiResponse(
      {
        userId: authUser.user.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      },
      201
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return apiError('Failed to create user', 500, 'CREATE_ERROR');
  }
});
