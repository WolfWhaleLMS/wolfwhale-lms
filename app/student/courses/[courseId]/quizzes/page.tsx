'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getStudentQuizzes } from '@/app/actions/quizzes'
import {
  ArrowLeft,
  Clock,
  HelpCircle,
  Target,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Trophy,
} from 'lucide-react'

interface StudentQuiz {
  id: string
  title: string
  description: string | null
  time_limit_minutes: number | null
  max_attempts: number
  passing_score: number
  attemptCount: number
  bestScore: number | null
  lastAttempt: string | null
}

export default function StudentQuizzesPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string

  const [quizzes, setQuizzes] = useState<StudentQuiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadQuizzes()
  }, [courseId])

  async function loadQuizzes() {
    setLoading(true)
    const result = await getStudentQuizzes(courseId)
    if (result.error) {
      setError(result.error)
    } else {
      setQuizzes(result.data || [])
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Quizzes</h1>
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
      <Link
        href={`/student/courses/${courseId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Course
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Quizzes & Assessments</h1>
        <p className="mt-1 text-muted-foreground">
          {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} available
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {quizzes.length === 0 ? (
        <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
          <HelpCircle className="mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-medium text-foreground">No quizzes available</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your teacher has not published any quizzes yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((quiz) => {
            const hasAttempted = quiz.attemptCount > 0
            const hasPassedBest = quiz.bestScore !== null && quiz.bestScore >= quiz.passing_score
            const canRetry = quiz.attemptCount < quiz.max_attempts

            return (
              <div
                key={quiz.id}
                className="ocean-card rounded-2xl p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">{quiz.title}</h3>
                      {hasAttempted && (
                        hasPassedBest ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/40 dark:text-green-300">
                            <CheckCircle2 className="h-3 w-3" />
                            Passed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">
                            <XCircle className="h-3 w-3" />
                            Not Passed
                          </span>
                        )
                      )}
                    </div>
                    {quiz.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {quiz.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {quiz.time_limit_minutes && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {quiz.time_limit_minutes} min
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Target className="h-4 w-4" />
                        {quiz.passing_score}% to pass
                      </span>
                      <span className="flex items-center gap-1.5">
                        <RotateCcw className="h-4 w-4" />
                        {quiz.attemptCount}/{quiz.max_attempts} attempt{quiz.max_attempts !== 1 ? 's' : ''}
                      </span>
                      {quiz.bestScore !== null && (
                        <span className="flex items-center gap-1.5">
                          <Trophy className="h-4 w-4" />
                          Best: {quiz.bestScore}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    {(!hasAttempted || canRetry) ? (
                      <button
                        onClick={() => router.push(`/student/courses/${courseId}/quizzes/${quiz.id}`)}
                        className="whale-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
                      >
                        {hasAttempted ? 'Retry' : 'Start Quiz'}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="inline-flex items-center rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground">
                        No attempts remaining
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
