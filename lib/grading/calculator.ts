// WolfWhale LMS - Grading Calculator Utilities

import { getLetterGrade } from '@/lib/config/constants'

export interface GradeEntry {
  assignmentId: string
  assignmentTitle: string
  category: string
  score: number
  maxScore: number
  weight: number
}

export interface CategoryWeight {
  category: string
  weight: number // 0-100, all categories should sum to 100
}

export interface CategoryResult {
  category: string
  weight: number
  earnedPoints: number
  possiblePoints: number
  percentage: number
  letterGrade: string
  weightedContribution: number
}

/**
 * Calculate a weighted average from an array of grades.
 * Each grade has a score, maxScore, and weight.
 * Returns a percentage (0-100).
 */
export function calculateWeightedAverage(
  grades: { score: number; maxScore: number; weight: number }[]
): number {
  if (grades.length === 0) return 0

  let totalWeight = 0
  let weightedSum = 0

  for (const grade of grades) {
    if (grade.maxScore <= 0) continue
    const percentage = (grade.score / grade.maxScore) * 100
    weightedSum += percentage * grade.weight
    totalWeight += grade.weight
  }

  if (totalWeight === 0) return 0
  return Math.round((weightedSum / totalWeight) * 100) / 100
}

/**
 * Calculate averages broken down by assignment category.
 * Each category has a weight that determines its contribution to the overall grade.
 * Returns per-category results plus an overall weighted percentage.
 */
export function calculateCategoryAverages(
  grades: GradeEntry[],
  categories: CategoryWeight[]
): CategoryResult[] {
  const results: CategoryResult[] = []

  for (const cat of categories) {
    const categoryGrades = grades.filter(
      (g) => g.category.toLowerCase() === cat.category.toLowerCase()
    )

    let earnedPoints = 0
    let possiblePoints = 0

    for (const g of categoryGrades) {
      earnedPoints += g.score
      possiblePoints += g.maxScore
    }

    const percentage =
      possiblePoints > 0
        ? Math.round((earnedPoints / possiblePoints) * 10000) / 100
        : 0

    const weightedContribution =
      possiblePoints > 0
        ? Math.round((earnedPoints / possiblePoints) * cat.weight * 100) / 100
        : 0

    results.push({
      category: cat.category,
      weight: cat.weight,
      earnedPoints,
      possiblePoints,
      percentage,
      letterGrade: possiblePoints > 0 ? getLetterGrade(percentage) : '--',
      weightedContribution,
    })
  }

  return results
}

/**
 * Drop the N lowest grades from a category before calculating.
 * Returns a new array with the lowest entries removed.
 */
export function dropLowestEntries(
  grades: GradeEntry[],
  dropCount: number
): GradeEntry[] {
  if (dropCount <= 0 || grades.length <= dropCount) return grades
  const sorted = [...grades].sort((a, b) => {
    const pctA = a.maxScore > 0 ? a.score / a.maxScore : 0
    const pctB = b.maxScore > 0 ? b.score / b.maxScore : 0
    return pctA - pctB
  })
  return sorted.slice(dropCount)
}

/**
 * Calculate grade statistics for a set of student percentages.
 */
export function calculateGradeStats(percentages: number[]): {
  mean: number
  median: number
  min: number
  max: number
  standardDeviation: number
  distribution: Record<string, number>
} {
  if (percentages.length === 0) {
    return { mean: 0, median: 0, min: 0, max: 0, standardDeviation: 0, distribution: {} }
  }

  const sorted = [...percentages].sort((a, b) => a - b)
  const n = sorted.length
  const mean = sorted.reduce((s, v) => s + v, 0) / n
  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)]

  const variance = sorted.reduce((s, v) => s + (v - mean) ** 2, 0) / n
  const standardDeviation = Math.sqrt(variance)

  const distribution: Record<string, number> = {}
  for (const pct of percentages) {
    const letter = getLetterGrade(pct)
    distribution[letter] = (distribution[letter] || 0) + 1
  }

  return {
    mean: Math.round(mean * 100) / 100,
    median: Math.round(median * 100) / 100,
    min: Math.round(sorted[0] * 100) / 100,
    max: Math.round(sorted[n - 1] * 100) / 100,
    standardDeviation: Math.round(standardDeviation * 100) / 100,
    distribution,
  }
}

/**
 * Calculate the overall course grade from category results.
 */
export function calculateOverallGrade(categoryResults: CategoryResult[]): {
  percentage: number
  letterGrade: string
} {
  const activeCats = categoryResults.filter((c) => c.possiblePoints > 0)
  if (activeCats.length === 0) return { percentage: 0, letterGrade: '--' }

  const totalWeightedContribution = activeCats.reduce(
    (sum, c) => sum + c.weightedContribution,
    0
  )
  const totalActiveWeight = activeCats.reduce((sum, c) => sum + c.weight, 0)

  // Normalize in case not all categories have grades yet
  const percentage =
    totalActiveWeight > 0
      ? Math.round((totalWeightedContribution / totalActiveWeight) * 10000) / 100
      : 0

  return {
    percentage,
    letterGrade: getLetterGrade(percentage),
  }
}
