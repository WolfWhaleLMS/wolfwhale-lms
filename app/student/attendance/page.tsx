import {
  Calendar,
  Check,
  X,
  Clock,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'
import { getStudentAttendance, getAttendanceSummary } from '@/app/actions/attendance'

type AttendanceStatus = 'present' | 'absent' | 'tardy' | 'excused' | 'online'

interface AttendanceRecord {
  id: string
  date: string
  status: AttendanceStatus
  notes: string | null
  courses: { title: string } | null
  course_id: string
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

export default async function StudentAttendancePage() {
  const [records, summary] = await Promise.all([
    getStudentAttendance(),
    getAttendanceSummary(),
  ])

  const typedRecords = records as AttendanceRecord[]

  // Group records by course
  const byCourse = typedRecords.reduce(
    (acc, r) => {
      const courseName = r.courses?.title || 'Unknown Course'
      if (!acc[courseName]) acc[courseName] = []
      acc[courseName].push(r)
      return acc
    },
    {} as Record<string, AttendanceRecord[]>
  )

  // Calculate circumference for circular progress
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const progressOffset = circumference - (summary.rate / 100) * circumference

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          My Attendance
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track your attendance records across all courses.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="ocean-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-primary">{summary.total}</p>
          <p className="mt-1 text-sm text-muted-foreground">Total Days</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {summary.present}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Present</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {summary.absent}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Absent</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {summary.tardy}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Tardy</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {summary.excused}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Excused</p>
        </div>
      </div>

      {/* Attendance Rate Circle */}
      <div className="ocean-card rounded-2xl p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
          {/* Circular Progress */}
          <div className="relative flex-shrink-0">
            <svg width="140" height="140" className="-rotate-90">
              <circle
                cx="70"
                cy="70"
                r={radius}
                strokeWidth="10"
                fill="none"
                className="stroke-muted"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
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
              <span className="text-3xl font-bold text-foreground">
                {summary.rate}%
              </span>
              <span className="text-xs text-muted-foreground">Rate</span>
            </div>
          </div>

          {/* Rate Details */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold text-foreground">
              Attendance Rate
            </h2>
            <p className="mt-1 text-muted-foreground">
              {summary.rate >= 95
                ? 'Excellent attendance! Keep up the great work.'
                : summary.rate >= 90
                  ? 'Great attendance. Stay consistent!'
                  : summary.rate >= 75
                    ? 'Your attendance could use improvement.'
                    : summary.total === 0
                      ? 'No attendance records yet.'
                      : 'Your attendance needs attention. Talk to your teacher.'}
            </p>
            <div className="mt-3 flex items-center justify-center gap-1 sm:justify-start">
              <TrendingUp className="size-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {summary.present} of {summary.total} days present
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Records by Course */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Calendar className="size-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Recent Records
          </h2>
        </div>

        {Object.keys(byCourse).length === 0 ? (
          <div className="ocean-card rounded-2xl p-8">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 text-5xl opacity-40">🐋</div>
              <p className="text-muted-foreground">
                No attendance records found.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your attendance will appear here once your teacher starts
                recording.
              </p>
            </div>
          </div>
        ) : (
          Object.entries(byCourse).map(([courseName, courseRecords]) => (
            <div key={courseName} className="ocean-card rounded-2xl p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                {courseName}
              </h3>
              <div className="space-y-2">
                {courseRecords.slice(0, 20).map((record) => {
                  const config =
                    STATUS_CONFIG[record.status] || STATUS_CONFIG.present
                  return (
                    <div
                      key={record.id}
                      className="flex items-center justify-between rounded-xl bg-muted/50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {new Date(
                            record.date + 'T00:00:00'
                          ).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        {record.notes && (
                          <span className="text-xs text-muted-foreground italic">
                            {record.notes}
                          </span>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bgColor} ${config.textColor}`}
                      >
                        {config.icon}
                        {config.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
