'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Check,
  X,
  Clock,
  AlertCircle,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react'
import { getStudentAttendance, getAttendanceSummary } from '@/app/actions/attendance'
import { getChildProgress } from '@/app/actions/parent'
import { Button } from '@/components/ui/button'

type AttendanceStatus = 'present' | 'absent' | 'tardy' | 'excused' | 'online'

interface AttendanceRecord {
  id: string
  date: string
  status: AttendanceStatus
  notes: string | null
  courses: { title: string } | null
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
    dotColor: 'bg-green-500',
    bgColor: 'bg-green-100 dark:bg-green-950/40',
    textColor: 'text-green-700 dark:text-green-400',
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
    dotColor: 'bg-amber-500',
    bgColor: 'bg-amber-100 dark:bg-amber-950/40',
    textColor: 'text-amber-700 dark:text-amber-400',
    icon: <Clock className="size-3.5" />,
  },
  excused: {
    label: 'Excused',
    dotColor: 'bg-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-950/40',
    textColor: 'text-blue-700 dark:text-blue-400',
    icon: <AlertCircle className="size-3.5" />,
  },
  online: {
    label: 'Online',
    dotColor: 'bg-green-500',
    bgColor: 'bg-green-100 dark:bg-green-950/40',
    textColor: 'text-green-700 dark:text-green-400',
    icon: <Check className="size-3.5" />,
  },
}

export default function ParentChildAttendancePage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = use(params)
  const [childName, setChildName] = useState('Your Child')
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    present: 0,
    absent: 0,
    tardy: 0,
    excused: 0,
    rate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [recordsData, summaryData, progressData] = await Promise.all([
          getStudentAttendance(studentId),
          getAttendanceSummary(studentId),
          getChildProgress(studentId),
        ])

        if (progressData?.student?.fullName) {
          setChildName(progressData.student.fullName)
        }

        if (recordsData && Array.isArray(recordsData) && recordsData.length > 0) {
          setRecords(recordsData as AttendanceRecord[])
          setSummary(summaryData as Summary)
        }
      } catch {
        // Keep empty state on error
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [studentId])

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
    return records.find(r => r.date === dateStr)
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const showAttendanceAlert = summary.rate < 90

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href={`/parent/children/${studentId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Child Profile
      </Link>

      {/* Visual Header with Whale Gradient */}
      <div className="whale-gradient rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {childName}&apos;s Attendance
            </h1>
            <p className="mt-2 text-white/90">
              Monitor your child&apos;s attendance and stay informed about their presence in class.
            </p>
          </div>
          <Calendar className="size-16 opacity-20" />
        </div>
      </div>

      {/* Attendance Alert (if rate < 90%) */}
      {showAttendanceAlert && (
        <div className="ocean-card rounded-2xl p-6 border-2 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="size-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-300">
                Attendance Alert
              </h3>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-400">
                {childName}&apos;s attendance rate has dropped below 90%. Regular attendance is important for academic success.
                Please reach out to the teacher if there are concerns or if you need support.
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-amber-900 dark:text-amber-300">
                <TrendingUp className="size-4" />
                <span>Current Rate: {summary.rate}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Large Circular Gauge & Stats */}
      <div className="ocean-card rounded-2xl p-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12">
          {/* Circular Progress Gauge */}
          <div className="relative flex-shrink-0">
            <svg width="180" height="180" className="-rotate-90">
              <circle
                cx="90"
                cy="90"
                r={radius + 10}
                strokeWidth="14"
                fill="none"
                className="stroke-muted"
              />
              <circle
                cx="90"
                cy="90"
                r={radius + 10}
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * (radius + 10)}
                strokeDashoffset={2 * Math.PI * (radius + 10) - (summary.rate / 100) * 2 * Math.PI * (radius + 10)}
                className={
                  summary.rate >= 90
                    ? 'stroke-green-500'
                    : summary.rate >= 75
                      ? 'stroke-amber-500'
                      : 'stroke-red-500'
                }
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-foreground">
                {summary.rate}%
              </span>
              <span className="text-sm text-muted-foreground mt-1">Attendance Rate</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex-1 w-full">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Attendance Summary
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="text-center p-5 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                <Check className="size-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {summary.present}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Days Present</p>
              </div>
              <div className="text-center p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                <X className="size-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {summary.absent}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Days Absent</p>
              </div>
              <div className="text-center p-5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                <Clock className="size-6 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {summary.tardy}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Days Tardy</p>
              </div>
              <div className="text-center p-5 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                <AlertCircle className="size-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {summary.excused}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Days Excused</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-primary">
              <TrendingUp className="size-5" />
              <span className="text-sm font-medium">
                {summary.rate >= 95
                  ? `${childName} has excellent attendance!`
                  : summary.rate >= 90
                    ? `${childName} has great attendance. Keep it up!`
                    : summary.rate >= 75
                      ? `${childName}'s attendance could use improvement.`
                      : summary.total === 0
                        ? 'No attendance records yet.'
                        : `${childName}'s attendance needs attention. Please contact the teacher.`}
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
                    className={`size-2.5 rounded-full ${config.dotColor} mt-1 shadow-md`}
                    title={`${config.label}${attendance?.notes ? `: ${attendance.notes}` : ''}`}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center text-xs">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-green-500 shadow-sm"></div>
            <span className="text-muted-foreground">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-red-500 shadow-sm"></div>
            <span className="text-muted-foreground">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-amber-500 shadow-sm"></div>
            <span className="text-muted-foreground">Tardy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-blue-500 shadow-sm"></div>
            <span className="text-muted-foreground">Excused</span>
          </div>
        </div>
      </div>

      {/* Recent Attendance Records */}
      <div className="ocean-card rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="size-5 text-primary" />
          Recent Attendance Records
        </h2>

        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 text-5xl opacity-40">🐋</div>
            <p className="text-muted-foreground">
              No attendance records found for {childName}.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Attendance will appear here once the teacher starts recording.
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
                      ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900'
                      : record.status === 'absent'
                        ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900'
                        : record.status === 'tardy'
                          ? 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900'
                          : 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {new Date(record.date + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {record.courses?.title || 'Unknown Course'}
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
