export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { getStudentDecks, getTextbookFlashcardDecks } from '@/app/actions/flashcards'
import { ArrowLeft, BookOpen, Clock, Layers, Library } from 'lucide-react'

export default async function StudentFlashcardsPage() {
  let decks: Awaited<ReturnType<typeof getStudentDecks>> = []
  let textbookDecks: Awaited<ReturnType<typeof getTextbookFlashcardDecks>> = []
  let error: string | null = null

  try {
    const [courseDecks, tbDecks] = await Promise.all([
      getStudentDecks(),
      getTextbookFlashcardDecks(),
    ])
    decks = courseDecks
    textbookDecks = tbDecks
  } catch (e: any) {
    error = e.message
  }

  const hasNoDecks = decks.length === 0 && textbookDecks.length === 0

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

      {hasNoDecks && !error ? (
        <div className="ocean-card rounded-2xl p-12 text-center">
          <div className="flex justify-center mb-4">
            <Layers className="h-12 w-12 text-muted-foreground/40" />
          </div>
          <p className="text-muted-foreground">No flashcard decks available yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">Your teachers will publish decks when they&apos;re ready.</p>
        </div>
      ) : (
        <>
          {/* ===== COURSE FLASHCARD DECKS ===== */}
          {decks.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Course Decks</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {decks.map((deck) => (
                  <Link
                    key={deck.id}
                    href={`/student/flashcards/${deck.id}/study`}
                    className="ocean-card group rounded-2xl p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                        <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      {deck.dueCards > 0 && (
                        <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                          <Clock className="h-3 w-3" />
                          {deck.dueCards} due
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
                          className="h-full rounded-full bg-blue-500 transition-all"
                          style={{ width: `${Math.min(100, (deck.studiedCards / deck.card_count) * 100)}%` }}
                        />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ===== TEXTBOOK FLASHCARD DECKS ===== */}
          {textbookDecks.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                  <Library className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Textbook Flashcards</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {textbookDecks.map((deck) => (
                  <Link
                    key={deck.chapterId}
                    href={`/student/textbooks/${deck.textbookId}/chapters/${deck.chapterId}/flashcards`}
                    className="ocean-card group rounded-2xl p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                        <Library className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      {deck.dueCards > 0 && (
                        <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                          <Clock className="h-3 w-3" />
                          {deck.dueCards} due
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Ch. {deck.chapterNumber}: {deck.chapterTitle}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {deck.textbookTitle}
                    </p>

                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {deck.cardCount} cards
                      </span>
                      <span>
                        {deck.studiedCards}/{deck.cardCount} studied
                      </span>
                    </div>

                    {/* Progress bar */}
                    {deck.cardCount > 0 && (
                      <div className="mt-3 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all"
                          style={{ width: `${Math.min(100, (deck.studiedCards / deck.cardCount) * 100)}%` }}
                        />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
