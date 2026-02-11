'use client'

/**
 * ChatPhraseSelector - Chat phrase picker UI
 *
 * Displays categorized tabs of pre-approved chat phrases.
 * Users select a phrase to broadcast as a chat bubble above their avatar.
 * Enforces a 3-second cooldown between sends. Closes after selection.
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import type { ChatCategory, ChatPhrase } from '@/lib/plaza/types'

interface ChatPhraseSelectorProps {
  /** Whether the selector is open. */
  isOpen: boolean
  /** Called when the user selects a phrase. */
  onSelect: (phrase: ChatPhrase) => void
  /** Called when the selector should close. */
  onClose: () => void
  /** Available phrases (fetched from database or hardcoded defaults). */
  phrases?: ChatPhrase[]
}

const COOLDOWN_MS = 3000

const CATEGORIES: { key: ChatCategory; label: string; icon: string }[] = [
  { key: 'greeting', label: 'Hi!', icon: '\u{1F44B}' },
  { key: 'encouragement', label: 'Nice!', icon: '\u{1F44D}' },
  { key: 'study', label: 'Study', icon: '\u{1F4DA}' },
  { key: 'fun', label: 'Fun', icon: '\u{1F389}' },
  { key: 'farewell', label: 'Bye', icon: '\u{1F44B}' },
  { key: 'teamwork', label: 'Team', icon: '\u{1F91D}' },
  { key: 'celebration', label: 'Yay!', icon: '\u{1F3C6}' },
  { key: 'question', label: '???', icon: '\u{2753}' },
]

// Helper to create a default phrase with all required fields
function dp(id: string, phrase: string, category: ChatCategory, sortOrder: number): ChatPhrase {
  return { id, phrase, category, emoji_icon: null, is_global: true, sort_order: sortOrder }
}

// Default phrases to use when none are provided from the database
const DEFAULT_PHRASES: ChatPhrase[] = [
  // Greetings
  dp('d1', 'Hey there!', 'greeting', 0),
  dp('d2', 'Hello!', 'greeting', 1),
  dp('d3', 'Hi everyone!', 'greeting', 2),
  dp('d4', "What's up?", 'greeting', 3),
  dp('d5', 'Good morning!', 'greeting', 4),
  dp('d6', 'Welcome!', 'greeting', 5),

  // Encouragement
  dp('d10', 'Great job!', 'encouragement', 0),
  dp('d11', 'You got this!', 'encouragement', 1),
  dp('d12', 'Nice work!', 'encouragement', 2),
  dp('d13', 'Keep it up!', 'encouragement', 3),
  dp('d14', 'Amazing!', 'encouragement', 4),
  dp('d15', "You're awesome!", 'encouragement', 5),

  // Study
  dp('d20', 'Want to study together?', 'study', 0),
  dp('d21', 'Study time!', 'study', 1),
  dp('d22', 'Let me focus for a bit.', 'study', 2),
  dp('d23', 'Join my study group!', 'study', 3),
  dp('d24', 'I just finished studying!', 'study', 4),
  dp('d25', 'Quiz time!', 'study', 5),

  // Fun
  dp('d30', 'Want to play a game?', 'fun', 0),
  dp('d31', 'That was fun!', 'fun', 1),
  dp('d32', 'LOL!', 'fun', 2),
  dp('d33', 'Let\'s go explore!', 'fun', 3),
  dp('d34', 'Race you there!', 'fun', 4),
  dp('d35', 'Check out my new hat!', 'fun', 5),

  // Farewell
  dp('d40', 'See you later!', 'farewell', 0),
  dp('d41', 'Bye bye!', 'farewell', 1),
  dp('d42', 'Gotta go!', 'farewell', 2),
  dp('d43', 'Have a great day!', 'farewell', 3),
  dp('d44', 'See you tomorrow!', 'farewell', 4),

  // Teamwork
  dp('d50', 'Let\'s work together!', 'teamwork', 0),
  dp('d51', 'Follow me!', 'teamwork', 1),
  dp('d52', 'I\'ll help you!', 'teamwork', 2),
  dp('d53', 'Good team!', 'teamwork', 3),
  dp('d54', 'We did it!', 'teamwork', 4),

  // Celebration
  dp('d60', 'Woohoo!', 'celebration', 0),
  dp('d61', 'I leveled up!', 'celebration', 1),
  dp('d62', 'New high score!', 'celebration', 2),
  dp('d63', 'Achievement unlocked!', 'celebration', 3),
  dp('d64', 'Best day ever!', 'celebration', 4),

  // Questions
  dp('d70', 'How are you?', 'question', 0),
  dp('d71', 'Anyone here?', 'question', 1),
  dp('d72', 'What game should we play?', 'question', 2),
  dp('d73', 'Need any help?', 'question', 3),
  dp('d74', 'Where is everyone?', 'question', 4),
]

export function ChatPhraseSelector({
  isOpen,
  onSelect,
  onClose,
  phrases,
}: ChatPhraseSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<ChatCategory>('greeting')
  const [cooldownActive, setCooldownActive] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const allPhrases = phrases && phrases.length > 0 ? phrases : DEFAULT_PHRASES

  const filteredPhrases = allPhrases.filter((p) => p.category === activeCategory)

  const handleSelect = useCallback(
    (phrase: ChatPhrase) => {
      if (cooldownActive) return

      onSelect(phrase)
      onClose()

      // Start cooldown
      setCooldownActive(true)
      setCooldownRemaining(COOLDOWN_MS)

      const startTime = Date.now()
      cooldownTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime
        const remaining = COOLDOWN_MS - elapsed
        if (remaining <= 0) {
          setCooldownActive(false)
          setCooldownRemaining(0)
          if (cooldownTimerRef.current) {
            clearInterval(cooldownTimerRef.current)
            cooldownTimerRef.current = null
          }
        } else {
          setCooldownRemaining(remaining)
        }
      }, 100)
    },
    [cooldownActive, onSelect, onClose]
  )

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    // Delay to prevent the opening click from immediately closing
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Cleanup cooldown timer
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current)
      }
    }
  }, [])

  if (!isOpen) return null

  return (
    <div
      ref={panelRef}
      className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 md:bottom-16"
      style={{
        width: 'min(400px, calc(100vw - 32px))',
      }}
    >
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: 'rgba(26, 26, 46, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Category tabs */}
        <div className="flex overflow-x-auto border-b border-white/10 px-1 py-1.5 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className="flex-shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
              style={{
                backgroundColor:
                  activeCategory === cat.key
                    ? 'rgba(99, 102, 241, 0.8)'
                    : 'transparent',
                color:
                  activeCategory === cat.key
                    ? '#FFFFFF'
                    : 'rgba(255, 255, 255, 0.6)',
              }}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Phrase grid */}
        <div className="grid grid-cols-2 gap-1.5 p-2 max-h-48 overflow-y-auto scrollbar-hide">
          {filteredPhrases.map((phrase) => (
            <button
              key={phrase.id}
              type="button"
              onClick={() => handleSelect(phrase)}
              disabled={cooldownActive}
              className="rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors disabled:opacity-40"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: cooldownActive ? 'rgba(255, 255, 255, 0.4)' : '#FFFFFF',
              }}
              onMouseEnter={(e) => {
                if (!cooldownActive) {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor =
                    'rgba(99, 102, 241, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor =
                  'rgba(255, 255, 255, 0.08)'
              }}
            >
              {phrase.phrase}
            </button>
          ))}
        </div>

        {/* Cooldown indicator */}
        {cooldownActive && (
          <div className="border-t border-white/10 px-3 py-1.5 text-center text-[10px] text-white/40">
            Cooldown: {(cooldownRemaining / 1000).toFixed(1)}s
          </div>
        )}
      </div>
    </div>
  )
}
