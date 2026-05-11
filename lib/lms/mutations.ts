import type { SupabaseClient, User } from '@supabase/supabase-js'
import { tryAwardServerCompanionXp } from '@/lib/companion/server-xp'
import {
  courseResourceCourseQuotaBytes,
  courseResourceInitialScanStatus,
  courseResourceRetentionExpiresAt,
  courseResourceScanProvider,
  courseResourceTenantQuotaBytes,
  isMissingResourceSecurityTableError,
  sha256ForUploadFile,
} from '@/lib/lms/resource-security'
import { getCourseResourceBucket, getSubmissionBucket } from '@/lib/lms/resource-storage'

type Row = Record<string, unknown>
type LmsStaffRole = 'teacher' | 'admin' | 'super_admin'
type LmsMessagingRole = 'student' | 'teacher' | 'parent' | 'admin' | 'super_admin'
type LmsAttendanceStatus = 'present' | 'absent' | 'tardy' | 'excused' | 'online'
type LmsMessageModerationStatus = 'visible' | 'flagged' | 'hidden'

const attendanceStatuses: readonly LmsAttendanceStatus[] = ['present', 'absent', 'tardy', 'excused', 'online']
const messagingRoles: readonly LmsMessagingRole[] = ['student', 'teacher', 'parent', 'admin', 'super_admin']
const messageModerationStatuses: readonly LmsMessageModerationStatus[] = ['visible', 'flagged', 'hidden']
const courseResourceLessonTitle = 'Course resources'
const maxSubmissionFileBytes = 25 * 1024 * 1024
const maxCourseResourceBytes = 100 * 1024 * 1024
const allowedSubmissionMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/gif',
  'audio/mpeg',
  'video/mp4',
  'application/zip',
])
const allowedCourseResourceMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/gif',
  'video/mp4',
  'audio/mpeg',
  'application/zip',
])

export class LmsMutationError extends Error {
  constructor(
    message: string,
    public readonly code = 'invalid_lms_mutation'
  ) {
    super(message)
    this.name = 'LmsMutationError'
  }
}

function text(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function id(value: unknown, field: string) {
  const normalized = text(value)
  if (!normalized) {
    throw new LmsMutationError(`${field} is required`, `missing_${field}`)
  }

  return normalized
}

function limitedText(value: unknown, field: string, maxLength: number) {
  const normalized = text(value)
  if (!normalized) {
    throw new LmsMutationError(`${field} is required`, `missing_${field}`)
  }
  if (normalized.length > maxLength) {
    throw new LmsMutationError(`${field} must be ${maxLength} characters or fewer`, `${field}_too_long`)
  }

  return normalized
}

function optionalLimitedText(value: unknown, maxLength: number) {
  const normalized = text(value)
  if (!normalized) return ''
  if (normalized.length > maxLength) {
    throw new LmsMutationError(`Text must be ${maxLength} characters or fewer`, 'text_too_long')
  }

  return normalized
}

function numeric(value: unknown, field: string) {
  const parsed = typeof value === 'number' ? value : Number(String(value ?? '').trim())
  if (!Number.isFinite(parsed)) {
    throw new LmsMutationError(`${field} must be a number`, `invalid_${field}`)
  }

  return parsed
}

function optionalNumeric(value: unknown, fallback = 0) {
  const parsed = typeof value === 'number' ? value : Number(String(value ?? '').trim())

  return Number.isFinite(parsed) ? parsed : fallback
}

function bool(value: unknown) {
  return value === true || value === 'true' || value === 'on' || value === '1'
}

function jsonArray(value: unknown, field: string) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed
    } catch {
      throw new LmsMutationError(`${field} must be valid JSON.`, `invalid_${field}`)
    }
  }

  throw new LmsMutationError(`${field} must be a list.`, `invalid_${field}`)
}

function isRole(value: unknown, roles: readonly string[]) {
  return typeof value === 'string' && roles.includes(value)
}

function isUploadFile(value: unknown): value is File {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'name' in value &&
      'size' in value &&
      typeof (value as File).name === 'string' &&
      typeof (value as File).size === 'number'
  )
}

function optionalUploadFile(value: unknown): File | null {
  if (!isUploadFile(value)) return null
  if (!text(value.name) && value.size === 0) return null

  return value
}

function mimeTypeForFileName(fileName: string) {
  const extension = fileName.toLowerCase().split('.').pop()

  switch (extension) {
    case 'pdf':
      return 'application/pdf'
    case 'doc':
      return 'application/msword'
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    case 'pptx':
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    case 'txt':
      return 'text/plain'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'gif':
      return 'image/gif'
    case 'mp4':
      return 'video/mp4'
    case 'mp3':
      return 'audio/mpeg'
    case 'zip':
      return 'application/zip'
    default:
      return ''
  }
}

function safeStorageFileName(fileName: string) {
  return (
    fileName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^\.+/, '')
      .slice(0, 180) || 'course-resource'
  )
}

function rows(data: unknown) {
  return (data ?? []) as Row[]
}

async function requireUser(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new LmsMutationError('Authentication is required.', 'auth_required')
  }

  return user
}

async function requireMembership(supabase: SupabaseClient, user: User, roles: readonly string[]) {
  const { data, error } = await supabase
    .from('tenant_memberships')
    .select('tenant_id,user_id,role,status')
    .eq('user_id', user.id)
    .eq('status', 'active')

  if (error) {
    throw new LmsMutationError(`Unable to verify school membership: ${error.message}`, 'membership_lookup_failed')
  }

  const membership = rows(data).find((candidate) => isRole(candidate.role, roles))
  if (!membership) {
    throw new LmsMutationError('This account is not authorized for that LMS action.', 'role_required')
  }

  return {
    tenantId: id(membership.tenant_id, 'tenant_id'),
    role: text(membership.role),
    userId: user.id,
  }
}

async function requireStudent(supabase: SupabaseClient, user: User) {
  return requireMembership(supabase, user, ['student'])
}

async function requireStaff(supabase: SupabaseClient, user: User, roles: readonly LmsStaffRole[] = ['teacher', 'admin', 'super_admin']) {
  return requireMembership(supabase, user, roles)
}

async function requireMessagingMembership(supabase: SupabaseClient, user: User) {
  return requireMembership(supabase, user, messagingRoles)
}

async function singleRow<T extends Row>(query: PromiseLike<{ data: unknown; error: { message: string } | null }>, errorCode: string) {
  const { data, error } = await query
  if (error) {
    throw new LmsMutationError(error.message, errorCode)
  }
  if (!data) {
    throw new LmsMutationError('The requested LMS record was not found.', 'not_found')
  }

  return data as T
}

async function maybeSingleRow<T extends Row>(query: PromiseLike<{ data: unknown; error: { message: string } | null }>, errorCode: string) {
  const { data, error } = await query
  if (error) {
    throw new LmsMutationError(error.message, errorCode)
  }

  return (data ?? null) as T | null
}

async function rowList<T extends Row>(query: PromiseLike<{ data: unknown; error: { message: string } | null }>, errorCode: string) {
  const { data, error } = await query
  if (error) {
    throw new LmsMutationError(error.message, errorCode)
  }

  return rows(data) as T[]
}

