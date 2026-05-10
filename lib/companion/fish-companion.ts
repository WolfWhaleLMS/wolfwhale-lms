export const COMPANION_STORAGE_KEY = 'wolfwhale.fish-companion.v1'

export const STARTER_SPECIES = [
  { id: 'clownfish', label: 'Clownfish', accent: '#f97316' },
  { id: 'pufferfish', label: 'Pufferfish', accent: '#facc15' },
] as const

export type CompanionSpecies = (typeof STARTER_SPECIES)[number]['id']
export type CompanionHatchStage = 'egg' | 'crack-stage-1' | 'crack-stage-2' | 'almost-hatching' | 'hatched'
export type CompanionMood = 'idle' | 'celebrating' | 'sleepy' | 'studying' | 'egg' | 'hatching'
export type CompanionBehaviorMode = 'stationary' | 'follow-pointer'

export type CompanionXpSource =
  | 'lesson_completed'
  | 'assignment_submitted'
  | 'quiz_completed'
  | 'study_streak'
  | 'course_task_checked'
  | 'world_activity'

export interface CompanionXpEvent {
  amount: number
  source: CompanionXpSource
  label: string
  occurredAt: string
}

export interface CompanionWorldReward {
  activityId: CompanionWorldActivityId
  label: string
  xp: number
  earnedAt: string
}

export interface CompanionCosmetics {
  accessory?: string
  accent?: string
  habitat?: string
}

export interface StudentCompanionProfile {
  id: string
  species: CompanionSpecies
  petName: string
  hatchStage: CompanionHatchStage
  xp: number
  level: number
  mood: CompanionMood
  behaviorMode: CompanionBehaviorMode
  unlockedCosmetics: string[]
  selectedCosmetics: CompanionCosmetics
  worldRewards: CompanionWorldReward[]
  recentXpEvents: CompanionXpEvent[]
  createdAt: string
  updatedAt: string
}

export interface StarterCompanionInput {
  species: CompanionSpecies
  petName: string
  now?: string
}

export interface CompanionXpInput {
  amount: number
  source: CompanionXpSource
  label: string
  occurredAt?: string
}

export const HATCH_THRESHOLDS = [
  { stage: 'egg', minXp: 0 },
  { stage: 'crack-stage-1', minXp: 25 },
  { stage: 'crack-stage-2', minXp: 50 },
  { stage: 'almost-hatching', minXp: 75 },
  { stage: 'hatched', minXp: 100 },
] as const satisfies ReadonlyArray<{ stage: CompanionHatchStage; minXp: number }>

export const XP_EVENT_AMOUNTS = {
  lesson_completed: 25,
  assignment_submitted: 35,
  quiz_completed: 30,
  study_streak: 15,
  course_task_checked: 10,
  world_activity: 20,
} as const satisfies Record<CompanionXpSource, number>

export const WORLD_ACTIVITIES = {
  'reef-library-notes': {
    label: 'Reef Library notes',
    xp: 20,
    source: 'world_activity',
  },
  'tidepool-quiz-practice': {
    label: 'Tidepool quiz practice',
    xp: 30,
    source: 'quiz_completed',
  },
  'kelp-commons-check-in': {
    label: 'Kelp Commons check-in',
    xp: 10,
    source: 'course_task_checked',
  },
} as const

export type CompanionWorldActivityId = keyof typeof WORLD_ACTIVITIES

const COSMETIC_UNLOCKS = [
  { id: 'starter-reef', minLevel: 1 },
  { id: 'kelp-satchel', minLevel: 2 },
  { id: 'coral-scarf', minLevel: 3 },
  { id: 'bubble-glow', minLevel: 4 },
  { id: 'reef-library-habitat', minLevel: 5 },
] as const

function nowIso() {
  return new Date().toISOString()
}

function clampXpAmount(value: number) {
  if (!Number.isFinite(value)) return 0

  return Math.max(0, Math.round(value))
}

function normalizeName(value: string) {
  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed.slice(0, 32) : 'Bubbles'
}

function createId(input: { species: CompanionSpecies; petName: string; now: string }) {
  return `${input.species}-${normalizeName(input.petName).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${input.now}`
}

export function getHatchStageForXp(xp: number): CompanionHatchStage {
  const safeXp = clampXpAmount(xp)
  let stage: CompanionHatchStage = 'egg'

  for (const threshold of HATCH_THRESHOLDS) {
    if (safeXp >= threshold.minXp) {
      stage = threshold.stage
    }
  }

  return stage
}

export function getLevelForXp(xp: number) {
  const safeXp = clampXpAmount(xp)
  if (safeXp < 200) return 1

  return Math.floor(safeXp / 100)
}

export function moodForProfile(input: { hatchStage: CompanionHatchStage; source?: CompanionXpSource; xpAdded?: number }): CompanionMood {
  if (input.hatchStage === 'egg') return 'egg'
  if (input.hatchStage !== 'hatched') return 'hatching'
  if (!input.source || !input.xpAdded) return 'idle'
  if (input.source === 'lesson_completed' || input.source === 'course_task_checked') return 'studying'

  return 'celebrating'
}

export function cosmeticsForLevel(level: number) {
  return COSMETIC_UNLOCKS.filter((cosmetic) => level >= cosmetic.minLevel).map((cosmetic) => cosmetic.id)
}

export function createStarterCompanion(input: StarterCompanionInput): StudentCompanionProfile {
  const createdAt = input.now ?? nowIso()
  const species = STARTER_SPECIES.some((candidate) => candidate.id === input.species) ? input.species : 'clownfish'

  return {
    id: createId({ species, petName: input.petName, now: createdAt }),
    species,
    petName: normalizeName(input.petName),
    hatchStage: 'egg',
    xp: 0,
    level: 1,
    mood: 'egg',
    behaviorMode: 'stationary',
    unlockedCosmetics: ['starter-reef'],
    selectedCosmetics: {
      habitat: 'starter-reef',
    },
    worldRewards: [],
    recentXpEvents: [],
    createdAt,
    updatedAt: createdAt,
  }
}

