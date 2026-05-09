import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import type { NextRequest } from 'next/server'

export type RateLimitWindow = `${number} ${'s' | 'm' | 'h' | 'd'}`

export interface RateLimitPolicy {
  id: string
  limit: number
  window: RateLimitWindow
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  source: 'upstash' | 'memory'
}

const memoryBuckets = new Map<string, number[]>()
const upstashLimiters = new Map<string, Ratelimit>()

function parseWindowMs(window: RateLimitWindow) {
  const [amountText, unit] = window.split(' ')
  const amount = Number(amountText)
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  }

  return amount * multipliers[unit as keyof typeof multipliers]
}

function upstashIsConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

function getUpstashLimiter(policy: RateLimitPolicy) {
  const cacheKey = `${policy.id}:${policy.limit}:${policy.window}`
  const cached = upstashLimiters.get(cacheKey)
  if (cached) return cached

  const limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(policy.limit, policy.window),
    prefix: `wolfwhale:${policy.id}`,
  })
  upstashLimiters.set(cacheKey, limiter)

  return limiter
}

export function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = request.headers.get('x-real-ip')?.trim()

  return forwarded || realIp || 'unknown-ip'
}

export function rateLimitKey(request: NextRequest, parts: readonly string[]) {
  return [getClientIp(request), ...parts.map((part) => part.trim().toLowerCase()).filter(Boolean)].join(':')
}

export async function checkRateLimit(policy: RateLimitPolicy, key: string): Promise<RateLimitResult> {
  if (upstashIsConfigured()) {
    const result = await getUpstashLimiter(policy).limit(key)

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      source: 'upstash',
    }
  }

  const now = Date.now()
  const windowMs = parseWindowMs(policy.window)
  const bucketKey = `${policy.id}:${key}`
  const activeHits = (memoryBuckets.get(bucketKey) ?? []).filter((timestamp) => now - timestamp < windowMs)
  const success = activeHits.length < policy.limit

  if (success) {
    activeHits.push(now)
  }

  memoryBuckets.set(bucketKey, activeHits)

  return {
    success,
    limit: policy.limit,
    remaining: Math.max(policy.limit - activeHits.length, 0),
    reset: activeHits[0] ? activeHits[0] + windowMs : now + windowMs,
    source: 'memory',
  }
}

export function clearMemoryRateLimits() {
  memoryBuckets.clear()
}
