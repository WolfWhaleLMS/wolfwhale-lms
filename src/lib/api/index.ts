import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types/database.types';
import type { ApiResponse } from '@/types';
import { ApiError, UnauthorizedError, ForbiddenError } from './errors';

/**
 * Standard API success response
 */
export function apiResponse<T>(data: T, status: number = 200): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  return NextResponse.json(response, { status });
}

/**
 * Standard API error response
 */
export function apiError(
  message: string,
  status: number = 500,
  code: string = 'INTERNAL_SERVER_ERROR',
  details?: Record<string, any>
): NextResponse {
  const response: ApiResponse<null> = {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
  return NextResponse.json(response, { status });
}

/**
 * Parse query parameters from request URL
 */
export function parseQueryParams(request: NextRequest): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};

  request.nextUrl.searchParams.forEach((value, key) => {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value);
      } else {
        params[key] = [params[key] as string, value];
      }
    } else {
      params[key] = value;
    }
  });

  return params;
}

/**
 * Higher-order function to add authentication to API routes
 */
export function withAuth(
  handler: (
    req: NextRequest,
    opts: { userId: string; email: string; tenantId: string; userRole: string }
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      const supabase = await createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return apiError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      // Get user profile to get tenant and role
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('tenant_id, role')
        .eq('auth_id', user.id)
        .single();

      if (profileError || !profile) {
        return apiError('User profile not found', 404, 'PROFILE_NOT_FOUND');
      }

      return handler(req, {
        userId: user.id,
        email: user.email || '',
        tenantId: profile.tenant_id,
        userRole: profile.role,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        return apiError(error.message, error.statusCode, error.code);
      }

      console.error('API error:', error);
      return apiError('Internal server error', 500, 'INTERNAL_SERVER_ERROR');
    }
  };
}

/**
 * Higher-order function to add role-based access control to API routes
 */
export function withRole(
  roles: UserRole[],
  handler: (
    req: NextRequest,
    opts: { userId: string; email: string; tenantId: string; userRole: string }
  ) => Promise<NextResponse>
) {
  return withAuth(async (req, opts) => {
    if (!roles.includes(opts.userRole as UserRole)) {
      return apiError('Forbidden', 403, 'FORBIDDEN');
    }

    return handler(req, opts);
  });
}

/**
 * Higher-order function to inject tenant data into API routes
 */
export function withTenant(
  handler: (
    req: NextRequest,
    opts: { userId: string; email: string; tenantId: string; userRole: string; tenant: any }
  ) => Promise<NextResponse>
) {
  return withAuth(async (req, opts) => {
    try {
      const supabase = await createClient();

      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', opts.tenantId)
        .single();

      if (tenantError || !tenant) {
        return apiError('Tenant not found', 404, 'TENANT_NOT_FOUND');
      }

      return handler(req, { ...opts, tenant });
    } catch (error) {
      if (error instanceof ApiError) {
        return apiError(error.message, error.statusCode, error.code);
      }

      console.error('Tenant lookup error:', error);
      return apiError('Internal server error', 500, 'INTERNAL_SERVER_ERROR');
    }
  });
}

/**
 * Parse and validate pagination parameters
 */
export function getPaginationParams(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const pageSize = Math.min(Math.max(1, parseInt(searchParams.get('pageSize') || '20')), 100);
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

  return { page, pageSize, sortBy, sortOrder };
}

/**
 * Calculate pagination metadata
 */
export function getPaginationMetadata(page: number, pageSize: number, total: number) {
  const totalPages = Math.ceil(total / pageSize);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Rate limiting using in-memory store (for basic protection)
 * In production, use Upstash Redis
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000 // 1 minute
): Promise<boolean> {
  const now = Date.now();
  const key = identifier;

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Clean up expired rate limit records periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute
