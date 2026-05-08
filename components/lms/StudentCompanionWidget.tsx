'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { PawPrint, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { CompanionSprite } from '@/components/companion/CompanionSprite'
import {
  awardCompanionXp,
  completeWorldActivity,
  createStarterCompanion,
  loadCompanionProfile,
  saveCompanionProfile,
  setCompanionBehaviorMode,
  STARTER_SPECIES,
  WORLD_ACTIVITIES,
  XP_EVENT_AMOUNTS,
  type CompanionBehaviorMode,
  type CompanionSpecies,
  type StudentCompanionProfile,
} from '@/lib/companion/ice-age-companion'

function speciesLabel(species: CompanionSpecies) {
  return STARTER_SPECIES.find((candidate) => candidate.id === species)?.label ?? 'Study companion'
}

function xpToNextLevel(profile: StudentCompanionProfile) {
  const nextLevelXp = profile.level <= 1 ? 200 : (profile.level + 1) * 100

  return Math.max(0, nextLevelXp - profile.xp)
}

export function StudentCompanionWidget({ compact = false }: { compact?: boolean }) {
  const [profile, setProfile] = useState<StudentCompanionProfile | null>(null)
  const [petName, setPetName] = useState('Tundra')
  const [species, setSpecies] = useState<CompanionSpecies>('woolly-mammoth')

  useEffect(() => {
    const stored = loadCompanionProfile()
    if (stored) {
      setProfile(stored)
      setPetName(stored.petName)
      setSpecies(stored.species)
    }
  }, [])

  const worldActivities = useMemo(() => Object.entries(WORLD_ACTIVITIES), [])

  function persist(nextProfile: StudentCompanionProfile) {
    setProfile(nextProfile)
    saveCompanionProfile(nextProfile)
  }

  function hatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    persist(createStarterCompanion({ species, petName }))
  }

  function award(source: 'lesson_completed' | 'assignment_submitted' | 'study_streak') {
    if (!profile) return

    persist(
      awardCompanionXp(profile, {
        amount: XP_EVENT_AMOUNTS[source],
        source,
        label:
          source === 'lesson_completed'
            ? 'Lesson focus'
            : source === 'assignment_submitted'
              ? 'Assignment submitted'
              : 'Study streak',
      })
    )
  }

  function setMode(behaviorMode: CompanionBehaviorMode) {
    if (!profile) return

    persist(setCompanionBehaviorMode(profile, behaviorMode))
  }

  return (
    <section className={`student-workspace-panel rounded-lg border border-white/75 bg-white/84 shadow-[0_18px_50px_rgba(5,44,38,0.18)] backdrop-blur-md ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-sky-400 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_8px_18px_rgba(13,148,136,0.22)]">
          <PawPrint className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-black leading-tight text-[#17352c]">Study companion</h2>
          <p className={`${compact ? 'text-xs' : 'text-sm'} font-semibold text-[#48675e]`}>Local pet progress, ready for sprite assets.</p>
        </div>
      </div>

      {profile ? (
        <div className={`mt-4 grid gap-4 ${compact ? '' : 'lg:grid-cols-[14rem_minmax(0,1fr)]'}`}>
          <div className="rounded-lg border border-emerald-100 bg-[linear-gradient(145deg,rgba(248,255,249,0.96),rgba(220,246,239,0.84))] p-4 text-center">
            <div className="mx-auto grid h-32 w-32 place-items-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_28%,#ffffff,#a7f3d0_46%,#14532d_100%)] shadow-[inset_0_1px_9px_rgba(255,255,255,0.9),0_12px_28px_rgba(17,94,89,0.18)]">
              <CompanionSprite species={profile.species} hatchStage={profile.hatchStage} mood={profile.mood} moving={profile.behaviorMode === 'follow-pointer'} size={112} />
            </div>
            <p className="mt-3 text-xl font-black text-[#17352c]">{profile.petName}</p>
            <p className="text-sm font-semibold text-[#48675e]">{speciesLabel(profile.species)}</p>
            <p className="mt-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-800">
              Level {profile.level} - {profile.hatchStage.replace(/-/g, ' ')}
            </p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-lg border border-emerald-100 bg-white/72 p-3">
              <div className="flex items-center justify-between gap-3 text-sm font-bold text-[#48675e]">
                <span>{profile.xp} XP</span>
                <span>{xpToNextLevel(profile)} to next level</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-emerald-100">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-400" style={{ width: `${Math.min(100, profile.xp % 100)}%` }} />
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <button type="button" onClick={() => award('lesson_completed')} className="rounded-lg bg-[#17352c] px-3 py-2 text-sm font-black text-white">
                Lesson XP
              </button>
              <button type="button" onClick={() => award('assignment_submitted')} className="rounded-lg bg-[#0f766e] px-3 py-2 text-sm font-black text-white">
                Submit XP
              </button>
              <button type="button" onClick={() => award('study_streak')} className="rounded-lg bg-[#b7791f] px-3 py-2 text-sm font-black text-white">
                Streak XP
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={profile.behaviorMode === 'stationary'}
                onClick={() => setMode('stationary')}
                className="rounded-full border border-emerald-200 bg-white/72 px-3 py-2 text-sm font-bold text-[#17352c]"
              >
                Stay nearby
              </button>
              <button
                type="button"
                aria-pressed={profile.behaviorMode === 'follow-pointer'}
                onClick={() => setMode('follow-pointer')}
                className="rounded-full border border-emerald-200 bg-white/72 px-3 py-2 text-sm font-bold text-[#17352c]"
              >
                Follow pointer
              </button>
              <Link href="/student/companion-world" className="rounded-full border border-emerald-200 bg-white/72 px-3 py-2 text-sm font-bold text-[#17352c]">
                Companion world
              </Link>
            </div>

            {!compact ? (
              <div className="grid gap-2">
                {worldActivities.map(([activityId, activity]) => {
                  const earned = profile.worldRewards.some((reward) => reward.activityId === activityId)

                  return (
                    <button
                      key={activityId}
                      type="button"
                      disabled={earned}
                      onClick={() => persist(completeWorldActivity(profile, activityId as keyof typeof WORLD_ACTIVITIES))}
                      className="flex items-center justify-between gap-3 rounded-lg border border-emerald-100 bg-white/72 px-3 py-2 text-left text-sm font-bold text-[#17352c] disabled:opacity-60"
                    >
                      <span>{activity.label}</span>
                      <span>{earned ? 'Earned' : `+${activity.xp} XP`}</span>
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <form onSubmit={hatch} className={`mt-3 grid ${compact ? 'gap-2' : 'gap-3'}`}>
          {!compact ? (
            <label className="grid gap-2 text-sm font-black text-[#17352c]">
              Pet name
              <input
                value={petName}
                onChange={(event) => setPetName(event.target.value)}
                className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
              />
            </label>
          ) : null}
          <div className={compact ? 'grid grid-cols-6 gap-1.5' : 'grid gap-2 sm:grid-cols-2 lg:grid-cols-3'}>
            {STARTER_SPECIES.map((starter) => (
              <button
                key={starter.id}
                type="button"
                aria-label={`Choose ${starter.label}`}
                aria-pressed={species === starter.id}
                onClick={() => setSpecies(starter.id)}
                title={starter.label}
                className={`flex items-center rounded-lg border text-left text-sm font-black ${
                  compact ? 'min-h-10 justify-center p-1' : 'min-h-20 gap-3 px-3 py-2'
                } ${
                  species === starter.id ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-emerald-100 bg-white/72 text-[#17352c]'
                }`}
              >
                <span className={`${compact ? 'h-8 w-8' : 'h-12 w-12'} grid shrink-0 place-items-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_28%,#ffffff,#a7f3d0_46%,#14532d_100%)]`}>
                  <CompanionSprite species={starter.id} hatchStage="hatched" state="idle" size={compact ? 32 : 48} />
                </span>
                <span className={compact ? 'sr-only' : ''}>{starter.label}</span>
              </button>
            ))}
          </div>
          {compact ? <p className="truncate text-xs font-black text-[#48675e]">{speciesLabel(species)}</p> : null}
          <div className="flex flex-wrap items-center gap-2">
            <button type="submit" className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#17352c] px-4 py-2 text-sm font-black text-white">
              <Sparkles className="h-4 w-4" />
              Hatch companion
            </button>
            {compact ? (
              <Link href="/student/settings" className="rounded-lg border border-emerald-200 bg-white/72 px-3 py-2 text-sm font-black text-[#17352c]">
                More
              </Link>
            ) : null}
          </div>
        </form>
      )}
    </section>
  )
}
