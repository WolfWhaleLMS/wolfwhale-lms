-- Wolf Whale LMS - Complete Blueprint Schema
-- Multi-tenant K-12 LMS with gamification, compliance, messaging
-- Run this AFTER dropping all existing tables
-- Date: 2026-02-09

-- ===================================================================
-- DROP ALL EXISTING OBJECTS (clean slate)
-- ===================================================================

-- Drop existing triggers (wrapped in DO block to handle missing tables)
DO $$ BEGIN
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
DO $$ BEGIN
  DROP TRIGGER IF EXISTS lesson_update_course ON lessons;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
DO $$ BEGIN
  DROP TRIGGER IF EXISTS grade_notification ON grades;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_schools_updated_at ON schools;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Drop existing functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS calculate_enrollment_progress() CASCADE;
DROP FUNCTION IF EXISTS generate_certificate() CASCADE;
DROP FUNCTION IF EXISTS get_school_seat_usage() CASCADE;
DROP FUNCTION IF EXISTS school_has_available_seats() CASCADE;
DROP FUNCTION IF EXISTS update_course_on_lesson_change() CASCADE;
DROP FUNCTION IF EXISTS create_grade_notification() CASCADE;
DROP FUNCTION IF EXISTS get_user_courses(UUID) CASCADE;

-- Drop existing views
DROP VIEW IF EXISTS course_student_count CASCADE;
DROP VIEW IF EXISTS student_course_progress CASCADE;

-- Drop existing tables (order matters for foreign keys)
DROP TABLE IF EXISTS task_comments CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS flashcard_progress CASCADE;
DROP TABLE IF EXISTS flashcards CASCADE;
DROP TABLE IF EXISTS flashcard_decks CASCADE;
DROP TABLE IF EXISTS activity_results CASCADE;
DROP TABLE IF EXISTS interactive_activities CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS lesson_resources CASCADE;
DROP TABLE IF EXISTS quiz_results CASCADE;
DROP TABLE IF EXISTS quiz_options CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS lesson_progress CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS parent_students CASCADE;
DROP TABLE IF EXISTS student_invites CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop new blueprint tables if they exist (idempotent)
DROP TABLE IF EXISTS leaderboard_entries CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS user_levels CASCADE;
DROP TABLE IF EXISTS xp_events CASCADE;
DROP TABLE IF EXISTS study_sessions CASCADE;
DROP TABLE IF EXISTS subscription_usage CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS message_read_receipts CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversation_members CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS rubrics CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS lesson_attachments CASCADE;
DROP TABLE IF EXISTS lesson_progress_new CASCADE;
DROP TABLE IF EXISTS class_codes CASCADE;
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS lessons_new CASCADE;
DROP TABLE IF EXISTS courses_new CASCADE;
DROP TABLE IF EXISTS student_parents CASCADE;
DROP TABLE IF EXISTS tenant_memberships CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- Drop enums
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS course_status CASCADE;
DROP TYPE IF EXISTS lesson_type CASCADE;
DROP TYPE IF EXISTS lesson_status CASCADE;
DROP TYPE IF EXISTS question_type CASCADE;
DROP TYPE IF EXISTS activity_type CASCADE;

-- ===================================================================
-- 1. TENANTS (Schools)
-- ===================================================================

CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'CA',
  phone VARCHAR(20),
  subscription_plan VARCHAR(50) DEFAULT 'starter',
  status VARCHAR(50) DEFAULT 'active',
  settings JSONB DEFAULT '{}'::jsonb,
  branding JSONB DEFAULT '{"primary_color": "#1a2a4e", "secondary_color": "#0a4d68"}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  CONSTRAINT valid_plan CHECK (subscription_plan IN ('starter', 'growth', 'enterprise', 'free')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'suspended', 'cancelled'))
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_created_at ON tenants(created_at DESC);

-- ===================================================================
-- 2. PROFILES (extends auth.users)
-- ===================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  phone VARCHAR(20),
  date_of_birth DATE,
  bio TEXT,
  timezone VARCHAR(100) DEFAULT 'America/Winnipeg',
  language VARCHAR(20) DEFAULT 'en',
  grade_level VARCHAR(10),
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_name ON profiles(first_name, last_name);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

