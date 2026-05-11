'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import {
  ArrowRight,
  BookOpen,
  Box,
  Brain,
  Camera,
  CircleDot,
  EyeOff,
  Grid3X3,
  Heart,
  Info,
  Leaf,
  Library,
  Microscope,
  RotateCcw,
  Settings,
  Sparkles,
  Star,
  Target,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'

import { cells, getCellById, type CellItem, type ViewMode } from './cells'

const CellModelScene = dynamic(
  () => import('./CellModelScene').then((module) => module.CellModelScene),
  {
    ssr: false,
    loading: () => (
      <div
        role="img"
        aria-label="3D cell model preview"
        className="grid h-full min-h-[360px] place-items-center rounded-lg bg-[#fbf7ee]"
      >
        <div className="grid w-64 gap-3 rounded-lg border border-[#5b4e3c]/15 bg-[#fbf7ee]/90 p-4 shadow-[0_18px_50px_rgba(78,66,48,0.12)]">
          <span className="text-xs font-bold uppercase text-[#756d61]">Loading 3D specimen</span>
          <span className="font-serif text-xl text-[#332d24]">Cell model</span>
          <span className="h-2 overflow-hidden rounded-full bg-[#5a4e3d]/15">
            <span className="block h-full w-2/3 rounded-full bg-[#4f8a3f]" />
          </span>
        </div>
      </div>
    ),
  },
)

type ModeOption = {
  id: ViewMode
  label: string
  Icon: LucideIcon
}

const modeOptions: ModeOption[] = [
  { id: 'mesh', label: 'Mesh', Icon: Box },
  { id: 'focus', label: 'Focus', Icon: CircleDot },
]

const initialCell = getCellById('animal')

function MiniCell({ cell }: { cell: CellItem }) {
  return (
    <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#483c2e]/10 bg-[#f7f1e7] shadow-[0_10px_20px_rgba(45,38,30,0.12)]">
      {cell.renderImage?.url || cell.modelAsset?.previewUrl ? (
        <Image
          src={cell.renderImage?.url ?? cell.modelAsset?.previewUrl ?? ''}
          alt=""
          aria-hidden="true"
          width={72}
          height={72}
          className="h-full w-full scale-110 object-cover"
        />
      ) : (
        <>
          <span className="absolute inset-3 rounded-full opacity-85" style={{ background: cell.accent }} />
          <span className="absolute left-6 top-3 h-5 w-5 rounded-full opacity-55" style={{ background: cell.accent }} />
          <span className="absolute bottom-3 left-4 h-2 w-6 rounded-full opacity-60" style={{ background: cell.accent }} />
        </>
      )}
    </span>
  )
}

