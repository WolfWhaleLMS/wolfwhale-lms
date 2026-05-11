import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const repoRoot = path.resolve(__dirname, '..')

function sourceFor(relativePath: string) {
  const absolutePath = path.join(repoRoot, relativePath)
  expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true)

  return readFileSync(absolutePath, 'utf8')
}

describe('LMS admin invitations', () => {
  it('normalizes direct invitation drafts for safe school membership writes', async () => {
    const modulePath = '@/lib/lms/invitations'
    const { normalizeInviteDraft } = await import(modulePath)

    expect(
      normalizeInviteDraft({
        email: '  TEACHER@example.EDU ',
        firstName: ' Tessa ',
        lastName: ' Teacher ',
        role: 'teacher',
        gradeLevel: ' 8 ',
      })
    ).toEqual({
      email: 'teacher@example.edu',
      firstName: 'Tessa',
      lastName: 'Teacher',
      role: 'teacher',
      gradeLevel: '8',
    })
  })

  it('wires the admin dashboard and route to an audited invitation service', () => {
    const dashboardSource = sourceFor('components/lms/AdminDashboard.tsx')
    const routeSource = sourceFor('app/api/lms/invitations/route.ts')
    const invitationSource = sourceFor('lib/lms/invitations.ts')

    expect(dashboardSource).toContain('action="/api/lms/invitations"')
    expect(dashboardSource).toContain('name="email"')
    expect(dashboardSource).toContain('name="role"')
    expect(routeSource).toContain('inviteUserToSchool')
    expect(routeSource).toContain('enforceLmsMutationRateLimit')
    expect(invitationSource).toContain('inviteUserByEmail')
    expect(invitationSource).toContain('user.invited')
    expect(invitationSource).toContain('tenant_membership')
  })

  it('normalizes and wires audited school membership status changes', async () => {
    const modulePath = '@/lib/lms/invitations'
    const { normalizeMembershipStatusDraft } = await import(modulePath)
    const dashboardSource = sourceFor('components/lms/AdminDashboard.tsx')
    const routeSource = sourceFor('app/api/lms/memberships/status/route.ts')
    const invitationSource = sourceFor('lib/lms/invitations.ts')

    expect(normalizeMembershipStatusDraft({ userId: ' user-1 ', status: ' inactive ' })).toEqual({
      userId: 'user-1',
      status: 'inactive',
    })
    expect(() => normalizeMembershipStatusDraft({ userId: '', status: 'inactive' })).toThrow('user_id is required')
    expect(() => normalizeMembershipStatusDraft({ userId: 'user-1', status: 'suspended' })).toThrow(
      'Status must be active or inactive.'
    )
    expect(dashboardSource).toContain('action="/api/lms/memberships/status"')
    expect(dashboardSource).toContain('name="userId"')
    expect(dashboardSource).toContain('name="status"')
    expect(routeSource).toContain('updateSchoolMembershipStatus')
    expect(routeSource).toContain('enforceLmsMutationRateLimit')
    expect(invitationSource).toContain('updateSchoolMembershipStatus')
    expect(invitationSource).toContain('user.deactivated')
    expect(invitationSource).toContain('user.reactivated')
  })

  it('normalizes and wires audited school membership role changes', async () => {
    const modulePath = '@/lib/lms/invitations'
    const { normalizeMembershipRoleDraft } = await import(modulePath)
    const dashboardSource = sourceFor('components/lms/AdminDashboard.tsx')
    const routeSource = sourceFor('app/api/lms/memberships/role/route.ts')
    const invitationSource = sourceFor('lib/lms/invitations.ts')

    expect(normalizeMembershipRoleDraft({ userId: ' user-1 ', role: ' Teacher ' })).toEqual({
      userId: 'user-1',
      role: 'teacher',
    })
    expect(() => normalizeMembershipRoleDraft({ userId: '', role: 'teacher' })).toThrow('user_id is required')
    expect(() => normalizeMembershipRoleDraft({ userId: 'user-1', role: 'owner' })).toThrow(
      'Role must be student, teacher, parent, or admin.'
    )
    expect(dashboardSource).toContain('action="/api/lms/memberships/role"')
    expect(dashboardSource).toContain('name="role"')
    expect(routeSource).toContain('updateSchoolMembershipRole')
    expect(routeSource).toContain('enforceLmsMutationRateLimit')
    expect(invitationSource).toContain('updateSchoolMembershipRole')
    expect(invitationSource).toContain('user.role_changed')
  })

  it('normalizes and wires audited invite resend requests', async () => {
    const modulePath = '@/lib/lms/invitations'
    const { normalizeInviteResendDraft } = await import(modulePath)
    const dashboardSource = sourceFor('components/lms/AdminDashboard.tsx')
    const routeSource = sourceFor('app/api/lms/invitations/resend/route.ts')
    const invitationSource = sourceFor('lib/lms/invitations.ts')

    expect(normalizeInviteResendDraft({ userId: ' user-1 ' })).toEqual({ userId: 'user-1' })
    expect(() => normalizeInviteResendDraft({ userId: '' })).toThrow('user_id is required')
    expect(dashboardSource).toContain('action="/api/lms/invitations/resend"')
    expect(routeSource).toContain('resendSchoolInvitation')
    expect(routeSource).toContain('enforceLmsMutationRateLimit')
    expect(invitationSource).toContain('resendSchoolInvitation')
    expect(invitationSource).toContain('getUserById')
    expect(invitationSource).toContain('inviteUserByEmail')
    expect(invitationSource).toContain('user.invite_resent')
  })
})
