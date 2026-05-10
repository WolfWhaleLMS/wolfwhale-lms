-- Durable fish companion profile storage for authenticated students.
-- The client keeps a local cache, but this table is the source of truth once
-- the student is signed in.

CREATE TABLE IF NOT EXISTS student_companion_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  species TEXT NOT NULL CHECK (
    species IN (
      'clownfish',
      'pufferfish'
    )
  ),
  pet_name VARCHAR(32) NOT NULL,
  hatch_stage TEXT NOT NULL CHECK (
    hatch_stage IN ('egg', 'crack-stage-1', 'crack-stage-2', 'almost-hatching', 'hatched')
  ),
  level INT NOT NULL DEFAULT 1 CHECK (level >= 1),
  xp INT NOT NULL DEFAULT 0 CHECK (xp >= 0),
  profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (tenant_id, student_id),
  CONSTRAINT student_companion_profile_json_object CHECK (jsonb_typeof(profile) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_student_companion_profiles_tenant ON student_companion_profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_student_companion_profiles_student ON student_companion_profiles(student_id);
CREATE INDEX IF NOT EXISTS idx_student_companion_profiles_updated ON student_companion_profiles(updated_at DESC);

ALTER TABLE student_companion_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS student_companion_profiles_select_own ON student_companion_profiles;
CREATE POLICY student_companion_profiles_select_own
  ON student_companion_profiles
  FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM tenant_memberships
      WHERE tenant_memberships.tenant_id = student_companion_profiles.tenant_id
        AND tenant_memberships.user_id = auth.uid()
        AND tenant_memberships.role = 'student'
        AND tenant_memberships.status = 'active'
    )
  );

DROP POLICY IF EXISTS student_companion_profiles_staff_read ON student_companion_profiles;
CREATE POLICY student_companion_profiles_staff_read
  ON student_companion_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM tenant_memberships
      WHERE tenant_memberships.tenant_id = student_companion_profiles.tenant_id
        AND tenant_memberships.user_id = auth.uid()
        AND tenant_memberships.role IN ('teacher', 'admin', 'super_admin')
        AND tenant_memberships.status = 'active'
    )
  );

DROP POLICY IF EXISTS student_companion_profiles_insert_own ON student_companion_profiles;
CREATE POLICY student_companion_profiles_insert_own
  ON student_companion_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM tenant_memberships
      WHERE tenant_memberships.tenant_id = student_companion_profiles.tenant_id
        AND tenant_memberships.user_id = auth.uid()
        AND tenant_memberships.role = 'student'
        AND tenant_memberships.status = 'active'
    )
  );

DROP POLICY IF EXISTS student_companion_profiles_update_own ON student_companion_profiles;
CREATE POLICY student_companion_profiles_update_own
  ON student_companion_profiles
  FOR UPDATE
  TO authenticated
  USING (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM tenant_memberships
      WHERE tenant_memberships.tenant_id = student_companion_profiles.tenant_id
        AND tenant_memberships.user_id = auth.uid()
        AND tenant_memberships.role = 'student'
        AND tenant_memberships.status = 'active'
    )
  )
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM tenant_memberships
      WHERE tenant_memberships.tenant_id = student_companion_profiles.tenant_id
        AND tenant_memberships.user_id = auth.uid()
        AND tenant_memberships.role = 'student'
        AND tenant_memberships.status = 'active'
    )
  );
