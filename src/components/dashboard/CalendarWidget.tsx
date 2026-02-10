'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { MockCalendarEvent } from '@/lib/mock-data';

interface CalendarWidgetProps {
  variant: 'k5' | '612';
  events: MockCalendarEvent[];
}

const DAY_NAMES_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getEventColor(type: string, courseColor?: string) {
  if (courseColor) return courseColor;
  switch (type) {
    case 'quiz': return '#ef4444';
    case 'event': return '#8b5cf6';
    case 'holiday': return '#10b981';
    default: return '#3b82f6';
  }
}

function useCalendarDays(year: number, month: number) {
  return useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: Array<{ date: number; month: number; year: number; isCurrentMonth: boolean; dateStr: string }> = [];

    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = daysInPrevMonth - i;
      const m = month === 0 ? 11 : month - 1;
      const y = month === 0 ? year - 1 : year;
      days.push({
        date,
        month: m,
        year: y,
        isCurrentMonth: false,
        dateStr: `${y}-${String(m + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`,
      });
    }

    // Current month's days
    for (let date = 1; date <= daysInMonth; date++) {
      days.push({
        date,
        month,
        year,
        isCurrentMonth: true,
        dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`,
      });
    }

    // Next month's leading days (fill to 42 slots = 6 rows)
    const remaining = 42 - days.length;
    for (let date = 1; date <= remaining; date++) {
      const m = month === 11 ? 0 : month + 1;
      const y = month === 11 ? year + 1 : year;
      days.push({
        date,
        month: m,
        year: y,
        isCurrentMonth: false,
        dateStr: `${y}-${String(m + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`,
      });
    }

    return days;
  }, [year, month]);
}

/* ── K-5 Simple Month Calendar ──────────────────────── */

function K5CalendarWidget({ events }: { events: MockCalendarEvent[] }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const days = useCalendarDays(currentYear, currentMonth);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const eventsByDate = useMemo(() => {
    const map: Record<string, MockCalendarEvent[]> = {};
    events.forEach((evt) => {
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date].push(evt);
    });
    return map;
  }, [events]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <Card variant="fun" className="overflow-hidden">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">&#x1F4C5;</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="w-8 h-8 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="w-8 h-8 rounded-lg">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_NAMES_SHORT.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const isToday = day.dateStr === todayStr;
            const dayEvents = eventsByDate[day.dateStr] || [];

            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1 }}
                className={cn(
                  'relative flex flex-col items-center justify-center h-10 rounded-xl cursor-default transition-colors',
                  !day.isCurrentMonth && 'opacity-30',
                  isToday && 'bg-indigo-100 dark:bg-indigo-900/40 ring-2 ring-indigo-400',
                  !isToday && day.isCurrentMonth && 'hover:bg-slate-100 dark:hover:bg-slate-800/50',
                )}
              >
                <span className={cn(
                  'text-sm font-medium',
                  isToday ? 'text-indigo-700 dark:text-indigo-300 font-bold' : 'text-slate-700 dark:text-slate-300'
                )}>
                  {day.date}
                </span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((evt, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: getEventColor(evt.type, evt.courseColor) }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── 6-12 Detailed Calendar ─────────────────────────── */

function SecondaryCalendarWidget({ events }: { events: MockCalendarEvent[] }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const days = useCalendarDays(currentYear, currentMonth);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const eventsByDate = useMemo(() => {
    const map: Record<string, MockCalendarEvent[]> = {};
    events.forEach((evt) => {
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date].push(evt);
    });
    return map;
  }, [events]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Get upcoming events for the list view
  const upcomingEvents = useMemo(() => {
    const sorted = [...events]
      .filter(e => e.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date));
    return sorted.slice(0, 5);
  }, [events, todayStr]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="w-7 h-7">
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="w-7 h-7">
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Mini Calendar */}
        <div className="grid grid-cols-7 gap-0.5 mb-3">
          {DAY_NAMES_SHORT.map((d) => (
            <div key={d} className="text-center text-[10px] font-medium text-slate-400 dark:text-slate-500 py-1">
              {d}
            </div>
          ))}
          {days.map((day, idx) => {
            const isToday = day.dateStr === todayStr;
            const dayEvents = eventsByDate[day.dateStr] || [];

            return (
              <div
                key={idx}
                className={cn(
                  'relative flex flex-col items-center justify-center h-7 rounded-md text-xs cursor-default',
                  !day.isCurrentMonth && 'opacity-20',
                  isToday && 'bg-indigo-600 text-white font-bold rounded-lg',
                  !isToday && day.isCurrentMonth && 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50',
                )}
              >
                <span>{day.date}</span>
                {dayEvents.length > 0 && !isToday && (
                  <div className="absolute bottom-0.5 flex gap-px">
                    {dayEvents.slice(0, 2).map((evt, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: getEventColor(evt.type, evt.courseColor) }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Upcoming Events List */}
        {upcomingEvents.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Upcoming
            </h4>
            <div className="space-y-1.5">
              {upcomingEvents.map((evt) => (
                <div key={evt.id} className="flex items-center gap-2 py-1">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getEventColor(evt.type, evt.courseColor) }}
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 truncate flex-1">{evt.title}</span>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">
                    {new Date(evt.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Main Export ─────────────────────────────────────── */

export function CalendarWidget({ variant, events }: CalendarWidgetProps) {
  if (variant === 'k5') {
    return <K5CalendarWidget events={events} />;
  }
  return <SecondaryCalendarWidget events={events} />;
}
