-- Align private student submission uploads with the server-side path:
--   <tenant_id>/<student_id>/<course_id>/<assignment_id>/<filename>
-- This lets students upload with their own session while teachers/admins
-- access submitted files only through scoped course or school membership.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'submissions',
  'submissions',
  false,
  26214400,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'audio/mpeg',
    'application/zip'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public = false,
    file_size_limit = 26214400,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

UPDATE storage.buckets
SET public = false
WHERE id = 'submissions';

DROP POLICY IF EXISTS "submissions_student_read" ON storage.objects;
CREATE POLICY "submissions_student_read"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'submissions'
    AND (storage.foldername(name))[2] = auth.uid()::text
    AND EXISTS (
      SELECT 1
      FROM public.course_enrollments ce
      WHERE ce.tenant_id::text = (storage.foldername(storage.objects.name))[1]
        AND ce.student_id = auth.uid()
        AND ce.course_id::text = (storage.foldername(storage.objects.name))[3]
        AND ce.status = 'active'
    )
  );

DROP POLICY IF EXISTS "submissions_student_insert" ON storage.objects;
CREATE POLICY "submissions_student_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'submissions'
    AND (storage.foldername(name))[2] = auth.uid()::text
    AND EXISTS (
      SELECT 1
      FROM public.course_enrollments ce
      WHERE ce.tenant_id::text = (storage.foldername(storage.objects.name))[1]
        AND ce.student_id = auth.uid()
        AND ce.course_id::text = (storage.foldername(storage.objects.name))[3]
        AND ce.status = 'active'
    )
  );

DROP POLICY IF EXISTS "submissions_student_update" ON storage.objects;
CREATE POLICY "submissions_student_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'submissions'
    AND (storage.foldername(name))[2] = auth.uid()::text
    AND EXISTS (
      SELECT 1
      FROM public.course_enrollments ce
      WHERE ce.tenant_id::text = (storage.foldername(storage.objects.name))[1]
        AND ce.student_id = auth.uid()
        AND ce.course_id::text = (storage.foldername(storage.objects.name))[3]
        AND ce.status = 'active'
    )
  )
  WITH CHECK (
    bucket_id = 'submissions'
    AND (storage.foldername(name))[2] = auth.uid()::text
    AND EXISTS (
      SELECT 1
      FROM public.course_enrollments ce
      WHERE ce.tenant_id::text = (storage.foldername(storage.objects.name))[1]
        AND ce.student_id = auth.uid()
        AND ce.course_id::text = (storage.foldername(storage.objects.name))[3]
        AND ce.status = 'active'
    )
  );

DROP POLICY IF EXISTS "submissions_student_delete" ON storage.objects;
CREATE POLICY "submissions_student_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'submissions'
    AND (storage.foldername(name))[2] = auth.uid()::text
    AND EXISTS (
      SELECT 1
      FROM public.course_enrollments ce
      WHERE ce.tenant_id::text = (storage.foldername(storage.objects.name))[1]
        AND ce.student_id = auth.uid()
        AND ce.course_id::text = (storage.foldername(storage.objects.name))[3]
        AND ce.status = 'active'
    )
  );

DROP POLICY IF EXISTS "submissions_teacher_read" ON storage.objects;
CREATE POLICY "submissions_teacher_read"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'submissions'
    AND (
      EXISTS (
        SELECT 1
        FROM public.tenant_memberships tm
        WHERE tm.tenant_id::text = (storage.foldername(storage.objects.name))[1]
          AND tm.user_id = auth.uid()
          AND tm.role IN ('admin', 'super_admin')
          AND tm.status = 'active'
      )
      OR EXISTS (
        SELECT 1
        FROM public.course_enrollments ce
        WHERE ce.tenant_id::text = (storage.foldername(storage.objects.name))[1]
          AND ce.student_id::text = (storage.foldername(storage.objects.name))[2]
          AND ce.course_id::text = (storage.foldername(storage.objects.name))[3]
          AND ce.teacher_id = auth.uid()
          AND ce.status = 'active'
      )
      OR EXISTS (
        SELECT 1
        FROM public.courses c
        WHERE c.tenant_id::text = (storage.foldername(storage.objects.name))[1]
          AND c.id::text = (storage.foldername(storage.objects.name))[3]
          AND c.created_by = auth.uid()
      )
    )
  );
