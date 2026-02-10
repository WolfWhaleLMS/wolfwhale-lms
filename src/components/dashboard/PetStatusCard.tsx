'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, Brain, Shield, Utensils, Gamepad2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { MockPetData, MockXPData } from '@/lib/mock-data';

interface PetStatusCardProps {
  variant: 'k5' | '612';
  petData: MockPetData;
  xpData: MockXPData;
}

/* ── K-5 Large Pet Card ─────────────────────────────── */

function K5PetStatusCard({ petData, xpData }: { petData: MockPetData; xpData: MockXPData }) {
  const stats = [
    { label: 'Happiness', value: petData.happiness, icon: Heart, color: 'from-pink-400 to-rose-500', variant: 'happiness' as const },
    { label: 'Energy', value: petData.energy, icon: Zap, color: 'from-blue-400 to-cyan-500', variant: 'energy' as const },
    { label: 'Knowledge', value: petData.knowledge, icon: Brain, color: 'from-purple-400 to-violet-500', variant: 'knowledge' as const },
    { label: 'Health', value: petData.health, icon: Shield, color: 'from-green-400 to-emerald-500', variant: 'health' as const },
  ];

  return (
    <Card variant="pet" className="overflow-hidden">
      <CardContent className="p-0">
        {/* Top: Pet Display */}
        <div className="relative bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 dark:from-amber-900/40 dark:via-orange-900/30 dark:to-yellow-900/40 p-6 pb-4">
          {/* Floating sparkles */}
          <motion.div
            animate={{ y: [-5, 5, -5], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-3 right-4 text-2xl opacity-60"
          >
            <Sparkles className="w-6 h-6 text-amber-400" />
          </motion.div>
          <motion.div
            animate={{ y: [5, -5, 5], rotate: [0, -10, 10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute top-8 left-6 text-lg opacity-40"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </motion.div>

          <div className="text-center">
            {/* Pet Image/Emoji */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-7xl mb-2 drop-shadow-lg"
            >
              {petData.emoji}
            </motion.div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {petData.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              {petData.species}
            </p>
            <Badge variant="level" size="sm" className="capitalize">
              {petData.stage}
            </Badge>
          </div>

          {/* XP Counter */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-lg font-bold text-amber-700 dark:text-amber-300">
              {xpData.totalXP.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* Bottom: Stats and Actions */}
        <div className="p-5 space-y-4">
          {/* Health Bars */}
          <div className="space-y-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={cn('flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br', stat.color)}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{stat.label}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{stat.value}%</span>
                  </div>
                  <Progress value={stat.value} variant={stat.variant} className="h-3 rounded-full" />
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white rounded-2xl shadow-lg"
              >
                <Utensils className="w-5 h-5 mr-2" />
                Feed
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white rounded-2xl shadow-lg"
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                Play
              </Button>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── 6-12 Compact Pet Card ──────────────────────────── */

function SecondaryPetStatusCard({ petData, xpData }: { petData: MockPetData; xpData: MockXPData }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Pet Avatar */}
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center text-4xl shadow-sm"
          >
            {petData.emoji}
          </motion.div>

          {/* Pet Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-slate-900 dark:text-white truncate">{petData.name}</h4>
              <Badge variant="level" size="sm" className="capitalize text-[10px]">
                {petData.stage}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{petData.species}</p>

            {/* Mini Stat Bars */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <div className="flex items-center gap-1.5">
                <Heart className="w-3 h-3 text-pink-500" />
                <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500" style={{ width: `${petData.happiness}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-blue-500" />
                <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-500" style={{ width: `${petData.energy}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Brain className="w-3 h-3 text-purple-500" />
                <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-purple-400 to-violet-500" style={{ width: `${petData.knowledge}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-green-500" />
                <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: `${petData.health}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <div className="flex-shrink-0">
            <Button
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl"
            >
              Visit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Main Export ─────────────────────────────────────── */

export function PetStatusCard({ variant, petData, xpData }: PetStatusCardProps) {
  if (variant === 'k5') {
    return <K5PetStatusCard petData={petData} xpData={xpData} />;
  }
  return <SecondaryPetStatusCard petData={petData} xpData={xpData} />;
}
