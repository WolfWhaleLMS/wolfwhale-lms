'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { z } from 'zod';
import { type ApiResponse } from '@/types';
import type { UserRole } from '@/types/database.types';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain a special character'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  role: z.enum(['student', 'parent', 'teacher', 'admin']),
  schoolCode: z.string().optional(),
  schoolName: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  acceptCOPPA: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain a special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100).optional(),
  lastName: z.string().min(1, 'Last name is required').max(100).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

/**
 * Helper to determine dashboard URL from role
 */
function getDashboardUrl(role: string | null): string {
  switch (role) {
    case 'student':
      return '/student/dashboard';
    case 'teacher':
      return '/teacher/dashboard';
    case 'parent':
      return '/parent/dashboard';
    case 'admin':
    case 'super_admin':
      return '/admin/dashboard';
    default:
      return '/student/dashboard';
  }
}

/**
 * Server action for user login
 */
export async function loginAction(formData: FormData): Promise<ApiResponse<{ redirectUrl: string }>> {
  try {
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    // Validate input
    const validated = loginSchema.parse({ email, password });

    const supabase = await createClient();

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (error || !data.user) {
      return {
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: error?.message || 'Invalid email or password',
        },
      };
    }

    // Get user role from tenant_memberships to determine redirect
    const { data: membership } = await supabase
      .from('tenant_memberships')
      .select('role, tenant_id')
      .eq('user_id', data.user.id)
      .eq('status', 'active')
      .limit(1)
      .single();

    const redirectUrl = getDashboardUrl(membership?.role || null);

    return {
      success: true,
      data: { redirectUrl },
      message: 'Login successful',
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

    return {
      success: false,
      error: {
        code: 'LOGIN_ERROR',
        message: 'An unexpected error occurred',
      },
    };
  }
}

/**
 * Server action for user registration.
 * Creates: auth user -> profile row -> tenant_membership row.
 */
export async function registerAction(formData: FormData): Promise<ApiResponse<{ message: string }>> {
  try {
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const confirmPassword = formData.get('confirmPassword')?.toString() || '';
    const firstName = formData.get('firstName')?.toString() || '';
    const lastName = formData.get('lastName')?.toString() || '';
    const role = formData.get('role')?.toString() || '';
    const schoolCode = formData.get('schoolCode')?.toString();
    const schoolName = formData.get('schoolName')?.toString();
    const acceptTerms = formData.get('acceptTerms') === 'true' || formData.get('acceptTerms') === 'on';
    const acceptCOPPA = formData.get('acceptCOPPA') === 'true' || formData.get('acceptCOPPA') === 'on';

    // Validate input
    const validated = registerSchema.parse({
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      role,
      schoolCode,
      schoolName,
      acceptTerms,
      acceptCOPPA: role === 'parent' ? acceptCOPPA : undefined,
    });

    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Determine tenant
    let tenantId: string;

    if (validated.role === 'admin' && validated.schoolName) {
      // Create new school/tenant for admin
      const slug = validated.schoolName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 50) + '-' + Date.now().toString(36);

      const { data: tenant, error: tenantError } = await adminClient
        .from('tenants')
        .insert({
          name: validated.schoolName,
          slug,
          subscription_plan: 'starter',
          status: 'active',
        })
        .select()
        .single();

      if (tenantError || !tenant) {
        return {
          success: false,
          error: {
            code: 'TENANT_CREATION_FAILED',
            message: 'Failed to create school',
          },
        };
      }
      tenantId = tenant.id;
    } else if (validated.schoolCode) {
      // Join existing school by slug
      const { data: tenant } = await adminClient
        .from('tenants')
        .select('id')
        .eq('slug', validated.schoolCode.toLowerCase())
        .eq('status', 'active')
        .single();

      if (!tenant) {
        return {
          success: false,
          error: {
            code: 'INVALID_SCHOOL_CODE',
            message: 'Invalid school code. Please check with your school administrator.',
          },
        };
      }
      tenantId = tenant.id;
    } else {
      return {
        success: false,
        error: {
          code: 'MISSING_TENANT',
          message: 'School code or school name is required',
        },
      };
    }

    // Sign up user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      },
    });

    if (error || !data.user) {
      return {
        success: false,
        error: {
          code: 'SIGNUP_FAILED',
          message: error?.message || 'Failed to create account',
        },
      };
    }

    // Create profile row (id = auth user id)
    const { error: profileError } = await adminClient
      .from('profiles')
      .insert({
        id: data.user.id,
        first_name: validated.firstName,
        last_name: validated.lastName,
      });

    if (profileError) {
      // Clean up the auth user if profile creation fails
      await adminClient.auth.admin.deleteUser(data.user.id);
      return {
        success: false,
        error: {
          code: 'PROFILE_CREATION_FAILED',
          message: 'Failed to create user profile',
        },
      };
    }

    // Create tenant_membership row (links user to school with role)
    const { error: membershipError } = await adminClient
      .from('tenant_memberships')
      .insert({
        tenant_id: tenantId,
        user_id: data.user.id,
        role: validated.role as UserRole,
        status: 'active',
      });

    if (membershipError) {
      // Clean up profile and auth user
      await adminClient.from('profiles').delete().eq('id', data.user.id);
      await adminClient.auth.admin.deleteUser(data.user.id);
      return {
        success: false,
        error: {
          code: 'MEMBERSHIP_CREATION_FAILED',
          message: 'Failed to create school membership',
        },
      };
    }

    return {
      success: true,
      data: { message: 'Account created successfully. Please check your email to confirm.' },
      message: 'Check your email to confirm your account',
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

    return {
      success: false,
      error: {
        code: 'REGISTER_ERROR',
        message: 'An unexpected error occurred',
      },
    };
  }
}

