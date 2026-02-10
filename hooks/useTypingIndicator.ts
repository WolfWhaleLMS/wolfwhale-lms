'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface TypingUser {
  userId: string
  userName: string
}

export function useTypingIndicator(conversationId: string | null, currentUserId: string | null, currentUserName: string) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!conversationId || !currentUserId) return

    const supabase = createClient()
    const channel = supabase.channel(`typing:${conversationId}`, {
      config: { presence: { key: currentUserId } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users: TypingUser[] = []
        for (const [key, presences] of Object.entries(state)) {
          if (key === currentUserId) continue
          const p = (presences as any[])[0]
          if (p?.typing) {
            users.push({ userId: key, userName: p.userName || 'Someone' })
          }
        }
        setTypingUsers(users)
      })
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [conversationId, currentUserId])

  const sendTyping = useCallback(() => {
    if (!channelRef.current) return

    channelRef.current.track({
      typing: true,
      userName: currentUserName,
    })

    // Stop typing after 3 seconds of inactivity
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      channelRef.current?.track({ typing: false, userName: currentUserName })
    }, 3000)
  }, [currentUserName])

  const stopTyping = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    channelRef.current?.track({ typing: false, userName: currentUserName })
  }, [currentUserName])

  return { typingUsers, sendTyping, stopTyping }
}
