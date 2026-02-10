'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSoundManager } from '@/lib/sounds';
import type { SoundType } from '@/types/gamification.types';

interface UseSoundOptions {
  volume?: number;
  enabled?: boolean;
}

export function useSound(options?: UseSoundOptions) {
  const soundManager = getSoundManager();
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Load sound preferences from localStorage
    const savedPreference = localStorage.getItem('soundEnabled');
    if (savedPreference !== null) {
      const enabled = JSON.parse(savedPreference);
      setIsEnabled(enabled);
      soundManager.setEnabled(enabled);
    }
  }, [soundManager]);

  const play = useCallback(
    (soundName: SoundType, customVolume?: number) => {
      if (!isEnabled) {
        return;
      }

      // Debounce rapid plays
      soundManager.play(soundName, customVolume ?? options?.volume);
    },
    [soundManager, isEnabled, options?.volume]
  );

  const stop = useCallback(
    (soundName: SoundType) => {
      soundManager.stop(soundName);
    },
    [soundManager]
  );

  const toggleSound = useCallback(() => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    soundManager.setEnabled(newState);
    localStorage.setItem('soundEnabled', JSON.stringify(newState));
  }, [isEnabled, soundManager]);

  const setVolume = useCallback(
    (volume: number) => {
      soundManager.setMasterVolume(volume);
    },
    [soundManager]
  );

  return {
    play,
    stop,
    toggleSound,
    setVolume,
    isEnabled,
  };
}
