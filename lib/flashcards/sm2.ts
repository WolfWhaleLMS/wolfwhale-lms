export interface SM2State {
  intervalDays: number
  interval?: number
  repetitions: number
  easeFactor: number
  nextReviewDate?: string
  nextReviewAt?: Date
}

export interface SM2Result extends SM2State {
  nextReviewAt: Date
}

export function calculateNextReview(quality: number, state: SM2State): SM2Result {
  const interval = state.intervalDays ?? state.interval ?? 0
  const { repetitions, easeFactor } = state
  let newInterval: number
  let newRepetitions: number
  let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (newEaseFactor < 1.3) newEaseFactor = 1.3

  if (quality < 3) {
    newInterval = 1
    newRepetitions = 0
  } else {
    if (repetitions === 0) newInterval = 1
    else if (repetitions === 1) newInterval = 6
    else newInterval = Math.round(interval * newEaseFactor)
    newRepetitions = repetitions + 1
  }

  const nextDate = new Date()
  nextDate.setDate(nextDate.getDate() + newInterval)

  return {
    intervalDays: newInterval,
    interval: newInterval,
    repetitions: newRepetitions,
    easeFactor: newEaseFactor,
    nextReviewDate: nextDate.toISOString(),
    nextReviewAt: nextDate,
  }
}
