'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getSubmissions, gradeSubmission } from '@/app/actions/submissions'

interface Submission {
  id: string
  student_id: string
  content: string | null
  file_urls: string[] | null
  submitted_at: string
  status: string
  is_late: boolean
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

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function StatusBadge({ status, isLate }: { status: string; isLate: boolean }) {
  if (isLate) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
        Late
      </span>
    )
  }

  const statusMap: Record<string, string> = {
    submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    graded: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMap[status] || statusMap.draft}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function GradeInput({
  submission,
  maxPoints,
  onGrade,
}: {
  submission: Submission
  maxPoints: number
  onGrade: (submissionId: string, score: number, feedback: string) => void
}) {
  const [score, setScore] = useState(submission.grade?.score?.toString() || '')
  const [feedback, setFeedback] = useState(submission.grade?.feedback || '')
  const [expanded, setExpanded] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleQuickGrade() {
    const numScore = parseFloat(score)
    if (isNaN(numScore) || numScore < 0 || numScore > maxPoints) {
      alert(`Score must be between 0 and ${maxPoints}`)
      return
    }
    setSaving(true)
    await onGrade(submission.id, numScore, feedback)
    setSaving(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          max={maxPoints}
          step="0.5"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="Score"
          className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <span className="text-sm text-muted-foreground">/ {maxPoints}</span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-2 text-xs text-muted-foreground underline hover:text-foreground"
        >
          {expanded ? 'Hide feedback' : 'Add feedback'}
        </button>
        <button
          onClick={handleQuickGrade}
          disabled={saving || !score}
          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? 'Saving...' : submission.grade ? 'Update' : 'Grade'}
        </button>
      </div>
      {expanded && (
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write feedback for the student..."
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      )}
    </div>
  )
}

export default function TeacherSubmissionsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const assignmentId = params.assignmentId as string

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [assignment, setAssignment] = useState<AssignmentInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  useEffect(() => {
    loadSubmissions()
  }, [assignmentId])

  async function loadSubmissions() {
    setLoading(true)
    const result = await getSubmissions(assignmentId)
    if (result.error) {
      setError(result.error)
    } else {
      setSubmissions(result.data || [])
      setAssignment(result.assignment || null)
    }
    setLoading(false)
  }

  async function handleGrade(submissionId: string, score: number, feedback: string) {
    const result = await gradeSubmission(submissionId, score, feedback)
    if (result.error) {
      alert(result.error)
    } else {
      // Reload to get updated data
      await loadSubmissions()
    }
  }

  const gradedCount = submissions.filter((s) => s.grade).length
  const averageScore = submissions.length > 0
    ? submissions.reduce((sum, s) => sum + (s.grade?.score || 0), 0) / Math.max(gradedCount, 1)
    : 0

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Submissions</h1>
          <p className="mt-1 text-muted-foreground">Loading submissions...</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="ocean-card animate-pulse rounded-2xl p-6">
              <div className="h-5 w-40 rounded bg-muted" />
              <div className="mt-2 h-4 w-24 rounded bg-muted" />
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
        <button
          onClick={() => router.push(`/teacher/courses/${courseId}/assignments`)}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Assignments
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {assignment?.title || 'Submissions'}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {assignment?.courseTitle} &middot; {assignment?.pointsPossible} points
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="ocean-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-primary">{submissions.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">Total Submissions</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-primary">{gradedCount}</p>
          <p className="mt-1 text-sm text-muted-foreground">Graded</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-primary">
            {gradedCount > 0 ? `${Math.round(averageScore)}/${assignment?.pointsPossible}` : '--'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Average Score</p>
        </div>
      </div>

      {/* Submissions Table */}
      {submissions.length === 0 ? (
        <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
          <div className="mb-3 text-5xl opacity-40">📥</div>
          <p className="text-lg font-medium text-foreground">No submissions yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Submissions will appear here once students start submitting their work.
          </p>
        </div>
      ) : (
        <div className="ocean-card overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Student</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Submitted</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-foreground">{submission.studentName}</p>
                        <p className="text-xs text-muted-foreground">{submission.studentEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {formatDate(submission.submitted_at)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusBadge status={submission.status} isLate={submission.is_late} />
                    </td>
                    <td className="px-4 py-4">
                      <GradeInput
                        submission={submission}
                        maxPoints={assignment?.pointsPossible || 100}
                        onGrade={handleGrade}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Submission Detail Panel */}
      {selectedSubmission && (
        <div className="ocean-card rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Submission by {selectedSubmission.studentName}
            </h3>
            <button
              onClick={() => setSelectedSubmission(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
          {selectedSubmission.content && (
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {selectedSubmission.content}
              </p>
            </div>
          )}
          {selectedSubmission.file_urls && selectedSubmission.file_urls.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-foreground">Attached Files:</p>
              <ul className="space-y-1">
                {selectedSubmission.file_urls.map((url, i) => (
                  <li key={i}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary underline hover:text-primary/80"
                    >
                      File {i + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
