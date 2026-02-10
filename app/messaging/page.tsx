import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getConversations } from '@/app/actions/messages'
import { MessageSquare, Plus, Users, ArrowLeft } from 'lucide-react'

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

export default async function MessagingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  let conversations: Awaited<ReturnType<typeof getConversations>> = []
  try {
    conversations = await getConversations()
  } catch {
    // User may not have any conversations yet
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Messages
          </h1>
          <p className="mt-1 text-muted-foreground">
            Your conversations and direct messages.
          </p>
        </div>
        <Link
          href="/messaging/new"
          className="whale-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
        >
          <Plus className="size-4" />
          New Conversation
        </Link>
      </div>

      {/* Conversation List */}
      <div className="space-y-3">
        {conversations.length === 0 ? (
          <div className="ocean-card rounded-2xl p-12 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="size-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">
              No conversations yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start a new conversation to connect with teachers, students, or groups.
            </p>
            <Link
              href="/messaging/new"
              className="whale-gradient mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              <Plus className="size-4" />
              Start a Conversation
            </Link>
          </div>
        ) : (
          conversations.map((item) => {
            const conversation = item.conversations as any
            if (!conversation) return null

            const messages = conversation.messages ?? []
            const lastMessage = messages.length > 0
              ? messages[messages.length - 1]
              : null

            const typeIcon =
              conversation.type === 'direct' ? (
                <MessageSquare className="size-5 text-primary" />
              ) : (
                <Users className="size-5 text-primary" />
              )

            const title =
              conversation.title ||
              (conversation.type === 'direct'
                ? 'Direct Message'
                : 'Group Conversation')

            return (
              <Link
                key={conversation.id}
                href={`/messaging/${conversation.id}`}
                className="ocean-card group block rounded-2xl p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    {typeIcon}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate font-semibold text-foreground group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      {lastMessage && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatRelativeTime(lastMessage.created_at)}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {lastMessage
                        ? truncate(lastMessage.content, 80)
                        : 'No messages yet'}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground capitalize">
                        {conversation.type === 'class_discussion'
                          ? 'class discussion'
                          : conversation.type}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
