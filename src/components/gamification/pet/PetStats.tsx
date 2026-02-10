'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, Brain, HeartPulse } from 'lucide-react';
import { Progress } from '@/components/ui/Progress';
import type { Pet } from '@/types/gamification.types';

interface PetStatsProps {
  pet: Pet;
}

interface StatConfig {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant: 'happiness' | 'energy' | 'knowledge' | 'health';
  color: string;
}

export const PetStats: React.FC<PetStatsProps> = ({ pet }) => {
  const stats: StatConfig[] = [
    {
      label: 'Happiness',
      value: pet.happiness,
      icon: <Heart className="w-5 h-5" />,
      variant: 'happiness',
      color: 'text-pink-500',
    },
    {
      label: 'Energy',
      value: pet.energy,
      icon: <Zap className="w-5 h-5" />,
      variant: 'energy',
      color: 'text-blue-500',
    },
    {
      label: 'Knowledge',
      value: pet.knowledge,
      icon: <Brain className="w-5 h-5" />,
      variant: 'knowledge',
      color: 'text-purple-500',
    },
    {
      label: 'Health',
      value: pet.health,
      icon: <HeartPulse className="w-5 h-5" />,
      variant: 'health',
      color: 'text-green-500',
    },
  ];

  return (
    <div className="space-y-4">
      {stats.map((stat) => {
        const isLow = stat.value < 30;
        const displayValue = Math.min(100, Math.max(0, stat.value));

        return (
          <motion.div
            key={stat.label}
            className={`rounded-xl backdrop-blur-sm border transition-all ${
              isLow
                ? 'bg-red-500/10 border-red-500/30 shadow-lg shadow-red-500/20'
                : 'bg-white/10 border-white/20'
            } p-4`}
            animate={isLow ? { boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.3)', '0 0 0 10px rgba(239, 68, 68, 0)'] } : {}}
            transition={{
              duration: 1.5,
              repeat: isLow ? Infinity : 0,
              ease: 'easeOut',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={stat.color}>{stat.icon}</div>
                <span className="text-sm font-semibold text-white">{stat.label}</span>
              </div>
              <span className="text-lg font-bold text-white">{displayValue}/100</span>
            </div>

            <Progress value={displayValue} variant={stat.variant} />

            {isLow && (
              <p className="text-xs text-red-400 mt-2 font-medium">Critical - needs attention!</p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
