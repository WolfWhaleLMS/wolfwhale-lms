'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Map,
  Gamepad2,
  MessageSquare,
  Store,
  BookOpen,
  Film,
  Coins,
  Users,
  Shield,
  Settings,
  ToggleLeft,
  ToggleRight,
  Save,
  Clock,
  Zap,
} from 'lucide-react'
import {
  PLAZA_CONFIG,
  TOKEN_DAILY_CAP,
  TOKEN_RATES,
  ROOM_SLUGS,
  CHAT_CATEGORIES,
} from '@/lib/plaza/constants'

// ---------------------------------------------------------------------------
// Toggle Row Component
// ---------------------------------------------------------------------------
function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string
  description: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className="shrink-0 text-primary transition-colors hover:text-primary/80"
        aria-label={`Toggle ${label}`}
      >
        {enabled ? (
          <ToggleRight className="h-8 w-8" />
        ) : (
          <ToggleLeft className="h-8 w-8 text-muted-foreground" />
        )}
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Settings Value Row Component
// ---------------------------------------------------------------------------
function SettingsValueRow({
  label,
  value,
  unit,
}: {
  label: string
  value: string | number
  unit?: string
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">
        {value}
        {unit ? ` ${unit}` : ''}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function AdminPlazaSettingsPage() {
  // Feature toggles (default all enabled)
  const [plazaEnabled, setPlazaEnabled] = useState(true)
  const [gamesEnabled, setGamesEnabled] = useState(true)
  const [storeEnabled, setStoreEnabled] = useState(true)
  const [studyHallEnabled, setStudyHallEnabled] = useState(true)
  const [theaterEnabled, setTheaterEnabled] = useState(true)
  const [chatEnabled, setChatEnabled] = useState(true)
  const [dailyLoginRewards, setDailyLoginRewards] = useState(true)
  const [multiplayerGames, setMultiplayerGames] = useState(true)

  // Moderation toggles
  const [chatFilterEnabled, setChatFilterEnabled] = useState(true)
  const [parentVisibility, setParentVisibility] = useState(true)
  const [activityLogging, setActivityLogging] = useState(true)

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully.`, {
      description: 'Changes will take effect shortly.',
    })
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href="/admin/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Plaza Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Configure the Virtual Plaza experience for your school -- rooms, games,
          store, chat, token economy, and moderation.
        </p>
      </div>

      {/* Plaza Status Banner */}
      <div className="ocean-card rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3">
              <Map className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Virtual Plaza Status
              </p>
              <p className="text-sm text-muted-foreground">
                {plazaEnabled
                  ? 'The plaza is active and accessible to students.'
                  : 'The plaza is currently disabled for all users.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPlazaEnabled(!plazaEnabled)
              toast.success(
                plazaEnabled
                  ? 'Plaza disabled for all users.'
                  : 'Plaza enabled for all users.'
              )
            }}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              plazaEnabled
                ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/50 dark:text-green-400 dark:hover:bg-green-950/70'
                : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-950/70'
            }`}
          >
            {plazaEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* Rooms Configuration */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Room Configuration
          </h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          The plaza consists of 5 core rooms. Each room can be toggled
          independently.
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <Map className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Wolf Whale Plaza (Main Hub)
                </p>
                <p className="text-xs text-muted-foreground">
                  Slug: {ROOM_SLUGS.PLAZA_MAIN} -- Max 50 occupants
                </p>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/50 dark:text-green-400">
              Always Active
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <Gamepad2 className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Game House
                </p>
                <p className="text-xs text-muted-foreground">
                  Slug: {ROOM_SLUGS.GAME_HOUSE} -- Educational mini games
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setGamesEnabled(!gamesEnabled)
              }}
              className="shrink-0"
              aria-label="Toggle Game House"
            >
              {gamesEnabled ? (
                <ToggleRight className="h-7 w-7 text-primary" />
              ) : (
                <ToggleLeft className="h-7 w-7 text-muted-foreground" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <Store className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Avatar Store
                </p>
                <p className="text-xs text-muted-foreground">
                  Slug: {ROOM_SLUGS.AVATAR_STORE} -- Token-based cosmetics
                  shop
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setStoreEnabled(!storeEnabled)
              }}
              className="shrink-0"
              aria-label="Toggle Avatar Store"
            >
              {storeEnabled ? (
                <ToggleRight className="h-7 w-7 text-primary" />
              ) : (
                <ToggleLeft className="h-7 w-7 text-muted-foreground" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-teal-500" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Study Hall
                </p>
                <p className="text-xs text-muted-foreground">
                  Slug: {ROOM_SLUGS.STUDY_HALL} -- Group pomodoro sessions
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setStudyHallEnabled(!studyHallEnabled)
              }}
              className="shrink-0"
              aria-label="Toggle Study Hall"
            >
              {studyHallEnabled ? (
                <ToggleRight className="h-7 w-7 text-primary" />
              ) : (
                <ToggleLeft className="h-7 w-7 text-muted-foreground" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <Film className="h-4 w-4 text-amber-500" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Ocean Theater
                </p>
                <p className="text-xs text-muted-foreground">
                  Slug: {ROOM_SLUGS.THEATER} -- Documentary viewing sessions
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setTheaterEnabled(!theaterEnabled)
              }}
              className="shrink-0"
              aria-label="Toggle Ocean Theater"
            >
              {theaterEnabled ? (
                <ToggleRight className="h-7 w-7 text-primary" />
              ) : (
                <ToggleLeft className="h-7 w-7 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleSave('Room')}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            Save Room Settings
          </button>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Feature Toggles
          </h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Enable or disable specific plaza features for your school.
        </p>
        <div className="space-y-3">
          <ToggleRow
            label="Safe Chat System"
            description="Pre-scripted chat phrases only (no free-text). Recommended for K-12."
            enabled={chatEnabled}
            onToggle={() => setChatEnabled(!chatEnabled)}
          />
          <ToggleRow
            label="Daily Login Rewards"
            description="Award tokens for daily plaza visits with streak bonuses."
            enabled={dailyLoginRewards}
            onToggle={() => setDailyLoginRewards(!dailyLoginRewards)}
          />
          <ToggleRow
            label="Multiplayer Games"
            description="Allow students to play mini games together (vs solo only)."
            enabled={multiplayerGames}
            onToggle={() => setMultiplayerGames(!multiplayerGames)}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleSave('Feature')}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            Save Features
          </button>
        </div>
      </div>

      {/* Token Economy Settings */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Token Economy
          </h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Current token earning rates and caps. These values are system-wide
          defaults.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              Earning Rates
            </h3>
            <div className="divide-y divide-border rounded-xl border border-border">
              <div className="px-4">
                <SettingsValueRow
                  label="Daily Login"
                  value={TOKEN_RATES.daily_login}
                  unit="tokens"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="Game Participation"
                  value={TOKEN_RATES.game_participation}
                  unit="tokens"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="Game Win"
                  value={TOKEN_RATES.game_win}
                  unit="tokens"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="Perfect Game"
                  value={TOKEN_RATES.game_perfect}
                  unit="tokens"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="Study Round"
                  value={TOKEN_RATES.study_round}
                  unit="tokens"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="Full Study Session"
                  value={TOKEN_RATES.study_full_session}
                  unit="tokens"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="Documentary Watch"
                  value={TOKEN_RATES.documentary_watch}
                  unit="tokens"
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              Caps & Streaks
            </h3>
            <div className="divide-y divide-border rounded-xl border border-border">
              <div className="px-4">
                <SettingsValueRow
                  label="Daily Token Cap"
                  value={TOKEN_DAILY_CAP}
                  unit="tokens/day"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="7-Day Streak Bonus"
                  value={TOKEN_RATES.streak_7_day}
                  unit="tokens"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="14-Day Streak Bonus"
                  value={TOKEN_RATES.streak_14_day}
                  unit="tokens"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="30-Day Streak Bonus"
                  value={TOKEN_RATES.streak_30_day}
                  unit="tokens"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="Quiz 90%+"
                  value={TOKEN_RATES.quiz_90_percent}
                  unit="tokens"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="Quiz 100%"
                  value={TOKEN_RATES.quiz_100_percent}
                  unit="tokens"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Token rates are configured in{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-[11px]">
                lib/plaza/constants.ts
              </code>
            </p>
          </div>
        </div>
      </div>

      {/* Chat & Moderation */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Safety & Moderation
          </h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          The plaza uses pre-scripted chat phrases to ensure child safety.
          Configure moderation settings below.
        </p>
        <div className="space-y-3">
          <ToggleRow
            label="Chat Content Filter"
            description="Enforce pre-scripted phrase-only chat (COPPA/FERPA compliant)."
            enabled={chatFilterEnabled}
            onToggle={() => setChatFilterEnabled(!chatFilterEnabled)}
          />
          <ToggleRow
            label="Parent Visibility"
            description="Allow parents to view their child's plaza activity and stats."
            enabled={parentVisibility}
            onToggle={() => setParentVisibility(!parentVisibility)}
          />
          <ToggleRow
            label="Activity Logging"
            description="Log all plaza interactions to the audit trail."
            enabled={activityLogging}
            onToggle={() => setActivityLogging(!activityLogging)}
          />
        </div>
        <div className="mt-5">
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            Chat Phrase Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {CHAT_CATEGORIES.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize text-muted-foreground"
              >
                <MessageSquare className="mr-1.5 h-3 w-3" />
                {cat}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {CHAT_CATEGORIES.length} categories with pre-approved phrases.
            Custom phrases can be added per tenant.
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleSave('Moderation')}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            Save Moderation Settings
          </button>
        </div>
      </div>

      {/* Plaza Technical Configuration */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Technical Configuration
          </h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Core plaza engine settings. These are system defaults that apply
          globally.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              Movement & Rendering
            </h3>
            <div className="divide-y divide-border rounded-xl border border-border">
              <div className="px-4">
                <SettingsValueRow
                  label="Walk Speed"
                  value={PLAZA_CONFIG.movementSpeed}
                  unit="px/s"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="Sprint Speed"
                  value={PLAZA_CONFIG.sprintSpeed}
                  unit="px/s"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="Target FPS"
                  value={PLAZA_CONFIG.targetFps}
                  unit="fps"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="Avatar Size"
                  value={PLAZA_CONFIG.avatarSize}
                  unit="px"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="Interaction Distance"
                  value={PLAZA_CONFIG.interactionDistance}
                  unit="px"
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              Networking & Chat
            </h3>
            <div className="divide-y divide-border rounded-xl border border-border">
              <div className="px-4">
                <SettingsValueRow
                  label="Position Broadcast Rate"
                  value={PLAZA_CONFIG.broadcastRateMs}
                  unit="ms"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="Chat Cooldown"
                  value={PLAZA_CONFIG.chatCooldownSeconds}
                  unit="seconds"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="Chat Bubble Duration"
                  value={PLAZA_CONFIG.chatBubbleDurationMs}
                  unit="ms"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="Max Room Occupants"
                  value={PLAZA_CONFIG.maxOccupantsDefault}
                  unit="users"
                />
              </div>
              <div className="px-4">
                <SettingsValueRow
                  label="Disconnect Timeout"
                  value={PLAZA_CONFIG.disconnectTimeoutMs / 1000}
                  unit="seconds"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Games Reference */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <Gamepad2 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Mini Games (6 Active)
          </h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Educational mini games available in the Game House. All games award
          tokens and XP.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: 'Math Blitz',
              subject: 'Mathematics',
              color: 'bg-red-500/10 text-red-600 dark:text-red-400',
            },
            {
              name: 'Word Scramble',
              subject: 'Language Arts',
              color:
                'bg-purple-500/10 text-purple-600 dark:text-purple-400',
            },
            {
              name: 'Typing Race',
              subject: 'Keyboarding',
              color:
                'bg-amber-500/10 text-amber-600 dark:text-amber-400',
            },
            {
              name: 'Science Trivia',
              subject: 'Science',
              color:
                'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            },
            {
              name: 'Memory Match',
              subject: 'General',
              color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
            },
            {
              name: 'Geography Dash',
              subject: 'Geography',
              color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
            },
          ].map((game) => (
            <div
              key={game.name}
              className="flex items-center gap-3 rounded-xl bg-muted/30 p-4"
            >
              <div className={`rounded-lg p-2 ${game.color}`}>
                <Gamepad2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {game.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {game.subject}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info footer */}
      <div className="rounded-2xl border border-border bg-muted/20 p-4 text-center">
        <Settings className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Advanced plaza configuration (custom rooms, store item management, and
          analytics) will be available in a future update. Toggle changes above
          are applied per session.
        </p>
      </div>
    </div>
  )
}
