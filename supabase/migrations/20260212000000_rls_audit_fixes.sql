-- ===================================================================
-- Wolf Whale LMS - RLS Audit Fix Migration
-- Date: 2026-02-12
-- ===================================================================
-- This migration fixes missing RLS enablement and policies discovered
-- during a comprehensive audit. The wipe-and-rebuild migration
-- (20260210000000) only enabled RLS on 8 of ~20 tables. The quiz
-- system migration (20260211100000) enabled RLS on 5 quiz tables but
-- created zero policies, making those tables completely inaccessible.
--
-- TABLES FIXED:
-- 1. tenants                  - RLS enabled + policies added
-- 2. tenant_memberships       - RLS enabled + policies added
-- 3. student_parents          - RLS enabled + policies added
-- 4. course_enrollments       - RLS enabled + policies added
-- 5. lesson_attachments       - RLS enabled + policies added
-- 6. rubrics                  - RLS enabled + policies added
-- 7. attendance_records       - RLS enabled + policies added
-- 8. conversations            - RLS enabled + policies added
-- 9. conversation_members     - RLS enabled + policies added
-- 10. message_read_receipts   - RLS enabled + policies added
-- 11. announcements           - RLS enabled + policies added
-- 12. audit_logs              - RLS enabled + policies added
-- 13. invoices                - RLS enabled + policies added
-- 14. subscription_usage      - RLS enabled + policies added
-- 15. quizzes                 - policies added (RLS already enabled)
-- 16. quiz_questions          - policies added (RLS already enabled)
-- 17. quiz_options            - policies added (RLS already enabled)
-- 18. quiz_attempts           - policies added (RLS already enabled)
-- 19. quiz_answers            - policies added (RLS already enabled)
-- 20. lessons                 - policies added (SELECT only existed)
-- 21. assignments             - policies added (SELECT only existed)
-- ===================================================================

-- ===================================================================
-- HELPER: is_tenant_member function (idempotent)
-- ===================================================================
CREATE OR REPLACE FUNCTION is_tenant_member(t_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM tenant_memberships
    WHERE tenant_id = t_id AND user_id = auth.uid() AND status IN ('active', 'invited')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;


-- ===================================================================
-- 1. TENANTS - Enable RLS + Add Policies
-- ===================================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenants_select_member
  ON tenants FOR SELECT
  USING (is_tenant_member(id));

CREATE POLICY tenants_update_admin
  ON tenants FOR UPDATE
  USING (
    id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );


-- ===================================================================
-- 2. TENANT MEMBERSHIPS - Enable RLS + Add Policies
-- ===================================================================
ALTER TABLE tenant_memberships ENABLE ROW LEVEL SECURITY;

-- Members can view their own memberships and all memberships in their tenant
CREATE POLICY tm_select_member
  ON tenant_memberships FOR SELECT
  USING (
    user_id = auth.uid() OR
    is_tenant_member(tenant_id)
  );

-- Admins can insert memberships for their tenant
CREATE POLICY tm_insert_admin
  ON tenant_memberships FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
    OR user_id = auth.uid()
  );

-- Admins can update memberships for their tenant
CREATE POLICY tm_update_admin
  ON tenant_memberships FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

-- Admins can delete memberships for their tenant
CREATE POLICY tm_delete_admin
  ON tenant_memberships FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );


-- ===================================================================
-- 3. STUDENT PARENTS - Enable RLS + Add Policies
-- ===================================================================
ALTER TABLE student_parents ENABLE ROW LEVEL SECURITY;

-- Parents, students, and teachers/admins can view
CREATE POLICY sp_select_relevant
  ON student_parents FOR SELECT
  USING (
    student_id = auth.uid() OR
    parent_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin', 'teacher') AND status = 'active'
    )
  );

-- Admins can insert parent-student relationships
CREATE POLICY sp_insert_admin
  ON student_parents FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

-- Admins can update parent-student relationships
CREATE POLICY sp_update_admin
  ON student_parents FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );


-- ===================================================================
-- 4. COURSE ENROLLMENTS - Enable RLS + Add Policies
-- ===================================================================
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

-- Students see own, teachers see their courses, admins see all in tenant
CREATE POLICY ce_select_relevant
  ON course_enrollments FOR SELECT
  USING (
    student_id = auth.uid() OR
    teacher_id = auth.uid() OR
    is_tenant_member(tenant_id)
  );

