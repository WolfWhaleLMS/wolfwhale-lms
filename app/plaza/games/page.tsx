'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Gamepad2 } from 'lucide-react'
import { TokenDisplay } from '@/components/plaza/TokenDisplay'
import { GameSelector } from '@/components/plaza/GameSelector'
import { getMyAvatar } from '@/app/actions/plaza'

export default function PlazaGamesPage() {
  const [tokenBalance, setTokenBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const avatar = await getMyAvatar()
        if (avatar) {
          setTokenBalance(avatar.token_balance ?? 0)
        }
      } catch {
        // ignore
      }
      setIsLoading(false)
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading games...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full p-4 md:p-6 lg:p-8">
      {/* Back link */}
      <Link
        href="/plaza"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Plaza
      </Link>

      {/* Header + Token Balance */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Gamepad2 className="h-7 w-7 text-violet-500" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Game House
            </h1>
          </div>
          <p className="text-muted-foreground">
            Play educational mini games, earn tokens, and compete with classmates!
          </p>
        </div>
        <TokenDisplay balance={tokenBalance} variant="full" />
      </div>

      {/* Games grid */}
      <GameSelector context="plaza" />
    </div>
  )
}
