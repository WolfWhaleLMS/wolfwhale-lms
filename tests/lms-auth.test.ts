import { readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  getSupabaseBrowserEnv,
  isSafeAuthRedirectPath,
  normalizeMembershipRole,
  rolePathForMembershipRole,
} from '@/lib/lms/auth'
import { lmsRedirect } from '@/lib/lms/route-helpers'
import { NextRequest } from 'next/server'

const originalEnv = { ...process.env }
const repoRoot = path.resolve(__dirname, '..')

describe('LMS production auth foundation', () => {
  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('uses the publishable key when present and falls back to the anon key during migration', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://school.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_123'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'legacy-anon'

    expect(getSupabaseBrowserEnv()).toEqual({
      url: 'https://school.supabase.co',
      key: 'sb_publishable_123',
    })

    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    expect(getSupabaseBrowserEnv()).toEqual({
      url: 'https://school.supabase.co',
      key: 'legacy-anon',
    })
  })

  it('rejects missing Supabase browser configuration', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    expect(() => getSupabaseBrowserEnv()).toThrow('NEXT_PUBLIC_SUPABASE_URL')
  })

  it('normalizes database roles to sellable LMS route roles', () => {
    expect(normalizeMembershipRole('student')).toBe('student')
    expect(normalizeMembershipRole('teacher')).toBe('teacher')
    expect(normalizeMembershipRole('parent')).toBe('guardian')
    expect(normalizeMembershipRole('admin')).toBe('admin')
    expect(normalizeMembershipRole('super_admin')).toBe('admin')
    expect(normalizeMembershipRole('unknown')).toBeNull()
  })

  it('maps membership roles to protected role paths', () => {
    expect(rolePathForMembershipRole('student')).toBe('/student')
    expect(rolePathForMembershipRole('teacher')).toBe('/teacher')
    expect(rolePathForMembershipRole('parent')).toBe('/guardian')
    expect(rolePathForMembershipRole('admin')).toBe('/admin')
    expect(rolePathForMembershipRole('super_admin')).toBe('/admin')
  })

  it('allows only local role paths as post-login redirects', () => {
    expect(isSafeAuthRedirectPath('/student')).toBe(true)
    expect(isSafeAuthRedirectPath('/teacher?course=123')).toBe(true)
    expect(isSafeAuthRedirectPath('/admin#courses')).toBe(true)
    expect(isSafeAuthRedirectPath('/guardian')).toBe(true)

    expect(isSafeAuthRedirectPath('/')).toBe(false)
    expect(isSafeAuthRedirectPath('/api/auth/logout')).toBe(false)
    expect(isSafeAuthRedirectPath('https://evil.example/student')).toBe(false)
    expect(isSafeAuthRedirectPath('//evil.example/student')).toBe(false)
    expect(isSafeAuthRedirectPath('/student/../../admin')).toBe(false)
  })

  it('renders a production email/password login form instead of the pilot role-code gate', () => {
    const source = readFileSync(path.join(repoRoot, 'app/login/page.tsx'), 'utf8')

    expect(source).toContain('action="/api/auth/login"')
    expect(source).toContain('name="email"')
    expect(source).toContain('name="password"')
    expect(source).toContain('autoComplete="email"')
    expect(source).toContain('autoComplete="current-password"')
    expect(source).not.toContain('Pilot role')
    expect(source).not.toContain('Access code')
    expect(source).not.toContain('/api/pilot/login')
  })

  it('keeps demo accounts as one-click real-auth forms on the login screen', () => {
    const source = readFileSync(path.join(repoRoot, 'app/login/page.tsx'), 'utf8')

    expect(source).toContain('aria-label={`Use ${account.role} demo account`}')
    expect(source).toContain('{account.role} demo')

    for (const role of ['Student', 'Teacher', 'Guardian', 'Admin']) {
      expect(source).toContain(`role: '${role}'`)
    }

    expect(source).toContain('type="hidden" name="email"')
    expect(source).toContain('type="hidden" name="password"')
    expect(source).toContain('Demo launch accounts')
  })

  it('keeps local form redirects relative so auth cookies stay on the active host', () => {
    const request = new NextRequest('http://localhost:3010/api/lms/grades', {
      headers: {
        host: '127.0.0.1:3010',
      },
    })

    const response = lmsRedirect(request, '/student', { saved: '1' })

    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe('/student?saved=1')
    expect(() => lmsRedirect(request, '/student/../../admin', {})).toThrow('Unsafe local redirect location')
  })

  it('uses relative redirects from the real Supabase login route', () => {
    const source = readFileSync(path.join(repoRoot, 'app/api/auth/login/route.ts'), 'utf8')

    expect(source).toContain('localRedirect(')
    expect(source).not.toContain("new URL('/login', request.url)")
    expect(source).not.toContain('new URL(safeAuthRedirectPath(next, fallback), request.url)')
  })
})
