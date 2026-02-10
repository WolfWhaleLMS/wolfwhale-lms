'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'assignment' | 'class' | 'event' | 'deadline';
  course?: string;
  status?: 'due' | 'submitted' | 'graded';
}

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Math Quiz',
    date: '2024-03-08',
    time: '9:00 AM',
    type: 'assignment',
    course: 'Mathematics',
    status: 'graded',
  },
  {
    id: '2',
    title: 'English Essay Due',
    date: '2024-03-15',
    type: 'deadline',
    course: 'English Literature',
    status: 'due',
  },
  {
    id: '3',
    title: 'Biology Lab Report',
    date: '2024-03-10',
    type: 'assignment',
    course: 'Biology',
    status: 'submitted',
  },
  {
    id: '4',
    title: 'Chemistry Class',
    date: '2024-03-12',
    time: '1:00 PM',
    type: 'class',
    course: 'Chemistry',
  },
  {
    id: '5',
    title: 'History Project',
    date: '2024-03-22',
    type: 'deadline',
    course: 'History',
    status: 'due',
  },
  {
    id: '6',
    title: 'Spring Break',
    date: '2024-03-25',
    type: 'event',
  },
];

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'assignment':
      return 'bg-blue-500/20 text-blue-700 dark:text-blue-200 border-blue-200/50';
    case 'deadline':
      return 'bg-red-500/20 text-red-700 dark:text-red-200 border-red-200/50';
    case 'class':
      return 'bg-purple-500/20 text-purple-700 dark:text-purple-200 border-purple-200/50';
    case 'event':
      return 'bg-green-500/20 text-green-700 dark:text-green-200 border-green-200/50';
    default:
      return 'bg-slate-500/20 text-slate-700 dark:text-slate-200';
  }
};

const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'graded':
      return <CheckCircle className="w-3 h-3 text-green-600" />;
    case 'submitted':
      return <CheckCircle className="w-3 h-3 text-blue-600" />;
    case 'due':
      return <AlertCircle className="w-3 h-3 text-red-600" />;
    default:
      return null;
  }
};

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getDateString = (day: number) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEventsForDate = (dateString: string) => {
    return mockEvents.filter(event => event.date === dateString);
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            Calendar
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            View your assignments, classes, and events
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {monthNames[currentMonth]} {currentYear}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevMonth}
                      className="p-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextMonth}
                      className="p-2"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div
                      key={day}
                      className="text-center font-semibold text-sm text-slate-600 dark:text-slate-400 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="aspect-square" />
                  ))}

                  {/* Days of month */}
                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const day = idx + 1;
                    const dateString = getDateString(day);
                    const dayEvents = getEventsForDate(dateString);
                    const isSelected = selectedDate === dateString;
                    const isToday =
                      day === today.getDate() &&
                      currentMonth === today.getMonth() &&
                      currentYear === today.getFullYear();

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(dateString)}
                        className={`aspect-square p-2 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                            : isToday
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-col h-full">
                          <p className={`text-sm font-semibold ${
                            isToday
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-slate-900 dark:text-white'
                          }`}>
                            {day}
                          </p>
                          {dayEvents.length > 0 && (
                            <div className="flex-1 flex items-end">
                              <div className="flex gap-1 flex-wrap">
                                {dayEvents.slice(0, 2).map((event, idx) => (
                                  <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      event.type === 'deadline'
                                        ? 'bg-red-500'
                                        : event.type === 'class'
                                        ? 'bg-purple-500'
                                        : 'bg-blue-500'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-slate-600 dark:text-slate-400">Deadline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-slate-600 dark:text-slate-400">Class</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-slate-600 dark:text-slate-400">Assignment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-slate-600 dark:text-slate-400">Event</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {selectedDate
                    ? new Date(selectedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Select a Date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  selectedDateEvents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`p-4 rounded-lg border-2 ${getEventColor(event.type)}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{event.title}</h4>
                            {getStatusIcon(event.status)}
                          </div>
                          {event.time && (
                            <p className="text-sm opacity-75 flex items-center gap-1 mb-2">
                              <Clock className="w-3 h-3" />
                              {event.time}
                            </p>
                          )}
                          {event.course && (
                            <Badge className="text-xs bg-white/30">{event.course}</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                      No events scheduled for this date.
                    </p>
                  )
                ) : (
                  <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                    Click on a date to view events
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockEvents
                    .filter((event) => {
                      const eventDate = new Date(event.date);
                      return eventDate >= today;
                    })
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 5)
                    .map((event) => (
                      <div
                        key={event.id}
                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      >
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">
                          {event.title}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                          {event.course && ` • ${event.course}`}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
