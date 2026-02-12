'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Bot,
  MessageSquare,
  ChevronUp,
  Sparkles,
  FileQuestion,
  ClipboardCheck,
  CheckSquare,
  MessageSquarePlus,
  Wand2,
} from 'lucide-react'
import TutorChat from '@/components/tutor/TutorChat'
import TutorConversationList from '@/components/tutor/TutorConversationList'
import { useTutorStore } from '@/lib/tutor/engine'
import type { TutorConversation } from '@/lib/tutor/types'

const TEACHER_CATEGORIES = [
  {
    id: 'lesson-content',
    label: 'Generate lesson content',
    icon: Sparkles,
    color: 'text-[#33FF33]',
    bg: 'bg-[#33FF33]/10 hover:bg-[#33FF33]/20',
    prompt: 'Help me generate lesson content. I need a well-structured lesson with headings, key vocabulary, guided practice problems, and comprehension check questions for:',
  },
  {
    id: 'assignment-questions',
    label: 'Create assignment questions',
    icon: FileQuestion,
    color: 'text-[#00BFFF]',
    bg: 'bg-[#00BFFF]/10 hover:bg-[#00BFFF]/20',
    prompt: 'Help me create assignment questions. I need a mix of question types (multiple choice, short answer, extended response) for:',
  },
  {
    id: 'build-quiz',
    label: 'Build a quiz',
    icon: ClipboardCheck,
    color: 'text-[#00FFFF]',
    bg: 'bg-[#00FFFF]/10 hover:bg-[#00FFFF]/20',
    prompt: 'Help me build a quiz. Generate quiz questions with correct answers and brief explanations for each. The topic is:',
  },
  {
    id: 'grade-submissions',
    label: 'Grade submissions',
    icon: CheckSquare,
    color: 'text-[#FFAA00]',
    bg: 'bg-[#FFAA00]/10 hover:bg-[#FFAA00]/20',
    prompt: 'Help me grade student submissions. I will provide the rubric criteria and student work. Please suggest a score and provide constructive feedback for:',
  },
  {
    id: 'draft-feedback',
    label: 'Draft student feedback',
    icon: MessageSquarePlus,
    color: 'text-[#FFD700]',
    bg: 'bg-[#FFD700]/10 hover:bg-[#FFD700]/20',
    prompt: 'Help me draft professional, encouraging feedback for a student. The feedback should identify strengths, areas for improvement, and next steps. The context is:',
  },
] as const

interface TeacherTutorClientProps {
  initialConversations: TutorConversation[]
  teacherCourses: { id: string; name: string; subject: string | null; studentCount: number }[]
  error: string | null
}

export function TeacherTutorClient({
  initialConversations,
  teacherCourses,
  error,
}: TeacherTutorClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [conversations, setConversations] = useState<TutorConversation[]>(initialConversations)
  const [activeConvId, setActiveConvId] = useState<string | undefined>(undefined)
  const status = useTutorStore((s) => s.status)
  const sendMessage = useTutorStore((s) => s.sendMessage)

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

  function handleCategoryClick(prompt: string) {
    if (status === 'ready') {
      sendMessage(prompt)
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 lg:gap-0">
      <div className="flex-shrink-0 space-y-4">
        <Link
          href="/teacher/dashboard"
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
                  AI Assistant
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`h-2 w-2 rounded-full ${statusColor}`} aria-hidden="true" />
                  <span className="text-sm text-white/80 text-white-outlined">{statusLabel}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                aria-label="Toggle conversation history"
              >
                <MessageSquare className="h-4 w-4" />
                History
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

      {/* Mobile quick-actions */}
      <div className="ocean-card rounded-2xl p-4 lg:hidden flex-shrink-0">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Wand2 className="h-4 w-4 text-[#00BFFF]" />
          What can I help with?
        </h2>
        <div className="flex flex-wrap gap-2">
          {TEACHER_CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.prompt)}
                className={`flex items-center gap-1.5 rounded-xl ${cat.bg} px-3 py-2 text-xs font-medium text-foreground transition-colors`}
              >
                <Icon className={`h-3.5 w-3.5 ${cat.color}`} aria-hidden="true" />
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

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

        <main className="flex flex-1 flex-col overflow-hidden" aria-label="Chat with AI Assistant">
          <div className="ocean-card flex h-full flex-col rounded-2xl">
            <TutorChat compact={false} />
          </div>
        </main>

        <aside className="hidden w-[260px] flex-shrink-0 lg:flex lg:flex-col" aria-label="Quick actions">
          <div className="ocean-card flex h-full flex-col rounded-2xl p-4">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Wand2 className="h-4 w-4 text-[#00BFFF]" />
              What can I help with?
            </h2>

            <div className="flex-1 space-y-2 overflow-y-auto">
              {TEACHER_CATEGORIES.map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.prompt)}
                    className={`flex w-full items-center gap-3 rounded-xl ${cat.bg} p-3 text-left transition-colors`}
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-background/50">
                      <Icon className={`h-5 w-5 ${cat.color}`} aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{cat.label}</span>
                  </button>
                )
              })}
            </div>

            {teacherCourses.length > 0 && (
              <div className="mt-4 border-t border-border pt-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Courses</h3>
                <div className="space-y-1.5">
                  {teacherCourses.map((course) => (
                    <div key={course.id} className="rounded-lg bg-muted/30 px-3 py-2 text-xs">
                      <p className="font-medium text-foreground truncate">{course.name}</p>
                      <p className="text-muted-foreground">
                        {course.subject || 'General'} &middot; {course.studentCount} student{course.studentCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
