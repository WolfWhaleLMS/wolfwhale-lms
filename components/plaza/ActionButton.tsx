'use client'

/**
 * ActionButton - Mobile action button overlay
 *
 * Fixed bottom-right position, 56px circular button.
 * Context-aware: shows "Enter" when near a building door,
 * "Chat" in open areas.
 */

import { useEffect, useState, useCallback } from 'react'
import type { PlazaGameLoop } from '@/lib/plaza/game-loop'

interface ActionButtonProps {
  gameLoop: PlazaGameLoop | null
  onInteract: () => void
  onChat: () => void
}

const BUTTON_SIZE = 56

export function ActionButton({ gameLoop, onInteract, onChat }: ActionButtonProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [context, setContext] = useState<'enter' | 'chat'>('chat')
  const [buildingName, setBuildingName] = useState<string>('')

  // Detect mobile/touch device
  useEffect(() => {
    const checkMobile = () => {
      const hasTouchScreen =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      const isNarrow = window.innerWidth < 1024
      setIsMobile(hasTouchScreen && isNarrow)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Poll the game loop for nearby building status
  useEffect(() => {
    if (!gameLoop || !isMobile) return

    const interval = setInterval(() => {
      const nearby = gameLoop.getNearbyBuilding()
      if (nearby) {
        setContext('enter')
        setBuildingName(nearby.label || nearby.name)
      } else {
        setContext('chat')
        setBuildingName('')
      }
    }, 200) // Check 5 times per second

    return () => clearInterval(interval)
  }, [gameLoop, isMobile])

  const handleTap = useCallback(() => {
    if (context === 'enter') {
      onInteract()
    } else {
      onChat()
    }
  }, [context, onInteract, onChat])

  if (!isMobile) return null

  return (
    <div
      className="fixed z-50 select-none"
      style={{
        right: 24,
        bottom: 24,
      }}
    >
      <button
        type="button"
        onClick={handleTap}
        className="flex flex-col items-center justify-center rounded-full font-bold text-white shadow-lg active:scale-95 transition-transform"
        style={{
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          backgroundColor: context === 'enter' ? '#fbbf24' : '#6366f1',
          border: '3px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          fontSize: 11,
          lineHeight: 1.1,
        }}
        aria-label={context === 'enter' ? `Enter ${buildingName}` : 'Open chat'}
      >
        {context === 'enter' ? (
          <>
            <span style={{ fontSize: 16 }}>&#x1F6AA;</span>
            <span>Enter</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: 16 }}>&#x1F4AC;</span>
            <span>Chat</span>
          </>
        )}
      </button>

      {/* Building name tooltip when near a door */}
      {context === 'enter' && buildingName && (
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-2 py-1 text-xs font-medium text-white"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}
        >
          {buildingName}
        </div>
      )}
    </div>
  )
}