/**
 * Server action for forgot password
 */
export async function forgotPasswordAction(formData: FormData): Promise<ApiResponse<{ message: string }>> {
  try {
    const email = formData.get('email')?.toString() || '';

    // Validate input
    const validated = forgotPasswordSchema.parse({ email });

    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(validated.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error: {
          code: 'PASSWORD_RESET_FAILED',
          message: error.message,
        },
      };
    }

    return {
      success: true,
      data: { message: 'Password reset email sent' },
      message: 'Check your email for password reset instructions',
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

    return {
      success: false,
      error: {
        code: 'PASSWORD_RESET_ERROR',
        message: 'An unexpected error occurred',
      },
    };
  }
}

/**
 * Server action for reset password (after clicking the email link)
 */
export async function resetPasswordAction(formData: FormData): Promise<ApiResponse<{ message: string }>> {
  try {
    const password = formData.get('password')?.toString() || '';
    const confirmPassword = formData.get('confirmPassword')?.toString() || '';

    // Validate input
    const validated = resetPasswordSchema.parse({ password, confirmPassword });

    const supabase = await createClient();

    // The user should already have a session from the reset link (code exchange in callback)
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: {
          code: 'NO_SESSION',
          message: 'Reset link expired or invalid. Please request a new one.',
        },
      };
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: validated.password,
    });

    if (error) {
      return {
        success: false,
        error: {
          code: 'PASSWORD_UPDATE_FAILED',
          message: error.message,
        },
      };
    }

    return {
      success: true,
      data: { message: 'Password updated successfully' },
      message: 'Your password has been reset',
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

    return {
      success: false,
      error: {
        code: 'PASSWORD_RESET_ERROR',
        message: 'An unexpected error occurred',
      },
    };
  }
}

/**
 * Server action for sign out
 */
export async function signOutAction(): Promise<ApiResponse<{ message: string }>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: {
          code: 'SIGN_OUT_FAILED',
          message: error.message,
        },
      };
    }

    return {
      success: true,
      data: { message: 'Signed out successfully' },
      message: 'You have been signed out',
    };
  } catch {
    return {
      success: false,
      error: {
        code: 'SIGN_OUT_ERROR',
        message: 'An unexpected error occurred',
      },
    };
  }
}

/**
 * Server action to update user profile
 */
export async function updateProfileAction(formData: FormData): Promise<ApiResponse<{ message: string }>> {
  try {
    const firstName = formData.get('firstName')?.toString();
    const lastName = formData.get('lastName')?.toString();
    const phone = formData.get('phone')?.toString();
    const bio = formData.get('bio')?.toString();

    // Validate input
    const validated = updateProfileSchema.parse({
      firstName,
      lastName,
      phone,
      bio,
    });

    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'Not authenticated',
        },
      };
    }

    // Build update object for the profiles table
    const updateData: Record<string, string> = {};
    if (validated.firstName) updateData.first_name = validated.firstName;
    if (validated.lastName) updateData.last_name = validated.lastName;
    if (validated.phone !== undefined) updateData.phone = validated.phone;
    if (validated.bio !== undefined) updateData.bio = validated.bio;
    updateData.updated_at = new Date().toISOString();

    // Update profile (id = auth user id)
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (error) {
      return {
        success: false,
        error: {
          code: 'PROFILE_UPDATE_FAILED',
          message: error.message,
        },
      };
    }

    return {
      success: true,
      data: { message: 'Profile updated successfully' },
      message: 'Your profile has been updated',
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

    return {
      success: false,
      error: {
        code: 'PROFILE_UPDATE_ERROR',
        message: 'An unexpected error occurred',
      },
    };
  }
}
