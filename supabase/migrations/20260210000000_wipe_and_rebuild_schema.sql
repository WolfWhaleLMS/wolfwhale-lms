-- Wolf Whale LMS - Wipe old schema and apply new blueprint schema
-- This drops ALL old Codebase 2 tables and applies the blueprint's 04_Database_Schema.sql

-- ===================================================================
-- STEP 1: DROP ALL OLD TABLES (from Codebase 2)
-- ===================================================================
DROP VIEW IF EXISTS student_course_progress CASCADE;
DROP VIEW IF EXISTS course_student_count CASCADE;

DROP TABLE IF EXISTS message_read_receipts CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversation_members CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS subscription_usage CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS rubrics CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS lesson_attachments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS student_parents CASCADE;
DROP TABLE IF EXISTS tenant_memberships CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- Also drop old Codebase 2 specific tables
DROP TABLE IF EXISTS user_flashcard_progress CASCADE;
DROP TABLE IF EXISTS flashcard_decks CASCADE;
DROP TABLE IF EXISTS flashcards CASCADE;
DROP TABLE IF EXISTS quiz_attempts CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS lesson_progress CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS interactions CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS parent_students CASCADE;
DROP TABLE IF EXISTS school_plans CASCADE;

-- Drop old functions/triggers
DROP FUNCTION IF EXISTS update_course_on_lesson_change() CASCADE;
DROP FUNCTION IF EXISTS create_grade_notification() CASCADE;
DROP FUNCTION IF EXISTS get_user_courses(UUID) CASCADE;

-- ===================================================================
-- STEP 2: CREATE NEW SCHEMA (Blueprint 04_Database_Schema.sql)
-- ===================================================================

-- 1. TENANTS (Schools)
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
  country VARCHAR(100),
  phone VARCHAR(20),
  subscription_plan VARCHAR(50) DEFAULT 'starter',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  CONSTRAINT valid_plan CHECK (subscription_plan IN ('starter', 'growth', 'enterprise', 'free')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'suspended', 'cancelled'))
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_created_at ON tenants(created_at DESC);

-- 2. USERS (Profiles)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  phone VARCHAR(20),
  date_of_birth DATE,
  bio TEXT,
  timezone VARCHAR(100),
  language VARCHAR(20) DEFAULT 'en',
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_dob CHECK (date_of_birth <= CURRENT_DATE)
);

CREATE INDEX idx_profiles_name ON profiles(first_name, last_name);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

-- 3. TENANT MEMBERSHIPS (User-School relationships)
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

  UNIQUE(tenant_id, user_id),
  CONSTRAINT valid_role CHECK (role IN ('student', 'teacher', 'parent', 'admin', 'super_admin')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'invited', 'suspended', 'pending_parent_consent'))
);

CREATE INDEX idx_tenant_memberships_tenant_id ON tenant_memberships(tenant_id);
CREATE INDEX idx_tenant_memberships_user_id ON tenant_memberships(user_id);
CREATE INDEX idx_tenant_memberships_role ON tenant_memberships(role);
CREATE INDEX idx_tenant_memberships_status ON tenant_memberships(status);

-- 4. PARENT-STUDENT RELATIONSHIPS
CREATE TABLE student_parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  relationship VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, student_id, parent_id),
  CONSTRAINT valid_relationship CHECK (relationship IN ('mother', 'father', 'guardian', 'other'))
);

CREATE INDEX idx_student_parents_tenant ON student_parents(tenant_id);
CREATE INDEX idx_student_parents_student ON student_parents(student_id);
CREATE INDEX idx_student_parents_parent ON student_parents(parent_id);

-- 5. COURSES (Tenant-scoped)
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
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ,

  CONSTRAINT valid_status CHECK (status IN ('active', 'archived', 'draft'))
);

CREATE INDEX idx_courses_tenant_id ON courses(tenant_id);
CREATE INDEX idx_courses_created_by ON courses(created_by);
CREATE INDEX idx_courses_subject ON courses(subject);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_created_at ON courses(created_at DESC);

-- 6. COURSE ENROLLMENTS
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'active',
  grade_letter VARCHAR(2),
  grade_numeric NUMERIC(3, 2),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  UNIQUE(course_id, student_id),
  CONSTRAINT valid_status CHECK (status IN ('active', 'dropped', 'completed', 'withdrawn')),
  CONSTRAINT valid_grade CHECK (grade_numeric BETWEEN 0 AND 4.0)
);

CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_enrollments_student ON course_enrollments(student_id);
CREATE INDEX idx_enrollments_tenant ON course_enrollments(tenant_id);
CREATE INDEX idx_enrollments_status ON course_enrollments(status);

-- 7. LESSONS
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  order_index INT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(course_id, order_index),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_lessons_tenant ON lessons(tenant_id);
CREATE INDEX idx_lessons_status ON lessons(status);
CREATE INDEX idx_lessons_created_at ON lessons(created_at DESC);