async function ensureActiveStudentEnrollment(supabase: SupabaseClient, tenantId: string, courseId: string, studentId: string) {
  const enrollment = await maybeSingleRow(
    supabase
      .from('course_enrollments')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('course_id', courseId)
      .eq('student_id', studentId)
      .eq('status', 'active')
      .maybeSingle(),
    'enrollment_lookup_failed'
  )

  if (!enrollment) {
    throw new LmsMutationError('Student is not actively enrolled in this course.', 'enrollment_required')
  }
}

async function activeTenantMembershipForUser(supabase: SupabaseClient, tenantId: string, userId: string) {
  const membership = await maybeSingleRow(
    supabase
      .from('tenant_memberships')
      .select('tenant_id,user_id,role,status')
      .eq('tenant_id', tenantId)
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle(),
    'recipient_membership_lookup_failed'
  )

  if (!membership || !isRole(membership.role, messagingRoles)) {
    throw new LmsMutationError('Message recipient is not an active member of this school.', 'message_recipient_required')
  }

  return {
    tenantId: id(membership.tenant_id, 'tenant_id'),
    userId: id(membership.user_id, 'user_id'),
    role: text(membership.role) as LmsMessagingRole,
  }
}

async function ensureTeacherCanManageCourse(
  supabase: SupabaseClient,
  input: { tenantId: string; courseId: string; courseCreatedBy: unknown; teacherId: string }
) {
  if (id(input.courseCreatedBy, 'created_by') === input.teacherId) return

  const teacherEnrollment = await maybeSingleRow(
    supabase
      .from('course_enrollments')
      .select('id')
      .eq('tenant_id', input.tenantId)
      .eq('course_id', input.courseId)
      .eq('teacher_id', input.teacherId)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle(),
    'teacher_course_lookup_failed'
  )

  if (!teacherEnrollment) {
    throw new LmsMutationError('Teacher is not assigned to this course.', 'teacher_course_required')
  }
}

async function insertAuditLog(
  supabase: SupabaseClient,
  input: { tenantId: string; userId: string; action: string; resourceType: string; resourceId?: string; details?: Row }
) {
  await supabase.from('audit_logs').insert({
    tenant_id: input.tenantId,
    user_id: input.userId,
    action: input.action,
    resource_type: input.resourceType,
    resource_id: input.resourceId ?? null,
    details: input.details ?? {},
  })
}

