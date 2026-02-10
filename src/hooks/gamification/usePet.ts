'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSound } from './useSound';
import type { Pet, PetInteractionResult } from '@/types/gamification.types';

interface UsePetOptions {
  onInteraction?: (result: PetInteractionResult) => void;
}

export function usePet(options?: UsePetOptions) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInteractionTime, setLastInteractionTime] = useState<Record<string, number>>({});
  const { play } = useSound();

  // Fetch pet data
  const fetchPet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/gamification/pets', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pet data');
      }

      const data = await response.json();
      setPet(data.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error fetching pet:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch pet on mount
  useEffect(() => {
    fetchPet();
  }, [fetchPet]);

  // Check if interaction is on cooldown
  const isOnCooldown = useCallback((actionType: string): boolean => {
    const lastTime = lastInteractionTime[actionType];
    if (!lastTime) return false;

    const cooldownMs = 30 * 60 * 1000; // 30 minutes
    return Date.now() - lastTime < cooldownMs;
  }, [lastInteractionTime]);

  // Get cooldown remaining time in seconds
  const getCooldownRemaining = useCallback((actionType: string): number => {
    const lastTime = lastInteractionTime[actionType];
    if (!lastTime) return 0;

    const cooldownMs = 30 * 60 * 1000; // 30 minutes
    const remaining = cooldownMs - (Date.now() - lastTime);
    return Math.max(0, Math.ceil(remaining / 1000));
  }, [lastInteractionTime]);

  // Generic pet interaction
  const interact = useCallback(
    async (actionType: 'feed' | 'play' | 'study' | 'rest'): Promise<PetInteractionResult | null> => {
      try {
        // Check cooldown (except for study which has no cooldown)
        if (actionType !== 'study' && isOnCooldown(actionType)) {
          throw new Error(`This action is on cooldown. Try again in ${getCooldownRemaining(actionType)}s`);
        }

        setError(null);

        const response = await fetch('/api/gamification/pets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            petId: pet?.id,
            actionType,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to interact with pet');
        }

        const data = await response.json();
        const result = data.data as PetInteractionResult;

        // Update local state
        setPet(result.pet);

        // Track last interaction time (30 min cooldown)
        setLastInteractionTime((prev) => ({
          ...prev,
          [actionType]: Date.now(),
        }));

        // Play appropriate sound
        if (result.statChanges.happiness > 0) {
          play('petHappy');
        } else if (result.statChanges.happiness < 0) {
          play('petSad');
        }

        if (result.coinChange > 0) {
          play('coinEarn');
        }

        // Trigger callback
        if (options?.onInteraction) {
          options.onInteraction(result);
        }

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        play('error');
        console.error('Error interacting with pet:', err);
        return null;
      }
    },
    [pet?.id, isOnCooldown, getCooldownRemaining, play, options]
  );

  // Specific interaction methods
  const feedPet = useCallback(async () => {
    return interact('feed');
  }, [interact]);

  const playWithPet = useCallback(async () => {
    return interact('play');
  }, [interact]);

  const studyWithPet = useCallback(async () => {
    return interact('study');
  }, [interact]);

  const restPet = useCallback(async () => {
    return interact('rest');
  }, [interact]);

  // Equip cosmetic item
  const equipItem = useCallback(
    async (itemId: string): Promise<Pet | null> => {
      try {
        setError(null);

        const response = await fetch('/api/gamification/pets', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            petId: pet?.id,
            action: 'equipItem',
            itemId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to equip item');
        }

        const data = await response.json();
        const updatedPet = data.data as Pet;

        setPet(updatedPet);
        play('success');

        return updatedPet;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        play('error');
        console.error('Error equipping item:', err);
        return null;
      }
    },
    [pet?.id, play]
  );

  // Unequip cosmetic item
  const unequipItem = useCallback(
    async (itemId: string): Promise<Pet | null> => {
      try {
        setError(null);

        const response = await fetch('/api/gamification/pets', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            petId: pet?.id,
            action: 'unequipItem',
            itemId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to unequip item');
        }

        const data = await response.json();
        const updatedPet = data.data as Pet;

        setPet(updatedPet);
        play('success');

        return updatedPet;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        play('error');
        console.error('Error unequipping item:', err);
        return null;
      }
    },
    [pet?.id, play]
  );

  return {
    pet,
    loading,
    error,
    feedPet,
    playWithPet,
    studyWithPet,
    restPet,
    equipItem,
    unequipItem,
    isOnCooldown,
    getCooldownRemaining,
    fetchPet,
  };
}