-- Students can self-enroll, teachers/admins can enroll students
CREATE POLICY ce_insert_allowed
  ON course_enrollments FOR INSERT
  WITH CHECK (
    student_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

-- Teachers/admins can update enrollments
CREATE POLICY ce_update_admin
  ON course_enrollments FOR UPDATE
  USING (
    teacher_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

-- Teachers/admins can delete enrollments
CREATE POLICY ce_delete_admin
  ON course_enrollments FOR DELETE
  USING (
    teacher_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );


-- ===================================================================
-- 5. LESSON ATTACHMENTS - Enable RLS + Add Policies
-- ===================================================================
ALTER TABLE lesson_attachments ENABLE ROW LEVEL SECURITY;

-- Tenant members can view attachments for lessons in their tenant
CREATE POLICY la_select_tenant
  ON lesson_attachments FOR SELECT
  USING (
    lesson_id IN (
      SELECT l.id FROM lessons l
      WHERE l.tenant_id IN (
        SELECT tenant_id FROM tenant_memberships
        WHERE user_id = auth.uid() AND status IN ('active', 'invited')
      )
    )
  );

-- Teachers/admins can insert attachments
CREATE POLICY la_insert_teacher
  ON lesson_attachments FOR INSERT
  WITH CHECK (
    lesson_id IN (
      SELECT l.id FROM lessons l
      WHERE l.created_by = auth.uid()
         OR l.tenant_id IN (
              SELECT tenant_id FROM tenant_memberships
              WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
            )
    )
  );

-- Teachers/admins can delete attachments
CREATE POLICY la_delete_teacher
  ON lesson_attachments FOR DELETE
  USING (
    lesson_id IN (
      SELECT l.id FROM lessons l
      WHERE l.created_by = auth.uid()
         OR l.tenant_id IN (
              SELECT tenant_id FROM tenant_memberships
              WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
            )
    )
  );


-- ===================================================================
-- 6. RUBRICS - Enable RLS + Add Policies
-- ===================================================================
ALTER TABLE rubrics ENABLE ROW LEVEL SECURITY;

-- Tenant members can view rubrics
CREATE POLICY rubrics_select_tenant
  ON rubrics FOR SELECT
  USING (is_tenant_member(tenant_id));

-- Teachers/admins can create rubrics
CREATE POLICY rubrics_insert_teacher
  ON rubrics FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

-- Teachers/admins can update rubrics
CREATE POLICY rubrics_update_teacher
  ON rubrics FOR UPDATE
  USING (
    created_by = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );


-- ===================================================================
-- 7. ATTENDANCE RECORDS - Enable RLS + Add Policies
-- ===================================================================
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Students see own, parents see child's, teachers/admins see tenant
CREATE POLICY att_select_relevant
  ON attendance_records FOR SELECT
  USING (
    student_id = auth.uid() OR
    student_id IN (
      SELECT sp.student_id FROM student_parents sp
      WHERE sp.parent_id = auth.uid() AND sp.status = 'active'
    ) OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

-- Teachers/admins can insert attendance records
CREATE POLICY att_insert_teacher
  ON attendance_records FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

-- Teachers/admins can update attendance records
CREATE POLICY att_update_teacher
  ON attendance_records FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );


-- ===================================================================
-- 8. CONVERSATIONS - Enable RLS + Add Policies
-- ===================================================================
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Members of a conversation or tenant members can view
CREATE POLICY conv_select_member
  ON conversations FOR SELECT
  USING (
    id IN (SELECT conversation_id FROM conversation_members WHERE user_id = auth.uid()) OR
    is_tenant_member(tenant_id)
  );

-- Tenant members can create conversations
CREATE POLICY conv_insert_member
  ON conversations FOR INSERT
  WITH CHECK (created_by = auth.uid() AND is_tenant_member(tenant_id));


-- ===================================================================
-- 9. CONVERSATION MEMBERS - Enable RLS + Add Policies
-- ===================================================================
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;

-- Users can see members of conversations they belong to
CREATE POLICY cm_select_member
  ON conversation_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    conversation_id IN (
      SELECT conversation_id FROM conversation_members WHERE user_id = auth.uid()
    )
  );

-- Conversation creator or admins can add members
CREATE POLICY cm_insert_allowed
  ON conversation_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid() OR
    conversation_id IN (
      SELECT id FROM conversations WHERE created_by = auth.uid()
    )
  );


-- ===================================================================
-- 10. MESSAGE READ RECEIPTS - Enable RLS + Add Policies
-- ===================================================================
ALTER TABLE message_read_receipts ENABLE ROW LEVEL SECURITY;

