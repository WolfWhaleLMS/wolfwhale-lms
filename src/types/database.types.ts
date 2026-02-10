/* Type definitions for Wolf Whale LMS Database */

/**
 * User roles as defined in tenant_memberships table constraint.
 * Maps: student, teacher, parent, admin, super_admin
 */
export type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | 'super_admin';

export type TenantMembershipStatus = 'active' | 'invited' | 'suspended' | 'pending_parent_consent';
export type TenantStatus = 'active' | 'suspended' | 'cancelled';
export type SubscriptionPlan = 'starter' | 'growth' | 'enterprise' | 'free';

// Legacy aliases for backward compat
export type GradeLevel = 'K' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
export type SubscriptionTier = 'starter' | 'growth' | 'enterprise' | 'free';
export type SubscriptionStatus = 'active' | 'suspended' | 'cancelled';
export type AssignmentType = 'homework' | 'quiz' | 'project' | 'exam' | 'discussion';
export type SubmissionStatus = 'submitted' | 'graded' | 'returned';
export type AttendanceStatus = 'present' | 'absent' | 'tardy' | 'excused' | 'online';
export type PetSpecies = 'silver_wolf' | 'timber_wolf' | 'shadow_wolf' | 'lunar_wolf' | 'blue_whale' | 'beluga' | 'humpback' | 'orca' | 'wolphin' | 'whale_wolf' | 'aurora_guardian';
export type PetStage = 'hatchling' | 'juvenile' | 'adolescent' | 'majestic';
export type ContentBlockType = 'rich_text' | 'video' | 'image' | 'file' | 'quiz' | 'discussion' | 'external_link' | 'code_block';

/* Table Interfaces - matches the actual Supabase schema */

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  phone: string | null;
  subscription_plan: SubscriptionPlan;
  stripe_customer_id: string | null;
  status: TenantStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * Profile table - references auth.users(id) as its primary key.
 * Does NOT have a separate auth_id column; the `id` IS the auth user id.
 */
