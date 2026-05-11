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

  it('normalizes guardian contact and consent details before updates', async () => {
    const modulePath = '@/lib/lms/guardian-links'
    const { normalizeGuardianContactDraft } = await import(modulePath)

    expect(
      normalizeGuardianContactDraft({
        studentId: ' student-1 ',
        guardianId: ' guardian-1 ',
        primaryContact: 'on',
        consentGiven: 'true',
        consentMethod: ' signed_form ',
        consentNotes: ' Paper form signed by Morgan. ',
        custodyNotes: ' Pickup requires office confirmation. ',
      })
    ).toEqual({
      studentId: 'student-1',
      guardianId: 'guardian-1',
      primaryContact: true,
      consentGiven: true,
      consentMethod: 'signed_form',
      consentNotes: 'Paper form signed by Morgan.',
      custodyNotes: 'Pickup requires office confirmation.',
    })
    expect(() => normalizeGuardianContactDraft({ studentId: 'student-1', guardianId: 'student-1' })).toThrow(
      'A guardian cannot be linked to themself as a student.'
    )
    expect(() =>
      normalizeGuardianContactDraft({ studentId: 'student-1', guardianId: 'guardian-1', consentMethod: 'fax' })
    ).toThrow('Consent method must be electronic, signed_form, email, in_person, other, or blank.')
  })

  it('exposes active guardian choices to the admin dashboard read model', () => {
    const views = buildLmsDashboardViews(createDemoLmsRecords())

    expect(views.admin.guardians).toEqual([{ id: 'guardian-1', name: 'Morgan Guardian' }])
  })

  it('exposes active guardian links for admin unlinking without inactive relationships', () => {
    const records = createDemoLmsRecords()
    records.parentLinks.push({
      tenantId: records.tenant.id,
      studentId: records.actorIds.student,
      parentId: 'inactive-parent',
      status: 'inactive',
    })

    const views = buildLmsDashboardViews(records)

    expect(views.admin.guardianLinks).toEqual([
      {
        studentId: 'student-1',
        studentName: 'Alex Student',
        guardianId: 'guardian-1',
        guardianName: 'Morgan Guardian',
        primaryContact: false,
        consentGiven: false,
        consentMethod: '',
        consentNotes: '',
        custodyNotes: '',
      },
    ])
  })

  it('wires the admin dashboard and routes to audited guardian-link services', () => {
    const dashboardSource = sourceFor('components/lms/AdminDashboard.tsx')
    const routeSource = sourceFor('app/api/lms/guardian-links/route.ts')
    const unlinkRouteSource = sourceFor('app/api/lms/guardian-links/unlink/route.ts')
    const contactRouteSource = sourceFor('app/api/lms/guardian-links/contact/route.ts')
    const linkSource = sourceFor('lib/lms/guardian-links.ts')
    const migrationSource = sourceFor('supabase/migrations/20260511001241_guardian_contact_details.sql')

    expect(dashboardSource).toContain('action="/api/lms/guardian-links"')
    expect(dashboardSource).toContain('action="/api/lms/guardian-links/unlink"')
    expect(dashboardSource).toContain('action="/api/lms/guardian-links/contact"')
    expect(dashboardSource).toContain('name="guardianId"')
    expect(dashboardSource).toContain('name="primaryContact"')
    expect(dashboardSource).toContain('name="consentNotes"')
    expect(dashboardSource).toContain('name="custodyNotes"')
    expect(routeSource).toContain('linkGuardianToStudent')
    expect(unlinkRouteSource).toContain('unlinkGuardianFromStudent')
    expect(contactRouteSource).toContain('updateGuardianContactDetails')
    expect(unlinkRouteSource).toContain('enforceLmsMutationRateLimit')
    expect(contactRouteSource).toContain('enforceLmsMutationRateLimit')
    expect(routeSource).toContain('enforceLmsMutationRateLimit')
    expect(linkSource).toContain('student_parents')
    expect(linkSource).toContain('guardian.linked')
    expect(linkSource).toContain('guardian.unlinked')
    expect(linkSource).toContain('guardian.contact_updated')
    expect(linkSource).toContain('tenant_membership')
    expect(migrationSource).toContain('is_primary_contact')
    expect(migrationSource).toContain('consent_notes')
    expect(migrationSource).toContain('custody_notes')
  })
})
