'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { LevelUpData } from '@/types/gamification.types';

interface LevelUpModalProps {
  levelUpData: LevelUpData;
  petName: string;
  onDismiss: () => void;
  onPlaySound?: (soundName: string) => void;
}

const TIER_ICONS: Record<string, string> = {
  'Wave Runner': '🌊',
  'Knowledge Keeper': '📚',
  'Consistency Champion': '⭐',
  'Participation Pro': '🎯',
  'Wellness Warrior': '💪',
  Luminary: '✨',
};

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  levelUpData,
  petName,
  onDismiss,
  onPlaySound,
}) => {
  useEffect(() => {
    onPlaySound?.('levelUp');
  }, [onPlaySound]);

  const tierIcon = TIER_ICONS[levelUpData.tierName] || '🎮';
  const tierChanged = levelUpData.previousLevel < levelUpData.newLevel;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Confetti */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none text-2xl"
          initial={{
            opacity: 1,
            x: Math.random() * window.innerWidth,
            y: -50,
            rotate: Math.random() * 360,
          }}
          animate={{
            opacity: 0,
            y: window.innerHeight + 50,
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: 3,
            ease: 'easeIn',
            delay: Math.random() * 0.5,
          }}
        >
          {['🎉', '⭐', '🌟', '✨', '🎊'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}

      {/* Modal Content */}
      <motion.div
        className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-2 border-yellow-400/50 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 50 }}
        transition={{ type: 'spring', damping: 10, stiffness: 200 }}
      >
        {/* Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-yellow-400/30 to-transparent blur-xl" />

        {/* Content */}
        <div className="relative p-8 text-center space-y-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300">
              LEVEL UP!
            </h2>
          </motion.div>

          {/* Level Number */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: 3 }}
            className="py-4"
          >
            <p className="text-white/60 text-sm uppercase tracking-widest mb-2">Level</p>
            <motion.p
              className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', damping: 5 }}
            >
              {levelUpData.newLevel}
            </motion.p>
          </motion.div>

          {/* Tier Display */}
          {tierChanged && (
            <motion.div
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-xs text-white/70 uppercase tracking-widest font-semibold mb-2">
                New Tier Reached!
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl">{tierIcon}</span>
                <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                  {levelUpData.tierName}
                </p>
              </div>
            </motion.div>
          )}

          {/* Pet Reaction */}
          <motion.div
            className="py-4"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{
              duration: 0.6,
              delay: 0.7,
            }}
          >
            <p className="text-6xl">🎉</p>
            <p className="text-sm text-white/70 mt-2">{petName} is super excited!</p>
          </motion.div>

          {/* Rewards */}
          <motion.div
            className="space-y-2 bg-white/5 border border-white/10 rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-sm font-semibold text-white/80 uppercase tracking-widest">Rewards</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/70">XP Bonus</span>
                <span className="font-bold text-yellow-300 text-lg">
                  +{((levelUpData.newLevel - levelUpData.previousLevel) * 100).toLocaleString()} XP
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Coins Earned</span>
                <span className="font-bold text-amber-300 text-lg">
                  +{levelUpData.coinReward} 🪙
                </span>
              </div>
              {levelUpData.cosmetics && levelUpData.cosmetics.length > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-white/70">New Cosmetics Unlocked</span>
                  <span className="font-bold text-purple-300">
                    {levelUpData.cosmetics.length} items
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Dismiss Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Button
              onClick={onDismiss}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-slate-900 font-bold py-6 text-lg"
            >
              Awesome! 🚀
            </Button>
          </motion.div>
        </div>

        {/* Bottom Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-400/20 to-transparent blur-xl" />
      </motion.div>
    </motion.div>
  );
};
