'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';
import { ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import LetterGradeBadge from './LetterGradeBadge';
import GradeTrend from './GradeTrend';
import GradeDetail from './GradeDetail';
import type { MockClassGrade } from '@/lib/mock-data';

interface GradeOverviewProps {
  classGrade: MockClassGrade;
  isExpanded: boolean;
  onToggle: () => void;
  isK5?: boolean;
}

const getTrendInfo = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return {
        icon: TrendingUp,
        label: 'Improving',
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-50 dark:bg-green-900/20',
        arrow: '\u2191',
      };
    case 'down':
      return {
        icon: TrendingDown,
        label: 'Declining',
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-900/20',
        arrow: '\u2193',
      };
    case 'stable':
      return {
        icon: Minus,
        label: 'Stable',
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        arrow: '\u2192',
      };
  }
};

export default function GradeOverview({
  classGrade,
  isExpanded,
  onToggle,
  isK5 = false,
}: GradeOverviewProps) {
  const trendInfo = getTrendInfo(classGrade.trend);
  const TrendIcon = trendInfo.icon;

  if (isK5) {
    return (
      <Card
        className={cn(
          'overflow-hidden transition-all duration-300 hover:shadow-lg',
          'border-l-4'
        )}
        style={{ borderLeftColor: classGrade.color }}
      >
        <button
          onClick={onToggle}
          className="w-full text-left p-6"
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">{classGrade.iconEmoji}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {classGrade.className}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {classGrade.teacher}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LetterGradeBadge
                grade={classGrade.currentGrade}
                letterGrade={classGrade.letterGrade}
                size="lg"
                showEmoji
              />
              <div className={cn('flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold', trendInfo.bg, trendInfo.color)}>
                <TrendIcon className="w-4 h-4" />
                <span>{trendInfo.arrow}</span>
              </div>
            </div>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-slate-400 transition-transform duration-200',
                isExpanded && 'rotate-180'
              )}
            />
          </div>
        </button>

        {isExpanded && (
          <CardContent className="border-t border-slate-200 dark:border-slate-700 p-6">
            <div className="mb-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                {classGrade.assignmentsDone} of {classGrade.assignmentsTotal} assignments graded
              </p>
              <Progress
                value={(classGrade.assignmentsDone / classGrade.assignmentsTotal) * 100}
                className="h-2"
              />
            </div>
            <GradeDetail assignments={classGrade.assignments} color={classGrade.color} isK5 />
          </CardContent>
        )}
      </Card>
    );
  }

  // 6-12 variant
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <button
        onClick={onToggle}
        className="w-full text-left p-5"
      >
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Class Name */}
          <div className="col-span-4 flex items-center gap-3">
            <div
              className="w-3 h-8 rounded-full flex-shrink-0"
              style={{ backgroundColor: classGrade.color }}
            />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {classGrade.className}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {classGrade.teacher}
              </p>
            </div>
          </div>

          {/* Grade % */}
          <div className="col-span-2 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {classGrade.currentGrade}%
            </p>
          </div>

          {/* Letter Grade */}
          <div className="col-span-1 flex justify-center">
            <LetterGradeBadge grade={classGrade.currentGrade} letterGrade={classGrade.letterGrade} size="sm" />
          </div>

          {/* Trend */}
          <div className="col-span-1 flex justify-center">
            <div className={cn('flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold', trendInfo.bg, trendInfo.color)}>
              <TrendIcon className="w-3 h-3" />
            </div>
          </div>

          {/* Mini Chart */}
          <div className="col-span-2">
            <GradeTrend data={classGrade.trendHistory} color={classGrade.color} height={40} />
          </div>

          {/* GPA */}
          <div className="col-span-1 text-center">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {classGrade.gpaPoints.toFixed(1)}
            </p>
            <p className="text-xs text-slate-400">GPA</p>
          </div>

          {/* Expand */}
          <div className="col-span-1 flex justify-end">
            <ChevronDown
              className={cn(
                'w-5 h-5 text-slate-400 transition-transform duration-200',
                isExpanded && 'rotate-180'
              )}
            />
          </div>
        </div>
      </button>

      {isExpanded && (
        <CardContent className="border-t border-slate-200 dark:border-slate-700 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Grade Trend</p>
                </div>
                <Badge className={cn('text-xs', trendInfo.bg, trendInfo.color)}>
                  {trendInfo.label}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {classGrade.assignmentsDone}/{classGrade.assignmentsTotal} assignments graded
              </p>
            </div>
            <GradeTrend data={classGrade.trendHistory} color={classGrade.color} height={120} showAxis />
          </div>
          <GradeDetail assignments={classGrade.assignments} color={classGrade.color} />
        </CardContent>
      )}
    </Card>
  );
}
