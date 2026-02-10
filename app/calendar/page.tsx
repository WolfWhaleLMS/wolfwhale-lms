'use client'

import { useState, useMemo } from 'react'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Star,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns'

// Event types with color coding
type EventType = 'assignment' | 'attendance' | 'event'

interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: EventType
}

const EVENT_COLORS: Record<
  EventType,
  { dot: string; bg: string; text: string; border: string }
> = {
  assignment: {
    dot: 'bg-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  attendance: {
    dot: 'bg-green-500',
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
  },
  event: {
    dot: 'bg-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
  },
}

const EVENT_ICONS: Record<EventType, React.ReactNode> = {
  assignment: <BookOpen className="size-3.5" />,
  attendance: <CheckCircle className="size-3.5" />,
  event: <Star className="size-3.5" />,
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Sample events for demonstration
function getSampleEvents(currentMonth: Date): CalendarEvent[] {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  return [
    {
      id: '1',
      title: 'Math Homework Due',
      date: new Date(year, month, 5),
      type: 'assignment',
    },
    {
      id: '2',
      title: 'Science Lab Report',
      date: new Date(year, month, 8),
      type: 'assignment',
    },
    {
      id: '3',
      title: 'Attendance Recorded',
      date: new Date(year, month, 8),
      type: 'attendance',
    },
    {
      id: '4',
      title: 'School Assembly',
      date: new Date(year, month, 12),
      type: 'event',
    },
    {
      id: '5',
      title: 'English Essay Due',
      date: new Date(year, month, 15),
      type: 'assignment',
    },
    {
      id: '6',
      title: 'Parent-Teacher Meeting',
      date: new Date(year, month, 18),
      type: 'event',
    },
    {
      id: '7',
      title: 'Attendance Recorded',
      date: new Date(year, month, 18),
      type: 'attendance',
    },
    {
      id: '8',
      title: 'History Quiz',
      date: new Date(year, month, 22),
      type: 'assignment',
    },
    {
      id: '9',
      title: 'Field Trip',
      date: new Date(year, month, 25),
      type: 'event',
    },
    {
      id: '10',
      title: 'Final Project Due',
      date: new Date(year, month, 28),
      type: 'assignment',
    },
  ]
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const events = useMemo(
    () => getSampleEvents(currentMonth),
    [currentMonth]
  )

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const calStart = startOfWeek(monthStart)
    const calEnd = endOfWeek(monthEnd)
    return eachDayOfInterval({ start: calStart, end: calEnd })
  }, [currentMonth])

  // Events for a specific date
  function getEventsForDate(date: Date): CalendarEvent[] {
    return events.filter((e) => isSameDay(e.date, date))
  }

  const selectedDateEvents = selectedDate
    ? getEventsForDate(selectedDate)
    : []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Calendar
        </h1>
        <p className="mt-1 text-muted-foreground">
          View assignments, attendance, and events at a glance.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {(Object.entries(EVENT_COLORS) as [EventType, typeof EVENT_COLORS.assignment][]).map(
          ([type, colors]) => (
            <div key={type} className="flex items-center gap-2">
              <span className={`size-2.5 rounded-full ${colors.dot}`} />
              <span className="text-sm capitalize text-muted-foreground">
                {type === 'assignment'
                  ? 'Assignments'
                  : type === 'attendance'
                    ? 'Attendance'
                    : 'Events'}
              </span>
            </div>
          )
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <div className="ocean-card rounded-2xl p-6 lg:col-span-2">
          {/* Month Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="size-5" />
            </Button>
            <h2 className="text-xl font-semibold text-foreground">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>

          {/* Weekday Headers */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const dayEvents = getEventsForDate(day)
              const inMonth = isSameMonth(day, currentMonth)
              const today = isToday(day)
              const isSelected =
                selectedDate !== null && isSameDay(day, selectedDate)

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  className={`group relative flex min-h-[72px] flex-col items-center rounded-xl border p-1.5 transition-all duration-200 sm:min-h-[80px] ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : today
                        ? 'border-primary/50 bg-primary/5'
                        : inMonth
                          ? 'border-border/50 bg-background/60 hover:border-border hover:bg-muted/50'
                          : 'border-transparent bg-transparent opacity-40'
                  }`}
                >
                  <span
                    className={`flex size-7 items-center justify-center rounded-full text-sm font-medium ${
                      today
                        ? 'bg-primary text-primary-foreground'
                        : isSelected
                          ? 'text-primary'
                          : inMonth
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  {/* Event Dots */}
                  {dayEvents.length > 0 && (
                    <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                      {dayEvents.slice(0, 3).map((evt) => (
                        <span
                          key={evt.id}
                          className={`size-1.5 rounded-full ${EVENT_COLORS[evt.type].dot}`}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[8px] leading-none text-muted-foreground">
                          +{dayEvents.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Sidebar: Selected Date Details */}
        <div className="ocean-card rounded-2xl p-6">
          {selectedDate ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="size-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    {format(selectedDate, 'EEEE, MMM d')}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setSelectedDate(null)}
                >
                  <X className="size-4" />
                </Button>
              </div>

              {selectedDateEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-3 text-4xl opacity-40">🌊</div>
                  <p className="text-sm text-muted-foreground">
                    No items scheduled for this day.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((evt) => {
                    const colors = EVENT_COLORS[evt.type]
                    const icon = EVENT_ICONS[evt.type]
                    return (
                      <div
                        key={evt.id}
                        className={`rounded-xl border p-3 ${colors.bg} ${colors.border}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`mt-0.5 ${colors.text}`}>
                            {icon}
                          </span>
                          <div>
                            <p
                              className={`text-sm font-medium ${colors.text}`}
                            >
                              {evt.title}
                            </p>
                            <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                              {evt.type}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Calendar className="mb-3 size-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                Select a date
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Click on any day to see its events, assignments, and attendance
                records.
              </p>
            </div>
          )}

          {/* Today's Quick Summary */}
          <div className="mt-6 border-t border-border pt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Today&apos;s Overview
            </p>
            {(() => {
              const todayEvents = getEventsForDate(new Date())
              if (todayEvents.length === 0) {
                return (
                  <p className="text-sm text-muted-foreground">
                    Nothing scheduled for today.
                  </p>
                )
              }
              return (
                <div className="space-y-1.5">
                  {todayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span
                        className={`size-2 rounded-full ${EVENT_COLORS[evt.type].dot}`}
                      />
                      <span className="text-foreground">{evt.title}</span>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
