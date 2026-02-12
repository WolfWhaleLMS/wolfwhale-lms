import { describe, it, expect, beforeEach } from 'vitest'
import { calculateNextReview, getDueCount, SM2State } from '@/lib/flashcards/sm2'

describe('SM-2 Spaced Repetition Algorithm', () => {
  const newCard: SM2State = {
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
  }

  // ──────────────────────────────────────────────────────
  // New card behavior
  // ──────────────────────────────────────────────────────
  describe('new card', () => {
    it('gets interval of 1 day on first successful review (quality 2 = Good)', () => {
      const result = calculateNextReview(2, newCard)
      expect(result.intervalDays).toBe(1)
      expect(result.repetitions).toBe(1)
    })

    it('gets interval of 1 day on Easy review (quality 3)', () => {
      const result = calculateNextReview(3, newCard)
      expect(result.intervalDays).toBe(1)
      expect(result.repetitions).toBe(1)
    })

    it('gets interval of 1 day on Again (quality 0) — reset', () => {
      const result = calculateNextReview(0, newCard)
      expect(result.intervalDays).toBe(1)
      expect(result.repetitions).toBe(0)
    })
  })

  // ──────────────────────────────────────────────────────
  // Second review (repetition 1)
  // ──────────────────────────────────────────────────────
  describe('second review', () => {
    it('sets interval to 3 days after second successful review', () => {
      // First successful review
      const afterFirst = calculateNextReview(3, newCard)
      // Second successful review
      const afterSecond = calculateNextReview(3, {
        easeFactor: afterFirst.easeFactor,
        intervalDays: afterFirst.intervalDays,
        repetitions: afterFirst.repetitions,
      })
      expect(afterSecond.intervalDays).toBe(3)
      expect(afterSecond.repetitions).toBe(2)
    })
  })

  // ──────────────────────────────────────────────────────
  // Easy rating increases interval
  // ──────────────────────────────────────────────────────
  describe('easy rating (quality 3)', () => {
    it('increases interval with ease factor after 2+ repetitions', () => {
      const state: SM2State = {
        easeFactor: 2.5,
        intervalDays: 3,
        repetitions: 2,
      }
      const result = calculateNextReview(3, state)
      // interval = round(3 * 2.5) = 8 (roughly, depends on ease factor update)
      expect(result.intervalDays).toBeGreaterThan(state.intervalDays)
      expect(result.repetitions).toBe(3)
    })

    it('maintains or increases ease factor on Easy', () => {
      const state: SM2State = {
        easeFactor: 2.5,
        intervalDays: 6,
        repetitions: 3,
      }
      const result = calculateNextReview(3, state)
      // quality 3 maps to q5=5, so EF change = 0.1 - 0*(...) = +0.1
      expect(result.easeFactor).toBeGreaterThanOrEqual(state.easeFactor)
    })
  })

  // ──────────────────────────────────────────────────────
  // Hard / Again rating resets
  // ──────────────────────────────────────────────────────
  describe('Again rating (quality 0)', () => {
    it('resets repetitions to 0', () => {
      const state: SM2State = {
        easeFactor: 2.5,
        intervalDays: 10,
        repetitions: 5,
      }
      const result = calculateNextReview(0, state)
      expect(result.repetitions).toBe(0)
      expect(result.intervalDays).toBe(1)
    })
  })

  describe('Hard rating (quality 1)', () => {
    it('resets repetitions to 0 (maps to q5=2 which is < 3)', () => {
      const state: SM2State = {
        easeFactor: 2.5,
        intervalDays: 10,
        repetitions: 5,
      }
      const result = calculateNextReview(1, state)
      expect(result.repetitions).toBe(0)
      expect(result.intervalDays).toBe(1)
    })
  })

  // ──────────────────────────────────────────────────────
  // Quality clamping
  // ──────────────────────────────────────────────────────
  describe('quality clamping', () => {
    it('clamps quality below 0 to 0', () => {
      const result = calculateNextReview(-5, newCard)
      // Should behave like quality 0 (Again)
      expect(result.repetitions).toBe(0)
      expect(result.intervalDays).toBe(1)
    })

    it('clamps quality above 3 to 3', () => {
      const result = calculateNextReview(10, newCard)
      // Should behave like quality 3 (Easy)
      expect(result.repetitions).toBe(1)
    })
  })

  // ──────────────────────────────────────────────────────
  // Ease factor bounds
  // ──────────────────────────────────────────────────────
  describe('ease factor', () => {
    it('never drops below 1.3', () => {
      // Simulate many "Good" reviews with low quality to push EF down
      let state: SM2State = { easeFactor: 1.3, intervalDays: 1, repetitions: 0 }
      for (let i = 0; i < 20; i++) {
        const result = calculateNextReview(2, state)
        state = {
          easeFactor: result.easeFactor,
          intervalDays: result.intervalDays,
          repetitions: result.repetitions,
        }
        expect(result.easeFactor).toBeGreaterThanOrEqual(1.3)
      }
    })
  })

  // ──────────────────────────────────────────────────────
  // Interval cap
  // ──────────────────────────────────────────────────────
  describe('interval cap', () => {
    it('caps interval at 365 days', () => {
      const state: SM2State = {
        easeFactor: 2.5,
        intervalDays: 300,
        repetitions: 20,
      }
      const result = calculateNextReview(3, state)
      expect(result.intervalDays).toBeLessThanOrEqual(365)
    })
  })

  // ──────────────────────────────────────────────────────
  // nextReviewAt date
  // ──────────────────────────────────────────────────────
  describe('nextReviewAt', () => {
    it('returns a Date object in the future', () => {
      const result = calculateNextReview(3, newCard)
      expect(result.nextReviewAt).toBeInstanceOf(Date)
      expect(result.nextReviewAt.getTime()).toBeGreaterThan(Date.now())
    })
  })
})

// ────────────────────────────────────────────────────────────────
// getDueCount
// ────────────────────────────────────────────────────────────────
describe('getDueCount', () => {
  it('counts cards with null next_review_at as due', () => {
    const records = [
      { next_review_at: null },
      { next_review_at: null },
    ]
    expect(getDueCount(records)).toBe(2)
  })

  it('counts cards with past dates as due', () => {
    const past = new Date(Date.now() - 86400000).toISOString()
    const records = [
      { next_review_at: past },
      { next_review_at: past },
    ]
    expect(getDueCount(records)).toBe(2)
  })

  it('does not count cards with future dates as due', () => {
    const future = new Date(Date.now() + 86400000).toISOString()
    const records = [
      { next_review_at: future },
    ]
    expect(getDueCount(records)).toBe(0)
  })

  it('returns 0 for empty array', () => {
    expect(getDueCount([])).toBe(0)
  })

  it('handles mixed due and not-due cards', () => {
    const past = new Date(Date.now() - 86400000).toISOString()
    const future = new Date(Date.now() + 86400000).toISOString()
    const records = [
      { next_review_at: null },
      { next_review_at: past },
      { next_review_at: future },
    ]
    expect(getDueCount(records)).toBe(2)
  })
})
