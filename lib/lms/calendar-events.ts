import type { SupabaseClient } from '@supabase/supabase-js'
import { LmsMutationError } from '@/lib/lms/mutations'

type Row = Record<string, unknown>

function text(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
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

  return normalized.length > maxLength ? normalized.slice(0, maxLength) : normalized
}

function id(value: unknown, field: string) {
  const normalized = text(value)
  if (!normalized) {
    throw new LmsMutationError(`${field} is required`, `missing_${field}`)
  }

  return normalized
}

function rows(data: unknown) {
  return (data ?? []) as Row[]
}

function isoDateTime(value: unknown, field: string) {
  const raw = limitedText(value, field, 80)
  const timestamp = Date.parse(raw)
  if (!Number.isFinite(timestamp)) {
    throw new LmsMutationError(`${field} must be a real calendar date.`, `invalid_${field}`)
  }

  return new Date(timestamp).toISOString()
}

function optionalIsoDateTime(value: unknown, field: string) {
  if (!text(value)) return ''

  return isoDateTime(value, field)
}

export function normalizeCalendarEventDraft(input: {
  courseId?: unknown
  title: unknown
  description?: unknown
  startsAt: unknown
  endsAt?: unknown
}) {
  const startsAt = isoDateTime(input.startsAt, 'starts_at')
  const endsAt = optionalIsoDateTime(input.endsAt, 'ends_at')

  if (endsAt && Date.parse(endsAt) < Date.parse(startsAt)) {
    throw new LmsMutationError('ends_at must be after starts_at.', 'calendar_event_end_before_start')
  }

  return {
    courseId: text(input.courseId),
    title: limitedText(input.title, 'title', 255),
    description: optionalLimitedText(input.description, 2000),
    startsAt,
    endsAt,
  }
}

async function requireCalendarStaff(supabase: SupabaseClient) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new LmsMutationError('Authentication is required.', 'auth_required')
  }

  const { data: memberships, error: membershipError } = await supabase
    .from('tenant_memberships')
    .select('tenant_id,user_id,role,status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .in('role', ['admin', 'super_admin', 'teacher'])

  if (membershipError) {
    throw new LmsMutationError(`Unable to verify school staff membership: ${membershipError.message}`, 'membership_lookup_failed')
  }

  const membership = rows(memberships)[0]
  if (!membership) {
    throw new LmsMutationError('Only school staff can create calendar events.', 'staff_role_required')
  }

  return {
    userId: user.id,
    tenantId: id(membership.tenant_id, 'tenant_id'),
    role: text(membership.role),
  }
}

async function requireCalendarCourseAccess(
  supabase: SupabaseClient,
  input: { tenantId: string; userId: string; role: string; courseId: string }
) {
  const { data: courses, error: courseError } = await supabase
    .from('courses')
    .select('id,tenant_id')
    .eq('tenant_id', input.tenantId)
    .eq('id', input.courseId)
    .limit(1)

  if (courseError) {
    throw new LmsMutationError(`Unable to verify calendar course: ${courseError.message}`, 'course_lookup_failed')
  }
  if (rows(courses).length === 0) {
    throw new LmsMutationError('Course is not active in this school.', 'course_required')
  }

  if (input.role === 'admin' || input.role === 'super_admin') return

  const { data: enrollments, error: enrollmentError } = await supabase
    .from('course_enrollments')
    .select('tenant_id,course_id,teacher_id,status')
    .eq('tenant_id', input.tenantId)
    .eq('course_id', input.courseId)
    .eq('teacher_id', input.userId)
    .eq('status', 'active')
    .limit(1)

  if (enrollmentError) {
    throw new LmsMutationError(`Unable to verify teacher course assignment: ${enrollmentError.message}`, 'teacher_course_lookup_failed')
  }
  if (rows(enrollments).length === 0) {
    throw new LmsMutationError('Teacher is not assigned to this course.', 'teacher_course_required')
  }
}

export async function createCalendarEvent(
  supabase: SupabaseClient,
  input: { courseId?: unknown; title: unknown; description?: unknown; startsAt: unknown; endsAt?: unknown }
) {
  const staff = await requireCalendarStaff(supabase)
  const draft = normalizeCalendarEventDraft(input)

  if (!draft.courseId && staff.role === 'teacher') {
    throw new LmsMutationError('Teachers must attach calendar events to one of their courses.', 'calendar_course_required')
  }

  if (draft.courseId) {
    await requireCalendarCourseAccess(supabase, {
      tenantId: staff.tenantId,
      userId: staff.userId,
      role: staff.role,
      courseId: draft.courseId,
    })
  }

  const { data: event, error: eventError } = await supabase
    .from('calendar_events')
    .insert({
      tenant_id: staff.tenantId,
      course_id: draft.courseId || null,
      title: draft.title,
      description: draft.description || null,
      starts_at: draft.startsAt,
      ends_at: draft.endsAt || null,
      audience: draft.courseId ? 'course' : 'school',
      status: 'published',
      created_by: staff.userId,
    })
    .select('id')
    .single()

  if (eventError) {
    throw new LmsMutationError(`Unable to create calendar event: ${eventError.message}`, 'calendar_event_create_failed')
  }

  const eventId = id((event as Row | null)?.id, 'calendar_event_id')

  await supabase.from('audit_logs').insert({
    tenant_id: staff.tenantId,
    user_id: staff.userId,
    action: 'calendar_event.created',
    resource_type: 'calendar_event',
    resource_id: eventId,
    details: {
      course_id: draft.courseId,
      starts_at: draft.startsAt,
      ends_at: draft.endsAt,
    },
  })

  return { eventId }
}
