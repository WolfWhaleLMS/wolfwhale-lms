-- Teachers assigned through course_enrollments must be able to read and
-- update submissions for their own active course/student enrollments. Some
-- older policy variants only allowed the course creator, which hides valid
-- resubmissions from co-teachers and imported course shells.

DROP POLICY IF EXISTS sub_select ON public.submissions;
DROP POLICY IF EXISTS submissions_select_student ON public.submissions;
DROP POLICY IF EXISTS submissions_select_scoped ON public.submissions;

CREATE POLICY submissions_select_scoped
  ON public.submissions
  FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.student_parents sp
      WHERE sp.tenant_id = submissions.tenant_id
        AND sp.student_id = submissions.student_id
        AND sp.parent_id = auth.uid()
        AND sp.status = 'active'
    )
    OR EXISTS (
      SELECT 1
      FROM public.assignments a
      JOIN public.course_enrollments ce
        ON ce.tenant_id = submissions.tenant_id
       AND ce.course_id = a.course_id
       AND ce.student_id = submissions.student_id
      WHERE a.id = submissions.assignment_id
        AND ce.teacher_id = auth.uid()
        AND ce.status = 'active'
    )
    OR EXISTS (
      SELECT 1
      FROM public.assignments a
      JOIN public.courses c
        ON c.tenant_id = submissions.tenant_id
       AND c.id = a.course_id
      WHERE a.id = submissions.assignment_id
        AND c.created_by = auth.uid()
    )
    OR EXISTS (
      SELECT 1
      FROM public.tenant_memberships tm
      WHERE tm.tenant_id = submissions.tenant_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('admin', 'super_admin')
        AND tm.status = 'active'
    )
  );

DROP POLICY IF EXISTS sub_update ON public.submissions;
DROP POLICY IF EXISTS submissions_update_teacher ON public.submissions;
DROP POLICY IF EXISTS submissions_update_scoped ON public.submissions;

CREATE POLICY submissions_update_scoped
  ON public.submissions
  FOR UPDATE
  TO authenticated
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.assignments a
      JOIN public.course_enrollments ce
        ON ce.tenant_id = submissions.tenant_id
       AND ce.course_id = a.course_id
       AND ce.student_id = submissions.student_id
      WHERE a.id = submissions.assignment_id
        AND ce.teacher_id = auth.uid()
        AND ce.status = 'active'
    )
    OR EXISTS (
      SELECT 1
      FROM public.tenant_memberships tm
      WHERE tm.tenant_id = submissions.tenant_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('admin', 'super_admin')
        AND tm.status = 'active'
    )
  )
  WITH CHECK (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.assignments a
      JOIN public.course_enrollments ce
        ON ce.tenant_id = submissions.tenant_id
       AND ce.course_id = a.course_id
       AND ce.student_id = submissions.student_id
      WHERE a.id = submissions.assignment_id
        AND ce.teacher_id = auth.uid()
        AND ce.status = 'active'
    )
    OR EXISTS (
      SELECT 1
      FROM public.tenant_memberships tm
      WHERE tm.tenant_id = submissions.tenant_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('admin', 'super_admin')
        AND tm.status = 'active'
    )
  );
