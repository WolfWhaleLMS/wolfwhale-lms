'use client'

import * as React from 'react'
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'

export type AgeVariant = 'k5' | '68' | '912'

interface AgeVariantContextValue {
  variant: AgeVariant
  setVariant: (variant: AgeVariant) => void
  gradeLevel: string | null
}

const AgeVariantContext = createContext<AgeVariantContextValue>({
  variant: '68',
  setVariant: () => {},
  gradeLevel: null,
})

export function useAgeVariant() {
  return useContext(AgeVariantContext)
}

/**
 * Determine age variant from grade level string.
 * K, 1-5 → k5
 * 6-8 → 68
 * 9-12, AP, IB, College → 912
 */
export function getAgeVariantFromGrade(gradeLevel: string | null | undefined): AgeVariant {
  if (!gradeLevel) return '68' // default

  const normalized = gradeLevel.toUpperCase().trim()

  if (normalized === 'K' || normalized === 'KINDERGARTEN') return 'k5'

  const num = parseInt(normalized, 10)
  if (!isNaN(num)) {
    if (num >= 1 && num <= 5) return 'k5'
    if (num >= 6 && num <= 8) return '68'
    if (num >= 9 && num <= 12) return '912'
  }

  if (['AP', 'IB', 'COLLEGE'].includes(normalized)) return '912'

  return '68'
}

interface AgeVariantProviderProps {
  children: React.ReactNode
  initialGradeLevel?: string | null
  initialVariant?: AgeVariant
}

export function AgeVariantProvider({
  children,
  initialGradeLevel,
  initialVariant,
}: AgeVariantProviderProps) {
  const [variant, setVariant] = useState<AgeVariant>(
    initialVariant || getAgeVariantFromGrade(initialGradeLevel)
  )
  const [gradeLevel, setGradeLevel] = useState<string | null>(initialGradeLevel || null)

  // Stable callback ref for setVariant
  const stableSetVariant = useCallback((v: AgeVariant) => {
    setVariant(v)
  }, [])

  // Apply age variant class to document body
  useEffect(() => {
    const body = document.body
    // Remove all age variant classes
    body.classList.remove('age-k5', 'age-68', 'age-912')
    // Add current variant
    body.classList.add(`age-${variant}`)

    return () => {
      body.classList.remove('age-k5', 'age-68', 'age-912')
    }
  }, [variant])

  // Update variant when grade level changes
  useEffect(() => {
    if (initialGradeLevel !== undefined) {
      setGradeLevel(initialGradeLevel || null)
      if (!initialVariant) {
        setVariant(getAgeVariantFromGrade(initialGradeLevel))
      }
    }
  }, [initialGradeLevel, initialVariant])

  // Memoize the context value to prevent unnecessary re-renders of all consumers
  const contextValue = useMemo(
    () => ({ variant, setVariant: stableSetVariant, gradeLevel }),
    [variant, stableSetVariant, gradeLevel]
  )

  return (
    <AgeVariantContext.Provider value={contextValue}>
      {children}
    </AgeVariantContext.Provider>
  )
}
