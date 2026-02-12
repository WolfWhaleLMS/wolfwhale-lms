'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Check,
  X,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { getStudentAttendance, getAttendanceSummary } from '@/app/actions/attendance'
import { Button } from '@/components/ui/button'

type AttendanceStatus = 'present' | 'absent' | 'tardy' | 'excused' | 'online'

interface AttendanceRecord {
  id: string
  attendance_date: string
  status: AttendanceStatus
  notes: string | null
  courses: { name: string } | null
  course_id: string
}

interface Summary {
  total: number
  present: number
  absent: number
  tardy: number
  excused: number
  rate: number
}

const STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; dotColor: string; bgColor: string; textColor: string; icon: React.ReactNode }
> = {
  present: {
    label: 'Present',
    dotColor: 'bg-[#059669]',
    bgColor: 'bg-[#059669]/10 dark:bg-[#059669]/15',
    textColor: 'text-[#059669] dark:text-[#34D399]',
    icon: <Check className="size-3.5" />,
  },
  absent: {
    label: 'Absent',
    dotColor: 'bg-red-500',
    bgColor: 'bg-red-100 dark:bg-red-950/40',
    textColor: 'text-red-700 dark:text-red-400',
    icon: <X className="size-3.5" />,
  },
  tardy: {
    label: 'Tardy',
    dotColor: 'bg-[#D97706]',
    bgColor: 'bg-[#D97706]/10 dark:bg-[#D97706]/15',
    textColor: 'text-[#D97706] dark:text-[#FBBF24]',
    icon: <Clock className="size-3.5" />,
  },
  excused: {
    label: 'Excused',
    dotColor: 'bg-[#00BFFF]',
    bgColor: 'bg-[#00BFFF]/10 dark:bg-[#00BFFF]/15',
    textColor: 'text-[#00BFFF] dark:text-[#00BFFF]',
    icon: <AlertCircle className="size-3.5" />,
  },
  online: {
    label: 'Online',
    dotColor: 'bg-[#059669]',
    bgColor: 'bg-[#059669]/10 dark:bg-[#059669]/15',
    textColor: 'text-[#059669] dark:text-[#34D399]',
    icon: <Check className="size-3.5" />,
  },
}

const EMPTY_SUMMARY: Summary = {
  total: 0,
  present: 0,
  absent: 0,
  tardy: 0,
  excused: 0,
  rate: 0,
}

export default function StudentAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [summary, setSummary] = useState<Summary>(EMPTY_SUMMARY)
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [recordsData, summaryData] = await Promise.all([
          getStudentAttendance(),
          getAttendanceSummary(),
        ])

        if (recordsData && Array.isArray(recordsData)) {
          setRecords(recordsData as AttendanceRecord[])
        } else {
          setRecords([])
        }

        if (summaryData) {
          setSummary(summaryData as Summary)
        } else {
          setSummary(EMPTY_SUMMARY)
        }
      } catch {
        setRecords([])
        setSummary(EMPTY_SUMMARY)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Calculate circumference for circular gauge
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const progressOffset = circumference - (summary.rate / 100) * circumference

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const getAttendanceForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return records.find(r => r.attendance_date === dateStr)
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href="/student/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Visual Header with Whale Gradient */}
      <div className="whale-gradient rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              My Attendance
            </h1>
            <p className="mt-2 text-white/90">
              Track your attendance records and stay on top of your schedule.
            </p>
          </div>
          <Calendar className="size-16 opacity-20" />
        </div>
      </div>

      {/* Overall Attendance Stats with Circular Gauge */}
      <div className="ocean-card rounded-2xl p-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12">
          {/* Circular Progress Gauge */}
          <div className="relative flex-shrink-0">
            <svg width="160" height="160" className="-rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                strokeWidth="12"
                fill="none"
                className="stroke-muted"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
                className={
                  summary.rate >= 90
                    ? 'stroke-[#059669]'
                    : summary.rate >= 75
                      ? 'stroke-[#D97706]'
                      : 'stroke-red-500'
                }
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-foreground">
                {summary.rate}%
              </span>
              <span className="text-sm text-muted-foreground">Attendance Rate</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 w-full">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Attendance Summary
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-[#059669] dark:text-[#34D399]">
                  {summary.present}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Days Present</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {summary.absent}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Days Absent</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-[#D97706] dark:text-[#FBBF24]">
                  {summary.tardy}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Days Tardy</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-[#00BFFF] dark:text-[#00BFFF]">
                  {summary.excused}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Days Excused</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-primary">
              <TrendingUp className="size-5" />
              <span className="text-sm font-medium">
                {summary.rate >= 95
                  ? 'Excellent attendance! Keep up the great work.'
                  : summary.rate >= 90
                    ? 'Great attendance. Stay consistent!'
                    : summary.rate >= 75
                      ? 'Your attendance could use improvement.'
                      : summary.total === 0
                        ? 'No attendance records yet.'
                        : 'Your attendance needs attention. Talk to your teacher.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Calendar View */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Calendar className="size-5 text-primary" />
            Monthly Calendar
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              className="rounded-xl"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium text-foreground px-4">
              {monthName}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              className="rounded-xl"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const attendance = getAttendanceForDate(day)
            const config = attendance ? STATUS_CONFIG[attendance.status] : null

            return (
              <div
                key={day}
                className="aspect-square flex flex-col items-center justify-center rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors relative"
              >
                <span className="text-sm font-medium text-foreground">{day}</span>
                {config && (
                  <div
                    className={`size-2 rounded-full ${config.dotColor} mt-1 shadow-sm`}
                    title={`${config.label}${attendance?.notes ? `: ${attendance?.notes}` : ''}`}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center text-xs">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[#059669]"></div>
            <span className="text-muted-foreground">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-red-500"></div>
            <span className="text-muted-foreground">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[#D97706]"></div>
            <span className="text-muted-foreground">Tardy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[#00BFFF]"></div>
            <span className="text-muted-foreground">Excused</span>
          </div>
        </div>
      </div>

      {/* Recent Attendance List (Last 30 Days) */}
      <div className="ocean-card rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="size-5 text-primary" />
          Recent Attendance (Last 30 Days)
        </h2>

        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 text-5xl opacity-40">🐋</div>
            <p className="text-muted-foreground">
              No attendance records found.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your attendance will appear here once your teacher starts recording.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {records.slice(0, 30).map((record) => {
              const config = STATUS_CONFIG[record.status] || STATUS_CONFIG.present
              return (
                <div
                  key={record.id}
                  className={`flex items-center justify-between rounded-xl p-4 transition-colors ${
                    record.status === 'present' || record.status === 'online'
                      ? 'bg-[#059669]/5 dark:bg-[#059669]/10 border border-[#059669]/20 dark:border-[#059669]/20'
                      : record.status === 'absent'
                        ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900'
                        : record.status === 'tardy'
                          ? 'bg-[#D97706]/5 dark:bg-[#D97706]/10 border border-[#D97706]/20 dark:border-[#D97706]/20'
                          : 'bg-[#00BFFF]/5 dark:bg-[#00BFFF]/10 border border-[#00BFFF]/20 dark:border-[#00BFFF]/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {new Date(record.attendance_date + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {record.courses?.name || 'Unknown Course'}
                      </span>
                    </div>
                    {record.notes && (
                      <span className="text-xs text-muted-foreground italic">
                        {record.notes}
                      </span>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${config.bgColor} ${config.textColor}`}
                  >
                    {config.icon}
                    {config.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
