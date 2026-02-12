// Wolf Whale LMS - Database Types
// Phase C: TypeScript types matching the blueprint schema
// Auto-derived from supabase/migrations/20260209_blueprint_schema.sql
//
// Convention:
//   - All `id` fields are UUID strings.
//   - Timestamps are ISO-8601 strings (Supabase returns them as text over REST).
//   - JSONB columns use explicit sub-types where structure is known;
//     otherwise Record<string, unknown>.
//   - Nullable DB columns are typed as `T | null`.

// =====================================================================
// Enums (mirroring CHECK constraints)
// =====================================================================

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | 'super_admin'
export type MembershipStatus = 'active' | 'invited' | 'suspended' | 'pending_parent_consent'
export type ParentRelationship = 'mother' | 'father' | 'guardian' | 'grandparent' | 'other'

export type CourseStatus = 'active' | 'archived' | 'draft'
export type EnrollmentStatus = 'active' | 'dropped' | 'completed' | 'withdrawn'

export type LessonStatus = 'draft' | 'published' | 'archived'
export type LessonProgressStatus = 'not_started' | 'in_progress' | 'completed'

export type AssignmentType = 'homework' | 'quiz' | 'project' | 'exam' | 'discussion' | 'presentation' | 'other'
export type AssignmentStatus = 'draft' | 'assigned' | 'closed' | 'archived'
export type SubmissionType = 'text' | 'file' | 'link' | 'discussion' | 'multi'
export type SubmissionStatus = 'draft' | 'submitted' | 'graded' | 'returned'
export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'F' | 'I' | 'P' | 'NP'

export type AttendanceStatus = 'present' | 'absent' | 'tardy' | 'excused' | 'online'

export type ConversationType = 'direct' | 'group' | 'class_discussion'
export type ConversationMemberRole = 'member' | string  // extensible

export type AnnouncementStatus = 'draft' | 'published' | 'archived'

export type AuditSeverity = 'info' | 'warning' | 'critical'

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'

export type TenantStatus = 'active' | 'suspended' | 'cancelled'
export type SubscriptionPlan = 'starter' | 'growth' | 'enterprise' | 'free'

export type AchievementCategory = 'academic' | 'consistency' | 'participation' | 'challenge' | 'social' | 'wellness'
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum'
export type GamificationTier = 'awakening' | 'growth' | 'advancement' | 'mastery'
export type LeaderboardScope = 'class' | 'grade' | 'school'
export type LeaderboardPeriod = 'weekly' | 'monthly' | 'all_time'

// =====================================================================
// JSONB sub-types
// =====================================================================

export interface GradingCategory {
  name: string
  weight: number
}

export interface GradingPolicy {
  categories: GradingCategory[]
}

export interface CourseSettings {
  gamification_enabled: boolean
  xp_multiplier: number
}

export interface TenantBranding {
  primary_color: string
  secondary_color: string
  logo_url?: string | null
}

export interface RubricCriterion {
  name: string
  description?: string
  max_points: number
  levels?: Array<{
    label: string
    points: number
    description?: string
  }>
}

export interface MessageAttachment {
  file_path: string
  file_name: string
  file_type?: string
  file_size?: number
}

// =====================================================================
// 1. Tenant
// =====================================================================

