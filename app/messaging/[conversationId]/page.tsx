'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { getConversation, getMessages, sendMessage } from '@/app/actions/messages'
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Send, Users, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
  updated_at?: string
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

interface Conversation {
  id: string
  title: string | null
  type: string
  course_id: string | null
  created_at: string
  updated_at: string
  conversation_members: Array<{
    user_id: string
    role: string
    profiles: {
      full_name: string | null
      avatar_url: string | null
    } | null
  }>
  messages: Message[]
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDateSeparator(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

function shouldShowDateSeparator(
  current: string,
  previous: string | null
): boolean {
  if (!previous) return true
  const currentDate = new Date(current).toDateString()
  const previousDate = new Date(previous).toDateString()
  return currentDate !== previousDate
}

export default function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const { conversationId } = use(params)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [initialMessages, setInitialMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { messages: realtimeMessages, setMessages: setRealtimeMessages } =
    useRealtimeMessages(conversationId)

  // Get current user
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id)
    })
  }, [])

  // Load conversation and messages
  useEffect(() => {
    async function load() {
      try {
        const [conv, msgs] = await Promise.all([
          getConversation(conversationId),
          getMessages(conversationId),
        ])
        setConversation(conv as unknown as Conversation)
        setInitialMessages(msgs as unknown as Message[])
      } catch (err) {
        console.error('Failed to load conversation:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [conversationId])

  // Merge initial + realtime messages, deduplicated
  const allMessages = (() => {
    const map = new Map<string, Message>()
    for (const msg of initialMessages) {
      map.set(msg.id, msg)
    }
    for (const msg of realtimeMessages) {
      if (!map.has(msg.id)) {
        map.set(msg.id, {
          ...msg,
          profiles: null,
        })
      }
    }
    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  })()

  // Build a map of sender_id -> display name from conversation members
  const memberNames = new Map<string, string>()
  if (conversation?.conversation_members) {
    for (const member of conversation.conversation_members) {
      memberNames.set(
        member.user_id,
        member.profiles?.full_name || 'Unknown User'
      )
    }
  }

  // Auto-scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [allMessages.length, scrollToBottom])

  // Send message handler
  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const content = inputValue.trim()
    if (!content || sending) return

    setSending(true)
    setInputValue('')

    try {
      const newMsg = await sendMessage(conversationId, content)
      // Add to initial messages to ensure it shows even before realtime delivers it
      setInitialMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev
        return [...prev, { ...newMsg, profiles: null }]
      })
    } catch (err) {
      console.error('Failed to send message:', err)
      setInputValue(content) // restore input on failure
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="ocean-card rounded-2xl p-8 text-center">
          <MessageSquare className="mx-auto mb-3 size-10 text-muted-foreground" />
          <p className="font-medium text-foreground">Conversation not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This conversation may have been deleted or you do not have access.
          </p>
          <Link
            href="/messaging"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to Messages
          </Link>
        </div>
      </div>
    )
  }

  const title =
    conversation.title ||
    (conversation.type === 'direct' ? 'Direct Message' : 'Group Conversation')

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col p-4 sm:p-6">
      {/* Header */}
      <div className="ocean-card mb-4 flex items-center gap-4 rounded-2xl p-4">
        <Link
          href="/messaging"
          className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
          {conversation.type === 'direct' ? (
            <MessageSquare className="size-5 text-primary" />
          ) : (
            <Users className="size-5 text-primary" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">
            {conversation.conversation_members.length} member
            {conversation.conversation_members.length !== 1 ? 's' : ''}
            {' \u00b7 '}
            <span className="capitalize">
              {conversation.type === 'class_discussion'
                ? 'class discussion'
                : conversation.type}
            </span>
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        className="ocean-card flex-1 overflow-y-auto rounded-2xl p-4"
      >
        {allMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 text-5xl opacity-40">
                <MessageSquare className="mx-auto size-12 text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground">
                No messages yet. Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {allMessages.map((message, index) => {
              const isOwn = message.sender_id === currentUserId
              const previousMessage =
                index > 0 ? allMessages[index - 1] : null
              const showDate = shouldShowDateSeparator(
                message.created_at,
                previousMessage?.created_at ?? null
              )
              const senderName =
                message.profiles?.full_name ||
                memberNames.get(message.sender_id) ||
                'Unknown User'

              // Group consecutive messages from the same sender
              const showSender =
                !previousMessage ||
                previousMessage.sender_id !== message.sender_id ||
                showDate

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="my-4 flex items-center gap-3">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-xs font-medium text-muted-foreground">
                        {formatDateSeparator(message.created_at)}
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  )}
                  <div
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${
                      showSender ? 'mt-3' : 'mt-0.5'
                    }`}
                  >
                    <div
                      className={`max-w-[75%] ${
                        isOwn ? 'items-end' : 'items-start'
                      }`}
                    >
                      {showSender && !isOwn && (
                        <p className="mb-1 ml-1 text-xs font-medium text-muted-foreground">
                          {senderName}
                        </p>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2.5 ${
                          isOwn
                            ? 'whale-gradient text-white'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                      <p
                        className={`mt-0.5 text-[10px] text-muted-foreground ${
                          isOwn ? 'text-right mr-1' : 'ml-1'
                        }`}
                      >
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSend}
        className="ocean-card mt-4 flex items-center gap-3 rounded-2xl p-3"
      >
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border-0 bg-muted/50 rounded-xl px-4 py-2.5 text-sm focus-visible:ring-1"
          disabled={sending}
          autoFocus
        />
        <Button
          type="submit"
          disabled={!inputValue.trim() || sending}
          className="whale-gradient size-10 shrink-0 rounded-xl p-0 text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50"
          size="icon"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  )
}
