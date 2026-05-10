'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BookOpen, ChevronRight, EyeOff, Map, MousePointer2, PanelRightOpen, Sparkles, X } from 'lucide-react'
import { CompanionSprite } from '@/components/companion/CompanionSprite'
import {
  STARTER_SPECIES,
  XP_EVENT_AMOUNTS,
  awardCompanionXp,
  createStarterCompanion,
  loadCompanionProfile,
  saveCompanionProfile,
  setCompanionBehaviorMode,
  type CompanionSpecies,
  type StudentCompanionProfile,
} from '@/lib/companion/fish-companion'
import { loadCompanionProfileFromServer, saveCompanionProfileEverywhere, saveCompanionProfileToServer } from '@/lib/companion/profile-sync'
import { cn } from '@/lib/utils'

export interface SeaCompanionSummary {
  progressLabel: string
  progressValue: number
  nextLesson: string
  nextAssignment: string
  continueHref: string
}

export function SeaCompanionClient({ summary }: { summary: SeaCompanionSummary }) {
  const [profile, setProfile] = useState<StudentCompanionProfile | null>(null)
  const [ready, setReady] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let active = true
    const saved = loadCompanionProfile()
    setProfile(saved)
    setPanelOpen(!saved)
    setReady(true)

    void loadCompanionProfileFromServer().then((serverProfile) => {
      if (!active) return
      if (serverProfile) {
        setProfile(serverProfile)
        setPanelOpen(false)
        saveCompanionProfile(serverProfile)
        return
      }
      if (saved) {
        void saveCompanionProfileToServer(saved)
      }
    })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!profile || profile.behaviorMode !== 'follow-pointer') return

    function handlePointerMove(event: PointerEvent) {
      setPointer({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [profile])

  const launcherStyle = useMemo(() => {
    if (!profile || profile.behaviorMode !== 'follow-pointer' || pointer.x === 0) return undefined

    return {
      left: Math.min(window.innerWidth - 74, Math.max(20, pointer.x + 28)),
      top: Math.min(window.innerHeight - 90, Math.max(20, pointer.y + 32)),
      right: 'auto',
      bottom: 'auto',
    }
  }, [pointer, profile])

  if (!ready || hidden) return null

  function persist(nextProfile: StudentCompanionProfile) {
    setProfile(nextProfile)
    saveCompanionProfileEverywhere(nextProfile)
  }

  function awardQuickXp() {
    if (!profile) return
    persist(
      awardCompanionXp(profile, {
        amount: XP_EVENT_AMOUNTS.course_task_checked,
        source: 'course_task_checked',
        label: 'Checked off a course task',
      })
    )
  }

  function setMode(mode: StudentCompanionProfile['behaviorMode']) {
    if (!profile) return
    persist(setCompanionBehaviorMode(profile, mode))
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open fish companion"
        className="fixed bottom-5 right-5 z-50 flex h-[86px] w-[86px] items-center justify-center rounded-full border border-cyan-200/60 bg-white/90 shadow-2xl shadow-cyan-900/20 backdrop-blur transition hover:-translate-y-1 hover:shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-cyan-300/20 dark:bg-slate-950/90"
        onClick={() => setPanelOpen(true)}
        style={launcherStyle}
      >
        {profile ? (
          <CompanionSprite species={profile.species} hatchStage={profile.hatchStage} mood={profile.mood} size={68} moving={profile.behaviorMode === 'follow-pointer'} />
        ) : (
          <CompanionSprite species="clownfish" hatchStage="egg" size={62} />
        )}
      </button>

      {panelOpen ? (
        <aside
          aria-label="WolfWhale fish companion"
          className="fixed bottom-4 right-4 z-50 flex max-h-[calc(100vh-2rem)] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-cyan-200/70 bg-white text-slate-950 shadow-2xl shadow-slate-950/25 dark:border-cyan-300/20 dark:bg-slate-950 dark:text-white"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              <h2 className="text-sm font-bold">Fish companion</h2>
            </div>
            <div className="flex gap-1">
              <button type="button" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-900" onClick={() => setHidden(true)} aria-label="Hide companion">
                <EyeOff className="h-4 w-4" />
              </button>
              <button type="button" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-900" onClick={() => setPanelOpen(false)} aria-label="Close companion">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto p-4">
            {profile ? (
              <CompanionPanel profile={profile} summary={summary} onModeChange={setMode} onAwardQuickXp={awardQuickXp} />
            ) : (
              <CompanionOnboarding onCreate={persist} />
            )}
          </div>
        </aside>
      ) : null}
    </>
  )
}

function CompanionOnboarding({ onCreate }: { onCreate: (profile: StudentCompanionProfile) => void }) {
  const [species, setSpecies] = useState<CompanionSpecies>('clownfish')
  const [petName, setPetName] = useState('Bubbles')

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        onCreate(createStarterCompanion({ species, petName }))
      }}
    >
      <div>
        <p className="text-sm font-semibold">Choose a starter fish egg</p>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Your fish grows from learning XP and never gets punished or dies.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {STARTER_SPECIES.map((option) => (
          <button
            key={option.id}
            type="button"
            className={cn(
              'rounded-md border p-3 text-left text-xs font-semibold transition hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40',
              species === option.id ? 'border-cyan-500 bg-cyan-50 dark:border-cyan-300 dark:bg-cyan-950/50' : 'border-slate-200 dark:border-slate-800'
            )}
            onClick={() => setSpecies(option.id)}
          >
            <CompanionSprite species={option.id} hatchStage="hatched" size={56} />
            <span className="mt-2 block">{option.label}</span>
          </button>
        ))}
      </div>
      <label className="grid gap-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
        Fish name
        <input
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          maxLength={32}
          value={petName}
          onChange={(event) => setPetName(event.target.value)}
        />
      </label>
      <button type="submit" className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-cyan-700 px-4 text-sm font-bold text-white hover:bg-cyan-800">
        Hatch my fish
        <ChevronRight className="h-4 w-4" />
      </button>
    </form>
  )
}

