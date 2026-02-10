'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Gamepad2, Sparkles, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PetDisplay } from './PetDisplay';
import { PetStats } from './PetStats';
import { SPECIES_VISUALS, FAMILY_CONFIG } from '@/lib/pet-visuals';
import type { PetSpecies, PetStage } from '@/types/database.types';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface PetCardCompactProps {
  name: string;
  species: PetSpecies;
  stage: PetStage;
  happiness: number;
  energy: number;
  knowledge: number;
  health: number;
  totalXP: number;
  level?: number;
  onFeed?: () => void;
  onPlay?: () => void;
  onViewPet?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component - 6-12 Compact Informational Card                        */
/* ------------------------------------------------------------------ */

export const PetCardCompact: React.FC<PetCardCompactProps> = ({
  name,
  species,
  stage,
  happiness,
  energy,
  knowledge,
  health,
  totalXP,
  level = 5,
  onFeed,
  onPlay,
  onViewPet,
}) => {
  const speciesVis = SPECIES_VISUALS[species];
  const familyCfg = FAMILY_CONFIG[speciesVis.family];
  const [floatingEmoji, setFloatingEmoji] = useState<string | null>(null);

  const quickAction = (label: string, callback?: () => void) => {
    setFloatingEmoji(label);
    setTimeout(() => setFloatingEmoji(null), 1000);
    callback?.();
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Pet Visual - Small */}
          <div className="relative flex-shrink-0">
            <PetDisplay
              species={species}
              stage={stage}
              name={name}
              happiness={happiness}
              energy={energy}
              size="sm"
              showName={false}
              showStage={false}
              interactive={false}
            />

            {/* Floating action feedback */}
            <AnimatePresence>
              {floatingEmoji && (
                <motion.div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-green-500 pointer-events-none whitespace-nowrap z-20"
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: -24, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {floatingEmoji}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info column */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">
                {name}
              </h4>
              <Badge variant="level" size="sm">
                Lv.{level}
              </Badge>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-semibold ${familyCfg.color}`}>
                {speciesVis.label}
              </span>
              <span className="text-slate-400 text-[10px]">|</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                {stage}
              </span>
              <span className="text-slate-400 text-[10px]">|</span>
              <span className="text-[10px] text-gold-600 dark:text-gold-300 font-semibold flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                {totalXP.toLocaleString()}
              </span>
            </div>

            {/* Compact stats */}
            <PetStats
              happiness={happiness}
              energy={energy}
              knowledge={knowledge}
              health={health}
              animate={false}
              compact={true}
            />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            <Button
              size="icon"
              onClick={() => quickAction('+10 ❤️', onFeed)}
              className="h-8 w-8 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-600 dark:text-amber-400 border border-amber-400/30"
              title="Feed"
            >
              <Apple className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              onClick={() => quickAction('+15 ⚡', onPlay)}
              className="h-8 w-8 rounded-xl bg-pink-500/20 hover:bg-pink-500/40 text-pink-600 dark:text-pink-400 border border-pink-400/30"
              title="Play"
            >
              <Gamepad2 className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              onClick={onViewPet}
              className="h-8 w-8 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-600 dark:text-indigo-400 border border-indigo-400/30"
              title="View Profile"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