function CellRail({
  selectedCell,
  activeOrganelle,
  favorites,
  onSelectCell,
  onSelectOrganelle,
}: {
  selectedCell: CellItem
  activeOrganelle: string
  favorites: Set<string>
  onSelectCell: (id: string) => void
  onSelectOrganelle: (id: string) => void
}) {
  return (
    <aside className="grid gap-4">
      <section className="rounded-lg border border-[#5b4e3c]/15 bg-[#fbf7ee]/88 p-5 shadow-[0_8px_26px_rgba(78,66,48,0.1)]">
        <div className="mb-4 flex items-center justify-between border-b border-dashed border-[#574e40]/25 pb-3 font-semibold uppercase text-[#3f345f]">
          <span className="inline-flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Cell Types
          </span>
          <Grid3X3 className="h-4 w-4" />
        </div>
        <div className="grid gap-2">
          {cells.map((cell) => {
            const selected = selectedCell.id === cell.id

            return (
              <button
                key={cell.id}
                type="button"
                onClick={() => onSelectCell(cell.id)}
                className="grid min-h-[78px] w-full grid-cols-[58px_minmax(0,1fr)_28px] items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-left transition hover:-translate-y-0.5 hover:bg-[var(--cell-accent-soft)] hover:shadow-[0_10px_24px_rgba(62,54,44,0.08)] data-[selected=true]:border-[color:var(--cell-accent)] data-[selected=true]:bg-[var(--cell-accent-soft)]"
                data-selected={selected}
                aria-pressed={selected}
              >
                <MiniCell cell={cell} />
                <span className="grid min-w-0 gap-1">
                  <span className="truncate font-serif text-[1.04rem] font-semibold leading-tight text-[#29251e]">
                    {cell.name}
                  </span>
                  <span className="truncate text-sm font-semibold text-[#80786d]">{cell.type}</span>
                </span>
                <span className="grid h-7 w-7 place-items-center text-[color:var(--cell-accent)] opacity-75" aria-hidden="true">
                  <Star className="h-4 w-4" fill={favorites.has(cell.id) ? 'currentColor' : 'none'} />
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="rounded-lg border border-[#5b4e3c]/15 bg-[#fbf7ee]/88 p-5 shadow-[0_8px_26px_rgba(78,66,48,0.1)]">
        <div className="mb-4 flex items-center justify-between border-b border-dashed border-[#574e40]/25 pb-3 font-semibold uppercase text-[#3f345f]">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Organelles
          </span>
          <Info className="h-4 w-4" />
        </div>
        <div className="grid gap-2">
          {selectedCell.organelles.map((organelle) => (
            <button
              key={organelle.id}
              type="button"
              onClick={() => onSelectOrganelle(organelle.id)}
              className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#39332a] transition hover:translate-x-0.5 hover:bg-white/60 data-[selected=true]:bg-white/70"
              data-selected={activeOrganelle === organelle.id}
            >
              <span className="h-3 w-3 rounded-full shadow-[0_0_0_5px_rgba(255,255,255,0.48)]" style={{ background: organelle.color }} />
              {organelle.name}
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}

function Stage({
  cell,
  activeOrganelle,
  viewMode,
  crossSection,
  autoRotate,
  resetKey,
  onModeChange,
  onCrossSectionChange,
  onAutoRotateChange,
  onReset,
}: {
  cell: CellItem
  activeOrganelle: string
  viewMode: ViewMode
  crossSection: boolean
  autoRotate: boolean
  resetKey: number
  onModeChange: (mode: ViewMode) => void
  onCrossSectionChange: (value: boolean) => void
  onAutoRotateChange: (value: boolean) => void
  onReset: () => void
}) {
  const previewRender = cell.renderImage?.url ?? cell.modelAsset?.previewUrl
  const hasTrueModel = Boolean(cell.modelAsset)

  return (
    <section className="relative min-h-[760px] overflow-hidden rounded-lg border border-[#5b4e3c]/15 bg-[#fbf7ee] p-5 shadow-[0_18px_50px_rgba(78,66,48,0.12)] lg:p-7">
      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="max-w-xl font-serif text-5xl font-medium leading-[0.95] tracking-normal text-[#28231c] lg:text-6xl">
            {cell.name}
          </h3>
          <p className="mt-3 font-serif text-xl italic text-[#373028]/65">{cell.type}</p>
        </div>

        <div className="grid w-full gap-3 rounded-lg border border-[#544a3a]/15 bg-[#f6f0e5]/90 p-4 shadow-[0_8px_26px_rgba(78,66,48,0.1)] sm:w-[300px]">
          <span className="text-sm font-extrabold uppercase text-[#726854]">View Mode</span>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="View Mode">
            {modeOptions.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onModeChange(id)}
                className="grid min-h-12 place-items-center rounded-lg border border-[#554b3d]/15 bg-white/50 text-[#443c31] transition hover:-translate-y-0.5 hover:text-[color:var(--cell-accent)] data-[selected=true]:border-[color:var(--cell-accent)] data-[selected=true]:bg-[var(--cell-accent-soft)] data-[selected=true]:text-[color:var(--cell-accent)]"
                data-selected={viewMode === id}
                aria-pressed={viewMode === id}
                title={label}
              >
                <span className="sr-only">{label}</span>
                <Icon className="h-6 w-6" />
              </button>
            ))}
          </div>
          <label className="grid cursor-pointer grid-cols-[minmax(0,1fr)_52px] items-center gap-3 text-sm font-semibold text-[#443c31]">
            <span>Cross Section</span>
            <input
              type="checkbox"
              checked={crossSection}
              onChange={(event) => onCrossSectionChange(event.target.checked)}
              className="peer sr-only"
            />
            <span className="relative block h-7 w-[52px] rounded-full bg-[#d5ccbc] transition peer-checked:bg-[var(--cell-accent)] after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-[0_2px_7px_rgba(50,42,34,0.24)] after:transition peer-checked:after:translate-x-6" />
          </label>
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-32 top-48 z-0 lg:inset-x-6">
        {hasTrueModel ? (
          <CellModelScene
            cell={cell}
            activeOrganelle={activeOrganelle}
            viewMode={viewMode}
            crossSection={crossSection}
            autoRotate={autoRotate}
            resetKey={resetKey}
          />
        ) : previewRender ? (
          <div className="cell-finished-render-wrap">
            <Image
              src={previewRender}
              alt={`${cell.name} high-definition 3D source render`}
              width={1254}
              height={1254}
              priority={cell.id === initialCell.id}
              className="cell-finished-render"
            />
          </div>
        ) : (
          <CellModelScene
            cell={cell}
            activeOrganelle={activeOrganelle}
            viewMode={viewMode}
            crossSection={crossSection}
            autoRotate={autoRotate}
            resetKey={resetKey}
          />
        )}
      </div>

      <div className="absolute bottom-5 left-5 z-20 flex max-w-[calc(100%-2.5rem)] flex-wrap overflow-hidden rounded-lg border border-[#544a3a]/15 bg-[#fbf7ee]/90 shadow-[0_8px_26px_rgba(78,66,48,0.1)] backdrop-blur">
        <button
          type="button"
          className="inline-flex min-h-12 items-center gap-2 border-r border-[#544a3a]/15 px-4 text-sm font-semibold hover:bg-white/60 data-[selected=true]:text-[color:var(--cell-accent)]"
          data-selected={autoRotate}
          onClick={() => onAutoRotateChange(!autoRotate)}
        >
          <RotateCcw className="h-5 w-5" />
          Rotate
        </button>
        <button type="button" className="inline-flex min-h-12 items-center gap-2 border-r border-[#544a3a]/15 px-4 text-sm font-semibold hover:bg-white/60" onClick={() => onModeChange('focus')}>
          <CircleDot className="h-5 w-5" />
          Isolate
        </button>
        <button type="button" className="inline-flex min-h-12 items-center gap-2 border-r border-[#544a3a]/15 px-4 text-sm font-semibold hover:bg-white/60" onClick={() => onModeChange('focus')}>
          <EyeOff className="h-5 w-5" />
          Hide Others
        </button>
        <button type="button" className="inline-flex min-h-12 items-center gap-2 px-4 text-sm font-semibold hover:bg-white/60" onClick={onReset}>
          <RotateCcw className="h-5 w-5" />
          Reset View
        </button>
      </div>

      <div className="absolute bottom-5 right-5 z-20 hidden overflow-hidden rounded-lg border border-[#544a3a]/15 bg-[#fbf7ee]/90 shadow-[0_8px_26px_rgba(78,66,48,0.1)] backdrop-blur xl:flex">
        <button type="button" className="inline-flex min-h-12 items-center gap-2 border-r border-[#544a3a]/15 px-4 text-sm font-semibold hover:bg-white/60">
          <Camera className="h-5 w-5" />
          Screenshot
        </button>
        <button type="button" className="inline-flex min-h-12 items-center gap-2 px-4 text-sm font-semibold hover:bg-white/60">
          <Box className="h-5 w-5" />
          GLB Export
        </button>
      </div>
    </section>
  )
}

function DetailsPanel({
  cell,
  activeOrganelle,
  favorites,
  mastery,
  onToggleFavorite,
}: {
  cell: CellItem
  activeOrganelle: string
  favorites: Set<string>
  mastery: number
  onToggleFavorite: (id: string) => void
}) {
  const organelle = cell.organelles.find((item) => item.id === activeOrganelle) ?? cell.organelles[0]
  const comparedCell = getCellById(cell.comparison)

  return (
    <aside className="grid gap-4">
      <section className="rounded-lg border border-[#5b4e3c]/15 bg-[#fbf7ee]/88 p-5 shadow-[0_8px_26px_rgba(78,66,48,0.1)]">
        <div className="mb-4 flex items-center justify-between border-b border-dashed border-[#574e40]/25 pb-3 font-semibold uppercase text-[#3f345f]">
          <span>Organelle Details</span>
          <button type="button" onClick={() => onToggleFavorite(cell.id)} aria-label={`Favorite ${cell.name}`}>
            <Heart className="h-5 w-5 text-[color:var(--cell-accent)]" fill={favorites.has(cell.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4">
          <span className="h-[72px] w-[72px] rounded-full shadow-[inset_-12px_-16px_0_rgba(52,36,80,0.18),inset_10px_10px_0_rgba(255,255,255,0.25),0_12px_22px_rgba(70,58,42,0.12)]" style={{ background: organelle.color }} />
          <div>
            <h4 className="font-serif text-3xl leading-none text-[#2c251d]">{organelle.name}</h4>
            <p className="mt-2 font-serif text-lg italic text-[#373028]/65">{organelle.subtitle}</p>
          </div>
        </div>
        <dl className="mt-5 grid gap-3">
          {organelle.attributes.map((item) => (
            <div key={item.label} className="grid grid-cols-[0.85fr_1.15fr] items-center gap-3">
              <dt className="font-serif text-[#2d271f]/60">{item.label}</dt>
              <dd className="font-serif text-[#2c251d]">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-lg border border-[#5b4e3c]/15 bg-[#fbf7ee]/88 p-5 shadow-[0_8px_26px_rgba(78,66,48,0.1)]">
        <div className="mb-4 flex items-center justify-between border-b border-dashed border-[#574e40]/25 pb-3 font-semibold uppercase text-[#3f345f]">
          <span className="inline-flex items-center gap-2">
            <Microscope className="h-4 w-4" />
            Microscope Views
          </span>
          <Info className="h-4 w-4" />
        </div>
        <MicroscopeViews cell={cell} compact />
      </section>

      <section className="rounded-lg border border-[#5b4e3c]/15 bg-[#fbf7ee]/88 p-5 shadow-[0_8px_26px_rgba(78,66,48,0.1)]">
        <div className="mb-4 border-b border-dashed border-[#574e40]/25 pb-3 font-semibold uppercase text-[#3f345f]">Biological Notes</div>
        <p className="font-serif leading-7 text-[#4b4236]">{organelle.note}</p>
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-dashed border-[#574e40]/25 pt-4 text-sm font-extrabold text-[#66558f]">
          <span>Fun Fact: {organelle.fact}</span>
          <Sparkles className="h-4 w-4" />
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-[#5b4e3c]/15 bg-[#fbf7ee]/88 p-5 shadow-[0_8px_26px_rgba(78,66,48,0.1)]">
        <div className="border-b border-dashed border-[#574e40]/25 pb-3 font-semibold uppercase text-[#3f345f]">
          <span className="inline-flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Tutor
          </span>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center gap-2 font-semibold text-[#443d32]">
            <Target className="h-4 w-4" />
            <span>Mastery</span>
            <strong className="ml-auto font-serif text-xl">{mastery}%</strong>
          </div>
          <span className="h-2.5 overflow-hidden rounded-full bg-[#5b4e3c]/15">
            <span className="block h-full rounded-full bg-[linear-gradient(90deg,var(--cell-accent),#ffffff)]" style={{ width: `${mastery}%` }} />
          </span>
        </div>
        <div className="rounded-lg border border-[#544a3a]/15 bg-white/40 p-3">
          <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[#3f345f]">
            <BookOpen className="h-4 w-4" />
            Current lesson focus
          </span>
          <p className="mt-2 font-serif leading-6 text-[#4b4236]">
            Locate <strong className="text-[color:var(--cell-accent)]">{organelle.name}</strong>, explain its role, then compare it with {comparedCell.name}.
          </p>
        </div>
      </section>
    </aside>
  )
}

function getMicroscopeFilter(pattern: string) {
  if (pattern === 'electron') {
    return 'grayscale(1) contrast(1.22) brightness(0.94)'
  }

  if (pattern.includes('stain')) {
    return 'hue-rotate(305deg) saturate(1.55) contrast(1.08) brightness(1.02)'
  }

  return 'saturate(0.95) contrast(0.96) brightness(1.08)'
}

function getMicroscopeBackdrop(tone: string, pattern: string) {
  if (pattern === 'electron') {
    return 'radial-gradient(circle at 50% 42%, rgba(255,255,255,.22), transparent 46%), repeating-linear-gradient(35deg, rgba(255,255,255,.12) 0 4px, rgba(0,0,0,.06) 4px 8px), #9b9a94'
  }

  return `radial-gradient(circle at 34% 32%, ${tone}66, transparent 24%), radial-gradient(circle at 70% 58%, ${tone}55, transparent 28%), repeating-linear-gradient(45deg, rgba(255,255,255,.24) 0 10px, rgba(77,58,42,.05) 10px 18px), #fff8ea`
}

function MicroscopeViews({ cell, compact = false }: { cell: CellItem; compact?: boolean }) {
  const previewRender = cell.renderImage?.url ?? cell.modelAsset?.previewUrl

  return (
    <div className={compact ? 'grid gap-2' : 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3'}>
      {cell.microscope.map((image) => (
        <figure
          key={image.label}
          className={
            compact
              ? 'grid grid-cols-[74px_minmax(0,1fr)] items-center gap-3 rounded-lg border border-[#544a3a]/15 bg-white/44 p-2'
              : 'grid grid-rows-[132px_auto] gap-2 rounded-lg border border-[#544a3a]/15 bg-white/40 p-2'
          }
        >
          <span
            className={`relative block overflow-hidden rounded-lg border border-white/60 shadow-[inset_0_0_24px_rgba(78,66,48,0.12)] ${compact ? 'h-[68px]' : 'min-h-[132px]'}`}
            style={{ background: getMicroscopeBackdrop(image.tone, image.pattern) }}
            aria-hidden="true"
          >
            {previewRender ? (
              <Image
                src={previewRender}
                alt=""
                aria-hidden="true"
                width={compact ? 120 : 220}
                height={compact ? 120 : 160}
                className={`absolute inset-0 m-auto object-contain ${compact ? 'h-[64px] w-[70px]' : 'h-[122px] w-full p-2'}`}
                style={{
                  filter: getMicroscopeFilter(image.pattern),
                  mixBlendMode: image.pattern === 'electron' ? 'luminosity' : 'multiply',
                }}
              />
            ) : null}
            <span className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_50%_48%,transparent_48%,rgba(46,38,30,.18)_72%,rgba(46,38,30,.3)_100%)]" />
            <span className="absolute inset-x-3 top-2 h-px bg-white/55" />
          </span>
          <figcaption className="min-w-0">
            <strong className="block truncate text-sm text-[#2f2922]">{image.label}</strong>
            {compact ? <span className="mt-0.5 block truncate text-xs font-semibold text-[#80786d]">{cell.name}</span> : null}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

function BottomPanels({ cell }: { cell: CellItem }) {
  const comparedCell = getCellById(cell.comparison)

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.9fr)]">
      <div className="rounded-lg border border-[#5b4e3c]/15 bg-[#fbf7ee]/88 p-5 shadow-[0_8px_26px_rgba(78,66,48,0.1)]">
        <div className="mb-4 flex items-center gap-2 border-b border-dashed border-[#574e40]/25 pb-3 font-semibold uppercase text-[#3f345f]">
          Microscope View
          <Info className="h-4 w-4" />
        </div>
        <MicroscopeViews cell={cell} />
      </div>

      <div className="rounded-lg border border-[#5b4e3c]/15 bg-[#fbf7ee]/88 p-5 shadow-[0_8px_26px_rgba(78,66,48,0.1)]">
        <div className="mb-4 flex items-center gap-2 border-b border-dashed border-[#574e40]/25 pb-3 font-semibold uppercase text-[#3f345f]">
          Compare Cells
          <Info className="h-4 w-4" />
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_58px_minmax(0,1fr)] items-center gap-3">
          <div className="flex min-w-0 items-center gap-3 rounded-lg border border-[#544a3a]/15 bg-white/40 p-3">
            <MiniCell cell={cell} />
            <span className="grid min-w-0 gap-1">
              <strong className="truncate font-serif text-[#29251e]">{cell.name}</strong>
              <em className="truncate text-sm not-italic text-[#80786d]">You are here</em>
            </span>
          </div>
          <b className="grid h-[58px] w-[58px] place-items-center rounded-full bg-[#8260b7] text-white shadow-[0_12px_24px_rgba(94,68,134,0.28)]">VS</b>
          <div className="flex min-w-0 items-center gap-3 rounded-lg border border-[#544a3a]/15 bg-white/40 p-3">
            <span className="grid min-w-0 gap-1 text-right">
              <strong className="truncate font-serif text-[#29251e]">{comparedCell.name}</strong>
              <em className="truncate text-sm not-italic text-[#80786d]">{comparedCell.type}</em>
            </span>
            <MiniCell cell={comparedCell} />
          </div>
        </div>
        <button type="button" className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#2f2a23] px-4 text-sm font-extrabold text-[#fbf7ee]">
          Open Comparison View
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
}

export function CellArchitectureResourceCenter() {
  const [selectedCellId, setSelectedCellId] = useState(initialCell.id)
  const [activeOrganelle, setActiveOrganelle] = useState(initialCell.defaultOrganelle)
  const [viewMode, setViewMode] = useState<ViewMode>('mesh')
  const [crossSection, setCrossSection] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set([initialCell.id]))
  const [viewedCells, setViewedCells] = useState<Set<string>>(() => new Set([initialCell.id]))
  const [viewedOrganelleKeys, setViewedOrganelleKeys] = useState<Set<string>>(
    () => new Set([`${initialCell.id}:${initialCell.defaultOrganelle}`]),
  )

  const selectedCell = useMemo(() => getCellById(selectedCellId), [selectedCellId])
  const totalOrganelleCount = useMemo(() => cells.reduce((total, cell) => total + cell.organelles.length, 0), [])
  const mastery = useMemo(() => {
    const cellCoverage = viewedCells.size / cells.length
    const organelleCoverage = viewedOrganelleKeys.size / totalOrganelleCount

    return Math.round((cellCoverage * 0.42 + organelleCoverage * 0.58) * 100)
  }, [totalOrganelleCount, viewedCells, viewedOrganelleKeys])

  useEffect(() => {
    const hasActiveOrganelle = selectedCell.organelles.some((organelle) => organelle.id === activeOrganelle)
    if (!hasActiveOrganelle) {
      return
    }

    setViewedCells((current) => new Set(current).add(selectedCell.id))
    setViewedOrganelleKeys((current) => new Set(current).add(`${selectedCell.id}:${activeOrganelle}`))
  }, [activeOrganelle, selectedCell])

  function handleSelectCell(id: string) {
    const nextCell = getCellById(id)

    setSelectedCellId(nextCell.id)
    setActiveOrganelle(nextCell.defaultOrganelle)
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
    '--cell-accent': selectedCell.accent,
    '--cell-accent-soft': selectedCell.accentSoft,
  } as CSSProperties

  return (
    <section
      id="cell-architecture-studio"
      className="overflow-hidden rounded-lg border border-[#5b4e3c]/15 bg-[#f2ecdf] p-3 text-[#29251e] shadow-[0_18px_50px_rgba(78,66,48,0.12)] sm:p-4"
      style={shellStyle}
      aria-label="Cell Architecture Studio resource"
    >
      <div className="mb-4 flex flex-col gap-3 border-b border-[#5b4e3c]/15 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[var(--cell-accent-soft)] text-[color:var(--cell-accent)] shadow-[0_8px_26px_rgba(78,66,48,0.1)]">
            <Sparkles className="h-7 w-7" />
          </span>
          <div className="min-w-0">
            <h2 className="font-serif text-4xl font-medium leading-none text-[#28231c]">Cell Architecture Studio</h2>
            <p className="mt-2 text-sm font-semibold text-[#675898]">Explore life at the microscopic level</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2" aria-label="Cell Architecture resource tabs" role="tablist">
          <a href="#cell-architecture-studio" role="tab" aria-selected="true" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#2f2a23] px-4 text-sm font-bold text-[#fbf7ee]">
            <Library className="h-4 w-4" />
            Cell studio
          </a>
          <a href="#course-files" role="tab" aria-selected="false" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#5b4e3c]/15 bg-[#fbf7ee]/80 px-4 text-sm font-bold text-[#2f2a23]">
            <BookOpen className="h-4 w-4" />
            Course files
          </a>
          <a href="#course-files" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#5b4e3c]/15 bg-[#fbf7ee]/80 px-4 text-sm font-bold text-[#2f2a23]">
            <Settings className="h-4 w-4" />
            Settings
          </a>
        </nav>
      </div>

      <div id="diagram-studio" className="grid gap-4 xl:grid-cols-[300px_minmax(560px,1fr)_360px]">
        <CellRail
          selectedCell={selectedCell}
          activeOrganelle={activeOrganelle}
          favorites={favorites}
          onSelectCell={handleSelectCell}
          onSelectOrganelle={setActiveOrganelle}
        />
        <div className="grid gap-4">
          <Stage
            cell={selectedCell}
            activeOrganelle={activeOrganelle}
            viewMode={viewMode}
            crossSection={crossSection}
            autoRotate={autoRotate}
            resetKey={resetKey}
            onModeChange={setViewMode}
            onCrossSectionChange={setCrossSection}
            onAutoRotateChange={setAutoRotate}
            onReset={() => setResetKey((key) => key + 1)}
          />
          <BottomPanels cell={selectedCell} />
        </div>
        <DetailsPanel
          cell={selectedCell}
          activeOrganelle={activeOrganelle}
          favorites={favorites}
          mastery={mastery}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </section>
  )
}
