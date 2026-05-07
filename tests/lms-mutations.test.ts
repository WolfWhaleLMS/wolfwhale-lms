import { describe, expect, it } from 'vitest'
import {
  LmsMutationError,
  letterGradeForPercentage,
  normalizeGradeDraft,
  normalizeSubmissionDraft,
  percentageForPoints,
} from '@/lib/lms/mutations'

describe('LMS mutation validation', () => {
  it('normalizes student submission text before persistence', () => {
    expect(
      normalizeSubmissionDraft({
        assignmentId: 'assignment-1',
        content: '  My evidence-based response.  ',
      })
    ).toEqual({ assignmentId: 'assignment-1', content: 'My evidence-based response.' })
  })

  it('rejects empty submissions', () => {
    expect(() => normalizeSubmissionDraft({ assignmentId: 'assignment-1', content: '   ' })).toThrow(LmsMutationError)
  })

  it('normalizes teacher grade input and prevents impossible scores', () => {
    expect(
      normalizeGradeDraft({
        submissionId: 'submission-1',
        pointsEarned: '8.5',
        maxPoints: 10,
        feedback: '  Good claim, cite one more source. ',
      })
    ).toEqual({
      submissionId: 'submission-1',
      pointsEarned: 8.5,
      feedback: 'Good claim, cite one more source.',
    })

    expect(() =>
      normalizeGradeDraft({
        submissionId: 'submission-1',
        pointsEarned: '12',
        maxPoints: 10,
        feedback: 'Too high.',
      })
    ).toThrow(LmsMutationError)
  })

  it('calculates percentages and school letter grade bands', () => {
    expect(percentageForPoints(9, 10)).toBe(90)
    expect(letterGradeForPercentage(97)).toBe('A+')
    expect(letterGradeForPercentage(82)).toBe('B-')
    expect(letterGradeForPercentage(59)).toBe('F')
  })
})
