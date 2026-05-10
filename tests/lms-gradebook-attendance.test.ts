import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildLmsDashboardViews, createDemoLmsRecords } from '@/lib/lms/read-model'
import { normalizeAttendanceDraft, normalizeRubricDraft } from '@/lib/lms/mutations'

describe('large-scale LMS gradebook, rubrics, and attendance', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

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

  it('falls back to actual graded percentages when legacy assignment categories do not match the policy', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-09T12:00:00.000Z'))

    const records = createDemoLmsRecords()
    records.assignments[0].category = 'Legacy category'
    records.assignments[0].maxPoints = 100
    records.assignments.push({
      id: 'future-assignment',
      tenantId: records.tenant.id,
      courseId: records.courses[0].id,
      title: 'Future audit assignment',
      instructions: 'Should not count as missing yet.',
      dueAt: '2026-12-15T09:00:00.000Z',
      maxPoints: 10,
      status: 'assigned',
      category: 'Coursework',
    })
    records.grades[0].percentage = 0
    records.grades[0].pointsEarned = 95

    const views = buildLmsDashboardViews(records)

    expect(views.guardian.students[0].gradebook[0]).toMatchObject({
      currentPercentage: 95,
      letterGrade: 'A',
      missingAssignments: 1,
    })
  })

  it('computes grade trends from recent graded work for reports', () => {
    const records = createDemoLmsRecords()
    const courseId = records.courses[0].id
    const studentId = records.actorIds.student

    records.assignments.push({
      id: 'older-reflection',
      tenantId: records.tenant.id,
      courseId,
      title: 'Older Reflection',
      instructions: 'Earlier reflection.',
      dueAt: '2026-05-01T16:00:00.000Z',
      maxPoints: 10,
      status: 'assigned',
      category: 'Reflection',
    })
    records.grades.push({
      id: 'older-grade',
      tenantId: records.tenant.id,
      assignmentId: 'older-reflection',
      studentId,
      courseId,
      pointsEarned: 7,
      percentage: 70,
      letterGrade: 'C-',
      feedback: 'Earlier work.',
      gradedAt: '2026-05-02T21:00:00.000Z',
      rubricScores: [],
    })

    const views = buildLmsDashboardViews(records)

    expect(views.teacher.gradebook[0].students[0]).toMatchObject({ gradeTrend: 'improving' })
    expect(views.student.gradebook[0]).toMatchObject({ gradeTrend: 'improving' })
    expect(views.guardian.students[0].gradebook[0]).toMatchObject({ gradeTrend: 'improving' })
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
