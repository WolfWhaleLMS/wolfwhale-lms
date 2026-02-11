// Wolf Whale LMS - Virtual Plaza Type Definitions
// Complete types for the plaza system: avatars, rooms, chat, store, tokens,
// mini games, study sessions, documentaries, and the Zustand store interface.

// ---------------------------------------------------------------------------
// Core Direction Type
// ---------------------------------------------------------------------------

export type FacingDirection = 'up' | 'down' | 'left' | 'right'

// ---------------------------------------------------------------------------
// Avatar Types
// ---------------------------------------------------------------------------

/** Avatar appearance configuration stored as JSONB in plaza_avatars.avatar_config */
export interface AvatarConfig {
  body_color: string
  body_shape: 'circle' | 'square' | 'hexagon' | 'star'
  eye_style: string
  hat: string | null
  outfit: string | null
  accessory: string | null
  trail_effect: string | null
  emote: string | null
  background_id: string | null
}

/** Local avatar state used by the game loop for movement and rendering */
export interface AvatarState {
  userId: string
  displayName: string
  avatarConfig: AvatarConfig
  x: number
  y: number
  targetX: number
  targetY: number
  velocityX: number
  velocityY: number
  speed: number
  isMoving: boolean
  facing: FacingDirection
}

/** Remote avatar state received via Supabase Realtime for interpolation */
export interface RemoteAvatarState {
  userId: string
  displayName: string
  avatarConfig: AvatarConfig
  x: number
  y: number
  prevX: number
  prevY: number
  targetX: number
  targetY: number
  facing: FacingDirection
  isMoving: boolean
  lastUpdateTime: number
  interpolationProgress: number
  chatBubble: string | null
}

/** Database row type for plaza_avatars table */
export interface PlazaAvatar {
  id: string
  tenant_id: string
  user_id: string

  // Display
  display_name: string
  avatar_config: AvatarConfig

  // Position
  current_room: string
  pos_x: number
  pos_y: number
  facing_direction: FacingDirection

  // Economy
  token_balance: number
  tokens_earned_total: number
  tokens_spent_total: number

  // Stats
  avatar_level: number
  games_played: number
  games_won: number
  study_sessions_joined: number
  time_in_plaza_seconds: number
  last_daily_login: string | null
  daily_login_streak: number

  // Status
  is_online: boolean
  last_seen_at: string
  status_message: string | null

  created_at: string
  updated_at: string
}

// ---------------------------------------------------------------------------
// Room / World Types
// ---------------------------------------------------------------------------

export interface SpawnPoint {
  x: number
  y: number
}

export interface WalkableBounds {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface CollisionRect {
  x: number
  y: number
  width: number
  height: number
}

export interface BuildingConfig {
  id: string
  name: string
  x: number
  y: number
  w: number
  h: number
  door: { x: number; y: number }
  target_room: string
}

/** Extended building definition for Canvas2D rendering */
export interface BuildingDef {
  id: string
  name: string
  slug: string
  x: number
  y: number
  width: number
  height: number
  roofColor: string
  wallColor: string
  doorX: number
  doorY: number
  doorWidth: number
  doorHeight: number
  label: string
  icon?: string
}

export interface DecorationConfig {
  id: string
  type: 'tree' | 'flower' | 'bench' | 'lamp' | 'fountain' | 'path' | 'custom'
  x: number
  y: number
  w: number
  h: number
  color?: string
  animated?: boolean
}

/** Extended decoration definition for Canvas2D rendering */
export interface DecorationDef {
  id: string
  type: 'tree' | 'flower' | 'bench' | 'lamppost' | 'fountain' | 'path'
  x: number
  y: number
  width: number
  height: number
  color?: string
  animationPhase?: number
}

export interface MapConfig {
  width: number
  height: number
  tile_size: number
  collision_map: number[][]
  spawn_point: SpawnPoint
  buildings: BuildingConfig[]
  decorations: DecorationConfig[]
  walkable_bounds: WalkableBounds
}

/** Full room data returned from the server */
export interface RoomData {
  id: string
  slug: string
  name: string
  description: string | null
  room_type: 'hub' | 'game_house' | 'store' | 'study_hall' | 'theater' | 'park' | 'library' | 'custom'
  map_config: MapConfig
  background_color: string
  background_image_url: string | null
  ambient_sound: string | null
  max_occupants: number
  is_global: boolean
  is_active: boolean
  sort_order: number

