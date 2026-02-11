'use client'

import Link from 'next/link'
import {
  Calculator,
  Shuffle,
  Keyboard,
  Brain,
  Grid3x3,
  Globe,
  Play,
  Users,
  Coins,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Game icon mapping
// ---------------------------------------------------------------------------

const GAME_ICONS: Record<string, LucideIcon> = {
  Calculator,
  Shuffle,
  Keyboard,
  Brain,
  Grid3x3,
  Globe,
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface GameCardData {
  slug: string
  name: string
  description: string
  subject: string
  icon: string
  colorHex: string
  playerRange: string
  tokenReward: number
}

interface GameCardProps {
  game: GameCardData
  context: 'plaza' | 'tools'
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GameCard({ game, context, className }: GameCardProps) {
  const Icon = GAME_ICONS[game.icon] ?? Brain
  const basePath = context === 'plaza' ? '/plaza/games' : '/student/tools/mini-games'

  return (
    <div
      className={cn(
        'ocean-card group rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]',
        className
      )}
    >
      {/* Icon + Subject */}
      <div className="mb-4 flex items-center justify-between">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-md"
          style={{ backgroundColor: `${game.colorHex}20` }}
        >
          <Icon className="h-7 w-7" style={{ color: game.colorHex }} />
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            backgroundColor: `${game.colorHex}15`,
            color: game.colorHex,
          }}
        >
          {game.subject}
        </span>
      </div>

      {/* Name + Description */}
      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
        {game.name}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
        {game.description}
      </p>

      {/* Meta row */}
      <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {game.playerRange}
        </span>
        <span className="inline-flex items-center gap-1">
          <Coins className="h-3.5 w-3.5 text-amber-500" />
          {game.tokenReward} tokens
        </span>
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex items-center gap-2">
        <Link
          href={`${basePath}/${game.slug}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Play className="h-4 w-4" />
          Play Solo
        </Link>
        {context === 'plaza' && (
          <button
            disabled
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground opacity-50 cursor-not-allowed"
            title="Coming soon"
          >
            <Users className="h-4 w-4" />
            Find Match
          </button>
        )}
      </div>
    </div>
  )
}
