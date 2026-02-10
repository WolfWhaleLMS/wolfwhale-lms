'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface OnlineUser {
  userId: string
  status: 'online' | 'away'
  lastSeen: string
}

export function usePresence(tenantId: string | null, currentUserId: string | null) {
  const [onlineUsers, setOnlineUsers] = useState<Map<string, OnlineUser>>(new Map())
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)

  useEffect(() => {
    if (!tenantId || !currentUserId) return

    const supabase = createClient()
    const channel = supabase.channel(`presence:${tenantId}`, {
      config: { presence: { key: currentUserId } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users = new Map<string, OnlineUser>()
        for (const [key, presences] of Object.entries(state)) {
          const p = (presences as any[])[0]
          users.set(key, {
            userId: key,
            status: p?.status || 'online',
            lastSeen: p?.lastSeen || new Date().toISOString(),
          })
        }
        setOnlineUsers(users)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            status: 'online',
            lastSeen: new Date().toISOString(),
          })
        }
      })

    channelRef.current = channel

    // Track away state when tab is hidden
    const handleVisibility = () => {
      channel.track({
        status: document.hidden ? 'away' : 'online',
        lastSeen: new Date().toISOString(),
      })
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [tenantId, currentUserId])

  const isOnline = (userId: string) => onlineUsers.has(userId)
  const getStatus = (userId: string) => onlineUsers.get(userId)?.status ?? 'offline'

  return { onlineUsers, isOnline, getStatus, onlineCount: onlineUsers.size }
}
