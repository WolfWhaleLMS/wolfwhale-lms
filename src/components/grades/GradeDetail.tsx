'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';
import type { MockClassGradeAssignment } from '@/lib/mock-data';

interface GradeDetailProps {
  assignments: MockClassGradeAssignment[];
  color?: string;
  isK5?: boolean;
}

const getScoreColor = (percentage: number) => {
  if (percentage >= 90) return 'bg-green-500/20 text-green-700 dark:text-green-300';
  if (percentage >= 80) return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
  if (percentage >= 70) return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
  return 'bg-red-500/20 text-red-700 dark:text-red-300';
};

const getTypeEmoji = (type: string) => {
  switch (type) {
    case 'homework': return '\uD83D\uDCDD';
    case 'quiz': return '\u2753';
    case 'project': return '\uD83C\uDFD7\uFE0F';
    case 'exam': return '\uD83D\uDCDD';
    case 'lab': return '\uD83E\uDDEA';
    case 'essay': return '\u270D\uFE0F';
    case 'discussion': return '\uD83D\uDCAC';
    default: return '\uD83D\uDCCB';
  }
};

export default function GradeDetail({ assignments, color, isK5 = false }: GradeDetailProps) {
  const sortedAssignments = [...assignments].sort(
    (a, b) => new Date(b.gradedDate).getTime() - new Date(a.gradedDate).getTime()
  );

  if (isK5) {
    return (
      <div className="space-y-3">
        {sortedAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getTypeEmoji(assignment.type)}</span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {assignment.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {assignment.weight} - {new Date(assignment.gradedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={cn('text-xl font-bold rounded-lg px-3 py-1', getScoreColor(assignment.percentage))}>
                  {assignment.score}/{assignment.totalPoints}
                </div>
              </div>
            </div>
            {assignment.feedback && (
              <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm">
                <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-blue-700 dark:text-blue-300">{assignment.feedback}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header Row */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        <div className="col-span-5">Assignment</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-1 text-center">Score</div>
        <div className="col-span-2 text-right">Grade</div>
      </div>

      {sortedAssignments.map((assignment) => (
        <div
          key={assignment.id}
          className="grid grid-cols-12 gap-2 items-center p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow"
        >
          <div className="col-span-5">
            <p className="font-medium text-slate-900 dark:text-white text-sm">
              {assignment.name}
            </p>
            {assignment.feedback && (
              <div className="flex items-center gap-1 mt-1">
                <MessageSquare className="w-3 h-3 text-blue-500" />
                <p className="text-xs text-blue-600 dark:text-blue-400 truncate">
                  {assignment.feedback}
                </p>
              </div>
            )}
          </div>
          <div className="col-span-2">
            <Badge className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-none">
              {assignment.weight}
            </Badge>
          </div>
          <div className="col-span-2 text-sm text-slate-500 dark:text-slate-400">
            {new Date(assignment.gradedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
          <div className="col-span-1 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
            {assignment.score}/{assignment.totalPoints}
          </div>
          <div className="col-span-2 text-right">
            <Badge className={cn('text-sm font-bold', getScoreColor(assignment.percentage))}>
              {assignment.percentage}%
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