-- ===================================================================
-- 3. TENANT MEMBERSHIPS (User-School relationships)
-- ===================================================================

CREATE TABLE tenant_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_at TIMESTAMPTZ,
  invited_by UUID REFERENCES auth.users(id),
  suspended_at TIMESTAMPTZ,
  suspended_reason TEXT,
  consent_coppa_at TIMESTAMPTZ,
  consent_ferpa_at TIMESTAMPTZ,

  UNIQUE(tenant_id, user_id),
  CONSTRAINT valid_role CHECK (role IN ('student', 'teacher', 'parent', 'admin', 'super_admin')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'invited', 'suspended', 'pending_parent_consent'))
);

CREATE INDEX idx_tm_tenant_id ON tenant_memberships(tenant_id);
CREATE INDEX idx_tm_user_id ON tenant_memberships(user_id);
CREATE INDEX idx_tm_role ON tenant_memberships(tenant_id, role);
CREATE INDEX idx_tm_status ON tenant_memberships(status);

-- ===================================================================
-- 4. PARENT-STUDENT RELATIONSHIPS
-- ===================================================================

CREATE TABLE student_parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  relationship VARCHAR(50),
  is_primary_contact BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, student_id, parent_id),
  CONSTRAINT valid_relationship CHECK (relationship IN ('mother', 'father', 'guardian', 'grandparent', 'other')),
  CONSTRAINT no_self_link CHECK (student_id != parent_id)
);

CREATE INDEX idx_sp_tenant ON student_parents(tenant_id);
CREATE INDEX idx_sp_student ON student_parents(student_id);
CREATE INDEX idx_sp_parent ON student_parents(parent_id);

-- ===================================================================
-- 5. COURSES
-- ===================================================================

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100),
  grade_level VARCHAR(50),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  semester VARCHAR(50),
  start_date DATE,
  end_date DATE,
  syllabus_url TEXT,
  credits NUMERIC(5, 2),
  max_students INT,
  status VARCHAR(50) DEFAULT 'active',
  grading_policy JSONB DEFAULT '{"categories": [{"name": "Homework", "weight": 30}, {"name": "Tests", "weight": 40}, {"name": "Projects", "weight": 20}, {"name": "Participation", "weight": 10}]}'::jsonb,
  settings JSONB DEFAULT '{"gamification_enabled": true, "xp_multiplier": 1.0}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ,

  CONSTRAINT valid_status CHECK (status IN ('active', 'archived', 'draft'))
);

CREATE INDEX idx_courses_tenant ON courses(tenant_id);
CREATE INDEX idx_courses_created_by ON courses(created_by);
CREATE INDEX idx_courses_subject ON courses(subject);
CREATE INDEX idx_courses_grade_level ON courses(grade_level);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_created_at ON courses(created_at DESC);

-- ===================================================================
-- 6. CLASS CODES (for student self-enrollment)
-- ===================================================================

CREATE TABLE class_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  code VARCHAR(10) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  max_uses INT,
  use_count INT DEFAULT 0,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_class_codes_code ON class_codes(code);
CREATE INDEX idx_class_codes_course ON class_codes(course_id);

-- ===================================================================
-- 7. COURSE ENROLLMENTS
-- ===================================================================

CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'active',
  grade_letter VARCHAR(3),
  grade_numeric NUMERIC(5, 2),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  UNIQUE(course_id, student_id),
  CONSTRAINT valid_status CHECK (status IN ('active', 'dropped', 'completed', 'withdrawn'))
);

CREATE INDEX idx_ce_course ON course_enrollments(course_id);
CREATE INDEX idx_ce_student ON course_enrollments(student_id);
CREATE INDEX idx_ce_tenant ON course_enrollments(tenant_id);
CREATE INDEX idx_ce_teacher ON course_enrollments(teacher_id);
CREATE INDEX idx_ce_status ON course_enrollments(status);

-- ===================================================================
-- 8. LESSONS
-- ===================================================================

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content JSONB DEFAULT '[]'::jsonb,
  order_index INT NOT NULL,
  duration_minutes INT,
  learning_objectives TEXT[],
  created_by UUID NOT NULL REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  scheduled_publish_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_lessons_tenant ON lessons(tenant_id);
