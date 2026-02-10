'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MockDetailedAttendance } from '@/lib/mock-data';

interface AttendanceCalendarProps {
  records: MockDetailedAttendance[];
  isK5?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  present: 'bg-green-400 dark:bg-green-500',
  absent: 'bg-red-400 dark:bg-red-500',
  tardy: 'bg-yellow-400 dark:bg-yellow-500',
  excused: 'bg-blue-400 dark:bg-blue-500',
  online: 'bg-purple-400 dark:bg-purple-500',
};

const STATUS_BG_COLORS: Record<string, string> = {
  present: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
  absent: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
  tardy: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
  excused: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
  online: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800',
};

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function AttendanceCalendar({ records, isK5 = false }: AttendanceCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const handlePrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getDateString = (day: number) =>
    `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const getRecordForDate = (dateStr: string) => records.find(r => r.date === dateStr);

  const isWeekend = (day: number) => {
    const d = new Date(currentYear, currentMonth, day);
    return d.getDay() === 0 || d.getDay() === 6;
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {MONTHS[currentMonth]} {currentYear}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrev} className="p-2">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleNext} className="p-2">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div
              key={d}
              className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = getDateString(day);
            const record = getRecordForDate(dateStr);
            const weekend = isWeekend(day);
            const todayClass = isToday(day);

            if (isK5) {
              return (
                <div
                  key={day}
                  className={cn(
                    'aspect-square rounded-lg flex items-center justify-center relative border',
                    weekend
                      ? 'bg-slate-50 dark:bg-slate-900 border-transparent'
                      : record
                        ? STATUS_BG_COLORS[record.status] || 'border-transparent'
                        : 'border-transparent',
                    todayClass && 'ring-2 ring-indigo-500'
                  )}
                >
                  <span className={cn(
                    'text-sm font-medium',
                    weekend ? 'text-slate-300 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'
                  )}>
                    {day}
                  </span>
                  {record && !weekend && (
                    <div
                      className={cn(
                        'absolute bottom-1 w-2 h-2 rounded-full',
                        STATUS_COLORS[record.status]
                      )}
                    />
                  )}
                </div>
              );
            }

            // 6-12 heatmap style
            return (
              <div
                key={day}
                className={cn(
                  'aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-all',
                  weekend
                    ? 'text-slate-300 dark:text-slate-600'
                    : record
                      ? cn(STATUS_COLORS[record.status], 'text-white')
                      : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800',
                  todayClass && 'ring-2 ring-indigo-500 ring-offset-1',
                  !weekend && record && 'hover:opacity-80 cursor-pointer'
                )}
                title={
                  record
                    ? `${record.status.charAt(0).toUpperCase() + record.status.slice(1)}${record.notes ? `: ${record.notes}` : ''}`
                    : weekend
                      ? 'Weekend'
                      : ''
                }
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-4">
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded-full', color)} />
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
