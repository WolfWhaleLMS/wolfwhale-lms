export const dynamic = 'force-dynamic'
import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  GraduationCap,
  Layers,
  PlayCircle,
  DollarSign,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getTextbook, getReadingProgress } from '@/app/actions/textbooks'
import { ChapterList } from '@/components/textbook/ChapterList'
import type { StudentReadingProgress, TextbookChapter, TextbookUnit } from '@/lib/types/textbook'

export default async function TextbookTOCPage({
  params,
}: {
  params: Promise<{ textbookId: string }>
}) {
  const { textbookId } = await params

  const [textbook, progressData] = await Promise.all([
    getTextbook(textbookId),
    getReadingProgress(textbookId).catch(() => []),
  ])

  // Build a progress map: chapterId -> StudentReadingProgress
  const progressMap: Record<string, StudentReadingProgress> = {}
  for (const p of progressData) {
    progressMap[p.chapter_id] = p as StudentReadingProgress
  }

  // Calculate overall stats
  const allChapters: TextbookChapter[] = textbook.units.flatMap(
    (u: TextbookUnit & { chapters: TextbookChapter[] }) =>
      u.chapters.filter((ch: TextbookChapter) => ch.is_published)
  )
  const totalChapters = allChapters.length
  const completedChapters = allChapters.filter(
    (ch: TextbookChapter) => progressMap[ch.id]?.status === 'completed'
  ).length
  const inProgressChapters = allChapters.filter(
    (ch: TextbookChapter) => progressMap[ch.id]?.status === 'in_progress'
  ).length
  const overallProgress =
    totalChapters > 0
      ? Math.round((completedChapters / totalChapters) * 100)
      : 0

  // Total estimated reading time
  const totalMinutes = allChapters.reduce(
    (sum: number, ch: TextbookChapter) => sum + (ch.estimated_minutes || 0),
    0
  )

  // Find the first in-progress or first unstarted chapter for "Continue/Start Reading"
  let continueChapter = allChapters.find(
    (ch: TextbookChapter) => progressMap[ch.id]?.status === 'in_progress'
  )
  if (!continueChapter) {
    continueChapter = allChapters.find(
      (ch: TextbookChapter) => !progressMap[ch.id] || progressMap[ch.id]?.status === 'not_started'
    )
  }

  const subjectLabels: Record<string, string> = {
    math: 'Math',
    science: 'Science',
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology',
    ela: 'ELA',
  }

  const hasStarted = completedChapters > 0 || inProgressChapters > 0

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Breadcrumb */}
      <Link
        href="/student/textbooks"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Textbooks
      </Link>

      {/* Textbook Header */}
      <div className="ocean-card overflow-hidden rounded-2xl">
        <div className="flex flex-col md:flex-row">
          {/* Cover image */}
          {textbook.cover_image_url ? (
            <div className="h-48 w-full shrink-0 md:h-auto md:w-56">
              <img
                src={textbook.cover_image_url}
                alt={textbook.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-48 w-full shrink-0 items-center justify-center bg-gradient-to-br from-primary/20 to-blue-500/20 md:h-auto md:w-56">
              <BookOpen className="h-16 w-16 text-primary/40" />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold text-foreground">
              {textbook.title}
            </h1>

            {textbook.description && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {textbook.description}
              </p>
            )}

            {/* Meta tags */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="default">
                {subjectLabels[textbook.subject] || textbook.subject}
              </Badge>
              {textbook.grade_level && (
                <Badge variant="secondary">
                  <GraduationCap className="mr-1 h-3 w-3" />
                  Grade {textbook.grade_level}
                </Badge>
              )}
              <Badge variant="secondary">
                <Layers className="mr-1 h-3 w-3" />
                {totalChapters} chapter{totalChapters !== 1 ? 's' : ''}
              </Badge>
              {totalMinutes > 0 && (
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  {totalMinutes < 60
                    ? `${totalMinutes} min`
                    : `${Math.round(totalMinutes / 60)} hr${Math.round(totalMinutes / 60) !== 1 ? 's' : ''}`}
                </Badge>
              )}
            </div>

            {/* Progress stats */}
            {totalChapters > 0 && (
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {completedChapters} / {totalChapters} chapters completed
                  </span>
                  <span
                    className={`font-bold ${
                      overallProgress === 100
                        ? 'text-green-600 dark:text-green-400'
                        : overallProgress > 0
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {overallProgress}%
                  </span>
                </div>
                <Progress value={overallProgress} className="h-2.5" />
              </div>
            )}

            {/* CTA Button */}
            {continueChapter && (
              <div className="mt-5">
                <Link
                  href={`/student/textbooks/${textbookId}/chapters/${continueChapter.id}`}
                >
                  <Button className="whale-gradient text-white" size="lg">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    {hasStarted ? 'Continue Reading' : 'Start Reading'}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Replaces textbooks info */}
      {textbook.replaces_textbooks &&
        textbook.replaces_textbooks.length > 0 && (
          <div className="ocean-card rounded-2xl p-6">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              This digital textbook replaces:
            </h3>
            <div className="space-y-2">
              {textbook.replaces_textbooks.map((replaced: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {replaced.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {replaced.publisher}
                      {replaced.lineage && ` -- ${replaced.lineage}`}
                    </p>
                  </div>
                  {replaced.price > 0 && (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span className="text-sm font-semibold">
                        {replaced.price.toFixed(2)} saved
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Chapter List */}
      <ChapterList
        textbookId={textbookId}
        units={textbook.units}
        progressMap={progressMap}
      />
    </div>
  )
}
