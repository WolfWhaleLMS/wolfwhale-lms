'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DOMPurify from 'dompurify'
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
  ExternalLink,
  File,
  FileText,
  Loader2,
  Target,
} from 'lucide-react'

interface LessonData {
  id: string
  course_id: string
  title: string
  description: string | null
  content: unknown
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

  // Helper to resolve block data - supports both flat (block.xxx) and nested (block.data.xxx) formats
  // Returns string for safe rendering in JSX; callers that need other types should cast explicitly
  function d(block: Record<string, unknown>, field: string): string {
    const data = block.data as Record<string, unknown> | undefined
    const value = data?.[field] ?? block[field]
    if (value == null) return ''
    if (typeof value === 'string') return value
    return String(value)
  }

  // Helper to resolve block data as an array (e.g. quiz options, list items)
  function dArray(block: Record<string, unknown>, field: string): string[] {
    const data = block.data as Record<string, unknown> | undefined
    const value = data?.[field] ?? block[field]
    if (Array.isArray(value)) return value as string[]
    return []
  }

  // Validate URLs from lesson content to prevent javascript: and other dangerous protocols
  function safeUrl(url: string): string {
    try {
      const parsed = new URL(url, window.location.origin)
      if (!['http:', 'https:'].includes(parsed.protocol)) return ''
      return url
    } catch {
      return ''
    }
  }

