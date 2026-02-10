/**
 * Mock Pet Data
 * Used for MVP display before database integration.
 * Provides default pet state and helper functions for localStorage persistence.
 */

import type { PetSpecies, PetStage } from '@/types/database.types';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MockPetState {
  id: string;
  name: string;
  species: PetSpecies;
  stage: PetStage;
  happiness: number;
  energy: number;
  knowledge: number;
  health: number;
  totalXP: number;
  equippedItems: string[];
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/*  Default Mock Pet                                                   */
/* ------------------------------------------------------------------ */

export const DEFAULT_MOCK_PET: MockPetState = {
  id: 'mock-pet-001',
  name: 'Luna',
  species: 'silver_wolf',
  stage: 'juvenile',
  happiness: 75,
  energy: 60,
  knowledge: 85,
  health: 70,
  totalXP: 1200,
  equippedItems: [],
  createdAt: new Date().toISOString(),
};

/* ------------------------------------------------------------------ */
/*  localStorage Persistence                                           */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'wolf-whale-lms-pet';

/** Save pet state to localStorage */
export function savePetToStorage(pet: MockPetState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
  } catch {
    // Silent fail for storage issues
  }
}

/** Load pet state from localStorage, or return null if none exists */
export function loadPetFromStorage(): MockPetState | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as MockPetState;
    }
  } catch {
    // Silent fail
  }
  return null;
}

/** Check if the student has already selected a pet */
export function hasPetSelected(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) !== null;
}

/** Clear pet from storage (for testing/reset) */
export function clearPetFromStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/* ------------------------------------------------------------------ */
/*  Quiz Question Data                                                 */
/* ------------------------------------------------------------------ */

export interface QuizQuestion {
  id: string;
  question: string;
  emoji: string;
  options: {
    id: string;
    text: string;
    emoji: string;
    families: ('wolf' | 'whale' | 'hybrid')[];
  }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'When you learn something new, what do you like most?',
    emoji: '📚',
    options: [
      {
        id: 'q1a',
        text: 'Working with friends in a group',
        emoji: '👥',
        families: ['wolf'],
      },
      {
        id: 'q1b',
        text: 'Exploring and discovering on my own',
        emoji: '🔍',
        families: ['whale'],
      },
      {
        id: 'q1c',
        text: 'A mix of both! I like variety',
        emoji: '🌈',
        families: ['hybrid'],
      },
    ],
  },
  {
    id: 'q2',
    question: 'If you could have a superpower, which would you pick?',
    emoji: '⚡',
    options: [
      {
        id: 'q2a',
        text: 'Super speed to run through challenges',
        emoji: '💨',
        families: ['wolf'],
      },
      {
        id: 'q2b',
        text: 'Breathing underwater to explore the deep',
        emoji: '🫧',
        families: ['whale'],
      },
      {
        id: 'q2c',
        text: 'Flying through magical northern lights',
        emoji: '🌌',
        families: ['hybrid'],
      },
    ],
  },
  {
    id: 'q3',
    question: 'What makes you happiest after school?',
    emoji: '😊',
    options: [
      {
        id: 'q3a',
        text: 'Going on adventures outside',
        emoji: '🏕️',
        families: ['wolf'],
      },
      {
        id: 'q3b',
        text: 'Reading or watching something cool',
        emoji: '📖',
        families: ['whale'],
      },
      {
        id: 'q3c',
        text: 'Creating art, music, or building things',
        emoji: '🎨',
        families: ['hybrid'],
      },
    ],
  },
];

/** Given quiz answers, compute which families scored highest and recommend species */
export function getQuizRecommendations(
  answers: Record<string, string>
): PetSpecies[] {
  const familyScores: Record<string, number> = { wolf: 0, whale: 0, hybrid: 0 };

  for (const question of QUIZ_QUESTIONS) {
    const selectedOptionId = answers[question.id];
    if (!selectedOptionId) continue;
    const option = question.options.find((o) => o.id === selectedOptionId);
    if (!option) continue;
    for (const family of option.families) {
      familyScores[family] += 1;
    }
  }

  // Sort families by score descending
  const sorted = Object.entries(familyScores)
    .sort(([, a], [, b]) => b - a);

  // The top-scoring family gets its species recommended
  // Also include the second family if it scored at least 1
  const recommendedFamilies: string[] = [];
  if (sorted[0][1] > 0) recommendedFamilies.push(sorted[0][0]);
  if (sorted[1] && sorted[1][1] > 0) recommendedFamilies.push(sorted[1][0]);
  if (recommendedFamilies.length === 0) {
    // Default: recommend all
    recommendedFamilies.push('wolf', 'whale', 'hybrid');
  }

  // Map families to specific species
  const familyToSpecies: Record<string, PetSpecies[]> = {
    wolf: ['silver_wolf', 'timber_wolf', 'shadow_wolf', 'lunar_wolf'],
    whale: ['blue_whale', 'beluga', 'humpback', 'orca'],
    hybrid: ['wolphin', 'whale_wolf', 'aurora_guardian'],
  };

  const recommendations: PetSpecies[] = [];
  for (const fam of recommendedFamilies) {
    recommendations.push(...(familyToSpecies[fam] || []));
  }

  return recommendations;
}

/* ------------------------------------------------------------------ */
/*  Encouragement Messages                                             */
/* ------------------------------------------------------------------ */

export const STUDY_ENCOURAGEMENTS: string[] = [
  'You and {name} make an amazing team!',
  '{name} believes in you! Keep going!',
  'Every lesson makes {name} stronger!',
  '{name} is so proud of your hard work!',
  'Learning together is the best adventure!',
  '{name} says: "You got this!"',
  'Knowledge is power, and {name} feels it growing!',
  'Great job! {name} is cheering you on!',
];

export function getRandomEncouragement(petName: string): string {
  const msg = STUDY_ENCOURAGEMENTS[Math.floor(Math.random() * STUDY_ENCOURAGEMENTS.length)];
  return msg.replace(/{name}/g, petName);
}
