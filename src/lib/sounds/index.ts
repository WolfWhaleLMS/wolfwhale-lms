import { Howl } from 'howler';
import type { SoundType } from '@/types/gamification.types';

interface SoundConfig {
  name: SoundType;
  url: string;
  volume?: number;
}

const SOUND_URLS: Record<SoundType, string> = {
  click: '/sounds/click.mp3',
  hover: '/sounds/hover.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  achievement: '/sounds/achievement.mp3',
  levelUp: '/sounds/level-up.mp3',
  petHappy: '/sounds/pet-happy.mp3',
  petSad: '/sounds/pet-sad.mp3',
  xpEarn: '/sounds/xp-earn.mp3',
  coinEarn: '/sounds/coin-earn.mp3',
  submit: '/sounds/submit.mp3',
  navigation: '/sounds/navigation.mp3',
};

export class SoundManager {
  private sounds: Map<SoundType, Howl> = new Map();
  private masterVolume: number = 1;
  private enabled: boolean = true;
  private loadedSounds: Set<SoundType> = new Set();

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds(): void {
    // Initialize all sounds with Howler
    Object.entries(SOUND_URLS).forEach(([soundType, url]) => {
      const howl = new Howl({
        src: [url],
        preload: true,
        loop: false,
        autoplay: false,
        volume: this.masterVolume,
      });

      this.sounds.set(soundType as SoundType, howl);
    });
  }

  public loadSound(name: SoundType, url: string): void {
    if (this.loadedSounds.has(name)) {
      return;
    }

    const howl = new Howl({
      src: [url],
      preload: true,
      loop: false,
      autoplay: false,
      volume: this.masterVolume,
    });

    this.sounds.set(name, howl);
    this.loadedSounds.add(name);
  }

  public play(name: SoundType, volume?: number): void {
    if (!this.enabled) {
      return;
    }

    const sound = this.sounds.get(name);
    if (!sound) {
      console.warn(`Sound not found: ${name}`);
      return;
    }

    try {
      const finalVolume = volume !== undefined ? volume : this.masterVolume;
      sound.volume(finalVolume);
      sound.play();
    } catch (error) {
      console.error(`Error playing sound ${name}:`, error);
    }
  }

  public stop(name: SoundType): void {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.stop();
    }
  }

  public setMasterVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.masterVolume = clampedVolume;

    this.sounds.forEach((sound) => {
      sound.volume(clampedVolume);
    });
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }
}

// Singleton instance
let soundManagerInstance: SoundManager | null = null;

export function getSoundManager(): SoundManager {
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager();
  }
  return soundManagerInstance;
}

export default getSoundManager();
