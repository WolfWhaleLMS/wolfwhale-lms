// Wolf Whale LMS - Application Constants

export const APP = {
  name: 'Wolf Whale LMS',
  version: '2.0.0',
  supportEmail: 'support@wolfwhale.ca',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://wolfwhale.ca',
} as const

// Grade scale (traditional)
export const GRADE_SCALE = [
  { letter: 'A+', min: 97, max: 100 },
  { letter: 'A', min: 93, max: 96.99 },
  { letter: 'A-', min: 90, max: 92.99 },
  { letter: 'B+', min: 87, max: 89.99 },
  { letter: 'B', min: 83, max: 86.99 },
  { letter: 'B-', min: 80, max: 82.99 },
  { letter: 'C+', min: 77, max: 79.99 },
  { letter: 'C', min: 73, max: 76.99 },
  { letter: 'C-', min: 70, max: 72.99 },
  { letter: 'D+', min: 67, max: 69.99 },
  { letter: 'D', min: 63, max: 66.99 },
  { letter: 'D-', min: 60, max: 62.99 },
  { letter: 'F', min: 0, max: 59.99 },
] as const

export function getLetterGrade(percentage: number): string {
  for (const grade of GRADE_SCALE) {
    if (percentage >= grade.min && percentage <= grade.max) {
      return grade.letter
    }
  }
  return 'F'
}

// Subjects
export const SUBJECTS = [
  'Mathematics',
  'English Language Arts',
  'Science',
  'Social Studies',
  'History',
  'Physical Education',
  'Art',
  'Music',
  'French',
  'Computer Science',
  'Other',
] as const

// Grade levels
export const GRADE_LEVELS = [
  'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
  'AP', 'IB', 'College',
] as const

// Semesters
export const SEMESTERS = ['Fall', 'Spring', 'Summer', 'Year-round'] as const

// Assignment types
export const ASSIGNMENT_TYPES = [
  { value: 'homework', label: 'Homework' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'project', label: 'Project' },
  { value: 'exam', label: 'Exam' },
  { value: 'discussion', label: 'Discussion' },
  { value: 'presentation', label: 'Presentation' },
  { value: 'other', label: 'Other' },
] as const

// Submission types
export const SUBMISSION_TYPES = [
  { value: 'text', label: 'Text Entry' },
  { value: 'file', label: 'File Upload' },
  { value: 'link', label: 'URL Link' },
  { value: 'discussion', label: 'Discussion Post' },
  { value: 'multi', label: 'Multiple Types' },
] as const

// File upload limits (bytes)
export const FILE_LIMITS = {
  avatar: 5 * 1024 * 1024, // 5MB
  document: 100 * 1024 * 1024, // 100MB
  submission: 50 * 1024 * 1024, // 50MB
  tenantTotal: 50 * 1024 * 1024 * 1024, // 50GB
} as const

// Session config
export const SESSION = {
  tokenExpiry: 24 * 60 * 60, // 24 hours in seconds
  refreshBefore: 5 * 60, // 5 minutes in seconds
  cookieName: 'wolfwhale_session',
} as const

// Pagination
export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 100,
  defaultPage: 1,
} as const

