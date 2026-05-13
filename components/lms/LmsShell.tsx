import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  Home,
  LogOut,
  Mail,
  MessageCircle,
  Plus,
  Search,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { CompanionSprite } from '@/components/companion/CompanionSprite'

export type LmsToolLink = {
  href: string
  label: string
  description: string
  icon: LucideIcon
}

export type LmsDashboardRole = 'admin' | 'teacher' | 'student' | 'guardian'

export type LmsShellStatusItem = {
  label: string
  value: string
  tone?: 'ok' | 'warn' | 'info'
}

export type LmsShellSpotlight = {
  label?: string
  title: string
  tag?: string
  status?: string
  meta?: string[]
}

export type LmsShellFeedback = {
  title: string
  name: string
  body: string
  score?: string
}

export type LmsShellQuickAction = {
  href: string
  label: string
  icon: LucideIcon
}

const defaultQuickActionIcons = [Plus, MessageCircle, CalendarDays, BarChart3]

const roleLabels: Record<LmsDashboardRole, string> = {
  admin: 'Admin',
  teacher: 'Teacher',
  student: 'Student',
  guardian: 'Parent',
}

function roleFromTitle(title: string): LmsDashboardRole {
  const normalized = title.toLowerCase()

  if (normalized.includes('admin')) return 'admin'
  if (normalized.includes('teacher')) return 'teacher'
  if (normalized.includes('guardian') || normalized.includes('parent')) return 'guardian'

  return 'student'
}

function initialsFor(value: string) {
  const parts = value
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 0) return 'WW'

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function defaultSpotlightFor(role: LmsDashboardRole, title: string, tools: LmsToolLink[]): LmsShellSpotlight {
  return {
    label: role === 'guardian' ? 'Linked Student' : 'Current Assignment',
    title: tools[0]?.label ? `${tools[0].label} workspace` : title,
    tag: role === 'admin' ? 'Operations' : roleLabels[role],
    status: 'Active',
    meta: ['One dashboard format', `${tools.length} tools available`],
  }
}

function defaultStatusItems(tools: LmsToolLink[]): LmsShellStatusItem[] {
  return [
    { label: 'Tools Ready', value: `${tools.length} / ${tools.length || 1}`, tone: 'ok' },
    { label: 'Dashboard Frame', value: 'Unified', tone: 'ok' },
    { label: 'Legacy Loop', value: 'Closed', tone: 'info' },
  ]
}

function defaultFeedback(role: LmsDashboardRole): LmsShellFeedback {
  return {
    title: 'Latest Feedback Example',
    name: role === 'guardian' ? 'Linked student' : `${roleLabels[role]} workspace`,
    body: 'Progress, messages, calendar, and learning activity stay in the same visual frame.',
    score: '92%',
  }
}

function defaultQuickActions(tools: LmsToolLink[]): LmsShellQuickAction[] {
  return tools.slice(0, 4).map((tool, index) => ({
    href: tool.href,
    label: tool.label,
    icon: defaultQuickActionIcons[index] ?? tool.icon,
  }))
}

function StatusIcon({ tone }: { tone: LmsShellStatusItem['tone'] }) {
  if (tone === 'warn') return <Clock3 className="h-4 w-4 text-amber-500" />
  if (tone === 'info') return <Eye className="h-4 w-4 text-sky-600" />

  return <CheckCircle2 className="h-4 w-4 text-lime-600" />
}

