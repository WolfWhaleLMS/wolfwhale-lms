'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TIER_NAMES } from '@/config/constants';

interface LevelBadgeProps {
  level: number;
  tierIndex: number;
  size?: 'sm' | 'md' | 'lg';
  showTierName?: boolean;
  recentLevelUp?: boolean;
  className?: string;
}

/**
 * Tier color schemes for the badge
 */
const TIER_BADGE_COLORS: Record<number, {
  border: string;
  bg: string;
  text: string;
  glow: string;
  ring: string;
}> = {
  0: {
    border: 'border-amber-500',
    bg: 'from-amber-600 to-yellow-500',
    text: 'text-amber-100',
    glow: '0 0 20px rgba(217, 119, 6, 0.5)',
    ring: 'ring-amber-400/30',
  },
  1: {
    border: 'border-slate-400',
    bg: 'from-slate-400 to-gray-300',
    text: 'text-slate-100',
    glow: '0 0 20px rgba(148, 163, 184, 0.5)',
    ring: 'ring-slate-300/30',
  },
  2: {
    border: 'border-yellow-400',
    bg: 'from-yellow-500 to-amber-400',
    text: 'text-yellow-100',
    glow: '0 0 20px rgba(234, 179, 8, 0.5)',
    ring: 'ring-yellow-300/30',
  },
  3: {
    border: 'border-cyan-400',
    bg: 'from-cyan-500 to-blue-500',
    text: 'text-cyan-100',
    glow: '0 0 20px rgba(6, 182, 212, 0.5)',
    ring: 'ring-cyan-300/30',
  },
  4: {
    border: 'border-emerald-400',
    bg: 'from-emerald-500 to-teal-500',
    text: 'text-emerald-100',
    glow: '0 0 20px rgba(16, 185, 129, 0.5)',
    ring: 'ring-emerald-300/30',
  },
  5: {
    border: 'border-purple-400',
    bg: 'from-purple-600 to-indigo-500',
    text: 'text-purple-100',
    glow: '0 0 20px rgba(139, 92, 246, 0.5)',
    ring: 'ring-purple-300/30',
  },
  6: {
    border: 'border-rose-400',
    bg: 'from-rose-500 to-fuchsia-500',
    text: 'text-rose-100',
    glow: '0 0 25px rgba(244, 63, 94, 0.6)',
    ring: 'ring-rose-300/30',
  },
};

const SIZE_CONFIG = {
  sm: {
    outer: 'w-12 h-12',
    inner: 'w-10 h-10',
    text: 'text-sm font-bold',
    tierText: 'text-xs',
    borderWidth: 'border-2',
  },
  md: {
    outer: 'w-16 h-16',
    inner: 'w-14 h-14',
    text: 'text-xl font-black',
    tierText: 'text-xs',
    borderWidth: 'border-[3px]',
  },
  lg: {
    outer: 'w-24 h-24',
    inner: 'w-20 h-20',
    text: 'text-3xl font-black',
    tierText: 'text-sm',
    borderWidth: 'border-4',
  },
};

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  tierIndex,
  size = 'md',
  showTierName = true,
  recentLevelUp = false,
  className = '',
}) => {
  const safeTierIndex = Math.min(tierIndex, 6);
  const colors = TIER_BADGE_COLORS[safeTierIndex] || TIER_BADGE_COLORS[0];
  const sizeConfig = SIZE_CONFIG[size];
  const tierName = TIER_NAMES[safeTierIndex] || 'Pup Recruit';

  return (
    <div className={cn('flex flex-col items-center gap-1.5', className)}>
      {/* Circular badge */}
      <motion.div
        className={cn(
          'relative rounded-full flex items-center justify-center',
          sizeConfig.outer,
          colors.border,
          sizeConfig.borderWidth,
          'ring-4',
          colors.ring
        )}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        whileHover={{ scale: 1.1 }}
      >
        {/* Inner circle with gradient */}
        <div
          className={cn(
            'rounded-full flex items-center justify-center bg-gradient-to-br',
            sizeConfig.inner,
            colors.bg
          )}
        >
          <span className={cn(sizeConfig.text, colors.text, 'drop-shadow-md')}>
            {level}
          </span>
        </div>

        {/* Glow animation for recent level-ups */}
        {recentLevelUp && (
          <>
            <motion.div
              className={cn(
                'absolute inset-0 rounded-full',
                colors.border,
                sizeConfig.borderWidth
              )}
              animate={{
                boxShadow: [
                  colors.glow,
                  colors.glow.replace('0.5)', '0.8)').replace('0.6)', '0.9)'),
                  colors.glow,
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {/* Sparkle particles */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  x: [0, Math.cos((i * Math.PI) / 2) * 30],
                  y: [0, Math.sin((i * Math.PI) / 2) * 30],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Tier name */}
      {showTierName && (
        <motion.p
          className={cn(
            sizeConfig.tierText,
            'font-semibold text-slate-600 dark:text-slate-300 text-center whitespace-nowrap'
          )}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {tierName}
        </motion.p>
      )}
    </div>
  );
};
