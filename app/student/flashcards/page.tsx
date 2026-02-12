import Link from 'next/link'
import { getStudentDecks } from '@/app/actions/flashcards'
import { ArrowLeft, BookOpen, Clock, Layers } from 'lucide-react'

export default async function StudentFlashcardsPage() {
  let decks: Awaited<ReturnType<typeof getStudentDecks>> = []
  let error: string | null = null

  try {
    decks = await getStudentDecks()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load flashcards'
  }

  return (
    <div className="space-y-6">
      <Link
        href="/student/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Flashcards</h1>
        <p className="mt-1 text-muted-foreground">
          Study with spaced repetition — cards you struggle with appear more often.
        </p>
      </div>

      {error && (
        <div className="ocean-card rounded-2xl p-6 text-center text-red-500">{error}</div>
      )}

      {decks.length === 0 && !error ? (
        <div className="ocean-card rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4 opacity-40">📇</div>
          <p className="text-muted-foreground">No flashcard decks available yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">Your teachers will publish decks when they&apos;re ready.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <Link
              key={deck.id}
              href={`/student/flashcards/${deck.id}/study`}
              className="ocean-card group rounded-2xl p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00BFFF]/10 dark:bg-[#00BFFF]/15">
                  <Layers className="h-5 w-5 text-[#00BFFF] dark:text-[#00BFFF]" />
                </div>
                {deck.dueCards > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-[#FFAA00]/10 px-2 py-0.5 text-xs font-medium text-[#D97706] dark:bg-[#FFAA00]/15 dark:text-[#FFD700]">
                    <Clock className="h-3 w-3" />
                    {deck.dueCards} due
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-foreground group-hover:text-[#00BFFF] dark:group-hover:text-[#00BFFF] transition-colors">
                {deck.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {deck.description || deck.courseName}
              </p>

              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {deck.card_count} cards
                </span>
                <span>
                  {deck.studiedCards}/{deck.card_count} studied
                </span>
              </div>

              {/* Progress bar */}
              {deck.card_count > 0 && (
                <div className="mt-3 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-[#00BFFF] transition-all"
                    style={{ width: `${Math.min(100, (deck.studiedCards / deck.card_count) * 100)}%` }}
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
