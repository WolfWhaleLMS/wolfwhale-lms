'use client';

import { useState, useEffect, useMemo } from 'react';
import type { GradeLevel } from '@/types/database.types';
import { createBrowserClient } from '@supabase/ssr';

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
  /** The student's first name from their profile */
  firstName: string;
}

/**
 * Determines the student's grade level from their course enrollments
 * and returns the appropriate dashboard variant ('k5' or '612').
 *
 * Fetches the student's enrolled courses and uses the grade_level from
 * the first enrolled course. Falls back to '612' if no grade level found.
 */
export function useGradeLevel(): UseGradeLevelReturn {
  const [loading, setLoading] = useState(true);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel | null>(null);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    async function fetchGradeLevel() {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Get profile first name
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .single();

        if (profile?.first_name) {
          setFirstName(profile.first_name);
        }

        // Get grade level from the student's enrolled courses
        const { data: enrollments } = await supabase
          .from('course_enrollments')
          .select(`
            courses (
              grade_level
            )
          `)
          .eq('student_id', user.id)
          .eq('status', 'active')
          .limit(1);

        if (enrollments && enrollments.length > 0) {
          const course = (enrollments[0] as any).courses;
          const level = course?.grade_level as string;
          if (level) {
            // The grade_level in the DB can be 'K-2', '3', '4', '5', etc.
            // Extract the first number or 'K'
            const match = level.match(/^(K|\d+)/i);
            if (match) {
              const gl = match[1].toUpperCase() === 'K' ? 'K' : match[1];
              if ([...K5_GRADES, ...GRADES_6_12].includes(gl as GradeLevel)) {
                setGradeLevel(gl as GradeLevel);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching grade level:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGradeLevel();
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
    firstName,
  };
}
