'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Megaphone,
  Brain,
  HelpCircle,
  X,
  ArrowLeft,
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
import type { CalendarEvent } from '@/app/actions/calendar'

type EventType = CalendarEvent['type']

const EVENT_COLORS: Record<EventType, { dot: string; bg: string; text: string; border: string }> = {
  assignment: {
    dot: 'bg-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
  attendance: {
    dot: 'bg-green-500',
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
  },
  quiz: {
    dot: 'bg-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800',
  },
  study: {
    dot: 'bg-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
  },
  announcement: {
    dot: 'bg-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
  },
}

const EVENT_ICONS: Record<EventType, React.ReactNode> = {
  assignment: <BookOpen className="size-3.5" />,
  attendance: <CheckCircle className="size-3.5" />,
  quiz: <HelpCircle className="size-3.5" />,
  study: <Brain className="size-3.5" />,
  announcement: <Megaphone className="size-3.5" />,
}

const EVENT_LABELS: Record<EventType, string> = {
  assignment: 'Assignments',
  attendance: 'Attendance',
  quiz: 'Quizzes',
  study: 'Study Sessions',
  announcement: 'Announcements',
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarClientProps {
  initialEvents: CalendarEvent[]
  initialMonth: string
}

export default function CalendarClient({ initialEvents, initialMonth }: CalendarClientProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date(initialMonth + '-01'))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const events = initialEvents

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const calStart = startOfWeek(monthStart)
    const calEnd = endOfWeek(monthEnd)
    return eachDayOfInterval({ start: calStart, end: calEnd })
  }, [currentMonth])

  // Pre-compute a Map<dateString, CalendarEvent[]> so we do a single pass
  // over all events instead of filtering inside every calendar cell (up to 42x).
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const evt of events) {
      const existing = map.get(evt.date)
      if (existing) {
        existing.push(evt)
      } else {
        map.set(evt.date, [evt])
      }
    }
    return map
  }, [events])

  function getEventsForDate(date: Date): CalendarEvent[] {
    const dateStr = format(date, 'yyyy-MM-dd')
    return eventsByDate.get(dateStr) || []
  }

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  // Determine which event types are present for legend
  const presentTypes = useMemo(() => {
    const types = new Set(events.map(e => e.type))
    return Array.from(types) as EventType[]
  }, [events])

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-2 sm:px-4">
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Calendar</h1>
        <p className="mt-1 text-muted-foreground">
          View assignments, attendance, study sessions, and announcements at a glance.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {presentTypes.length > 0
          ? presentTypes.map((type) => (
              <div key={type} className="flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${EVENT_COLORS[type].dot}`} />
                <span className="text-sm text-muted-foreground">{EVENT_LABELS[type]}</span>
              </div>
            ))
          : Object.entries(EVENT_LABELS).map(([type, label]) => (
              <div key={type} className="flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${EVENT_COLORS[type as EventType].dot}`} />
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <div className="ocean-card rounded-2xl p-6 lg:col-span-2">
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

          <div className="mb-2 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const dayEvents = getEventsForDate(day)
              const inMonth = isSameMonth(day, currentMonth)
              const today = isToday(day)
              const isSelected = selectedDate !== null && isSameDay(day, selectedDate)

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
                <Button variant="ghost" size="icon" onClick={() => setSelectedDate(null)}>
                  <X className="size-4" />
                </Button>
              </div>

              {selectedDateEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="mb-3 size-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    No items scheduled for this day.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((evt) => {
                    const colors = EVENT_COLORS[evt.type]
                    const icon = EVENT_ICONS[evt.type]
                    const content = (
                      <div className={`rounded-xl border p-3 ${colors.bg} ${colors.border}`}>
                        <div className="flex items-start gap-2">
                          <span className={`mt-0.5 ${colors.text}`}>{icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${colors.text}`}>
                              {evt.title}
                            </p>
                            {evt.courseName && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {evt.courseName}
                              </p>
                            )}
                            <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                              {evt.type === 'study' ? 'Study Session' : evt.type}
                            </p>
                          </div>
                        </div>
                      </div>
                    )

                    return evt.link ? (
                      <Link key={evt.id} href={evt.link} className="block transition-opacity hover:opacity-80">
                        {content}
                      </Link>
                    ) : (
                      <div key={evt.id}>{content}</div>
                    )
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Calendar className="mb-3 size-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">Select a date</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Click on any day to see assignments, attendance, and more.
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
                    <div key={evt.id} className="flex items-center gap-2 text-sm">
                      <span className={`size-2 rounded-full ${EVENT_COLORS[evt.type].dot}`} />
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
