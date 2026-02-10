-- Add max_users column to tenants for seat-based billing
-- Add branding JSONB column for school customization

-- Add max_users (default 50 for starter plan)
DO $$ BEGIN
  ALTER TABLE tenants ADD COLUMN max_users INTEGER DEFAULT 50;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add branding JSONB column for logo, colors, etc.
DO $$ BEGIN
  ALTER TABLE tenants ADD COLUMN branding JSONB DEFAULT '{}'::jsonb;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;
