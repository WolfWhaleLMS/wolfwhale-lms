'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Pet, PetStage } from '@/types/gamification.types';

interface PetDisplayProps {
  pet: Pet;
  onClick?: () => void;
  interactive?: boolean;
}

const STAGE_SIZES: Record<PetStage, { emoji: string; size: number }> = {
  hatchling: { emoji: '🥚', size: 80 },
  juvenile: { emoji: '🐺', size: 120 },
  adolescent: { emoji: '🐺', size: 160 },
  majestic: { emoji: '🐺', size: 200 },
};

const SPECIES_COLORS: Record<string, { bg: string; glow: string }> = {
  wolf: {
    bg: 'bg-gradient-to-b from-slate-900 via-slate-700 to-slate-900',
    glow: 'shadow-xl shadow-slate-500/50',
  },
  whale: {
    bg: 'bg-gradient-to-b from-cyan-900 via-blue-900 to-slate-900',
    glow: 'shadow-xl shadow-cyan-500/50',
  },
  hybrid: {
    bg: 'bg-gradient-to-b from-purple-900 via-blue-900 to-slate-900',
    glow: 'shadow-xl shadow-purple-500/50',
  },
};

const getHappinessEmoji = (happiness: number): string => {
  if (happiness >= 80) return '✨';
  if (happiness >= 60) return '😊';
  if (happiness >= 40) return '😐';
  return '😢';
};

const getEnergyAnimation = (energy: number): number => {
  // Higher energy = faster bounce
  return Math.max(0.5, energy / 100);
};

export const PetDisplay: React.FC<PetDisplayProps> = ({
  pet,
  onClick,
  interactive = true,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const stageData = STAGE_SIZES[pet.stage];
  const colors = SPECIES_COLORS[pet.species] || SPECIES_COLORS.wolf;
  const energyMultiplier = getEnergyAnimation(pet.energy);
  const happinessEmoji = getHappinessEmoji(pet.happiness);

  const handleClick = () => {
    if (!interactive) return;

    setIsClicked(true);

    // Create heart particles
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.cos((i / 8) * Math.PI * 2) * 30,
      y: Math.sin((i / 8) * Math.PI * 2) * 30,
    }));

    setParticles(newParticles);

    // Clean up particles
    setTimeout(() => {
      setParticles([]);
      setIsClicked(false);
    }, 1000);

    onClick?.();
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-full gap-4 p-8 rounded-2xl ${colors.bg} ${colors.glow}`}
    >
      {/* Pet Container */}
      <motion.div
        className="relative cursor-pointer select-none"
        onClick={handleClick}
        animate={
          isClicked
            ? { scale: 1.2 }
            : {
                y: [0, -10, 0],
              }
        }
        transition={{
          duration: isClicked ? 0.3 : 1.5 / energyMultiplier,
          repeat: isClicked ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Pet Stage/Health Aura */}
        {pet.stage === 'majestic' && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 blur-xl opacity-30"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Pet Body */}
        <div
          className="text-center transition-transform"
          style={{
            fontSize: `${stageData.size}px`,
            filter:
              pet.health < 30
                ? 'grayscale(50%) brightness(0.9)'
                : pet.happiness >= 80
                  ? 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))'
                  : 'drop-shadow(0 0 10px rgba(100, 150, 200, 0.3))',
          }}
        >
          {stageData.emoji}
        </div>

        {/* Happiness Indicator */}
        <motion.div
          className="absolute -top-4 -right-4 text-2xl"
          animate={pet.happiness >= 80 ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          {happinessEmoji}
        </motion.div>

        {/* Energy Indicator (if low) */}
        {pet.energy < 30 && (
          <motion.div
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-2xl"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            😴
          </motion.div>
        )}

        {/* Equipped Items Display */}
        {pet.equippedItems.length > 0 && (
          <div className="absolute -left-8 top-0 flex gap-2">
            {pet.equippedItems.slice(0, 3).map((item) => (
              <motion.div
                key={item}
                className="text-lg bg-white/20 backdrop-blur-sm rounded-full p-1 border border-white/30"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1, delay: Math.random() * 0.5 }}
              >
                {item === 'hat' && '👑'}
                {item === 'scarf' && '🧣'}
                {item === 'wings' && '✨'}
              </motion.div>
            ))}
          </div>
        )}

        {/* Click Particles */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute text-2xl pointer-events-none"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: particle.x * 50,
                y: particle.y * 50,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              ❤️
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pet Name and Info */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white drop-shadow-lg">{pet.name}</h3>
        <p className="text-sm text-white/70 capitalize">
          {pet.species} - {pet.stage}
        </p>
      </div>

      {/* Stage Evolution Indicator */}
      <div className="flex gap-1">
        {['hatchling', 'juvenile', 'adolescent', 'majestic'].map((stage) => (
          <motion.div
            key={stage}
            className={`h-3 rounded-full transition-all ${
              stage === pet.stage
                ? 'w-8 bg-gradient-to-r from-yellow-400 to-orange-400'
                : stage === 'hatchling' ||
                    stage === 'juvenile' ||
                    (pet.stage === 'adolescent' && stage !== 'majestic')
                  ? 'w-3 bg-white/40'
                  : 'w-3 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