// XP Configuration
export const XP_CONFIG = {
  // Daily/weekly caps
  dailyCap: {
    k5: 300,
    '6-12': 400,
  },
  weeklyCap: 1800,

  // XP awards
  events: {
    assignment_submit_ontime: 25,
    assignment_submit_late: 10,
    assignment_submit_early: 35,
    grade_a: 50,
    grade_b: 35,
    grade_c: 20,
    daily_login: 10,
    streak_7day: 25,
    streak_14day: 50,
    streak_30day: 100,
    discussion_post: 15,
    discussion_reply: 10,
    peer_help: 25,
    focus_session: 15,
    lesson_complete: 10,
    perfect_attendance_week: 25,
    perfect_attendance_month: 100,
    // Plaza XP events
    plaza_game_complete: 10,
    plaza_game_win: 20,
    plaza_study_round: 15,
    plaza_study_session: 30,
    plaza_documentary_watch: 20,
    plaza_daily_login: 5,
  },

  // Level thresholds (XP needed per level)
  levels: [
    0, 100, 250, 450, 700, // Tier 1: Awakening (1-5)
    1000, 1400, 1900, 2500, 3200, // Tier 2: Growth (6-10)
    4000, 5000, 6200, 7600, 9200, // Tier 3: Advancement (11-15)
    11000, 13200, 15800, 18800, 22200, // Tier 4: Mastery (16-20)
    26000, 30200, 34800, 39800, 45200, // 21-25
    51000, 57200, 63800, 70800, 78200, // 26-30
    86000, 94200, 102800, 111800, 121200, // 31-35
    131000, 141200, 151800, 162800, 174200, // 36-40
  ],

  // Tier names
  tiers: {
    awakening: { min: 1, max: 5, name: 'Awakening' },
    growth: { min: 6, max: 10, name: 'Growth' },
    advancement: { min: 11, max: 15, name: 'Advancement' },
    mastery: { min: 16, max: 40, name: 'Mastery' },
  },

  // Level names
  levelNames: [
    '', // 0 unused
    'Spark', 'Glimmer', 'Flame', 'Light', 'Wolfling', // 1-5
    'Scout', 'Wanderer', 'Seeker', 'Explorer', 'Young Wolf', // 6-10
    'Learner', 'Scholar', 'Sage', 'Wisdom Keeper', 'Wolf Scholar', // 11-15
    'Master', 'Nexus Seeker', 'Tidal Master', 'Deep Explorer', 'Ocean Guardian', // 16-20
    'Tide Walker', 'Storm Rider', 'Wave Master', 'Current Keeper', 'Depth Seeker', // 21-25
    'Abyss Walker', 'Leviathan', 'Kraken', 'Poseidon', 'Neptune', // 26-30
    'Arctic Wolf', 'Dire Wolf', 'Alpha', 'Pack Leader', 'Wolf Lord', // 31-35
    'Mythic Wolf', 'Celestial', 'Eternal', 'Transcendent', 'Legend', // 36-40
  ],

  // Decay config
  decay: {
    startAfterDays: 14,
    ratePerDay: [
      { afterDays: 14, rate: 0.005 }, // 0.5%
      { afterDays: 30, rate: 0.01 }, // 1%
      { afterDays: 60, rate: 0.02 }, // 2%
    ],
  },
} as const

// Leaderboard visibility by age variant
export const LEADERBOARD_CONFIG = {
  k5: {
    showRanking: false,
    showAllAsChampions: true,
    visiblePercentage: 100,
  },
  '68': {
    showRanking: true,
    showAllAsChampions: false,
    visiblePercentage: 50,
  },
  '912': {
    showRanking: true,
    showAllAsChampions: false,
    visiblePercentage: 100,
    showPercentile: true,
    displayLimit: 25,
  },
} as const

// Achievement categories
export const ACHIEVEMENT_CATEGORIES = [
  'academic',
  'consistency',
  'participation',
  'challenge',
  'social',
  'wellness',
] as const

export const ACHIEVEMENT_TIERS = ['bronze', 'silver', 'gold', 'platinum'] as const

// Notification types
export const NOTIFICATION_TYPES = [
  'assignment_due',
  'grade_posted',
  'message_received',
  'enrollment_approved',
  'new_announcement',
  'submission_graded',
  'course_update',
  'system_alert',
] as const

// Attendance statuses
export const ATTENDANCE_STATUSES = [
  { value: 'present', label: 'Present', color: 'green' },
  { value: 'absent', label: 'Absent', color: 'red' },
  { value: 'tardy', label: 'Tardy', color: 'yellow' },
  { value: 'excused', label: 'Excused', color: 'blue' },
  { value: 'online', label: 'Online', color: 'purple' },
] as const