-- 8. LESSON ATTACHMENTS
CREATE TABLE lesson_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  file_path VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size INT,
  display_name VARCHAR(255),
  order_index INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lesson_attachments_lesson ON lesson_attachments(lesson_id);

-- 9. ASSIGNMENTS
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT,
  type VARCHAR(50),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  due_date TIMESTAMPTZ NOT NULL,
  available_date TIMESTAMPTZ,
  max_points NUMERIC(5, 2) NOT NULL DEFAULT 100,
  submission_type VARCHAR(50),
  allow_late_submission BOOLEAN DEFAULT TRUE,
  late_submission_days INT,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_type CHECK (type IN ('homework', 'quiz', 'project', 'exam', 'discussion')),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'assigned', 'closed', 'archived')),
  CONSTRAINT valid_submission_type CHECK (submission_type IN ('text', 'file', 'link', 'discussion'))
);

CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_assignments_tenant ON assignments(tenant_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_assignments_status ON assignments(status);

-- 10. RUBRICS
CREATE TABLE rubrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rubrics_assignment ON rubrics(assignment_id);
CREATE INDEX idx_rubrics_tenant ON rubrics(tenant_id);

-- 11. SUBMISSIONS
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  submission_text TEXT,
  file_path VARCHAR(500),
  submission_url TEXT,
  status VARCHAR(50) DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_late BOOLEAN DEFAULT FALSE,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(assignment_id, student_id),
  CONSTRAINT valid_status CHECK (status IN ('submitted', 'graded', 'returned'))
);

CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_submissions_tenant ON submissions(tenant_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at DESC);

-- 12. GRADES
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES assignments(id),
  student_id UUID NOT NULL REFERENCES auth.users(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  points_earned NUMERIC(5, 2),
  percentage NUMERIC(5, 2),
  letter_grade VARCHAR(2),
  feedback TEXT,
  graded_by UUID NOT NULL REFERENCES auth.users(id),
  graded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_percentage CHECK (percentage BETWEEN 0 AND 100),
  CONSTRAINT valid_letter_grade CHECK (letter_grade IN ('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'I', 'P', 'NP'))
);

CREATE INDEX idx_grades_submission ON grades(submission_id);
CREATE INDEX idx_grades_student_course ON grades(student_id, course_id);
CREATE INDEX idx_grades_tenant ON grades(tenant_id);

-- 13. ATTENDANCE
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id),
  attendance_date DATE NOT NULL,
  status VARCHAR(50),
  notes TEXT,
  marked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(course_id, student_id, attendance_date),
  CONSTRAINT valid_status CHECK (status IN ('present', 'absent', 'tardy', 'excused', 'online'))
);

CREATE INDEX idx_attendance_course ON attendance_records(course_id);
CREATE INDEX idx_attendance_student ON attendance_records(student_id);
CREATE INDEX idx_attendance_date ON attendance_records(attendance_date DESC);

-- 14. MESSAGING
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type VARCHAR(50),
  subject VARCHAR(255),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_type CHECK (type IN ('direct', 'group', 'class_discussion'))
);

CREATE INDEX idx_conversations_tenant ON conversations(tenant_id);
CREATE INDEX idx_conversations_type ON conversations(type);
CREATE INDEX idx_conversations_course ON conversations(course_id);

CREATE TABLE conversation_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_conversation_members_user ON conversation_members(user_id);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  attachments JSONB,
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT content_not_empty CHECK (content <> '')
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

CREATE TABLE message_read_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(message_id, user_id)
);

CREATE INDEX idx_message_receipts_user ON message_read_receipts(user_id);

-- 15. NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  message TEXT,
  action_url TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_type CHECK (type IN (
    'assignment_due', 'grade_posted', 'message_received', 'enrollment_approved',
    'new_announcement', 'submission_graded', 'course_update', 'system_alert'
  ))
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- 16. ANNOUNCEMENTS
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE INDEX idx_announcements_tenant ON announcements(tenant_id);
CREATE INDEX idx_announcements_course ON announcements(course_id);
CREATE INDEX idx_announcements_published_at ON announcements(published_at DESC);

-- 17. AUDIT LOGS
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  target_user_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 18. BILLING & SUBSCRIPTIONS
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  amount_paid NUMERIC(10, 2) DEFAULT 0,
  status VARCHAR(50),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible'))
);

CREATE INDEX idx_invoices_tenant ON invoices(tenant_id);
CREATE INDEX idx_invoices_status ON invoices(status);

CREATE TABLE subscription_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  active_students INT,
  active_teachers INT,
  total_users INT,
  storage_used_gb NUMERIC(10, 2),
  api_calls INT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, billing_period_start)
);

