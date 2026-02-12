'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { sanitizeText, sanitizeRichText } from '@/lib/sanitize'
import { rateLimitAction } from '@/lib/rate-limit-action'

// ============================================
// TEACHER: Create a quiz
// ============================================
export async function createQuiz(formData: {
  courseId: string
  title: string
  description?: string
  timeLimitMinutes?: number | null
  shuffleQuestions?: boolean
  shuffleAnswers?: boolean
  showResults?: boolean
  maxAttempts?: number
  passingScore?: number
  status?: string
}) {
  const createQuizSchema = z.object({
    courseId: z.string().uuid(),
    title: z.string().min(1).max(255),
    description: z.string().max(5000).optional(),
    timeLimitMinutes: z.number().min(1).max(600).nullable().optional(),
    shuffleQuestions: z.boolean().optional(),
    shuffleAnswers: z.boolean().optional(),
    showResults: z.boolean().optional(),
    maxAttempts: z.number().min(1).max(100).optional(),
    passingScore: z.number().min(0).max(100).optional(),
    status: z.string().max(50).optional(),
  })
  const parsed = createQuizSchema.safeParse(formData)
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const rl = await rateLimitAction('createQuiz')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  // Sanitize user-generated text content
  const sanitizedTitle = sanitizeText(parsed.data.title)
  const sanitizedDescription = parsed.data.description ? sanitizeText(parsed.data.description) : null

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) return { error: 'No tenant context' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify the user is the course teacher
  const { data: course } = await supabase
    .from('courses')
    .select('created_by')
    .eq('id', parsed.data.courseId)
    .single()

  if (!course || course.created_by !== user.id) {
    return { error: 'Not authorized to create quizzes for this course' }
  }

  const insertData: Record<string, unknown> = {
    tenant_id: tenantId,
    course_id: parsed.data.courseId,
    title: sanitizedTitle,
    description: sanitizedDescription,
    time_limit_minutes: parsed.data.timeLimitMinutes || null,
    shuffle_questions: parsed.data.shuffleQuestions ?? false,
    shuffle_answers: parsed.data.shuffleAnswers ?? false,
    show_results: parsed.data.showResults ?? true,
    max_attempts: parsed.data.maxAttempts ?? 1,
    passing_score: parsed.data.passingScore ?? 70,
    status: parsed.data.status || 'draft',
    created_by: user.id,
  }

  const { data, error } = await supabase
    .from('quizzes')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error('Error creating quiz:', error)
    return { error: 'Failed to create quiz' }
  }

  revalidatePath(`/teacher/courses/${parsed.data.courseId}/quizzes`)
  return { success: true, data }
}

