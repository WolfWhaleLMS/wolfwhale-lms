'use client'

import { useState, useCallback, useRef } from 'react'
import { PetWalker, type PetData } from './PetWalker'

interface PixelPetBarProps {
  pets: PetData[]
}

export function PixelPetBar({ pets }: PixelPetBarProps) {
  const positionsRef = useRef<Map<string, number>>(new Map())
  const [bumpingPets, setBumpingPets] = useState<Set<string>>(new Set())
  const bumpCooldownRef = useRef<Map<string, number>>(new Map())

  const handlePosition = useCallback((id: string, x: number) => {
    positionsRef.current.set(id, x)

    // Check for nearby pets (within 40px)
    const now = Date.now()
    positionsRef.current.forEach((otherX, otherId) => {
      if (otherId === id) return
      const distance = Math.abs(x - otherX)
      if (distance < 40) {
        // Check cooldown (don't bump again for 3 seconds)
        const pairKey = [id, otherId].sort().join('-')
        const lastBump = bumpCooldownRef.current.get(pairKey) || 0
        if (now - lastBump > 3000) {
          bumpCooldownRef.current.set(pairKey, now)
          setBumpingPets(new Set([id, otherId]))
          setTimeout(() => setBumpingPets(new Set()), 600)
        }
      }
    })
  }, [])

  if (pets.length === 0) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 h-10 pointer-events-none"
      style={{ zIndex: 9998 }}
      aria-hidden="true"
    >
      {pets.map((pet) => (
        <PetWalker
          key={pet.id}
          pet={pet}
          onPosition={handlePosition}
          bumping={bumpingPets.has(pet.id)}
        />
      ))}
    </div>
  )
}
