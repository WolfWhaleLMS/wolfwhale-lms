'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAssignments, deleteAssignment } from '@/app/actions/assignments'
import { ASSIGNMENT_TYPES } from '@/lib/config/constants'
import { ArrowLeft } from 'lucide-react'

interface Assignment {
  id: string
  title: string
  type: string
  due_date: string | null
  points_possible: number
  status: string
  submissionCount: number
  averageScore: number | null
  gradedCount: number
  created_at: string
}

function TypeBadge({ type }: { type: string }) {
  const typeConfig = ASSIGNMENT_TYPES.find((t) => t.value === type)
  const label = typeConfig?.label || type

  const colorMap: Record<string, string> = {
    homework: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    quiz: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
    project: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
    exam: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
    discussion: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    presentation: 'bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300',
    other: 'bg-gray-100 text-gray-700 dark:bg-gray-950/40 dark:text-gray-300',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[type] || colorMap.other}`}>
      {label}
    </span>
  )
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'No due date'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function isPastDue(dateStr: string | null) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

export default function TeacherAssignmentsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string

  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadAssignments()
  }, [courseId])

  async function loadAssignments() {
    setLoading(true)
    const result = await getAssignments(courseId)
    if (result.error) {
      setError(result.error)
    } else {
      setAssignments(result.data || [])
    }
    setLoading(false)
  }

  async function handleDelete(assignmentId: string) {
    if (!confirm('Are you sure you want to delete this assignment? This will also delete all submissions and grades.')) {
      return
    }
    setDeleting(assignmentId)
    const result = await deleteAssignment(assignmentId)
    if (result.error) {
      alert(result.error)
    } else {
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId))
    }
    setDeleting(null)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Assignments</h1>
            <p className="mt-1 text-muted-foreground">Loading assignments...</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="ocean-card animate-pulse rounded-2xl p-6">
              <div className="h-6 w-48 rounded bg-muted" />
              <div className="mt-2 h-4 w-32 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href={`/teacher/courses/${courseId}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Course
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Assignments</h1>
          <p className="mt-1 text-muted-foreground">
            {assignments.length} assignment{assignments.length !== 1 ? 's' : ''} in this course
          </p>
        </div>
        <button
          onClick={() => router.push(`/teacher/courses/${courseId}/assignments/new`)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Assignment
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Assignments List */}
      {assignments.length === 0 ? (
        <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
          <div className="mb-3 text-5xl opacity-40">📝</div>
          <p className="text-lg font-medium text-foreground">No assignments yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first assignment to get started.
          </p>
          <button
            onClick={() => router.push(`/teacher/courses/${courseId}/assignments/new`)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Create Assignment
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="ocean-card rounded-2xl p-6 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {assignment.title}
                    </h3>
                    <TypeBadge type={assignment.type} />
                    {assignment.status === 'draft' && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className={isPastDue(assignment.due_date) ? 'text-red-500' : ''}>
                      Due: {formatDate(assignment.due_date)}
                    </span>
                    <span>Points: {assignment.points_possible}</span>
                    <span>{assignment.submissionCount} submission{assignment.submissionCount !== 1 ? 's' : ''}</span>
                    {assignment.averageScore !== null && (
                      <span>Avg: {assignment.averageScore}%</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/teacher/courses/${courseId}/assignments/${assignment.id}/submissions`)}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    View Submissions
                  </button>
                  <button
                    onClick={() => handleDelete(assignment.id)}
                    disabled={deleting === assignment.id}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    {deleting === assignment.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
