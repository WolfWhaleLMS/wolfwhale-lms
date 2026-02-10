import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth, apiResponse, apiError } from '@/lib/api';
import type { LeaderboardEntry } from '@/types/gamification.types';

/**
 * GET /api/gamification/leaderboard
 * Fetch leaderboard data for students in the same tenant
 * Query params: scope (class|grade|school), timeframe (week|month|all), classId
 */
export const GET = withAuth(async (req, opts) => {
  try {
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get('scope') || 'class';
    const timeframe = searchParams.get('timeframe') || 'month';

    const supabase = await createClient();

    // Fetch all students' XP in this tenant, ordered by total_xp descending
    // Join with profiles to get student names, and filter to students only via tenant_memberships
    const { data: rows, error } = await supabase
      .from('student_xp')
      .select(`
        student_id,
        total_xp,
        current_level,
        current_tier
      `)
      .eq('tenant_id', opts.tenantId)
      .order('total_xp', { ascending: false });

    if (error) {
      throw error;
    }

    if (!rows || rows.length === 0) {
      return apiResponse({
        topThree: [],
        allEntries: [],
        currentUserRank: null,
        totalStudents: 0,
        scope,
        timeframe,
      });
    }

    // Fetch student profiles for names and avatars
    const studentIds = rows.map((r) => r.student_id);

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', studentIds);

    // Build a lookup map of profiles
    const profileMap = new Map<string, { firstName: string; lastName: string; avatarUrl: string | null }>();
    (profiles || []).forEach((p) => {
      profileMap.set(p.id, {
        firstName: p.first_name || '',
        lastName: p.last_name || '',
        avatarUrl: p.avatar_url,
      });
    });

    // Build leaderboard entries
    const allEntries: LeaderboardEntry[] = rows.map((row, index) => {
      const profile = profileMap.get(row.student_id);
      const displayName = profile
        ? `${profile.firstName} ${profile.lastName}`.trim() || 'Student'
        : 'Student';

      return {
        rank: index + 1,
        studentId: row.student_id,
        studentName: displayName,
        avatarUrl: profile?.avatarUrl || undefined,
        xp: row.total_xp,
        level: row.current_level,
        tier: row.current_tier,
        isCurrentUser: row.student_id === opts.userId,
      };
    });

    // Top 3
    const topThree = allEntries.slice(0, 3);

    // Find current user rank
    const currentUserRank = allEntries.find((e) => e.isCurrentUser) || null;

    return apiResponse({
      topThree,
      allEntries,
      currentUserRank,
      totalStudents: allEntries.length,
      scope,
      timeframe,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return apiError('Failed to fetch leaderboard data', 500, 'FETCH_ERROR');
  }
});
