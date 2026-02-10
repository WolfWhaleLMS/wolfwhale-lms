import type { Achievement, AchievementCategory, RarityTier } from '@/types/gamification.types';

/**
 * Achievement Definitions
 * 20 achievements across multiple categories with XP and coin rewards.
 */

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: RarityTier;
  tier: RarityTier;
  iconUrl: string;
  xpReward: number;
  coinReward: number;
  requirement: Record<string, any>;
  hint: string;
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // --- Academic Achievements ---
  {
    id: 'first_login',
    name: 'First Login',
    description: 'Log in to Wolf Whale LMS for the very first time.',
    category: 'Academic',
    rarity: 'common',
    tier: 'common',
    iconUrl: '🎓',
    xpReward: 10,
    coinReward: 5,
    requirement: { type: 'login_count', value: 1 },
    hint: 'Just sign in!',
  },
  {
    id: 'first_assignment_submitted',
    name: 'First Assignment Submitted',
    description: 'Submit your very first assignment.',
    category: 'Academic',
    rarity: 'common',
    tier: 'common',
    iconUrl: '📝',
    xpReward: 20,
    coinReward: 10,
    requirement: { type: 'assignments_submitted', value: 1 },
    hint: 'Submit any assignment to unlock.',
  },
  {
    id: 'first_a_grade',
    name: 'First A Grade',
    description: 'Earn your first A grade on any assignment.',
    category: 'Academic',
    rarity: 'uncommon',
    tier: 'uncommon',
    iconUrl: '🅰️',
    xpReward: 30,
    coinReward: 15,
    requirement: { type: 'grade_a_count', value: 1 },
    hint: 'Score 90% or higher on an assignment.',
  },
  {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Submit all assignments on time in a single week.',
    category: 'Academic',
    rarity: 'rare',
    tier: 'rare',
    iconUrl: '🏅',
    xpReward: 75,
    coinReward: 30,
    requirement: { type: 'perfect_week', value: 1 },
    hint: 'Turn in every assignment before the deadline in one week.',
  },
  {
    id: 'math_wizard',
    name: 'Math Wizard',
    description: 'Score an A on 10 math assignments.',
    category: 'Academic',
    rarity: 'epic',
    tier: 'epic',
    iconUrl: '🧙',
    xpReward: 100,
    coinReward: 50,
    requirement: { type: 'subject_a_count', subject: 'math', value: 10 },
    hint: 'Master mathematics with top grades.',
  },
  {
    id: 'science_explorer',
    name: 'Science Explorer',
    description: 'Score an A on 10 science assignments.',
    category: 'Academic',
    rarity: 'epic',
    tier: 'epic',
    iconUrl: '🔬',
    xpReward: 100,
    coinReward: 50,
    requirement: { type: 'subject_a_count', subject: 'science', value: 10 },
    hint: 'Achieve excellence in science.',
  },
  {
    id: 'english_scholar',
    name: 'English Scholar',
    description: 'Score an A on 10 English assignments.',
    category: 'Academic',
    rarity: 'epic',
    tier: 'epic',
    iconUrl: '📖',
    xpReward: 100,
    coinReward: 50,
    requirement: { type: 'subject_a_count', subject: 'english', value: 10 },
    hint: 'Show your mastery of language arts.',
  },

  // --- Consistency Achievements ---
  {
    id: 'streak_7',
    name: '7 Day Streak',
    description: 'Log in for 7 consecutive days.',
    category: 'Consistency',
    rarity: 'uncommon',
    tier: 'uncommon',
    iconUrl: '🔥',
    xpReward: 50,
    coinReward: 20,
    requirement: { type: 'streak_days', value: 7 },
    hint: 'Keep logging in every day for a week.',
  },
  {
    id: 'streak_30',
    name: '30 Day Streak',
    description: 'Log in for 30 consecutive days. Incredible dedication!',
    category: 'Consistency',
    rarity: 'rare',
    tier: 'rare',
    iconUrl: '💎',
    xpReward: 150,
    coinReward: 75,
    requirement: { type: 'streak_days', value: 30 },
    hint: 'One month of daily logins.',
  },
  {
    id: 'streak_100',
    name: '100 Day Streak',
    description: 'Log in for 100 consecutive days. Legendary commitment!',
    category: 'Consistency',
    rarity: 'legendary',
    tier: 'legendary',
    iconUrl: '👑',
    xpReward: 500,
    coinReward: 250,
    requirement: { type: 'streak_days', value: 100 },
    hint: 'A true champion of consistency.',
  },

  // --- Leveling Achievements ---
  {
    id: 'level_5',
    name: 'Level 5',
    description: 'Reach level 5 and become a Wave Runner.',
    category: 'Engagement',
    rarity: 'common',
    tier: 'common',
    iconUrl: '🌊',
    xpReward: 25,
    coinReward: 10,
    requirement: { type: 'level', value: 5 },
    hint: 'Keep earning XP to level up.',
  },
  {
    id: 'level_10',
    name: 'Level 10',
    description: 'Reach level 10 and prove your dedication.',
    category: 'Engagement',
    rarity: 'uncommon',
    tier: 'uncommon',
    iconUrl: '⚡',
    xpReward: 50,
    coinReward: 25,
    requirement: { type: 'level', value: 10 },
    hint: 'Double digits! Keep going.',
  },
  {
    id: 'level_20',
    name: 'Level 20',
    description: 'Reach level 20. You are an Alpha Tracker!',
    category: 'Engagement',
    rarity: 'rare',
    tier: 'rare',
    iconUrl: '🐺',
    xpReward: 150,
    coinReward: 75,
    requirement: { type: 'level', value: 20 },
    hint: 'Halfway to the top!',
  },
  {
    id: 'level_40',
    name: 'Level 40',
    description: 'Reach the maximum level 40. You are a Mythic Guardian!',
    category: 'Engagement',
    rarity: 'legendary',
    tier: 'legendary',
    iconUrl: '✨',
    xpReward: 1000,
    coinReward: 500,
    requirement: { type: 'level', value: 40 },
    hint: 'The pinnacle of achievement.',
  },

  // --- Participation Achievements ---
  {
    id: 'lessons_10',
    name: '10 Lessons Completed',
    description: 'Complete 10 lessons across any subject.',
    category: 'Participation',
    rarity: 'common',
    tier: 'common',
    iconUrl: '📚',
    xpReward: 30,
    coinReward: 15,
    requirement: { type: 'lessons_completed', value: 10 },
    hint: 'Read through 10 lessons.',
  },
  {
    id: 'lessons_50',
    name: '50 Lessons Completed',
    description: 'Complete 50 lessons. Knowledge is power!',
    category: 'Participation',
    rarity: 'rare',
    tier: 'rare',
    iconUrl: '🎯',
    xpReward: 100,
    coinReward: 50,
    requirement: { type: 'lessons_completed', value: 50 },
    hint: 'Keep reading and learning.',
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Post in 5 different discussion threads.',
    category: 'Participation',
    rarity: 'uncommon',
    tier: 'uncommon',
    iconUrl: '🦋',
    xpReward: 40,
    coinReward: 20,
    requirement: { type: 'discussion_posts', value: 5 },
    hint: 'Share your thoughts in class discussions.',
  },
  {
    id: 'class_pet_contributor',
    name: 'Class Pet Contributor',
    description: 'Help the class pet evolve by contributing XP.',
    category: 'Participation',
    rarity: 'uncommon',
    tier: 'uncommon',
    iconUrl: '🐾',
    xpReward: 40,
    coinReward: 20,
    requirement: { type: 'class_pet_contribution', value: 100 },
    hint: 'Your XP feeds the class pet too.',
  },

  // --- Wellness Achievements ---
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a study session after 8:00 PM.',
    category: 'Wellness',
    rarity: 'uncommon',
    tier: 'uncommon',
    iconUrl: '🦉',
    xpReward: 20,
    coinReward: 10,
    requirement: { type: 'study_after_8pm', value: 1 },
    hint: 'Study late at night.',
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a study session before 8:00 AM.',
    category: 'Wellness',
    rarity: 'uncommon',
    tier: 'uncommon',
    iconUrl: '🐤',
    xpReward: 20,
    coinReward: 10,
    requirement: { type: 'study_before_8am', value: 1 },
    hint: 'Rise and shine!',
  },
  {
    id: 'bookworm',
    name: 'Bookworm',
    description: 'Read 10 lessons in a single day.',
    category: 'Wellness',
    rarity: 'rare',
    tier: 'rare',
    iconUrl: '🐛',
    xpReward: 60,
    coinReward: 30,
    requirement: { type: 'lessons_in_day', value: 10 },
    hint: 'Go on a learning binge!',
  },
  {
    id: 'pet_evolution',
    name: 'Pet Evolution',
    description: 'Evolve your pet to its next stage.',
    category: 'Engagement',
    rarity: 'rare',
    tier: 'rare',
    iconUrl: '🌟',
    xpReward: 75,
    coinReward: 35,
    requirement: { type: 'pet_evolved', value: 1 },
    hint: 'Take care of your pet and watch it grow.',
  },
];

/**
 * Convert AchievementDefinition to Achievement type used by components
 */
export function toAchievement(def: AchievementDefinition): Achievement {
  return {
    id: def.id,
    name: def.name,
    description: def.description,
    category: def.category,
    tier: def.tier,
    iconUrl: def.iconUrl,
    xpReward: def.xpReward,
    coinReward: def.coinReward,
    requirement: def.requirement,
    rarity: def.rarity,
  };
}

/**
 * Get all achievements as Achievement[] for components
 */
export function getAllAchievements(): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map(toAchievement);
}

/**
 * Get a single achievement definition by ID
 */
export function getAchievementById(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENT_DEFINITIONS.find((a) => a.id === id);
}

/**
 * Get the hint for a locked achievement
 */
export function getAchievementHint(id: string): string {
  const achievement = getAchievementById(id);
  return achievement?.hint ?? '???';
}
