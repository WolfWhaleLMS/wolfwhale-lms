'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LetterGradeBadgeProps {
  grade: number;
  letterGrade?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showEmoji?: boolean;
  className?: string;
}

const getLetterGrade = (grade: number): string => {
  if (grade >= 93) return 'A';
  if (grade >= 90) return 'A-';
  if (grade >= 87) return 'B+';
  if (grade >= 83) return 'B';
  if (grade >= 80) return 'B-';
  if (grade >= 77) return 'C+';
  if (grade >= 73) return 'C';
  if (grade >= 70) return 'C-';
  if (grade >= 67) return 'D+';
  if (grade >= 60) return 'D';
  return 'F';
};

const getGradeEmoji = (grade: number): string => {
  if (grade >= 90) return '\u2B50';
  if (grade >= 80) return '\uD83D\uDC4D';
  if (grade >= 70) return '\uD83D\uDCDA';
  if (grade >= 60) return '\u26A0\uFE0F';
  return '\uD83D\uDE22';
};

const getGradeColors = (grade: number) => {
  if (grade >= 90) return {
    bg: 'bg-gradient-to-br from-green-400 to-emerald-500',
    text: 'text-white',
    ring: 'ring-green-300',
    shadow: 'shadow-green-200',
  };
  if (grade >= 80) return {
    bg: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    text: 'text-white',
    ring: 'ring-blue-300',
    shadow: 'shadow-blue-200',
  };
  if (grade >= 70) return {
    bg: 'bg-gradient-to-br from-yellow-400 to-amber-500',
    text: 'text-white',
    ring: 'ring-yellow-300',
    shadow: 'shadow-yellow-200',
  };
  if (grade >= 60) return {
    bg: 'bg-gradient-to-br from-orange-400 to-red-500',
    text: 'text-white',
    ring: 'ring-orange-300',
    shadow: 'shadow-orange-200',
  };
  return {
    bg: 'bg-gradient-to-br from-red-500 to-rose-600',
    text: 'text-white',
    ring: 'ring-red-300',
    shadow: 'shadow-red-200',
  };
};

const sizeClasses = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-14 h-14 text-lg',
  lg: 'w-20 h-20 text-2xl',
  xl: 'w-28 h-28 text-4xl',
};

const emojiSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-xl',
  xl: 'text-3xl',
};

export default function LetterGradeBadge({
  grade,
  letterGrade,
  size = 'md',
  showEmoji = false,
  className,
}: LetterGradeBadgeProps) {
  const letter = letterGrade || getLetterGrade(grade);
  const colors = getGradeColors(grade);
  const emoji = getGradeEmoji(grade);

  return (
    <div
      className={cn(
        'rounded-2xl flex flex-col items-center justify-center font-bold ring-2 shadow-lg',
        colors.bg,
        colors.text,
        colors.ring,
        colors.shadow,
        sizeClasses[size],
        className
      )}
    >
      <span>{letter}</span>
      {showEmoji && (
        <span className={cn('leading-none', emojiSizeClasses[size])}>{emoji}</span>
      )}
    </div>
  );
}