export interface Profile {
  id: string; // same as auth.users.id
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  bio: string | null;
  timezone: string | null;
  language: string;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/** @deprecated Use Profile instead */
export type UserProfile = Profile;

/**
 * Tenant membership - links a user to a tenant (school) with a role.
 * This is where the user's role is stored, not on the profile.
 */
export interface TenantMembership {
  id: string;
  tenant_id: string;
  user_id: string;
  role: UserRole;
  status: TenantMembershipStatus;
  joined_at: string;
  invited_at: string | null;
  invited_by: string | null;
  suspended_at: string | null;
  suspended_reason: string | null;
}

export interface StudentParent {
  id: string;
  tenant_id: string;
  student_id: string;
  parent_id: string;
  relationship: string | null;
  status: string;
  created_at: string;
}

export interface Course {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  subject: string | null;
  grade_level: string | null;
  created_by: string;
  semester: string | null;
  start_date: string | null;
  end_date: string | null;
  syllabus_url: string | null;
  credits: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface CourseEnrollment {
  id: string;
  tenant_id: string;
  course_id: string;
  student_id: string;
  teacher_id: string;
  status: string;
  grade_letter: string | null;
  grade_numeric: number | null;
  enrolled_at: string;
  completed_at: string | null;
}

export interface Lesson {
  id: string;
  tenant_id: string;
  course_id: string;
  title: string;
  description: string | null;
  content: string | null;
  order_index: number;
  created_by: string;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LessonAttachment {
  id: string;
  lesson_id: string;
  file_path: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  display_name: string | null;
  order_index: number | null;
  created_at: string;
}

export interface Assignment {
  id: string;
  tenant_id: string;
  course_id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  type: AssignmentType | null;
  created_by: string;
  due_date: string;
  available_date: string | null;
  max_points: number;
  submission_type: string | null;
  allow_late_submission: boolean;
  late_submission_days: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Rubric {
  id: string;
  tenant_id: string;
  assignment_id: string | null;
  name: string;
  description: string | null;
  criteria: Record<string, any>;
  created_by: string;
  created_at: string;
}

export interface Submission {
  id: string;
  tenant_id: string;
  assignment_id: string;
  student_id: string;
  submission_text: string | null;
  file_path: string | null;
  submission_url: string | null;
  status: SubmissionStatus;
  submitted_at: string;
  submitted_late: boolean;
  graded_at: string | null;
  graded_by: string | null;
  updated_at: string;
}

export interface Grade {
  id: string;
  tenant_id: string;
  submission_id: string | null;
  assignment_id: string;
  student_id: string;
  course_id: string;
  points_earned: number | null;
  percentage: number | null;
  letter_grade: string | null;
  feedback: string | null;
  graded_by: string;
  graded_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string;
  tenant_id: string;
  course_id: string;
  student_id: string;
  attendance_date: string;
  status: AttendanceStatus | null;
  notes: string | null;
  marked_by: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  tenant_id: string;
  type: string | null;
  subject: string | null;
  created_by: string;
  course_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
}

export interface Message {
  id: string;
  tenant_id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  attachments: Record<string, any> | null;
  edited_at: string | null;
  deleted_at: string | null;
  created_at: string;
}

export interface MessageReadReceipt {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
}

export interface Notification {
  id: string;
  tenant_id: string;
  user_id: string;
  type: string | null;
  title: string;
  message: string | null;
  action_url: string | null;
  course_id: string | null;
  assignment_id: string | null;
  message_id: string | null;
  read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface Announcement {
  id: string;
  tenant_id: string;
  course_id: string | null;
  title: string;
  content: string;
  created_by: string;
  published_at: string;
  expires_at: string | null;
  status: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  tenant_id: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  target_user_id: string | null;
  details: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  tenant_id: string;
  stripe_invoice_id: string | null;
  stripe_payment_intent_id: string | null;
  amount: number;
  amount_paid: number;
  status: string | null;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface SubscriptionUsage {
  id: string;
  tenant_id: string;
  billing_period_start: string;
  billing_period_end: string;
  active_students: number | null;
  active_teachers: number | null;
  total_users: number | null;
  storage_used_gb: number | null;
  api_calls: number | null;
  recorded_at: string;
}

/* Database Type Definition for Supabase Client */

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: Tenant;
        Insert: Partial<Tenant> & Pick<Tenant, 'name' | 'slug'>;
        Update: Partial<Tenant>;
      };
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & Pick<Profile, 'id'>;
        Update: Partial<Profile>;
      };
      tenant_memberships: {
        Row: TenantMembership;
        Insert: Partial<TenantMembership> & Pick<TenantMembership, 'tenant_id' | 'user_id' | 'role'>;
        Update: Partial<TenantMembership>;
      };
      student_parents: {
        Row: StudentParent;
        Insert: Omit<StudentParent, 'id' | 'created_at'>;
        Update: Partial<StudentParent>;
      };
      courses: {
        Row: Course;
        Insert: Omit<Course, 'id' | 'created_at'>;
        Update: Partial<Course>;
      };
      course_enrollments: {
        Row: CourseEnrollment;
        Insert: Omit<CourseEnrollment, 'id'>;
        Update: Partial<CourseEnrollment>;
      };
      lessons: {
        Row: Lesson;
        Insert: Omit<Lesson, 'id' | 'created_at'>;
        Update: Partial<Lesson>;
      };
      lesson_attachments: {
        Row: LessonAttachment;
        Insert: Omit<LessonAttachment, 'id' | 'created_at'>;
        Update: Partial<LessonAttachment>;
      };
      assignments: {
        Row: Assignment;
        Insert: Omit<Assignment, 'id' | 'created_at'>;
        Update: Partial<Assignment>;
      };
      rubrics: {
        Row: Rubric;
        Insert: Omit<Rubric, 'id' | 'created_at'>;
        Update: Partial<Rubric>;
      };
      submissions: {
        Row: Submission;
        Insert: Omit<Submission, 'id'>;
        Update: Partial<Submission>;
      };
      grades: {
        Row: Grade;
        Insert: Omit<Grade, 'id'>;
        Update: Partial<Grade>;
      };
      attendance_records: {
        Row: AttendanceRecord;
        Insert: Omit<AttendanceRecord, 'id' | 'created_at'>;
        Update: Partial<AttendanceRecord>;
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Conversation>;
      };
      conversation_members: {
        Row: ConversationMember;
        Insert: Omit<ConversationMember, 'id'>;
        Update: Partial<ConversationMember>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'>;
        Update: Partial<Message>;
      };
      message_read_receipts: {
        Row: MessageReadReceipt;
        Insert: Omit<MessageReadReceipt, 'id'>;
        Update: Partial<MessageReadReceipt>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'>;
        Update: Partial<Notification>;
      };
      announcements: {
        Row: Announcement;
        Insert: Omit<Announcement, 'id' | 'created_at'>;
        Update: Partial<Announcement>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at'>;
        Update: Partial<AuditLog>;
      };
      invoices: {
        Row: Invoice;
        Insert: Omit<Invoice, 'id' | 'created_at'>;
        Update: Partial<Invoice>;
      };
      subscription_usage: {
        Row: SubscriptionUsage;
        Insert: Omit<SubscriptionUsage, 'id'>;
        Update: Partial<SubscriptionUsage>;
      };
    };
    Views: {
      course_student_count: {
        Row: {
          course_id: string;
          name: string;
          student_count: number;
          active_students: number;
        };
      };
      student_course_progress: {
        Row: {
          student_id: string;
          course_id: string;
          total_assignments: number;
          graded_assignments: number;
          completion_percentage: number | null;
          average_grade: number | null;
        };
      };
    };
    Functions: {
      get_user_courses: {
        Args: { p_user_id: string };
        Returns: { course_id: string; course_name: string; role: string }[];
      };
    };
    Enums: {
      user_role: UserRole;
    };
  };
}
