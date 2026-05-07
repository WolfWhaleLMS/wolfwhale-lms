import type { CompanionHatchStage, CompanionMood, CompanionSpecies } from '@/lib/companion/ice-age-companion'

export const SPRITE_ATLAS_CONTRACT = {
  columns: 8,
  rows: 9,
  cellWidth: 192,
  cellHeight: 208,
  width: 1536,
  height: 1872,
} as const

export const COMPANION_ANIMATION_STATES = {
  idle: { row: 0, frames: 6, durationMs: 1100, label: 'Idle' },
  'running-right': { row: 1, frames: 8, durationMs: 1060, label: 'Walk right' },
  'running-left': { row: 2, frames: 8, durationMs: 1060, label: 'Walk left' },
  greeting: { row: 3, frames: 4, durationMs: 700, label: 'Greeting' },
  celebrating: { row: 4, frames: 5, durationMs: 840, label: 'Sparkle celebration' },
  sad: { row: 5, frames: 8, durationMs: 1220, label: 'Gentle sad' },
  waiting: { row: 6, frames: 6, durationMs: 1010, label: 'Waiting' },
  'front-running': { row: 7, frames: 6, durationMs: 820, label: 'Front run' },
  review: { row: 8, frames: 6, durationMs: 1030, label: 'Review focus' },
} as const

export type CompanionAnimationState = keyof typeof COMPANION_ANIMATION_STATES

export interface CompanionSpriteAsset {
  species: CompanionSpecies
  atlasPath: string
  referencePath: string
  status: 'planned' | 'ready'
}

export const COMPANION_SPRITE_ASSETS: Record<CompanionSpecies, CompanionSpriteAsset> = {
  'woolly-mammoth': {
    species: 'woolly-mammoth',
    atlasPath: '/images/ice-age-companion/sprites/woolly-mammoth.webp',
    referencePath: '/images/ice-age-companion/reference/animation-bible.png',
    status: 'planned',
  },
  'saber-tooth-cat': {
    species: 'saber-tooth-cat',
    atlasPath: '/images/ice-age-companion/sprites/saber-tooth-cat.webp',
    referencePath: '/images/ice-age-companion/reference/animation-bible.png',
    status: 'planned',
  },
  'giant-ground-sloth': {
    species: 'giant-ground-sloth',
    atlasPath: '/images/ice-age-companion/sprites/giant-ground-sloth.webp',
    referencePath: '/images/ice-age-companion/reference/animation-bible.png',
    status: 'planned',
  },
  'woolly-rhino': {
    species: 'woolly-rhino',
    atlasPath: '/images/ice-age-companion/sprites/woolly-rhino.webp',
    referencePath: '/images/ice-age-companion/reference/animation-bible.png',
    status: 'planned',
  },
  'giant-elk': {
    species: 'giant-elk',
    atlasPath: '/images/ice-age-companion/sprites/giant-elk.webp',
    referencePath: '/images/ice-age-companion/reference/animation-bible.png',
    status: 'planned',
  },
  glyptodont: {
    species: 'glyptodont',
    atlasPath: '/images/ice-age-companion/sprites/glyptodont.webp',
    referencePath: '/images/ice-age-companion/reference/animation-bible.png',
    status: 'planned',
  },
}

export function companionAnimationForMood(input: {
  hatchStage: CompanionHatchStage
  mood: CompanionMood
  moving?: boolean
  direction?: 'left' | 'right' | 'front'
}): CompanionAnimationState {
  if (input.hatchStage !== 'hatched') return input.mood === 'hatching' ? 'celebrating' : 'idle'
  if (input.moving && input.direction === 'left') return 'running-left'
  if (input.moving && input.direction === 'right') return 'running-right'
  if (input.moving) return 'front-running'
  if (input.mood === 'celebrating') return 'celebrating'
  if (input.mood === 'sleepy') return 'waiting'
  if (input.mood === 'studying') return 'review'

  return 'idle'
}
