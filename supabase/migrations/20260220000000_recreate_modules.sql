-- Recreate modules table (was dropped by wipe_and_rebuild but never recreated on remote)
-- This is identical to 20260210000003_modules.sql but as a fresh migration

-- 1. CREATE MODULES TABLE
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

-- 2. ADD MODULE_ID TO LESSONS TABLE
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES modules(id) ON DELETE SET NULL;

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_tenant_id ON modules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_modules_order_index ON modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_modules_course_order ON modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_module_order ON lessons(module_id, order_index);

-- 4. ROW LEVEL SECURITY
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view modules in their tenant" ON modules
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Teachers can manage modules" ON modules
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid()
        AND status = 'active'
        AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

-- 5. UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_modules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_modules_updated_at ON modules;
CREATE TRIGGER set_modules_updated_at
  BEFORE UPDATE ON modules
  FOR EACH ROW
  EXECUTE FUNCTION update_modules_updated_at();

-- 6. Module lesson counts RPC (was removed from earlier migration due to missing table)
CREATE OR REPLACE FUNCTION get_module_lesson_counts(p_course_id UUID)
RETURNS TABLE(module_id UUID, lesson_count BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT l.module_id, COUNT(*)::BIGINT AS lesson_count
  FROM lessons l
  WHERE l.course_id = p_course_id AND l.module_id IS NOT NULL
  GROUP BY l.module_id;
$$;

GRANT EXECUTE ON FUNCTION get_module_lesson_counts(UUID) TO authenticated;
