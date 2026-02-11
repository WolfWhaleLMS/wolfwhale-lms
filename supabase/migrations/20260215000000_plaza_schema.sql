-- ============================================================================
-- Virtual Plaza Schema Migration
-- Wolf Whale LMS - Club Penguin-Inspired Virtual Plaza
--
-- Creates 13 tables for the plaza system:
--   1.  plaza_avatars              - Player avatars with position & economy
--   2.  plaza_avatar_items         - Item catalog (cosmetics store)
--   3.  plaza_avatar_inventory     - Owned items per user
--   4.  plaza_rooms                - World rooms/zones
--   5.  plaza_chat_phrases         - Pre-scripted safe chat
--   6.  plaza_mini_games           - Game definitions
--   7.  plaza_game_sessions        - Active/past game sessions
--   8.  plaza_game_scores          - Individual player scores
--   9.  plaza_token_transactions   - Token ledger (immutable)
--   10. plaza_study_sessions       - Collaborative study (pomodoro)
--   11. plaza_study_session_members- Study session participants
--   12. plaza_documentary_sessions - Theater / video sessions
--   13. plaza_documentary_viewers  - Theater attendance tracking
--
-- Also includes: indexes, RLS policies, triggers, realtime, seed data
-- ============================================================================


-- ===================================================================
-- 1. PLAZA_AVATARS (Player Avatars)
-- Each user gets one avatar per tenant.
-- ===================================================================

CREATE TABLE plaza_avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Display
  display_name VARCHAR(50) NOT NULL,
  avatar_config JSONB NOT NULL DEFAULT '{
    "body_color": "#4F46E5",
    "body_shape": "circle",
    "eye_style": "default",
    "hat": null,
    "outfit": null,
    "accessory": null,
    "trail_effect": null,
    "emote": null,
    "background_id": null
  }'::jsonb,

  -- Position in the world (last known location)
  current_room VARCHAR(100) DEFAULT 'plaza_main',
  pos_x NUMERIC(10, 2) DEFAULT 400,
  pos_y NUMERIC(10, 2) DEFAULT 300,
  facing_direction VARCHAR(10) DEFAULT 'down',

  -- Economy
  token_balance INT DEFAULT 0,
  tokens_earned_total INT DEFAULT 0,
  tokens_spent_total INT DEFAULT 0,

  -- Stats
  avatar_level INT DEFAULT 1,
  games_played INT DEFAULT 0,
  games_won INT DEFAULT 0,
  study_sessions_joined INT DEFAULT 0,
  time_in_plaza_seconds INT DEFAULT 0,
  last_daily_login DATE,
  daily_login_streak INT DEFAULT 0,

  -- Status
  is_online BOOLEAN DEFAULT false,
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  status_message VARCHAR(100),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, user_id),
  CONSTRAINT valid_direction CHECK (facing_direction IN ('up', 'down', 'left', 'right'))
);

CREATE INDEX idx_pa_tenant ON plaza_avatars(tenant_id);
CREATE INDEX idx_pa_user ON plaza_avatars(user_id);
CREATE INDEX idx_pa_room ON plaza_avatars(tenant_id, current_room);
CREATE INDEX idx_pa_online ON plaza_avatars(tenant_id, is_online) WHERE is_online = true;


-- ===================================================================
-- 2. PLAZA_AVATAR_ITEMS (Item Catalog)
-- Global and tenant-specific cosmetic items for the Avatar Store.
-- ===================================================================

CREATE TABLE plaza_avatar_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,

  -- Item definition
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  slot VARCHAR(50) NOT NULL,
  rarity VARCHAR(50) NOT NULL DEFAULT 'bronze',

  -- Visual
  sprite_key VARCHAR(100) NOT NULL,
  preview_url TEXT,
  color_hex VARCHAR(7),
  animation_data JSONB,

  -- Economy
  price_tokens INT NOT NULL DEFAULT 0,
  is_free BOOLEAN DEFAULT false,

  -- Availability
  is_global BOOLEAN DEFAULT false,
  is_limited_edition BOOLEAN DEFAULT false,
  available_from TIMESTAMPTZ,
  available_until TIMESTAMPTZ,
  max_purchases INT,
  current_purchases INT DEFAULT 0,

  -- Requirements
  min_avatar_level INT DEFAULT 1,
  required_achievement_id UUID REFERENCES achievements(id) ON DELETE SET NULL,

  -- Metadata
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_category CHECK (category IN (
    'hat', 'outfit', 'accessory', 'color_palette', 'background',
    'trail_effect', 'emote', 'eye_style', 'body_shape'
  )),
  CONSTRAINT valid_slot CHECK (slot IN (
    'head', 'body', 'hand', 'color', 'background',
    'trail', 'emote', 'eyes', 'shape'
  )),
  CONSTRAINT valid_rarity CHECK (rarity IN ('bronze', 'silver', 'gold', 'platinum')),
  CONSTRAINT valid_price CHECK (price_tokens >= 0)
);

CREATE INDEX idx_pai_tenant ON plaza_avatar_items(tenant_id);
CREATE INDEX idx_pai_category ON plaza_avatar_items(category);
CREATE INDEX idx_pai_rarity ON plaza_avatar_items(rarity);
CREATE INDEX idx_pai_slot ON plaza_avatar_items(slot);
CREATE INDEX idx_pai_global ON plaza_avatar_items(is_global) WHERE is_global = true;
CREATE INDEX idx_pai_active ON plaza_avatar_items(is_active) WHERE is_active = true;


