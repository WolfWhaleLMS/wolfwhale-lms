import { describe, expect, it } from 'vitest'
import {
  gradePilotSubmission,
  getPilotGuardianView,
  getPilotStudentView,
  getPilotTeacherView,
  resetPilotStore,
  submitPilotAssignment,
} from '@/lib/pilot/data'

describe('pilot assignment cycle', () => {
  it('lets a student submit work and see their own submission', () => {
    resetPilotStore()

    const result = submitPilotAssignment({
      role: 'student',
      userId: 'student-1',
      content: 'I learned how launch checks keep school data safer.',
    })

    expect(result.ok).toBe(true)
    expect(getPilotStudentView('student-1').submission?.content).toBe(
      'I learned how launch checks keep school data safer.'
    )
    expect(getPilotTeacherView('teacher-1').submissions).toHaveLength(1)
  })

  it('rejects empty submissions and wrong-role submissions', () => {
    resetPilotStore()

    expect(submitPilotAssignment({ role: 'student', userId: 'student-1', content: '   ' })).toEqual({
      ok: false,
      error: 'Submission content is required.',
    })
    expect(submitPilotAssignment({ role: 'teacher', userId: 'teacher-1', content: 'Nope' })).toEqual({
      ok: false,
      error: 'Only students can submit this pilot assignment.',
    })
  })

  it('lets a teacher grade a submitted assignment and makes feedback visible to student and guardian', () => {
    resetPilotStore()
    submitPilotAssignment({ role: 'student', userId: 'student-1', content: 'My launch reflection.' })

    const result = gradePilotSubmission({
      role: 'teacher',
      teacherId: 'teacher-1',
      studentId: 'student-1',
      score: 9,
      feedback: 'Clear reflection with a useful question.',
    })

    expect(result.ok).toBe(true)
    expect(getPilotStudentView('student-1').grade?.feedback).toBe('Clear reflection with a useful question.')
    expect(getPilotGuardianView('guardian-1').students[0].grade?.score).toBe(9)
  })

  it('rejects wrong-role grading, missing submissions, and invalid scores', () => {
    resetPilotStore()

    expect(
      gradePilotSubmission({
        role: 'student',
        teacherId: 'student-1',
        studentId: 'student-1',
        score: 8,
        feedback: 'Nope',
      })
    ).toEqual({ ok: false, error: 'Only teachers can grade this pilot assignment.' })

    expect(
      gradePilotSubmission({
        role: 'teacher',
        teacherId: 'teacher-1',
        studentId: 'student-1',
        score: 11,
        feedback: 'Too high',
      })
    ).toEqual({ ok: false, error: 'Score must be between 0 and 10.' })

    expect(
      gradePilotSubmission({
        role: 'teacher',
        teacherId: 'teacher-1',
        studentId: 'student-1',
        score: 8,
        feedback: 'No submission yet',
      })
    ).toEqual({ ok: false, error: 'Student has not submitted this assignment yet.' })
  })
})
