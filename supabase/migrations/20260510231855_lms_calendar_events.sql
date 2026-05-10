-- Durable LMS calendar events for school-wide and course-scoped dates.
-- Assignment due dates remain sourced from assignments; this table covers
-- classes, school dates, showcases, trips, and teacher-created events.

CREATE TABLE IF NOT EXISTS public.calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  description text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  audience varchar(20) NOT NULL DEFAULT 'course',
  status varchar(20) NOT NULL DEFAULT 'published',
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT calendar_events_valid_audience CHECK (audience IN ('school', 'course')),
  CONSTRAINT calendar_events_valid_status CHECK (status IN ('published', 'cancelled')),
  CONSTRAINT calendar_events_course_audience_match CHECK (
    (course_id IS NULL AND audience = 'school')
    OR (course_id IS NOT NULL AND audience = 'course')
  ),
  CONSTRAINT calendar_events_ends_after_start CHECK (ends_at IS NULL OR ends_at >= starts_at)
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_tenant_starts
  ON public.calendar_events (tenant_id, starts_at);

CREATE INDEX IF NOT EXISTS idx_calendar_events_course_starts
  ON public.calendar_events (course_id, starts_at)
  WHERE course_id IS NOT NULL;

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON public.calendar_events TO authenticated;

DROP POLICY IF EXISTS calendar_events_select ON public.calendar_events;
CREATE POLICY calendar_events_select
  ON public.calendar_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.tenant_memberships tm
      WHERE tm.tenant_id = calendar_events.tenant_id
        AND tm.user_id = auth.uid()
        AND tm.status = 'active'
        AND tm.role IN ('admin', 'super_admin', 'teacher')
    )
    OR (
      calendar_events.course_id IS NULL
      AND EXISTS (
        SELECT 1
        FROM public.tenant_memberships tm
        WHERE tm.tenant_id = calendar_events.tenant_id
          AND tm.user_id = auth.uid()
          AND tm.status = 'active'
          AND tm.role IN ('student', 'parent')
      )
    )
    OR EXISTS (
      SELECT 1
      FROM public.course_enrollments ce
      WHERE ce.tenant_id = calendar_events.tenant_id
        AND ce.course_id = calendar_events.course_id
        AND ce.student_id = auth.uid()
        AND ce.status = 'active'
    )
    OR EXISTS (
      SELECT 1
      FROM public.student_parents sp
      JOIN public.course_enrollments ce
        ON ce.tenant_id = sp.tenant_id
       AND ce.student_id = sp.student_id
       AND ce.course_id = calendar_events.course_id
       AND ce.status = 'active'
      WHERE sp.tenant_id = calendar_events.tenant_id
        AND sp.parent_id = auth.uid()
        AND sp.status = 'active'
    )
  );

DROP POLICY IF EXISTS calendar_events_insert ON public.calendar_events;
CREATE POLICY calendar_events_insert
  ON public.calendar_events FOR INSERT
  WITH CHECK (
    created_by = auth.uid()
    AND (
      (calendar_events.course_id IS NULL AND calendar_events.audience = 'school')
      OR (calendar_events.course_id IS NOT NULL AND calendar_events.audience = 'course')
    )
    AND (
      calendar_events.course_id IS NULL
      OR EXISTS (
        SELECT 1
        FROM public.courses c
        WHERE c.id = calendar_events.course_id
          AND c.tenant_id = calendar_events.tenant_id
      )
    )
    AND (
      EXISTS (
        SELECT 1
        FROM public.tenant_memberships tm
        WHERE tm.tenant_id = calendar_events.tenant_id
          AND tm.user_id = auth.uid()
          AND tm.status = 'active'
          AND tm.role IN ('admin', 'super_admin')
      )
      OR (
        calendar_events.course_id IS NOT NULL
        AND EXISTS (
          SELECT 1
          FROM public.course_enrollments ce
          WHERE ce.tenant_id = calendar_events.tenant_id
            AND ce.course_id = calendar_events.course_id
            AND ce.teacher_id = auth.uid()
            AND ce.status = 'active'
        )
      )
    )
  );

DROP POLICY IF EXISTS calendar_events_update ON public.calendar_events;
CREATE POLICY calendar_events_update
  ON public.calendar_events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.tenant_memberships tm
      WHERE tm.tenant_id = calendar_events.tenant_id
        AND tm.user_id = auth.uid()
        AND tm.status = 'active'
        AND tm.role IN ('admin', 'super_admin')
    )
    OR (
      calendar_events.course_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.course_enrollments ce
        WHERE ce.tenant_id = calendar_events.tenant_id
          AND ce.course_id = calendar_events.course_id
          AND ce.teacher_id = auth.uid()
          AND ce.status = 'active'
      )
    )
  )
  WITH CHECK (
    (
      (calendar_events.course_id IS NULL AND calendar_events.audience = 'school')
      OR (calendar_events.course_id IS NOT NULL AND calendar_events.audience = 'course')
    )
    AND (
      calendar_events.course_id IS NULL
      OR EXISTS (
        SELECT 1
        FROM public.courses c
        WHERE c.id = calendar_events.course_id
          AND c.tenant_id = calendar_events.tenant_id
      )
    )
    AND (
      EXISTS (
        SELECT 1
        FROM public.tenant_memberships tm
        WHERE tm.tenant_id = calendar_events.tenant_id
          AND tm.user_id = auth.uid()
          AND tm.status = 'active'
          AND tm.role IN ('admin', 'super_admin')
      )
      OR (
        calendar_events.course_id IS NOT NULL
        AND calendar_events.created_by = auth.uid()
        AND EXISTS (
          SELECT 1
          FROM public.course_enrollments ce
          WHERE ce.tenant_id = calendar_events.tenant_id
            AND ce.course_id = calendar_events.course_id
            AND ce.teacher_id = auth.uid()
            AND ce.status = 'active'
        )
      )
    )
  );