-- ===================================================================
-- 3. PLAZA_AVATAR_INVENTORY (Owned Items)
-- Tracks which items each user owns and which are currently equipped.
-- ===================================================================

CREATE TABLE plaza_avatar_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES plaza_avatar_items(id) ON DELETE CASCADE,

  is_equipped BOOLEAN DEFAULT false,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  price_paid INT DEFAULT 0,

  UNIQUE(user_id, item_id)
);

CREATE INDEX idx_inv_user ON plaza_avatar_inventory(user_id);
CREATE INDEX idx_inv_item ON plaza_avatar_inventory(item_id);
CREATE INDEX idx_inv_equipped ON plaza_avatar_inventory(user_id, is_equipped) WHERE is_equipped = true;


-- ===================================================================
-- 4. PLAZA_ROOMS (World Rooms/Zones)
-- Defines the rooms/zones in the virtual plaza.
-- ===================================================================

CREATE TABLE plaza_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,

  slug VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  room_type VARCHAR(50) NOT NULL,

  -- Map data
  map_config JSONB NOT NULL DEFAULT '{
    "width": 800,
    "height": 600,
    "tile_size": 32,
    "collision_map": [],
    "spawn_point": {"x": 400, "y": 300},
    "buildings": [],
    "decorations": [],
    "walkable_bounds": {"x1": 0, "y1": 0, "x2": 800, "y2": 600}
  }'::jsonb,

  -- Visual
  background_color VARCHAR(7) DEFAULT '#1a1a2e',
  background_image_url TEXT,
  ambient_sound VARCHAR(100),

  -- Limits
  max_occupants INT DEFAULT 50,
  is_global BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,

  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_room_type CHECK (room_type IN (
    'hub', 'game_house', 'store', 'study_hall',
    'theater', 'park', 'library', 'custom'
  ))
);

CREATE INDEX idx_pr_tenant ON plaza_rooms(tenant_id);
CREATE INDEX idx_pr_slug ON plaza_rooms(slug);
CREATE INDEX idx_pr_type ON plaza_rooms(room_type);
CREATE INDEX idx_pr_global ON plaza_rooms(is_global) WHERE is_global = true;


-- ===================================================================
-- 5. PLAZA_CHAT_PHRASES (Pre-Scripted Chat)
-- Approved chat phrases for school safety (no free-text chat).
-- ===================================================================

CREATE TABLE plaza_chat_phrases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,

  phrase TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  emoji_icon VARCHAR(10),

  is_global BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_category CHECK (category IN (
    'greeting', 'encouragement', 'study', 'fun',
    'farewell', 'teamwork', 'celebration', 'question'
  ))
);

CREATE INDEX idx_pcp_category ON plaza_chat_phrases(category);
CREATE INDEX idx_pcp_global ON plaza_chat_phrases(is_global) WHERE is_global = true;


-- ===================================================================
-- 6. PLAZA_MINI_GAMES (Game Definitions)
-- Defines the available mini games. Each game is a self-contained module.
-- ===================================================================

CREATE TABLE plaza_mini_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,

  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT,
  subject VARCHAR(100),
  icon VARCHAR(100),
  color_hex VARCHAR(7) DEFAULT '#6366f1',

  -- Game config
  game_type VARCHAR(50) NOT NULL,
  config JSONB DEFAULT '{}'::jsonb,
  min_players INT DEFAULT 1,
  max_players INT DEFAULT 1,
  duration_seconds INT DEFAULT 60,

  -- Rewards
  token_reward_base INT DEFAULT 5,
  token_reward_win INT DEFAULT 15,
  token_reward_perfect INT DEFAULT 30,
  xp_reward INT DEFAULT 10,

  -- Availability
  is_global BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  min_grade_level VARCHAR(10),
  max_grade_level VARCHAR(10),

  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_game_type CHECK (game_type IN (
    'math_challenge', 'vocabulary_builder', 'typing_race',
    'science_quiz', 'memory_match', 'word_scramble',
    'geography_dash', 'speed_math', 'spelling_bee', 'trivia'
  ))
);

CREATE INDEX idx_pmg_slug ON plaza_mini_games(slug);
CREATE INDEX idx_pmg_type ON plaza_mini_games(game_type);
CREATE INDEX idx_pmg_subject ON plaza_mini_games(subject);
CREATE INDEX idx_pmg_global ON plaza_mini_games(is_global) WHERE is_global = true;


-- ===================================================================
-- 7. PLAZA_GAME_SESSIONS (Active/Past Game Sessions)
-- Tracks multiplayer game lobbies and solo game sessions.
-- ===================================================================

CREATE TABLE plaza_game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES plaza_mini_games(id) ON DELETE CASCADE,

  -- Session info
  host_user_id UUID NOT NULL REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'waiting',
  mode VARCHAR(50) DEFAULT 'solo',

  -- Config for this session
  difficulty VARCHAR(20) DEFAULT 'medium',
  round_count INT DEFAULT 1,
  current_round INT DEFAULT 0,
  game_state JSONB DEFAULT '{}'::jsonb,

  -- Timing
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  max_duration_seconds INT DEFAULT 120,

  -- Room context (which plaza room this was started from)
  room_slug VARCHAR(100),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN (
    'waiting', 'countdown', 'in_progress', 'finished', 'cancelled'
  )),
  CONSTRAINT valid_mode CHECK (mode IN ('solo', 'multiplayer', 'coop')),
  CONSTRAINT valid_difficulty CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

