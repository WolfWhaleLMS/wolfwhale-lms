// WolfWhale LMS - AI Tutor Type Definitions
// Foundation layer for local LLM-powered tutoring (WebLLM + Llama 3.2 3B)

// ---------------------------------------------------------------------------
// Engine lifecycle states
// ---------------------------------------------------------------------------

export type EngineStatus =
  | 'idle'
  | 'checking'
  | 'downloading'
  | 'loading'
  | 'ready'
  | 'generating'
  | 'error'
  | 'unsupported'

// ---------------------------------------------------------------------------
// Tutor configuration
// ---------------------------------------------------------------------------

/** Age-appropriate language variants for student prompts */
export type AgeVariant = 'k5' | '68' | '912'

/** Which role is using the tutor — determines prompt template */
export type TutorRole = 'student' | 'teacher'

// ---------------------------------------------------------------------------
// Conversation models
// ---------------------------------------------------------------------------

export interface TutorMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date
}

export interface TutorConversation {
  id: string
  title: string
  courseId: string | null
  lessonId: string | null
  messages: TutorMessage[]
  createdAt: Date
  updatedAt: Date
}

// ---------------------------------------------------------------------------
// Course context (injected into system prompt)
// ---------------------------------------------------------------------------

export interface CourseContext {
  courseId: string
  courseName: string
  subject: string
  gradeLevel: string
  currentLesson?: {
    id: string
    title: string
    content: string
    objectives: string[]
  }
  flashcardDecks?: {
    id: string
    name: string
    cardCount: number
    dueCount: number
  }[]
  recentAssignments?: {
    id: string
    title: string
    type: string
    dueDate: string | null
    points: number
  }[]
}

// ---------------------------------------------------------------------------
// Download / initialization progress
// ---------------------------------------------------------------------------

export interface DownloadProgress {
  percent: number
  text: string
  stage: 'checking' | 'downloading' | 'loading' | 'ready'
}
