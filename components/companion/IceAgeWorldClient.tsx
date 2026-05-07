'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, CheckCircle2, ChevronLeft, Gem, MapPin } from 'lucide-react'
import { CompanionSprite } from '@/components/companion/CompanionSprite'
import {
  STARTER_SPECIES,
  completeWorldActivity,
  createStarterCompanion,
  loadCompanionProfile,
  saveCompanionProfile,
  type CompanionWorldActivityId,
  type StudentCompanionProfile,
} from '@/lib/companion/ice-age-companion'
import type { IceAgeCompanionSummary } from '@/components/companion/IceAgeCompanionClient'

const rooms = [
  {
    id: 'glacier-commons',
    title: 'Glacier Commons',
    description: 'A calm hub for checking in, choosing the next helpful action, and seeing your companion.',
    activityId: 'glacier-commons-check-in',
    action: 'Check in',
  },
  {
    id: 'mammoth-library',
    title: 'Mammoth Library',
    description: 'Open course notes, reading tasks, and lesson links with your companion nearby.',
    activityId: 'mammoth-library-notes',
    action: 'Review notes',
  },
  {
    id: 'quiz-cave',
    title: 'Quiz Cave',
    description: 'Practice questions and quiz review live here while the full mini-game system waits for later.',
    activityId: 'quiz-cave-practice',
    action: 'Practice quiz',
  },
] as const

export function IceAgeWorldClient({ summary }: { summary: IceAgeCompanionSummary }) {
  const [profile, setProfile] = useState<StudentCompanionProfile | null>(null)
  const [activeRoom, setActiveRoom] = useState<(typeof rooms)[number]['id']>('glacier-commons')

  useEffect(() => {
    const saved = loadCompanionProfile()
    const starter = saved ?? createStarterCompanion({ species: STARTER_SPECIES[0].id, petName: 'Tundra' })
    setProfile(starter)
    if (!saved) saveCompanionProfile(starter)
  }, [])

  function completeActivity(activityId: CompanionWorldActivityId) {
    if (!profile) return
    const updated = completeWorldActivity(profile, activityId)
    setProfile(updated)
    saveCompanionProfile(updated)
  }

  const room = rooms.find((candidate) => candidate.id === activeRoom) ?? rooms[0]
  const earnedActivityIds = new Set(profile?.worldRewards.map((reward) => reward.activityId) ?? [])

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5">
        <Link href="/student" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-cyan-200 hover:text-white">
          <ChevronLeft className="h-4 w-4" />
          Back to student dashboard
        </Link>

        <section className="overflow-hidden rounded-lg border border-cyan-200/20 bg-slate-900">
          <div className="flex flex-col gap-4 border-b border-cyan-200/10 px-5 py-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-cyan-200">WolfWhale Ice Age Companion</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Glacier Commons</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Single-player learning world prototype. No chat, trading, or multiplayer yet.</p>
            </div>
            <div className="rounded-md border border-cyan-200/20 bg-cyan-950/30 px-3 py-2 text-sm font-bold text-cyan-100">
              {profile ? `${profile.petName} · Level ${profile.level} · ${profile.xp} XP` : 'Loading companion'}
            </div>
          </div>

          <div className="grid min-h-[560px] lg:grid-cols-[260px_1fr]">
            <nav className="grid content-start gap-2 border-b border-cyan-200/10 p-4 lg:border-b-0 lg:border-r">
              {rooms.map((candidate) => {
                const earned = earnedActivityIds.has(candidate.activityId)
                return (
                  <button
                    key={candidate.id}
                    type="button"
                    className={`rounded-md border px-3 py-3 text-left transition ${
                      activeRoom === candidate.id
                        ? 'border-cyan-300 bg-cyan-400/10 text-white'
                        : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-cyan-500'
                    }`}
                    onClick={() => setActiveRoom(candidate.id)}
                  >
                    <span className="flex items-center justify-between gap-2 text-sm font-black">
                      {candidate.title}
                      {earned ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : null}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-400">{candidate.description}</span>
                  </button>
                )
              })}
            </nav>

            <div className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.22),transparent_26%),linear-gradient(180deg,#0f2742_0%,#0f172a_50%,#111827_100%)] p-5">
              <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,rgba(226,245,255,0.18))]" />
              <div className="relative grid min-h-[510px] content-between gap-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  <WorldDoor title="Mammoth Library" active={activeRoom === 'mammoth-library'} onClick={() => setActiveRoom('mammoth-library')} />
                  <WorldDoor title="Glacier Commons" active={activeRoom === 'glacier-commons'} onClick={() => setActiveRoom('glacier-commons')} />
                  <WorldDoor title="Quiz Cave" active={activeRoom === 'quiz-cave'} onClick={() => setActiveRoom('quiz-cave')} />
                </div>

                <div className="grid gap-5 lg:grid-cols-[1fr_320px] lg:items-end">
                  <div className="min-h-64 rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <div className="flex items-center gap-2 text-cyan-100">
                      <MapPin className="h-4 w-4" />
                      <h2 className="text-xl font-black">{room.title}</h2>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{room.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-amber-300 px-4 text-sm font-black text-slate-950 hover:bg-amber-200 disabled:opacity-70"
                        disabled={earnedActivityIds.has(room.activityId)}
                        onClick={() => completeActivity(room.activityId)}
                      >
                        <Gem className="h-4 w-4" />
                        {earnedActivityIds.has(room.activityId) ? 'Reward earned' : `${room.action} for XP`}
                      </button>
                      <Link href={summary.continueHref} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-cyan-200/40 px-4 text-sm font-bold text-cyan-100 hover:bg-cyan-400/10">
                        <BookOpen className="h-4 w-4" />
                        Continue learning
                      </Link>
                    </div>
                  </div>

                  <div className="flex min-h-64 items-end justify-center rounded-lg border border-white/10 bg-slate-950/30 p-4">
                    {profile ? <CompanionSprite species={profile.species} hatchStage={profile.hatchStage} mood={profile.mood} moving size={168} /> : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function WorldDoor({ title, active, onClick }: { title: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`min-h-28 rounded-lg border p-3 text-left transition ${
        active ? 'border-amber-200 bg-amber-200/20' : 'border-white/10 bg-slate-950/30 hover:border-cyan-200/60'
      }`}
      onClick={onClick}
    >
      <span className="text-sm font-black">{title}</span>
      <span className="mt-8 block h-2 rounded-full bg-white/30" />
    </button>
  )
}
