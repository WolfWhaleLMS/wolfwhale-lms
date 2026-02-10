'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { getStudyCards, reviewCard } from '@/app/actions/flashcards'
import { ArrowLeft, RotateCcw, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react'

interface Card {
  id: string
  front_text: string
  back_text: string
  hint: string | null
  order_index: number
}

const qualityLabels = [
  { label: 'Again', color: 'bg-red-500 hover:bg-red-600', desc: 'Forgot completely' },
  { label: 'Hard', color: 'bg-orange-500 hover:bg-orange-600', desc: 'Barely recalled' },
  { label: 'Good', color: 'bg-blue-500 hover:bg-blue-600', desc: 'Recalled with effort' },
  { label: 'Easy', color: 'bg-green-500 hover:bg-green-600', desc: 'Instant recall' },
]

export default function StudyPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = use(params)
  const [cards, setCards] = useState<Card[]>([])
  const [progress, setProgress] = useState<Record<string, any>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reviewed, setReviewed] = useState(0)
  const [sessionComplete, setSessionComplete] = useState(false)

  useEffect(() => {
    getStudyCards(deckId).then(({ cards: c, progress: p }) => {
      setCards(c)
      setProgress(p)
      setLoading(false)
    })
  }, [deckId])

  const currentCard = cards[currentIndex]

  const handleRate = async (quality: number) => {
    if (!currentCard) return
    await reviewCard(deckId, currentCard.id, quality)
    setReviewed((r) => r + 1)
    setFlipped(false)
    setShowHint(false)

    if (currentIndex < cards.length - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      setSessionComplete(true)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-4xl animate-bounce">📇</div>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="space-y-6">
        <Link
          href="/student/flashcards"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Flashcards
        </Link>
        <div className="ocean-card rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4 opacity-40">📇</div>
          <p className="text-muted-foreground">This deck has no cards yet.</p>
        </div>
      </div>
    )
  }

  if (sessionComplete) {
    return (
      <div className="space-y-6">
        <Link
          href="/student/flashcards"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Flashcards
        </Link>
        <div className="ocean-card rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Session Complete!</h2>
          <p className="text-muted-foreground mb-6">
            You reviewed {reviewed} card{reviewed !== 1 ? 's' : ''} in this session.
          </p>
          <button
            onClick={() => {
              setCurrentIndex(0)
              setReviewed(0)
              setSessionComplete(false)
              setFlipped(false)
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <RotateCcw className="h-4 w-4" />
            Study Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/student/flashcards"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        className="perspective-1000 cursor-pointer"
        onClick={() => setFlipped(!flipped)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentCard.id}-${flipped}`}
            initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`ocean-card rounded-2xl p-8 min-h-[300px] flex flex-col items-center justify-center text-center ${
              flipped
                ? 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30'
                : ''
            }`}
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
              {flipped ? 'Answer' : 'Question'}
            </p>
            <p className="text-xl font-medium text-foreground whitespace-pre-wrap">
              {flipped ? currentCard.back_text : currentCard.front_text}
            </p>

            {!flipped && showHint && currentCard.hint && (
              <p className="mt-4 text-sm text-amber-600 dark:text-amber-400 italic">
                Hint: {currentCard.hint}
              </p>
            )}

            {!flipped && (
              <p className="mt-6 text-xs text-muted-foreground">
                Tap to reveal answer
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      {!flipped && currentCard.hint && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowHint(true)
          }}
          className="mx-auto flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
        >
          <Lightbulb className="h-4 w-4" />
          Show hint
        </button>
      )}

      {/* Rating buttons (shown after flip) */}
      {flipped && (
        <div className="grid grid-cols-4 gap-2">
          {qualityLabels.map((q, i) => (
            <button
              key={i}
              onClick={() => handleRate(i)}
              className={`${q.color} rounded-xl px-3 py-3 text-white text-sm font-medium transition-all hover:-translate-y-0.5`}
            >
              <div>{q.label}</div>
              <div className="text-[10px] opacity-80 mt-0.5">{q.desc}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
