import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { createStarterCompanion } from '@/lib/companion/fish-companion'
import { awardServerCompanionXp } from '@/lib/companion/server-xp'

const repoRoot = path.resolve(__dirname, '..')

function createCompanionClient(existingRow: Record<string, unknown> | null) {
  const calls: Array<{ table: string; action: string; payload?: unknown }> = []

  function builder(table: string) {
    const api = {
      select: () => api,
      eq: () => api,
      limit: () => api,
      maybeSingle: async () => ({ data: existingRow, error: null }),
      insert: (payload: unknown) => {
        calls.push({ table, action: 'insert', payload })

        return {
          select: () => ({
            maybeSingle: async () => ({ data: { id: 'profile-1' }, error: null }),
          }),
        }
      },
      update: (payload: unknown) => {
        calls.push({ table, action: 'update', payload })

        return {
          eq: () => ({
            eq: () => ({
              select: () => ({
                maybeSingle: async () => ({ data: { id: 'profile-1' }, error: null }),
              }),
            }),
          }),
        }
      },
    }

    return api
  }

  return {
    calls,
    client: {
      from: (table: string) => builder(table),
    },
  }
}

describe('server-side companion XP grants', () => {
  it('creates a fish companion profile when a real LMS event grants first XP', async () => {
    const { client, calls } = createCompanionClient(null)

    const result = await awardServerCompanionXp(client as never, {
      tenantId: 'tenant-1',
      studentId: 'student-1',
      source: 'assignment_submitted',
      label: 'Assignment submitted',
      occurredAt: '2026-05-10T22:45:00.000Z',
    })

    expect(result).toEqual({ awarded: true, xp: 35, level: 1 })
    expect(calls).toHaveLength(1)
    expect(calls[0]).toMatchObject({ table: 'student_companion_profiles', action: 'insert' })
    expect(calls[0].payload).toMatchObject({
      tenant_id: 'tenant-1',
      student_id: 'student-1',
      species: 'clownfish',
      pet_name: 'Bubbles',
      xp: 35,
      level: 1,
      version: 1,
    })
    expect(calls[0].payload).toHaveProperty('profile')
    expect((calls[0].payload as { profile: { recentXpEvents: Array<{ source: string }> } }).profile.recentXpEvents[0]).toMatchObject({
      source: 'assignment_submitted',
    })
  })

  it('updates an existing fish companion profile with teacher-feedback XP', async () => {
    const existingProfile = createStarterCompanion({
      species: 'pufferfish',
      petName: 'Pebble',
      now: '2026-05-10T22:40:00.000Z',
    })
    const { client, calls } = createCompanionClient({
      id: 'profile-1',
      profile: existingProfile,
      version: 2,
    })

    const result = await awardServerCompanionXp(client as never, {
      tenantId: 'tenant-1',
      studentId: 'student-1',
      source: 'course_task_checked',
      label: 'Teacher feedback received',
      occurredAt: '2026-05-10T22:45:00.000Z',
    })

    expect(result).toEqual({ awarded: true, xp: 10, level: 1 })
    expect(calls).toHaveLength(1)
    expect(calls[0]).toMatchObject({ table: 'student_companion_profiles', action: 'update' })
    expect(calls[0].payload).toMatchObject({
      species: 'pufferfish',
      pet_name: 'Pebble',
      xp: 10,
      version: 3,
    })
  })

  it('wires XP grants to first-time real submission, grade, attendance, and lesson completion events only', () => {
    const source = readFileSync(path.join(repoRoot, 'lib/lms/mutations.ts'), 'utf8')
    const textbookActions = readFileSync(path.join(repoRoot, 'app/actions/textbooks.ts'), 'utf8')

    expect(source).toContain('tryAwardServerCompanionXp')
    expect(source).toContain("source: 'assignment_submitted'")
    expect(source).toContain("source: 'course_task_checked'")
    expect(source).toContain("source: 'study_streak'")
    expect(source).toContain('if (!existingSubmission)')
    expect(source).toContain('if (!existingGrade)')
    expect(source).toContain('if (!existingAttendance')
    expect(source).toContain("draft.status === 'present' || draft.status === 'online'")
    expect(textbookActions).toContain('tryAwardServerCompanionXp')
    expect(textbookActions).toContain("source: 'lesson_completed'")
    expect(textbookActions).toContain("existing.status !== 'completed'")
  })
})
