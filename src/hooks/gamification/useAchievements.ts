'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSound } from './useSound';
import type { Achievement, StudentAchievement, AchievementUnlockData } from '@/types/gamification.types';

interface UseAchievementsOptions {
  onUnlock?: (data: AchievementUnlockData) => void;
}

export function useAchievements(options?: UseAchievementsOptions) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [earnedAchievements, setEarnedAchievements] = useState<Map<string, StudentAchievement>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { play } = useSound();

  // Fetch all achievements
  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/gamification/achievements', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch achievements');
      }

      const data = await response.json();
      setAchievements(data.data.achievements);

      // Build map of earned achievements
      const earnedMap = new Map<string, StudentAchievement>();
      data.data.earned.forEach((achievement: StudentAchievement) => {
        earnedMap.set(achievement.achievementId, achievement);
      });
      setEarnedAchievements(earnedMap);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch achievements on mount
  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  // Check if an achievement is earned
  const isEarned = useCallback(
    (achievementId: string): boolean => {
      return earnedAchievements.has(achievementId);
    },
    [earnedAchievements]
  );

  // Check and award achievement
  const checkAchievement = useCallback(
    async (achievementType: string, value: any): Promise<AchievementUnlockData | null> => {
      try {
        setError(null);

        const response = await fetch('/api/gamification/achievements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            achievementType,
            value,
          }),
        });

        if (!response.ok) {
          // 204 means no achievement unlocked (not an error)
          if (response.status === 204) {
            return null;
          }
          throw new Error('Failed to check achievement');
        }

        const data = await response.json();

        if (!data.data) {
          return null;
        }

        const unlockData = data.data as AchievementUnlockData;

        // Update earned achievements
        setEarnedAchievements((prev) => {
          const newMap = new Map(prev);
          newMap.set(unlockData.achievement.id, {
            achievementId: unlockData.achievement.id,
            studentId: '',
            unlockedAt: new Date().toISOString(),
            displayed: false,
          });
          return newMap;
        });

        // Play achievement sound
        play('achievement');

        // Trigger callback
        if (options?.onUnlock) {
          options.onUnlock(unlockData);
        }

        return unlockData;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        console.error('Error checking achievement:', err);
        return null;
      }
    },
    [play, options]
  );

  // Get achievements by category
  const getByCategory = useCallback(
    (category: string) => {
      return achievements.filter((a) => a.category === category);
    },
    [achievements]
  );

  // Get earned achievements
  const getEarned = useCallback(() => {
    return achievements.filter((a) => isEarned(a.id));
  }, [achievements, isEarned]);

  // Get locked achievements
  const getLocked = useCallback(() => {
    return achievements.filter((a) => !isEarned(a.id));
  }, [achievements, isEarned]);

  return {
    achievements,
    earnedAchievements,
    loading,
    error,
    isEarned,
    checkAchievement,
    fetchAchievements,
    getByCategory,
    getEarned,
    getLocked,
  };
}
