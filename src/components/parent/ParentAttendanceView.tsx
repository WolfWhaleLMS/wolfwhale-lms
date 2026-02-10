'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'tardy' | 'excused';
}

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  tardy: number;
  excused: number;
  rate: number;
}

interface ParentAttendanceViewProps {
  records: AttendanceRecord[];
  stats: AttendanceStats;
  compact?: boolean;
  className?: string;
}

const STATUS_COLORS: Record<string, string> = {
  present: 'bg-emerald-400 dark:bg-emerald-500',
  absent: 'bg-red-400 dark:bg-red-500',
  tardy: 'bg-amber-400 dark:bg-amber-500',
  excused: 'bg-blue-400 dark:bg-blue-500',
};

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  present: { label: 'Present', color: 'text-emerald-600 dark:text-emerald-400', icon: <CheckCircle2 className="w-5 h-5" /> },
  absent: { label: 'Absent', color: 'text-red-600 dark:text-red-400', icon: <XCircle className="w-5 h-5" /> },
  tardy: { label: 'Tardy', color: 'text-amber-600 dark:text-amber-400', icon: <Clock className="w-5 h-5" /> },
  excused: { label: 'Excused', color: 'text-blue-600 dark:text-blue-400', icon: <ShieldCheck className="w-5 h-5" /> },
};

function AttendanceCircle({ rate }: { rate: number }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (rate / 100) * circumference;

  const getColor = (r: number) => {
    if (r >= 95) return { stroke: '#10b981', text: 'text-emerald-600 dark:text-emerald-400' };
    if (r >= 90) return { stroke: '#3b82f6', text: 'text-blue-600 dark:text-blue-400' };
    if (r >= 85) return { stroke: '#f59e0b', text: 'text-amber-600 dark:text-amber-400' };
    return { stroke: '#ef4444', text: 'text-red-600 dark:text-red-400' };
  };

  const colors = getColor(rate);

  return (
    <div className="relative w-32 h-32 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-200 dark:text-slate-700"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-2xl font-bold', colors.text)}>
          {rate}%
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Attendance
        </span>
      </div>
    </div>
  );
}

function MonthlyHeatmap({ records }: { records: AttendanceRecord[] }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const recordMap = useMemo(() => {
    const map: Record<string, string> = {};
    records.forEach((r) => {
      map[r.date] = r.status;
    });
    return map;
  }, [records]);

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthName = new Date(currentYear, currentMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const cells: (null | { day: number; status: string | null })[] = [];

  // Empty cells before the 1st
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const date = new Date(currentYear, currentMonth, day);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isFuture = date > today;

    let status: string | null = null;
    if (!isWeekend && !isFuture && recordMap[dateStr]) {
      status = recordMap[dateStr];
    }

    cells.push({ day, status });
  }

  return (
    <div>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{monthName}</p>
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((name, idx) => (
          <div key={idx} className="text-center text-[10px] font-medium text-slate-400 dark:text-slate-500 pb-1">
            {name}
          </div>
        ))}
        {cells.map((cell, idx) => {
          if (cell === null) {
            return <div key={`empty-${idx}`} className="w-full aspect-square" />;
          }
          const isToday = cell.day === today.getDate();
          return (
            <div
              key={cell.day}
              className={cn(
                'w-full aspect-square rounded-sm flex items-center justify-center text-[10px] font-medium transition-colors',
                cell.status
                  ? STATUS_COLORS[cell.status]
                  : 'bg-slate-100 dark:bg-slate-800',
                cell.status && 'text-white',
                !cell.status && 'text-slate-400 dark:text-slate-500',
                isToday && 'ring-2 ring-indigo-500 ring-offset-1'
              )}
              title={cell.status ? `${cell.day}: ${cell.status}` : `${cell.day}`}
            >
              {cell.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ParentAttendanceView({ records, stats, compact = false, className }: ParentAttendanceViewProps) {
  if (compact) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <AttendanceCircle rate={stats.rate} />
            <div className="flex-1 grid grid-cols-2 gap-3">
              {(['present', 'absent', 'tardy', 'excused'] as const).map((status) => {
                const info = STATUS_LABELS[status];
                return (
                  <div key={status} className="flex items-center gap-2">
                    <div className={cn('w-3 h-3 rounded-full', STATUS_COLORS[status])} />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{info.label}</p>
                      <p className={cn('text-lg font-bold', info.color)}>
                        {stats[status]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Attendance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Circle + stats */}
        <div className="flex items-center gap-6">
          <AttendanceCircle rate={stats.rate} />
          <div className="flex-1 space-y-3">
            {(['present', 'absent', 'tardy', 'excused'] as const).map((status) => {
              const info = STATUS_LABELS[status];
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={info.color}>{info.icon}</div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{info.label}</span>
                  </div>
                  <span className={cn('text-sm font-bold', info.color)}>{stats[status]} days</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly heatmap */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <MonthlyHeatmap records={records} />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1">
              <div className={cn('w-2.5 h-2.5 rounded-sm', color)} />
              <span className="capitalize">{status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
