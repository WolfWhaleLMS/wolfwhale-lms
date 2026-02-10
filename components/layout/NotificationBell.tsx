'use client'

import { useEffect, useState, useRef } from 'react'
import { Bell, X, Check, CheckCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '@/app/actions/notifications'
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications'
import { useSound } from '@/components/providers/sound-provider'

export function NotificationBell() {
  const [userId, setUserId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [initialLoaded, setInitialLoaded] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const sounds = useSound()

  const { notifications, setNotifications, unreadCount, setUnreadCount } =
    useRealtimeNotifications(userId)

  // Get current user
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
  }, [])

  // Load initial notifications + count
  useEffect(() => {
    if (!userId || initialLoaded) return
    setInitialLoaded(true)

    Promise.all([getNotifications(10), getUnreadCount()]).then(([notifs, count]) => {
      setNotifications(notifs as any)
      setUnreadCount(count)
    })
  }, [userId, initialLoaded, setNotifications, setUnreadCount])

  // Play sound on new notification
  useEffect(() => {
    if (unreadCount > 0 && initialLoaded) {
      sounds.playClick()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadCount])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

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

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => {
          sounds.playClick()
          setOpen(!open)
        }}
        className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-border bg-background shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 border-b border-border/50 px-4 py-3 transition-colors hover:bg-muted/50 ${
                    !n.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? 'font-medium' : 'text-muted-foreground'}`}>
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {n.body}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      {timeAgo(n.created_at)}
                    </p>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="mt-1 rounded p-1 text-muted-foreground hover:bg-muted"
                      aria-label="Mark as read"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
