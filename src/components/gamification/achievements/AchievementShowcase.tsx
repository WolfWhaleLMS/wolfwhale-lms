'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AchievementBadge } from './AchievementBadge';
import type { Achievement } from '@/types/gamification.types';

interface AchievementShowcaseProps {
  achievements: Achievement[];
  earnedAchievementIds: Set<string>;
  displayedIds: string[];
  onUpdateDisplay?: (ids: string[]) => void;
}

export const AchievementShowcase: React.FC<AchievementShowcaseProps> = ({
  achievements,
  earnedAchievementIds,
  displayedIds,
  onUpdateDisplay,
}) => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [tempSelected, setTempSelected] = useState<Set<string>>(new Set(displayedIds));

  const earnedAchievements = achievements.filter((a) => earnedAchievementIds.has(a.id));
  const displayedAchievements = achievements.filter((a) => displayedIds.includes(a.id));

  const handleToggleSelection = (achievementId: string) => {
    const newSelection = new Set(tempSelected);
    if (newSelection.has(achievementId)) {
      newSelection.delete(achievementId);
    } else {
      if (newSelection.size < 5) {
        // Limit to 5 displayed
        newSelection.add(achievementId);
      }
    }
    setTempSelected(newSelection);
  };

  const handleSaveCustomization = () => {
    onUpdateDisplay?.(Array.from(tempSelected));
    setIsCustomizing(false);
  };

  const handleCancel = () => {
    setTempSelected(new Set(displayedIds));
    setIsCustomizing(false);
  };

  return (
    <div className="space-y-4">
      {/* Showcase Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Featured Achievements</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Customize
          </Button>
        </div>

        {!isCustomizing ? (
          <motion.div
            className="grid grid-cols-3 md:grid-cols-5 gap-3"
            layout
          >
            <AnimatePresence>
              {displayedAchievements.length > 0 ? (
                displayedAchievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <AchievementBadge
                      achievement={achievement}
                      isEarned={true}
                      size="lg"
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-white/60">No achievements selected for display</p>
                  <p className="text-white/40 text-sm mt-1">
                    Click "Customize" to select your favorite achievements
                  </p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Customization Mode */
          <motion.div
            className="bg-white/10 border border-white/20 rounded-lg p-6 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="space-y-2">
              <p className="text-sm font-semibold text-white">
                Select up to 5 achievements to display
              </p>
              <p className="text-xs text-white/60">
                Selected: {tempSelected.size} / 5
              </p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {earnedAchievements.map((achievement) => {
                const isSelected = tempSelected.has(achievement.id);
                const canSelect = isSelected || tempSelected.size < 5;

                return (
                  <motion.button
                    key={achievement.id}
                    onClick={() => canSelect && handleToggleSelection(achievement.id)}
                    className={`relative transition-all ${!canSelect && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    whileHover={canSelect ? { scale: 1.05 } : {}}
                    whileTap={canSelect ? { scale: 0.95 } : {}}
                  >
                    <AchievementBadge
                      achievement={achievement}
                      isEarned={true}
                      size="sm"
                    />

                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 border-4 border-yellow-400 rounded-2xl"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 8 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {earnedAchievements.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white/60">No earned achievements yet</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-white/10">
              <Button
                onClick={handleSaveCustomization}
                className="flex-1"
              >
                Save Selection
              </Button>
              <Button
                onClick={handleCancel}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Stats */}
      <motion.div
        className="bg-white/5 border border-white/10 rounded-lg p-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/70">Earned</span>
          <span className="font-bold text-white">
            {earnedAchievementIds.size} / {achievements.length}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
