'use client'

import { useState, useEffect, useRef } from 'react'
import { Coins } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TokenDisplayProps {
  balance: number
  variant?: 'compact' | 'full'
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TokenDisplay({ balance, variant = 'full', className }: TokenDisplayProps) {
  const [displayBalance, setDisplayBalance] = useState(balance)
  const prevBalance = useRef(balance)
  const [isAnimating, setIsAnimating] = useState(false)

  // Animate count-up when tokens change
  useEffect(() => {
    if (balance === prevBalance.current) return

    setIsAnimating(true)
    const diff = balance - prevBalance.current
    const steps = Math.min(Math.abs(diff), 20)
    const stepSize = diff / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        setDisplayBalance(balance)
        setIsAnimating(false)
        clearInterval(interval)
      } else {
        setDisplayBalance(Math.round(prevBalance.current + stepSize * currentStep))
      }
    }, 50)

    prevBalance.current = balance
    return () => clearInterval(interval)
  }, [balance])

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400',
          isAnimating && 'animate-pulse',
          className
        )}
      >
        <Coins className="h-4 w-4" />
        <span>{displayBalance.toLocaleString()}</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 px-5 py-3',
        isAnimating && 'ring-2 ring-amber-400/50',
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow-md">
        <Coins className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">Token Balance</p>
        <p
          className={cn(
            'text-xl font-bold text-amber-600 dark:text-amber-400 transition-transform',
            isAnimating && 'scale-110'
          )}
        >
          {displayBalance.toLocaleString()}
        </p>
      </div>
    </div>
  )
}
