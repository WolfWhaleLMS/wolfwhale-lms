import { describe, expect, it, vi } from 'vitest'

import {
  checkLmsSmokeRoleReadiness,
  credentialsForSmokeRole,
  formatSmokeReadinessFailure,
} from '@/scripts/check-lms-smoke-readiness'

describe('LMS smoke readiness preflight', () => {
  it('uses role-specific smoke credentials with safe defaults', () => {
    expect(credentialsForSmokeRole('student', {})).toEqual({
      email: 'student@wolfwhale.ca',
      password: 'WolfWhale-Student-2026',
    })

    expect(
      credentialsForSmokeRole('student', {
        LMS_SMOKE_STUDENT_EMAIL: 'learner@example.edu',
        LMS_SMOKE_STUDENT_PASSWORD: 'secret',
      }),
    ).toEqual({
      email: 'learner@example.edu',
      password: 'secret',
    })
  })

  it('reports the failing role and read-model error without exposing credentials', async () => {
    const signOut = vi.fn()
    const client = {
      auth: {
        signInWithPassword: vi.fn(async () => ({
          data: { user: { id: 'student-user-id' } },
          error: null,
        })),
        signOut,
      },
    }

    await expect(
      checkLmsSmokeRoleReadiness('student', {
        createClient: () => client,
        env: {},
        loadRecords: async () => {
          throw new Error('Failed to load student_parents: column student_parents.consent_notes does not exist')
        },
      }),
    ).rejects.toThrow(
      'LMS smoke readiness failed for student: Failed to load student_parents: column student_parents.consent_notes does not exist',
    )

    expect(signOut).toHaveBeenCalled()
    expect(formatSmokeReadinessFailure('student', new Error('secret password leaked'))).not.toContain(
      'WolfWhale-Student-2026',
    )
  })

  it('returns record counts when the authenticated read model loads', async () => {
    const result = await checkLmsSmokeRoleReadiness('teacher', {
      env: {},
      createClient: () => ({
        auth: {
          signInWithPassword: vi.fn(async () => ({
            data: { user: { id: 'teacher-user-id' } },
            error: null,
          })),
          signOut: vi.fn(),
        },
      }),
      loadRecords: async () => ({
        memberships: [{ id: 'membership-1' }, { id: 'membership-2' }],
        courses: [{ id: 'course-1' }],
        assignments: [{ id: 'assignment-1' }, { id: 'assignment-2' }],
      }),
    })

    expect(result).toEqual({
      role: 'teacher',
      userId: 'teacher-user-id',
      memberships: 2,
      courses: 1,
      assignments: 2,
    })
  })
})
