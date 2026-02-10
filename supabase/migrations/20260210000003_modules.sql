-- ===================================================================
-- Wolf Whale LMS - Modules Migration
-- ===================================================================
-- This migration adds a module system to organize lessons within courses.
-- A course can have multiple modules, and modules contain lessons.
-- Lessons can optionally belong to a module (module_id is nullable).

-- ===================================================================
-- 1. CREATE MODULES TABLE
-- ===================================================================

CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===================================================================
-- 2. ADD MODULE_ID TO LESSONS TABLE
-- ===================================================================

-- Add module_id column to lessons (nullable — lessons can exist without a module)
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES modules(id) ON DELETE SET NULL;

-- ===================================================================
-- 3. CREATE INDEXES
-- ===================================================================

CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_tenant_id ON modules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_modules_order_index ON modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);

-- ===================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ===================================================================

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view modules in their tenant
CREATE POLICY "Users can view modules in their tenant" ON modules
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Policy: Teachers can manage modules
CREATE POLICY "Teachers can manage modules" ON modules
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

-- ===================================================================
-- 5. UPDATED_AT TRIGGER FOR MODULES
-- ===================================================================

CREATE OR REPLACE FUNCTION update_modules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_modules_updated_at
  BEFORE UPDATE ON modules
  FOR EACH ROW
  EXECUTE FUNCTION update_modules_updated_at();
