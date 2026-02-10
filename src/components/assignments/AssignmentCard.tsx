'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Star, ArrowRight } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from './StatusBadge';
import { GradeDisplay } from './GradeDisplay';
import type { MockAssignment } from '@/lib/mock-data';

interface AssignmentCardProps {
  assignment: MockAssignment;
  index?: number;
}

const CARD_BORDERS: Record<string, string> = {
  not_started: 'border-l-emerald-500',
  in_progress: 'border-l-blue-500',
  due_soon: 'border-l-orange-500',
  overdue: 'border-l-red-500',
  submitted: 'border-l-purple-500',
  graded: 'border-l-amber-500',
};

const CARD_GLOWS: Record<string, string> = {
  not_started: 'hover:shadow-emerald-200/40 dark:hover:shadow-emerald-900/20',
  in_progress: 'hover:shadow-blue-200/40 dark:hover:shadow-blue-900/20',
  due_soon: 'hover:shadow-orange-200/40 dark:hover:shadow-orange-900/20',
  overdue: 'hover:shadow-red-200/40 dark:hover:shadow-red-900/20',
  submitted: 'hover:shadow-purple-200/40 dark:hover:shadow-purple-900/20',
  graded: 'hover:shadow-amber-200/40 dark:hover:shadow-amber-900/20',
};

const TYPE_EMOJI: Record<string, string> = {
  homework: '\uD83D\uDCDD',
  quiz: '\uD83D\uDCCB',
  project: '\uD83C\uDFA8',
  exam: '\uD83D\uDCDA',
  discussion: '\uD83D\uDCAC',
};

export function AssignmentCard({ assignment, index = 0 }: AssignmentCardProps) {
  const dayOfWeek = formatDate(assignment.dueDate, 'EEEE');
  const dateDisplay = formatDate(assignment.dueDate, 'MMM d');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/student/assignments/${assignment.id}`}>
        <div
          className={cn(
            'relative rounded-2xl border-l-4 bg-white/70 dark:bg-slate-800/50',
            'backdrop-blur-xl border border-white/30 dark:border-slate-700/30',
            'p-5 transition-all duration-200 cursor-pointer',
            'hover:shadow-xl hover:-translate-y-1',
            CARD_BORDERS[assignment.status],
            CARD_GLOWS[assignment.status]
          )}
        >
          {/* Grade badge in top-right for graded assignments */}
          {assignment.grade && (
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 rounded-full px-2.5 py-1 border border-amber-200 dark:border-amber-700/50">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                  {assignment.grade.percentage}%
                </span>
              </div>
            </div>
          )}

          {/* Type emoji + Title */}
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl flex-shrink-0">{TYPE_EMOJI[assignment.type] || '\uD83D\uDCDD'}</span>
            <div className="flex-1 min-w-0 pr-16">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight truncate">
                {assignment.title}
              </h3>
              <p
                className="text-sm font-medium mt-1"
                style={{ color: assignment.courseColor }}
              >
                {assignment.courseName}
              </p>
            </div>
          </div>

          {/* Due date + Status */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <span>
                {dayOfWeek}, {dateDisplay}
              </span>
            </div>
            <StatusBadge status={assignment.status} size="sm" />
          </div>

          {/* Points */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {assignment.maxPoints} points
            </span>
            <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
              Open
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
