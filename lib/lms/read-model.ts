import type {
  LmsAssignmentRecord,
  LmsAssignmentSummary,
  LmsAttendanceSummary,
  LmsCalendarItem,
  LmsCourseRecord,
  LmsCourseSummary,
  LmsGradeRecord,
  LmsGradebookCourseSummary,
  LmsGradeSummary,
  LmsGradingQueueItem,
  LmsLessonSummary,
  LmsMessageSummary,
  LmsPerson,
  LmsRecords,
  LmsResourceSummary,
  LmsRiskLevel,
  LmsRiskSummary,
  LmsRubricSummary,
  LmsStudentGradebookSummary,
  LmsSubmissionRecord,
  LmsUserRecord,
} from '@/lib/lms/types'
import { letterGradeForPercentage } from '@/lib/lms/mutations'

function person(user: LmsUserRecord): LmsPerson {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim(),
  }
}

function courseSummary(course: LmsCourseRecord): LmsCourseSummary {
  return {
    id: course.id,
    title: course.title,
    subject: course.subject,
    gradeLevel: course.gradeLevel,
    sectionLabel: course.sectionLabel,
    termLabel: course.termLabel,
  }
}

function assignmentSummary(records: LmsRecords, assignment: LmsAssignmentRecord): LmsAssignmentSummary {
  const course = findCourse(records, assignment.courseId)

  return {
    id: assignment.id,
    courseId: assignment.courseId,
    courseTitle: course.title,
    title: assignment.title,
    category: assignment.category,
    instructions: assignment.instructions,
    dueAt: assignment.dueAt,
    maxPoints: assignment.maxPoints,
    status: assignment.status,
  }
}

function findUser(records: LmsRecords, userId: string) {
  const user = records.users.find((candidate) => candidate.id === userId)
  if (!user) {
    throw new Error(`Missing LMS user ${userId}`)
  }

  return user
}

function findAssignment(records: LmsRecords, assignmentId: string) {
  const assignment = records.assignments.find((candidate) => candidate.id === assignmentId)
  if (!assignment) {
    throw new Error(`Missing LMS assignment ${assignmentId}`)
  }

  return assignment
}

function findCourse(records: LmsRecords, courseId: string) {
  const course = records.courses.find((candidate) => candidate.id === courseId)
  if (!course) {
    throw new Error(`Missing LMS course ${courseId}`)
  }

  return course
}

function gradeSummary(records: LmsRecords, grade: LmsGradeRecord): LmsGradeSummary {
  const assignment = findAssignment(records, grade.assignmentId)
  const course = findCourse(records, assignment.courseId)

  return {
    assignmentId: assignment.id,
    courseId: assignment.courseId,
    courseTitle: course.title,
    assignmentTitle: assignment.title,
    scoreLabel: `${grade.pointsEarned}/${assignment.maxPoints}`,
    feedback: grade.feedback,
  }
}

function activeStudents(records: LmsRecords) {
  const studentIds = new Set(
    records.memberships
      .filter((membership) => membership.role === 'student' && membership.status === 'active')
      .map((membership) => membership.userId)
  )

  return records.users.filter((user) => studentIds.has(user.id))
}

function activeTeachers(records: LmsRecords) {
  const teacherIds = new Set(
    records.memberships
      .filter((membership) => membership.role === 'teacher' && membership.status === 'active')
      .map((membership) => membership.userId)
  )

  return records.users.filter((user) => teacherIds.has(user.id))
}

function activeGuardians(records: LmsRecords) {
  const guardianIds = new Set(
    records.memberships
      .filter((membership) => membership.role === 'parent' && membership.status === 'active')
      .map((membership) => membership.userId)
  )

  return records.users.filter((user) => guardianIds.has(user.id))
}

function studentCourseIds(records: LmsRecords, studentId: string) {
  return new Set(
    records.enrollments
      .filter((enrollment) => enrollment.studentId === studentId && enrollment.status === 'active')
      .map((enrollment) => enrollment.courseId)
  )
}

function teacherCourseIds(records: LmsRecords, teacherId: string) {
  return new Set(
    records.enrollments
      .filter((enrollment) => enrollment.teacherId === teacherId && enrollment.status === 'active')
      .map((enrollment) => enrollment.courseId)
  )
}

