import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth } from '@/lib/api';
import { apiResponse, apiError, getPaginationParams, getPaginationMetadata } from '@/lib/api';

/**
 * GET /api/notifications
 * Fetch notifications for current user
 */
export const GET = withAuth(async (req, opts) => {
  try {
    const supabase = await createClient();
    const { page, pageSize, sortBy = 'created_at', sortOrder } = getPaginationParams(req);
    const searchParams = req.nextUrl.searchParams;
    const unread = searchParams.get('unread') === 'true';

    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', opts.userId)
      .eq('tenant_id', opts.tenantId);

    if (unread) {
      query = query.eq('read', false);
    }

    const { data: notifications, count, error } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      throw error;
    }

    // Get unread count
    const { count: unreadCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', opts.userId)
      .eq('tenant_id', opts.tenantId)
      .eq('read', false);

    return apiResponse({
      notifications: notifications || [],
      unreadCount: unreadCount || 0,
      pagination: getPaginationMetadata(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return apiError('Failed to fetch notifications', 500, 'FETCH_ERROR');
  }
});

/**
 * PATCH /api/notifications
 * Mark notifications as read
 */
export const PATCH = withAuth(async (req, opts) => {
  try {
    const supabase = await createClient();
    const { notificationIds, markAllAsRead } = await req.json();

    if (markAllAsRead) {
      // Mark all notifications as read
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', opts.userId)
        .eq('tenant_id', opts.tenantId)
        .eq('read', false);

      if (error) {
        throw error;
      }

      return apiResponse({ message: 'All notifications marked as read' });
    }

    if (!notificationIds || notificationIds.length === 0) {
      return apiError('Notification IDs are required', 400, 'VALIDATION_ERROR');
    }

    // Mark specific notifications as read
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .in('id', notificationIds)
      .eq('user_id', opts.userId);

    if (error) {
      throw error;
    }

    return apiResponse({ count: notificationIds.length });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return apiError('Failed to mark notifications as read', 500, 'UPDATE_ERROR');
  }
});
