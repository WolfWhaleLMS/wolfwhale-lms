'use client'

/**
 * useVirtualJoystick - Hook for mobile touch controls
 *
 * Tracks touch start/move/end on the joystick area, calculates the angle
 * and distance from the joystick center, and normalizes to a dx/dy
 * movement vector. The result is fed into the game loop as input.
 */

import { useCallback, useRef, useState } from 'react'

interface JoystickState {
  /** Angle in radians (0 = right, PI/2 = down). */
  angle: number
  /** Distance from center, normalized 0 to 1. */
  distance: number
  /** Whether the joystick is currently being touched. */
  isActive: boolean
  /** Horizontal movement component, -1 to 1. */
  dx: number
  /** Vertical movement component, -1 to 1. */
  dy: number
  /** Pixel offset of the knob from center (for rendering). */
  knobOffsetX: number
  /** Pixel offset of the knob from center (for rendering). */
  knobOffsetY: number
}

interface UseVirtualJoystickOptions {
  /** Maximum radius the knob can travel from center (pixels). */
  maxRadius?: number
  /** Minimum distance to register as movement (0-1). */
  deadzone?: number
}

interface UseVirtualJoystickReturn {
  state: JoystickState
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void
    onTouchMove: (e: React.TouchEvent) => void
    onTouchEnd: (e: React.TouchEvent) => void
  }
}

const DEFAULT_MAX_RADIUS = 48 // half of 96px joystick area (inside the 120px outer ring)
const DEFAULT_DEADZONE = 0.15

export function useVirtualJoystick(
  options: UseVirtualJoystickOptions = {}
): UseVirtualJoystickReturn {
  const { maxRadius = DEFAULT_MAX_RADIUS, deadzone = DEFAULT_DEADZONE } = options

  const [state, setState] = useState<JoystickState>({
    angle: 0,
    distance: 0,
    isActive: false,
    dx: 0,
    dy: 0,
    knobOffsetX: 0,
    knobOffsetY: 0,
  })

  // Store the center point of the joystick when touch started
  const centerRef = useRef<{ x: number; y: number } | null>(null)
  const touchIdRef = useRef<number | null>(null)

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // Only track the first touch
      if (touchIdRef.current !== null) return

      const touch = e.touches[0]
      if (!touch) return

      e.preventDefault()
      e.stopPropagation()

      // Record the center as the initial touch point
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      centerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }
      touchIdRef.current = touch.identifier

      // Calculate initial offset
      const dx = touch.clientX - centerRef.current.x
      const dy = touch.clientY - centerRef.current.y
      const raw = Math.sqrt(dx * dx + dy * dy)
      const clamped = Math.min(raw, maxRadius)
      const distance = clamped / maxRadius

      if (distance < deadzone) {
        setState({
          angle: 0,
          distance: 0,
          isActive: true,
          dx: 0,
          dy: 0,
          knobOffsetX: 0,
          knobOffsetY: 0,
        })
      } else {
        const angle = Math.atan2(dy, dx)
        const normalizedDx = Math.cos(angle) * distance
        const normalizedDy = Math.sin(angle) * distance

        setState({
          angle,
          distance,
          isActive: true,
          dx: normalizedDx,
          dy: normalizedDy,
          knobOffsetX: Math.cos(angle) * clamped,
          knobOffsetY: Math.sin(angle) * clamped,
        })
      }
    },
    [maxRadius, deadzone]
  )

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!centerRef.current || touchIdRef.current === null) return

      // Find our tracked touch
      let touch: React.Touch | undefined
      for (let i = 0; i < e.touches.length; i++) {
        if (e.touches[i].identifier === touchIdRef.current) {
          touch = e.touches[i]
          break
        }
      }
      if (!touch) return

      e.preventDefault()
      e.stopPropagation()

      const dx = touch.clientX - centerRef.current.x
      const dy = touch.clientY - centerRef.current.y
      const raw = Math.sqrt(dx * dx + dy * dy)
      const clamped = Math.min(raw, maxRadius)
      const distance = clamped / maxRadius

      if (distance < deadzone) {
        setState((prev) => ({
          ...prev,
          distance: 0,
          dx: 0,
          dy: 0,
          knobOffsetX: 0,
          knobOffsetY: 0,
        }))
      } else {
        const angle = Math.atan2(dy, dx)
        const normalizedDx = Math.cos(angle) * distance
        const normalizedDy = Math.sin(angle) * distance

        setState({
          angle,
          distance,
          isActive: true,
          dx: normalizedDx,
          dy: normalizedDy,
          knobOffsetX: Math.cos(angle) * clamped,
          knobOffsetY: Math.sin(angle) * clamped,
        })
      }
    },
    [maxRadius, deadzone]
  )

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      // Check if our tracked touch ended
      if (touchIdRef.current === null) return

      let found = false
      for (let i = 0; i < e.touches.length; i++) {
        if (e.touches[i].identifier === touchIdRef.current) {
          found = true
          break
        }
      }

      if (!found) {
        touchIdRef.current = null
        centerRef.current = null
        setState({
          angle: 0,
          distance: 0,
          isActive: false,
          dx: 0,
          dy: 0,
          knobOffsetX: 0,
          knobOffsetY: 0,
        })
      }
    },
    []
  )

  return {
    state,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  }
}
