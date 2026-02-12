'use client'

import Image from 'next/image'

interface GlowingBlazerProps {
  size?: number
  className?: string
}

export function GlowingBlazer({ size = 400, className = '' }: GlowingBlazerProps) {
  const strokeWidth = 3
  const padding = 10
  const svgSize = size + (padding + strokeWidth) * 2
  const rectSize = size + padding * 2
  const rectOffset = (svgSize - rectSize) / 2
  const borderRadius = 20

  // Perimeter of rounded rect
  const straightSides = (rectSize - 2 * borderRadius) * 4
  const cornerArcs = 2 * Math.PI * borderRadius
  const perimeter = straightSides + cornerArcs

  const lineLength = perimeter * 0.3
  const gapLength = perimeter - lineLength
  const duration = 3 // seconds per loop — slightly slower for the larger element

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
          stroke="#33FF33"
          strokeWidth={strokeWidth}
          opacity={0.12}
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
          stroke="url(#blazerEdgeGlow)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${lineLength} ${gapLength}`}
          style={{
            filter: 'drop-shadow(0 0 8px #33FF33) drop-shadow(0 0 3px #33FF33)',
            animation: `blazer-trace-edge ${duration}s linear infinite`,
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
          stroke="#AAFFAA"
          strokeWidth={strokeWidth + 1.5}
          strokeLinecap="round"
          strokeDasharray={`${perimeter * 0.03} ${perimeter * 0.97}`}
          style={{
            filter: 'drop-shadow(0 0 12px #33FF33) drop-shadow(0 0 5px #FFFFFF)',
            animation: `blazer-trace-edge ${duration}s linear infinite`,
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
          stroke="#33FF33"
          strokeWidth={2}
          style={{
            animation: `blazer-pulse-burst ${duration}s ease-out infinite`,
          }}
        />
        <defs>
          <linearGradient id="blazerEdgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#33FF33" stopOpacity="0.15" />
            <stop offset="60%" stopColor="#33FF33" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#AAFFAA" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Blazer image with pulsing green silhouette glow */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Image
          src="/blazer.png"
          alt="WolfWhale School Blazer — Grey twill with gold buttons and blue gingham lining"
          width={size}
          height={size}
          className="blazer-glow-pulse w-full h-full object-contain"
          priority
        />
      </div>

      <style>{`
        @keyframes blazer-trace-edge {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -${perimeter}; }
        }
        @keyframes blazer-pulse-burst {
          0% { opacity: 0; transform: scale(1); }
          5% { opacity: 0.7; transform: scale(1); }
          30% { opacity: 0; transform: scale(1.12); }
          100% { opacity: 0; transform: scale(1.12); }
        }
        @keyframes blazer-silhouette-pulse {
          0% { filter: drop-shadow(0 0 0px transparent); }
          90% { filter: drop-shadow(0 0 0px transparent); }
          95% { filter: drop-shadow(0 0 18px #33FF33) drop-shadow(0 0 8px #33FF33); }
          100% { filter: drop-shadow(0 0 0px transparent); }
        }
        .blazer-glow-pulse {
          animation: blazer-silhouette-pulse ${duration}s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
