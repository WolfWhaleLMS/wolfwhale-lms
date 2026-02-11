# Skill Tree System - Comprehensive Implementation Plan

**Feature:** Skyrim-Inspired Skill Tree for Wolf Whale LMS
**Status:** Planning
**Author:** Agent Orion
**Date:** 2026-02-10

---

## Vision

Every subject in Wolf Whale LMS becomes a **Realm** -- a sprawling constellation map that students navigate by completing courses and lessons. Inspired by Skyrim's perk trees and the night-sky aesthetic of constellation maps, each Realm presents branching paths of skills that glow to life as students master them. The Skill Tree transforms the flat course catalog into an explorable, spatial journey where every node represents knowledge earned and every glowing connection is a path conquered.

The core metaphor: **Students are explorers charting constellations of knowledge across the academic sky.**

---

## Table of Contents

1. [Database Schema](#1-database-schema)
2. [Visual Design System](#2-visual-design-system)
3. [Game Mechanics](#3-game-mechanics)
4. [UI Pages and Routes](#4-ui-pages-and-routes)
5. [Technical Implementation](#5-technical-implementation)
6. [Server Actions and API](#6-server-actions-and-api)
7. [Permissions and Access Control](#7-permissions-and-access-control)
8. [Migration Strategy](#8-migration-strategy)
9. [Testing Plan](#9-testing-plan)
10. [Future Ideas (Later)](#10-future-ideas-later)

---

## 1. Database Schema

### Overview

Four new tables plus one linking table. All tables are tenant-scoped, follow the existing UUID primary key pattern, and integrate with the current `courses`, `lessons`, `lesson_progress`, and `xp_events` tables.

### 1.1 `skill_trees` (Realms)

Each subject gets one skill tree per tenant. This is the top-level "realm" container.

```sql
CREATE TABLE skill_trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,          -- Maps to SUBJECTS constant: 'Mathematics', 'Science', etc.
  name VARCHAR(255) NOT NULL,             -- Display name: "The Realm of Numbers", "The Living World"
  description TEXT,
  icon VARCHAR(100),                      -- Lucide icon name for the realm
  theme JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- {
    --   "primary_color": "#3b82f6",
    --   "secondary_color": "#1e3a5f",
    --   "accent_color": "#67e8f9",
    --   "bg_gradient": "from-blue-950 via-indigo-950 to-slate-950",
    --   "particle_color": "#93c5fd",
    --   "constellation_style": "crystal"   -- crystal | nature | scroll | flame | etc.
    -- }
  layout_config JSONB DEFAULT '{}'::jsonb,
    -- {
    --   "canvas_width": 3000,
    --   "canvas_height": 2000,
    --   "default_zoom": 0.8,
    --   "min_zoom": 0.3,
    --   "max_zoom": 2.0
    -- }
  grade_level_min VARCHAR(10),            -- e.g., 'K', '6', '9'
  grade_level_max VARCHAR(10),            -- e.g., '5', '8', '12'
  school_year VARCHAR(20),                -- e.g., '2025-2026'
  is_template BOOLEAN DEFAULT false,      -- Admin-created templates
  created_by UUID NOT NULL REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, subject, school_year),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE INDEX idx_st_tenant ON skill_trees(tenant_id);
CREATE INDEX idx_st_subject ON skill_trees(subject);
CREATE INDEX idx_st_status ON skill_trees(status);
CREATE INDEX idx_st_grade ON skill_trees(grade_level_min, grade_level_max);
```

### 1.2 `skill_nodes` (Nodes on the Tree)

Each node represents either a **course** (major node) or a **lesson** (sub-node) within a skill tree. Nodes carry x/y positions for the visual canvas layout.

```sql
CREATE TABLE skill_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  skill_tree_id UUID NOT NULL REFERENCES skill_trees(id) ON DELETE CASCADE,

  -- What this node represents
  name VARCHAR(255) NOT NULL,             -- "Fractions Fundamentals", "Photosynthesis"
  description TEXT,
  node_type VARCHAR(50) NOT NULL,         -- 'realm_root' | 'course' | 'lesson' | 'milestone' | 'capstone'

  -- Mapping to existing content
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,

  -- Visual layout (canvas coordinates)
  pos_x NUMERIC(10, 2) NOT NULL DEFAULT 0,
  pos_y NUMERIC(10, 2) NOT NULL DEFAULT 0,

  -- Visual properties
  icon VARCHAR(100),                      -- Lucide icon name
  size VARCHAR(20) DEFAULT 'medium',      -- 'small' | 'medium' | 'large' | 'epic'
  visual_style JSONB DEFAULT '{}'::jsonb,
    -- {
    --   "shape": "circle",               -- circle | hexagon | diamond | star
    --   "glow_color": "#3b82f6",
    --   "ring_count": 1,                 -- decorative rings around the node
    --   "particle_effect": "sparkle"     -- none | sparkle | pulse | orbit
    -- }

  -- Game mechanics
  xp_reward INT DEFAULT 0,               -- XP awarded when node is mastered
  coin_reward INT DEFAULT 0,
  required_mastery_percent INT DEFAULT 80,  -- % completion needed to "master" node
  tier VARCHAR(50) DEFAULT 'bronze',      -- bronze | silver | gold | platinum mastery ceiling
  difficulty INT DEFAULT 1,               -- 1-5 difficulty rating

  -- Ordering and grouping
  depth_level INT DEFAULT 0,              -- 0 = root, 1 = first branch, 2 = sub-branch, etc.
  sort_order INT DEFAULT 0,               -- For ordering siblings at the same depth

  -- Metadata
  is_optional BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,        -- Hidden until prerequisites met
  unlock_message TEXT,                    -- "You have unlocked the secrets of Algebra!"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_node_type CHECK (node_type IN ('realm_root', 'course', 'lesson', 'milestone', 'capstone')),
  CONSTRAINT valid_size CHECK (size IN ('small', 'medium', 'large', 'epic')),
  CONSTRAINT valid_tier CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  CONSTRAINT valid_difficulty CHECK (difficulty BETWEEN 1 AND 5)
);

CREATE INDEX idx_sn_tree ON skill_nodes(skill_tree_id);
CREATE INDEX idx_sn_tenant ON skill_nodes(tenant_id);
CREATE INDEX idx_sn_course ON skill_nodes(course_id);
CREATE INDEX idx_sn_lesson ON skill_nodes(lesson_id);
CREATE INDEX idx_sn_type ON skill_nodes(node_type);
CREATE INDEX idx_sn_depth ON skill_nodes(skill_tree_id, depth_level);
```

### 1.3 `skill_connections` (Edges / Paths Between Nodes)

Defines the directed graph of parent-child relationships that form the branching paths. Each connection is an edge from one node to another.

```sql
CREATE TABLE skill_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  skill_tree_id UUID NOT NULL REFERENCES skill_trees(id) ON DELETE CASCADE,

  from_node_id UUID NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
  to_node_id UUID NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,

  -- Connection type
  connection_type VARCHAR(50) DEFAULT 'prerequisite',
    -- 'prerequisite'  = must complete from_node before to_node unlocks
    -- 'recommended'   = suggested order but not required
    -- 'branch'        = one of multiple paths (choose your path)
    -- 'shortcut'      = skip-ahead for advanced students

  -- Visual properties
  line_style VARCHAR(50) DEFAULT 'solid',   -- solid | dashed | dotted | glow
  line_color VARCHAR(20),                   -- Override theme color; null = use theme default
  thickness INT DEFAULT 2,                  -- Line thickness in pixels
  curve_style VARCHAR(50) DEFAULT 'bezier', -- straight | bezier | step
  animated BOOLEAN DEFAULT true,            -- Show particle animation on unlocked paths

  -- Requirements
  min_mastery_percent INT DEFAULT 80,       -- Min mastery on from_node to unlock to_node
  min_tier VARCHAR(50),                     -- Minimum tier achieved on from_node (null = any)

  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(from_node_id, to_node_id),
  CONSTRAINT no_self_loop CHECK (from_node_id != to_node_id),
  CONSTRAINT valid_connection_type CHECK (connection_type IN ('prerequisite', 'recommended', 'branch', 'shortcut')),
  CONSTRAINT valid_line_style CHECK (line_style IN ('solid', 'dashed', 'dotted', 'glow')),
  CONSTRAINT valid_curve_style CHECK (curve_style IN ('straight', 'bezier', 'step'))
);

CREATE INDEX idx_sc_tree ON skill_connections(skill_tree_id);
CREATE INDEX idx_sc_from ON skill_connections(from_node_id);
CREATE INDEX idx_sc_to ON skill_connections(to_node_id);
CREATE INDEX idx_sc_type ON skill_connections(connection_type);
```

### 1.4 `student_skill_progress` (Per-Student Node Progress)

Tracks every student's state on every node they have interacted with.

```sql
CREATE TABLE student_skill_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_node_id UUID NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
  skill_tree_id UUID NOT NULL REFERENCES skill_trees(id) ON DELETE CASCADE,

  -- State machine
  status VARCHAR(50) DEFAULT 'locked',
    -- 'locked'       = prerequisites not met, node dimmed
    -- 'available'    = prerequisites met, node glows invitingly
    -- 'in_progress'  = student has started work on this node
    -- 'completed'    = met required_mastery_percent
    -- 'mastered'     = achieved highest tier (platinum)

  -- Progress tracking
  mastery_percent INT DEFAULT 0,           -- 0-100, derived from course/lesson progress
  current_tier VARCHAR(50),                -- Current achieved tier (null if locked)
  xp_earned INT DEFAULT 0,                -- XP earned from this specific node
  coins_earned INT DEFAULT 0,

  -- Timing
  unlocked_at TIMESTAMPTZ,                -- When prerequisites were met
  started_at TIMESTAMPTZ,                 -- When student first engaged
  completed_at TIMESTAMPTZ,               -- When required_mastery_percent reached
  mastered_at TIMESTAMPTZ,                -- When platinum tier achieved
  last_activity_at TIMESTAMPTZ,

  -- Attempts and scoring
  attempts INT DEFAULT 0,
  best_score NUMERIC(5, 2),               -- Best quiz/assignment score for this node
  time_spent_seconds INT DEFAULT 0,

  -- School year tracking
  school_year VARCHAR(20),                -- '2025-2026'

  UNIQUE(student_id, skill_node_id),
  CONSTRAINT valid_status CHECK (status IN ('locked', 'available', 'in_progress', 'completed', 'mastered')),
  CONSTRAINT valid_tier CHECK (current_tier IS NULL OR current_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  CONSTRAINT valid_mastery CHECK (mastery_percent BETWEEN 0 AND 100)
);

CREATE INDEX idx_ssp_student ON student_skill_progress(student_id);
CREATE INDEX idx_ssp_node ON student_skill_progress(skill_node_id);
CREATE INDEX idx_ssp_tree ON student_skill_progress(skill_tree_id);
CREATE INDEX idx_ssp_tenant ON student_skill_progress(tenant_id);
CREATE INDEX idx_ssp_status ON student_skill_progress(status);
CREATE INDEX idx_ssp_student_tree ON student_skill_progress(student_id, skill_tree_id);
CREATE INDEX idx_ssp_school_year ON student_skill_progress(school_year);
```

### 1.5 Row Level Security

```sql
ALTER TABLE skill_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skill_progress ENABLE ROW LEVEL SECURITY;

-- skill_trees: tenant members can view published; teachers+ can manage
CREATE POLICY st_select ON skill_trees FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY st_insert ON skill_trees FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

CREATE POLICY st_update ON skill_trees FOR UPDATE
  USING (
    created_by = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- skill_nodes: tenant members can view; teachers+ can manage
CREATE POLICY sn_select ON skill_nodes FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY sn_manage ON skill_nodes FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

-- skill_connections: same pattern
CREATE POLICY sc_select ON skill_connections FOR SELECT
  USING (is_tenant_member(tenant_id));

CREATE POLICY sc_manage ON skill_connections FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

-- student_skill_progress: students see own; teachers/admins see tenant
CREATE POLICY ssp_select ON student_skill_progress FOR SELECT
  USING (
    student_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

CREATE POLICY ssp_upsert ON student_skill_progress FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id));

CREATE POLICY ssp_update ON student_skill_progress FOR UPDATE
  USING (is_tenant_member(tenant_id));
```

### 1.6 How Nodes Map to Courses and Lessons

The mapping between the skill tree and existing LMS content:

| Node Type     | Maps To            | Mastery Derived From                                           |
|---------------|--------------------|----------------------------------------------------------------|
| `realm_root`  | Nothing (visual)   | Average mastery of all direct children                         |
| `course`      | `courses.id`       | `course_enrollments.grade_numeric` + lesson completion %       |
| `lesson`      | `lessons.id`       | `lesson_progress.progress_percentage` for that student/lesson  |
| `milestone`   | Nothing (gate)     | All prerequisite nodes must be completed                       |
| `capstone`    | An assignment/exam | Grade on the linked capstone assignment                        |

**Mastery percent calculation for `course` nodes:**

```
mastery_percent = (
  0.6 * (completed_lessons / total_lessons * 100) +
  0.4 * (average_assignment_grade)
)
```

**Tier thresholds (aligns with existing achievement tiers):**

| Tier     | Mastery %  | Visual                            |
|----------|------------|-----------------------------------|
| Bronze   | 60-74%     | Warm amber glow, single ring      |
| Silver   | 75-84%     | Cool silver glow, double ring     |
| Gold     | 85-94%     | Bright gold glow, triple ring     |
| Platinum | 95-100%    | Radiant cyan glow, pulsing aura   |

---

## 2. Visual Design System

### 2.1 The Constellation Aesthetic

The skill tree draws direct inspiration from Skyrim's perk constellation sky. The background is a deep, dark canvas suggesting the night sky or the deep ocean (tying into the Wolf Whale brand). Nodes are stars. Connections are constellation lines. Completed paths glow with energy flowing along them.

**Background layers (bottom to top):**

1. **Deep space gradient** -- dark navy/indigo/charcoal gradient per subject theme
2. **Nebula clouds** -- subtle, slow-drifting semi-transparent gradient blobs (CSS `filter: blur()` on animated divs)
3. **Distant stars** -- hundreds of tiny dots with slow twinkle animation (canvas particle layer)
4. **Constellation grid** -- faint geometric grid lines at low opacity for spatial orientation
5. **Connection paths** -- SVG lines between nodes with optional particle flow animation
6. **Skill nodes** -- the interactive node elements
7. **UI overlay** -- breadcrumbs, zoom controls, legend panel

### 2.2 Subject Realm Themes

Each subject has a distinct color palette and constellation style, all rendered against the dark sky background:

| Subject              | Primary    | Secondary  | Accent     | Constellation Style | Metaphor            |
|----------------------|------------|------------|------------|---------------------|---------------------|
| Mathematics          | `#3b82f6`  | `#1e3a5f`  | `#67e8f9`  | Crystal geometry    | Crystal cavern      |
| Science              | `#22c55e`  | `#14532d`  | `#86efac`  | Organic/cellular    | Living forest       |
| English Language Arts| `#a855f7`  | `#3b0764`  | `#d8b4fe`  | Flowing script      | Ancient library     |
| Social Studies       | `#f59e0b`  | `#78350f`  | `#fde68a`  | Map/compass rose    | Explorer's atlas    |
| History              | `#ef4444`  | `#7f1d1d`  | `#fca5a5`  | Timeline/torch      | Ruins & relics      |
| Physical Education   | `#06b6d4`  | `#164e63`  | `#a5f3fc`  | Lightning/energy    | Storm arena         |
| Art                  | `#ec4899`  | `#831843`  | `#f9a8d4`  | Brush/palette       | Prismatic gallery   |
| Music                | `#8b5cf6`  | `#4c1d95`  | `#c4b5fd`  | Sound wave/note     | Harmonic chambers   |
| French               | `#0ea5e9`  | `#0c4a6e`  | `#7dd3fc`  | Fleur-de-lis        | Parisian skyline    |
| Computer Science     | `#10b981`  | `#064e3b`  | `#6ee7b7`  | Circuit/binary      | Digital matrix      |

### 2.3 Node Visual States

Each node has five visual states that correspond to `student_skill_progress.status`:

**Locked:**
- Dim gray circle with a subtle outline
- Lock icon at center (Lucide `Lock`)
- Connection lines to this node are faint dashed lines
- No glow, no particles
- Slight transparency (`opacity: 0.35`)

**Available (Unlocked, Not Started):**
- Node pulses gently with the subject's primary color
- Soft outer glow ring (CSS `box-shadow` with animation)
- Connection lines from completed parents glow and have particle flow
- "New!" sparkle particle effect to draw attention
- Full opacity

**In Progress:**
- Node has a progress ring around it (like a radial progress bar)
- Interior fills with color proportional to `mastery_percent`
- Gentle breathing pulse animation
- Subject-colored glow, medium intensity
- Small activity indicator (spinning dots or orbiting particle)

**Completed:**
- Full solid fill with subject color
- Tier-colored outer ring (bronze/silver/gold/platinum)
- Steady soft glow (no pulse)
- Checkmark overlay icon
- Connection lines to children are fully lit

**Mastered (Platinum):**
- Bright radiant node with pulsing aura
- Multiple decorative rings
- Particle effect: orbiting sparkles
- Platinum/cyan glow that subtly illuminates nearby nodes
- Crown or star overlay icon

### 2.4 Connection Path Animations

Connections between nodes are rendered as SVG paths with these properties:

- **Locked paths:** Thin dashed gray lines, `opacity: 0.2`
- **Available paths:** Subject-colored lines that fade from solid (parent) to dashed (child), `opacity: 0.5`
- **Active paths (both ends completed):** Solid glowing lines with particle flow animation
  - Particles are small circles that travel along the bezier path from parent to child
  - Speed: ~3 seconds per traversal
  - 2-4 particles visible at a time
  - Color matches subject theme accent
- **Branch paths:** Slightly thicker, with a subtle fork icon at the branch point

### 2.5 Interaction Design

**Zoom and Pan:**
- Mouse wheel / pinch to zoom (range: 0.3x to 2.0x)
- Click-drag on empty space to pan
- Minimap in bottom-right corner showing full tree with viewport indicator
- "Fit to view" button to reset zoom/pan
- Double-click a node to center and zoom to it

**Node Hover:**
- Node scales up 1.15x with spring animation
- Tooltip card appears showing:
  - Node name and description
  - Current status and mastery %
  - Tier achieved (with colored badge)
  - XP/coin rewards
  - Prerequisites status
  - "Click to explore" call to action
- Connected nodes highlight (parents and children)
- Connected paths brighten

**Node Click:**
- Opens a detail panel (slide-in from right or modal):
  - Full node information
  - Link to the mapped course/lesson
  - Progress breakdown (lessons completed, scores, time spent)
  - "Start" / "Continue" / "Review" button depending on status
  - Tier progress bar showing path to next tier
- If the node is a `course` node, shows lesson sub-nodes as a mini-list

**Mobile:**
- Tap-and-hold for hover equivalent
- Single tap opens detail panel
- Two-finger pinch-zoom and drag-pan
- Bottom sheet instead of side panel for node details
- Simplified particle effects (fewer particles, no complex animations)

---

## 3. Game Mechanics

### 3.1 Prerequisite System

The prerequisite system is powered by `skill_connections` with `connection_type = 'prerequisite'`.

**Unlock rules:**

```
A node becomes 'available' when ALL prerequisite connections are satisfied:
  - from_node.status IN ('completed', 'mastered')
  - from_node.mastery_percent >= connection.min_mastery_percent
  - from_node.current_tier >= connection.min_tier (if specified)
```

**Special connection types:**

- `prerequisite` -- Hard requirement. All prerequisites must be met.
- `recommended` -- Soft suggestion. Node is available regardless, but UI shows "Recommended: complete X first" warning.
- `branch` -- At a branch point, students choose one of multiple paths. Unchosen branches remain available but grayed slightly.
- `shortcut` -- For advanced students. If a student demonstrates mastery (e.g., passing a placement test), they can skip ahead. Teachers can also manually unlock nodes.

**Automatic unlock triggers:**

A Supabase database function or a server action runs after these events:
1. `lesson_progress` is updated to `completed`
2. A `grade` is posted
3. A `course_enrollment` status changes to `completed`

The trigger recalculates the student's mastery on the affected node, then checks all outgoing connections to see if downstream nodes should transition from `locked` to `available`.

### 3.2 XP Integration

Skill tree progress integrates with the existing XP system defined in `lib/gamification/xp-engine.ts` and `lib/config/constants.ts`.

**New XP event types to add to `XP_CONFIG.events`:**

```typescript
skill_node_unlock: 10,       // First time a node becomes available
skill_node_started: 5,       // Student begins work on a node
skill_node_completed: 30,    // Node reaches required mastery %
skill_node_mastered: 50,     // Node reaches platinum tier
skill_tree_milestone: 75,    // Complete a milestone node
skill_tree_capstone: 150,    // Complete a capstone node
skill_tree_25_percent: 50,   // 25% of a tree completed
skill_tree_50_percent: 100,  // 50% of a tree completed
skill_tree_75_percent: 200,  // 75% of a tree completed
skill_tree_complete: 500,    // 100% of a tree completed
```

**XP flow:**

1. Student completes a lesson -> `lesson_complete` XP fires (existing: 10 XP)
2. System recalculates the parent `skill_node` mastery
3. If node crosses a tier threshold -> tier-up notification + bonus XP
4. If node crosses `required_mastery_percent` -> `skill_node_completed` XP fires (30 XP)
5. System checks downstream connections -> if new nodes unlock, `skill_node_unlock` fires (10 XP each)
6. System checks tree-wide milestones (25%/50%/75%/100%) -> milestone XP if threshold crossed

All XP events pass through the existing `processXPAward()` function in the XP engine, respecting daily caps and age variants.

### 3.3 Mastery Tiers Per Node

Each node supports four mastery tiers, mirroring the existing achievement tier system:

| Tier     | Mastery Range | Visual Ring Color | XP Bonus | Description                       |
|----------|---------------|-------------------|----------|-----------------------------------|
| Bronze   | 60-74%        | `#d97706`         | +10 XP   | Basic understanding achieved      |
| Silver   | 75-84%        | `#94a3b8`         | +20 XP   | Solid competency demonstrated     |
| Gold     | 85-94%        | `#eab308`         | +35 XP   | Strong mastery shown              |
| Platinum | 95-100%       | `#06b6d4`         | +50 XP   | Perfect or near-perfect mastery   |

Tier-up transitions trigger:
- A notification with the unlock message
- An animated tier-up sequence on the node (ring expands, color shifts, particles burst)
- XP bonus award
- The tier badge updates in the student's profile

### 3.4 Realm Concept

A **Realm** is a subject's entire skill tree. Realms have aggregate statistics:

```typescript
interface RealmProgress {
  realmId: string
  subject: string
  totalNodes: number
  unlockedNodes: number
  inProgressNodes: number
  completedNodes: number
  masteredNodes: number
  overallMasteryPercent: number  // Weighted average of all node masteries
  currentRealmTier: string      // bronze/silver/gold/platinum based on overall mastery
  xpEarned: number              // Total XP earned in this realm
  timeSpent: number             // Total seconds spent in realm content
}
```

Students earn a **Realm Title** based on overall realm mastery:
- Below 25%: "Novice" (e.g., "Math Novice")
- 25-49%: "Apprentice"
- 50-74%: "Journeyman"
- 75-89%: "Expert"
- 90-100%: "Grand Master"

### 3.5 Progress Tracking Across School Years

The `school_year` field on `student_skill_progress` allows tracking progress across multiple years:

- At the start of a new school year, a new skill tree version can be created (or the existing one extended)
- Historical progress is preserved with its `school_year` tag
- Students can view past years' trees in a read-only "archive" mode
- Cumulative stats (total nodes mastered across all years) feed into special achievements
- Teachers can compare year-over-year progress for returning students

---

## 4. UI Pages and Routes

### 4.1 `/student/skill-tree` -- Realm Overview

**Purpose:** Landing page showing all subject realms the student has access to.

**Layout:**
- Page header with whale gradient (matching achievements page style)
- Title: "Skill Realms" with a `Map` Lucide icon
- Subtitle: "Chart your path through the constellations of knowledge"
- Overall stats bar: Total nodes mastered, total realms explored, overall mastery %

**Realm cards (grid: 2 columns on desktop, 1 on mobile):**

Each realm card is a miniaturized preview of the skill tree, rendered as a small canvas or SVG snapshot:

```
+--------------------------------------------------+
|  [Mini constellation preview - dark bg, nodes]    |
|                                                   |
|  Mathematics                          [85% ****] |
|  The Realm of Numbers                             |
|  12/15 nodes completed    Level: Expert           |
|  [===================---] 85% mastery             |
|  +245 XP earned           2h 30m spent            |
+--------------------------------------------------+
```

- Cards use the subject's theme colors
- Hover scales card up slightly, intensifies the constellation glow
- Click navigates to `/student/skill-tree/[subject-slug]`
- Locked realms (no enrollment in any course for that subject) appear dimmed with a "No courses yet" label

**Quick Stats Row (above the grid):**

```
[Star icon]           [Trophy icon]           [Zap icon]            [Clock icon]
42 nodes mastered     3 realms explored       1,250 XP earned       12h 45m total
```

### 4.2 `/student/skill-tree/[subject]` -- Interactive Tree

**Purpose:** The main interactive skill tree experience for a specific subject.

**Layout:**

Full-viewport canvas with UI overlays:

```
+--------------------------------------------------------------+
| [<- Back] Mathematics: The Realm of Numbers     [?] [Fit] [+][-] |
+--------------------------------------------------------------+
|                                                              |
|        (Full-screen interactive tree canvas)                 |
|                                                              |
|     * --- * --- *                                           |
|     |           |                                           |
|     *     *     * --- *                                     |
|           |           |                                     |
|           * --- * --- *                                     |
|                                                              |
+--------------------------------------------------------------+
| [Legend] [Stats: 12/20 nodes | 72% mastery | Gold tier]      |
+--------------------------------------------------------------+
```

**Top bar (overlaid on canvas):**
- Back button to realm overview
- Realm name and subject
- Help button (shows legend/tutorial overlay)
- Fit-to-view button
- Zoom in/out buttons
- Current zoom level indicator

**Bottom bar (overlaid on canvas):**
- Collapsible legend showing node state colors
- Quick stats: nodes completed / total, mastery %, current realm tier
- "Focus Mode" toggle (hides UI, maximizes canvas)

**Side panel (slides in on node click):**

```
+----------------------------+
| [X]                        |
| [Node Icon]                |
| Fractions Fundamentals     |
| Course: Math 101           |
|                            |
| Status: In Progress        |
| Mastery: 72%               |
| Tier: Silver               |
| [======-------] 72%        |
|                            |
| Lessons:                   |
| [x] What are Fractions     |
| [x] Adding Fractions       |
| [ ] Multiplying Fractions  |
| [ ] Dividing Fractions     |
|                            |
| XP Earned: +85             |
| Time Spent: 1h 15m         |
|                            |
| [Continue Learning ->]     |
+----------------------------+
```

### 4.3 `/teacher/skill-tree` -- Teacher Class Progress View

**Purpose:** Teachers see their classes' aggregate progress on skill trees.

**Layout:**

- Course/class selector dropdown at the top
- Two view modes: **Heatmap** and **Student List**

**Heatmap view:**
- Shows the skill tree with nodes colored by class-average mastery
- Color gradient: red (< 50%) -> yellow (50-75%) -> green (> 75%)
- Hover a node shows: "Fractions: 18/25 students completed, avg 78% mastery"
- Click a node opens a list of students and their individual progress

**Student List view:**
- Table with students as rows and key nodes/milestones as columns
- Cell colors indicate status (locked/available/in-progress/completed/mastered)
- Sortable by student name, overall mastery, most recent activity
- Filter by: status, tier, date range

**Teacher actions:**
- "Unlock node for student" -- manually override prerequisites for a specific student
- "Assign node" -- push a notification to students suggesting they work on a specific node
- "Export progress" -- CSV export of class skill tree progress
- "Edit tree" -- jump to tree editor (if teacher created the tree)

### 4.4 `/admin/skill-tree-analytics` -- Admin Analytics Dashboard

**Purpose:** School-wide analytics on skill tree engagement and progression.

**Panels:**

1. **Engagement Overview**
   - Total students using skill trees
   - Average nodes completed per student
   - Most/least progressed realms
   - Active vs. stale students (no activity in 14+ days)

2. **Realm Comparison**
   - Bar chart: average mastery % by subject
   - Bar chart: completion rate by subject
   - Highlight: subjects where students are stuck (high in-progress, low completion)

3. **Progression Funnel**
   - For each realm: how many students are at each stage
   - Locked -> Available -> In Progress -> Completed -> Mastered
   - Identify bottleneck nodes (many students stuck at in-progress)

4. **Time Analysis**
   - Average time-to-completion per node
   - Nodes that take disproportionately long (candidates for content revision)
   - Peak activity hours

5. **Year-over-Year** (if multi-year data exists)
   - Compare mastery rates between school years
   - Student improvement tracking

### 4.5 Navigation Integration

Add skill tree links to the existing sidebar navigation in `lib/auth/permissions.ts`:

**Student nav (add between "Achievements" and "Leaderboard"):**
```typescript
{ label: 'Skill Realms', href: '/student/skill-tree', icon: 'Sparkles' },
```

**Teacher nav (add after "Students"):**
```typescript
{ label: 'Skill Trees',  href: '/teacher/skill-tree', icon: 'GitBranch' },
```

**Admin nav (add in Reports section):**
```typescript
{ label: 'Skill Analytics', href: '/admin/skill-tree-analytics', icon: 'Network' },
```

---

## 5. Technical Implementation

### 5.1 Interactive Tree Renderer

**Technology choice: SVG with React, not Canvas.**

Rationale:
- SVG elements are DOM nodes, enabling native React event handling, hover states, and accessibility
- SVG scales perfectly at any zoom level (vector graphics)
- CSS animations and transitions work directly on SVG elements
- Easier to integrate with React state and Tailwind classes
- For the expected node count (20-100 per tree), SVG performance is excellent
- Canvas would be better only at 1000+ nodes, which is not our case

**Component architecture:**

```
components/skill-tree/
  SkillTreeCanvas.tsx          -- Main container: zoom/pan/viewport management
  SkillTreeBackground.tsx      -- Nebula + star particles background layer
  SkillTreeGrid.tsx            -- Faint orientation grid
  SkillTreeConnections.tsx     -- SVG <path> elements for all connections
  SkillTreeConnectionPath.tsx  -- Single animated connection path
  SkillTreeNode.tsx            -- Single interactive node (SVG <g> element)
  SkillTreeNodeTooltip.tsx     -- Hover tooltip card
  SkillTreeDetailPanel.tsx     -- Slide-in detail panel for selected node
  SkillTreeMinimap.tsx         -- Bottom-right minimap overview
  SkillTreeControls.tsx        -- Zoom buttons, fit-to-view, legend toggle
  SkillTreeLegend.tsx          -- State color legend overlay
  SkillTreeStats.tsx           -- Bottom stats bar
  SkillTreeLoading.tsx         -- Skeleton loading state
  RealmOverviewCard.tsx        -- Card for the realm overview page
  RealmOverviewGrid.tsx        -- Grid layout for all realms
  hooks/
    useTreeViewport.ts         -- Zoom, pan, and viewport state management
    useTreeData.ts             -- Fetch and cache tree + progress data
    useNodeInteraction.ts      -- Click, hover, selection state
    useProgressSync.ts         -- Real-time progress updates via Supabase realtime
  utils/
    layout.ts                  -- Auto-layout algorithms (if teacher doesn't manually place)
    pathCalculation.ts         -- Bezier curve calculation for connections
    tierUtils.ts               -- Tier threshold calculations
    progressCalculation.ts     -- Mastery percent derivation from course/lesson data
```

### 5.2 Zoom and Pan Implementation

Use a transform-based approach on an SVG `<g>` wrapper:

```typescript
// useTreeViewport.ts
interface ViewportState {
  x: number       // Pan offset X
  y: number       // Pan offset Y
  zoom: number    // Scale factor (0.3 - 2.0)
}

// Apply as: <g transform={`translate(${x}, ${y}) scale(${zoom})`}>
```

**Input handling:**
- `onWheel` for zoom (with `e.preventDefault()` to avoid page scroll)
- `onPointerDown` + `onPointerMove` + `onPointerUp` for pan (pointer events work for both mouse and touch)
- Pinch-zoom via touch events (`onTouchStart`/`onTouchMove` with two-finger distance calculation)
- All transforms use `requestAnimationFrame` for smooth 60fps updates
- Apply momentum/inertia on pan release for fluid feel

### 5.3 Animation System

**Node animations (CSS/Tailwind):**

```css
/* Locked node - no animation */
.skill-node-locked {
  opacity: 0.35;
  filter: grayscale(0.8);
}

/* Available node - gentle pulse */
.skill-node-available {
  animation: node-pulse 3s ease-in-out infinite;
}

@keyframes node-pulse {
  0%, 100% { filter: drop-shadow(0 0 4px var(--node-color)); }
  50% { filter: drop-shadow(0 0 12px var(--node-color)); }
}

/* In-progress node - breathing glow */
.skill-node-in-progress {
  animation: node-breathe 4s ease-in-out infinite;
}

@keyframes node-breathe {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px var(--node-color)); }
  50% { transform: scale(1.05); filter: drop-shadow(0 0 14px var(--node-color)); }
}

/* Mastered node - radiant aura */
.skill-node-mastered {
  filter: drop-shadow(0 0 16px var(--node-color)) drop-shadow(0 0 32px var(--node-color));
  animation: node-radiate 5s ease-in-out infinite;
}
```

**Connection particle animation (SVG `<animateMotion>`):**

```xml
<circle r="2" fill="var(--accent-color)" opacity="0.8">
  <animateMotion dur="3s" repeatCount="indefinite" path="M0,0 C100,50 200,-50 300,0" />
</circle>
```

Multiple particles staggered with different `begin` offsets for continuous flow.

**Background star twinkle (CSS):**

```css
.star {
  animation: twinkle var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes twinkle {
  0%, 100% { opacity: var(--min-opacity); }
  50% { opacity: var(--max-opacity); }
}
```

Stars are rendered as small SVG circles with randomized positions, sizes, durations, and delays.

### 5.4 Mobile Responsiveness

**Breakpoint strategy:**

- **Desktop (lg+):** Full canvas with side panel. Minimap visible. All particle effects.
- **Tablet (md):** Full canvas with bottom sheet instead of side panel. Minimap hidden but accessible. Reduced particles.
- **Mobile (sm):** Simplified view options:
  - **Tree mode:** Zoomable canvas with minimal UI overlay. Bottom sheet for node details. Minimal particle effects.
  - **List mode:** Fallback linear list view of nodes grouped by depth level, with progress indicators. For students who prefer or need a non-visual interface.

**Mobile-specific optimizations:**
- Reduce star count from 200 to 50
- Disable connection particle animations (show static glow instead)
- Larger touch targets on nodes (minimum 44x44px tap area)
- Bottom sheet with drag handle for node details
- Snap-to-node on tap (auto-centers the tapped node)

### 5.5 Performance Considerations

- **Lazy rendering:** Only render nodes and connections within the current viewport (+ 200px buffer). Use viewport intersection calculation.
- **Memoization:** Heavy `React.memo` on `SkillTreeNode` and `SkillTreeConnectionPath` -- they only re-render when their specific data changes.
- **CSS containment:** Use `contain: layout style paint` on the canvas wrapper.
- **Background layer:** The nebula/star background is a single `<canvas>` element rendered once and cached, overlaid behind the SVG.
- **Data fetching:** Single server action fetches all tree data (nodes + connections + student progress) in one call. No waterfall.
- **Real-time updates:** Subscribe to `student_skill_progress` changes via Supabase Realtime so the tree updates live when a student completes a lesson in another tab.

---

## 6. Server Actions and API

### 6.1 New Server Actions

File: `app/actions/skill-tree.ts`

```typescript
// --- Read operations ---

/** Get all skill trees (realms) the student has access to, with aggregate progress */
export async function getStudentRealms(): Promise<RealmOverview[]>

/** Get a single skill tree with all nodes, connections, and student progress */
export async function getSkillTree(skillTreeId: string): Promise<SkillTreeData>

/** Get student progress for a specific tree */
export async function getStudentTreeProgress(skillTreeId: string): Promise<StudentTreeProgress>

// --- Progress operations ---

/** Recalculate a student's mastery on a specific node (called after lesson/grade events) */
export async function recalculateNodeMastery(nodeId: string): Promise<NodeMasteryResult>

/** Check and unlock newly available nodes after a node completion */
export async function checkAndUnlockNodes(completedNodeId: string): Promise<UnlockedNode[]>

/** Manually unlock a node for a student (teacher action) */
export async function teacherUnlockNode(studentId: string, nodeId: string): Promise<void>

// --- Tree management (teacher/admin) ---

/** Create a new skill tree for a subject */
export async function createSkillTree(data: CreateSkillTreeInput): Promise<SkillTree>

/** Add a node to a skill tree */
export async function createSkillNode(data: CreateSkillNodeInput): Promise<SkillNode>

/** Update node position (drag-and-drop in editor) */
export async function updateNodePosition(nodeId: string, x: number, y: number): Promise<void>

/** Create a connection between two nodes */
export async function createSkillConnection(data: CreateConnectionInput): Promise<SkillConnection>

/** Delete a node and its connections */
export async function deleteSkillNode(nodeId: string): Promise<void>

/** Publish a skill tree (draft -> published) */
export async function publishSkillTree(treeId: string): Promise<void>

// --- Analytics (admin) ---

/** Get school-wide skill tree analytics */
export async function getSkillTreeAnalytics(): Promise<SkillTreeAnalytics>

/** Get class-level progress on a tree (teacher view) */
export async function getClassTreeProgress(treeId: string, courseId: string): Promise<ClassProgress[]>
```

### 6.2 Progress Sync Trigger

When existing events occur (lesson completion, grade posting), the skill tree progress must update automatically. This is handled by calling `recalculateNodeMastery` from the existing server actions.

**Integration points in existing code:**

1. **`app/actions/gamification.ts` - `awardXP()`:**
   After awarding XP for `lesson_complete`, also call:
   ```typescript
   // Find skill node linked to this lesson
   // Recalculate mastery
   // Check for unlocks
   ```

2. **Grade posting trigger (existing `create_grade_notification` DB function):**
   Add a secondary trigger or extend the existing one to call a Supabase Edge Function that recalculates skill node mastery.

3. **`lesson_progress` updates:**
   After updating `lesson_progress` to `completed`, trigger skill node recalculation.

### 6.3 Auto-Layout Algorithm

For teachers who do not want to manually position every node, provide an auto-layout option.

**Algorithm: Layered tree layout (Sugiyama-style)**

1. Determine depth of each node from root (BFS)
2. Assign y-position based on depth (each depth level gets a row)
3. Assign x-position to minimize edge crossings within each row
4. Apply spacing constants: `ROW_GAP = 200px`, `NODE_GAP = 150px`
5. Center the tree horizontally
6. Optionally add slight random jitter (5-10px) for organic feel

This runs client-side when the teacher clicks "Auto-arrange" in the tree editor.

---

## 7. Permissions and Access Control

Extend the existing permission matrix in `lib/auth/permissions.ts`:

### 7.1 New Resource: `skill_trees`

Add to the `Resource` type and `PERMISSION_MATRIX`:

```typescript
// Add to Resource type
| 'skill_trees'

// Permission matrix additions:
student: {
  skill_trees: ['read'],    // View own progress on published trees
},
teacher: {
  skill_trees: ['create', 'read', 'update', 'delete', 'publish'],  // Full CRUD on own trees
},
parent: {
  skill_trees: ['read'],    // View child's progress
},
admin: {
  skill_trees: ['create', 'read', 'update', 'delete', 'publish', 'export'],
},
super_admin: {
  skill_trees: ['create', 'read', 'update', 'delete', 'publish', 'export'],
},
```

### 7.2 Access Rules

| Action                          | Student | Teacher | Parent | Admin | Super Admin |
|---------------------------------|---------|---------|--------|-------|-------------|
| View own skill tree progress    | Yes     | --      | --     | --    | --          |
| View published trees            | Yes     | Yes     | Yes    | Yes   | Yes         |
| View child's progress           | --      | --      | Yes    | --    | --          |
| View class progress             | --      | Yes     | --     | Yes   | Yes         |
| Create/edit skill trees         | --      | Yes     | --     | Yes   | Yes         |
| Publish skill trees             | --      | Yes     | --     | Yes   | Yes         |
| Manually unlock nodes           | --      | Yes     | --     | Yes   | Yes         |
| View school-wide analytics      | --      | --      | --     | Yes   | Yes         |
| Export analytics                 | --      | --      | --     | Yes   | Yes         |
| Create/edit tree templates       | --      | --      | --     | Yes   | Yes         |

---

## 8. Migration Strategy

### 8.1 Database Migration

File: `supabase/migrations/20260210_skill_tree_schema.sql`

Contents: All `CREATE TABLE`, `CREATE INDEX`, `ALTER TABLE ENABLE ROW LEVEL SECURITY`, and `CREATE POLICY` statements from Section 1 above.

Additionally, add the `updated_at` triggers:
```sql
CREATE TRIGGER update_skill_trees_updated_at BEFORE UPDATE ON skill_trees FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_skill_nodes_updated_at BEFORE UPDATE ON skill_nodes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

Enable Realtime for progress tracking:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE student_skill_progress;
```

### 8.2 Seed Data

Create a seed script that generates a sample skill tree for Mathematics with:
- 1 realm root node
- 5 course nodes (Number Sense, Algebra, Geometry, Data & Probability, Measurement)
- 3-4 lesson nodes per course
- Prerequisite connections forming a logical progression
- Milestone nodes at key junctions
- 1 capstone node at the end

This serves as both a demo and a template teachers can clone.

### 8.3 Feature Flag

Gate the entire skill tree feature behind a feature flag:
```typescript
// In tenant settings JSONB:
settings: {
  skill_tree_enabled: true,  // Default: false during rollout
}
```

Only show skill tree navigation items and pages when the flag is enabled for the tenant. This allows gradual rollout.

### 8.4 Rollout Phases

| Phase | Scope                          | Duration  |
|-------|--------------------------------|-----------|
| 1     | Schema + seed data + basic UI  | 2 weeks   |
| 2     | Interactive tree renderer      | 2 weeks   |
| 3     | Progress tracking + XP hooks   | 1 week    |
| 4     | Teacher editor view            | 2 weeks   |
| 5     | Admin analytics                | 1 week    |
| 6     | Polish, animation, mobile      | 2 weeks   |
| 7     | Beta testing with 1-2 tenants  | 2 weeks   |
| 8     | General availability           | --        |

---

## 9. Testing Plan

### 9.1 End-to-End Tests

Following the CLAUDE.md guideline of prioritizing E2E tests:

1. **Student views realm overview** -- Visit `/student/skill-tree`, verify all enrolled subjects appear as realm cards with correct progress stats.
2. **Student explores a tree** -- Navigate to a subject tree, verify nodes render at correct positions, locked/available states are correct based on progress.
3. **Student completes a lesson and node unlocks** -- Complete a lesson, verify the parent node's mastery updates, downstream nodes transition from locked to available.
4. **Student clicks a node and sees details** -- Click a node, verify the detail panel shows correct information, "Continue" button links to the right lesson.
5. **Teacher views class progress** -- Visit `/teacher/skill-tree`, select a class, verify heatmap shows correct aggregate mastery.
6. **Teacher manually unlocks a node** -- Use the unlock action, verify the student's node transitions to available.
7. **Admin views analytics** -- Visit `/admin/skill-tree-analytics`, verify charts render with data.
8. **Mobile: tree is navigable** -- On mobile viewport, verify zoom/pan work, node tap opens bottom sheet.
9. **XP integration** -- Complete a node, verify XP event is created and user level updates.
10. **Tier progression** -- Improve mastery on a node from 60% to 85%, verify tier changes from bronze to gold with notification.

### 9.2 Unit Tests

- `progressCalculation.ts` -- Verify mastery % derivation from lesson/grade data
- `tierUtils.ts` -- Verify tier threshold calculations
- `layout.ts` -- Verify auto-layout produces valid node positions
- `pathCalculation.ts` -- Verify bezier path generation between node coordinates
- Prerequisite resolution logic -- Given a set of node statuses, verify correct unlock determinations

---

## 10. Future Ideas (Later)

These are exciting ideas that are out of scope for the initial implementation but should be kept in mind for future iterations:

- **Tree editor with drag-and-drop** -- Visual editor for teachers to place nodes on the canvas and draw connections
- **Template marketplace** -- Teachers can share skill tree templates across tenants
- **Student-chosen branches** -- At branch points, students choose a specialization path (e.g., "Applied Math" vs. "Theoretical Math")
- **Skill tree achievements** -- Special badges for tree-specific milestones ("Math Master", "Science Explorer")
- **Collaborative nodes** -- Group nodes that require multiple students to complete together
- **Parent view** -- Parents can see their child's constellation with simplified visuals
- **AR mode** -- View the constellation in augmented reality (far future)
- **Sound design** -- Ambient music per realm theme, satisfying sound effects on node completion
- **Seasonal events** -- Limited-time bonus nodes during exam season, holidays
- **Class challenges** -- Entire class must collectively master nodes to unlock a special class reward
- **Cross-realm connections** -- Some nodes span subjects (e.g., "Scientific Writing" connects Science and ELA trees)
- **AI-generated trees** -- Use AI to automatically generate a skill tree from a course syllabus

---

## Appendix: File Structure

```
app/
  student/
    skill-tree/
      page.tsx                    -- Realm overview
      [subject]/
        page.tsx                  -- Interactive tree for subject
      loading.tsx
      layout.tsx
  teacher/
    skill-tree/
      page.tsx                    -- Class progress view
  admin/
    skill-tree-analytics/
      page.tsx                    -- Analytics dashboard
  actions/
    skill-tree.ts                 -- All server actions

components/
  skill-tree/
    SkillTreeCanvas.tsx
    SkillTreeBackground.tsx
    SkillTreeGrid.tsx
    SkillTreeConnections.tsx
    SkillTreeConnectionPath.tsx
    SkillTreeNode.tsx
    SkillTreeNodeTooltip.tsx
    SkillTreeDetailPanel.tsx
    SkillTreeMinimap.tsx
    SkillTreeControls.tsx
    SkillTreeLegend.tsx
    SkillTreeStats.tsx
    SkillTreeLoading.tsx
    RealmOverviewCard.tsx
    RealmOverviewGrid.tsx
    hooks/
      useTreeViewport.ts
      useTreeData.ts
      useNodeInteraction.ts
      useProgressSync.ts
    utils/
      layout.ts
      pathCalculation.ts
      tierUtils.ts
      progressCalculation.ts

lib/
  config/
    constants.ts                  -- Add new XP events and skill tree config
  auth/
    permissions.ts                -- Add skill_trees resource

supabase/
  migrations/
    20260210_skill_tree_schema.sql
  seed/
    skill-tree-math-sample.sql
```

---

*This plan is the north star for the Skill Tree feature. Each section should be implemented incrementally, committed after verification, and tested before moving to the next phase. The constellation awaits.*