CREATE INDEX idx_pgs_tenant ON plaza_game_sessions(tenant_id);
CREATE INDEX idx_pgs_game ON plaza_game_sessions(game_id);
CREATE INDEX idx_pgs_host ON plaza_game_sessions(host_user_id);
CREATE INDEX idx_pgs_status ON plaza_game_sessions(status);
CREATE INDEX idx_pgs_created ON plaza_game_sessions(created_at DESC);


-- ===================================================================
-- 8. PLAZA_GAME_SCORES (Individual Player Scores)
-- Per-player scores within a game session.
-- ===================================================================

CREATE TABLE plaza_game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES plaza_game_sessions(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES plaza_mini_games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Scoring
  score INT DEFAULT 0,
  accuracy_percent NUMERIC(5, 2),
  time_taken_seconds INT,
  correct_answers INT DEFAULT 0,
  total_questions INT DEFAULT 0,
  rank_in_session INT,

  -- Rewards earned
  tokens_earned INT DEFAULT 0,
  xp_earned INT DEFAULT 0,
  is_high_score BOOLEAN DEFAULT false,
  is_personal_best BOOLEAN DEFAULT false,

  completed_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(session_id, user_id)
);

CREATE INDEX idx_score_user ON plaza_game_scores(user_id);
CREATE INDEX idx_score_game ON plaza_game_scores(game_id);
CREATE INDEX idx_score_session ON plaza_game_scores(session_id);
CREATE INDEX idx_score_high ON plaza_game_scores(game_id, score DESC);
CREATE INDEX idx_score_tenant ON plaza_game_scores(tenant_id);


-- ===================================================================
-- 9. PLAZA_TOKEN_TRANSACTIONS (Token Ledger)
-- Immutable ledger of all token earning and spending events.
-- ===================================================================

CREATE TABLE plaza_token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  amount INT NOT NULL,
  balance_after INT NOT NULL,
  transaction_type VARCHAR(50) NOT NULL,
  source_type VARCHAR(100),
  source_id UUID,
  description VARCHAR(255),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_type CHECK (transaction_type IN (
    'earn_game', 'earn_high_score', 'earn_daily_login',
    'earn_study_streak', 'earn_quiz_performance', 'earn_achievement',
    'earn_study_session', 'earn_event_bonus',
    'spend_store', 'spend_gift',
    'admin_grant', 'admin_deduct', 'system_adjustment'
  ))
);

CREATE INDEX idx_ptt_user ON plaza_token_transactions(user_id);
CREATE INDEX idx_ptt_tenant ON plaza_token_transactions(tenant_id);
CREATE INDEX idx_ptt_type ON plaza_token_transactions(transaction_type);
CREATE INDEX idx_ptt_created ON plaza_token_transactions(created_at DESC);
CREATE INDEX idx_ptt_source ON plaza_token_transactions(source_type, source_id);


-- ===================================================================
-- 10. PLAZA_STUDY_SESSIONS (Collaborative Study)
-- Group study sessions held in the Plaza study hall.
-- ===================================================================

CREATE TABLE plaza_study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Session config
  host_user_id UUID NOT NULL REFERENCES auth.users(id),
  title VARCHAR(255) DEFAULT 'Study Session',
  subject VARCHAR(100),
  session_type VARCHAR(50) DEFAULT 'pomodoro',

  -- Pomodoro config
  work_minutes INT DEFAULT 25,
  break_minutes INT DEFAULT 5,
  total_rounds INT DEFAULT 4,
  current_round INT DEFAULT 0,

  -- Timer state
  timer_state VARCHAR(50) DEFAULT 'idle',
  timer_started_at TIMESTAMPTZ,
  timer_paused_at TIMESTAMPTZ,
  timer_remaining_seconds INT,

  -- Status
  status VARCHAR(50) DEFAULT 'waiting',
  max_participants INT DEFAULT 10,
  current_participants INT DEFAULT 0,

  -- XP bonuses
  xp_bonus_multiplier NUMERIC(3, 2) DEFAULT 1.25,
  token_reward_per_round INT DEFAULT 5,

  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_session_type CHECK (session_type IN ('pomodoro', 'free_form', 'timed')),
  CONSTRAINT valid_timer_state CHECK (timer_state IN ('idle', 'work', 'break', 'paused', 'finished')),
  CONSTRAINT valid_status CHECK (status IN ('waiting', 'active', 'paused', 'finished', 'cancelled'))
);

CREATE INDEX idx_pss_tenant ON plaza_study_sessions(tenant_id);
CREATE INDEX idx_pss_host ON plaza_study_sessions(host_user_id);
CREATE INDEX idx_pss_status ON plaza_study_sessions(status);
CREATE INDEX idx_pss_active ON plaza_study_sessions(tenant_id, status) WHERE status = 'active';


-- ===================================================================
-- 11. PLAZA_STUDY_SESSION_MEMBERS (Study Session Participants)
-- ===================================================================

CREATE TABLE plaza_study_session_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES plaza_study_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  rounds_completed INT DEFAULT 0,
  total_focus_seconds INT DEFAULT 0,
  xp_earned INT DEFAULT 0,
  tokens_earned INT DEFAULT 0,

  UNIQUE(session_id, user_id)
);

CREATE INDEX idx_pssm_session ON plaza_study_session_members(session_id);
CREATE INDEX idx_pssm_user ON plaza_study_session_members(user_id);


-- ===================================================================
-- 12. PLAZA_DOCUMENTARY_SESSIONS (Theater / Info Sessions)
-- Scheduled video sessions in the virtual theater.
-- ===================================================================