CREATE INDEX idx_lessons_status ON lessons(status);
CREATE INDEX idx_lessons_order ON lessons(course_id, order_index);

-- ===================================================================
-- 9. LESSON ATTACHMENTS
-- ===================================================================

CREATE TABLE lesson_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  file_path VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size INT,
  display_name VARCHAR(255),
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_la_lesson ON lesson_attachments(lesson_id);

-- ===================================================================
-- 10. LESSON PROGRESS
-- ===================================================================

CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'not_started',
  progress_percentage INT DEFAULT 0,
  time_spent_seconds INT DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(lesson_id, user_id),
  CONSTRAINT valid_status CHECK (status IN ('not_started', 'in_progress', 'completed')),
  CONSTRAINT valid_progress CHECK (progress_percentage BETWEEN 0 AND 100)
);

CREATE INDEX idx_lp_lesson ON lesson_progress(lesson_id);
CREATE INDEX idx_lp_user ON lesson_progress(user_id);

-- ===================================================================
-- 11. ASSIGNMENTS
-- ===================================================================

CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT,
  type VARCHAR(50) DEFAULT 'homework',
  category VARCHAR(100),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  due_date TIMESTAMPTZ NOT NULL,
  available_date TIMESTAMPTZ,
  max_points NUMERIC(7, 2) NOT NULL DEFAULT 100,
  submission_type VARCHAR(50) DEFAULT 'file',
  allow_late_submission BOOLEAN DEFAULT true,
  late_penalty_per_day NUMERIC(5, 2) DEFAULT 0,
  late_submission_days INT DEFAULT 7,
  max_attempts INT DEFAULT 1,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_type CHECK (type IN ('homework', 'quiz', 'project', 'exam', 'discussion', 'presentation', 'other')),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'assigned', 'closed', 'archived')),
  CONSTRAINT valid_submission_type CHECK (submission_type IN ('text', 'file', 'link', 'discussion', 'multi'))
);

CREATE INDEX idx_asgn_course ON assignments(course_id);
CREATE INDEX idx_asgn_tenant ON assignments(tenant_id);
CREATE INDEX idx_asgn_due_date ON assignments(due_date);
CREATE INDEX idx_asgn_status ON assignments(status);
CREATE INDEX idx_asgn_category ON assignments(course_id, category);

-- ===================================================================
-- 12. RUBRICS
-- ===================================================================

CREATE TABLE rubrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_template BOOLEAN DEFAULT false,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rubrics_assignment ON rubrics(assignment_id);
CREATE INDEX idx_rubrics_tenant ON rubrics(tenant_id);
CREATE INDEX idx_rubrics_template ON rubrics(tenant_id, is_template) WHERE is_template = true;

-- ===================================================================
-- 13. SUBMISSIONS
-- ===================================================================

CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  submission_text TEXT,
  file_path VARCHAR(500),
  file_name VARCHAR(255),
  submission_url TEXT,
  attempt_number INT DEFAULT 1,
  status VARCHAR(50) DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_late BOOLEAN DEFAULT false,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN ('draft', 'submitted', 'graded', 'returned'))
);

CREATE INDEX idx_sub_assignment ON submissions(assignment_id);
CREATE INDEX idx_sub_student ON submissions(student_id);
CREATE INDEX idx_sub_tenant ON submissions(tenant_id);
CREATE INDEX idx_sub_status ON submissions(status);
CREATE INDEX idx_sub_submitted_at ON submissions(submitted_at DESC);

-- ===================================================================
-- 14. GRADES
-- ===================================================================

CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES assignments(id),
  student_id UUID NOT NULL REFERENCES auth.users(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  points_earned NUMERIC(7, 2),
  percentage NUMERIC(5, 2),
  letter_grade VARCHAR(3),
  feedback TEXT,
  rubric_scores JSONB,
  is_excused BOOLEAN DEFAULT false,
  is_extra_credit BOOLEAN DEFAULT false,
  graded_by UUID NOT NULL REFERENCES auth.users(id),
  graded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_percentage CHECK (percentage BETWEEN 0 AND 200),
  CONSTRAINT valid_letter_grade CHECK (letter_grade IN ('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', 'I', 'P', 'NP'))
);

