'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Bell, X, Check, CheckCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '@/app/actions/notifications'
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications'
import { useSound } from '@/components/providers/sound-provider'

export function NotificationBell() {
  const [userId, setUserId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [initialLoaded, setInitialLoaded] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, right: 0 })
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

  // Position the panel below the button
  const updatePos = useCallback(() => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    setPos({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    })
  }, [])

  // Recalculate on open and on scroll/resize
  useEffect(() => {
    if (!open) return
    updatePos()
    window.addEventListener('scroll', updatePos, true)
    window.addEventListener('resize', updatePos)
    return () => {
      window.removeEventListener('scroll', updatePos, true)
      window.removeEventListener('resize', updatePos)
    }
  }, [open, updatePos])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        btnRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
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

  const panel = open ? createPortal(
    <div
      ref={panelRef}
      className="fixed w-80 rounded-2xl liquid-glass-elevated animate-glass-pop-in border border-[#00BFFF]/25 neon-glow-blue"
      style={{ top: pos.top, right: pos.right, zIndex: 99999 }}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">Notifications</h3>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 text-xs text-[#00BFFF] hover:text-[#00FFFF]"
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
                !n.read ? 'bg-[#00BFFF]/5 dark:bg-[#00BFFF]/10' : ''
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
                  type="button"
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

      <a
        href="/notifications"
        className="block border-t border-border px-4 py-2.5 text-center text-xs font-medium text-primary hover:bg-muted/50 transition-colors"
      >
        View all notifications
      </a>
    </div>,
    document.body,
  ) : null

  return (
    <div>
      <button
        ref={btnRef}
        type="button"
        onClick={() => {
          sounds.playClick()
          setOpen(!open)
        }}
        className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#059669] text-[10px] font-bold text-white ring-2 ring-background">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {panel}
    </div>
  )
}
