import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ---------------------------------------------------------------------------
// Rate Limit Tiers
// ---------------------------------------------------------------------------

export type RateLimitTier = 'auth' | 'api' | 'general'

const TIER_CONFIG: Record<RateLimitTier, { requests: number; window: `${number} s` }> = {
  /** Auth endpoints (login, signup, forgot-password): 5 requests per 60 seconds */
  auth: { requests: 5, window: '60 s' },
  /** API / server actions: 30 requests per 60 seconds */
  api: { requests: 30, window: '60 s' },
  /** General page loads: 60 requests per 60 seconds */
  general: { requests: 60, window: '60 s' },
}

// ---------------------------------------------------------------------------
// Redis / Ratelimit singleton cache
// ---------------------------------------------------------------------------

let redis: Redis | null = null
const limiters = new Map<RateLimitTier, Ratelimit>()

function getRedis(): Redis | null {
  if (redis) return redis

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
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

  // Graceful degradation: Upstash not configured
  if (!limiter) {
    const config = TIER_CONFIG[tier]
    return {
      success: true,
      limit: config.requests,
      remaining: config.requests,
      reset: Date.now() + 60_000,
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
