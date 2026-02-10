-- Add missing columns to profiles table
-- full_name: generated from first_name + last_name for easy querying
-- grade_level: student's grade level (if not already present)

-- Add grade_level if missing
DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN grade_level VARCHAR(10);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add full_name as a stored generated column
-- This auto-computes from first_name + last_name so all existing queries work
DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN full_name TEXT GENERATED ALWAYS AS (
    TRIM(COALESCE(first_name, '') || ' ' || COALESCE(last_name, ''))
  ) STORED;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;
