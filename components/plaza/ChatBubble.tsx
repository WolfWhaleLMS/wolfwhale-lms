'use client'

/**
 * ChatBubble - HTML overlay for chat bubble rendering reference
 *
 * NOTE: In the actual game, chat bubbles are drawn directly on the Canvas2D
 * by the drawChatBubble function in AvatarSprite.ts. This component exists
 * as a reference implementation and for potential use in HTML overlay mode
 * (e.g., accessibility fallback, or if we move bubbles off-canvas).
 *
 * Features:
 * - White rounded rectangle with pointer triangle
 * - Pop-in animation (scale 0.5 to 1.0, 200ms)
 * - Auto-fade after 5 seconds
 * - Max width 180px with text wrap
 */

import { useEffect, useState, useRef } from 'react'

interface ChatBubbleProps {
  phrase: string
  /** Duration in ms before the bubble fades. Default 5000. */
  duration?: number
  /** Callback when the bubble has fully faded out. */
  onExpire?: () => void
  /** Position relative to the overlay container. */
  x?: number
  y?: number
}

const FADE_DURATION_MS = 500
const POP_DURATION_MS = 200

export function ChatBubble({
  phrase,
  duration = 5000,
  onExpire,
  x = 0,
  y = 0,
}: ChatBubbleProps) {
  const [phase, setPhase] = useState<'pop-in' | 'visible' | 'fading' | 'expired'>('pop-in')
  const [opacity, setOpacity] = useState(1)
  const [scale, setScale] = useState(0.5)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Pop-in animation
  useEffect(() => {
    // Start pop-in
    requestAnimationFrame(() => {
      setScale(1.0)
      setPhase('visible')
    })

    // Schedule fade
    timerRef.current = setTimeout(() => {
      setPhase('fading')
      setOpacity(0)
    }, duration - FADE_DURATION_MS)

    // Schedule expire
    const expireTimer = setTimeout(() => {
      setPhase('expired')
      onExpire?.()
    }, duration)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      clearTimeout(expireTimer)
    }
  }, [duration, onExpire])

  if (phase === 'expired') return null

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: x,
        top: y,
        transform: `translate(-50%, -100%) scale(${scale})`,
        opacity,
        transition: `
          transform ${POP_DURATION_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1),
          opacity ${FADE_DURATION_MS}ms ease-out
        `,
        transformOrigin: 'bottom center',
        zIndex: 100,
      }}
    >
      {/* Bubble */}
      <div
        className="relative rounded-lg px-3 py-2 text-xs font-medium"
        style={{
          maxWidth: 180,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          color: '#1a1a2e',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          wordWrap: 'break-word',
        }}
      >
        {phrase}

        {/* Pointer triangle */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: -6,
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid rgba(255, 255, 255, 0.95)',
          }}
        />
      </div>
    </div>
  )
}
