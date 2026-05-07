import type { SchoolRole } from '@/lib/school-launch/role-surfaces'

export interface PilotSchool {
  id: string
  name: string
  region: string
}

export interface PilotUser {
  id: string
  role: SchoolRole
  name: string
  email: string
  linkedStudentIds?: string[]
}

export interface PilotCourse {
  id: string
  schoolId: string
  teacherId: string
  title: string
  section: string
}

export interface PilotEnrollment {
  courseId: string
  studentId: string
  status: 'active'
}

export interface PilotAssignment {
  id: string
  courseId: string
  title: string
  instructions: string
  dueLabel: string
  pointsPossible: number
}

export interface PilotSubmission {
  assignmentId: string
  studentId: string
  content: string
  submittedAt: string
}

export interface PilotGrade {
  assignmentId: string
  studentId: string
  score: number
  feedback: string
  gradedAt: string
}

export interface PilotStore {
  school: PilotSchool
  users: PilotUser[]
  courses: PilotCourse[]
  enrollments: PilotEnrollment[]
  assignments: PilotAssignment[]
  submissions: PilotSubmission[]
  grades: PilotGrade[]
  launchChecks: string[]
}

export interface SubmitPilotAssignmentInput {
  role: SchoolRole
  userId: string
  content: string
}

export interface GradePilotSubmissionInput {
  role: SchoolRole
  teacherId: string
  studentId: string
  score: number
  feedback: string
}

export type PilotMutationResult = { ok: true } | { ok: false; error: string }

