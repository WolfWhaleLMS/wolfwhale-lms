import 'server-only'

import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rate-limit'

// ---------------------------------------------------------------------------
// Rate-limit helper for server actions
// ---------------------------------------------------------------------------

export interface RateLimitActionResult {
  success: boolean
  error?: string
}

/**
 * Call at the top of any server action to enforce rate limiting.
 *
 * Uses the "api" tier (30 requests / 60 seconds) by default.
 * Identifies callers by their IP address extracted from request headers.
 *
 * If Upstash is not configured, this always returns `{ success: true }` so
 * the application degrades gracefully.
 *
 * @example
 * ```ts
 * export async function myAction() {
 *   const rl = await rateLimitAction('myAction')
 *   if (!rl.success) return { data: null, error: rl.error }
 *   // ... rest of the action
 * }
 * ```
 */
export async function rateLimitAction(
  actionName: string
): Promise<RateLimitActionResult> {
  const headersList = await headers()

  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown'

  const identifier = `${ip}:${actionName}`

  const result = await rateLimit(identifier, 'api')

  if (!result.success) {
    return {
      success: false,
      error: 'Too many requests. Please try again later.',
    }
  }

  return { success: true }
}