  // Canvas2D rendering convenience fields (derived from map_config)
  width: number
  height: number
  tileSize: number
  spawnPoint: SpawnPoint
  buildings: BuildingDef[]
  decorations: DecorationDef[]
  collisionRects: CollisionRect[]
  walkableBounds: WalkableBounds
  backgroundColor: string
}

/** Room summary with occupant count for the room list */
export interface RoomInfo {
  id: string
  slug: string
  name: string
  description: string | null
  room_type: string
  max_occupants: number
  current_occupants: number
  sort_order: number
}

// ---------------------------------------------------------------------------
// Chat Types
// ---------------------------------------------------------------------------

export type ChatCategory =
  | 'greeting'
  | 'encouragement'
  | 'study'
  | 'fun'
  | 'farewell'
  | 'teamwork'
  | 'celebration'
  | 'question'

/** Chat phrase record from plaza_chat_phrases table */
export interface ChatPhrase {
  id: string
  phrase: string
  category: ChatCategory
  emoji_icon: string | null
  is_global: boolean
  sort_order: number
}

/** Active chat bubble displayed above an avatar */
export interface ChatBubble {
  userId: string
  phrase: string
  startedAt: number
  duration: number
}

/** Chat bubble rendering state for the Canvas2D game loop */
export interface ChatBubbleState {
  userId: string
  phrase: string
  startTime: number
  duration: number
  fadeStartTime: number
  opacity: number
  scale: number
}

// ---------------------------------------------------------------------------
// Store / Inventory Types
// ---------------------------------------------------------------------------

export type ItemCategory =
  | 'hat'
  | 'outfit'
  | 'accessory'
  | 'color_palette'
  | 'background'
  | 'trail_effect'
  | 'emote'
  | 'eye_style'
  | 'body_shape'

export type ItemSlot =
  | 'head'
  | 'body'
  | 'hand'
  | 'color'
  | 'background'
  | 'trail'
  | 'emote'
  | 'eyes'
  | 'shape'

export type RarityTier = 'bronze' | 'silver' | 'gold' | 'platinum'

/** Store item with ownership/equipped status for the current user */
export interface StoreItem {
  id: string
  tenant_id: string | null
  name: string
  description: string | null
  category: ItemCategory
  slot: ItemSlot
  rarity: RarityTier
  sprite_key: string
  preview_url: string | null
  color_hex: string | null
  animation_data: Record<string, unknown> | null
  price_tokens: number
  is_free: boolean
  is_global: boolean
  is_limited_edition: boolean
  available_from: string | null
  available_until: string | null
  max_purchases: number | null
  current_purchases: number
  min_avatar_level: number
  required_achievement_id: string | null
  sort_order: number
  is_active: boolean

  // Computed fields for current user
  is_owned: boolean
  is_equipped: boolean
  can_afford: boolean
  meets_level_requirement: boolean
}

/** Inventory item owned by the user */
export interface InventoryItem {
  id: string
  item_id: string
  name: string
  description: string | null
  category: ItemCategory
  slot: ItemSlot
  rarity: RarityTier
  sprite_key: string
  preview_url: string | null
  is_equipped: boolean
  purchased_at: string
  price_paid: number
}

/** Result of attempting to purchase an item */
export interface PurchaseResult {
  success: boolean
  error?: string
  item?: InventoryItem
  new_balance?: number
  tokens_spent?: number
}

// ---------------------------------------------------------------------------
// Token Types
// ---------------------------------------------------------------------------

export type TokenTransactionType =
  | 'earn_game'
  | 'earn_high_score'
  | 'earn_daily_login'
  | 'earn_study_streak'
  | 'earn_quiz_performance'
  | 'earn_achievement'
  | 'earn_study_session'
  | 'earn_event_bonus'
  | 'spend_store'
  | 'spend_gift'
  | 'admin_grant'
  | 'admin_deduct'
  | 'system_adjustment'

/** Token balance and recent transaction history */
export interface TokenInfo {
  balance: number
  tokens_earned_total: number
  tokens_spent_total: number
  tokens_earned_today: number
  daily_cap: number
  daily_cap_remaining: number
  recent_transactions: TokenTransaction[]
}

/** Single token transaction record */
export interface TokenTransaction {
  id: string
  tenant_id: string
  user_id: string
  amount: number
  balance_after: number
  transaction_type: TokenTransactionType
  source_type: string | null
  source_id: string | null
  description: string | null
  created_at: string
}

/** Result of a daily login check */
export interface DailyLoginResult {
  is_new_day: boolean
  tokens_awarded: number
  streak: number
  streak_bonus: number
  new_balance: number
}

// ---------------------------------------------------------------------------
// Mini Game Types
// ---------------------------------------------------------------------------

export type GameType =
  | 'math_challenge'
  | 'vocabulary_builder'
  | 'typing_race'
  | 'science_quiz'
  | 'memory_match'
  | 'word_scramble'
  | 'geography_dash'
  | 'speed_math'
  | 'spelling_bee'
  | 'trivia'

export type GameSessionStatus = 'waiting' | 'countdown' | 'in_progress' | 'finished' | 'cancelled'
export type GameMode = 'solo' | 'multiplayer' | 'coop'
export type GameDifficulty = 'easy' | 'medium' | 'hard'

/** Mini game definition from plaza_mini_games table */
export interface MiniGame {
  id: string
  tenant_id: string | null
  slug: string
  name: string
  description: string | null
  instructions: string | null
  subject: string | null
  icon: string | null
  color_hex: string

