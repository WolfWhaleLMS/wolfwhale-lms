/* Gamification Types and Interfaces */

export type PetFamily = 'wolf' | 'whale' | 'hybrid';
export type PetSpeciesDetailed = 'silver_wolf' | 'timber_wolf' | 'shadow_wolf' | 'lunar_wolf' | 'blue_whale' | 'beluga' | 'humpback' | 'orca' | 'wolphin' | 'whale_wolf' | 'aurora_guardian';
export type PetSpecies = PetFamily | PetSpeciesDetailed;
export type PetStage = 'hatchling' | 'juvenile' | 'adolescent' | 'majestic';
export type RarityTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type AchievementCategory =
  | 'Academic'
  | 'Consistency'
  | 'Participation'
  | 'Engagement'
  | 'Wellness'
  | 'Seasonal';
export type SoundType =
  | 'click'
  | 'hover'
  | 'success'
  | 'error'
  | 'achievement'
  | 'levelUp'
  | 'petHappy'
  | 'petSad'
  | 'xpEarn'
  | 'coinEarn'
  | 'submit'
  | 'navigation';

export type LeaderboardScope = 'class' | 'grade' | 'school';
export type LeaderboardTimeframe = 'week' | 'month' | 'all';

/* Pet Types */

export interface Pet {
  id: string;
  studentId: string;
  name: string;
  species: PetSpecies;
  stage: PetStage;
  happiness: number;
  energy: number;
  knowledge: number;
  health: number;
  totalXP: number;
  equippedItems: string[];
  unlockedCosmetics: string[];
  createdAt: string;
  updatedAt: string;
  lastFedAt?: string;
  lastPlayedAt?: string;
  lastStudiedAt?: string;
  lastRestedAt?: string;
}

export interface PetCosmetic {
  id: string;
  name: string;
  category: 'hats' | 'body' | 'back' | 'paws_fins' | 'auras';
  rarity: RarityTier;
  cost: number;
  iconUrl: string;
  description: string;
}

export interface PetInteractionResult {
  pet: Pet;
  statChanges: {
    happiness: number;
    energy: number;
    knowledge: number;
    health: number;
  };
  coinChange: number;
  message: string;
}

/* XP Reward Event */

export interface XPRewardEvent {
  studentId: string;
  amount: number;
  sourceType: string;
  sourceId?: string;
  sourceDescription: string;
  description?: string;
}

/* XP and Leveling Types */

export interface XPTier {
  level: number;
  name: string;
  icon: string;
  minXP: number;
  maxXP: number;
  coinBonus: number;
}

export interface XPTransaction {
  id: string;
  studentId: string;
  amount: number;
  sourceType: string;
  sourceId?: string;
  sourceDescription: string;
  createdAt: string;
}

export interface StudentXP {
  id: string;
  studentId: string;
  totalXP: number;
  currentLevel: number;
  currentTier: string;
  xpToNextLevel: number;
  coins: number;
  updatedAt: string;
}

export interface LevelUpData {
  previousLevel: number;
  newLevel: number;
  totalXP: number;
  tierName: string;
  coinReward: number;
  cosmetics?: PetCosmetic[];
}

/* Achievement Types */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  tier: RarityTier;
  iconUrl: string;
  xpReward: number;
  coinReward: number;
  requirement: Record<string, any>;
  rarity: RarityTier;
}

export interface StudentAchievement {
  achievementId: string;
  studentId: string;
  unlockedAt: string;
  displayed: boolean;
}

export interface AchievementUnlockData {
  achievement: Achievement;
  xpEarned: number;
  coinsEarned: number;
  newAchievementsCount: number;
}

/* Leaderboard Types */

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  anonymousName?: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  isCurrentUser: boolean;
  tier: string;
}

export interface LeaderboardData {
  topThree: LeaderboardEntry[];
  allEntries: LeaderboardEntry[];
  currentUserRank: LeaderboardEntry | null;
  totalStudents: number;
  scope: LeaderboardScope;
  timeframe: LeaderboardTimeframe;
}

/* Coin Types */

export interface CoinTransaction {
  id: string;
  studentId: string;
  amount: number;
  transactionType: 'earn' | 'spend';
  sourceType: string;
  sourceId?: string;
  sourceDescription: string;
  createdAt: string;
}

/* Stats Types */

export interface GameificationStats {
  totalXP: number;
  currentLevel: number;
  currentTier: string;
  coins: number;
  achievements: {
    total: number;
    unlocked: number;
  };
  streakDays: number;
  lastActivityDate: string;
}
