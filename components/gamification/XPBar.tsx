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
  Awakening: 'from-[#00BFFF] to-[#00FFFF]',
  Growth: 'from-[#33FF33] to-[#00FFFF]',
  Advancement: 'from-[#00BFFF] to-[#33FF33]',
  Mastery: 'from-[#FFAA00] to-[#FF3366]',
}

const TIER_GLOW: Record<string, string> = {
  Awakening: 'shadow-[#00BFFF]/30',
  Growth: 'shadow-[#33FF33]/30',
  Advancement: 'shadow-[#00BFFF]/30',
  Mastery: 'shadow-[#FFAA00]/30',
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
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#00BFFF]/10 dark:bg-[#00BFFF]/15">
            <div
              className={cn(
                'h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(51,255,51,0.4)]',
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
              'flex size-12 items-center justify-center rounded-xl chrome-surface bg-gradient-to-br text-lg font-bold text-white text-white-outlined shadow-lg font-data',
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
        <div className="h-4 w-full overflow-hidden rounded-full bg-[#00BFFF]/10 dark:bg-[#00BFFF]/15">
          <div
            className={cn(
              'h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out neon-glow-green',
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
