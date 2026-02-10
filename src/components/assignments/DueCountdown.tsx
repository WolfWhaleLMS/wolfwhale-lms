'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DueCountdownProps {
  dueDate: string;
  className?: string;
  showIcon?: boolean;
  variant?: 'compact' | 'full';
}

function getTimeRemaining(dueDate: string) {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();

  const isOverdue = diff < 0;
  const absDiff = Math.abs(diff);

  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, isOverdue, totalMs: diff };
}

function formatCountdown(
  time: { days: number; hours: number; minutes: number; isOverdue: boolean },
  variant: 'compact' | 'full'
): string {
  const { days, hours, minutes, isOverdue } = time;
  const prefix = isOverdue ? 'Overdue by ' : 'Due in ';

  if (variant === 'compact') {
    if (days > 0) return `${prefix}${days}d ${hours}h`;
    if (hours > 0) return `${prefix}${hours}h ${minutes}m`;
    return `${prefix}${minutes}m`;
  }

  // full variant
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (days === 0 && minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);

  if (parts.length === 0) {
    return isOverdue ? 'Just overdue' : 'Due now';
  }

  return `${prefix}${parts.join(', ')}`;
}

export function DueCountdown({
  dueDate,
  className,
  showIcon = true,
  variant = 'compact',
}: DueCountdownProps) {
  const [time, setTime] = useState(() => getTimeRemaining(dueDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining(dueDate));
    }, 60000); // update every minute

    return () => clearInterval(interval);
  }, [dueDate]);

  const isUrgent = !time.isOverdue && time.days === 0 && time.hours < 24;
  const isOverdue = time.isOverdue;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-sm font-medium',
        isOverdue
          ? 'text-red-600 dark:text-red-400'
          : isUrgent
          ? 'text-orange-600 dark:text-orange-400'
          : 'text-slate-600 dark:text-slate-400',
        className
      )}
    >
      {showIcon && (
        isOverdue ? (
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        ) : (
          <Clock className="h-4 w-4 flex-shrink-0" />
        )
      )}
      {formatCountdown(time, variant)}
    </span>
  );
}
