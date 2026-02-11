'use client'

/**
 * VirtualJoystick - Mobile joystick UI overlay
 *
 * A semi-transparent touch joystick positioned at the bottom-left of the screen.
 * Outer ring is 120px diameter, inner knob is 48px.
 * Fades out after 3 seconds of no touch. Does not render on desktop.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { useVirtualJoystick } from './hooks/useVirtualJoystick'
import type { PlazaGameLoop } from '@/lib/plaza/game-loop'

interface VirtualJoystickProps {
  gameLoop: PlazaGameLoop | null
}

const OUTER_SIZE = 120
const KNOB_SIZE = 48
const FADE_TIMEOUT_MS = 3000

export function VirtualJoystick({ gameLoop }: VirtualJoystickProps) {
  const { state, handlers } = useVirtualJoystick({ maxRadius: (OUTER_SIZE - KNOB_SIZE) / 2 })
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  // Forward joystick state to the game loop
  useEffect(() => {
    if (!gameLoop) return

    if (state.isActive) {
      gameLoop.setJoystickInput(state.dx, state.dy)
    } else {
      gameLoop.clearJoystickInput()
    }
  }, [gameLoop, state.isActive, state.dx, state.dy])

  // Handle visibility fade
  const resetFadeTimer = useCallback(() => {
    setVisible(true)
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current)
    }
    fadeTimerRef.current = setTimeout(() => {
      if (!state.isActive) {
        setVisible(false)
      }
    }, FADE_TIMEOUT_MS)
  }, [state.isActive])

  useEffect(() => {
    if (state.isActive) {
      setVisible(true)
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current)
        fadeTimerRef.current = null
      }
    } else {
      resetFadeTimer()
    }
  }, [state.isActive, resetFadeTimer])

  // Show joystick on first touch anywhere
  useEffect(() => {
    if (!isMobile) return

    const handleFirstTouch = () => {
      setVisible(true)
      resetFadeTimer()
    }

    window.addEventListener('touchstart', handleFirstTouch, { once: true })
    return () => window.removeEventListener('touchstart', handleFirstTouch)
  }, [isMobile, resetFadeTimer])

  // Don't render on desktop
  if (!isMobile) return null

  return (
    <div
      className="fixed z-50 select-none touch-none"
      style={{
        left: 24,
        bottom: 24,
        width: OUTER_SIZE,
        height: OUTER_SIZE,
        opacity: visible ? (state.isActive ? 0.85 : 0.5) : 0,
        transition: 'opacity 300ms ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      {...handlers}
    >
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full border-2"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.3)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Inner knob */}
      <div
        className="absolute rounded-full"
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          left: OUTER_SIZE / 2 - KNOB_SIZE / 2 + state.knobOffsetX,
          top: OUTER_SIZE / 2 - KNOB_SIZE / 2 + state.knobOffsetY,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          border: '2px solid rgba(255, 255, 255, 0.7)',
          transition: state.isActive ? 'none' : 'left 150ms ease, top 150ms ease',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        }}
      />

      {/* Direction indicator dots */}
      {!state.isActive && (
        <>
          <div className="absolute rounded-full bg-white/30" style={{ width: 4, height: 4, left: OUTER_SIZE / 2 - 2, top: 8 }} />
          <div className="absolute rounded-full bg-white/30" style={{ width: 4, height: 4, left: OUTER_SIZE / 2 - 2, bottom: 8 }} />
          <div className="absolute rounded-full bg-white/30" style={{ width: 4, height: 4, top: OUTER_SIZE / 2 - 2, left: 8 }} />
          <div className="absolute rounded-full bg-white/30" style={{ width: 4, height: 4, top: OUTER_SIZE / 2 - 2, right: 8 }} />
        </>
      )}
    </div>
  )
}