// ============================================
// Get a quiz with questions and options
// ============================================
export async function getQuiz(quizId: string) {
  const parsed = z.object({ quizId: z.string().uuid() }).safeParse({ quizId })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  let quizQuery = supabase
    .from('quizzes')
    .select(`
      *,
      courses:courses(id, name, created_by)
    `)
    .eq('id', quizId)

  if (tenantId) {
    quizQuery = quizQuery.eq('tenant_id', tenantId)
  }

  const { data: quiz, error } = await quizQuery.single()

  if (error || !quiz) {
    console.error('Error fetching quiz:', error)
    return { error: 'Quiz not found' }
  }

  // Fetch questions with options
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select(`
      *,
      quiz_options(*)
    `)
    .eq('quiz_id', quizId)
    .order('order_index', { ascending: true })

  // Sort options by order_index
  let sortedQuestions = (questions || []).map(q => ({
    ...q,
    quiz_options: (q.quiz_options || []).sort(
      (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index
    ),
  }))

  // Security: strip is_correct from options for non-teacher/non-admin users
  // to prevent students from seeing correct answers before submitting
  const courseData = quiz.courses as unknown as { id: string; name: string; created_by: string }
  const isTeacher = courseData?.created_by === user.id

  let isAdmin = false
  if (!isTeacher) {
    const headersList = await headers()
    const tenantId = headersList.get('x-tenant-id')
    if (tenantId) {
      const { data: membership } = await supabase
        .from('tenant_memberships')
        .select('role')
        .eq('user_id', user.id)
        .eq('tenant_id', tenantId)
        .eq('status', 'active')
        .maybeSingle()

      isAdmin = membership?.role === 'admin' || membership?.role === 'super_admin'
    }
  }

  if (!isTeacher && !isAdmin) {
    sortedQuestions = sortedQuestions.map(q => ({
      ...q,
      quiz_options: q.quiz_options.map((opt: Record<string, unknown>) => ({
        ...opt,
        is_correct: undefined,
      })),
    }))
  }

  return { data: { ...quiz, questions: sortedQuestions } }
}

// ============================================
// List quizzes for a course
// ============================================
export async function getQuizzes(courseId: string) {
  const parsed = z.object({ courseId: z.string().uuid() }).safeParse({ courseId })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  let query = supabase
    .from('quizzes')
    .select(`
      *,
      quiz_questions(count),
      quiz_attempts(count)
    `)
    .eq('course_id', courseId)
    .order('created_at', { ascending: false })

  if (tenantId) {
    query = query.eq('tenant_id', tenantId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching quizzes:', error)
    return { error: 'Failed to fetch quizzes' }
  }

  const quizzes = (data || []).map((q) => ({
    ...q,
    questionCount: q.quiz_questions?.[0]?.count ?? 0,
    attemptCount: q.quiz_attempts?.[0]?.count ?? 0,
  }))

  return { data: quizzes }
}

// ============================================
// TEACHER: Update quiz details
// ============================================
export async function updateQuiz(quizId: string, formData: {
  title?: string
  description?: string
  timeLimitMinutes?: number | null
  shuffleQuestions?: boolean
  shuffleAnswers?: boolean
  showResults?: boolean
  maxAttempts?: number
  passingScore?: number
  status?: string
}) {
  const updateQuizSchema = z.object({
    quizId: z.string().uuid(),
    title: z.string().min(1).max(255).optional(),
    description: z.string().max(5000).optional(),
    timeLimitMinutes: z.number().min(1).max(600).nullable().optional(),
    shuffleQuestions: z.boolean().optional(),
    shuffleAnswers: z.boolean().optional(),
    showResults: z.boolean().optional(),
    maxAttempts: z.number().min(1).max(100).optional(),
    passingScore: z.number().min(0).max(100).optional(),
    status: z.string().max(50).optional(),
  })
  const parsed = updateQuizSchema.safeParse({ quizId, ...formData })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const rl = await rateLimitAction('updateQuiz')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  let updateQuizQuery = supabase
    .from('quizzes')
    .select('course_id, courses:courses(created_by)')
    .eq('id', quizId)

  if (tenantId) {
    updateQuizQuery = updateQuizQuery.eq('tenant_id', tenantId)
  }

  const { data: quiz } = await updateQuizQuery.single()

  if (!quiz) return { error: 'Quiz not found' }

  const courseData = quiz.courses as unknown as { created_by: string }
  if (courseData?.created_by !== user.id) {
    return { error: 'Not authorized to update this quiz' }
  }

  const updateData: Record<string, unknown> = {}
  if (formData.title !== undefined) updateData.title = sanitizeText(formData.title)
  if (formData.description !== undefined) updateData.description = sanitizeText(formData.description)
  if (formData.timeLimitMinutes !== undefined) updateData.time_limit_minutes = formData.timeLimitMinutes
  if (formData.shuffleQuestions !== undefined) updateData.shuffle_questions = formData.shuffleQuestions
  if (formData.shuffleAnswers !== undefined) updateData.shuffle_answers = formData.shuffleAnswers
  if (formData.showResults !== undefined) updateData.show_results = formData.showResults
  if (formData.maxAttempts !== undefined) updateData.max_attempts = formData.maxAttempts
  if (formData.passingScore !== undefined) updateData.passing_score = formData.passingScore
  if (formData.status !== undefined) updateData.status = formData.status
  updateData.updated_at = new Date().toISOString()

  const { error } = await supabase
    .from('quizzes')
    .update(updateData)
    .eq('id', quizId)

  if (error) {
    console.error('Error updating quiz:', error)
    return { error: 'Failed to update quiz' }
  }

  revalidatePath(`/teacher/courses/${quiz.course_id}/quizzes`)
  return { success: true }
}

// ============================================
// TEACHER: Delete a quiz
// ============================================
export async function deleteQuiz(quizId: string) {
  const parsed = z.object({ quizId: z.string().uuid() }).safeParse({ quizId })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const rl = await rateLimitAction('deleteQuiz')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  let deleteQuizQuery = supabase
    .from('quizzes')
    .select('course_id, courses:courses(created_by)')
    .eq('id', quizId)

  if (tenantId) {
    deleteQuizQuery = deleteQuizQuery.eq('tenant_id', tenantId)
  }

  const { data: quiz } = await deleteQuizQuery.single()

  if (!quiz) return { error: 'Quiz not found' }

  const courseData = quiz.courses as unknown as { created_by: string }
  if (courseData?.created_by !== user.id) {
    return { error: 'Not authorized to delete this quiz' }
  }

  const { error } = await supabase
    .from('quizzes')
    .delete()
    .eq('id', quizId)

  if (error) {
    console.error('Error deleting quiz:', error)
    return { error: 'Failed to delete quiz' }
  }

  revalidatePath(`/teacher/courses/${quiz.course_id}/quizzes`)
  return { success: true }
}

// ============================================
// TEACHER: Add a question to a quiz
// ============================================
export async function addQuestion(quizId: string, questionData: {
  type: string
  questionText: string
  points?: number
  orderIndex?: number
  explanation?: string
  options?: { optionText: string; isCorrect: boolean; orderIndex: number }[]
}) {
  const addQuestionSchema = z.object({
    quizId: z.string().uuid(),
    type: z.string().min(1).max(50),
    questionText: z.string().min(1).max(5000),
    points: z.number().min(0).max(1000).optional(),
    orderIndex: z.number().min(0).max(1000).optional(),
    explanation: z.string().max(5000).optional(),
    options: z.array(z.object({
      optionText: z.string().min(1).max(1000),
      isCorrect: z.boolean(),
      orderIndex: z.number().min(0).max(100),
    })).max(20).optional(),
  })
  const parsed = addQuestionSchema.safeParse({ quizId, ...questionData })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const rl = await rateLimitAction('addQuestion')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify ownership
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('course_id, courses:courses(created_by)')
    .eq('id', quizId)
    .single()

  if (!quiz) return { error: 'Quiz not found' }

  const courseData = quiz.courses as unknown as { created_by: string }
  if (courseData?.created_by !== user.id) {
    return { error: 'Not authorized to add questions to this quiz' }
  }

  // Get next order index if not provided
  let orderIndex = questionData.orderIndex
  if (orderIndex === undefined) {
    const { data: existing } = await supabase
      .from('quiz_questions')
      .select('order_index')
      .eq('quiz_id', quizId)
      .order('order_index', { ascending: false })
      .limit(1)

    orderIndex = existing && existing.length > 0 ? existing[0].order_index + 1 : 0
  }

  // Sanitize user-generated text content
  const sanitizedQuestionText = sanitizeRichText(questionData.questionText)
  const sanitizedExplanation = questionData.explanation ? sanitizeRichText(questionData.explanation) : null

  // Insert question
  const { data: question, error: questionError } = await supabase
    .from('quiz_questions')
    .insert({
      quiz_id: quizId,
      type: questionData.type,
      question_text: sanitizedQuestionText,
      points: questionData.points ?? 1,
      order_index: orderIndex,
      explanation: sanitizedExplanation,
    })
    .select()
    .single()

  if (questionError || !question) {
    console.error('Error adding question:', questionError)
    return { error: 'Failed to add question' }
  }

  // Insert options if provided
  if (questionData.options && questionData.options.length > 0) {
    const optionsToInsert = questionData.options.map((opt) => ({
      question_id: question.id,
      option_text: sanitizeText(opt.optionText),
      is_correct: opt.isCorrect,
      order_index: opt.orderIndex,
    }))

    const { error: optionsError } = await supabase
      .from('quiz_options')
      .insert(optionsToInsert)

    if (optionsError) {
      console.error('Error adding options:', optionsError)
      return { error: 'Question created but failed to add options' }
    }
  }

  revalidatePath(`/teacher/courses/${quiz.course_id}/quizzes`)
  return { success: true, data: question }
}

// ============================================
// TEACHER: Update a question
// ============================================
export async function updateQuestion(questionId: string, questionData: {
  questionText?: string
  points?: number
  orderIndex?: number
  explanation?: string
  options?: { id?: string; optionText: string; isCorrect: boolean; orderIndex: number }[]
}) {
  const updateQuestionSchema = z.object({
    questionId: z.string().uuid(),
    questionText: z.string().min(1).max(5000).optional(),
    points: z.number().min(0).max(1000).optional(),
    orderIndex: z.number().min(0).max(1000).optional(),
    explanation: z.string().max(5000).optional(),
    options: z.array(z.object({
      id: z.string().uuid().optional(),
      optionText: z.string().min(1).max(1000),
      isCorrect: z.boolean(),
      orderIndex: z.number().min(0).max(100),
    })).max(20).optional(),
  })
  const parsed = updateQuestionSchema.safeParse({ questionId, ...questionData })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const rl = await rateLimitAction('updateQuestion')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get question and verify ownership
  const { data: question } = await supabase
    .from('quiz_questions')
    .select('quiz_id, quizzes:quizzes(course_id, courses:courses(created_by))')
    .eq('id', questionId)
    .single()

  if (!question) return { error: 'Question not found' }

  const quizData = question.quizzes as unknown as { course_id: string; courses: { created_by: string } }
  if (quizData?.courses?.created_by !== user.id) {
    return { error: 'Not authorized to update this question' }
  }

  const updateData: Record<string, unknown> = {}
  if (questionData.questionText !== undefined) updateData.question_text = sanitizeRichText(questionData.questionText)
  if (questionData.points !== undefined) updateData.points = questionData.points
  if (questionData.orderIndex !== undefined) updateData.order_index = questionData.orderIndex
  if (questionData.explanation !== undefined) updateData.explanation = sanitizeRichText(questionData.explanation)

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase
      .from('quiz_questions')
      .update(updateData)
      .eq('id', questionId)

    if (error) {
      console.error('Error updating question:', error)
      return { error: 'Failed to update question' }
    }
  }

  // Update options if provided
  if (questionData.options !== undefined) {
    // Delete existing options
    await supabase
      .from('quiz_options')
      .delete()
      .eq('question_id', questionId)

    // Insert new options
    if (questionData.options.length > 0) {
      const optionsToInsert = questionData.options.map((opt) => ({
        question_id: questionId,
        option_text: sanitizeText(opt.optionText),
        is_correct: opt.isCorrect,
        order_index: opt.orderIndex,
      }))

      const { error: optionsError } = await supabase
        .from('quiz_options')
        .insert(optionsToInsert)

      if (optionsError) {
        console.error('Error updating options:', optionsError)
        return { error: 'Question updated but failed to update options' }
      }
    }
  }

  revalidatePath(`/teacher/courses/${quizData.course_id}/quizzes`)
  return { success: true }
}

// ============================================
// TEACHER: Delete a question
// ============================================
export async function deleteQuestion(questionId: string) {
  const parsed = z.object({ questionId: z.string().uuid() }).safeParse({ questionId })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const rl = await rateLimitAction('deleteQuestion')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify ownership
  const { data: question } = await supabase
    .from('quiz_questions')
    .select('quiz_id, quizzes:quizzes(course_id, courses:courses(created_by))')
    .eq('id', questionId)
    .single()

  if (!question) return { error: 'Question not found' }

  const quizData = question.quizzes as unknown as { course_id: string; courses: { created_by: string } }
  if (quizData?.courses?.created_by !== user.id) {
    return { error: 'Not authorized to delete this question' }
  }

  const { error } = await supabase
    .from('quiz_questions')
    .delete()
    .eq('id', questionId)

  if (error) {
    console.error('Error deleting question:', error)
    return { error: 'Failed to delete question' }
  }

  revalidatePath(`/teacher/courses/${quizData.course_id}/quizzes`)
  return { success: true }
}

// ============================================
// STUDENT: Start a quiz attempt
// ============================================
export async function startAttempt(quizId: string) {
  const parsed = z.object({ quizId: z.string().uuid() }).safeParse({ quizId })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const rl = await rateLimitAction('startAttempt')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get quiz details
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('*, courses:courses(id)')
    .eq('id', quizId)
    .single()

  if (!quiz) return { error: 'Quiz not found' }
  if (quiz.status !== 'published') return { error: 'This quiz is not available' }

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from('course_enrollments')
    .select('id')
    .eq('course_id', quiz.course_id)
    .eq('student_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  if (!enrollment) return { error: 'You are not enrolled in this course' }

  // Check attempt count
  const { data: existingAttempts } = await supabase
    .from('quiz_attempts')
    .select('id, attempt_number')
    .eq('quiz_id', quizId)
    .eq('student_id', user.id)
    .order('attempt_number', { ascending: false })

  const attemptCount = existingAttempts?.length ?? 0

  // Check for an incomplete attempt
  const incompleteAttempt = existingAttempts?.find(a => !(a as Record<string, unknown>).completed_at)
  if (incompleteAttempt) {
    return { data: incompleteAttempt }
  }

  if (quiz.max_attempts && attemptCount >= quiz.max_attempts) {
    return { error: `Maximum attempts (${quiz.max_attempts}) reached` }
  }

  const nextAttemptNumber = attemptCount + 1

  const { data: attempt, error } = await supabase
    .from('quiz_attempts')
    .insert({
      quiz_id: quizId,
      student_id: user.id,
      tenant_id: tenantId,
      attempt_number: nextAttemptNumber,
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error starting attempt:', error)
    return { error: 'Failed to start quiz attempt' }
  }

  return { data: attempt }
}

// ============================================
// STUDENT: Submit a quiz attempt
// ============================================
export async function submitAttempt(attemptId: string, answers: {
  questionId: string
  selectedOptionId?: string
  answerText?: string
}[]) {
  const submitAttemptSchema = z.object({
    attemptId: z.string().uuid(),
    answers: z.array(z.object({
      questionId: z.string().uuid(),
      selectedOptionId: z.string().uuid().optional(),
      answerText: z.string().max(10000).optional(),
    })).max(200),
  })
  const parsed = submitAttemptSchema.safeParse({ attemptId, answers })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const rl = await rateLimitAction('submitAttempt')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get the attempt
  const { data: attempt } = await supabase
    .from('quiz_attempts')
    .select('*, quizzes:quizzes(*, courses:courses(id))')
    .eq('id', attemptId)
    .single()

  if (!attempt) return { error: 'Attempt not found' }
  if (attempt.student_id !== user.id) return { error: 'Not authorized' }
  if (attempt.completed_at) return { error: 'This attempt has already been submitted' }

  const quiz = attempt.quizzes as unknown as {
    id: string
    show_results: boolean
    passing_score: number
    time_limit_minutes: number | null
    courses: { id: string }
  }

  // Check time limit
  if (quiz.time_limit_minutes) {
    const startedAt = new Date(attempt.started_at).getTime()
    const now = Date.now()
    const elapsed = (now - startedAt) / 60000 // minutes
    if (elapsed > quiz.time_limit_minutes + 1) {
      // Allow 1 minute grace period
      return { error: 'Time limit exceeded' }
    }
  }

  // Get all questions with their options
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('*, quiz_options(*)')
    .eq('quiz_id', quiz.id)

  if (!questions) return { error: 'Failed to load questions' }

  let totalScore = 0
  let totalPoints = 0

  const answersToInsert = answers.map((answer) => {
    const question = questions.find(q => q.id === answer.questionId)
    if (!question) return null

    totalPoints += Number(question.points)

    let isCorrect: boolean | null = null
    let pointsEarned = 0

    if (question.type === 'multiple_choice' || question.type === 'true_false') {
      // Auto-grade: check if selected option is the correct one
      const correctOption = (question.quiz_options || []).find(
        (o: { is_correct: boolean }) => o.is_correct
      )
      isCorrect = correctOption ? correctOption.id === answer.selectedOptionId : false
      pointsEarned = isCorrect ? Number(question.points) : 0
    } else if (question.type === 'fill_in_blank' || question.type === 'short_answer') {
      // Auto-grade: check if answer text matches any correct option
      const correctOptions = (question.quiz_options || []).filter(
        (o: { is_correct: boolean }) => o.is_correct
      )
      const studentAnswer = (answer.answerText || '').trim().toLowerCase()
      isCorrect = correctOptions.some(
        (o: { option_text: string }) => o.option_text.trim().toLowerCase() === studentAnswer
      )
      pointsEarned = isCorrect ? Number(question.points) : 0
    } else if (question.type === 'matching') {
      // Auto-grade matching: compare selected option
      const correctOption = (question.quiz_options || []).find(
        (o: { is_correct: boolean }) => o.is_correct
      )
      isCorrect = correctOption ? correctOption.id === answer.selectedOptionId : false
      pointsEarned = isCorrect ? Number(question.points) : 0
    }
    // essay type: isCorrect stays null (needs manual grading)

    totalScore += pointsEarned

    return {
      attempt_id: attemptId,
      question_id: answer.questionId,
      selected_option_id: answer.selectedOptionId || null,
      answer_text: answer.answerText ? sanitizeText(answer.answerText) : null,
      is_correct: isCorrect,
      points_earned: pointsEarned,
    }
  }).filter(Boolean)

  // Insert answers
  if (answersToInsert.length > 0) {
    const { error: answersError } = await supabase
      .from('quiz_answers')
      .insert(answersToInsert)

    if (answersError) {
      console.error('Error saving answers:', answersError)
      return { error: 'Failed to save answers' }
    }
  }

  // Calculate percentage and passed
  const percentage = totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100 * 100) / 100 : 0
  const passed = percentage >= (quiz.passing_score || 70)

  // Update the attempt
  const { error: updateError } = await supabase
    .from('quiz_attempts')
    .update({
      completed_at: new Date().toISOString(),
      score: totalScore,
      total_points: totalPoints,
      percentage,
      passed,
    })
    .eq('id', attemptId)

  if (updateError) {
    console.error('Error completing attempt:', updateError)
    return { error: 'Failed to complete attempt' }
  }

  return {
    success: true,
    data: {
      score: totalScore,
      totalPoints,
      percentage,
      passed,
    },
  }
}

// ============================================
// TEACHER: Get all attempts for a quiz
// ============================================
export async function getAttempts(quizId: string) {
  const parsed = z.object({ quizId: z.string().uuid() }).safeParse({ quizId })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify the caller is the course teacher or an admin/super_admin
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('course_id, courses:courses(created_by)')
    .eq('id', quizId)
    .single()

  if (!quiz) return { error: 'Quiz not found' }

  const courseData = quiz.courses as unknown as { created_by: string }
  if (courseData?.created_by !== user.id) {
    // Check if user is admin/super_admin
    if (!tenantId) return { error: 'No tenant context' }

    const { data: membership } = await supabase
      .from('tenant_memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .single()

    if (!membership || !['admin', 'super_admin'].includes(membership.role)) {
      return { error: 'Not authorized to view attempts for this quiz' }
    }
  }

  const { data: attempts, error } = await supabase
    .from('quiz_attempts')
    .select(`
      *,
      profiles:student_id(first_name, last_name, avatar_url)
    `)
    .eq('quiz_id', quizId)
    .order('started_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching attempts:', error)
    return { error: 'Failed to fetch attempts' }
  }

  return { data: attempts || [] }
}

// ============================================
// STUDENT: Get their attempt result
// ============================================
export async function getStudentAttempt(attemptId: string) {
  const parsed = z.object({ attemptId: z.string().uuid() }).safeParse({ attemptId })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: attempt, error } = await supabase
    .from('quiz_attempts')
    .select(`
      *,
      quizzes:quizzes(*, courses:courses(id, name)),
      quiz_answers:quiz_answers(
        *,
        quiz_questions:question_id(*, quiz_options(*))
      )
    `)
    .eq('id', attemptId)
    .single()

  if (error || !attempt) {
    console.error('Error fetching attempt:', error)
    return { error: 'Attempt not found' }
  }

  // Verify the student owns this attempt or is the course teacher
  const quiz = attempt.quizzes as unknown as { courses: { id: string } }
  if (attempt.student_id !== user.id) {
    const { data: course } = await supabase
      .from('courses')
      .select('created_by')
      .eq('id', quiz?.courses?.id)
      .single()

    if (!course || course.created_by !== user.id) {
      return { error: 'Not authorized to view this attempt' }
    }
  }

  return { data: attempt }
}

// ============================================
// STUDENT: Get quizzes for a course (published only)
// ============================================
export async function getStudentQuizzes(courseId: string) {
  const parsed = z.object({ courseId: z.string().uuid() }).safeParse({ courseId })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from('course_enrollments')
    .select('id')
    .eq('course_id', courseId)
    .eq('student_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  if (!enrollment) return { error: 'Not enrolled in this course' }

  let query = supabase
    .from('quizzes')
    .select('*')
    .eq('course_id', courseId)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (tenantId) {
    query = query.eq('tenant_id', tenantId)
  }

  const { data: quizzes, error } = await query

  if (error) {
    console.error('Error fetching student quizzes:', error)
    return { error: 'Failed to fetch quizzes' }
  }

  // Get student's attempts for these quizzes
  const quizIds = (quizzes || []).map(q => q.id)
  let attemptMap: Record<string, { count: number; bestScore: number | null; lastAttempt: string | null }> = {}

  if (quizIds.length > 0) {
    const { data: attempts } = await supabase
      .from('quiz_attempts')
      .select('quiz_id, percentage, completed_at, attempt_number')
      .eq('student_id', user.id)
      .in('quiz_id', quizIds)

    if (attempts) {
      for (const a of attempts) {
        if (!attemptMap[a.quiz_id]) {
          attemptMap[a.quiz_id] = { count: 0, bestScore: null, lastAttempt: null }
        }
        attemptMap[a.quiz_id].count++
        if (a.percentage !== null && (attemptMap[a.quiz_id].bestScore === null || a.percentage > attemptMap[a.quiz_id].bestScore!)) {
          attemptMap[a.quiz_id].bestScore = a.percentage
        }
        if (a.completed_at) {
          attemptMap[a.quiz_id].lastAttempt = a.completed_at
        }
      }
    }
  }

  const result = (quizzes || []).map(q => ({
    ...q,
    attemptCount: attemptMap[q.id]?.count ?? 0,
    bestScore: attemptMap[q.id]?.bestScore ?? null,
    lastAttempt: attemptMap[q.id]?.lastAttempt ?? null,
  }))

  return { data: result }
}
