'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn, formatDate } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import type { MockAssignment } from '@/lib/mock-data';

interface AssignmentRowProps {
  assignment: MockAssignment;
  index?: number;
}

function getDaysUntilDue(dueDate: string): { days: number; label: string } {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return { days, label: `${Math.abs(days)}d overdue` };
  if (days === 0) return { days, label: 'Today' };
  if (days === 1) return { days, label: 'Tomorrow' };
  return { days, label: `${days} days` };
}

function getRowBg(assignment: MockAssignment): string {
  if (assignment.status === 'graded' || assignment.status === 'submitted') {
    return 'bg-emerald-50/40 dark:bg-emerald-950/10 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/20';
  }
  const { days } = getDaysUntilDue(assignment.dueDate);
  if (days < 0) return 'bg-red-50/40 dark:bg-red-950/10 hover:bg-red-50/70 dark:hover:bg-red-950/20';
  if (days <= 1) return 'bg-yellow-50/40 dark:bg-yellow-950/10 hover:bg-yellow-50/70 dark:hover:bg-yellow-950/20';
  return 'bg-white/50 dark:bg-slate-800/30 hover:bg-white/80 dark:hover:bg-slate-800/50';
}

export function AssignmentRow({ assignment, index = 0 }: AssignmentRowProps) {
  const dueInfo = getDaysUntilDue(assignment.dueDate);
  const dateDisplay = formatDate(assignment.dueDate, 'MMM d, yyyy');

  const gradeDisplay = assignment.grade
    ? `${assignment.grade.pointsEarned}/${assignment.maxPoints} (${assignment.grade.letterGrade})`
    : `- / ${assignment.maxPoints}`;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
    >
      <td className="py-0 px-0">
        <Link
          href={`/student/assignments/${assignment.id}`}
          className={cn(
            'flex items-center gap-4 py-3.5 px-4 transition-colors cursor-pointer',
            getRowBg(assignment)
          )}
        >
          {/* Assignment name + type */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {assignment.title}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 capitalize flex-shrink-0">
                {assignment.type}
              </span>
            </div>
          </div>

          {/* Class */}
          <div className="w-32 flex-shrink-0 hidden md:block">
            <span
              className="text-xs font-medium px-2 py-1 rounded-full"
              style={{
                backgroundColor: `${assignment.courseColor}15`,
                color: assignment.courseColor,
              }}
            >
              {assignment.courseName}
            </span>
          </div>

          {/* Due date */}
          <div className="w-28 flex-shrink-0 text-right hidden sm:block">
            <span className="text-sm text-slate-600 dark:text-slate-400">{dateDisplay}</span>
          </div>

          {/* Days until due */}
          <div className="w-24 flex-shrink-0 text-right hidden lg:block">
            <span
              className={cn(
                'text-sm font-medium',
                dueInfo.days < 0
                  ? 'text-red-600 dark:text-red-400'
                  : dueInfo.days <= 1
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-slate-600 dark:text-slate-400'
              )}
            >
              {dueInfo.label}
            </span>
          </div>

          {/* Status */}
          <div className="w-28 flex-shrink-0 flex justify-center">
            <StatusBadge status={assignment.status} size="sm" />
          </div>

          {/* Points/Grade */}
          <div className="w-28 flex-shrink-0 text-right">
            <span
              className={cn(
                'text-sm font-medium',
                assignment.grade
                  ? assignment.grade.percentage >= 90
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : assignment.grade.percentage >= 80
                    ? 'text-blue-600 dark:text-blue-400'
                    : assignment.grade.percentage >= 70
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-red-600 dark:text-red-400'
                  : 'text-slate-600 dark:text-slate-400'
              )}
            >
              {gradeDisplay}
            </span>
          </div>
        </Link>
      </td>
    </motion.tr>
  );
}
