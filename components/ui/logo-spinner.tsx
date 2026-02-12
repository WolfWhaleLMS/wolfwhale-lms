'use client'

import { useEffect, useRef } from 'react'

export function LogoSpinner({ size = 80 }: { size?: number }) {
  const strokeWidth = 3
  const padding = 8
  const svgSize = size + (padding + strokeWidth) * 2
  const rectSize = size + padding * 2
  const rectOffset = (svgSize - rectSize) / 2
  const borderRadius = 16
  // Perimeter of rounded rect: 4 sides minus 8 corner radii + 4 quarter-circle arcs
  const straightSides = (rectSize - 2 * borderRadius) * 4
  const cornerArcs = 2 * Math.PI * borderRadius
  const perimeter = straightSides + cornerArcs
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

  // The green line covers ~30% of the perimeter as it traces the edges
  const lineLength = perimeter * 0.3
  const gapLength = perimeter - lineLength

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Edge-tracing rounded square */}
      <svg
        width={svgSize}
        height={svgSize}
        className="absolute"
      >
        {/* Dim background track — the full rounded square border */}
        <rect
          x={rectOffset}
          y={rectOffset}
          width={rectSize}
          height={rectSize}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke="#33FF33"
          strokeWidth={strokeWidth}
          opacity={0.15}
        />
        {/* Animated green line tracing the edges */}
        <rect
          x={rectOffset}
          y={rectOffset}
          width={rectSize}
          height={rectSize}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke="url(#edgeGlow)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${lineLength} ${gapLength}`}
          style={{
            filter: 'drop-shadow(0 0 8px #33FF33) drop-shadow(0 0 3px #33FF33)',
            animation: `trace-edge ${2}s linear infinite`,
          }}
        />
        {/* Bright leading tip — shorter, brighter segment */}
        <rect
          x={rectOffset}
          y={rectOffset}
          width={rectSize}
          height={rectSize}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke="#AAFFAA"
          strokeWidth={strokeWidth + 1}
          strokeLinecap="round"
          strokeDasharray={`${perimeter * 0.03} ${perimeter * 0.97}`}
          style={{
            filter: 'drop-shadow(0 0 12px #33FF33) drop-shadow(0 0 4px #FFFFFF)',
            animation: `trace-edge ${2}s linear infinite`,
          }}
        />
        {/* Gradient definition for the trailing glow */}
        <defs>
          <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#33FF33" stopOpacity="0.2" />
            <stop offset="60%" stopColor="#33FF33" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#AAFFAA" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
      {/* Logo — rounded square clip */}
      <div
        className="rounded-xl border-2 border-black overflow-hidden bg-white shadow-lg"
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
      {/* Keyframe for tracing the edge — animates strokeDashoffset around the perimeter */}
      <style>{`
        @keyframes trace-edge {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -${perimeter}; }
        }
      `}</style>
    </div>
  )
}
