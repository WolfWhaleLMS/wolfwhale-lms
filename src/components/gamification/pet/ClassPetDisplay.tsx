'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users } from 'lucide-react';
import { Progress } from '@/components/ui/Progress';
import type { Pet } from '@/types/gamification.types';

interface ClassPetDisplayProps {
  classPet: Pet;
  contributionPercent: number;
  classGoal: number;
  currentProgress: number;
  topContributors: Array<{
    id: string;
    name: string;
    contribution: number;
  }>;
}

export const ClassPetDisplay: React.FC<ClassPetDisplayProps> = ({
  classPet,
  contributionPercent,
  classGoal,
  currentProgress,
  topContributors,
}) => {
  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
      {/* Pet Header */}
      <div className="flex items-center gap-4 mb-6">
        {/* Pet Visual */}
        <motion.div
          className="text-5xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {classPet.species === 'whale' ? '🐋' : '🐺'}
        </motion.div>

        {/* Pet Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">{classPet.name}</h3>
          <p className="text-sm text-white/70 capitalize">
            Class {classPet.species} - {classPet.stage}
          </p>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1 text-sm">
              <span className="text-2xl">❤️</span>
              <span className="text-white/80">{classPet.happiness}/100</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-2xl">⚡</span>
              <span className="text-white/80">{classPet.energy}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Class Goal Progress */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-white text-sm">Class Goal</span>
            </div>
            <span className="text-sm font-bold text-amber-300">
              {Math.floor(((currentProgress / classGoal) * 100))}%
            </span>
          </div>
          <Progress
            value={Math.min(100, (currentProgress / classGoal) * 100)}
            variant="xp"
          />
        </div>

        <div className="text-xs text-white/60 text-center">
          {currentProgress.toLocaleString()} / {classGoal.toLocaleString()} XP
        </div>
      </div>

      {/* Contribution Breakdown */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-blue-400" />
          <h4 className="font-semibold text-white text-sm">Top Contributors</h4>
        </div>

        <div className="space-y-2">
          {topContributors.slice(0, 5).map((contributor, index) => (
            <motion.div
              key={contributor.id}
              className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 w-4">
                  {index + 1}
                </span>
                <span className="text-sm text-white/80 truncate">
                  {contributor.name}
                </span>
              </div>
              <span className="text-xs font-bold text-blue-300">
                +{contributor.contribution}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Encouragement Message */}
      <motion.div
        className="mt-6 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg text-center"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <p className="text-xs text-white/80">
          Keep contributing! {classPet.name} is counting on you 💪
        </p>
      </motion.div>
    </div>
  );
};
