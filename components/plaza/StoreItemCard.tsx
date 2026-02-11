'use client'

import { Check, Star, Lock, Coins } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Rarity color mapping
// ---------------------------------------------------------------------------

const RARITY_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  bronze: {
    bg: 'bg-amber-700/10',
    text: 'text-amber-700 dark:text-amber-500',
    border: 'border-amber-700/30',
    label: 'Bronze',
  },
  silver: {
    bg: 'bg-gray-400/10',
    text: 'text-gray-500 dark:text-gray-400',
    border: 'border-gray-400/30',
    label: 'Silver',
  },
  gold: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-500/30',
    label: 'Gold',
  },
  platinum: {
    bg: 'bg-purple-400/10',
    text: 'text-purple-500 dark:text-purple-400',
    border: 'border-purple-400/30',
    label: 'Platinum',
  },
}

// Category color mapping for placeholder previews
const CATEGORY_COLORS: Record<string, string> = {
  hat: '#6366f1',
  outfit: '#10b981',
  accessory: '#f59e0b',
  color_palette: '#ef4444',
  background: '#0ea5e9',
  trail_effect: '#8b5cf6',
  emote: '#f97316',
  eye_style: '#02C2AD',
  body_shape: '#ec4899',
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface StoreItem {
  id: string
  name: string
  description?: string
  category: string
  rarity: string
  price_tokens: number
  is_free: boolean
  preview_url?: string | null
  color_hex?: string | null
  min_avatar_level: number
  sprite_key: string
}

interface StoreItemCardProps {
  item: StoreItem
  isOwned: boolean
  isEquipped: boolean
  userLevel: number
  onClick?: () => void
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StoreItemCard({
  item,
  isOwned,
  isEquipped,
  userLevel,
  onClick,
  className,
}: StoreItemCardProps) {
  const rarity = RARITY_COLORS[item.rarity] ?? RARITY_COLORS.bronze
  const categoryColor = CATEGORY_COLORS[item.category] ?? '#6366f1'
  const isLocked = userLevel < item.min_avatar_level

  return (
    <button
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
      className={cn(
        'ocean-card group relative rounded-2xl p-4 text-left transition-all duration-200',
        !isLocked && 'hover:shadow-lg hover:scale-[1.02] cursor-pointer',
        isLocked && 'opacity-60 cursor-not-allowed',
        isOwned && 'ring-2 ring-primary/30',
        className
      )}
    >
      {/* Owned / Equipped badges */}
      {isOwned && (
        <div className="absolute -top-1.5 -right-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-green-500 shadow-md">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}
      {isEquipped && (
        <div className="absolute -top-1.5 -left-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 shadow-md">
          <Star className="h-4 w-4 text-white" />
        </div>
      )}

      {/* Preview area */}
      <div
        className="mb-3 flex h-24 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${categoryColor}15` }}
      >
        {item.preview_url ? (
          <img
            src={item.preview_url}
            alt={item.name}
            className="h-16 w-16 object-contain"
          />
        ) : (
          <div
            className="h-12 w-12 rounded-lg"
            style={{ backgroundColor: item.color_hex ?? categoryColor, opacity: 0.6 }}
          />
        )}
      </div>

      {/* Name */}
      <h3 className="text-sm font-semibold text-foreground truncate">{item.name}</h3>

      {/* Rarity + Price row */}
      <div className="mt-2 flex items-center justify-between">
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-xs font-semibold',
            rarity.bg,
            rarity.text
          )}
        >
          {rarity.label}
        </span>

        {item.is_free ? (
          <span className="text-xs font-bold text-green-600 dark:text-green-400">FREE</span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Coins className="h-3 w-3" />
            {item.price_tokens}
          </span>
        )}
      </div>

      {/* Level lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm">
          <Lock className="h-6 w-6 text-muted-foreground" />
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            Level {item.min_avatar_level} required
          </p>
        </div>
      )}
    </button>
  )
}
