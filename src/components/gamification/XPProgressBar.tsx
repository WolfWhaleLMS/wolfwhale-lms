'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIER_NAMES } from '@/config/constants';

interface XPProgressBarProps {
  currentXP: number;
  xpNeeded: number;
  level: number;
  tierIndex: number;
  totalXP: number;
  variant?: 'k5' | '612' | 'default';
  className?: string;
}

/**
 * Tier color gradients (bronze -> silver -> gold -> etc.)
 * Maps to the 7 TIER_NAMES from constants
 */
const TIER_GRADIENTS: Record<number, { bar: string; text: string; bg: string; glow: string }> = {
  0: {
    bar: 'from-amber-600 via-amber-500 to-yellow-500',
    text: 'from-amber-300 to-yellow-200',
    bg: 'from-amber-500/10 to-yellow-500/10',
    glow: 'rgba(217, 119, 6, 0.4)',
  },
  1: {
    bar: 'from-slate-400 via-slate-300 to-gray-200',
    text: 'from-slate-200 to-gray-100',
    bg: 'from-slate-400/10 to-gray-300/10',
    glow: 'rgba(148, 163, 184, 0.4)',
  },
  2: {
    bar: 'from-yellow-500 via-amber-400 to-yellow-300',
    text: 'from-yellow-200 to-amber-200',
    bg: 'from-yellow-500/10 to-amber-400/10',
    glow: 'rgba(234, 179, 8, 0.4)',
  },
  3: {
    bar: 'from-cyan-500 via-blue-400 to-sky-400',
    text: 'from-cyan-200 to-sky-200',
    bg: 'from-cyan-500/10 to-sky-400/10',
    glow: 'rgba(6, 182, 212, 0.4)',
  },
  4: {
    bar: 'from-emerald-500 via-green-400 to-teal-400',
    text: 'from-emerald-200 to-teal-200',
    bg: 'from-emerald-500/10 to-teal-400/10',
    glow: 'rgba(16, 185, 129, 0.4)',
  },
  5: {
    bar: 'from-purple-600 via-violet-500 to-indigo-500',
    text: 'from-purple-200 to-indigo-200',
    bg: 'from-purple-500/10 to-indigo-500/10',
    glow: 'rgba(139, 92, 246, 0.4)',
  },
  6: {
    bar: 'from-rose-500 via-pink-400 to-fuchsia-500',
    text: 'from-rose-200 to-fuchsia-200',
    bg: 'from-rose-500/10 to-fuchsia-500/10',
    glow: 'rgba(244, 63, 94, 0.5)',
  },
};

const TIER_ICONS: Record<number, string> = {
  0: '🐾',
  1: '🌊',
  2: '🐺',
  3: '🚢',
  4: '🔱',
  5: '🌊',
  6: '✨',
};

export const XPProgressBar: React.FC<XPProgressBarProps> = ({
  currentXP,
  xpNeeded,
  level,
  tierIndex,
  totalXP,
  variant = 'default',
  className = '',
}) => {
  const progressPercent = Math.min(100, (currentXP / xpNeeded) * 100);
  const safeTierIndex = Math.min(tierIndex, 6);
  const colors = TIER_GRADIENTS[safeTierIndex] || TIER_GRADIENTS[0];
  const tierName = TIER_NAMES[safeTierIndex] || 'Pup Recruit';
  const tierIcon = TIER_ICONS[safeTierIndex] || '🎮';

  // K-5 variant: Larger, with star decorations
  if (variant === 'k5') {
    return (
      <div className={cn('relative p-6 rounded-3xl border-2 border-white/20 bg-gradient-to-br', colors.bg, className)}>
        {/* Floating stars decoration */}
        <div className="absolute top-2 right-4">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          </motion.div>
        </div>
        <div className="absolute top-8 right-12">
          <motion.div
            animate={{ rotate: -360, scale: [1, 0.8, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 0.5 }}
          >
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
          </motion.div>
        </div>
        <div className="absolute bottom-3 left-6">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
          </motion.div>
        </div>

        {/* Level + Tier */}
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            className={cn('flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br', colors.bar, 'text-white font-black text-2xl shadow-lg')}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {level}
          </motion.div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">Level {level}</p>
            <div className="flex items-center gap-2">
              <span className="text-xl">{tierIcon}</span>
              <p className={cn('text-base font-bold bg-clip-text text-transparent bg-gradient-to-r', colors.text)}>
                {tierName}
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative mb-3">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className={cn('h-full rounded-full bg-gradient-to-r relative', colors.bar)}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            </motion.div>
          </div>
          {/* Star at progress tip */}
          {progressPercent > 5 && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${Math.min(progressPercent, 97)}%` }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
            </motion.div>
          )}
        </div>

        {/* XP numbers */}
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
            {currentXP.toLocaleString()} / {xpNeeded.toLocaleString()} XP
          </p>
          <motion.p
            className="text-sm font-semibold text-yellow-600 dark:text-yellow-400"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {(xpNeeded - currentXP).toLocaleString()} XP to go!
          </motion.p>
        </div>
      </div>
    );
  }

  // 6-12 variant: Clean, minimal
  if (variant === '612') {
    return (
      <div className={cn('p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm', className)}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white">Lv. {level}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{tierName}</span>
          </div>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {currentXP.toLocaleString()} / {xpNeeded.toLocaleString()} XP
          </span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full bg-gradient-to-r', colors.bar)}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('p-5 rounded-2xl border border-white/20 bg-gradient-to-br', colors.bg, 'backdrop-blur-sm', className)}>
      {/* Level + Tier header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <motion.div
            className={cn('flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br', colors.bar, 'text-white font-black text-lg shadow-lg')}
            whileHover={{ scale: 1.1 }}
          >
            {level}
          </motion.div>
          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">Level {level}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{tierIcon}</span>
              <p className={cn('text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r', colors.text)}>
                {tierName}
              </p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total XP</p>
          <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{totalXP.toLocaleString()}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative mb-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className={cn('h-full rounded-full bg-gradient-to-r relative', colors.bar)}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
            />
          </motion.div>
        </div>
      </div>

      {/* XP numbers */}
      <div className="flex items-center justify-between text-sm">
        <p className="font-semibold text-slate-700 dark:text-slate-200">
          {currentXP.toLocaleString()} / {xpNeeded.toLocaleString()} XP
        </p>
        <p className="text-slate-500 dark:text-slate-400">
          {(xpNeeded - currentXP).toLocaleString()} to Level {level + 1}
        </p>
      </div>
    </div>
  );
};
