'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/Progress';

interface XPBarProps {
  currentXP: number;
  xpNeeded: number;
  level: number;
  tier: string;
  totalXP: number;
  variant?: 'compact' | 'full';
  className?: string;
}

const TIER_ICONS: Record<string, string> = {
  'Wave Runner': '🌊',
  'Knowledge Keeper': '📚',
  'Consistency Champion': '⭐',
  'Participation Pro': '🎯',
  'Wellness Warrior': '💪',
  Luminary: '✨',
};

const TIER_COLORS: Record<string, string> = {
  'Wave Runner': 'from-cyan-400 to-blue-400',
  'Knowledge Keeper': 'from-purple-400 to-indigo-400',
  'Consistency Champion': 'from-yellow-400 to-amber-400',
  'Participation Pro': 'from-orange-400 to-red-400',
  'Wellness Warrior': 'from-green-400 to-emerald-400',
  Luminary: 'from-pink-400 to-purple-400',
};

export const XPBar: React.FC<XPBarProps> = ({
  currentXP,
  xpNeeded,
  level,
  tier,
  totalXP,
  variant = 'full',
  className = '',
}) => {
  const progressPercent = (currentXP / xpNeeded) * 100;
  const tierIcon = TIER_ICONS[tier] || '🎮';
  const tierColor = TIER_COLORS[tier] || 'from-yellow-400 to-gold-400';

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-white">Level {level}</span>
            <span className="text-xs text-white/60">{currentXP} / {xpNeeded}</span>
          </div>
          <Progress value={progressPercent} variant="xp" />
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Level Display */}
      <motion.div
        className="text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <motion.div
          className={`inline-block bg-gradient-to-r ${tierColor} rounded-full p-1`}
          animate={{ boxShadow: ['0 0 0 0 rgba(255, 215, 0, 0.3)', '0 0 0 20px rgba(255, 215, 0, 0)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="bg-slate-950 rounded-full px-8 py-4">
            <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
              {level}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Tier Information */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{tierIcon}</span>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-widest font-semibold">Current Tier</p>
              <p className="text-lg font-bold text-white">{tier}</p>
            </div>
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-white">XP Progress</p>
            <p className="text-xs text-white/60">To Level {level + 1}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60">Total XP Earned</p>
            <p className="text-xl font-bold text-yellow-400">{totalXP.toLocaleString()}</p>
          </div>
        </div>

        {/* XP Bar */}
        <div className="space-y-2">
          <Progress value={progressPercent} variant="xp" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60">{currentXP.toLocaleString()}</span>
            <motion.span
              className="text-yellow-300 font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {(xpNeeded - currentXP).toLocaleString()} XP to next level
            </motion.span>
            <span className="text-white/60">{xpNeeded.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Next Tier Preview */}
      <motion.div
        className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4"
        animate={{ borderColor: ['rgba(168, 85, 247, 0.3)', 'rgba(236, 72, 153, 0.3)', 'rgba(168, 85, 247, 0.3)'] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <p className="text-xs text-white/70 uppercase tracking-widest font-semibold mb-1">
          Next Milestone
        </p>
        <p className="text-sm text-white">
          {Math.ceil((progressPercent / 100) * 100)}% towards Level {level + 1}
        </p>
      </motion.div>
    </div>
  );
};