function CompanionPanel({
  profile,
  summary,
  onModeChange,
  onAwardQuickXp,
}: {
  profile: StudentCompanionProfile
  summary: SeaCompanionSummary
  onModeChange: (mode: StudentCompanionProfile['behaviorMode']) => void
  onAwardQuickXp: () => void
}) {
  const xpToHatch = Math.max(0, 100 - profile.xp)

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4 rounded-lg border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-300/20 dark:bg-cyan-950/30">
        <CompanionSprite species={profile.species} hatchStage={profile.hatchStage} mood={profile.mood} size={92} />
        <div>
          <p className="text-lg font-black">{profile.petName}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Level {profile.level} · {profile.hatchStage === 'hatched' ? profile.mood : `${xpToHatch} XP to hatch`}</p>
          <p className="mt-1 text-xs font-semibold text-cyan-700 dark:text-cyan-200">{profile.xp} companion XP</p>
        </div>
      </div>

      <div className="grid gap-2 rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="font-semibold">{summary.progressLabel}</span>
          <span className="font-bold text-cyan-700 dark:text-cyan-200">{summary.progressValue}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <span className="block h-full rounded-full bg-cyan-600" style={{ width: `${summary.progressValue}%` }} />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Next lesson: {summary.nextLesson}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Next due item: {summary.nextAssignment}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link href={summary.continueHref} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950">
          <BookOpen className="h-4 w-4" />
          Continue
        </Link>
        <Link href="/student/companion-world" className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-cyan-300 px-3 text-sm font-bold text-cyan-700 hover:bg-cyan-50 dark:text-cyan-200 dark:hover:bg-cyan-950/40">
          <Map className="h-4 w-4" />
          World
        </Link>
      </div>

      <div className="grid gap-2 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
        <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Behavior</p>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="rounded-md border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900" onClick={() => onModeChange('stationary')}>
            Stationary
          </button>
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900" onClick={() => onModeChange('follow-pointer')}>
            <MousePointer2 className="h-3.5 w-3.5" />
            Follow
          </button>
        </div>
      </div>

      <button type="button" className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-amber-400 px-4 text-sm font-black text-slate-950 hover:bg-amber-300" onClick={onAwardQuickXp}>
        <PanelRightOpen className="h-4 w-4" />
        Check off a task (+10 XP)
      </button>

      <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
        <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Recent XP</p>
        {profile.recentXpEvents.length > 0 ? (
          <ul className="mt-2 grid gap-1 text-xs">
            {profile.recentXpEvents.map((event) => (
              <li key={`${event.occurredAt}-${event.label}`} className="flex justify-between gap-2">
                <span>{event.label}</span>
                <span className="font-bold text-cyan-700 dark:text-cyan-200">+{event.amount}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Learning actions will show up here.</p>
        )}
      </div>
    </div>
  )
}
