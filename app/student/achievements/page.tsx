import { getUserLevel, getUserAchievements } from '@/app/actions/gamification'
import {
  ACHIEVEMENTS,
  type AchievementDefinition,
} from '@/lib/gamification/achievements'
import { getXPForNextLevel, getLevelName } from '@/lib/gamification/xp-engine'
import { XP_CONFIG, ACHIEVEMENT_CATEGORIES } from '@/lib/config/constants'
import { XPBar } from '@/components/gamification/XPBar'
import { AchievementCard } from '@/components/gamification/AchievementCard'
import { AchievementFilters } from './filters'
import { Trophy, Star, Zap } from 'lucide-react'

export const metadata = {
  title: 'Achievements | Wolf Whale LMS',
}

export default async function AchievementsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const activeCategory = params.category || 'all'

  const [userLevel, userAchievements] = await Promise.all([
    getUserLevel(),
    getUserAchievements(),
  ])

  const totalXp = userLevel.total_xp ?? 0
  const currentLevel = userLevel.current_level ?? 1
  const currentTier = userLevel.current_tier ?? 'Awakening'
  const levelName = getLevelName(currentLevel)
  const xpForCurrentLevel = XP_CONFIG.levels[currentLevel] ?? 0
  const xpForNextLevel = getXPForNextLevel(currentLevel)

  // Build a set of earned achievement IDs
  const earnedMap = new Map<
    string,
    { earnedAt: string | null }
  >()
  for (const ua of userAchievements) {
    const achId = ua.achievements?.id ?? ua.achievement_id
    if (achId) {
      earnedMap.set(achId, { earnedAt: ua.unlocked_at })
    }
  }

  // Filter achievements by category
  const filteredAchievements =
    activeCategory === 'all'
      ? ACHIEVEMENTS
      : ACHIEVEMENTS.filter((a) => a.category === activeCategory)

  // Separate earned vs locked
  const earnedAchievements: (AchievementDefinition & {
    earnedAt: string | null
  })[] = []
  const lockedAchievements: AchievementDefinition[] = []

  for (const achievement of filteredAchievements) {
    const earned = earnedMap.get(achievement.id)
    if (earned) {
      earnedAchievements.push({ ...achievement, earnedAt: earned.earnedAt })
    } else {
      lockedAchievements.push(achievement)
    }
  }

  const totalEarned = earnedMap.size
  const totalAvailable = ACHIEVEMENTS.length

  return (
    <div className="space-y-8">
      {/* Visual Header with Whale Gradient */}
      <div className="whale-gradient rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-tight">
            Achievements
          </h1>
        </div>
        <p className="text-white/90">
          Track your progress and unlock achievements as you learn.
        </p>
      </div>

      {/* XP Progress Section with Glow */}
      <div className="ocean-card rounded-2xl p-6 ring-2 ring-primary/20 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/10 p-3">
            <Zap className="size-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {levelName}
            </h2>
            <p className="text-sm font-medium text-muted-foreground">
              Level {currentLevel} - {currentTier} Tier
            </p>
          </div>
        </div>
        <XPBar
          currentXP={totalXp}
          xpForCurrentLevel={xpForCurrentLevel}
          xpForNextLevel={xpForNextLevel}
          level={currentLevel}
          tier={currentTier}
        />
      </div>

      {/* Enhanced Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-xl ring-2 ring-[#FFAA00]/30">
          <div className="mb-2 flex items-center justify-center">
            <Trophy className="size-8 text-[#FFAA00] group-hover:animate-float" />
          </div>
          <p className="text-4xl font-bold text-[#FFAA00] dark:text-[#FFD700]">{totalEarned}</p>
          <p className="text-sm font-medium text-muted-foreground">Earned</p>
        </div>
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-xl ring-2 ring-primary/30">
          <div className="mb-2 flex items-center justify-center">
            <Star className="size-8 text-primary group-hover:animate-pulse" />
          </div>
          <p className="text-4xl font-bold text-foreground">{totalAvailable}</p>
          <p className="text-sm font-medium text-muted-foreground">Total Available</p>
        </div>
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-xl ring-2 ring-[#33FF33]/30">
          <div className="mb-2 flex items-center justify-center">
            <Zap className="size-8 text-[#33FF33] group-hover:rotate-12 transition-transform" />
          </div>
          <p className="text-4xl font-bold text-[#33FF33] dark:text-[#33FF33]">
            {totalAvailable > 0
              ? Math.round((totalEarned / totalAvailable) * 100)
              : 0}
            %
          </p>
          <p className="text-sm font-medium text-muted-foreground">Completion</p>
        </div>
      </div>

      {/* Category Filters */}
      <AchievementFilters
        categories={ACHIEVEMENT_CATEGORIES as unknown as string[]}
        activeCategory={activeCategory}
      />

      {/* Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Trophy className="size-5 text-[#FFAA00] animate-pulse" />
            Earned ({earnedAchievements.length})
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {earnedAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                earned
                earnedAt={achievement.earnedAt}
              />
            ))}
          </div>
        </section>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-muted-foreground">
            <Star className="size-5" />
            Locked ({lockedAchievements.length})
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {lockedAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                earned={false}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="ocean-card relative overflow-hidden rounded-2xl py-16 text-center">
          <div className="blob-ocean absolute left-1/3 top-0 h-64 w-64 opacity-20" />
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="mb-4 text-6xl animate-float">🏆</div>
            <p className="text-xl font-bold text-foreground">
              No achievements in this category yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Keep learning to unlock amazing achievements!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
