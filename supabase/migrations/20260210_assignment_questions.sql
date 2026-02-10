-- Add questions JSONB column to assignments table
-- This enables storing quiz/exam questions directly in the assignment

ALTER TABLE assignments ADD COLUMN IF NOT EXISTS questions JSONB DEFAULT '[]'::jsonb;

-- Add a GIN index for efficient JSONB queries
CREATE INDEX IF NOT EXISTS idx_assignments_questions ON assignments USING GIN (questions);

COMMENT ON COLUMN assignments.questions IS 'JSONB array of question objects for quiz/exam type assignments';
