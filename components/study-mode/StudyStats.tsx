'use client'

import { Clock, Flame, Award, Zap, Timer } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StudyStatsProps {
  totalSessions: number
  totalMinutes: number
  longestSession: number
  currentStreak: number
  weeklyMinutes: number
  /** Use dark variant for the study mode page, light for dashboard embed */
  variant?: 'dark' | 'light'
}

const formatMinutes = (m: number): string => {
  if (m < 60) return `${m}m`
  const hours = Math.floor(m / 60)
  const mins = m % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export default function StudyStats({
  totalSessions,
  totalMinutes,
  longestSession,
  currentStreak,
  weeklyMinutes,
  variant = 'dark',
}: StudyStatsProps) {
  const stats = [
    {
      label: 'Total Sessions',
      value: totalSessions.toString(),
      icon: Award,
      color: 'text-primary',
    },
    {
      label: 'Total Time',
      value: formatMinutes(totalMinutes),
      icon: Clock,
      color: 'text-teal',
    },
    {
      label: 'Longest Session',
      value: formatMinutes(longestSession),
      icon: Timer,
      color: 'text-purple',
    },
    {
      label: 'Day Streak',
      value: currentStreak.toString(),
      icon: Flame,
      color: 'text-warning',
    },
    {
      label: 'This Week',
      value: formatMinutes(weeklyMinutes),
      icon: Zap,
      color: 'text-success',
    },
  ]

  const isDark = variant === 'dark'

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-2xl border p-4 text-center transition-all',
              isDark
                ? 'border-white/10 bg-white/5'
                : 'ocean-card'
            )}
          >
            <Icon
              className={cn('size-5', stat.color)}
            />
            <span
              className={cn(
                'text-xl font-bold tabular-nums',
                isDark ? 'text-white' : 'text-foreground'
              )}
            >
              {stat.value}
            </span>
            <span
              className={cn(
                'text-xs',
                isDark ? 'text-white/50' : 'text-muted-foreground'
              )}
            >
              {stat.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
