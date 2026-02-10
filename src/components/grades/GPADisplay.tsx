'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { MockClassGrade } from '@/lib/mock-data';

interface GPADisplayProps {
  classGrades: MockClassGrade[];
  variant?: 'compact' | 'full';
  className?: string;
}

const getGPAColor = (gpa: number) => {
  if (gpa >= 3.5) return 'text-green-600 dark:text-green-400';
  if (gpa >= 2.5) return 'text-blue-600 dark:text-blue-400';
  if (gpa >= 1.5) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

const getGPABgColor = (gpa: number) => {
  if (gpa >= 3.5) return 'from-green-500/10 to-emerald-500/10';
  if (gpa >= 2.5) return 'from-blue-500/10 to-indigo-500/10';
  if (gpa >= 1.5) return 'from-yellow-500/10 to-amber-500/10';
  return 'from-red-500/10 to-rose-500/10';
};

export default function GPADisplay({ classGrades, variant = 'full', className }: GPADisplayProps) {
  const totalGPAPoints = classGrades.reduce((sum, c) => sum + c.gpaPoints, 0);
  const gpa = classGrades.length > 0 ? totalGPAPoints / classGrades.length : 0;
  const overallAverage = classGrades.length > 0
    ? Math.round(classGrades.reduce((sum, c) => sum + c.currentGrade, 0) / classGrades.length)
    : 0;

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <span className={cn('text-3xl font-bold', getGPAColor(gpa))}>
          {gpa.toFixed(2)}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">GPA</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl bg-gradient-to-br p-6',
        getGPABgColor(gpa),
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Overall GPA
          </p>
          <p className={cn('text-5xl font-bold', getGPAColor(gpa))}>
            {gpa.toFixed(2)}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            out of 4.00
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Average
          </p>
          <p className="text-4xl font-bold text-slate-800 dark:text-slate-200">
            {overallAverage}%
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            across {classGrades.length} classes
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {classGrades.filter(c => c.currentGrade >= 90).length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">A&apos;s</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {classGrades.filter(c => c.currentGrade >= 80 && c.currentGrade < 90).length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">B&apos;s</p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {classGrades.filter(c => c.currentGrade >= 70 && c.currentGrade < 80).length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">C&apos;s</p>
          </div>
          <div>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">
              {classGrades.filter(c => c.currentGrade < 70).length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">D/F&apos;s</p>
          </div>
        </div>
      </div>
    </div>
  );
}
