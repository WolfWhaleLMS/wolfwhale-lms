'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Clock, XCircle, CalendarCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { MockAttendanceDay } from '@/lib/mock-data';

interface AttendanceWidgetProps {
  variant: 'k5' | '612';
  attendance: MockAttendanceDay[];
  stats: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    excusedDays: number;
    attendanceRate: number;
  };
}

/* ── K-5 Star Attendance ────────────────────────────── */

function K5AttendanceWidget({ attendance }: { attendance: MockAttendanceDay[] }) {
  const getStarColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-gold-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]';
      case 'late': return 'text-amber-300 opacity-70';
      case 'absent': return 'text-slate-300 dark:text-slate-600';
      case 'excused': return 'text-blue-300';
      default: return 'text-slate-200 dark:text-slate-700';
    }
  };

  const getStarLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Present';
      case 'late': return 'Late';
      case 'absent': return 'Absent';
      case 'excused': return 'Excused';
      default: return '';
    }
  };

  return (
    <Card variant="fun" className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">&#x2B50;</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">This Week</h3>
        </div>

        <div className="flex items-center justify-around">
          {attendance.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.12, type: 'spring', stiffness: 200 }}
              className="flex flex-col items-center gap-1.5"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 15 }}
                className="cursor-default"
              >
                <Star
                  className={cn('w-10 h-10 fill-current', getStarColor(day.status))}
                />
              </motion.div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {day.dayLabel}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500">
                {getStarLabel(day.status)}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-bold text-gold-600 dark:text-gold-400">
              {attendance.filter(d => d.status === 'present').length}/{attendance.length}
            </span>{' '}
            perfect days this week!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── 6-12 Percentage Attendance ─────────────────────── */

function SecondaryAttendanceWidget({ attendance, stats }: {
  attendance: MockAttendanceDay[];
  stats: AttendanceWidgetProps['stats'];
}) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'late': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'absent': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'excused': return <CalendarCheck className="w-4 h-4 text-blue-500" />;
      default: return <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700" />;
    }
  };

  const rateColor = stats.attendanceRate >= 95
    ? 'text-green-600 dark:text-green-400'
    : stats.attendanceRate >= 90
    ? 'text-blue-600 dark:text-blue-400'
    : stats.attendanceRate >= 80
    ? 'text-amber-600 dark:text-amber-400'
    : 'text-red-600 dark:text-red-400';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4 text-green-600" />
            Attendance
          </h4>
          <span className={cn('text-lg font-bold', rateColor)}>
            {stats.attendanceRate}%
          </span>
        </div>

        {/* This Week */}
        <div className="flex items-center justify-between gap-1 mb-3">
          {attendance.map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-slate-400 font-medium">{day.dayLabel}</span>
              {getStatusIcon(day.status)}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-1.5 rounded-lg bg-green-50 dark:bg-green-950/30">
            <p className="text-xs font-bold text-green-700 dark:text-green-300">{stats.presentDays}</p>
            <p className="text-[9px] text-green-600/70 dark:text-green-400/70">Present</p>
          </div>
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-300">{stats.lateDays}</p>
            <p className="text-[9px] text-amber-600/70 dark:text-amber-400/70">Late</p>
          </div>
          <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/30">
            <p className="text-xs font-bold text-red-700 dark:text-red-300">{stats.absentDays}</p>
            <p className="text-[9px] text-red-600/70 dark:text-red-400/70">Absent</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Main Export ─────────────────────────────────────── */

export function AttendanceWidget({ variant, attendance, stats }: AttendanceWidgetProps) {
  if (variant === 'k5') {
    return <K5AttendanceWidget attendance={attendance} />;
  }
  return <SecondaryAttendanceWidget attendance={attendance} stats={stats} />;
}
