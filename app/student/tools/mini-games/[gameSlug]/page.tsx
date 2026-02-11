'use client'

import { use } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Calculator,
  Shuffle,
  Keyboard,
  Brain,
  Grid3x3,
  Globe,
  Coins,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Game metadata (mirrors GameSelector data)
// ---------------------------------------------------------------------------

interface GameMeta {
  name: string
  description: string
  instructions: string
  subject: string
  icon: LucideIcon
  colorHex: string
  tokenRewardBase: number
  tokenRewardWin: number
  xpReward: number
}

const GAME_META: Record<string, GameMeta> = {
  'math-blitz': {
    name: 'Math Blitz',
    description: 'Race against the clock to solve as many math problems as you can!',
    instructions: 'Solve arithmetic problems as fast as possible. Each correct answer earns points. Wrong answers subtract time. Score high for bonus tokens!',
    subject: 'Math',
    icon: Calculator,
    colorHex: '#6366f1',
    tokenRewardBase: 5,
    tokenRewardWin: 15,
    xpReward: 10,
  },
  'word-scramble': {
    name: 'Word Scramble',
    description: 'Unscramble jumbled letters to form words before time runs out!',
    instructions: 'Each round shows a set of scrambled letters. Type the correct word and press Enter. Longer words earn more points!',
    subject: 'Language Arts',
    icon: Shuffle,
    colorHex: '#f59e0b',
    tokenRewardBase: 5,
    tokenRewardWin: 15,
    xpReward: 10,
  },
  'typing-race': {
    name: 'Typing Race',
    description: 'Type sentences accurately and as fast as you can!',
    instructions: 'Type the displayed sentence as fast and accurately as possible. Your WPM and accuracy determine your score.',
    subject: 'Typing',
    icon: Keyboard,
    colorHex: '#10b981',
    tokenRewardBase: 5,
    tokenRewardWin: 15,
    xpReward: 10,
  },
  'science-trivia': {
    name: 'Science Trivia',
    description: 'Test your science knowledge with 10 questions!',
    instructions: 'Answer 10 multiple-choice science questions. The faster you answer correctly, the more points you earn. Get all 10 right for a perfect score bonus!',
    subject: 'Science',
    icon: Brain,
    colorHex: '#ef4444',
    tokenRewardBase: 5,
    tokenRewardWin: 15,
    xpReward: 10,
  },
  'memory-match': {
    name: 'Memory Match',
    description: 'Flip cards and find matching pairs!',
    instructions: 'Click cards to flip them over. Find all matching pairs with the fewest moves possible. Faster completion earns more tokens!',
    subject: 'Memory',
    icon: Grid3x3,
    colorHex: '#8b5cf6',
    tokenRewardBase: 5,
    tokenRewardWin: 15,
    xpReward: 10,
  },
  'geography-dash': {
    name: 'Geography Dash',
    description: 'Identify countries, capitals, and landmarks on the map!',
    instructions: 'Answer geography questions about countries, capitals, flags, and landmarks. Speed and accuracy both count toward your final score!',
    subject: 'Geography',
    icon: Globe,
    colorHex: '#0ea5e9',
    tokenRewardBase: 5,
    tokenRewardWin: 15,
    xpReward: 10,
  },
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function GamePage({
  params,
}: {
  params: Promise<{ gameSlug: string }>
}) {
  const { gameSlug } = use(params)
  const game = GAME_META[gameSlug]

  if (!game) {
    return (
      <div className="space-y-6">
        <Link
          href="/student/tools/mini-games"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Mini Games
        </Link>
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-muted/30 py-16 text-center">
          <p className="text-lg font-bold text-foreground">Game not found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            This game does not exist. Please go back and select a valid game.
          </p>
        </div>
      </div>
    )
  }

  const Icon = game.icon

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/student/tools/mini-games"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Mini Games
      </Link>

      {/* Game header */}
      <div>
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-md"
            style={{ backgroundColor: `${game.colorHex}20` }}
          >
            <Icon className="h-6 w-6" style={{ color: game.colorHex }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {game.name}
            </h1>
            <p className="text-muted-foreground">{game.description}</p>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Game area (placeholder) */}
        <div className="lg:col-span-2">
          <div className="ocean-card rounded-2xl p-8">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl"
                style={{ backgroundColor: `${game.colorHex}15` }}
              >
                <Icon className="h-12 w-12" style={{ color: game.colorHex }} />
              </div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                Coming Soon
              </div>

              <h2 className="text-2xl font-bold text-foreground">
                {game.name}
              </h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                This game is being built! Soon you will be able to play{' '}
                {game.name} right here and earn tokens and XP.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          {/* Reward info */}
          <div className="ocean-card rounded-2xl p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
              <Coins className="h-5 w-5 text-amber-500" />
              Rewards
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Reward</span>
                <span className="font-semibold text-foreground">
                  {game.tokenRewardBase} tokens
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Win Bonus</span>
                <span className="font-semibold text-foreground">
                  {game.tokenRewardWin} tokens
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">XP Earned</span>
                <span className="font-semibold text-foreground">
                  {game.xpReward} XP
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="ocean-card rounded-2xl p-6">
            <h2 className="mb-3 text-lg font-bold text-foreground">
              How to Play
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {game.instructions}
            </p>
          </div>

          {/* Subject tag */}
          <div className="ocean-card rounded-2xl p-6">
            <h2 className="mb-3 text-lg font-bold text-foreground">Subject</h2>
            <span
              className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold"
              style={{
                backgroundColor: `${game.colorHex}15`,
                color: game.colorHex,
              }}
            >
              {game.subject}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
