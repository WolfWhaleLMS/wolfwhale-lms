import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { LmsMutationError, normalizeMessageDraft } from '@/lib/lms/mutations'

const repoRoot = path.resolve(__dirname, '..')
const mutationSource = readFileSync(path.join(repoRoot, 'lib/lms/mutations.ts'), 'utf8')

function sourceFor(relativePath: string) {
  const absolutePath = path.join(repoRoot, relativePath)
  expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true)

  return readFileSync(absolutePath, 'utf8')
}

describe('LMS message writes', () => {
  it('normalizes course message drafts before persistence', () => {
    expect(
      normalizeMessageDraft({
        courseId: ' course-1 ',
        recipientId: ' student-1 ',
        subject: '  Humanities check-in  ',
        content: '  Please review the source pack.  ',
      })
    ).toEqual({
      courseId: 'course-1',
      recipientId: 'student-1',
      subject: 'Humanities check-in',
      content: 'Please review the source pack.',
    })
  })

  it('rejects empty or oversized course messages', () => {
    expect(() => normalizeMessageDraft({ courseId: 'course-1', content: '   ' })).toThrow(LmsMutationError)
    expect(() => normalizeMessageDraft({ courseId: 'course-1', subject: 'x'.repeat(256), content: 'Hi.' })).toThrow(
      LmsMutationError
    )
    expect(() => normalizeMessageDraft({ courseId: 'course-1', content: 'x'.repeat(5001) })).toThrow(LmsMutationError)
  })

  it('keeps message writes delegated to an audited server-side service', () => {
    const routeSource = sourceFor('app/api/lms/messages/route.ts')
    const bodyStart = mutationSource.indexOf('export async function sendCourseMessage')
    const body = mutationSource.slice(bodyStart)

    expect(bodyStart, 'sendCourseMessage should be exported').toBeGreaterThanOrEqual(0)
    expect(routeSource).toContain('sendCourseMessage')
    expect(routeSource).toContain('enforceLmsMutationRateLimit')
    expect(body).toContain('insertAuditLog')
    expect(body).toContain('message.sent')
    expect(body).toContain("resourceType: 'message'")
    expect(body).toContain("type: 'message_received'")
    expect(mutationSource).toContain('student_parents')
    expect(mutationSource).toContain('course_enrollments')
  })

  it('ships a relationship-aware conversation member insert policy migration', () => {
    const migration = sourceFor('supabase/migrations/20260510233000_course_message_write_policy.sql')

    expect(migration).toContain('can_create_course_conversation_member')
    expect(migration).toContain('DROP POLICY IF EXISTS cm_insert_allowed')
    expect(migration).toContain('CREATE POLICY cm_insert_allowed')
    expect(migration).toContain('student_parents')
    expect(migration).toContain('course_enrollments')
    expect(migration).toContain('tenant_memberships')
    expect(migration).not.toContain('WITH CHECK (user_id = auth.uid() OR')
  })
})
