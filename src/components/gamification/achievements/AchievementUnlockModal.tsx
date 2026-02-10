'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Share2 } from 'lucide-react';
import type { Achievement } from '@/types/gamification.types';

interface AchievementUnlockModalProps {
  achievement: Achievement;
  xpEarned: number;
  coinsEarned: number;
  onDismiss: () => void;
  onShare?: () => void;
  onPlaySound?: (soundName: string) => void;
}

const RARITY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  common: { bg: 'from-gray-500/20 to-gray-600/20', border: 'border-gray-500/50', text: 'text-gray-300' },
  uncommon: { bg: 'from-green-500/20 to-green-600/20', border: 'border-green-500/50', text: 'text-green-300' },
  rare: { bg: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/50', text: 'text-blue-300' },
  epic: { bg: 'from-purple-500/20 to-purple-600/20', border: 'border-purple-500/50', text: 'text-purple-300' },
  legendary: { bg: 'from-yellow-500/20 to-yellow-600/20', border: 'border-yellow-500/50', text: 'text-yellow-300' },
};

export const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({
  achievement,
  xpEarned,
  coinsEarned,
  onDismiss,
  onShare,
  onPlaySound,
}) => {
  useEffect(() => {
    onPlaySound?.('achievement');
  }, [onPlaySound]);

  const rarityColors = RARITY_COLORS[achievement.rarity] || RARITY_COLORS.common;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDismiss}
    >
      {/* Celebration Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none text-2xl"
          initial={{
            opacity: 1,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            opacity: 0,
            y: Math.random() > 0.5 ? -100 : window.innerHeight + 100,
          }}
          transition={{
            duration: 2 + Math.random(),
            ease: 'easeInOut',
            delay: Math.random() * 0.3,
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* Modal */}
      <motion.div
        className={`bg-gradient-to-br ${rarityColors.bg} border-2 ${rarityColors.border} rounded-2xl shadow-2xl max-w-md w-full overflow-hidden`}
        initial={{ scale: 0.5, y: 50, rotate: -10 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        exit={{ scale: 0.5, y: 50, rotate: 10 }}
        transition={{ type: 'spring', damping: 10, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-center space-y-6">
          {/* Title */}
          <motion.h2
            className="text-2xl font-black text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Achievement Unlocked!
          </motion.h2>

          {/* Icon */}
          <motion.div
            className="text-9xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', damping: 5 }}
          >
            {achievement.iconUrl || '🏆'}
          </motion.div>

          {/* Achievement Name and Description */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">{achievement.name}</h3>
            <p className="text-sm text-white/80">{achievement.description}</p>
          </div>

          {/* Rarity Badge */}
          <motion.div
            className={`inline-block px-4 py-2 rounded-full font-bold uppercase text-sm ${rarityColors.text}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {achievement.rarity}
          </motion.div>

          {/* Rewards */}
          <motion.div
            className="bg-white/10 border border-white/20 rounded-lg p-4 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs text-white/70 uppercase tracking-widest font-semibold mb-3">
              Rewards Earned
            </p>
            <div className="flex items-center justify-between">
              <span className="text-white/80">XP Bonus</span>
              <motion.span
                className="text-lg font-bold text-yellow-300"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ delay: 0.7 }}
              >
                +{xpEarned}
              </motion.span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Coins</span>
              <motion.span
                className="text-lg font-bold text-amber-300"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ delay: 0.8 }}
              >
                +{coinsEarned} 🪙
              </motion.span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="space-y-2 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Button onClick={onDismiss} className="w-full font-bold py-6">
              Awesome! 🎉
            </Button>

            {onShare && (
              <Button
                onClick={onShare}
                variant="secondary"
                className="w-full font-bold py-6 flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share with Class
              </Button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
