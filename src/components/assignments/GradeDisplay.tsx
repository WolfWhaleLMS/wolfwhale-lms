'use client';

import { Star, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MockAssignmentGrade } from '@/lib/mock-data';

interface GradeDisplayProps {
  grade: MockAssignmentGrade;
  maxPoints: number;
  variant?: 'compact' | 'full';
  className?: string;
}

function getGradeColor(percentage: number): string {
  if (percentage >= 90) return 'text-emerald-600 dark:text-emerald-400';
  if (percentage >= 80) return 'text-blue-600 dark:text-blue-400';
  if (percentage >= 70) return 'text-amber-600 dark:text-amber-400';
  if (percentage >= 60) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

function getGradeBg(percentage: number): string {
  if (percentage >= 90) return 'from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30';
  if (percentage >= 80) return 'from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/30';
  if (percentage >= 70) return 'from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/30';
  if (percentage >= 60) return 'from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/30';
  return 'from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/30';
}

export function GradeDisplay({ grade, maxPoints, variant = 'compact', className }: GradeDisplayProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-1.5', className)}>
        <Star className={cn('h-4 w-4 fill-current', getGradeColor(grade.percentage))} />
        <span className={cn('text-sm font-bold', getGradeColor(grade.percentage))}>
          {grade.pointsEarned}/{maxPoints}
        </span>
        <span className={cn('text-xs font-semibold', getGradeColor(grade.percentage))}>
          ({grade.letterGrade})
        </span>
      </div>
    );
  }

  // full variant
  return (
    <div className={cn('rounded-2xl border border-white/30 dark:border-slate-700/30 overflow-hidden', className)}>
      <div className={cn('bg-gradient-to-br p-6', getGradeBg(grade.percentage))}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Your Grade
          </h4>
          <Star className={cn('h-6 w-6 fill-current', getGradeColor(grade.percentage))} />
        </div>

        <div className="flex items-baseline gap-3 mb-2">
          <span className={cn('text-5xl font-bold tracking-tight', getGradeColor(grade.percentage))}>
            {grade.letterGrade}
          </span>
          <span className={cn('text-2xl font-semibold', getGradeColor(grade.percentage))}>
            {grade.percentage}%
          </span>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400">
          {grade.pointsEarned} out of {maxPoints} points
        </p>
      </div>

      {grade.feedback && (
        <div className="p-6 bg-white/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-slate-500" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Teacher Feedback
            </h4>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {grade.feedback}
          </p>
        </div>
      )}
    </div>
  );
}
