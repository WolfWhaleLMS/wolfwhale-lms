'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Pet, PetStage } from '@/types/gamification.types';

interface PetEvolutionProps {
  pet: Pet;
}

const STAGES: PetStage[] = ['hatchling', 'juvenile', 'adolescent', 'majestic'];
const STAGE_NAMES: Record<PetStage, string> = {
  hatchling: 'Hatchling',
  juvenile: 'Juvenile',
  adolescent: 'Adolescent',
  majestic: 'Majestic',
};

const STAGE_EMOJIS: Record<PetStage, string> = {
  hatchling: '🥚',
  juvenile: '🐺',
  adolescent: '🐺',
  majestic: '👑',
};

const STAGE_DESCRIPTIONS: Record<PetStage, string> = {
  hatchling: 'Just hatched! Full of potential',
  juvenile: 'Growing stronger every day',
  adolescent: 'Maturing with knowledge',
  majestic: 'Fully evolved and legendary',
};

export const PetEvolution: React.FC<PetEvolutionProps> = ({ pet }) => {
  const currentStageIndex = STAGES.indexOf(pet.stage);
  const nextStageIndex = Math.min(currentStageIndex + 1, STAGES.length - 1);

  // Calculate XP progress to next stage
  // This would typically come from the database
  // For now, we'll simulate progress based on pet.totalXP
  const xpProgressPercent = Math.min(100, ((pet.totalXP % 1000) / 1000) * 100);

  return (
    <div className="space-y-6">
      {/* Current Stage Display */}
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-white/70 uppercase tracking-widest font-medium">Current Stage</p>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2 mt-1">
              <span>{STAGE_EMOJIS[pet.stage]}</span>
              {STAGE_NAMES[pet.stage]}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/70">Progress</p>
            <p className="text-xl font-bold text-amber-300">{Math.floor(xpProgressPercent)}%</p>
          </div>
        </div>
        <p className="text-sm text-white/80">{STAGE_DESCRIPTIONS[pet.stage]}</p>
      </div>

      {/* Evolution Timeline */}
      <div>
        <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-3">Evolution Timeline</p>
        <div className="space-y-3">
          {STAGES.map((stage, index) => {
            const isActive = index === currentStageIndex;
            const isPassed = index < currentStageIndex;
            const isNext = index === nextStageIndex;

            return (
              <div key={stage} className="flex items-center gap-3">
                {/* Stage Indicator */}
                <motion.div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-orange-400 shadow-lg shadow-amber-400/50 ring-2 ring-amber-300'
                      : isPassed
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-white/10 border border-white/30'
                  }`}
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {STAGE_EMOJIS[stage as PetStage]}
                </motion.div>

                {/* Stage Info */}
                <div className="flex-1">
                  <p className="font-semibold text-white">{STAGE_NAMES[stage as PetStage]}</p>
                  <p className="text-xs text-white/60">{STAGE_DESCRIPTIONS[stage as PetStage]}</p>
                </div>

                {/* Status Badge */}
                {isPassed && (
                  <div className="px-2 py-1 bg-green-500/20 border border-green-500/50 rounded text-xs font-medium text-green-300">
                    Complete
                  </div>
                )}
                {isActive && (
                  <div className="px-2 py-1 bg-amber-500/20 border border-amber-500/50 rounded text-xs font-medium text-amber-300 animate-pulse">
                    Current
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress to Next Stage */}
      {currentStageIndex < STAGES.length - 1 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-white">
              To {STAGE_NAMES[STAGES[nextStageIndex] as PetStage]}
            </p>
            <p className="text-xs text-white/60">{Math.floor(xpProgressPercent)}% complete</p>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-white/60 mt-2">
            Keep playing and earning XP to help {pet.name} evolve!
          </p>
        </div>
      )}

      {currentStageIndex === STAGES.length - 1 && (
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-4 text-center">
          <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
            🎉 Fully Evolved!
          </p>
          <p className="text-sm text-white/70 mt-1">{pet.name} has reached their ultimate form!</p>
        </div>
      )}
    </div>
  );
};
