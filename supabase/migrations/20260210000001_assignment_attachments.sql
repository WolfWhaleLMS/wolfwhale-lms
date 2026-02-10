-- ============================================
-- Wolf Whale LMS - Assignment Attachments
-- ============================================
-- Adds a JSONB column to assignments for teacher-uploaded attachments.
-- Each attachment object has: { url, fileName, fileSize, fileType }
-- ============================================

ALTER TABLE assignments
  ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb;

-- Add a comment for documentation
COMMENT ON COLUMN assignments.attachments IS 'Array of attachment objects: [{url, fileName, fileSize, fileType}]';
