import { describe, it, expect, vi, beforeEach } from 'vitest'

// ────────────────────────────────────────────────────────────────
// Mock the Supabase server client
// ────────────────────────────────────────────────────────────────
const mockSignInWithPassword = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
    },
  })),
}))

// We must import AFTER the mock is set up
import { demoLogin } from '@/app/actions/demo-auth'

describe('demoLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ──────────────────────────────────────────────────────
  // Invalid role handling
  // ──────────────────────────────────────────────────────
  it('returns an error for an invalid role', async () => {
    const result = await demoLogin('hacker')
    expect(result).toEqual({ error: 'Invalid demo role' })
    // Should NOT call supabase at all
    expect(mockSignInWithPassword).not.toHaveBeenCalled()
  })

  it('returns an error for an empty string role', async () => {
    const result = await demoLogin('')
    expect(result).toEqual({ error: 'Invalid demo role' })
    expect(mockSignInWithPassword).not.toHaveBeenCalled()
  })

  it('returns an error for a role with wrong casing', async () => {
    const result = await demoLogin('Student')
    expect(result).toEqual({ error: 'Invalid demo role' })
    expect(mockSignInWithPassword).not.toHaveBeenCalled()
  })

  // ──────────────────────────────────────────────────────
  // Valid roles
  // ──────────────────────────────────────────────────────
  const validRoles = ['student', 'teacher', 'parent', 'admin'] as const

  for (const role of validRoles) {
    it(`accepts the "${role}" role and calls signInWithPassword`, async () => {
      mockSignInWithPassword.mockResolvedValueOnce({ error: null })

      const result = await demoLogin(role)
      expect(result).toEqual({})
      expect(mockSignInWithPassword).toHaveBeenCalledOnce()
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: `${role}@wolfwhale.ca`,
        password: expect.any(String),
      })
    })
  }

  // ──────────────────────────────────────────────────────
  // Supabase error passthrough
  // ──────────────────────────────────────────────────────
  it('passes through supabase auth errors', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      error: { message: 'Invalid login credentials' },
    })

    const result = await demoLogin('student')
    expect(result).toEqual({ error: 'Invalid login credentials' })
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
      mockSignInWithPassword.mockResolvedValueOnce({ error: null })
      await demoLogin(role)
      expect(mockSignInWithPassword).toHaveBeenCalledWith(
        expect.objectContaining({ email })
      )
      vi.clearAllMocks()
    }
  })
})
