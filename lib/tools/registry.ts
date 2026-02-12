// Tool definitions and registry for the student tools library

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToolCategory = 'game' | 'simulation' | 'practice' | 'reference'

export type ToolStatus = 'available' | 'coming_soon'

export interface ToolDefinition {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  category: ToolCategory
  subjectTags: string[]
  gradeRange: string
  colorHex: string
  route: string
  status: ToolStatus
}

// ---------------------------------------------------------------------------
// Category definitions for UI filter
// ---------------------------------------------------------------------------

export const TOOL_CATEGORIES: { value: ToolCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'game', label: 'Games' },
  { value: 'simulation', label: 'Simulations' },
  { value: 'practice', label: 'Practice' },
  { value: 'reference', label: 'Reference' },
]

// ---------------------------------------------------------------------------
// Tools registry
// ---------------------------------------------------------------------------

export const TOOLS_REGISTRY: ToolDefinition[] = [
  // Practice
  { id: 'flashcards', slug: 'flashcards', name: 'Flashcards', description: 'Study with spaced repetition flashcards for any subject.', icon: 'Layers', category: 'practice', subjectTags: ['All Subjects'], gradeRange: 'K-12', colorHex: '#00BFFF', route: '/student/flashcards', status: 'available' },

  // Games
  { id: 'brain-games', slug: 'brain-games', name: 'Brain Games', description: 'Fun educational mini games to test your knowledge.', icon: 'Dices', category: 'game', subjectTags: ['All Subjects'], gradeRange: 'K-12', colorHex: '#33FF33', route: '/student/tools/mini-games', status: 'available' },
  { id: 'chess', slug: 'chess', name: 'Chess', description: 'Play chess against the computer. Sharpen your strategy!', icon: 'Crown', category: 'game', subjectTags: ['Strategy', 'Logic'], gradeRange: '3-12', colorHex: '#FFAA00', route: '/student/tools/chess', status: 'available' },
  { id: 'math-blitz', slug: 'math-blitz', name: 'Math Blitz', description: 'Race against the clock solving math problems.', icon: 'Zap', category: 'game', subjectTags: ['Math'], gradeRange: '1-8', colorHex: '#FF6B6B', route: '/student/tools/math-blitz', status: 'coming_soon' },
  { id: 'word-scramble', slug: 'word-scramble', name: 'Word Scramble', description: 'Unscramble words to build vocabulary.', icon: 'Shuffle', category: 'game', subjectTags: ['English', 'Vocabulary'], gradeRange: '2-8', colorHex: '#A78BFA', route: '/student/tools/word-scramble', status: 'coming_soon' },
  { id: 'map-quiz', slug: 'map-quiz', name: 'Map Quiz', description: 'Test your geography knowledge with map challenges.', icon: 'Globe', category: 'game', subjectTags: ['Geography', 'Social Studies'], gradeRange: '3-12', colorHex: '#3B82F6', route: '/student/tools/map-quiz', status: 'coming_soon' },

  // Practice
  { id: 'typing-racer', slug: 'typing-racer', name: 'Typing Racer', description: 'Improve your typing speed with fun races.', icon: 'Keyboard', category: 'practice', subjectTags: ['Typing', 'Digital Literacy'], gradeRange: '3-12', colorHex: '#F97316', route: '/student/tools/typing-racer', status: 'coming_soon' },
  { id: 'equation-solver', slug: 'equation-solver', name: 'Equation Solver', description: 'Step-by-step equation solving with visual guides.', icon: 'Calculator', category: 'practice', subjectTags: ['Math', 'Algebra'], gradeRange: '6-12', colorHex: '#EC4899', route: '/student/tools/equation-solver', status: 'coming_soon' },
  { id: 'reading-timer', slug: 'reading-timer', name: 'Reading Timer', description: 'Track reading sessions with built-in timer and goals.', icon: 'Timer', category: 'practice', subjectTags: ['English', 'Reading'], gradeRange: 'K-12', colorHex: '#8B5CF6', route: '/student/tools/reading-timer', status: 'coming_soon' },
  { id: 'grammar-check', slug: 'grammar-check', name: 'Grammar Check', description: 'Practice grammar rules with interactive exercises.', icon: 'SpellCheck', category: 'practice', subjectTags: ['English', 'Grammar'], gradeRange: '3-12', colorHex: '#14B8A6', route: '/student/tools/grammar-check', status: 'coming_soon' },

  // Simulations
  { id: 'timeline-explorer', slug: 'timeline-explorer', name: 'Timeline Explorer', description: 'Interactive timelines for history and science.', icon: 'Clock', category: 'simulation', subjectTags: ['History', 'Science'], gradeRange: '4-12', colorHex: '#06B6D4', route: '/student/tools/timeline-explorer', status: 'coming_soon' },
  { id: 'science-lab', slug: 'science-lab', name: 'Virtual Science Lab', description: 'Simulate science experiments safely in a virtual lab.', icon: 'FlaskConical', category: 'simulation', subjectTags: ['Science', 'Biology', 'Chemistry'], gradeRange: '6-12', colorHex: '#059669', route: '/student/tools/science-lab', status: 'coming_soon' },

  // Reference
  { id: 'periodic-table', slug: 'periodic-table', name: 'Periodic Table', description: 'Interactive periodic table with element details.', icon: 'Atom', category: 'reference', subjectTags: ['Science', 'Chemistry'], gradeRange: '6-12', colorHex: '#10B981', route: '/student/tools/periodic-table', status: 'coming_soon' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Find a tool by its URL slug */
export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find((t) => t.slug === slug)
}

/** Get all tools in a specific category */
export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return TOOLS_REGISTRY.filter((t) => t.category === category)
}

/** Search tools by name, description, or subject tags */
export function searchTools(query: string): ToolDefinition[] {
  const q = query.toLowerCase()
  return TOOLS_REGISTRY.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.subjectTags.some((tag) => tag.toLowerCase().includes(q))
  )
}