  game_type: GameType
  config: Record<string, unknown>
  min_players: number
  max_players: number
  duration_seconds: number

  token_reward_base: number
  token_reward_win: number
  token_reward_perfect: number
  xp_reward: number

  is_global: boolean
  is_active: boolean
  min_grade_level: string | null
  max_grade_level: string | null
  sort_order: number
}

/** Active or past game session from plaza_game_sessions table */
export interface GameSession {
  id: string
  tenant_id: string
  game_id: string
  host_user_id: string
  status: GameSessionStatus
  mode: GameMode
  difficulty: GameDifficulty
  round_count: number
  current_round: number
  game_state: Record<string, unknown>
  started_at: string | null
  ended_at: string | null
  max_duration_seconds: number
  room_slug: string | null
  created_at: string

  // Joined data
  game?: MiniGame
  host_display_name?: string
  player_count?: number
}

/** Result returned after submitting a game score */
export interface GameScoreResult {
  score_id: string
  score: number
  accuracy_percent: number
  rank_in_session: number | null
  tokens_earned: number
  xp_earned: number
  is_high_score: boolean
  is_personal_best: boolean
  new_token_balance: number
}

/** Full game result used by mini game components */
export interface GameResult {
  score: number
  accuracy: number
  timeTaken: number
  correctAnswers: number
  totalQuestions: number
  tokensEarned: number
  xpEarned: number
  isPersonalBest: boolean
}

/** Personal best score for a specific game */
export interface PersonalBest {
  game_id: string
  game_slug: string
  game_name: string
  best_score: number
  best_accuracy: number | null
  best_time: number | null
  achieved_at: string
  total_plays: number
}

/** Game config passed into mini game components */
export interface GameConfig {
  difficulty: GameDifficulty
  duration_seconds: number
  round_count: number
  custom: Record<string, unknown>
}

// ---------------------------------------------------------------------------
// Study Session Types
// ---------------------------------------------------------------------------

export type StudySessionType = 'pomodoro' | 'free_form' | 'timed'
export type TimerState = 'idle' | 'work' | 'break' | 'paused' | 'finished'
export type StudySessionStatus = 'waiting' | 'active' | 'paused' | 'finished' | 'cancelled'

/** Study session from plaza_study_sessions table */
export interface StudySession {
  id: string
  tenant_id: string
  host_user_id: string
  title: string
  subject: string | null
  session_type: StudySessionType

  work_minutes: number
  break_minutes: number
  total_rounds: number
  current_round: number

  timer_state: TimerState
  timer_started_at: string | null
  timer_paused_at: string | null
  timer_remaining_seconds: number | null

  status: StudySessionStatus
  max_participants: number
  current_participants: number

  xp_bonus_multiplier: number
  token_reward_per_round: number

  started_at: string | null
  ended_at: string | null
  created_at: string

