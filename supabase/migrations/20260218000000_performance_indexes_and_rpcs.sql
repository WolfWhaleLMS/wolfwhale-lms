-- Migration: Performance Indexes & RPC Functions
-- Purpose: Add missing composite indexes and server-side aggregation RPCs
--          to support efficient operation at 50K+ concurrent users.
-- Date: 2026-02-11

-- =============================================================================
-- PART 1: MISSING COMPOSITE INDEXES
-- =============================================================================

-- Deduplication lookups for XP transactions
CREATE INDEX IF NOT EXISTS idx_xp_tx_dedup
  ON xp_transactions(tenant_id, student_id, source_type, source_id);

-- Class code lookup (enrollWithCode queries by code)
CREATE UNIQUE INDEX IF NOT EXISTS idx_cc_code
  ON class_codes(code) WHERE is_active = true;

-- Lesson progress lookups
CREATE INDEX IF NOT EXISTS idx_lp_lesson_user
  ON lesson_progress(lesson_id, user_id);

-- Conversation member lookups (RLS + messaging queries)
CREATE INDEX IF NOT EXISTS idx_cm_conversation
  ON conversation_members(conversation_id);

-- Token leaderboard queries
CREATE INDEX IF NOT EXISTS idx_ptt_tenant_earn_time
  ON plaza_token_transactions(tenant_id, created_at) WHERE amount > 0;

-- Attendance by tenant+student (parent/reports queries)
CREATE INDEX IF NOT EXISTS idx_att_tenant_student
  ON attendance_records(tenant_id, student_id);

-- Quiz attempts composite
CREATE INDEX IF NOT EXISTS idx_qa_quiz_student
  ON quiz_attempts(quiz_id, student_id);

-- Tenant membership composite (used in EVERY action + middleware)
CREATE INDEX IF NOT EXISTS idx_tm_user_status
  ON tenant_memberships(user_id, status);

CREATE INDEX IF NOT EXISTS idx_tm_user_tenant_status
  ON tenant_memberships(user_id, tenant_id, status);

-- Course enrollment composite
CREATE INDEX IF NOT EXISTS idx_enrollments_course_student
  ON course_enrollments(course_id, student_id, status);

-- Grades by student+tenant
CREATE INDEX IF NOT EXISTS idx_grades_student_tenant
  ON grades(student_id, tenant_id);

-- Notifications by user (for read queries)
CREATE INDEX IF NOT EXISTS idx_notifications_user_read
  ON notifications(user_id, read);

-- Assignments by course+status
CREATE INDEX IF NOT EXISTS idx_assignments_course_status
  ON assignments(course_id, status);

-- Messages by conversation + time (DESC for latest-first queries)
CREATE INDEX IF NOT EXISTS idx_messages_conv_time
  ON messages(conversation_id, created_at DESC);


-- =============================================================================
-- PART 2: RPC FUNCTIONS FOR SERVER-SIDE AGGREGATION
-- =============================================================================

-- 1. Get role counts for a tenant
--    Replaces: fetching ALL memberships then counting roles in JavaScript
CREATE OR REPLACE FUNCTION get_tenant_role_counts(p_tenant_id UUID)
RETURNS TABLE(role TEXT, count BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT, COUNT(*)::BIGINT
  FROM tenant_memberships
  WHERE tenant_id = p_tenant_id AND status = 'active'
  GROUP BY role;
$$;

-- 2. Get attendance summary counts by status
--    Replaces: fetching ALL attendance records then counting statuses in JavaScript
CREATE OR REPLACE FUNCTION get_attendance_summary(
  p_tenant_id UUID,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE(status TEXT, count BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT status::TEXT, COUNT(*)::BIGINT
  FROM attendance_records
  WHERE tenant_id = p_tenant_id
    AND (p_start_date IS NULL OR attendance_date >= p_start_date)
    AND (p_end_date IS NULL OR attendance_date <= p_end_date)
  GROUP BY status;
$$;

-- 3. Get course enrollment counts per course for a tenant
--    Replaces: N+1 per-course count queries from the admin dashboard
CREATE OR REPLACE FUNCTION get_course_enrollment_counts(p_tenant_id UUID)
RETURNS TABLE(course_id UUID, student_count BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ce.course_id, COUNT(*)::BIGINT AS student_count
  FROM course_enrollments ce
  JOIN courses c ON c.id = ce.course_id
  WHERE c.tenant_id = p_tenant_id AND ce.status = 'active'
  GROUP BY ce.course_id;
$$;

-- 4. Get token leaderboard for a tenant within a date range
--    Replaces: fetching ALL transactions then aggregating/sorting in JavaScript
CREATE OR REPLACE FUNCTION get_token_leaderboard(
  p_tenant_id UUID,
  p_start_date TIMESTAMPTZ,
  p_limit INT DEFAULT 50
)
RETURNS TABLE(user_id UUID, total_tokens BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ptt.user_id, SUM(ptt.amount)::BIGINT AS total_tokens
  FROM plaza_token_transactions ptt
  WHERE ptt.tenant_id = p_tenant_id
    AND ptt.amount > 0
    AND ptt.created_at >= p_start_date
  GROUP BY ptt.user_id
  ORDER BY total_tokens DESC
  LIMIT p_limit;
$$;

-- 6. Get student attendance counts per status for parent dashboard
--    Replaces: fetching all attendance rows for a student then grouping in JavaScript
CREATE OR REPLACE FUNCTION get_student_attendance_summary(
  p_student_id UUID,
  p_tenant_id UUID
)
RETURNS TABLE(status TEXT, count BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT status::TEXT, COUNT(*)::BIGINT
  FROM attendance_records
  WHERE student_id = p_student_id AND tenant_id = p_tenant_id
  GROUP BY status;
$$;

-- 7. Bulk reorder helper for modules and lessons
--    Replaces: N individual UPDATE queries when drag-and-drop reordering
CREATE OR REPLACE FUNCTION reorder_items(
  p_table_name TEXT,
  p_parent_column TEXT,
  p_parent_id UUID,
  p_item_ids UUID[]
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  i INT;
BEGIN
  -- Validate table name against allowlist to prevent SQL injection
  IF p_table_name NOT IN ('modules', 'lessons', 'assignments', 'quiz_questions') THEN
    RAISE EXCEPTION 'Table "%" is not allowed for reorder_items', p_table_name;
  END IF;

  -- Validate parent column against allowlist to prevent SQL injection
  IF p_parent_column NOT IN ('course_id', 'module_id', 'lesson_id', 'quiz_id') THEN
    RAISE EXCEPTION 'Parent column "%" is not allowed for reorder_items', p_parent_column;
  END IF;

  FOR i IN 1..array_length(p_item_ids, 1) LOOP
    EXECUTE format(
      'UPDATE %I SET order_index = $1 WHERE id = $2 AND %I = $3',
      p_table_name, p_parent_column
    ) USING i - 1, p_item_ids[i], p_parent_id;
  END LOOP;
END;
$$;


-- =============================================================================
-- PART 3: GRANT EXECUTE PERMISSIONS TO AUTHENTICATED USERS
-- =============================================================================

GRANT EXECUTE ON FUNCTION get_tenant_role_counts(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_attendance_summary(UUID, DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION get_course_enrollment_counts(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_token_leaderboard(UUID, TIMESTAMPTZ, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_student_attendance_summary(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reorder_items(TEXT, TEXT, UUID, UUID[]) TO authenticated;
