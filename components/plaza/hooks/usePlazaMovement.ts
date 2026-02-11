'use client'

/**
 * usePlazaMovement - Hook for keyboard and click-to-move input
 *
 * Captures WASD/Arrow keys for 8-directional movement, Shift for sprint,
 * E/Space for interaction, and C for chat. Also supports click-to-move
 * by translating screen clicks to world coordinates.
 *
 * Passes input state to the game loop rather than directly moving the avatar.
 */

import { useEffect, useCallback, useRef } from 'react'
import type { InputState } from '@/lib/plaza/types'
import type { PlazaGameLoop } from '@/lib/plaza/game-loop'

interface UsePlazaMovementOptions {
  gameLoop: PlazaGameLoop | null
  enabled?: boolean
}

/**
 * Key-to-input mapping. Keys are KeyboardEvent.code values.
 */
const KEY_MAP: Record<string, keyof InputState> = {
  // WASD
  KeyW: 'up',
  KeyA: 'left',
  KeyS: 'down',
  KeyD: 'right',
  // Arrow keys
  ArrowUp: 'up',
  ArrowLeft: 'left',
  ArrowDown: 'down',
  ArrowRight: 'right',
  // Modifiers
  ShiftLeft: 'sprint',
  ShiftRight: 'sprint',
  // Interaction
  KeyE: 'interact',
  Space: 'interact',
  // Chat
  KeyC: 'chat',
}

export function usePlazaMovement({ gameLoop, enabled = true }: UsePlazaMovementOptions): void {
  const gameLoopRef = useRef(gameLoop)
  gameLoopRef.current = gameLoop

  // ─── Keyboard Handlers ──────────────────────────────────────────────

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled || !gameLoopRef.current) return

      // Don't capture input when typing in a form field
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return
      }

      const inputKey = KEY_MAP[e.code]
      if (inputKey) {
        e.preventDefault()
        gameLoopRef.current.setInput(inputKey, true)
      }
    },
    [enabled]
  )

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (!gameLoopRef.current) return

      const inputKey = KEY_MAP[e.code]
      if (inputKey) {
        e.preventDefault()
        gameLoopRef.current.setInput(inputKey, false)
      }
    },
    []
  )

  // ─── Click-to-Move Handler ──────────────────────────────────────────

  const handleCanvasClick = useCallback(
    (e: MouseEvent) => {
      if (!enabled || !gameLoopRef.current) return

      const canvas = e.currentTarget as HTMLCanvasElement
      const rect = canvas.getBoundingClientRect()

      // Screen coordinates relative to canvas
      const screenX = e.clientX - rect.left
      const screenY = e.clientY - rect.top

      // Convert to world coordinates
      const world = gameLoopRef.current.screenToWorld(screenX, screenY)
      gameLoopRef.current.setClickTarget(world.x, world.y)
    },
    [enabled]
  )

  // ─── Attach/Detach Listeners ────────────────────────────────────────

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // Find the canvas element to attach click handler
    // The game loop owns the canvas, so we get it from there
    const canvas = gameLoopRef.current
      ? (document.querySelector('canvas[data-plaza-canvas]') as HTMLCanvasElement | null)
      : null

    if (canvas) {
      canvas.addEventListener('click', handleCanvasClick)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (canvas) {
        canvas.removeEventListener('click', handleCanvasClick)
      }

      // Clear all inputs on cleanup to prevent stuck keys
      if (gameLoopRef.current) {
        gameLoopRef.current.setInput('up', false)
        gameLoopRef.current.setInput('down', false)
        gameLoopRef.current.setInput('left', false)
        gameLoopRef.current.setInput('right', false)
        gameLoopRef.current.setInput('sprint', false)
      }
    }
  }, [enabled, handleKeyDown, handleKeyUp, handleCanvasClick, gameLoop])

  // ─── Window Blur Handler ────────────────────────────────────────────
  // Release all keys when the window loses focus to prevent stuck keys

  useEffect(() => {
    const handleBlur = () => {
      if (!gameLoopRef.current) return
      gameLoopRef.current.setInput('up', false)
      gameLoopRef.current.setInput('down', false)
      gameLoopRef.current.setInput('left', false)
      gameLoopRef.current.setInput('right', false)
      gameLoopRef.current.setInput('sprint', false)
    }

    window.addEventListener('blur', handleBlur)
    return () => window.removeEventListener('blur', handleBlur)
  }, [])
}
