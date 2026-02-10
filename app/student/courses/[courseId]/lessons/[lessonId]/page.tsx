'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getLessonWithNavigation } from '@/app/actions/lessons'
import { trackProgress } from '@/app/actions/lessons'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Loader2,
  Target,
} from 'lucide-react'

interface LessonData {
  id: string
  course_id: string
  title: string
  description: string | null
  content: any
  learning_objectives: string[] | null
  duration_minutes: number | null
  status: string
  order_index: number
  created_at: string
  attachments: Array<{
    id: string
    file_name: string
    file_path: string
    file_type: string | null
    file_size: number | null
    display_name: string | null
  }>
  progress: {
    id: string
    status: string
    progress_percentage: number
    time_spent_seconds: number
    completed_at: string | null
  } | null
  previous: { id: string; title: string } | null
  next: { id: string; title: string } | null
}

export default function StudentLessonViewerPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>
}) {
  const router = useRouter()
  const [lessonData, setLessonData] = useState<LessonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [courseId, setCourseId] = useState('')
  const [lessonId, setLessonId] = useState('')

  // Time tracking
  const startTimeRef = useRef<number>(Date.now())
  const timeAccumulatorRef = useRef<number>(0)

  // Resolve params and load lesson data
  useEffect(() => {
    let cancelled = false

    async function load() {
      const resolvedParams = await params
      if (cancelled) return

      setCourseId(resolvedParams.courseId)
      setLessonId(resolvedParams.lessonId)

      setLoading(true)
      startTimeRef.current = Date.now()

      try {
        const data = await getLessonWithNavigation(
          resolvedParams.lessonId,
          resolvedParams.courseId
        )
        if (!cancelled) {
          setLessonData(data as LessonData | null)
          setIsComplete(data?.progress?.status === 'completed')

          // Mark as in progress if not started
          if (data && (!data.progress || data.progress.status === 'not_started')) {
            await trackProgress(resolvedParams.lessonId, 'in_progress')
          }
        }
      } catch (err) {
        console.error('Error loading lesson:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [params])

  // Track time spent on page
  useEffect(() => {
    const interval = setInterval(() => {
      timeAccumulatorRef.current = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      )
    }, 1000)

    return () => {
      clearInterval(interval)
      // On unmount, send accumulated time
      if (lessonId && timeAccumulatorRef.current > 5) {
        trackProgress(lessonId, 'in_progress', timeAccumulatorRef.current).catch(
          () => {}
        )
      }
    }
  }, [lessonId])

  const handleMarkComplete = useCallback(async () => {
    if (!lessonId) return
    setMarking(true)

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000)

    try {
      const result = await trackProgress(lessonId, 'completed', timeSpent)
      if (result.success) {
        setIsComplete(true)
        // Reset the timer
        startTimeRef.current = Date.now()
        timeAccumulatorRef.current = 0
      }
    } catch (err) {
      console.error('Error marking complete:', err)
    } finally {
      setMarking(false)
    }
  }, [lessonId])

  // Render content blocks from JSONB content
  function renderContent(content: any) {
    if (!content) return null

    // If it is a string, render as HTML
    if (typeof content === 'string') {
      return (
        <div
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )
    }

    // If it is an array of content blocks
    if (Array.isArray(content)) {
      if (content.length === 0) {
        return (
          <div className="py-8 text-center text-muted-foreground">
            <BookOpen className="mx-auto mb-3 h-10 w-10 opacity-40" />
            <p>No content has been added to this lesson yet.</p>
          </div>
        )
      }

      return (
        <div className="space-y-4">
          {content.map((block: any, index: number) => {
            if (typeof block === 'string') {
              return (
                <div
                  key={index}
                  className="prose prose-slate dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: block }}
                />
              )
            }

            switch (block.type) {
              case 'heading':
                return (
                  <h2
                    key={index}
                    className="text-xl font-bold text-foreground"
                  >
                    {block.text || block.content}
                  </h2>
                )
              case 'paragraph':
              case 'text':
                return (
                  <div
                    key={index}
                    className="prose prose-slate dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: block.text || block.content || '',
                    }}
                  />
                )
              case 'image':
                return (
                  <figure key={index} className="my-4">
                    <img
                      src={block.url || block.src}
                      alt={block.alt || block.caption || 'Lesson image'}
                      className="max-w-full rounded-lg"
                    />
                    {block.caption && (
                      <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                )
              case 'video':
                return (
                  <div
                    key={index}
                    className="my-4 aspect-video overflow-hidden rounded-lg"
                  >
                    <iframe
                      src={block.url || block.src}
                      className="h-full w-full"
                      allowFullScreen
                      title={block.title || 'Lesson video'}
                    />
                  </div>
                )
              case 'list':
                return (
                  <ul
                    key={index}
                    className="list-disc space-y-1 pl-6 text-foreground"
                  >
                    {(block.items || []).map(
                      (item: string, i: number) => (
                        <li key={i}>{item}</li>
                      )
                    )}
                  </ul>
                )
              case 'callout':
              case 'note':
                return (
                  <div
                    key={index}
                    className="rounded-lg border-l-4 border-primary bg-primary/5 p-4"
                  >
                    <div
                      className="prose prose-slate dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: block.text || block.content || '',
                      }}
                    />
                  </div>
                )
              default:
                if (block.text || block.content) {
                  return (
                    <div
                      key={index}
                      className="prose prose-slate dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: block.text || block.content || '',
                      }}
                    />
                  )
                }
                return null
            }
          })}
        </div>
      )
    }

    // If it is an object with a text/content property
    if (typeof content === 'object' && (content.text || content.content)) {
      return (
        <div
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: content.text || content.content,
          }}
        />
      )
    }

    return null
  }

  function formatFileSize(bytes: number | null): string {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading lesson...</p>
      </div>
    )
  }

  if (!lessonData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <h2 className="text-xl font-semibold text-foreground">
          Lesson not found
        </h2>
        <p className="mt-2 text-muted-foreground">
          This lesson may have been removed or you may not have access.
        </p>
        <Link
          href={`/student/courses/${courseId}`}
          className="whale-gradient mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white"
        >
          Back to Course
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Breadcrumb Navigation */}
      <Link
        href={`/student/courses/${courseId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Course
      </Link>

      {/* Lesson Header */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              {lessonData.title}
            </h1>
            {lessonData.description && (
              <p className="mt-2 text-muted-foreground">
                {lessonData.description}
              </p>
            )}
          </div>
          {isComplete && (
            <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </div>
          )}
        </div>

        {/* Meta info */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {lessonData.duration_minutes && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{lessonData.duration_minutes} min</span>
            </div>
          )}
          <span className="text-xs">
            Lesson {lessonData.order_index + 1}
          </span>
        </div>
      </div>

      {/* Learning Objectives */}
      {lessonData.learning_objectives &&
        lessonData.learning_objectives.length > 0 && (
          <div className="ocean-card rounded-2xl p-6">
            <div className="mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Learning Objectives
              </h2>
            </div>
            <ul className="space-y-2">
              {lessonData.learning_objectives.map(
                (objective: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    {objective}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

      {/* Lesson Content */}
      <div className="ocean-card rounded-2xl p-6">
        {renderContent(lessonData.content)}
      </div>

      {/* Attachments */}
      {lessonData.attachments && lessonData.attachments.length > 0 && (
        <div className="ocean-card rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Attachments
          </h2>
          <div className="space-y-2">
            {lessonData.attachments.map((attachment) => (
              <a
                key={attachment.id}
                href={attachment.file_path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
              >
                <FileText className="h-5 w-5 shrink-0 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {attachment.display_name || attachment.file_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {attachment.file_type}
                    {attachment.file_size
                      ? ` - ${formatFileSize(attachment.file_size)}`
                      : ''}
                  </p>
                </div>
                <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Mark Complete Button */}
      {!isComplete && (
        <div className="flex justify-center">
          <Button
            onClick={handleMarkComplete}
            disabled={marking}
            className="whale-gradient text-white px-8 py-3"
            size="lg"
          >
            {marking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Marking Complete...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark as Complete
              </>
            )}
          </Button>
        </div>
      )}

      {/* Previous / Next Navigation */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        {lessonData.previous ? (
          <Link
            href={`/student/courses/${courseId}/lessons/${lessonData.previous.id}`}
            className="group flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-muted/50"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Previous</p>
              <p className="font-medium text-foreground line-clamp-1">
                {lessonData.previous.title}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {lessonData.next ? (
          <Link
            href={`/student/courses/${courseId}/lessons/${lessonData.next.id}`}
            className="group flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-muted/50"
          >
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Next</p>
              <p className="font-medium text-foreground line-clamp-1">
                {lessonData.next.title}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
