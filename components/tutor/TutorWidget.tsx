'use client'

import { useEffect, useCallback } from 'react'
import { Bot, X, Maximize2 } from 'lucide-react'
import { useTutorStore } from '@/lib/tutor/engine'
import type { TutorRole } from '@/lib/tutor/types'
import TutorChat from './TutorChat'

interface TutorWidgetProps {
  role: TutorRole
}

export default function TutorWidget({ role }: TutorWidgetProps) {
  const isWidgetOpen = useTutorStore((s) => s.isWidgetOpen)
  const setWidgetOpen = useTutorStore((s) => s.setWidgetOpen)
  const status = useTutorStore((s) => s.status)

  const isStudent = role === 'student'
  const title = isStudent ? 'Wally AI' : 'AI Assistant'
  const tooltipLabel = isStudent ? 'AI Tutor' : 'AI Assistant'

  // ------ Status dot color ------ //
  const statusDotColor = (() => {
    if (status === 'ready' || status === 'generating') return 'bg-[#33FF33]'
    if (status === 'error' || status === 'unsupported') return 'bg-[#FF3366]'
    return 'bg-[#FFAA00]' // idle, checking, downloading, loading
  })()

  // ------ Close on Escape key ------ //
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isWidgetOpen) {
        setWidgetOpen(false)
      }
    },
    [isWidgetOpen, setWidgetOpen],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape])

  // ------ Focus trap: return focus to toggle when closing ------ //
  const toggleBtnId = 'tutor-widget-toggle'

  const handleToggle = useCallback(() => {
    setWidgetOpen(!isWidgetOpen)
  }, [isWidgetOpen, setWidgetOpen])

  const handleExpandToFullPage = useCallback(() => {
    // Navigate to the dedicated tutor page based on role
    const tutorPath = isStudent ? '/student/tutor' : '/teacher/tutor'
    window.location.href = tutorPath
  }, [isStudent])

  return (
    <>
      {/* ===== Floating bubble button ===== */}
      <button
        id={toggleBtnId}
        type="button"
        onClick={handleToggle}
        className={`fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-40 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF] focus-visible:ring-offset-2 ${
          isWidgetOpen
            ? 'btn-chrome-3d-silver !text-[#0A2540] rotate-0'
            : 'btn-chrome-3d-blue neon-pulse-blue'
        }`}
        aria-label={isWidgetOpen ? 'Close AI Tutor panel' : `Open ${tooltipLabel}`}
        aria-expanded={isWidgetOpen}
        aria-controls="tutor-widget-panel"
        title={isWidgetOpen ? 'Close' : tooltipLabel}
      >
        {isWidgetOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Bot className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* ===== Slide-out panel ===== */}
      {/* Backdrop — mobile only */}
      {isWidgetOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] sm:hidden"
          onClick={() => setWidgetOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="tutor-widget-panel"
        role="dialog"
        aria-modal="false"
        aria-label={`${title} chat panel`}
        className={`fixed right-0 top-0 z-40 flex h-full flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isWidgetOpen ? 'translate-x-0' : 'translate-x-full'
        } w-full sm:w-[400px] sm:right-0`}
      >
        {/* Panel container with glass background */}
        <div className="flex h-full flex-col liquid-glass-heavy backdrop-blur-xl border-l border-[#00BFFF]/20 shadow-[-8px_0_40px_rgba(0,0,0,0.1)] dark:shadow-[-8px_0_40px_rgba(0,0,0,0.3)]">
          {/* ---- Header ---- */}
          <header className="flex items-center justify-between border-b border-[#00BFFF]/15 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00BFFF]/10 text-[#00BFFF]">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-sm text-foreground">{title}</h2>
                <span
                  className={`h-2 w-2 rounded-full ${statusDotColor}`}
                  title={`Status: ${status}`}
                  aria-label={`Engine status: ${status}`}
                />
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Expand to full page */}
              <button
                type="button"
                onClick={handleExpandToFullPage}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[#00BFFF]/10 hover:text-[#00BFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF]"
                aria-label="Open AI Tutor in full page"
                title="Expand"
              >
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
              </button>

              {/* Close (visible inside panel on mobile, desktop has the bubble) */}
              <button
                type="button"
                onClick={() => setWidgetOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[#FF3366]/10 hover:text-[#FF3366] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3366] sm:hidden"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </header>

          {/* ---- Body: Chat ---- */}
          <div className="flex-1 min-h-0">
            <TutorChat compact />
          </div>
        </div>
      </aside>
    </>
  )
}
