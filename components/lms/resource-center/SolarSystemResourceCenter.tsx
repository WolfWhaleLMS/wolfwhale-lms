'use client'

import dynamic from 'next/dynamic'
import {
  ArrowRight,
  BookOpen,
  CircleDot,
  Gauge,
  Globe2,
  Heart,
  Info,
  Library,
  Orbit,
  RotateCcw,
  Satellite,
  Settings,
  Sparkles,
  Star,
  Sun,
  Target,
  Telescope,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'

import { getSolarBodyById, solarBodies, type SolarBody, type SolarViewMode } from './solar-system'

const SolarSystemModelScene = dynamic(
  () => import('./SolarSystemModelScene').then((module) => module.SolarSystemModelScene),
  {
    ssr: false,
    loading: () => (
      <div
        role="img"
        aria-label="3D solar system model preview"
        className="grid h-full min-h-[360px] place-items-center rounded-lg bg-[#07111f]"
      >
        <div className="grid w-64 gap-3 rounded-lg border border-white/15 bg-slate-950/88 p-4 text-white shadow-[0_18px_50px_rgba(2,8,23,0.36)]">
          <span className="text-xs font-black uppercase text-sky-200">Loading 3D orbit map</span>
          <span className="font-serif text-xl text-white">Solar model</span>
          <span className="h-2 overflow-hidden rounded-full bg-white/15">
            <span className="block h-full w-2/3 rounded-full bg-[#ffca58]" />
          </span>
        </div>
      </div>
    ),
  },
)

type ModeOption = {
  id: SolarViewMode
  label: string
  Icon: LucideIcon
}

const modeOptions: ModeOption[] = [
  { id: 'orbit', label: 'Orbit', Icon: Orbit },
  { id: 'focus', label: 'Focus', Icon: CircleDot },
]

const initialBody = getSolarBodyById('earth')

function MiniBody({ body }: { body: SolarBody }) {
  const isRinged = body.id === 'saturn' || body.id === 'uranus'

  return (
    <span className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-[#101a2b] shadow-[0_10px_24px_rgba(2,8,23,0.28)]">
      {isRinged ? (
        <span
          className="absolute h-9 w-14 rotate-[-18deg] rounded-full border"
          style={{ borderColor: body.id === 'saturn' ? '#e9d6a3' : '#b8eef2' }}
        />
      ) : null}
      <span
        className="relative h-9 w-9 rounded-full shadow-[inset_-9px_-10px_0_rgba(2,8,23,0.34),inset_7px_7px_0_rgba(255,255,255,0.18),0_0_18px_rgba(255,255,255,0.12)]"
        style={{
          background:
            body.id === 'sun'
              ? `radial-gradient(circle at 34% 30%, #fff4bd, ${body.color} 45%, #e36d28 100%)`
              : `radial-gradient(circle at 35% 28%, #ffffff88, ${body.color} 42%, #152033 115%)`,
        }}
      />
    </span>
  )
}

function SolarRail({
  selectedBody,
  activeTopic,
  favorites,
  onSelectBody,
  onSelectTopic,
}: {
  selectedBody: SolarBody
  activeTopic: string
  favorites: Set<string>
  onSelectBody: (id: string) => void
  onSelectTopic: (id: string) => void
}) {
  return (
    <aside className="grid gap-4">
      <section className="rounded-lg border border-white/10 bg-[#111b2b]/88 p-5 text-white shadow-[0_14px_36px_rgba(2,8,23,0.24)]">
        <div className="mb-4 flex items-center justify-between border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-sky-100">
          <span className="inline-flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Solar Bodies
          </span>
          <Globe2 className="h-4 w-4" />
        </div>
        <div className="grid gap-2">
          {solarBodies.map((body) => {
            const selected = selectedBody.id === body.id

            return (
              <button
                key={body.id}
                type="button"
                onClick={() => onSelectBody(body.id)}
                className="grid min-h-[78px] w-full grid-cols-[58px_minmax(0,1fr)_28px] items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-left transition hover:-translate-y-0.5 hover:bg-white/8 hover:shadow-[0_14px_26px_rgba(2,8,23,0.22)] data-[selected=true]:border-[color:var(--solar-accent)] data-[selected=true]:bg-white/10"
                data-selected={selected}
                aria-pressed={selected}
              >
                <MiniBody body={body} />
                <span className="grid min-w-0 gap-1">
                  <span className="truncate font-serif text-[1.04rem] font-semibold leading-tight text-white">
                    {body.name}
                  </span>
                  <span className="truncate text-sm font-semibold text-slate-300">{body.type}</span>
                </span>
                <span className="grid h-7 w-7 place-items-center text-[color:var(--solar-accent)] opacity-90" aria-hidden="true">
                  <Star className="h-4 w-4" fill={favorites.has(body.id) ? 'currentColor' : 'none'} />
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-[#111b2b]/88 p-5 text-white shadow-[0_14px_36px_rgba(2,8,23,0.24)]">
        <div className="mb-4 flex items-center justify-between border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-sky-100">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Lesson Focus
          </span>
          <Info className="h-4 w-4" />
        </div>
        <div className="grid gap-2">
          {selectedBody.topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => onSelectTopic(topic.id)}
              className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-100 transition hover:translate-x-0.5 hover:bg-white/8 data-[selected=true]:bg-white/12"
              data-selected={activeTopic === topic.id}
            >
              <span className="h-3 w-3 rounded-full shadow-[0_0_0_5px_rgba(255,255,255,0.08)]" style={{ background: topic.color }} />
              {topic.name}
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}

function Stage({
  body,
  viewMode,
  showOrbits,
  autoRotate,
  resetKey,
  onModeChange,
  onShowOrbitsChange,
  onAutoRotateChange,
  onReset,
}: {
  body: SolarBody
  viewMode: SolarViewMode
  showOrbits: boolean
  autoRotate: boolean
  resetKey: number
  onModeChange: (mode: SolarViewMode) => void
  onShowOrbitsChange: (value: boolean) => void
  onAutoRotateChange: (value: boolean) => void
  onReset: () => void
}) {
  return (
    <section className="relative min-h-[760px] overflow-hidden rounded-lg border border-white/12 bg-[#07111f] p-5 text-white shadow-[0_18px_50px_rgba(2,8,23,0.32)] lg:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,202,88,0.22),transparent_22%),radial-gradient(circle_at_78%_16%,rgba(78,110,208,0.2),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.24),rgba(2,8,23,0.42))]" />

      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="max-w-xl font-serif text-5xl font-medium leading-[0.95] tracking-normal text-white lg:text-6xl">
            {body.name}
          </h3>
          <p className="mt-3 font-serif text-xl italic text-sky-100/78">{body.type}</p>
          <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-slate-200">{body.overview.body}</p>
        </div>

        <div className="grid w-full gap-3 rounded-lg border border-white/12 bg-slate-950/62 p-4 shadow-[0_14px_36px_rgba(2,8,23,0.24)] sm:w-[306px]">
          <span className="text-sm font-black uppercase text-sky-100">View Mode</span>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Solar view mode">
            {modeOptions.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onModeChange(id)}
                className="grid min-h-12 place-items-center rounded-lg border border-white/12 bg-white/8 text-slate-200 transition hover:-translate-y-0.5 hover:text-[color:var(--solar-accent)] data-[selected=true]:border-[color:var(--solar-accent)] data-[selected=true]:bg-white/14 data-[selected=true]:text-[color:var(--solar-accent)]"
                data-selected={viewMode === id}
                aria-pressed={viewMode === id}
                title={label}
              >
                <span className="sr-only">{label}</span>
                <Icon className="h-6 w-6" />
              </button>
            ))}
          </div>
          <label className="grid cursor-pointer grid-cols-[minmax(0,1fr)_52px] items-center gap-3 text-sm font-semibold text-slate-100">
            <span>Orbit Paths</span>
            <input
              type="checkbox"
              checked={showOrbits}
              onChange={(event) => onShowOrbitsChange(event.target.checked)}
              className="peer sr-only"
            />
            <span className="relative block h-7 w-[52px] rounded-full bg-white/18 transition peer-checked:bg-[var(--solar-accent)] after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-[0_2px_7px_rgba(2,8,23,0.28)] after:transition peer-checked:after:translate-x-6" />
          </label>
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-32 top-[360px] z-0 sm:top-56 lg:inset-x-6 lg:top-52">
        <SolarSystemModelScene
          body={body}
          viewMode={viewMode}
          showOrbits={showOrbits}
          autoRotate={autoRotate}
          resetKey={resetKey}
        />
      </div>

      <div className="absolute bottom-5 left-5 z-20 flex max-w-[calc(100%-2.5rem)] flex-wrap overflow-hidden rounded-lg border border-white/12 bg-slate-950/78 text-white shadow-[0_14px_36px_rgba(2,8,23,0.28)] backdrop-blur">
        <button
          type="button"
          className="inline-flex min-h-12 items-center gap-2 border-r border-white/12 px-4 text-sm font-semibold hover:bg-white/8 data-[selected=true]:text-[color:var(--solar-accent)]"
          data-selected={autoRotate}
          onClick={() => onAutoRotateChange(!autoRotate)}
        >
          <RotateCcw className="h-5 w-5" />
          Rotate
        </button>
        <button type="button" className="inline-flex min-h-12 items-center gap-2 border-r border-white/12 px-4 text-sm font-semibold hover:bg-white/8" onClick={() => onModeChange('focus')}>
          <CircleDot className="h-5 w-5" />
          Isolate
        </button>
        <button type="button" className="inline-flex min-h-12 items-center gap-2 px-4 text-sm font-semibold hover:bg-white/8" onClick={onReset}>
          <RotateCcw className="h-5 w-5" />
          Reset View
        </button>
      </div>
    </section>
  )
}

function DetailsPanel({
  body,
  activeTopic,
  favorites,
  mastery,
  onToggleFavorite,
}: {
  body: SolarBody
  activeTopic: string
  favorites: Set<string>
  mastery: number
  onToggleFavorite: (id: string) => void
}) {
  const topic = body.topics.find((item) => item.id === activeTopic) ?? body.topics[0]
  const comparedBody = getSolarBodyById(body.comparison)

  return (
    <aside className="grid gap-4">
      <section className="rounded-lg border border-white/10 bg-[#111b2b]/88 p-5 text-white shadow-[0_14px_36px_rgba(2,8,23,0.24)]">
        <div className="mb-4 flex items-center justify-between border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-sky-100">
          <span>Planet Details</span>
          <button type="button" onClick={() => onToggleFavorite(body.id)} aria-label={`Favorite ${body.name}`}>
            <Heart className="h-5 w-5 text-[color:var(--solar-accent)]" fill={favorites.has(body.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4">
          <span className="h-[72px] w-[72px] rounded-full shadow-[inset_-14px_-16px_0_rgba(2,8,23,0.3),inset_10px_10px_0_rgba(255,255,255,0.18),0_14px_28px_rgba(2,8,23,0.24)]" style={{ background: topic.color }} />
          <div>
            <h4 className="font-serif text-3xl leading-none text-white">{topic.name}</h4>
            <p className="mt-2 font-serif text-lg italic text-sky-100/72">{topic.subtitle}</p>
          </div>
        </div>
        <dl className="mt-5 grid gap-3">
          {topic.attributes.map((item) => (
            <div key={item.label} className="grid grid-cols-[0.85fr_1.15fr] items-center gap-3">
              <dt className="font-serif text-slate-300">{item.label}</dt>
              <dd className="font-serif text-white">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-lg border border-white/10 bg-[#111b2b]/88 p-5 text-white shadow-[0_14px_36px_rgba(2,8,23,0.24)]">
        <div className="mb-4 border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-sky-100">Astronomy Notes</div>
        <p className="font-serif leading-7 text-slate-100">{topic.note}</p>
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-dashed border-white/18 pt-4 text-sm font-black text-sky-100">
          <span>Fact: {topic.fact}</span>
          <Sparkles className="h-4 w-4" />
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-white/10 bg-[#111b2b]/88 p-5 text-white shadow-[0_14px_36px_rgba(2,8,23,0.24)]">
        <div className="border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-sky-100">
          <span className="inline-flex items-center gap-2">
            <Target className="h-4 w-4" />
            AI Tutor
          </span>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center gap-2 font-semibold text-slate-100">
            <Gauge className="h-4 w-4" />
            <span>Mastery</span>
            <strong className="ml-auto font-serif text-xl">{mastery}%</strong>
          </div>
          <span className="h-2.5 overflow-hidden rounded-full bg-white/15">
            <span className="block h-full rounded-full bg-[linear-gradient(90deg,var(--solar-accent),#ffffff)]" style={{ width: `${mastery}%` }} />
          </span>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/8 p-3">
          <span className="inline-flex items-center gap-2 text-sm font-black text-sky-100">
            <BookOpen className="h-4 w-4" />
            Current lesson focus
          </span>
          <p className="mt-2 font-serif leading-6 text-slate-100">
            Explain <strong className="text-[color:var(--solar-accent)]">{topic.name}</strong>, then compare {body.name} with {comparedBody.name}.
          </p>
        </div>
      </section>
    </aside>
  )
}

function BottomPanels({ body }: { body: SolarBody }) {
  const comparedBody = getSolarBodyById(body.comparison)
  const metrics = [
    { label: 'Orbit', value: body.orbitPeriod },
    { label: 'Day', value: body.dayLength },
    { label: 'Moons', value: body.moons },
    { label: 'Distance', value: body.distanceFromSun },
    { label: 'Temperature', value: body.temperature },
    { label: 'Gravity', value: body.gravity },
  ]

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.9fr)]">
      <div className="rounded-lg border border-white/10 bg-[#111b2b]/88 p-5 text-white shadow-[0_14px_36px_rgba(2,8,23,0.24)]">
        <div className="mb-4 flex items-center gap-2 border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-sky-100">
          Orbit Snapshot
          <Info className="h-4 w-4" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="min-h-[92px] rounded-lg border border-white/10 bg-white/8 p-3">
              <span className="text-xs font-black uppercase text-slate-300">{metric.label}</span>
              <strong className="mt-2 block font-serif text-lg leading-tight text-white">{metric.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#111b2b]/88 p-5 text-white shadow-[0_14px_36px_rgba(2,8,23,0.24)]">
        <div className="mb-4 flex items-center gap-2 border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-sky-100">
          Compare Worlds
          <Info className="h-4 w-4" />
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_58px_minmax(0,1fr)] items-center gap-3">
          <div className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-white/8 p-3">
            <MiniBody body={body} />
            <span className="grid min-w-0 gap-1">
              <strong className="truncate font-serif text-white">{body.name}</strong>
              <em className="truncate text-sm not-italic text-slate-300">You are here</em>
            </span>
          </div>
          <b className="grid h-[58px] w-[58px] place-items-center rounded-full bg-[var(--solar-accent)] text-sm text-slate-950 shadow-[0_12px_24px_rgba(255,202,88,0.18)]">VS</b>
          <div className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-white/8 p-3">
            <span className="grid min-w-0 gap-1 text-right">
              <strong className="truncate font-serif text-white">{comparedBody.name}</strong>
              <em className="truncate text-sm not-italic text-slate-300">{comparedBody.type}</em>
            </span>
            <MiniBody body={comparedBody} />
          </div>
        </div>
        <button type="button" className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-black text-[#07111f]">
          Open Comparison View
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
}

export function SolarSystemResourceCenter() {
  const [selectedBodyId, setSelectedBodyId] = useState(initialBody.id)
  const [activeTopic, setActiveTopic] = useState(initialBody.defaultTopic)
  const [viewMode, setViewMode] = useState<SolarViewMode>('orbit')
  const [showOrbits, setShowOrbits] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)
  const [resetKey, setResetKey] = useState(0)
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set([initialBody.id]))
  const [viewedBodies, setViewedBodies] = useState<Set<string>>(() => new Set([initialBody.id]))
  const [viewedTopicKeys, setViewedTopicKeys] = useState<Set<string>>(
    () => new Set([`${initialBody.id}:${initialBody.defaultTopic}`]),
  )

  const selectedBody = useMemo(() => getSolarBodyById(selectedBodyId), [selectedBodyId])
  const totalTopicCount = useMemo(() => solarBodies.reduce((total, body) => total + body.topics.length, 0), [])
  const mastery = useMemo(() => {
    const bodyCoverage = viewedBodies.size / solarBodies.length
    const topicCoverage = viewedTopicKeys.size / totalTopicCount

    return Math.round((bodyCoverage * 0.42 + topicCoverage * 0.58) * 100)
  }, [totalTopicCount, viewedBodies, viewedTopicKeys])

  useEffect(() => {
    const hasActiveTopic = selectedBody.topics.some((topic) => topic.id === activeTopic)
    if (!hasActiveTopic) {
      return
    }

    setViewedBodies((current) => new Set(current).add(selectedBody.id))
    setViewedTopicKeys((current) => new Set(current).add(`${selectedBody.id}:${activeTopic}`))
  }, [activeTopic, selectedBody])

  function handleSelectBody(id: string) {
    const nextBody = getSolarBodyById(id)

    setSelectedBodyId(nextBody.id)
    setActiveTopic(nextBody.defaultTopic)
  }

  function toggleFavorite(id: string) {
    setFavorites((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }

  const shellStyle = {
    '--solar-accent': selectedBody.accent,
    '--solar-accent-soft': selectedBody.accentSoft,
  } as CSSProperties

  return (
    <section
      className="overflow-hidden rounded-lg border border-white/12 bg-[#0b1423] p-3 text-white shadow-[0_18px_50px_rgba(2,8,23,0.32)] sm:p-4"
      style={shellStyle}
      aria-label="Solar System Studio resource"
    >
      <div className="mb-4 flex flex-col gap-3 border-b border-white/12 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[var(--solar-accent-soft)] text-[color:var(--solar-accent)] shadow-[0_10px_28px_rgba(2,8,23,0.24)]">
            <Telescope className="h-7 w-7" />
          </span>
          <div className="min-w-0">
            <h2 className="font-serif text-4xl font-medium leading-none text-white">Solar System Studio</h2>
            <p className="mt-2 text-sm font-semibold text-sky-100/78">Explore planetary scale, motion, and astronomy evidence</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2" aria-label="Solar System resource links">
          <a href="#solar-system-studio" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-bold text-[#07111f]">
            <Library className="h-4 w-4" />
            Solar studio
          </a>
          <a href="#course-files" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/12 bg-white/8 px-4 text-sm font-bold text-white">
            <BookOpen className="h-4 w-4" />
            Course files
          </a>
          <a href="#course-files" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/12 bg-white/8 px-4 text-sm font-bold text-white">
            <Settings className="h-4 w-4" />
            Settings
          </a>
        </nav>
      </div>

      <div id="solar-system-studio" className="grid gap-4 xl:grid-cols-[280px_minmax(520px,1fr)_340px]">
        <SolarRail
          selectedBody={selectedBody}
          activeTopic={activeTopic}
          favorites={favorites}
          onSelectBody={handleSelectBody}
          onSelectTopic={setActiveTopic}
        />
        <div className="grid gap-4">
          <Stage
            body={selectedBody}
            viewMode={viewMode}
            showOrbits={showOrbits}
            autoRotate={autoRotate}
            resetKey={resetKey}
            onModeChange={setViewMode}
            onShowOrbitsChange={setShowOrbits}
            onAutoRotateChange={setAutoRotate}
            onReset={() => setResetKey((key) => key + 1)}
          />
          <BottomPanels body={selectedBody} />
        </div>
        <DetailsPanel
          body={selectedBody}
          activeTopic={activeTopic}
          favorites={favorites}
          mastery={mastery}
          onToggleFavorite={toggleFavorite}
        />
      </div>

      <div className="mt-4 grid gap-3 rounded-lg border border-white/12 bg-white/8 p-4 text-sm font-semibold text-slate-100 sm:grid-cols-3">
        <span className="inline-flex items-center gap-2">
          <Satellite className="h-4 w-4 text-[color:var(--solar-accent)]" />
          GLB-ready planet slots
        </span>
        <span className="inline-flex items-center gap-2">
          <Orbit className="h-4 w-4 text-[color:var(--solar-accent)]" />
          Orbit and focus modes
        </span>
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[color:var(--solar-accent)]" />
          {solarBodies.length} solar bodies, {totalTopicCount} lesson targets
        </span>
      </div>
    </section>
  )
}
