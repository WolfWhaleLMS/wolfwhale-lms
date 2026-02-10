'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Zap, TrendingUp } from 'lucide-react'

interface XPBarProps {
  currentXP: number
  xpForCurrentLevel: number
  xpForNextLevel: number
  level: number
  tier: string
  compact?: boolean
}

const TIER_GRADIENTS: Record<string, string> = {
  Awakening: 'from-blue-400 to-cyan-400',
  Growth: 'from-emerald-400 to-teal-400',
  Advancement: 'from-violet-400 to-purple-400',
  Mastery: 'from-amber-400 to-orange-400',
}

const TIER_GLOW: Record<string, string> = {
  Awakening: 'shadow-blue-400/30',
  Growth: 'shadow-emerald-400/30',
  Advancement: 'shadow-violet-400/30',
  Mastery: 'shadow-amber-400/30',
}

export function XPBar({
  currentXP,
  xpForCurrentLevel,
  xpForNextLevel,
  level,
  tier,
  compact = false,
}: XPBarProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  const isMaxLevel = xpForNextLevel === Infinity
  const xpIntoLevel = currentXP - xpForCurrentLevel
  const xpNeeded = isMaxLevel ? 1 : xpForNextLevel - xpForCurrentLevel
  const progressPercent = isMaxLevel ? 100 : Math.min(100, (xpIntoLevel / xpNeeded) * 100)
  const xpRemaining = isMaxLevel ? 0 : xpForNextLevel - currentXP

  const gradient = TIER_GRADIENTS[tier] ?? TIER_GRADIENTS.Awakening
  const glow = TIER_GLOW[tier] ?? TIER_GLOW.Awakening

  useEffect(() => {
    // Animate progress bar on mount
    const timeout = setTimeout(() => {
      setAnimatedProgress(progressPercent)
    }, 100)
    return () => clearTimeout(timeout)
  }, [progressPercent])

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Zap className="size-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Lv {level}</span>
        </div>
        <div className="flex-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out',
                gradient
              )}
              style={{ width: `${animatedProgress}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          {currentXP.toLocaleString()} XP
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Level and Tier Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex size-12 items-center justify-center rounded-xl bg-gradient-to-br text-lg font-bold text-white shadow-lg',
              gradient,
              glow
            )}
          >
            {level}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">Level {level}</p>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{tier} Tier</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {currentXP.toLocaleString()} XP
          </p>
          {!isMaxLevel && (
            <p className="text-xs text-muted-foreground">
              {xpRemaining.toLocaleString()} XP to next level
            </p>
          )}
          {isMaxLevel && (
            <p className="text-xs text-muted-foreground">Max Level Reached</p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              'h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out',
              gradient
            )}
            style={{ width: `${animatedProgress}%` }}
          />
        </div>
        {/* XP Markers */}
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>{xpForCurrentLevel.toLocaleString()}</span>
          {!isMaxLevel && <span>{xpForNextLevel.toLocaleString()}</span>}
        </div>
      </div>
    </div>
  )
}
