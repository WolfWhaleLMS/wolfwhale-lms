'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Gamepad2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PetDisplay } from './PetDisplay';
import { PetStats } from './PetStats';
import { SPECIES_VISUALS } from '@/lib/pet-visuals';
import type { PetSpecies, PetStage } from '@/types/database.types';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface PetCardLargeProps {
  name: string;
  species: PetSpecies;
  stage: PetStage;
  happiness: number;
  energy: number;
  knowledge: number;
  health: number;
  totalXP: number;
  onFeed?: () => void;
  onPlay?: () => void;
  onViewPet?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component - K-5 Large Interactive Card                             */
/* ------------------------------------------------------------------ */

export const PetCardLarge: React.FC<PetCardLargeProps> = ({
  name,
  species,
  stage,
  happiness,
  energy,
  knowledge,
  health,
  totalXP,
  onFeed,
  onPlay,
  onViewPet,
}) => {
  const speciesVis = SPECIES_VISUALS[species];
  const [feedAnim, setFeedAnim] = useState(false);
  const [playAnim, setPlayAnim] = useState(false);
  const [floatingEmoji, setFloatingEmoji] = useState<string | null>(null);

  const triggerFeed = () => {
    setFeedAnim(true);
    setFloatingEmoji('+10 ❤️');
    setTimeout(() => {
      setFeedAnim(false);
      setFloatingEmoji(null);
    }, 1200);
    onFeed?.();
  };

  const triggerPlay = () => {
    setPlayAnim(true);
    setFloatingEmoji('+15 ⚡');
    setTimeout(() => {
      setPlayAnim(false);
      setFloatingEmoji(null);
    }, 1200);
    onPlay?.();
  };

  return (
    <Card variant="pet" className="overflow-hidden">
      <CardContent className="p-0">
        {/* Background gradient & decorative blobs */}
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-br ${speciesVis.bgGradient} opacity-10`} />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-300/10 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-300/10 to-transparent rounded-full blur-2xl" />

          <div className="relative p-6 space-y-5">
            {/* Pet Visual */}
            <div className="flex justify-center relative">
              <motion.div
                animate={
                  feedAnim
                    ? { scale: [1, 1.15, 1], rotate: [0, -3, 3, 0] }
                    : playAnim
                      ? { y: [0, -20, 0], scale: [1, 1.1, 1] }
                      : {}
                }
                transition={{ duration: 0.6 }}
              >
                <PetDisplay
                  species={species}
                  stage={stage}
                  name={name}
                  happiness={happiness}
                  energy={energy}
                  size="md"
                  showName={true}
                  showStage={true}
                />
              </motion.div>

              {/* Floating action result */}
              <AnimatePresence>
                {floatingEmoji && (
                  <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 text-lg font-bold text-green-500 dark:text-green-400 pointer-events-none z-30"
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: -50, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    {floatingEmoji}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stats */}
            <PetStats
              happiness={happiness}
              energy={energy}
              knowledge={knowledge}
              health={health}
              animate={false}
              compact={false}
            />

            {/* XP display */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-600 dark:text-gold-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                {totalXP.toLocaleString()} XP
              </span>
            </div>

            {/* Action Buttons - Large & Kid-Friendly */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={triggerFeed}
                className="h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/30 text-base font-bold"
              >
                <Apple className="w-5 h-5 mr-2" />
                Feed
              </Button>
              <Button
                onClick={triggerPlay}
                className="h-14 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/30 text-base font-bold"
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                Play
              </Button>
            </div>

            {/* View Full Profile */}
            <Button
              onClick={onViewPet}
              variant="ghost"
              className="w-full text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              View {name}&apos;s full profile &rarr;
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
