'use client'

/**
 * PlazaLoading - Loading and room transition screen
 *
 * Displays an ocean-themed loading animation with the destination
 * room name. Used during initial load and during room transitions
 * (300ms fade-to-black).
 */

import { useEffect, useState } from 'react'

interface PlazaLoadingProps {
  /** The name of the room being entered. */
  roomName?: string
  /** Whether this is a room transition (shorter) or initial load. */
  isTransition?: boolean
  /** Called when the fade-in animation completes. */
  onFadeComplete?: () => void
}

export function PlazaLoading({
  roomName = 'Plaza',
  isTransition = false,
  onFadeComplete,
}: PlazaLoadingProps) {
  const [phase, setPhase] = useState<'fade-in' | 'loading' | 'fade-out'>('fade-in')

  useEffect(() => {
    // Fade in
    const fadeInTimer = setTimeout(() => {
      setPhase('loading')
    }, isTransition ? 150 : 50)

    return () => clearTimeout(fadeInTimer)
  }, [isTransition])

  useEffect(() => {
    if (phase === 'loading' && onFadeComplete) {
      // Brief delay then signal that the fade is complete
      const timer = setTimeout(() => {
        onFadeComplete()
      }, isTransition ? 150 : 300)
      return () => clearTimeout(timer)
    }
  }, [phase, isTransition, onFadeComplete])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        backgroundColor: '#1a1a2e',
        opacity: phase === 'fade-in' ? 0 : 1,
        transition: `opacity ${isTransition ? 150 : 300}ms ease-in-out`,
      }}
    >
      {/* Ocean wave background effect */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ opacity: 0.15 }}
      >
        <div
          className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2"
          style={{
            background: `
              radial-gradient(ellipse at 30% 50%, #2563eb 0%, transparent 50%),
              radial-gradient(ellipse at 70% 30%, #14b8a6 0%, transparent 50%),
              radial-gradient(ellipse at 50% 70%, #8b5cf6 0%, transparent 50%)
            `,
            animation: 'plaza-loading-wave 4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Spinner */}
      <div className="relative mb-6">
        {/* Outer ring */}
        <div
          className="h-12 w-12 rounded-full border-2 border-t-transparent"
          style={{
            borderColor: 'rgba(99, 102, 241, 0.3)',
            borderTopColor: 'transparent',
            animation: 'plaza-loading-spin 1.2s linear infinite',
          }}
        />
        {/* Inner ring (counter-rotation) */}
        <div
          className="absolute inset-1 rounded-full border-2 border-b-transparent"
          style={{
            borderColor: 'rgba(20, 184, 166, 0.5)',
            borderBottomColor: 'transparent',
            animation: 'plaza-loading-spin 0.8s linear infinite reverse',
          }}
        />
        {/* Center dot */}
        <div
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            backgroundColor: '#6366f1',
            animation: 'plaza-loading-pulse 1.5s ease-in-out infinite',
          }}
        />
      </div>

      {/* Loading text */}
      <p
        className="text-sm font-medium"
        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
      >
        Entering {roomName}...
      </p>

      {/* Subtitle */}
      <p
        className="mt-1 text-xs"
        style={{ color: 'rgba(255, 255, 255, 0.4)' }}
      >
        Loading room data
      </p>

      {/* CSS animations (scoped via style tag) */}
      <style jsx>{`
        @keyframes plaza-loading-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes plaza-loading-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.5; }
        }
        @keyframes plaza-loading-wave {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(2%, -1%) rotate(1deg); }
          66% { transform: translate(-1%, 2%) rotate(-1deg); }
        }
      `}</style>
    </div>
  )
}
