# Virtual Plaza System - Comprehensive Implementation Plan

**Feature:** Club Penguin-Inspired Virtual Plaza for Wolf Whale LMS
**Status:** Planning
**Author:** Agent Poseidon
**Date:** 2026-02-10

---

## Vision

The Virtual Plaza transforms Wolf Whale LMS from a traditional learning platform into a living, breathing community. Inspired by Club Penguin's legendary social spaces, students inhabit a 2D top-down virtual world where they walk around as customizable avatars, visit buildings, play educational mini games, shop for cosmetics, study together, and watch documentaries -- all while seeing their classmates moving around in real time. The Plaza is the social glue that makes learning feel like an adventure shared with friends.

The core metaphor: **The school is a vibrant ocean-themed town, and every student is a citizen exploring its streets.**

---

## Table of Contents

1. [Database Schema](#1-database-schema)
2. [Visual Design & Art Direction](#2-visual-design--art-direction)
3. [Game Mechanics](#3-game-mechanics)
4. [Mini Games (6 Detailed Games)](#4-mini-games)
5. [UI/UX Pages & Routes](#5-uiux-pages--routes)
6. [Technical Implementation](#6-technical-implementation)
7. [Server Actions & API](#7-server-actions--api)
8. [Permissions & Access Control](#8-permissions--access-control)
9. [Token Economy Design](#9-token-economy-design)
10. [Phase Plan](#10-phase-plan)
11. [Mini Games in Tools Tab](#11-mini-games-in-tools-tab)
12. [Future Ideas](#12-future-ideas)

---

## 1. Database Schema

### Overview

Twelve new tables plus modifications to `user_levels`. All tables are tenant-scoped, follow the existing UUID primary key pattern, and integrate with the current gamification system (`xp_events`, `user_levels`, `achievements`).

### 1.1 `plaza_avatars` (Player Avatars)

Each user gets one avatar per tenant. This stores their appearance configuration and current position in the world.

```sql
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
```

### 1.2 `plaza_avatar_items` (Item Catalog)

Global and tenant-specific cosmetic items that can be purchased in the Avatar Store.

```sql
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
```

### 1.3 `plaza_avatar_inventory` (Owned Items)

Tracks which items each user owns and which are currently equipped.

```sql
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
```

### 1.4 `plaza_rooms` (World Rooms/Zones)

Defines the rooms/zones in the virtual plaza that users can visit.

```sql
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
```

### 1.5 `plaza_chat_phrases` (Pre-Scripted Chat)

Approved chat phrases that users can select. No free-text chat for school safety.

```sql
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
```

### 1.6 `plaza_mini_games` (Game Definitions)

Defines the available mini games. Each game is a self-contained module.

```sql
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
```

### 1.7 `plaza_game_sessions` (Active/Past Game Sessions)

Tracks multiplayer game lobbies and solo game sessions.

```sql
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
```

### 1.8 `plaza_game_scores` (Individual Player Scores)

Per-player scores within a game session.

```sql
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
```

### 1.9 `plaza_token_transactions` (Token Ledger)

Immutable ledger of all token earning and spending events.

```sql
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
```

### 1.10 `plaza_study_sessions` (Collaborative Study)

Group study sessions held in the Plaza study hall.

```sql
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
```

### 1.11 `plaza_study_session_members` (Study Session Participants)

```sql
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
```

### 1.12 `plaza_documentary_sessions` (Theater / Info Sessions)

Scheduled video sessions in the virtual theater.

```sql
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
```

### 1.13 `plaza_documentary_viewers` (Theater Attendance)

```sql
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
```

### 1.14 Row Level Security

```sql
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

-- plaza_avatars: users see own + same-tenant online avatars
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

-- plaza_avatar_items: tenant members can view
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

-- plaza_avatar_inventory: own only
CREATE POLICY inv_select ON plaza_avatar_inventory FOR SELECT
  USING (user_id = auth.uid() OR is_tenant_member(tenant_id));

CREATE POLICY inv_insert ON plaza_avatar_inventory FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY inv_update ON plaza_avatar_inventory FOR UPDATE
  USING (user_id = auth.uid());

-- plaza_rooms: tenant members can view
CREATE POLICY pr_select ON plaza_rooms FOR SELECT
  USING (
    is_global = true OR
    (tenant_id IS NOT NULL AND is_tenant_member(tenant_id))
  );

-- plaza_chat_phrases: everyone can view active
CREATE POLICY pcp_select ON plaza_chat_phrases FOR SELECT
  USING (
    is_global = true OR
    (tenant_id IS NOT NULL AND is_tenant_member(tenant_id))
  );

-- plaza_mini_games: everyone can view active
CREATE POLICY pmg_select ON plaza_mini_games FOR SELECT
  USING (
    is_global = true OR
    (tenant_id IS NOT NULL AND is_tenant_member(tenant_id))
  );

-- plaza_game_sessions: tenant scoped
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

-- plaza_game_scores: own + tenant teachers/admins
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

-- plaza_token_transactions: own only
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

-- plaza_study_sessions: tenant scoped
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

-- plaza_study_session_members: own + session host
CREATE POLICY pssm_select ON plaza_study_session_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    session_id IN (SELECT id FROM plaza_study_sessions WHERE is_tenant_member(tenant_id))
  );

CREATE POLICY pssm_insert ON plaza_study_session_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY pssm_update ON plaza_study_session_members FOR UPDATE
  USING (user_id = auth.uid());

-- plaza_documentary_sessions: tenant scoped
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

-- plaza_documentary_viewers: own
CREATE POLICY pdv_select ON plaza_documentary_viewers FOR SELECT
  USING (user_id = auth.uid() OR
    session_id IN (SELECT id FROM plaza_documentary_sessions WHERE is_tenant_member(tenant_id)));

CREATE POLICY pdv_insert ON plaza_documentary_viewers FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY pdv_update ON plaza_documentary_viewers FOR UPDATE
  USING (user_id = auth.uid());
```

### 1.15 Triggers

```sql
CREATE TRIGGER update_plaza_avatars_updated_at
  BEFORE UPDATE ON plaza_avatars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 1.16 Enable Realtime

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE plaza_avatars;
ALTER PUBLICATION supabase_realtime ADD TABLE plaza_game_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE plaza_study_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE plaza_documentary_sessions;
```

### 1.17 Seed Data: Default Chat Phrases

```sql
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
```

### 1.18 Seed Data: Default Rooms

```sql
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
```

---

## 2. Visual Design & Art Direction

### 2.1 Perspective Choice: 2D Top-Down

**Decision: 2D top-down (slightly angled, like classic Pokemon or Stardew Valley).**

Rationale:
- Simpler to implement with Canvas2D than isometric
- Easier collision detection (rectangular grid)
- More forgiving for placeholder art
- Excellent mobile compatibility
- Familiar to the target audience (K-12 students)

### 2.2 Map Layout (ASCII Art)

**Main Plaza Hub (1200 x 800 virtual pixels):**

```
+------------------------------------------------------------------+
|                                                                    |
|   +--[GAME HOUSE]--+                  +--[AVATAR STORE]--+        |
|   |                 |                  |                  |        |
|   |   (game icon)   |    * * * * *    |   (shop icon)    |        |
|   |                 |   * fountain *   |                  |        |
|   +------[  ]------+    * * * * *    +------[  ]--------+        |
|          door                                door                  |
|                                                                    |
|     (trees)                (paths)                (flowers)        |
|                                                                    |
|              (benches)   (lamp posts)   (benches)                  |
|                                                                    |
|                    +---[SPAWN POINT]---+                           |
|                    |    (you arrive    |                           |
|                    |     here)         |                           |
|                    +-------------------+                           |
|                                                                    |
|     (trees)                (paths)                (flowers)        |
|                                                                    |
|   +--[STUDY HALL]--+                  +--[OCEAN THEATER]-+        |
|   |                 |                  |                  |        |
|   |  (book icon)    |                  |  (film icon)     |        |
|   |                 |                  |                  |        |
|   +------[  ]------+                  +------[  ]--------+        |
|          door                                door                  |
|                                                                    |
+------------------------------------------------------------------+
```

### 2.3 Building/Zone Descriptions

| Building       | Visual Style                  | Interior Function                   |
|----------------|-------------------------------|-------------------------------------|
| Game House     | Red/orange roof, arcade signs | Opens mini game selection UI         |
| Avatar Store   | Purple roof, star decorations | Opens the cosmetics shop UI          |
| Study Hall     | Blue roof, book stacks        | Opens study session lobby/creation   |
| Ocean Theater  | Teal roof, film reel sign     | Opens documentary/video viewer       |
| Fountain       | Center plaza, animated water  | Decorative, meeting spot             |

### 2.4 Placeholder Asset Specifications

Until the user provides real art, all assets use simple geometric shapes rendered directly on the Canvas2D:

**Avatar (placeholder):**
- 32x32 pixel bounding box
- Body: colored circle (24px diameter), color from `avatar_config.body_color`
- Eyes: two small white circles (4px) with black dots (2px)
- Direction indicator: small triangle pointing in `facing_direction`
- Hat slot: small shape drawn above the circle (rectangle, triangle, etc.)
- Name label: 10px font, centered above avatar, white text with dark shadow
- Chat bubble: rounded rectangle above name, fades after 5 seconds

**Buildings (placeholder):**
- Simple filled rectangles with darker border
- Roof: triangle or trapezoid on top, colored per building theme
- Door: darker rectangle at the bottom center
- Label text: building name centered on the building
- Glow effect on door when player is nearby (interaction prompt)

**Decoration tiles (placeholder):**
- Trees: green circles on brown rectangle trunks
- Flowers: small colored circles in clusters
- Benches: brown rectangles
- Lamp posts: yellow circles (light) on gray lines
- Fountain: concentric blue circles with animated ripple
- Path tiles: slightly lighter ground color

**Color Palette:**
- Ground: `#2d3748` (dark slate)
- Grass/park areas: `#1a4731` (dark green)
- Paths: `#4a5568` (lighter slate)
- Water/fountain: `#2563eb` (blue)
- Building walls: `#374151` (gray)
- Roofs: per-building theme color (red, purple, blue, teal)
- UI overlays: `#1a1a2e` with 90% opacity

### 2.5 Mobile Responsive Approach

**Desktop (>= 1024px):**
- Canvas fills the main content area (sidebar visible)
- UI panels (store, games) appear as overlay modals or slide-in panels
- Keyboard controls (WASD/arrows) active
- Full decoration and animation

**Tablet (768px - 1023px):**
- Canvas fills viewport (sidebar collapsed)
- Touch controls with virtual joystick (bottom-left)
- UI panels as full-width bottom sheets
- Reduced decoration density

**Mobile (< 768px):**
- Canvas fills viewport (no sidebar, use top nav)
- Virtual joystick (bottom-left) + action button (bottom-right)
- UI panels as full-screen overlays
- Minimal decorations, reduced avatar detail
- Tap-to-move also supported

---

## 3. Game Mechanics

### 3.1 Movement System

**Movement approach: Smooth pixel-based movement (not grid-snapping).**

```typescript
interface AvatarState {
  x: number          // World position X (sub-pixel precision)
  y: number          // World position Y
  targetX: number    // Click-to-move destination X
  targetY: number    // Click-to-move destination Y
  velocityX: number  // Current velocity X
  velocityY: number  // Current velocity Y
  speed: number      // Pixels per second (default: 120)
  isMoving: boolean
  facing: 'up' | 'down' | 'left' | 'right'
}
```

**Keyboard controls:**
- WASD or Arrow keys for 8-directional movement
- Movement is smooth, not tile-snapped
- Speed: 120 pixels/second (walking), 180 pixels/second if sprinting (hold Shift)
- Diagonal movement normalized to same speed as cardinal directions
- Release key = immediate stop (no momentum/inertia for simplicity)

**Click-to-move:**
- Click/tap anywhere on the walkable area
- Avatar pathfinds to the clicked position using simple A* on a coarse grid
- If direct line is clear, move in a straight line instead
- Movement indicator: small pulsing circle at the destination
- Click on a building door: move to door, then enter building

**Mobile touch controls:**
- Virtual joystick: semi-transparent circle in bottom-left corner
- Thumb drag direction controls avatar direction
- Distance from center controls speed (0 to max)
- Action button in bottom-right: interact with nearest building/object
- Tap-to-move also works on the map area above the joystick

**Collision detection:**
- Rectangular collision boxes on buildings and solid decorations
- Avatar has an 8px radius collision circle around their center
- Simple AABB (Axis-Aligned Bounding Box) check per frame
- Slide along walls on diagonal collision (do not stop dead)
- Room boundaries defined by `walkable_bounds` in room config

**Building interaction:**
- When avatar is within 48px of a building door, show interaction prompt
- Press E/Space or tap the action button to enter
- 300ms fade-to-black transition, then load building interior/UI
- Exiting a building: press E/Space at the exit door, or click the exit button

### 3.2 Real-Time Multiplayer Architecture

**Technology: Supabase Realtime Channels (Presence + Broadcast)**

Each plaza room has one Supabase Realtime channel:

```typescript
// Channel naming convention
const channelName = `plaza:${tenantId}:${roomSlug}`

// Example: plaza:abc123:plaza_main
```

**Presence (who is in the room):**
- Each user joins the channel with their avatar data as presence state
- Presence state includes: `userId`, `displayName`, `avatarConfig`, `x`, `y`, `facing`, `chatBubble`
- When a user leaves the channel (disconnect, navigate away), they are removed from presence
- Presence sync fires on join/leave, updating the list of visible avatars

**Broadcast (real-time events):**
- Movement updates: broadcast `{type: "move", userId, x, y, facing}` at 10Hz (every 100ms) while moving
- Chat bubbles: broadcast `{type: "chat", userId, phraseId, phrase}` when user selects a phrase
- Interactions: broadcast `{type: "emote", userId, emoteId}` for emote animations
- Game invites: broadcast `{type: "game_invite", userId, gameSlug, sessionId}`

**Interpolation for smooth remote avatars:**
- Remote avatars receive position updates at ~10Hz
- Client-side linear interpolation between last two known positions
- If no update for 500ms, avatar stands still (assume stopped)
- If no update for 10s, consider disconnected (gray out or remove)

**Bandwidth optimization:**
- Only broadcast movement while moving (not idle)
- Quantize positions to integers (no sub-pixel for network)
- Batch multiple events per frame if needed
- Max ~50 users per room channel (configurable in `plaza_rooms.max_occupants`)

### 3.3 Chat Bubble System

**How it works:**
1. User presses C key or taps the chat icon button
2. Chat phrase picker appears: categorized grid of pre-approved phrases
3. User clicks a phrase
4. Broadcast `{type: "chat", userId, phrase}` on the room channel
5. All clients render a chat bubble above the avatar
6. Bubble appears with a pop-in animation (scale from 0.5 to 1.0, 200ms)
7. Bubble stays visible for 5 seconds
8. Bubble fades out over 500ms
9. Only one bubble per avatar at a time (new overrides old)

**Chat bubble rendering:**
- White rounded rectangle with 8px border-radius
- 12px font, dark text
- Small triangle pointer pointing down to avatar
- Max width 180px, text wraps
- Semi-transparent background (white at 95% opacity)
- Drop shadow for readability

**Rate limiting:**
- Max 1 chat bubble per 3 seconds per user (client-enforced, server-validated)
- Cooldown indicator on the chat button (opacity change + timer)

### 3.4 Token System Summary

Tokens are the virtual currency of the Plaza. They are **separate from XP**.

| Property | XP | Tokens |
|----------|-----|--------|
| Purpose | Progression/leveling | Currency/spending |
| Earned from | All LMS activities | Plaza activities only |
| Spent on | Nothing (auto-levels) | Avatar cosmetics |
| Decays | Yes (inactivity) | No |
| Daily cap | Yes (300-400) | Yes (200) |

Detailed token economy in Section 9.

### 3.5 Avatar Level System

Avatar level is derived from the user's existing XP level in `user_levels`. The `plaza_avatars.avatar_level` mirrors `user_levels.current_level` and is synced whenever XP changes.

**Avatar level unlocks:**
- Level 1: Default body colors, basic shapes
- Level 3: Trail effects become available in store
- Level 5: Emotes become available
- Level 8: Gold-tier items become purchasable
- Level 10: Custom backgrounds
- Level 15: Platinum-tier items
- Level 20: Exclusive "Legendary" category unlocked

### 3.6 Room Transitions

When a user enters a building door:
1. Client sends final position to the channel, then unsubscribes from current room channel
2. 300ms fade-to-black animation
3. Update `plaza_avatars.current_room` in the database
4. Subscribe to the new room's Realtime channel
5. Load new room map data and spawn at the room's `spawn_point`
6. 300ms fade-from-black animation
7. Begin rendering new room with its occupants

---

## 4. Mini Games

### 4.1 Math Blitz

| Property | Value |
|----------|-------|
| **Name** | Math Blitz |
| **Slug** | `math-blitz` |
| **Subject** | Mathematics |
| **Description** | Race against the clock to solve arithmetic problems. Speed and accuracy both count! |
| **Educational Value** | Mental math fluency, arithmetic speed, number sense |
| **Players** | 1-4 (solo or multiplayer race) |
| **Duration** | 60 seconds |

**Gameplay mechanics:**
- A math equation appears on screen (e.g., `7 x 8 = ?`)
- Player types/taps the answer
- Correct answer: score +10, next question immediately
- Wrong answer: -2 points, question stays
- Difficulty scales with consecutive correct answers:
  - Easy (first 5): single-digit addition/subtraction
  - Medium (6-15): multiplication, double-digit operations
  - Hard (16+): division, three-digit operations, mixed operations
- Timer bar at top counts down from 60 seconds

**Multiplayer:**
- All players see the SAME sequence of questions
- First to answer correctly gets +5 bonus points
- Live scoreboard on the right side showing all players' scores
- Winner determined by total points at time-up

**Scoring:**
- Each correct answer: 10 points
- Speed bonus: +1 to +5 based on how fast (under 3 seconds = +5, under 5s = +3, under 8s = +1)
- Accuracy bonus at end: 100% accuracy = score x 1.5

**Token rewards:**
- Participation: 5 tokens
- Win (multiplayer): 15 tokens
- Perfect accuracy: 30 tokens
- New personal best: 10 bonus tokens

### 4.2 Word Scramble

| Property | Value |
|----------|-------|
| **Name** | Word Scramble |
| **Slug** | `word-scramble` |
| **Subject** | English Language Arts |
| **Description** | Unscramble jumbled letters to find the hidden word. Each round gets harder! |
| **Educational Value** | Vocabulary, spelling, word recognition |
| **Players** | 1-6 |
| **Duration** | 90 seconds |

**Gameplay mechanics:**
- Scrambled letters appear in large bubbles (e.g., `E A P L P` for APPLE)
- Player rearranges letters by clicking/tapping in order or drag-and-drop
- Correct word: celebratory animation, +15 points, next word
- Hint button: reveals one letter's correct position, -5 points
- Words are age-appropriate, pulled from vocabulary lists matching the student's grade level
- Difficulty progression:
  - Round 1-3: 4-letter words
  - Round 4-6: 5-letter words
  - Round 7-9: 6-letter words
  - Round 10+: 7+ letter words with definitions shown as clues

**Multiplayer:**
- Same words for all players
- First to solve gets +10 bonus
- Hint usage is per-player (does not affect others)

**Token rewards:**
- Participation: 5 tokens
- Win: 15 tokens
- No hints used (5+ words): 20 tokens
- 10+ words solved: 25 tokens

### 4.3 Typing Race

| Property | Value |
|----------|-------|
| **Name** | Typing Race |
| **Slug** | `typing-race` |
| **Subject** | Computer Science / General |
| **Description** | Type the passage as fast and accurately as you can. Your avatar races across the screen! |
| **Educational Value** | Typing speed, accuracy, reading comprehension |
| **Players** | 1-8 |
| **Duration** | Until passage completed or 120 seconds |

**Gameplay mechanics:**
- A passage of text appears (2-4 sentences, age-appropriate)
- Player types the text in a text input field
- Correct characters: avatar advances along a race track at the top
- Wrong characters: highlighted in red, must be corrected before proceeding
- WPM (words per minute) calculated live
- Accuracy percentage displayed
- Race track shows all players' avatars progressing
- First to finish the passage wins

**Passages by grade level:**
- K-2: Simple sentences ("The cat sat on the mat.")
- 3-5: Short paragraphs from children's books
- 6-8: Paragraphs from educational content
- 9-12: Excerpts from literature, science texts

**Scoring:**
- Base score: WPM x 2
- Accuracy multiplier: score x accuracy% (e.g., 95% accuracy = x0.95)
- First to finish bonus: +50 points
- Perfect accuracy bonus: +30 points

**Token rewards:**
- Participation: 5 tokens
- Win (multiplayer): 15 tokens
- 60+ WPM with 95%+ accuracy: 25 tokens
- Perfect accuracy (100%): 20 tokens

### 4.4 Science Trivia

| Property | Value |
|----------|-------|
| **Name** | Science Trivia |
| **Slug** | `science-trivia` |
| **Subject** | Science |
| **Description** | Test your science knowledge with rapid-fire questions across biology, chemistry, physics, and earth science. |
| **Educational Value** | Science facts recall, critical thinking, broad scientific literacy |
| **Players** | 1-6 |
| **Duration** | 10 questions, 15 seconds each (150 seconds max) |

**Gameplay mechanics:**
- Multiple-choice question appears with 4 answer options (A/B/C/D)
- 15-second countdown timer per question
- Correct answer: points based on speed (faster = more points)
- Wrong answer: 0 points, correct answer highlighted in green
- After each question, brief (2 second) scoreboard flash
- Questions organized by topic: Biology, Chemistry, Physics, Earth Science, Space
- Difficulty matches grade level of the student
- No repeats within the same session

**Point calculation per question:**
- Answer in 0-3 seconds: 100 points
- Answer in 3-6 seconds: 75 points
- Answer in 6-10 seconds: 50 points
- Answer in 10-15 seconds: 25 points
- No answer / wrong: 0 points

**Multiplayer:**
- All players see same questions simultaneously
- Individual timers (everyone gets 15 seconds)
- Live leaderboard updates after each question

**Token rewards:**
- Participation: 5 tokens
- Win (multiplayer): 15 tokens
- 8/10 or better: 20 tokens
- Perfect 10/10: 35 tokens

### 4.5 Memory Match

| Property | Value |
|----------|-------|
| **Name** | Memory Match |
| **Slug** | `memory-match` |
| **Subject** | General / Cross-curricular |
| **Description** | Flip cards to find matching pairs. Match vocabulary words to definitions, math equations to answers, or science terms to diagrams. |
| **Educational Value** | Memory, association, content review across subjects |
| **Players** | 1-2 |
| **Duration** | Until all pairs matched or 120 seconds |

**Gameplay mechanics:**
- Grid of face-down cards (4x4 = 8 pairs for easy, 5x4 = 10 pairs for medium, 6x4 = 12 pairs for hard)
- Click/tap to flip a card, then flip a second card
- If they match: cards stay face-up, +10 points, success animation
- If no match: cards flip back after 1 second, +0 points
- Match types (randomly selected per game):
  - Vocabulary: word <-> definition
  - Math: equation <-> answer (e.g., "3 x 7" <-> "21")
  - Science: term <-> image/diagram description
  - French: English word <-> French translation
  - History: date <-> event
- Fewer total flips = higher score bonus

**Multiplayer (turn-based for 2 players):**
- Players alternate turns
- Matched pair stays and is "claimed" by that player (colored border)
- Player with more pairs at end wins
- Matched pair = extra turn

**Scoring:**
- Each match: 10 points
- Consecutive matches (no miss): +5 bonus per streak
- Speed bonus: all pairs in under 60s = score x 1.5
- Fewest flips bonus: under 20 flips for 8 pairs = +50 points

**Token rewards:**
- Participation: 5 tokens
- Win (multiplayer): 15 tokens
- All pairs matched: 10 tokens
- Under 20 flips (8 pairs): 25 tokens

### 4.6 Geography Dash

| Property | Value |
|----------|-------|
| **Name** | Geography Dash |
| **Slug** | `geography-dash` |
| **Subject** | Social Studies / Geography |
| **Description** | Identify countries, capitals, landmarks, and flags as fast as you can. Race around the world! |
| **Educational Value** | Geographic literacy, world knowledge, cultural awareness |
| **Players** | 1-4 |
| **Duration** | 90 seconds |

**Gameplay mechanics:**
- A prompt appears: "Click the country: CANADA" or "What is the capital of France?" or "Which flag belongs to Japan?"
- For map questions: a simplified world/continent map is shown; player clicks the correct region
- For text questions: 4 multiple-choice options
- For flag questions: 4 flag images shown, pick the correct one
- Correct answer: +15 points, next question
- Wrong answer: -5 points, try again (max 2 attempts per question, then skip)
- Question types rotate: map click -> text -> flag -> map click -> ...

**Difficulty scaling:**
- Easy: major countries, well-known capitals, distinctive flags
- Medium: smaller countries, state/province capitals, similar flags
- Hard: obscure nations, landlocked countries, capital cities of small nations

**Multiplayer:**
- Same questions, simultaneous answering
- First correct gets +10 bonus
- Map click questions: all players see map, first correct click wins the round

**Token rewards:**
- Participation: 5 tokens
- Win (multiplayer): 15 tokens
- 15+ correct: 20 tokens
- Perfect (no wrong answers, 10+ questions): 30 tokens

### 4.7 Mini Game Framework (Shared Architecture)

All six games share a common framework:

```typescript
interface MiniGameDefinition {
  slug: string
  name: string
  component: React.ComponentType<MiniGameProps>
  minPlayers: number
  maxPlayers: number
  defaultDuration: number
  subjects: string[]
}

interface MiniGameProps {
  sessionId: string
  gameConfig: GameConfig
  mode: 'solo' | 'multiplayer'
  players: PlayerInfo[]
  onScore: (score: number) => void
  onComplete: (result: GameResult) => void
  channel: RealtimeChannel // For multiplayer sync
}

interface GameResult {
  score: number
  accuracy: number
  timeTaken: number
  correctAnswers: number
  totalQuestions: number
  tokensEarned: number
  xpEarned: number
  isPersonalBest: boolean
}
```

---

## 5. UI/UX Pages & Routes

### 5.1 Route Structure

```
app/
  plaza/                          -- Plaza entry point
    page.tsx                      -- Main plaza world (canvas renderer)
    layout.tsx                    -- Plaza-specific layout (minimal chrome)
    store/
      page.tsx                    -- Avatar Store (standalone if entered from sidebar)
    games/
      page.tsx                    -- Mini game selection
      [gameSlug]/
        page.tsx                  -- Individual game play
    study/
      page.tsx                    -- Study session lobby
    theater/
      page.tsx                    -- Documentary/video theater
    avatar/
      page.tsx                    -- Avatar customization screen

  student/
    tools/
      page.tsx                    -- Tools Arcade (add mini game links here)
      chess/
        page.tsx                  -- Existing chess game
      math-blitz/
        page.tsx                  -- Math Blitz (playable outside plaza too)
      word-scramble/
        page.tsx                  -- Word Scramble
      typing-race/
        page.tsx                  -- Typing Race
      science-trivia/
        page.tsx                  -- Science Trivia
      memory-match/
        page.tsx                  -- Memory Match
      geography-dash/
        page.tsx                  -- Geography Dash
```

### 5.2 Component Architecture

```
components/
  plaza/
    -- World rendering
    PlazaCanvas.tsx               -- Main canvas element and game loop
    PlazaRenderer.ts              -- Canvas2D rendering logic (draw calls)
    PlazaCamera.ts                -- Camera/viewport following player
    PlazaRoom.tsx                 -- Room loader + background
    PlazaBuilding.tsx             -- Building rendering + door hitbox
    PlazaDecoration.tsx           -- Trees, benches, fountain, etc.

    -- Avatar
    AvatarSprite.tsx              -- Single avatar rendering (self or remote)
    AvatarCustomizer.tsx          -- Full customization UI
    AvatarPreview.tsx             -- Live preview of avatar with equipped items
    AvatarNameplate.tsx           -- Name + level badge above avatar

    -- Chat
    ChatBubble.tsx                -- Speech bubble above avatar
    ChatPhraseSelector.tsx        -- Category tabs + phrase grid picker
    ChatButton.tsx                -- Floating chat trigger button

    -- Controls
    PlazaControls.tsx             -- Keyboard input handler
    VirtualJoystick.tsx           -- Mobile touch joystick
    ActionButton.tsx              -- Mobile interact button
    PlazaMinimap.tsx              -- Optional minimap overlay
    PlazaHUD.tsx                  -- Heads-up display (tokens, room name, online count)

    -- Store
    StoreLayout.tsx               -- Store page layout with category tabs
    StoreItemCard.tsx             -- Individual item card with preview
    StoreItemDetail.tsx           -- Item detail modal with try-on preview
    StorePurchaseDialog.tsx       -- Confirm purchase dialog
    StoreInventory.tsx            -- User's owned items / wardrobe

    -- Games
    GameLobby.tsx                 -- Multiplayer lobby (waiting for players)
    GameSelector.tsx              -- Grid of available mini games
    GameCard.tsx                  -- Individual game card
    GameHUD.tsx                   -- In-game score/timer overlay
    GameResults.tsx               -- End-of-game results screen
    GameLeaderboard.tsx           -- Per-game high scores
    games/
      MathBlitz.tsx               -- Math Blitz game component
      WordScramble.tsx            -- Word Scramble game component
      TypingRace.tsx              -- Typing Race game component
      ScienceTrivia.tsx           -- Science Trivia game component
      MemoryMatch.tsx             -- Memory Match game component
      GeographyDash.tsx           -- Geography Dash game component

    -- Study
    StudySessionLobby.tsx         -- Join/create study sessions
    StudySessionRoom.tsx          -- Active study session UI
    StudyTimer.tsx                -- Pomodoro timer display
    StudyParticipants.tsx         -- List of study session members

    -- Theater
    TheaterSchedule.tsx           -- Upcoming sessions
    TheaterViewer.tsx             -- Video player with synced playback
    TheaterSeatMap.tsx            -- Visual seating (decorative)

    -- Shared
    TokenDisplay.tsx              -- Token balance display
    TokenAnimation.tsx            -- Floating "+10 tokens" animation
    PlazaLoading.tsx              -- Loading/transition screen

    -- Hooks
    hooks/
      usePlazaCanvas.ts           -- Canvas setup, resize, game loop
      usePlazaMovement.ts         -- Keyboard/touch input + movement
      usePlazaRealtime.ts         -- Supabase Realtime channel management
      usePlazaPresence.ts         -- Presence tracking (who is in the room)
      usePlazaChat.ts             -- Chat phrase sending/receiving
      usePlazaAvatar.ts           -- Avatar data loading/saving
      useTokenBalance.ts          -- Token balance with optimistic updates
      useMiniGame.ts              -- Shared mini game state management
      useVirtualJoystick.ts       -- Touch joystick input processing
```

### 5.3 Wireframes (ASCII)

**Main Plaza View (Desktop):**

```
+--------+-------------------------------------------------------+
|        |  Wolf Whale Plaza          [12 online]  [Tokens: 350] |
|        |--------------------------------------------------------|
|Sidebar |                                                        |
|        |   [Game House]              [Avatar Store]             |
|  ...   |   /----------\              /----------\               |
|  ...   |   |          |              |          |               |
|  ...   |   \----[]----/              \----[]----/               |
|  Plaza |                                                        |
|  link  |            * fountain *                                |
|  ...   |              (o)                                       |
|        |                                                        |
|        |         @Player1   @You ->                             |
|        |         "Hi!"                                          |
|        |                        @Player3                        |
|        |                                                        |
|        |   [Study Hall]               [Ocean Theater]           |
|        |   /----------\              /----------\               |
|        |   |          |              |          |               |
|        |   \----[]----/              \----[]----/               |
|        |                                                        |
|        |  [Chat]                              [E] to interact   |
+--------+-------------------------------------------------------+
```

**Avatar Store (Desktop):**

```
+--------+-------------------------------------------------------+
|        |  Avatar Store                          [Tokens: 350]  |
|        |-------------------------------------------------------|
|Sidebar |  [Hats] [Outfits] [Accessories] [Colors] [Effects]   |
|        |-------------------------------------------------------|
|        |  +--------+ +--------+ +--------+ +--------+         |
|        |  | Crown  | | Fedora | | Pirate | | Wizard |         |
|        |  | [img]  | | [img]  | | [img]  | | [img]  |         |
|        |  | 50 tkn | | 30 tkn | | 75 tkn | | 100tkn |         |
|        |  | Gold   | | Bronze | | Gold   | | Plat.  |         |
|        |  +--------+ +--------+ +--------+ +--------+         |
|        |                                                        |
|        |  +--------+ +--------+ +--------+ +--------+         |
|        |  | Beanie | | Cap    | | Bow    | | Antler |         |
|        |  | [img]  | | [img]  | | [img]  | | [img]  |         |
|        |  | 20 tkn | | 15 tkn | | 25 tkn | | FREE   |         |
|        |  | Bronze | | Bronze | | Silver | | Event  |         |
|        |  +--------+ +--------+ +--------+ +--------+         |
|        |                                                        |
|        |  [Preview: Your avatar with selected item]             |
|        |  [Buy for 50 tokens]                [Back to Plaza]   |
+--------+-------------------------------------------------------+
```

**Mini Game Selection (in Game House or Tools tab):**

```
+--------+-------------------------------------------------------+
|        |  Game House                            [Tokens: 350]  |
|        |-------------------------------------------------------|
|Sidebar |  Educational Mini Games                                |
|        |                                                        |
|        |  +------------------+ +------------------+             |
|        |  | MATH BLITZ       | | WORD SCRAMBLE    |             |
|        |  | [calculator icon]| | [letters icon]   |             |
|        |  | Speed math race  | | Unscramble words |             |
|        |  | 1-4 players      | | 1-6 players      |             |
|        |  | [Play Solo]      | | [Play Solo]      |             |
|        |  | [Find Match]     | | [Find Match]     |             |
|        |  +------------------+ +------------------+             |
|        |                                                        |
|        |  +------------------+ +------------------+             |
|        |  | TYPING RACE      | | SCIENCE TRIVIA   |             |
|        |  | [keyboard icon]  | | [flask icon]     |             |
|        |  | Type to race     | | 10-question quiz |             |
|        |  | 1-8 players      | | 1-6 players      |             |
|        |  | [Play Solo]      | | [Play Solo]      |             |
|        |  | [Find Match]     | | [Find Match]     |             |
|        |  +------------------+ +------------------+             |
|        |                                                        |
|        |  +------------------+ +------------------+             |
|        |  | MEMORY MATCH     | | GEO DASH         |             |
|        |  | [grid icon]      | | [globe icon]     |             |
|        |  | Match pairs      | | World geography  |             |
|        |  | 1-2 players      | | 1-4 players      |             |
|        |  | [Play Solo]      | | [Play Solo]      |             |
|        |  | [Find Match]     | | [Find Match]     |             |
|        |  +------------------+ +------------------+             |
|        |                                                        |
|        |                                  [Back to Plaza]       |
+--------+-------------------------------------------------------+
```

### 5.4 Navigation Integration

Add to `lib/auth/permissions.ts` in `getRoleMenuItems()`:

**Student nav (add after "Tools Arcade"):**
```typescript
{ label: 'Virtual Plaza', href: '/plaza', icon: 'Map' },
```

**Teacher nav (add at end):**
```typescript
{ label: 'Plaza Manage', href: '/teacher/plaza', icon: 'Map' },
```

**Admin nav (add in Settings area):**
```typescript
{ label: 'Plaza Settings', href: '/admin/plaza', icon: 'Map' },
```

Add `Map` to the `ICON_MAP` in `components/layout/Sidebar.tsx`.

---

## 6. Technical Implementation

### 6.1 Rendering Engine: Canvas2D

**Decision: HTML5 Canvas2D (no external library for Phase 1).**

Rationale:
- Zero additional dependencies (already have React + DOM)
- Sufficient for a 2D top-down world with <100 sprites
- Easier to understand and debug than PixiJS for the team
- Lower bundle size impact than PixiJS (~200KB saved)
- Can upgrade to PixiJS later if performance demands it (Phase 2 consideration)
- Canvas2D handles our use case: simple shapes, text, basic animations

**Game loop architecture:**

```typescript
// lib/plaza/game-loop.ts
class PlazaGameLoop {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private lastTime: number = 0
  private running: boolean = false

  // State
  private localAvatar: AvatarState
  private remoteAvatars: Map<string, RemoteAvatarState>
  private room: RoomData
  private camera: CameraState
  private chatBubbles: Map<string, ChatBubbleState>
  private decorations: Decoration[]

  start() {
    this.running = true
    this.lastTime = performance.now()
    requestAnimationFrame(this.tick.bind(this))
  }

  stop() {
    this.running = false
  }

  private tick(now: number) {
    if (!this.running) return
    const dt = (now - this.lastTime) / 1000  // Delta time in seconds
    this.lastTime = now

    this.update(dt)  // Physics + logic
    this.render()    // Draw everything
    requestAnimationFrame(this.tick.bind(this))
  }

  private update(dt: number) {
    // 1. Process input (keyboard/touch)
    // 2. Update local avatar position (with collision)
    // 3. Interpolate remote avatars
    // 4. Update camera to follow local avatar
    // 5. Update chat bubble timers (fade out expired)
    // 6. Update decoration animations (fountain ripple, etc.)
    // 7. Broadcast position if changed (throttled to 10Hz)
  }

  private render() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    ctx.save()
    // Apply camera transform
    ctx.translate(-this.camera.x, -this.camera.y)
    ctx.scale(this.camera.zoom, this.camera.zoom)

    // 1. Draw ground/background
    this.drawBackground()
    // 2. Draw decorations (below avatars)
    this.drawDecorations()
    // 3. Draw buildings
    this.drawBuildings()
    // 4. Draw all avatars (sorted by Y for depth)
    this.drawAvatars()
    // 5. Draw chat bubbles
    this.drawChatBubbles()
    // 6. Draw interaction prompts
    this.drawInteractionPrompts()

    ctx.restore()
  }
}
```

### 6.2 Camera System

```typescript
interface CameraState {
  x: number       // Top-left corner X in world space
  y: number       // Top-left corner Y in world space
  zoom: number    // 1.0 = no zoom, 2.0 = 2x zoom
  viewWidth: number   // Canvas element width
  viewHeight: number  // Canvas element height
}

// Camera follows the local player with smooth lerp
function updateCamera(camera: CameraState, playerX: number, playerY: number, dt: number) {
  const targetX = playerX - camera.viewWidth / (2 * camera.zoom)
  const targetY = playerY - camera.viewHeight / (2 * camera.zoom)

  const lerpFactor = 1 - Math.pow(0.001, dt) // Smooth follow
  camera.x += (targetX - camera.x) * lerpFactor
  camera.y += (targetY - camera.y) * lerpFactor

  // Clamp to room bounds
  camera.x = Math.max(0, Math.min(camera.x, roomWidth - camera.viewWidth / camera.zoom))
  camera.y = Math.max(0, Math.min(camera.y, roomHeight - camera.viewHeight / camera.zoom))
}
```

### 6.3 Real-Time Sync Architecture

**Channel management:**

```typescript
// hooks/usePlazaRealtime.ts
function usePlazaRealtime(tenantId: string, roomSlug: string) {
  const supabase = createClient()
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    const channel = supabase.channel(`plaza:${tenantId}:${roomSlug}`, {
      config: { presence: { key: userId } }
    })

    // Track presence (who is in the room)
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      // Update remote avatars map from presence state
    })

    channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
      // Show "Player joined" notification
    })

    channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      // Remove avatar from render list
    })

    // Listen for broadcasts (movement, chat, emotes)
    channel.on('broadcast', { event: 'move' }, ({ payload }) => {
      // Update remote avatar position for interpolation
    })

    channel.on('broadcast', { event: 'chat' }, ({ payload }) => {
      // Show chat bubble above the avatar
    })

    channel.on('broadcast', { event: 'emote' }, ({ payload }) => {
      // Trigger emote animation on avatar
    })

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          userId,
          displayName,
          avatarConfig,
          x: spawnX,
          y: spawnY,
          facing: 'down'
        })
      }
    })

    channelRef.current = channel

    return () => {
      channel.unsubscribe()
    }
  }, [tenantId, roomSlug])

  // Movement broadcast (throttled to 10Hz)
  const broadcastMove = useThrottle((x, y, facing) => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'move',
      payload: { userId, x: Math.round(x), y: Math.round(y), facing }
    })
  }, 100)

  return { broadcastMove, broadcastChat, broadcastEmote, channel: channelRef }
}
```

### 6.4 State Management

**Zustand store for plaza state:**

```typescript
// lib/plaza/store.ts
import { create } from 'zustand'

interface PlazaStore {
  // Avatar
  localAvatar: AvatarState | null
  setLocalAvatar: (avatar: AvatarState) => void

  // Remote players
  remoteAvatars: Map<string, RemoteAvatarState>
  setRemoteAvatar: (userId: string, state: RemoteAvatarState) => void
  removeRemoteAvatar: (userId: string) => void

  // Room
  currentRoom: string
  setCurrentRoom: (room: string) => void
  roomData: RoomData | null
  setRoomData: (data: RoomData) => void

  // Chat
  activeBubbles: Map<string, ChatBubble>
  addBubble: (userId: string, phrase: string) => void
  removeBubble: (userId: string) => void

  // Tokens
  tokenBalance: number
  setTokenBalance: (balance: number) => void
  addTokens: (amount: number) => void

  // UI state
  isStoreOpen: boolean
  isGameLobbyOpen: boolean
  isChatOpen: boolean
  selectedBuilding: string | null
  setUIState: (key: string, value: boolean) => void
}
```

### 6.5 Performance Optimization

1. **Offscreen canvas for static elements:** Render the room background, decorations, and buildings once to an offscreen canvas. Only re-render when the room changes. Composite this as a single drawImage call in the main render loop.

2. **Spatial culling:** Only render avatars and decorations within the camera viewport + 64px buffer. Skip draw calls for off-screen entities.

3. **Avatar sprite caching:** Pre-render each unique avatar configuration to a small offscreen canvas. Cache by config hash. Re-render only when equipment changes.

4. **Throttled network updates:** Position broadcasts at 10Hz (100ms intervals). Presence updates only on room change. Chat events are immediate but rate-limited.

5. **RequestAnimationFrame gating:** If the browser tab is hidden (document.hidden === true), pause the game loop entirely. Resume on tab focus.

6. **Canvas resolution scaling:** On mobile/low-DPI screens, render at 1x device pixel ratio. On high-DPI, cap at 2x to avoid excessive pixel counts.

7. **Lazy component loading:** Mini game components are dynamically imported only when the player enters a game. The plaza canvas and game components are code-split.

### 6.6 Mobile Controls Implementation

**Virtual Joystick:**

```typescript
// components/plaza/VirtualJoystick.tsx
// Rendered as an HTML overlay on top of the canvas (not drawn on canvas)
// Position: fixed bottom-left, 120px diameter outer ring, 48px inner knob
// Touch input:
//   - onTouchStart on the outer ring: record center point
//   - onTouchMove: calculate angle and distance from center
//   - angle determines direction (8-way snapping or analog)
//   - distance (0 to maxRadius) determines speed factor (0 to 1)
//   - Pass normalized dx, dy to movement system
//   - onTouchEnd: knob snaps back to center, stop movement
// Visual: semi-transparent circles, disappears after 3s of no touch
```

**Action Button:**
```typescript
// components/plaza/ActionButton.tsx
// Fixed bottom-right, 56px circular button
// Labeled with context: "Enter" near doors, "Chat" in open areas
// onTap: triggers the context action (enter building, open chat picker)
```

---

## 7. Server Actions & API

### 7.1 Server Action Signatures

File: `app/actions/plaza.ts`

```typescript
'use server'

// ---- Avatar ----

/** Create initial avatar for user (called on first plaza visit) */
export async function createAvatar(displayName: string): Promise<PlazaAvatar>

/** Update avatar appearance (equip/unequip items, change colors) */
export async function updateAvatarConfig(config: AvatarConfig): Promise<PlazaAvatar>

/** Update avatar position in DB (called on room change, not every frame) */
export async function updateAvatarRoom(roomSlug: string, x: number, y: number): Promise<void>

/** Set avatar online/offline status */
export async function setAvatarOnlineStatus(isOnline: boolean): Promise<void>

/** Get avatar data for current user */
export async function getMyAvatar(): Promise<PlazaAvatar | null>

/** Get all online avatars in a room */
export async function getRoomAvatars(roomSlug: string): Promise<PlazaAvatar[]>

// ---- Store / Inventory ----

/** Get all available items in the store (with owned/equipped status) */
export async function getStoreItems(category?: string): Promise<StoreItem[]>

/** Purchase an item from the store */
export async function purchaseItem(itemId: string): Promise<PurchaseResult>

/** Equip an owned item */
export async function equipItem(itemId: string): Promise<void>

/** Unequip an item from a slot */
export async function unequipItem(slot: string): Promise<void>

/** Get user's inventory */
export async function getInventory(): Promise<InventoryItem[]>

// ---- Tokens ----

/** Get token balance and recent transaction history */
export async function getTokenInfo(): Promise<TokenInfo>

/** Award tokens (server-side only, called from game completion, etc.) */
export async function awardTokens(
  amount: number,
  transactionType: string,
  sourceType: string,
  sourceId?: string,
  description?: string
): Promise<TokenTransaction>

/** Get token leaderboard */
export async function getTokenLeaderboard(
  period: 'weekly' | 'monthly' | 'all_time',
  limit?: number
): Promise<LeaderboardEntry[]>

// ---- Mini Games ----

/** Get all available mini games */
export async function getMiniGames(): Promise<MiniGame[]>

/** Create a game session (solo or multiplayer lobby) */
export async function createGameSession(
  gameSlug: string,
  mode: 'solo' | 'multiplayer',
  difficulty?: string
): Promise<GameSession>

/** Join an existing multiplayer game session */
export async function joinGameSession(sessionId: string): Promise<GameSession>

/** Start a game session (host only, transitions waiting -> in_progress) */
export async function startGameSession(sessionId: string): Promise<void>

/** Submit game score at end of game */
export async function submitGameScore(
  sessionId: string,
  score: number,
  accuracy: number,
  timeTaken: number,
  correctAnswers: number,
  totalQuestions: number
): Promise<GameScoreResult>

/** Get high scores for a game */
export async function getGameHighScores(
  gameSlug: string,
  limit?: number
): Promise<GameScore[]>

/** Get user's personal bests across all games */
export async function getPersonalBests(): Promise<PersonalBest[]>

// ---- Study Sessions ----

/** Create a new study session */
export async function createStudySession(
  title: string,
  subject: string,
  sessionType: 'pomodoro' | 'free_form' | 'timed',
  workMinutes?: number,
  breakMinutes?: number,
  totalRounds?: number
): Promise<StudySession>

/** Join an existing study session */
export async function joinStudySession(sessionId: string): Promise<void>

/** Leave a study session */
export async function leaveStudySession(sessionId: string): Promise<void>

/** Update study session timer state (host only) */
export async function updateStudyTimerState(
  sessionId: string,
  timerState: string,
  remainingSeconds?: number
): Promise<void>

/** Complete a pomodoro round (awards XP/tokens per round) */
export async function completeStudyRound(sessionId: string): Promise<RoundReward>

/** Get active study sessions in tenant */
export async function getActiveStudySessions(): Promise<StudySession[]>

// ---- Documentary / Theater ----

/** Schedule a documentary session (teacher/admin only) */
export async function scheduleDocumentary(
  title: string,
  description: string,
  videoUrl: string,
  scheduledAt: string,
  subject: string,
  duration: number
): Promise<DocumentarySession>

/** Join a documentary session as viewer */
export async function joinDocumentary(sessionId: string): Promise<void>

/** Update documentary playback state (host only) */
export async function updateDocumentaryPlayback(
  sessionId: string,
  state: string,
  positionSeconds: number
): Promise<void>

/** Record watch time and check for rewards */
export async function recordWatchProgress(
  sessionId: string,
  watchTimeSeconds: number,
  watchPercent: number
): Promise<WatchReward | null>

/** Get upcoming documentary sessions */
export async function getUpcomingDocumentaries(): Promise<DocumentarySession[]>

// ---- Chat Phrases ----

/** Get all available chat phrases */
export async function getChatPhrases(): Promise<ChatPhrase[]>

// ---- Rooms ----

/** Get all available rooms with occupant counts */
export async function getPlazaRooms(): Promise<RoomInfo[]>

/** Get room data (map config, buildings, decorations) */
export async function getRoomData(roomSlug: string): Promise<RoomData>

// ---- Daily Login ----

/** Record daily plaza login (awards tokens if new day) */
export async function recordDailyLogin(): Promise<DailyLoginResult>
```

### 7.2 Real-Time Channel Design

| Channel Pattern | Purpose | Events |
|----------------|---------|--------|
| `plaza:{tenantId}:{roomSlug}` | Room presence + movement | `move`, `chat`, `emote`, `game_invite` |
| `game:{tenantId}:{sessionId}` | Game session sync | `answer`, `score_update`, `round_end`, `game_end` |
| `study:{tenantId}:{sessionId}` | Study session sync | `timer_update`, `round_complete`, `member_join`, `member_leave` |
| `theater:{tenantId}:{sessionId}` | Documentary sync | `playback_update`, `viewer_count` |

### 7.3 Rate Limiting

Using existing `@upstash/ratelimit` infrastructure:

| Action | Rate Limit | Window |
|--------|-----------|--------|
| `awardTokens` | 30 requests | per minute |
| `purchaseItem` | 10 requests | per minute |
| `submitGameScore` | 5 requests | per minute |
| `createGameSession` | 10 requests | per minute |
| `recordDailyLogin` | 3 requests | per hour |
| `updateAvatarConfig` | 20 requests | per minute |
| Chat broadcast | 20 messages | per minute |

**Anti-cheat for token earning:**
- Server validates game scores before awarding tokens
- Maximum possible score per game type is known; reject scores exceeding theoretical max
- Time validation: game must have lasted at least minimum duration
- Session must exist in `plaza_game_sessions` and be in `in_progress` state
- One score submission per user per session (enforced by UNIQUE constraint)
- Daily token cap: 200 tokens per day (configurable)

---

## 8. Permissions & Access Control

### 8.1 Permission Matrix

Add new resource `plaza` to `lib/auth/permissions.ts`:

```typescript
// Add to Resource type
| 'plaza'

// Permission matrix additions:
student: {
  plaza: ['read', 'create'],    // Access plaza, create avatars, play games, join sessions
},
teacher: {
  plaza: ['read', 'create', 'update'],  // + schedule documentaries, manage study sessions
},
parent: {
  plaza: ['read'],              // View child's avatar/stats (no plaza access themselves)
},
admin: {
  plaza: ['create', 'read', 'update', 'delete'],  // Full control: manage items, rooms, phrases
},
super_admin: {
  plaza: ['create', 'read', 'update', 'delete', 'export'],  // + export analytics
},
```

### 8.2 Detailed Access Rules

| Action | Student | Teacher | Parent | Admin | Super Admin |
|--------|---------|---------|--------|-------|-------------|
| Enter plaza & walk around | Yes | Yes | No | Yes | Yes |
| Create/customize avatar | Yes | Yes | No | Yes | Yes |
| Use pre-scripted chat | Yes | Yes | No | Yes | Yes |
| Play mini games | Yes | Yes | No | Yes | Yes |
| Earn/spend tokens | Yes | Yes | No | No | No |
| Create study sessions | Yes | Yes | No | No | No |
| Join study sessions | Yes | Yes | No | No | No |
| Schedule documentaries | No | Yes | No | Yes | Yes |
| Watch documentaries | Yes | Yes | No | Yes | Yes |
| View child's avatar/stats | No | No | Yes | No | No |
| Manage store items | No | No | No | Yes | Yes |
| Manage chat phrases | No | No | No | Yes | Yes |
| Manage rooms | No | No | No | Yes | Yes |
| Grant/deduct tokens | No | No | No | Yes | Yes |
| View plaza analytics | No | Yes (own classes) | No | Yes | Yes |
| Ban user from plaza | No | No | No | Yes | Yes |

### 8.3 Moderation Tools

**Admin moderation panel (`/admin/plaza`):**
- View all online users and their locations
- Temporarily disable a user's plaza access (sets a `plaza_banned_until` field on the avatar)
- Review chat usage logs (which phrases each user selected, with timestamps)
- Add/remove/edit chat phrases per tenant
- Set maximum occupancy per room
- Emergency: disable plaza entirely for tenant (toggle in tenant settings)

**Teacher moderation:**
- Teachers can see their students' token balances and game history
- Teachers can report concerning avatar names to admin
- Teachers can mute a student's chat for the current session

### 8.4 Safety Features

1. **No free-text chat.** Only pre-approved phrases from `plaza_chat_phrases`. This is the most critical safety feature for K-12 compliance.
2. **Display names are validated.** Must be 2-20 characters, alphanumeric + spaces only. Checked against a blocklist of inappropriate words on creation.
3. **Avatar configs are server-validated.** All cosmetic items must exist in `plaza_avatar_items` and be owned by the user.
4. **No private messaging in plaza.** Chat bubbles are visible to all users in the room. No whisper/DM system.
5. **Session recording.** All game sessions, study sessions, and token transactions are logged with timestamps for audit.
6. **Automatic timeout.** If a user is idle for 15 minutes, they are set offline and removed from the room channel.
7. **Parental visibility.** Parents can see their child's avatar, token balance, game history, and study session participation through the parent dashboard.
8. **COPPA/FERPA compliance.** No personal information is shared between students beyond display name and avatar. No location data, no real photos, no private communication.

---

## 9. Token Economy Design

### 9.1 Earning Rates

| Activity | Tokens | Frequency | Daily Cap Notes |
|----------|--------|-----------|-----------------|
| **Mini Games** | | | |
| Game participation (any game) | 5 | Per game | Max 20 games/day = 100 tokens |
| Game win (multiplayer) | 15 | Per win | |
| Perfect score (100% accuracy) | 30 | Per game | |
| New personal best | 10 | Per game | Once per game per day |
| **Daily Login** | | | |
| First plaza visit of the day | 10 | Daily | |
| 7-day login streak | 25 | Weekly | |
| 14-day login streak | 50 | Bi-weekly | |
| 30-day login streak | 100 | Monthly | |
| **Study Sessions** | | | |
| Complete a pomodoro round (25 min) | 5 | Per round | Max 8 rounds/day = 40 tokens |
| Complete full session (4 rounds) | 15 | Per session | Bonus on top of per-round |
| Group study bonus (3+ people) | 5 | Per round | Extra per round if in group |
| **Quiz Performance** | | | |
| Score 90%+ on a course quiz | 15 | Per quiz | |
| Score 100% on a course quiz | 25 | Per quiz | |
| **Achievements** | | | |
| Unlock a bronze achievement | 10 | Per achievement | |
| Unlock a silver achievement | 25 | Per achievement | |
| Unlock a gold achievement | 50 | Per achievement | |
| Unlock a platinum achievement | 100 | Per achievement | |
| **Documentary Watching** | | | |
| Watch 80%+ of a documentary | 10 | Per session | Max 3/day |
| **Events (admin-granted)** | | | |
| Special event bonus | Variable | Manual | Admin tool |

### 9.2 Daily Token Cap

**Hard cap: 200 tokens per day per user.**

Once a user hits 200 tokens earned in a calendar day (tenant timezone), all further earning actions return 0 tokens. The UI shows "Daily token limit reached - come back tomorrow!" This prevents grinding and maintains healthy engagement.

### 9.3 Item Pricing Tiers

| Rarity | Token Price Range | Examples |
|--------|------------------|----------|
| **Bronze** | 10-30 tokens | Basic hats, simple colors, default accessories |
| **Silver** | 40-80 tokens | Patterned outfits, fun accessories, eye styles |
| **Gold** | 100-200 tokens | Animated hats, premium outfits, trail effects |
| **Platinum** | 250-500 tokens | Legendary items, animated backgrounds, rare emotes |

**Starter items (free):**
- 5 body colors (blue, green, red, purple, orange)
- Default eye style
- Default body shape (circle)

**Example item catalog (seed data):**

| Item | Category | Rarity | Price | Min Level |
|------|----------|--------|-------|-----------|
| Baseball Cap | hat | bronze | 15 | 1 |
| Wizard Hat | hat | silver | 50 | 3 |
| Crown | hat | gold | 150 | 8 |
| Wolf Ears | hat | platinum | 350 | 15 |
| Ocean Blue Tee | outfit | bronze | 20 | 1 |
| Lab Coat | outfit | silver | 60 | 5 |
| Astronaut Suit | outfit | gold | 175 | 10 |
| Golden Armor | outfit | platinum | 400 | 15 |
| Pencil | accessory | bronze | 10 | 1 |
| Telescope | accessory | silver | 45 | 3 |
| Magic Wand | accessory | gold | 120 | 8 |
| Trident | accessory | platinum | 300 | 15 |
| Forest Green | color_palette | bronze | 10 | 1 |
| Sunset Gradient | color_palette | silver | 40 | 3 |
| Holographic | color_palette | gold | 130 | 8 |
| Cosmic Nebula | color_palette | platinum | 280 | 15 |
| Sparkle Trail | trail_effect | silver | 60 | 3 |
| Flame Trail | trail_effect | gold | 140 | 8 |
| Rainbow Trail | trail_effect | platinum | 350 | 15 |
| Wave Emote | emote | bronze | 15 | 1 |
| Dance Emote | emote | silver | 50 | 5 |
| Fireworks Emote | emote | gold | 110 | 10 |
| Ocean Background | background | silver | 70 | 5 |
| Northern Lights | background | gold | 160 | 10 |
| Galaxy Background | background | platinum | 400 | 20 |

### 9.4 Anti-Inflation Mechanics

1. **Daily earn cap (200 tokens):** Prevents runaway accumulation from grinding.
2. **Token sinks:** High-priced platinum items (300-500 tokens) require multiple days of earning.
3. **Limited edition items:** Seasonal items available for a limited time create urgency to spend.
4. **Level gating:** Expensive items require high avatar levels to purchase, pacing spending.
5. **No token trading between users.** Tokens are non-transferable.
6. **Admin adjustment tool:** Admins can globally adjust prices or add token sinks if inflation occurs.
7. **Graduated pricing:** New items can be priced higher, keeping the economy fresh.

### 9.5 Integration with Existing XP System

- **XP and Tokens are separate currencies.** XP is earned from all LMS activities (existing system). Tokens are earned from Plaza activities.
- **Avatar level mirrors XP level.** `plaza_avatars.avatar_level` is synced from `user_levels.current_level`. No separate leveling.
- **XP events from Plaza activities:** Mini game completion, study sessions, and documentary watching also award XP through the existing `awardXP()` function. This means Plaza activities contribute to the student's overall progression.
- **New XP event types to add to `XP_CONFIG.events`:**

```typescript
// Add to lib/config/constants.ts XP_CONFIG.events
plaza_game_complete: 10,       // Finish any mini game
plaza_game_win: 20,            // Win a multiplayer game
plaza_study_round: 15,         // Complete a pomodoro round
plaza_study_session: 30,       // Complete a full study session
plaza_documentary_watch: 20,   // Watch 80%+ of a documentary
plaza_daily_login: 5,          // First plaza visit of the day
```

---

## 10. Phase Plan

### Phase 1: Foundation (Week 1-2)
- Database migration with all 13 tables
- Avatar creation and customization UI
- Basic plaza canvas with movement (local only, no multiplayer)
- Room rendering with placeholder art
- Building collision and door interaction
- Mobile touch controls and virtual joystick

### Phase 2: Multiplayer & Chat (Week 3-4)
- Supabase Realtime channels for presence and broadcast
- Remote avatar rendering with interpolation
- Chat phrase system (picker UI + bubble rendering)
- Room transitions (enter/exit buildings)
- Online player count display
- Idle timeout and disconnect handling

### Phase 3: Token Economy & Store (Week 5-6)
- Token transaction system (earn/spend/balance)
- Avatar Store UI with category browsing
- Purchase flow with confirmation
- Inventory/wardrobe system
- Equip/unequip items with avatar preview
- Daily login token rewards
- Token leaderboard

### Phase 4: Mini Games (Week 7-9)
- Mini game framework (shared components: lobby, HUD, results)
- Math Blitz implementation
- Word Scramble implementation
- Typing Race implementation
- Science Trivia implementation
- Memory Match implementation
- Geography Dash implementation
- Solo play + multiplayer lobby
- Score submission and high score tables
- Token rewards for game performance
- Integration with Tools Arcade tab

### Phase 5: Study Sessions (Week 10)
- Study session creation and lobby
- Pomodoro timer with synced state
- Join/leave sessions
- Group XP bonus
- Token rewards for completed rounds
- Active session list in Study Hall

### Phase 6: Documentary Theater (Week 11)
- Documentary scheduling (teacher/admin)
- Synced video playback
- Viewer tracking and watch time recording
- XP/token rewards for watching
- Upcoming sessions list
- Theater room UI

### Phase 7: Admin & Moderation (Week 12)
- Admin plaza settings panel
- Item management (CRUD for store items)
- Chat phrase management
- User moderation tools
- Plaza analytics dashboard
- Parent visibility of child's plaza stats

### Phase 8: Polish & QA (Week 13-14)
- Animation polish (transitions, bubbles, particles)
- Sound effects (movement, chat, purchase, game start)
- Performance optimization pass
- Mobile testing and bug fixes
- Accessibility audit (screen reader labels, keyboard nav)
- Load testing with multiple concurrent users
- Beta testing with 1-2 tenants

### 10.1 Full File Structure

```
app/
  plaza/
    page.tsx                          -- Main plaza world
    layout.tsx                        -- Plaza layout (minimal sidebar)
    store/
      page.tsx                        -- Avatar Store
    games/
      page.tsx                        -- Game selection
      [gameSlug]/
        page.tsx                      -- Play a specific game
    study/
      page.tsx                        -- Study session lobby
    theater/
      page.tsx                        -- Documentary theater
    avatar/
      page.tsx                        -- Avatar customization

  student/
    tools/
      page.tsx                        -- Updated tools page with mini games
      math-blitz/
        page.tsx
      word-scramble/
        page.tsx
      typing-race/
        page.tsx
      science-trivia/
        page.tsx
      memory-match/
        page.tsx
      geography-dash/
        page.tsx

  teacher/
    plaza/
      page.tsx                        -- Teacher plaza management

  admin/
    plaza/
      page.tsx                        -- Admin plaza settings & moderation

  actions/
    plaza.ts                          -- All plaza server actions
    plaza-games.ts                    -- Game-specific server actions
    plaza-store.ts                    -- Store/inventory server actions
    plaza-study.ts                    -- Study session server actions
    plaza-theater.ts                  -- Documentary server actions

components/
  plaza/
    PlazaCanvas.tsx
    PlazaRenderer.ts
    PlazaCamera.ts
    PlazaRoom.tsx
    PlazaBuilding.tsx
    PlazaDecoration.tsx
    AvatarSprite.tsx
    AvatarCustomizer.tsx
    AvatarPreview.tsx
    AvatarNameplate.tsx
    ChatBubble.tsx
    ChatPhraseSelector.tsx
    ChatButton.tsx
    PlazaControls.tsx
    VirtualJoystick.tsx
    ActionButton.tsx
    PlazaMinimap.tsx
    PlazaHUD.tsx
    StoreLayout.tsx
    StoreItemCard.tsx
    StoreItemDetail.tsx
    StorePurchaseDialog.tsx
    StoreInventory.tsx
    GameLobby.tsx
    GameSelector.tsx
    GameCard.tsx
    GameHUD.tsx
    GameResults.tsx
    GameLeaderboard.tsx
    games/
      MathBlitz.tsx
      WordScramble.tsx
      TypingRace.tsx
      ScienceTrivia.tsx
      MemoryMatch.tsx
      GeographyDash.tsx
    StudySessionLobby.tsx
    StudySessionRoom.tsx
    StudyTimer.tsx
    StudyParticipants.tsx
    TheaterSchedule.tsx
    TheaterViewer.tsx
    TheaterSeatMap.tsx
    TokenDisplay.tsx
    TokenAnimation.tsx
    PlazaLoading.tsx
    hooks/
      usePlazaCanvas.ts
      usePlazaMovement.ts
      usePlazaRealtime.ts
      usePlazaPresence.ts
      usePlazaChat.ts
      usePlazaAvatar.ts
      useTokenBalance.ts
      useMiniGame.ts
      useVirtualJoystick.ts
    utils/
      collision.ts
      pathfinding.ts
      interpolation.ts
      spriteRenderer.ts
      roomLoader.ts

lib/
  plaza/
    store.ts                          -- Zustand store
    game-loop.ts                      -- Canvas game loop class
    constants.ts                      -- Plaza-specific constants
    types.ts                          -- TypeScript types
    game-data/
      math-blitz.ts                   -- Question generators
      word-scramble.ts                -- Word lists per grade
      typing-race.ts                  -- Passage database
      science-trivia.ts               -- Question bank
      memory-match.ts                 -- Card pair generators
      geography-dash.ts               -- Geography data

  config/
    constants.ts                      -- Add new XP events

  auth/
    permissions.ts                    -- Add plaza resource

supabase/
  migrations/
    20260211_plaza_schema.sql         -- All plaza tables
  seed/
    plaza-default-items.sql           -- Default store items
    plaza-default-phrases.sql         -- Default chat phrases
    plaza-default-rooms.sql           -- Default room configs
    plaza-default-games.sql           -- Default game definitions
```

---

## 11. Mini Games in Tools Tab

Mini games must be playable BOTH from the plaza (Game House building) AND from the regular Tools Arcade sidebar navigation.

### 11.1 Dual Access Pattern

The mini game components (`MathBlitz.tsx`, `WordScramble.tsx`, etc.) are shared components. They accept a `context` prop that determines behavior:

```typescript
interface MiniGameContext {
  source: 'plaza' | 'tools'
  // If 'plaza': multiplayer available, tokens awarded, in-game lobby
  // If 'tools': solo-only by default, tokens still awarded, standalone page
  channel?: RealtimeChannel  // Only present if source === 'plaza'
  sessionId?: string         // Only present if source === 'plaza' multiplayer
}
```

### 11.2 Tools Tab Integration

Update `app/student/tools/page.tsx` to list all mini games alongside the existing chess game:

```
Tools Arcade page shows:
  - Chess (existing)
  - Math Blitz (new)
  - Word Scramble (new)
  - Typing Race (new)
  - Science Trivia (new)
  - Memory Match (new)
  - Geography Dash (new)
```

Each game has its own route under `/student/tools/[gameSlug]` and renders the same game component but in `tools` context (solo mode, standalone page layout with back button).

### 11.3 Differences Between Contexts

| Feature | Plaza Context | Tools Context |
|---------|--------------|---------------|
| Multiplayer | Yes (lobby) | Solo only |
| Token rewards | Yes | Yes (same rates) |
| XP rewards | Yes | Yes (same rates) |
| Visual frame | Minimal (in-game overlay) | Full page with sidebar |
| Navigation | Back to Game House | Back to Tools Arcade |
| High scores | Plaza leaderboard | Same leaderboard |
| Avatar visible | Yes (in lobby) | No |

---

## 12. Future Ideas

These are exciting extensions that are out of scope for the initial implementation but should be kept in mind:

- **Seasonal events:** Holiday-themed plaza decorations, limited-time items, event-only mini games (Halloween maze, winter snowball fight, etc.)
- **Pet system:** Earn or buy a virtual pet that follows your avatar around the plaza
- **Igloo/dorm rooms:** Personal customizable spaces that other users can visit (direct Club Penguin inspiration)
- **Clubs:** Student-created groups with a shared clubhouse room in the plaza
- **Daily challenges:** A rotating daily mini game challenge with bonus token rewards
- **Quest system:** NPCs in the plaza give educational quests ("Score 80%+ on 3 math games today")
- **Gifting:** Send a store item as a gift to a friend (with teacher/admin approval for safety)
- **Plaza events:** Live events where an admin controls something in the plaza (treasure hunt, trivia night)
- **Sound design:** Ambient music per room, footstep sounds, purchase chimes, game sound effects (integrate with existing `howler` dependency)
- **PixiJS upgrade:** If performance becomes an issue with 50+ concurrent avatars, migrate the renderer from Canvas2D to PixiJS for WebGL acceleration
- **3D upgrade:** Far future -- upgrade to a 2.5D or simple 3D world using Three.js
- **AR avatar viewer:** View your avatar in AR on mobile (very far future)
- **Cross-tenant plaza:** A global "Wolf Whale World" where students from different schools can meet in a safe, supervised space
- **Mini game creation toolkit:** Teachers can create custom trivia games with their own questions
- **Accessibility mode:** Alternative text-based plaza experience for screen reader users
- **Achievement integration:** Plaza-specific achievements ("Play 50 games," "Earn 1000 tokens," "Complete 10 study sessions")
- **Spectator mode for games:** Watch other students play mini games in real time
- **Tournament system:** Scheduled mini game tournaments with brackets and prizes
- **Teacher-led plaza tours:** Teachers can "lead" a group of student avatars through the plaza, pointing out buildings

---

*This plan is the blueprint for the Virtual Plaza. Each phase should be implemented incrementally, committed after verification, and tested before moving to the next. The ocean town awaits its citizens.*
