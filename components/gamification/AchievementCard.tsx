import { cn } from '@/lib/utils'
import { Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface AchievementCardProps {
  achievement: {
    name: string
    description: string
    icon: string
    category: string
    tier: 'bronze' | 'silver' | 'gold' | 'platinum'
    xpReward: number
  }
  earned: boolean
  earnedAt?: string | null
  isNew?: boolean
}

const TIER_BORDER: Record<string, string> = {
  bronze: 'border-amber-600/50 hover:border-amber-600',
  silver: 'border-slate-400/50 hover:border-slate-400',
  gold: 'border-yellow-400/50 hover:border-yellow-400',
  platinum: 'border-cyan-300/50 hover:border-cyan-300',
}

const TIER_BADGE_STYLES: Record<string, string> = {
  bronze: 'bg-amber-600/15 text-amber-700 dark:text-amber-400',
  silver: 'bg-slate-400/15 text-slate-600 dark:text-slate-300',
  gold: 'bg-yellow-400/15 text-yellow-700 dark:text-yellow-400',
  platinum: 'bg-cyan-300/15 text-cyan-700 dark:text-cyan-300',
}

const TIER_GLOW: Record<string, string> = {
  bronze: 'shadow-amber-600/20',
  silver: 'shadow-slate-400/20',
  gold: 'shadow-yellow-400/20',
  platinum: 'shadow-cyan-300/20',
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function AchievementCard({
  achievement,
  earned,
  earnedAt,
  isNew = false,
}: AchievementCardProps) {
  const { name, description, icon, category, tier, xpReward } = achievement
  const tierBorder = TIER_BORDER[tier] ?? TIER_BORDER.bronze
  const tierBadge = TIER_BADGE_STYLES[tier] ?? TIER_BADGE_STYLES.bronze
  const tierGlow = TIER_GLOW[tier] ?? TIER_GLOW.bronze

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border-2 p-5 transition-all duration-300',
        earned
          ? cn('ocean-card', tierBorder, 'shadow-lg', tierGlow)
          : 'border-border/30 bg-muted/30 opacity-60'
      )}
    >
      {/* Shimmer animation for newly earned */}
      {isNew && earned && (
        <div className="pointer-events-none absolute inset-0 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={cn(
            'flex size-14 shrink-0 items-center justify-center rounded-xl text-2xl',
            earned ? 'bg-background/50' : 'bg-muted/50'
          )}
        >
          {earned ? (
            <span>{icon}</span>
          ) : (
            <Lock className="size-6 text-muted-foreground/50" />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                'text-sm font-semibold',
                earned ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {name}
            </h3>
            <Badge
              variant="secondary"
              className={cn('shrink-0 text-[10px] uppercase', earned && tierBadge)}
            >
              {tier}
            </Badge>
          </div>

          <p
            className={cn(
              'mt-1 text-xs',
              earned ? 'text-muted-foreground' : 'text-muted-foreground/60'
            )}
          >
            {description}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <span
              className={cn(
                'text-xs font-medium',
                earned ? 'text-primary' : 'text-muted-foreground/50'
              )}
            >
              +{xpReward} XP
            </span>
            <span className="text-xs capitalize text-muted-foreground/60">
              {category}
            </span>
            {earned && earnedAt && (
              <span className="ml-auto text-[10px] text-muted-foreground/60">
                Earned {formatDate(earnedAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