declare global {
  var __WOLFWHALE_PILOT_STORE__: PilotStore | undefined
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function createInitialPilotStore(): PilotStore {
  return {
    school: {
      id: 'school-1',
      name: 'WolfWhale Pilot School',
      region: 'Canada',
    },
    users: [
      { id: 'admin-1', role: 'admin', name: 'Avery Admin', email: 'admin@example.test' },
      { id: 'teacher-1', role: 'teacher', name: 'Tessa Teacher', email: 'teacher@example.test' },
      { id: 'student-1', role: 'student', name: 'Sam Student', email: 'student@example.test' },
      { id: 'student-2', role: 'student', name: 'Riley Student', email: 'student-2@example.test' },
      {
        id: 'guardian-1',
        role: 'guardian',
        name: 'Greer Guardian',
        email: 'guardian@example.test',
        linkedStudentIds: ['student-1'],
      },
    ],
    courses: [
      {
        id: 'course-1',
        schoolId: 'school-1',
        teacherId: 'teacher-1',
        title: 'Grade 8 Launch Humanities',
        section: 'A',
      },
    ],
    enrollments: [
      { courseId: 'course-1', studentId: 'student-1', status: 'active' },
      { courseId: 'course-1', studentId: 'student-2', status: 'active' },
    ],
    assignments: [
      {
        id: 'assignment-1',
        courseId: 'course-1',
        title: 'Launch Reflection',
        instructions: 'Write one paragraph about what helped you learn today and one question you still have.',
        dueLabel: 'Tomorrow at 9:00 AM',
        pointsPossible: 10,
      },
    ],
    submissions: [],
    grades: [],
    launchChecks: [
      'Pilot auth gate configured',
      'Role routes protected',
      'Supabase anon hardening migration present',
      'Security-definer RPC restriction migration present',
    ],
  }
}

export function getPilotStore() {
  globalThis.__WOLFWHALE_PILOT_STORE__ ??= createInitialPilotStore()
  return globalThis.__WOLFWHALE_PILOT_STORE__
}

export function resetPilotStore() {
  globalThis.__WOLFWHALE_PILOT_STORE__ = createInitialPilotStore()
}

function findUser(userId: string, role?: SchoolRole) {
  const user = getPilotStore().users.find((candidate) => candidate.id === userId)

  if (!user || (role && user.role !== role)) {
    throw new Error(`Pilot ${role ?? 'user'} not found: ${userId}`)
  }

  return user
}

function primaryCourse() {
  return getPilotStore().courses[0]
}

function primaryAssignment() {
  return getPilotStore().assignments[0]
}

function enrolledStudents(courseId: string) {
  const store = getPilotStore()
  const studentIds = new Set(
    store.enrollments
      .filter((enrollment) => enrollment.courseId === courseId && enrollment.status === 'active')
      .map((enrollment) => enrollment.studentId)
  )

  return store.users.filter((user) => user.role === 'student' && studentIds.has(user.id))
}

export function getPilotAdminView() {
  const store = getPilotStore()

  return clone({
    school: store.school,
    users: store.users,
    courses: store.courses,
    enrollments: store.enrollments,
    assignments: store.assignments,
    launchChecks: store.launchChecks,
  })
}

export function getPilotTeacherView(teacherId: string) {
  const teacher = findUser(teacherId, 'teacher')
  const course = primaryCourse()

  if (course.teacherId !== teacher.id) {
    throw new Error(`Teacher ${teacherId} is not assigned to pilot course`)
  }

  const assignment = primaryAssignment()
  const store = getPilotStore()

  return clone({
    teacher,
    course,
    roster: enrolledStudents(course.id),
    assignment,
    submissions: store.submissions.filter((submission) => submission.assignmentId === assignment.id),
    grades: store.grades.filter((grade) => grade.assignmentId === assignment.id),
  })
}

export function getPilotStudentView(studentId: string) {
  const student = findUser(studentId, 'student')
  const course = primaryCourse()
  const assignment = primaryAssignment()
  const store = getPilotStore()

  const isEnrolled = store.enrollments.some(
    (enrollment) => enrollment.courseId === course.id && enrollment.studentId === student.id
  )

  if (!isEnrolled) {
    throw new Error(`Student ${studentId} is not enrolled in pilot course`)
  }

  return clone({
    student,
    course,
    assignment,
    submission:
      store.submissions.find(
        (submission) => submission.assignmentId === assignment.id && submission.studentId === student.id
      ) ?? null,
    grade:
      store.grades.find((grade) => grade.assignmentId === assignment.id && grade.studentId === student.id) ?? null,
  })
}

export function getPilotGuardianView(guardianId: string) {
  const guardian = findUser(guardianId, 'guardian')
  const linkedStudentIds = new Set(guardian.linkedStudentIds ?? [])

  return clone({
    guardian,
    students: [...linkedStudentIds].map((studentId) => {
      const studentView = getPilotStudentView(studentId)
      return {
        id: studentView.student.id,
        name: studentView.student.name,
        course: studentView.course,
        assignment: studentView.assignment,
        submission: studentView.submission,
        grade: studentView.grade,
      }
    }),
  })
}

export function submitPilotAssignment(input: SubmitPilotAssignmentInput): PilotMutationResult {
  if (input.role !== 'student') {
    return { ok: false, error: 'Only students can submit this pilot assignment.' }
  }

  const content = input.content.trim()
  if (!content) {
    return { ok: false, error: 'Submission content is required.' }
  }

  try {
    getPilotStudentView(input.userId)
  } catch {
    return { ok: false, error: 'Student is not enrolled in this pilot course.' }
  }

  const store = getPilotStore()
  const assignment = primaryAssignment()
  const existing = store.submissions.find(
    (submission) => submission.assignmentId === assignment.id && submission.studentId === input.userId
  )
  const submission: PilotSubmission = {
    assignmentId: assignment.id,
    studentId: input.userId,
    content,
    submittedAt: new Date().toISOString(),
  }

  if (existing) {
    existing.content = submission.content
    existing.submittedAt = submission.submittedAt
  } else {
    store.submissions.push(submission)
  }

  return { ok: true }
}

export function gradePilotSubmission(input: GradePilotSubmissionInput): PilotMutationResult {
  if (input.role !== 'teacher') {
    return { ok: false, error: 'Only teachers can grade this pilot assignment.' }
  }

  const assignment = primaryAssignment()
  if (!Number.isFinite(input.score) || input.score < 0 || input.score > assignment.pointsPossible) {
    return { ok: false, error: `Score must be between 0 and ${assignment.pointsPossible}.` }
  }

  const feedback = input.feedback.trim()
  if (!feedback) {
    return { ok: false, error: 'Feedback is required.' }
  }

  try {
    getPilotTeacherView(input.teacherId)
  } catch {
    return { ok: false, error: 'Teacher is not assigned to this pilot course.' }
  }

  const store = getPilotStore()
  const submission = store.submissions.find(
    (candidate) => candidate.assignmentId === assignment.id && candidate.studentId === input.studentId
  )

  if (!submission) {
    return { ok: false, error: 'Student has not submitted this assignment yet.' }
  }

  const existing = store.grades.find(
    (grade) => grade.assignmentId === assignment.id && grade.studentId === input.studentId
  )
  const grade: PilotGrade = {
    assignmentId: assignment.id,
    studentId: input.studentId,
    score: input.score,
    feedback,
    gradedAt: new Date().toISOString(),
  }

  if (existing) {
    existing.score = grade.score
    existing.feedback = grade.feedback
    existing.gradedAt = grade.gradedAt
  } else {
    store.grades.push(grade)
  }

  return { ok: true }
}
