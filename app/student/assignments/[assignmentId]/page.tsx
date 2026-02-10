'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getAssignment } from '@/app/actions/assignments'
import { getMySubmission, submitWork } from '@/app/actions/submissions'
import { ASSIGNMENT_TYPES, SUBMISSION_TYPES } from '@/lib/config/constants'

interface AssignmentData {
  id: string
  title: string
  description: string | null
  type: string
  due_date: string | null
  points_possible: number
  submission_type: string
  late_policy: string
  status: string
  courses: {
    id: string
    title: string
  }
}

interface SubmissionData {
  id: string
  content: string | null
  file_urls: string[] | null
  submitted_at: string
  status: string
  is_late: boolean
}

interface GradeData {
  id: string
  score: number
  max_score: number
  letter_grade: string
  feedback: string | null
  rubric_scores: Record<string, number> | null
  graded_at: string
}

function formatDate(dateStr: string | null) {
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

function timeUntilDue(dateStr: string | null) {
  if (!dateStr) return null
  const due = new Date(dateStr)
  const now = new Date()
  const diffMs = due.getTime() - now.getTime()
  if (diffMs < 0) return 'Past due'
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days} day${days !== 1 ? 's' : ''} remaining`
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} remaining`
  const minutes = Math.floor(diffMs / (1000 * 60))
  return `${minutes} minute${minutes !== 1 ? 's' : ''} remaining`
}

export default function StudentAssignmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const assignmentId = params.assignmentId as string

  const [assignment, setAssignment] = useState<AssignmentData | null>(null)
  const [submission, setSubmission] = useState<SubmissionData | null>(null)
  const [grade, setGrade] = useState<GradeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Submission form state
  const [content, setContent] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    loadData()
  }, [assignmentId])

  async function loadData() {
    setLoading(true)
    const [assignmentResult, submissionResult] = await Promise.all([
      getAssignment(assignmentId),
      getMySubmission(assignmentId),
    ])

    if (assignmentResult.error) {
      setError(assignmentResult.error)
    } else {
      setAssignment(assignmentResult.data as AssignmentData)
    }

    if (submissionResult.data) {
      setSubmission(submissionResult.data as SubmissionData)
      if (submissionResult.data.content) {
        setContent(submissionResult.data.content)
      }
    }
    if (submissionResult.grade) {
      setGrade(submissionResult.grade as GradeData)
    }

    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(false)

    if (!content.trim() && !linkUrl.trim()) {
      setSubmitError('Please enter your submission content')
      return
    }

    setSubmitting(true)

    // For link submissions, wrap the URL in the content
    const submissionContent = assignment?.submission_type === 'link'
      ? linkUrl.trim()
      : content.trim()

    const result = await submitWork(assignmentId, {
      content: submissionContent,
    })

    if (result.error) {
      setSubmitError(result.error)
    } else {
      setSubmitSuccess(true)
      setSubmission(result.data as SubmissionData)
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Loading...</h1>
          <p className="mt-1 text-muted-foreground">Fetching assignment details...</p>
        </div>
        <div className="ocean-card animate-pulse rounded-2xl p-8">
          <div className="h-6 w-64 rounded bg-muted" />
          <div className="mt-4 h-4 w-full rounded bg-muted" />
          <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
        </div>
      </div>
    )
  }

  if (error || !assignment) {
    return (
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <button
            onClick={() => router.push('/student/assignments')}
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Assignments
          </button>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
            {error || 'Assignment not found'}
          </div>
        </div>
      </div>
    )
  }

  const typeLabel = ASSIGNMENT_TYPES.find((t) => t.value === assignment.type)?.label || assignment.type
  const submissionTypeLabel = SUBMISSION_TYPES.find((t) => t.value === assignment.submission_type)?.label || assignment.submission_type
  const pastDue = isPastDue(assignment.due_date)
  const canSubmit = !pastDue || assignment.late_policy === 'accept_late'
  const timeLeft = timeUntilDue(assignment.due_date)

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/student/assignments')}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Assignments
      </button>

      {/* Assignment Details */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{assignment.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {(assignment.courses as unknown as { title: string })?.title}
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {assignment.points_possible} pts
          </span>
        </div>

        {/* Meta Info */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {typeLabel}
          </span>
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {submissionTypeLabel}
          </span>
          {assignment.late_policy === 'accept_late' && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              Late submissions accepted
            </span>
          )}
        </div>

        {/* Due Date */}
        <div className={`mt-4 rounded-xl border p-3 ${
          pastDue
            ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
            : 'border-border bg-muted/30'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Due: {formatDate(assignment.due_date)}
              </p>
              {timeLeft && (
                <p className={`mt-0.5 text-xs ${pastDue ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                  {timeLeft}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {assignment.description && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-foreground">Instructions</h3>
            <div className="mt-2 whitespace-pre-wrap rounded-xl border border-border bg-muted/20 p-4 text-sm text-foreground">
              {assignment.description}
            </div>
          </div>
        )}
      </div>

      {/* Grade Display (if graded) */}
      {grade && (
        <div className="ocean-card rounded-2xl border-2 border-green-200 p-6 dark:border-green-800">
          <h2 className="text-lg font-semibold text-foreground">Grade</h2>
          <div className="mt-4 flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">
                {grade.score}/{grade.max_score}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {Math.round((grade.score / grade.max_score) * 100)}%
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl font-bold text-primary">{grade.letter_grade}</span>
            </div>
          </div>
          {grade.feedback && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-foreground">Feedback from teacher</h3>
              <div className="mt-2 rounded-xl border border-border bg-muted/20 p-4 text-sm text-foreground">
                {grade.feedback}
              </div>
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Graded on {new Date(grade.graded_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      )}

      {/* Submission Area */}
      <div className="ocean-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-foreground">
          {submission ? 'Your Submission' : 'Submit Your Work'}
        </h2>

        {submission && (
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Submitted on{' '}
              {new Date(submission.submitted_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
            {submission.is_late && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                Late
              </span>
            )}
          </div>
        )}

        {submitSuccess && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300">
            Your work has been submitted successfully!
          </div>
        )}

        {submitError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Text Entry */}
          {(assignment.submission_type === 'text' || assignment.submission_type === 'multi') && (
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-foreground">
                Text Submission
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your response here..."
                rows={8}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          {/* URL Link */}
          {(assignment.submission_type === 'link' || assignment.submission_type === 'multi') && (
            <div>
              <label htmlFor="linkUrl" className="block text-sm font-medium text-foreground">
                URL Link
              </label>
              <input
                id="linkUrl"
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          {/* File Upload Placeholder */}
          {(assignment.submission_type === 'file' || assignment.submission_type === 'multi') && (
            <div>
              <label className="block text-sm font-medium text-foreground">File Upload</label>
              <div className="mt-1.5 flex items-center justify-center rounded-xl border-2 border-dashed border-border p-8">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Max file size: 50MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Discussion placeholder */}
          {assignment.submission_type === 'discussion' && (
            <div>
              <label htmlFor="discussion-content" className="block text-sm font-medium text-foreground">
                Discussion Post
              </label>
              <textarea
                id="discussion-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts on the discussion topic..."
                rows={6}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          {/* Submit Button */}
          {canSubmit && (
            <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
              {pastDue && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  This will be marked as a late submission.
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : submission ? (
                  'Resubmit'
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          )}

          {!canSubmit && pastDue && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
              This assignment is past due and does not accept late submissions.
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
