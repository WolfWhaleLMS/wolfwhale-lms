import type { CompanionHatchStage, CompanionMood, CompanionSpecies } from '@/lib/companion/fish-companion'

export const SPRITE_ATLAS_CONTRACT = {
  columns: 8,
  rows: 9,
  cellWidth: 192,
  cellHeight: 208,
  width: 1536,
  height: 1872,
} as const

export const COMPANION_ANIMATION_STATES = {
  idle: {
    row: 0,
    frames: 6,
    durationMs: 1100,
    label: 'Idle',
    requiredCue: 'soft blink, tiny cheek blush, and a cozy body bob',
    effectRule: 'no detached icons; cute face pixels must stay inside the silhouette',
  },
  'running-right': {
    row: 1,
    frames: 8,
    durationMs: 1060,
    label: 'Walk right',
    requiredCue: 'bright eyes or smile with a tiny fin sparkle touching the tail on peak swims',
    effectRule: 'no speed lines, dust clouds, trails, shadows, or loose sparkle sprites',
  },
  'running-left': {
    row: 2,
    frames: 8,
    durationMs: 1060,
    label: 'Walk left',
    requiredCue: 'bright eyes or smile with a tiny fin sparkle touching the tail on peak swims',
    effectRule: 'no speed lines, dust clouds, trails, shadows, or loose sparkle sprites',
  },
  greeting: {
    row: 3,
    frames: 4,
    durationMs: 700,
    label: 'Greeting',
    requiredCue: 'smiling eyes with one attached heart sparkle or cheek sparkle',
    effectRule: 'heart/sparkle pixels must touch the pet outline or overlap the cheek',
  },
  celebrating: {
    row: 4,
    frames: 5,
    durationMs: 840,
    label: 'Sparkle celebration',
    requiredCue: 'sparkle-flash burst attached to the signature feature and cheerful emoticon eyes',
    effectRule: 'hard-pixel stars only; keep sparkles touching fins, cheeks, stripes, bubbles, or tail tips',
  },
  sad: {
    row: 5,
    frames: 8,
    durationMs: 1220,
    label: 'Gentle sad',
    requiredCue: 'droopy emoticon eyes or one tiny tear touching the face',
    effectRule: 'student-safe and gentle; no injury marks, punishment symbols, or detached tear drops',
  },
  waiting: {
    row: 6,
    frames: 6,
    durationMs: 1010,
    label: 'Waiting',
    requiredCue: 'sleepy eyelids, blush pixels, or a small eye sparkle while resting',
    effectRule: 'no Z letters, bubbles, floor shadows, or separate sleepy icons',
  },
  'front-running': {
    row: 7,
    frames: 6,
    durationMs: 820,
    label: 'Front run',
    requiredCue: 'front-facing smile or determined eyes with a tiny sparkle touching a fin',
    effectRule: 'show motion through body pose only; no trails, dust, or detached marks',
  },
  review: {
    row: 8,
    frames: 6,
    durationMs: 1030,
    label: 'Review focus',
    requiredCue: 'focused emoticon eyes with a small attached brow, cheek, or signature-feature sparkle',
    effectRule: 'no papers, question marks, speech bubbles, UI panels, or floating symbols',
  },
} as const

export type CompanionAnimationState = keyof typeof COMPANION_ANIMATION_STATES

export interface CompanionSpriteAsset {
  species: CompanionSpecies
  atlasPath: string
  basePreviewPath?: string
  referencePath: string
  status: 'planned' | 'ready'
  sparkleAnchor: string
  emoticonCue: string
  anatomyLock: string
}

export const COMPANION_SPRITE_ASSETS: Record<CompanionSpecies, CompanionSpriteAsset> = {
  clownfish: {
    species: 'clownfish',
    atlasPath: '/images/sea-companion/sprites/clownfish.webp',
    basePreviewPath: '/clownfish.svg',
    referencePath: '/clownfish.svg',
    status: 'planned',
    sparkleAnchor: 'tail fin, cheek stripe, dorsal fin, and tiny bubble trail',
    emoticonCue: 'huge bright eyes, orange blush pixels, bubble smile',
    anatomyLock: 'one fish body, two side fins, one dorsal fin, one tail fin, and three white stripes',
  },
  pufferfish: {
    species: 'pufferfish',
    atlasPath: '/images/sea-companion/sprites/pufferfish.webp',
    basePreviewPath: '/images/sea-companion/concepts/puffer-fish-design-bible.png',
    referencePath: '/images/sea-companion/concepts/puffer-fish-design-bible.png',
    status: 'planned',
    sparkleAnchor: 'round cheek spikes, tail fin, tiny side fins, and bubble puff',
    emoticonCue: 'large curious eyes, tiny smile, golden blush bubbles',
    anatomyLock: 'one round fish body, two side fins, one tail fin, small cheek spikes, and no extra eyes',
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
