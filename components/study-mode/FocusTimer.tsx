'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FocusTimerProps {
  /** Duration in minutes */
  duration: number
  /** Called when the timer reaches zero */
  onComplete: () => void
  /** Called each second with remaining seconds */
  onTick?: (remainingSeconds: number) => void
}

export default function FocusTimer({ duration, onComplete, onTick }: FocusTimerProps) {
  const totalSeconds = duration * 60
  const [remaining, setRemaining] = useState(totalSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const onTickRef = useRef(onTick)

  onCompleteRef.current = onComplete
  onTickRef.current = onTick

  // Reset when duration changes
  useEffect(() => {
    setRemaining(duration * 60)
    setIsRunning(false)
    setHasStarted(false)
    completedRef.current = false
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [duration])

  // Timer loop
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1
        if (next <= 0) {
          clearInterval(intervalRef.current!)
          setIsRunning(false)
          if (!completedRef.current) {
            completedRef.current = true
            setTimeout(() => onCompleteRef.current(), 0)
          }
          return 0
        }
        onTickRef.current?.(next)
        return next
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const handlePlayPause = useCallback(() => {
    if (!hasStarted) setHasStarted(true)
    setIsRunning((prev) => !prev)
  }, [hasStarted])

  const handleStop = useCallback(() => {
    setIsRunning(false)
    setHasStarted(false)
    setRemaining(totalSeconds)
    completedRef.current = false
  }, [totalSeconds])

  // Calculate progress (0 to 1)
  const progress = 1 - remaining / totalSeconds
  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  // SVG circle dimensions
  const size = 280
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress)

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Circular progress ring */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-xl"
          style={{
            background: 'radial-gradient(circle, oklch(0.70 0.12 180) 0%, transparent 70%)',
          }}
        />

        <svg
          width={size}
          height={size}
          className="rotate-[-90deg]"
          aria-hidden="true"
        >
          {/* Track ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-white/10"
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="oklch(0.35 0.08 220)" />
              <stop offset="100%" stopColor="oklch(0.70 0.12 180)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Time display in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-6xl font-bold tracking-tight text-white tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="mt-1 text-sm text-white/50">
            {!hasStarted
              ? 'Ready'
              : isRunning
                ? 'Focusing'
                : remaining === 0
                  ? 'Complete!'
                  : 'Paused'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Reset button */}
        {hasStarted && (
          <Button
            variant="ghost"
            size="lg"
            onClick={handleStop}
            className="rounded-full text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="Reset timer"
          >
            <RotateCcw className="size-5" />
          </Button>
        )}

        {/* Play / Pause button */}
        {remaining > 0 && (
          <Button
            onClick={handlePlayPause}
            size="lg"
            className="whale-gradient rounded-full px-10 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
            aria-label={isRunning ? 'Pause timer' : 'Start timer'}
          >
            {isRunning ? (
              <>
                <Pause className="size-5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="size-5" />
                <span>{hasStarted ? 'Resume' : 'Start'}</span>
              </>
            )}
          </Button>
        )}

        {/* Stop button (while running or paused) */}
        {hasStarted && remaining > 0 && (
          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              setIsRunning(false)
              setRemaining(0)
              if (!completedRef.current) {
                completedRef.current = true
                onCompleteRef.current()
              }
            }}
            className="rounded-full text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="Stop and complete session"
          >
            <Square className="size-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
