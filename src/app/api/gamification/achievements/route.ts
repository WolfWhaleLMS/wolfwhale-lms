import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth, apiResponse, apiError } from '@/lib/api';
import type { Achievement, StudentAchievement, AchievementUnlockData } from '@/types/gamification.types';

// Achievement definitions catalog (application-level constants, not stored in DB)
const ACHIEVEMENTS_CATALOG: Achievement[] = [
  {
    id: 'first_login',
    name: 'First Steps',
    description: 'Log in for the first time',
    category: 'Engagement',
    tier: 'common',
    iconUrl: '🌱',
    xpReward: 25,
    coinReward: 5,
    requirement: { type: 'login', value: 1 },
    rarity: 'common',
  },
  {
    id: 'first_assignment_submitted',
    name: 'Go-Getter',
    description: 'Submit your first assignment',
    category: 'Academic',
    tier: 'common',
    iconUrl: '📝',
    xpReward: 50,
    coinReward: 10,
    requirement: { type: 'assignmentsSubmitted', value: 1 },
    rarity: 'common',
  },
  {
    id: 'first_a_grade',
    name: 'Ace Student',
    description: 'Get your first A grade',
    category: 'Academic',
    tier: 'uncommon',
    iconUrl: '🏆',
    xpReward: 100,
    coinReward: 25,
    requirement: { type: 'aGrades', value: 1 },
    rarity: 'uncommon',
  },
  {
    id: 'streak_7',
    name: 'Consistency Champion',
    description: 'Maintain a 7-day login streak',
    category: 'Consistency',
    tier: 'uncommon',
    iconUrl: '🔥',
    xpReward: 100,
    coinReward: 25,
    requirement: { type: 'streakDays', value: 7 },
    rarity: 'uncommon',
  },
  {
    id: 'streak_30',
    name: 'Unstoppable',
    description: 'Maintain a 30-day login streak',
    category: 'Consistency',
    tier: 'epic',
    iconUrl: '💎',
    xpReward: 300,
    coinReward: 75,
    requirement: { type: 'streakDays', value: 30 },
    rarity: 'epic',
  },
  {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach level 5',
    category: 'Engagement',
    tier: 'rare',
    iconUrl: '⭐',
    xpReward: 200,
    coinReward: 50,
    requirement: { type: 'level', value: 5 },
    rarity: 'rare',
  },
  {
    id: 'level_10',
    name: 'Level 10 Legend',
    description: 'Reach level 10',
    category: 'Engagement',
    tier: 'epic',
    iconUrl: '✨',
    xpReward: 500,
    coinReward: 100,
    requirement: { type: 'level', value: 10 },
    rarity: 'epic',
  },
  {
    id: 'lessons_10',
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
];

/**
 * GET /api/gamification/achievements
 * Fetch all achievements and the current student's earned achievements
 */
export const GET = withAuth(async (req, opts) => {
  try {
    const supabase = await createClient();

    // Fetch student's earned achievements from DB
    const { data: earnedRows, error } = await supabase
      .from('student_achievements')
      .select('achievement_id, student_id, unlocked_at, displayed')
      .eq('tenant_id', opts.tenantId)
      .eq('student_id', opts.userId)
      .order('unlocked_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Map DB rows to StudentAchievement type
    const earned: StudentAchievement[] = (earnedRows || []).map((row) => ({
      achievementId: row.achievement_id,
      studentId: row.student_id,
      unlockedAt: row.unlocked_at,
      displayed: row.displayed,
    }));

    return apiResponse({
      achievements: ACHIEVEMENTS_CATALOG,
      earned,
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return apiError('Failed to fetch achievements', 500, 'FETCH_ERROR');
  }
});

/**
 * POST /api/gamification/achievements
 * Unlock an achievement for the current student
 * Body: { achievementId: string }
 */
export const POST = withAuth(async (req, opts) => {
  try {
    const body = await req.json();
    const { achievementId } = body;

    if (!achievementId) {
      return apiError('Achievement ID is required', 400, 'MISSING_ACHIEVEMENT_ID');
    }

    // Look up the achievement definition
    const achievement = ACHIEVEMENTS_CATALOG.find((a) => a.id === achievementId);
    if (!achievement) {
      return apiError('Achievement not found', 404, 'ACHIEVEMENT_NOT_FOUND');
    }

    const supabase = await createClient();

    // Check if already earned
    const { data: existing } = await supabase
      .from('student_achievements')
      .select('id')
      .eq('tenant_id', opts.tenantId)
      .eq('student_id', opts.userId)
      .eq('achievement_id', achievementId)
      .single();

    if (existing) {
      // Already earned, return 200 with null to indicate no new unlock
      return apiResponse(null);
    }

    // Insert the achievement unlock
    const { error: insertError } = await supabase
      .from('student_achievements')
      .insert({
        tenant_id: opts.tenantId,
        student_id: opts.userId,
        achievement_id: achievementId,
        displayed: false,
      });

    if (insertError) {
      throw insertError;
    }

    // Award XP and coins to the student_xp record
    const { data: existingXP } = await supabase
      .from('student_xp')
      .select('*')
      .eq('tenant_id', opts.tenantId)
      .eq('student_id', opts.userId)
      .single();

    const newCoins = (existingXP?.coins || 0) + achievement.coinReward;
    const newTotalXP = (existingXP?.total_xp || 0) + achievement.xpReward;
    const newTotalEarned = (existingXP?.total_coins_earned || 0) + achievement.coinReward;

    await supabase.from('student_xp').upsert(
      {
        tenant_id: opts.tenantId,
        student_id: opts.userId,
        total_xp: newTotalXP,
        coins: newCoins,
        total_coins_earned: newTotalEarned,
        total_coins_spent: existingXP?.total_coins_spent || 0,
        current_level: existingXP?.current_level || 1,
        current_tier: existingXP?.current_tier || 'Novice',
        streak_days: existingXP?.streak_days || 0,
        last_login_date: existingXP?.last_login_date || new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'tenant_id,student_id' }
    );

    // Create XP transaction for the achievement
    await supabase.from('xp_transactions').insert({
      tenant_id: opts.tenantId,
      student_id: opts.userId,
      amount: achievement.xpReward,
      source_type: 'achievement',
      description: `Achievement Unlocked: ${achievement.name}`,
    });

    // Create coin transaction for the achievement
    if (achievement.coinReward > 0) {
      await supabase.from('coin_transactions').insert({
        tenant_id: opts.tenantId,
        student_id: opts.userId,
        amount: achievement.coinReward,
        transaction_type: 'earn',
        source_type: 'achievement',
        description: `Achievement Reward: ${achievement.name}`,
      });
    }

    // Count total earned achievements for this student
    const { count } = await supabase
      .from('student_achievements')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', opts.tenantId)
      .eq('student_id', opts.userId);

    const unlockData: AchievementUnlockData = {
      achievement,
      xpEarned: achievement.xpReward,
      coinsEarned: achievement.coinReward,
      newAchievementsCount: count || 1,
    };

    return apiResponse(unlockData);
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return apiError('Failed to unlock achievement', 500, 'CHECK_ERROR');
  }
});
