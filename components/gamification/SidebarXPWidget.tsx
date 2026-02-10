'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Zap } from 'lucide-react'

interface XPData {
  totalXP: number
  level: number
  tier: string
}

const LEVEL_NAMES: Record<number, string> = {
  1: 'Rookie Navigator',
  2: 'Wave Rider',
  3: 'Reef Explorer',
  4: 'Ocean Scout',
  5: 'Tide Master',
  6: 'Deep Diver',
  7: 'Sea Sage',
  8: 'Whale Whisperer',
  9: 'Ocean Guardian',
  10: 'Legendary Leviathan',
}

const XP_THRESHOLDS: Record<number, number> = {
  1: 100, 2: 250, 3: 500, 4: 1000, 5: 2000,
  6: 3500, 7: 5500, 8: 8000, 9: 12000, 10: 20000,
}

export function SidebarXPWidget() {
  const [xp, setXP] = useState<XPData | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase
        .from('student_xp')
        .select('total_xp, current_level, current_tier')
        .eq('student_id', user.id)
        .maybeSingle()

      if (data) {
        setXP({
          totalXP: data.total_xp || 0,
          level: data.current_level || 1,
          tier: data.current_tier || 'Bronze',
        })
      }
    })
  }, [])

  if (!xp) return null

  const nextLevelXP = XP_THRESHOLDS[xp.level + 1] || XP_THRESHOLDS[xp.level] || 100
  const currentLevelXP = XP_THRESHOLDS[xp.level] || 0
  const progressInLevel = xp.totalXP - currentLevelXP
  const levelRange = nextLevelXP - currentLevelXP
  const progress = levelRange > 0 ? Math.min((progressInLevel / levelRange) * 100, 100) : 100

  return (
    <div className="px-3 py-3">
      <div className="rounded-xl bg-sidebar-accent/60 p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/20">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-sidebar-foreground truncate">
              Lv.{xp.level} {LEVEL_NAMES[xp.level] || 'Navigator'}
            </p>
            <p className="text-[10px] text-sidebar-foreground/60">
              {xp.totalXP.toLocaleString()} XP
            </p>
          </div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-sidebar-foreground/10">
          <div
            className="h-full rounded-full bg-amber-400 transition-all duration-500"
            style={{ width: `${Math.max(progress, 3)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
