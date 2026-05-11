'use client'

import dynamic from 'next/dynamic'
import {
  Activity,
  ArrowRight,
  BookOpen,
  Boxes,
  CircleDot,
  HeartPulse,
  Info,
  Library,
  RotateCcw,
  Settings,
  Sparkles,
  Star,
  Target,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'

import { bodySystems, getBodySystemById, type BodyFocusTopic, type BodySystem, type BodyViewMode } from './human-body'

const HumanBodyModelScene = dynamic(
  () => import('./HumanBodyModelScene').then((module) => module.HumanBodyModelScene),
  {
    ssr: false,
    loading: () => (
      <div
        role="img"
        aria-label="3D human body model preview"
        className="grid h-full min-h-[360px] place-items-center rounded-lg bg-[#0c2528]"
      >
        <div className="grid w-64 gap-3 rounded-lg border border-white/15 bg-[#102b2f]/90 p-4 text-white shadow-[0_18px_50px_rgba(4,24,26,0.3)]">
          <span className="text-xs font-black uppercase text-[#9be3d7]">Loading biology model</span>
          <span className="font-serif text-xl text-white">Human body model</span>
          <span className="h-2 overflow-hidden rounded-full bg-white/15">
            <span className="block h-full w-2/3 rounded-full bg-[#c63f55]" />
          </span>
        </div>
      </div>
    ),
  },
)

type ModeOption = {
  id: BodyViewMode
  label: string
  Icon: LucideIcon
}

const modeOptions: ModeOption[] = [
  { id: 'inspect', label: 'Inspect', Icon: CircleDot },
  { id: 'compare', label: 'Compare', Icon: Boxes },
]

const initialSystem = getBodySystemById('circulatory')

function MiniSystem({ system }: { system: BodySystem }) {
  return (
    <span className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/14 bg-[#102b2f] shadow-[0_12px_24px_rgba(4,24,26,0.22)]">
      <span className="absolute inset-2 rounded-full opacity-25" style={{ background: system.accent }} />
      <span className="relative h-8 w-8 rounded-full shadow-[inset_-8px_-9px_0_rgba(4,24,26,0.24),inset_7px_7px_0_rgba(255,255,255,0.16)]" style={{ background: system.color }} />
    </span>
  )
}

function BodyRail({
  selectedSystem,
  activeTopic,
  favorites,
  onSelectSystem,
  onSelectTopic,
}: {
  selectedSystem: BodySystem
  activeTopic: string
  favorites: Set<string>
  onSelectSystem: (id: string) => void
  onSelectTopic: (id: string) => void
}) {
  return (
    <aside className="grid gap-4">
      <section className="rounded-lg border border-white/12 bg-[#102b2f]/92 p-5 text-white shadow-[0_14px_36px_rgba(4,24,26,0.24)]">
        <div className="mb-4 flex items-center justify-between border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-[#9be3d7]">
          <span className="inline-flex items-center gap-2">
            <HeartPulse className="h-4 w-4" />
            Body Systems
          </span>
          <Activity className="h-4 w-4" />
        </div>
        <div className="grid gap-2">
          {bodySystems.map((system) => {
            const selected = selectedSystem.id === system.id

            return (
              <button
                key={system.id}
                type="button"
                onClick={() => onSelectSystem(system.id)}
                className="grid min-h-[78px] w-full grid-cols-[58px_minmax(0,1fr)_28px] items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-left transition hover:-translate-y-0.5 hover:bg-white/8 data-[selected=true]:border-[color:var(--body-accent)] data-[selected=true]:bg-white/10"
                data-selected={selected}
                aria-pressed={selected}
                aria-label={`Select ${system.name} body system`}
              >
                <MiniSystem system={system} />
                <span className="grid min-w-0 gap-1">
                  <span className="truncate font-serif text-[1.04rem] font-semibold leading-tight text-white">{system.name}</span>
                  <span className="truncate text-sm font-semibold text-[#c8ddd9]">{system.type}</span>
                </span>
                <span className="grid h-7 w-7 place-items-center text-[color:var(--body-accent)] opacity-90" aria-hidden="true">
                  <Star className="h-4 w-4" fill={favorites.has(system.id) ? 'currentColor' : 'none'} />
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="rounded-lg border border-white/12 bg-[#102b2f]/92 p-5 text-white shadow-[0_14px_36px_rgba(4,24,26,0.24)]">
        <div className="mb-4 flex items-center justify-between border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-[#9be3d7]">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Focus Points
          </span>
          <Info className="h-4 w-4" />
        </div>
        <div className="grid gap-2">
          {selectedSystem.topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => onSelectTopic(topic.id)}
              className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#eef8f1] transition hover:translate-x-0.5 hover:bg-white/8 data-[selected=true]:bg-white/12"
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
  system,
  viewMode,
  autoRotate,
  resetKey,
  onModeChange,
  onAutoRotateChange,
  onReset,
}: {
  system: BodySystem
  viewMode: BodyViewMode
  autoRotate: boolean
  resetKey: number
  onModeChange: (mode: BodyViewMode) => void
  onAutoRotateChange: (value: boolean) => void
  onReset: () => void
}) {
  return (
    <section className="relative min-h-[720px] overflow-hidden rounded-lg border border-white/12 bg-[#0c2528] p-5 text-white shadow-[0_18px_50px_rgba(4,24,26,0.28)] lg:p-7">
      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="max-w-xl font-serif text-5xl font-medium leading-[0.95] tracking-normal text-white lg:text-6xl">{system.name}</h3>
          <p className="mt-3 font-serif text-xl italic text-[#c8ddd9]">{system.type}</p>
          <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-[#d6e6dc]">{system.overview.body}</p>
        </div>

        <div className="grid w-full gap-3 rounded-lg border border-white/12 bg-white/8 p-4 sm:w-[300px]">
          <span className="text-sm font-black uppercase text-[#9be3d7]">View Mode</span>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Human body view mode">
            {modeOptions.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onModeChange(id)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/8 px-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/12 data-[selected=true]:border-[color:var(--body-accent)] data-[selected=true]:bg-[var(--body-accent)]"
                data-selected={viewMode === id}
                aria-pressed={viewMode === id}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>

          <label className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-white/12 bg-white/8 px-3 text-sm font-bold text-white">
            Auto rotate
            <input className="h-5 w-5 accent-[var(--body-accent)]" type="checkbox" checked={autoRotate} onChange={(event) => onAutoRotateChange(event.target.checked)} />
          </label>

          <button type="button" onClick={onReset} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-3 text-sm font-black text-[#102b2f]">
            <RotateCcw className="h-4 w-4" />
            Reset view
          </button>
        </div>
      </div>

      <div className="relative z-0 mt-5 h-[430px] overflow-hidden rounded-lg border border-white/10 bg-[#081b1e]">
        <HumanBodyModelScene system={system} viewMode={viewMode} autoRotate={autoRotate} resetKey={resetKey} />
      </div>
    </section>
  )
}

function DetailsPanel({
  system,
  activeTopic,
  favorites,
  mastery,
  onToggleFavorite,
}: {
  system: BodySystem
  activeTopic: string
  favorites: Set<string>
  mastery: number
  onToggleFavorite: (id: string) => void
}) {
  const topic = system.topics.find((candidate) => candidate.id === activeTopic) ?? system.topics[0]
  const comparedSystem = getBodySystemById(system.comparison)

  return (
    <aside className="grid gap-4">
      <section className="rounded-lg border border-white/12 bg-[#102b2f]/92 p-5 text-white shadow-[0_14px_36px_rgba(4,24,26,0.24)]">
        <div className="mb-4 flex items-center justify-between border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-[#9be3d7]">
          System Details
          <button
            type="button"
            onClick={() => onToggleFavorite(system.id)}
            className="grid h-9 w-9 place-items-center rounded-lg bg-white/8 text-[color:var(--body-accent)]"
            aria-label={`${favorites.has(system.id) ? 'Remove' : 'Save'} ${system.name}`}
          >
            <Star className="h-4 w-4" fill={favorites.has(system.id) ? 'currentColor' : 'none'} />
          </button>
        </div>

        <h4 className="font-serif text-3xl leading-none text-white">{topic.name}</h4>
        <p className="mt-2 font-serif text-lg italic text-[#c8ddd9]">{topic.subtitle}</p>
        <p className="mt-4 font-serif leading-7 text-[#eef8f1]">{topic.note}</p>

        <dl className="mt-4 grid gap-2">
          {topic.attributes.map((attribute) => (
            <div key={attribute.label} className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-sm">
              <dt className="font-serif text-[#d6e6dc]/70">{attribute.label}</dt>
              <dd className="font-serif text-white">{attribute.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-lg border border-white/12 bg-[#102b2f]/92 p-5 text-white shadow-[0_14px_36px_rgba(4,24,26,0.24)]">
        <div className="mb-4 flex items-center gap-2 border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-[#9be3d7]">
          <Target className="h-4 w-4" />
          Mastery
          <strong className="ml-auto font-serif text-xl">{mastery}%</strong>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/12">
          <span className="block h-full rounded-full bg-[var(--body-accent)]" style={{ width: `${mastery}%` }} />
        </div>
        <p className="mt-4 text-sm font-semibold leading-6 text-[#d6e6dc]">
          Explain how <strong className="text-[color:var(--body-accent)]">{system.name}</strong> works with {comparedSystem.name}.
        </p>
      </section>
    </aside>
  )
}

function PipelinePanel({ system }: { system: BodySystem }) {
  return (
    <section className="rounded-lg border border-white/12 bg-[#102b2f]/92 p-5 text-white shadow-[0_14px_36px_rgba(4,24,26,0.24)]">
      <div className="mb-4 flex items-center gap-2 border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-[#9be3d7]">
        <Sparkles className="h-4 w-4" />
        Image-to-3D Pipeline
      </div>
      <div className="grid gap-3 lg:grid-cols-4">
        {system.pipeline.map((step) => (
          <article key={step.id} className="rounded-lg border border-white/10 bg-white/8 p-3">
            <span className="text-xs font-black uppercase text-[#9be3d7]">{step.label}</span>
            <strong className="mt-2 block font-serif text-lg leading-tight text-white">{step.status}</strong>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#d6e6dc]">{step.detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function BottomPanels({ system }: { system: BodySystem }) {
  const comparedSystem = getBodySystemById(system.comparison)

  return (
    <div className="grid gap-4">
      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-white/12 bg-[#102b2f]/92 p-5 text-white shadow-[0_14px_36px_rgba(4,24,26,0.24)]">
          <div className="mb-4 flex items-center gap-2 border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-[#9be3d7]">
            System Connection
            <ArrowRight className="h-4 w-4" />
          </div>
          <p className="font-serif leading-7 text-[#eef8f1]">{system.overview.title}: {system.overview.body}</p>
        </div>

        <div className="rounded-lg border border-white/12 bg-[#102b2f]/92 p-5 text-white shadow-[0_14px_36px_rgba(4,24,26,0.24)]">
          <div className="mb-4 flex items-center gap-2 border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-[#9be3d7]">
            Compare Systems
            <Activity className="h-4 w-4" />
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <strong className="font-serif text-lg text-white">{system.name}</strong>
            <ArrowRight className="h-5 w-5 text-[color:var(--body-accent)]" />
            <strong className="font-serif text-lg text-white">{comparedSystem.name}</strong>
          </div>
        </div>
      </section>
      <PipelinePanel system={system} />
    </div>
  )
}

export function HumanBodyResourceCenter() {
  const [selectedSystemId, setSelectedSystemId] = useState(initialSystem.id)
  const [activeTopic, setActiveTopic] = useState(initialSystem.defaultTopic)
  const [viewMode, setViewMode] = useState<BodyViewMode>('inspect')
  const [autoRotate, setAutoRotate] = useState(true)
  const [resetKey, setResetKey] = useState(0)
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set([initialSystem.id]))
  const [viewedSystems, setViewedSystems] = useState<Set<string>>(() => new Set([initialSystem.id]))
  const [viewedTopicKeys, setViewedTopicKeys] = useState<Set<string>>(
    () => new Set([`${initialSystem.id}:${initialSystem.defaultTopic}`]),
  )

  const selectedSystem = useMemo(() => getBodySystemById(selectedSystemId), [selectedSystemId])
  const totalTopicCount = useMemo(() => bodySystems.reduce((total, system) => total + system.topics.length, 0), [])
  const mastery = useMemo(() => {
    const systemCoverage = viewedSystems.size / bodySystems.length
    const topicCoverage = viewedTopicKeys.size / totalTopicCount

    return Math.round((systemCoverage * 0.42 + topicCoverage * 0.58) * 100)
  }, [totalTopicCount, viewedSystems, viewedTopicKeys])

  useEffect(() => {
    const hasActiveTopic = selectedSystem.topics.some((topic) => topic.id === activeTopic)
    if (!hasActiveTopic) {
      return
    }

    setViewedSystems((current) => new Set(current).add(selectedSystem.id))
    setViewedTopicKeys((current) => new Set(current).add(`${selectedSystem.id}:${activeTopic}`))
  }, [activeTopic, selectedSystem])

  function handleSelectSystem(id: string) {
    const nextSystem = getBodySystemById(id)

    setSelectedSystemId(nextSystem.id)
    setActiveTopic(nextSystem.defaultTopic)
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
    '--body-accent': selectedSystem.accent,
    '--body-accent-soft': selectedSystem.accentSoft,
  } as CSSProperties

  return (
    <section
      id="human-body-studio"
      className="overflow-hidden rounded-lg border border-white/12 bg-[#0b282b] p-3 text-white shadow-[0_18px_50px_rgba(4,24,26,0.34)] sm:p-4"
      style={shellStyle}
      aria-label="Human Body Studio resource"
    >
      <div className="mb-4 flex flex-col gap-3 border-b border-white/12 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[var(--body-accent-soft)] text-[color:var(--body-accent)] shadow-[0_10px_28px_rgba(4,24,26,0.24)]">
            <HeartPulse className="h-7 w-7" />
          </span>
          <div className="min-w-0">
            <h2 className="font-serif text-4xl font-medium leading-none text-white">Human Body Studio</h2>
            <p className="mt-2 text-sm font-semibold text-[#d6e6dc]">Explore body systems with GLB-ready image-to-3D courseware</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2" aria-label="Human Body resource links">
          <a href="#human-body-studio" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#9be3d7] px-4 text-sm font-black text-[#102b2f]">
            <Library className="h-4 w-4" />
            Body studio
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

      <div className="grid gap-4 xl:grid-cols-[280px_minmax(520px,1fr)_340px]">
        <BodyRail
          selectedSystem={selectedSystem}
          activeTopic={activeTopic}
          favorites={favorites}
          onSelectSystem={handleSelectSystem}
          onSelectTopic={setActiveTopic}
        />
        <div className="grid gap-4">
          <Stage
            system={selectedSystem}
            viewMode={viewMode}
            autoRotate={autoRotate}
            resetKey={resetKey}
            onModeChange={setViewMode}
            onAutoRotateChange={setAutoRotate}
            onReset={() => setResetKey((key) => key + 1)}
          />
          <BottomPanels system={selectedSystem} />
        </div>
        <DetailsPanel
          system={selectedSystem}
          activeTopic={activeTopic}
          favorites={favorites}
          mastery={mastery}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </section>
  )
}
