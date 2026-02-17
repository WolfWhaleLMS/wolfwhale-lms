-- ============================================================================
-- Pixel Pet System: Eggs & Hatched Walking Pets
-- Students earn eggs through XP milestones, achievements, and login streaks.
-- Eggs hatch after 24 hours into walking pixel creatures (max 7 per student).
--
-- Creature types (1-7), names are placeholders until pixel art is uploaded:
--   1=Rex, 2=Spike, 3=Blaze, 4=Bubbles, 5=Finn, 6=Luna, 7=Storm
--
-- NOTE: This is separate from the existing student_pets Tamagotchi system.
-- These tables use the "pixel_" prefix to avoid conflicts.
-- ============================================================================

-- 1. PIXEL EGGS (pending hatch timers)
CREATE TABLE IF NOT EXISTS pixel_eggs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creature_type SMALLINT NOT NULL CHECK (creature_type BETWEEN 1 AND 7),
  source TEXT NOT NULL CHECK (source IN ('xp_milestone', 'achievement', 'login_streak')),
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  hatches_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  hatched BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pixel_eggs_tenant ON pixel_eggs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pixel_eggs_student ON pixel_eggs(student_id);
CREATE INDEX IF NOT EXISTS idx_pixel_eggs_pending ON pixel_eggs(student_id, hatched) WHERE NOT hatched;

-- 2. PIXEL PETS (hatched walking creatures)
CREATE TABLE IF NOT EXISTS pixel_pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creature_type SMALLINT NOT NULL CHECK (creature_type BETWEEN 1 AND 7),
  name VARCHAR(20),
  walk_speed FLOAT NOT NULL DEFAULT 18.0,
  hatched_from UUID REFERENCES pixel_eggs(id) ON DELETE SET NULL,
  hatched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pixel_pets_tenant ON pixel_pets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pixel_pets_student ON pixel_pets(student_id);

-- 3. ROW LEVEL SECURITY
ALTER TABLE pixel_eggs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pixel_pets ENABLE ROW LEVEL SECURITY;

-- Students can read their own eggs
CREATE POLICY pixel_eggs_select ON pixel_eggs
  FOR SELECT USING (
    student_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

-- Students can update their own eggs (to trigger hatching)
CREATE POLICY pixel_eggs_update ON pixel_eggs
  FOR UPDATE USING (student_id = auth.uid());

-- Insert via service role (server actions with admin client)
CREATE POLICY pixel_eggs_insert ON pixel_eggs
  FOR INSERT WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Students can read their own pets
CREATE POLICY pixel_pets_select ON pixel_pets
  FOR SELECT USING (
    student_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

-- Students can update their own pets (rename)
CREATE POLICY pixel_pets_update ON pixel_pets
  FOR UPDATE USING (student_id = auth.uid());

-- Insert via service role (server actions with admin client)
CREATE POLICY pixel_pets_insert ON pixel_pets
  FOR INSERT WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );
