'use client';

import { useState, useEffect, useMemo } from 'react';
import type { GradeLevel } from '@/types/database.types';
import { mockStudentProfile } from '@/lib/mock-data';

export type DashboardVariant = 'k5' | '612';

const K5_GRADES: GradeLevel[] = ['K', '1', '2', '3', '4', '5'];
const GRADES_6_12: GradeLevel[] = ['6', '7', '8', '9', '10', '11', '12'];

interface UseGradeLevelReturn {
  /** The student's grade level (e.g., 'K', '4', '9') */
  gradeLevel: GradeLevel | null;
  /** The dashboard variant to render: 'k5' for elementary, '612' for secondary */
  variant: DashboardVariant;
  /** Whether the grade level is still loading */
  loading: boolean;
  /** Whether the student is in elementary school (K-5) */
  isElementary: boolean;
  /** Whether the student is in secondary school (6-12) */
  isSecondary: boolean;
  /** Human-readable grade label (e.g., "4th Grade") */
  gradeLabel: string;
}

/**
 * Determines the student's grade level and returns the appropriate
 * dashboard variant ('k5' or '612').
 *
 * Currently uses mock data. Will be replaced with a Supabase query
 * that reads from the user_profiles table or tenant_membership.
 *
 * Falls back to '612' if grade level is unknown.
 */
export function useGradeLevel(): UseGradeLevelReturn {
  const [loading, setLoading] = useState(true);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel | null>(null);

  useEffect(() => {
    // Simulate fetching grade level from profile/tenant_membership
    // In production this would use useUser() hook or a Supabase query
    const timer = setTimeout(() => {
      setGradeLevel(mockStudentProfile.gradeLevel);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const variant: DashboardVariant = useMemo(() => {
    if (!gradeLevel) return '612'; // fallback
    return K5_GRADES.includes(gradeLevel) ? 'k5' : '612';
  }, [gradeLevel]);

  const isElementary = variant === 'k5';
  const isSecondary = variant === '612';

  const gradeLabel = useMemo(() => {
    if (!gradeLevel) return 'Unknown';
    if (gradeLevel === 'K') return 'Kindergarten';
    const num = parseInt(gradeLevel, 10);
    const suffix = num === 1 ? 'st' : num === 2 ? 'nd' : num === 3 ? 'rd' : 'th';
    return `${num}${suffix} Grade`;
  }, [gradeLevel]);

  return {
    gradeLevel,
    variant,
    loading,
    isElementary,
    isSecondary,
    gradeLabel,
  };
}
