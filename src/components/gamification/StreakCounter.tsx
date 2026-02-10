'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Calendar, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STREAK_MILESTONES } from '@/lib/mock-data/gamification';

interface StreakCounterProps {
  streakDays: number;
  calendarData: { date: string; active: boolean }[];
  variant?: 'k5' | '612' | 'default';
  className?: string;
}

/**
 * Get the next milestone for a given streak
 */
function getNextMilestone(currentStreak: number): number | null {
  for (const milestone of STREAK_MILESTONES) {
    if (currentStreak < milestone) return milestone;
  }
  return null;
}

/**
 * Get streak intensity color based on days
 */
function getStreakColor(days: number): string {
  if (days >= 90) return 'text-rose-500';
  if (days >= 30) return 'text-orange-500';
  if (days >= 14) return 'text-amber-500';
  if (days >= 7) return 'text-yellow-500';
  return 'text-yellow-400';
}

function getStreakGradient(days: number): string {
  if (days >= 90) return 'from-rose-500 to-red-600';
  if (days >= 30) return 'from-orange-500 to-red-500';
  if (days >= 14) return 'from-amber-500 to-orange-500';
  if (days >= 7) return 'from-yellow-400 to-amber-500';
  return 'from-yellow-300 to-yellow-500';
}

const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const StreakCounter: React.FC<StreakCounterProps> = ({
  streakDays,
  calendarData,
  variant = 'default',
  className = '',
}) => {
  const nextMilestone = getNextMilestone(streakDays);
  const streakColor = getStreakColor(streakDays);
  const streakGradient = getStreakGradient(streakDays);

  // Get day names for the calendar dates
  const calendarWithDays = calendarData.map((entry) => {
    const date = new Date(entry.date);
    return {
      ...entry,
      dayName: DAY_NAMES[date.getDay()],
      dayNumber: date.getDate(),
    };
  });

  // K-5 variant: Big, colorful, celebratory
  if (variant === 'k5') {
    return (
      <div className={cn('relative p-6 rounded-3xl border-2 border-orange-200/50 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 dark:border-orange-800/30 overflow-hidden', className)}>
        {/* Background fire particles */}
        {streakDays >= 7 && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-xl pointer-events-none"
                style={{
                  left: `${15 + i * 18}%`,
                  bottom: '-10px',
                }}
                animate={{
                  y: [0, -60, -120],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.3],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              >
                {i % 2 === 0 ? '🔥' : '✨'}
              </motion.div>
            ))}
          </>
        )}

        {/* Main streak display */}
        <div className="relative z-10 text-center mb-5">
          <motion.div
            className="inline-flex items-center gap-3"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span
              className="text-5xl"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              🔥
            </motion.span>
            <span className={cn('text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r', streakGradient)}>
              {streakDays}
            </span>
          </motion.div>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">
            Day Streak!
          </p>
        </div>

        {/* Calendar dots - last 7 days */}
        <div className="flex items-center justify-center gap-3 mb-5">
          {calendarWithDays.map((day, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.08, type: 'spring' }}
            >
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {day.dayName}
              </span>
              <motion.div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                  day.active
                    ? cn('bg-gradient-to-br text-white shadow-md', streakGradient)
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                )}
                whileHover={{ scale: 1.2 }}
              >
                {day.active ? '✓' : day.dayNumber}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Milestone indicators */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {STREAK_MILESTONES.map((milestone) => {
            const achieved = streakDays >= milestone;
            return (
              <motion.div
                key={milestone}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold',
                  achieved
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white shadow-md'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                )}
                whileHover={{ scale: 1.05 }}
              >
                {achieved ? <Trophy className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                {milestone}d
              </motion.div>
            );
          })}
        </div>

        {/* Next milestone */}
        {nextMilestone && (
          <motion.p
            className="text-center text-sm text-slate-600 dark:text-slate-400 mt-3 font-medium"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {nextMilestone - streakDays} days to {nextMilestone}-day milestone!
          </motion.p>
        )}
      </div>
    );
  }

  // 6-12 variant: Compact, clean
  if (variant === '612') {
    return (
      <div className={cn('flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm', className)}>
        <div className="flex items-center gap-2">
          <Flame className={cn('w-5 h-5', streakColor)} />
          <span className="text-lg font-bold text-slate-900 dark:text-white">{streakDays}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">day streak</span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          {calendarWithDays.map((day, i) => (
            <div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full',
                day.active
                  ? cn('bg-gradient-to-br', streakGradient)
                  : 'bg-slate-300 dark:bg-slate-600'
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('p-5 rounded-2xl border border-white/20 bg-gradient-to-br from-orange-500/5 to-amber-500/5 backdrop-blur-sm', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Flame className={cn('w-7 h-7', streakColor)} />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className={cn('text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r', streakGradient)}>
                {streakDays}
              </span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-200">Day Streak</span>
            </div>
          </div>
        </div>
        {nextMilestone && (
          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400">Next milestone</p>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{nextMilestone} days</p>
          </div>
        )}
      </div>

      {/* Calendar display - last 7 days */}
      <div className="flex items-center justify-between gap-2 mb-4">
        {calendarWithDays.map((day, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center gap-1 flex-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase">
              {day.dayName}
            </span>
            <motion.div
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all',
                day.active
                  ? cn('bg-gradient-to-br text-white shadow-sm', streakGradient)
                  : 'bg-slate-100 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500'
              )}
              whileHover={{ scale: 1.15 }}
            >
              {day.active ? '✓' : day.dayNumber}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Milestone indicators */}
      <div className="flex flex-wrap items-center gap-1.5">
        {STREAK_MILESTONES.map((milestone) => {
          const achieved = streakDays >= milestone;
          return (
            <div
              key={milestone}
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold',
                achieved
                  ? cn('bg-gradient-to-r text-white', streakGradient)
                  : 'bg-slate-100 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500'
              )}
            >
              {achieved ? '✓' : '○'} {milestone}d
            </div>
          );
        })}
      </div>
    </div>
  );
};
