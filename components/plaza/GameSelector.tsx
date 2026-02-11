'use client'

import { GameCard, type GameCardData } from './GameCard'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// The six educational mini games
// ---------------------------------------------------------------------------

export const MINI_GAMES: GameCardData[] = [
  {
    slug: 'math-blitz',
    name: 'Math Blitz',
    description: 'Race against the clock to solve as many math problems as you can. Speed and accuracy earn bonus tokens!',
    subject: 'Math',
    icon: 'Calculator',
    colorHex: '#6366f1',
    playerRange: '1-4 players',
    tokenReward: 15,
  },
  {
    slug: 'word-scramble',
    name: 'Word Scramble',
    description: 'Unscramble jumbled letters to form words before time runs out. Build your vocabulary!',
    subject: 'Language Arts',
    icon: 'Shuffle',
    colorHex: '#f59e0b',
    playerRange: '1-6 players',
    tokenReward: 15,
  },
  {
    slug: 'typing-race',
    name: 'Typing Race',
    description: 'Type sentences accurately and as fast as you can. Improve your typing speed and earn tokens!',
    subject: 'Typing',
    icon: 'Keyboard',
    colorHex: '#10b981',
    playerRange: '1-8 players',
    tokenReward: 15,
  },
  {
    slug: 'science-trivia',
    name: 'Science Trivia',
    description: 'Test your science knowledge with 10 questions. The faster you answer correctly, the more you earn!',
    subject: 'Science',
    icon: 'Brain',
    colorHex: '#ef4444',
    playerRange: '1-6 players',
    tokenReward: 15,
  },
  {
    slug: 'memory-match',
    name: 'Memory Match',
    description: 'Flip cards and find matching pairs. Train your memory with educational content!',
    subject: 'Memory',
    icon: 'Grid3x3',
    colorHex: '#8b5cf6',
    playerRange: '1-2 players',
    tokenReward: 15,
  },
  {
    slug: 'geography-dash',
    name: 'Geography Dash',
    description: 'Identify countries, capitals, and landmarks on the map. Explore the world while you learn!',
    subject: 'Geography',
    icon: 'Globe',
    colorHex: '#0ea5e9',
    playerRange: '1-4 players',
    tokenReward: 15,
  },
]

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface GameSelectorProps {
  context: 'plaza' | 'tools'
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GameSelector({ context, className }: GameSelectorProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {MINI_GAMES.map((game) => (
        <GameCard key={game.slug} game={game} context={context} />
      ))}
    </div>
  )
}
