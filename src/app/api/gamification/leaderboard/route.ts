import { NextRequest, NextResponse } from 'next/server';
import type { LeaderboardEntry } from '@/types/gamification.types';

// Mock leaderboard data
const MOCK_STUDENTS = [
  {
    id: 'student-1',
    name: 'Alex Chen',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    xp: 2500,
    level: 8,
    tier: 'Knowledge Keeper',
  },
  {
    id: 'student-2',
    name: 'Jordan Smith',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    xp: 2200,
    level: 7,
    tier: 'Wave Runner',
  },
  {
    id: 'student-3',
    name: 'Casey Johnson',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    xp: 1900,
    level: 6,
    tier: 'Wave Runner',
  },
  {
    id: 'student-4',
    name: 'Morgan Lee',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    xp: 1650,
    level: 5,
    tier: 'Novice',
  },
  {
    id: 'student-5',
    name: 'Taylor Brown',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    xp: 1400,
    level: 5,
    tier: 'Novice',
  },
  {
    id: 'student-6',
    name: 'Current User',
    avatarUrl: 'https://i.pravatar.cc/150?img=6',
    xp: 1200,
    level: 4,
    tier: 'Novice',
  },
  {
    id: 'student-7',
    name: 'Jordan Wilson',
    avatarUrl: 'https://i.pravatar.cc/150?img=7',
    xp: 950,
    level: 3,
    tier: 'Novice',
  },
  {
    id: 'student-8',
    name: 'Casey Martinez',
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    xp: 750,
    level: 3,
    tier: 'Novice',
  },
];

function createLeaderboardEntry(
  rank: number,
  student: (typeof MOCK_STUDENTS)[0],
  isCurrentUser: boolean
): LeaderboardEntry {
  return {
    rank,
    studentId: student.id,
    studentName: student.name,
    avatarUrl: student.avatarUrl,
    xp: student.xp,
    level: student.level,
    tier: student.tier,
    isCurrentUser,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'class';
    const timeframe = searchParams.get('timeframe') || 'month';
    const classId = searchParams.get('classId');

    // In production: fetch from database with filters
    // const students = await db.student.findMany({
    //   where: {
    //     ...(scope === 'class' && { classId }),
    //     ...(scope === 'grade' && { gradeLevel }),
    //   },
    //   orderBy: { xp: 'desc' },
    // });

    // Sort mock students by XP
    const sortedStudents = [...MOCK_STUDENTS].sort((a, b) => b.xp - a.xp);

    // Get top 3
    const topThree: LeaderboardEntry[] = sortedStudents.slice(0, 3).map((student, index) =>
      createLeaderboardEntry(index + 1, student, student.id === 'student-6')
    );

    // Get all entries
    const allEntries: LeaderboardEntry[] = sortedStudents.map((student, index) =>
      createLeaderboardEntry(index + 1, student, student.id === 'student-6')
    );

    // Get current user rank
    const currentUserIndex = sortedStudents.findIndex((s) => s.id === 'student-6');
    const currentUserRank =
      currentUserIndex !== -1
        ? createLeaderboardEntry(currentUserIndex + 1, sortedStudents[currentUserIndex], true)
        : null;

    return NextResponse.json(
      {
        success: true,
        data: {
          topThree,
          allEntries,
          currentUserRank,
          totalStudents: MOCK_STUDENTS.length,
          scope,
          timeframe,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch leaderboard data',
        },
      },
      { status: 500 }
    );
  }
}
