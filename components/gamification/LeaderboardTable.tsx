'use client'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, TrendingUp } from 'lucide-react'

export interface LeaderboardEntry {
  rank: number
  userId: string
  userName: string
  avatar: string | null
  xpTotal: number
  level: number
  tier: string
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  currentUserId: string
}

const RANK_MEDALS: Record<number, string> = {
  1: '\u{1F947}',
  2: '\u{1F948}',
  3: '\u{1F949}',
}

const RANK_STYLES: Record<number, string> = {
  1: 'bg-[#33FF33]/5 border-[#33FF33]/30 chrome-surface',
  2: 'bg-[#00BFFF]/5 border-[#00BFFF]/30 chrome-surface',
  3: 'bg-[#FFAA00]/5 border-[#FFAA00]/30 chrome-surface',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Trophy className="mb-3 size-12 text-muted-foreground/30" />
        <p className="text-muted-foreground">No leaderboard data yet.</p>
        <p className="mt-1 text-sm text-muted-foreground/60">
          Start earning XP to climb the ranks!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Desktop Table Header */}
      <div className="hidden items-center gap-4 rounded-xl liquid-glass bg-[#00BFFF]/5 dark:bg-[#00BFFF]/10 px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#6B8FA3] font-display sm:flex">
        <div className="w-12 text-center">Rank</div>
        <div className="flex-1">Student</div>
        <div className="w-24 text-right">XP</div>
        <div className="w-20 text-right">Level</div>
      </div>

      {/* Entries */}
      {entries.map((entry) => {
        const isCurrentUser = entry.userId === currentUserId
        const isTopThree = entry.rank <= 3
        const medal = RANK_MEDALS[entry.rank]
        const rankStyle = RANK_STYLES[entry.rank]

        return (
          <div
            key={entry.userId}
            className={cn(
              'flex items-center gap-4 rounded-xl border px-4 py-3 transition-all duration-200 liquid-glass',
              isCurrentUser && 'border-2 border-[#33FF33]/50 bg-[#33FF33]/5 shadow-[0_0_15px_rgba(51,255,51,0.2)] neon-glow-green',
              !isCurrentUser && isTopThree && rankStyle,
              !isCurrentUser && !isTopThree && 'border-[#00BFFF]/15 bg-white/5 hover:bg-[#00BFFF]/5'
            )}
          >
            {/* Rank */}
            <div className="flex w-12 items-center justify-center">
              {medal ? (
                <span className="text-xl">{medal}</span>
              ) : (
                <span className="text-sm font-semibold text-muted-foreground">
                  {entry.rank}
                </span>
              )}
            </div>

            {/* Avatar + Name (responsive) */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar size="default">
                {entry.avatar && <AvatarImage src={entry.avatar} alt={entry.userName} />}
                <AvatarFallback>{getInitials(entry.userName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p
                  className={cn(
                    'truncate text-sm font-medium',
                    isCurrentUser ? 'text-[#33FF33]' : 'text-[#0A2540] dark:text-[#E8F8FF]'
                  )}
                >
                  {entry.userName}
                  {isCurrentUser && (
                    <span className="ml-1.5 text-xs text-muted-foreground">(You)</span>
                  )}
                </p>
                {/* Mobile: show XP and level inline */}
                <div className="flex items-center gap-2 sm:hidden">
                  <span className="text-xs font-medium text-[#33FF33] font-data">
                    {entry.xpTotal.toLocaleString()} XP
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Lv {entry.level}
                  </span>
                </div>
              </div>
            </div>

            {/* XP — desktop */}
            <div className="hidden w-24 text-right sm:block">
              <span className="text-sm font-semibold text-foreground">
                {entry.xpTotal.toLocaleString()}
              </span>
              <span className="ml-1 text-xs text-muted-foreground">XP</span>
            </div>

            {/* Level — desktop */}
            <div className="hidden w-20 items-center justify-end gap-1.5 sm:flex">
              <TrendingUp className="size-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {entry.level}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
