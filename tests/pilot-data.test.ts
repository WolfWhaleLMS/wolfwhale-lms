import { describe, expect, it } from 'vitest'
import {
  getPilotAdminView,
  getPilotGuardianView,
  getPilotStudentView,
  getPilotTeacherView,
  resetPilotStore,
} from '@/lib/pilot/data'

describe('pilot data boundary', () => {
  it('gives admin the school, users, course, enrollment, and launch-check state', () => {
    const view = getPilotAdminView()

    expect(view.school.name).toBe('WolfWhale Pilot School')
    expect(view.users.map((user) => user.role)).toEqual(['admin', 'teacher', 'student', 'student', 'guardian'])
    expect(view.courses).toHaveLength(1)
    expect(view.enrollments).toHaveLength(2)
    expect(view.launchChecks.length).toBeGreaterThanOrEqual(4)
  })

  it('gives teacher the roster, assignment, and submissions for their course', () => {
    resetPilotStore()
    const view = getPilotTeacherView('teacher-1')

    expect(view.course.teacherId).toBe('teacher-1')
    expect(view.roster.map((student) => student.id)).toEqual(['student-1', 'student-2'])
    expect(view.assignment.title).toBe('Launch Reflection')
    expect(view.submissions).toEqual([])
  })

  it('gives student only their own assignment, submission, and grade state', () => {
    resetPilotStore()
    const view = getPilotStudentView('student-1')

    expect(view.student.id).toBe('student-1')
    expect(view.assignment.title).toBe('Launch Reflection')
    expect(view.submission).toBeNull()
    expect(view.grade).toBeNull()
    expect(JSON.stringify(view)).not.toContain('student-2@example.test')
  })

  it('gives guardian only linked student summaries', () => {
    resetPilotStore()
    const view = getPilotGuardianView('guardian-1')

    expect(view.guardian.id).toBe('guardian-1')
    expect(view.students.map((student) => student.id)).toEqual(['student-1'])
    expect(JSON.stringify(view)).not.toContain('student-2')
    expect(JSON.stringify(view)).not.toContain('student-2@example.test')
  })
})
