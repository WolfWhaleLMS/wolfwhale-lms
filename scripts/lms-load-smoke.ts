import { performance } from 'node:perf_hooks'
import { buildLmsDashboardViews } from '@/lib/lms/read-model'
import type { LmsRecords } from '@/lib/lms/types'
import { validateScaleBudget } from '@/lib/lms/roster'

function integerEnv(name: string, fallback: number) {
  const raw = process.env[name]
  if (!raw) return fallback

  const parsed = Number(raw)
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`${name} must be a non-negative integer.`)
  }

  return parsed
}

function isoDate(day: number) {
  return `2026-05-${String((day % 28) + 1).padStart(2, '0')}`
}

function createSyntheticRecords(input: {
  activeStudents: number
  activeTeachers: number
  activeCourses: number
  activeEnrollments: number
}): LmsRecords {
  const tenantId = 'load-tenant'
  const adminId = 'load-admin'
  const guardianId = 'load-guardian'
  const users = [
    { id: adminId, email: 'admin@example.test', firstName: 'Avery', lastName: 'Admin' },
    { id: guardianId, email: 'guardian@example.test', firstName: 'Morgan', lastName: 'Guardian' },
  ]

  for (let index = 0; index < input.activeTeachers; index += 1) {
    users.push({
      id: `teacher-${index}`,
      email: `teacher-${index}@example.test`,
      firstName: 'Teacher',
      lastName: String(index + 1),
    })
  }

  for (let index = 0; index < input.activeStudents; index += 1) {
    users.push({
      id: `student-${index}`,
      email: `student-${index}@example.test`,
      firstName: 'Student',
      lastName: String(index + 1),
    })
  }

  const courses = Array.from({ length: input.activeCourses }, (_, index) => ({
    id: `course-${index}`,
    tenantId,
    title: `Course ${index + 1}`,
    subject: 'Core',
    gradeLevel: String((index % 12) + 1),
    createdBy: `teacher-${index % Math.max(input.activeTeachers, 1)}`,
    status: 'active',
    gradingPolicy: {
      categories: [
        { name: 'Coursework', weight: 70 },
        { name: 'Assessment', weight: 30 },
      ],
    },
  }))

  const enrollments = Array.from({ length: input.activeEnrollments }, (_, index) => {
    const courseIndex = index % Math.max(input.activeCourses, 1)
    const studentIndex = index % Math.max(input.activeStudents, 1)
    const teacherIndex = courseIndex % Math.max(input.activeTeachers, 1)

    return {
      tenantId,
      courseId: `course-${courseIndex}`,
      studentId: `student-${studentIndex}`,
      teacherId: `teacher-${teacherIndex}`,
      status: 'active',
    }
  })

  const assignments = courses.flatMap((course, index) => [
    {
      id: `assignment-${index}-coursework`,
      tenantId,
      courseId: course.id,
      title: `${course.title} Coursework`,
      instructions: 'Complete the weekly response.',
      dueAt: '2026-05-20T16:00:00.000Z',
      maxPoints: 10,
      status: 'assigned',
      category: 'Coursework',
    },
    {
      id: `assignment-${index}-assessment`,
      tenantId,
      courseId: course.id,
      title: `${course.title} Assessment`,
      instructions: 'Complete the assessment.',
      dueAt: '2026-05-27T16:00:00.000Z',
      maxPoints: 20,
      status: 'assigned',
      category: 'Assessment',
    },
  ])

  const grades = enrollments.slice(0, Math.min(enrollments.length, input.activeCourses * 8)).map((enrollment, index) => ({
    id: `grade-${index}`,
    tenantId,
    assignmentId: `assignment-${Number(enrollment.courseId.replace('course-', ''))}-coursework`,
    studentId: enrollment.studentId,
    courseId: enrollment.courseId,
    pointsEarned: 8,
    percentage: 80,
    letterGrade: 'B-',
    feedback: 'Synthetic load-smoke feedback.',
    gradedAt: '2026-05-07T18:00:00.000Z',
    rubricScores: [],
  }))

  const attendance = enrollments.slice(0, Math.min(enrollments.length, input.activeCourses * 12)).map((enrollment, index) => ({
    id: `attendance-${index}`,
    tenantId,
    courseId: enrollment.courseId,
    studentId: enrollment.studentId,
    attendanceDate: isoDate(index),
    status: index % 9 === 0 ? 'absent' : index % 7 === 0 ? 'tardy' : 'present',
    notes: '',
    markedBy: enrollment.teacherId,
  })) as LmsRecords['attendance']

  return {
    actorIds: {
      admin: adminId,
      teacher: 'teacher-0',
      student: 'student-0',
      guardian: guardianId,
    },
    tenant: {
      id: tenantId,
      name: 'Load Smoke School',
      slug: 'load-smoke-school',
      status: 'active',
    },
    users,
    memberships: [
      { tenantId, userId: adminId, role: 'admin', status: 'active' },
      { tenantId, userId: guardianId, role: 'parent', status: 'active' },
      ...Array.from({ length: input.activeTeachers }, (_, index) => ({
        tenantId,
        userId: `teacher-${index}`,
        role: 'teacher' as const,
        status: 'active',
      })),
      ...Array.from({ length: input.activeStudents }, (_, index) => ({
        tenantId,
        userId: `student-${index}`,
        role: 'student' as const,
        status: 'active',
      })),
    ],
    parentLinks: [{ tenantId, studentId: 'student-0', parentId: guardianId, status: 'active' }],
    courses,
    enrollments,
    assignments,
    submissions: [],
    grades,
    notifications: [],
    auditTrail: [],
    lessons: [],
    resources: [],
    conversations: [],
    conversationMembers: [],
    messages: [],
    rubrics: [],
    attendance,
  }
}

const budget = {
  activeStudents: integerEnv('LMS_LOAD_ACTIVE_STUDENTS', 5000),
  activeTeachers: integerEnv('LMS_LOAD_ACTIVE_TEACHERS', 500),
  activeCourses: integerEnv('LMS_LOAD_ACTIVE_COURSES', 1000),
  activeEnrollments: integerEnv('LMS_LOAD_ACTIVE_ENROLLMENTS', 50000),
}
const maxMs = integerEnv('LMS_LOAD_MAX_MS', 5000)
const budgetCheck = validateScaleBudget(budget)

if (!budgetCheck.ok) {
  throw new Error(`Load smoke budget exceeds verified envelope: ${budgetCheck.warnings.join(' ')}`)
}

const records = createSyntheticRecords(budget)
const started = performance.now()
const views = buildLmsDashboardViews(records)
const elapsedMs = Math.round(performance.now() - started)

if (views.admin.metrics.activeStudents !== budget.activeStudents) {
  throw new Error(`Expected ${budget.activeStudents} students, got ${views.admin.metrics.activeStudents}.`)
}
if (views.admin.metrics.activeEnrollments !== budget.activeEnrollments) {
  throw new Error(`Expected ${budget.activeEnrollments} enrollments, got ${views.admin.metrics.activeEnrollments}.`)
}
if (views.teacher.gradebook.length === 0 || views.student.gradebook.length === 0 || views.guardian.students.length === 0) {
  throw new Error('Load smoke did not produce role gradebook views.')
}
if (elapsedMs > maxMs) {
  throw new Error(`LMS read-model load smoke exceeded ${maxMs}ms: ${elapsedMs}ms.`)
}

console.log(
  `LMS load smoke passed in ${elapsedMs}ms for ${budget.activeStudents} students, ${budget.activeTeachers} teachers, ${budget.activeCourses} courses, and ${budget.activeEnrollments} enrollments.`
)
