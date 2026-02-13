'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { PetWalker, type PetData, type PetState } from './PetWalker'

interface PixelPetBarProps {
  pets: PetData[]
}

type BumpPhase = 'none' | 'jump' | 'wave' | 'turn'

interface BumpEvent {
  petA: string
  petB: string
  phase: BumpPhase
  startedAt: number
}

const BUMP_PROXIMITY = 38 // pixels — how close before bump triggers
const BUMP_COOLDOWN = 5000 // ms — minimum time between same-pair bumps
const PHASE_DURATION = 280 // ms per bump phase

/** Maximum number of creatures walking on screen at once */
const MAX_WALKING_PETS = 2

export function PixelPetBar({ pets }: PixelPetBarProps) {
  // Limit the number of walking pets to avoid performance overhead
  const visiblePets = pets.slice(0, MAX_WALKING_PETS)

  // Create stable refs for each pet's walking state
  const stateRefsMap = useRef<Map<string, React.MutableRefObject<PetState>>>(new Map())
  const [bumpPhases, setBumpPhases] = useState<Map<string, BumpPhase>>(new Map())
  const activeBumpRef = useRef<BumpEvent | null>(null)
  const cooldownsRef = useRef<Map<string, number>>(new Map())
  const checkIntervalRef = useRef<number>(0)

  // Ensure we have a state ref for every visible pet
  for (const pet of visiblePets) {
    if (!stateRefsMap.current.has(pet.id)) {
      const startX = (pet.startOffset / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1200)
      stateRefsMap.current.set(pet.id, {
        current: {
          x: startX,
          dir: Math.random() > 0.5 ? 1 : -1,
          paused: false,
        },
      })
    }
  }

  // Proximity check loop — runs every ~120ms via rAF-throttled interval
  const checkProximity = useCallback(() => {
    if (activeBumpRef.current) return // already bumping

    const now = Date.now()
    const entries = Array.from(stateRefsMap.current.entries())

    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const [idA, refA] = entries[i]
        const [idB, refB] = entries[j]
        const stateA = refA.current
        const stateB = refB.current

        // Skip if either pet is paused (idle animation)
        if (stateA.paused || stateB.paused) continue

        const distance = Math.abs(stateA.x - stateB.x)
        if (distance < BUMP_PROXIMITY) {
          // Check cooldown for this pair
          const pairKey = [idA, idB].sort().join('::')
          const lastBump = cooldownsRef.current.get(pairKey) || 0
          if (now - lastBump < BUMP_COOLDOWN) continue

          // They must be walking toward each other (not already separating)
          const walkingToward =
            (stateA.x < stateB.x && stateA.dir === 1 && stateB.dir === -1) ||
            (stateA.x > stateB.x && stateA.dir === -1 && stateB.dir === 1)
          if (!walkingToward) continue

          // Start bump sequence!
          cooldownsRef.current.set(pairKey, now)
          const bump: BumpEvent = { petA: idA, petB: idB, phase: 'jump', startedAt: now }
          activeBumpRef.current = bump
          setBumpPhases(new Map([[idA, 'jump'], [idB, 'jump']]))

          // Phase 2: wave (after PHASE_DURATION ms)
          setTimeout(() => {
            if (activeBumpRef.current !== bump) return
            bump.phase = 'wave'
            setBumpPhases(new Map([[idA, 'wave'], [idB, 'wave']]))
          }, PHASE_DURATION)

          // Phase 3: turn (reverse directions)
          setTimeout(() => {
            if (activeBumpRef.current !== bump) return
            bump.phase = 'turn'
            // Reverse both pets' directions so they walk away
            refA.current.dir = (refA.current.dir * -1) as 1 | -1
            refB.current.dir = (refB.current.dir * -1) as 1 | -1
            // Give them a small push apart so they don't immediately re-collide
            refA.current.x += refA.current.dir * 12
            refB.current.x += refB.current.dir * 12
            setBumpPhases(new Map([[idA, 'turn'], [idB, 'turn']]))
          }, PHASE_DURATION * 2)

          // Phase 4: done — clear bump, pets resume walking (now in opposite dirs)
          setTimeout(() => {
            if (activeBumpRef.current !== bump) return
            activeBumpRef.current = null
            setBumpPhases(new Map())
          }, PHASE_DURATION * 3)

          return // only one bump at a time
        }
      }
    }
  }, [])

  // Run proximity checks on an interval
  useEffect(() => {
    checkIntervalRef.current = window.setInterval(checkProximity, 120)
    return () => window.clearInterval(checkIntervalRef.current)
  }, [checkProximity])

  if (visiblePets.length === 0) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 h-10 pointer-events-none"
      style={{ zIndex: 9998 }}
      aria-hidden="true"
    >
      {visiblePets.map((pet) => {
        const stateRef = stateRefsMap.current.get(pet.id)
        if (!stateRef) return null
        return (
          <PetWalker
            key={pet.id}
            pet={pet}
            stateRef={stateRef}
            bumpPhase={bumpPhases.get(pet.id) || 'none'}
          />
        )
      })}
    </div>
  )
}
