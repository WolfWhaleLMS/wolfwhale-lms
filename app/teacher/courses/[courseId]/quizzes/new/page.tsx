'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createQuiz, getQuiz, updateQuiz, addQuestion, deleteQuestion as deleteQuestionAction } from '@/app/actions/quizzes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  ArrowLeft,
  Loader2,
  HelpCircle,
  Save,
  Send,
  Clock,
  Shuffle,
  Eye,
  Target,
  RotateCcw,
} from 'lucide-react'
import { toast } from 'sonner'

type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'matching' | 'fill_in_blank'

type QuizOption = {
  id: string
  optionText: string
  isCorrect: boolean
  orderIndex: number
}

type QuizQuestion = {
  id: string
  type: QuestionType
  questionText: string
  points: number
  orderIndex: number
  explanation: string
  options: QuizOption[]
  isNew?: boolean
  dbId?: string // the actual DB id for existing questions
}

const QUESTION_TYPES: { value: QuestionType; label: string; description: string }[] = [
  { value: 'multiple_choice', label: 'Multiple Choice', description: 'One correct answer from options' },
  { value: 'true_false', label: 'True / False', description: 'True or false statement' },
  { value: 'short_answer', label: 'Short Answer', description: 'Text-based answer auto-graded' },
  { value: 'fill_in_blank', label: 'Fill in the Blank', description: 'Complete the sentence' },
  { value: 'essay', label: 'Essay', description: 'Long-form response (manual grading)' },
]

