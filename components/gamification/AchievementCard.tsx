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
  bronze: 'border-[#FFAA00]/50 hover:border-[#FFAA00]',
  silver: 'border-[#00BFFF]/50 hover:border-[#00BFFF]',
  gold: 'border-[#33FF33]/50 hover:border-[#33FF33]',
  platinum: 'border-[#00FFFF]/50 hover:border-[#00FFFF] neon-pulse-cyan',
}

const TIER_BADGE_STYLES: Record<string, string> = {
  bronze: 'bg-[#FFAA00]/15 text-[#FFAA00]',
  silver: 'bg-[#00BFFF]/15 text-[#00BFFF]',
  gold: 'bg-[#33FF33]/15 text-[#33FF33]',
  platinum: 'bg-[#00FFFF]/15 text-[#00FFFF]',
}

const TIER_GLOW: Record<string, string> = {
  bronze: 'shadow-[#FFAA00]/20',
  silver: 'shadow-[#00BFFF]/20',
  gold: 'shadow-[#33FF33]/20',
  platinum: 'shadow-[#00FFFF]/30',
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
          ? cn('liquid-glass', tierBorder, 'shadow-lg', tierGlow)
          : 'border-[#00BFFF]/10 bg-[#041428]/20 opacity-60'
      )}
    >
      {/* Shimmer animation for newly earned */}
      {isNew && earned && (
        <div className="pointer-events-none absolute inset-0 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00BFFF]/10 to-transparent" />
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
                'text-xs font-medium font-data',
                earned ? 'text-[#33FF33]' : 'text-muted-foreground/50'
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
