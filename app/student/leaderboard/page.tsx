import { getLeaderboard, getUserLevel } from '@/app/actions/gamification'
import { getLevelFromXP, getTierForLevel } from '@/lib/gamification/xp-engine'
import { createClient } from '@/lib/supabase/server'
import { LeaderboardTable, type LeaderboardEntry } from '@/components/gamification/LeaderboardTable'
import { LeaderboardPeriodTabs } from './period-tabs'
import { Trophy, Shield, Medal, Crown } from 'lucide-react'

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

  // Top 3 for podium
  const topThree = entries.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Visual Header with Whale Gradient */}
      <div className="whale-gradient rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-tight">
            Leaderboard
          </h1>
        </div>
        <p className="text-white/90">
          See how you rank among your peers. Keep earning XP to climb higher!
        </p>
      </div>

      {/* Current User Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-xl">
          <Trophy className="mx-auto mb-2 size-6 text-[#D97706] group-hover:animate-float" />
          <p className="text-2xl font-bold text-foreground">
            {(userLevel.total_xp ?? 0).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Your Total XP</p>
        </div>
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-xl">
          <Medal className="mx-auto mb-2 size-6 text-primary group-hover:rotate-12 transition-transform" />
          <p className="text-2xl font-bold text-foreground">
            Level {userLevel.current_level ?? 1}
          </p>
          <p className="text-sm text-muted-foreground">
            {userLevel.current_tier ?? 'Awakening'} Tier
          </p>
        </div>
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-xl">
          <Shield className="mx-auto mb-2 size-6 text-[#059669] group-hover:animate-pulse" />
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

      {/* Podium Display for Top 3 */}
      {topThree.length >= 3 && (
        <div className="ocean-card rounded-2xl p-8">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Crown className="size-6 text-[#D97706]" />
            Top Champions
          </h2>
          <div className="flex items-end justify-center gap-4">
            {/* 2nd Place - Left */}
            {topThree[1] && (
              <div className="flex flex-col items-center">
                <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-400 ring-4 ring-gray-300/50 shadow-lg">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <div className="ocean-card rounded-xl bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 text-center shadow-lg ring-2 ring-gray-300/50 h-48 w-48 flex flex-col justify-center">
                  <p className="text-lg font-bold text-foreground line-clamp-1">{topThree[1].userName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Level {topThree[1].level}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-600 dark:text-gray-400">{topThree[1].xpTotal.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
              </div>
            )}

            {/* 1st Place - Center (Elevated) */}
            {topThree[0] && (
              <div className="flex flex-col items-center">
                <Crown className="mb-2 size-10 text-[#D97706] animate-float" />
                <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#FFAA00] to-[#FFD700] ring-4 ring-[#FFAA00]/50 shadow-2xl animate-pulse">
                  <span className="text-4xl font-bold text-white">1</span>
                </div>
                <div className="ocean-card rounded-xl bg-gradient-to-b from-[#FFAA00]/10 to-[#FFD700]/10 dark:from-[#FFAA00]/15 dark:to-[#FFD700]/10 p-6 text-center shadow-2xl ring-4 ring-[#FFAA00]/50 h-64 w-52 flex flex-col justify-center glow-animate">
                  <p className="text-xl font-bold text-foreground line-clamp-1">{topThree[0].userName}</p>
                  <p className="mt-1 text-sm font-medium text-[#D97706] dark:text-[#FFD700]">Level {topThree[0].level}</p>
                  <p className="mt-3 text-3xl font-bold text-[#D97706] dark:text-[#FFD700]">{topThree[0].xpTotal.toLocaleString()}</p>
                  <p className="text-xs font-semibold text-muted-foreground">XP</p>
                  <div className="mt-3 text-3xl">🏆</div>
                </div>
              </div>
            )}

            {/* 3rd Place - Right */}
            {topThree[2] && (
              <div className="flex flex-col items-center">
                <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#FFAA00] to-[#FFD700] ring-4 ring-[#FFAA00]/50 shadow-lg">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <div className="ocean-card rounded-xl bg-gradient-to-b from-[#FFAA00]/10 to-[#FFD700]/5 dark:from-[#FFAA00]/10 dark:to-[#FFD700]/5 p-6 text-center shadow-lg ring-2 ring-[#FFAA00]/50 h-48 w-48 flex flex-col justify-center">
                  <p className="text-lg font-bold text-foreground line-clamp-1">{topThree[2].userName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Level {topThree[2].level}</p>
                  <p className="mt-2 text-2xl font-bold text-[#D97706] dark:text-[#FFD700]">{topThree[2].xpTotal.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-3">
          <Trophy className="size-5 text-[#D97706]" />
          <h2 className="text-lg font-semibold text-foreground">
            {PERIOD_LABELS[period]} Rankings
          </h2>
          <span className="text-sm text-muted-foreground">
            ({entries.length} student{entries.length !== 1 ? 's' : ''})
          </span>
        </div>

        <LeaderboardTable entries={entries} currentUserId={currentUserId} />

        {!userOnBoard && entries.length > 0 && (
          <div className="mt-4 rounded-xl border border-dashed border-border bg-gradient-to-r from-primary/5 to-[#00FFFF]/5 p-4 text-center text-sm text-muted-foreground">
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
