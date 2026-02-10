import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withRole } from '@/lib/api';
import { apiResponse, apiError } from '@/lib/api';
import { updateUserSchema } from '@/lib/validation/schemas';

function getUserIdFromUrl(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split('/');
  return segments[segments.length - 1];
}

/**
 * GET /api/admin/users/[userId]
 * Fetch single user details (admin only)
 */
export const GET = withRole(['admin', 'super_admin'], async (req, opts) => {
  try {
    const supabase = await createClient();
    const userId = getUserIdFromUrl(req);

    let query = supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId);

    if (opts.userRole === 'admin') {
      query = query.eq('tenant_id', opts.tenantId);
    }

    const { data: user, error } = await query.single();

    if (error || !user) {
      return apiError('User not found', 404, 'NOT_FOUND');
    }

    return apiResponse(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return apiError('Failed to fetch user', 500, 'FETCH_ERROR');
  }
});

/**
 * PUT /api/admin/users/[userId]
 * Update user (admin only)
 */
export const PUT = withRole(['admin', 'super_admin'], async (req, opts) => {
  try {
    const supabase = await createClient();
    const userId = getUserIdFromUrl(req);
    const body = await req.json();

    const validation = updateUserSchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        'Validation failed',
        400,
        'VALIDATION_ERROR',
        validation.error.flatten().fieldErrors
      );
    }

    let query = supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId);

    if (opts.userRole === 'admin') {
      query = query.eq('tenant_id', opts.tenantId);
    }

    const { data: currentUser, error: getUserError } = await query.single();

    if (getUserError || !currentUser) {
      return apiError('User not found', 404, 'NOT_FOUND');
    }

    const updateData: any = {};
    const validation_data = validation.data;

    if (validation_data.firstName) updateData.first_name = validation_data.firstName;
    if (validation_data.lastName) updateData.last_name = validation_data.lastName;
    if (validation_data.gradeLevel !== undefined) updateData.grade_level = validation_data.gradeLevel;
    if (validation_data.role) updateData.role = validation_data.role;
    if (validation_data.profilePictureUrl) updateData.profile_picture_url = validation_data.profilePictureUrl;
    if (validation_data.bio) updateData.bio = validation_data.bio;

    updateData.updated_at = new Date().toISOString();

    const { data: updatedUser, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return apiResponse(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return apiError('Failed to update user', 500, 'UPDATE_ERROR');
  }
});

/**
 * DELETE /api/admin/users/[userId]
 * Soft delete user (admin only)
 */
export const DELETE = withRole(['admin', 'super_admin'], async (req, opts) => {
  try {
    const supabase = await createClient();
    const userId = getUserIdFromUrl(req);

    let query = supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId);

    if (opts.userRole === 'admin') {
      query = query.eq('tenant_id', opts.tenantId);
    }

    const { data: user, error: getUserError } = await query.single();

    if (getUserError || !user) {
      return apiError('User not found', 404, 'NOT_FOUND');
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return apiResponse({ success: true, message: 'User deactivated' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return apiError('Failed to delete user', 500, 'DELETE_ERROR');
  }
});
