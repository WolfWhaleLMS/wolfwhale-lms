export const dynamic = 'force-dynamic'
import { BookOpen } from 'lucide-react'
import { getTextbooks, getMyTextbooks, getReadingProgress } from '@/app/actions/textbooks'
import type { Textbook, StudentReadingProgress } from '@/lib/types/textbook'
import { TextbookBrowseClient } from './textbook-browse-client'

export default async function StudentTextbooksPage() {
  // Fetch all published textbooks and student assignments in parallel
  const [textbooks, myAssignments] = await Promise.all([
    getTextbooks(),
    getMyTextbooks().catch(() => []),
  ])

  // Build a set of assigned textbook IDs
  const assignedTextbookIds = new Set(
    myAssignments.map((a: any) => a.textbook_id)
  )

  // Fetch reading progress for all assigned textbooks in parallel
  const progressResults = await Promise.all(
    myAssignments.map(async (a: any) => {
      try {
        const progress = await getReadingProgress(a.textbook_id)
        return { textbookId: a.textbook_id as string, progress }
      } catch {
        return { textbookId: a.textbook_id as string, progress: [] }
      }
    })
  )

  // Build a map: textbookId -> { chaptersCompleted, progressPercentage }
  const progressByTextbook: Record<
    string,
    { chaptersCompleted: number; progressPercentage: number }
  > = {}

  for (const result of progressResults) {
    const completed = result.progress.filter(
      (p: StudentReadingProgress) => p.status === 'completed'
    ).length
    const textbook = textbooks.find(
      (t: Textbook) => t.id === result.textbookId
    )
    const total = textbook?.chapter_count || 1
    progressByTextbook[result.textbookId] = {
      chaptersCompleted: completed,
      progressPercentage:
        total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }

  // Collect unique subjects for filter tabs
  const subjects = Array.from(
    new Set(textbooks.map((t: Textbook) => t.subject))
  ).sort()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="whale-gradient rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <BookOpen className="h-8 w-8" />
              <h1 className="text-3xl font-bold tracking-tight">Textbooks</h1>
            </div>
            <p className="text-white/90">
              Browse and read your digital textbooks.
            </p>
            {textbooks.length > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                <span className="text-2xl">{textbooks.length}</span>
                <span>
                  Available Textbook{textbooks.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Client-side filterable grid */}
      <TextbookBrowseClient
        textbooks={textbooks as Textbook[]}
        subjects={subjects as string[]}
        assignedTextbookIds={Array.from(assignedTextbookIds) as string[]}
        progressByTextbook={progressByTextbook}
      />
    </div>
  )
}
