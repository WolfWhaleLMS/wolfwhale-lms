-- Emergency launch hardening: remove broad anonymous storage object read
-- policy. Reviewed school-data buckets should use authenticated policies or
-- signed URLs.

DROP POLICY IF EXISTS "Anyone can view course thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "course_materials_public_read" ON storage.objects;
DROP POLICY IF EXISTS "lesson_resources_public_read" ON storage.objects;

UPDATE storage.buckets
SET public = false
WHERE id IN ('course-thumbnails', 'profile-avatars', 'certificates', 'course-materials', 'lesson-resources');
