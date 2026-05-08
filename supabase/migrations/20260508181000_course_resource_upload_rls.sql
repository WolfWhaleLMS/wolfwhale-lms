-- Allow assigned teachers to attach course resources while keeping storage paths
-- tenant-scoped. The API layer still validates course ownership/assignment before
-- upload; these policies make the database/storage boundary match that contract.

DROP POLICY IF EXISTS "course_materials_public_read" ON storage.objects;
DROP POLICY IF EXISTS "lesson_resources_public_read" ON storage.objects;

DROP POLICY IF EXISTS la_insert_teacher ON lesson_attachments;
CREATE POLICY la_insert_teacher
  ON lesson_attachments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    lesson_id IN (
      SELECT l.id
      FROM lessons l
      WHERE l.created_by = auth.uid()
        OR l.tenant_id IN (
          SELECT tenant_id
          FROM tenant_memberships
          WHERE user_id = auth.uid()
            AND role IN ('admin', 'super_admin')
            AND status = 'active'
        )
        OR EXISTS (
          SELECT 1
          FROM course_enrollments ce
          WHERE ce.tenant_id = l.tenant_id
            AND ce.course_id = l.course_id
            AND ce.teacher_id = auth.uid()
            AND ce.status = 'active'
        )
    )
  );

DROP POLICY IF EXISTS la_delete_teacher ON lesson_attachments;
CREATE POLICY la_delete_teacher
  ON lesson_attachments
  FOR DELETE
  TO authenticated
  USING (
    lesson_id IN (
      SELECT l.id
      FROM lessons l
      WHERE l.created_by = auth.uid()
        OR l.tenant_id IN (
          SELECT tenant_id
          FROM tenant_memberships
          WHERE user_id = auth.uid()
            AND role IN ('admin', 'super_admin')
            AND status = 'active'
        )
        OR EXISTS (
          SELECT 1
          FROM course_enrollments ce
          WHERE ce.tenant_id = l.tenant_id
            AND ce.course_id = l.course_id
            AND ce.teacher_id = auth.uid()
            AND ce.status = 'active'
        )
    )
  );

DROP POLICY IF EXISTS "course_materials_teacher_insert" ON storage.objects;
CREATE POLICY "course_materials_teacher_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN ('course-materials', 'lesson-resources')
    AND EXISTS (
      SELECT 1
      FROM tenant_memberships
      WHERE tenant_memberships.user_id = auth.uid()
        AND tenant_memberships.role IN ('teacher', 'admin', 'super_admin')
        AND tenant_memberships.status = 'active'
        AND tenant_memberships.tenant_id::text = (storage.foldername(storage.objects.name))[1]
    )
  );