export function awardCompanionXp(profile: StudentCompanionProfile, input: CompanionXpInput): StudentCompanionProfile {
  const amount = clampXpAmount(input.amount)
  if (amount <= 0) return profile

  const occurredAt = input.occurredAt ?? nowIso()
  const xp = profile.xp + amount
  const hatchStage = getHatchStageForXp(xp)
  const level = getLevelForXp(xp)
  const unlockedCosmetics = Array.from(new Set([...profile.unlockedCosmetics, ...cosmeticsForLevel(level)]))

  return {
    ...profile,
    xp,
    hatchStage,
    level,
    mood: moodForProfile({ hatchStage, source: input.source, xpAdded: amount }),
    unlockedCosmetics,
    selectedCosmetics: {
      ...profile.selectedCosmetics,
      habitat: profile.selectedCosmetics.habitat ?? 'starter-reef',
    },
    recentXpEvents: [
      {
        amount,
        source: input.source,
        label: input.label,
        occurredAt,
      },
      ...profile.recentXpEvents,
    ].slice(0, 5),
    updatedAt: occurredAt,
  }
}

export function completeWorldActivity(
  profile: StudentCompanionProfile,
  activityId: CompanionWorldActivityId,
  occurredAt = nowIso()
): StudentCompanionProfile {
  if (profile.worldRewards.some((reward) => reward.activityId === activityId)) {
    return profile
  }

  const activity = WORLD_ACTIVITIES[activityId]
  const updated = awardCompanionXp(profile, {
    amount: activity.xp,
    source: activity.source,
    label: activity.label,
    occurredAt,
  })

  return {
    ...updated,
    worldRewards: [
      {
        activityId,
        label: activity.label,
        xp: activity.xp,
        earnedAt: occurredAt,
      },
      ...profile.worldRewards,
    ],
  }
}

export function setCompanionBehaviorMode(
  profile: StudentCompanionProfile,
  behaviorMode: CompanionBehaviorMode,
  updatedAt = nowIso()
): StudentCompanionProfile {
  return {
    ...profile,
    behaviorMode,
    updatedAt,
  }
}

export function selectCompanionCosmetic(
  profile: StudentCompanionProfile,
  slot: keyof CompanionCosmetics,
  cosmeticId: string | undefined,
  updatedAt = nowIso()
): StudentCompanionProfile {
  if (cosmeticId && !profile.unlockedCosmetics.includes(cosmeticId)) return profile

  return {
    ...profile,
    selectedCosmetics: {
      ...profile.selectedCosmetics,
      [slot]: cosmeticId,
    },
    updatedAt,
  }
}

export function parseCompanionProfile(value: string | null): StudentCompanionProfile | null {
  if (!value) return null

  try {
    const parsed = JSON.parse(value) as Partial<StudentCompanionProfile>
    if (!parsed || typeof parsed !== 'object') return null
    const species = parsed.species
    if (!species || !STARTER_SPECIES.some((candidate) => candidate.id === species)) return null
    if (typeof parsed.petName !== 'string') return null

    const xp = clampXpAmount(parsed.xp ?? 0)
    const hatchStage = getHatchStageForXp(xp)
    const level = getLevelForXp(xp)

    return {
      id: typeof parsed.id === 'string' ? parsed.id : createId({ species, petName: parsed.petName, now: nowIso() }),
      species,
      petName: normalizeName(parsed.petName),
      hatchStage,
      xp,
      level,
      mood: parsed.mood === 'sleepy' || parsed.mood === 'studying' || parsed.mood === 'celebrating' ? parsed.mood : moodForProfile({ hatchStage }),
      behaviorMode: parsed.behaviorMode === 'follow-pointer' ? 'follow-pointer' : 'stationary',
      unlockedCosmetics: Array.from(
        new Set([
          'starter-reef',
          ...(Array.isArray(parsed.unlockedCosmetics) ? parsed.unlockedCosmetics.filter((item): item is string => typeof item === 'string') : []),
          ...cosmeticsForLevel(level),
        ])
      ),
      selectedCosmetics: parsed.selectedCosmetics && typeof parsed.selectedCosmetics === 'object' ? parsed.selectedCosmetics : { habitat: 'starter-reef' },
      worldRewards: Array.isArray(parsed.worldRewards)
        ? parsed.worldRewards.filter((reward): reward is CompanionWorldReward => Boolean(reward && typeof reward.activityId === 'string' && typeof reward.label === 'string'))
        : [],
      recentXpEvents: Array.isArray(parsed.recentXpEvents)
        ? parsed.recentXpEvents.filter((event): event is CompanionXpEvent => Boolean(event && typeof event.amount === 'number' && typeof event.label === 'string')).slice(0, 5)
        : [],
      createdAt: typeof parsed.createdAt === 'string' ? parsed.createdAt : nowIso(),
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : nowIso(),
    }
  } catch {
    return null
  }
}

export function loadCompanionProfile(storage?: Pick<Storage, 'getItem'>) {
  const targetStorage = storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined)
  if (!targetStorage || typeof targetStorage.getItem !== 'function') return null

  return parseCompanionProfile(targetStorage.getItem(COMPANION_STORAGE_KEY))
}

export function saveCompanionProfile(profile: StudentCompanionProfile, storage?: Pick<Storage, 'setItem'>) {
  const targetStorage = storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined)
  if (!targetStorage || typeof targetStorage.setItem !== 'function') return

  targetStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(profile))
}
