import { NextRequest, NextResponse } from 'next/server';
import type { XPRewardEvent, LevelUpData } from '@/types/gamification.types';

// Mock XP thresholds for level progression
const XP_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  4: 450,
  5: 700,
  6: 1000,
  7: 1350,
  8: 1750,
  9: 2200,
  10: 2700,
};

// Tier progression
const TIERS = [
  { level: 1, name: 'Novice', icon: '🌱' },
  { level: 3, name: 'Wave Runner', icon: '🌊' },
  { level: 6, name: 'Knowledge Keeper', icon: '📚' },
  { level: 9, name: 'Luminary', icon: '✨' },
];

function getTierForLevel(level: number): string {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (level >= TIERS[i].level) {
      return TIERS[i].name;
    }
  }
  return 'Novice';
}

function getXPForLevel(level: number): number {
  return XP_THRESHOLDS[level] || 0;
}

function getLevelFromXP(totalXP: number): { level: number; xpInLevel: number; xpToNext: number } {
  let level = 1;
  let previousThreshold = 0;

  for (const [lvl, threshold] of Object.entries(XP_THRESHOLDS).map(([k, v]) => [parseInt(k), v])) {
    if (totalXP >= threshold) {
      level = lvl;
      previousThreshold = threshold;
    } else {
      break;
    }
  }

  const nextLevel = level + 1;
  const nextThreshold = XP_THRESHOLDS[nextLevel] || previousThreshold + 500;
  const xpInLevel = totalXP - previousThreshold;
  const xpToNext = nextThreshold - previousThreshold;

  return { level, xpInLevel, xpToNext };
}

// Mock user data (in production, this would query the database)
const mockUserData = {
  totalXP: 250,
  coins: 100,
  level: 2,
  tier: 'Wave Runner',
};

export async function GET(request: NextRequest) {
  try {
    // In production: get actual student ID from session
    const studentId = 'test-student-id';

    // Mock: fetch from database
    // const student = await db.student.findUnique({ where: { id: studentId } });

    const levelData = getLevelFromXP(mockUserData.totalXP);
    const tier = getTierForLevel(levelData.level);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: studentId,
          totalXP: mockUserData.totalXP,
          currentLevel: levelData.level,
          currentTier: tier,
          xpToNextLevel: levelData.xpToNext - levelData.xpInLevel,
          coins: mockUserData.coins,
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching XP:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch XP data',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, sourceType, sourceId, description } = body as XPRewardEvent;

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_AMOUNT',
            message: 'XP amount must be greater than 0',
          },
        },
        { status: 400 }
      );
    }

    if (!sourceType) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_SOURCE',
            message: 'Source type is required',
          },
        },
        { status: 400 }
      );
    }

    // In production: get actual student ID from session
    const studentId = 'test-student-id';

    // Mock calculation
    const previousLevel = mockUserData.level;
    const newTotalXP = mockUserData.totalXP + amount;
    const newLevelData = getLevelFromXP(newTotalXP);
    const newTier = getTierForLevel(newLevelData.level);
    const coinReward = Math.floor(amount / 10); // 1 coin per 10 XP

    const leveledUp = newLevelData.level > previousLevel;

    // In production: save to database
    // await db.xpTransaction.create({
    //   data: {
    //     studentId,
    //     amount,
    //     sourceType,
    //     sourceId,
    //     sourceDescription: description,
    //   },
    // });
    // await db.studentXP.update({
    //   where: { studentId },
    //   data: {
    //     totalXP: newTotalXP,
    //     coins: { increment: coinReward },
    //   },
    // });

    const responseData: any = {
      totalXP: newTotalXP,
      currentLevel: newLevelData.level,
      currentTier: newTier,
      xpToNextLevel: newLevelData.xpToNext - newLevelData.xpInLevel,
      coins: mockUserData.coins + coinReward,
      leveledUp,
    };

    if (leveledUp) {
      responseData.levelUpData = {
        previousLevel,
        newLevel: newLevelData.level,
        totalXP: newTotalXP,
        tierName: newTier,
        coinReward: 50 * (newLevelData.level - previousLevel),
        cosmetics: [],
      } as LevelUpData;
    }

    return NextResponse.json(
      {
        success: true,
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error awarding XP:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'AWARD_ERROR',
          message: 'Failed to award XP',
        },
      },
      { status: 500 }
    );
  }
}
