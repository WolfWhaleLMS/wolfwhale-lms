'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getQuizzes, deleteQuiz, updateQuiz } from '@/app/actions/quizzes'
import { ArrowLeft, Plus, Trash2, Clock, Users, HelpCircle, CheckCircle2, FileText, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'

interface Quiz {
  id: string
  title: string
  description: string | null
  status: string
  time_limit_minutes: number | null
  max_attempts: number
  passing_score: number
  questionCount: number
  attemptCount: number
  created_at: string
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    published: 'bg-[#33FF33]/10 text-[#33FF33] dark:bg-[#33FF33]/10 dark:text-[#33FF33]',
    closed: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${colorMap[status] || colorMap.draft}`}>
      {status}
    </span>
  )
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function TeacherQuizzesPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string

  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadQuizzes()
  }, [courseId])

  async function loadQuizzes() {
    setLoading(true)
    const result = await getQuizzes(courseId)
    if (result.error) {
      setError(result.error)
    } else {
      setQuizzes(result.data || [])
    }
    setLoading(false)
  }

  async function handleDelete(quizId: string) {
    if (!confirm('Are you sure you want to delete this quiz? This will also delete all questions and student attempts.')) {
      return
    }
    setDeleting(quizId)
    const result = await deleteQuiz(quizId)
    if (result.error) {
      toast.error(result.error)
    } else {
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId))
      toast.success('Quiz deleted')
    }
    setDeleting(null)
  }

  async function handleToggleStatus(quiz: Quiz) {
    const newStatus = quiz.status === 'published' ? 'closed' : 'published'
    const result = await updateQuiz(quiz.id, { status: newStatus })
    if (result.error) {
      toast.error(result.error)
    } else {
      setQuizzes((prev) =>
        prev.map((q) => (q.id === quiz.id ? { ...q, status: newStatus } : q))
      )
      toast.success(`Quiz ${newStatus === 'published' ? 'published' : 'closed'}`)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Quizzes</h1>
            <p className="mt-1 text-muted-foreground">Loading quizzes...</p>
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Quizzes & Assessments</h1>
          <p className="mt-1 text-muted-foreground">
            {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} in this course
          </p>
        </div>
        <button
          onClick={() => router.push(`/teacher/courses/${courseId}/quizzes/new`)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create Quiz
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Quizzes List */}
      {quizzes.length === 0 ? (
        <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
          <HelpCircle className="mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-medium text-foreground">No quizzes yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first quiz or assessment to test your students.
          </p>
          <button
            onClick={() => router.push(`/teacher/courses/${courseId}/quizzes/new`)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Create Quiz
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="ocean-card rounded-2xl p-6 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {quiz.title}
                    </h3>
                    <StatusBadge status={quiz.status} />
                  </div>
                  {quiz.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {quiz.description}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      {quiz.questionCount} question{quiz.questionCount !== 1 ? 's' : ''}
                    </span>
                    {quiz.time_limit_minutes && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {quiz.time_limit_minutes} min
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {quiz.attemptCount} attempt{quiz.attemptCount !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      Pass: {quiz.passing_score}%
                    </span>
                    <span>
                      Created {formatDate(quiz.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {quiz.status === 'draft' && (
                    <button
                      onClick={() => handleToggleStatus(quiz)}
                      className="rounded-lg border border-[#33FF33]/20 px-3 py-1.5 text-sm font-medium text-[#33FF33] transition-colors hover:bg-[#33FF33]/5 dark:border-[#33FF33]/20 dark:text-[#33FF33] dark:hover:bg-[#33FF33]/10"
                    >
                      Publish
                    </button>
                  )}
                  {quiz.status === 'published' && (
                    <button
                      onClick={() => handleToggleStatus(quiz)}
                      className="rounded-lg border border-[#FFAA00]/20 px-3 py-1.5 text-sm font-medium text-[#FFAA00] transition-colors hover:bg-[#FFAA00]/5 dark:border-[#FFAA00]/20 dark:text-[#FFAA00] dark:hover:bg-[#FFAA00]/10"
                    >
                      Close
                    </button>
                  )}
                  <button
                    onClick={() => router.push(`/teacher/courses/${courseId}/quizzes/new?edit=${quiz.id}`)}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    disabled={deleting === quiz.id}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    {deleting === quiz.id ? 'Deleting...' : 'Delete'}
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
