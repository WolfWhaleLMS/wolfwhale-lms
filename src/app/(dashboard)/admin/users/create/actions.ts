'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { requireRole, getUserTenantId } from '@/lib/auth';
import { z } from 'zod';
import type { ApiResponse } from '@/types';
import type { UserRole } from '@/types/database.types';

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  role: z.enum(['teacher', 'student', 'parent'], {
    errorMap: () => ({ message: 'Role must be teacher, student, or parent' }),
  }),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

export async function createUserAction(formData: FormData): Promise<ApiResponse<{ userId: string }>> {
  try {
    // Verify caller is an admin
    await requireRole(['admin', 'super_admin']);
    const tenantId = await getUserTenantId();

    if (!tenantId) {
      return {
        success: false,
        error: {
          code: 'NO_TENANT',
          message: 'No school found for your account.',
        },
      };
    }

    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const firstName = formData.get('firstName')?.toString() || '';
    const lastName = formData.get('lastName')?.toString() || '';
    const role = formData.get('role')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const bio = formData.get('bio')?.toString() || '';

    // Validate input
    const validated = createUserSchema.parse({
      email,
      password,
      firstName,
      lastName,
      role,
      phone: phone || undefined,
      bio: bio || undefined,
    });

    // SECURITY: Admin cannot create other admins or super_admins
    if (validated.role !== 'teacher' && validated.role !== 'student' && validated.role !== 'parent') {
      return {
        success: false,
        error: {
          code: 'FORBIDDEN_ROLE',
          message: 'You can only create teacher, student, or parent accounts.',
        },
      };
    }

    const adminClient = createAdminClient();

    // Create auth user via admin API (auto-confirmed, no email verification needed)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: validated.email,
      password: validated.password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: {
          code: 'AUTH_CREATION_FAILED',
          message: authError?.message || 'Failed to create auth user',
        },
      };
    }

    const userId = authData.user.id;

    // Create profile row
    const { error: profileError } = await adminClient
      .from('profiles')
      .insert({
        id: userId,
        first_name: validated.firstName,
        last_name: validated.lastName,
        phone: validated.phone || null,
        bio: validated.bio || null,
      });

    if (profileError) {
      // Clean up auth user
      await adminClient.auth.admin.deleteUser(userId);
      return {
        success: false,
        error: {
          code: 'PROFILE_CREATION_FAILED',
          message: 'Failed to create user profile: ' + profileError.message,
        },
      };
    }

    // Create tenant membership
    const { error: membershipError } = await adminClient
      .from('tenant_memberships')
      .insert({
        tenant_id: tenantId,
        user_id: userId,
        role: validated.role as UserRole,
        status: 'active',
      });

    if (membershipError) {
      // Clean up profile and auth user
      await adminClient.from('profiles').delete().eq('id', userId);
      await adminClient.auth.admin.deleteUser(userId);
      return {
        success: false,
        error: {
          code: 'MEMBERSHIP_CREATION_FAILED',
          message: 'Failed to create school membership: ' + membershipError.message,
        },
      };
    }

    // Log the action in audit_logs
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    await adminClient
      .from('audit_logs')
      .insert({
        tenant_id: tenantId,
        user_id: currentUser?.id || null,
        action: 'user.created',
        resource_type: 'user',
        resource_id: userId,
        target_user_id: userId,
        details: {
          description: `Created ${validated.role} account for ${validated.firstName} ${validated.lastName}`,
          email: validated.email,
          role: validated.role,
        },
      });

    return {
      success: true,
      data: { userId },
      message: `${validated.role.charAt(0).toUpperCase() + validated.role.slice(1)} account created successfully.`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.errors[0].message,
          details: error.errors,
        },
      };
    }

    // Check if this is a redirect error from requireRole
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }

    return {
      success: false,
      error: {
        code: 'CREATE_USER_ERROR',
        message: 'An unexpected error occurred while creating the user.',
      },
    };
  }
}
