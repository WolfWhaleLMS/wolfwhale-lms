'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { MockDetailedAttendance } from '@/lib/mock-data';

interface AttendanceWeekProps {
  records: MockDetailedAttendance[];
  weekStartDate: string;
  isPerfect?: boolean;
}

const STATUS_COLORS: Record<string, { bg: string; border: string; emoji: string; label: string }> = {
  present: { bg: 'bg-green-400', border: 'border-green-500', emoji: '\u2705', label: 'Present' },
  absent: { bg: 'bg-red-400', border: 'border-red-500', emoji: '\u274C', label: 'Absent' },
  tardy: { bg: 'bg-yellow-400', border: 'border-yellow-500', emoji: '\u23F0', label: 'Tardy' },
  excused: { bg: 'bg-blue-400', border: 'border-blue-500', emoji: '\uD83D\uDCDD', label: 'Excused' },
  online: { bg: 'bg-purple-400', border: 'border-purple-500', emoji: '\uD83D\uDCBB', label: 'Online' },
};

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default function AttendanceWeek({ records, weekStartDate, isPerfect }: AttendanceWeekProps) {
  const getWeekDates = () => {
    const start = new Date(weekStartDate);
    return DAY_LABELS.map((label, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return {
        label,
        dateStr: date.toISOString().split('T')[0],
        day: date.getDate(),
      };
    });
  };

  const weekDates = getWeekDates();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Week of {new Date(weekStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
        {isPerfect && (
          <span className="text-lg" title="Perfect attendance week!">
            \u2B50
          </span>
        )}
      </div>
      <div className="flex gap-3">
        {weekDates.map((dayInfo) => {
          const record = records.find(r => r.date === dayInfo.dateStr);
          const status = record?.status || 'future';
          const statusConfig = STATUS_COLORS[status];

          if (!statusConfig) {
            // Future / no record
            return (
              <div
                key={dayInfo.dateStr}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">--</span>
                </div>
                <span className="text-xs text-slate-400">{dayInfo.label}</span>
              </div>
            );
          }

          return (
            <div
              key={dayInfo.dateStr}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className={cn(
                  'w-14 h-14 rounded-xl border-2 flex items-center justify-center text-xl transition-transform hover:scale-110',
                  statusConfig.bg,
                  statusConfig.border
                )}
                title={`${dayInfo.label}: ${statusConfig.label}${record?.notes ? ` - ${record.notes}` : ''}`}
              >
                {statusConfig.emoji}
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {dayInfo.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
