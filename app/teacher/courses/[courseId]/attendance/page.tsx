'use client'

import { useState, useEffect, useTransition, use } from 'react'
import {
  Calendar,
  Check,
  X,
  Clock,
  AlertCircle,
  Users,
  ChevronDown,
  ChevronUp,
  Save,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  recordAttendance,
  getAttendanceForCourse,
} from '@/app/actions/attendance'

type AttendanceStatus = 'present' | 'absent' | 'tardy' | 'excused'

interface StudentRecord {
  studentId: string
  name: string
  avatarUrl: string | null
  status: AttendanceStatus
  notes: string
  notesExpanded: boolean
}

interface PastRecord {
  id: string
  student_id: string
  date: string
  status: string
  notes: string | null
  profiles: { full_name: string; avatar_url: string | null } | null
}

const STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; color: string; activeColor: string; icon: React.ReactNode }
> = {
  present: {
    label: 'Present',
    color:
      'border-green-300 text-green-700 dark:border-green-700 dark:text-green-400',
    activeColor:
      'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/30',
    icon: <Check className="size-4" />,
  },
  absent: {
    label: 'Absent',
    color:
      'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400',
    activeColor:
      'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30',
    icon: <X className="size-4" />,
  },
  tardy: {
    label: 'Tardy',
    color:
      'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400',
    activeColor:
      'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/30',
    icon: <Clock className="size-4" />,
  },
  excused: {
    label: 'Excused',
    color:
      'border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-400',
    activeColor:
      'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/30',
    icon: <AlertCircle className="size-4" />,
  },
}

export default function TakeAttendancePage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = use(params)

  const [date, setDate] = useState(() => {
    const now = new Date()
    return now.toISOString().split('T')[0]
  })
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [pastRecords, setPastRecords] = useState<PastRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [isPending, startTransition] = useTransition()

  // Fetch enrolled students and past attendance
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        // Fetch past attendance records
        const records = await getAttendanceForCourse(courseId)
        setPastRecords(records as PastRecord[])

        // Extract unique students from past records to build roster
        // In a real app, you'd fetch enrollments. For now, we build from records.
        const studentMap = new Map<
          string,
          { name: string; avatarUrl: string | null }
        >()
        for (const r of records as PastRecord[]) {
          if (!studentMap.has(r.student_id) && r.profiles) {
            studentMap.set(r.student_id, {
              name: r.profiles.full_name || 'Unknown Student',
              avatarUrl: r.profiles.avatar_url,
            })
          }
        }

        // Check if there are already records for the selected date
        const todayRecords = (records as PastRecord[]).filter(
          (r) => r.date === date
        )

        const studentList: StudentRecord[] = Array.from(
          studentMap.entries()
        ).map(([id, info]) => {
          const existing = todayRecords.find((r) => r.student_id === id)
          return {
            studentId: id,
            name: info.name,
            avatarUrl: info.avatarUrl,
            status: (existing?.status as AttendanceStatus) || 'present',
            notes: existing?.notes || '',
            notesExpanded: false,
          }
        })

        setStudents(studentList)
      } catch {
        setFeedback({ type: 'error', message: 'Failed to load attendance data.' })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [courseId, date])

  function toggleStatus(index: number, status: AttendanceStatus) {
    setStudents((prev) =>
      prev.map((s, i) => (i === index ? { ...s, status } : s))
    )
  }

  function toggleNotes(index: number) {
    setStudents((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, notesExpanded: !s.notesExpanded } : s
      )
    )
  }

  function updateNotes(index: number, notes: string) {
    setStudents((prev) =>
      prev.map((s, i) => (i === index ? { ...s, notes } : s))
    )
  }

  function handleSave() {
    setFeedback(null)
    startTransition(async () => {
      try {
        await recordAttendance(
          courseId,
          date,
          students.map((s) => ({
            studentId: s.studentId,
            status: s.status,
            notes: s.notes || undefined,
          }))
        )
        setFeedback({
          type: 'success',
          message: `Attendance saved for ${date}!`,
        })
        // Refresh past records
        const records = await getAttendanceForCourse(courseId)
        setPastRecords(records as PastRecord[])
      } catch {
        setFeedback({
          type: 'error',
          message: 'Failed to save attendance. Please try again.',
        })
      }
    })
  }

  // Group past records by date
  const recordsByDate = pastRecords.reduce(
    (acc, r) => {
      if (!acc[r.date]) acc[r.date] = []
      acc[r.date].push(r)
      return acc
    },
    {} as Record<string, PastRecord[]>
  )
  const sortedDates = Object.keys(recordsByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Take Attendance
        </h1>
        <p className="mt-1 text-muted-foreground">
          Record daily attendance for your students.
        </p>
      </div>

      {/* Date Picker & Summary */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="size-5 text-primary" />
            <label className="text-sm font-medium text-foreground">
              Attendance Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-auto rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4" />
            <span>{students.length} students</span>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`rounded-2xl p-4 text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
              : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="mr-2 inline size-4" />
          ) : (
            <AlertCircle className="mr-2 inline size-4" />
          )}
          {feedback.message}
        </div>
      )}

      {/* Student List */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-3">
          <Users className="size-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Student Roster
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">
              Loading students...
            </p>
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 text-5xl opacity-40">🐋</div>
            <p className="text-muted-foreground">
              No students found for this course.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Students will appear here once they are enrolled and have
              attendance history.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student, index) => (
              <div
                key={student.studentId}
                className="rounded-xl border border-border bg-background/60 p-4 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Student Info */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {student.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <span className="font-medium text-foreground">
                      {student.name}
                    </span>
                  </div>

                  {/* Status Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {(
                      Object.keys(STATUS_CONFIG) as AttendanceStatus[]
                    ).map((status) => {
                      const config = STATUS_CONFIG[status]
                      const isActive = student.status === status
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => toggleStatus(index, status)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                            isActive ? config.activeColor : config.color
                          }`}
                        >
                          {config.icon}
                          {config.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Notes Toggle */}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => toggleNotes(index)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {student.notesExpanded ? (
                      <ChevronUp className="size-3" />
                    ) : (
                      <ChevronDown className="size-3" />
                    )}
                    {student.notes ? 'Edit notes' : 'Add notes'}
                  </button>
                  {student.notesExpanded && (
                    <Textarea
                      placeholder="Optional notes (e.g., left early, arrived at 9:15)..."
                      value={student.notes}
                      onChange={(e) => updateNotes(index, e.target.value)}
                      className="mt-2 rounded-xl text-sm"
                      rows={2}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Save Button */}
        {students.length > 0 && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isPending}
              size="lg"
              className="gap-2"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {isPending ? 'Saving...' : 'Save Attendance'}
            </Button>
          </div>
        )}
      </div>

      {/* Past Attendance Records */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-3">
          <Calendar className="size-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Past Attendance Records
          </h2>
        </div>

        {sortedDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 text-5xl opacity-40">🐺</div>
            <p className="text-muted-foreground">
              No past attendance records yet.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Student
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedDates.slice(0, 10).flatMap((dateKey) =>
                  recordsByDate[dateKey].map((record, idx) => (
                    <tr
                      key={`${dateKey}-${record.student_id}-${idx}`}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3 text-foreground">
                        {new Date(dateKey + 'T00:00:00').toLocaleDateString(
                          'en-US',
                          {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {record.profiles?.full_name || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge
                          status={record.status as AttendanceStatus}
                        />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {record.notes || '--'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
  const colors: Record<AttendanceStatus, string> = {
    present:
      'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
    absent:
      'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
    tardy:
      'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    excused:
      'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || ''}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