CREATE INDEX idx_grades_submission ON grades(submission_id);
CREATE INDEX idx_grades_student_course ON grades(student_id, course_id);
CREATE INDEX idx_grades_tenant ON grades(tenant_id);
CREATE INDEX idx_grades_assignment ON grades(assignment_id);

-- ===================================================================
-- 15. ATTENDANCE
-- ===================================================================

CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id),
  attendance_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  excuse_document_url TEXT,
  marked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(course_id, student_id, attendance_date),
  CONSTRAINT valid_status CHECK (status IN ('present', 'absent', 'tardy', 'excused', 'online'))
);

CREATE INDEX idx_att_course ON attendance_records(course_id);
CREATE INDEX idx_att_student ON attendance_records(student_id);
CREATE INDEX idx_att_date ON attendance_records(attendance_date DESC);
CREATE INDEX idx_att_tenant ON attendance_records(tenant_id);

-- ===================================================================
-- 16. CONVERSATIONS
-- ===================================================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  subject VARCHAR(255),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_type CHECK (type IN ('direct', 'group', 'class_discussion'))
);

CREATE INDEX idx_conv_tenant ON conversations(tenant_id);
CREATE INDEX idx_conv_type ON conversations(type);
CREATE INDEX idx_conv_course ON conversations(course_id);
CREATE INDEX idx_conv_updated ON conversations(updated_at DESC);

-- ===================================================================
-- 17. CONVERSATION MEMBERS
-- ===================================================================

CREATE TABLE conversation_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,

  UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_cm_user ON conversation_members(user_id);
CREATE INDEX idx_cm_conversation ON conversation_members(conversation_id);

-- ===================================================================
-- 18. MESSAGES
-- ===================================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT content_not_empty CHECK (content <> '')
);

CREATE INDEX idx_msg_conversation ON messages(conversation_id);
CREATE INDEX idx_msg_sender ON messages(sender_id);
CREATE INDEX idx_msg_created_at ON messages(conversation_id, created_at DESC);

-- ===================================================================
-- 19. MESSAGE READ RECEIPTS
-- ===================================================================

CREATE TABLE message_read_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(message_id, user_id)
);

CREATE INDEX idx_mrr_user ON message_read_receipts(user_id);

-- ===================================================================
-- 20. NOTIFICATIONS
-- ===================================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  action_url TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notif_user ON notifications(user_id);
CREATE INDEX idx_notif_unread ON notifications(user_id, read) WHERE read = false;
CREATE INDEX idx_notif_created ON notifications(created_at DESC);

-- ===================================================================
-- 21. NOTIFICATION PREFERENCES
-- ===================================================================

CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  notification_type VARCHAR(100) NOT NULL,
  in_app BOOLEAN DEFAULT true,
  email BOOLEAN DEFAULT true,
  sms BOOLEAN DEFAULT false,
  quiet_hours_start TIME,
  quiet_hours_end TIME,

  UNIQUE(user_id, tenant_id, notification_type)
);

CREATE INDEX idx_np_user ON notification_preferences(user_id);

-- ===================================================================
-- 22. ANNOUNCEMENTS
-- ===================================================================

CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  is_pinned BOOLEAN DEFAULT false,
  notify_parents BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE INDEX idx_ann_tenant ON announcements(tenant_id);
CREATE INDEX idx_ann_course ON announcements(course_id);
CREATE INDEX idx_ann_published ON announcements(published_at DESC);
CREATE INDEX idx_ann_pinned ON announcements(tenant_id, is_pinned) WHERE is_pinned = true;

-- ===================================================================
-- 23. AUDIT LOGS (FERPA/COPPA/PIPEDA compliance)
-- ===================================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  target_user_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  severity VARCHAR(20) DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_severity CHECK (severity IN ('info', 'warning', 'critical'))
);

