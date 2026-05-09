import { NextRequest, NextResponse } from 'next/server'
import { LmsMutationError } from '@/lib/lms/mutations'
import { checkRateLimit, rateLimitKey, type RateLimitWindow } from '@/lib/security/rate-limit'

export function lmsRedirect(request: NextRequest, pathname: string, params: Record<string, string>) {
  const destination = new URL(pathname, request.url)

  for (const [key, value] of Object.entries(params)) {
    destination.searchParams.set(key, value)
  }

  return NextResponse.redirect(destination, { status: 303 })
}

export function lmsMutationErrorCode(error: unknown) {
  if (error instanceof LmsMutationError) {
    return error.code
  }

  return 'lms_mutation_failed'
}

export async function enforceLmsMutationRateLimit(
  request: NextRequest,
  action: string,
  options: { limit?: number; window?: RateLimitWindow; keyParts?: readonly string[] } = {}
) {
  const result = await checkRateLimit(
    {
      id: `lms:${action}`,
      limit: options.limit ?? 45,
      window: options.window ?? '1 m',
    },
    rateLimitKey(request, [action, ...(options.keyParts ?? [])])
  )

  if (!result.success) {
    throw new LmsMutationError('Too many LMS requests. Please wait and try again.', 'rate_limited')
  }
}
