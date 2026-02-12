'use client'

import Link from 'next/link'
import { ArrowLeft, Gamepad2 } from 'lucide-react'
import { GameSelector } from '@/components/plaza/GameSelector'

export default function MiniGamesPage() {
  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/student/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00BFFF] to-[#33FF33] shadow-md">
            <Gamepad2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Mini Games
            </h1>
            <p className="text-muted-foreground">
              Educational games to sharpen your skills and earn rewards
            </p>
          </div>
        </div>
      </div>

      {/* Games grid (tools context = solo only) */}
      <GameSelector context="tools" />
    </div>
  )
}
