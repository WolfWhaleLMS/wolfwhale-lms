import { describe, expect, it } from 'vitest'
import { buildLmsDashboardViews, createDemoLmsRecords } from '@/lib/lms/read-model'

describe('persistent LMS read model', () => {
  it('builds an admin operations view across the active school tenant', () => {
    const records = createDemoLmsRecords()
    const views = buildLmsDashboardViews(records)

    expect(views.admin.school.name).toBe('WolfWhale Academy')
    expect(views.admin.metrics).toMatchObject({
      activeStudents: 2,
      activeTeachers: 1,
      activeCourses: 1,
      activeEnrollments: 2,
      openAssignments: 2,
      pendingSubmissions: 1,
      unreadNotifications: 2,
    })
    expect(views.admin.auditTrail.map((entry) => entry.action)).toContain('grade.created')
    expect(views.admin.calendar.map((item) => item.title)).toContain('Launch Reflection')
    expect(views.admin.resources.map((resource) => resource.title)).toContain('Primary Source Pack')
  })

  it('builds a teacher view with roster, assignments, submissions, and grading queue', () => {
    const records = createDemoLmsRecords()
    const views = buildLmsDashboardViews(records)

    expect(views.teacher.courses).toHaveLength(1)
    expect(views.teacher.roster.map((student) => student.name)).toEqual(['Alex Student', 'Riley Student'])
    expect(views.teacher.assignments.map((assignment) => assignment.title)).toEqual([
      'Launch Reflection',
      'Primary Source Exit Ticket',
    ])
    expect(views.teacher.gradingQueue).toMatchObject([
      {
        submissionId: 'submission-2',
        assignmentTitle: 'Primary Source Exit Ticket',
        studentName: 'Riley Student',
        submittedAt: '2026-05-06T20:15:00.000Z',
        maxPoints: 5,
      },
    ])
    expect(views.teacher.messages[0]).toMatchObject({
      subject: 'Humanities check-in',
      senderName: 'Tessa Teacher',
    })
  })

  it('builds a student view limited to the signed-in student', () => {
    const records = createDemoLmsRecords()
    const views = buildLmsDashboardViews(records)

    expect(views.student.student.name).toBe('Alex Student')
    expect(views.student.courses.map((course) => course.title)).toEqual(['Grade 8 Humanities'])
    expect(views.student.assignments.map((assignment) => assignment.title)).toEqual([
      'Launch Reflection',
      'Primary Source Exit Ticket',
    ])
    expect(views.student.assignments[0]).toMatchObject({
      courseId: 'course-1',
      courseTitle: 'Grade 8 Humanities',
      category: 'Reflection',
      instructions: 'Write one paragraph about what helped you learn.',
    })
    expect(views.student.lessons).toEqual([
      {
        id: 'lesson-1',
        courseId: 'course-1',
        courseTitle: 'Grade 8 Humanities',
        title: 'Primary Source Skills',
        status: 'published',
      },
    ])
    expect(views.student.grades).toMatchObject([
      {
        assignmentId: 'assignment-1',
        courseId: 'course-1',
        courseTitle: 'Grade 8 Humanities',
        assignmentTitle: 'Launch Reflection',
        scoreLabel: '9/10',
        feedback: 'Strong reflection with a clear next question.',
      },
    ])
    expect(views.student.calendar).toHaveLength(2)
    expect(views.student.resources).toEqual([
      {
        id: 'resource-1',
        lessonId: 'lesson-1',
        courseId: 'course-1',
        title: 'Primary Source Pack',
        courseTitle: 'Grade 8 Humanities',
        fileName: 'source-pack.pdf',
        fileType: 'application/pdf',
        fileSize: 1048576,
        scanStatus: 'clean',
        scanProvider: 'mock',
        legalHold: false,
        retentionExpiresAt: '2033-05-06T21:00:00.000Z',
        quarantineReason: '',
      },
    ])
    expect(JSON.stringify(views.student)).not.toContain('Riley Student')
  })

  it('builds a guardian view limited to linked students and excludes unrelated classmates', () => {
    const records = createDemoLmsRecords()
    const views = buildLmsDashboardViews(records)

    expect(views.guardian.guardian.name).toBe('Morgan Guardian')
    expect(views.guardian.students.map((student) => student.name)).toEqual(['Alex Student'])
    expect(views.guardian.students[0].grades).toMatchObject([
      {
        assignmentId: 'assignment-1',
        courseId: 'course-1',
        courseTitle: 'Grade 8 Humanities',
        assignmentTitle: 'Launch Reflection',
        scoreLabel: '9/10',
        feedback: 'Strong reflection with a clear next question.',
      },
    ])
    expect(views.guardian.resources.map((resource) => resource.title)).toEqual(['Primary Source Pack'])
    expect(JSON.stringify(views.guardian)).not.toContain('Riley Student')
    expect(JSON.stringify(views.guardian)).not.toContain('riley@example.test')
  })

  it('keeps inactive student memberships out of guardian and teacher operational views', () => {
    const records = createDemoLmsRecords()
    records.memberships = records.memberships.map((membership) =>
      membership.userId === records.actorIds.student ? { ...membership, status: 'inactive' } : membership
    )
    const views = buildLmsDashboardViews(records)

    expect(views.admin.memberships.find((membership) => membership.userId === records.actorIds.student)).toMatchObject({
      name: 'Alex Student',
      role: 'student',
      status: 'inactive',
    })
    expect(views.admin.metrics.activeStudents).toBe(1)
    expect(views.teacher.roster.map((student) => student.name)).toEqual(['Riley Student'])
    expect(views.guardian.students).toEqual([])
    expect(JSON.stringify(views.guardian)).not.toContain('Alex Student')
  })

  it('filters messages by conversation membership for student and guardian views', () => {
    const records = createDemoLmsRecords()

    records.conversations.push({
      id: 'conversation-private',
      tenantId: records.tenant.id,
      subject: 'Riley only',
      courseId: 'course-1',
      createdBy: records.actorIds.teacher,
      updatedAt: '2026-05-06T23:00:00.000Z',
    })
    records.conversationMembers.push(
      { conversationId: 'conversation-private', userId: records.actorIds.teacher },
      { conversationId: 'conversation-private', userId: 'student-2' }
    )
    records.messages.push({
      id: 'message-private',
      tenantId: records.tenant.id,
      conversationId: 'conversation-private',
      senderId: records.actorIds.teacher,
      content: 'Only Riley should see this message.',
      createdAt: '2026-05-06T23:00:00.000Z',
    })

    const views = buildLmsDashboardViews(records)

    expect(JSON.stringify(views.teacher)).toContain('Only Riley should see this message.')
    expect(JSON.stringify(views.admin)).toContain('Only Riley should see this message.')
    expect(JSON.stringify(views.student)).not.toContain('Only Riley should see this message.')
    expect(JSON.stringify(views.guardian)).not.toContain('Only Riley should see this message.')
  })
})
