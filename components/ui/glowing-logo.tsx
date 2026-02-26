'use client'

import Image from 'next/image'

interface GlowingLogoProps {
  size?: number
  className?: string
}

export function GlowingLogo({ size = 48, className = '' }: GlowingLogoProps) {
  const strokeWidth = 2.5
  const padding = 6
  const svgSize = size + (padding + strokeWidth) * 2
  const rectSize = size + padding * 2
  const rectOffset = (svgSize - rectSize) / 2
  const borderRadius = 14

  // Perimeter of rounded rect
  const straightSides = (rectSize - 2 * borderRadius) * 4
  const cornerArcs = 2 * Math.PI * borderRadius
  const perimeter = straightSides + cornerArcs

  const lineLength = perimeter * 0.3
  const gapLength = perimeter - lineLength
  const duration = 2.5 // seconds per loop

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Edge-tracing SVG */}
      <svg
        width={svgSize}
        height={svgSize}
        className="absolute"
        aria-hidden="true"
      >
        {/* Dim background track */}
        <rect
          x={rectOffset}
          y={rectOffset}
          width={rectSize}
          height={rectSize}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke="#8B5CF6"
          strokeWidth={strokeWidth}
          opacity={0.12}
        />
        {/* Animated purple line tracing the edges */}
        <rect
          x={rectOffset}
          y={rectOffset}
          width={rectSize}
          height={rectSize}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke="url(#hubEdgeGlow)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${lineLength} ${gapLength}`}
          style={{
            filter: 'drop-shadow(0 0 6px #8B5CF6) drop-shadow(0 0 2px #8B5CF6)',
            animation: `hub-trace-edge ${duration}s linear infinite`,
          }}
        />
        {/* Bright leading tip */}
        <rect
          x={rectOffset}
          y={rectOffset}
          width={rectSize}
          height={rectSize}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke="#C4B5FD"
          strokeWidth={strokeWidth + 1}
          strokeLinecap="round"
          strokeDasharray={`${perimeter * 0.03} ${perimeter * 0.97}`}
          style={{
            filter: 'drop-shadow(0 0 10px #8B5CF6) drop-shadow(0 0 4px #FFFFFF)',
            animation: `hub-trace-edge ${duration}s linear infinite`,
          }}
        />
        {/* Pulse burst ring — fires once per loop */}
        <rect
          x={rectOffset}
          y={rectOffset}
          width={rectSize}
          height={rectSize}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke="#8B5CF6"
          strokeWidth={1.5}
          style={{
            animation: `hub-pulse-burst ${duration}s ease-out infinite`,
          }}
        />
        <defs>
          <linearGradient id="hubEdgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.15" />
            <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C4B5FD" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Logo image */}
      <div
        className="rounded-xl overflow-hidden bg-black shadow-lg shadow-purple-500/20"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt="WolfWhale"
          width={size}
          height={size}
          sizes={`${size}px`}
          className="w-full h-full object-contain"
        />
      </div>

      <style>{`
        @keyframes hub-trace-edge {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -${perimeter}; }
        }
        @keyframes hub-pulse-burst {
          0% { opacity: 0; transform: scale(1); }
          5% { opacity: 0.7; transform: scale(1); }
          30% { opacity: 0; transform: scale(1.15); }
          100% { opacity: 0; transform: scale(1.15); }
        }
      `}</style>
    </div>
  )
}
