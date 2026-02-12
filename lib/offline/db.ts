import Dexie, { type Table } from 'dexie'

// ---------------------------------------------------------------------------
// Offline IndexedDB schema — mirrors Supabase tables needed for student offline mode
// ---------------------------------------------------------------------------

// --- Table interfaces ---

export interface OfflineCourse {
  id: string
  name: string
  subject: string | null
  description: string | null
  teacher_name: string
  created_at: string
}

export interface OfflineLesson {
  id: string
  course_id: string
  title: string
  content: string | null
  order_index: number
}

export interface OfflineAssignment {
  id: string
  course_id: string
  title: string
  description: string | null
  due_date: string | null
  max_points: number
  assignment_type: string
}

export interface OfflineFlashcardDeck {
  id: string
  course_id: string
  title: string
  description: string | null
  card_count: number
}

export interface OfflineFlashcard {
  id: string
  deck_id: string
  front: string
  back: string
  ease_factor: number
  interval: number
  next_review: string | null
}

export interface OfflineGrade {
  id: string
  assignment_id: string
  course_name: string
  assignment_title: string
  points_earned: number
  percentage: number
  graded_at: string
}

export interface OfflinePendingAction {
  id?: number // auto-increment
  type: string // 'flashcard_review' | 'assignment_submit' etc
  payload: string // JSON stringified
  created_at: string
}

// --- Dexie database ---

class WolfWhaleOfflineDB extends Dexie {
  courses!: Table<OfflineCourse>
  lessons!: Table<OfflineLesson>
  assignments!: Table<OfflineAssignment>
  flashcardDecks!: Table<OfflineFlashcardDeck>
  flashcards!: Table<OfflineFlashcard>
  grades!: Table<OfflineGrade>
  pendingActions!: Table<OfflinePendingAction>

  constructor() {
    super('wolfwhale-offline')
    this.version(1).stores({
      courses: 'id',
      lessons: 'id, course_id',
      assignments: 'id, course_id',
      flashcardDecks: 'id, course_id',
      flashcards: 'id, deck_id',
      grades: 'id, assignment_id',
      pendingActions: '++id, type',
    })
  }
}

export const offlineDB = new WolfWhaleOfflineDB()
