'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Notification {
  id: string
  type: string
  title: string
  body: string
  link?: string
  read: boolean
  created_at: string
}

export function useRealtimeNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => {
      if (prev.some((n) => n.id === notification.id)) return prev
      if (!notification.read) {
        setUnreadCount((c) => c + 1)
      }
      return [notification, ...prev]
    })
  }, [])

  useEffect(() => {
    if (!userId) return

    const supabase = createClient()

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          addNotification(payload.new as Notification)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, addNotification])

  return { notifications, setNotifications, unreadCount, setUnreadCount }
}