CREATE TABLE plaza_documentary_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INT,
  subject VARCHAR(100),

  -- Scheduling
  scheduled_by UUID NOT NULL REFERENCES auth.users(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',

  -- Playback sync
  playback_state VARCHAR(50) DEFAULT 'idle',
  playback_position_seconds INT DEFAULT 0,
  playback_started_at TIMESTAMPTZ,

  -- Attendance
  max_viewers INT DEFAULT 100,
  current_viewers INT DEFAULT 0,

  -- Rewards
  xp_reward INT DEFAULT 20,
  token_reward INT DEFAULT 10,
  min_watch_percent INT DEFAULT 80,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN ('scheduled', 'live', 'finished', 'cancelled')),
  CONSTRAINT valid_playback CHECK (playback_state IN ('idle', 'playing', 'paused', 'finished'))
);

CREATE INDEX idx_pds_tenant ON plaza_documentary_sessions(tenant_id);
CREATE INDEX idx_pds_scheduled ON plaza_documentary_sessions(scheduled_at);
CREATE INDEX idx_pds_status ON plaza_documentary_sessions(status);
CREATE INDEX idx_pds_subject ON plaza_documentary_sessions(subject);


-- ===================================================================
-- 13. PLAZA_DOCUMENTARY_VIEWERS (Theater Attendance)
-- ===================================================================

CREATE TABLE plaza_documentary_viewers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES plaza_documentary_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  watch_time_seconds INT DEFAULT 0,
  watch_percent NUMERIC(5, 2) DEFAULT 0,
  xp_awarded BOOLEAN DEFAULT false,
  tokens_awarded BOOLEAN DEFAULT false,

  UNIQUE(session_id, user_id)
);

CREATE INDEX idx_pdv_session ON plaza_documentary_viewers(session_id);
CREATE INDEX idx_pdv_user ON plaza_documentary_viewers(user_id);


-- ===================================================================
-- 14. ROW LEVEL SECURITY
-- Enable RLS on all 13 tables and create access policies.
-- Uses existing is_tenant_member() helper function.
-- ===================================================================

-- Enable RLS on all tables
ALTER TABLE plaza_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaza_avatar_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaza_avatar_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaza_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaza_chat_phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaza_mini_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaza_game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaza_game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaza_token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaza_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaza_study_session_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaza_documentary_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaza_documentary_viewers ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------
-- plaza_avatars: users see own + same-tenant online avatars
-- -----------------------------------------------------------------

CREATE POLICY pa_select ON plaza_avatars FOR SELECT
  USING (
    user_id = auth.uid() OR
    is_tenant_member(tenant_id)
  );

CREATE POLICY pa_insert ON plaza_avatars FOR INSERT
  WITH CHECK (user_id = auth.uid() AND is_tenant_member(tenant_id));

