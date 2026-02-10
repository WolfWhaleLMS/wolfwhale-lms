'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, ArrowRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { MockGrade } from '@/lib/mock-data';

interface RecentGradesProps {
  grades: MockGrade[];
}

function getGradeColor(percentage: number) {
  if (percentage >= 90) return 'text-green-600 dark:text-green-400';
  if (percentage >= 80) return 'text-blue-600 dark:text-blue-400';
  if (percentage >= 70) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function getGradeBg(percentage: number) {
  if (percentage >= 90) return 'bg-green-50 dark:bg-green-950/30';
  if (percentage >= 80) return 'bg-blue-50 dark:bg-blue-950/30';
  if (percentage >= 70) return 'bg-amber-50 dark:bg-amber-950/30';
  return 'bg-red-50 dark:bg-red-950/30';
}

function getLetterGrade(percentage: number) {
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 60) return 'D';
  return 'F';
}

export function RecentGrades({ grades }: RecentGradesProps) {
  const averageGrade = grades.length > 0
    ? Math.round(grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length)
    : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-green-600" />
            Recent Grades
          </CardTitle>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className={cn('text-sm font-bold', getGradeColor(averageGrade))}>
              {averageGrade}% avg
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 gap-3 px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 mb-1">
          <div className="col-span-5">Assignment</div>
          <div className="col-span-3">Class</div>
          <div className="col-span-2 text-center">Grade</div>
          <div className="col-span-2 text-right">Date</div>
        </div>

        {/* Grade Rows */}
        <div className="space-y-1">
          {grades.map((grade, index) => (
            <motion.div
              key={grade.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="grid grid-cols-12 gap-3 items-center px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                {/* Assignment */}
                <div className="col-span-12 sm:col-span-5 flex items-center gap-2.5">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: grade.courseColor }}
                  />
                  <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {grade.assignmentTitle}
                  </span>
                </div>

                {/* Class */}
                <div className="col-span-4 sm:col-span-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400 truncate block">
                    {grade.courseName}
                  </span>
                </div>

                {/* Grade */}
                <div className="col-span-4 sm:col-span-2 text-center">
                  <span className={cn(
                    'inline-flex items-center justify-center w-14 py-0.5 rounded-lg text-sm font-bold',
                    getGradeBg(grade.percentage),
                    getGradeColor(grade.percentage)
                  )}>
                    {grade.percentage}%
                  </span>
                </div>

                {/* Date */}
                <div className="col-span-4 sm:col-span-2 text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {grade.gradedDateLabel}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-3 text-sm">
          View All Grades <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