CREATE INDEX idx_al_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_al_user ON audit_logs(user_id);
CREATE INDEX idx_al_action ON audit_logs(action);
CREATE INDEX idx_al_target ON audit_logs(target_user_id);
CREATE INDEX idx_al_created ON audit_logs(created_at DESC);
CREATE INDEX idx_al_severity ON audit_logs(severity) WHERE severity != 'info';

-- ===================================================================
-- 24. INVOICES (billing)
-- ===================================================================

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  amount_paid NUMERIC(10, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft',
  due_date DATE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible'))
);

CREATE INDEX idx_inv_tenant ON invoices(tenant_id);
CREATE INDEX idx_inv_status ON invoices(status);

-- ===================================================================
-- 25. SUBSCRIPTION USAGE
-- ===================================================================

CREATE TABLE subscription_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  active_students INT DEFAULT 0,
  active_teachers INT DEFAULT 0,
  total_users INT DEFAULT 0,
  storage_used_gb NUMERIC(10, 2) DEFAULT 0,
  api_calls INT DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, billing_period_start)
);

CREATE INDEX idx_su_tenant ON subscription_usage(tenant_id);

-- ===================================================================
-- 26. STUDY SESSIONS (Focus/Study Mode)
-- ===================================================================

CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_minutes INT NOT NULL,
  actual_minutes INT,
  music_type VARCHAR(50),
  assignment_id UUID REFERENCES assignments(id),
  completed BOOLEAN DEFAULT false,
  xp_awarded INT DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE INDEX idx_ss_user ON study_sessions(user_id);
CREATE INDEX idx_ss_tenant ON study_sessions(tenant_id);
CREATE INDEX idx_ss_started ON study_sessions(started_at DESC);

-- ===================================================================
-- GAMIFICATION TABLES
-- ===================================================================

-- 27. XP EVENTS
CREATE TABLE xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  xp_amount INT NOT NULL,
  source_type VARCHAR(100),
  source_id UUID,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_xp_user ON xp_events(user_id);
CREATE INDEX idx_xp_tenant ON xp_events(tenant_id);
CREATE INDEX idx_xp_type ON xp_events(event_type);
CREATE INDEX idx_xp_created ON xp_events(created_at DESC);
-- idx_xp_user_daily omitted: timestamptz::date is not immutable

-- 28. USER LEVELS
CREATE TABLE user_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_level INT DEFAULT 1,
  total_xp INT DEFAULT 0,
  current_tier VARCHAR(50) DEFAULT 'awakening',
  coins INT DEFAULT 0,
  streak_days INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_active_date DATE,
  xp_decayed INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, user_id),
  CONSTRAINT valid_tier CHECK (current_tier IN ('awakening', 'growth', 'advancement', 'mastery'))
);

CREATE INDEX idx_ul_user ON user_levels(user_id);
CREATE INDEX idx_ul_tenant ON user_levels(tenant_id);
CREATE INDEX idx_ul_level ON user_levels(tenant_id, current_level DESC);

-- 29. ACHIEVEMENTS (Badge definitions)
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  category VARCHAR(100) NOT NULL,
  tier VARCHAR(50) NOT NULL,
  criteria JSONB NOT NULL,
  xp_reward INT DEFAULT 0,
  coin_reward INT DEFAULT 0,
  is_global BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_category CHECK (category IN ('academic', 'consistency', 'participation', 'challenge', 'social', 'wellness')),
  CONSTRAINT valid_tier CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum'))
);

CREATE INDEX idx_ach_tenant ON achievements(tenant_id);
CREATE INDEX idx_ach_category ON achievements(category);
CREATE INDEX idx_ach_tier ON achievements(tier);
CREATE INDEX idx_ach_global ON achievements(is_global) WHERE is_global = true;

-- 30. USER ACHIEVEMENTS (Earned badges)
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  notified BOOLEAN DEFAULT false,

  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_ua_user ON user_achievements(user_id);
CREATE INDEX idx_ua_achievement ON user_achievements(achievement_id);
CREATE INDEX idx_ua_earned ON user_achievements(earned_at DESC);