-- Users can see their own read receipts and receipts on their messages
CREATE POLICY mrr_select_relevant
  ON message_read_receipts FOR SELECT
  USING (
    user_id = auth.uid() OR
    message_id IN (SELECT id FROM messages WHERE sender_id = auth.uid())
  );

-- Users can insert their own read receipts
CREATE POLICY mrr_insert_own
  ON message_read_receipts FOR INSERT
  WITH CHECK (user_id = auth.uid());


-- ===================================================================
-- 11. ANNOUNCEMENTS - Enable RLS + Add Policies
-- ===================================================================
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Tenant members can view announcements
CREATE POLICY ann_select_tenant
  ON announcements FOR SELECT
  USING (is_tenant_member(tenant_id));

-- Teachers/admins can create announcements
CREATE POLICY ann_insert_teacher
  ON announcements FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

-- Teachers/admins can update announcements
CREATE POLICY ann_update_teacher
  ON announcements FOR UPDATE
  USING (
    created_by = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );


-- ===================================================================
-- 12. AUDIT LOGS - Enable RLS + Add Policies
-- ===================================================================
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY al_select_admin
  ON audit_logs FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

-- Tenant members can insert audit logs (for logging their own actions)
CREATE POLICY al_insert_member
  ON audit_logs FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));


-- ===================================================================
-- 13. INVOICES - Enable RLS + Add Policies
-- ===================================================================
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Only admins can view invoices
CREATE POLICY inv_select_admin
  ON invoices FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );


-- ===================================================================
-- 14. SUBSCRIPTION USAGE - Enable RLS + Add Policies
-- ===================================================================
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;

-- Only admins can view subscription usage
CREATE POLICY su_select_admin
  ON subscription_usage FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );


-- ===================================================================
-- 15. LESSONS - Add Missing INSERT/UPDATE Policies
-- (20260210000000 only created courses_select_tenant and courses_insert_teacher,
--  but had no lesson-specific write policies)
-- ===================================================================

-- Teachers/admins can create lessons
CREATE POLICY lessons_insert_teacher
  ON lessons FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

-- Teachers/admins can update lessons
CREATE POLICY lessons_update_teacher
  ON lessons FOR UPDATE
  USING (
    created_by = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

-- Teachers/admins can delete lessons
CREATE POLICY lessons_delete_teacher
  ON lessons FOR DELETE
  USING (
    created_by = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

-- Tenant members can view lessons (if not already covered)
DO $$ BEGIN
  CREATE POLICY lessons_select_tenant
    ON lessons FOR SELECT
    USING (is_tenant_member(tenant_id));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ===================================================================
-- 16. ASSIGNMENTS - Add Missing INSERT/UPDATE Policies
-- (20260210000000 enabled RLS on assignments but created no policies)
-- ===================================================================

-- Tenant members can view assignments
CREATE POLICY assignments_select_tenant
  ON assignments FOR SELECT
  USING (is_tenant_member(tenant_id));

-- Teachers/admins can create assignments
CREATE POLICY assignments_insert_teacher
  ON assignments FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

-- Teachers/admins can update assignments
CREATE POLICY assignments_update_teacher
  ON assignments FOR UPDATE
  USING (
    created_by = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

-- Teachers/admins can delete assignments
CREATE POLICY assignments_delete_teacher
  ON assignments FOR DELETE
  USING (
    created_by = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );


-- ===================================================================
-- 17. SUBMISSIONS - Add Missing UPDATE Policy
-- (20260210000000 only has select + insert policies)
-- ===================================================================

-- Teachers/admins can update submissions (for grading)
CREATE POLICY submissions_update_teacher
  ON submissions FOR UPDATE
  USING (
    student_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );


-- ===================================================================
-- 18. GRADES - Add Missing INSERT/UPDATE Policies
-- (20260210000000 only has a select policy)
-- ===================================================================

-- Teachers/admins can insert grades
CREATE POLICY grades_insert_teacher
  ON grades FOR INSERT
  WITH CHECK (
    graded_by = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

-- Teachers/admins can update grades
CREATE POLICY grades_update_teacher
  ON grades FOR UPDATE
  USING (
    graded_by = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );


-- ===================================================================
-- 19. MESSAGES - Add Missing UPDATE Policy
-- (20260210000000 enabled RLS but has no policies for messages)
-- ===================================================================

-- Conversation members can view messages
CREATE POLICY messages_select_member
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_members WHERE user_id = auth.uid()
    )
  );

-- Users can send messages to their conversations
CREATE POLICY messages_insert_sender
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
      SELECT conversation_id FROM conversation_members WHERE user_id = auth.uid()
    )
  );

