-- Add module_id and lesson_id to assignments for organizational attachment
-- These are optional — assignments can still exist at course level without being tied to a specific module/lesson.

ALTER TABLE assignments ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES modules(id) ON DELETE SET NULL;
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_assignments_module ON assignments(module_id);
CREATE INDEX IF NOT EXISTS idx_assignments_lesson ON assignments(lesson_id);
