import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export interface UserDataExport {
  exportedAt: string
  userId: string
  tenantId: string | null
  profile: Record<string, unknown> | null
  grades: Record<string, unknown>[]
  submissions: Record<string, unknown>[]
  attendance: Record<string, unknown>[]
  messagesSent: Record<string, unknown>[]
  messagesReceived: Record<string, unknown>[]
  notifications: Record<string, unknown>[]
  enrollments: Record<string, unknown>[]
  consentRecords: Record<string, unknown>[]
  auditLogs: Record<string, unknown>[]
  quizAttempts: Record<string, unknown>[]
  lessonProgress: Record<string, unknown>[]
  skillTreeProgress: Record<string, unknown>[]
  achievements: Record<string, unknown>[]
  gamificationData: Record<string, unknown>[]
}

/**
 * Collects all data associated with a user for GDPR/PIPEDA data portability.
 * Returns a structured JSON object containing every record tied to the user.
 */
export async function exportUserData(
  userId: string,
  tenantId?: string
): Promise<UserDataExport> {
  const supabase = await createClient()

  // Resolve tenant from headers if not passed explicitly
  let resolvedTenantId = tenantId ?? null
  if (!resolvedTenantId) {
    const headersList = await headers()
    resolvedTenantId = headersList.get('x-tenant-id')
  }

  // Run all queries in parallel for efficiency
  const [
    profileResult,
    gradesResult,
    submissionsResult,
    attendanceResult,
    messagesSentResult,
    messagesReceivedResult,
    notificationsResult,
    enrollmentsResult,
    consentRecordsResult,
    auditLogsResult,
    quizAttemptsResult,
    lessonProgressResult,
    skillTreeProgressResult,
    achievementsResult,
    xpDataResult,
  ] = await Promise.all([
    // Profile
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single(),

    // Grades
    supabase
      .from('grades')
      .select('*')
      .eq('student_id', userId)
      .order('created_at', { ascending: false }),

    // Submissions
    supabase
      .from('submissions')
      .select('*')
      .eq('student_id', userId)
      .order('created_at', { ascending: false }),

    // Attendance
    supabase
      .from('attendance_records')
      .select('*')
      .eq('student_id', userId)
      .order('attendance_date', { ascending: false }),

    // Messages sent by this user
    supabase
      .from('messages')
      .select('*')
      .eq('sender_id', userId)
      .order('created_at', { ascending: false }),

    // Messages received by this user (via conversation membership)
    supabase
      .from('conversation_members')
      .select('conversation_id, conversations(id, subject, type, created_at)')
      .eq('user_id', userId),

    // Notifications
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),

    // Enrollments
    supabase
      .from('course_enrollments')
      .select('*')
      .eq('student_id', userId)
      .order('created_at', { ascending: false }),

    // Consent records (COPPA/PIPEDA)
    supabase
      .from('consent_records')
      .select('*')
      .eq('student_id', userId),

    // Audit logs (user's own activity trail)
    supabase
      .from('audit_logs')
      .select('action, resource_type, resource_id, details, created_at, ip_address')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(500),

    // Quiz attempts (with answers)
    supabase
      .from('quiz_attempts')
      .select('*')
      .eq('student_id', userId)
      .order('started_at', { ascending: false }),

    // Lesson progress
    supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_accessed_at', { ascending: false }),

    // Skill tree progress
    supabase
      .from('student_skill_progress')
      .select('*')
      .eq('student_id', userId)
      .order('updated_at', { ascending: false }),

    // Achievements
    supabase
      .from('student_achievements')
      .select('*')
      .eq('student_id', userId)
      .order('unlocked_at', { ascending: false }),

    // Gamification data (XP, coins, pets, transactions)
    supabase
      .from('student_xp')
      .select('*')
      .eq('student_id', userId)
      .single(),
  ])

  return {
    exportedAt: new Date().toISOString(),
    userId,
    tenantId: resolvedTenantId,
    profile: profileResult.data ?? null,
    grades: gradesResult.data ?? [],
    submissions: submissionsResult.data ?? [],
    attendance: attendanceResult.data ?? [],
    messagesSent: messagesSentResult.data ?? [],
    messagesReceived: (messagesReceivedResult.data ?? []) as Record<string, unknown>[],
    notifications: notificationsResult.data ?? [],
    enrollments: enrollmentsResult.data ?? [],
    consentRecords: (consentRecordsResult.data ?? []) as Record<string, unknown>[],
    auditLogs: (auditLogsResult.data ?? []) as Record<string, unknown>[],
    quizAttempts: quizAttemptsResult.data ?? [],
    lessonProgress: lessonProgressResult.data ?? [],
    skillTreeProgress: skillTreeProgressResult.data ?? [],
    achievements: achievementsResult.data ?? [],
    gamificationData: xpDataResult.data ? [xpDataResult.data] : [],
  }
}

/**
 * Convert audit log records to a CSV string for download.
 */
export function auditLogsToCsv(
  logs: Array<{
    created_at: string
    user_id: string
    action: string
    resource_type?: string | null
    resource_id?: string | null
    ip_address?: string | null
    details?: Record<string, unknown> | null
    profiles?: { full_name?: string | null } | null
  }>
): string {
  const header = 'Timestamp,User,Action,Resource Type,Resource ID,IP Address,Details'
  const rows = logs.map((log) => {
    const timestamp = new Date(log.created_at).toISOString()
    const user = (log.profiles?.full_name ?? log.user_id).replace(/,/g, ' ')
    const action = log.action
    const resourceType = log.resource_type ?? ''
    const resourceId = log.resource_id ?? ''
    const ip = log.ip_address ?? ''
    const details = log.details ? JSON.stringify(log.details).replace(/,/g, ';') : ''
    return `${timestamp},${user},${action},${resourceType},${resourceId},${ip},"${details}"`
  })
  return [header, ...rows].join('\n')
}
