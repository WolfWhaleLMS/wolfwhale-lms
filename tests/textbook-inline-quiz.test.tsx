import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TextbookReader } from '@/components/textbook/TextbookReader'

const repoRoot = path.resolve(__dirname, '..')
const actionMocks = vi.hoisted(() => ({
  recordTextbookInlineQuizAttempt: vi.fn(),
}))

vi.mock('@/app/actions/textbooks', () => ({
  recordTextbookInlineQuizAttempt: actionMocks.recordTextbookInlineQuizAttempt,
}))

function sourceFor(relativePath: string) {
  const absolutePath = path.join(repoRoot, relativePath)
  expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true)

  return readFileSync(absolutePath, 'utf8')
}

function migrationSource(namePart: string) {
  const migrationsDir = path.join(repoRoot, 'supabase/migrations')
  const fileName = readdirSync(migrationsDir).find((candidate) => candidate.includes(namePart))
  expect(fileName, `migration containing ${namePart} should exist`).toBeTruthy()

  return readFileSync(path.join(migrationsDir, fileName!), 'utf8')
}

afterEach(() => {
  cleanup()
  actionMocks.recordTextbookInlineQuizAttempt.mockReset()
})

describe('textbook inline quiz attempts', () => {
  it('normalizes seeded quiz blocks into durable attempt metadata', async () => {
    const helperPath = path.join(repoRoot, 'lib/textbooks/inline-quiz.ts')

    expect(existsSync(helperPath), 'inline quiz helper should exist').toBe(true)
    if (!existsSync(helperPath)) return

    const { normalizeInlineQuizBlock } = await import(pathToFileURL(helperPath).href)
    const quiz = normalizeInlineQuizBlock(
      {
        type: 'quiz',
        question: 'Which habitat helps young salmon hide?',
        options: ['Bare rock', 'Kelp forest', 'Parking lot'],
        correctIndex: 1,
        explanation: 'Kelp gives small fish cover.',
      },
      2
    )

    expect(quiz).toMatchObject({
      blockIndex: 2,
      question: 'Which habitat helps young salmon hide?',
      options: ['Bare rock', 'Kelp forest', 'Parking lot'],
      correctOptionIndex: 1,
      explanation: 'Kelp gives small fish cover.',
    })
    expect(quiz?.quizKey).toMatch(/^inline-quiz-2-[a-z0-9]+$/)
  })

  it('renders textbook quiz blocks as student answer forms and submits the selected option', async () => {
    actionMocks.recordTextbookInlineQuizAttempt.mockResolvedValue({
      isCorrect: true,
      correctOptionIndex: 1,
      explanation: 'Kelp gives small fish cover.',
      awardedCompanionXp: true,
    })

    render(
      <TextbookReader
        chapterId="11111111-1111-4111-8111-111111111111"
        content={[
          {
            type: 'quiz',
            question: 'Which habitat helps young salmon hide?',
            options: ['Bare rock', 'Kelp forest', 'Parking lot'],
            correctIndex: 1,
            explanation: 'Kelp gives small fish cover.',
          },
        ]}
      />
    )

    fireEvent.click(screen.getByRole('radio', { name: /Kelp forest/i }))
    fireEvent.click(screen.getByRole('button', { name: /Check answer/i }))

    await waitFor(() => {
      expect(actionMocks.recordTextbookInlineQuizAttempt).toHaveBeenCalledWith(
        '11111111-1111-4111-8111-111111111111',
        0,
        1
      )
    })
    expect(await screen.findByText(/Correct/i)).toBeInTheDocument()
    expect(screen.getByText(/Kelp gives small fish cover/i)).toBeInTheDocument()
    expect(screen.getByText(/Fish companion XP recorded/i)).toBeInTheDocument()
  })

  it('keeps the server action scoped to active students and audits quiz attempts before fish XP', () => {
    const source = sourceFor('app/actions/textbooks.ts')

    expect(source).toContain('export async function recordTextbookInlineQuizAttempt')
    expect(source).toContain('student_textbook_quiz_attempts')
    expect(source).toContain("eq('role', 'student')")
    expect(source).toContain("eq('status', 'active')")
    expect(source).toContain('textbook_quiz_attempt.submitted')
    expect(source).toContain("resource_type: 'textbook_quiz_attempt'")
    expect(source).toContain("source: 'quiz_completed'")
    expect(source.indexOf('textbook_quiz_attempt.submitted')).toBeLessThan(source.indexOf("source: 'quiz_completed'"))
  })

  it('ships an RLS-backed attempt table for textbook inline quizzes', () => {
    const migration = migrationSource('textbook_inline_quiz_attempts')

    expect(migration).toContain('CREATE TABLE IF NOT EXISTS public.student_textbook_quiz_attempts')
    expect(migration).toContain('quiz_key TEXT NOT NULL')
    expect(migration).toContain('attempt_count INTEGER NOT NULL DEFAULT 1')
    expect(migration).toContain('UNIQUE (tenant_id, student_id, chapter_id, quiz_key)')
    expect(migration).toContain('ALTER TABLE public.student_textbook_quiz_attempts ENABLE ROW LEVEL SECURITY')
    expect(migration).toContain('GRANT SELECT, INSERT, UPDATE ON public.student_textbook_quiz_attempts TO authenticated')
    expect(migration).toContain('GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_textbook_quiz_attempts TO service_role')
    expect(migration).toContain('student_textbook_quiz_attempts_select_relevant')
    expect(migration).toContain('student_textbook_quiz_attempts_insert_student')
    expect(migration).toContain('student_textbook_quiz_attempts_update_student')
    expect(migration).toContain('student_textbook_quiz_attempts_delete_admin')
  })
})
