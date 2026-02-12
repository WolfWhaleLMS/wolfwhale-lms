'use client'

import { Plus, Trash2, MessageSquare } from 'lucide-react'
import type { TutorConversation } from '@/lib/tutor/types'

// ---------------------------------------------------------------------------
// Relative date formatter
// ---------------------------------------------------------------------------

function relativeDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  const diffHours = Math.floor(diffMs / 3_600_000)
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function getDateGroup(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86_400_000)

  // Check if the conversation is from today
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  if (isToday) return 'Today'

  // Check yesterday
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()

  if (isYesterday) return 'Yesterday'
  if (diffDays < 7) return 'This Week'
  return 'Older'
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TutorConversationListProps {
  conversations: TutorConversation[]
  activeId?: string
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TutorConversationList({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: TutorConversationListProps) {
  // Group conversations by date
  const groups: Record<string, TutorConversation[]> = {}
  const groupOrder = ['Today', 'Yesterday', 'This Week', 'Older']

  for (const conv of conversations) {
    const group = getDateGroup(new Date(conv.updatedAt))
    if (!groups[group]) groups[group] = []
    groups[group].push(conv)
  }

  return (
    <div className="flex h-full flex-col gap-3" role="navigation" aria-label="Conversation history">
      {/* New conversation button */}
      <button
        type="button"
        onClick={onNew}
        className="btn-chrome-3d-green flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-[#0A2540] transition-all hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#33FF33] focus-visible:ring-offset-2 active:scale-[0.98]"
        aria-label="Start a new conversation"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        New Conversation
      </button>

      {/* Conversation list */}
      <div
        className="flex-1 overflow-y-auto scrollbar-ocean space-y-4"
        role="list"
        aria-label="Past conversations"
      >
        {conversations.length === 0 && (
          <p className="px-2 py-8 text-center text-sm text-muted-foreground">
            No conversations yet. Start one above!
          </p>
        )}

        {groupOrder.map((groupName) => {
          const items = groups[groupName]
          if (!items || items.length === 0) return null

          return (
            <div key={groupName} className="space-y-1">
              <h3 className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {groupName}
              </h3>

              {items.map((conv) => {
                const isActive = conv.id === activeId
                return (
                  <div
                    key={conv.id}
                    role="listitem"
                    className={`group relative flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-all hover:bg-[#00BFFF]/5 ${
                      isActive
                        ? 'neon-border-blue border-[#00BFFF]/60 bg-[#00BFFF]/8'
                        : 'border-transparent'
                    }`}
                    onClick={() => onSelect(conv.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onSelect(conv.id)
                      }
                    }}
                    tabIndex={0}
                    aria-selected={isActive}
                    aria-label={`Conversation: ${conv.title}`}
                  >
                    {/* Icon */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00BFFF]/10 text-[#00BFFF]">
                      <MessageSquare className="h-4 w-4" aria-hidden="true" />
                    </div>

                    {/* Text content */}
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-sm font-medium text-foreground">
                        {conv.title}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{relativeDate(new Date(conv.updatedAt))}</span>
                        <span
                          className="inline-flex items-center rounded-full bg-[#00BFFF]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#00BFFF]"
                          aria-label={`${conv.messages.length} messages`}
                        >
                          {conv.messages.length}
                        </span>
                      </div>
                    </div>

                    {/* Delete button — visible on hover/focus */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(conv.id)
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-[#FF3366]/10 text-muted-foreground hover:text-[#FF3366] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3366] focus-visible:opacity-100"
                      aria-label={`Delete conversation: ${conv.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
