import 'server-only'

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ---------------------------------------------------------------------------
// In-memory fallback rate limiter (for when Redis is not available)
// ---------------------------------------------------------------------------

export const memoryStore = new Map<string, { count: number; resetAt: number }>()

export function memoryRateLimit(key: string, limit: number, windowMs: number): { success: boolean; remaining: number } {
  const now = Date.now()
  const entry = memoryStore.get(key)

  // Clean expired entries periodically
  if (memoryStore.size > 10000) {
    for (const [k, v] of memoryStore) {
      if (v.resetAt < now) memoryStore.delete(k)
    }
  }

  if (!entry || entry.resetAt < now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }

  entry.count++
  if (entry.count > limit) {
    return { success: false, remaining: 0 }
  }
  return { success: true, remaining: limit - entry.count }
}

// ---------------------------------------------------------------------------
// Rate Limit Tiers
// ---------------------------------------------------------------------------

export type RateLimitTier = 'auth' | 'api' | 'general' | 'report'

const TIER_CONFIG: Record<RateLimitTier, { requests: number; window: `${number} s` }> = {
  /** Auth endpoints (login, signup, forgot-password): 10 requests per 60 seconds */
  auth: { requests: 10, window: '60 s' },
  /** API / server actions: 200 requests per 60 seconds */
  api: { requests: 200, window: '60 s' },
  /** General page loads: 300 requests per 60 seconds */
  general: { requests: 300, window: '60 s' },
  /** Report generation (expensive PDF/CSV): 10 requests per 60 seconds */
  report: { requests: 10, window: '60 s' },
}

// ---------------------------------------------------------------------------
// Redis / Ratelimit singleton cache
// ---------------------------------------------------------------------------

let redis: Redis | null = null
let redisUnavailableWarned = false
const limiters = new Map<RateLimitTier, Ratelimit>()

function getRedis(): Redis | null {
  if (redis) return redis

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    if (!redisUnavailableWarned) {
      redisUnavailableWarned = true
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[rate-limit] Upstash Redis not configured — using in-memory fallback.\n' +
          '  Run: npm run setup:redis\n' +
          '  Or visit: https://console.upstash.com to create a free Redis database.\n' +
          '  Then set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local'
        )
      }
    }
    return null
  }

  redis = new Redis({ url, token })
  return redis
}

function getLimiter(tier: RateLimitTier): Ratelimit | null {
  if (limiters.has(tier)) return limiters.get(tier)!

  const redisInstance = getRedis()
  if (!redisInstance) return null

  const config = TIER_CONFIG[tier]
  const limiter = new Ratelimit({
    redis: redisInstance,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    analytics: true,
    prefix: `wolfwhale:ratelimit:${tier}`,
  })

  limiters.set(tier, limiter)
  return limiter
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check rate limit for the given identifier and tier.
 *
 * If Upstash credentials are not configured the function returns a
 * successful result so the app degrades gracefully (no blocking).
 */
export async function rateLimit(
  identifier: string,
  tier: RateLimitTier = 'general'
): Promise<RateLimitResult> {
  const limiter = getLimiter(tier)

  if (!limiter) {
    // Without Redis, in-memory rate limiting is unreliable on serverless
    // (each instance has its own Map). Use 3x the configured limit to only
    // catch obvious abuse while avoiding false positives on normal usage.
    const config = TIER_CONFIG[tier]
    const windowSeconds = parseInt(config.window, 10)
    const generousLimit = config.requests * 3
    const result = memoryRateLimit(
      `wolfwhale:ratelimit:${tier}:${identifier}`,
      generousLimit,
      windowSeconds * 1000
    )
    return {
      success: result.success,
      limit: generousLimit,
      remaining: result.remaining,
      reset: Date.now() + windowSeconds * 1000,
    }
  }

  const result = await limiter.limit(identifier)

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
}
