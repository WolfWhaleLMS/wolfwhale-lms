/**
 * Pet Visual System
 * Maps each species to emoji art, CSS styling, colors, and evolution-stage variants.
 * Every species gets a unique visual identity using emojis + CSS art.
 */

import type { PetSpecies, PetStage } from '@/types/database.types';

/* ------------------------------------------------------------------ */
/*  Species Visual Configuration                                       */
/* ------------------------------------------------------------------ */

export interface SpeciesVisual {
  /** Primary emoji used to represent this species */
  emoji: string;
  /** Additional decorative emojis that orbit around the pet */
  accents: string[];
  /** Display label */
  label: string;
  /** Family grouping */
  family: 'wolf' | 'whale' | 'hybrid';
  /** Rich description for selection screen */
  description: string;
  /** Short tagline */
  tagline: string;
  /** CSS gradient for background */
  bgGradient: string;
  /** Glow / shadow color (Tailwind shadow class) */
  glowColor: string;
  /** Accent text color (Tailwind) */
  accentColor: string;
  /** Ring color used in selection cards */
  ringColor: string;
  /** Unique personality traits shown during selection */
  traits: string[];
}

export const SPECIES_VISUALS: Record<PetSpecies, SpeciesVisual> = {
  silver_wolf: {
    emoji: '🐺',
    accents: ['🌙', '✨', '🪨'],
    label: 'Silver Wolf',
    family: 'wolf',
    description: 'A majestic wolf with shimmering silver fur that glows under moonlight. Known for their calm wisdom and loyalty.',
    tagline: 'Wise & Loyal',
    bgGradient: 'from-slate-600 via-slate-500 to-gray-400',
    glowColor: 'shadow-slate-400/60',
    accentColor: 'text-slate-300',
    ringColor: 'ring-slate-400',
    traits: ['Calm', 'Wise', 'Loyal'],
  },
  timber_wolf: {
    emoji: '🐺',
    accents: ['🌲', '🍂', '🪵'],
    label: 'Timber Wolf',
    family: 'wolf',
    description: 'A strong and resilient wolf of the deep forest. Their powerful build and steady nature make them incredible study partners.',
    tagline: 'Strong & Resilient',
    bgGradient: 'from-amber-800 via-amber-700 to-yellow-600',
    glowColor: 'shadow-amber-500/60',
    accentColor: 'text-amber-300',
    ringColor: 'ring-amber-500',
    traits: ['Strong', 'Steady', 'Brave'],
  },
  shadow_wolf: {
    emoji: '🐺',
    accents: ['🌑', '🦇', '💜'],
    label: 'Shadow Wolf',
    family: 'wolf',
    description: 'A mysterious wolf that moves silently through the darkness. Their keen senses help uncover hidden knowledge.',
    tagline: 'Mysterious & Swift',
    bgGradient: 'from-purple-900 via-violet-800 to-indigo-900',
    glowColor: 'shadow-purple-500/60',
    accentColor: 'text-purple-300',
    ringColor: 'ring-purple-500',
    traits: ['Mysterious', 'Quick', 'Clever'],
  },
  lunar_wolf: {
    emoji: '🐺',
    accents: ['🌙', '⭐', '💫'],
    label: 'Lunar Wolf',
    family: 'wolf',
    description: 'A mystical wolf touched by moonlight, carrying ancient wisdom. They grow stronger with each lesson learned.',
    tagline: 'Mystical & Ancient',
    bgGradient: 'from-indigo-800 via-blue-700 to-purple-800',
    glowColor: 'shadow-indigo-400/60',
    accentColor: 'text-indigo-300',
    ringColor: 'ring-indigo-400',
    traits: ['Mystical', 'Patient', 'Ancient'],
  },
  blue_whale: {
    emoji: '🐋',
    accents: ['🌊', '💙', '🫧'],
    label: 'Blue Whale',
    family: 'whale',
    description: 'The largest creature in the ocean! Gentle and incredibly smart, they carry deep knowledge of the sea.',
    tagline: 'Gentle Giant',
    bgGradient: 'from-blue-700 via-blue-600 to-cyan-500',
    glowColor: 'shadow-blue-400/60',
    accentColor: 'text-blue-300',
    ringColor: 'ring-blue-400',
    traits: ['Gentle', 'Smart', 'Enormous'],
  },
  beluga: {
    emoji: '🐳',
    accents: ['❄️', '🤍', '🫧'],
    label: 'Beluga',
    family: 'whale',
    description: 'A friendly Arctic whale with a permanent smile! They love to sing and communicate, making learning fun.',
    tagline: 'Friendly & Playful',
    bgGradient: 'from-cyan-400 via-sky-300 to-white',
    glowColor: 'shadow-cyan-300/60',
    accentColor: 'text-cyan-200',
    ringColor: 'ring-cyan-300',
    traits: ['Friendly', 'Musical', 'Curious'],
  },
  humpback: {
    emoji: '🐋',
    accents: ['🎵', '🌊', '🎶'],
    label: 'Humpback Whale',
    family: 'whale',
    description: 'Known for spectacular breaches and beautiful songs! Their artistic spirit inspires creativity in everything.',
    tagline: 'Artistic & Brave',
    bgGradient: 'from-teal-700 via-teal-600 to-emerald-500',
    glowColor: 'shadow-teal-400/60',
    accentColor: 'text-teal-300',
    ringColor: 'ring-teal-400',
    traits: ['Artistic', 'Acrobatic', 'Inspiring'],
  },
  orca: {
    emoji: '🐋',
    accents: ['⚡', '🖤', '🤍'],
    label: 'Orca',
    family: 'whale',
    description: 'An incredibly intelligent apex predator of the sea. Orcas are strategic thinkers and natural-born leaders.',
    tagline: 'Strategic & Bold',
    bgGradient: 'from-gray-900 via-gray-800 to-slate-700',
    glowColor: 'shadow-gray-400/60',
    accentColor: 'text-gray-300',
    ringColor: 'ring-gray-400',
    traits: ['Strategic', 'Bold', 'Leader'],
  },
  wolphin: {
    emoji: '🐬',
    accents: ['🌊', '🐺', '💜'],
    label: 'Wolphin',
    family: 'hybrid',
    description: 'A rare hybrid of wolf and dolphin! Equally at home on land and sea, they bridge two worlds with grace.',
    tagline: 'Rare & Adaptable',
    bgGradient: 'from-violet-600 via-blue-500 to-cyan-400',
    glowColor: 'shadow-violet-400/60',
    accentColor: 'text-violet-300',
    ringColor: 'ring-violet-400',
    traits: ['Adaptable', 'Rare', 'Graceful'],
  },
  whale_wolf: {
    emoji: '🌊',
    accents: ['🐺', '🐋', '⚡'],
    label: 'Whale Wolf',
    family: 'hybrid',
    description: 'A legendary creature combining the power of wolves with the wisdom of whales. True masters of both realms.',
    tagline: 'Powerful & Wise',
    bgGradient: 'from-blue-800 via-indigo-700 to-slate-800',
    glowColor: 'shadow-blue-500/60',
    accentColor: 'text-blue-300',
    ringColor: 'ring-blue-500',
    traits: ['Powerful', 'Wise', 'Legendary'],
  },
  aurora_guardian: {
    emoji: '✨',
    accents: ['🌈', '💫', '🌟'],
    label: 'Aurora Guardian',
    family: 'hybrid',
    description: 'A mythical being born from the Northern Lights. They protect and guide learners with radiant energy.',
    tagline: 'Mythical & Radiant',
    bgGradient: 'from-pink-500 via-purple-500 to-cyan-400',
    glowColor: 'shadow-pink-400/60',
    accentColor: 'text-pink-300',
    ringColor: 'ring-pink-400',
    traits: ['Mythical', 'Radiant', 'Protective'],
  },
};

