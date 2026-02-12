import { describe, it, expect } from 'vitest'
import { getLetterGrade, GRADE_SCALE } from '@/lib/config/constants'

describe('getLetterGrade', () => {
  // --- Standard boundary values ---
  it('returns A+ for 100', () => {
    expect(getLetterGrade(100)).toBe('A+')
  })

  it('returns A+ for 97 (lower boundary)', () => {
    expect(getLetterGrade(97)).toBe('A+')
  })

  it('returns A for 96.99 (upper boundary)', () => {
    expect(getLetterGrade(96.99)).toBe('A')
  })

  it('returns A for 93 (lower boundary)', () => {
    expect(getLetterGrade(93)).toBe('A')
  })

  it('returns A- for 92.99 (upper boundary)', () => {
    expect(getLetterGrade(92.99)).toBe('A-')
  })

  it('returns A- for 90 (lower boundary)', () => {
    expect(getLetterGrade(90)).toBe('A-')
  })

  it('returns B+ for 89.99 (upper boundary)', () => {
    expect(getLetterGrade(89.99)).toBe('B+')
  })

  it('returns B+ for 87 (lower boundary)', () => {
    expect(getLetterGrade(87)).toBe('B+')
  })

  it('returns B for 86.99 (upper boundary)', () => {
    expect(getLetterGrade(86.99)).toBe('B')
  })

  it('returns B for 83 (lower boundary)', () => {
    expect(getLetterGrade(83)).toBe('B')
  })

  it('returns B- for 82.99 (upper boundary)', () => {
    expect(getLetterGrade(82.99)).toBe('B-')
  })

  it('returns B- for 80 (lower boundary)', () => {
    expect(getLetterGrade(80)).toBe('B-')
  })

  it('returns C+ for 79.99 (upper boundary)', () => {
    expect(getLetterGrade(79.99)).toBe('C+')
  })

  it('returns C+ for 77 (lower boundary)', () => {
    expect(getLetterGrade(77)).toBe('C+')
  })

  it('returns C for 76.99 (upper boundary)', () => {
    expect(getLetterGrade(76.99)).toBe('C')
  })

  it('returns C for 73 (lower boundary)', () => {
    expect(getLetterGrade(73)).toBe('C')
  })

  it('returns C- for 72.99 (upper boundary)', () => {
    expect(getLetterGrade(72.99)).toBe('C-')
  })

  it('returns C- for 70 (lower boundary)', () => {
    expect(getLetterGrade(70)).toBe('C-')
  })

  it('returns D+ for 69.99 (upper boundary)', () => {
    expect(getLetterGrade(69.99)).toBe('D+')
  })

  it('returns D+ for 67 (lower boundary)', () => {
    expect(getLetterGrade(67)).toBe('D+')
  })

  it('returns D for 66.99 (upper boundary)', () => {
    expect(getLetterGrade(66.99)).toBe('D')
  })

  it('returns D for 63 (lower boundary)', () => {
    expect(getLetterGrade(63)).toBe('D')
  })

  it('returns D- for 62.99 (upper boundary)', () => {
    expect(getLetterGrade(62.99)).toBe('D-')
  })

  it('returns D- for 60 (lower boundary)', () => {
    expect(getLetterGrade(60)).toBe('D-')
  })

  it('returns F for 59.99 (upper boundary)', () => {
    expect(getLetterGrade(59.99)).toBe('F')
  })

  it('returns F for 59', () => {
    expect(getLetterGrade(59)).toBe('F')
  })

  it('returns F for 0', () => {
    expect(getLetterGrade(0)).toBe('F')
  })

  // --- Edge cases ---
  it('returns A+ for values above 100', () => {
    expect(getLetterGrade(101)).toBe('A+')
    expect(getLetterGrade(150)).toBe('A+')
    expect(getLetterGrade(1000)).toBe('A+')
  })

  it('returns F for negative numbers', () => {
    expect(getLetterGrade(-1)).toBe('F')
    expect(getLetterGrade(-100)).toBe('F')
  })

  it('returns F for NaN', () => {
    expect(getLetterGrade(NaN)).toBe('F')
  })

  // --- GRADE_SCALE consistency check ---
  it('has 13 grade levels covering 0-100', () => {
    expect(GRADE_SCALE).toHaveLength(13)
  })

  it('every grade in the scale is reachable', () => {
    for (const grade of GRADE_SCALE) {
      // The midpoint of each range should map to the correct letter
      const midpoint = (grade.min + grade.max) / 2
      expect(getLetterGrade(midpoint)).toBe(grade.letter)
    }
  })
})
