'use client'

import { useState, useEffect } from 'react'

interface AmbientParticlesProps {
  count?: number
  color?: string
}

export function AmbientParticles({ count = 20, color = 'rgba(0,191,255,0.12)' }: AmbientParticlesProps) {
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: string; opacity: number }>>([])

  useEffect(() => {
    // Generate random positions only on the client to avoid hydration mismatch
    setParticles(
      Array.from({ length: count }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.3 + 0.1,
      }))
    )
  }, [count])

  if (particles.length === 0) return null

  return (
    <div className="absolute inset-0">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full animate-[twinkle_4s_ease-in-out_infinite]"
          style={{
            background: color,
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  )
}