function gradesForStudent(records: LmsRecords, studentId: string) {
  return records.grades.filter((grade) => grade.studentId === studentId).map((grade) => gradeSummary(records, grade))
}

function pendingTeacherSubmissions(records: LmsRecords, teacherId: string): LmsGradingQueueItem[] {
  const courseIds = teacherCourseIds(records, teacherId)
  const gradedSubmissionIds = new Set(records.grades.map((grade) => `${grade.assignmentId}:${grade.studentId}`))

  return records.submissions
    .filter((submission) => {
      const assignment = findAssignment(records, submission.assignmentId)
      return courseIds.has(assignment.courseId) && !gradedSubmissionIds.has(`${submission.assignmentId}:${submission.studentId}`)
    })
    .map((submission) => {
      const assignment = findAssignment(records, submission.assignmentId)
      const student = findUser(records, submission.studentId)

      return {
        submissionId: submission.id,
        assignmentTitle: assignment.title,
        studentName: person(student).name,
        submittedAt: submission.submittedAt,
        maxPoints: assignment.maxPoints,
        fileName: submission.fileName,
      }
    })
}

function calendarItemsForCourseIds(records: LmsRecords, courseIds: Set<string>): LmsCalendarItem[] {
  const assignmentItems = records.assignments
    .filter((assignment) => courseIds.has(assignment.courseId))
    .map((assignment) => ({
      id: assignment.id,
      courseId: assignment.courseId,
      title: assignment.title,
      courseTitle: findCourse(records, assignment.courseId).title,
      dueAt: assignment.dueAt,
      status: assignment.status,
    }))

  const eventItems = records.calendarEvents
    .filter((event) => event.status !== 'cancelled' && (!event.courseId || courseIds.has(event.courseId)))
    .map((event) => ({
      id: event.id,
      courseId: event.courseId,
      title: event.title,
      courseTitle: event.courseId ? findCourse(records, event.courseId).title : records.tenant.name,
      dueAt: event.startsAt,
      status: event.status,
    }))

  return [...assignmentItems, ...eventItems]
    .sort((left, right) => left.dueAt.localeCompare(right.dueAt))
}

function resourcesForCourseIds(records: LmsRecords, courseIds: Set<string>): LmsResourceSummary[] {
  const lessonById = new Map(records.lessons.filter((lesson) => courseIds.has(lesson.courseId)).map((lesson) => [lesson.id, lesson]))

  return records.resources
    .filter((resource) => lessonById.has(resource.lessonId))
    .map((resource) => {
      const lesson = lessonById.get(resource.lessonId)
      const course = lesson ? findCourse(records, lesson.courseId) : null

      return {
        id: resource.id,
        lessonId: resource.lessonId,
        courseId: lesson?.courseId ?? '',
        title: resource.displayName,
        courseTitle: course?.title ?? 'Course',
        fileName: resource.fileName,
        fileType: resource.fileType,
        scanStatus: resource.scanStatus,
        scanProvider: resource.scanProvider,
        legalHold: resource.legalHold,
        retentionExpiresAt: resource.retentionExpiresAt,
        quarantineReason: resource.quarantineReason,
      }
    })
}

function lessonSummariesForCourseIds(records: LmsRecords, courseIds: Set<string>): LmsLessonSummary[] {
  return records.lessons
    .filter((lesson) => courseIds.has(lesson.courseId))
    .map((lesson) => ({
      id: lesson.id,
      courseId: lesson.courseId,
      courseTitle: findCourse(records, lesson.courseId).title,
      title: lesson.title,
      status: lesson.status,
    }))
}

function conversationIdsForUser(records: LmsRecords, userId: string) {
  return new Set(
    records.conversationMembers
      .filter((member) => member.userId === userId)
      .map((member) => member.conversationId)
  )
}

