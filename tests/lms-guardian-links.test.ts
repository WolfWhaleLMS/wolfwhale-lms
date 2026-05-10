import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildLmsDashboardViews, createDemoLmsRecords } from '@/lib/lms/read-model'

const repoRoot = path.resolve(__dirname, '..')

function sourceFor(relativePath: string) {
  const absolutePath = path.join(repoRoot, relativePath)
  expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true)

  return readFileSync(absolutePath, 'utf8')
}

describe('LMS guardian links', () => {
  it('normalizes admin guardian-link drafts before touching student records', async () => {
    const modulePath = '@/lib/lms/guardian-links'
    const { normalizeGuardianLinkDraft } = await import(modulePath)

    expect(
      normalizeGuardianLinkDraft({
        studentId: ' student-1 ',
        guardianId: ' guardian-1 ',
        relationship: ' GrandParent ',
      })
    ).toEqual({
      studentId: 'student-1',
      guardianId: 'guardian-1',
      relationship: 'grandparent',
    })
  })

  it('exposes active guardian choices to the admin dashboard read model', () => {
    const views = buildLmsDashboardViews(createDemoLmsRecords())

    expect(views.admin.guardians).toEqual([{ id: 'guardian-1', name: 'Morgan Guardian' }])
  })

  it('wires the admin dashboard and route to an audited guardian-link service', () => {
    const dashboardSource = sourceFor('components/lms/AdminDashboard.tsx')
    const routeSource = sourceFor('app/api/lms/guardian-links/route.ts')
    const linkSource = sourceFor('lib/lms/guardian-links.ts')

    expect(dashboardSource).toContain('action="/api/lms/guardian-links"')
    expect(dashboardSource).toContain('name="guardianId"')
    expect(routeSource).toContain('linkGuardianToStudent')
    expect(routeSource).toContain('enforceLmsMutationRateLimit')
    expect(linkSource).toContain('student_parents')
    expect(linkSource).toContain('guardian.linked')
    expect(linkSource).toContain('tenant_membership')
  })
})
