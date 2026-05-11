import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  LmsAttendanceStatus,
  LmsGradingPolicy,
  LmsMembershipRole,
  LmsRecords,
  LmsRubricCriterion,
  LmsRubricScore,
} from '@/lib/lms/types'
import { isMissingResourceSecurityTableError } from '@/lib/lms/resource-security'

type Row = Record<string, unknown>

interface SupabaseLmsRows {
  currentUserId: string
  tenant: Row
  profiles: Row[]
  memberships: Row[]
  parentLinks: Row[]
  courses: Row[]
  enrollments: Row[]
  assignments: Row[]
  submissions: Row[]
  grades: Row[]
  notifications: Row[]
  auditTrail: Row[]
  lessons: Row[]
  resources: Row[]
  resourceReviews: Row[]
  conversations: Row[]
  conversationMembers: Row[]
  messages: Row[]
  rubrics: Row[]
  attendance: Row[]
  calendarEvents: Row[]
}

function text(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value : fallback
}

function numberValue(value: unknown, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) return Number(value)

  return fallback
}

function booleanValue(value: unknown) {
  return value === true
}

function jsonRecord(value: unknown): Row {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value as Row
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Row) : {}
    } catch {
      return {}
    }
  }

  return {}
}

function jsonArray(value: unknown): Row[] {
  if (Array.isArray(value)) return value.filter((item): item is Row => Boolean(item && typeof item === 'object' && !Array.isArray(item)))
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed)
        ? parsed.filter((item): item is Row => Boolean(item && typeof item === 'object' && !Array.isArray(item)))
        : []
    } catch {
      return []
    }
  }

  return []
}

function membershipRole(value: unknown): LmsMembershipRole {
  if (value === 'student' || value === 'teacher' || value === 'parent' || value === 'admin' || value === 'super_admin') {
    return value
  }

  return 'student'
}

function gradingPolicy(value: unknown): LmsGradingPolicy {
  const record = jsonRecord(value)
  const categories = jsonArray(record.categories)
    .map((category) => ({
      name: text(category.name),
      weight: numberValue(category.weight),
    }))
    .filter((category) => category.name && category.weight > 0)

  return {
    categories: categories.length > 0 ? categories : [{ name: 'Coursework', weight: 100 }],
  }
}

function rubricCriteria(value: unknown): LmsRubricCriterion[] {
  return jsonArray(value)
    .map((criterion) => ({
      name: text(criterion.name),
      points: numberValue(criterion.points),
    }))
    .filter((criterion) => criterion.name && criterion.points > 0)
}

function rubricScores(value: unknown): LmsRubricScore[] {
  return jsonArray(value)
    .map((score) => ({
      name: text(score.name),
      points: numberValue(score.points),
    }))
    .filter((score) => score.name)
}

function attendanceStatus(value: unknown): LmsAttendanceStatus {
  if (value === 'present' || value === 'absent' || value === 'tardy' || value === 'excused' || value === 'online') {
    return value
  }

  return 'absent'
}

function actorForRole(rows: Row[], role: LmsMembershipRole | LmsMembershipRole[], fallback: string) {
  const roles = Array.isArray(role) ? role : [role]
  const row = rows.find((candidate) => roles.includes(membershipRole(candidate.role)) && candidate.status === 'active')

  return text(row?.user_id, fallback)
}

function actorForCurrentUserRole(
  rows: Row[],
  role: LmsMembershipRole | LmsMembershipRole[],
  currentUserId: string,
  fallback: string
) {
  const roles = Array.isArray(role) ? role : [role]
  const currentUserRow = rows.find(
    (candidate) =>
      text(candidate.user_id) === currentUserId &&
      roles.includes(membershipRole(candidate.role)) &&
      candidate.status === 'active'
  )

  return text(currentUserRow?.user_id) || fallback
}

