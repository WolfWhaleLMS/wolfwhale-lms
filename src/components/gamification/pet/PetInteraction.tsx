'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Gamepad2, BookOpen, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { usePet } from '@/hooks/gamification/usePet';
import { useSound } from '@/hooks/gamification/useSound';
import type { Pet } from '@/types/gamification.types';

interface PetInteractionProps {
  pet: Pet;
  onInteraction?: (type: string, result: any) => void;
}

interface InteractionAction {
  id: 'feed' | 'play' | 'study' | 'rest';
  label: string;
  icon: React.ReactNode;
  cost: number;
  costType: 'coins' | 'free';
  description: string;
  effects: {
    happiness?: number;
    energy?: number;
    knowledge?: number;
    health?: number;
  };
  cooldown: boolean;
}

const INTERACTIONS: InteractionAction[] = [
  {
    id: 'feed',
    label: 'Feed',
    icon: <Apple className="w-5 h-5" />,
    cost: 5,
    costType: 'coins',
    description: 'Give your pet a tasty snack',
    effects: {
      happiness: 15,
      health: 10,
    },
    cooldown: true,
  },
  {
    id: 'play',
    label: 'Play',
    icon: <Gamepad2 className="w-5 h-5" />,
    cost: 3,
    costType: 'coins',
    description: 'Have fun together',
    effects: {
      happiness: 20,
      energy: 10,
    },
    cooldown: true,
  },
  {
    id: 'study',
    label: 'Study Together',
    icon: <BookOpen className="w-5 h-5" />,
    cost: 0,
    costType: 'free',
    description: 'Learn together',
    effects: {
      knowledge: 5,
      energy: 5,
    },
    cooldown: false,
  },
  {
    id: 'rest',
    label: 'Rest',
    icon: <Moon className="w-5 h-5" />,
    cost: 0,
    costType: 'free',
    description: 'Help them recharge',
    effects: {
      health: 10,
      energy: 10,
    },
    cooldown: true,
  },
];

export const PetInteraction: React.FC<PetInteractionProps> = ({ pet, onInteraction }) => {
  const {
    feedPet,
    playWithPet,
    studyWithPet,
    restPet,
    isOnCooldown,
    getCooldownRemaining,
    pet: updatedPet,
  } = usePet({
    onInteraction: (result) => {
      onInteraction?.(
        INTERACTIONS.find((a) => a.id === 'feed')?.label || '',
        result
      );
    },
  });

  const { play } = useSound();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<
    { id: number; message: string; type: 'success' | 'error' | 'warning' }[]
  >([]);

  const performInteraction = async (action: InteractionAction) => {
    setSelectedAction(action.id);

    // Check cooldown
    if (action.cooldown && isOnCooldown(action.id)) {
      const remaining = getCooldownRemaining(action.id);
      const minutes = Math.ceil(remaining / 60);
      showNotification(
        `${action.label} is on cooldown. Try again in ${minutes}m`,
        'warning'
      );
      play('error');
      setSelectedAction(null);
      return;
    }

    // Check coins if needed
    if (action.costType === 'coins' && action.cost > 0) {
      // This would check actual coins - for MVP we'll assume they have enough
      // TODO: Add coin check when API is ready
    }

    let result = null;

    try {
      switch (action.id) {
        case 'feed':
          result = await feedPet();
          break;
        case 'play':
          result = await playWithPet();
          break;
        case 'study':
          result = await studyWithPet();
          break;
        case 'rest':
          result = await restPet();
          break;
      }

      if (result) {
        play('success');
        const effects = Object.entries(result.statChanges)
          .filter(([_, value]) => value > 0)
          .map(([key, value]) => `+${value} ${key}`)
          .join(', ');

        showNotification(
          `${pet.name} loved that! ${effects}`,
          'success'
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      showNotification(message, 'error');
      play('error');
    } finally {
      setSelectedAction(null);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'warning') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 gap-3">
        {INTERACTIONS.map((action) => {
          const onCooldown = action.cooldown && isOnCooldown(action.id);
          const cooldownRemaining = onCooldown ? getCooldownRemaining(action.id) : 0;

          return (
            <motion.div key={action.id} layout>
              <Button
                onClick={() => performInteraction(action)}
                disabled={onCooldown || selectedAction !== null}
                className={`relative w-full h-auto py-4 flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedAction === action.id ? 'ring-2 ring-yellow-400' : ''
                }`}
                variant={onCooldown ? 'secondary' : 'default'}
              >
                <div className={`transition-transform ${selectedAction === action.id ? 'scale-110 animate-bounce' : ''}`}>
                  {action.icon}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">{action.label}</p>
                  {action.costType === 'coins' && (
                    <p className="text-xs opacity-75">{action.cost} 🪙</p>
                  )}
                </div>

                {/* Cooldown Indicator */}
                {onCooldown && (
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {Math.ceil(cooldownRemaining / 60)}m
                    </span>
                  </div>
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Action Description */}
      {selectedAction && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white/10 border border-white/20 rounded-lg p-3 text-sm text-white/80 text-center"
        >
          {INTERACTIONS.find((a) => a.id === selectedAction)?.description}
        </motion.div>
      )}

      {/* Effect Preview */}
      <motion.div
        className="grid grid-cols-2 gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {INTERACTIONS.map((action) => (
          <motion.div
            key={action.id}
            className={`rounded-lg p-2 text-xs transition-all ${
              selectedAction === action.id
                ? 'bg-white/20 border border-white/40'
                : 'bg-white/5 border border-white/10'
            }`}
            layout
          >
            <p className="font-semibold text-white/70 mb-1">{action.label}</p>
            <div className="space-y-0.5">
              {Object.entries(action.effects).map(([key, value]) => (
                <p key={key} className="text-white/60">
                  <span className="text-green-400">+{value}</span> {key}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-3 rounded-lg text-sm font-medium text-center ${
              notification.type === 'success'
                ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                : notification.type === 'warning'
                  ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300'
                  : 'bg-red-500/20 border border-red-500/50 text-red-300'
            }`}
          >
            {notification.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
