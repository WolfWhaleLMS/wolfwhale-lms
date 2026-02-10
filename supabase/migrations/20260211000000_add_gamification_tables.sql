-- ============================================================================
-- Gamification Tables Migration
-- Adds tables for XP tracking, coins, achievements, pets, and leaderboard
-- ============================================================================

-- 1. STUDENT XP (aggregate XP and level state per student)
CREATE TABLE student_xp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INT NOT NULL DEFAULT 0,
  current_level INT NOT NULL DEFAULT 1,
  current_tier VARCHAR(50) NOT NULL DEFAULT 'Novice',
  streak_days INT NOT NULL DEFAULT 0,
  last_login_date DATE,
  coins INT NOT NULL DEFAULT 0,
  total_coins_earned INT NOT NULL DEFAULT 0,
  total_coins_spent INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, student_id)
);

CREATE INDEX idx_student_xp_tenant ON student_xp(tenant_id);
CREATE INDEX idx_student_xp_student ON student_xp(student_id);
CREATE INDEX idx_student_xp_total_xp ON student_xp(total_xp DESC);

-- 2. XP TRANSACTIONS (individual XP earning events)
CREATE TABLE xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  source_type VARCHAR(50) NOT NULL,
  source_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_source_type CHECK (source_type IN ('assignment', 'lesson', 'daily', 'achievement', 'grade', 'streak', 'level_up', 'pet_interaction'))
);

CREATE INDEX idx_xp_transactions_tenant ON xp_transactions(tenant_id);
CREATE INDEX idx_xp_transactions_student ON xp_transactions(student_id);
CREATE INDEX idx_xp_transactions_created ON xp_transactions(created_at DESC);

-- 3. COIN TRANSACTIONS (individual coin earning/spending events)
CREATE TABLE coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  transaction_type VARCHAR(10) NOT NULL,
  source_type VARCHAR(50) NOT NULL,
  source_id VARCHAR(255),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_transaction_type CHECK (transaction_type IN ('earn', 'spend')),
  CONSTRAINT valid_coin_source CHECK (source_type IN ('xp', 'achievement', 'daily_bonus', 'level_up', 'cosmetic', 'pet_interaction', 'streak', 'admin'))
);

CREATE INDEX idx_coin_transactions_tenant ON coin_transactions(tenant_id);
CREATE INDEX idx_coin_transactions_student ON coin_transactions(student_id);
CREATE INDEX idx_coin_transactions_created ON coin_transactions(created_at DESC);

-- 4. STUDENT ACHIEVEMENTS (which achievements each student has unlocked)
CREATE TABLE student_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(100) NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  displayed BOOLEAN DEFAULT false,

  UNIQUE(tenant_id, student_id, achievement_id)
);

CREATE INDEX idx_student_achievements_tenant ON student_achievements(tenant_id);
CREATE INDEX idx_student_achievements_student ON student_achievements(student_id);
CREATE INDEX idx_student_achievements_achievement ON student_achievements(achievement_id);

-- 5. STUDENT PETS (virtual pet per student)
CREATE TABLE student_pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL DEFAULT 'Buddy',
  species VARCHAR(50) NOT NULL DEFAULT 'wolf',
  stage VARCHAR(50) NOT NULL DEFAULT 'hatchling',
  happiness INT NOT NULL DEFAULT 50,
  energy INT NOT NULL DEFAULT 50,
  knowledge INT NOT NULL DEFAULT 0,
  health INT NOT NULL DEFAULT 100,
  total_xp INT NOT NULL DEFAULT 0,
  equipped_items JSONB DEFAULT '[]'::jsonb,
  unlocked_cosmetics JSONB DEFAULT '[]'::jsonb,
  last_fed_at TIMESTAMPTZ,
  last_played_at TIMESTAMPTZ,
  last_studied_at TIMESTAMPTZ,
  last_rested_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, student_id),
  CONSTRAINT valid_species CHECK (species IN ('wolf', 'whale', 'hybrid', 'silver_wolf', 'timber_wolf', 'shadow_wolf', 'lunar_wolf', 'blue_whale', 'beluga', 'humpback', 'orca', 'wolphin', 'whale_wolf', 'aurora_guardian')),
  CONSTRAINT valid_stage CHECK (stage IN ('hatchling', 'juvenile', 'adolescent', 'majestic')),
  CONSTRAINT valid_happiness CHECK (happiness >= 0 AND happiness <= 100),
  CONSTRAINT valid_energy CHECK (energy >= 0 AND energy <= 100),
  CONSTRAINT valid_knowledge CHECK (knowledge >= 0 AND knowledge <= 100),
  CONSTRAINT valid_health CHECK (health >= 0 AND health <= 100)
);

CREATE INDEX idx_student_pets_tenant ON student_pets(tenant_id);
CREATE INDEX idx_student_pets_student ON student_pets(student_id);

-- 6. ROW LEVEL SECURITY
ALTER TABLE student_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_pets ENABLE ROW LEVEL SECURITY;

-- Students can read their own data, teachers/admins can read all in tenant
CREATE POLICY student_xp_select ON student_xp FOR SELECT USING (
  student_id = auth.uid() OR
  tenant_id IN (
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
  )
);

CREATE POLICY student_xp_insert ON student_xp FOR INSERT WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY student_xp_update ON student_xp FOR UPDATE USING (
  student_id = auth.uid() OR
  tenant_id IN (
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
  )
);

CREATE POLICY xp_transactions_select ON xp_transactions FOR SELECT USING (
  student_id = auth.uid() OR
  tenant_id IN (
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
  )
);

CREATE POLICY xp_transactions_insert ON xp_transactions FOR INSERT WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY coin_transactions_select ON coin_transactions FOR SELECT USING (
  student_id = auth.uid() OR
  tenant_id IN (
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
  )
);

CREATE POLICY coin_transactions_insert ON coin_transactions FOR INSERT WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY student_achievements_select ON student_achievements FOR SELECT USING (
  student_id = auth.uid() OR
  tenant_id IN (
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
  )
);

CREATE POLICY student_achievements_insert ON student_achievements FOR INSERT WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY student_pets_select ON student_pets FOR SELECT USING (
  student_id = auth.uid() OR
  tenant_id IN (
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
  )
);

CREATE POLICY student_pets_insert ON student_pets FOR INSERT WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY student_pets_update ON student_pets FOR UPDATE USING (
  student_id = auth.uid() OR
  tenant_id IN (
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
  )
);
