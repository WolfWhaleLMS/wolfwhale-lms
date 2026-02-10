'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  Heart,
  Zap,
  Brain,
  Plus,
  Apple,
  Gamepad2,
  BookOpen,
  Sparkles,
  Crown,
  Lock,
  ArrowUpRight,
} from 'lucide-react';
import { PetDisplay } from '@/components/gamification/PetDisplay';
import { PetStats } from '@/components/gamification/PetStats';
import { SPECIES_VISUALS, STAGE_VISUALS, FAMILY_CONFIG } from '@/lib/pet-visuals';
import {
  DEFAULT_MOCK_PET,
  loadPetFromStorage,
  savePetToStorage,
  getRandomEncouragement,
  type MockPetState,
} from '@/lib/mock-pet-data';
import { PET_STAGES } from '@/config/constants';
import type { PetStage } from '@/types/database.types';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STAGES_ORDERED: PetStage[] = ['hatchling', 'juvenile', 'adolescent', 'majestic'];

const COSMETIC_SLOTS = [
  { id: 'hat', label: 'Hat', emoji: '🎩' },
  { id: 'body', label: 'Body', emoji: '🧥' },
  { id: 'back', label: 'Back', emoji: '🎒' },
  { id: 'paw', label: 'Paw / Fin', emoji: '🐾' },
  { id: 'aura', label: 'Aura', emoji: '✨' },
];