  // Render content blocks from JSONB content
  function renderContent(content: unknown) {
    if (!content) return null

    // If it is a string, render as HTML
    if (typeof content === 'string') {
      return (
        <div
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
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
          {(content as unknown[]).map((rawBlock, index: number) => {
            // Handle raw string blocks (legacy content format)
            if (typeof rawBlock === 'string') {
              return (
                <div
                  key={`block-${index}`}
                  className="prose prose-slate dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(rawBlock) }}
                />
              )
            }

            const block = rawBlock as Record<string, unknown>
            const blockKey = (block.id as string) || `block-${index}`

            switch (block.type) {
              case 'heading': {
                const text = d(block, 'text') || d(block, 'content')
                const level = Number(d(block, 'level')) || 2
                const Tag = level === 3 ? 'h3' : level === 4 ? 'h4' : 'h2'
                const sizeClass = level === 3 ? 'text-lg' : level === 4 ? 'text-base' : 'text-xl'
                return (
                  <Tag
                    key={blockKey}
                    className={`${sizeClass} font-bold text-foreground`}
                  >
                    {text}
                  </Tag>
                )
              }
              case 'paragraph':
              case 'text':
                return (
                  <div
                    key={blockKey}
                    className="prose prose-slate dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(d(block, 'text') || d(block, 'content') || ''),
                    }}
                  />
                )
              case 'image': {
                const url = safeUrl(d(block, 'url') || d(block, 'src') || '')
                const alt = d(block, 'alt') || d(block, 'caption') || 'Lesson image'
                const caption = d(block, 'caption')
                return (
                  <figure key={blockKey} className="my-4">
                    <img
                      src={url}
                      alt={alt}
                      className="max-w-full rounded-lg"
                    />
                    {caption && (
                      <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                        {caption}
                      </figcaption>
                    )}
                  </figure>
                )
              }
              case 'video': {
                const videoUrl = safeUrl(d(block, 'url') || d(block, 'src') || '')
                const videoTitle = d(block, 'title') || 'Lesson video'
                const videoSource = d(block, 'source') // 'youtube' | 'url' | undefined
                let ytVideoId = d(block, 'videoId') || null

                // If no explicit videoId, try to extract from URL for backwards compatibility
                if (!ytVideoId && videoUrl) {
                  const watchMatch = videoUrl.match(/(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/)
                  if (watchMatch) ytVideoId = watchMatch[1]
                  const shortMatch = videoUrl.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/)
                  if (!ytVideoId && shortMatch) ytVideoId = shortMatch[1]
                  const embedMatch = videoUrl.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
                  if (!ytVideoId && embedMatch) ytVideoId = embedMatch[1]
                }

                const isYouTube = videoSource === 'youtube' || ytVideoId

                return (
                  <div key={blockKey} className="my-4">
                    {videoTitle && d(block, 'title') && (
                      <p className="mb-2 text-sm font-medium text-foreground">{videoTitle}</p>
                    )}
                    {isYouTube && ytVideoId ? (
                      <div className="aspect-video overflow-hidden rounded-lg">
                        <iframe
                          src={`https://www.youtube.com/embed/${ytVideoId}?rel=0`}
                          className="h-full w-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          title={videoTitle}
                        />
                      </div>
                    ) : videoUrl ? (
                      <div className="aspect-video overflow-hidden rounded-lg bg-black">
                        <video
                          src={videoUrl}
                          controls
                          className="h-full w-full"
                          preload="metadata"
                          title={videoTitle}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <div className="aspect-video flex items-center justify-center rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">No video URL provided</p>
                      </div>
                    )}
                  </div>
                )
              }
              case 'file': {
                const fileUrl = safeUrl(d(block, 'url') || '')
                const filename = d(block, 'filename') || 'Download file'
                const size = d(block, 'size')
                return (
                  <a
                    key={blockKey}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="shrink-0 rounded-lg bg-primary/10 p-3">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {filename}
                      </p>
                      {size && (
                        <p className="text-xs text-muted-foreground">{size}</p>
                      )}
                    </div>
                    <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </a>
                )
              }
              case 'divider':
                return (
                  <hr
                    key={blockKey}
                    className="my-6 border-t-2 border-border"
                  />
                )
              case 'list':
                return (
                  <ul
                    key={blockKey}
                    className="list-disc space-y-1 pl-6 text-foreground"
                  >
                    {dArray(block, 'items').map(
                      (item: string, i: number) => (
                        <li key={`${blockKey}-item-${i}`}>{item}</li>
                      )
                    )}
                  </ul>
                )
              case 'callout':
              case 'note': {
                const variant = d(block, 'variant') || 'info'
                const calloutText = d(block, 'text') || d(block, 'content') || ''
                const variantStyles =
                  variant === 'warning'
                    ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30'
                    : variant === 'tip'
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/30'
                    : variant === 'success'
                    ? 'border-green-400 bg-green-50 dark:bg-green-950/30'
                    : 'border-primary bg-primary/5'
                return (
                  <div
                    key={blockKey}
                    className={`rounded-lg border-l-4 p-4 ${variantStyles}`}
                  >
                    <div
                      className="prose prose-slate dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(calloutText) }}
                    />
                  </div>
                )
              }
              case 'quiz': {
                const question = d(block, 'question')
                const options = dArray(block, 'options')
                return (
                  <div
                    key={blockKey}
                    className="rounded-lg border border-border p-4 space-y-3"
                  >
                    <p className="font-medium text-foreground">{question}</p>
                    <div className="space-y-2">
                      {options.map((option: string, i: number) => (
                        <div
                          key={`${blockKey}-opt-${i}`}
                          className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
              case 'link': {
                const linkUrl = safeUrl(d(block, 'url') || '')
                const linkTitle = d(block, 'title')
                const linkDesc = d(block, 'description')
                return (
                  <a
                    key={blockKey}
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="shrink-0 rounded-lg bg-primary/10 p-2.5">
                      <ExternalLink className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">
                        {linkTitle || linkUrl}
                      </p>
                      {linkDesc && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {linkDesc}
                        </p>
                      )}
                      <p className="text-xs text-primary/70 mt-1 truncate">
                        {linkUrl}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground mt-1" />
                  </a>
                )
              }
              case 'pdf': {
                const pdfUrl = safeUrl(d(block, 'url') || '')
                const pdfTitle = d(block, 'title') || 'PDF Document'
                const pageCount = d(block, 'pageCount')
                return (
                  <div
                    key={blockKey}
                    className="rounded-lg border border-border overflow-hidden"
                  >
                    <div className="bg-muted/50 px-4 py-3 flex items-center justify-between border-b border-border">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          {pdfTitle}
                        </span>
                        {pageCount && (
                          <span className="text-xs text-muted-foreground">
                            ({pageCount} pages)
                          </span>
                        )}
                      </div>
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </a>
                    </div>
                    <iframe
                      src={pdfUrl}
                      className="w-full bg-white"
                      style={{ height: '600px' }}
                      title={pdfTitle}
                    />
                    {/* Fallback for browsers that cannot embed PDFs */}
                    <noscript>
                      <div className="p-4 text-center">
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Download PDF
                        </a>
                      </div>
                    </noscript>
                  </div>
                )
              }
              case 'document': {
                const docUrl = safeUrl(d(block, 'url') || '')
                const docName = d(block, 'fileName') || 'Document'
                const docSize = d(block, 'fileSize')
                const docType = d(block, 'fileType')
                return (
                  <a
                    key={blockKey}
                    href={docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="shrink-0 rounded-lg bg-primary/10 p-3">
                      <File className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {docName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        {docType && (
                          <span>
                            {docType.split('/').pop()?.toUpperCase()}
                          </span>
                        )}
                        {docSize && (
                          <span>{formatFileSize(Number(docSize))}</span>
                        )}
                      </div>
                    </div>
                    <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </a>
                )
              }
              case 'tool': {
                return (
                  <div key={blockKey} className="rounded-lg border border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground opacity-60">
                    <BookOpen className="mx-auto mb-2 h-6 w-6 opacity-40" />
                    Tool not available
                  </div>
                )
              }
              default:
                if (d(block, 'text') || d(block, 'content')) {
                  return (
                    <div
                      key={blockKey}
                      className="prose prose-slate dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(d(block, 'text') || d(block, 'content') || ''),
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
    if (typeof content === 'object' && content !== null) {
      const obj = content as Record<string, unknown>
      const textVal = typeof obj.text === 'string' ? obj.text : ''
      const contentVal = typeof obj.content === 'string' ? obj.content : ''
      if (textVal || contentVal) {
        return (
          <div
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(textVal || contentVal),
            }}
          />
        )
      }
    }

    return null
  }

  function formatFileSize(bytes: number | null): string {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Loading state — skeleton that mirrors the final layout
  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 animate-in fade-in duration-300">
        <div className="h-5 w-32 rounded bg-muted animate-pulse" />
        <div className="ocean-card rounded-2xl p-6 space-y-4">
          <div className="h-7 w-3/4 rounded bg-muted animate-pulse" />
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="h-4 w-20 rounded bg-muted animate-pulse" />
            <div className="h-4 w-16 rounded bg-muted animate-pulse" />
          </div>
        </div>
        <div className="ocean-card rounded-2xl p-6 space-y-4">
          <div className="h-6 w-1/2 rounded bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-48 w-full rounded-lg bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="h-12 w-48 rounded-lg bg-muted animate-pulse" />
        </div>
        <div className="flex items-center justify-between border-t border-border pt-6">
          <div className="h-16 w-44 rounded-lg bg-muted animate-pulse" />
          <div className="h-16 w-44 rounded-lg bg-muted animate-pulse" />
        </div>
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
                    key={`objective-${index}`}
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
