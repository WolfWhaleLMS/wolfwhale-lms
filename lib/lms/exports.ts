import { buildLmsDashboardViews } from '@/lib/lms/read-model'
import type { LmsAttendanceSummary, LmsAuditRecord, LmsGradebookCourseSummary, LmsRecords } from '@/lib/lms/types'

type AdminView = ReturnType<typeof buildLmsDashboardViews>['admin']

function csvValue(value: unknown) {
  const text = String(value ?? '')
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

function csv(headers: string[], rows: unknown[][]) {
  return [headers, ...rows].map((row) => row.map(csvValue).join(',')).join('\n')
}

function stableJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableJsonValue)
  if (!value || typeof value !== 'object') return value

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nestedValue]) => [key, stableJsonValue(nestedValue)])
  )
}

function auditDetails(details: Record<string, unknown>) {
  return JSON.stringify(stableJsonValue(details))
}

export function buildGradebookCsv(gradebook: LmsGradebookCourseSummary[]) {
  return csv(
    [
      'course_id',
      'course_title',
      'student_id',
      'student_name',
      'current_percentage',
      'letter_grade',
      'graded_assignments',
      'missing_assignments',
      'attendance_rate',
      'risk_level',
      'grade_trend',
    ],
    gradebook.flatMap((course) =>
      course.students.map((student) => [
        course.courseId,
        course.courseTitle,
        student.studentId,
        student.studentName,
        student.currentPercentage,
        student.letterGrade,
        student.gradedAssignments,
        student.missingAssignments,
        student.attendanceRate,
        student.riskLevel,
        student.gradeTrend,
      ])
    )
  )
}

export function buildAttendanceCsv(attendance: LmsAttendanceSummary[]) {
  return csv(
    ['course_id', 'course_title', 'present', 'absent', 'tardy', 'excused', 'online', 'attendance_rate'],
    attendance.map((summary) => [
      summary.courseId,
      summary.courseTitle,
      summary.present,
      summary.absent,
      summary.tardy,
      summary.excused,
      summary.online,
      summary.attendanceRate,
    ])
  )
}

export function buildAuditLogCsv(auditTrail: LmsAuditRecord[]) {
  return csv(
    ['audit_id', 'created_at', 'user_id', 'action', 'resource_type', 'resource_id', 'details'],
    [...auditTrail]
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .map((entry) => [
        entry.id,
        entry.createdAt,
        entry.userId,
        entry.action,
        entry.resourceType,
        entry.resourceId,
        auditDetails(entry.details),
      ])
  )
}

export function buildReportCards(records: LmsRecords) {
  const views = buildLmsDashboardViews(records)
  const linkedStudentIds = new Set(records.parentLinks.map((link) => link.studentId))

  return records.users
    .filter((user) => linkedStudentIds.has(user.id) || records.memberships.some((membership) => membership.userId === user.id && membership.role === 'student'))
    .map((student) => ({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`.trim(),
      courses: views.admin.gradebook.flatMap((course) =>
        course.students
          .filter((summary) => summary.studentId === student.id)
          .map((summary) => ({
            courseId: course.courseId,
            courseTitle: course.courseTitle,
            currentPercentage: summary.currentPercentage,
            letterGrade: summary.letterGrade,
            attendanceRate: summary.attendanceRate,
            missingAssignments: summary.missingAssignments,
            riskLevel: summary.riskLevel,
            gradeTrend: summary.gradeTrend,
          }))
      ),
    }))
    .filter((card) => card.courses.length > 0)
}

export function buildSisExportPackage(records: LmsRecords, adminView: AdminView) {
  return {
    'users.csv': csv(
      ['user_id', 'email', 'first_name', 'last_name'],
      records.users.map((user) => [user.id, user.email, user.firstName, user.lastName])
    ),
    'courses.csv': csv(
      ['course_id', 'title', 'subject', 'grade_level', 'section_label', 'term_label', 'status'],
      records.courses.map((course) => [
        course.id,
        course.title,
        course.subject,
        course.gradeLevel,
        course.sectionLabel,
        course.termLabel,
        course.status,
      ])
    ),
    'enrollments.csv': csv(
      ['course_id', 'student_id', 'teacher_id', 'status'],
      records.enrollments.map((enrollment) => [
        enrollment.courseId,
        enrollment.studentId,
        enrollment.teacherId,
        enrollment.status,
      ])
    ),
    'gradebook.csv': buildGradebookCsv(adminView.gradebook),
    'attendance.csv': buildAttendanceCsv(adminView.attendance),
  }
}
