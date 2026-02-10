import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth, apiResponse, apiError } from '@/lib/api';
import type { XPRewardEvent, LevelUpData } from '@/types/gamification.types';

// XP thresholds for level progression
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

/**
 * GET /api/gamification/xp
 * Fetch XP data for the current student
 */
export const GET = withAuth(async (req, opts) => {
  try {
    const supabase = await createClient();

    // Fetch student XP record
    const { data: studentXP, error } = await supabase
      .from('student_xp')
      .select('*')
      .eq('tenant_id', opts.tenantId)
      .eq('student_id', opts.userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found (new student with no XP record yet)
      throw error;
    }

    // If no record exists, return default values
    if (!studentXP) {
      const levelData = getLevelFromXP(0);
      return apiResponse({
        id: opts.userId,
        totalXP: 0,
        currentLevel: 1,
        currentTier: 'Novice',
        xpToNextLevel: levelData.xpToNext - levelData.xpInLevel,
        coins: 0,
        updatedAt: new Date().toISOString(),
      });
    }

    const levelData = getLevelFromXP(studentXP.total_xp);
    const tier = getTierForLevel(levelData.level);

    return apiResponse({
      id: opts.userId,
      totalXP: studentXP.total_xp,
      currentLevel: levelData.level,
      currentTier: tier,
      xpToNextLevel: levelData.xpToNext - levelData.xpInLevel,
      coins: studentXP.coins,
      updatedAt: studentXP.updated_at,
    });
  } catch (error) {
    console.error('Error fetching XP:', error);
    return apiError('Failed to fetch XP data', 500, 'FETCH_ERROR');
  }
});

/**
 * POST /api/gamification/xp
 * Award XP to the current student
 */
export const POST = withAuth(async (req, opts) => {
  try {
    const body = await req.json();
    const { amount, sourceType, sourceId, description } = body as XPRewardEvent;

    // Validation
    if (!amount || amount <= 0) {
      return apiError('XP amount must be greater than 0', 400, 'INVALID_AMOUNT');
    }

    if (!sourceType) {
      return apiError('Source type is required', 400, 'MISSING_SOURCE');
    }

    const supabase = await createClient();

    // Get current XP or create new record
    const { data: existingXP } = await supabase
      .from('student_xp')
      .select('*')
      .eq('tenant_id', opts.tenantId)
      .eq('student_id', opts.userId)
      .single();

    const previousTotalXP = existingXP?.total_xp || 0;
    const previousLevel = existingXP ? getLevelFromXP(previousTotalXP).level : 1;
    const newTotalXP = previousTotalXP + amount;
    const newLevelData = getLevelFromXP(newTotalXP);
    const newTier = getTierForLevel(newLevelData.level);
    const coinReward = Math.floor(amount / 10); // 1 coin per 10 XP

    const leveledUp = newLevelData.level > previousLevel;

    // Create XP transaction record
    await supabase.from('xp_transactions').insert({
      tenant_id: opts.tenantId,
      student_id: opts.userId,
      amount,
      source_type: sourceType,
      source_id: sourceId || null,
      description: description || `Earned ${amount} XP`,
    });

    // Upsert student XP record
    const newCoins = (existingXP?.coins || 0) + coinReward;
    const newTotalEarned = (existingXP?.total_coins_earned || 0) + coinReward;

    await supabase.from('student_xp').upsert({
      tenant_id: opts.tenantId,
      student_id: opts.userId,
      total_xp: newTotalXP,
      current_level: newLevelData.level,
      current_tier: newTier,
      coins: newCoins,
      total_coins_earned: newTotalEarned,
      total_coins_spent: existingXP?.total_coins_spent || 0,
      streak_days: existingXP?.streak_days || 0,
      last_login_date: existingXP?.last_login_date || new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'tenant_id,student_id',
    });

    // If coins were earned, create a coin transaction
    if (coinReward > 0) {
      await supabase.from('coin_transactions').insert({
        tenant_id: opts.tenantId,
        student_id: opts.userId,
        amount: coinReward,
        transaction_type: 'earn',
        source_type: 'xp',
        description: `XP Conversion (${amount} XP)`,
      });
    }

    // If leveled up, award bonus coins
    if (leveledUp) {
      const levelUpCoinBonus = 50 * (newLevelData.level - previousLevel);
      await supabase.from('coin_transactions').insert({
        tenant_id: opts.tenantId,
        student_id: opts.userId,
        amount: levelUpCoinBonus,
        transaction_type: 'earn',
        source_type: 'level_up',
        description: `Level Up Bonus (Level ${newLevelData.level})`,
      });

      // Update coins with level up bonus
      await supabase
        .from('student_xp')
        .update({
          coins: newCoins + levelUpCoinBonus,
          total_coins_earned: newTotalEarned + levelUpCoinBonus,
        })
        .eq('tenant_id', opts.tenantId)
        .eq('student_id', opts.userId);
    }

    const responseData: any = {
      totalXP: newTotalXP,
      currentLevel: newLevelData.level,
      currentTier: newTier,
      xpToNextLevel: newLevelData.xpToNext - newLevelData.xpInLevel,
      coins: leveledUp ? newCoins + 50 * (newLevelData.level - previousLevel) : newCoins,
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

    return apiResponse(responseData);
  } catch (error) {
    console.error('Error awarding XP:', error);
    return apiError('Failed to award XP', 500, 'AWARD_ERROR');
  }
});
