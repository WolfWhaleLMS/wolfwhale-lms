'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, Brain, HeartPulse, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface PetData {
  name: string;
  species: string;
  speciesLabel: string;
  stage: string;
  stageLabel: string;
  happiness: number;
  energy: number;
  knowledge: number;
  health: number;
  totalXP: number;
  emoji: string;
}

interface PetViewReadOnlyProps {
  pet: PetData;
  compact?: boolean;
  className?: string;
}

const STAGE_ORDER = ['hatchling', 'juvenile', 'adolescent', 'majestic'];

function getStatColor(value: number): string {
  if (value >= 70) return 'text-emerald-600 dark:text-emerald-400';
  if (value >= 40) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function getStatVariant(stat: string): 'happiness' | 'energy' | 'knowledge' | 'health' {
  switch (stat) {
    case 'happiness': return 'happiness';
    case 'energy': return 'energy';
    case 'knowledge': return 'knowledge';
    case 'health': return 'health';
    default: return 'health';
  }
}

export function PetViewReadOnly({ pet, compact = false, className }: PetViewReadOnlyProps) {
  const currentStageIndex = STAGE_ORDER.indexOf(pet.stage);

  const stats = [
    { key: 'happiness', label: 'Happiness', value: pet.happiness, icon: <Heart className="w-4 h-4" /> },
    { key: 'energy', label: 'Energy', value: pet.energy, icon: <Zap className="w-4 h-4" /> },
    { key: 'knowledge', label: 'Knowledge', value: pet.knowledge, icon: <Brain className="w-4 h-4" /> },
    { key: 'health', label: 'Health', value: pet.health, icon: <HeartPulse className="w-4 h-4" /> },
  ];

  if (compact) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="text-3xl flex-shrink-0"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {pet.emoji}
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                  {pet.name}
                </p>
                <Badge variant="secondary" size="sm">{pet.stageLabel}</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                {pet.speciesLabel}
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {stats.map((stat) => (
                  <div key={stat.key} className="text-center">
                    <div className={cn('text-xs mb-0.5', getStatColor(stat.value))}>{stat.icon}</div>
                    <p className={cn('text-xs font-bold', getStatColor(stat.value))}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <Badge className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" size="sm">
                <Eye className="w-3 h-3 mr-1" />
                View Only
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{pet.name}'s Status</span>
          <Badge className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" size="sm">
            <Eye className="w-3 h-3 mr-1" />
            View Only
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Pet display */}
        <div className="text-center">
          <motion.div
            className="text-6xl mb-3 inline-block"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {pet.emoji}
          </motion.div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{pet.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {pet.speciesLabel} &middot; {pet.stageLabel}
          </p>
        </div>

        {/* Evolution progress */}
        <div className="flex justify-center gap-1.5">
          {STAGE_ORDER.map((stage, idx) => (
            <div
              key={stage}
              className={cn(
                'h-2 rounded-full transition-all',
                idx === currentStageIndex
                  ? 'w-10 bg-gradient-to-r from-amber-400 to-orange-400'
                  : idx < currentStageIndex
                    ? 'w-4 bg-emerald-400/60'
                    : 'w-4 bg-slate-300 dark:bg-slate-600'
              )}
            />
          ))}
        </div>

        {/* Stats bars */}
        <div className="space-y-3">
          {stats.map((stat) => (
            <div key={stat.key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div className={getStatColor(stat.value)}>{stat.icon}</div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{stat.label}</span>
                </div>
                <span className={cn('text-sm font-bold', getStatColor(stat.value))}>{stat.value}/100</span>
              </div>
              <Progress value={stat.value} variant={getStatVariant(stat.key)} className="h-2" />
            </div>
          ))}
        </div>

        {/* Total XP */}
        <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Pet XP</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{pet.totalXP.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
