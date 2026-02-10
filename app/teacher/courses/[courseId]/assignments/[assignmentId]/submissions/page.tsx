'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSubmissions, gradeSubmission, returnSubmission } from '@/app/actions/submissions'
import { getLetterGrade, ASSIGNMENT_TYPES } from '@/lib/config/constants'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ClipboardList,
  CheckCircle2,
  Clock,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
  Send,
  RotateCcw,
  X,
  AlertTriangle,
  BarChart3,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Submission {
  id: string
  student_id: string
  content: string | null
  file_urls: string[] | null
  submitted_at: string
  status: string
  is_late: boolean
  return_feedback?: string | null
  studentName: string
  studentEmail: string
  studentAvatar: string | null
  grade: {
    score: number
    max_score: number
    feedback: string | null
    letter_grade: string | null
    rubric_scores: unknown
  } | null
}

interface AssignmentInfo {
  id: string
  title: string
  pointsPossible: number
  type: string
  dueDate: string | null
  courseId: string
  courseTitle: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'No date'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatFullDate(dateStr: string | null) {
  if (!dateStr) return 'No due date'
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
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

// ---------------------------------------------------------------------------
// StatusBadge
// ---------------------------------------------------------------------------

function StatusBadge({ status, isLate }: { status: string; isLate: boolean }) {
  const config: Record<string, { label: string; className: string }> = {
    submitted: {
      label: 'Submitted',
      className: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    },
    graded: {
      label: 'Graded',
      className: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
    },
    returned: {
      label: 'Returned',
      className: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
    },
    draft: {
      label: 'Draft',
      className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    },
  }

  return (
    <div className="flex items-center gap-1.5">
      {isLate && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
          <AlertTriangle className="h-3 w-3" />
          Late
        </span>
      )}
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          config[status]?.className || config.draft.className
        }`}
      >
        {config[status]?.label || status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// GradingPanel - inline grading for a submission
// ---------------------------------------------------------------------------

function GradingPanel({
  submission,
  maxPoints,
  onGrade,
  onReturn,
  onClose,
}: {
  submission: Submission
  maxPoints: number
  onGrade: (submissionId: string, score: number, feedback: string) => Promise<void>
  onReturn: (submissionId: string, feedback: string) => Promise<void>
  onClose: () => void
}) {
  const [score, setScore] = useState(submission.grade?.score?.toString() || '')
  const [feedback, setFeedback] = useState(submission.grade?.feedback || '')
  const [returnFeedback, setReturnFeedback] = useState('')
  const [saving, setSaving] = useState(false)
  const [returning, setReturning] = useState(false)
  const [showReturnForm, setShowReturnForm] = useState(false)

  const numScore = parseFloat(score)
  const percentage = !isNaN(numScore) && maxPoints > 0 ? (numScore / maxPoints) * 100 : 0
  const autoLetterGrade = !isNaN(numScore) && maxPoints > 0 ? getLetterGrade(percentage) : '--'

  async function handleSaveGrade() {
    if (isNaN(numScore) || numScore < 0 || numScore > maxPoints) {
      toast.error(`Score must be between 0 and ${maxPoints}`)
      return
    }
    setSaving(true)
    await onGrade(submission.id, numScore, feedback)
    setSaving(false)
  }

  async function handleReturn() {
    if (!returnFeedback.trim()) {
      toast.error('Please provide feedback when returning a submission')
      return
    }
    setReturning(true)
    await onReturn(submission.id, returnFeedback.trim())
    setReturning(false)
    setShowReturnForm(false)
  }

  return (
    <div className="ocean-card mt-6 overflow-hidden rounded-2xl border-2 border-primary/20">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{submission.studentName}</h3>
            <p className="text-xs text-muted-foreground">{submission.studentEmail}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6">
        {/* Submission Content */}
        <div className="mb-6">
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">Submission Content</h4>
          {submission.content ? (
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="whitespace-pre-wrap text-sm text-foreground">{submission.content}</p>
            </div>
          ) : (
            <p className="text-sm italic text-muted-foreground">No text content submitted</p>
          )}

          {submission.file_urls && submission.file_urls.length > 0 && (
            <div className="mt-3">
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Attached Files</h4>
              <div className="space-y-2">
                {submission.file_urls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary transition-colors hover:bg-muted"
                  >
                    <ExternalLink className="h-4 w-4" />
                    File {i + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span>Submitted: {formatDate(submission.submitted_at)}</span>
            {submission.is_late && (
              <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-3 w-3" />
                Late submission
              </span>
            )}
          </div>
        </div>

        {/* Grading Form */}
        <div className="rounded-xl border border-border bg-muted/10 p-5">
          <h4 className="mb-4 text-sm font-semibold text-foreground">Grade this submission</h4>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Score Input */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Score
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max={maxPoints}
                  step="0.5"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="0"
                  className="w-24 rounded-xl border border-border bg-background px-3 py-2.5 text-center text-lg font-bold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">/ {maxPoints}</span>
              </div>
            </div>

            {/* Percentage */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Percentage
              </label>
              <div className="flex h-[46px] items-center rounded-xl border border-border bg-muted/30 px-4">
                <span className="text-lg font-bold text-foreground">
                  {!isNaN(numScore) ? Math.round(percentage) : '--'}%
                </span>
              </div>
            </div>

            {/* Letter Grade */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Letter Grade
              </label>
              <div className="flex h-[46px] items-center justify-center rounded-xl border border-border bg-muted/30 px-4">
                <span className="text-xl font-bold text-primary">{autoLetterGrade}</span>
              </div>
            </div>
          </div>

          {/* Score Slider */}
          {maxPoints > 0 && (
            <div className="mt-4">
              <input
                type="range"
                min="0"
                max={maxPoints}
                step="0.5"
                value={isNaN(numScore) ? 0 : numScore}
                onChange={(e) => setScore(e.target.value)}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>{maxPoints}</span>
              </div>
            </div>
          )}

          {/* Feedback */}
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Feedback (optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write constructive feedback for the student..."
              rows={4}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={handleSaveGrade}
              disabled={saving || !score}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {submission.grade ? 'Update Grade' : 'Save Grade'}
                </>
              )}
            </button>

            {!showReturnForm && submission.status !== 'returned' && (
              <button
                onClick={() => setShowReturnForm(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-orange-300 px-4 py-2.5 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950/30"
              >
                <RotateCcw className="h-4 w-4" />
                Return for Revision
              </button>
            )}
          </div>
        </div>

        {/* Return for Revision Form */}
        {showReturnForm && (
          <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50/50 p-5 dark:border-orange-800 dark:bg-orange-950/20">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-700 dark:text-orange-300">
              <RotateCcw className="h-4 w-4" />
              Return for Revision
            </h4>
            <textarea
              value={returnFeedback}
              onChange={(e) => setReturnFeedback(e.target.value)}
              placeholder="Explain what the student needs to revise..."
              rows={3}
              className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 dark:border-orange-800 dark:bg-background"
            />
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleReturn}
                disabled={returning}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
              >
                {returning ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Returning...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Return to Student
                  </>
                )}
              </button>
              <button
                onClick={() => setShowReturnForm(false)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function TeacherSubmissionsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const assignmentId = params.assignmentId as string

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [assignment, setAssignment] = useState<AssignmentInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const loadSubmissions = useCallback(async () => {
    setLoading(true)
    const result = await getSubmissions(assignmentId)
    if (result.error) {
      setError(result.error)
    } else {
      setSubmissions(result.data || [])
      setAssignment(result.assignment || null)
    }
    setLoading(false)
  }, [assignmentId])

  useEffect(() => {
    loadSubmissions()
  }, [loadSubmissions])

  async function handleGrade(submissionId: string, score: number, feedback: string) {
    const result = await gradeSubmission(submissionId, score, feedback)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Grade saved successfully')
      await loadSubmissions()
    }
  }

  async function handleReturn(submissionId: string, feedback: string) {
    const result = await returnSubmission(submissionId, feedback)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Submission returned to student for revision')
      setSelectedSubmissionId(null)
      await loadSubmissions()
    }
  }

  // Stats
  const gradedCount = submissions.filter((s) => s.grade).length
  const lateCount = submissions.filter((s) => s.is_late).length
  const returnedCount = submissions.filter((s) => s.status === 'returned').length
  const averageScore =
    gradedCount > 0
      ? submissions
          .filter((s) => s.grade)
          .reduce((sum, s) => sum + (s.grade?.score || 0), 0) / gradedCount
      : 0

  // Filtering
  const filteredSubmissions = submissions.filter((s) => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'graded') return !!s.grade
    if (filterStatus === 'ungraded') return !s.grade && s.status !== 'returned'
    if (filterStatus === 'late') return s.is_late
    if (filterStatus === 'returned') return s.status === 'returned'
    return true
  })

  const typeLabel =
    ASSIGNMENT_TYPES.find((t) => t.value === assignment?.type)?.label || assignment?.type || ''

  // Loading State
  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-6 h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="ocean-card animate-pulse rounded-2xl p-5 text-center">
              <div className="mx-auto h-8 w-12 rounded bg-muted" />
              <div className="mx-auto mt-2 h-3 w-20 rounded bg-muted" />
            </div>
          ))}
        </div>
        <div className="ocean-card animate-pulse rounded-2xl p-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 py-4">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="flex-1">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="mt-1 h-3 w-24 rounded bg-muted" />
              </div>
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
        href={`/teacher/courses/${courseId}/assignments`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assignments
      </Link>

      {/* Whale Gradient Header */}
      <div className="whale-gradient overflow-hidden rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <ClipboardList className="h-8 w-8" />
              <h1 className="text-3xl font-bold tracking-tight">
                {assignment?.title || 'Submissions'}
              </h1>
            </div>
            <p className="text-white/90">
              {assignment?.courseTitle}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm">
                <Award className="h-3.5 w-3.5" />
                {assignment?.pointsPossible} points
              </span>
              <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm">
                {typeLabel}
              </span>
              {assignment?.dueDate && (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm ${
                  isPastDue(assignment.dueDate) ? 'bg-red-500/30' : 'bg-white/20'
                }`}>
                  <Clock className="h-3.5 w-3.5" />
                  Due: {formatFullDate(assignment.dueDate)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-lg">
          <div className="mb-2 flex items-center justify-center">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary">{submissions.length}</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">Total Submissions</p>
        </div>
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-lg">
          <div className="mb-2 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{gradedCount}</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">Graded</p>
        </div>
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-lg">
          <div className="mb-2 flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {gradedCount > 0
              ? `${Math.round(averageScore)}/${assignment?.pointsPossible}`
              : '--'}
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">Average Score</p>
        </div>
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-lg">
          <div className="mb-2 flex items-center justify-center">
            <Clock className={`h-6 w-6 ${lateCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-amber-600/50 dark:text-amber-400/50'}`} />
          </div>
          <p className={`text-3xl font-bold ${lateCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-amber-600/50 dark:text-amber-400/50'}`}>
            {lateCount}
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">Late</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Filter:</span>
        {[
          { key: 'all', label: 'All', count: submissions.length },
          { key: 'ungraded', label: 'Ungraded', count: submissions.filter((s) => !s.grade && s.status !== 'returned').length },
          { key: 'graded', label: 'Graded', count: gradedCount },
          { key: 'late', label: 'Late', count: lateCount },
          { key: 'returned', label: 'Returned', count: returnedCount },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filterStatus === f.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Submissions Table */}
      {filteredSubmissions.length === 0 ? (
        <div className="ocean-card relative flex flex-col items-center justify-center overflow-hidden rounded-2xl py-16 text-center">
          <div className="blob-ocean absolute left-1/3 top-0 h-48 w-48 opacity-20" />
          <div className="relative z-10 flex flex-col items-center">
            <ClipboardList className="mb-3 h-16 w-16 text-muted-foreground/30" />
            <p className="text-lg font-medium text-foreground">
              {submissions.length === 0 ? 'No submissions yet' : 'No matching submissions'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {submissions.length === 0
                ? 'Submissions will appear here once students start submitting their work.'
                : 'Try changing the filter to see more submissions.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="ocean-card overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">
                    Student
                  </th>
                  <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">
                    Submitted
                  </th>
                  <th className="px-5 py-3.5 text-center font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-center font-medium text-muted-foreground">
                    Score
                  </th>
                  <th className="px-5 py-3.5 text-center font-medium text-muted-foreground">
                    Grade
                  </th>
                  <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSubmissions.map((submission) => {
                  const isSelected = selectedSubmissionId === submission.id

                  return (
                    <tr
                      key={submission.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-primary/5'
                          : 'hover:bg-muted/30'
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {submission.studentName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{submission.studentName}</p>
                            <p className="text-xs text-muted-foreground">
                              {submission.studentEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {formatDate(submission.submitted_at)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <StatusBadge status={submission.status} isLate={submission.is_late} />
                      </td>
                      <td className="px-5 py-4 text-center">
                        {submission.grade ? (
                          <span className="font-semibold text-foreground">
                            {submission.grade.score}/{submission.grade.max_score}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {submission.grade?.letter_grade ? (
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {submission.grade.letter_grade}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() =>
                            setSelectedSubmissionId(isSelected ? null : submission.id)
                          }
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'border border-border text-foreground hover:bg-muted'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <ChevronUp className="h-3.5 w-3.5" />
                              Close
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3.5 w-3.5" />
                              {submission.grade ? 'Review' : 'Grade'}
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inline Grading Panel */}
      {selectedSubmissionId && (
        <GradingPanel
          submission={filteredSubmissions.find((s) => s.id === selectedSubmissionId)!}
          maxPoints={assignment?.pointsPossible || 100}
          onGrade={handleGrade}
          onReturn={handleReturn}
          onClose={() => setSelectedSubmissionId(null)}
        />
      )}
    </div>
  )
}
