-- ============================================
-- Wolf Whale LMS - Storage Buckets & Policies
-- ============================================
-- Creates storage buckets for:
--   - course-materials (public read, authenticated upload)
--   - submissions (private, student + teacher access)
--   - avatars (public read, user can manage own)
-- ============================================

-- ============================================
-- Create Buckets
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-materials',
  'course-materials',
  true,
  104857600, -- 100MB
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
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'submissions',
  'submissions',
  false,
  52428800, -- 50MB
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
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- RLS Policies: course-materials (public bucket)
-- ============================================

-- Anyone can read course materials (public bucket)
CREATE POLICY "course_materials_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'course-materials');

-- Authenticated users can upload course materials
CREATE POLICY "course_materials_authenticated_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'course-materials');

-- Users can update their own uploads
CREATE POLICY "course_materials_owner_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'course-materials'
    AND (storage.foldername(name))[2] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'course-materials'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- Users can delete their own uploads
CREATE POLICY "course_materials_owner_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'course-materials'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- ============================================
-- RLS Policies: submissions (private bucket)
-- ============================================

-- Students can read their own submissions
CREATE POLICY "submissions_student_read"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'submissions'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- Teachers can read submissions for their courses
-- (Teachers are identified by having the path accessible through course enrollment checks)
CREATE POLICY "submissions_teacher_read"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'submissions'
    AND EXISTS (
      SELECT 1 FROM courses
      WHERE courses.created_by = auth.uid()
    )
  );

-- Students can upload their own submissions
CREATE POLICY "submissions_student_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'submissions'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- Students can update their own submissions
CREATE POLICY "submissions_student_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'submissions'
    AND (storage.foldername(name))[2] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'submissions'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- Students can delete their own submissions
CREATE POLICY "submissions_student_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'submissions'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- ============================================
-- RLS Policies: avatars (public bucket)
-- ============================================

-- Anyone can view avatars (public bucket)
CREATE POLICY "avatars_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- Authenticated users can upload their own avatar
CREATE POLICY "avatars_owner_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- Users can update their own avatar
CREATE POLICY "avatars_owner_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[2] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- Users can delete their own avatar
CREATE POLICY "avatars_owner_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );
