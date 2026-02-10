'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Flame, Trophy, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { MockXPData, MockAchievement } from '@/lib/mock-data';

interface XPProgressBarProps {
  variant: 'k5' | '612';
  xpData: MockXPData;
  achievements?: MockAchievement[];
}

/* ── K-5 XP / Level Bar ────────────────────────────── */

function K5XPProgressBar({ xpData }: { xpData: MockXPData }) {
  const progressPercent = ((xpData.totalXP - xpData.previousLevelXP) / (xpData.nextLevelXP - xpData.previousLevelXP)) * 100;

  return (
    <Card variant="fun" className="overflow-hidden">
      <CardContent className="p-5">
        {/* Level Name & XP */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-300 to-amber-500 shadow-lg"
            >
              <Star className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Level {xpData.currentLevel}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {xpData.currentTier}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Zap className="w-5 h-5 text-gold-500" />
              <span className="text-xl font-bold text-gold-600 dark:text-gold-400">
                {xpData.totalXP.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">XP Total</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            <span>Level {xpData.currentLevel}</span>
            <span>{xpData.totalXP.toLocaleString()} / {xpData.nextLevelXP.toLocaleString()} XP</span>
            <span>Level {xpData.currentLevel + 1}</span>
          </div>
          <Progress value={progressPercent} variant="xp" className="h-4 rounded-full" />
        </div>

        {/* Streak & Weekly XP */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200/50 dark:border-orange-800/30">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Flame className="w-6 h-6 text-orange-500" />
            </motion.div>
            <div>
              <p className="text-lg font-bold text-orange-700 dark:text-orange-300">{xpData.dailyStreak}</p>
              <p className="text-[10px] font-medium text-orange-600/70 dark:text-orange-400/70 uppercase tracking-wider">Day Streak</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200/50 dark:border-green-800/30">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-lg font-bold text-green-700 dark:text-green-300">+{xpData.weeklyXPEarned}</p>
              <p className="text-[10px] font-medium text-green-600/70 dark:text-green-400/70 uppercase tracking-wider">This Week</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── 6-12 Sidebar XP / Level ────────────────────────── */

function SecondaryXPProgressBar({ xpData, achievements = [] }: { xpData: MockXPData; achievements?: MockAchievement[] }) {
  const progressPercent = ((xpData.totalXP - xpData.previousLevelXP) / (xpData.nextLevelXP - xpData.previousLevelXP)) * 100;
  const earnedAchievements = achievements.filter(a => a.earnedDate !== null);

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Level & XP */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Badge variant="level" size="sm">Lv. {xpData.currentLevel}</Badge>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{xpData.currentTier}</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {xpData.totalXP.toLocaleString()} XP
            </span>
          </div>
          <Progress value={progressPercent} variant="xp" className="h-2" />
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 text-right">
            {(xpData.nextLevelXP - xpData.totalXP).toLocaleString()} XP to Level {xpData.currentLevel + 1}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <Flame className="w-4 h-4 text-orange-500 mx-auto mb-1" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">{xpData.dailyStreak}</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">Streak</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <Zap className="w-4 h-4 text-gold-500 mx-auto mb-1" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">{xpData.coinsBalance}</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">Coins</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <Trophy className="w-4 h-4 text-purple-500 mx-auto mb-1" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">{earnedAchievements.length}</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">Awards</p>
          </div>
        </div>

        {/* Recent Achievements */}
        {earnedAchievements.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Recent Achievements
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {earnedAchievements.slice(0, 4).map((ach) => (
                <div
                  key={ach.id}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                  title={ach.description}
                >
                  <span className="text-sm">{ach.iconEmoji}</span>
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">{ach.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Main Export ─────────────────────────────────────── */

export function XPProgressBar({ variant, xpData, achievements }: XPProgressBarProps) {
  if (variant === 'k5') {
    return <K5XPProgressBar xpData={xpData} />;
  }
  return <SecondaryXPProgressBar xpData={xpData} achievements={achievements} />;
}
