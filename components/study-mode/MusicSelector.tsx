'use client'

import { VolumeX, Music, TreePine, Waves, Radio, CloudRain } from 'lucide-react'
import { cn } from '@/lib/utils'

const MUSIC_OPTIONS = [
  { id: 'silent', name: 'Silent', icon: VolumeX },
  { id: 'lofi', name: 'Lo-fi Beats', icon: Music },
  { id: 'nature', name: 'Nature Sounds', icon: TreePine },
  { id: 'ocean', name: 'Ocean Waves', icon: Waves },
  { id: 'whitenoise', name: 'White Noise', icon: Radio },
  { id: 'rainfall', name: 'Rainfall', icon: CloudRain },
] as const

export type MusicType = (typeof MUSIC_OPTIONS)[number]['id']

interface MusicSelectorProps {
  selected: MusicType
  onSelect: (music: MusicType) => void
}

export default function MusicSelector({ selected, onSelect }: MusicSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-3">
      {MUSIC_OPTIONS.map((option) => {
        const Icon = option.icon
        const isActive = selected === option.id
        return (
          <button
            type="button"
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={cn(
              'group flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all duration-200',
              isActive
                ? 'glow-border-ocean border-primary/50 bg-primary/10 text-white'
                : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white/80'
            )}
            aria-label={`Select ${option.name} ambient sound`}
            aria-pressed={isActive}
          >
            <Icon
              className={cn(
                'size-6 transition-all duration-200',
                isActive
                  ? 'text-primary drop-shadow-[0_0_6px_oklch(0.70_0.12_180/0.5)]'
                  : 'text-white/50 group-hover:text-white/70'
              )}
            />
            <span className="text-xs font-medium leading-tight text-center">
              {option.name}
            </span>
            {isActive && (
              <div className="h-1 w-6 rounded-full bg-gradient-to-r from-primary/60 to-primary" />
            )}
          </button>
        )
      })}
    </div>
  )
}

export { MUSIC_OPTIONS }
