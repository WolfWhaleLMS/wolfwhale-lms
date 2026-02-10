'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getQuiz, startAttempt, submitAttempt, getStudentAttempt } from '@/app/actions/quizzes'
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Send,
  RotateCcw,
  Trophy,
  Target,
  HelpCircle,
} from 'lucide-react'
import { toast } from 'sonner'

interface QuizOption {
  id: string
  option_text: string
  is_correct?: boolean
  order_index: number
}

interface QuizQuestion {
  id: string
  type: string
  question_text: string
  points: number
  order_index: number
  explanation: string | null
  quiz_options: QuizOption[]
}

interface Quiz {
  id: string
  title: string
  description: string | null
  time_limit_minutes: number | null
  shuffle_questions: boolean
  shuffle_answers: boolean
  show_results: boolean
  max_attempts: number
  passing_score: number
  status: string
  questions: QuizQuestion[]
}

interface Answer {
  questionId: string
  selectedOptionId?: string
  answerText?: string
}

interface AttemptResult {
  score: number
  totalPoints: number
  percentage: number
  passed: boolean
}

type PageState = 'loading' | 'intro' | 'taking' | 'submitting' | 'results'

// Shuffle utility
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function StudentQuizPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const quizId = params.quizId as string

  const [pageState, setPageState] = useState<PageState>('loading')
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [result, setResult] = useState<AttemptResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Load quiz data
  useEffect(() => {
    loadQuiz()
  }, [quizId])

  async function loadQuiz() {
    const quizResult = await getQuiz(quizId)
    if (quizResult.error || !quizResult.data) {
      setError(quizResult.error || 'Quiz not found')
      setPageState('intro')
      return
    }

    setQuiz(quizResult.data as unknown as Quiz)
    setPageState('intro')
  }

  // Timer
  useEffect(() => {
    if (pageState === 'taking' && timeRemaining !== null && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            // Time's up - auto submit
            clearInterval(timerRef.current!)
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [pageState, timeRemaining !== null])

  // Start quiz
  async function handleStartQuiz() {
    if (!quiz) return

    setPageState('loading')
    const attemptResult = await startAttempt(quizId)

    if (attemptResult.error) {
      setError(attemptResult.error)
      setPageState('intro')
      toast.error(attemptResult.error)
      return
    }

    setAttemptId(attemptResult.data!.id)

    // Prepare questions
    let preparedQuestions = [...quiz.questions]

    if (quiz.shuffle_questions) {
      preparedQuestions = shuffleArray(preparedQuestions)
    }

    if (quiz.shuffle_answers) {
      preparedQuestions = preparedQuestions.map((q) => ({
        ...q,
        quiz_options: shuffleArray(q.quiz_options),
      }))
    }

    setQuestions(preparedQuestions)
    setCurrentQuestionIndex(0)
    setAnswers({})

    if (quiz.time_limit_minutes) {
      setTimeRemaining(quiz.time_limit_minutes * 60)
    }

    setPageState('taking')
  }

  // Submit quiz
  const handleSubmit = useCallback(async () => {
    if (!attemptId) return

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setPageState('submitting')

    const answerArray = Object.values(answers)

    // Include unanswered questions as empty answers
    for (const q of questions) {
      if (!answers[q.id]) {
        answerArray.push({ questionId: q.id })
      }
    }

    const submitResult = await submitAttempt(attemptId, answerArray)

    if (submitResult.error) {
      toast.error(submitResult.error)
      setPageState('taking')
      return
    }

    setResult(submitResult.data!)
    setPageState('results')
  }, [attemptId, answers, questions])

  // Set answer
  function setAnswer(questionId: string, answer: Partial<Answer>) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], questionId, ...answer },
    }))
  }

  // Format time
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Answered count
  const answeredCount = Object.keys(answers).length
  const totalQuestions = questions.length

  // --- RENDER ---

  // Loading state
  if (pageState === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Error state
  if (error && !quiz) {
    return (
      <div className="space-y-8">
        <Link
          href={`/student/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Link>
        <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
          <AlertTriangle className="mb-3 h-12 w-12 text-red-400" />
          <h2 className="text-xl font-semibold text-foreground">Quiz Not Available</h2>
          <p className="mt-2 text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  // Intro/landing page
  if (pageState === 'intro' && quiz) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <Link
          href={`/student/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Link>

        <div className="ocean-card rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-foreground">{quiz.title}</h1>
          {quiz.description && (
            <p className="mt-3 text-muted-foreground">{quiz.description}</p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <HelpCircle className="h-4 w-4" />
                Questions
              </div>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {quiz.questions.length}
              </p>
            </div>

            <div className="rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Time Limit
              </div>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {quiz.time_limit_minutes ? `${quiz.time_limit_minutes} minutes` : 'No limit'}
              </p>
            </div>

            <div className="rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RotateCcw className="h-4 w-4" />
                Attempts
              </div>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {quiz.max_attempts} max
              </p>
            </div>

            <div className="rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                Passing Score
              </div>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {quiz.passing_score}%
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="mt-8 flex items-center justify-center">
            <button
              onClick={handleStartQuiz}
              className="whale-gradient inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
            >
              Start Quiz
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Quiz taking page
  if ((pageState === 'taking' || pageState === 'submitting') && quiz && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex]
    const currentAnswer = answers[currentQuestion.id]
    const isLastQuestion = currentQuestionIndex === questions.length - 1

    return (
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Top bar: timer + progress */}
        <div className="ocean-card sticky top-0 z-10 flex items-center justify-between rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">{quiz.title}</span>
            <span className="text-xs text-muted-foreground">
              {answeredCount}/{totalQuestions} answered
            </span>
          </div>
          <div className="flex items-center gap-4">
            {timeRemaining !== null && (
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-mono font-medium ${
                timeRemaining <= 60
                  ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                  : timeRemaining <= 300
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    : 'bg-muted text-foreground'
              }`}>
                <Clock className="h-4 w-4" />
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question navigation dots */}
        <div className="flex flex-wrap gap-2 justify-center">
          {questions.map((q, i) => {
            const isAnswered = !!answers[q.id]
            const isCurrent = i === currentQuestionIndex

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(i)}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                    : isAnswered
                      ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {i + 1}
              </button>
            )
          })}
        </div>

        {/* Question Card */}
        <div className="ocean-card rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="ml-3 text-xs text-muted-foreground">
                {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
              </span>
            </div>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">
              {currentQuestion.type.replace('_', ' ')}
            </span>
          </div>

          <h2 className="mt-4 text-lg font-semibold text-foreground leading-relaxed">
            {currentQuestion.question_text}
          </h2>

          {/* Answer Area */}
          <div className="mt-6">
            {/* Multiple Choice */}
            {currentQuestion.type === 'multiple_choice' && (
              <div className="space-y-3">
                {currentQuestion.quiz_options.map((option) => {
                  const isSelected = currentAnswer?.selectedOptionId === option.id

                  return (
                    <button
                      key={option.id}
                      onClick={() => setAnswer(currentQuestion.id, { selectedOptionId: option.id })}
                      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border hover:border-primary/50 hover:bg-muted/30'
                      }`}
                    >
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border'
                      }`}>
                        {isSelected && (
                          <div className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-sm text-foreground">{option.option_text}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* True/False */}
            {currentQuestion.type === 'true_false' && (
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.quiz_options.map((option) => {
                  const isSelected = currentAnswer?.selectedOptionId === option.id

                  return (
                    <button
                      key={option.id}
                      onClick={() => setAnswer(currentQuestion.id, { selectedOptionId: option.id })}
                      className={`rounded-xl border p-6 text-center transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border hover:border-primary/50 hover:bg-muted/30'
                      }`}
                    >
                      <span className="text-lg font-semibold text-foreground">{option.option_text}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Short Answer / Fill in Blank */}
            {(currentQuestion.type === 'short_answer' || currentQuestion.type === 'fill_in_blank') && (
              <div>
                <input
                  type="text"
                  value={currentAnswer?.answerText || ''}
                  onChange={(e) => setAnswer(currentQuestion.id, { answerText: e.target.value })}
                  placeholder={currentQuestion.type === 'fill_in_blank' ? 'Type the missing word or phrase...' : 'Type your answer...'}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

            {/* Essay */}
            {currentQuestion.type === 'essay' && (
              <div>
                <textarea
                  value={currentAnswer?.answerText || ''}
                  onChange={(e) => setAnswer(currentQuestion.id, { answerText: e.target.value })}
                  placeholder="Write your essay response here..."
                  rows={8}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {(currentAnswer?.answerText || '').split(/\s+/).filter(Boolean).length} words
                </p>
              </div>
            )}

            {/* Matching (rendered as MC for each pair) */}
            {currentQuestion.type === 'matching' && (
              <div className="space-y-3">
                {currentQuestion.quiz_options.map((option) => {
                  const isSelected = currentAnswer?.selectedOptionId === option.id

                  return (
                    <button
                      key={option.id}
                      onClick={() => setAnswer(currentQuestion.id, { selectedOptionId: option.id })}
                      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border hover:border-primary/50 hover:bg-muted/30'
                      }`}
                    >
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border'
                      }`}>
                        {isSelected && (
                          <div className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-sm text-foreground">{option.option_text}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex items-center gap-3">
            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={pageState === 'submitting'}
                className="whale-gradient inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md disabled:opacity-70"
              >
                {pageState === 'submitting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Quiz
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Submit early option */}
        {!isLastQuestion && answeredCount === totalQuestions && (
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={pageState === 'submitting'}
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Send className="h-4 w-4" />
              All questions answered. Submit now?
            </button>
          </div>
        )}
      </div>
    )
  }

  // Results page
  if (pageState === 'results' && result && quiz) {
    const isPassed = result.passed

    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <Link
          href={`/student/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Link>

        {/* Score Card */}
        <div className="ocean-card rounded-2xl p-8 text-center">
          <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
            isPassed
              ? 'bg-green-100 dark:bg-green-950/40'
              : 'bg-red-100 dark:bg-red-950/40'
          }`}>
            {isPassed ? (
              <Trophy className="h-10 w-10 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            )}
          </div>

          <h1 className="mt-4 text-2xl font-bold text-foreground">
            {isPassed ? 'Congratulations!' : 'Keep Trying!'}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {isPassed
              ? 'You passed this quiz.'
              : `You need ${quiz.passing_score}% to pass.`}
          </p>

          <div className="mt-6 flex items-center justify-center gap-8">
            <div>
              <div className={`text-4xl font-bold ${isPassed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {result.percentage}%
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Score</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <div className="text-4xl font-bold text-foreground">
                {result.score}/{result.totalPoints}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Points</div>
            </div>
          </div>

          <div className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
            isPassed
              ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300'
              : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
          }`}>
            {isPassed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {isPassed ? 'Passed' : 'Not Passed'}
          </div>
        </div>

        {/* Review Answers (if show_results is enabled) */}
        {quiz.show_results && questions.length > 0 && (
          <div className="ocean-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground">Review Answers</h2>
            <div className="mt-4 space-y-4">
              {questions.map((question, index) => {
                const answer = answers[question.id]
                const correctOption = question.quiz_options.find((o) => o.is_correct)
                const selectedOption = question.quiz_options.find((o) => o.id === answer?.selectedOptionId)
                let isCorrect = false

                if (question.type === 'multiple_choice' || question.type === 'true_false' || question.type === 'matching') {
                  isCorrect = correctOption?.id === answer?.selectedOptionId
                } else if (question.type === 'short_answer' || question.type === 'fill_in_blank') {
                  const studentAnswer = (answer?.answerText || '').trim().toLowerCase()
                  isCorrect = question.quiz_options.some(
                    (o) => o.is_correct && o.option_text.trim().toLowerCase() === studentAnswer
                  )
                }

                return (
                  <div
                    key={question.id}
                    className={`rounded-xl border p-4 ${
                      isCorrect
                        ? 'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/10'
                        : 'border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">Q{index + 1}</span>
                          <span className="text-xs text-muted-foreground">{question.points} pt{question.points !== 1 ? 's' : ''}</span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-foreground">{question.question_text}</p>

                        {/* Show answer details */}
                        <div className="mt-2 space-y-1 text-sm">
                          {(question.type === 'multiple_choice' || question.type === 'true_false' || question.type === 'matching') && (
                            <>
                              <p className="text-muted-foreground">
                                Your answer: <span className="font-medium text-foreground">{selectedOption?.option_text || 'No answer'}</span>
                              </p>
                              {!isCorrect && correctOption && (
                                <p className="text-green-600 dark:text-green-400">
                                  Correct answer: <span className="font-medium">{correctOption.option_text}</span>
                                </p>
                              )}
                            </>
                          )}
                          {(question.type === 'short_answer' || question.type === 'fill_in_blank') && (
                            <>
                              <p className="text-muted-foreground">
                                Your answer: <span className="font-medium text-foreground">{answer?.answerText || 'No answer'}</span>
                              </p>
                              {!isCorrect && (
                                <p className="text-green-600 dark:text-green-400">
                                  Accepted answer(s): <span className="font-medium">
                                    {question.quiz_options.filter((o) => o.is_correct).map((o) => o.option_text).join(', ')}
                                  </span>
                                </p>
                              )}
                            </>
                          )}
                          {question.type === 'essay' && (
                            <p className="text-muted-foreground italic">Essay responses are graded manually.</p>
                          )}
                        </div>

                        {/* Explanation */}
                        {question.explanation && (
                          <div className="mt-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                            <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Explanation</p>
                            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <Link
            href={`/student/courses/${courseId}`}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Course
          </Link>
          {quiz.max_attempts > 1 && (
            <button
              onClick={() => {
                setPageState('intro')
                setResult(null)
                setAnswers({})
                setAttemptId(null)
                setTimeRemaining(null)
                setError(null)
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    )
  }

  // Submitting state
  if (pageState === 'submitting') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-lg font-medium text-foreground">Submitting your quiz...</p>
        <p className="mt-1 text-sm text-muted-foreground">Please wait while we grade your answers.</p>
      </div>
    )
  }

  // Fallback
  return null
}
