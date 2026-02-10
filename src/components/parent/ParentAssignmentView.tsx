'use client';

import React from 'react';
import { AlertCircle, Clock, CheckCircle2, Circle, FileX, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface Assignment {
  id: string;
  title: string;
  className: string;
  dueDate: string;
  status: 'graded' | 'submitted' | 'in_progress' | 'not_started' | 'missing' | 'overdue';
  grade: number | null;
  maxPoints: number;
}

interface ParentAssignmentViewProps {
  assignments: Assignment[];
  title?: string;
  showNext7Days?: boolean;
  compact?: boolean;
  className?: string;
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'graded':
      return {
        label: 'Graded',
        icon: <CheckCircle2 className="w-4 h-4" />,
        badgeClass: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      };
    case 'submitted':
      return {
        label: 'Submitted',
        icon: <CheckCircle2 className="w-4 h-4" />,
        badgeClass: 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        icon: <Loader2 className="w-4 h-4" />,
        badgeClass: 'bg-indigo-100/80 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      };
    case 'not_started':
      return {
        label: 'Not Started',
        icon: <Circle className="w-4 h-4" />,
        badgeClass: 'bg-slate-100/80 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400',
      };
    case 'missing':
      return {
        label: 'Missing',
        icon: <FileX className="w-4 h-4" />,
        badgeClass: 'bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      };
    case 'overdue':
      return {
        label: 'Overdue',
        icon: <AlertCircle className="w-4 h-4" />,
        badgeClass: 'bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      };
    default:
      return {
        label: status,
        icon: <Circle className="w-4 h-4" />,
        badgeClass: 'bg-slate-100/80 text-slate-600',
      };
  }
}

function isOverdueDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  return due < today;
}

function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  if (diffDays <= 7) return `In ${diffDays} days`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ParentAssignmentView({
  assignments,
  title = 'Upcoming Assignments',
  showNext7Days = false,
  compact = false,
  className,
}: ParentAssignmentViewProps) {
  let displayAssignments = assignments;

  if (showNext7Days) {
    const today = new Date();
    const next7 = new Date(today);
    next7.setDate(next7.getDate() + 7);
    // Show overdue/missing + next 7 days
    displayAssignments = assignments.filter((a) => {
      const due = new Date(a.dueDate);
      return due <= next7 || a.status === 'overdue' || a.status === 'missing';
    });
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          {title}
          {displayAssignments.length > 0 && (
            <Badge variant="secondary" size="sm">{displayAssignments.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayAssignments.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-400">All caught up! No upcoming assignments.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayAssignments.map((assignment) => {
              const statusConfig = getStatusConfig(assignment.status);
              const isOverdue = assignment.status === 'overdue' || assignment.status === 'missing' ||
                (isOverdueDate(assignment.dueDate) && assignment.status !== 'graded' && assignment.status !== 'submitted');

              return (
                <div
                  key={assignment.id}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl transition-colors',
                    isOverdue
                      ? 'bg-red-50/80 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  )}
                >
                  <div className={cn(
                    'flex-shrink-0',
                    isOverdue ? 'text-red-500' : 'text-slate-400'
                  )}>
                    {statusConfig.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm font-medium truncate',
                      isOverdue
                        ? 'text-red-800 dark:text-red-300'
                        : 'text-slate-900 dark:text-white'
                    )}>
                      {assignment.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {assignment.className}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className={cn(
                      'text-xs font-medium mb-1',
                      isOverdue ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'
                    )}>
                      {formatDueDate(assignment.dueDate)}
                    </p>
                    <Badge className={statusConfig.badgeClass} size="sm">
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
