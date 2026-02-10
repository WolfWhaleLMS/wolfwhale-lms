/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Quality ratings:
 * 0 = Again (complete blackout)
 * 1 = Hard (incorrect, but remembered after seeing answer)
 * 2 = Good (correct with some hesitation)
 * 3 = Easy (perfect response, no hesitation)
 */

export interface SM2State {
  easeFactor: number
  intervalDays: number
  repetitions: number
}

export interface SM2Result extends SM2State {
  nextReviewAt: Date
}

export function calculateNextReview(
  quality: number, // 0-3
  current: SM2State
): SM2Result {
  // Clamp quality
  const q = Math.max(0, Math.min(3, quality))

  // Map 0-3 scale to SM-2's 0-5 scale
  const q5 = q === 0 ? 0 : q === 1 ? 2 : q === 2 ? 4 : 5

  let { easeFactor, intervalDays, repetitions } = current

  if (q5 < 3) {
    // Failed: reset repetitions, short interval
    repetitions = 0
    intervalDays = 1
  } else {
    // Success: increase interval
    if (repetitions === 0) {
      intervalDays = 1
    } else if (repetitions === 1) {
      intervalDays = 3
    } else {
      intervalDays = Math.round(intervalDays * easeFactor)
    }
    repetitions += 1
  }

  // Update ease factor (minimum 1.3)
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - q5) * (0.08 + (5 - q5) * 0.02))
  )

  // Cap max interval at 365 days
  intervalDays = Math.min(intervalDays, 365)

  const nextReviewAt = new Date()
  nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays)

  return {
    easeFactor: Math.round(easeFactor * 100) / 100,
    intervalDays,
    repetitions,
    nextReviewAt,
  }
}

/**
 * Get number of cards due for review in a deck.
 */
export function getDueCount(
  progressRecords: { next_review_at: string | null }[]
): number {
  const now = new Date()
  return progressRecords.filter(
    (p) => !p.next_review_at || new Date(p.next_review_at) <= now
  ).length
}
