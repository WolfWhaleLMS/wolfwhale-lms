// Achievement definitions and checker logic

export interface AchievementDefinition {
  id: string
  name: string
  description: string
  icon: string
  category: 'academic' | 'consistency' | 'participation' | 'challenge' | 'social' | 'wellness'
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  xpReward: number
  criteria: AchievementCriteria
}

export type AchievementCriteria =
  | { type: 'assignment_count'; count: number }
  | { type: 'grade_average'; min: number; courseCount?: number }
  | { type: 'streak_days'; days: number }
  | { type: 'login_days'; days: number }
  | { type: 'xp_total'; amount: number }
  | { type: 'level_reached'; level: number }
  | { type: 'attendance_percent'; min: number; days: number }
  | { type: 'focus_minutes'; minutes: number }
  | { type: 'discussion_posts'; count: number }

// ---------------------------------------------------------------------------
// Built-in achievements (30+)
// ---------------------------------------------------------------------------

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // Academic
  { id: 'first_submit', name: 'First Steps', description: 'Submit your first assignment', icon: '🎯', category: 'academic', tier: 'bronze', xpReward: 25, criteria: { type: 'assignment_count', count: 1 } },
  { id: 'submit_10', name: 'On a Roll', description: 'Submit 10 assignments', icon: '📝', category: 'academic', tier: 'silver', xpReward: 50, criteria: { type: 'assignment_count', count: 10 } },
  { id: 'submit_50', name: 'Dedicated Scholar', description: 'Submit 50 assignments', icon: '📚', category: 'academic', tier: 'gold', xpReward: 150, criteria: { type: 'assignment_count', count: 50 } },
  { id: 'submit_100', name: 'Century Mark', description: 'Submit 100 assignments', icon: '🏆', category: 'academic', tier: 'platinum', xpReward: 300, criteria: { type: 'assignment_count', count: 100 } },
  { id: 'honor_roll', name: 'Honor Roll', description: 'Maintain 90%+ average across all courses', icon: '⭐', category: 'academic', tier: 'gold', xpReward: 200, criteria: { type: 'grade_average', min: 90 } },
  { id: 'perfect_score', name: 'Perfect Score', description: 'Achieve 100% on any assignment', icon: '💯', category: 'academic', tier: 'silver', xpReward: 75, criteria: { type: 'grade_average', min: 100, courseCount: 1 } },

  // Consistency
  { id: 'streak_7', name: 'Week Warrior', description: 'Log in 7 days in a row', icon: '🔥', category: 'consistency', tier: 'bronze', xpReward: 25, criteria: { type: 'streak_days', days: 7 } },
  { id: 'streak_14', name: 'Fortnight Focus', description: 'Log in 14 days in a row', icon: '🔥', category: 'consistency', tier: 'silver', xpReward: 50, criteria: { type: 'streak_days', days: 14 } },
  { id: 'streak_30', name: 'Monthly Master', description: 'Log in 30 days in a row', icon: '🔥', category: 'consistency', tier: 'gold', xpReward: 100, criteria: { type: 'streak_days', days: 30 } },
  { id: 'streak_90', name: 'Unstoppable', description: 'Log in 90 days in a row', icon: '💪', category: 'consistency', tier: 'platinum', xpReward: 300, criteria: { type: 'streak_days', days: 90 } },
  { id: 'login_30', name: 'Regular Visitor', description: 'Log in 30 different days', icon: '📅', category: 'consistency', tier: 'bronze', xpReward: 30, criteria: { type: 'login_days', days: 30 } },
  { id: 'login_100', name: 'Centurion', description: 'Log in 100 different days', icon: '🏛️', category: 'consistency', tier: 'silver', xpReward: 100, criteria: { type: 'login_days', days: 100 } },

  // Participation
  { id: 'discussion_1', name: 'Conversation Starter', description: 'Post in a discussion', icon: '💬', category: 'participation', tier: 'bronze', xpReward: 15, criteria: { type: 'discussion_posts', count: 1 } },
  { id: 'discussion_25', name: 'Active Voice', description: 'Post 25 discussion messages', icon: '🗣️', category: 'participation', tier: 'silver', xpReward: 50, criteria: { type: 'discussion_posts', count: 25 } },
  { id: 'discussion_100', name: 'Community Leader', description: 'Post 100 discussion messages', icon: '👑', category: 'participation', tier: 'gold', xpReward: 150, criteria: { type: 'discussion_posts', count: 100 } },
  { id: 'perfect_attendance', name: 'Perfect Attendance', description: '100% attendance for 30 days', icon: '🎒', category: 'participation', tier: 'gold', xpReward: 100, criteria: { type: 'attendance_percent', min: 100, days: 30 } },

  // Challenge
  { id: 'level_5', name: 'Wolfling', description: 'Reach Level 5', icon: '🐺', category: 'challenge', tier: 'bronze', xpReward: 25, criteria: { type: 'level_reached', level: 5 } },
  { id: 'level_10', name: 'Young Wolf', description: 'Reach Level 10', icon: '🐺', category: 'challenge', tier: 'silver', xpReward: 75, criteria: { type: 'level_reached', level: 10 } },
  { id: 'level_20', name: 'Ocean Guardian', description: 'Reach Level 20', icon: '🐋', category: 'challenge', tier: 'gold', xpReward: 200, criteria: { type: 'level_reached', level: 20 } },
  { id: 'level_30', name: 'Neptune', description: 'Reach Level 30', icon: '🔱', category: 'challenge', tier: 'gold', xpReward: 400, criteria: { type: 'level_reached', level: 30 } },
  { id: 'level_40', name: 'Legend', description: 'Reach Level 40', icon: '🌟', category: 'challenge', tier: 'platinum', xpReward: 1000, criteria: { type: 'level_reached', level: 40 } },
  { id: 'xp_1000', name: 'Rising Star', description: 'Earn 1,000 total XP', icon: '⭐', category: 'challenge', tier: 'bronze', xpReward: 25, criteria: { type: 'xp_total', amount: 1000 } },
  { id: 'xp_10000', name: 'XP Collector', description: 'Earn 10,000 total XP', icon: '💎', category: 'challenge', tier: 'silver', xpReward: 100, criteria: { type: 'xp_total', amount: 10000 } },
  { id: 'xp_50000', name: 'XP Master', description: 'Earn 50,000 total XP', icon: '👑', category: 'challenge', tier: 'gold', xpReward: 300, criteria: { type: 'xp_total', amount: 50000 } },

  // Wellness
  { id: 'focus_30', name: 'Focused Mind', description: 'Complete 30 minutes of focus time', icon: '🧘', category: 'wellness', tier: 'bronze', xpReward: 15, criteria: { type: 'focus_minutes', minutes: 30 } },
  { id: 'focus_300', name: 'Deep Diver', description: 'Complete 5 hours of focus time', icon: '🐋', category: 'wellness', tier: 'silver', xpReward: 50, criteria: { type: 'focus_minutes', minutes: 300 } },
  { id: 'focus_1000', name: 'Meditation Master', description: 'Complete 1000 minutes of focus time', icon: '🌊', category: 'wellness', tier: 'gold', xpReward: 150, criteria: { type: 'focus_minutes', minutes: 1000 } },

  // Social
  { id: 'attendance_95', name: 'Almost Perfect', description: '95%+ attendance for a semester', icon: '🎯', category: 'social', tier: 'silver', xpReward: 75, criteria: { type: 'attendance_percent', min: 95, days: 90 } },
  { id: 'grade_b_plus', name: 'B+ Student', description: 'Maintain 87%+ average', icon: '📈', category: 'social', tier: 'bronze', xpReward: 30, criteria: { type: 'grade_average', min: 87 } },
  { id: 'grade_a', name: 'A Student', description: 'Maintain 93%+ average', icon: '📊', category: 'social', tier: 'silver', xpReward: 75, criteria: { type: 'grade_average', min: 93 } },
]

/** Get achievements by category */
export function getAchievementsByCategory(category: string): AchievementDefinition[] {
  return ACHIEVEMENTS.filter((a) => a.category === category)
}

/** Get achievements by tier */
export function getAchievementsByTier(tier: string): AchievementDefinition[] {
  return ACHIEVEMENTS.filter((a) => a.tier === tier)
}

/** Find a specific achievement */
export function getAchievement(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id)
}