export interface Tenant {
  id: string
  slug: string
  name: string
  description: string | null
  logo_url: string | null
  website_url: string | null
  address: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country: string
  phone: string | null
  subscription_plan: SubscriptionPlan
  status: TenantStatus
  settings: Record<string, unknown>
  branding: TenantBranding
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// =====================================================================
// 2. Profile
// =====================================================================

export interface Profile {
  id: string                      // references auth.users(id)
  first_name: string | null
  last_name: string | null
  full_name: string | null        // stored generated column
  avatar_url: string | null
  phone: string | null
  date_of_birth: string | null    // DATE as ISO string
  bio: string | null
  timezone: string
  language: string
  grade_level: string | null
  preferences: Record<string, unknown>
  created_at: string
  updated_at: string
}

// =====================================================================
// 3. Tenant Membership
// =====================================================================

export interface TenantMembership {
  id: string
  tenant_id: string
  user_id: string
  role: UserRole
  status: MembershipStatus
  joined_at: string
  invited_at: string | null
  invited_by: string | null
  suspended_at: string | null
  suspended_reason: string | null
  consent_coppa_at: string | null
  consent_ferpa_at: string | null
}

// =====================================================================
// 4. Student-Parent
// =====================================================================

export interface StudentParent {
  id: string
  tenant_id: string
  student_id: string
  parent_id: string
  relationship: ParentRelationship | null
  is_primary_contact: boolean
  status: string
  created_at: string
}

// =====================================================================
// 5. Course
// =====================================================================

export interface Course {
  id: string
  tenant_id: string
  name: string
  description: string | null
  subject: string | null
  grade_level: string | null
  created_by: string
  semester: string | null
  start_date: string | null       // DATE
  end_date: string | null         // DATE
  syllabus_url: string | null
  credits: number | null
  max_students: number | null
  status: CourseStatus
  grading_policy: GradingPolicy
  settings: CourseSettings
  created_at: string
  updated_at: string
  archived_at: string | null
}

// =====================================================================
// 6. Class Code
// =====================================================================

export interface ClassCode {
  id: string
  tenant_id: string
  course_id: string
  code: string
  is_active: boolean
  expires_at: string | null
  max_uses: number | null
  use_count: number
  created_by: string
  created_at: string
}

// =====================================================================
// 7. Course Enrollment
// =====================================================================

export interface CourseEnrollment {
  id: string
  tenant_id: string
  course_id: string
  student_id: string
  teacher_id: string | null
  status: EnrollmentStatus
  grade_letter: string | null
  grade_numeric: number | null
  enrolled_at: string
  completed_at: string | null
}

// =====================================================================
// 8. Lesson
// =====================================================================

export interface Lesson {
  id: string
  tenant_id: string
  course_id: string
  title: string
  description: string | null
  content: unknown[]              // JSONB blocks (rich content)
  order_index: number
  duration_minutes: number | null
  learning_objectives: string[] | null
  created_by: string
  status: LessonStatus
  published_at: string | null
  scheduled_publish_at: string | null
  created_at: string
  updated_at: string
}

// =====================================================================
// 9. Lesson Attachment
// =====================================================================

export interface LessonAttachment {
  id: string
  lesson_id: string
  file_path: string
  file_name: string
  file_type: string | null
  file_size: number | null
  display_name: string | null
  order_index: number
  created_at: string
}

// =====================================================================
// 10. Lesson Progress
// =====================================================================

export interface LessonProgress {
  id: string
  tenant_id: string
  lesson_id: string
  user_id: string
  status: LessonProgressStatus
  progress_percentage: number
  time_spent_seconds: number
  started_at: string | null
  completed_at: string | null
  last_accessed_at: string
}

// =====================================================================
// 11. Assignment
// =====================================================================

export interface Assignment {
  id: string
  tenant_id: string
  course_id: string
  title: string
  description: string | null
  instructions: string | null
  type: AssignmentType
  category: string | null
  created_by: string
  due_date: string
  available_date: string | null
  max_points: number
  submission_type: SubmissionType
  allow_late_submission: boolean
  late_penalty_per_day: number
  late_submission_days: number
  max_attempts: number
  status: AssignmentStatus
  created_at: string
  updated_at: string
}

// =====================================================================
// 12. Rubric
// =====================================================================

export interface Rubric {
  id: string
  tenant_id: string
  assignment_id: string | null
  name: string
  description: string | null
  criteria: RubricCriterion[]
  is_template: boolean
  created_by: string
  created_at: string
}

// =====================================================================
// 13. Submission
// =====================================================================

export interface Submission {
  id: string
  tenant_id: string
  assignment_id: string
  student_id: string
  submission_text: string | null
  file_path: string | null
  file_name: string | null
  submission_url: string | null
  attempt_number: number
  status: SubmissionStatus
  submitted_at: string
  submitted_late: boolean
  graded_at: string | null
  graded_by: string | null
  updated_at: string
}

// =====================================================================
// 14. Grade
// =====================================================================

export interface Grade {
  id: string
  tenant_id: string
  submission_id: string | null
  assignment_id: string
  student_id: string
  course_id: string
  points_earned: number | null
  percentage: number | null
  letter_grade: LetterGrade | null
  feedback: string | null
  rubric_scores: Record<string, unknown> | null
  is_excused: boolean
  is_extra_credit: boolean
  graded_by: string
  graded_at: string
  updated_at: string
}

// =====================================================================
// 15. Attendance Record
// =====================================================================

export interface AttendanceRecord {
  id: string
  tenant_id: string
  course_id: string
  student_id: string
  attendance_date: string         // DATE
  status: AttendanceStatus
  notes: string | null
  excuse_document_url: string | null
  marked_by: string | null
  created_at: string
  updated_at: string
}

// =====================================================================
// 16. Conversation
// =====================================================================

export interface Conversation {
  id: string
  tenant_id: string
  type: ConversationType
  subject: string | null
  created_by: string
  course_id: string | null
  is_locked: boolean
  created_at: string
  updated_at: string
}

// =====================================================================
// 17. Conversation Member
// =====================================================================

export interface ConversationMember {
  id: string
  conversation_id: string
  user_id: string
  role: ConversationMemberRole
  joined_at: string
  last_read_at: string | null
}

// =====================================================================
// 18. Message
// =====================================================================

export interface Message {
  id: string
  tenant_id: string
  conversation_id: string
  sender_id: string
  content: string
  attachments: MessageAttachment[]
  edited_at: string | null
  deleted_at: string | null
  created_at: string
}

// =====================================================================
// 19. Message Read Receipt
// =====================================================================

export interface MessageReadReceipt {
  id: string
  message_id: string
  user_id: string
  read_at: string
}

// =====================================================================
// 20. Notification
// =====================================================================

export interface Notification {
  id: string
  tenant_id: string
  user_id: string
  type: string
  title: string
  message: string | null
  action_url: string | null
  course_id: string | null
  assignment_id: string | null
  message_id: string | null
  read: boolean
  read_at: string | null
  created_at: string
}

// =====================================================================
// 21. Notification Preference
// =====================================================================

export interface NotificationPreference {
  id: string
  user_id: string
  tenant_id: string
  notification_type: string
  in_app: boolean
  email: boolean
  sms: boolean
  quiet_hours_start: string | null   // TIME as "HH:MM:SS"
  quiet_hours_end: string | null     // TIME as "HH:MM:SS"
}

// =====================================================================
// 22. Announcement
// =====================================================================

export interface Announcement {
  id: string
  tenant_id: string
  course_id: string | null
  title: string
  content: string
  created_by: string
  is_pinned: boolean
  notify_parents: boolean
  published_at: string
  expires_at: string | null
  status: AnnouncementStatus
  created_at: string
}

// =====================================================================
// 23. Audit Log
// =====================================================================

export interface AuditLog {
  id: string
  tenant_id: string
  user_id: string | null
  action: string
  resource_type: string | null
  resource_id: string | null
  target_user_id: string | null
  details: Record<string, unknown>
  ip_address: string | null
  user_agent: string | null
  severity: AuditSeverity
  created_at: string
}

// =====================================================================
// 24. Invoice
// =====================================================================

export interface Invoice {
  id: string
  tenant_id: string
  amount: number
  amount_paid: number
  status: InvoiceStatus
  due_date: string | null           // DATE
  paid_at: string | null
  created_at: string
}

// =====================================================================
// 25. Subscription Usage
// =====================================================================

export interface SubscriptionUsage {
  id: string
  tenant_id: string
  billing_period_start: string      // DATE
  billing_period_end: string        // DATE
  active_students: number
  active_teachers: number
  total_users: number
  storage_used_gb: number
  api_calls: number
  recorded_at: string
}

// =====================================================================
// 26. Study Session
// =====================================================================

export interface StudySession {
  id: string
  tenant_id: string
  user_id: string
  duration_minutes: number
  actual_minutes: number | null
  music_type: string | null
  assignment_id: string | null
  completed: boolean
  xp_awarded: number
  started_at: string
  ended_at: string | null
}

// =====================================================================
// GAMIFICATION
// =====================================================================

// 27. XP Event
export interface XpEvent {
  id: string
  tenant_id: string
  user_id: string
  event_type: string
  xp_amount: number
  source_type: string | null
  source_id: string | null
  course_id: string | null
  metadata: Record<string, unknown>
  created_at: string
}

// 28. User Level
export interface UserLevel {
  id: string
  tenant_id: string
  user_id: string
  current_level: number
  total_xp: number
  current_tier: GamificationTier
  coins: number
  streak_days: number
  longest_streak: number
  last_active_date: string | null   // DATE
  xp_decayed: number
  updated_at: string
}

// 29. Achievement
export interface Achievement {
  id: string
  tenant_id: string | null
  name: string
  description: string | null
  icon: string | null
  category: AchievementCategory
  tier: AchievementTier
  criteria: Record<string, unknown>
  xp_reward: number
  coin_reward: number
  is_global: boolean
  created_by: string | null
  created_at: string
}

// 30. User Achievement
export interface UserAchievement {
  id: string
  tenant_id: string
  user_id: string
  achievement_id: string
  earned_at: string
  notified: boolean
}

// 31. Leaderboard Entry
export interface LeaderboardEntry {
  id: string
  tenant_id: string
  user_id: string
  scope: LeaderboardScope
  scope_id: string | null
  period: LeaderboardPeriod
  period_start: string              // DATE
  xp_total: number
  rank: number | null
  updated_at: string
}

// =====================================================================
// Utility: Row type for Supabase .from() generics
// =====================================================================

/** Map of table names to their row types. Useful with Supabase generic helpers. */
export interface DatabaseTableMap {
  tenants: Tenant
  profiles: Profile
  tenant_memberships: TenantMembership
  student_parents: StudentParent
  courses: Course
  class_codes: ClassCode
  course_enrollments: CourseEnrollment
  lessons: Lesson
  lesson_attachments: LessonAttachment
  lesson_progress: LessonProgress
  assignments: Assignment
  rubrics: Rubric
  submissions: Submission
  grades: Grade
  attendance_records: AttendanceRecord
  conversations: Conversation
  conversation_members: ConversationMember
  messages: Message
  message_read_receipts: MessageReadReceipt
  notifications: Notification
  notification_preferences: NotificationPreference
  announcements: Announcement
  audit_logs: AuditLog
  invoices: Invoice
  subscription_usage: SubscriptionUsage
  study_sessions: StudySession
  xp_events: XpEvent
  user_levels: UserLevel
  achievements: Achievement
  user_achievements: UserAchievement
  leaderboard_entries: LeaderboardEntry
}

export type TableName = keyof DatabaseTableMap
