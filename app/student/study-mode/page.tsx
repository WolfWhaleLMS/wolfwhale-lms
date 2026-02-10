'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Moon,
  Music,
  Volume2,
  Maximize,
  Minimize,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import FocusTimer from '@/components/study-mode/FocusTimer'
import MusicSelector, { type MusicType, MUSIC_OPTIONS } from '@/components/study-mode/MusicSelector'
import StudyStats from '@/components/study-mode/StudyStats'
import { recordStudySession, getStudyStats } from '@/app/actions/study-mode'

type SessionState = 'setup' | 'active' | 'complete'

const DURATION_PRESETS = [15, 30, 45, 60] as const

export default function StudyModePage() {
  // Session config
  const [duration, setDuration] = useState(30)
  const [customDuration, setCustomDuration] = useState('')
  const [musicType, setMusicType] = useState<MusicType>('silent')

  // Session state
  const [sessionState, setSessionState] = useState<SessionState>('setup')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [dndEnabled, setDndEnabled] = useState(false)

  // Completion state
  const [xpAwarded, setXpAwarded] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Stats
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    longestSession: 0,
    currentStreak: 0,
    weeklyMinutes: 0,
  })

  // Load stats on mount
  useEffect(() => {
    getStudyStats()
      .then(setStats)
      .catch(() => {})
  }, [])

  // Track actual elapsed time for partial completions
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const handleTick = useCallback((remainingSeconds: number) => {
    const totalSec = duration * 60
    setElapsedSeconds(totalSec - remainingSeconds)
  }, [duration])

  const handleComplete = useCallback(async () => {
    setSessionState('complete')
    setShowConfetti(true)

    const actualMinutes = Math.max(1, Math.round(elapsedSeconds / 60) || duration)

    try {
      const result = await recordStudySession(actualMinutes, musicType)
      setXpAwarded(result.xpAwarded)
    } catch {
      // If recording fails, still show completion
      setXpAwarded(0)
    }

    // Refresh stats
    getStudyStats()
      .then(setStats)
      .catch(() => {})

    // Hide confetti after 4 seconds
    setTimeout(() => setShowConfetti(false), 4000)
  }, [duration, elapsedSeconds, musicType])

  const handleStartSession = () => {
    setElapsedSeconds(0)
    setSessionState('active')
  }

  const handleNewSession = () => {
    setSessionState('setup')
    setXpAwarded(0)
    setElapsedSeconds(0)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  // Listen for fullscreen exit via Escape
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const selectedMusicOption = MUSIC_OPTIONS.find((o) => o.id === musicType)

  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.12_0.04_260)]">
      {/* Ambient background blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-20%] top-[-10%] h-[600px] w-[600px] blob-ocean animate-pulse-soft opacity-30" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[500px] w-[500px] blob-teal animate-float opacity-20" />
        <div className="absolute bottom-[20%] left-[30%] h-[300px] w-[300px] blob-midnight animate-pulse-soft opacity-25" />
      </div>

      {/* Confetti / Celebration overlay */}
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-[confettiFall_3s_ease-in_forwards]"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-5%',
                animationDelay: `${Math.random() * 1.5}s`,
                width: `${6 + Math.random() * 8}px`,
                height: `${6 + Math.random() * 8}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                background: [
                  'oklch(0.70 0.12 180)',
                  'oklch(0.80 0.15 85)',
                  'oklch(0.55 0.22 285)',
                  'oklch(0.68 0.17 160)',
                  'oklch(0.35 0.08 220)',
                ][Math.floor(Math.random() * 5)],
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
          <style>{`
            @keyframes confettiFall {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link
          href="/student/dashboard"
          className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Music indicator */}
          {musicType !== 'silent' && sessionState === 'active' && (
            <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/60">
              <Music className="size-3.5 animate-pulse-soft text-primary" />
              <span>{selectedMusicOption?.name}</span>
            </div>
          )}

          {/* DND toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDndEnabled(!dndEnabled)}
            className={`rounded-full ${dndEnabled ? 'text-primary' : 'text-white/40 hover:text-white/70'}`}
            aria-label="Toggle Do Not Disturb"
            title={dndEnabled ? 'Do Not Disturb: On' : 'Do Not Disturb: Off'}
          >
            <Moon className="size-4" />
          </Button>

          {/* Fullscreen toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="rounded-full text-white/40 hover:text-white/70"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize className="size-4" />
            ) : (
              <Maximize className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-2xl px-6">
        {/* ========================= SETUP VIEW ========================= */}
        {sessionState === 'setup' && (
          <div className="animate-fade-in-up space-y-10 pt-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Study Mode
              </h1>
              <p className="mt-2 text-white/50">
                Set your timer, pick your vibe, and focus.
              </p>
            </div>

            {/* Duration selection */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">
                Duration
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                {DURATION_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setDuration(preset)
                      setCustomDuration('')
                    }}
                    className={`rounded-2xl border px-5 py-3 text-sm font-medium transition-all ${
                      duration === preset && !customDuration
                        ? 'glow-border-ocean border-primary/50 bg-primary/15 text-white'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white/80'
                    }`}
                  >
                    {preset} min
                  </button>
                ))}
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={180}
                    placeholder="Custom"
                    value={customDuration}
                    onChange={(e) => {
                      setCustomDuration(e.target.value)
                      const val = parseInt(e.target.value, 10)
                      if (val > 0 && val <= 180) setDuration(val)
                    }}
                    className="w-24 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-white placeholder-white/30 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                    aria-label="Custom duration in minutes"
                  />
                </div>
              </div>
            </div>

            {/* Music selection */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">
                Ambient Sound
              </h2>
              <MusicSelector selected={musicType} onSelect={setMusicType} />
            </div>

            {/* Start button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleStartSession}
                size="lg"
                className="whale-gradient rounded-full px-12 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
              >
                Start {duration} Minute Session
              </Button>
            </div>

            {/* Stats section */}
            <div className="space-y-4 pb-12">
              <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">
                Your Stats
              </h2>
              <StudyStats {...stats} variant="dark" />
            </div>
          </div>
        )}

        {/* ========================= ACTIVE VIEW ========================= */}
        {sessionState === 'active' && (
          <div className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center">
            <div className="animate-fade-in-up">
              <FocusTimer
                duration={duration}
                onComplete={handleComplete}
                onTick={handleTick}
              />
            </div>

            {/* Minimal music indicator at bottom */}
            <div className="mt-12 flex items-center gap-2 text-white/30">
              {musicType !== 'silent' ? (
                <>
                  <Volume2 className="size-4" />
                  <span className="text-sm">{selectedMusicOption?.name}</span>
                </>
              ) : (
                <span className="text-sm">Silent mode</span>
              )}
            </div>
          </div>
        )}

        {/* ========================= COMPLETE VIEW ========================= */}
        {sessionState === 'complete' && (
          <div className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center">
            <div className="animate-fade-in-up space-y-8 text-center">
              {/* Celebration icon */}
              <div className="relative mx-auto flex size-28 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-xl" />
                <div className="relative flex size-28 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                  <Sparkles className="size-12 text-primary" />
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white">
                  Session Complete!
                </h2>
                <p className="mt-2 text-white/50">
                  Great focus! You studied for {Math.max(1, Math.round(elapsedSeconds / 60) || duration)} minutes.
                </p>
              </div>

              {/* XP Award */}
              {xpAwarded > 0 && (
                <div className="glass-panel-ocean mx-auto inline-flex items-center gap-3 rounded-2xl px-8 py-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/20">
                    <Sparkles className="size-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">+{xpAwarded} XP</p>
                    <p className="text-xs text-white/50">Focus session bonus</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Button
                  onClick={handleNewSession}
                  size="lg"
                  className="whale-gradient rounded-full text-white shadow-lg shadow-primary/30"
                >
                  Start Another Session
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  asChild
                  className="rounded-full text-white/60 hover:text-white"
                >
                  <Link href="/student/dashboard">Back to Dashboard</Link>
                </Button>
              </div>

              {/* Updated stats */}
              <div className="pt-6">
                <StudyStats {...stats} variant="dark" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
