import { NextRequest, NextResponse } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockUpdateSupabaseSession = vi.hoisted(() => vi.fn())

vi.mock('@/lib/supabase/proxy', () => ({
  updateSupabaseSession: mockUpdateSupabaseSession,
}))

import { proxy } from '@/proxy'
import {
  PILOT_SESSION_COOKIE,
  createPilotSessionCookieValue,
  readPilotSessionCookieValue,
  rolePath,
} from '@/lib/pilot/session'

const originalEnv = { ...process.env }

function requestFor(pathname: string, cookieValue?: string, headers: Record<string, string> = {}) {
  return new NextRequest(`https://wolfwhale.test${pathname}`, {
    headers: {
      ...headers,
      ...(cookieValue ? { cookie: `${PILOT_SESSION_COOKIE}=${cookieValue}` } : {}),
    },
  })
}

describe('pilot authentication', () => {
  beforeEach(() => {
    process.env.PILOT_SESSION_SECRET = 'test-session-secret-with-enough-length'
    process.env.PILOT_ACCESS_CODE = 'launch-tomorrow'
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    mockUpdateSupabaseSession.mockReset()
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('creates a signed pilot session cookie that verifies back to a role', async () => {
    const cookie = await createPilotSessionCookieValue('teacher', 1_778_164_000_000)

    const session = await readPilotSessionCookieValue(cookie, 1_778_164_001_000)

    expect(session?.role).toBe('teacher')
    expect(session?.expiresAt).toBeGreaterThan(1_778_164_001_000)
  })

  it('rejects tampered pilot session cookies', async () => {
    const cookie = await createPilotSessionCookieValue('student', 1_778_164_000_000)
    const tampered = `${cookie.slice(0, -1)}${cookie.endsWith('a') ? 'b' : 'a'}`

    await expect(readPilotSessionCookieValue(tampered, 1_778_164_001_000)).resolves.toBeNull()
  })

  it('maps each role to its protected route', () => {
    expect(rolePath('student')).toBe('/student')
    expect(rolePath('teacher')).toBe('/teacher')
    expect(rolePath('admin')).toBe('/admin')
    expect(rolePath('guardian')).toBe('/guardian')
  })

  it('redirects unauthenticated users from protected role routes to login', async () => {
    const response = await proxy(requestFor('/student'))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://wolfwhale.test/login?next=%2Fstudent')
  })

  it('canonicalizes the legacy student dashboard alias before auth handling', async () => {
    const response = await proxy(requestFor('/student/dashboard'))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://wolfwhale.test/student')
  })

  it('preserves the active host when protected-route redirects run in local dev', async () => {
    const request = new NextRequest('http://localhost:3010/student', {
      headers: {
        host: '127.0.0.1:3010',
      },
    })
    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://127.0.0.1:3010/login?next=%2Fstudent')
  })

  it('allows valid-role users through their protected route', async () => {
    const cookie = await createPilotSessionCookieValue('student')
    const response = await proxy(requestFor('/student', cookie))

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
  })

  it('redirects valid sessions away from the wrong role route', async () => {
    const cookie = await createPilotSessionCookieValue('teacher')
    const response = await proxy(requestFor('/student', cookie))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://wolfwhale.test/teacher')
  })

  it('does not let a stale pilot cookie override an active Supabase session', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://school.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'
    mockUpdateSupabaseSession.mockImplementation(async (request: NextRequest) => ({
      claims: { sub: 'student-user-id' },
      response: NextResponse.next({ request }),
    }))

    const staleTeacherCookie = await createPilotSessionCookieValue('teacher')
    const response = await proxy(requestFor('/student', staleTeacherCookie))

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
    expect(mockUpdateSupabaseSession).toHaveBeenCalled()
  })
})