function messageSummaries(records: LmsRecords, visibleConversationIds?: Set<string>): LmsMessageSummary[] {
  const conversationsById = new Map(records.conversations.map((conversation) => [conversation.id, conversation]))

  return records.messages
    .filter((message) => !visibleConversationIds || visibleConversationIds.has(message.conversationId))
    .map((message) => {
      const sender = records.users.find((user) => user.id === message.senderId)
      const conversation = conversationsById.get(message.conversationId)

      return {
        id: message.id,
        courseId: conversation?.courseId ?? '',
        subject: conversation?.subject ?? 'Conversation',
        senderName: sender ? person(sender).name : 'School member',
        content: message.content,
        createdAt: message.createdAt,
      }
    })
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

function attendanceSummary(records: LmsRecords, courseId: string, studentIds?: Set<string>): LmsAttendanceSummary {
  const course = findCourse(records, courseId)
  const entries = records.attendance.filter(
    (entry) => entry.courseId === courseId && (!studentIds || studentIds.has(entry.studentId))
  )
  const present = entries.filter((entry) => entry.status === 'present').length
  const online = entries.filter((entry) => entry.status === 'online').length
  const absent = entries.filter((entry) => entry.status === 'absent').length
  const tardy = entries.filter((entry) => entry.status === 'tardy').length
  const excused = entries.filter((entry) => entry.status === 'excused').length
  const counted = present + online + absent + tardy

  return {
    courseId,
    courseTitle: course.title,
    present,
    absent,
    tardy,
    excused,
    online,
    attendanceRate: counted === 0 ? 100 : Math.round(((present + online) / counted) * 100),
  }
}

function attendanceRateForStudentCourse(records: LmsRecords, studentId: string, courseId: string) {
  return attendanceSummary(records, courseId, new Set([studentId])).attendanceRate
}

function riskLevel(input: { currentPercentage: number; missingAssignments: number; attendanceRate: number }): LmsRiskLevel {
  if (input.attendanceRate < 60 || input.missingAssignments >= 2 || input.currentPercentage < 60) return 'high'
  if (input.attendanceRate < 80 || input.missingAssignments > 0 || input.currentPercentage < 70) return 'watch'

  return 'good'
}

function percentageForGrade(records: LmsRecords, grade: LmsGradeRecord) {
  const assignment = records.assignments.find((candidate) => candidate.id === grade.assignmentId)
  if (grade.percentage > 0) return grade.percentage
  if (!assignment || assignment.maxPoints <= 0) return 0

  return Math.round((grade.pointsEarned / assignment.maxPoints) * 10000) / 100
}

function assignmentIsPastDue(assignment: LmsAssignmentRecord, now = Date.now()) {
  const dueAt = Date.parse(assignment.dueAt)

  return Number.isFinite(dueAt) && dueAt < now
}

function weightedPercentage(records: LmsRecords, course: LmsCourseRecord, studentId: string) {
  const assignments = records.assignments.filter((assignment) => assignment.courseId === course.id && assignment.status !== 'archived')
  const grades = records.grades.filter((grade) => grade.courseId === course.id && grade.studentId === studentId)
  const gradeByAssignmentId = new Map(grades.map((grade) => [grade.assignmentId, grade]))
  const fallbackPercentages = grades.map((grade) => percentageForGrade(records, grade)).filter((value) => value > 0)
  let weightedTotal = 0
  let usedWeight = 0

  for (const category of course.gradingPolicy.categories) {
    const categoryAssignments = assignments.filter((assignment) => assignment.category === category.name)
    const categoryGrades = categoryAssignments
      .map((assignment) => {
        const grade = gradeByAssignmentId.get(assignment.id)
        if (!grade) return null

        return percentageForGrade(records, grade)
      })
      .filter((value): value is number => typeof value === 'number')

    if (categoryGrades.length > 0) {
      weightedTotal += (categoryGrades.reduce((total, value) => total + value, 0) / categoryGrades.length) * category.weight
      usedWeight += category.weight
    }
  }

  if (usedWeight === 0 && fallbackPercentages.length > 0) {
    return Math.round((fallbackPercentages.reduce((total, value) => total + value, 0) / fallbackPercentages.length) * 100) / 100
  }

  return usedWeight === 0 ? 0 : Math.round((weightedTotal / usedWeight) * 100) / 100
}

function gradebookForCourse(records: LmsRecords, course: LmsCourseRecord, studentIds: Set<string>): LmsGradebookCourseSummary {
  const assignments = records.assignments.filter((assignment) => assignment.courseId === course.id && assignment.status !== 'archived')
  const pastDueAssignments = assignments.filter((assignment) => assignmentIsPastDue(assignment))

  return {
    courseId: course.id,
    courseTitle: course.title,
    categoryWeights: course.gradingPolicy.categories,
    students: records.users
      .filter((user) => studentIds.has(user.id))
      .map((student) => {
        const currentPercentage = weightedPercentage(records, course, student.id)
        const gradedAssignments = records.grades.filter((grade) => grade.courseId === course.id && grade.studentId === student.id).length
        const gradedAssignmentIds = new Set(
          records.grades
            .filter((grade) => grade.courseId === course.id && grade.studentId === student.id)
            .map((grade) => grade.assignmentId)
        )
        const missingAssignments = pastDueAssignments.filter((assignment) => !gradedAssignmentIds.has(assignment.id)).length
        const attendanceRate = attendanceRateForStudentCourse(records, student.id, course.id)

        return {
          studentId: student.id,
          studentName: person(student).name,
          currentPercentage,
          letterGrade: currentPercentage === 0 ? 'F' : letterGradeForPercentage(currentPercentage),
          gradedAssignments,
          missingAssignments,
          attendanceRate,
          riskLevel: riskLevel({ currentPercentage, missingAssignments, attendanceRate }),
        }
      })
  }
}

function studentGradebook(records: LmsRecords, studentId: string, courseIds: Set<string>): LmsStudentGradebookSummary[] {
  return records.courses
    .filter((course) => courseIds.has(course.id))
    .map((course) => {
      const summary = gradebookForCourse(records, course, new Set([studentId])).students[0]

      return {
        courseId: course.id,
        courseTitle: course.title,
        currentPercentage: summary?.currentPercentage ?? 0,
        letterGrade: summary?.letterGrade ?? 'F',
        gradedAssignments: summary?.gradedAssignments ?? 0,
        missingAssignments: summary?.missingAssignments ?? 0,
        attendanceRate: summary?.attendanceRate ?? 100,
        riskLevel: summary?.riskLevel ?? 'good',
      }
    })
}

function rubricsForCourseIds(records: LmsRecords, courseIds: Set<string>): LmsRubricSummary[] {
  return records.rubrics
    .map((rubric) => {
      const assignment = records.assignments.find((candidate) => candidate.id === rubric.assignmentId)
      if (!assignment || !courseIds.has(assignment.courseId)) return null

      return {
        id: rubric.id,
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        name: rubric.name,
        criteriaCount: rubric.criteria.length,
      }
    })
    .filter((rubric): rubric is LmsRubricSummary => Boolean(rubric))
}

function riskSummary(gradebooks: LmsGradebookCourseSummary[]): LmsRiskSummary {
  return gradebooks.flatMap((gradebook) => gradebook.students).reduce(
    (summary, student) => ({
      ...summary,
      [student.riskLevel]: summary[student.riskLevel] + 1,
    }),
    { good: 0, watch: 0, high: 0 }
  )
}

export function buildLmsDashboardViews(records: LmsRecords) {
  const teacherCourseIdSet = teacherCourseIds(records, records.actorIds.teacher)
  const teacherCourses = records.courses.filter((course) => teacherCourseIdSet.has(course.id))
  const teacherRosterIds = new Set(
    records.enrollments
      .filter((enrollment) => teacherCourseIdSet.has(enrollment.courseId) && enrollment.status === 'active')
      .map((enrollment) => enrollment.studentId)
  )
  const teacherAssignments = records.assignments.filter((assignment) => teacherCourseIdSet.has(assignment.courseId))

  const studentCourseIdSet = studentCourseIds(records, records.actorIds.student)
  const studentCourses = records.courses.filter((course) => studentCourseIdSet.has(course.id))
  const studentAssignments = records.assignments.filter((assignment) => studentCourseIdSet.has(assignment.courseId))

  const linkedStudentIds = records.parentLinks
    .filter((link) => link.parentId === records.actorIds.guardian && link.status === 'active')
    .map((link) => link.studentId)
  const guardianCourseIdSet = new Set(linkedStudentIds.flatMap((studentId) => [...studentCourseIds(records, studentId)]))
  const allCourseIds = new Set(records.courses.map((course) => course.id))
  const adminMessages = messageSummaries(records)
  const teacherMessages = messageSummaries(records, conversationIdsForUser(records, records.actorIds.teacher))
  const studentMessages = messageSummaries(records, conversationIdsForUser(records, records.actorIds.student))
  const guardianMessages = messageSummaries(records, conversationIdsForUser(records, records.actorIds.guardian))
  const teacherGradebook = teacherCourses.map((course) => gradebookForCourse(records, course, teacherRosterIds))
  const allGradebooks = records.courses.map((course) => {
    const studentIds = new Set(
      records.enrollments
        .filter((enrollment) => enrollment.courseId === course.id && enrollment.status === 'active')
        .map((enrollment) => enrollment.studentId)
    )

    return gradebookForCourse(records, course, studentIds)
  })

  return {
    admin: {
      school: records.tenant,
      metrics: {
        activeStudents: activeStudents(records).length,
        activeTeachers: activeTeachers(records).length,
        activeCourses: records.courses.filter((course) => course.status === 'active').length,
        activeEnrollments: records.enrollments.filter((enrollment) => enrollment.status === 'active').length,
        openAssignments: records.assignments.filter((assignment) => assignment.status === 'assigned').length,
        pendingSubmissions: records.submissions.filter(
          (submission) => !records.grades.some((grade) => grade.assignmentId === submission.assignmentId && grade.studentId === submission.studentId)
        ).length,
        unreadNotifications: records.notifications.filter((notification) => !notification.read).length,
      },
      auditTrail: records.auditTrail,
      courses: records.courses.map(courseSummary),
      students: activeStudents(records).map(person),
      teachers: activeTeachers(records).map(person),
      guardians: activeGuardians(records).map(person),
      calendar: calendarItemsForCourseIds(records, allCourseIds),
      resources: resourcesForCourseIds(records, allCourseIds),
      messages: adminMessages,
      gradebook: allGradebooks,
      attendance: records.courses.map((course) => attendanceSummary(records, course.id)),
      riskSummary: riskSummary(allGradebooks),
    },
    teacher: {
      teacher: person(findUser(records, records.actorIds.teacher)),
      courses: teacherCourses.map(courseSummary),
      roster: records.users.filter((user) => teacherRosterIds.has(user.id)).map(person),
      assignments: teacherAssignments.map((assignment) => assignmentSummary(records, assignment)),
      gradingQueue: pendingTeacherSubmissions(records, records.actorIds.teacher),
      calendar: calendarItemsForCourseIds(records, teacherCourseIdSet),
      resources: resourcesForCourseIds(records, teacherCourseIdSet),
      messages: teacherMessages,
      gradebook: teacherGradebook,
      rubrics: rubricsForCourseIds(records, teacherCourseIdSet),
      attendance: teacherCourses.map((course) => attendanceSummary(records, course.id, teacherRosterIds)),
    },
    student: {
      student: person(findUser(records, records.actorIds.student)),
      courses: studentCourses.map(courseSummary),
      assignments: studentAssignments.map((assignment) => assignmentSummary(records, assignment)),
      submissions: records.submissions.filter((submission) => submission.studentId === records.actorIds.student),
      grades: gradesForStudent(records, records.actorIds.student),
      notifications: records.notifications.filter((notification) => notification.userId === records.actorIds.student),
      calendar: calendarItemsForCourseIds(records, studentCourseIdSet),
      lessons: lessonSummariesForCourseIds(records, studentCourseIdSet),
      resources: resourcesForCourseIds(records, studentCourseIdSet),
      messages: studentMessages,
      gradebook: studentGradebook(records, records.actorIds.student, studentCourseIdSet),
      attendance: [...studentCourseIdSet].map((courseId) => attendanceSummary(records, courseId, new Set([records.actorIds.student]))),
    },
    guardian: {
      guardian: person(findUser(records, records.actorIds.guardian)),
      students: linkedStudentIds.map((studentId) => {
        const courseIds = studentCourseIds(records, studentId)

        return {
          ...person(findUser(records, studentId)),
          courses: records.courses.filter((course) => courseIds.has(course.id)).map(courseSummary),
          assignments: records.assignments.filter((assignment) => courseIds.has(assignment.courseId)).map((assignment) => assignmentSummary(records, assignment)),
          grades: gradesForStudent(records, studentId),
          gradebook: studentGradebook(records, studentId, courseIds),
        }
      }),
      calendar: calendarItemsForCourseIds(records, guardianCourseIdSet),
      resources: resourcesForCourseIds(records, guardianCourseIdSet),
      messages: guardianMessages,
      attendance: [...guardianCourseIdSet].map((courseId) => attendanceSummary(records, courseId, new Set(linkedStudentIds))),
    },
  }
}

export function createDemoLmsRecords(): LmsRecords {
  const tenantId = 'tenant-1'
  const adminId = 'admin-1'
  const teacherId = 'teacher-1'
  const studentId = 'student-1'
  const otherStudentId = 'student-2'
  const guardianId = 'guardian-1'
  const courseId = 'course-1'
  const gradedAssignmentId = 'assignment-1'
  const pendingAssignmentId = 'assignment-2'
  const gradedSubmission: LmsSubmissionRecord = {
    id: 'submission-1',
    tenantId,
    assignmentId: gradedAssignmentId,
    studentId,
      content: 'I learned how launch checks protect school data.',
      filePath: '',
      fileName: '',
      submissionUrl: '',
      status: 'graded',
      submittedAt: '2026-05-06T19:00:00.000Z',
    }
  const pendingSubmission: LmsSubmissionRecord = {
    id: 'submission-2',
    tenantId,
    assignmentId: pendingAssignmentId,
    studentId: otherStudentId,
      content: 'I found a quote and wrote a claim.',
      filePath: 'tenant-1/student-2/course-1/assignment-2/source-notes.pdf',
      fileName: 'source-notes.pdf',
      submissionUrl: '',
      status: 'submitted',
      submittedAt: '2026-05-06T20:15:00.000Z',
    }

  return {
    actorIds: {
      admin: adminId,
      teacher: teacherId,
      student: studentId,
      guardian: guardianId,
    },
    tenant: {
      id: tenantId,
      name: 'WolfWhale Academy',
      slug: 'wolfwhale-academy',
      status: 'active',
    },
    users: [
      { id: adminId, email: 'admin@example.test', firstName: 'Avery', lastName: 'Admin' },
      { id: teacherId, email: 'teacher@example.test', firstName: 'Tessa', lastName: 'Teacher' },
      { id: studentId, email: 'alex@example.test', firstName: 'Alex', lastName: 'Student' },
      { id: otherStudentId, email: 'riley@example.test', firstName: 'Riley', lastName: 'Student' },
      { id: guardianId, email: 'guardian@example.test', firstName: 'Morgan', lastName: 'Guardian' },
    ],
    memberships: [
      { tenantId, userId: adminId, role: 'admin', status: 'active' },
      { tenantId, userId: teacherId, role: 'teacher', status: 'active' },
      { tenantId, userId: studentId, role: 'student', status: 'active' },
      { tenantId, userId: otherStudentId, role: 'student', status: 'active' },
      { tenantId, userId: guardianId, role: 'parent', status: 'active' },
    ],
    parentLinks: [{ tenantId, studentId, parentId: guardianId, status: 'active' }],
    courses: [
      {
        id: courseId,
        tenantId,
        title: 'Grade 8 Humanities',
        subject: 'Humanities',
        gradeLevel: '8',
        sectionLabel: '8A',
        termLabel: 'Spring 2026',
        createdBy: teacherId,
        status: 'active',
        gradingPolicy: {
          categories: [
            { name: 'Reflection', weight: 60 },
            { name: 'Exit Ticket', weight: 40 },
          ],
        },
      },
    ],
    enrollments: [
      { tenantId, courseId, studentId, teacherId, status: 'active' },
      { tenantId, courseId, studentId: otherStudentId, teacherId, status: 'active' },
    ],
    assignments: [
      {
        id: gradedAssignmentId,
        tenantId,
        courseId,
        title: 'Launch Reflection',
        instructions: 'Write one paragraph about what helped you learn.',
        dueAt: '2026-05-07T16:00:00.000Z',
        maxPoints: 10,
        status: 'assigned',
        category: 'Reflection',
      },
      {
        id: pendingAssignmentId,
        tenantId,
        courseId,
        title: 'Primary Source Exit Ticket',
        instructions: 'Cite one source and ask one question.',
        dueAt: '2026-05-08T16:00:00.000Z',
        maxPoints: 5,
        status: 'assigned',
        category: 'Exit Ticket',
      },
    ],
    submissions: [gradedSubmission, pendingSubmission],
    grades: [
      {
        id: 'grade-1',
        tenantId,
        assignmentId: gradedAssignmentId,
        studentId,
        courseId,
        pointsEarned: 9,
        percentage: 90,
        letterGrade: 'A-',
        feedback: 'Strong reflection with a clear next question.',
        gradedAt: '2026-05-06T21:00:00.000Z',
        rubricScores: [
          { name: 'Claim', points: 4 },
          { name: 'Evidence', points: 5 },
        ],
      },
    ],
    notifications: [
      {
        id: 'notification-1',
        tenantId,
        userId: studentId,
        title: 'Grade posted',
        message: 'Launch Reflection has been graded.',
        read: false,
        createdAt: '2026-05-06T21:00:00.000Z',
      },
      {
        id: 'notification-2',
        tenantId,
        userId: guardianId,
        title: 'Feedback posted',
        message: 'Alex has new assignment feedback.',
        read: false,
        createdAt: '2026-05-06T21:01:00.000Z',
      },
    ],
    auditTrail: [
      {
        id: 'audit-1',
        tenantId,
        action: 'grade.created',
        resourceType: 'grade',
        createdAt: '2026-05-06T21:00:00.000Z',
      },
    ],
    lessons: [
      {
        id: 'lesson-1',
        tenantId,
        courseId,
        title: 'Primary Source Skills',
        status: 'published',
      },
    ],
    resources: [
      {
        id: 'resource-1',
        lessonId: 'lesson-1',
        fileName: 'source-pack.pdf',
        fileType: 'application/pdf',
        displayName: 'Primary Source Pack',
        scanStatus: 'clean',
        scanProvider: 'mock',
        legalHold: false,
        retentionExpiresAt: '2033-05-06T21:00:00.000Z',
        quarantineReason: '',
      },
    ],
    conversations: [
      {
        id: 'conversation-1',
        tenantId,
        subject: 'Humanities check-in',
        courseId,
        createdBy: teacherId,
        updatedAt: '2026-05-06T22:00:00.000Z',
      },
    ],
    conversationMembers: [
      { conversationId: 'conversation-1', userId: teacherId },
      { conversationId: 'conversation-1', userId: studentId },
      { conversationId: 'conversation-1', userId: guardianId },
    ],
    messages: [
      {
        id: 'message-1',
        tenantId,
        conversationId: 'conversation-1',
        senderId: teacherId,
        content: 'Please review the source pack before tomorrow.',
        createdAt: '2026-05-06T22:00:00.000Z',
      },
    ],
    rubrics: [
      {
        id: 'rubric-1',
        tenantId,
        assignmentId: gradedAssignmentId,
        name: 'Reflection Rubric',
        description: 'Launch reflection evidence and next-step criteria.',
        criteria: [
          { name: 'Claim', points: 4 },
          { name: 'Evidence', points: 6 },
        ],
        createdBy: teacherId,
      },
    ],
    attendance: [
      {
        id: 'attendance-1',
        tenantId,
        courseId,
        studentId,
        attendanceDate: '2026-05-04',
        status: 'present',
        notes: 'On time.',
        markedBy: teacherId,
      },
      {
        id: 'attendance-2',
        tenantId,
        courseId,
        studentId,
        attendanceDate: '2026-05-05',
        status: 'online',
        notes: 'Remote learning day.',
        markedBy: teacherId,
      },
      {
        id: 'attendance-3',
        tenantId,
        courseId,
        studentId,
        attendanceDate: '2026-05-06',
        status: 'absent',
        notes: '',
        markedBy: teacherId,
      },
      {
        id: 'attendance-4',
        tenantId,
        courseId,
        studentId: otherStudentId,
        attendanceDate: '2026-05-04',
        status: 'present',
        notes: '',
        markedBy: teacherId,
      },
      {
        id: 'attendance-5',
        tenantId,
        courseId,
        studentId: otherStudentId,
        attendanceDate: '2026-05-05',
        status: 'absent',
        notes: '',
        markedBy: teacherId,
      },
      {
        id: 'attendance-6',
        tenantId,
        courseId,
        studentId: otherStudentId,
        attendanceDate: '2026-05-06',
        status: 'tardy',
        notes: 'Arrived after opening activity.',
        markedBy: teacherId,
      },
    ],
    calendarEvents: [],
  }
}
