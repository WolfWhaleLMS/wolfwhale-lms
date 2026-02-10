'use client';

import { CheckCircle2, Clock, RotateCcw, FileText, Link as LinkIcon } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { MockSubmission } from '@/lib/mock-data';

interface SubmissionStatusProps {
  submission: MockSubmission;
  className?: string;
}

export function SubmissionStatus({ submission, className }: SubmissionStatusProps) {
  const statusConfig = {
    submitted: {
      icon: CheckCircle2,
      label: 'Submitted',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      border: 'border-purple-200 dark:border-purple-800/50',
    },
    graded: {
      icon: CheckCircle2,
      label: 'Graded',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800/50',
    },
    returned: {
      icon: RotateCcw,
      label: 'Returned',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-800/50',
    },
  };

  const config = statusConfig[submission.status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-xl border p-4',
        config.bg,
        config.border,
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className={cn('h-5 w-5', config.color)} />
        <span className={cn('font-semibold text-sm', config.color)}>{config.label}</span>
        {submission.submittedLate && (
          <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
            Late
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Clock className="h-3.5 w-3.5" />
          <span>Submitted {formatDate(submission.submittedAt, 'MMM d, yyyy h:mm a')}</span>
        </div>

        {submission.fileName && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <FileText className="h-3.5 w-3.5" />
            <span>{submission.fileName}</span>
          </div>
        )}

        {submission.submissionUrl && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <LinkIcon className="h-3.5 w-3.5" />
            <span className="truncate">{submission.submissionUrl}</span>
          </div>
        )}
      </div>
    </div>
  );
}
