'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Bell,
  Check,
  CheckCheck,
  ArrowLeft,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Megaphone,
  AlertCircle,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { markAsRead, markAllAsRead } from '@/app/actions/notifications'

interface Notification {
  id: string
  type: string
  title: string
  body?: string | null
  message?: string | null
  link?: string | null
  action_url?: string | null
  read: boolean
  created_at: string
}

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  grade_posted: {
    icon: <GraduationCap className="size-4" />,
    label: 'Grades',
    color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/50',
  },
  assignment_due: {
    icon: <BookOpen className="size-4" />,
    label: 'Assignments',
    color: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/50',
  },
  new_message: {
    icon: <MessageCircle className="size-4" />,
    label: 'Messages',
    color: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/50',
  },
  announcement: {
    icon: <Megaphone className="size-4" />,
    label: 'Announcements',
    color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/50',
  },
  default: {
    icon: <Bell className="size-4" />,
    label: 'General',
    color: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800',
  },
}

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type] ?? TYPE_CONFIG.default
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function NotificationsClient({
  initialNotifications,
  initialUnreadCount,
}: {
  initialNotifications: Notification[]
  initialUnreadCount: number
}) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [typeFilter, setTypeFilter] = useState<string | null>(null)

  const filteredNotifications = useMemo(() => {
    let result = notifications
    if (filter === 'unread') result = result.filter((n) => !n.read)
    if (typeFilter) result = result.filter((n) => n.type === typeFilter)
    return result
  }, [notifications, filter, typeFilter])

  const types = useMemo(() => {
    const set = new Set(notifications.map((n) => n.type))
    return Array.from(set)
  }, [notifications])

  const handleMarkRead = async (id: string) => {
    await markAsRead(id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const handleMarkAllRead = async () => {
    await markAllAsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-2 sm:px-4">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Notifications</h1>
          <p className="mt-1 text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="mr-1.5 size-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </Button>

        {types.length > 1 && (
          <>
            <div className="mx-2 h-5 w-px bg-border" />
            <Filter className="size-4 text-muted-foreground" />
            {types.map((type) => {
              const config = getTypeConfig(type)
              return (
                <Button
                  key={type}
                  variant={typeFilter === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter(typeFilter === type ? null : type)}
                >
                  {config.label}
                </Button>
              )
            })}
          </>
        )}
      </div>

      {/* Notifications List */}
      <div className="ocean-card divide-y divide-border overflow-hidden rounded-2xl">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="mb-3 size-12 text-muted-foreground/30" />
            <p className="text-lg font-medium text-foreground">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {filter === 'unread'
                ? 'Switch to "All" to see previous notifications.'
                : 'Notifications about grades, assignments, and messages will appear here.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => {
            const config = getTypeConfig(n.type)
            const notifLink = n.link || n.action_url
            const body = n.body || n.message

            const content = (
              <div
                className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/30 ${
                  !n.read ? 'bg-blue-50/50 dark:bg-blue-950/10' : ''
                }`}
              >
                <div className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${config.color}`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${!n.read ? 'font-semibold text-foreground' : 'text-foreground'}`}>
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="mt-1 size-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                  {body && (
                    <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{body}</p>
                  )}
                  <div className="mt-1.5 flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{timeAgo(n.created_at)}</span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                </div>
                {!n.read && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleMarkRead(n.id)
                    }}
                    className="mt-1 shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Mark as read"
                  >
                    <Check className="size-4" />
                  </button>
                )}
              </div>
            )

            return notifLink ? (
              <Link key={n.id} href={notifLink} className="block">
                {content}
              </Link>
            ) : (
              <div key={n.id}>{content}</div>
            )
          })
        )}
      </div>
    </div>
  )
}
