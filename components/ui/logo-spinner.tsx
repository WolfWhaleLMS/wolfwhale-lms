'use client'

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
