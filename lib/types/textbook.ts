// Wolf Whale LMS - Textbook System Types
// Matching supabase/migrations/20260303000000_textbook_system.sql
//
// Convention:
//   - All `id` fields are UUID strings.
//   - Timestamps are ISO-8601 strings (Supabase returns them as text over REST).
//   - JSONB columns use explicit sub-types where structure is known;
//     otherwise unknown[] or Record<string, unknown>.
//   - Nullable DB columns are typed as `T | null`.

// =====================================================================
// Enums
// =====================================================================

export type TextbookSubject = 'math' | 'science' | 'physics' | 'chemistry' | 'biology' | 'ela'
export type ReadingProgressStatus = 'not_started' | 'in_progress' | 'completed'

// =====================================================================
// JSONB sub-types
// =====================================================================

/** Info about the textbook this digital textbook replaces (stored as JSONB). */
export interface ReplacedTextbook {
  title: string
  publisher: string
  price: number
  lineage: string
}

/** Key term definition (stored as JSONB array in chapters). */
export interface KeyTerm {
  term: string
  definition: string
}

/** Bookmark within a chapter (stored as JSONB array in reading progress). */
export interface Bookmark {
  id: string
  blockIndex: number
  note: string
  createdAt: string
}

// =====================================================================
// Core entities
// =====================================================================

export interface Textbook {
  id: string
  tenant_id: string
  title: string
  slug: string
  subject: TextbookSubject
  grade_level: string
  sk_course_name: string | null
  curriculum_url: string | null
  province: string
  curriculum_framework: string
  description: string | null
  cover_image_url: string | null
  replaces_textbooks: ReplacedTextbook[]
  is_published: boolean
  chapter_count: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface TextbookUnit {
  id: string
  tenant_id: string
  textbook_id: string
  unit_number: number
  title: string
  description: string | null
  big_idea: string | null
  essential_question: string | null
  created_at: string
  updated_at: string
}

export interface TextbookChapter {
  id: string
  tenant_id: string
  textbook_id: string
  unit_id: string | null
  chapter_number: number
  title: string
  slug: string
  description: string | null
  content: unknown[]              // JSONB content blocks (same format as Lesson.content)
  key_terms: KeyTerm[]
  indigenous_connection: string | null
  estimated_minutes: number | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface CurriculumOutcome {
  id: string
  province: string
  framework: string
  subject: string
  grade_level: string
  outcome_code: string
  strand: string | null
  description: string
  indicator_codes: unknown | null
  tags: string[]
  created_at: string
}

export interface TextbookFlashcard {
  id: string
  tenant_id: string
  chapter_id: string
  front_text: string
  back_text: string
  hint: string | null
  difficulty: number
  tags: string[]
  key_term_ref: string | null
  order_index: number
  created_at: string
}

// =====================================================================
// Student-facing
// =====================================================================

export interface StudentTextbookAssignment {
  id: string
  tenant_id: string
  student_id: string
  textbook_id: string
  course_id: string | null
  auto_assigned: boolean
  manually_added: boolean
  last_accessed_at: string
  created_at: string
}

export interface StudentReadingProgress {
  id: string
  tenant_id: string
  student_id: string
  chapter_id: string
  textbook_id: string
  status: ReadingProgressStatus
  scroll_position: number
  time_spent_seconds: number
  started_at: string | null
  completed_at: string | null
  last_accessed_at: string
  bookmarks: Bookmark[]
  notes: unknown[]
}

export interface StudentTextbookFlashcardProgress {
  id: string
  tenant_id: string
  student_id: string
  flashcard_id: string
  chapter_id: string
  ease_factor: number
  interval_days: number
  repetitions: number
  next_review_at: string
  last_quality: number | null
  last_reviewed_at: string | null
  updated_at: string
}

// =====================================================================
// Composite types for UI
// =====================================================================

export interface TextbookWithChapters extends Textbook {
  units: (TextbookUnit & { chapters: TextbookChapter[] })[]
  outcomes: CurriculumOutcome[]
}

export interface ChapterWithProgress extends TextbookChapter {
  progress: StudentReadingProgress | null
  flashcard_count: number
}
