import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { checkRateLimit, clearMemoryRateLimits, rateLimitKey } from '@/lib/security/rate-limit'

describe('request rate limiting', () => {
  beforeEach(() => {
    clearMemoryRateLimits()
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    clearMemoryRateLimits()
  })

  it('blocks requests after the policy limit is reached', async () => {
    const policy = { id: 'test:limited-action', limit: 2, window: '1 m' as const }

    await expect(checkRateLimit(policy, 'same-user')).resolves.toMatchObject({ success: true, remaining: 1 })
    await expect(checkRateLimit(policy, 'same-user')).resolves.toMatchObject({ success: true, remaining: 0 })
    await expect(checkRateLimit(policy, 'same-user')).resolves.toMatchObject({ success: false, remaining: 0 })
  })

  it('builds stable keys from forwarded IP plus route-specific parts', () => {
    const request = new NextRequest('https://wolfwhale.test/api/lms/grades', {
      headers: {
        'x-forwarded-for': '203.0.113.10, 10.0.0.5',
      },
    })

    expect(rateLimitKey(request, ['Grades', 'Student@Example.COM'])).toBe('203.0.113.10:grades:student@example.com')
  })
})
