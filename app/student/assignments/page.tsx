'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStudentAssignments } from '@/app/actions/assignments'
import { ASSIGNMENT_TYPES } from '@/lib/config/constants'

interface StudentAssignment {
  id: string
  title: string
  description: string | null
  type: string
  due_date: string | null
  points_possible: number
  submission_type: string
  course_id: string
  courseTitle: string
  submissionStatus: string
  submittedAt: string | null
  grade: {
    score: number
    max_score: number
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
      className: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    },
    graded: {
      label: 'Graded',
      className: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
    },
    overdue: {
      label: 'Overdue',
      className: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
    },
    late: {
      label: 'Late',
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
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
          return a.courseTitle.localeCompare(b.courseTitle)
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Assignments</h1>
        <p className="mt-1 text-muted-foreground">
          View and submit assignments across all your courses.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="ocean-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">{statusCounts.pending}</p>
          <p className="mt-1 text-xs text-muted-foreground">Pending</p>
        </div>
        <div className="ocean-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statusCounts.submitted}</p>
          <p className="mt-1 text-xs text-muted-foreground">Submitted</p>
        </div>
        <div className="ocean-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{statusCounts.graded}</p>
          <p className="mt-1 text-xs text-muted-foreground">Graded</p>
        </div>
        <div className="ocean-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{statusCounts.overdue}</p>
          <p className="mt-1 text-xs text-muted-foreground">Overdue</p>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          {(['all', 'pending', 'submitted', 'graded', 'overdue'] as const).map((status) => (
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
        <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
          <div className="mb-3 text-5xl opacity-40">📝</div>
          <p className="text-lg font-medium text-foreground">
            {assignments.length === 0 ? 'No assignments yet' : 'No matching assignments'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {assignments.length === 0
              ? 'Assignments from your enrolled courses will appear here.'
              : 'Try changing the filter to see more assignments.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredAssignments.map((assignment) => (
            <button
              key={assignment.id}
              onClick={() => router.push(`/student/assignments/${assignment.id}`)}
              className="ocean-card w-full rounded-2xl p-5 text-left transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                    <TypeBadge type={assignment.type} />
                    <StatusBadge status={assignment.submissionStatus} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {assignment.courseTitle}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className={isDueSoon(assignment.due_date) ? 'font-medium text-amber-600 dark:text-amber-400' : ''}>
                      {formatDate(assignment.due_date)}
                    </span>
                    <span>{assignment.points_possible} points</span>
                  </div>
                </div>
                <div className="text-right">
                  {assignment.grade ? (
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {assignment.grade.score}/{assignment.grade.max_score}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round((assignment.grade.score / assignment.grade.max_score) * 100)}%
                      </p>
                    </div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
