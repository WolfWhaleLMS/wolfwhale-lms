'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStudentAssignments } from '@/app/actions/assignments'
import { ASSIGNMENT_TYPES } from '@/lib/config/constants'
import { Clock, CheckCircle, AlertCircle, ListTodo, RotateCcw, ChevronRight } from 'lucide-react'

interface StudentAssignment {
  id: string
  title: string
  description: string | null
  type: string
  due_date: string | null
  max_points: number
  submission_type: string
  course_id: string
  courseName: string
  submissionStatus: string
  submittedAt: string | null
  grade: {
    points_earned: number
    percentage: number
    feedback: string | null
  } | null
}

type SortKey = 'due_date' | 'title' | 'course' | 'status'

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: {
      label: 'Pending',
      className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    },
    submitted: {
      label: 'Submitted',
      className: 'bg-[#00BFFF]/10 text-[#00BFFF] dark:bg-[#00BFFF]/15 dark:text-[#00BFFF]',
    },
    graded: {
      label: 'Graded',
      className: 'bg-[#33FF33]/10 text-[#059669] dark:bg-[#33FF33]/15 dark:text-[#059669]',
    },
    overdue: {
      label: 'Overdue',
      className: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
    },
    late: {
      label: 'Late',
      className: 'bg-[#FFAA00]/10 text-[#D97706] dark:bg-[#FFAA00]/15 dark:text-[#FFD700]',
    },
    returned: {
      label: 'Returned',
      className: 'bg-[#FFAA00]/10 text-[#D97706] dark:bg-[#FFAA00]/15 dark:text-[#FFD700]',
    },
  }

  const c = config[status] || config.pending
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.className}`}>
      {c.label}
    </span>
  )
}

function TypeBadge({ type }: { type: string }) {
  const typeConfig = ASSIGNMENT_TYPES.find((t) => t.value === type)
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
      {typeConfig?.label || type}
    </span>
  )
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'No due date'
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  const formatted = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  if (diffDays < 0) return formatted
  if (diffDays === 0) return `Today - ${formatted}`
  if (diffDays === 1) return `Tomorrow - ${formatted}`
  if (diffDays <= 7) return `${diffDays} days - ${formatted}`
  return formatted
}

function isDueSoon(dateStr: string | null) {
  if (!dateStr) return false
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays >= 0 && diffDays <= 3
}

export default function StudentAssignmentsPage() {
  const router = useRouter()
  const [assignments, setAssignments] = useState<StudentAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('due_date')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    loadAssignments()
  }, [])

  async function loadAssignments() {
    setLoading(true)
    const result = await getStudentAssignments()
    if (result.error) {
      setError(result.error)
    } else {
      setAssignments(result.data || [])
    }
    setLoading(false)
  }

  const filteredAssignments = assignments
    .filter((a) => filterStatus === 'all' || a.submissionStatus === filterStatus)
    .sort((a, b) => {
      switch (sortKey) {
        case 'due_date':
          if (!a.due_date) return 1
          if (!b.due_date) return -1
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        case 'course':
          return a.courseName.localeCompare(b.courseName)
        case 'status':
          return a.submissionStatus.localeCompare(b.submissionStatus)
        default:
          return 0
      }
    })

  const statusCounts = {
    all: assignments.length,
    pending: assignments.filter((a) => a.submissionStatus === 'pending').length,
    submitted: assignments.filter((a) => a.submissionStatus === 'submitted').length,
    graded: assignments.filter((a) => a.submissionStatus === 'graded').length,
    overdue: assignments.filter((a) => a.submissionStatus === 'overdue').length,
    returned: assignments.filter((a) => a.submissionStatus === 'returned').length,
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Assignments</h1>
          <p className="mt-1 text-muted-foreground">Loading your assignments...</p>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="ocean-card animate-pulse rounded-2xl p-6">
              <div className="h-5 w-48 rounded bg-muted" />
              <div className="mt-2 h-4 w-32 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const totalAssignments = assignments.length
  const completedCount = assignments.filter(a => a.submissionStatus === 'graded').length
  const pendingCount = assignments.filter(a => a.submissionStatus === 'pending').length
  const overdueCount = assignments.filter(a => a.submissionStatus === 'overdue').length

  return (
    <div className="space-y-8">
      {/* Visual Header with Whale Gradient */}
      <div className="whale-gradient rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <ListTodo className="h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-tight">My Assignments</h1>
        </div>
        <p className="text-white/90">
          View and submit assignments across all your courses.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Enhanced Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-lg">
          <div className="mb-2 flex items-center justify-center">
            <ListTodo className="h-6 w-6 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary">{totalAssignments}</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">Total Assignments</p>
        </div>
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-lg">
          <div className="mb-2 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-[#059669] dark:text-[#059669]" />
          </div>
          <p className="text-3xl font-bold text-[#059669] dark:text-[#059669]">{completedCount}</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">Completed</p>
        </div>
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-lg">
          <div className="mb-2 flex items-center justify-center">
            <Clock className="h-6 w-6 text-[#00BFFF] dark:text-[#00BFFF]" />
          </div>
          <p className="text-3xl font-bold text-[#00BFFF] dark:text-[#00BFFF]">{pendingCount}</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">Pending</p>
        </div>
        <div className={`ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 ${
          overdueCount > 0 ? 'ring-2 ring-red-500/50 glow-animate' : ''
        }`}>
          <div className="mb-2 flex items-center justify-center">
            <AlertCircle className={`h-6 w-6 ${overdueCount > 0 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-red-600/50 dark:text-red-400/50'}`} />
          </div>
          <p className={`text-3xl font-bold ${overdueCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-red-600/50 dark:text-red-400/50'}`}>{overdueCount}</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">Overdue</p>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          {(['all', 'pending', 'submitted', 'graded', 'returned', 'overdue'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Sort:</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:border-primary focus:outline-none"
          >
            <option value="due_date">Due Date</option>
            <option value="title">Title</option>
            <option value="course">Course</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <div className="ocean-card relative overflow-hidden rounded-2xl py-16 text-center">
          <div className="blob-ocean absolute left-1/3 top-0 h-48 w-48 opacity-20" />
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="mb-3 text-6xl">📝</div>
            <p className="text-xl font-bold text-foreground">
              {assignments.length === 0 ? 'All Clear!' : 'No matching assignments'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {assignments.length === 0
                ? 'Assignments from your enrolled courses will appear here.'
                : 'Try changing the filter to see more assignments.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAssignments.map((assignment) => {
            const isOverdue = assignment.submissionStatus === 'overdue'
            const isDueToday = assignment.due_date && new Date(assignment.due_date).toDateString() === new Date().toDateString()
            const isUpcoming = !isOverdue && !isDueToday

            const isReturnedAssignment = assignment.submissionStatus === 'returned'

            const cardClasses = `ocean-card w-full rounded-2xl p-5 text-left transition-all hover:scale-[1.01] hover:shadow-xl relative overflow-hidden ${
              isOverdue ? 'ring-2 ring-red-500/50' :
              isDueToday ? 'ring-2 ring-amber-500/50' :
              isReturnedAssignment ? 'ring-2 ring-orange-500/50' :
              'ring-1 ring-transparent hover:ring-primary/20'
            }`

            return (
              <button
                key={assignment.id}
                onClick={() => router.push(`/student/assignments/${assignment.id}`)}
                className={cardClasses}
              >
                {/* Status indicator stripe */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  isOverdue ? 'bg-gradient-to-b from-red-500 to-red-600' :
                  isDueToday ? 'bg-gradient-to-b from-[#FFAA00] to-[#FFD700]' :
                  assignment.submissionStatus === 'graded' ? 'bg-gradient-to-b from-[#33FF33] to-[#00FFFF]' :
                  assignment.submissionStatus === 'returned' ? 'bg-gradient-to-b from-[#FFAA00] to-[#FFD700]' :
                  'bg-gradient-to-b from-[#00BFFF] to-[#00FFFF]'
                }`} />

                <div className="flex items-start justify-between gap-4 pl-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isOverdue && <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />}
                      {isDueToday && <Clock className="h-5 w-5 text-[#D97706]" />}
                      {assignment.submissionStatus === 'graded' && <CheckCircle className="h-5 w-5 text-[#059669]" />}
                      {assignment.submissionStatus === 'returned' && <RotateCcw className="h-5 w-5 text-[#D97706]" />}
                      <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                      <TypeBadge type={assignment.type} />
                      <StatusBadge status={assignment.submissionStatus} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {assignment.courseName}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs">
                      <span className={`flex items-center gap-1 ${
                        isOverdue ? 'font-bold text-red-600 dark:text-red-400' :
                        isDueToday ? 'font-bold text-[#D97706] dark:text-[#FFD700]' :
                        isDueSoon(assignment.due_date) ? 'font-medium text-[#D97706] dark:text-[#FFD700]' :
                        'text-muted-foreground'
                      }`}>
                        <Clock className="h-3 w-3" />
                        {formatDate(assignment.due_date)}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <span className="text-lg">⭐</span>
                        {assignment.max_points} points
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {assignment.grade ? (
                      <div className="rounded-lg bg-gradient-to-br from-[#33FF33]/10 to-[#00FFFF]/10 px-3 py-2">
                        <p className="text-lg font-bold text-[#059669] dark:text-[#059669]">
                          {assignment.grade.points_earned}/{assignment.grade.percentage}
                        </p>
                        <p className="text-xs font-semibold text-[#059669]/80 dark:text-[#059669]/80">
                          {Math.round((assignment.grade.points_earned / assignment.grade.percentage) * 100)}%
                        </p>
                      </div>
                    ) : (
                      <ChevronRight className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