export function LmsShell({
  title,
  subtitle,
  tools = [],
  role,
  schoolName = 'WolfWhale LMS',
  userName,
  signOutAction = '/api/auth/logout',
  homeHref = '#dashboard-top',
  spotlight,
  statusItems,
  feedback,
  quickActions,
  children,
}: {
  title: string
  subtitle: string
  tools?: LmsToolLink[]
  role?: LmsDashboardRole
  schoolName?: string
  userName?: string
  signOutAction?: string
  homeHref?: string
  spotlight?: LmsShellSpotlight
  statusItems?: LmsShellStatusItem[]
  feedback?: LmsShellFeedback
  quickActions?: LmsShellQuickAction[]
  children: ReactNode
}) {
  const resolvedRole = role ?? roleFromTitle(title)
  const resolvedSpotlight = spotlight ?? defaultSpotlightFor(resolvedRole, title, tools)
  const resolvedStatusItems = statusItems ?? defaultStatusItems(tools)
  const resolvedFeedback = feedback ?? defaultFeedback(resolvedRole)
  const resolvedQuickActions = quickActions ?? defaultQuickActions(tools)
  const resolvedUserName = userName ?? `${roleLabels[resolvedRole]} user`

  return (
    <main
      id="dashboard-top"
      data-dashboard-role={resolvedRole}
      className="lms-dashboard-shell relative min-h-screen overflow-hidden bg-[#6bc7ee] text-[#063f92]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(255,255,255,0.72),transparent_26rem),radial-gradient(circle_at_80%_6%,rgba(255,255,255,0.58),transparent_22rem),linear-gradient(180deg,#b9ecff_0%,#75d2f3_20%,#8bdbef_48%,#55bec9_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[49vh] opacity-65 [background-image:linear-gradient(rgba(255,255,255,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:48px_48px] [transform:perspective(720px)_rotateX(58deg)] [transform-origin:bottom]"
      />

      <header className="relative z-20 border-b border-white/45 bg-sky-200/56 shadow-[0_12px_38px_rgba(13,74,124,0.16)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1920px] flex-col gap-3 px-4 py-3 xl:flex-row xl:items-center">
          <a href={homeHref} className="flex min-w-[18rem] items-center gap-3 text-[#074595]">
            <span className="grid h-[4.25rem] w-[4.25rem] shrink-0 place-items-center rounded-[1.35rem] border-2 border-white/85 bg-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_14px_28px_rgba(15,83,148,0.24)]">
              <Image src="/logo.png" alt="" width={48} height={48} priority loading="eager" className="h-12 w-12 object-contain" />
            </span>
            <span className="grid gap-0.5 leading-none">
              <span className="text-3xl font-black tracking-tight">WolfWhale</span>
              <span className="text-3xl font-light tracking-tight">Core</span>
              <span className="text-sm font-black tracking-wide text-[#4f74ad]">School LMS Operating System</span>
            </span>
          </a>

          <div className="min-w-0 flex-1">
            <div role="search" aria-label="Global LMS search" className="flex min-h-16 items-center gap-4 rounded-full border-2 border-white/85 bg-white/48 px-6 shadow-[inset_0_1px_14px_rgba(255,255,255,0.62),0_10px_26px_rgba(12,84,148,0.12)]">
              <Search className="h-7 w-7 shrink-0 text-[#4f70a6]" />
              <span className="min-w-0 truncate text-base font-black text-[#5573a6]">
                Search students, classes, assignments...
              </span>
              <span className="ml-auto grid h-14 w-14 place-items-center rounded-full border border-white/80 bg-sky-100/70 text-[#06469a] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <SlidersHorizontal className="h-6 w-6" />
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 xl:justify-end">
            <span className="inline-flex min-h-16 max-w-full items-center gap-3 rounded-full border-2 border-white/80 bg-white/42 px-5 text-sm font-black text-[#074595] shadow-[inset_0_1px_10px_rgba(255,255,255,0.62)]">
              <Building2 className="h-6 w-6 shrink-0" />
              <span className="max-w-[14rem] truncate">{schoolName}</span>
              <ChevronDown className="h-4 w-4 shrink-0" />
            </span>
            <a href="#notifications" aria-label="Notifications" className="relative grid h-16 w-16 place-items-center rounded-[1.4rem] border-2 border-white/80 bg-white/48 text-[#074595] shadow-[0_12px_22px_rgba(12,84,148,0.16)]">
              <Bell className="h-6 w-6" />
              <span className="absolute -right-1 -top-2 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-xs font-black text-white ring-2 ring-white">3</span>
            </a>
            <a href="#messages" aria-label="Messages" className="grid h-16 w-16 place-items-center rounded-[1.4rem] border-2 border-white/80 bg-white/48 text-[#074595] shadow-[0_12px_22px_rgba(12,84,148,0.16)]">
              <Mail className="h-6 w-6" />
            </a>
            <form action={signOutAction} method="post" className="flex min-h-16 items-center gap-3 rounded-full border-2 border-white/80 bg-white/42 px-3 pr-5 shadow-[inset_0_1px_10px_rgba(255,255,255,0.62)]">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#ffd8b6,#c05d28)] text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_7px_18px_rgba(128,63,30,0.24)]">
                {initialsFor(resolvedUserName)}
              </span>
              <span className="hidden min-w-0 leading-tight sm:grid">
                <span className="text-xs font-bold text-[#5f7fb3]">Welcome back,</span>
                <span className="max-w-[10rem] truncate text-sm font-black text-[#074595]">{resolvedUserName}</span>
              </span>
              <button type="submit" className="grid h-9 w-9 place-items-center rounded-full text-[#074595] transition hover:bg-white/55 focus:outline-none focus:ring-2 focus:ring-white">
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid max-w-[1920px] gap-4 px-4 py-5 lg:grid-cols-[19rem_minmax(0,1fr)] 2xl:grid-cols-[19rem_minmax(0,1fr)_26rem]">
        <aside className="order-2 min-w-0 rounded-[1.75rem] border-2 border-white/80 bg-white/44 p-4 shadow-[inset_0_1px_18px_rgba(255,255,255,0.68),0_22px_50px_rgba(13,80,126,0.18)] backdrop-blur-xl lg:order-none lg:sticky lg:top-5 lg:max-h-[calc(100vh-2.5rem)] lg:overflow-auto">
          <nav aria-label="Dashboard tools" className="grid gap-2">
            {tools.map((tool, index) => {
              const Icon = tool.icon
              const active = index === 0
              const accessibleLabel = tool.href === '/student/resources' ? 'Resources / Resource Center' : tool.label

              return (
                <a
                  key={tool.href}
                  href={tool.href}
                  aria-label={accessibleLabel}
                  className={`group flex min-h-14 items-center gap-3 rounded-[1.15rem] px-3 py-2 text-left text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-400 ${
                    active
                      ? 'bg-[linear-gradient(180deg,#1bb7ff,#0264d9)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.62),0_10px_24px_rgba(0,91,196,0.28)]'
                      : 'text-[#084895] hover:bg-white/54 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]'
                  }`}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[0.95rem] border ${active ? 'border-white/30 bg-white/18' : 'border-transparent text-[#0873df]'}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block break-words leading-tight">{tool.label}</span>
                    <span className={`mt-0.5 block break-words text-xs font-bold leading-tight ${active ? 'text-sky-50' : 'text-[#4070aa]'}`}>{tool.description}</span>
                  </span>
                </a>
              )
            })}
          </nav>
          <div className="mt-10 grid grid-cols-[5.5rem_1fr] items-end gap-3 overflow-hidden rounded-[1.25rem] border-2 border-white/70 bg-white/62 p-3">
            <div className="grid min-h-24 place-items-center rounded-[1rem] bg-sky-100/70">
              <CompanionSprite species="clownfish" size={76} />
            </div>
            <div className="min-w-0 pb-2">
              <p className="text-xs font-black uppercase text-[#0b74cf]">Fish companion</p>
              <p className="mt-1 text-sm font-black leading-tight text-[#074595]">Role switching lives at login</p>
              <p className="mt-1 text-xs font-bold leading-4 text-[#3e6da6]">Sign out before trying another account.</p>
            </div>
          </div>
        </aside>

        <section className="order-1 min-w-0 rounded-[1.85rem] border-2 border-white/80 bg-white/50 p-5 shadow-[inset_0_1px_20px_rgba(255,255,255,0.74),0_28px_70px_rgba(11,79,122,0.18)] backdrop-blur-xl sm:p-7 lg:order-none">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <h1 className="text-3xl font-black leading-tight text-[#06469a] sm:text-4xl">{title}</h1>
              <p className="mt-2 max-w-4xl text-base font-black leading-7 text-[#4f70a6]">{subtitle}</p>
            </div>
            <a
              href="/login"
              className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full border border-white/80 bg-white/46 px-5 text-sm font-black text-[#06469a] shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_10px_26px_rgba(12,84,148,0.12)] transition active:translate-y-0.5"
            >
              <Home className="h-4 w-4" />
              Try Demo Login
            </a>
          </div>

          <div className="mt-5 grid gap-3 rounded-[1.25rem] border-2 border-white/75 bg-white/48 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:grid-cols-[6.25rem_minmax(0,1fr)] sm:items-center">
            <div className="grid min-h-24 place-items-center rounded-[1.05rem] border border-white/80 bg-sky-100/72">
              <span
                role="img"
                aria-label="Pufferfish companion"
                className="h-20 w-20 rounded-[1rem] bg-no-repeat"
                style={{
                  backgroundImage: "url('/images/sea-companion/concepts/puffer-fish-design-bible.png')",
                  backgroundPosition: '-4px 0px',
                  backgroundSize: '220px auto',
                }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wide text-[#0788df]">{roleLabels[resolvedRole]} fish</p>
              <h2 className="mt-1 text-lg font-black leading-tight text-[#06469a]">One room, many tools</h2>
              <p className="mt-1 text-sm font-bold leading-6 text-[#315f9a]">
                Use the left tabs to swap content without changing the dashboard frame.
              </p>
              <a href="/login" className="mt-3 inline-flex min-h-9 items-center justify-center rounded-full bg-[linear-gradient(180deg,#25c5ff,#0572df)] px-4 text-xs font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.62),0_8px_16px_rgba(0,98,201,0.25)]">
                Try Demo Login
              </a>
            </div>
          </div>

          <div className="mt-5 grid min-w-0 gap-4">{children}</div>
        </section>

        <aside className="order-3 grid min-w-0 content-start gap-4 rounded-[1.75rem] border-2 border-white/80 bg-white/42 p-4 shadow-[inset_0_1px_18px_rgba(255,255,255,0.68),0_22px_50px_rgba(13,80,126,0.18)] backdrop-blur-xl lg:order-none 2xl:sticky 2xl:top-5 2xl:max-h-[calc(100vh-2.5rem)] 2xl:overflow-auto">
          <section className="rounded-[1.35rem] border-2 border-white/68 bg-white/46 p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-[#06469a]">{resolvedSpotlight.label ?? 'Current Assignment'}</h2>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{resolvedSpotlight.status ?? 'Active'}</span>
            </div>
            <div className="mt-5 grid gap-4 rounded-[1.15rem] bg-white/44 p-4 sm:grid-cols-[5rem_minmax(0,1fr)] sm:items-center">
              <span className="grid h-20 w-20 place-items-center rounded-[1.1rem] bg-[linear-gradient(180deg,#38d7ff,#006bd8)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_14px_22px_rgba(0,99,192,0.22)]">
                <BookOpen className="h-10 w-10" />
              </span>
              <div className="min-w-0">
                <p className="break-words text-lg font-black leading-tight text-[#06469a]">{resolvedSpotlight.title}</p>
                {resolvedSpotlight.tag ? (
                  <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{resolvedSpotlight.tag}</p>
                ) : null}
                {resolvedSpotlight.meta?.map((item) => (
                  <p key={item} className="mt-2 text-xs font-bold leading-5 text-[#4c70a5]">{item}</p>
                ))}
              </div>
            </div>
          </section>

          <section id="notifications" className="rounded-[1.35rem] border-2 border-white/68 bg-white/42 p-4">
            <div className="grid gap-3">
              {resolvedStatusItems.map((item) => (
                <div key={`${item.label}-${item.value}`} className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 border-b border-sky-300/30 pb-3 last:border-b-0 last:pb-0">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(180deg,#5dd8ff,#178de9)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <p className="min-w-0 text-sm font-black text-[#06469a]">
                    <span className="mr-2 text-lg">{item.value}</span>
                    <span className="text-xs text-[#5271a6]">{item.label}</span>
                  </p>
                  <StatusIcon tone={item.tone} />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[1.35rem] border-2 border-white/68 bg-white/46 p-4">
            <h2 className="text-lg font-black text-[#06469a]">{resolvedFeedback.title}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-[3.25rem_minmax(0,1fr)_4.5rem] sm:items-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#ffd8bd,#c85a28)] text-base font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
                {initialsFor(resolvedFeedback.name)}
              </span>
              <div className="min-w-0">
                <p className="break-words text-base font-black leading-tight text-[#06469a]">{resolvedFeedback.name}</p>
                <p className="mt-2 text-sm font-bold leading-6 text-[#4f70a6]">{resolvedFeedback.body}</p>
              </div>
              {resolvedFeedback.score ? (
                <div className="grid h-16 w-16 place-items-center rounded-full border-[0.5rem] border-emerald-500 bg-white text-lg font-black text-emerald-700">
                  {resolvedFeedback.score}
                </div>
              ) : null}
            </div>
          </section>

          {resolvedQuickActions.length > 0 ? (
            <section className="rounded-[1.35rem] border-2 border-white/68 bg-white/42 p-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 2xl:grid-cols-4">
                {resolvedQuickActions.map((action) => {
                  const Icon = action.icon

                  return (
                    <a key={`${action.href}-${action.label}`} href={action.href} className="grid min-h-[5.6rem] place-items-center gap-2 rounded-[1.05rem] text-center text-xs font-black text-[#06469a] transition hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-white">
                      <span className="grid h-14 w-14 place-items-center rounded-[1rem] bg-[linear-gradient(180deg,#25c5ff,#0572df)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.62),0_10px_18px_rgba(0,98,201,0.24)]">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="line-clamp-2">{action.label}</span>
                    </a>
                  )
                })}
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </main>
  )
}

export function LmsPanel({
  id,
  title,
  actions,
  children,
}: {
  id?: string
  title: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} className="min-w-0 scroll-mt-28 rounded-[1.35rem] border-2 border-white/70 bg-white/66 p-4 text-[#06469a] shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_14px_34px_rgba(12,84,148,0.12)] backdrop-blur-md">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-black leading-tight">{title}</h2>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="mt-3 min-w-0">{children}</div>
    </section>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-[1rem] border border-white/70 bg-white/56 px-3 py-2 text-sm font-bold text-[#315f9a]">{children}</p>
}