-- Users can edit their own messages
CREATE POLICY messages_update_own
  ON messages FOR UPDATE
  USING (sender_id = auth.uid());


-- ===================================================================
-- 20. NOTIFICATIONS - Add Missing INSERT Policy
-- (20260210000000 enabled RLS but has no insert policy)
-- ===================================================================

-- Tenant members can insert notifications (for system-generated notifications)
CREATE POLICY notifications_insert_member
  ON notifications FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

-- Users can update their own notifications (mark as read)
CREATE POLICY notifications_update_own
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());


-- ===================================================================
-- 21. QUIZZES - Add Policies (RLS enabled, ZERO policies existed)
-- ===================================================================

-- Enrolled students and tenant teachers/admins can view published quizzes
CREATE POLICY quizzes_select_enrolled
  ON quizzes FOR SELECT
  USING (
    -- Course teacher can see all quizzes (including drafts)
    created_by = auth.uid()
    OR
    -- Enrolled students can see published quizzes
    (
      status = 'published' AND
      course_id IN (
        SELECT course_id FROM course_enrollments
        WHERE student_id = auth.uid() AND status = 'active'
      )
    )
    OR
    -- Admins can see all quizzes in their tenant
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

-- Course teacher/admin can create quizzes
CREATE POLICY quizzes_insert_teacher
  ON quizzes FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

-- Course teacher/admin can update quizzes
CREATE POLICY quizzes_update_teacher
  ON quizzes FOR UPDATE
  USING (
    created_by = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

-- Course teacher/admin can delete quizzes
CREATE POLICY quizzes_delete_teacher
  ON quizzes FOR DELETE
  USING (
    created_by = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );


-- ===================================================================
-- 22. QUIZ QUESTIONS - Add Policies (RLS enabled, ZERO policies existed)
-- ===================================================================

-- Readable by enrolled students (for published quizzes) and the quiz creator
CREATE POLICY quiz_questions_select
  ON quiz_questions FOR SELECT
  USING (
    quiz_id IN (
      SELECT id FROM quizzes
      WHERE
        -- Quiz creator can see questions
        created_by = auth.uid()
        OR
        -- Enrolled students can see questions for published quizzes
        (
          status = 'published' AND
          course_id IN (
            SELECT course_id FROM course_enrollments
            WHERE student_id = auth.uid() AND status = 'active'
          )
        )
        OR
        -- Admins can see questions in their tenant
        tenant_id IN (
          SELECT tenant_id FROM tenant_memberships
          WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
        )
    )
  );

-- Course teacher/admin can create questions
CREATE POLICY quiz_questions_insert_teacher
  ON quiz_questions FOR INSERT
  WITH CHECK (
    quiz_id IN (
      SELECT id FROM quizzes
      WHERE created_by = auth.uid()
         OR tenant_id IN (
              SELECT tenant_id FROM tenant_memberships
              WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
            )
    )
  );

-- Course teacher/admin can update questions
CREATE POLICY quiz_questions_update_teacher
  ON quiz_questions FOR UPDATE
  USING (
    quiz_id IN (
      SELECT id FROM quizzes
      WHERE created_by = auth.uid()
         OR tenant_id IN (
              SELECT tenant_id FROM tenant_memberships
              WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
            )
    )
  );

-- Course teacher/admin can delete questions
CREATE POLICY quiz_questions_delete_teacher
  ON quiz_questions FOR DELETE
  USING (
    quiz_id IN (
      SELECT id FROM quizzes
      WHERE created_by = auth.uid()
         OR tenant_id IN (
              SELECT tenant_id FROM tenant_memberships
              WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
            )
    )
  );


-- ===================================================================
-- 23. QUIZ OPTIONS - Add Policies (RLS enabled, ZERO policies existed)
-- ===================================================================

-- Readable by enrolled students (for published quizzes) and the quiz creator
CREATE POLICY quiz_options_select
  ON quiz_options FOR SELECT
  USING (
    question_id IN (
      SELECT qq.id FROM quiz_questions qq
      JOIN quizzes q ON qq.quiz_id = q.id
      WHERE
        q.created_by = auth.uid()
        OR (
          q.status = 'published' AND
          q.course_id IN (
            SELECT course_id FROM course_enrollments
            WHERE student_id = auth.uid() AND status = 'active'
          )
        )
        OR q.tenant_id IN (
          SELECT tenant_id FROM tenant_memberships
          WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
        )
    )
  );

-- Course teacher/admin can create options
CREATE POLICY quiz_options_insert_teacher
  ON quiz_options FOR INSERT
  WITH CHECK (
    question_id IN (
      SELECT qq.id FROM quiz_questions qq
      JOIN quizzes q ON qq.quiz_id = q.id
      WHERE q.created_by = auth.uid()
         OR q.tenant_id IN (
              SELECT tenant_id FROM tenant_memberships
              WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
            )
    )
  );

-- Course teacher/admin can update options
CREATE POLICY quiz_options_update_teacher
  ON quiz_options FOR UPDATE
  USING (
    question_id IN (
      SELECT qq.id FROM quiz_questions qq
      JOIN quizzes q ON qq.quiz_id = q.id
      WHERE q.created_by = auth.uid()
         OR q.tenant_id IN (
              SELECT tenant_id FROM tenant_memberships
              WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
            )
    )
  );

-- Course teacher/admin can delete options
CREATE POLICY quiz_options_delete_teacher
  ON quiz_options FOR DELETE
  USING (
    question_id IN (
      SELECT qq.id FROM quiz_questions qq
      JOIN quizzes q ON qq.quiz_id = q.id
      WHERE q.created_by = auth.uid()
         OR q.tenant_id IN (
              SELECT tenant_id FROM tenant_memberships
              WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
            )
    )
  );


-- ===================================================================
-- 24. QUIZ ATTEMPTS - Add Policies (RLS enabled, ZERO policies existed)
-- ===================================================================

-- Students see own attempts, teachers see attempts for their quizzes, admins see all in tenant
CREATE POLICY quiz_attempts_select
  ON quiz_attempts FOR SELECT
  USING (
    student_id = auth.uid()
    OR quiz_id IN (
      SELECT id FROM quizzes WHERE created_by = auth.uid()
    )
    OR tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

-- Students can create their own attempts (for published quizzes they are enrolled in)
CREATE POLICY quiz_attempts_insert_student
  ON quiz_attempts FOR INSERT
  WITH CHECK (
    student_id = auth.uid() AND
    quiz_id IN (
      SELECT id FROM quizzes
      WHERE status = 'published' AND course_id IN (
        SELECT course_id FROM course_enrollments
        WHERE student_id = auth.uid() AND status = 'active'
      )
    )
  );

-- Teachers can update attempts (for manual grading of essay questions)
CREATE POLICY quiz_attempts_update_teacher
  ON quiz_attempts FOR UPDATE
  USING (
    student_id = auth.uid()
    OR quiz_id IN (
      SELECT id FROM quizzes WHERE created_by = auth.uid()
    )
    OR tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );


-- ===================================================================
-- 25. QUIZ ANSWERS - Add Policies (RLS enabled, ZERO policies existed)
-- ===================================================================

-- Students see own answers, teachers see answers for their quizzes, admins see all in tenant
CREATE POLICY quiz_answers_select
  ON quiz_answers FOR SELECT
  USING (
    attempt_id IN (
      SELECT id FROM quiz_attempts
      WHERE student_id = auth.uid()
    )
    OR attempt_id IN (
      SELECT qa.id FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.id
      WHERE q.created_by = auth.uid()
    )
    OR attempt_id IN (
      SELECT qa.id FROM quiz_attempts qa
      WHERE qa.tenant_id IN (
        SELECT tenant_id FROM tenant_memberships
        WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
      )
    )
  );

-- Students can insert their own answers
CREATE POLICY quiz_answers_insert_student
  ON quiz_answers FOR INSERT
  WITH CHECK (
    attempt_id IN (
      SELECT id FROM quiz_attempts
      WHERE student_id = auth.uid()
    )
  );

-- Teachers can update answers (for manual grading)
CREATE POLICY quiz_answers_update_teacher
  ON quiz_answers FOR UPDATE
  USING (
    attempt_id IN (
      SELECT qa.id FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.id
      WHERE q.created_by = auth.uid()
    )
    OR attempt_id IN (
      SELECT qa.id FROM quiz_attempts qa
      WHERE qa.tenant_id IN (
        SELECT tenant_id FROM tenant_memberships
        WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
      )
    )
  );


-- ===================================================================
-- DONE: All tables now have RLS enabled with appropriate policies
-- ===================================================================
