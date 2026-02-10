'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import { DueCountdown } from './DueCountdown';
import type { MockAssignment } from '@/lib/mock-data';

interface AssignmentHeaderProps {
  assignment: MockAssignment;
  className?: string;
}

const TYPE_LABELS: Record<string, string> = {
  homework: 'Homework',
  quiz: 'Quiz',
  project: 'Project',
  exam: 'Exam',
  discussion: 'Discussion',
};

export function AssignmentHeader({ assignment, className }: AssignmentHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Back link */}
      <Link
        href="/student/assignments"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assignments
      </Link>

      {/* Assignment type label */}
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md"
          style={{
            backgroundColor: `${assignment.courseColor}15`,
            color: assignment.courseColor,
          }}
        >
          {TYPE_LABELS[assignment.type] || assignment.type}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
        {assignment.title}
      </h1>

      {/* Course + Teacher */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <Link
          href={`/student/courses/${assignment.courseId}`}
          className="inline-flex items-center gap-1.5 font-medium hover:underline transition-colors"
          style={{ color: assignment.courseColor }}
        >
          <BookOpen className="h-4 w-4" />
          {assignment.courseName}
        </Link>
        <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <User className="h-4 w-4" />
          {assignment.teacherName}
        </span>
      </div>

      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <StatusBadge status={assignment.status} size="lg" />
        <DueCountdown dueDate={assignment.dueDate} variant="full" />
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Out of <span className="font-semibold text-slate-700 dark:text-slate-200">{assignment.maxPoints}</span> points
        </span>
      </div>
    </div>
  );
}
