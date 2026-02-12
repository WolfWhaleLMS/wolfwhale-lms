'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Bot,
  MessageSquare,
  ChevronUp,
  BookOpen,
  Sparkles,
} from 'lucide-react'
import TutorChat from '@/components/tutor/TutorChat'
import TutorConversationList from '@/components/tutor/TutorConversationList'
import TutorContextBanner from '@/components/tutor/TutorContextBanner'
import { useTutorStore } from '@/lib/tutor/engine'
import type { TutorConversation } from '@/lib/tutor/types'

interface StudentTutorClientProps {
  initialConversations: TutorConversation[]
  initialCourseContext: string
  enrolledCourses: { id: string; name: string; subject: string | null }[]
  error: string | null
}

export function StudentTutorClient({
  initialConversations,
  initialCourseContext,
  enrolledCourses,
  error,
}: StudentTutorClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [contextOpen, setContextOpen] = useState(false)
  const [conversations, setConversations] = useState<TutorConversation[]>(initialConversations)
  const [activeConvId, setActiveConvId] = useState<string | undefined>(undefined)
  const status = useTutorStore((s) => s.status)
  const setSystemPrompt = useTutorStore((s) => s.setSystemPrompt)

  // Set course context as system prompt on mount
  useEffect(() => {
    if (initialCourseContext) {
      setSystemPrompt(initialCourseContext)
    }
  }, [initialCourseContext, setSystemPrompt])

  const statusColor =
    status === 'ready' || status === 'generating'
      ? 'bg-[#33FF33]'
      : status === 'error' || status === 'unsupported'
        ? 'bg-red-500'
        : status === 'downloading' || status === 'loading'
          ? 'bg-[#FFAA00] animate-pulse'
          : 'bg-gray-400'

  const statusLabel =
    status === 'ready'
      ? 'Online'
      : status === 'generating'
        ? 'Thinking...'
        : status === 'downloading'
          ? 'Downloading model...'
          : status === 'loading'
            ? 'Loading...'
            : status === 'error'
              ? 'Error'
              : status === 'unsupported'
                ? 'Unsupported'
                : 'Offline'

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConvId(id)
    setSidebarOpen(false)
  }, [])

  const handleNewConversation = useCallback(() => {
    setActiveConvId(undefined)
    setSidebarOpen(false)
  }, [])

  const handleDeleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (activeConvId === id) setActiveConvId(undefined)
  }, [activeConvId])

  const firstCourse = enrolledCourses[0]

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 lg:gap-0">
      {/* Back button + header */}
      <div className="flex-shrink-0 space-y-4">
        <Link
          href="/student/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00BFFF] via-[#00FFFF] to-[#33FF33] p-5 text-white text-white-outlined shadow-lg">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Bot className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-white-outlined sm:text-3xl" style={{ fontFamily: 'var(--font-orbitron, Orbitron, sans-serif)' }}>
                  Wally AI Tutor
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`h-2 w-2 rounded-full ${statusColor}`} aria-hidden="true" />
                  <span className="text-sm text-white/80 text-white-outlined">{statusLabel}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => { setSidebarOpen(!sidebarOpen); setContextOpen(false) }}
                className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                aria-label="Toggle conversation history"
              >
                <MessageSquare className="h-4 w-4" />
                History
              </button>
              <button
                onClick={() => { setContextOpen(!contextOpen); setSidebarOpen(false) }}
                className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                aria-label="Toggle course context"
              >
                <BookOpen className="h-4 w-4" />
                Context
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="ocean-card rounded-2xl p-4 text-center text-red-500 flex-shrink-0">{error}</div>
      )}

      {sidebarOpen && (
        <div className="ocean-card animate-fade-in-up rounded-2xl p-4 lg:hidden flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Conversations</h2>
            <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-foreground" aria-label="Close">
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <TutorConversationList
              conversations={conversations}
              activeId={activeConvId}
              onSelect={handleSelectConversation}
              onNew={handleNewConversation}
              onDelete={handleDeleteConversation}
            />
          </div>
        </div>
      )}

      {contextOpen && (
        <div className="ocean-card animate-fade-in-up rounded-2xl p-4 lg:hidden flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Course Context</h2>
            <button onClick={() => setContextOpen(false)} className="text-muted-foreground hover:text-foreground" aria-label="Close">
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
          <TutorContextBanner
            courseName={firstCourse?.name}
            suggestions={['Explain the current lesson', 'Help me study for my next quiz', 'Review my flashcards']}
          />
        </div>
      )}

      <div className="flex flex-1 gap-4 overflow-hidden">
        <aside className="hidden w-[280px] flex-shrink-0 lg:flex lg:flex-col" aria-label="Conversation history">
          <div className="ocean-card flex h-full flex-col rounded-2xl p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <MessageSquare className="h-4 w-4 text-[#00BFFF]" />
              Conversations
            </h2>
            <div className="flex-1 overflow-y-auto">
              <TutorConversationList
                conversations={conversations}
                activeId={activeConvId}
                onSelect={handleSelectConversation}
                onNew={handleNewConversation}
                onDelete={handleDeleteConversation}
              />
            </div>
          </div>
        </aside>

        <main className="flex flex-1 flex-col overflow-hidden" aria-label="Chat with Wally AI Tutor">
          <div className="ocean-card flex h-full flex-col rounded-2xl">
            <TutorChat compact={false} />
          </div>
        </main>

        <aside className="hidden w-[260px] flex-shrink-0 lg:flex lg:flex-col" aria-label="Course context">
          <div className="ocean-card flex h-full flex-col rounded-2xl p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-[#33FF33]" />
              Course Context
            </h2>
            <div className="flex-1 overflow-y-auto">
              <TutorContextBanner
                courseName={firstCourse?.name}
                suggestions={['Explain the current lesson', 'Help me study for my next quiz', 'Review my flashcards', 'What topics should I focus on?']}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