export function mapSupabaseRowsToLmsRecords(rows: SupabaseLmsRows): LmsRecords {
  const fallbackUserId = rows.currentUserId
  const fallbackActors = {
    admin: actorForRole(rows.memberships, ['admin', 'super_admin'], fallbackUserId),
    teacher: actorForRole(rows.memberships, 'teacher', fallbackUserId),
    student: actorForRole(rows.memberships, 'student', fallbackUserId),
    guardian: actorForRole(rows.memberships, 'parent', fallbackUserId),
  }

  return {
    actorIds: {
      admin: actorForCurrentUserRole(rows.memberships, ['admin', 'super_admin'], rows.currentUserId, fallbackActors.admin),
      teacher: actorForCurrentUserRole(rows.memberships, 'teacher', rows.currentUserId, fallbackActors.teacher),
      student: actorForCurrentUserRole(rows.memberships, 'student', rows.currentUserId, fallbackActors.student),
      guardian: actorForCurrentUserRole(rows.memberships, 'parent', rows.currentUserId, fallbackActors.guardian),
    },
    tenant: {
      id: text(rows.tenant.id),
      name: text(rows.tenant.name, 'School'),
      slug: text(rows.tenant.slug, 'school'),
      status: text(rows.tenant.status, 'active'),
    },
    users: rows.profiles.map((profile) => ({
      id: text(profile.id),
      email: text(profile.email),
      firstName: text(profile.first_name, 'Unknown'),
      lastName: text(profile.last_name),
    })),
    memberships: rows.memberships.map((membership) => ({
      tenantId: text(membership.tenant_id),
      userId: text(membership.user_id),
      role: membershipRole(membership.role),
      status: text(membership.status, 'active'),
    })),
    parentLinks: rows.parentLinks.map((link) => ({
      tenantId: text(link.tenant_id),
      studentId: text(link.student_id),
      parentId: text(link.parent_id),
      relationship: text(link.relationship, 'guardian'),
      status: text(link.status, 'active'),
      primaryContact: booleanValue(link.is_primary_contact),
      consentGiven: booleanValue(link.consent_given),
      consentMethod: text(link.consent_method),
      consentNotes: text(link.consent_notes),
      custodyNotes: text(link.custody_notes),
    })),
    courses: rows.courses.map((course) => ({
      id: text(course.id),
      tenantId: text(course.tenant_id),
      title: text(course.name, 'Untitled course'),
      subject: text(course.subject),
      gradeLevel: text(course.grade_level),
      sectionLabel: text(course.section_label),
      termLabel: text(course.semester),
      createdBy: text(course.created_by),
      status: text(course.status, 'active'),
      gradingPolicy: gradingPolicy(course.grading_policy),
    })),
    enrollments: rows.enrollments.map((enrollment) => ({
      tenantId: text(enrollment.tenant_id),
      courseId: text(enrollment.course_id),
      studentId: text(enrollment.student_id),
      teacherId: text(enrollment.teacher_id),
      status: text(enrollment.status, 'active'),
    })),
    assignments: rows.assignments.map((assignment) => ({
      id: text(assignment.id),
      tenantId: text(assignment.tenant_id),
      courseId: text(assignment.course_id),
      title: text(assignment.title, 'Untitled assignment'),
      instructions: text(assignment.instructions),
      dueAt: text(assignment.due_date),
      maxPoints: numberValue(assignment.max_points),
      status: text(assignment.status, 'assigned'),
      category: text(assignment.category, 'Coursework'),
    })),
    submissions: rows.submissions.map((submission) => ({
      id: text(submission.id),
      tenantId: text(submission.tenant_id),
      assignmentId: text(submission.assignment_id),
      studentId: text(submission.student_id),
      content: text(submission.submission_text),
      filePath: text(submission.file_path),
      fileName: text(submission.file_name),
      submissionUrl: text(submission.submission_url),
      status: text(submission.status, 'submitted'),
      submittedAt: text(submission.submitted_at),
    })),
    grades: rows.grades.map((grade) => ({
      id: text(grade.id),
      tenantId: text(grade.tenant_id),
      assignmentId: text(grade.assignment_id),
      studentId: text(grade.student_id),
      courseId: text(grade.course_id),
      pointsEarned: numberValue(grade.points_earned),
      percentage: numberValue(grade.percentage),
      letterGrade: text(grade.letter_grade),
      feedback: text(grade.feedback),
      gradedAt: text(grade.graded_at),
      rubricScores: rubricScores(grade.rubric_scores),
    })),
    notifications: rows.notifications.map((notification) => ({
      id: text(notification.id),
      tenantId: text(notification.tenant_id),
      userId: text(notification.user_id),
      title: text(notification.title),
      message: text(notification.message),
      read: booleanValue(notification.read),
      createdAt: text(notification.created_at),
    })),
    auditTrail: rows.auditTrail.map((entry) => ({
      id: text(entry.id),
      tenantId: text(entry.tenant_id),
      action: text(entry.action),
      resourceType: text(entry.resource_type),
      createdAt: text(entry.created_at),
    })),
    lessons: rows.lessons.map((lesson) => ({
      id: text(lesson.id),
      tenantId: text(lesson.tenant_id),
      courseId: text(lesson.course_id),
      title: text(lesson.title, 'Untitled lesson'),
      status: text(lesson.status, 'published'),
    })),
    resources: rows.resources.map((resource) => {
      const review = rows.resourceReviews.find((candidate) => text(candidate.resource_id) === text(resource.id))

      return {
        id: text(resource.id),
        lessonId: text(resource.lesson_id),
        fileName: text(resource.file_name, 'resource'),
        fileType: text(resource.file_type),
        displayName: text(resource.display_name) || text(resource.file_name, 'Resource'),
        scanStatus: text(review?.scan_status, 'unreviewed'),
        scanProvider: text(review?.scan_provider),
        legalHold: booleanValue(review?.legal_hold),
        retentionExpiresAt: text(review?.retention_expires_at),
        quarantineReason: text(review?.quarantine_reason),
      }
    }),
    conversations: rows.conversations.map((conversation) => ({
      id: text(conversation.id),
      tenantId: text(conversation.tenant_id),
      subject: text(conversation.subject, 'Conversation'),
      courseId: text(conversation.course_id),
      createdBy: text(conversation.created_by),
      updatedAt: text(conversation.updated_at),
    })),
    conversationMembers: rows.conversationMembers.map((member) => ({
      conversationId: text(member.conversation_id),
      userId: text(member.user_id),
    })),
    messages: rows.messages.map((message) => ({
      id: text(message.id),
      tenantId: text(message.tenant_id),
      conversationId: text(message.conversation_id),
      senderId: text(message.sender_id),
      content: text(message.content),
      createdAt: text(message.created_at),
    })),
    rubrics: rows.rubrics.map((rubric) => ({
      id: text(rubric.id),
      tenantId: text(rubric.tenant_id),
      assignmentId: text(rubric.assignment_id),
      name: text(rubric.name, 'Rubric'),
      description: text(rubric.description),
      criteria: rubricCriteria(rubric.criteria),
      createdBy: text(rubric.created_by),
    })),
    attendance: rows.attendance.map((entry) => ({
      id: text(entry.id),
      tenantId: text(entry.tenant_id),
      courseId: text(entry.course_id),
      studentId: text(entry.student_id),
      attendanceDate: text(entry.attendance_date),
      status: attendanceStatus(entry.status),
      notes: text(entry.notes),
      markedBy: text(entry.marked_by),
    })),
    calendarEvents: rows.calendarEvents.map((event) => ({
      id: text(event.id),
      tenantId: text(event.tenant_id),
      courseId: text(event.course_id),
      title: text(event.title, 'Calendar event'),
      description: text(event.description),
      startsAt: text(event.starts_at),
      endsAt: text(event.ends_at),
      status: text(event.status, 'published'),
      createdBy: text(event.created_by),
    })),
  }
}

