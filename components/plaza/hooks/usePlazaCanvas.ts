'use client'

/**
 * usePlazaCanvas - Hook for canvas setup and DPI handling
 *
 * Manages the canvas ref, handles DPI scaling for crisp rendering
 * on high-density displays (Retina, etc.), and resizes the canvas
 * when the window or container changes size.
 */

import { useRef, useCallback, useEffect, useState } from 'react'

interface CanvasDimensions {
  width: number
  height: number
  dpr: number
}

interface UsePlazaCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  dimensions: CanvasDimensions
  /** Call to manually trigger a resize recalculation. */
  recalculate: () => void
}

/** Maximum device pixel ratio to prevent excessive canvas sizes on 3x+ screens. */
const MAX_DPR = 2

export function usePlazaCanvas(): UsePlazaCanvasReturn {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [dimensions, setDimensions] = useState<CanvasDimensions>({
    width: 0,
    height: 0,
    dpr: 1,
  })

  const recalculate = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)

    const displayWidth = Math.floor(rect.width)
    const displayHeight = Math.floor(rect.height)

    // Set the canvas internal resolution (actual pixel count)
    canvas.width = displayWidth * dpr
    canvas.height = displayHeight * dpr

    // Set the CSS display size
    canvas.style.width = `${displayWidth}px`
    canvas.style.height = `${displayHeight}px`

    // Scale the context to match DPI
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    setDimensions({
      width: displayWidth,
      height: displayHeight,
      dpr,
    })
  }, [])

  // Observe container resize
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Initial calculation
    recalculate()

    // Use ResizeObserver for efficient resize detection
    const resizeObserver = new ResizeObserver(() => {
      recalculate()
    })

    resizeObserver.observe(container)

    // Also listen for window resize as a fallback
    const handleResize = () => {
      recalculate()
    }
    window.addEventListener('resize', handleResize)

    // Handle orientation change on mobile
    const handleOrientationChange = () => {
      setTimeout(recalculate, 100)
    }
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [recalculate])

  return {
    canvasRef,
    containerRef,
    dimensions,
    recalculate,
  }
}
