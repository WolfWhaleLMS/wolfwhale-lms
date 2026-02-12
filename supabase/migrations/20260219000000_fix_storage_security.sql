-- Fix overly permissive storage policies
-- 1. Fix submissions_teacher_read: scope to teacher's own courses
DROP POLICY IF EXISTS "submissions_teacher_read" ON storage.objects;
CREATE POLICY "submissions_teacher_read"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'submissions'
    AND EXISTS (
      SELECT 1 FROM courses
      WHERE courses.created_by = auth.uid()
      AND storage.objects.name LIKE courses.tenant_id || '/' || courses.id || '/%'
    )
  );

-- 2. Fix course_materials_authenticated_insert: restrict to teachers/admins only
DROP POLICY IF EXISTS "course_materials_authenticated_insert" ON storage.objects;
CREATE POLICY "course_materials_teacher_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'course-materials'
    AND EXISTS (
      SELECT 1 FROM tenant_memberships
      WHERE tenant_memberships.user_id = auth.uid()
      AND tenant_memberships.role IN ('teacher', 'admin', 'super_admin')
      AND tenant_memberships.status = 'active'
    )
  );

-- 3. Make course-materials bucket private (was public)
UPDATE storage.buckets
SET public = false
WHERE id = 'course-materials';