async function queryTable(supabase: SupabaseClient, table: string, select: string, tenantId: string) {
  const { data, error } = await supabase.from(table).select(select).eq('tenant_id', tenantId)

  if (error) {
    throw new Error(`Failed to load ${table}: ${error.message}`)
  }

  return (data ?? []) as unknown as Row[]
}

async function queryIn(supabase: SupabaseClient, table: string, select: string, column: string, values: string[]) {
  if (values.length === 0) return []

  const { data, error } = await supabase.from(table).select(select).in(column, values)

  if (error) {
    throw new Error(`Failed to load ${table}: ${error.message}`)
  }

  return (data ?? []) as unknown as Row[]
}

async function queryInOptional(supabase: SupabaseClient, table: string, select: string, column: string, values: string[]) {
  if (values.length === 0) return []

  const { data, error } = await supabase.from(table).select(select).in(column, values)

  if (error) {
    if (isMissingResourceSecurityTableError(error)) return []
    throw new Error(`Failed to load ${table}: ${error.message}`)
  }

  return (data ?? []) as unknown as Row[]
}

export async function loadLmsRecordsForUser(supabase: SupabaseClient, userId: string) {
  const { data: memberships, error: membershipError } = await supabase
    .from('tenant_memberships')
    .select('tenant_id,user_id,role,status')
    .eq('user_id', userId)
    .eq('status', 'active')

  if (membershipError) {
    throw new Error(`Failed to load memberships: ${membershipError.message}`)
  }

  const activeMembership = memberships?.[0] as Row | undefined
  const tenantId = text(activeMembership?.tenant_id)

  if (!tenantId) {
    throw new Error('Signed-in user is not assigned to an active school.')
  }

  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('id,name,slug,status')
    .eq('id', tenantId)
    .single()

  if (tenantError) {
    throw new Error(`Failed to load tenant: ${tenantError.message}`)
  }

  const [
    allMemberships,
    parentLinks,
    courses,
    enrollments,
    assignments,
    submissions,
    grades,
    notifications,
    auditTrail,
    lessons,
    conversations,
    messages,
    rubrics,
    attendance,
    calendarEvents,
  ] = await Promise.all([
    queryTable(supabase, 'tenant_memberships', 'tenant_id,user_id,role,status', tenantId),
    queryTable(
      supabase,
      'student_parents',
      'tenant_id,student_id,parent_id,relationship,status,is_primary_contact,consent_given,consent_method,consent_notes,custody_notes',
      tenantId
    ),
    queryTable(supabase, 'courses', 'id,tenant_id,name,subject,grade_level,section_label,semester,created_by,status,grading_policy', tenantId),
    queryTable(supabase, 'course_enrollments', 'tenant_id,course_id,student_id,teacher_id,status', tenantId),
    queryTable(supabase, 'assignments', 'id,tenant_id,course_id,title,instructions,due_date,max_points,status,category', tenantId),
    queryTable(
      supabase,
      'submissions',
      'id,tenant_id,assignment_id,student_id,submission_text,file_path,file_name,submission_url,status,submitted_at',
      tenantId
    ),
    queryTable(
      supabase,
      'grades',
      'id,tenant_id,assignment_id,student_id,course_id,points_earned,percentage,letter_grade,feedback,graded_at,rubric_scores',
      tenantId
    ),
    queryTable(supabase, 'notifications', 'id,tenant_id,user_id,title,message,read,created_at', tenantId),
    queryTable(supabase, 'audit_logs', 'id,tenant_id,action,resource_type,created_at', tenantId),
    queryTable(supabase, 'lessons', 'id,tenant_id,course_id,title,status', tenantId),
    queryTable(supabase, 'conversations', 'id,tenant_id,subject,course_id,created_by,updated_at', tenantId),
    queryTable(supabase, 'messages', 'id,tenant_id,conversation_id,sender_id,content,created_at', tenantId),
    queryTable(supabase, 'rubrics', 'id,tenant_id,assignment_id,name,description,criteria,created_by', tenantId),
    queryTable(supabase, 'attendance_records', 'id,tenant_id,course_id,student_id,attendance_date,status,notes,marked_by', tenantId),
    queryTable(
      supabase,
      'calendar_events',
      'id,tenant_id,course_id,title,description,starts_at,ends_at,status,created_by',
      tenantId
    ),
  ])
  const resources = await queryIn(
    supabase,
    'lesson_attachments',
    'id,lesson_id,file_name,file_type,display_name',
    'lesson_id',
    lessons.map((lesson) => text(lesson.id)).filter(Boolean)
  )
  const resourceReviews = await queryInOptional(
    supabase,
    'course_resource_security_reviews',
    'resource_id,scan_status,scan_provider,legal_hold,retention_expires_at,quarantine_reason',
    'resource_id',
    resources.map((resource) => text(resource.id)).filter(Boolean)
  )
  const conversationMembers = await queryIn(
    supabase,
    'conversation_members',
    'conversation_id,user_id',
    'conversation_id',
    conversations.map((conversation) => text(conversation.id)).filter(Boolean)
  )

  const userIds = new Set([
    ...allMemberships.map((membership) => text(membership.user_id)),
    ...parentLinks.flatMap((link) => [text(link.student_id), text(link.parent_id)]),
    ...enrollments.flatMap((enrollment) => [text(enrollment.student_id), text(enrollment.teacher_id)]),
    ...conversations.map((conversation) => text(conversation.created_by)),
    ...conversationMembers.map((member) => text(member.user_id)),
    ...messages.map((message) => text(message.sender_id)),
  ])
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id,first_name,last_name')
    .in('id', [...userIds].filter(Boolean))

  if (profileError) {
    throw new Error(`Failed to load profiles: ${profileError.message}`)
  }

  return mapSupabaseRowsToLmsRecords({
    currentUserId: userId,
    tenant: tenant as Row,
    profiles: (profiles ?? []) as Row[],
    memberships: allMemberships,
    parentLinks,
    courses,
    enrollments,
    assignments,
    submissions,
    grades,
    notifications,
    auditTrail,
    lessons,
    resources,
    resourceReviews,
    conversations,
    conversationMembers,
    messages,
    rubrics,
    attendance,
    calendarEvents,
  })
}