CREATE POLICY pa_update ON plaza_avatars FOR UPDATE
  USING (
    user_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- -----------------------------------------------------------------
-- plaza_avatar_items: tenant members can view; admins can manage
-- -----------------------------------------------------------------

CREATE POLICY pai_select ON plaza_avatar_items FOR SELECT
  USING (
    is_global = true OR
    (tenant_id IS NOT NULL AND is_tenant_member(tenant_id))
  );

CREATE POLICY pai_manage ON plaza_avatar_items FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- -----------------------------------------------------------------
-- plaza_avatar_inventory: own + tenant members can view
-- -----------------------------------------------------------------

CREATE POLICY inv_select ON plaza_avatar_inventory FOR SELECT
  USING (user_id = auth.uid() OR is_tenant_member(tenant_id));

CREATE POLICY inv_insert ON plaza_avatar_inventory FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY inv_update ON plaza_avatar_inventory FOR UPDATE
  USING (user_id = auth.uid());

-- -----------------------------------------------------------------
-- plaza_rooms: tenant members can view; global rooms visible to all
-- -----------------------------------------------------------------

CREATE POLICY pr_select ON plaza_rooms FOR SELECT
  USING (
    is_global = true OR
    (tenant_id IS NOT NULL AND is_tenant_member(tenant_id))
  );

-- -----------------------------------------------------------------
-- plaza_chat_phrases: everyone can view active global + tenant phrases
-- -----------------------------------------------------------------

CREATE POLICY pcp_select ON plaza_chat_phrases FOR SELECT
  USING (
    is_global = true OR
    (tenant_id IS NOT NULL AND is_tenant_member(tenant_id))
  );

-- -----------------------------------------------------------------
-- plaza_mini_games: everyone can view active global + tenant games
-- -----------------------------------------------------------------

CREATE POLICY pmg_select ON plaza_mini_games FOR SELECT
  USING (
    is_global = true OR
    (tenant_id IS NOT NULL AND is_tenant_member(tenant_id))
  );

-- -----------------------------------------------------------------
-- plaza_game_sessions: tenant scoped
-- -----------------------------------------------------------------

CREATE POLICY pgs_select ON plaza_game_sessions FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY pgs_insert ON plaza_game_sessions FOR INSERT
  WITH CHECK (host_user_id = auth.uid() AND is_tenant_member(tenant_id));

CREATE POLICY pgs_update ON plaza_game_sessions FOR UPDATE
  USING (
    host_user_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- -----------------------------------------------------------------
-- plaza_game_scores: own + tenant teachers/admins can view
-- -----------------------------------------------------------------

CREATE POLICY score_select ON plaza_game_scores FOR SELECT
  USING (
    user_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

CREATE POLICY score_insert ON plaza_game_scores FOR INSERT
  WITH CHECK (user_id = auth.uid() AND is_tenant_member(tenant_id));

-- -----------------------------------------------------------------
-- plaza_token_transactions: own only; admins can view all
-- -----------------------------------------------------------------

CREATE POLICY ptt_select ON plaza_token_transactions FOR SELECT
  USING (
    user_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY ptt_insert ON plaza_token_transactions FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

-- -----------------------------------------------------------------
-- plaza_study_sessions: tenant scoped
-- -----------------------------------------------------------------

CREATE POLICY pss_select ON plaza_study_sessions FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY pss_insert ON plaza_study_sessions FOR INSERT
  WITH CHECK (host_user_id = auth.uid() AND is_tenant_member(tenant_id));

CREATE POLICY pss_update ON plaza_study_sessions FOR UPDATE
  USING (
    host_user_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

-- -----------------------------------------------------------------
-- plaza_study_session_members: own + session host
-- -----------------------------------------------------------------

CREATE POLICY pssm_select ON plaza_study_session_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    session_id IN (SELECT id FROM plaza_study_sessions WHERE is_tenant_member(tenant_id))
  );

CREATE POLICY pssm_insert ON plaza_study_session_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY pssm_update ON plaza_study_session_members FOR UPDATE
  USING (user_id = auth.uid());

-- -----------------------------------------------------------------
-- plaza_documentary_sessions: tenant scoped; teachers/admins can create
-- -----------------------------------------------------------------

CREATE POLICY pds_select ON plaza_documentary_sessions FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY pds_insert ON plaza_documentary_sessions FOR INSERT
  WITH CHECK (
    scheduled_by = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

CREATE POLICY pds_update ON plaza_documentary_sessions FOR UPDATE
  USING (
    scheduled_by = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- -----------------------------------------------------------------
-- plaza_documentary_viewers: own + session viewers
-- -----------------------------------------------------------------

CREATE POLICY pdv_select ON plaza_documentary_viewers FOR SELECT
  USING (user_id = auth.uid() OR
    session_id IN (SELECT id FROM plaza_documentary_sessions WHERE is_tenant_member(tenant_id)));

CREATE POLICY pdv_insert ON plaza_documentary_viewers FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY pdv_update ON plaza_documentary_viewers FOR UPDATE
  USING (user_id = auth.uid());


-- ===================================================================
-- 15. TRIGGERS
-- Reuses the existing update_updated_at() function from blueprint.
-- ===================================================================

CREATE TRIGGER update_plaza_avatars_updated_at
  BEFORE UPDATE ON plaza_avatars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ===================================================================
-- 16. ENABLE REALTIME
-- These tables need Supabase Realtime for live avatar movement,
-- game sessions, study sessions, and documentary playback sync.
-- ===================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE plaza_avatars;
ALTER PUBLICATION supabase_realtime ADD TABLE plaza_game_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE plaza_study_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE plaza_documentary_sessions;


-- ===================================================================
-- 17. SEED DATA: Default Chat Phrases
-- Pre-scripted safe chat phrases across 8 categories.
-- ===================================================================

INSERT INTO plaza_chat_phrases (phrase, category, emoji_icon, is_global, sort_order) VALUES
  -- Greetings
  ('Hi there!', 'greeting', NULL, true, 1),
  ('Hey!', 'greeting', NULL, true, 2),
  ('Hello everyone!', 'greeting', NULL, true, 3),
  ('Good morning!', 'greeting', NULL, true, 4),
  ('Welcome!', 'greeting', NULL, true, 5),
  ('Nice to see you!', 'greeting', NULL, true, 6),

  -- Encouragements
  ('Great job!', 'encouragement', NULL, true, 10),
  ('You can do it!', 'encouragement', NULL, true, 11),
  ('Keep it up!', 'encouragement', NULL, true, 12),
  ('Amazing work!', 'encouragement', NULL, true, 13),
  ('That was awesome!', 'encouragement', NULL, true, 14),
  ('I believe in you!', 'encouragement', NULL, true, 15),
  ('Way to go!', 'encouragement', NULL, true, 16),

  -- Study
  ('Want to study together?', 'study', NULL, true, 20),
  ('I just finished my homework!', 'study', NULL, true, 21),
  ('This subject is interesting!', 'study', NULL, true, 22),
  ('I need to practice more.', 'study', NULL, true, 23),
  ('Ready to learn!', 'study', NULL, true, 24),
  ('Focus time!', 'study', NULL, true, 25),
  ('Let us start a study session!', 'study', NULL, true, 26),

  -- Fun
  ('Want to play a game?', 'fun', NULL, true, 30),
  ('That was fun!', 'fun', NULL, true, 31),
  ('Let us go!', 'fun', NULL, true, 32),
  ('Haha!', 'fun', NULL, true, 33),
  ('Cool!', 'fun', NULL, true, 34),
  ('Check out my new hat!', 'fun', NULL, true, 35),

  -- Farewell
  ('See you later!', 'farewell', NULL, true, 40),
  ('Bye!', 'farewell', NULL, true, 41),
  ('Gotta go, bye!', 'farewell', NULL, true, 42),
  ('Have a great day!', 'farewell', NULL, true, 43),

  -- Teamwork
  ('Let us work together!', 'teamwork', NULL, true, 50),
  ('Good team!', 'teamwork', NULL, true, 51),
  ('We got this!', 'teamwork', NULL, true, 52),
  ('Nice teamwork!', 'teamwork', NULL, true, 53),

  -- Celebration
  ('I leveled up!', 'celebration', NULL, true, 60),
  ('New high score!', 'celebration', NULL, true, 61),
  ('I got an achievement!', 'celebration', NULL, true, 62),
  ('Party time!', 'celebration', NULL, true, 63),

  -- Question
  ('Can you help me?', 'question', NULL, true, 70),
  ('How do you do that?', 'question', NULL, true, 71),
  ('What game should we play?', 'question', NULL, true, 72),
  ('Anyone here?', 'question', NULL, true, 73);


-- ===================================================================
-- 18. SEED DATA: Default Rooms
-- The 5 core rooms of the Virtual Plaza.
-- ===================================================================

INSERT INTO plaza_rooms (slug, name, description, room_type, is_global, sort_order, map_config) VALUES
  ('plaza_main', 'Wolf Whale Plaza', 'The main hub where everyone gathers.', 'hub', true, 1,
    '{"width": 1200, "height": 800, "tile_size": 32, "spawn_point": {"x": 600, "y": 400},
      "buildings": [
        {"id": "game_house", "name": "Game House", "x": 150, "y": 100, "w": 200, "h": 160, "door": {"x": 250, "y": 260}, "target_room": "game_house"},
        {"id": "avatar_store", "name": "Avatar Store", "x": 850, "y": 100, "w": 200, "h": 160, "door": {"x": 950, "y": 260}, "target_room": "avatar_store"},
        {"id": "study_hall", "name": "Study Hall", "x": 150, "y": 500, "w": 200, "h": 160, "door": {"x": 250, "y": 500}, "target_room": "study_hall"},
        {"id": "theater", "name": "Ocean Theater", "x": 850, "y": 500, "w": 200, "h": 160, "door": {"x": 950, "y": 500}, "target_room": "theater"}
      ],
      "walkable_bounds": {"x1": 50, "y1": 50, "x2": 1150, "y2": 750}
    }'::jsonb),
  ('game_house', 'Game House', 'Play educational mini games and compete with friends!', 'game_house', true, 2,
    '{"width": 800, "height": 600, "tile_size": 32, "spawn_point": {"x": 400, "y": 500},
      "buildings": [],
      "walkable_bounds": {"x1": 50, "y1": 50, "x2": 750, "y2": 550}
    }'::jsonb),
  ('avatar_store', 'Avatar Store', 'Spend your tokens on cool avatar items!', 'store', true, 3,
    '{"width": 800, "height": 600, "tile_size": 32, "spawn_point": {"x": 400, "y": 500},
      "buildings": [],
      "walkable_bounds": {"x1": 50, "y1": 50, "x2": 750, "y2": 550}
    }'::jsonb),
  ('study_hall', 'Study Hall', 'Join or start a group study session.', 'study_hall', true, 4,
    '{"width": 800, "height": 600, "tile_size": 32, "spawn_point": {"x": 400, "y": 500},
      "buildings": [],
      "walkable_bounds": {"x1": 50, "y1": 50, "x2": 750, "y2": 550}
    }'::jsonb),
  ('theater', 'Ocean Theater', 'Watch documentaries and info sessions together.', 'theater', true, 5,
    '{"width": 800, "height": 600, "tile_size": 32, "spawn_point": {"x": 400, "y": 500},
      "buildings": [],
      "walkable_bounds": {"x1": 50, "y1": 50, "x2": 750, "y2": 550}
    }'::jsonb);


-- ===================================================================
-- 19. SEED DATA: Default Mini Games (6 Games)
-- Math Blitz, Word Scramble, Typing Race, Science Trivia,
-- Memory Match, Geography Dash
-- ===================================================================

INSERT INTO plaza_mini_games (slug, name, description, instructions, subject, icon, color_hex, game_type, config, min_players, max_players, duration_seconds, token_reward_base, token_reward_win, token_reward_perfect, xp_reward, is_global, sort_order) VALUES
  (
    'math-blitz',
    'Math Blitz',
    'Race against the clock to solve as many math problems as you can! Addition, subtraction, multiplication, and division challenges await.',
    'Solve math problems as fast as you can. Each correct answer scores points. Wrong answers lose time. Get a perfect score for bonus tokens!',
    'Mathematics',
    'calculator',
    '#EF4444',
    'math_challenge',
    '{"operations": ["add", "subtract", "multiply", "divide"], "difficulty_ranges": {"easy": {"min": 1, "max": 20}, "medium": {"min": 10, "max": 100}, "hard": {"min": 50, "max": 500}}, "questions_per_round": 20, "time_bonus_per_correct": 2}'::jsonb,
    1, 4, 60,
    5, 15, 30, 10,
    true, 1
  ),
  (
    'word-scramble',
    'Word Scramble',
    'Unscramble the jumbled letters to form words! Sharpen your vocabulary and spelling skills in this fast-paced word game.',
    'The letters of a word are scrambled. Type the correct word before time runs out. Longer words are worth more points. Hints cost tokens!',
    'Language Arts',
    'text-cursor-input',
    '#8B5CF6',
    'word_scramble',
    '{"word_lists": {"easy": ["cat", "dog", "sun", "hat", "red", "big", "run", "fun", "cup", "bed"], "medium": ["ocean", "whale", "brain", "plant", "cloud", "space", "music", "river", "dream", "light"], "hard": ["education", "algorithm", "knowledge", "adventure", "discovery", "brilliant", "geography", "evolution", "magnetism", "chocolate"]}, "hint_cost_tokens": 2, "time_per_word_seconds": 15}'::jsonb,
    1, 4, 90,
    5, 15, 30, 10,
    true, 2
  ),
  (
    'typing-race',
    'Typing Race',
    'Test your typing speed! Race against others or beat your personal best by typing sentences accurately and quickly.',
    'Type the displayed sentence as fast and accurately as you can. Speed and accuracy both count. Watch out for capital letters and punctuation!',
    'Keyboarding',
    'keyboard',
    '#F59E0B',
    'typing_race',
    '{"sentences": {"easy": ["The quick brown fox jumps.", "A whale swims in the ocean.", "Stars shine bright at night.", "Books help us learn new things."], "medium": ["The curious student explored every corner of the library.", "Ocean waves crashed against the rocky shoreline at dawn.", "Scientists discovered a new species deep in the rainforest."], "hard": ["Photosynthesis is the process by which plants convert sunlight into chemical energy.", "The circumference of Earth at the equator is approximately 40,075 kilometers.", "Mathematical algorithms form the foundation of modern computer science and technology."]}, "wpm_thresholds": {"bronze": 20, "silver": 40, "gold": 60, "platinum": 80}}'::jsonb,
    1, 6, 60,
    5, 15, 30, 10,
    true, 3
  ),
  (
    'science-trivia',
    'Science Trivia',
    'Put your science knowledge to the test! Answer questions about biology, chemistry, physics, and earth science.',
    'Read each question carefully and select the correct answer. You have limited time per question. Streaks of correct answers multiply your score!',
    'Science',
    'flask-conical',
    '#10B981',
    'science_quiz',
    '{"categories": ["biology", "chemistry", "physics", "earth_science", "space"], "questions_per_round": 15, "time_per_question_seconds": 20, "streak_multiplier": 0.25, "sample_questions": [{"q": "What planet is known as the Red Planet?", "a": "Mars", "options": ["Venus", "Mars", "Jupiter", "Saturn"]}, {"q": "What gas do plants absorb from the air?", "a": "Carbon dioxide", "options": ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"]}]}'::jsonb,
    1, 8, 120,
    5, 15, 30, 15,
    true, 4
  ),
  (
    'memory-match',
    'Memory Match',
    'Flip cards and find matching pairs! Train your memory with educational content -- match science terms, math equations, vocabulary words, and more.',
    'Click cards to flip them over. Find all matching pairs before time runs out. Fewer flips means a higher score. The board gets bigger on harder levels!',
    'General',
    'brain',
    '#EC4899',
    'memory_match',
    '{"grid_sizes": {"easy": {"rows": 3, "cols": 4}, "medium": {"rows": 4, "cols": 5}, "hard": {"rows": 5, "cols": 6}}, "card_themes": ["animals", "planets", "elements", "math_symbols", "countries"], "bonus_time_seconds": 5, "max_flips_for_perfect": {"easy": 18, "medium": 30, "hard": 45}}'::jsonb,
    1, 2, 90,
    5, 15, 30, 10,
    true, 5
  ),
  (
    'geography-dash',
    'Geography Dash',
    'Race around the world! Identify countries, capitals, landmarks, and geographic features in this fast-paced geography challenge.',
    'You will see a geographic clue -- it could be a flag, a landmark description, or a map outline. Choose the correct answer as fast as you can!',
    'Geography',
    'globe-2',
    '#3B82F6',
    'geography_dash',
    '{"question_types": ["capital_city", "country_flag", "landmark", "continent", "ocean", "river"], "questions_per_round": 15, "time_per_question_seconds": 15, "regions": ["north_america", "south_america", "europe", "asia", "africa", "oceania"], "sample_questions": [{"q": "What is the capital of Canada?", "a": "Ottawa", "options": ["Toronto", "Ottawa", "Vancouver", "Montreal"]}, {"q": "Which continent is Egypt in?", "a": "Africa", "options": ["Asia", "Europe", "Africa", "South America"]}]}'::jsonb,
    1, 8, 120,
    5, 15, 30, 15,
    true, 6
  );


-- ===================================================================
-- 20. SEED DATA: Default Store Items (25 items)
-- Cosmetic items across categories and rarity tiers.
-- Includes free starter items and purchasable items.
-- ===================================================================

INSERT INTO plaza_avatar_items (name, description, category, slot, rarity, sprite_key, preview_url, color_hex, price_tokens, is_free, is_global, min_avatar_level, sort_order) VALUES

  -- ---------------------------------------------------------------
  -- FREE STARTER ITEMS (given to all new players)
  -- ---------------------------------------------------------------
  ('Ocean Blue',
   'The classic Wolf Whale blue. A cool default color for every new explorer.',
   'color_palette', 'color', 'bronze',
   'color_ocean_blue', NULL, '#4F46E5',
   0, true, true, 1, 1),

  ('Starter Tee',
   'A simple, comfortable t-shirt. Everyone starts their plaza journey here.',
   'outfit', 'body', 'bronze',
   'outfit_starter_tee', NULL, NULL,
   0, true, true, 1, 2),

  ('Default Eyes',
   'Friendly round eyes. The classic look.',
   'eye_style', 'eyes', 'bronze',
   'eyes_default', NULL, NULL,
   0, true, true, 1, 3),

  ('Wave Emote',
   'Wave hello to your friends!',
   'emote', 'emote', 'bronze',
   'emote_wave', NULL, NULL,
   0, true, true, 1, 4),

  ('Circle Shape',
   'The classic circle body shape. Round and friendly.',
   'body_shape', 'shape', 'bronze',
   'shape_circle', NULL, NULL,
   0, true, true, 1, 5),

  -- ---------------------------------------------------------------
  -- BRONZE TIER (cheap, early game items) - 10-30 tokens
  -- ---------------------------------------------------------------
  ('Baseball Cap',
   'A sporty baseball cap. Wear it forwards or backwards -- your choice!',
   'hat', 'head', 'bronze',
   'hat_baseball_cap', NULL, NULL,
   10, false, true, 1, 10),

  ('Sunglasses',
   'Cool shades for a cool student. Block out the haters and the sun.',
   'accessory', 'hand', 'bronze',
   'acc_sunglasses', NULL, NULL,
   15, false, true, 1, 11),

  ('Coral Red',
   'A warm coral red color palette. Stand out in the crowd.',
   'color_palette', 'color', 'bronze',
   'color_coral_red', NULL, '#EF4444',
   10, false, true, 1, 12),

  ('Forest Green',
   'A natural forest green. For the nature lovers.',
   'color_palette', 'color', 'bronze',
   'color_forest_green', NULL, '#10B981',
   10, false, true, 1, 13),

  ('Thumbs Up Emote',
   'Show your approval with a big thumbs up!',
   'emote', 'emote', 'bronze',
   'emote_thumbs_up', NULL, NULL,
   15, false, true, 1, 14),

  ('Hoodie',
   'A cozy hoodie for those chill study sessions.',
   'outfit', 'body', 'bronze',
   'outfit_hoodie', NULL, NULL,
   25, false, true, 1, 15),

  ('Plain Background',
   'A simple solid color background for your avatar card.',
   'background', 'background', 'bronze',
   'bg_plain', NULL, '#1E293B',
   20, false, true, 1, 16),

  -- ---------------------------------------------------------------
  -- SILVER TIER (mid-range items) - 50-100 tokens
  -- ---------------------------------------------------------------
  ('Wizard Hat',
   'A pointy wizard hat. Channel your inner sorcerer of knowledge!',
   'hat', 'head', 'silver',
   'hat_wizard', NULL, NULL,
   50, false, true, 3, 20),

  ('Lab Coat',
   'A crisp white lab coat. Perfect for the aspiring scientist.',
   'outfit', 'body', 'silver',
   'outfit_lab_coat', NULL, NULL,
   60, false, true, 3, 21),

  ('Sparkle Trail',
   'Leave a trail of sparkles wherever you walk. Magical!',
   'trail_effect', 'trail', 'silver',
   'trail_sparkle', NULL, NULL,
   75, false, true, 3, 22),

  ('Starry Eyes',
   'Star-shaped eyes that shimmer with wonder and curiosity.',
   'eye_style', 'eyes', 'silver',
   'eyes_starry', NULL, NULL,
   50, false, true, 3, 23),

  ('Dance Emote',
   'Break into a happy dance! Show off your moves.',
   'emote', 'emote', 'silver',
   'emote_dance', NULL, NULL,
   60, false, true, 3, 24),

  ('Ocean Waves Background',
   'A serene animated ocean waves background for your avatar card.',
   'background', 'background', 'silver',
   'bg_ocean_waves', NULL, '#0EA5E9',
   80, false, true, 3, 25),

  ('Backpack',
   'A sturdy backpack accessory. Always prepared for adventure!',
   'accessory', 'hand', 'silver',
   'acc_backpack', NULL, NULL,
   55, false, true, 3, 26),

  -- ---------------------------------------------------------------
  -- GOLD TIER (premium items) - 150-300 tokens
  -- ---------------------------------------------------------------
  ('Crown',
   'A golden crown for the top student. Rule the plaza with wisdom!',
   'hat', 'head', 'gold',
   'hat_crown', NULL, '#F59E0B',
   200, false, true, 5, 30),

  ('Space Suit',
   'A full astronaut space suit. One small step for students, one giant leap for learning!',
   'outfit', 'body', 'gold',
   'outfit_space_suit', NULL, NULL,
   250, false, true, 5, 31),

  ('Rainbow Trail',
   'A magnificent rainbow trail follows your every step. Maximum visibility!',
   'trail_effect', 'trail', 'gold',
   'trail_rainbow', NULL, NULL,
   200, false, true, 5, 32),

  ('Northern Lights Background',
   'A breathtaking aurora borealis background. Canadian pride!',
   'background', 'background', 'gold',
   'bg_northern_lights', NULL, '#6366F1',
   250, false, true, 5, 33),

  -- ---------------------------------------------------------------
  -- PLATINUM TIER (ultra-rare, prestige items) - 500+ tokens
  -- ---------------------------------------------------------------
  ('Wolf Whale Helm',
   'The legendary Wolf Whale helmet. Only the most dedicated explorers earn this honor. A fusion of wolf ears and whale fin on a gleaming helm.',
   'hat', 'head', 'platinum',
   'hat_wolf_whale_helm', NULL, '#7C3AED',
   500, false, true, 8, 40),

  ('Aurora Outfit',
   'A shimmering outfit woven from the northern lights themselves. Changes color as you move through the plaza.',
   'outfit', 'body', 'platinum',
   'outfit_aurora', NULL, NULL,
   600, false, true, 8, 41);


-- ===================================================================
-- MIGRATION COMPLETE
-- Virtual Plaza schema with 13 tables, indexes, RLS policies,
-- triggers, realtime subscriptions, and seed data is ready.
-- ===================================================================
