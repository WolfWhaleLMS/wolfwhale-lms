'use client'

import { useEffect, useRef } from 'react'

export function LogoSpinner({ size = 80 }: { size?: number }) {
  const strokeWidth = 3
  const radius = size / 2 + 8
  const circumference = 2 * Math.PI * radius
  const svgSize = (radius + strokeWidth) * 2
  const audioRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<OscillatorNode[]>([])

  useEffect(() => {
    // Futuristic loading sound — sci-fi power-up hum
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioRef.current = ctx
      const t = ctx.currentTime

      // Low pulsing hum — engine idle
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(80, t)
      osc1.frequency.linearRampToValueAtTime(120, t + 2)
      osc1.frequency.linearRampToValueAtTime(80, t + 4)
      osc1.frequency.linearRampToValueAtTime(120, t + 6)
      gain1.gain.setValueAtTime(0, t)
      gain1.gain.linearRampToValueAtTime(0.06, t + 0.3)
      osc1.start(t)
      nodesRef.current.push(osc1)

      // High sweep — scanning tone
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(400, t)
      osc2.frequency.exponentialRampToValueAtTime(1200, t + 1.5)
      osc2.frequency.exponentialRampToValueAtTime(600, t + 3)
      osc2.frequency.exponentialRampToValueAtTime(1400, t + 5)
      gain2.gain.setValueAtTime(0, t)
      gain2.gain.linearRampToValueAtTime(0.025, t + 0.2)
      gain2.gain.linearRampToValueAtTime(0.015, t + 1)
      gain2.gain.linearRampToValueAtTime(0.025, t + 2)
      gain2.gain.linearRampToValueAtTime(0.01, t + 4)
      osc2.start(t)
      nodesRef.current.push(osc2)

      // Subtle shimmer — high frequency modulation
      const osc3 = ctx.createOscillator()
      const gain3 = ctx.createGain()
      osc3.connect(gain3)
      gain3.connect(ctx.destination)
      osc3.type = 'sine'
      osc3.frequency.setValueAtTime(2400, t)
      osc3.frequency.setValueAtTime(2600, t + 0.5)
      osc3.frequency.setValueAtTime(2400, t + 1)
      osc3.frequency.setValueAtTime(2800, t + 1.5)
      osc3.frequency.setValueAtTime(2400, t + 2)
      gain3.gain.setValueAtTime(0, t)
      gain3.gain.linearRampToValueAtTime(0.008, t + 0.5)
      gain3.gain.linearRampToValueAtTime(0.004, t + 1)
      gain3.gain.linearRampToValueAtTime(0.008, t + 1.5)
      gain3.gain.linearRampToValueAtTime(0.003, t + 3)
      osc3.start(t)
      nodesRef.current.push(osc3)
    } catch {
      // Audio not available
    }

    return () => {
      nodesRef.current.forEach(osc => {
        try { osc.stop() } catch { /* already stopped */ }
      })
      nodesRef.current = []
      if (audioRef.current) {
        audioRef.current.close()
        audioRef.current = null
      }
    }
  }, [])

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Spinning circle */}
      <svg
        width={svgSize}
        height={svgSize}
        className="absolute animate-spin"
        style={{ animationDuration: '1.2s' }}
      >
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-[#00BFFF]/20"
        />
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.7}
          className="text-[#00BFFF]"
        />
      </svg>
      {/* Logo — circular clip */}
      <div
        className="rounded-full overflow-hidden bg-white shadow-lg"
        style={{ width: size, height: size }}
      >
        <img
          src="/logo.png"
          alt="Loading"
          width={size}
          height={size}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
