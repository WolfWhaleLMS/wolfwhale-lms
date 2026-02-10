'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSound } from './useSound';
import type { StudentXP, LevelUpData } from '@/types/gamification.types';

interface XPRewardData {
  totalXP: number;
  currentLevel: number;
  currentTier: string;
  xpToNextLevel: number;
  coins: number;
  leveledUp: boolean;
  levelUpData?: LevelUpData;
}

interface UseXPOptions {
  onLevelUp?: (data: LevelUpData) => void;
  onXPEarned?: (amount: number) => void;
}

export function useXP(options?: UseXPOptions) {
  const [studentXP, setStudentXP] = useState<StudentXP | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const { play } = useSound();

  // Fetch initial XP data
  const fetchXP = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/gamification/xp', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch XP data');
      }

      const data = await response.json();
      setStudentXP(data.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error fetching XP:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch XP on mount
  useEffect(() => {
    fetchXP();
  }, [fetchXP]);

  // Award XP to student
  const awardXP = useCallback(
    async (
      amount: number,
      sourceType: string,
      sourceId?: string,
      description?: string
    ): Promise<XPRewardData | null> => {
      try {
        setError(null);

        const response = await fetch('/api/gamification/xp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            sourceType,
            sourceId,
            description: description || sourceType,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to award XP');
        }

        const data = await response.json();
        const rewardData = data.data as XPRewardData;

        // Update local state
        setStudentXP({
          ...studentXP!,
          totalXP: rewardData.totalXP,
          currentLevel: rewardData.currentLevel,
          currentTier: rewardData.currentTier,
          xpToNextLevel: rewardData.xpToNextLevel,
          coins: rewardData.coins,
          updatedAt: new Date().toISOString(),
        });

        // Play sound effects
        play('xpEarn');
        if (rewardData.leveledUp) {
          play('levelUp');
          setIsLevelingUp(true);
          setTimeout(() => setIsLevelingUp(false), 3000);

          // Trigger callback
          if (options?.onLevelUp && rewardData.levelUpData) {
            options.onLevelUp(rewardData.levelUpData);
          }
        }

        // Trigger XP earned callback
        if (options?.onXPEarned) {
          options.onXPEarned(amount);
        }

        return rewardData;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        play('error');
        console.error('Error awarding XP:', err);
        return null;
      }
    },
    [studentXP, play, options]
  );

  return {
    studentXP,
    totalXP: studentXP?.totalXP ?? 0,
    currentLevel: studentXP?.currentLevel ?? 1,
    currentTier: studentXP?.currentTier ?? 'Novice',
    coins: studentXP?.coins ?? 0,
    xpToNextLevel: studentXP?.xpToNextLevel ?? 0,
    loading,
    error,
    isLevelingUp,
    awardXP,
    fetchXP,
  };
}
