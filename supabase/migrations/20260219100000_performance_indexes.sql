-- Performance indexes for 50K user scale
-- Addresses: missing composite indexes, slow RLS policies, unbounded table growth

-- =============================================
-- 1. COMPOSITE INDEXES FOR COMMON QUERY PATTERNS
-- =============================================

-- tenant_memberships: queried by (user_id, tenant_id, status) on EVERY request via middleware
CREATE INDEX IF NOT EXISTS idx_tm_user_status ON tenant_memberships(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tm_user_tenant_status ON tenant_memberships(user_id, tenant_id, status);

-- course_enrollments: queried by (course_id, student_id, status) frequently
CREATE INDEX IF NOT EXISTS idx_enrollments_course_student ON course_enrollments(course_id, student_id, status);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_tenant ON course_enrollments(student_id, tenant_id);

-- xp_transactions: deduplication lookups by (tenant_id, student_id, source_type, source_id)
CREATE INDEX IF NOT EXISTS idx_xp_tx_dedup ON xp_transactions(tenant_id, student_id, source_type, source_id);

-- class_codes: looked up by code value
-- Note: class_codes.code already has a UNIQUE constraint from the table definition.
-- The partial unique index idx_cc_code (WHERE is_active = true) was added in a prior migration.
-- This IF NOT EXISTS will be a no-op since the index name already exists.
CREATE UNIQUE INDEX IF NOT EXISTS idx_cc_code ON class_codes(code);

-- lesson_progress: queried by (lesson_id, user_id)
CREATE INDEX IF NOT EXISTS idx_lp_lesson_user ON lesson_progress(lesson_id, user_id);

-- conversation_members: queried by conversation_id in RLS policies and messaging
CREATE INDEX IF NOT EXISTS idx_cm_conversation ON conversation_members(conversation_id);

-- plaza_token_transactions: leaderboard aggregation queries
CREATE INDEX IF NOT EXISTS idx_ptt_tenant_earn_time ON plaza_token_transactions(tenant_id, created_at) WHERE amount > 0;

-- attendance_records: parent/report queries by (tenant_id, student_id)
CREATE INDEX IF NOT EXISTS idx_att_tenant_student ON attendance_records(tenant_id, student_id);
CREATE INDEX IF NOT EXISTS idx_att_tenant_date ON attendance_records(tenant_id, attendance_date);

-- quiz_attempts: queried by (quiz_id, student_id)
CREATE INDEX IF NOT EXISTS idx_qa_quiz_student ON quiz_attempts(quiz_id, student_id);

-- grades: queried by (student_id, tenant_id) and (assignment_id)
CREATE INDEX IF NOT EXISTS idx_grades_student_tenant ON grades(student_id, tenant_id);

-- notifications: queried by (user_id, read) for badge counts
-- Note: the actual column name is "read" (not "is_read") per the base schema.
CREATE INDEX IF NOT EXISTS idx_notif_user_unread ON notifications(user_id, read) WHERE read = false;

-- messages: queried by (conversation_id, created_at) for message lists
CREATE INDEX IF NOT EXISTS idx_msg_conversation_time ON messages(conversation_id, created_at DESC);

-- =============================================
-- 2. FIX RLS POLICY PERFORMANCE
-- Replace nested subqueries with efficient function calls
-- =============================================

-- Create a helper function that returns the current user's tenant IDs (cached per transaction)
CREATE OR REPLACE FUNCTION get_user_tenant_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM tenant_memberships
  WHERE user_id = auth.uid() AND status = 'active';
$$;

-- Fix profiles_select: replace nested self-join with function call
DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated
USING (
  id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM tenant_memberships tm
    WHERE tm.user_id = profiles.id
    AND tm.tenant_id IN (SELECT get_user_tenant_ids())
    AND tm.status = 'active'
  )
);

-- Fix grades_select if it exists with nested subqueries
DROP POLICY IF EXISTS "grades_select" ON grades;
CREATE POLICY "grades_select" ON grades FOR SELECT TO authenticated
USING (
  student_id = auth.uid()
  OR tenant_id IN (SELECT get_user_tenant_ids())
);

-- =============================================
-- 3. AUDIT LOG RETENTION PREP
-- Add index for efficient date-based cleanup
-- =============================================
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_created ON audit_logs(tenant_id, created_at);

-- =============================================
-- 4. ANALYZE ALL TABLES TO UPDATE STATISTICS
-- =============================================
ANALYZE tenant_memberships;
ANALYZE course_enrollments;
ANALYZE attendance_records;
ANALYZE grades;
ANALYZE lessons;
ANALYZE lesson_progress;
ANALYZE notifications;
ANALYZE messages;
ANALYZE audit_logs;
