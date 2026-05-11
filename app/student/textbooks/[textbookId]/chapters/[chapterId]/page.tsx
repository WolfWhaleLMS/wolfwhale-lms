export const dynamic = 'force-dynamic'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Layers,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getChapter, getTextbook, getReadingProgress } from '@/app/actions/textbooks'
import { TextbookReader } from '@/components/textbook/TextbookReader'
import { KeyTermsSidebar } from '@/components/textbook/KeyTermsSidebar'
import { ReadingProgressBar } from '@/components/textbook/ReadingProgressBar'
import type { KeyTerm, TextbookChapter, TextbookUnit, StudentReadingProgress } from '@/lib/types/textbook'

export default async function ChapterReaderPage({
  params,
}: {
  params: Promise<{ textbookId: string; chapterId: string }>
}) {
  const { textbookId, chapterId } = await params

  // Fetch chapter, textbook (for navigation), and reading progress in parallel
  const [chapter, textbook, progressData] = await Promise.all([
    getChapter(chapterId),
    getTextbook(textbookId),
    getReadingProgress(textbookId).catch(() => []),
  ])

  // Build ordered list of all published chapters for prev/next navigation
  const allChapters: TextbookChapter[] = textbook.units.flatMap(
    (u: TextbookUnit & { chapters: TextbookChapter[] }) =>
      u.chapters.filter((ch: TextbookChapter) => ch.is_published)
  )
  allChapters.sort((a: TextbookChapter, b: TextbookChapter) => a.chapter_number - b.chapter_number)

  const currentIndex = allChapters.findIndex((ch) => ch.id === chapterId)
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null
  const nextChapter =
    currentIndex < allChapters.length - 1
      ? allChapters[currentIndex + 1]
      : null

  // Get current chapter progress for initial scroll position
  const chapterProgress = progressData.find(
    (p: StudentReadingProgress) => p.chapter_id === chapterId
  ) as StudentReadingProgress | undefined

  const keyTerms = (chapter.key_terms || []) as KeyTerm[]
  const content = (chapter.content || []) as unknown[]

  // Find which unit this chapter belongs to
  const parentUnit = textbook.units.find(
    (u: TextbookUnit & { chapters: TextbookChapter[] }) =>
      u.chapters.some((ch: TextbookChapter) => ch.id === chapterId)
  )

  return (
    <>
      {/* Reading progress bar at top of page */}
      <ReadingProgressBar
        chapterId={chapterId}
        initialScrollPosition={chapterProgress?.scroll_position ?? 0}
      />

      <div className="mx-auto max-w-6xl px-4 py-2">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/student/textbooks"
            className="hover:text-foreground transition-colors"
          >
            Textbooks
          </Link>
          <span>/</span>
          <Link
            href={`/student/textbooks/${textbookId}`}
            className="hover:text-foreground transition-colors line-clamp-1"
          >
            {textbook.title}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium line-clamp-1">
            Chapter {chapter.chapter_number}
          </span>
        </div>

        {/* Layout: Content + Sidebar */}
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="min-w-0 flex-1 space-y-6">
            {/* Chapter Header */}
            <div className="ocean-card rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {parentUnit && parentUnit.id !== 'unassigned' && (
                    <p className="mb-1 text-sm font-medium text-primary">
                      Unit {parentUnit.unit_number}: {parentUnit.title}
                    </p>
                  )}
                  <h1 className="text-2xl font-bold text-foreground">
                    Chapter {chapter.chapter_number}: {chapter.title}
                  </h1>
                  {chapter.description && (
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {chapter.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Meta info */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {chapter.estimated_minutes && (
                  <Badge variant="secondary">
                    <Clock className="mr-1 h-3 w-3" />
                    {chapter.estimated_minutes} min read
                  </Badge>
                )}
                {keyTerms.length > 0 && (
                  <Badge variant="secondary">
                    <BookOpen className="mr-1 h-3 w-3" />
                    {keyTerms.length} key term{keyTerms.length !== 1 ? 's' : ''}
                  </Badge>
                )}
                {chapter.flashcard_count > 0 && (
                  <Badge variant="secondary">
                    <Layers className="mr-1 h-3 w-3" />
                    {chapter.flashcard_count} flashcard
                    {chapter.flashcard_count !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>

            {/* Indigenous Connection */}
            {chapter.indigenous_connection && (
              <div className="rounded-2xl border-l-4 border-amber-400 bg-amber-50 p-5 dark:bg-amber-950/30">
                <h3 className="mb-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Indigenous Connection
                </h3>
                <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">
                  {chapter.indigenous_connection}
                </p>
              </div>
            )}

            {/* Chapter Content */}
            <div className="ocean-card rounded-2xl p-6 md:p-8">
              <TextbookReader chapterId={chapterId} content={content} keyTerms={keyTerms} />
            </div>

            {/* Flashcard link */}
            {chapter.flashcard_count > 0 && (
              <div className="ocean-card flex items-center justify-between rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md">
                    <Layers className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Practice Flashcards
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {chapter.flashcard_count} card
                      {chapter.flashcard_count !== 1 ? 's' : ''} for this chapter
                    </p>
                  </div>
                </div>
                <Link
                  href={`/student/textbooks/${textbookId}/chapters/${chapterId}/flashcards`}
                >
                  <Button variant="outline" size="sm">
                    Study Now
                  </Button>
                </Link>
              </div>
            )}

            {/* Previous / Next Navigation */}
            <div className="flex items-center justify-between border-t border-border pt-6">
              {prevChapter ? (
                <Link
                  href={`/student/textbooks/${textbookId}/chapters/${prevChapter.id}`}
                  className="group flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-muted/50"
                >
                  <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Previous</p>
                    <p className="font-medium text-foreground line-clamp-1">
                      Ch. {prevChapter.chapter_number}: {prevChapter.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <Link
                  href={`/student/textbooks/${textbookId}`}
                  className="group flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-muted/50"
                >
                  <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Back to</p>
                    <p className="font-medium text-foreground line-clamp-1">
                      Table of Contents
                    </p>
                  </div>
                </Link>
              )}

              {nextChapter ? (
                <Link
                  href={`/student/textbooks/${textbookId}/chapters/${nextChapter.id}`}
                  className="group flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-muted/50"
                >
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Next</p>
                    <p className="font-medium text-foreground line-clamp-1">
                      Ch. {nextChapter.chapter_number}: {nextChapter.title}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                </Link>
              ) : (
                <Link
                  href={`/student/textbooks/${textbookId}`}
                  className="group flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-muted/50"
                >
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Back to</p>
                    <p className="font-medium text-foreground line-clamp-1">
                      Table of Contents
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                </Link>
              )}
            </div>
          </div>

          {/* Key Terms Sidebar (desktop: sticky right, mobile: floating button) */}
          {keyTerms.length > 0 && (
            <div className="hidden lg:block lg:w-72 lg:shrink-0">
              <KeyTermsSidebar keyTerms={keyTerms} />
            </div>
          )}
        </div>

        {/* Mobile Key Terms (floating button rendered by KeyTermsSidebar) */}
        {keyTerms.length > 0 && (
          <div className="lg:hidden">
            <KeyTermsSidebar keyTerms={keyTerms} />
          </div>
        )}
      </div>
    </>
  )
}
