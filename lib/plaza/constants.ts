// Wolf Whale LMS - Virtual Plaza Constants

// ---------------------------------------------------------------------------
// Plaza Configuration
// ---------------------------------------------------------------------------

export const PLAZA_CONFIG = {
  /** Avatar movement speed in pixels per second (walking) */
  movementSpeed: 120,

  /** Avatar sprint speed in pixels per second (hold Shift) */
  sprintSpeed: 180,

  /** How often to broadcast position updates while moving (ms) */
  broadcastRateMs: 100,

  /** Minimum seconds between chat messages per user */
  chatCooldownSeconds: 3,

  /** How long chat bubbles stay visible (ms) */
  chatBubbleDurationMs: 5000,

  /** Chat bubble fade-out animation duration (ms) */
  chatBubbleFadeMs: 500,

  /** Chat bubble pop-in animation duration (ms) */
  chatBubblePopInMs: 200,

  /** Distance in pixels to trigger building interaction prompt */
  interactionDistance: 48,

  /** Avatar collision radius in pixels */
  avatarCollisionRadius: 8,

  /** Room transition fade duration (ms) */
  roomTransitionMs: 300,

  /** Timeout before considering a remote avatar disconnected (ms) */
  disconnectTimeoutMs: 10000,

  /** Timeout before assuming remote avatar stopped moving (ms) */
  idleTimeoutMs: 500,

  /** Maximum users per room channel */
  maxOccupantsDefault: 50,

  /** Canvas render target frame rate */
  targetFps: 60,

  /** Camera smooth follow lerp base (lower = smoother) */
  cameraLerpBase: 0.001,

  /** Default camera zoom level */
  defaultCameraZoom: 1.0,

  /** Avatar size in pixels (bounding box) */
  avatarSize: 32,

  /** Pixels above avatar for name label */
  nameLabelOffset: 8,
} as const

// ---------------------------------------------------------------------------
// Room Slugs
// ---------------------------------------------------------------------------

export const ROOM_SLUGS = {
  PLAZA_MAIN: 'plaza_main',
  GAME_HOUSE: 'game_house',
  AVATAR_STORE: 'avatar_store',
  STUDY_HALL: 'study_hall',
  THEATER: 'theater',
} as const

export type RoomSlug = (typeof ROOM_SLUGS)[keyof typeof ROOM_SLUGS]

// ---------------------------------------------------------------------------
// Avatar Defaults
// ---------------------------------------------------------------------------

export const AVATAR_DEFAULTS = {
  body_color: '#4F46E5',
  body_shape: 'circle' as const,
  eye_style: 'default',
  hat: null,
  outfit: null,
  accessory: null,
  trail_effect: null,
  emote: null,
  background_id: null,
  facing_direction: 'down' as const,
  spawn_x: 400,
  spawn_y: 300,
} as const

/** Free starter body colors available to all users */
export const STARTER_COLORS = [
  '#4F46E5', // Indigo (default)
  '#10B981', // Green
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
] as const

// ---------------------------------------------------------------------------
// Token Economy
// ---------------------------------------------------------------------------

/** Maximum tokens a user can earn per calendar day */
export const TOKEN_DAILY_CAP = 200

/** Token earning rates by activity */
export const TOKEN_RATES = {
  // Mini games
  game_participation: 5,
  game_win: 15,
  game_perfect: 30,
  game_personal_best: 10,

  // Daily login
  daily_login: 10,
  streak_7_day: 25,
  streak_14_day: 50,
  streak_30_day: 100,

  // Study sessions
  study_round: 5,
  study_full_session: 15,
  study_group_bonus: 5,

  // Quiz performance
  quiz_90_percent: 15,
  quiz_100_percent: 25,

  // Documentary
  documentary_watch: 10,
} as const

// ---------------------------------------------------------------------------
// Game Slugs
// ---------------------------------------------------------------------------

export const GAME_SLUGS = {
  MATH_BLITZ: 'math-blitz',
  WORD_SCRAMBLE: 'word-scramble',
  TYPING_RACE: 'typing-race',
  SCIENCE_TRIVIA: 'science-trivia',
  MEMORY_MATCH: 'memory-match',
  GEOGRAPHY_DASH: 'geography-dash',
} as const

export type GameSlug = (typeof GAME_SLUGS)[keyof typeof GAME_SLUGS]

// ---------------------------------------------------------------------------
// Rarity Tiers
// ---------------------------------------------------------------------------

export const RARITY_TIERS = {
  bronze: {
    name: 'Bronze',
    color: '#CD7F32',
    priceMin: 10,
    priceMax: 30,
    minLevel: 1,
  },
  silver: {
    name: 'Silver',
    color: '#C0C0C0',
    priceMin: 40,
    priceMax: 80,
    minLevel: 3,
  },
  gold: {
    name: 'Gold',
    color: '#FFD700',
    priceMin: 100,
    priceMax: 200,
    minLevel: 8,
  },
  platinum: {
    name: 'Platinum',
    color: '#E5E4E2',
    priceMin: 250,
    priceMax: 500,
    minLevel: 15,
  },
} as const

// ---------------------------------------------------------------------------
// Avatar Level Unlocks
// ---------------------------------------------------------------------------

/** Maps avatar/XP level to what features unlock at that level */
export const AVATAR_LEVEL_UNLOCKS: Record<number, string> = {
  1: 'Default body colors, basic shapes',
  3: 'Trail effects available in store, silver items',
  5: 'Emotes available, eye styles',
  8: 'Gold-tier items purchasable',
  10: 'Custom backgrounds',
  15: 'Platinum-tier items',
  20: 'Exclusive "Legendary" category',
}

// ---------------------------------------------------------------------------
// Chat Categories
// ---------------------------------------------------------------------------

export const CHAT_CATEGORIES = [
  'greeting',
  'encouragement',
  'study',
  'fun',
  'farewell',
  'teamwork',
  'celebration',
  'question',
] as const

// ---------------------------------------------------------------------------
// Visual / Color Palette
// ---------------------------------------------------------------------------

export const PLAZA_COLORS = {
  ground: '#2d3748',
  grass: '#1a4731',
  path: '#4a5568',
  water: '#2563eb',
  building_wall: '#374151',
  ui_overlay: '#1a1a2e',
  ui_overlay_opacity: 0.9,
} as const

// ---------------------------------------------------------------------------
// Room Types
// ---------------------------------------------------------------------------

export const ROOM_TYPES = [
  'hub',
  'game_house',
  'store',
  'study_hall',
  'theater',
  'park',
  'library',
  'custom',
] as const

export type RoomType = (typeof ROOM_TYPES)[number]
