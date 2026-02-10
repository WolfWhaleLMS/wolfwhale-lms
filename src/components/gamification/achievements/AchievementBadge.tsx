'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import type { Achievement, RarityTier } from '@/types/gamification.types';

interface AchievementBadgeProps {
  achievement: Achievement;
  isEarned: boolean;
  size?: 'sm' | 'lg';
  onClick?: () => void;
  showTooltip?: boolean;
}

const RARITY_BORDER: Record<RarityTier, string> = {
  common: 'border-gray-400',
  uncommon: 'border-green-400',
  rare: 'border-blue-400',
  epic: 'border-purple-400',
  legendary: 'border-yellow-400',
};

const RARITY_GLOW: Record<RarityTier, string> = {
  common: 'shadow-gray-400/30',
  uncommon: 'shadow-green-400/30',
  rare: 'shadow-blue-400/30',
  epic: 'shadow-purple-400/30',
  legendary: 'shadow-yellow-400/30',
};

const RARITY_GRADIENT: Record<RarityTier, string> = {
  common: 'from-gray-400 to-gray-600',
  uncommon: 'from-green-400 to-green-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-yellow-600',
};

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  isEarned,
  size = 'sm',
  onClick,
  showTooltip = true,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const sizeClass = size === 'sm' ? 'w-20 h-20' : 'w-32 h-32';
  const iconSize = size === 'sm' ? 'text-6xl' : 'text-9xl';

  return (
    <div className="relative">
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
        className={`relative group cursor-pointer transition-all rounded-2xl border-2 p-2 ${
          RARITY_BORDER[achievement.rarity]
        } ${sizeClass} flex items-center justify-center overflow-hidden`}
        whileHover={isEarned ? { scale: 1.1 } : { scale: 1 }}
        whileTap={isEarned ? { scale: 0.95 } : { scale: 1 }}
      >
        {/* Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            RARITY_GRADIENT[achievement.rarity]
          } opacity-10 transition-opacity ${isEarned ? 'group-hover:opacity-20' : 'opacity-5'}`}
        />

        {/* Earned Glow */}
        {isEarned && (
          <motion.div
            className={`absolute inset-0 border-2 ${
              RARITY_BORDER[achievement.rarity]
            } rounded-2xl shadow-lg ${RARITY_GLOW[achievement.rarity]} opacity-50`}
            animate={{ boxShadow: ['0 0 10px 0 currentColor', '0 0 20px 0 currentColor'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Icon */}
        <motion.div
          className={`relative z-10 ${iconSize} ${
            isEarned
              ? 'filter-none'
              : 'grayscale brightness-50'
          }`}
          animate={isEarned && size === 'sm' ? { y: [0, -2, 0] } : {}}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          {achievement.iconUrl || '🏆'}
        </motion.div>

        {/* Lock Icon (if not earned) */}
        {!isEarned && (
          <div className="absolute bottom-0 right-0 bg-red-500 rounded-full p-1">
            <Lock className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Earned Checkmark */}
        {isEarned && (
          <motion.div
            className="absolute top-0 right-0 bg-green-500 rounded-full p-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 5 }}
          >
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        )}
      </motion.button>

      {/* Tooltip / Info */}
      {showTooltip && (showInfo || size === 'lg') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-slate-900 border border-white/20 rounded-lg p-3 shadow-lg z-50"
        >
          <p className="font-bold text-white text-sm">{achievement.name}</p>
          <p className="text-xs text-white/70 mt-1">{achievement.description}</p>

          <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Tier</span>
              <span className={`font-bold uppercase text-${achievement.rarity === 'legendary' ? 'yellow' : achievement.rarity === 'epic' ? 'purple' : achievement.rarity === 'rare' ? 'blue' : 'gray'}-300`}>
                {achievement.rarity}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">XP Reward</span>
              <span className="text-yellow-300 font-bold">+{achievement.xpReward}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Coins Reward</span>
              <span className="text-amber-300 font-bold">+{achievement.coinReward}</span>
            </div>
          </div>

          {!isEarned && (
            <div className="mt-2 pt-2 border-t border-white/10">
              <p className="text-xs text-white/60 italic">Locked - Complete requirements to unlock</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
