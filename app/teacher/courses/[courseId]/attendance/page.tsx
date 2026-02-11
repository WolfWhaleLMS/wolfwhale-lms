'use client'

import { useState, useEffect, useTransition, use } from 'react'
import Link from 'next/link'
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
  ArrowLeft,
  CheckCheck,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
      'border-2 border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950/20',
    activeColor:
      'bg-green-500 text-white border-2 border-green-600 shadow-lg shadow-green-500/30 scale-105',
    icon: <Check className="size-5" />,
  },
  absent: {
    label: 'Absent',
    color:
      'border-2 border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-400 dark:bg-red-950/20',
    activeColor:
      'bg-red-500 text-white border-2 border-red-600 shadow-lg shadow-red-500/30 scale-105',
    icon: <X className="size-5" />,
  },
  tardy: {
    label: 'Tardy',
    color:
      'border-2 border-rose-200 text-rose-700 bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:bg-rose-950/20',
    activeColor:
      'bg-rose-500 text-white border-2 border-rose-600 shadow-lg shadow-rose-500/30 scale-105',
    icon: <Clock className="size-5" />,
  },
  excused: {
    label: 'Excused',
    color:
      'border-2 border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-950/20',
    activeColor:
      'bg-blue-500 text-white border-2 border-blue-600 shadow-lg shadow-blue-500/30 scale-105',
    icon: <AlertCircle className="size-5" />,
  },
}

// Mock data in case DB is empty
const MOCK_STUDENTS: StudentRecord[] = [
  {
    studentId: 'mock-1',
    name: 'Emma Wilson',
    avatarUrl: null,
    status: 'present',
    notes: '',
    notesExpanded: false,
  },
  {
    studentId: 'mock-2',
    name: 'Liam Johnson',
    avatarUrl: null,
    status: 'present',
    notes: '',
    notesExpanded: false,
  },
  {
    studentId: 'mock-3',
    name: 'Olivia Brown',
    avatarUrl: null,
    status: 'present',
    notes: '',
    notesExpanded: false,
  },
  {
    studentId: 'mock-4',
    name: 'Noah Davis',
    avatarUrl: null,
    status: 'present',
    notes: '',
    notesExpanded: false,
  },
  {
    studentId: 'mock-5',
    name: 'Ava Martinez',
    avatarUrl: null,
    status: 'present',
    notes: '',
    notesExpanded: false,
  },
]

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
    type: 'success' | 'error' | 'saving'
    message: string
  } | null>(null)
  const [isPending, startTransition] = useTransition()
  const [courseName] = useState('Marine Biology 101') // Mock course name

  // Fetch enrolled students and past attendance
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        // Fetch past attendance records
        const records = await getAttendanceForCourse(courseId)
        setPastRecords(records as PastRecord[])

        // Extract unique students from past records to build roster
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

        let studentList: StudentRecord[] = []

        if (studentMap.size > 0) {
          studentList = Array.from(studentMap.entries()).map(([id, info]) => {
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
        } else {
          // Use mock data if no real data
          studentList = MOCK_STUDENTS
        }

        setStudents(studentList)
      } catch {
        // Use mock data on error
        setStudents(MOCK_STUDENTS)
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

  function markAllPresent() {
    setStudents((prev) => prev.map((s) => ({ ...s, status: 'present' })))
  }

  function handleSave() {
    setFeedback({ type: 'saving', message: 'Saving attendance...' })
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
          message: 'Saved!',
        })
        setTimeout(() => setFeedback(null), 3000)
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

  // Calculate stats for today
  const stats = {
    total: students.length,
    present: students.filter((s) => s.status === 'present').length,
    absent: students.filter((s) => s.status === 'absent').length,
    tardy: students.filter((s) => s.status === 'tardy').length,
    excused: students.filter((s) => s.status === 'excused').length,
  }

  const presentPercentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href={`/teacher/courses/${courseId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Course
      </Link>

      {/* Visual Header with Course Name and Date */}
      <div className="whale-gradient rounded-2xl p-8 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Take Attendance
            </h1>
            <p className="mt-2 text-white/90 text-lg font-medium">
              {courseName}
            </p>
            <p className="mt-1 text-white/70 text-sm">
              {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <Calendar className="size-16 opacity-20" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="ocean-card rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="size-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          <p className="mt-1 text-sm text-muted-foreground">Total Students</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center mb-2">
            <Check className="size-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.present}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Present Today</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center mb-2">
            <X className="size-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {stats.absent}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Absent Today</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="size-5 text-rose-600 dark:text-rose-400" />
          </div>
          <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">
            {stats.tardy}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Tardy Today</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertCircle className="size-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.excused}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Excused Today</p>
        </div>
      </div>

      {/* Date Picker & Quick Actions */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-foreground">
              Select Date:
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-auto rounded-xl"
            />
          </div>
          <Button
            onClick={markAllPresent}
            variant="outline"
            className="gap-2"
          >
            <CheckCheck className="size-4" />
            Mark All Present
          </Button>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`rounded-2xl p-4 text-sm font-medium flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
              : feedback.type === 'saving'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
              : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
          }`}
        >
          {feedback.type === 'saving' ? (
            <Loader2 className="size-4 animate-spin" />
          ) : feedback.type === 'success' ? (
            <Check className="size-4" />
          ) : (
            <AlertCircle className="size-4" />
          )}
          {feedback.message}
        </div>
      )}

      {/* Student Cards */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="size-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Student Roster
            </h2>
          </div>
          {students.length > 0 && (
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
          )}
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
              Students will appear here once they are enrolled.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((student, index) => (
              <div
                key={student.studentId}
                className="ocean-card rounded-xl p-5 transition-all duration-200 hover:shadow-lg border border-border"
              >
                {/* Student Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-lg font-bold text-white shadow-lg">
                    {student.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground leading-tight">
                      {student.name}
                    </p>
                  </div>
                </div>

                {/* Status Buttons Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {(Object.keys(STATUS_CONFIG) as AttendanceStatus[]).map(
                    (status) => {
                      const config = STATUS_CONFIG[status]
                      const isActive = student.status === status
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => toggleStatus(index, status)}
                          className={`flex flex-col items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-xs font-bold transition-all duration-200 ${
                            isActive ? config.activeColor : config.color
                          } hover:scale-105`}
                        >
                          {config.icon}
                          {config.label}
                        </button>
                      )
                    }
                  )}
                </div>

                {/* Notes Section */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleNotes(index)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
                  >
                    {student.notesExpanded ? (
                      <ChevronUp className="size-3.5" />
                    ) : (
                      <ChevronDown className="size-3.5" />
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
      </div>

      {/* Summary Bar at Bottom */}
      {students.length > 0 && (
        <div className="ocean-card rounded-2xl p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="size-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Today's Summary
                </p>
                <p className="text-xs text-muted-foreground">
                  {stats.present} of {stats.total} students present ({presentPercentage}%)
                </p>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-green-500"></div>
                <span className="text-muted-foreground">
                  {Math.round((stats.present / stats.total) * 100)}% Present
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-500"></div>
                <span className="text-muted-foreground">
                  {Math.round((stats.absent / stats.total) * 100)}% Absent
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-rose-500"></div>
                <span className="text-muted-foreground">
                  {Math.round((stats.tardy / stats.total) * 100)}% Tardy
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