-- 31. LEADERBOARD ENTRIES (cached/materialized)
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scope VARCHAR(50) NOT NULL,
  scope_id UUID,
  period VARCHAR(50) NOT NULL,
  period_start DATE NOT NULL,
  xp_total INT DEFAULT 0,
  rank INT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, user_id, scope, scope_id, period, period_start),
  CONSTRAINT valid_scope CHECK (scope IN ('class', 'grade', 'school')),
  CONSTRAINT valid_period CHECK (period IN ('weekly', 'monthly', 'all_time'))
);

CREATE INDEX idx_lb_tenant_scope ON leaderboard_entries(tenant_id, scope, scope_id);
CREATE INDEX idx_lb_rank ON leaderboard_entries(tenant_id, scope, scope_id, period, rank);

-- ===================================================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_read_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Helper: check if user is member of tenant
CREATE OR REPLACE FUNCTION is_tenant_member(t_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM tenant_memberships
    WHERE tenant_id = t_id AND user_id = auth.uid() AND status IN ('active', 'invited')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: get user role in tenant
CREATE OR REPLACE FUNCTION get_tenant_role(t_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  r VARCHAR;
BEGIN
  SELECT role INTO r FROM tenant_memberships
  WHERE tenant_id = t_id AND user_id = auth.uid() AND status = 'active'
  LIMIT 1;
  RETURN r;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: users can see own + same-tenant members
CREATE POLICY profiles_select ON profiles FOR SELECT
  USING (
    id = auth.uid() OR
    id IN (
      SELECT user_id FROM tenant_memberships
      WHERE tenant_id IN (
        SELECT tenant_id FROM tenant_memberships WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY profiles_update_own ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY profiles_insert_own ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Tenants: members can view their tenant
CREATE POLICY tenants_select ON tenants FOR SELECT
  USING (is_tenant_member(id));

-- Tenant memberships: members can view their tenant's memberships
CREATE POLICY tm_select ON tenant_memberships FOR SELECT
  USING (
    user_id = auth.uid() OR
    is_tenant_member(tenant_id)
  );

-- Student parents: relevant parties can view
CREATE POLICY sp_select ON student_parents FOR SELECT
  USING (
    student_id = auth.uid() OR
    parent_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin', 'teacher')
    )
  );

-- Courses: tenant members can view
CREATE POLICY courses_select ON courses FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY courses_insert ON courses FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

CREATE POLICY courses_update ON courses FOR UPDATE
  USING (
    created_by = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY courses_delete ON courses FOR DELETE
  USING (
    created_by = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Class codes: tenant members can view, teachers+ can create
CREATE POLICY cc_select ON class_codes FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY cc_insert ON class_codes FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

-- Course enrollments: tenant scoped
CREATE POLICY ce_select ON course_enrollments FOR SELECT
  USING (
    student_id = auth.uid() OR
    teacher_id = auth.uid() OR
    is_tenant_member(tenant_id)
  );

CREATE POLICY ce_insert ON course_enrollments FOR INSERT
  WITH CHECK (
    student_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

-- Lessons: tenant scoped
CREATE POLICY lessons_select ON lessons FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY lessons_insert ON lessons FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

CREATE POLICY lessons_update ON lessons FOR UPDATE
  USING (
    created_by = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Lesson attachments: through lessons
CREATE POLICY la_select ON lesson_attachments FOR SELECT
  USING (
    lesson_id IN (SELECT id FROM lessons WHERE is_tenant_member(tenant_id))
  );

-- Lesson progress: own or teachers/admins
CREATE POLICY lp_select ON lesson_progress FOR SELECT
  USING (
    user_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

CREATE POLICY lp_upsert ON lesson_progress FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY lp_update ON lesson_progress FOR UPDATE
  USING (user_id = auth.uid());

-- Assignments: tenant scoped
CREATE POLICY asgn_select ON assignments FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY asgn_insert ON assignments FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

CREATE POLICY asgn_update ON assignments FOR UPDATE
  USING (
    created_by = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Rubrics: tenant scoped
CREATE POLICY rubrics_select ON rubrics FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY rubrics_insert ON rubrics FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

-- Submissions: student sees own, teacher sees course, admin sees all
CREATE POLICY sub_select ON submissions FOR SELECT
  USING (
    student_id = auth.uid() OR
    assignment_id IN (
      SELECT a.id FROM assignments a
      JOIN courses c ON a.course_id = c.id
      WHERE c.created_by = auth.uid()
    ) OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY sub_insert ON submissions FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY sub_update ON submissions FOR UPDATE
  USING (
    student_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

-- Grades: strict access (student, parents, teachers, admins)
CREATE POLICY grades_select ON grades FOR SELECT
  USING (
    student_id = auth.uid() OR
    student_id IN (
      SELECT student_id FROM student_parents
      WHERE parent_id = auth.uid() AND status = 'active'
    ) OR
    course_id IN (
      SELECT id FROM courses WHERE created_by = auth.uid()
    ) OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY grades_insert ON grades FOR INSERT
  WITH CHECK (
    graded_by = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

CREATE POLICY grades_update ON grades FOR UPDATE
  USING (
    graded_by = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Attendance: teacher/admin can manage, student/parent can view own
CREATE POLICY att_select ON attendance_records FOR SELECT
  USING (
    student_id = auth.uid() OR
    student_id IN (
      SELECT student_id FROM student_parents
      WHERE parent_id = auth.uid() AND status = 'active'
    ) OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

CREATE POLICY att_insert ON attendance_records FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

CREATE POLICY att_update ON attendance_records FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

-- Conversations: members can view
CREATE POLICY conv_select ON conversations FOR SELECT
  USING (
    id IN (SELECT conversation_id FROM conversation_members WHERE user_id = auth.uid()) OR
    is_tenant_member(tenant_id)
  );

CREATE POLICY conv_insert ON conversations FOR INSERT
  WITH CHECK (created_by = auth.uid() AND is_tenant_member(tenant_id));

-- Conversation members: can view conversations you're in
CREATE POLICY cm_select ON conversation_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    conversation_id IN (SELECT conversation_id FROM conversation_members WHERE user_id = auth.uid())
  );

-- Messages: conversation members can view
CREATE POLICY msg_select ON messages FOR SELECT
  USING (
    conversation_id IN (SELECT conversation_id FROM conversation_members WHERE user_id = auth.uid())
  );

CREATE POLICY msg_insert ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (SELECT conversation_id FROM conversation_members WHERE user_id = auth.uid())
  );

CREATE POLICY msg_update ON messages FOR UPDATE
  USING (sender_id = auth.uid());

-- Read receipts: own
CREATE POLICY mrr_select ON message_read_receipts FOR SELECT
  USING (
    user_id = auth.uid() OR
    message_id IN (
      SELECT id FROM messages WHERE sender_id = auth.uid()
    )
  );

CREATE POLICY mrr_insert ON message_read_receipts FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Notifications: own only
CREATE POLICY notif_select ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY notif_update ON notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY notif_insert ON notifications FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

-- Notification preferences: own
CREATE POLICY np_select ON notification_preferences FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY np_upsert ON notification_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY np_update ON notification_preferences FOR UPDATE
  USING (user_id = auth.uid());

-- Announcements: tenant scoped
CREATE POLICY ann_select ON announcements FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY ann_insert ON announcements FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

-- Audit logs: admin only
CREATE POLICY al_select ON audit_logs FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY al_insert ON audit_logs FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

-- Invoices: admin only
CREATE POLICY inv_select ON invoices FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Subscription usage: admin only
CREATE POLICY su_select ON subscription_usage FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Study sessions: own only
CREATE POLICY ss_select ON study_sessions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY ss_insert ON study_sessions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY ss_update ON study_sessions FOR UPDATE
  USING (user_id = auth.uid());

-- XP events: own + teachers/admins
CREATE POLICY xp_select ON xp_events FOR SELECT
  USING (
    user_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

CREATE POLICY xp_insert ON xp_events FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

-- User levels: own + teachers/admins
CREATE POLICY ul_select ON user_levels FOR SELECT
  USING (
    user_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

CREATE POLICY ul_upsert ON user_levels FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

CREATE POLICY ul_update ON user_levels FOR UPDATE
  USING (is_tenant_member(tenant_id));

-- Achievements: tenant members can view, teachers+ can create
CREATE POLICY ach_select ON achievements FOR SELECT
  USING (
    is_global = true OR
    (tenant_id IS NOT NULL AND is_tenant_member(tenant_id))
  );

CREATE POLICY ach_insert ON achievements FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

-- User achievements: own + teachers/admins
CREATE POLICY ua_select ON user_achievements FOR SELECT
  USING (
    user_id = auth.uid() OR
    is_tenant_member(tenant_id)
  );

CREATE POLICY ua_insert ON user_achievements FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

-- Leaderboard: tenant scoped
CREATE POLICY lb_select ON leaderboard_entries FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY lb_upsert ON leaderboard_entries FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

CREATE POLICY lb_update ON leaderboard_entries FOR UPDATE
  USING (is_tenant_member(tenant_id));

-- ===================================================================
-- VIEWS
-- ===================================================================

CREATE VIEW course_student_count AS
SELECT
  c.id as course_id,
  c.name,
  c.tenant_id,
  COUNT(DISTINCT ce.student_id) as student_count,
  COUNT(DISTINCT CASE WHEN ce.status = 'active' THEN ce.student_id END) as active_students
FROM courses c
LEFT JOIN course_enrollments ce ON c.id = ce.course_id
GROUP BY c.id, c.name, c.tenant_id;

CREATE VIEW student_course_progress AS
SELECT
  ce.student_id,
  ce.course_id,
  ce.tenant_id,
  COUNT(DISTINCT a.id) as total_assignments,
  COUNT(DISTINCT CASE WHEN s.status = 'graded' THEN s.id END) as graded_assignments,
  ROUND(
    COUNT(DISTINCT CASE WHEN s.status = 'graded' THEN s.id END)::numeric /
    NULLIF(COUNT(DISTINCT a.id)::numeric, 0) * 100,
    2
  ) as completion_percentage,
  AVG(g.percentage) as average_grade
FROM course_enrollments ce
LEFT JOIN assignments a ON ce.course_id = a.course_id AND a.status = 'assigned'
LEFT JOIN submissions s ON a.id = s.assignment_id AND ce.student_id = s.student_id
LEFT JOIN grades g ON s.id = g.submission_id
GROUP BY ce.student_id, ce.course_id, ce.tenant_id;

-- ===================================================================
-- FUNCTIONS
-- ===================================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update course timestamp on lesson change
CREATE OR REPLACE FUNCTION update_course_on_lesson_change()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses SET updated_at = NOW() WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lesson_update_course
  AFTER INSERT OR UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_course_on_lesson_change();

-- Auto-create notification on grade posted
CREATE OR REPLACE FUNCTION create_grade_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (tenant_id, user_id, type, title, message, action_url, course_id, assignment_id)
  VALUES (
    NEW.tenant_id,
    NEW.student_id,
    'grade_posted',
    'Grade Posted',
    'Your work on an assignment has been graded.',
    '/grades',
    NEW.course_id,
    NEW.assignment_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER grade_notification
  AFTER INSERT ON grades
  FOR EACH ROW EXECUTE FUNCTION create_grade_notification();

-- Get user courses with role
CREATE OR REPLACE FUNCTION get_user_courses(p_user_id UUID)
RETURNS TABLE(course_id UUID, course_name VARCHAR, user_role VARCHAR) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    c.id,
    c.name,
    CASE
      WHEN c.created_by = p_user_id THEN 'teacher'::VARCHAR
      WHEN EXISTS (
        SELECT 1 FROM course_enrollments ce
        WHERE ce.course_id = c.id AND ce.student_id = p_user_id AND ce.status = 'active'
      ) THEN 'student'::VARCHAR
      ELSE 'other'::VARCHAR
    END as user_role
  FROM courses c
  WHERE c.tenant_id IN (
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = p_user_id AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate class code
CREATE OR REPLACE FUNCTION generate_class_code()
RETURNS VARCHAR AS $$
DECLARE
  chars VARCHAR := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code VARCHAR := '';
  i INT;
BEGIN
  FOR i IN 1..6 LOOP
    code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance_records FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===================================================================
-- ENABLE REALTIME FOR MESSAGING & NOTIFICATIONS
-- ===================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE conversation_members;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