export default function QuizBuilderPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = params.courseId as string
  const editQuizId = searchParams.get('edit')

  // Quiz settings
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number | ''>('')
  const [shuffleQuestions, setShuffleQuestions] = useState(false)
  const [shuffleAnswers, setShuffleAnswers] = useState(false)
  const [showResults, setShowResults] = useState(true)
  const [maxAttempts, setMaxAttempts] = useState(1)
  const [passingScore, setPassingScore] = useState(70)

  // Questions
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())

  // UI state
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(!!editQuizId)
  const [error, setError] = useState<string | null>(null)
  const [quizId, setQuizId] = useState<string | null>(editQuizId)

  // Load existing quiz for editing
  useEffect(() => {
    if (editQuizId) {
      loadExistingQuiz(editQuizId)
    }
  }, [editQuizId])

  async function loadExistingQuiz(id: string) {
    setLoading(true)
    const result = await getQuiz(id)
    if (result.error || !result.data) {
      toast.error('Failed to load quiz')
      setLoading(false)
      return
    }

    const quiz = result.data
    setTitle(quiz.title)
    setDescription(quiz.description || '')
    setTimeLimitMinutes(quiz.time_limit_minutes || '')
    setShuffleQuestions(quiz.shuffle_questions)
    setShuffleAnswers(quiz.shuffle_answers)
    setShowResults(quiz.show_results)
    setMaxAttempts(quiz.max_attempts)
    setPassingScore(Number(quiz.passing_score))
    setQuizId(quiz.id)

    // Map existing questions
    const mappedQuestions: QuizQuestion[] = (quiz.questions || []).map((q: Record<string, unknown>, index: number) => ({
      id: crypto.randomUUID(),
      dbId: q.id as string,
      type: q.type as QuestionType,
      questionText: q.question_text as string,
      points: Number(q.points),
      orderIndex: index,
      explanation: (q.explanation as string) || '',
      options: ((q.quiz_options as Record<string, unknown>[]) || []).map((o: Record<string, unknown>) => ({
        id: o.id as string,
        optionText: o.option_text as string,
        isCorrect: o.is_correct as boolean,
        orderIndex: Number(o.order_index),
      })),
      isNew: false,
    }))

    setQuestions(mappedQuestions)
    setLoading(false)
  }

  // Question management
  function addNewQuestion(type: QuestionType) {
    const newQuestion: QuizQuestion = {
      id: crypto.randomUUID(),
      type,
      questionText: '',
      points: 1,
      orderIndex: questions.length,
      explanation: '',
      options: [],
      isNew: true,
    }

    // Pre-populate options based on type
    if (type === 'multiple_choice') {
      newQuestion.options = [
        { id: crypto.randomUUID(), optionText: '', isCorrect: false, orderIndex: 0 },
        { id: crypto.randomUUID(), optionText: '', isCorrect: false, orderIndex: 1 },
        { id: crypto.randomUUID(), optionText: '', isCorrect: false, orderIndex: 2 },
        { id: crypto.randomUUID(), optionText: '', isCorrect: false, orderIndex: 3 },
      ]
    } else if (type === 'true_false') {
      newQuestion.options = [
        { id: crypto.randomUUID(), optionText: 'True', isCorrect: true, orderIndex: 0 },
        { id: crypto.randomUUID(), optionText: 'False', isCorrect: false, orderIndex: 1 },
      ]
    } else if (type === 'short_answer' || type === 'fill_in_blank') {
      newQuestion.options = [
        { id: crypto.randomUUID(), optionText: '', isCorrect: true, orderIndex: 0 },
      ]
    }

    setQuestions([...questions, newQuestion])
    setExpandedQuestions(new Set([...expandedQuestions, newQuestion.id]))
  }

  function removeQuestion(id: string) {
    setQuestions(questions.filter((q) => q.id !== id))
    const newExpanded = new Set(expandedQuestions)
    newExpanded.delete(id)
    setExpandedQuestions(newExpanded)
  }

  function moveQuestion(id: string, direction: 'up' | 'down') {
    const index = questions.findIndex((q) => q.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    ) return

    const newQuestions = [...questions]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]]
    newQuestions.forEach((q, i) => { q.orderIndex = i })
    setQuestions(newQuestions)
  }

  function updateQuestionField(id: string, updates: Partial<QuizQuestion>) {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  function toggleExpanded(id: string) {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedQuestions(newExpanded)
  }

  // Option management
  function addOption(questionId: string) {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    const newOption: QuizOption = {
      id: crypto.randomUUID(),
      optionText: '',
      isCorrect: false,
      orderIndex: question.options.length,
    }

    updateQuestionField(questionId, {
      options: [...question.options, newOption],
    })
  }

  function removeOption(questionId: string, optionId: string) {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    updateQuestionField(questionId, {
      options: question.options.filter((o) => o.id !== optionId),
    })
  }

  function updateOption(questionId: string, optionId: string, updates: Partial<QuizOption>) {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    updateQuestionField(questionId, {
      options: question.options.map((o) =>
        o.id === optionId ? { ...o, ...updates } : o
      ),
    })
  }

  function setCorrectOption(questionId: string, optionId: string) {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    // For MC and TF, only one correct answer
    updateQuestionField(questionId, {
      options: question.options.map((o) => ({
        ...o,
        isCorrect: o.id === optionId,
      })),
    })
  }

  // Calculated values
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)

  // Validation
  function validate(): string | null {
    if (!title.trim()) return 'Quiz title is required'

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.questionText.trim()) return `Question ${i + 1}: Question text is required`
      if (q.points <= 0) return `Question ${i + 1}: Points must be greater than 0`

      if (q.type === 'multiple_choice') {
        if (q.options.length < 2) return `Question ${i + 1}: At least 2 options are required`
        if (q.options.some((o) => !o.optionText.trim())) return `Question ${i + 1}: All options must have text`
        if (!q.options.some((o) => o.isCorrect)) return `Question ${i + 1}: A correct answer must be selected`
      }

      if (q.type === 'true_false') {
        if (!q.options.some((o) => o.isCorrect)) return `Question ${i + 1}: Select whether True or False is correct`
      }

      if (q.type === 'short_answer' || q.type === 'fill_in_blank') {
        if (q.options.length === 0 || q.options.every((o) => !o.optionText.trim())) {
          return `Question ${i + 1}: At least one correct answer is required`
        }
      }
    }

    return null
  }

  // Save quiz (draft or publish)
  async function handleSave(status: 'draft' | 'published') {
    setError(null)
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      toast.error(validationError)
      return
    }

    if (status === 'published' && questions.length === 0) {
      if (!confirm('This quiz has no questions. Are you sure you want to publish it?')) return
    }

    setSubmitting(true)

    try {
      let currentQuizId = quizId

      if (!currentQuizId) {
        // Create the quiz
        const quizResult = await createQuiz({
          courseId,
          title: title.trim(),
          description: description.trim() || undefined,
          timeLimitMinutes: timeLimitMinutes ? Number(timeLimitMinutes) : null,
          shuffleQuestions,
          shuffleAnswers,
          showResults,
          maxAttempts,
          passingScore,
          status,
        })

        if (quizResult.error) {
          setError(quizResult.error)
          toast.error(quizResult.error)
          setSubmitting(false)
          return
        }

        currentQuizId = quizResult.data!.id
        setQuizId(currentQuizId)
      } else {
        // Update quiz settings
        const updateResult = await updateQuiz(currentQuizId, {
          title: title.trim(),
          description: description.trim() || undefined,
          timeLimitMinutes: timeLimitMinutes ? Number(timeLimitMinutes) : null,
          shuffleQuestions,
          shuffleAnswers,
          showResults,
          maxAttempts,
          passingScore,
          status,
        })

        if (updateResult.error) {
          setError(updateResult.error)
          toast.error(updateResult.error)
          setSubmitting(false)
          return
        }
      }

      // Save questions: delete removed ones, add new ones
      for (const q of questions) {
        if (q.isNew || !q.dbId) {
          const questionResult = await addQuestion(currentQuizId!, {
            type: q.type,
            questionText: q.questionText,
            points: q.points,
            orderIndex: q.orderIndex,
            explanation: q.explanation || undefined,
            options: q.options.map((o) => ({
              optionText: o.optionText,
              isCorrect: o.isCorrect,
              orderIndex: o.orderIndex,
            })),
          })

          if (questionResult.error) {
            console.error('Error saving question:', questionResult.error)
          }
        }
      }

      toast.success(status === 'published' ? 'Quiz published!' : 'Quiz saved as draft!')
      router.push(`/teacher/courses/${courseId}/quizzes`)
    } catch (err) {
      console.error('Error saving quiz:', err)
      setError('An unexpected error occurred')
      toast.error('An unexpected error occurred')
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <Link
          href={`/teacher/courses/${courseId}/quizzes`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {editQuizId ? 'Edit Quiz' : 'Create Quiz'}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Build a quiz or assessment for your students.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Quiz Settings */}
      <div className="ocean-card space-y-6 rounded-2xl p-6">
        <div className="border-b border-border pb-3">
          <h2 className="text-lg font-semibold text-foreground">Quiz Settings</h2>
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Chapter 5 Review Quiz"
            required
            className="mt-1.5"
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this quiz covers..."
            rows={3}
            className="mt-1.5"
          />
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="timeLimit" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Limit (minutes)
            </Label>
            <Input
              id="timeLimit"
              type="number"
              min="1"
              value={timeLimitMinutes}
              onChange={(e) => setTimeLimitMinutes(e.target.value ? parseInt(e.target.value) : '')}
              placeholder="No limit"
              className="mt-1.5"
            />
            <p className="mt-1 text-xs text-muted-foreground">Leave empty for no time limit</p>
          </div>

          <div>
            <Label htmlFor="maxAttempts" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Max Attempts
            </Label>
            <Input
              id="maxAttempts"
              type="number"
              min="1"
              max="99"
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(parseInt(e.target.value) || 1)}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="passingScore" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Passing Score (%)
            </Label>
            <Input
              id="passingScore"
              type="number"
              min="0"
              max="100"
              value={passingScore}
              onChange={(e) => setPassingScore(parseInt(e.target.value) || 0)}
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Toggle Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={shuffleQuestions}
              onClick={() => setShuffleQuestions(!shuffleQuestions)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                shuffleQuestions ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${
                  shuffleQuestions ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <Label className="flex items-center gap-2 cursor-pointer" onClick={() => setShuffleQuestions(!shuffleQuestions)}>
              <Shuffle className="h-4 w-4" />
              Shuffle question order
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={shuffleAnswers}
              onClick={() => setShuffleAnswers(!shuffleAnswers)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                shuffleAnswers ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${
                  shuffleAnswers ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <Label className="flex items-center gap-2 cursor-pointer" onClick={() => setShuffleAnswers(!shuffleAnswers)}>
              <Shuffle className="h-4 w-4" />
              Shuffle answer options
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={showResults}
              onClick={() => setShowResults(!showResults)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                showResults ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${
                  showResults ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <Label className="flex items-center gap-2 cursor-pointer" onClick={() => setShowResults(!showResults)}>
              <Eye className="h-4 w-4" />
              Show correct answers after submission
            </Label>
          </div>
        </div>
      </div>

      {/* Question Builder */}
      <div className="ocean-card space-y-6 rounded-2xl p-6">
        <div className="border-b border-border pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Questions</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add questions to your quiz
              </p>
            </div>
            {questions.length > 0 && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">{questions.length} question{questions.length !== 1 ? 's' : ''}</div>
                <div className="text-lg font-semibold text-foreground">{totalPoints} point{totalPoints !== 1 ? 's' : ''}</div>
              </div>
            )}
          </div>
        </div>

        {/* Add Question Buttons */}
        <div className="flex flex-wrap gap-2">
          {QUESTION_TYPES.map((qt) => (
            <Button
              key={qt.value}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addNewQuestion(qt.value)}
              className="gap-2"
              title={qt.description}
            >
              <Plus className="h-4 w-4" />
              {qt.label}
            </Button>
          ))}
        </div>

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No questions yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Click one of the buttons above to add your first question.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => {
              const isExpanded = expandedQuestions.has(question.id)
              const typeLabel = QUESTION_TYPES.find((t) => t.value === question.type)?.label || question.type

              return (
                <div key={question.id} className="rounded-xl border border-border bg-background">
                  {/* Question Header */}
                  <div
                    className="flex items-center gap-3 p-4 cursor-pointer"
                    onClick={() => toggleExpanded(question.id)}
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                    </div>

                    <Badge variant="secondary" className="text-xs">
                      {typeLabel}
                    </Badge>

                    <div className="flex-1 truncate text-sm text-foreground">
                      {question.questionText || <span className="text-muted-foreground italic">No question text</span>}
                    </div>

                    <span className="text-xs text-muted-foreground">{question.points} pt{question.points !== 1 ? 's' : ''}</span>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveQuestion(question.id, 'up')}
                        disabled={index === 0}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveQuestion(question.id, 'down')}
                        disabled={index === questions.length - 1}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Question Body */}
                  {isExpanded && (
                    <div className="space-y-4 border-t border-border p-4">
                      {/* Question Text */}
                      <div>
                        <Label>Question Text <span className="text-red-500">*</span></Label>
                        {question.type === 'fill_in_blank' ? (
                          <>
                            <Textarea
                              value={question.questionText}
                              onChange={(e) => updateQuestionField(question.id, { questionText: e.target.value })}
                              placeholder="Use ___ to indicate the blank. Example: The capital of France is ___."
                              rows={3}
                              className="mt-1.5"
                            />
                            <p className="mt-1 text-xs text-muted-foreground">Use ___ (three underscores) to indicate where the blank goes.</p>
                          </>
                        ) : (
                          <Textarea
                            value={question.questionText}
                            onChange={(e) => updateQuestionField(question.id, { questionText: e.target.value })}
                            placeholder="Enter your question here..."
                            rows={3}
                            className="mt-1.5"
                          />
                        )}
                      </div>

                      {/* Points */}
                      <div className="w-32">
                        <Label>Points</Label>
                        <Input
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={question.points}
                          onChange={(e) => updateQuestionField(question.id, { points: parseFloat(e.target.value) || 1 })}
                          className="mt-1.5"
                        />
                      </div>

                      {/* Multiple Choice Options */}
                      {question.type === 'multiple_choice' && (
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <Label>Answer Options <span className="text-red-500">*</span></Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addOption(question.id)}
                              disabled={question.options.length >= 6}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Option
                            </Button>
                          </div>
                          <p className="mb-3 text-xs text-muted-foreground">Select the radio button next to the correct answer.</p>
                          <div className="space-y-2">
                            {question.options.map((option, optIndex) => (
                              <div key={option.id} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`correct-${question.id}`}
                                  checked={option.isCorrect}
                                  onChange={() => setCorrectOption(question.id, option.id)}
                                  className="h-4 w-4 accent-primary"
                                />
                                <span className="text-xs text-muted-foreground w-6">{String.fromCharCode(65 + optIndex)}.</span>
                                <Input
                                  value={option.optionText}
                                  onChange={(e) => updateOption(question.id, option.id, { optionText: e.target.value })}
                                  placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                  className={`flex-1 ${option.isCorrect ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/20' : ''}`}
                                />
                                {question.options.length > 2 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeOption(question.id, option.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* True/False Options */}
                      {question.type === 'true_false' && (
                        <div>
                          <Label>Correct Answer <span className="text-red-500">*</span></Label>
                          <div className="mt-2 flex gap-4">
                            {question.options.map((option) => (
                              <label
                                key={option.id}
                                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 transition-colors ${
                                  option.isCorrect
                                    ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
                                    : 'border-border hover:bg-muted/50'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`tf-${question.id}`}
                                  checked={option.isCorrect}
                                  onChange={() => setCorrectOption(question.id, option.id)}
                                  className="h-4 w-4 accent-primary"
                                />
                                <span className="text-sm font-medium">{option.optionText}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Short Answer / Fill in Blank */}
                      {(question.type === 'short_answer' || question.type === 'fill_in_blank') && (
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <Label>Accepted Answer(s) <span className="text-red-500">*</span></Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addOption(question.id)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Answer
                            </Button>
                          </div>
                          <p className="mb-3 text-xs text-muted-foreground">
                            Add all acceptable answers. Matching is case-insensitive.
                          </p>
                          <div className="space-y-2">
                            {question.options.map((option, optIndex) => (
                              <div key={option.id} className="flex items-center gap-2">
                                <Input
                                  value={option.optionText}
                                  onChange={(e) => updateOption(question.id, option.id, { optionText: e.target.value })}
                                  placeholder={`Accepted answer ${optIndex + 1}`}
                                  className="flex-1"
                                />
                                {question.options.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeOption(question.id, option.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Essay - no options needed */}
                      {question.type === 'essay' && (
                        <div className="rounded-xl bg-muted/50 p-4">
                          <p className="text-sm text-muted-foreground">
                            Essay questions require manual grading. Students will see a text area to write their response.
                          </p>
                        </div>
                      )}

                      {/* Explanation */}
                      <div>
                        <Label>Explanation (shown after answering)</Label>
                        <Textarea
                          value={question.explanation}
                          onChange={(e) => updateQuestionField(question.id, { explanation: e.target.value })}
                          placeholder="Explain the correct answer..."
                          rows={2}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Summary */}
        {questions.length > 0 && (
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Total Questions:</span>
              <span className="text-foreground">{questions.length}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Total Points:</span>
              <span className="text-lg font-bold text-foreground">{totalPoints}</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="ocean-card flex items-center justify-end gap-3 rounded-2xl p-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSave('draft')}
          disabled={submitting}
          className="gap-2"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save as Draft
        </Button>
        <Button
          type="button"
          onClick={() => handleSave('published')}
          disabled={submitting}
          className="whale-gradient gap-2"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Publish Quiz
        </Button>
      </div>
    </div>
  )
}
