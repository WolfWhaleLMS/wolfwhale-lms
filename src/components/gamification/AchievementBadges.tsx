'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Award, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { getAchievementHint } from '@/config/achievements';
import type { Achievement, StudentAchievement, RarityTier } from '@/types/gamification.types';

interface AchievementBadgesProps {
  achievements: Achievement[];
  earnedMap: Map<string, StudentAchievement>;
  className?: string;
  maxDisplay?: number;
  showAll?: boolean;
}

const RARITY_COLORS: Record<RarityTier, {
  border: string;
  bg: string;
  glow: string;
  text: string;
  label: string;
}> = {
  common: {
    border: 'border-gray-400',
    bg: 'from-gray-400 to-gray-500',
    glow: 'shadow-gray-400/20',
    text: 'text-gray-300',
    label: 'Common',
  },
  uncommon: {
    border: 'border-green-400',
    bg: 'from-green-400 to-emerald-500',
    glow: 'shadow-green-400/20',
    text: 'text-green-300',
    label: 'Uncommon',
  },
  rare: {
    border: 'border-blue-400',
    bg: 'from-blue-400 to-indigo-500',
    glow: 'shadow-blue-400/20',
    text: 'text-blue-300',
    label: 'Rare',
  },
  epic: {
    border: 'border-purple-400',
    bg: 'from-purple-400 to-violet-500',
    glow: 'shadow-purple-400/20',
    text: 'text-purple-300',
    label: 'Epic',
  },
  legendary: {
    border: 'border-yellow-400',
    bg: 'from-yellow-400 to-amber-500',
    glow: 'shadow-yellow-400/30',
    text: 'text-yellow-300',
    label: 'Legendary',
  },
};

interface BadgeDetailModalProps {
  achievement: Achievement;
  isEarned: boolean;
  earnedDate?: string;
  onClose: () => void;
}

const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
  achievement,
  isEarned,
  earnedDate,
  onClose,
}) => {
  const rarityColors = RARITY_COLORS[achievement.rarity] || RARITY_COLORS.common;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 dark:border-slate-700"
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={cn('relative p-6 bg-gradient-to-br', rarityColors.bg, 'text-white')}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center">
            <motion.div
              className="text-6xl mb-3"
              animate={isEarned ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] } : {}}
              transition={{ duration: 1, repeat: isEarned ? Infinity : 0, repeatDelay: 2 }}
            >
              {isEarned ? achievement.iconUrl : '🔒'}
            </motion.div>
            <h3 className="text-xl font-bold">{achievement.name}</h3>
            <p className={cn('text-xs font-semibold uppercase tracking-wider mt-1 opacity-80')}>
              {rarityColors.label}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {achievement.description}
          </p>

          {isEarned && earnedDate && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <Award className="w-4 h-4" />
              <span>Earned {formatDate(earnedDate)}</span>
            </div>
          )}

          {!isEarned && (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 italic">
              <Lock className="w-4 h-4" />
              <span>{getAchievementHint(achievement.id)}</span>
            </div>
          )}

          {/* Rewards */}
          <div className="flex items-center gap-4 pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="text-yellow-500 text-lg">⚡</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                +{achievement.xpReward} XP
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                +{achievement.coinReward}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({
  achievements,
  earnedMap,
  className = '',
  maxDisplay,
  showAll = false,
}) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // Sort: earned first, then by rarity (legendary first)
  const rarityOrder: Record<RarityTier, number> = {
    legendary: 0,
    epic: 1,
    rare: 2,
    uncommon: 3,
    common: 4,
  };

  const sortedAchievements = [...achievements].sort((a, b) => {
    const aEarned = earnedMap.has(a.id) ? 0 : 1;
    const bEarned = earnedMap.has(b.id) ? 0 : 1;
    if (aEarned !== bEarned) return aEarned - bEarned;
    return (rarityOrder[a.rarity] || 4) - (rarityOrder[b.rarity] || 4);
  });

  const displayAchievements = maxDisplay && !showAll
    ? sortedAchievements.slice(0, maxDisplay)
    : sortedAchievements;

  return (
    <>
      <div className={cn('grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3', className)}>
        {displayAchievements.map((achievement, index) => {
          const isEarned = earnedMap.has(achievement.id);
          const rarityColors = RARITY_COLORS[achievement.rarity] || RARITY_COLORS.common;
          const earned = earnedMap.get(achievement.id);

          return (
            <motion.button
              key={achievement.id}
              className={cn(
                'relative group flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all',
                isEarned
                  ? cn(rarityColors.border, 'bg-white dark:bg-slate-800 hover:shadow-lg', rarityColors.glow)
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 opacity-60 hover:opacity-80'
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03, type: 'spring' }}
              whileHover={isEarned ? { scale: 1.08, y: -4 } : { scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedAchievement(achievement)}
            >
              {/* Icon */}
              <div
                className={cn(
                  'text-3xl transition-all',
                  isEarned ? 'grayscale-0' : 'grayscale brightness-50'
                )}
              >
                {isEarned ? achievement.iconUrl : '???'}
              </div>

              {/* Name */}
              <p className={cn(
                'text-[10px] font-semibold text-center leading-tight line-clamp-2',
                isEarned
                  ? 'text-slate-700 dark:text-slate-200'
                  : 'text-slate-400 dark:text-slate-500'
              )}>
                {isEarned ? achievement.name : '???'}
              </p>

              {/* Earned indicator */}
              {isEarned && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: index * 0.03 + 0.2 }}
                >
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Lock icon for locked */}
              {!isEarned && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-400 dark:bg-slate-600 rounded-full flex items-center justify-center">
                  <Lock className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <BadgeDetailModal
            achievement={selectedAchievement}
            isEarned={earnedMap.has(selectedAchievement.id)}
            earnedDate={earnedMap.get(selectedAchievement.id)?.unlockedAt}
            onClose={() => setSelectedAchievement(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
