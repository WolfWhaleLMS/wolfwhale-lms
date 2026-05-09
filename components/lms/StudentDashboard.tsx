import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  CloudSun,
  Compass,
  FileText,
  Gauge,
  GraduationCap,
  Leaf,
  LogOut,
  MessageSquare,
  Send,
  Settings,
  Target,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { StudentCompanionWidget } from '@/components/lms/StudentCompanionWidget'
import { StudentPreferenceBridge } from '@/components/lms/StudentThemeSettings'
import type { buildLmsDashboardViews } from '@/lib/lms/read-model'

type StudentView = ReturnType<typeof buildLmsDashboardViews>['student']

const savedMessages: Record<string, string> = {
  submission: 'Work submitted. Your teacher can now review it.',
}

const errorMessages: Record<string, string> = {
  rate_limited: 'Too many requests. Wait a moment and try again.',
  lms_mutation_failed: 'That LMS action did not save. Try again or contact your school.',
}

type StudentTool = {
  href: string
  label: string
  description: string
  icon: LucideIcon
  tone: string
}

const studentTools: StudentTool[] = [
  { href: '/student/courses', label: 'Courses', description: 'Open class spaces', icon: BookOpen, tone: 'from-emerald-500 via-teal-400 to-sky-400' },
  { href: '/student/assignments', label: 'Assignments', description: 'See upcoming work', icon: ClipboardCheck, tone: 'from-lime-500 via-emerald-400 to-teal-400' },
  { href: '/student/assignments#submit-work', label: 'Submit work', description: 'Turn in responses', icon: Send, tone: 'from-sky-500 via-cyan-400 to-emerald-300' },
  { href: '/student/grades-feedback', label: 'Grades and feedback', description: 'Read marked work', icon: GraduationCap, tone: 'from-amber-400 via-lime-400 to-emerald-400' },
  { href: '/student/gradebook', label: 'Gradebook', description: 'Track standing', icon: BarChart3, tone: 'from-teal-600 via-cyan-500 to-blue-400' },
  { href: '/student/attendance', label: 'Attendance', description: 'Check presence', icon: CalendarCheck, tone: 'from-green-600 via-emerald-400 to-lime-300' },
  { href: '/student/calendar', label: 'Calendar', description: 'Plan due dates', icon: CalendarDays, tone: 'from-cyan-500 via-sky-400 to-blue-400' },
  { href: '/student/resources', label: 'Resources', description: 'Open class files', icon: FileText, tone: 'from-stone-500 via-emerald-500 to-lime-400' },
  { href: '/student/messages', label: 'Messages', description: 'Teacher notes', icon: MessageSquare, tone: 'from-teal-500 via-sky-400 to-cyan-300' },
  { href: '/student/notifications', label: 'Notifications', description: 'Latest updates', icon: Bell, tone: 'from-lime-500 via-teal-400 to-sky-500' },
  { href: '/student/companion-world', label: 'Companion world', description: 'Visit Glacier Commons', icon: Compass, tone: 'from-amber-400 via-sky-400 to-emerald-400' },
  { href: '/student/settings', label: 'Settings', description: 'Themes and pet', icon: Settings, tone: 'from-slate-500 via-emerald-500 to-sky-400' },
]

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0

  return Math.min(100, Math.max(0, Math.round(value)))
}

function average(values: number[], fallback = 0) {
  const usableValues = values.filter((value) => Number.isFinite(value))
  if (usableValues.length === 0) return fallback

  return Math.round(usableValues.reduce((total, value) => total + value, 0) / usableValues.length)
}

