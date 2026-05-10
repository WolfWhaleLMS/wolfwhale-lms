-- Tighten LMS course messaging so conversation writes and reads follow the
-- same course/guardian relationship boundaries enforced by the app service.

CREATE OR REPLACE FUNCTION public.can_start_course_conversation(target_tenant_id uuid, target_course_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH actor AS (
    SELECT role
    FROM public.tenant_memberships
    WHERE tenant_id = target_tenant_id
      AND user_id = auth.uid()
      AND status = 'active'
  )
  SELECT EXISTS (
    SELECT 1
    FROM actor
    WHERE role IN ('admin', 'super_admin')
      OR (
        role = 'teacher'
        AND EXISTS (
          SELECT 1
          FROM public.courses c
          WHERE c.id = target_course_id
            AND c.tenant_id = target_tenant_id
            AND c.created_by = auth.uid()
        )
      )
      OR (
        role = 'teacher'
        AND EXISTS (
          SELECT 1
          FROM public.course_enrollments ce
          WHERE ce.tenant_id = target_tenant_id
            AND ce.course_id = target_course_id
            AND ce.teacher_id = auth.uid()
            AND ce.status = 'active'
        )
      )
      OR (
        role = 'student'
        AND EXISTS (
          SELECT 1
          FROM public.course_enrollments ce
          WHERE ce.tenant_id = target_tenant_id
            AND ce.course_id = target_course_id
            AND ce.student_id = auth.uid()
            AND ce.status = 'active'
        )
      )
      OR (
        role = 'parent'
        AND EXISTS (
          SELECT 1
          FROM public.student_parents sp
          JOIN public.course_enrollments ce
            ON ce.tenant_id = sp.tenant_id
           AND ce.student_id = sp.student_id
          WHERE sp.tenant_id = target_tenant_id
            AND sp.parent_id = auth.uid()
            AND sp.status = 'active'
            AND ce.course_id = target_course_id
            AND ce.status = 'active'
        )
      )
  )
$$;

CREATE OR REPLACE FUNCTION public.can_create_course_conversation_member(
  target_conversation_id uuid,
  target_user_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH convo AS (
    SELECT id, tenant_id, course_id, created_by
    FROM public.conversations
    WHERE id = target_conversation_id
      AND created_by = auth.uid()
      AND type = 'direct'
      AND course_id IS NOT NULL
  ),
  actor AS (
    SELECT tm.role
    FROM public.tenant_memberships tm
    JOIN convo c ON c.tenant_id = tm.tenant_id
    WHERE tm.user_id = auth.uid()
      AND tm.status = 'active'
  ),
  target AS (
    SELECT tm.role
    FROM public.tenant_memberships tm
    JOIN convo c ON c.tenant_id = tm.tenant_id
    WHERE tm.user_id = target_user_id
      AND tm.status = 'active'
  )
  SELECT EXISTS (
    SELECT 1
    FROM convo c
    JOIN actor a ON true
    JOIN target t ON true
    WHERE target_user_id = auth.uid()
      OR a.role IN ('admin', 'super_admin')
      OR (
        a.role = 'teacher'
        AND t.role IN ('admin', 'super_admin')
      )
      OR (
        a.role = 'teacher'
        AND t.role = 'student'
        AND EXISTS (
          SELECT 1
          FROM public.course_enrollments ce
          WHERE ce.tenant_id = c.tenant_id
            AND ce.course_id = c.course_id
            AND ce.student_id = target_user_id
            AND ce.status = 'active'
            AND (
              ce.teacher_id = auth.uid()
              OR EXISTS (
                SELECT 1
                FROM public.courses course
                WHERE course.id = c.course_id
                  AND course.created_by = auth.uid()
              )
            )
        )
      )
      OR (
        a.role = 'teacher'
        AND t.role = 'parent'
        AND EXISTS (
          SELECT 1
          FROM public.student_parents sp
          JOIN public.course_enrollments ce
            ON ce.tenant_id = sp.tenant_id
           AND ce.student_id = sp.student_id
          WHERE sp.tenant_id = c.tenant_id
            AND sp.parent_id = target_user_id
            AND sp.status = 'active'
            AND ce.course_id = c.course_id
            AND ce.status = 'active'
            AND (
              ce.teacher_id = auth.uid()
              OR EXISTS (
                SELECT 1
                FROM public.courses course
                WHERE course.id = c.course_id
                  AND course.created_by = auth.uid()
              )
            )
        )
      )
      OR (
        a.role = 'student'
        AND t.role IN ('teacher', 'admin', 'super_admin')
        AND (
          t.role IN ('admin', 'super_admin')
          OR EXISTS (
            SELECT 1
            FROM public.course_enrollments ce
            WHERE ce.tenant_id = c.tenant_id
              AND ce.course_id = c.course_id
              AND ce.student_id = auth.uid()
              AND ce.status = 'active'
              AND ce.teacher_id = target_user_id
          )
          OR EXISTS (
            SELECT 1
            FROM public.courses course
            WHERE course.id = c.course_id
              AND course.created_by = target_user_id
          )
        )
      )
      OR (
        a.role = 'parent'
        AND t.role IN ('teacher', 'admin', 'super_admin')
        AND (
          t.role IN ('admin', 'super_admin')
          OR EXISTS (
            SELECT 1
            FROM public.student_parents sp
            JOIN public.course_enrollments ce
              ON ce.tenant_id = sp.tenant_id
             AND ce.student_id = sp.student_id
            WHERE sp.tenant_id = c.tenant_id
              AND sp.parent_id = auth.uid()
              AND sp.status = 'active'
              AND ce.course_id = c.course_id
              AND ce.status = 'active'
              AND ce.teacher_id = target_user_id
          )
          OR EXISTS (
            SELECT 1
            FROM public.student_parents sp
            JOIN public.course_enrollments ce
              ON ce.tenant_id = sp.tenant_id
             AND ce.student_id = sp.student_id
            JOIN public.courses course
              ON course.id = ce.course_id
            WHERE sp.tenant_id = c.tenant_id
              AND sp.parent_id = auth.uid()
              AND sp.status = 'active'
              AND ce.course_id = c.course_id
              AND ce.status = 'active'
              AND course.created_by = target_user_id
          )
        )
      )
  )
$$;

REVOKE ALL ON FUNCTION public.can_start_course_conversation(uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.can_start_course_conversation(uuid, uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.can_start_course_conversation(uuid, uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.can_create_course_conversation_member(uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.can_create_course_conversation_member(uuid, uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.can_create_course_conversation_member(uuid, uuid) TO authenticated;

DROP POLICY IF EXISTS conv_select_member ON public.conversations;
DROP POLICY IF EXISTS conv_select ON public.conversations;
CREATE POLICY conv_select ON public.conversations FOR SELECT
  USING (
    id IN (SELECT public.current_user_conversation_ids())
    OR EXISTS (
      SELECT 1
      FROM public.tenant_memberships tm
      WHERE tm.tenant_id = conversations.tenant_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('admin', 'super_admin')
        AND tm.status = 'active'
    )
  );

DROP POLICY IF EXISTS conv_insert_member ON public.conversations;
CREATE POLICY conv_insert_member ON public.conversations FOR INSERT
  WITH CHECK (
    created_by = auth.uid()
    AND type = 'direct'
    AND course_id IS NOT NULL
    AND public.can_start_course_conversation(tenant_id, course_id)
  );

DROP POLICY IF EXISTS cm_insert_allowed ON public.conversation_members;
CREATE POLICY cm_insert_allowed ON public.conversation_members FOR INSERT
  WITH CHECK (
    public.can_create_course_conversation_member(conversation_id, user_id)
  );
