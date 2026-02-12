'use client'

import { BookOpen, Sparkles } from 'lucide-react'

interface TutorContextBannerProps {
  courseName?: string
  lessonTitle?: string
  suggestions?: string[]
  onSuggestionClick?: (suggestion: string) => void
}

export default function TutorContextBanner({
  courseName,
  lessonTitle,
  suggestions = [],
  onSuggestionClick,
}: TutorContextBannerProps) {
  const hasCourseContext = !!courseName

  return (
    <div className="ocean-card p-4 animate-fade-in-up" role="banner" aria-label="Tutor context">
      <div className="relative z-2 flex flex-col gap-3">
        {/* Course context heading */}
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#00BFFF]/10 text-[#00BFFF]">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </div>

          <div className="flex flex-col gap-0.5">
            {hasCourseContext ? (
              <>
                <p className="text-sm font-medium text-foreground">
                  Currently studying:{' '}
                  <span className="text-[#00BFFF] font-semibold">{courseName}</span>
                </p>
                {lessonTitle && (
                  <p className="text-xs text-muted-foreground">
                    Lesson: {lessonTitle}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Ask Wally about any of your courses!
              </p>
            )}
          </div>
        </div>

        {/* Suggested questions */}
        {suggestions.length > 0 && (
          <div className="flex flex-col gap-2" aria-label="Suggested questions">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              <span>Try asking:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSuggestionClick?.(suggestion)}
                  className="btn-chrome-3d-silver rounded-xl px-3 py-1.5 text-xs font-medium text-[#0A2540] transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF] focus-visible:ring-offset-2 active:scale-[0.98]"
                  aria-label={`Ask: ${suggestion}`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
