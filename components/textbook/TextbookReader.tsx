'use client'

import { useState, type FormEvent } from 'react'
import {
  BookOpen,
  CheckCircle2,
  Download,
  ExternalLink,
  File,
  FileText,
  Loader2,
  XCircle,
} from 'lucide-react'
import { recordTextbookInlineQuizAttempt } from '@/app/actions/textbooks'
import { TextbookImage } from '@/components/textbook/TextbookImage'
import { normalizeInlineQuizBlock, type InlineTextbookQuiz } from '@/lib/textbooks/inline-quiz'
import type { KeyTerm } from '@/lib/types/textbook'

interface TextbookReaderProps {
  content: unknown[]
  keyTerms?: KeyTerm[]
  chapterId?: string
}

interface InlineQuizResult {
  isCorrect: boolean
  correctOptionIndex: number | null
  explanation: string
  awardedCompanionXp: boolean
}

/** Resolve block data -- supports both flat (block.xxx) and nested (block.data.xxx) formats. */
function d(block: any, field: string): any {
  return block.data?.[field] ?? block[field]
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Highlight key terms within HTML text.
 * Wraps matching terms in a <mark> tag with styling.
 */
function highlightKeyTerms(html: string, terms: KeyTerm[]): string {
  if (!terms || terms.length === 0) return html
  let result = html
  for (const kt of terms) {
    // Only match whole words, case-insensitive, avoid replacing inside HTML tags
    const escaped = kt.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(?<![<\\w])\\b(${escaped})\\b(?![\\w>])`, 'gi')
    result = result.replace(
      regex,
      `<mark class="bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 px-0.5 rounded cursor-help" title="${kt.definition.replace(/"/g, '&quot;')}">$1</mark>`
    )
  }
  return result
}

