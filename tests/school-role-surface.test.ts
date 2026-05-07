import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { ROLE_SURFACES } from '@/lib/school-launch/role-surfaces'
import { describe, expect, it } from 'vitest'

const repoRoot = path.resolve(__dirname, '..')

describe('school launch role surface', () => {
  it('defines the minimum school roles expected for a controlled pilot', () => {
    expect(ROLE_SURFACES.map((surface) => surface.role)).toEqual(['student', 'teacher', 'admin', 'guardian'])

    for (const surface of ROLE_SURFACES) {
      expect(surface.status).toBe('controlled-pilot')
      expect(surface.requiredBeforeRealData.length).toBeGreaterThanOrEqual(3)
      expect(surface.primaryWorkflows.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('has a persistent Supabase-backed route page for each school role', () => {
    for (const surface of ROLE_SURFACES) {
      const pagePath = path.join(repoRoot, `app/${surface.role}/page.tsx`)

      expect(existsSync(pagePath)).toBe(true)

      const source = readFileSync(pagePath, 'utf8')
      expect(source).toContain('loadLmsDashboardView')
      expect(source).not.toContain('PilotRoleDashboard')
      expect(source).not.toMatch(/mock|fake|demo grade|sample student/i)
    }
  })

  it('protects school role routes at the Next 16 proxy with Supabase session refresh', () => {
    const proxyPath = path.join(repoRoot, 'proxy.ts')
    expect(existsSync(proxyPath)).toBe(true)

    const source = readFileSync(proxyPath, 'utf8')

    for (const surface of ROLE_SURFACES) {
      expect(source).toContain(`/${surface.role}`)
    }

    expect(source).toContain('export async function proxy')
    expect(source).toContain('updateSupabaseSession')
    expect(source).toContain('/login')
  })
})
