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
      earnedMap.set(achId, { earnedAt: ua.earned_at })
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Achievements
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track your progress and unlock achievements as you learn.
        </p>
      </div>

      {/* XP Progress Section */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-3">
          <Zap className="size-6 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {levelName}
            </h2>
            <p className="text-sm text-muted-foreground">
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

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="ocean-card rounded-2xl p-5 text-center">
          <Trophy className="mx-auto mb-2 size-6 text-yellow-500" />
          <p className="text-2xl font-bold text-foreground">{totalEarned}</p>
          <p className="text-sm text-muted-foreground">Earned</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <Star className="mx-auto mb-2 size-6 text-primary" />
          <p className="text-2xl font-bold text-foreground">{totalAvailable}</p>
          <p className="text-sm text-muted-foreground">Total Available</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <Zap className="mx-auto mb-2 size-6 text-emerald-500" />
          <p className="text-2xl font-bold text-foreground">
            {totalAvailable > 0
              ? Math.round((totalEarned / totalAvailable) * 100)
              : 0}
            %
          </p>
          <p className="text-sm text-muted-foreground">Completion</p>
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
            <Trophy className="size-5 text-yellow-500" />
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
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 text-5xl opacity-40">{'\u{1F30A}'}</div>
          <p className="text-muted-foreground">
            No achievements in this category yet.
          </p>
        </div>
      )}
    </div>
  )
}