function InlineQuizBlock({ chapterId, quiz }: { chapterId?: string; quiz: InlineTextbookQuiz }) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null)
  const [result, setResult] = useState<InlineQuizResult | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const disabled = !chapterId || selectedOptionIndex === null || submitting

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!chapterId || selectedOptionIndex === null) return

    setSubmitting(true)
    setError('')
    try {
      const response = await recordTextbookInlineQuizAttempt(chapterId, quiz.blockIndex, selectedOptionIndex)
      setResult(response)
    } catch {
      setError('Quiz answer could not be saved. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-cyan-200 bg-cyan-50/50 p-4 shadow-sm dark:border-cyan-900 dark:bg-cyan-950/20">
      <fieldset className="space-y-3">
        <legend className="text-base font-bold text-foreground">{quiz.question}</legend>
        <div className="space-y-2">
          {quiz.options.map((option, i) => {
            const selected = selectedOptionIndex === i
            const correct = result?.correctOptionIndex === i
            const missedCorrect = result && correct && !result.isCorrect
            const wrongSelection = result && selected && !result.isCorrect && !correct
            const stateClass = correct
              ? 'border-emerald-400 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100'
              : wrongSelection
                ? 'border-rose-400 bg-rose-50 text-rose-950 dark:bg-rose-950/30 dark:text-rose-100'
                : selected
                  ? 'border-cyan-500 bg-white text-foreground shadow-sm dark:bg-slate-950'
                  : 'border-border bg-white/80 text-foreground hover:border-cyan-300 dark:bg-slate-950/60'

            return (
              <label
                key={`${i}-${option}`}
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${stateClass}`}
              >
                <input
                  type="radio"
                  name={`inline-quiz-${quiz.blockIndex}`}
                  value={i}
                  checked={selected}
                  onChange={() => setSelectedOptionIndex(i)}
                  disabled={submitting}
                  className="h-4 w-4 accent-cyan-600"
                />
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-900 dark:bg-cyan-900 dark:text-cyan-100">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="min-w-0 flex-1">{option}</span>
                {correct && result ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" /> : null}
                {wrongSelection ? <XCircle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" /> : null}
                {missedCorrect ? <span className="sr-only">Correct answer</span> : null}
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-cyan-600 px-5 text-sm font-bold text-white shadow-[0_4px_0_rgba(14,116,144,0.45)] transition active:translate-y-0.5 active:shadow-[0_2px_0_rgba(14,116,144,0.45)] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
          Check answer
        </button>
        {result ? (
          <p className="text-sm font-semibold text-foreground" aria-live="polite">
            {result.isCorrect ? 'Correct' : 'Try again'}
          </p>
        ) : null}
      </div>

      {result?.explanation ? (
        <p className="rounded-lg bg-white/80 px-3 py-2 text-sm text-slate-700 dark:bg-slate-950/60 dark:text-slate-200">
          {result.explanation}
        </p>
      ) : null}
      {result?.awardedCompanionXp ? (
        <p className="text-xs font-bold uppercase tracking-wide text-cyan-700 dark:text-cyan-200">
          Fish companion XP recorded
        </p>
      ) : null}
      {error ? (
        <p className="text-sm font-medium text-rose-700 dark:text-rose-300" aria-live="polite">
          {error}
        </p>
      ) : null}
    </form>
  )
}

export function TextbookReader({ content, keyTerms = [], chapterId }: TextbookReaderProps) {
  function renderContent(content: unknown) {
    if (!content) return null

    // String content -- render as HTML
    if (typeof content === 'string') {
      return (
        <div
          className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold"
          dangerouslySetInnerHTML={{ __html: highlightKeyTerms(content, keyTerms) }}
        />
      )
    }

    // Array of content blocks
    if (Array.isArray(content)) {
      if (content.length === 0) {
        return (
          <div className="py-8 text-center text-muted-foreground">
            <BookOpen className="mx-auto mb-3 h-10 w-10 opacity-40" />
            <p>No content has been added to this chapter yet.</p>
          </div>
        )
      }

      return (
        <div className="space-y-5">
          {content.map((block: any, index: number) => {
            if (typeof block === 'string') {
              return (
                <div
                  key={index}
                  className="prose prose-slate dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: highlightKeyTerms(block, keyTerms) }}
                />
              )
            }

            switch (block.type) {
              case 'heading': {
                const text = d(block, 'text') || d(block, 'content')
                const level = d(block, 'level') || 2
                const Tag = level === 3 ? 'h3' : level === 4 ? 'h4' : 'h2'
                const sizeClass =
                  level === 3
                    ? 'text-xl'
                    : level === 4
                      ? 'text-lg'
                      : 'text-2xl'
                return (
                  <Tag
                    key={index}
                    className={`${sizeClass} font-bold text-foreground mt-2`}
                  >
                    {text}
                  </Tag>
                )
              }

              case 'paragraph':
              case 'text':
                return (
                  <div
                    key={index}
                    className="prose prose-slate dark:prose-invert max-w-none leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: highlightKeyTerms(
                        d(block, 'text') || d(block, 'content') || '',
                        keyTerms
                      ),
                    }}
                  />
                )

              case 'image': {
                const url = d(block, 'url') || d(block, 'src')
                const alt =
                  d(block, 'alt') || d(block, 'caption') || 'Textbook image'
                const caption = d(block, 'caption')
                return (
                  <figure key={index} className="my-6">
                    <TextbookImage
                      src={url}
                      alt={alt}
                      className="max-w-full rounded-lg shadow-sm"
                    />
                    {caption && (
                      <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">
                        {caption}
                      </figcaption>
                    )}
                  </figure>
                )
              }

              case 'video': {
                const videoUrl = d(block, 'url') || d(block, 'src') || ''
                const videoTitle = d(block, 'title') || 'Chapter video'
                const videoSource = d(block, 'source')
                let ytVideoId = d(block, 'videoId') || null

                if (!ytVideoId && videoUrl) {
                  const watchMatch = videoUrl.match(
                    /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/
                  )
                  if (watchMatch) ytVideoId = watchMatch[1]
                  const shortMatch = videoUrl.match(
                    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/
                  )
                  if (!ytVideoId && shortMatch) ytVideoId = shortMatch[1]
                  const embedMatch = videoUrl.match(
                    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
                  )
                  if (!ytVideoId && embedMatch) ytVideoId = embedMatch[1]
                }

                const isYouTube = videoSource === 'youtube' || ytVideoId

                return (
                  <div key={index} className="my-6">
                    {videoTitle && d(block, 'title') && (
                      <p className="mb-2 text-sm font-medium text-foreground">
                        {videoTitle}
                      </p>
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
                        <p className="text-sm text-muted-foreground">
                          No video URL provided
                        </p>
                      </div>
                    )}
                  </div>
                )
              }

              case 'code': {
                const code = d(block, 'code') || d(block, 'text') || d(block, 'content') || ''
                const language = d(block, 'language') || ''
                return (
                  <div key={index} className="my-4">
                    {language && (
                      <div className="rounded-t-lg bg-slate-800 px-4 py-1.5 text-xs font-medium text-slate-400">
                        {language}
                      </div>
                    )}
                    <pre
                      className={`overflow-x-auto bg-slate-900 p-4 text-sm text-slate-100 ${
                        language ? 'rounded-b-lg' : 'rounded-lg'
                      }`}
                    >
                      <code>{code}</code>
                    </pre>
                  </div>
                )
              }

              case 'table': {
                const headers = d(block, 'headers') || []
                const rows = d(block, 'rows') || []
                return (
                  <div key={index} className="my-4 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      {headers.length > 0 && (
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            {headers.map((h: string, hi: number) => (
                              <th
                                key={hi}
                                className="px-4 py-2 text-left font-semibold text-foreground"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                      )}
                      <tbody>
                        {rows.map((row: string[], ri: number) => (
                          <tr key={ri} className="border-b border-border">
                            {row.map((cell: string, ci: number) => (
                              <td
                                key={ci}
                                className="px-4 py-2 text-foreground"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }

              case 'embed': {
                const embedUrl = d(block, 'url') || d(block, 'src') || ''
                const embedTitle = d(block, 'title') || 'Embedded content'
                return (
                  <div key={index} className="my-6">
                    <div className="aspect-video overflow-hidden rounded-lg border border-border">
                      <iframe
                        src={embedUrl}
                        className="h-full w-full"
                        title={embedTitle}
                        allowFullScreen
                      />
                    </div>
                  </div>
                )
              }

              case 'file': {
                const fileUrl = d(block, 'url')
                const filename = d(block, 'filename') || 'Download file'
                const size = d(block, 'size')
                return (
                  <a
                    key={index}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="shrink-0 rounded-lg bg-primary/10 p-3">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
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
                    key={index}
                    className="my-8 border-t-2 border-border"
                  />
                )

              case 'list':
                return (
                  <ul
                    key={index}
                    className="list-disc space-y-1 pl-6 text-foreground leading-relaxed"
                  >
                    {(block.items || []).map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )

              case 'callout':
              case 'note': {
                const variant = d(block, 'variant') || 'info'
                const calloutText =
                  d(block, 'text') || d(block, 'content') || ''
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
                    key={index}
                    className={`rounded-lg border-l-4 p-4 ${variantStyles}`}
                  >
                    <div
                      className="prose prose-slate dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: highlightKeyTerms(calloutText, keyTerms),
                      }}
                    />
                  </div>
                )
              }

              case 'quiz': {
                const quiz = normalizeInlineQuizBlock(block, index)
                if (!quiz) return null

                return (
                  <InlineQuizBlock key={index} chapterId={chapterId} quiz={quiz} />
                )
              }

              case 'link': {
                const linkUrl = d(block, 'url')
                const linkTitle = d(block, 'title')
                const linkDesc = d(block, 'description')
                return (
                  <a
                    key={index}
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="shrink-0 rounded-lg bg-primary/10 p-2.5">
                      <ExternalLink className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {linkTitle || linkUrl}
                      </p>
                      {linkDesc && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {linkDesc}
                        </p>
                      )}
                      <p className="mt-1 truncate text-xs text-primary/70">
                        {linkUrl}
                      </p>
                    </div>
                    <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                  </a>
                )
              }

              case 'pdf': {
                const pdfUrl = d(block, 'url')
                const pdfTitle = d(block, 'title') || 'PDF Document'
                const pageCount = d(block, 'pageCount')
                return (
                  <div
                    key={index}
                    className="overflow-hidden rounded-lg border border-border"
                  >
                    <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
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
                  </div>
                )
              }

              case 'document': {
                const docUrl = d(block, 'url')
                const docName = d(block, 'fileName') || 'Document'
                const docSize = d(block, 'fileSize')
                const docType = d(block, 'fileType')
                return (
                  <a
                    key={index}
                    href={docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="shrink-0 rounded-lg bg-primary/10 p-3">
                      <File className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {docName}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        {docType && (
                          <span>
                            {docType.split('/').pop()?.toUpperCase()}
                          </span>
                        )}
                        {docSize && (
                          <span>{formatFileSize(docSize)}</span>
                        )}
                      </div>
                    </div>
                    <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </a>
                )
              }

              default:
                if (d(block, 'text') || d(block, 'content')) {
                  return (
                    <div
                      key={index}
                      className="prose prose-slate dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: highlightKeyTerms(
                          d(block, 'text') || d(block, 'content') || '',
                          keyTerms
                        ),
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

    // Object with text/content property
    if (
      typeof content === 'object' &&
      content !== null &&
      ('text' in (content as any) || 'content' in (content as any))
    ) {
      const obj = content as any
      return (
        <div
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: highlightKeyTerms(obj.text || obj.content, keyTerms),
          }}
        />
      )
    }

    return null
  }

  return (
    <article className="mx-auto max-w-3xl">
      {renderContent(content)}
    </article>
  )
}
