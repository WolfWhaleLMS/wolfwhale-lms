import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { cleanup, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdminDashboard } from '@/components/lms/AdminDashboard'
import { GuardianDashboard } from '@/components/lms/GuardianDashboard'
import { StudentDashboard } from '@/components/lms/StudentDashboard'
import { TeacherDashboard } from '@/components/lms/TeacherDashboard'
import { LmsMutationError, normalizeMessageModerationDraft } from '@/lib/lms/mutations'
import { buildLmsDashboardViews, createDemoLmsRecords } from '@/lib/lms/read-model'

const repoRoot = path.resolve(__dirname, '..')

function sourceFor(relativePath: string) {
  const absolutePath = path.join(repoRoot, relativePath)
  expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true)

  return readFileSync(absolutePath, 'utf8')
}

function migrationSource(namePart: string) {
  const migrationsDir = path.join(repoRoot, 'supabase/migrations')
  const fileName = readdirSync(migrationsDir).find((candidate) => candidate.includes(namePart))
  expect(fileName, `migration containing ${namePart} should exist`).toBeTruthy()

  return readFileSync(path.join(migrationsDir, fileName!), 'utf8')
}

describe('LMS message moderation controls', () => {
  it('normalizes staff message moderation decisions', () => {
    expect(
      normalizeMessageModerationDraft({
        messageId: ' message-1 ',
        moderationStatus: ' flagged ',
        moderationNote: '  Follow up with course staff.  ',
      })
    ).toEqual({
      messageId: 'message-1',
      moderationStatus: 'flagged',
      moderationNote: 'Follow up with course staff.',
    })
  })

  it('rejects missing messages, invalid statuses, and oversized notes', () => {
    expect(() => normalizeMessageModerationDraft({ messageId: ' ', moderationStatus: 'visible' })).toThrow(LmsMutationError)
    expect(() => normalizeMessageModerationDraft({ messageId: 'message-1', moderationStatus: 'deleted' })).toThrow(LmsMutationError)
    expect(() =>
      normalizeMessageModerationDraft({ messageId: 'message-1', moderationStatus: 'hidden', moderationNote: 'x'.repeat(501) })
    ).toThrow(LmsMutationError)
  })

  it('delegates message moderation to an audited staff-only route', () => {
    const routeSource = sourceFor('app/api/lms/messages/[messageId]/moderation/route.ts')
    const mutationSource = sourceFor('lib/lms/mutations.ts')
    const bodyStart = mutationSource.indexOf('export async function moderateCourseMessage')
    const body = mutationSource.slice(bodyStart)

    expect(bodyStart, 'moderateCourseMessage should be exported').toBeGreaterThanOrEqual(0)
    expect(routeSource).toContain('moderateCourseMessage')
    expect(routeSource).toContain('enforceLmsMutationRateLimit')
    expect(body).toContain('requireStaff')
    expect(body).toContain('message.moderated')
    expect(body).toContain("resourceType: 'message'")
  })

  it('ships a message moderation schema migration', () => {
    const migration = migrationSource('message_moderation_controls')

    expect(migration).toContain('ALTER TABLE public.messages')
    expect(migration).toContain('moderation_status')
    expect(migration).toContain('moderation_note')
    expect(migration).toContain('moderated_by')
    expect(migration).toContain('moderated_at')
    expect(migration).toContain('idx_messages_moderation_review')
  })

  it('shows message moderation forms only on staff dashboards', () => {
    const views = buildLmsDashboardViews(createDemoLmsRecords())

    render(<AdminDashboard view={views.admin} />)
    expect(screen.getByRole('button', { name: /Save message review/ })).toBeInTheDocument()

    cleanup()

    render(<TeacherDashboard view={views.teacher} />)
    expect(screen.getByRole('button', { name: /Save message review/ })).toBeInTheDocument()

    cleanup()

    render(<StudentDashboard view={views.student} />)
    expect(screen.queryByRole('button', { name: /Save message review/ })).not.toBeInTheDocument()

    cleanup()

    render(<GuardianDashboard view={views.guardian} />)
    expect(screen.queryByRole('button', { name: /Save message review/ })).not.toBeInTheDocument()
  })
})