const ACTIVITY_LOG = [
  { id: '1', action: 'You fed {name}', timestamp: '1 hour ago', impact: '+10 Happiness', emoji: '🍖' },
  { id: '2', action: 'You played with {name}', timestamp: '3 hours ago', impact: '+15 Energy', emoji: '🎮' },
  { id: '3', action: '{name} studied with you', timestamp: 'Yesterday', impact: '+20 Knowledge', emoji: '📚' },
  { id: '4', action: 'You let {name} rest', timestamp: '2 days ago', impact: '+5 Health', emoji: '😴' },
  { id: '5', action: '{name} leveled up!', timestamp: '3 days ago', impact: '+50 XP', emoji: '🎉' },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function PetPage() {
  const router = useRouter();
  const [pet, setPet] = useState<MockPetState | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Interaction animations
  const [feedAnim, setFeedAnim] = useState(false);
  const [playAnim, setPlayAnim] = useState(false);
  const [studyAnim, setStudyAnim] = useState(false);
  const [encouragement, setEncouragement] = useState<string | null>(null);
  const [floatingText, setFloatingText] = useState<string | null>(null);

  // Load pet from storage on mount
  useEffect(() => {
    const stored = loadPetFromStorage();
    if (stored) {
      setPet(stored);
    } else {
      // Use default mock pet if none saved
      setPet(DEFAULT_MOCK_PET);
    }
    setLoaded(true);
  }, []);

  // Helpers
  const showFloating = useCallback((text: string) => {
    setFloatingText(text);
    setTimeout(() => setFloatingText(null), 1500);
  }, []);

  const updatePet = useCallback(
    (updates: Partial<MockPetState>) => {
      if (!pet) return;
      const updated = {
        ...pet,
        ...updates,
        happiness: Math.min(100, Math.max(0, updates.happiness ?? pet.happiness)),
        energy: Math.min(100, Math.max(0, updates.energy ?? pet.energy)),
        knowledge: Math.min(100, Math.max(0, updates.knowledge ?? pet.knowledge)),
        health: Math.min(100, Math.max(0, updates.health ?? pet.health)),
      };
      setPet(updated);
      savePetToStorage(updated);
    },
    [pet]
  );

  // Interactions
  const handleFeed = useCallback(() => {
    if (!pet) return;
    setFeedAnim(true);
    showFloating('+10 Happiness, +5 Health');
    updatePet({ happiness: pet.happiness + 10, health: pet.health + 5 });
    setTimeout(() => setFeedAnim(false), 1200);
  }, [pet, updatePet, showFloating]);

  const handlePlay = useCallback(() => {
    if (!pet) return;
    setPlayAnim(true);
    showFloating('+15 Happiness, +10 Energy');
    updatePet({ happiness: pet.happiness + 15, energy: pet.energy + 10 });
    setTimeout(() => setPlayAnim(false), 1200);
  }, [pet, updatePet, showFloating]);

  const handleStudy = useCallback(() => {
    if (!pet) return;
    setStudyAnim(true);
    const msg = getRandomEncouragement(pet.name);
    setEncouragement(msg);
    showFloating('+5 Knowledge, +10 XP');
    updatePet({ knowledge: pet.knowledge + 5, totalXP: pet.totalXP + 10 });
    setTimeout(() => {
      setStudyAnim(false);
      setEncouragement(null);
    }, 3000);
  }, [pet, updatePet, showFloating]);

  // Loading state
  if (!loaded || !pet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950">
        <motion.div
          className="text-6xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🥚
        </motion.div>
      </div>
    );
  }

  // Derived values
  const speciesVis = SPECIES_VISUALS[pet.species];
  const familyCfg = FAMILY_CONFIG[speciesVis.family];
  const currentStageIdx = STAGES_ORDERED.indexOf(pet.stage);
  const nextStage = STAGES_ORDERED[Math.min(currentStageIdx + 1, STAGES_ORDERED.length - 1)];
  const currentStageXP = PET_STAGES[pet.stage].xpRequired;
  const nextStageXP = PET_STAGES[nextStage].xpRequired;
  const xpProgress =
    pet.stage === 'majestic'
      ? 100
      : Math.min(100, ((pet.totalXP - currentStageXP) / (nextStageXP - currentStageXP)) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ============================================ */}
        {/* HERO: Large Pet Display with Animations      */}
        {/* ============================================ */}
        <Card variant="pet" className="relative overflow-hidden">
          <CardContent className="p-0">
            {/* Decorative background */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-amber-300/10 to-transparent rounded-full blur-3xl"
                animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tl from-orange-300/10 to-transparent rounded-full blur-3xl"
                animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
            </div>

            <div className="relative p-8 sm:p-12 flex flex-col items-center space-y-6">
              {/* Pet Animation Container */}
              <motion.div
                animate={
                  feedAnim
                    ? { scale: [1, 1.15, 1], rotate: [0, -3, 3, 0] }
                    : playAnim
                      ? { y: [0, -25, 0], scale: [1, 1.1, 1] }
                      : studyAnim
                        ? { rotate: [0, -2, 2, -2, 0] }
                        : {}
                }
                transition={{ duration: 0.6 }}
              >
                <PetDisplay
                  species={pet.species}
                  stage={pet.stage}
                  name={pet.name}
                  happiness={pet.happiness}
                  energy={pet.energy}
                  size="lg"
                  showName={true}
                  showStage={true}
                  interactive={true}
                />
              </motion.div>

              {/* Floating interaction text */}
              <AnimatePresence>
                {floatingText && (
                  <motion.div
                    className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-green-500/20 border border-green-400/40 text-green-700 dark:text-green-300 text-sm font-bold z-20"
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: -40, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                  >
                    {floatingText}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Encouragement message */}
              <AnimatePresence>
                {encouragement && (
                  <motion.div
                    className="px-6 py-3 rounded-2xl bg-blue-500/10 border border-blue-400/30 text-blue-700 dark:text-blue-300 text-center max-w-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="text-sm font-medium">{encouragement}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Evolution Progress */}
              <div className="w-full max-w-md">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {pet.stage === 'majestic' ? 'Fully Evolved!' : `Progress to ${PET_STAGES[nextStage].label}`}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 text-xs">
                    {pet.totalXP.toLocaleString()} / {nextStageXP.toLocaleString()} XP
                  </span>
                </div>
                <Progress value={xpProgress} variant="xp" className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ============================================ */}
        {/* TABS: Stats | Evolution | Customize          */}
        {/* ============================================ */}
        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="evolution">Evolution</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
          </TabsList>

          {/* ---------- Stats Tab ---------- */}
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  {pet.name}&apos;s Stats
                </CardTitle>
                <CardDescription>
                  Keep all stats high to help {pet.name} thrive!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PetStats
                  happiness={pet.happiness}
                  energy={pet.energy}
                  knowledge={pet.knowledge}
                  health={pet.health}
                  animate={true}
                  compact={false}
                />

                {/* Stat Detail Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  <StatDetailCard
                    label="Happiness"
                    value={pet.happiness}
                    icon={<Heart className="w-4 h-4" />}
                    color="pink"
                    tip="Feed and play with your pet to boost happiness!"
                  />
                  <StatDetailCard
                    label="Energy"
                    value={pet.energy}
                    icon={<Zap className="w-4 h-4" />}
                    color="yellow"
                    tip="Playing and studying gives your pet more energy."
                  />
                  <StatDetailCard
                    label="Knowledge"
                    value={pet.knowledge}
                    icon={<Brain className="w-4 h-4" />}
                    color="blue"
                    tip="Complete lessons and study together to grow knowledge."
                  />
                  <StatDetailCard
                    label="Health"
                    value={pet.health}
                    icon={<Plus className="w-4 h-4" />}
                    color="green"
                    tip="Feed your pet regularly to keep health high."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------- Evolution Tab ---------- */}
          <TabsContent value="evolution">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-amber-500" />
                  Evolution Journey
                </CardTitle>
                <CardDescription>
                  Earn XP to help {pet.name} evolve through 4 stages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Evolution Timeline */}
                <div className="space-y-4">
                  {STAGES_ORDERED.map((stage, idx) => {
                    const stageInfo = PET_STAGES[stage];
                    const stageVis = STAGE_VISUALS[stage];
                    const isActive = stage === pet.stage;
                    const isPassed = idx < currentStageIdx;
                    const isFuture = idx > currentStageIdx;

                    return (
                      <motion.div
                        key={stage}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                          isActive
                            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-400 shadow-lg shadow-amber-400/20'
                            : isPassed
                              ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-800'
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        {/* Stage Emoji */}
                        <motion.div
                          className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
                            isActive
                              ? 'bg-gradient-to-r from-amber-400 to-orange-400 shadow-lg ring-2 ring-amber-300'
                              : isPassed
                                ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                                : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                          animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {stage === 'hatchling' ? '🥚' : speciesVis.emoji}
                        </motion.div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white">
                            {stageInfo.label}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {stageVis.description}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {stageInfo.xpRequired.toLocaleString()} XP required
                          </p>
                        </div>

                        {/* Status */}
                        {isPassed && (
                          <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 flex-shrink-0">
                            Complete
                          </Badge>
                        )}
                        {isActive && (
                          <Badge variant="achievement" className="animate-none flex-shrink-0">
                            Current
                          </Badge>
                        )}
                        {isFuture && (
                          <Badge variant="secondary" className="flex-shrink-0">
                            <Lock className="w-3 h-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* XP Progress Bar */}
                {pet.stage !== 'majestic' && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        XP to {PET_STAGES[nextStage].label}
                      </span>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-300">
                        {Math.floor(xpProgress)}%
                      </span>
                    </div>
                    <Progress value={xpProgress} variant="xp" className="h-4" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      {(nextStageXP - pet.totalXP).toLocaleString()} XP remaining - keep learning!
                    </p>
                  </div>
                )}

                {pet.stage === 'majestic' && (
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-300 dark:border-purple-700 text-center">
                    <motion.div
                      className="text-4xl mb-2"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Crown className="w-8 h-8 mx-auto text-amber-500" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                      Fully Evolved!
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {pet.name} has reached their ultimate Majestic form!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------- Customize Tab ---------- */}
          <TabsContent value="customize">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Customization
                </CardTitle>
                <CardDescription>
                  Dress up {pet.name} with accessories and auras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {COSMETIC_SLOTS.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center space-y-2 opacity-60"
                    >
                      <span className="text-3xl">{slot.emoji}</span>
                      <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                        {slot.label}
                      </h4>
                      <Badge variant="secondary" size="sm">
                        <Lock className="w-3 h-3 mr-1" />
                        Coming Soon
                      </Badge>
                    </div>
                  ))}
                </div>

                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                  Earn coins by completing lessons to unlock cosmetics in the Pet Shop!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ============================================ */}
        {/* INTERACTIONS                                  */}
        {/* ============================================ */}
        <Card>
          <CardHeader>
            <CardTitle>Interact with {pet.name}</CardTitle>
            <CardDescription>
              Take care of your pet to keep them happy and strong
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Feed */}
              <motion.div
                className="p-5 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border-2 border-amber-200 dark:border-amber-700 text-center space-y-3 cursor-pointer hover:shadow-lg hover:shadow-amber-300/20 transition-shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFeed}
              >
                <motion.div
                  className="text-4xl"
                  animate={feedAnim ? { rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] } : {}}
                >
                  🍖
                </motion.div>
                <h4 className="font-bold text-slate-900 dark:text-white">Feed</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  +10 Happiness, +5 Health
                </p>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
                  <Apple className="w-4 h-4 mr-1" /> Feed {pet.name}
                </Button>
              </motion.div>

              {/* Play */}
              <motion.div
                className="p-5 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 border-2 border-pink-200 dark:border-pink-700 text-center space-y-3 cursor-pointer hover:shadow-lg hover:shadow-pink-300/20 transition-shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlay}
              >
                <motion.div
                  className="text-4xl"
                  animate={playAnim ? { y: [0, -15, 0], rotate: [0, 10, -10, 0] } : {}}
                >
                  🎮
                </motion.div>
                <h4 className="font-bold text-slate-900 dark:text-white">Play</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  +15 Happiness, +10 Energy
                </p>
                <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-xl">
                  <Gamepad2 className="w-4 h-4 mr-1" /> Play with {pet.name}
                </Button>
              </motion.div>

              {/* Study Together */}
              <motion.div
                className="p-5 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border-2 border-blue-200 dark:border-blue-700 text-center space-y-3 cursor-pointer hover:shadow-lg hover:shadow-blue-300/20 transition-shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStudy}
              >
                <motion.div
                  className="text-4xl"
                  animate={studyAnim ? { scale: [1, 1.15, 1], rotate: [0, -3, 3, 0] } : {}}
                >
                  📚
                </motion.div>
                <h4 className="font-bold text-slate-900 dark:text-white">Study Together</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  +5 Knowledge, +10 XP
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  <BookOpen className="w-4 h-4 mr-1" /> Study with {pet.name}
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* ============================================ */}
        {/* ACTIVITY LOG                                  */}
        {/* ============================================ */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ACTIVITY_LOG.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <span className="text-2xl flex-shrink-0">{entry.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 dark:text-white">
                      {entry.action.replace(/{name}/g, pet.name)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {entry.timestamp}
                    </p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-700 dark:text-green-200 border border-green-300 dark:border-green-700 flex-shrink-0 text-xs">
                    {entry.impact}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Choose Different Pet button */}
        <div className="text-center pb-8">
          <Button
            variant="ghost"
            className="text-sm text-slate-400 hover:text-slate-600"
            onClick={() => router.push('/pet/select')}
          >
            Choose a different pet companion
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat Detail Card                                                   */
/* ------------------------------------------------------------------ */

function StatDetailCard({
  label,
  value,
  icon,
  color,
  tip,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: 'pink' | 'yellow' | 'blue' | 'green';
  tip: string;
}) {
  const colorMap = {
    pink: {
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      border: 'border-pink-200 dark:border-pink-800',
      icon: 'text-pink-500 bg-pink-100 dark:bg-pink-900/40',
      bar: 'bg-pink-500',
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/40',
      bar: 'bg-yellow-500',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-500 bg-blue-100 dark:bg-blue-900/40',
      bar: 'bg-blue-500',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-500 bg-green-100 dark:bg-green-900/40',
      bar: 'bg-green-500',
    },
  };

  const c = colorMap[color];
  const status =
    value >= 80 ? 'Excellent' : value >= 60 ? 'Good' : value >= 40 ? 'Fair' : 'Needs Attention';

  return (
    <div className={`p-4 rounded-xl ${c.bg} border ${c.border} space-y-2`}>
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${c.icon}`}>{icon}</div>
        <span className="font-semibold text-sm text-slate-900 dark:text-white">{label}</span>
        <span className="ml-auto font-bold text-lg text-slate-900 dark:text-white">{value}</span>
      </div>
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${c.bar} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className={`text-xs font-medium ${value < 40 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
          {status}
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">{tip}</span>
      </div>
    </div>
  );
}
