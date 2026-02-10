'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Coins, Trophy, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIER_NAMES, LEVEL_THRESHOLDS } from '@/config/constants';
import { getAllAchievements } from '@/config/achievements';
import { XPProgressBar } from './XPProgressBar';
import { LevelBadge } from './LevelBadge';
import { StreakCounter } from './StreakCounter';
import { AchievementBadges } from './AchievementBadges';
import type { StudentAchievement, XPTransaction } from '@/types/gamification.types';

interface GamificationSummaryProps {
  totalXP: number;
  currentLevel: number;
  tierIndex: number;
  currentLevelXP: number;
  xpForCurrentLevel: number;
  coins: number;
  streakDays: number;
  streakCalendar: { date: string; active: boolean }[];
  earnedAchievements: Map<string, StudentAchievement>;
  recentXP?: XPTransaction[];
  size?: 'compact' | 'full';
  variant?: 'k5' | '612' | 'default';
  className?: string;
  onViewAchievements?: () => void;
}

export const GamificationSummary: React.FC<GamificationSummaryProps> = ({
  totalXP,
  currentLevel,
  tierIndex,
  currentLevelXP,
  xpForCurrentLevel,
  coins,
  streakDays,
  streakCalendar,
  earnedAchievements,
  recentXP = [],
  size = 'compact',
  variant = 'default',
  className = '',
  onViewAchievements,
}) => {
  const allAchievements = getAllAchievements();
  const earnedCount = earnedAchievements.size;
  const totalCount = allAchievements.length;
  const recentlyEarned = allAchievements.filter((a) => earnedAchievements.has(a.id)).slice(0, 4);

  // Compact dashboard widget
  if (size === 'compact') {
    return (
      <motion.div
        className={cn(
          'p-5 rounded-2xl border border-white/20 bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl space-y-4',
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Top row: Level badge + XP bar */}
        <div className="flex items-center gap-4">
          <LevelBadge
            level={currentLevel}
            tierIndex={tierIndex}
            size="md"
            showTierName={false}
          />
          <div className="flex-1">
            <XPProgressBar
              currentXP={currentLevelXP}
              xpNeeded={xpForCurrentLevel}
              level={currentLevel}
              tierIndex={tierIndex}
              totalXP={totalXP}
              variant="612"
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
            <Flame className="w-4 h-4 text-orange-500" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Streak</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{streakDays}d</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
            <Coins className="w-4 h-4 text-amber-500" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Coins</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{coins}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <Trophy className="w-4 h-4 text-purple-500" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Badges</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{earnedCount}/{totalCount}</p>
            </div>
          </div>
        </div>

        {/* Recent badges preview */}
        {recentlyEarned.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Recent Badges
              </p>
              {onViewAchievements && (
                <button
                  onClick={onViewAchievements}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {recentlyEarned.map((achievement, i) => (
                <motion.div
                  key={achievement.id}
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center text-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.15 }}
                >
                  {achievement.iconUrl}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // Full page size
  return (
    <motion.div
      className={cn('space-y-6', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Level + XP section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level badge - prominent display */}
        <motion.div
          className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <LevelBadge
            level={currentLevel}
            tierIndex={tierIndex}
            size="lg"
            showTierName={true}
            recentLevelUp={false}
          />
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total XP</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {totalXP.toLocaleString()}
            </p>
          </div>
        </motion.div>

        {/* XP Progress + Stats */}
        <div className="md:col-span-2 space-y-4">
          <XPProgressBar
            currentXP={currentLevelXP}
            xpNeeded={xpForCurrentLevel}
            level={currentLevel}
            tierIndex={tierIndex}
            totalXP={totalXP}
            variant={variant}
          />

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/30"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-800/30">
                  <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Coin Balance</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{coins}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-800/30"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-800/30">
                  <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Achievements</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {earnedCount} / {totalCount}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Streak section */}
      <StreakCounter
        streakDays={streakDays}
        calendarData={streakCalendar}
        variant={variant}
      />

      {/* Achievements section */}
      <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-500" />
            Achievements
          </h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {earnedCount} of {totalCount} earned
          </span>
        </div>
        <AchievementBadges
          achievements={allAchievements}
          earnedMap={earnedAchievements}
          showAll={true}
        />
      </div>

      {/* Recent XP activity */}
      {recentXP.length > 0 && (
        <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-500" />
            Recent XP Activity
          </h3>
          <div className="space-y-2">
            {recentXP.map((tx, i) => (
              <motion.div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {tx.sourceDescription}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <motion.span
                  className="text-sm font-bold text-yellow-600 dark:text-yellow-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.08 + 0.2, type: 'spring' }}
                >
                  +{tx.amount} XP
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
