import Link from 'next/link'
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronRight,
  Lightbulb,
  PlayCircle,
} from 'lucide-react'
import type {
  TextbookUnit,
  TextbookChapter,
  StudentReadingProgress,
} from '@/lib/types/textbook'

interface UnitWithChapters extends TextbookUnit {
  chapters: TextbookChapter[]
}

interface ChapterListProps {
  textbookId: string
  units: UnitWithChapters[]
  progressMap: Record<string, StudentReadingProgress>
}

function getChapterStatus(
  chapterId: string,
  progressMap: Record<string, StudentReadingProgress>
): 'not_started' | 'in_progress' | 'completed' {
  const progress = progressMap[chapterId]
  if (!progress) return 'not_started'
  return progress.status
}

export function ChapterList({ textbookId, units, progressMap }: ChapterListProps) {
  return (
    <div className="space-y-6">
      {units.map((unit) => (
        <div key={unit.id} className="ocean-card rounded-2xl overflow-hidden">
          {/* Unit Header */}
          <div className="border-b border-border bg-muted/30 px-6 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {unit.id !== 'unassigned' && (
                    <span className="text-primary mr-2">Unit {unit.unit_number}</span>
                  )}
                  {unit.title}
                </h3>
                {unit.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {unit.description}
                  </p>
                )}
              </div>
              {/* Unit completion count */}
              <UnitProgress chapters={unit.chapters} progressMap={progressMap} />
            </div>

            {/* Big idea or essential question */}
            {(unit.big_idea || unit.essential_question) && (
              <div className="mt-3 flex flex-wrap gap-3">
                {unit.big_idea && (
                  <div className="inline-flex items-start gap-1.5 rounded-lg bg-primary/5 px-3 py-1.5 text-xs text-primary">
                    <Lightbulb className="mt-0.5 h-3 w-3 shrink-0" />
                    <span className="line-clamp-1">{unit.big_idea}</span>
                  </div>
                )}
                {unit.essential_question && (
                  <div className="inline-flex items-start gap-1.5 rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs text-amber-700 dark:text-amber-400">
                    <span className="font-semibold">Q:</span>
                    <span className="line-clamp-1">{unit.essential_question}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chapter List */}
          <div className="divide-y divide-border">
            {unit.chapters
              .filter((ch) => ch.is_published)
              .map((chapter) => {
                const status = getChapterStatus(chapter.id, progressMap)
                return (
                  <Link
                    key={chapter.id}
                    href={`/student/textbooks/${textbookId}/chapters/${chapter.id}`}
                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/30"
                  >
                    {/* Status Icon */}
                    <div className="shrink-0">
                      {status === 'completed' ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                      ) : status === 'in_progress' ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <PlayCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          <span className="text-sm font-semibold text-muted-foreground">
                            {chapter.chapter_number}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Chapter Info */}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        Chapter {chapter.chapter_number}: {chapter.title}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        {chapter.estimated_minutes && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {chapter.estimated_minutes} min
                          </span>
                        )}
                        {chapter.key_terms && chapter.key_terms.length > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {chapter.key_terms.length} key terms
                          </span>
                        )}
                        {status === 'in_progress' && (
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            In Progress
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )
}

function UnitProgress({
  chapters,
  progressMap,
}: {
  chapters: TextbookChapter[]
  progressMap: Record<string, StudentReadingProgress>
}) {
  const published = chapters.filter((ch) => ch.is_published)
  const completed = published.filter(
    (ch) => progressMap[ch.id]?.status === 'completed'
  ).length
  const total = published.length

  if (total === 0) return null

  return (
    <div className="shrink-0 text-right">
      <span
        className={`text-sm font-bold ${
          completed === total
            ? 'text-green-600 dark:text-green-400'
            : 'text-muted-foreground'
        }`}
      >
        {completed}/{total}
      </span>
      <p className="text-xs text-muted-foreground">chapters</p>
    </div>
  )
}