function formatShortDate(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function ringStyle(value: number, color = '#16a34a', track = 'rgba(22, 101, 52, 0.14)'): CSSProperties {
  const percent = clampPercent(value)

  return {
    background: `conic-gradient(${color} ${percent * 3.6}deg, ${track} 0deg)`,
  }
}

function AppPanel({
  title,
  icon: Icon,
  children,
  href,
}: {
  title: string
  icon: LucideIcon
  children: ReactNode
  href?: string
}) {
  return (
    <section className="student-workspace-panel rounded-lg border border-white/75 bg-white/84 p-3 shadow-[0_18px_50px_rgba(5,44,38,0.18)] backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-sky-400 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_8px_18px_rgba(13,148,136,0.22)]">
            <Icon className="h-4 w-4" />
          </span>
          <h2 className="text-base font-black leading-tight text-[#17352c]">{title}</h2>
        </div>
        {href ? (
          <a href={href} className="inline-flex items-center gap-1 text-sm font-black text-emerald-800 hover:text-emerald-950">
            Open
            <ChevronRight className="h-4 w-4" />
          </a>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-white/72 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
      <p className="text-xs font-bold text-[#55736a]">{label}</p>
      <p className="mt-0.5 text-lg font-black leading-none text-[#17352c]">{value}</p>
    </div>
  )
}

export function StudentDashboard({ view, saved, error }: { view: StudentView; saved?: string; error?: string }) {
  const gradeAverage = average(view.gradebook.map((course) => course.currentPercentage))
  const attendanceAverage = average(view.attendance.map((summary) => summary.attendanceRate), 100)
  const missingWork = view.gradebook.reduce((total, course) => total + course.missingAssignments, 0)
  const momentum = clampPercent(gradeAverage * 0.65 + attendanceAverage * 0.35 - missingWork * 5)
  const studentFirstName = view.student.name.split(' ')[0] || 'Student'
  const nextAssignment = view.assignments[0]
  const latestGrade = view.grades[0]
  const latestMessage = view.messages[0]

  return (
    <main
      id="dashboard-top"
      className="student-theme-shell relative min-h-screen overflow-hidden bg-[#063d37] text-[#17352c]"
    >
      <StudentPreferenceBridge />
      <div
        aria-hidden="true"
        className="student-theme-backdrop absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.86),transparent_18rem),radial-gradient(circle_at_76%_6%,rgba(125,211,252,0.52),transparent_22rem),linear-gradient(180deg,#b8e9ff_0%,#72c7c0_28%,#0a5f59_58%,#063d37_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-80 bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(255,255,255,0)),radial-gradient(ellipse_at_50%_100%,rgba(9,68,61,0.42),transparent_42%)]" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-32 h-72 bg-bottom bg-repeat-x opacity-65"
        style={{ backgroundImage: 'url("/images/clay-forest/evergreen-skyline.png")', backgroundSize: 'auto 100%' }}
      />
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-72 bg-[linear-gradient(180deg,rgba(6,61,55,0),rgba(5,45,38,0.48))]" />

      <div className="relative mx-auto grid min-h-screen max-w-[1580px] grid-rows-[auto_1fr] gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <header className="student-workspace-panel rounded-lg border border-white/80 bg-white/70 p-3 shadow-[0_22px_62px_rgba(24,80,70,0.14)] backdrop-blur-md">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/72 px-3 py-1 text-xs font-bold text-[#285549] shadow-sm">
                  <CloudSun className="h-3.5 w-3.5 text-sky-600" />
                  Today
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-800">
                  <Leaf className="h-3.5 w-3.5" />
                  {view.notifications.length} alert{view.notifications.length === 1 ? '' : 's'}
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-black leading-tight text-[#102f29] sm:text-4xl">Student dashboard</h1>
              <p className="mt-1 max-w-3xl text-sm font-semibold leading-6 text-[#345c52]">
                Good morning, {studentFirstName}. Pick a tool, jump into a course, or check the next thing due.
              </p>
              {saved && savedMessages[saved] ? (
                <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/90 px-3 py-2 text-sm font-black text-emerald-800">
                  {savedMessages[saved]}
                </p>
              ) : null}
              {error && errorMessages[error] ? (
                <p className="mt-3 rounded-lg border border-red-200 bg-red-50/90 px-3 py-2 text-sm font-black text-red-800">
                  {errorMessages[error]}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <a href="/student/settings" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-white/78 px-3 py-2 text-sm font-black text-[#17352c]">
                <Settings className="h-4 w-4" />
                Settings
              </a>
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#17352c] px-3 py-2 text-sm font-black text-white">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>

        <div className="grid min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="grid min-h-0 gap-4 content-start">
            <section className="student-workspace-panel rounded-lg border border-white/75 bg-[#0b3f39]/72 p-3 shadow-[0_18px_52px_rgba(5,44,38,0.26)] backdrop-blur-md">
              <div className="flex flex-col gap-1 px-1 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-black text-white">Tool hub</h2>
                <span className="text-xs font-bold text-emerald-100">Everything opens a page</span>
              </div>

              <nav aria-label="Dashboard tools" className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {studentTools.map((tool) => {
                  const Icon = tool.icon

                  return (
                    <a
                      key={tool.href}
                      href={tool.href}
                      aria-label={`${tool.label} ${tool.description}`}
                      className="group relative min-h-[5.35rem] overflow-hidden rounded-lg border border-white/20 bg-[linear-gradient(145deg,rgba(17,61,49,0.94),rgba(48,89,55,0.9))] p-2.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_12px_26px_rgba(4,33,29,0.2)] transition hover:translate-y-[-2px] hover:border-lime-200/60 focus:outline-none focus:ring-2 focus:ring-lime-200 focus:ring-offset-2 focus:ring-offset-[#0b3f39]"
                    >
                      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-10 bg-[linear-gradient(180deg,rgba(132,204,22,0),rgba(132,204,22,0.2))]" />
                      <div aria-hidden="true" className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/12" />
                      <span className={`relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${tool.tone} text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_9px_18px_rgba(0,0,0,0.22)]`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="relative mt-2 block">
                        <span className="block text-base font-black leading-tight text-white">{tool.label}</span>
                        <span className="mt-0.5 block text-xs font-semibold leading-5 text-emerald-50/86">{tool.description}</span>
                      </span>
                    </a>
                  )
                })}
              </nav>
            </section>

            <section className="student-workspace-panel rounded-lg border border-white/75 bg-white/82 p-3 shadow-[0_18px_46px_rgba(5,44,38,0.16)] backdrop-blur-md">
              <div className="flex items-center justify-between gap-3 px-1">
                <h2 className="text-base font-black text-[#17352c]">My courses</h2>
                <Link href="/student/courses" className="inline-flex items-center gap-1 text-sm font-black text-emerald-800 hover:text-emerald-950">
                  All courses
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <nav aria-label="Student courses" className="mt-3 grid gap-2 md:grid-cols-3">
                {view.courses.slice(0, 3).map((course) => {
                  const gradebook = view.gradebook.find((item) => item.courseId === course.id)

                  return (
                    <Link
                      key={course.id}
                      href={`/student/courses/${course.id}`}
                      className="group rounded-lg border border-emerald-100 bg-white/78 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:translate-y-[-1px] hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-black text-[#17352c]">{course.title}</span>
                          <span className="mt-0.5 block truncate text-xs font-semibold text-[#55736a]">{course.subject}</span>
                        </span>
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-800">{gradebook?.currentPercentage ?? 0}%</span>
                      </div>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-black text-emerald-800">
                        Open course
                        <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  )
                })}
              </nav>
            </section>
          </div>

          <aside className="grid content-start gap-4">
            <AppPanel title="Learning cockpit" icon={Gauge} href="/student/gradebook">
              <div className="grid gap-3">
                <div className="rounded-lg border border-emerald-100 bg-[linear-gradient(145deg,rgba(248,255,249,0.96),rgba(220,246,239,0.84))] p-3">
                  <div className="flex items-center gap-4">
                    <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full p-2 shadow-[inset_0_1px_8px_rgba(255,255,255,0.9),0_14px_28px_rgba(17,94,89,0.16)]" style={ringStyle(momentum, '#0ea5e9', 'rgba(14, 116, 144, 0.16)')}>
                      <div className="grid h-full w-full place-items-center rounded-full bg-white text-center">
                        <span className="text-xl font-black leading-none text-[#123a33]">{momentum}</span>
                        <span className="text-xs font-bold text-[#55736a]">momentum</span>
                      </div>
                    </div>
                    <div className="grid min-w-0 flex-1 gap-2">
                      <StatPill label="Mastery" value={`${gradeAverage}%`} />
                      <StatPill label="Attendance" value={`${attendanceAverage}%`} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <StatPill label="Missing" value={missingWork} />
                  <StatPill label="Courses" value={view.courses.length} />
                </div>
                <div className="grid gap-2">
                  <a aria-label="Open next assignment" href={nextAssignment ? '/student/assignments#submit-work' : '/student/assignments'} className="group flex items-center gap-2 rounded-lg border border-emerald-100 bg-white/76 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:border-emerald-300">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-lime-500 to-emerald-400 text-white">
                      <Target className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-black uppercase tracking-[0.12em] text-emerald-700">Next action</span>
                      <span className="mt-0.5 block truncate text-sm font-black text-[#17352c]">{nextAssignment?.title ?? 'No assignment due soon'}</span>
                      <span className="mt-0.5 block truncate text-xs font-semibold text-[#55736a]">
                        {nextAssignment ? `${nextAssignment.courseTitle} due ${formatShortDate(nextAssignment.dueAt)}` : 'Open assignments when new work appears.'}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-emerald-800 transition group-hover:translate-x-0.5" />
                  </a>

                  <a aria-label="Open latest feedback" href="/student/grades-feedback" className="group flex items-center gap-2 rounded-lg border border-amber-100 bg-white/76 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:border-amber-300">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-lime-400 text-[#17352c]">
                      <GraduationCap className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-black uppercase tracking-[0.12em] text-amber-700">Latest feedback</span>
                      <span className="mt-0.5 block truncate text-sm font-black text-[#17352c]">{latestGrade?.assignmentTitle ?? 'No marked work yet'}</span>
                      <span className="mt-0.5 block truncate text-xs font-semibold text-[#55736a]">
                        {latestGrade ? `${latestGrade.scoreLabel} - ${latestGrade.feedback}` : 'Feedback will show up here after grading.'}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-emerald-800 transition group-hover:translate-x-0.5" />
                  </a>

                  <a aria-label="Open latest message" href="/student/messages" className="group flex items-center gap-2 rounded-lg border border-sky-100 bg-white/76 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:border-sky-300">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-300 text-white">
                      <MessageSquare className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-black uppercase tracking-[0.12em] text-sky-700">Latest message</span>
                      <span className="mt-0.5 block truncate text-sm font-black text-[#17352c]">{latestMessage?.subject ?? 'No messages'}</span>
                      <span className="mt-0.5 block truncate text-xs font-semibold text-[#55736a]">
                        {latestMessage ? latestMessage.content : 'Teacher messages will show up here.'}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-emerald-800 transition group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </AppPanel>

            <StudentCompanionWidget compact />
          </aside>
        </div>
      </div>
    </main>
  )
}