  // Joined data
  host_display_name?: string
  members?: StudySessionMember[]
}

export interface StudySessionMember {
  id: string
  session_id: string
  user_id: string
  joined_at: string
  left_at: string | null
  rounds_completed: number
  total_focus_seconds: number
  xp_earned: number
  tokens_earned: number
  display_name?: string
}

/** Reward from completing a study round */
export interface RoundReward {
  round_number: number
  tokens_earned: number
  xp_earned: number
  is_group_bonus: boolean
  new_token_balance: number
}

// ---------------------------------------------------------------------------
// Documentary / Theater Types
// ---------------------------------------------------------------------------

export type DocumentaryStatus = 'scheduled' | 'live' | 'finished' | 'cancelled'
export type PlaybackState = 'idle' | 'playing' | 'paused' | 'finished'

/** Documentary session from plaza_documentary_sessions table */
export interface DocumentarySession {
  id: string
  tenant_id: string
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  duration_seconds: number | null
  subject: string | null

  scheduled_by: string
  scheduled_at: string
  status: DocumentaryStatus

  playback_state: PlaybackState
  playback_position_seconds: number
  playback_started_at: string | null

  max_viewers: number
  current_viewers: number

  xp_reward: number
  token_reward: number
  min_watch_percent: number

  created_at: string

  // Joined data
  scheduled_by_name?: string
}

/** Reward from watching a documentary */
export interface WatchReward {
  tokens_earned: number
  xp_earned: number
  watch_percent: number
  qualifies_for_reward: boolean
  new_token_balance: number
}

// ---------------------------------------------------------------------------
// Leaderboard Types
// ---------------------------------------------------------------------------

export interface LeaderboardEntry {
  user_id: string
  display_name: string
  avatar_config: AvatarConfig
  value: number
  rank: number
}

// ---------------------------------------------------------------------------
// Mini Game Context (dual-access pattern: Plaza + Tools Arcade)
// ---------------------------------------------------------------------------

/** Context determining where a mini game is being played from */
export interface MiniGameContext {
  source: 'plaza' | 'tools'
  // RealtimeChannel - only present if source === 'plaza'
  channel?: unknown
  // Only present if source === 'plaza' multiplayer
  sessionId?: string
}

/** Registration entry for a mini game in the game registry */
export interface MiniGameDefinition {
  slug: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<MiniGameProps>
  minPlayers: number
  maxPlayers: number
  defaultDuration: number
  subjects: string[]
}

/** Props passed to every mini game component */
export interface MiniGameProps {
  sessionId: string
  gameConfig: GameConfig
  mode: GameMode
  players: PlayerInfo[]
  onScore: (score: number) => void
  onComplete: (result: GameResult) => void
  // RealtimeChannel for multiplayer sync
  channel?: unknown
  context: MiniGameContext
}

export interface PlayerInfo {
  userId: string
  displayName: string
  avatarConfig: AvatarConfig
  score: number
  isLocal: boolean
}

// ---------------------------------------------------------------------------
// Camera Types
// ---------------------------------------------------------------------------

export interface CameraState {
  x: number
  y: number
  zoom: number
  viewWidth: number
  viewHeight: number
}

// ---------------------------------------------------------------------------
// Input Types (for Canvas2D game loop)
// ---------------------------------------------------------------------------

export interface InputState {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
  sprint: boolean
  interact: boolean
  chat: boolean
}

export interface MovementVector {
  dx: number
  dy: number
  isMoving: boolean
  speed: number
}

// ---------------------------------------------------------------------------
// Game Loop Callbacks
// ---------------------------------------------------------------------------

export interface GameLoopCallbacks {
  onPositionChange?: (x: number, y: number, facing: FacingDirection) => void
  onBuildingInteract?: (building: BuildingDef) => void
  onRequestChat?: () => void
}

// ---------------------------------------------------------------------------
// Zustand Store Interface
// ---------------------------------------------------------------------------

export interface PlazaUIFlags {
  isStoreOpen: boolean
  isGameLobbyOpen: boolean
  isChatOpen: boolean
  isInventoryOpen: boolean
}

export interface PlazaStore {
  // Avatar
  localAvatar: AvatarState | null
  setLocalAvatar: (avatar: AvatarState) => void

  // Remote players
  remoteAvatars: Map<string, RemoteAvatarState>
  setRemoteAvatar: (userId: string, state: RemoteAvatarState) => void
  removeRemoteAvatar: (userId: string) => void
  clearRemoteAvatars: () => void

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
  isInventoryOpen: boolean
  selectedBuilding: string | null
  setUIState: (key: keyof PlazaUIFlags, value: boolean) => void
  setSelectedBuilding: (building: string | null) => void

  // Connection
  isConnected: boolean
  setIsConnected: (connected: boolean) => void

  // Reset
  reset: () => void
}
