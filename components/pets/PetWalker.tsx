'use client'

import { useEffect, useRef, useCallback, memo } from 'react'

export interface PetData {
  id: string
  creatureType: number // 1-7
  name: string | null
  walkSpeed: number // pixels per second (20-60 range)
  startOffset: number // 0-100, % start position
}

// Placeholder emojis — will be replaced with pixel art sprites
const CREATURE_EMOJI: Record<number, string> = {
  1: '🦖', 2: '🐙', 3: '🦊', 4: '🐢', 5: '🦋', 6: '🐳', 7: '🦜',
}

export interface PetState {
  x: number
  dir: 1 | -1
  paused: boolean
}

interface PetWalkerProps {
  pet: PetData
  stateRef: React.MutableRefObject<PetState>
  bumpPhase: 'none' | 'jump' | 'wave' | 'turn'
}

export const PetWalker = memo(function PetWalker({ pet, stateRef, bumpPhase }: PetWalkerProps) {
  const elRef = useRef<HTMLDivElement>(null)
  const emojiRef = useRef<HTMLSpanElement>(null)
  const prevTimeRef = useRef(0)
  const bobRef = useRef(0)
  const frameRef = useRef(0)
  // Random idle pause timer
  const nextPauseRef = useRef(Date.now() + 4000 + Math.random() * 12000)
  const pauseUntilRef = useRef(0)

  const animate = useCallback((timestamp: number) => {
    if (!elRef.current) {
      frameRef.current = requestAnimationFrame(animate)
      return
    }

    const delta = prevTimeRef.current ? (timestamp - prevTimeRef.current) / 1000 : 0.016
    prevTimeRef.current = timestamp
    const state = stateRef.current
    const now = Date.now()

    // Handle bump phases
    if (bumpPhase === 'jump' || bumpPhase === 'wave') {
      // During bump — pet is frozen, just render
      const jumpY = bumpPhase === 'jump' ? -14 : -6
      elRef.current.style.transform =
        `translateX(${state.x}px) scaleX(${state.dir}) translateY(${jumpY}px)`
      if (emojiRef.current) {
        emojiRef.current.style.transform = bumpPhase === 'wave' ? 'rotate(-15deg)' : 'scale(1.15)'
      }
      frameRef.current = requestAnimationFrame(animate)
      return
    }

    // Reset emoji transform after bump
    if (emojiRef.current) {
      emojiRef.current.style.transform = ''
    }

    // Random idle pauses — pet stops, looks around, then continues
    if (now < pauseUntilRef.current) {
      // Currently paused — do a subtle idle bob
      state.paused = true
      const idleBob = Math.sin(now / 300) * 2
      elRef.current.style.transform =
        `translateX(${state.x}px) scaleX(${state.dir}) translateY(${idleBob}px)`
      frameRef.current = requestAnimationFrame(animate)
      return
    }

    if (now > nextPauseRef.current && !state.paused) {
      // Start a random pause (0.8-2.5 seconds)
      pauseUntilRef.current = now + 800 + Math.random() * 1700
      nextPauseRef.current = now + 6000 + Math.random() * 15000
      state.paused = true
      frameRef.current = requestAnimationFrame(animate)
      return
    }
    state.paused = false

    // Walk with slight speed variation (±15%)
    const speedVar = 1 + Math.sin(now / 2000 + pet.walkSpeed) * 0.15
    const movement = pet.walkSpeed * speedVar * delta * state.dir
    state.x += movement

    // Bounce off edges with smooth deceleration zone
    const maxX = window.innerWidth - 36
    const edgeZone = 20
    if (state.x >= maxX) {
      state.x = maxX
      state.dir = -1
    } else if (state.x <= edgeZone) {
      state.x = edgeZone
      state.dir = 1
    }

    // Walking bob animation
    bobRef.current += delta * pet.walkSpeed * 0.15
    const walkBob = Math.abs(Math.sin(bobRef.current)) * -3 // subtle bounce step

    elRef.current.style.transform =
      `translateX(${state.x}px) scaleX(${state.dir}) translateY(${walkBob}px)`

    frameRef.current = requestAnimationFrame(animate)
  }, [pet.walkSpeed, stateRef, bumpPhase, pet.id])

  useEffect(() => {
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [animate])

  return (
    <div
      ref={elRef}
      className="absolute bottom-1 select-none pointer-events-none will-change-transform"
      style={{ fontSize: '28px', lineHeight: 1, zIndex: 9999 }}
      title={pet.name || `Pet #${pet.id.slice(0, 4)}`}
    >
      <span ref={emojiRef} className="inline-block transition-transform duration-150">
        {CREATURE_EMOJI[pet.creatureType] || '🦖'}
      </span>
    </div>
  )
})
