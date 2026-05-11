-- Real attempt records for JSON-backed textbook quiz blocks.
-- These are separate from course-level quizzes because textbook content stores
-- inline questions as chapter JSON, not durable quiz/question rows.

CREATE TABLE IF NOT EXISTS public.student_textbook_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  textbook_id UUID NOT NULL REFERENCES public.textbooks(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.textbook_chapters(id) ON DELETE CASCADE,
  quiz_key TEXT NOT NULL,
  block_index INTEGER NOT NULL CHECK (block_index >= 0),
  question_text TEXT NOT NULL,
  selected_option_index INTEGER NOT NULL CHECK (selected_option_index >= 0),
  correct_option_index INTEGER CHECK (correct_option_index >= 0),
  is_correct BOOLEAN NOT NULL DEFAULT false,
  attempt_count INTEGER NOT NULL DEFAULT 1 CHECK (attempt_count >= 1),
  first_answered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_answered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_answer_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (tenant_id, student_id, chapter_id, quiz_key)
);

CREATE INDEX IF NOT EXISTS idx_stqa_tenant_student_last
  ON public.student_textbook_quiz_attempts(tenant_id, student_id, last_answered_at DESC);

CREATE INDEX IF NOT EXISTS idx_stqa_chapter
  ON public.student_textbook_quiz_attempts(chapter_id);

CREATE INDEX IF NOT EXISTS idx_stqa_textbook
  ON public.student_textbook_quiz_attempts(tenant_id, textbook_id);

ALTER TABLE public.student_textbook_quiz_attempts ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON public.student_textbook_quiz_attempts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_textbook_quiz_attempts TO service_role;

DROP POLICY IF EXISTS student_textbook_quiz_attempts_select_relevant
  ON public.student_textbook_quiz_attempts;
CREATE POLICY student_textbook_quiz_attempts_select_relevant
  ON public.student_textbook_quiz_attempts
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IS NOT NULL
    AND (
      student_id = auth.uid()
      OR EXISTS (
        SELECT 1
        FROM public.student_textbook_assignments sta
        JOIN public.course_enrollments ce
          ON ce.course_id = sta.course_id
         AND ce.student_id = sta.student_id
         AND ce.tenant_id = sta.tenant_id
        WHERE sta.tenant_id = student_textbook_quiz_attempts.tenant_id
          AND sta.student_id = student_textbook_quiz_attempts.student_id
          AND sta.textbook_id = student_textbook_quiz_attempts.textbook_id
          AND ce.teacher_id = auth.uid()
          AND ce.status = 'active'
      )
      OR tenant_id IN (
        SELECT tm.tenant_id
        FROM public.tenant_memberships tm
        WHERE tm.user_id = auth.uid()
          AND tm.role IN ('admin', 'super_admin')
          AND tm.status = 'active'
      )
    )
  );

DROP POLICY IF EXISTS student_textbook_quiz_attempts_insert_student
  ON public.student_textbook_quiz_attempts;
CREATE POLICY student_textbook_quiz_attempts_insert_student
  ON public.student_textbook_quiz_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND student_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.tenant_memberships tm
      WHERE tm.tenant_id = student_textbook_quiz_attempts.tenant_id
        AND tm.user_id = auth.uid()
        AND tm.role = 'student'
        AND tm.status = 'active'
    )
    AND EXISTS (
      SELECT 1
      FROM public.textbook_chapters tc
      WHERE tc.id = student_textbook_quiz_attempts.chapter_id
        AND tc.tenant_id = student_textbook_quiz_attempts.tenant_id
        AND tc.textbook_id = student_textbook_quiz_attempts.textbook_id
        AND tc.is_published = true
    )
  );

DROP POLICY IF EXISTS student_textbook_quiz_attempts_update_student
  ON public.student_textbook_quiz_attempts;
CREATE POLICY student_textbook_quiz_attempts_update_student
  ON public.student_textbook_quiz_attempts
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IS NOT NULL
    AND student_id = auth.uid()
  )
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND student_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.tenant_memberships tm
      WHERE tm.tenant_id = student_textbook_quiz_attempts.tenant_id
        AND tm.user_id = auth.uid()
        AND tm.role = 'student'
        AND tm.status = 'active'
    )
  );

DROP POLICY IF EXISTS student_textbook_quiz_attempts_delete_admin
  ON public.student_textbook_quiz_attempts;
CREATE POLICY student_textbook_quiz_attempts_delete_admin
  ON public.student_textbook_quiz_attempts
  FOR DELETE
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tm.tenant_id
      FROM public.tenant_memberships tm
      WHERE tm.user_id = auth.uid()
        AND tm.role IN ('admin', 'super_admin')
        AND tm.status = 'active'
    )
  );
