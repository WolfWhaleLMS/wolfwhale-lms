import { describe, expect, it } from 'vitest'
import { buildLmsDashboardViews, createDemoLmsRecords } from '@/lib/lms/read-model'
import { normalizeAttendanceDraft, normalizeRubricDraft } from '@/lib/lms/mutations'

describe('large-scale LMS gradebook, rubrics, and attendance', () => {
  it('builds a weighted teacher gradebook with attendance risk', () => {
    const views = buildLmsDashboardViews(createDemoLmsRecords())

    expect(views.teacher.gradebook[0]).toMatchObject({
      courseTitle: 'Grade 8 Humanities',
      categoryWeights: [
        { name: 'Reflection', weight: 60 },
        { name: 'Exit Ticket', weight: 40 },
      ],
    })
    expect(views.teacher.gradebook[0].students).toEqual([
      expect.objectContaining({
        studentName: 'Alex Student',
        currentPercentage: 90,
        letterGrade: 'A-',
        attendanceRate: 67,
        riskLevel: 'watch',
      }),
      expect.objectContaining({
        studentName: 'Riley Student',
        currentPercentage: 0,
        missingAssignments: 2,
        attendanceRate: 33,
        riskLevel: 'high',
      }),
    ])
  })

  it('adds student and guardian gradebook plus attendance visibility without exposing classmates', () => {
    const views = buildLmsDashboardViews(createDemoLmsRecords())

    expect(views.student.gradebook).toEqual([
      expect.objectContaining({
        courseTitle: 'Grade 8 Humanities',
        currentPercentage: 90,
        letterGrade: 'A-',
        attendanceRate: 67,
      }),
    ])
    expect(views.guardian.students[0].gradebook).toEqual([
      expect.objectContaining({
        courseTitle: 'Grade 8 Humanities',
        currentPercentage: 90,
        attendanceRate: 67,
      }),
    ])
    expect(JSON.stringify(views.guardian.students[0].gradebook)).not.toContain('Riley Student')
  })

  it('shows rubric criteria tied to assignments', () => {
    const views = buildLmsDashboardViews(createDemoLmsRecords())

    expect(views.teacher.rubrics).toEqual([
      expect.objectContaining({
        assignmentTitle: 'Launch Reflection',
        name: 'Reflection Rubric',
        criteriaCount: 2,
      }),
    ])
  })

  it('normalizes attendance and rubric drafts', () => {
    expect(
      normalizeAttendanceDraft({
        courseId: 'course-1',
        studentId: 'student-1',
        attendanceDate: '2026-05-07',
        status: 'present',
        notes: '  On time.  ',
      })
    ).toEqual({
      courseId: 'course-1',
      studentId: 'student-1',
      attendanceDate: '2026-05-07',
      status: 'present',
      notes: 'On time.',
    })

    expect(
      normalizeRubricDraft({
        assignmentId: 'assignment-1',
        name: '  Source Analysis Rubric ',
        criteria: '[{"name":"Claim","points":4},{"name":"Evidence","points":6}]',
      })
    ).toEqual({
      assignmentId: 'assignment-1',
      name: 'Source Analysis Rubric',
      criteria: [
        { name: 'Claim', points: 4 },
        { name: 'Evidence', points: 6 },
      ],
    })
  })
})
