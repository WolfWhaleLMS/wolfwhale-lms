import { NextRequest, NextResponse } from 'next/server';
import type { Achievement, StudentAchievement, AchievementUnlockData } from '@/types/gamification.types';

// Mock achievements
const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-lesson',
    name: 'First Steps',
    description: 'Complete your first lesson',
    category: 'Academic',
    tier: 'common',
    iconUrl: '🌱',
    xpReward: 50,
    coinReward: 10,
    requirement: { type: 'lessonsCompleted', value: 1 },
    rarity: 'common',
  },
  {
    id: 'assignment-streak',
    name: 'Consistency Champion',
    description: 'Submit assignments for 5 days in a row',
    category: 'Consistency',
    tier: 'uncommon',
    iconUrl: '🔥',
    xpReward: 100,
    coinReward: 25,
    requirement: { type: 'submissionStreak', value: 5 },
    rarity: 'uncommon',
  },
  {
    id: 'ten-lessons',
    name: 'Knowledge Seeker',
    description: 'Complete 10 lessons',
    category: 'Academic',
    tier: 'uncommon',
    iconUrl: '📚',
    xpReward: 150,
    coinReward: 30,
    requirement: { type: 'lessonsCompleted', value: 10 },
    rarity: 'uncommon',
  },
  {
    id: 'perfect-score',
    name: 'Ace Student',
    description: 'Get a perfect score on any quiz',
    category: 'Academic',
    tier: 'rare',
    iconUrl: '🏆',
    xpReward: 200,
    coinReward: 50,
    requirement: { type: 'perfectScore', value: 1 },
    rarity: 'rare',
  },
  {
    id: 'participation-pro',
    name: 'Participation Pro',
    description: 'Participate in 20 class discussions',
    category: 'Participation',
    tier: 'rare',
    iconUrl: '🎯',
    xpReward: 200,
    coinReward: 50,
    requirement: { type: 'discussions', value: 20 },
    rarity: 'rare',
  },
  {
    id: 'wellness-warrior',
    name: 'Wellness Warrior',
    description: 'Take care of your pet for a full week',
    category: 'Wellness',
    tier: 'epic',
    iconUrl: '💪',
    xpReward: 300,
    coinReward: 75,
    requirement: { type: 'petCare', value: 7 },
    rarity: 'epic',
  },
  {
    id: 'level-ten',
    name: 'Level 10 Legend',
    description: 'Reach level 10',
    category: 'Engagement',
    tier: 'epic',
    iconUrl: '⭐',
    xpReward: 500,
    coinReward: 100,
    requirement: { type: 'level', value: 10 },
    rarity: 'epic',
  },
  {
    id: 'luminary',
    name: 'Luminary',
    description: 'Reach the highest tier',
    category: 'Engagement',
    tier: 'legendary',
    iconUrl: '✨',
    xpReward: 1000,
    coinReward: 250,
    requirement: { type: 'tier', value: 'Luminary' },
    rarity: 'legendary',
  },
];

// Mock earned achievements for this student
const mockEarnedAchievements: StudentAchievement[] = [
  {
    achievementId: 'first-lesson',
    studentId: 'student-1',
    unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    displayed: true,
  },
  {
    achievementId: 'ten-lessons',
    studentId: 'student-1',
    unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    displayed: true,
  },
  {
    achievementId: 'assignment-streak',
    studentId: 'student-1',
    unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    displayed: false,
  },
];

export async function GET(request: NextRequest) {
  try {
    // In production: get actual student ID from session
    const studentId = 'student-1';

    // Mock: fetch from database
    // const achievements = await db.achievement.findMany();
    // const earned = await db.studentAchievement.findMany({
    //   where: { studentId },
    // });

    return NextResponse.json(
      {
        success: true,
        data: {
          achievements: MOCK_ACHIEVEMENTS,
          earned: mockEarnedAchievements,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch achievements',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { achievementType, value } = body;

    // In production: check achievement requirements
    // For MVP, we'll randomly unlock one of the mock achievements
    const unlockedAchievement = MOCK_ACHIEVEMENTS[Math.floor(Math.random() * MOCK_ACHIEVEMENTS.length)];

    // Check if already earned
    const isEarned = mockEarnedAchievements.some((a) => a.achievementId === unlockedAchievement.id);

    if (isEarned) {
      // Already earned, return 204 No Content
      return NextResponse.json(null, { status: 204 });
    }

    // Mock: unlock achievement
    // In production: save to database
    // await db.studentAchievement.create({
    //   data: {
    //     studentId,
    //     achievementId: unlockedAchievement.id,
    //     unlockedAt: new Date(),
    //   },
    // });
    // await db.studentXP.update({
    //   where: { studentId },
    //   data: {
    //     totalXP: { increment: unlockedAchievement.xpReward },
    //     coins: { increment: unlockedAchievement.coinReward },
    //   },
    // });

    const unlockData: AchievementUnlockData = {
      achievement: unlockedAchievement,
      xpEarned: unlockedAchievement.xpReward,
      coinsEarned: unlockedAchievement.coinReward,
      newAchievementsCount: 1,
    };

    return NextResponse.json(
      {
        success: true,
        data: unlockData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking achievement:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CHECK_ERROR',
          message: 'Failed to check achievement',
        },
      },
      { status: 500 }
    );
  }
}
