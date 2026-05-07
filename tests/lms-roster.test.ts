import { describe, expect, it } from 'vitest'
import { parseRosterCsv, validateScaleBudget } from '@/lib/lms/roster'

describe('large-scale roster operations', () => {
  it('parses roster csv into safe import rows', () => {
    const result = parseRosterCsv(`email,first_name,last_name,role,grade_level\nstudent@example.edu,Alex,Student,student,8\nteacher@example.edu,Tessa,Teacher,teacher,\n`)

    expect(result.rows).toEqual([
      { email: 'student@example.edu', firstName: 'Alex', lastName: 'Student', role: 'student', gradeLevel: '8' },
      { email: 'teacher@example.edu', firstName: 'Tessa', lastName: 'Teacher', role: 'teacher', gradeLevel: '' },
    ])
    expect(result.errors).toEqual([])
  })

  it('reports roster csv validation errors without importing unsafe rows', () => {
    const result = parseRosterCsv(`email,first_name,last_name,role\nnot-an-email,Alex,Student,student\nparent@example.edu,Morgan,Parent,owner\n`)

    expect(result.rows).toEqual([])
    expect(result.errors).toEqual([
      'Row 2: email must be a valid address.',
      'Row 3: role must be student, teacher, parent, admin, or super_admin.',
    ])
  })

  it('enforces large-school scale budgets', () => {
    expect(
      validateScaleBudget({
        activeStudents: 1200,
        activeTeachers: 85,
        activeCourses: 180,
        activeEnrollments: 6400,
      })
    ).toEqual({ ok: true, warnings: [] })

    expect(
      validateScaleBudget({
        activeStudents: 12000,
        activeTeachers: 900,
        activeCourses: 1800,
        activeEnrollments: 90000,
      }).warnings
    ).toContain('Active enrollments exceed the current verified single-school budget of 50000.')
  })
})
