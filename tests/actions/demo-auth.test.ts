import { describe, it, expect, vi, beforeEach } from 'vitest'

// ────────────────────────────────────────────────────────────────
// Mock the rate limiter
// ────────────────────────────────────────────────────────────────
vi.mock('@/lib/rate-limit-action', () => ({
  rateLimitAction: vi.fn(async () => ({ success: true })),
}))

// Set the env var for tests
vi.stubEnv('DEMO_ACCOUNT_PASSWORD', 'TestPassword123!')

// We must import AFTER the mock is set up
import { getDemoCredentials } from '@/app/actions/demo-auth'
import { rateLimitAction } from '@/lib/rate-limit-action'

describe('getDemoCredentials', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ──────────────────────────────────────────────────────
  // Invalid role handling
  // ──────────────────────────────────────────────────────
  it('returns an error for an invalid role', async () => {
    const result = await getDemoCredentials('hacker')
    expect(result).toEqual({ error: 'Invalid demo role' })
  })

  it('returns an error for an empty string role', async () => {
    const result = await getDemoCredentials('')
    expect(result).toEqual({ error: 'Invalid demo role' })
  })

  it('returns an error for a role with wrong casing', async () => {
    const result = await getDemoCredentials('Student')
    expect(result).toEqual({ error: 'Invalid demo role' })
  })

  // ──────────────────────────────────────────────────────
  // Valid roles — returns email + password
  // ──────────────────────────────────────────────────────
  const validRoles = ['student', 'teacher', 'parent', 'admin'] as const

  for (const role of validRoles) {
    it(`returns credentials for the "${role}" role`, async () => {
      const result = await getDemoCredentials(role)
      expect(result).toEqual({
        email: `${role}@wolfwhale.ca`,
        password: 'TestPassword123!',
      })
    })
  }

  // ──────────────────────────────────────────────────────
  // Rate limiting
  // ──────────────────────────────────────────────────────
  it('returns an error when rate limited', async () => {
    vi.mocked(rateLimitAction).mockResolvedValueOnce({
      success: false,
      error: 'Too many attempts',
    })

    const result = await getDemoCredentials('student')
    expect(result).toEqual({ error: 'Too many attempts' })
  })

  // ──────────────────────────────────────────────────────
  // Correct email mapping
  // ──────────────────────────────────────────────────────
  it('maps each role to the correct demo email', async () => {
    const expectedEmails: Record<string, string> = {
      student: 'student@wolfwhale.ca',
      teacher: 'teacher@wolfwhale.ca',
      parent: 'parent@wolfwhale.ca',
      admin: 'admin@wolfwhale.ca',
    }

    for (const [role, email] of Object.entries(expectedEmails)) {
      const result = await getDemoCredentials(role)
      expect(result.email).toBe(email)
    }
  })
})
