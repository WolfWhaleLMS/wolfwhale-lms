'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { CompanionHatchStage, CompanionSpecies } from '@/lib/companion/ice-age-companion'
import {
  COMPANION_ANIMATION_STATES,
  COMPANION_SPRITE_ASSETS,
  SPRITE_ATLAS_CONTRACT,
  companionAnimationForMood,
  type CompanionAnimationState,
} from '@/lib/companion/sprite-assets'

export function CompanionSprite({
  species,
  hatchStage = 'hatched',
  mood = 'idle',
  state,
  moving = false,
  direction = 'front',
  size = 96,
  className,
}: {
  species: CompanionSpecies
  hatchStage?: CompanionHatchStage
  mood?: Parameters<typeof companionAnimationForMood>[0]['mood']
  state?: CompanionAnimationState
  moving?: boolean
  direction?: 'left' | 'right' | 'front'
  size?: number
  className?: string
}) {
  if (hatchStage !== 'hatched') {
    return <CompanionEgg hatchStage={hatchStage} size={size} className={className} />
  }

  const animationState = state ?? companionAnimationForMood({ hatchStage, mood, moving, direction })
  const animation = COMPANION_ANIMATION_STATES[animationState]
  const asset = COMPANION_SPRITE_ASSETS[species]
  const scale = size / SPRITE_ATLAS_CONTRACT.cellWidth
  const height = Math.round(SPRITE_ATLAS_CONTRACT.cellHeight * scale)

  if (asset.status === 'ready') {
    return (
      <span
        aria-label={`${asset.species} companion ${animation.label}`}
        className={cn('ww-companion-sprite-shell', className)}
        role="img"
        style={{ width: size, height } as CSSProperties}
      >
        <span
          className="ww-companion-sprite-atlas"
          style={
            {
              backgroundImage: `url(${asset.atlasPath})`,
              '--ww-sprite-row': animation.row,
              '--ww-sprite-frames': animation.frames,
              '--ww-sprite-duration': `${animation.durationMs}ms`,
              '--ww-sprite-scale': scale,
            } as CSSProperties
          }
        />
      </span>
    )
  }

  if (asset.basePreviewPath) {
    return (
      <span
        aria-label={`${asset.species} companion preview ${animation.label}`}
        className={cn('ww-companion-preview-shell', className)}
        role="img"
        style={{ width: size, height } as CSSProperties}
      >
        <Image
          src={asset.basePreviewPath}
          alt=""
          width={SPRITE_ATLAS_CONTRACT.cellWidth}
          height={SPRITE_ATLAS_CONTRACT.cellHeight}
          className="h-full w-full object-contain"
          unoptimized
        />
      </span>
    )
  }

  return (
    <span
      aria-label={`${asset.species} companion placeholder ${animation.label}`}
      className={cn('ww-companion-fallback-shell', className)}
      role="img"
      style={{ width: size, height, fontSize: size } as CSSProperties}
    >
      <span className="ww-companion-fallback" data-species={species} data-state={animationState}>
        <span className="ww-companion-fallback-body" />
        <span className="ww-companion-fallback-face" />
        <span className="ww-companion-fallback-feature" />
        <span className="ww-companion-fallback-sparkle" />
      </span>
    </span>
  )
}

function CompanionEgg({
  hatchStage,
  size,
  className,
}: {
  hatchStage: CompanionHatchStage
  size: number
  className?: string
}) {
  const crackLevel = hatchStage === 'egg' ? 0 : hatchStage === 'crack-stage-1' ? 1 : hatchStage === 'crack-stage-2' ? 2 : 3

  return (
    <span
      aria-label="Ice Age companion egg"
      className={cn('ww-companion-egg-shell', className)}
      data-crack-level={crackLevel}
      role="img"
      style={{ width: size, height: Math.round(size * 1.08), fontSize: size } as CSSProperties}
    >
      <span className="ww-companion-egg" />
    </span>
  )
}
