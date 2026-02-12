import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock 'server-only' so it doesn't throw in the test environment
vi.mock('server-only', () => ({}))

// Mock Upstash modules so they don't require real credentials
vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: vi.fn(),
}))
vi.mock('@upstash/redis', () => ({
  Redis: vi.fn(),
}))

import { memoryRateLimit, memoryStore } from '@/lib/rate-limit'

describe('memoryRateLimit', () => {
  beforeEach(() => {
    memoryStore.clear()
  })

  it('allows the first request', () => {
    const result = memoryRateLimit('test-key', 5, 60_000)
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('allows up to the limit', () => {
    for (let i = 0; i < 5; i++) {
      const result = memoryRateLimit('test-key', 5, 60_000)
      expect(result.success).toBe(true)
    }
  })

  it('blocks the request after exceeding the limit', () => {
    // Use all 5 allowed requests
    for (let i = 0; i < 5; i++) {
      memoryRateLimit('test-key', 5, 60_000)
    }
    // 6th request should fail
    const result = memoryRateLimit('test-key', 5, 60_000)
    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('tracks remaining count correctly', () => {
    const r1 = memoryRateLimit('test-key', 3, 60_000)
    expect(r1.remaining).toBe(2)

    const r2 = memoryRateLimit('test-key', 3, 60_000)
    expect(r2.remaining).toBe(1)

    const r3 = memoryRateLimit('test-key', 3, 60_000)
    expect(r3.remaining).toBe(0)
  })

  it('isolates different keys', () => {
    // Exhaust key-a
    for (let i = 0; i < 3; i++) {
      memoryRateLimit('key-a', 3, 60_000)
    }
    const blocked = memoryRateLimit('key-a', 3, 60_000)
    expect(blocked.success).toBe(false)

    // key-b should still be available
    const allowed = memoryRateLimit('key-b', 3, 60_000)
    expect(allowed.success).toBe(true)
  })

  it('resets after the window expires', () => {
    // Use a very short window (1ms)
    for (let i = 0; i < 3; i++) {
      memoryRateLimit('test-key', 3, 1)
    }

    // Force the window to expire by manipulating the store entry
    const entry = memoryStore.get('test-key')
    if (entry) {
      entry.resetAt = Date.now() - 1
    }

    // Should succeed again
    const result = memoryRateLimit('test-key', 3, 60_000)
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it('handles limit of 1 (single request allowed)', () => {
    const r1 = memoryRateLimit('single', 1, 60_000)
    expect(r1.success).toBe(true)
    expect(r1.remaining).toBe(0)

    const r2 = memoryRateLimit('single', 1, 60_000)
    expect(r2.success).toBe(false)
    expect(r2.remaining).toBe(0)
  })

  it('cleans up expired entries when store exceeds 10000', () => {
    // Fill the store with expired entries
    const pastTime = Date.now() - 1000
    for (let i = 0; i < 10001; i++) {
      memoryStore.set(`expired-${i}`, { count: 1, resetAt: pastTime })
    }
    expect(memoryStore.size).toBe(10001)

    // This call should trigger cleanup
    memoryRateLimit('new-key', 5, 60_000)

    // Expired entries should be cleaned up
    expect(memoryStore.size).toBeLessThan(10001)
  })
})
