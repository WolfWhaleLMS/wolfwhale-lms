import type { XPTransaction, StudentAchievement } from '@/types/gamification.types';

/**
 * Mock Gamification State
 *
 * Level: 8 (Pack Scout tier)
 * XP: 1,750 / 2,200 (total XP 1750, level 7 starts at 1750, level 8 at 2200)
 * Actually using LEVEL_THRESHOLDS: level 7 = 1750, level 8 = 2200
 * So totalXP = 1750 + (progress toward 2200)
 * Let's say totalXP = 1950 => in level 7 range, progress = 1950-1750=200 out of 2200-1750=450
 * For the spec "1,750 / 2,200 XP" display, we set:
 *   totalXP that places us at level 8 visually with 1750 current and 2200 needed
 *   LEVEL_THRESHOLDS[7] = 1750, LEVEL_THRESHOLDS[8] = 2200
 *   So level = 7 (0-indexed) which we display as "Level 8" (1-indexed)
 *   currentXP in level = totalXP - 1750 displayed as progress
 *
 * For simplicity: totalXP = 1950, level index 7, displayed as Level 8
 * Progress: 1950-1750 = 200 out of 450 needed
 *
 * Streak: 12 days
 * Coins: 340
 * 6 achievements earned, 14 locked
 */

export const MOCK_GAMIFICATION_STATE = {
  totalXP: 1950,
  currentLevel: 8,       // display level (1-indexed)
  levelIndex: 7,         // 0-indexed into LEVEL_THRESHOLDS
  currentTier: 'Pack Scout',
  tierIndex: 2,
  currentLevelXP: 200,   // XP earned within current level
  xpForCurrentLevel: 450, // total XP span of current level (2200-1750)
  xpToNextLevel: 250,    // remaining to next level
  coins: 340,
  streakDays: 12,
  lastLoginDate: new Date().toISOString(),
};

/**
 * Streak calendar data for last 7 days
 */
export function getMockStreakCalendar(): { date: string; active: boolean }[] {
  const calendar: { date: string; active: boolean }[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    calendar.push({
      date: date.toISOString(),
      active: true, // 12-day streak means all last 7 days are active
    });
  }

  return calendar;
}

/**
 * IDs of achievements the mock student has earned
 */
export const MOCK_EARNED_ACHIEVEMENT_IDS: string[] = [
  'first_login',
  'first_assignment_submitted',
  'first_a_grade',
  'streak_7',
  'level_5',
  'lessons_10',
];

/**
 * Mock earned achievements with unlock dates
 */
export const MOCK_STUDENT_ACHIEVEMENTS: StudentAchievement[] = [
  {
    achievementId: 'first_login',
    studentId: 'mock-student-1',
    unlockedAt: '2025-09-01T08:30:00Z',
    displayed: true,
  },
  {
    achievementId: 'first_assignment_submitted',
    studentId: 'mock-student-1',
    unlockedAt: '2025-09-03T14:15:00Z',
    displayed: true,
  },
  {
    achievementId: 'first_a_grade',
    studentId: 'mock-student-1',
    unlockedAt: '2025-09-10T09:45:00Z',
    displayed: true,
  },
  {
    achievementId: 'streak_7',
    studentId: 'mock-student-1',
    unlockedAt: '2025-09-08T07:00:00Z',
    displayed: true,
  },
  {
    achievementId: 'level_5',
    studentId: 'mock-student-1',
    unlockedAt: '2025-10-15T11:20:00Z',
    displayed: true,
  },
  {
    achievementId: 'lessons_10',
    studentId: 'mock-student-1',
    unlockedAt: '2025-11-02T16:30:00Z',
    displayed: true,
  },
];

/**
 * Recent XP earning events (5 items)
 */
export const MOCK_XP_TRANSACTIONS: XPTransaction[] = [
  {
    id: 'xp-001',
    studentId: 'mock-student-1',
    amount: 20,
    sourceType: 'assignment',
    sourceId: 'assign-101',
    sourceDescription: 'Submitted Math Homework Ch. 7',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'xp-002',
    studentId: 'mock-student-1',
    amount: 30,
    sourceType: 'lesson',
    sourceId: 'lesson-204',
    sourceDescription: 'Completed Biology: Cell Division',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'xp-003',
    studentId: 'mock-student-1',
    amount: 25,
    sourceType: 'assignment',
    sourceId: 'assign-99',
    sourceDescription: 'Got an A on English Essay',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'xp-004',
    studentId: 'mock-student-1',
    amount: 5,
    sourceType: 'daily',
    sourceDescription: 'Daily Login Bonus',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'xp-005',
    studentId: 'mock-student-1',
    amount: 50,
    sourceType: 'achievement',
    sourceId: 'streak_7',
    sourceDescription: 'Achievement Unlocked: 7 Day Streak',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Streak milestone definitions
 */
export const STREAK_MILESTONES = [7, 14, 30, 60, 90, 365] as const;