async function ensureCourseResourceLesson(
  supabase: SupabaseClient,
  input: { tenantId: string; courseId: string; createdBy: string }
) {
  const existingLesson = await maybeSingleRow(
    supabase
      .from('lessons')
      .select('id')
      .eq('tenant_id', input.tenantId)
      .eq('course_id', input.courseId)
      .eq('title', courseResourceLessonTitle)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
    'resource_lesson_lookup_failed'
  )

  if (existingLesson) {
    return id(existingLesson.id, 'lesson_id')
  }

  const lastLesson = await maybeSingleRow(
    supabase
      .from('lessons')
      .select('order_index')
      .eq('tenant_id', input.tenantId)
      .eq('course_id', input.courseId)
      .order('order_index', { ascending: false })
      .limit(1)
      .maybeSingle(),
    'lesson_order_lookup_failed'
  )
  const lesson = await singleRow(
    supabase
      .from('lessons')
      .insert({
        tenant_id: input.tenantId,
        course_id: input.courseId,
        title: courseResourceLessonTitle,
        description: 'Teacher-uploaded course files and handouts.',
        content: '',
        order_index: optionalNumeric(lastLesson?.order_index, 0) + 1,
        created_by: input.createdBy,
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .select('id')
      .single(),
    'resource_lesson_insert_failed'
  )

  return id(lesson.id, 'lesson_id')
}

function bytes(value: unknown) {
  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

async function enforceCourseResourceQuota(
  supabase: SupabaseClient,
  input: { tenantId: string; courseId: string; nextFileSize: number }
) {
  const { data, error } = await supabase
    .from('course_resource_security_reviews')
    .select('course_id,file_size')
    .eq('tenant_id', input.tenantId)

  if (error) {
    if (isMissingResourceSecurityTableError(error)) return
    throw new LmsMutationError(`Unable to verify course resource quota: ${error.message}`, 'resource_quota_lookup_failed')
  }

  const usageRows = rows(data)
  const tenantBytes = usageRows.reduce((total, row) => total + bytes(row.file_size), 0)
  const courseBytes = usageRows
    .filter((row) => text(row.course_id) === input.courseId)
    .reduce((total, row) => total + bytes(row.file_size), 0)

  if (tenantBytes + input.nextFileSize > courseResourceTenantQuotaBytes()) {
    throw new LmsMutationError('This school has reached its course resource storage quota.', 'tenant_resource_quota_exceeded')
  }
  if (courseBytes + input.nextFileSize > courseResourceCourseQuotaBytes()) {
    throw new LmsMutationError('This course has reached its resource storage quota.', 'course_resource_quota_exceeded')
  }
}

async function recordCourseResourceSecurityReview(
  supabase: SupabaseClient,
  input: {
    tenantId: string
    courseId: string
    lessonId: string
    resourceId: string
    uploadedBy: string
    fileName: string
    fileType: string
    fileSize: number
    fileSha256: string
  }
) {
  const scanStatus = courseResourceInitialScanStatus()
  const { error } = await supabase.from('course_resource_security_reviews').insert({
    tenant_id: input.tenantId,
    course_id: input.courseId,
    lesson_id: input.lessonId,
    resource_id: input.resourceId,
    uploaded_by: input.uploadedBy,
    file_name: input.fileName,
    file_type: input.fileType,
    file_size: input.fileSize,
    file_sha256: input.fileSha256,
    scan_status: scanStatus,
    scan_provider: courseResourceScanProvider(),
    scan_checked_at: scanStatus === 'clean' ? new Date().toISOString() : null,
    retention_expires_at: courseResourceRetentionExpiresAt(),
  })

  if (error) {
    if (isMissingResourceSecurityTableError(error)) return
    throw new LmsMutationError(`Unable to record course resource security review: ${error.message}`, 'resource_security_review_failed')
  }
}

export function normalizeSubmissionDraft(input: { assignmentId: unknown; content: unknown; file?: unknown }) {
  const file = optionalUploadFile(input.file)
  const content = optionalLimitedText(input.content, 10000)

  if (!content && !file) {
    throw new LmsMutationError('submission is required', 'missing_submission')
  }

  if (!file) {
    return {
      assignmentId: id(input.assignmentId, 'assignment_id'),
      content,
    }
  }

  const fileName = limitedText(file.name, 'file_name', 255)
  const fileType = text(file.type, mimeTypeForFileName(fileName))

  if (file.size <= 0) {
    throw new LmsMutationError('Submission file is empty.', 'empty_submission_file')
  }
  if (file.size > maxSubmissionFileBytes) {
    throw new LmsMutationError('Submission file must be 25 MB or smaller.', 'submission_file_too_large')
  }
  if (!allowedSubmissionMimeTypes.has(fileType)) {
    throw new LmsMutationError('Submission file type is not supported.', 'unsupported_submission_file_type')
  }

  return {
    assignmentId: id(input.assignmentId, 'assignment_id'),
    content,
    file,
    fileName,
    fileType,
    fileSize: file.size,
  }
}

export function percentageForPoints(pointsEarned: number, maxPoints: number) {
  if (maxPoints <= 0) {
    throw new LmsMutationError('Assignment max points must be greater than zero.', 'invalid_max_points')
  }

  return Math.round((pointsEarned / maxPoints) * 10000) / 100
}

export function letterGradeForPercentage(percentage: number) {
  if (percentage >= 97) return 'A+'
  if (percentage >= 93) return 'A'
  if (percentage >= 90) return 'A-'
  if (percentage >= 87) return 'B+'
  if (percentage >= 83) return 'B'
  if (percentage >= 80) return 'B-'
  if (percentage >= 77) return 'C+'
  if (percentage >= 73) return 'C'
  if (percentage >= 70) return 'C-'
  if (percentage >= 67) return 'D+'
  if (percentage >= 63) return 'D'
  if (percentage >= 60) return 'D-'

  return 'F'
}

export function normalizeGradeDraft(input: { submissionId: unknown; pointsEarned: unknown; maxPoints: number; feedback: unknown }) {
  const pointsEarned = numeric(input.pointsEarned, 'points_earned')
  if (pointsEarned < 0) {
    throw new LmsMutationError('Points earned cannot be negative.', 'negative_points')
  }
  if (pointsEarned > input.maxPoints) {
    throw new LmsMutationError('Points earned cannot exceed assignment max points.', 'points_exceed_max')
  }

  return {
    submissionId: id(input.submissionId, 'submission_id'),
    pointsEarned,
    feedback: optionalLimitedText(input.feedback, 5000),
  }
}

export function normalizeCourseDraft(input: {
  name: unknown
  subject: unknown
  gradeLevel: unknown
  sectionLabel?: unknown
  termLabel?: unknown
  description?: unknown
}) {
  return {
    name: limitedText(input.name, 'course_name', 255),
    subject: optionalLimitedText(input.subject, 100),
    gradeLevel: optionalLimitedText(input.gradeLevel, 50),
    sectionLabel: optionalLimitedText(input.sectionLabel, 80),
    termLabel: optionalLimitedText(input.termLabel, 80),
    description: optionalLimitedText(input.description, 5000),
  }
}

export function normalizeAssignmentDraft(input: {
  courseId: unknown
  title: unknown
  instructions: unknown
  dueDate: unknown
  maxPoints: unknown
  category?: unknown
}) {
  const maxPoints = numeric(input.maxPoints, 'max_points')
  if (maxPoints <= 0) {
    throw new LmsMutationError('Max points must be greater than zero.', 'invalid_max_points')
  }

  return {
    courseId: id(input.courseId, 'course_id'),
    title: limitedText(input.title, 'assignment_title', 255),
    instructions: optionalLimitedText(input.instructions, 10000),
    dueDate: limitedText(input.dueDate, 'due_date', 80),
    maxPoints,
    category: optionalLimitedText(input.category, 80) || 'Coursework',
  }
}

export function normalizeResourceUploadDraft(input: { courseId: unknown; displayName?: unknown; file: unknown }) {
  if (!isUploadFile(input.file)) {
    throw new LmsMutationError('A resource file is required.', 'missing_resource_file')
  }

  const fileName = limitedText(input.file.name, 'file_name', 255)
  const fileType = text(input.file.type, mimeTypeForFileName(fileName))

  if (input.file.size <= 0) {
    throw new LmsMutationError('Resource file is empty.', 'empty_resource_file')
  }
  if (input.file.size > maxCourseResourceBytes) {
    throw new LmsMutationError('Resource file must be 100 MB or smaller.', 'resource_file_too_large')
  }
  if (!allowedCourseResourceMimeTypes.has(fileType)) {
    throw new LmsMutationError('Resource file type is not supported.', 'unsupported_resource_file_type')
  }

  return {
    courseId: id(input.courseId, 'course_id'),
    displayName: optionalLimitedText(input.displayName, 255) || fileName,
    file: input.file,
    fileName,
    fileType,
    fileSize: input.file.size,
  }
}

export function normalizeEnrollmentDraft(input: { courseId: unknown; studentId: unknown; teacherId?: unknown }) {
  return {
    courseId: id(input.courseId, 'course_id'),
    studentId: id(input.studentId, 'student_id'),
    teacherId: text(input.teacherId),
  }
}

function dateOnly(value: unknown, field: string) {
  const normalized = limitedText(value, field, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    throw new LmsMutationError(`${field} must use YYYY-MM-DD.`, `invalid_${field}`)
  }

  const parsed = new Date(`${normalized}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== normalized) {
    throw new LmsMutationError(`${field} must be a real calendar date.`, `invalid_${field}`)
  }

  return normalized
}

function attendanceStatus(value: unknown) {
  if (attendanceStatuses.includes(value as LmsAttendanceStatus)) {
    return value as LmsAttendanceStatus
  }

  throw new LmsMutationError('Attendance status must be present, absent, tardy, excused, or online.', 'invalid_attendance_status')
}

export function normalizeAttendanceDraft(input: {
  courseId: unknown
  studentId: unknown
  attendanceDate: unknown
  status: unknown
  notes?: unknown
}) {
  return {
    courseId: id(input.courseId, 'course_id'),
    studentId: id(input.studentId, 'student_id'),
    attendanceDate: dateOnly(input.attendanceDate, 'attendance_date'),
    status: attendanceStatus(input.status),
    notes: optionalLimitedText(input.notes, 1000),
  }
}

export function normalizeRubricDraft(input: { assignmentId: unknown; name: unknown; description?: unknown; criteria: unknown }) {
  const description = optionalLimitedText(input.description, 2000)
  const criteria = jsonArray(input.criteria, 'criteria')
    .map((criterion, index) => {
      if (!criterion || typeof criterion !== 'object' || Array.isArray(criterion)) {
        throw new LmsMutationError(`Rubric criterion ${index + 1} must be an object.`, 'invalid_rubric_criterion')
      }

      const row = criterion as Row
      const points = numeric(row.points, 'criterion_points')
      if (points <= 0) {
        throw new LmsMutationError('Rubric criterion points must be greater than zero.', 'invalid_criterion_points')
      }

      return {
        name: limitedText(row.name, 'criterion_name', 120),
        points,
      }
    })

  if (criteria.length === 0) {
    throw new LmsMutationError('Rubric criteria are required.', 'missing_rubric_criteria')
  }
  if (criteria.length > 20) {
    throw new LmsMutationError('Rubrics can include at most 20 criteria.', 'too_many_rubric_criteria')
  }

  return {
    assignmentId: id(input.assignmentId, 'assignment_id'),
    name: limitedText(input.name, 'rubric_name', 255),
    ...(description ? { description } : {}),
    criteria,
  }
}

export function normalizeMessageDraft(input: { courseId: unknown; recipientId?: unknown; subject?: unknown; content: unknown }) {
  return {
    courseId: id(input.courseId, 'course_id'),
    recipientId: text(input.recipientId),
    subject: optionalLimitedText(input.subject, 255),
    content: limitedText(input.content, 'message', 5000),
  }
}

function messageModerationStatus(value: unknown) {
  const normalized = text(value)
  if (!messageModerationStatuses.includes(normalized as LmsMessageModerationStatus)) {
    throw new LmsMutationError('Invalid message moderation status.', 'invalid_message_moderation_status')
  }

  return normalized as LmsMessageModerationStatus
}

export function normalizeMessageModerationDraft(input: { messageId: unknown; moderationStatus: unknown; moderationNote?: unknown }) {
  return {
    messageId: id(input.messageId, 'message_id'),
    moderationStatus: messageModerationStatus(input.moderationStatus),
    moderationNote: optionalLimitedText(input.moderationNote, 500),
  }
}

function notificationActionUrlForRole(role: LmsMessagingRole) {
  if (role === 'student') return '/student/messages'
  if (role === 'parent') return '/guardian'
  if (role === 'teacher') return '/teacher'

  return '/admin'
}

async function courseMessageRecipientFromStudent(
  supabase: SupabaseClient,
  input: { tenantId: string; courseId: string; studentId: string; courseCreatedBy: unknown }
) {
  const enrollment = await maybeSingleRow(
    supabase
      .from('course_enrollments')
      .select('student_id,teacher_id')
      .eq('tenant_id', input.tenantId)
      .eq('course_id', input.courseId)
      .eq('student_id', input.studentId)
      .eq('status', 'active')
      .maybeSingle(),
    'message_enrollment_lookup_failed'
  )

  if (!enrollment) {
    throw new LmsMutationError('Student is not actively enrolled in this course.', 'message_course_required')
  }

  return {
    recipientId: text(enrollment.teacher_id) || id(input.courseCreatedBy, 'created_by'),
    studentId: id(enrollment.student_id, 'student_id'),
  }
}

async function courseMessageRecipientFromGuardian(
  supabase: SupabaseClient,
  input: { tenantId: string; courseId: string; guardianId: string; courseCreatedBy: unknown }
) {
  const links = await rowList(
    supabase
      .from('student_parents')
      .select('student_id')
      .eq('tenant_id', input.tenantId)
      .eq('parent_id', input.guardianId)
      .eq('status', 'active'),
    'guardian_link_lookup_failed'
  )
  const linkedStudentIds = new Set(links.map((link) => text(link.student_id)).filter(Boolean))

  if (linkedStudentIds.size === 0) {
    throw new LmsMutationError('Guardian has no active linked students.', 'guardian_link_required')
  }

  const enrollments = await rowList(
    supabase
      .from('course_enrollments')
      .select('student_id,teacher_id')
      .eq('tenant_id', input.tenantId)
      .eq('course_id', input.courseId)
      .eq('status', 'active'),
    'guardian_course_lookup_failed'
  )
  const enrollment = enrollments.find((candidate) => linkedStudentIds.has(text(candidate.student_id)))

  if (!enrollment) {
    throw new LmsMutationError('Guardian is not linked to a student in this course.', 'guardian_course_required')
  }

  return {
    recipientId: text(enrollment.teacher_id) || id(input.courseCreatedBy, 'created_by'),
    studentId: id(enrollment.student_id, 'student_id'),
  }
}

async function ensureTeacherCanMessageRecipient(
  supabase: SupabaseClient,
  input: {
    tenantId: string
    courseId: string
    teacherId: string
    courseCreatedBy: unknown
    recipientId: string
    recipientRole: LmsMessagingRole
  }
) {
  if (input.recipientRole === 'admin' || input.recipientRole === 'super_admin') return

  const teacherOwnsCourse = id(input.courseCreatedBy, 'created_by') === input.teacherId

  if (input.recipientRole === 'student') {
    const enrollment = await maybeSingleRow(
      supabase
        .from('course_enrollments')
        .select('id,teacher_id')
        .eq('tenant_id', input.tenantId)
        .eq('course_id', input.courseId)
        .eq('student_id', input.recipientId)
        .eq('status', 'active')
        .maybeSingle(),
      'message_recipient_enrollment_lookup_failed'
    )

    if (!enrollment || (!teacherOwnsCourse && text(enrollment.teacher_id) !== input.teacherId)) {
      throw new LmsMutationError('Teacher can only message students assigned to this course.', 'message_recipient_not_allowed')
    }

    return
  }

  if (input.recipientRole === 'parent') {
    const links = await rowList(
      supabase
        .from('student_parents')
        .select('student_id')
        .eq('tenant_id', input.tenantId)
        .eq('parent_id', input.recipientId)
        .eq('status', 'active'),
      'message_guardian_link_lookup_failed'
    )
    const linkedStudentIds = new Set(links.map((link) => text(link.student_id)).filter(Boolean))
    const enrollments = await rowList(
      supabase
        .from('course_enrollments')
        .select('student_id,teacher_id')
        .eq('tenant_id', input.tenantId)
        .eq('course_id', input.courseId)
        .eq('status', 'active'),
      'message_guardian_course_lookup_failed'
    )
    const linkedEnrollment = enrollments.find((enrollment) => linkedStudentIds.has(text(enrollment.student_id)))

    if (!linkedEnrollment || (!teacherOwnsCourse && text(linkedEnrollment.teacher_id) !== input.teacherId)) {
      throw new LmsMutationError('Teacher can only message guardians linked to assigned students.', 'message_recipient_not_allowed')
    }

    return
  }

  throw new LmsMutationError('Teacher cannot message that recipient for this course.', 'message_recipient_not_allowed')
}

async function resolveCourseMessageRecipient(
  supabase: SupabaseClient,
  input: {
    tenantId: string
    courseId: string
    courseCreatedBy: unknown
    draftRecipientId: string
    sender: { userId: string; role: LmsMessagingRole }
  }
) {
  let recipientId = input.draftRecipientId
  let linkedStudentId = ''

  if (input.sender.role === 'student') {
    const recipient = await courseMessageRecipientFromStudent(supabase, {
      tenantId: input.tenantId,
      courseId: input.courseId,
      studentId: input.sender.userId,
      courseCreatedBy: input.courseCreatedBy,
    })
    recipientId = recipient.recipientId
    linkedStudentId = recipient.studentId
  } else if (input.sender.role === 'parent') {
    const recipient = await courseMessageRecipientFromGuardian(supabase, {
      tenantId: input.tenantId,
      courseId: input.courseId,
      guardianId: input.sender.userId,
      courseCreatedBy: input.courseCreatedBy,
    })
    recipientId = recipient.recipientId
    linkedStudentId = recipient.studentId
  } else if (!recipientId) {
    throw new LmsMutationError('Message recipient is required.', 'missing_recipient_id')
  }

  if (recipientId === input.sender.userId) {
    throw new LmsMutationError('Messages require a different recipient.', 'message_recipient_not_allowed')
  }

  const recipientMembership = await activeTenantMembershipForUser(supabase, input.tenantId, recipientId)

  if ((input.sender.role === 'student' || input.sender.role === 'parent') && !isRole(recipientMembership.role, ['teacher', 'admin', 'super_admin'])) {
    throw new LmsMutationError('Students and guardians can only message course staff.', 'message_recipient_not_allowed')
  }

  if (input.sender.role === 'teacher') {
    await ensureTeacherCanMessageRecipient(supabase, {
      tenantId: input.tenantId,
      courseId: input.courseId,
      teacherId: input.sender.userId,
      courseCreatedBy: input.courseCreatedBy,
      recipientId,
      recipientRole: recipientMembership.role,
    })
  }

  return { recipientId, recipientRole: recipientMembership.role, linkedStudentId }
}

export async function sendCourseMessage(
  supabase: SupabaseClient,
  input: { courseId: unknown; recipientId?: unknown; subject?: unknown; content: unknown }
) {
  const user = await requireUser(supabase)
  const membership = await requireMessagingMembership(supabase, user)
  const draft = normalizeMessageDraft(input)
  const course = await singleRow(
    supabase.from('courses').select('id,tenant_id,name,created_by,status').eq('id', draft.courseId).single(),
    'message_course_lookup_failed'
  )
  const tenantId = id(course.tenant_id, 'tenant_id')

  if (tenantId !== membership.tenantId) {
    throw new LmsMutationError('Course does not belong to this school.', 'tenant_mismatch')
  }
  if (text(course.status) !== 'active') {
    throw new LmsMutationError('Messages can only be sent for active courses.', 'message_course_inactive')
  }

  const recipient = await resolveCourseMessageRecipient(supabase, {
    tenantId,
    courseId: draft.courseId,
    courseCreatedBy: course.created_by,
    draftRecipientId: draft.recipientId,
    sender: { userId: user.id, role: membership.role as LmsMessagingRole },
  })
  const subject = draft.subject || `Course message: ${text(course.name, 'Course')}`
  const conversation = await singleRow(
    supabase
      .from('conversations')
      .insert({
        tenant_id: tenantId,
        type: 'direct',
        subject,
        course_id: draft.courseId,
        created_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single(),
    'conversation_insert_failed'
  )
  const conversationId = id(conversation.id, 'conversation_id')
  const { error: memberError } = await supabase.from('conversation_members').insert([
    { conversation_id: conversationId, user_id: user.id },
    { conversation_id: conversationId, user_id: recipient.recipientId },
  ])

  if (memberError) {
    throw new LmsMutationError(`Unable to create conversation members: ${memberError.message}`, 'conversation_member_insert_failed')
  }

  const message = await singleRow(
    supabase
      .from('messages')
      .insert({
        tenant_id: tenantId,
        conversation_id: conversationId,
        sender_id: user.id,
        content: draft.content,
      })
      .select('id')
      .single(),
    'message_insert_failed'
  )
  const messageId = id(message.id, 'message_id')

  await supabase.from('notifications').insert({
    tenant_id: tenantId,
    user_id: recipient.recipientId,
    type: 'message_received',
    title: 'New message',
    message: subject,
    action_url: notificationActionUrlForRole(recipient.recipientRole),
    course_id: draft.courseId,
    read: false,
  })
  await insertAuditLog(supabase, {
    tenantId,
    userId: user.id,
    action: 'message.sent',
    resourceType: 'message',
    resourceId: messageId,
    details: {
      conversation_id: conversationId,
      course_id: draft.courseId,
      recipient_id: recipient.recipientId,
      ...(recipient.linkedStudentId ? { linked_student_id: recipient.linkedStudentId } : {}),
    },
  })

  return { conversationId, messageId }
}

export async function moderateCourseMessage(
  supabase: SupabaseClient,
  input: { messageId: unknown; moderationStatus: unknown; moderationNote?: unknown }
) {
  const user = await requireUser(supabase)
  const staff = await requireStaff(supabase, user)
  const draft = normalizeMessageModerationDraft(input)
  const message = await singleRow(
    supabase
      .from('messages')
      .select('id,tenant_id,conversation_id')
      .eq('id', draft.messageId)
      .single(),
    'message_lookup_failed'
  )
  const tenantId = id(message.tenant_id, 'tenant_id')
  const conversationId = id(message.conversation_id, 'conversation_id')

  if (tenantId !== staff.tenantId) {
    throw new LmsMutationError('Message does not belong to this school.', 'tenant_mismatch')
  }

  const conversation = await singleRow(
    supabase
      .from('conversations')
      .select('id,tenant_id,course_id')
      .eq('id', conversationId)
      .single(),
    'conversation_lookup_failed'
  )
  const courseId = text(conversation.course_id)

  if (id(conversation.tenant_id, 'tenant_id') !== tenantId) {
    throw new LmsMutationError('Conversation does not belong to this school.', 'tenant_mismatch')
  }

  if (staff.role === 'teacher') {
    if (!courseId) {
      throw new LmsMutationError('Teacher message moderation requires a course conversation.', 'teacher_course_required')
    }

    const course = await singleRow(
      supabase
        .from('courses')
        .select('id,tenant_id,created_by')
        .eq('id', courseId)
        .single(),
      'message_course_lookup_failed'
    )

    if (id(course.tenant_id, 'tenant_id') !== tenantId) {
      throw new LmsMutationError('Course does not belong to this school.', 'tenant_mismatch')
    }

    await ensureTeacherCanManageCourse(supabase, {
      tenantId,
      courseId,
      courseCreatedBy: course.created_by,
      teacherId: user.id,
    })
  }

  const moderatedAt = new Date().toISOString()
  const { error } = await supabase
    .from('messages')
    .update({
      moderation_status: draft.moderationStatus,
      moderation_note: draft.moderationNote,
      moderated_by: user.id,
      moderated_at: moderatedAt,
    })
    .eq('id', draft.messageId)
    .eq('tenant_id', tenantId)

  if (error) {
    throw new LmsMutationError(`Unable to update message moderation: ${error.message}`, 'message_moderation_failed')
  }

  await insertAuditLog(supabase, {
    tenantId,
    userId: user.id,
    action: 'message.moderated',
    resourceType: 'message',
    resourceId: draft.messageId,
    details: {
      conversation_id: conversationId,
      course_id: courseId,
      moderation_status: draft.moderationStatus,
      moderation_note: draft.moderationNote,
      moderated_at: moderatedAt,
    },
  })

  return { messageId: draft.messageId, moderationStatus: draft.moderationStatus }
}

export async function submitAssignment(
  supabase: SupabaseClient,
  input: { assignmentId: unknown; content: unknown; file?: unknown },
  options: { storageClient?: SupabaseClient; bucket?: string } = {}
) {
  const user = await requireUser(supabase)
  const membership = await requireStudent(supabase, user)
  const draft = normalizeSubmissionDraft(input)
  const assignment = await singleRow(
    supabase
      .from('assignments')
      .select('id,tenant_id,course_id,due_date,status')
      .eq('id', draft.assignmentId)
      .single(),
    'assignment_lookup_failed'
  )
  const tenantId = id(assignment.tenant_id, 'tenant_id')
  const courseId = id(assignment.course_id, 'course_id')

  if (tenantId !== membership.tenantId) {
    throw new LmsMutationError('Assignment does not belong to this school.', 'tenant_mismatch')
  }
  if (text(assignment.status) !== 'assigned') {
    throw new LmsMutationError('Assignment is not open for submissions.', 'assignment_not_open')
  }

  await ensureActiveStudentEnrollment(supabase, tenantId, courseId, user.id)

  const existingSubmission = await maybeSingleRow(
    supabase
      .from('submissions')
      .select('id,attempt_number,file_path')
      .eq('assignment_id', draft.assignmentId)
      .eq('student_id', user.id)
      .order('attempt_number', { ascending: false })
      .limit(1)
      .maybeSingle(),
    'submission_lookup_failed'
  )
  const submittedLate = Date.now() > Date.parse(text(assignment.due_date))
  const payload: Row = {
    tenant_id: tenantId,
    assignment_id: draft.assignmentId,
    student_id: user.id,
    submission_text: draft.content || null,
    status: 'submitted',
    submitted_late: submittedLate,
    submitted_at: new Date().toISOString(),
  }
  const storageClient = options.storageClient ?? supabase
  const storageBucket = options.bucket ?? getSubmissionBucket()
  let uploadedPath = ''
  let fileSha256 = ''

  try {
    if ('file' in draft && draft.file) {
      fileSha256 = await sha256ForUploadFile(draft.file)
      uploadedPath = `${tenantId}/${user.id}/${courseId}/${draft.assignmentId}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}-${safeStorageFileName(draft.fileName)}`

      const { error: uploadError } = await storageClient.storage.from(storageBucket).upload(uploadedPath, draft.file, {
        contentType: draft.fileType,
        upsert: false,
      })

      if (uploadError) {
        throw new LmsMutationError(`Unable to upload submission file: ${uploadError.message}`, 'submission_file_upload_failed')
      }

      payload.file_path = uploadedPath
      payload.file_name = draft.fileName
      payload.submission_url = null
    }

    const saved = existingSubmission
      ? await singleRow(
          supabase.from('submissions').update(payload).eq('id', id(existingSubmission.id, 'submission_id')).select('id').single(),
          'submission_update_failed'
        )
      : await singleRow(
          supabase.from('submissions').insert({ ...payload, attempt_number: 1 }).select('id').single(),
          'submission_insert_failed'
        )

    if (uploadedPath && text(existingSubmission?.file_path)) {
      await storageClient.storage.from(storageBucket).remove([text(existingSubmission?.file_path)])
    }

    await insertAuditLog(supabase, {
      tenantId,
      userId: user.id,
      action: existingSubmission ? 'submission.updated' : 'submission.created',
      resourceType: 'submission',
      resourceId: id(saved.id, 'submission_id'),
      details: {
        assignment_id: draft.assignmentId,
        ...(uploadedPath && 'fileName' in draft
          ? {
              file_name: draft.fileName,
              file_size: draft.fileSize,
              file_sha256: fileSha256,
            }
          : {}),
      },
    })

    if (!existingSubmission) {
      await tryAwardServerCompanionXp(supabase, {
        tenantId,
        studentId: user.id,
        source: 'assignment_submitted',
        label: 'Assignment submitted',
      })
    }

    return { submissionId: id(saved.id, 'submission_id'), filePath: uploadedPath }
  } catch (error) {
    if (uploadedPath) {
      await storageClient.storage.from(storageBucket).remove([uploadedPath])
    }

    throw error
  }
}

export async function gradeSubmission(
  supabase: SupabaseClient,
  input: { submissionId: unknown; pointsEarned: unknown; feedback: unknown }
) {
  const user = await requireUser(supabase)
  const membership = await requireStaff(supabase, user)
  const submission = await singleRow(
    supabase
      .from('submissions')
      .select('id,tenant_id,assignment_id,student_id')
      .eq('id', id(input.submissionId, 'submission_id'))
      .single(),
    'submission_lookup_failed'
  )
  const assignment = await singleRow(
    supabase
      .from('assignments')
      .select('id,tenant_id,course_id,max_points,title')
      .eq('id', id(submission.assignment_id, 'assignment_id'))
      .single(),
    'assignment_lookup_failed'
  )
  const tenantId = id(submission.tenant_id, 'tenant_id')
  const courseId = id(assignment.course_id, 'course_id')
  const studentId = id(submission.student_id, 'student_id')
  const maxPoints = numeric(assignment.max_points, 'max_points')
  const draft = normalizeGradeDraft({ ...input, maxPoints })

  if (tenantId !== membership.tenantId) {
    throw new LmsMutationError('Submission does not belong to this school.', 'tenant_mismatch')
  }
  if (membership.role === 'teacher') {
    const enrollment = await maybeSingleRow(
      supabase
        .from('course_enrollments')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('course_id', courseId)
        .eq('student_id', studentId)
        .eq('teacher_id', user.id)
        .eq('status', 'active')
        .maybeSingle(),
      'teacher_course_lookup_failed'
    )

    if (!enrollment) {
      throw new LmsMutationError('Teacher is not assigned to this student course enrollment.', 'teacher_course_required')
    }
  }

  const percentage = percentageForPoints(draft.pointsEarned, maxPoints)
  const existingGrade = await maybeSingleRow(
    supabase
      .from('grades')
      .select('id')
      .eq('assignment_id', id(assignment.id, 'assignment_id'))
      .eq('student_id', studentId)
      .maybeSingle(),
    'grade_lookup_failed'
  )
  const gradePayload = {
    tenant_id: tenantId,
    submission_id: draft.submissionId,
    assignment_id: id(assignment.id, 'assignment_id'),
    student_id: studentId,
    course_id: courseId,
    points_earned: draft.pointsEarned,
    percentage,
    letter_grade: letterGradeForPercentage(percentage),
    feedback: draft.feedback,
    graded_by: user.id,
    graded_at: new Date().toISOString(),
  }

  const savedGrade = existingGrade
    ? await singleRow(
        supabase.from('grades').update(gradePayload).eq('id', id(existingGrade.id, 'grade_id')).select('id').single(),
        'grade_update_failed'
      )
    : await singleRow(supabase.from('grades').insert(gradePayload).select('id').single(), 'grade_insert_failed')

  await supabase
    .from('submissions')
    .update({ status: 'graded', graded_by: user.id, graded_at: new Date().toISOString() })
    .eq('id', draft.submissionId)

  await supabase.from('notifications').insert({
    tenant_id: tenantId,
    user_id: studentId,
    type: 'grade_posted',
    title: 'Grade posted',
    message: `${text(assignment.title, 'Assignment')} has new feedback.`,
    action_url: '/student',
    course_id: courseId,
    assignment_id: id(assignment.id, 'assignment_id'),
    read: false,
  })
  await insertAuditLog(supabase, {
    tenantId,
    userId: user.id,
    action: existingGrade ? 'grade.updated' : 'grade.created',
    resourceType: 'grade',
    resourceId: id(savedGrade.id, 'grade_id'),
    details: { submission_id: draft.submissionId, student_id: studentId },
  })

  if (!existingGrade) {
    await tryAwardServerCompanionXp(supabase, {
      tenantId,
      studentId,
      source: 'course_task_checked',
      label: 'Teacher feedback received',
    })
  }

  return { gradeId: id(savedGrade.id, 'grade_id') }
}

export async function createCourse(
  supabase: SupabaseClient,
  input: { name: unknown; subject: unknown; gradeLevel: unknown; sectionLabel?: unknown; termLabel?: unknown; description?: unknown }
) {
  const user = await requireUser(supabase)
  const membership = await requireStaff(supabase, user)
  const draft = normalizeCourseDraft(input)
  const course = await singleRow(
    supabase
      .from('courses')
      .insert({
        tenant_id: membership.tenantId,
        name: draft.name,
        description: draft.description || null,
        subject: draft.subject || null,
        grade_level: draft.gradeLevel || null,
        section_label: draft.sectionLabel || null,
        semester: draft.termLabel || null,
        created_by: user.id,
        status: 'active',
      })
      .select('id')
      .single(),
    'course_insert_failed'
  )

  await insertAuditLog(supabase, {
    tenantId: membership.tenantId,
    userId: user.id,
    action: 'course.created',
    resourceType: 'course',
    resourceId: id(course.id, 'course_id'),
    details: { section_label: draft.sectionLabel, term_label: draft.termLabel },
  })

  return { courseId: id(course.id, 'course_id') }
}

export async function createAssignment(
  supabase: SupabaseClient,
  input: { courseId: unknown; title: unknown; instructions: unknown; dueDate: unknown; maxPoints: unknown; category?: unknown }
) {
  const user = await requireUser(supabase)
  const membership = await requireStaff(supabase, user)
  const draft = normalizeAssignmentDraft(input)
  const course = await singleRow(
    supabase.from('courses').select('id,tenant_id,created_by').eq('id', draft.courseId).single(),
    'course_lookup_failed'
  )

  if (id(course.tenant_id, 'tenant_id') !== membership.tenantId) {
    throw new LmsMutationError('Course does not belong to this school.', 'tenant_mismatch')
  }
  if (membership.role === 'teacher') {
    await ensureTeacherCanManageCourse(supabase, {
      tenantId: membership.tenantId,
      courseId: draft.courseId,
      courseCreatedBy: course.created_by,
      teacherId: user.id,
    })
  }

  const assignment = await singleRow(
    supabase
      .from('assignments')
      .insert({
        tenant_id: membership.tenantId,
        course_id: draft.courseId,
        title: draft.title,
        instructions: draft.instructions,
        due_date: new Date(draft.dueDate).toISOString(),
        max_points: draft.maxPoints,
        category: draft.category,
        submission_type: 'text',
        type: 'homework',
        status: 'assigned',
        created_by: user.id,
      })
      .select('id')
      .single(),
    'assignment_insert_failed'
  )

  await insertAuditLog(supabase, {
    tenantId: membership.tenantId,
    userId: user.id,
    action: 'assignment.created',
    resourceType: 'assignment',
    resourceId: id(assignment.id, 'assignment_id'),
    details: { course_id: draft.courseId },
  })

  return { assignmentId: id(assignment.id, 'assignment_id') }
}

export async function createCourseResource(
  supabase: SupabaseClient,
  input: { courseId: unknown; displayName?: unknown; file: unknown },
  options: { storageClient?: SupabaseClient; bucket?: string } = {}
) {
  const user = await requireUser(supabase)
  const membership = await requireStaff(supabase, user)
  const draft = normalizeResourceUploadDraft(input)
  const course = await singleRow(
    supabase.from('courses').select('id,tenant_id,created_by').eq('id', draft.courseId).single(),
    'course_lookup_failed'
  )
  const tenantId = id(course.tenant_id, 'tenant_id')

  if (tenantId !== membership.tenantId) {
    throw new LmsMutationError('Course does not belong to this school.', 'tenant_mismatch')
  }
  if (membership.role === 'teacher') {
    await ensureTeacherCanManageCourse(supabase, {
      tenantId,
      courseId: draft.courseId,
      courseCreatedBy: course.created_by,
      teacherId: user.id,
    })
  }

  const fileSha256 = await sha256ForUploadFile(draft.file)
  await enforceCourseResourceQuota(supabase, {
    tenantId,
    courseId: draft.courseId,
    nextFileSize: draft.fileSize,
  })

  const storageObjectName = `${tenantId}/${user.id}/${draft.courseId}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}-${safeStorageFileName(draft.fileName)}`
  const storageClient = options.storageClient ?? supabase
  const storageBucket = options.bucket ?? getCourseResourceBucket()
  let uploaded = false
  let resourceIdToDelete = ''

  try {
    const { error: uploadError } = await storageClient.storage.from(storageBucket).upload(storageObjectName, draft.file, {
      contentType: draft.fileType,
      upsert: false,
    })

    if (uploadError) {
      throw new LmsMutationError(`Unable to upload course resource: ${uploadError.message}`, 'resource_upload_failed')
    }
    uploaded = true

    const lessonId = await ensureCourseResourceLesson(supabase, { tenantId, courseId: draft.courseId, createdBy: user.id })

    const resource = await singleRow(
      supabase
        .from('lesson_attachments')
        .insert({
          lesson_id: lessonId,
          file_path: storageObjectName,
          file_name: draft.fileName,
          file_type: draft.fileType,
          file_size: draft.fileSize,
          display_name: draft.displayName,
          order_index: 0,
        })
        .select('id')
        .single(),
      'resource_insert_failed'
    )
    const resourceId = id(resource.id, 'resource_id')
    resourceIdToDelete = resourceId

    await recordCourseResourceSecurityReview(supabase, {
      tenantId,
      courseId: draft.courseId,
      lessonId,
      resourceId,
      uploadedBy: user.id,
      fileName: draft.fileName,
      fileType: draft.fileType,
      fileSize: draft.fileSize,
      fileSha256,
    })

    await insertAuditLog(supabase, {
      tenantId,
      userId: user.id,
      action: 'resource.created',
      resourceType: 'lesson_attachment',
      resourceId,
      details: { course_id: draft.courseId, lesson_id: lessonId, file_name: draft.fileName, file_sha256: fileSha256 },
    })

    return { resourceId }
  } catch (error) {
    if (resourceIdToDelete) {
      await supabase.from('lesson_attachments').delete().eq('id', resourceIdToDelete)
    }
    if (uploaded) {
      await storageClient.storage.from(storageBucket).remove([storageObjectName])
    }

    throw error
  }
}

export async function markAttendance(
  supabase: SupabaseClient,
  input: { courseId: unknown; studentId: unknown; attendanceDate: unknown; status: unknown; notes?: unknown }
) {
  const user = await requireUser(supabase)
  const membership = await requireStaff(supabase, user)
  const draft = normalizeAttendanceDraft(input)
  const course = await singleRow(
    supabase.from('courses').select('id,tenant_id,created_by').eq('id', draft.courseId).single(),
    'course_lookup_failed'
  )
  const tenantId = id(course.tenant_id, 'tenant_id')

  if (tenantId !== membership.tenantId) {
    throw new LmsMutationError('Course does not belong to this school.', 'tenant_mismatch')
  }

  await ensureActiveStudentEnrollment(supabase, tenantId, draft.courseId, draft.studentId)

  if (membership.role === 'teacher') {
    const teacherEnrollment = await maybeSingleRow(
      supabase
        .from('course_enrollments')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('course_id', draft.courseId)
        .eq('student_id', draft.studentId)
        .eq('teacher_id', user.id)
        .eq('status', 'active')
        .maybeSingle(),
      'teacher_course_lookup_failed'
    )

    if (!teacherEnrollment && id(course.created_by, 'created_by') !== user.id) {
      throw new LmsMutationError('Teacher is not assigned to this student course enrollment.', 'teacher_course_required')
    }
  }

  const existingAttendance = await maybeSingleRow(
    supabase
      .from('attendance_records')
      .select('id')
      .eq('course_id', draft.courseId)
      .eq('student_id', draft.studentId)
      .eq('attendance_date', draft.attendanceDate)
      .maybeSingle(),
    'attendance_lookup_failed'
  )
  const payload = {
    tenant_id: tenantId,
    course_id: draft.courseId,
    student_id: draft.studentId,
    attendance_date: draft.attendanceDate,
    status: draft.status,
    notes: draft.notes || null,
    marked_by: user.id,
  }
  const savedAttendance = existingAttendance
    ? await singleRow(
        supabase
          .from('attendance_records')
          .update(payload)
          .eq('id', id(existingAttendance.id, 'attendance_id'))
          .select('id')
          .single(),
        'attendance_update_failed'
      )
    : await singleRow(supabase.from('attendance_records').insert(payload).select('id').single(), 'attendance_insert_failed')

  await insertAuditLog(supabase, {
    tenantId,
    userId: user.id,
    action: existingAttendance ? 'attendance.updated' : 'attendance.created',
    resourceType: 'attendance_record',
    resourceId: id(savedAttendance.id, 'attendance_id'),
    details: { course_id: draft.courseId, student_id: draft.studentId, attendance_date: draft.attendanceDate },
  })

  if (!existingAttendance && (draft.status === 'present' || draft.status === 'online')) {
    await tryAwardServerCompanionXp(supabase, {
      tenantId,
      studentId: draft.studentId,
      source: 'study_streak',
      label: 'Attendance check-in',
      occurredAt: `${draft.attendanceDate}T00:00:00.000Z`,
    })
  }

  return { attendanceId: id(savedAttendance.id, 'attendance_id') }
}

export async function createRubric(
  supabase: SupabaseClient,
  input: { assignmentId: unknown; name: unknown; description?: unknown; criteria: unknown }
) {
  const user = await requireUser(supabase)
  const membership = await requireStaff(supabase, user)
  const draft = normalizeRubricDraft(input)
  const assignment = await singleRow(
    supabase.from('assignments').select('id,tenant_id,course_id,created_by').eq('id', draft.assignmentId).single(),
    'assignment_lookup_failed'
  )
  const tenantId = id(assignment.tenant_id, 'tenant_id')
  const course = await singleRow(
    supabase.from('courses').select('id,created_by').eq('id', id(assignment.course_id, 'course_id')).single(),
    'course_lookup_failed'
  )

  if (tenantId !== membership.tenantId) {
    throw new LmsMutationError('Assignment does not belong to this school.', 'tenant_mismatch')
  }
  if (membership.role === 'teacher' && id(course.created_by, 'created_by') !== user.id && id(assignment.created_by, 'created_by') !== user.id) {
    await ensureTeacherCanManageCourse(supabase, {
      tenantId,
      courseId: id(assignment.course_id, 'course_id'),
      courseCreatedBy: course.created_by,
      teacherId: user.id,
    })
  }

  const rubric = await singleRow(
    supabase
      .from('rubrics')
      .insert({
        tenant_id: tenantId,
        assignment_id: draft.assignmentId,
        name: draft.name,
        description: 'description' in draft ? draft.description : null,
        criteria: draft.criteria,
        created_by: user.id,
      })
      .select('id')
      .single(),
    'rubric_insert_failed'
  )

  await insertAuditLog(supabase, {
    tenantId,
    userId: user.id,
    action: 'rubric.created',
    resourceType: 'rubric',
    resourceId: id(rubric.id, 'rubric_id'),
    details: { assignment_id: draft.assignmentId },
  })

  return { rubricId: id(rubric.id, 'rubric_id') }
}

export async function enrollStudent(
  supabase: SupabaseClient,
  input: { courseId: unknown; studentId: unknown; teacherId?: unknown; notifyStudent?: unknown }
) {
  const user = await requireUser(supabase)
  const membership = await requireStaff(supabase, user, ['admin', 'super_admin'])
  const draft = normalizeEnrollmentDraft(input)
  const course = await singleRow(
    supabase.from('courses').select('id,tenant_id,created_by').eq('id', draft.courseId).single(),
    'course_lookup_failed'
  )

  if (id(course.tenant_id, 'tenant_id') !== membership.tenantId) {
    throw new LmsMutationError('Course does not belong to this school.', 'tenant_mismatch')
  }

  const studentMembership = await maybeSingleRow(
    supabase
      .from('tenant_memberships')
      .select('user_id')
      .eq('tenant_id', membership.tenantId)
      .eq('user_id', draft.studentId)
      .eq('role', 'student')
      .eq('status', 'active')
      .maybeSingle(),
    'student_membership_lookup_failed'
  )
  if (!studentMembership) {
    throw new LmsMutationError('Student is not an active member of this school.', 'student_membership_required')
  }

  const existingEnrollment = await maybeSingleRow(
    supabase
      .from('course_enrollments')
      .select('id')
      .eq('course_id', draft.courseId)
      .eq('student_id', draft.studentId)
      .maybeSingle(),
    'enrollment_lookup_failed'
  )
  const payload = {
    tenant_id: membership.tenantId,
    course_id: draft.courseId,
    student_id: draft.studentId,
    teacher_id: draft.teacherId || id(course.created_by, 'created_by'),
    status: 'active',
  }
  const enrollment = existingEnrollment
    ? await singleRow(
        supabase.from('course_enrollments').update(payload).eq('id', id(existingEnrollment.id, 'enrollment_id')).select('id').single(),
        'enrollment_update_failed'
      )
    : await singleRow(supabase.from('course_enrollments').insert(payload).select('id').single(), 'enrollment_insert_failed')

  if (bool(input.notifyStudent)) {
    await supabase.from('notifications').insert({
      tenant_id: membership.tenantId,
      user_id: draft.studentId,
      type: 'course_enrollment',
      title: 'Course enrollment updated',
      message: 'You have a new active course enrollment.',
      action_url: '/student',
      course_id: draft.courseId,
      read: false,
    })
  }
  await insertAuditLog(supabase, {
    tenantId: membership.tenantId,
    userId: user.id,
    action: existingEnrollment ? 'enrollment.updated' : 'enrollment.created',
    resourceType: 'course_enrollment',
    resourceId: id(enrollment.id, 'enrollment_id'),
    details: { course_id: draft.courseId, student_id: draft.studentId },
  })

  return { enrollmentId: id(enrollment.id, 'enrollment_id') }
}
