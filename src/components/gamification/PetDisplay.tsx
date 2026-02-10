'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPECIES_VISUALS, STAGE_VISUALS, FAMILY_CONFIG } from '@/lib/pet-visuals';
import type { PetSpecies, PetStage } from '@/types/database.types';
import { Badge } from '@/components/ui/Badge';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface PetDisplayProps {
  species: PetSpecies;
  stage: PetStage;
  name: string;
  happiness?: number;
  energy?: number;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  showName?: boolean;
  showStage?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Size Config                                                        */
/* ------------------------------------------------------------------ */

const SIZE_MAP = {
  sm: { emoji: 40, container: 'w-20 h-20', nameSize: 'text-sm', particleCount: 4 },
  md: { emoji: 72, container: 'w-36 h-36', nameSize: 'text-xl', particleCount: 6 },
  lg: { emoji: 110, container: 'w-52 h-52', nameSize: 'text-3xl', particleCount: 8 },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const PetDisplay: React.FC<PetDisplayProps> = ({
  species,
  stage,
  name,
  happiness = 75,
  energy = 60,
  interactive = true,
  size = 'lg',
  onClick,
  showName = true,
  showStage = true,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  const speciesVis = SPECIES_VISUALS[species];
  const stageVis = STAGE_VISUALS[stage];
  const familyCfg = FAMILY_CONFIG[speciesVis.family];
  const sizeConfig = SIZE_MAP[size];

  // Override emoji size based on stage proportional to requested size
  const scaledEmojiSize = Math.round(
    sizeConfig.emoji * (stageVis.emojiSize / STAGE_VISUALS.juvenile.emojiSize)
  );

  // Happiness-driven emoji
  const happinessIndicator =
    happiness >= 80 ? '✨' : happiness >= 60 ? '😊' : happiness >= 40 ? '😐' : '😢';

  // Energy-driven animation speed
  const bounceDuration = Math.max(1.2, 3 - (energy / 100) * 1.5);

  const handleClick = () => {
    if (!interactive) return;
    setIsClicked(true);

    const heartEmojis = ['❤️', '💖', '💕', '🧡', '💛', '💚', '💙', '💜'];
    const newParticles = Array.from({ length: sizeConfig.particleCount }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.cos((i / sizeConfig.particleCount) * Math.PI * 2) * 40,
      y: Math.sin((i / sizeConfig.particleCount) * Math.PI * 2) * 40,
      emoji: heartEmojis[i % heartEmojis.length],
    }));
    setParticles(newParticles);

    setTimeout(() => {
      setParticles([]);
      setIsClicked(false);
    }, 900);

    onClick?.();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Pet Container with background */}
      <div
        className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${speciesVis.bgGradient} shadow-2xl ${speciesVis.glowColor}`}
        style={{ width: scaledEmojiSize * 1.8, height: scaledEmojiSize * 1.8 }}
      >
        {/* Majestic aura glow */}
        {stage === 'majestic' && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/30 via-orange-400/30 to-yellow-400/30 blur-xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Adolescent shimmer ring */}
        {(stage === 'adolescent' || stage === 'majestic') && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Main emoji */}
        <motion.div
          className="relative cursor-pointer select-none z-10"
          onClick={handleClick}
          animate={
            isClicked
              ? { scale: [1, 1.3, 1], rotate: [0, -5, 5, 0] }
              : { y: [0, -8, 0] }
          }
          transition={{
            duration: isClicked ? 0.4 : bounceDuration,
            repeat: isClicked ? 0 : Infinity,
            ease: 'easeInOut',
          }}
        >
          <span
            style={{
              fontSize: `${scaledEmojiSize}px`,
              lineHeight: 1,
              filter:
                happiness >= 80
                  ? 'drop-shadow(0 0 16px rgba(255, 215, 0, 0.5))'
                  : happiness < 30
                    ? 'grayscale(40%) brightness(0.85)'
                    : 'drop-shadow(0 0 8px rgba(100, 150, 255, 0.3))',
            }}
          >
            {speciesVis.emoji}
          </span>

          {/* Stage decorators */}
          {stageVis.decorators.filter(Boolean).map((deco, i) => (
            <motion.span
              key={i}
              className="absolute text-lg pointer-events-none"
              style={{
                top: `${-8 + i * 6}px`,
                right: `${-12 + i * 8}px`,
              }}
              animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            >
              {deco}
            </motion.span>
          ))}
        </motion.div>

        {/* Happiness indicator */}
        {interactive && (
          <motion.div
            className="absolute -top-2 -right-2 text-xl z-20"
            animate={happiness >= 80 ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            {happinessIndicator}
          </motion.div>
        )}

        {/* Low energy indicator */}
        {energy < 25 && (
          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xl z-20"
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            😴
          </motion.div>
        )}

        {/* Click particles */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute text-xl pointer-events-none z-30"
              style={{ left: '50%', top: '50%' }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: p.x * 2, y: p.y * 2, opacity: 0, scale: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              {p.emoji}
            </motion.span>
          ))}
        </AnimatePresence>

        {/* Orbiting accents for majestic/adolescent */}
        {(stage === 'majestic' || stage === 'adolescent') &&
          speciesVis.accents.slice(0, 2).map((accent, i) => (
            <motion.span
              key={`accent-${i}`}
              className="absolute text-sm pointer-events-none"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                transformOrigin: `${scaledEmojiSize * 0.9 * 0.6}px 0px`,
                top: '50%',
                left: '50%',
              }}
            >
              {accent}
            </motion.span>
          ))}
      </div>

      {/* Pet Name */}
      {showName && (
        <motion.h3
          className={`${sizeConfig.nameSize} font-bold text-slate-900 dark:text-white text-center`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {name}
        </motion.h3>
      )}

      {/* Species & Stage badges */}
      {showStage && (
        <div className="flex items-center gap-2">
          <Badge
            className={`${familyCfg.bgColor} ${familyCfg.borderColor} ${familyCfg.color} border`}
          >
            {familyCfg.emoji} {speciesVis.label}
          </Badge>
          <Badge variant="level">
            {stage.charAt(0).toUpperCase() + stage.slice(1)}
          </Badge>
        </div>
      )}
    </div>
  );
};
