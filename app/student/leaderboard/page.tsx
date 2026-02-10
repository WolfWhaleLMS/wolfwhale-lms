import { getLeaderboard, getUserLevel } from '@/app/actions/gamification'
import { getLevelFromXP, getTierForLevel } from '@/lib/gamification/xp-engine'
import { createClient } from '@/lib/supabase/server'
import { LeaderboardTable, type LeaderboardEntry } from '@/components/gamification/LeaderboardTable'
import { LeaderboardPeriodTabs } from './period-tabs'
import { Trophy, Shield, Medal } from 'lucide-react'

export const metadata = {
  title: 'Leaderboard | Wolf Whale LMS',
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const params = await searchParams
  const period = (['weekly', 'monthly', 'all_time'].includes(params.period ?? '')
    ? params.period
    : 'weekly') as 'weekly' | 'monthly' | 'all_time'

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const currentUserId = user?.id ?? ''

  const [leaderboardData, userLevel] = await Promise.all([
    getLeaderboard(period, 25),
    getUserLevel(),
  ])

  // Transform leaderboard data into typed entries
  const entries: LeaderboardEntry[] = leaderboardData.map(
    (entry: any, index: number) => ({
      rank: index + 1,
      userId: entry.user_id,
      userName: entry.profiles?.full_name ?? 'Anonymous Student',
      avatar: entry.profiles?.avatar_url ?? null,
      xpTotal: entry.xp_total ?? 0,
      level: getLevelFromXP(entry.xp_total ?? 0),
      tier: getTierForLevel(getLevelFromXP(entry.xp_total ?? 0)),
    })
  )

  // Check if current user is on the board
  const userOnBoard = entries.some((e) => e.userId === currentUserId)

  const PERIOD_LABELS: Record<string, string> = {
    weekly: 'This Week',
    monthly: 'This Month',
    all_time: 'All Time',
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Leaderboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          See how you rank among your peers. Keep earning XP to climb higher!
        </p>
      </div>

      {/* Current User Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="ocean-card rounded-2xl p-5 text-center">
          <Trophy className="mx-auto mb-2 size-6 text-yellow-500" />
          <p className="text-2xl font-bold text-foreground">
            {(userLevel.total_xp ?? 0).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Your Total XP</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <Medal className="mx-auto mb-2 size-6 text-primary" />
          <p className="text-2xl font-bold text-foreground">
            Level {userLevel.current_level ?? 1}
          </p>
          <p className="text-sm text-muted-foreground">
            {userLevel.current_tier ?? 'Awakening'} Tier
          </p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <Shield className="mx-auto mb-2 size-6 text-emerald-500" />
          <p className="text-2xl font-bold text-foreground">
            {entries.find((e) => e.userId === currentUserId)?.rank ?? '--'}
          </p>
          <p className="text-sm text-muted-foreground">
            Your Rank ({PERIOD_LABELS[period]})
          </p>
        </div>
      </div>

      {/* Period Selector */}
      <LeaderboardPeriodTabs activePeriod={period} />

      {/* Leaderboard */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-3">
          <Trophy className="size-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-foreground">
            {PERIOD_LABELS[period]} Rankings
          </h2>
          <span className="text-sm text-muted-foreground">
            ({entries.length} student{entries.length !== 1 ? 's' : ''})
          </span>
        </div>

        <LeaderboardTable entries={entries} currentUserId={currentUserId} />

        {!userOnBoard && entries.length > 0 && (
          <div className="mt-4 rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
            You are not yet on the leaderboard for this period. Complete
            activities to start earning XP!
          </div>
        )}
      </div>

      {/* Privacy Note */}
      <div className="rounded-xl bg-muted/50 p-4 text-center text-xs text-muted-foreground">
        <Shield className="mx-auto mb-1.5 size-4" />
        <p>
          Leaderboard participation is optional. You can opt out of public
          rankings in your{' '}
          <a
            href="/student/profile"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            profile settings
          </a>
          .
        </p>
      </div>
    </div>
  )
}
