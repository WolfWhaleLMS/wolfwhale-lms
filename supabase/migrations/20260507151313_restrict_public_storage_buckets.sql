-- Emergency launch hardening: reviewed school-data storage buckets must not be
-- public. Use authenticated policies or signed URLs for access instead of
-- public bucket exposure.

UPDATE storage.buckets
SET public = false
WHERE id IN ('course-thumbnails', 'profile-avatars', 'certificates');
-- Course materials are delivered through signed URLs, not public storage.
UPDATE storage.buckets
SET public = false
WHERE id IN ('course-materials', 'lesson-resources');
