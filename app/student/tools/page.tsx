'use client'

import Link from 'next/link'
import { ArrowLeft, Crown, Layers, Dices } from 'lucide-react'

export default function MiniGamesPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/student/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Mini Games</h1>
        <p className="mt-1 text-muted-foreground">Flashcards, brain games, and educational tools</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/student/flashcards"
          className="ocean-card group rounded-2xl p-6 transition-all hover:shadow-lg hover:scale-[1.02]"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
            <Layers className="h-8 w-8 text-violet-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            Flashcards
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Study with spaced repetition flashcards for any subject.
          </p>
        </Link>

        <Link
          href="/student/tools/mini-games"
          className="ocean-card group rounded-2xl p-6 transition-all hover:shadow-lg hover:scale-[1.02]"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-fuchsia-500/10">
            <Dices className="h-8 w-8 text-fuchsia-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            Brain Games
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Fun educational mini games to test your knowledge.
          </p>
        </Link>

        <Link
          href="/student/tools/chess"
          className="ocean-card group rounded-2xl p-6 transition-all hover:shadow-lg hover:scale-[1.02]"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10">
            <Crown className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            Chess
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Play chess against the computer. Sharpen your strategy!
          </p>
        </Link>
      </div>
    </div>
  )
}
