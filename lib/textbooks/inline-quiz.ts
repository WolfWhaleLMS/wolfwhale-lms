export interface InlineTextbookQuiz {
  blockIndex: number
  quizKey: string
  question: string
  options: string[]
  correctOptionIndex: number | null
  explanation: string
}

export interface InlineTextbookQuizResult {
  isCorrect: boolean
  correctOptionIndex: number | null
  selectedOption: string
}

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null
}

function blockValue(block: Record<string, unknown>, field: string) {
  const data = record(block.data)

  return data?.[field] ?? block[field]
}

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function optionText(value: unknown) {
  if (typeof value === 'string') return value.trim()

  const option = record(value)
  return text(option?.text ?? option?.label ?? option?.value)
}

function integer(value: unknown) {
  const number = Number(value)

  return Number.isInteger(number) ? number : null
}

function correctIndexFromValue(value: unknown, options: string[]) {
  const numeric = integer(value)
  if (numeric !== null) return numeric

  const answerText = text(value)
  if (!answerText) return null

  const normalizedAnswer = answerText.toLowerCase()
  const index = options.findIndex((option) => option.toLowerCase() === normalizedAnswer)

  return index >= 0 ? index : null
}

function stableHash(value: string) {
  let hash = 5381

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i)
  }

  return (hash >>> 0).toString(36)
}

export function normalizeInlineQuizBlock(block: unknown, blockIndex: number): InlineTextbookQuiz | null {
  const quizBlock = record(block)
  if (!quizBlock || quizBlock.type !== 'quiz') return null

  const question = text(blockValue(quizBlock, 'question') ?? blockValue(quizBlock, 'text'))
  const rawOptions = blockValue(quizBlock, 'options')
  const options = Array.isArray(rawOptions) ? rawOptions.map(optionText).filter(Boolean) : []
  if (!question || options.length < 2) return null

  const correctValue =
    blockValue(quizBlock, 'correctIndex') ??
    blockValue(quizBlock, 'correct') ??
    blockValue(quizBlock, 'answerIndex') ??
    blockValue(quizBlock, 'answer')
  const correctOptionIndex = correctIndexFromValue(correctValue, options)
  const safeCorrectOptionIndex =
    correctOptionIndex !== null && correctOptionIndex >= 0 && correctOptionIndex < options.length ? correctOptionIndex : null
  const fingerprint = stableHash(JSON.stringify({ question, options, correctOptionIndex: safeCorrectOptionIndex }))

  return {
    blockIndex,
    quizKey: `inline-quiz-${blockIndex}-${fingerprint}`,
    question,
    options,
    correctOptionIndex: safeCorrectOptionIndex,
    explanation: text(blockValue(quizBlock, 'explanation')),
  }
}

export function assessInlineQuizAnswer(
  quiz: InlineTextbookQuiz,
  selectedOptionIndex: number
): InlineTextbookQuizResult {
  const selectedOption = quiz.options[selectedOptionIndex] ?? ''

  return {
    selectedOption,
    correctOptionIndex: quiz.correctOptionIndex,
    isCorrect: quiz.correctOptionIndex !== null && selectedOptionIndex === quiz.correctOptionIndex,
  }
}
