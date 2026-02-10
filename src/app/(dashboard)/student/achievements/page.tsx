'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Zap,
  Flame,
  Coins,
  Star,
  Filter,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { TIER_NAMES, LEVEL_THRESHOLDS, GAMIFICATION_LIMITS } from '@/config/constants';
import { getAllAchievements, ACHIEVEMENT_DEFINITIONS } from '@/config/achievements';
import {
  MOCK_GAMIFICATION_STATE,
  MOCK_STUDENT_ACHIEVEMENTS,
  MOCK_XP_TRANSACTIONS,
  getMockStreakCalendar,
  STREAK_MILESTONES,
} from '@/lib/mock-data/gamification';
import { XPProgressBar } from '@/components/gamification/XPProgressBar';
import { LevelBadge } from '@/components/gamification/LevelBadge';
import { StreakCounter } from '@/components/gamification/StreakCounter';
import { AchievementBadges } from '@/components/gamification/AchievementBadges';
import { XPHistory } from '@/components/gamification/xp/XPHistory';
import type { StudentAchievement, AchievementCategory } from '@/types/gamification.types';

const CATEGORIES: (AchievementCategory | 'All')[] = [
  'All',
  'Academic',
  'Consistency',
  'Engagement',
  'Participation',
  'Wellness',
];

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'All'>('All');

  // Build earned achievements map from mock data
  const earnedMap = useMemo(() => {
    const map = new Map<string, StudentAchievement>();
    MOCK_STUDENT_ACHIEVEMENTS.forEach((sa) => {
      map.set(sa.achievementId, sa);
    });
    return map;
  }, []);

  const allAchievements = useMemo(() => getAllAchievements(), []);
  const streakCalendar = useMemo(() => getMockStreakCalendar(), []);

  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'All') return allAchievements;
    return allAchievements.filter((a) => a.category === selectedCategory);
  }, [allAchievements, selectedCategory]);

  const earnedCount = earnedMap.size;
  const totalCount = allAchievements.length;
  const completionPercent = Math.round((earnedCount / totalCount) * 100);

  const {
    totalXP,
    currentLevel,
    tierIndex,
    currentLevelXP,
    xpForCurrentLevel,
    coins,
    streakDays,
  } = MOCK_GAMIFICATION_STATE;

  const tierName = TIER_NAMES[tierIndex] || 'Pup Recruit';

  // Category stats
  const categoryStats = useMemo(() => {
    return CATEGORIES.filter((c) => c !== 'All').map((cat) => {
      const catAchievements = allAchievements.filter((a) => a.category === cat);
      const earned = catAchievements.filter((a) => earnedMap.has(a.id)).length;
      return { category: cat, total: catAchievements.length, earned };
    });
  }, [allAchievements, earnedMap]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-amber-50/20 dark:from-slate-950 dark:via-purple-950/20 dark:to-amber-950/10 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Trophy className="w-10 h-10 text-purple-600" />
                Achievements
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">
                Track your progress, earn badges, and level up!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/30">
                <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="text-lg font-bold text-amber-700 dark:text-amber-300">{coins}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hero Section: Level + XP + Streak */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Level Display */}
          <motion.div
            className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
          >
            <LevelBadge
              level={currentLevel}
              tierIndex={tierIndex}
              size="lg"
              showTierName={true}
              recentLevelUp={false}
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total XP Earned</p>
              <motion.p
                className="text-3xl font-black text-yellow-600 dark:text-yellow-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                {totalXP.toLocaleString()}
              </motion.p>
            </div>

            {/* Daily/Weekly XP caps */}
            <div className="mt-4 w-full space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Daily Cap</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  75 / {GAMIFICATION_LIMITS.daily_xp_cap} XP
                </span>
              </div>
              <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '25%' }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Weekly Cap</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  420 / {GAMIFICATION_LIMITS.weekly_xp_cap} XP
                </span>
              </div>
              <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(420 / 1800) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                />
              </div>
            </div>
          </motion.div>

          {/* XP Progress Bar */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <XPProgressBar
              currentXP={currentLevelXP}
              xpNeeded={xpForCurrentLevel}
              level={currentLevel}
              tierIndex={tierIndex}
              totalXP={totalXP}
              variant="default"
            />

            {/* Streak Counter */}
            <StreakCounter
              streakDays={streakDays}
              calendarData={streakCalendar}
              variant="default"
            />
          </motion.div>
        </div>

        {/* Achievement Progress Overview */}
        <motion.div
          className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                Badge Collection
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {earnedCount} of {totalCount} badges earned ({completionPercent}%)
              </p>
            </div>

            {/* Overall progress bar */}
            <div className="hidden md:flex items-center gap-3 w-48">
              <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercent}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                {completionPercent}%
              </span>
            </div>
          </div>

          {/* Category progress cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {categoryStats.map((stat, i) => {
              const pct = stat.total > 0 ? Math.round((stat.earned / stat.total) * 100) : 0;
              return (
                <motion.button
                  key={stat.category}
                  className={cn(
                    'p-3 rounded-xl border transition-all text-left',
                    selectedCategory === stat.category
                      ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  onClick={() => setSelectedCategory(
                    selectedCategory === stat.category ? 'All' : stat.category as AchievementCategory
                  )}
                >
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    {stat.category}
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {stat.earned}/{stat.total}
                  </p>
                  <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Filter button row */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Button
              variant={selectedCategory === 'All' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('All')}
              className="text-xs"
            >
              All ({totalCount})
            </Button>
            {CATEGORIES.filter((c) => c !== 'All').map((cat) => {
              const stat = categoryStats.find((s) => s.category === cat);
              return (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat as AchievementCategory)}
                  className="text-xs"
                >
                  {cat} ({stat?.earned || 0}/{stat?.total || 0})
                </Button>
              );
            })}
          </div>

          {/* Achievement badges grid */}
          <AchievementBadges
            achievements={filteredAchievements}
            earnedMap={earnedMap}
            showAll={true}
          />
        </motion.div>

        {/* Bottom row: Streak History + XP Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Streak History */}
          <motion.div
            className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-orange-500" />
              Streak History
            </h3>

            <div className="space-y-4">
              {/* Current streak */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200/50 dark:border-orange-800/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Current Streak</p>
                    <p className="text-3xl font-black text-orange-600 dark:text-orange-400">{streakDays} days</p>
                  </div>
                  <motion.div
                    className="text-4xl"
                    animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    🔥
                  </motion.div>
                </div>
              </div>

              {/* Milestone progress */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Streak Milestones</p>
                {STREAK_MILESTONES.map((milestone) => {
                  const achieved = streakDays >= milestone;
                  const progress = achieved ? 100 : Math.round((streakDays / milestone) * 100);
                  return (
                    <div key={milestone} className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold',
                        achieved
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                      )}>
                        {achieved ? '✓' : milestone}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className={cn(
                            'font-medium',
                            achieved ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'
                          )}>
                            {milestone} Day Streak
                          </span>
                          <span className="text-slate-400">{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className={cn(
                              'h-full rounded-full',
                              achieved
                                ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                                : 'bg-slate-300 dark:bg-slate-600'
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Best streak */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                <span className="text-sm text-slate-600 dark:text-slate-300">Best Streak</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{streakDays} days</span>
              </div>
            </div>
          </motion.div>

          {/* XP Activity Log */}
          <motion.div
            className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
              XP Activity Log
            </h3>

            <XPHistory transactions={MOCK_XP_TRANSACTIONS} />

            {/* Daily summary */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200/50 dark:border-yellow-800/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Today&apos;s XP</p>
                  <p className="text-2xl font-black text-yellow-600 dark:text-yellow-400">+75 XP</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">This Week</p>
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400">+420 XP</p>
                </div>
              </div>
            </div>

            {/* Coin balance */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/50 dark:border-amber-800/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-800/30">
                  <Coins className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Coin Balance</p>
                  <p className="text-2xl font-black text-amber-700 dark:text-amber-300">{coins} Coins</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tier Progress Overview */}
        <motion.div
          className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-yellow-500" />
            Tier Journey
          </h3>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {TIER_NAMES.map((tier, i) => {
              const isCurrentTier = i === tierIndex;
              const isAchieved = i <= tierIndex;

              return (
                <React.Fragment key={tier}>
                  <motion.div
                    className={cn(
                      'flex flex-col items-center gap-2 flex-shrink-0 px-3 py-2 rounded-xl transition-all',
                      isCurrentTier
                        ? 'bg-gradient-to-b from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-400 dark:border-purple-600 shadow-md'
                        : isAchieved
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30'
                        : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 opacity-50'
                    )}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
                        isAchieved
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                      )}
                    >
                      {isAchieved ? '✓' : i + 1}
                    </div>
                    <p className={cn(
                      'text-[10px] font-semibold text-center whitespace-nowrap',
                      isCurrentTier
                        ? 'text-purple-700 dark:text-purple-300'
                        : isAchieved
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-slate-400 dark:text-slate-500'
                    )}>
                      {tier}
                    </p>
                    {isCurrentTier && (
                      <motion.p
                        className="text-[9px] text-purple-500 dark:text-purple-400 font-medium"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Current
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Connector line */}
                  {i < TIER_NAMES.length - 1 && (
                    <div
                      className={cn(
                        'w-8 h-0.5 flex-shrink-0',
                        i < tierIndex
                          ? 'bg-green-400'
                          : 'bg-slate-200 dark:bg-slate-700'
                      )}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
