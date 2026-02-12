'use client'

interface CircularGaugeProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  label: string
  sublabel?: string
  valueDisplay?: string
  colorThresholds?: { value: number; color: string; bgColor: string }[]
}

const defaultThresholds = [
  { value: 90, color: '#059669', bgColor: '#05966920' },
  { value: 75, color: '#00BFFF', bgColor: '#00BFFF20' },
  { value: 60, color: '#D97706', bgColor: '#D9770620' },
  { value: 0, color: '#DC2626', bgColor: '#DC262620' },
]

export function CircularGauge({
  value,
  max = 100,
  size = 140,
  strokeWidth = 12,
  label,
  sublabel,
  valueDisplay,
  colorThresholds = defaultThresholds,
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0
  const offset = circumference - (percentage / 100) * circumference

  const threshold =
    colorThresholds.find((t) => percentage >= t.value) ||
    colorThresholds[colorThresholds.length - 1]

  const display = valueDisplay ?? (value > 0 ? `${Math.round(percentage)}%` : '--')

  return (
    <div
      className="flex flex-col items-center gap-2"
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`${label}: ${display}`}
    >
      <div className="relative rounded-full" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          aria-hidden="true"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-[#00BFFF]/10 dark:text-[#00BFFF]/15"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={threshold.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={value > 0 ? offset : circumference}
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-extrabold leading-none font-data"
            style={{ color: value > 0 ? threshold.color : undefined }}
          >
            {display}
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-[#0A2540] dark:text-[#E8F8FF]">{label}</p>
        {sublabel && (
          <p className="text-xs text-muted-foreground">{sublabel}</p>
        )}
      </div>
      {/* Screen reader description */}
      <span className="sr-only">
        {label} is {display} out of {max}
      </span>
    </div>
  )
}
