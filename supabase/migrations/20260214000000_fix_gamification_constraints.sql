-- ============================================================================
-- Fix gamification table constraints
-- The original source_type CHECK was too restrictive for XP event types
-- ============================================================================

-- Drop the old CHECK constraint on xp_transactions.source_type
ALTER TABLE xp_transactions DROP CONSTRAINT IF EXISTS valid_source_type;

-- Add updated constraint that includes all XP event types used in the application
ALTER TABLE xp_transactions ADD CONSTRAINT valid_source_type CHECK (
  source_type IN (
    'assignment', 'lesson', 'daily', 'achievement', 'grade', 'streak',
    'level_up', 'pet_interaction', 'study_session', 'focus_session',
    'assignment_submit_ontime', 'assignment_submit_late', 'assignment_submit_early',
    'grade_a', 'grade_b', 'grade_c',
    'daily_login', 'streak_7day', 'streak_14day', 'streak_30day',
    'discussion_post', 'discussion_reply', 'peer_help', 'lesson_complete'
  )
);