CREATE INDEX idx_usage_tenant ON subscription_usage(tenant_id);

-- 19. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY courses_select_tenant
  ON courses FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND status IN ('active', 'invited')
    )
  );

CREATE POLICY courses_insert_teacher
  ON courses FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
    AND created_by = auth.uid()
  );

CREATE POLICY submissions_select_student
  ON submissions FOR SELECT
  USING (
    student_id = auth.uid() OR
    assignment_id IN (
      SELECT id FROM assignments
      WHERE course_id IN (
        SELECT course_id FROM course_enrollments
        WHERE teacher_id = auth.uid()
      )
    ) OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY submissions_insert_student
  ON submissions FOR INSERT
  WITH CHECK (
    student_id = auth.uid() AND
    assignment_id IN (
      SELECT id FROM assignments
      WHERE course_id IN (
        SELECT course_id FROM course_enrollments
        WHERE student_id = auth.uid()
      )
    )
  );

CREATE POLICY grades_select
  ON grades FOR SELECT
  USING (
    student_id = auth.uid() OR
    student_id IN (
      SELECT student_id FROM student_parents
      WHERE parent_id = auth.uid() AND status = 'active'
    ) OR
    assignment_id IN (
      SELECT id FROM assignments
      WHERE course_id IN (
        SELECT course_id FROM course_enrollments
        WHERE teacher_id = auth.uid()
      )
    ) OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY profiles_select
  ON profiles FOR SELECT
  USING (
    id = auth.uid() OR
    id IN (
      SELECT user_id FROM tenant_memberships
      WHERE tenant_id IN (
        SELECT tenant_id FROM tenant_memberships
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY profiles_insert
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY profiles_update
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- 20. VIEWS FOR ANALYTICS
CREATE VIEW course_student_count AS
SELECT
  c.id as course_id,
  c.name,
  COUNT(DISTINCT ce.student_id) as student_count,
  COUNT(DISTINCT CASE WHEN ce.status = 'active' THEN ce.student_id END) as active_students
FROM courses c
LEFT JOIN course_enrollments ce ON c.id = ce.course_id
GROUP BY c.id, c.name;

CREATE VIEW student_course_progress AS
SELECT
  ce.student_id,
  ce.course_id,
  COUNT(DISTINCT a.id) as total_assignments,
  COUNT(DISTINCT CASE WHEN s.status = 'graded' THEN s.id END) as graded_assignments,
  ROUND(
    COUNT(DISTINCT CASE WHEN s.status = 'graded' THEN s.id END)::numeric /
    NULLIF(COUNT(DISTINCT a.id)::numeric, 0) * 100,
    2
  ) as completion_percentage,
  AVG(g.percentage) as average_grade
FROM course_enrollments ce
LEFT JOIN assignments a ON ce.course_id = a.course_id
LEFT JOIN submissions s ON a.id = s.assignment_id AND ce.student_id = s.student_id
LEFT JOIN grades g ON s.id = g.submission_id
GROUP BY ce.student_id, ce.course_id;

-- 21. FUNCTIONS
CREATE OR REPLACE FUNCTION get_user_courses(p_user_id UUID)
RETURNS TABLE(course_id UUID, course_name VARCHAR, role VARCHAR) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    c.id,
    c.name,
    CASE
      WHEN c.created_by = p_user_id THEN 'teacher'::VARCHAR
      WHEN EXISTS (
        SELECT 1 FROM course_enrollments ce
        WHERE ce.course_id = c.id AND ce.student_id = p_user_id
      ) THEN 'student'::VARCHAR
      ELSE 'other'::VARCHAR
    END as role
  FROM courses c
  WHERE c.tenant_id IN (
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = p_user_id AND status IN ('active', 'invited')
  );
END;
$$ LANGUAGE plpgsql;

-- 22. TRIGGERS
CREATE OR REPLACE FUNCTION update_course_on_lesson_change()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses
  SET updated_at = NOW()
  WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lesson_update_course
AFTER INSERT OR UPDATE ON lessons
FOR EACH ROW
EXECUTE FUNCTION update_course_on_lesson_change();

CREATE OR REPLACE FUNCTION create_grade_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (tenant_id, user_id, type, title, message, action_url, course_id, assignment_id)
  VALUES (
    NEW.tenant_id,
    NEW.student_id,
    'grade_posted',
    'New Grade Posted',
    'Your work has been graded',
    '/grades/' || NEW.submission_id,
    NEW.course_id,
    NEW.assignment_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER grade_notification
AFTER INSERT ON grades
FOR EACH ROW
EXECUTE FUNCTION create_grade_notification();

-- 23. SAMPLE TENANT
INSERT INTO tenants (slug, name, subscription_plan)
VALUES ('wolf-whale-demo', 'Wolf Whale LMS', 'growth');
