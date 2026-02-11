export function LogoSpinner({ size = 80 }: { size?: number }) {
  const strokeWidth = 3
  const radius = size / 2 + 8
  const circumference = 2 * Math.PI * radius
  const svgSize = (radius + strokeWidth) * 2

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
          className="text-[#812BFF]/20"
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
          className="text-[#812BFF]"
        />
      </svg>
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Loading"
        width={size}
        height={size}
        className="rounded-xl object-contain"
      />
    </div>
  )
}
