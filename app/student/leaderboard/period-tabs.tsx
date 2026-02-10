'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Flame, Star, Award } from 'lucide-react'

interface LeaderboardPeriodTabsProps {
  activePeriod: 'weekly' | 'monthly' | 'all_time'
}

const PERIODS = [
  { value: 'weekly', label: 'Weekly', icon: Flame },
  { value: 'monthly', label: 'Monthly', icon: Star },
  { value: 'all_time', label: 'All Time', icon: Award },
] as const

export function LeaderboardPeriodTabs({
  activePeriod,
}: LeaderboardPeriodTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handlePeriodChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('period', value)
    router.push(`/student/leaderboard?${params.toString()}`)
  }

  return (
    <Tabs
      value={activePeriod}
      onValueChange={handlePeriodChange}
      className="w-full"
    >
      <TabsList className="w-full sm:w-auto">
        {PERIODS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger key={value} value={value} className="gap-1.5">
            <Icon className="size-4" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
