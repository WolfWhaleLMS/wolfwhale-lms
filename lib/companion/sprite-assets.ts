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
    requiredCue: 'bright eyes or smile with a tiny paw/hoof sparkle touching the foot on peak steps',
    effectRule: 'no speed lines, dust clouds, trails, shadows, or loose sparkle sprites',
  },
  'running-left': {
    row: 2,
    frames: 8,
    durationMs: 1060,
    label: 'Walk left',
    requiredCue: 'bright eyes or smile with a tiny paw/hoof sparkle touching the foot on peak steps',
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
    effectRule: 'hard-pixel stars only; keep sparkles touching tusks, fangs, claws, horns, antlers, shell, or paws',
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
    requiredCue: 'front-facing smile or determined eyes with a tiny sparkle touching a paw/hoof',
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
  'woolly-mammoth': {
    species: 'woolly-mammoth',
    atlasPath: '/images/ice-age-companion/sprites/woolly-mammoth.webp',
    basePreviewPath: '/images/ice-age-companion/base/woolly-mammoth.png',
    referencePath: '/images/ice-age-companion/reference/animation-bible.png',
    status: 'planned',
    sparkleAnchor: 'trunk curl, tusk tips, cheek fluff, and stomp paws',
    emoticonCue: 'huge blue eyes, round blush pixels, and a soft smile',
    anatomyLock: 'exactly one trunk, two tusks, four legs, two ears, and one short tail',
  },
  'saber-tooth-cat': {
    species: 'saber-tooth-cat',
    atlasPath: '/images/ice-age-companion/sprites/saber-tooth-cat.webp',
    basePreviewPath: '/images/ice-age-companion/base/saber-tooth-cat.png',
    referencePath: '/images/ice-age-companion/reference/animation-bible.png',
    status: 'planned',
    sparkleAnchor: 'saber tips, ear tips, cheek ruff, and front paws',
    emoticonCue: 'large amber eyes, tiny fang smile, and blush pixels',
    anatomyLock: 'one head, two saber canines, four legs, rounded ears, and one short tail',
  },
  'giant-ground-sloth': {
    species: 'giant-ground-sloth',
    atlasPath: '/images/ice-age-companion/sprites/giant-ground-sloth.webp',
    basePreviewPath: '/images/ice-age-companion/base/giant-ground-sloth.png',
    referencePath: '/images/ice-age-companion/reference/animation-bible.png',
    status: 'planned',
    sparkleAnchor: 'long claw tips, nose bridge, shoulder fur, and belly tuft',
    emoticonCue: 'sleepy green eyes, gentle smile, and soft cheek blush',
    anatomyLock: 'one head, two long forearms, two hind legs, and no floating extra claws',
  },
  'woolly-rhino': {
    species: 'woolly-rhino',
    atlasPath: '/images/ice-age-companion/sprites/woolly-rhino.webp',
    basePreviewPath: '/images/ice-age-companion/base/woolly-rhino.png',
    referencePath: '/images/ice-age-companion/reference/animation-bible.png',
    status: 'planned',
    sparkleAnchor: 'front horn, smaller rear horn, cheek fluff, and hoof taps',
    emoticonCue: 'round brown eyes, proud smile, and warm blush pixels',
    anatomyLock: 'one head, four legs, one large front horn, one smaller rear horn, and no extra nose horns',
  },
  'giant-elk': {
    species: 'giant-elk',
    atlasPath: '/images/ice-age-companion/sprites/giant-elk.webp',
    basePreviewPath: '/images/ice-age-companion/base/giant-elk.png',
    referencePath: '/images/ice-age-companion/reference/animation-bible.png',
    status: 'planned',
    sparkleAnchor: 'broad antler tips, muzzle, chest fluff, and hoof taps',
    emoticonCue: 'big dark eyes, shy smile, and peach blush pixels',
    anatomyLock: 'one head, four legs, one pair of broad palmate antlers, and no duplicate antlers',
  },
  glyptodont: {
    species: 'glyptodont',
    atlasPath: '/images/ice-age-companion/sprites/glyptodont.webp',
    referencePath: '/images/ice-age-companion/reference/animation-bible.png',
    status: 'planned',
    sparkleAnchor: 'shell plates, club tail tip, cheek plates, and little feet',
    emoticonCue: 'tiny bright eyes, bashful smile, and shell-side blush pixels',
    anatomyLock: 'one head, four squat legs, one domed shell, one clubbed tail, and no extra feet',
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
