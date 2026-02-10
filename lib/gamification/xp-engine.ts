import { XP_CONFIG } from '@/lib/config/constants'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type XPEventType = keyof typeof XP_CONFIG.events

export interface XPAwardResult {
  xpAwarded: number
  newTotalXp: number
  leveledUp: boolean
  newLevel: number
  newTier: string
  dailyCapReached: boolean
}

// ---------------------------------------------------------------------------
// Level calculation
// ---------------------------------------------------------------------------

/** Get level from total XP */
export function getLevelFromXP(totalXp: number): number {
  const levels = XP_CONFIG.levels
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXp >= levels[i]) return i
  }
  return 1
}

/** Get XP needed for next level */
export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= XP_CONFIG.levels.length - 1) return Infinity
  return XP_CONFIG.levels[currentLevel + 1]
}

/** Get XP progress within current level (0-1) */
export function getLevelProgress(totalXp: number): number {
  const level = getLevelFromXP(totalXp)
  const currentLevelXp = XP_CONFIG.levels[level] ?? 0
  const nextLevelXp = XP_CONFIG.levels[level + 1]
  if (!nextLevelXp) return 1
  const range = nextLevelXp - currentLevelXp
  if (range <= 0) return 1
  return Math.min(1, (totalXp - currentLevelXp) / range)
}

/** Get tier name for a level */
export function getTierForLevel(level: number): string {
  const { tiers } = XP_CONFIG
  if (level >= tiers.mastery.min) return tiers.mastery.name
  if (level >= tiers.advancement.min) return tiers.advancement.name
  if (level >= tiers.growth.min) return tiers.growth.name
  return tiers.awakening.name
}

/** Get the named title for a level (e.g. "Spark", "Wolfling") */
export function getLevelName(level: number): string {
  return XP_CONFIG.levelNames[level] ?? `Level ${level}`
}

// ---------------------------------------------------------------------------
// XP Award Logic
// ---------------------------------------------------------------------------

/** Calculate XP to award for an event, respecting daily caps */
export function calculateXPAward(
  eventType: XPEventType,
  dailyXpSoFar: number,
  ageVariant: 'k5' | '68' | '912' = '68'
): number {
  const baseXp = XP_CONFIG.events[eventType]
  if (!baseXp) return 0

  // Determine daily cap
  const dailyCap = ageVariant === 'k5'
    ? XP_CONFIG.dailyCap.k5
    : XP_CONFIG.dailyCap['6-12']

  const remaining = Math.max(0, dailyCap - dailyXpSoFar)
  return Math.min(baseXp, remaining)
}

/** Process an XP award — returns what would happen (pure calculation, no DB) */
export function processXPAward(
  eventType: XPEventType,
  currentTotalXp: number,
  dailyXpSoFar: number,
  ageVariant: 'k5' | '68' | '912' = '68'
): XPAwardResult {
  const xpAwarded = calculateXPAward(eventType, dailyXpSoFar, ageVariant)
  const newTotalXp = currentTotalXp + xpAwarded
  const oldLevel = getLevelFromXP(currentTotalXp)
  const newLevel = getLevelFromXP(newTotalXp)
  const dailyCap = ageVariant === 'k5'
    ? XP_CONFIG.dailyCap.k5
    : XP_CONFIG.dailyCap['6-12']

  return {
    xpAwarded,
    newTotalXp,
    leveledUp: newLevel > oldLevel,
    newLevel,
    newTier: getTierForLevel(newLevel),
    dailyCapReached: (dailyXpSoFar + xpAwarded) >= dailyCap,
  }
}

// ---------------------------------------------------------------------------
// XP Decay
// ---------------------------------------------------------------------------

/** Calculate XP after decay based on days inactive */
export function calculateDecay(totalXp: number, daysInactive: number): number {
  if (daysInactive < XP_CONFIG.decay.startAfterDays) return totalXp

  let decayRate = 0
  for (const rule of XP_CONFIG.decay.ratePerDay) {
    if (daysInactive >= rule.afterDays) {
      decayRate = rule.rate
    }
  }

  if (decayRate === 0) return totalXp

  const daysDecaying = daysInactive - XP_CONFIG.decay.startAfterDays
  const totalDecay = decayRate * daysDecaying
  const decayedXp = Math.max(0, Math.floor(totalXp * (1 - totalDecay)))
  return decayedXp
}