/* ------------------------------------------------------------------ */
/*  Evolution Stage Visuals                                            */
/* ------------------------------------------------------------------ */

export interface StageVisual {
  /** Size multiplier (1 = base) */
  sizeClass: string;
  /** Font-size in px for the main emoji */
  emojiSize: number;
  /** Extra CSS effects */
  effects: string[];
  /** Extra emojis appended to the pet art */
  decorators: string[];
  /** Background effect class name */
  bgEffect: string;
  /** Description of this stage */
  description: string;
}

export const STAGE_VISUALS: Record<PetStage, StageVisual> = {
  hatchling: {
    sizeClass: 'w-24 h-24',
    emojiSize: 48,
    effects: [],
    decorators: [],
    bgEffect: '',
    description: 'Just born! Small and adorable, needs lots of love.',
  },
  juvenile: {
    sizeClass: 'w-32 h-32',
    emojiSize: 72,
    effects: ['animate-bounce-gentle'],
    decorators: [''],
    bgEffect: 'opacity-20',
    description: 'Growing every day! Starting to show their personality.',
  },
  adolescent: {
    sizeClass: 'w-40 h-40',
    emojiSize: 96,
    effects: ['animate-bounce-gentle'],
    decorators: ['🌟'],
    bgEffect: 'opacity-40',
    description: 'Becoming stronger and wiser with each lesson.',
  },
  majestic: {
    sizeClass: 'w-48 h-48',
    emojiSize: 120,
    effects: ['animate-float'],
    decorators: ['✨', '🌙', '💫'],
    bgEffect: 'opacity-60',
    description: 'Reached their ultimate form! A true legend.',
  },
};

/* ------------------------------------------------------------------ */
/*  Family Colors & Metadata                                           */
/* ------------------------------------------------------------------ */

export const FAMILY_CONFIG: Record<'wolf' | 'whale' | 'hybrid', {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}> = {
  wolf: {
    label: 'Wolf Pup',
    emoji: '🐺',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/40',
    description: 'Wolves are loyal pack animals that thrive through teamwork and perseverance.',
  },
  whale: {
    label: 'Whale Calf',
    emoji: '🐋',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/40',
    description: 'Whales are gentle giants of the deep, renowned for their intelligence and songs.',
  },
  hybrid: {
    label: 'Hybrid',
    emoji: '🌟',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/40',
    description: 'Hybrids are rare creatures that combine the best of both worlds.',
  },
};

/* ------------------------------------------------------------------ */
/*  Helper Functions                                                   */
/* ------------------------------------------------------------------ */

/** Get the complete visual data for a species at a given stage */
export function getPetVisual(species: PetSpecies, stage: PetStage) {
  const speciesVisual = SPECIES_VISUALS[species];
  const stageVisual = STAGE_VISUALS[stage];
  const familyConfig = FAMILY_CONFIG[speciesVisual.family];

  return {
    ...speciesVisual,
    ...stageVisual,
    familyConfig,
  };
}

/** Get all species in a given family */
export function getSpeciesByFamily(family: 'wolf' | 'whale' | 'hybrid'): PetSpecies[] {
  return (Object.entries(SPECIES_VISUALS) as [PetSpecies, SpeciesVisual][])
    .filter(([_, v]) => v.family === family)
    .map(([k]) => k);
}

/** Get all 11 species as an ordered array */
export function getAllSpecies(): PetSpecies[] {
  return Object.keys(SPECIES_VISUALS) as PetSpecies[];
}
