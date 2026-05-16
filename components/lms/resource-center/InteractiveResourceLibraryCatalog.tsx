'use client'

import {
  ArrowRight,
  Atom,
  BookOpen,
  FlaskConical,
  HeartPulse,
  Map,
  Microscope,
  MountainSnow,
  Orbit,
  Shapes,
  type LucideIcon,
} from 'lucide-react'

import { interactiveResources, upcomingResources, type ResourceIconId } from './interactive-resource-library'

const iconMap: Record<ResourceIconId, LucideIcon> = {
  atom: Atom,
  chemistry: FlaskConical,
  earth: MountainSnow,
  geometry: Shapes,
  heart: HeartPulse,
  map: Map,
  microscope: Microscope,
  orbit: Orbit,
}

export function InteractiveResourceLibraryCatalog() {
  return (
    <section
      aria-label="Interactive Resource Library catalog"
      className="student-workspace-panel rounded-lg border border-white/75 bg-white/86 p-4 shadow-[0_18px_50px_rgba(5,44,38,0.18)] backdrop-blur-md"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#17352c]">Interactive Resource Library</h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-[#55736a]">
            B.C. curriculum areas, Canadian curriculum links, and interactive studios collected before course files.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black uppercase text-emerald-800">
          <BookOpen className="h-4 w-4" />
          B.C. curriculum areas
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {interactiveResources.map(({ title, href, status, area, icon }) => {
          const Icon = iconMap[icon]

          return (
            <article key={title} className="rounded-lg border border-emerald-100 bg-white/78 p-4">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#17352c] text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <strong className="block font-black text-[#17352c]">{title}</strong>
                  <p className="mt-1 text-sm font-semibold leading-5 text-[#55736a]">{area}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-black uppercase text-emerald-800">{status}</span>
                <a href={href} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#17352c] px-3 text-sm font-black text-white">
                  Open {title}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          )
        })}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {upcomingResources.map(({ title, area, icon }) => {
          const Icon = iconMap[icon]

          return (
            <article key={title} className="rounded-lg border border-sky-100 bg-sky-50/76 p-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#17352c]">
                <Icon className="h-4 w-4" />
              </span>
              <h3 className="mt-3 font-black text-[#17352c]">{title}</h3>
              <p className="mt-1 text-xs font-bold leading-5 text-[#55736a]">{area}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
