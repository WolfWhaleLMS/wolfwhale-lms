'use client'

import { useEffect, useRef, useState } from 'react'

export interface PetData {
  id: string
  creatureType: number // 1-7
  name: string | null
  walkSpeed: number // seconds for one full crossing (10-25s range)
  startOffset: number // 0-100, % start position
}

// Placeholder emojis — will be replaced with pixel art
const CREATURE_EMOJI: Record<number, string> = {
  1: '🦖',
  2: '🦖',
  3: '🦖',
  4: '🦖',
  5: '🦖',
  6: '🦖',
  7: '🦖',
}

interface PetWalkerProps {
  pet: PetData
  onPosition?: (id: string, x: number) => void
  bumping?: boolean
}

export function PetWalker({ pet, onPosition, bumping }: PetWalkerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [jumping, setJumping] = useState(false)
  const posRef = useRef(pet.startOffset)
  const dirRef = useRef<1 | -1>(Math.random() > 0.5 ? 1 : -1)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (bumping && !jumping) {
      setJumping(true)
      setTimeout(() => setJumping(false), 600)
    }
  }, [bumping, jumping])

  useEffect(() => {
    // Calculate pixels per frame based on walkSpeed
    // walkSpeed = seconds for one full crossing
    // Screen width ~= window.innerWidth
    const pixelsPerFrame = () => {
      const screenWidth = window.innerWidth
      const framesPerCrossing = pet.walkSpeed * 60 // 60fps * seconds
      return screenWidth / framesPerCrossing
    }

    let active = true
    function animate() {
      if (!active) return
      const speed = pixelsPerFrame()
      posRef.current += speed * dirRef.current

      // Bounce at edges (with some margin)
      const maxX = window.innerWidth - 32
      if (posRef.current >= maxX) {
        posRef.current = maxX
        dirRef.current = -1
      } else if (posRef.current <= 0) {
        posRef.current = 0
        dirRef.current = 1
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(${posRef.current}px) scaleX(${dirRef.current})${jumping ? ' translateY(-12px)' : ''}`
      }

      onPosition?.(pet.id, posRef.current)
      frameRef.current = requestAnimationFrame(animate)
    }

    // Set initial position
    posRef.current = (pet.startOffset / 100) * window.innerWidth
    frameRef.current = requestAnimationFrame(animate)

    return () => {
      active = false
      cancelAnimationFrame(frameRef.current)
    }
  }, [pet.id, pet.walkSpeed, pet.startOffset, onPosition, jumping])

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 select-none pointer-events-none"
      style={{
        fontSize: '28px',
        lineHeight: 1,
        transition: jumping ? 'transform 0.15s ease-out' : undefined,
        zIndex: 9999,
      }}
      title={pet.name || `Pet #${pet.id.slice(0, 4)}`}
    >
      <span
        className={jumping ? 'inline-block animate-bounce' : 'inline-block'}
        style={{ animationDuration: jumping ? '0.3s' : undefined }}
      >
        {CREATURE_EMOJI[pet.creatureType] || '🦖'}
      </span>
    </div>
  )
}
