import 'server-only'

import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { rateLimit, type RateLimitTier } from '@/lib/rate-limit'

const KNOWN_AUTH_ERRORS = ['Unauthorized', 'No tenant context']
const KNOWN_FORBIDDEN_ERRORS = ['Not authorized', 'Not authorized for this course', 'Not authorized for this student']
const KNOWN_NOT_FOUND_ERRORS = ['Course not found', 'Student not found']

export function apiErrorResponse(error: unknown): NextResponse {
  const message = error instanceof Error ? error.message : 'Unknown error'

  if (KNOWN_AUTH_ERRORS.some((e) => message.includes(e))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (KNOWN_FORBIDDEN_ERRORS.some((e) => message.includes(e))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (KNOWN_NOT_FOUND_ERRORS.some((e) => message.includes(e))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  console.error('API route error:', message)
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}

export async function rateLimitRoute(
  actionName: string,
  tier: RateLimitTier = 'api'
): Promise<NextResponse | null> {
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown'

  const result = await rateLimit(`${ip}:${actionName}`, tier)

  if (!result.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': String(result.remaining),
        },
      }
    )
  }

  return null
}

export const REPORT_DOWNLOAD_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, private',
  'Pragma': 'no-cache',
} as const
