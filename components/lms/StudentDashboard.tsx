import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  Clock,
  CloudSun,
  Compass,
  FileText,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  Leaf,
  LogOut,
  MessageSquare,
  Mountain,
  Send,
  Settings,
  Target,
  Trees,
  type LucideIcon,
} from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { StudentCompanionWidget } from '@/components/lms/StudentCompanionWidget'
import { StudentPreferenceBridge } from '@/components/lms/StudentThemeSettings'
import type { buildLmsDashboardViews } from '@/lib/lms/read-model'

type StudentView = ReturnType<typeof buildLmsDashboardViews>['student']

type StudentTool = {
  href: string
  label: string
  description: string
  icon: LucideIcon
}

const studentTools: StudentTool[] = [
  { href: '/student/courses', label: 'Courses', description: 'Open enrolled classes', icon: BookOpen },
  { href: '/student/assignments', label: 'Assignments', description: 'Review upcoming work', icon: ClipboardCheck },
  { href: '/student/assignments#submit-work', label: 'Submit work', description: 'Turn in assignment responses', icon: Send },
  { href: '/student/grades-feedback', label: 'Grades and feedback', description: 'Read marked work', icon: GraduationCap },
  { href: '/student/gradebook', label: 'Gradebook', description: 'Track current standing', icon: BarChart3 },
  { href: '/student/attendance', label: 'Attendance', description: 'Check presence history', icon: CalendarCheck },
  { href: '/student/calendar', label: 'Calendar', description: 'See dated course items', icon: CalendarDays },
  { href: '/student/resources', label: 'Resources', description: 'Download class files', icon: FileText },
  { href: '/student/messages', label: 'Messages', description: 'Read teacher messages', icon: MessageSquare },
  { href: '/student/notifications', label: 'Notifications', description: 'Review latest alerts', icon: Bell },
  { href: '/student/companion-world', label: 'Companion world', description: 'Visit Glacier Commons', icon: Compass },
]

const toolStyles = [
  'from-emerald-500 via-teal-400 to-sky-400',
  'from-lime-500 via-emerald-400 to-teal-400',
  'from-sky-500 via-cyan-400 to-emerald-300',
  'from-amber-400 via-lime-400 to-emerald-400',
  'from-teal-600 via-cyan-500 to-blue-400',
  'from-green-600 via-emerald-400 to-lime-300',
  'from-cyan-500 via-sky-400 to-blue-400',
  'from-stone-500 via-emerald-500 to-lime-400',
  'from-teal-500 via-sky-400 to-cyan-300',
  'from-lime-500 via-teal-400 to-sky-500',
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

function riskTone(risk: string) {
  if (risk === 'high') return 'text-rose-700 bg-rose-50 border-rose-200'
  if (risk === 'watch') return 'text-amber-800 bg-amber-50 border-amber-200'

  return 'text-emerald-800 bg-emerald-50 border-emerald-200'
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

function BorealPanel({
  id,
  title,
  icon: Icon,
  children,
  className = '',
}: {
  id?: string
  title: string
  icon: LucideIcon
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 rounded-lg border border-white/75 bg-white/84 p-4 shadow-[0_18px_50px_rgba(5,44,38,0.18)] backdrop-blur-md ${className}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-sky-400 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_8px_18px_rgba(13,148,136,0.22)]">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-base font-bold leading-tight text-[#17352c]">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function LearningDial({
  value,
  label,
  detail,
  color,
  valueDisplay,
}: {
  value: number
  label: string
  detail: string
  color: string
  valueDisplay?: string
}) {
  const percent = clampPercent(value)

  return (
    <div className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-white/68 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
      <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full p-2 shadow-[inset_0_1px_5px_rgba(255,255,255,0.75),0_9px_18px_rgba(17,94,89,0.12)]" style={ringStyle(percent, color)}>
        <div className="grid h-full w-full place-items-center rounded-full bg-[#f8fff9] text-center">
          <span className="text-lg font-black leading-none text-[#17352c]">{valueDisplay ?? `${percent}%`}</span>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-[#17352c]">{label}</p>
        <p className="mt-1 text-xs leading-5 text-[#48675e]">{detail}</p>
      </div>
    </div>
  )
}

function EmptyForestState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-emerald-300 bg-emerald-50/70 px-3 py-3 text-sm font-semibold text-[#31544b]">
      {children}
    </p>
  )
}

export function StudentDashboard({ view }: { view: StudentView }) {
  const gradeAverage = average(view.gradebook.map((course) => course.currentPercentage))
  const attendanceAverage = average(view.attendance.map((summary) => summary.attendanceRate), 100)
  const missingWork = view.gradebook.reduce((total, course) => total + course.missingAssignments, 0)
  const momentum = clampPercent(gradeAverage * 0.65 + attendanceAverage * 0.35 - missingWork * 5)
  const nextAssignment = view.assignments[0]
  const studentFirstName = view.student.name.split(' ')[0] || 'Student'
  const gradedCount = view.gradebook.reduce((total, course) => total + course.gradedAssignments, 0)
  const unreadNotifications = view.notifications.length

  return (
    <main
      id="dashboard-top"
      className="student-theme-shell relative min-h-screen scroll-mt-28 overflow-hidden bg-[#063d37] text-[#17352c]"
    >
      <StudentPreferenceBridge />
      <div
        aria-hidden="true"
        className="student-theme-backdrop absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.86),transparent_18rem),radial-gradient(circle_at_76%_6%,rgba(125,211,252,0.52),transparent_22rem),linear-gradient(180deg,#b8e9ff_0%,#72c7c0_28%,#0a5f59_58%,#063d37_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-80 bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(255,255,255,0)),radial-gradient(ellipse_at_50%_100%,rgba(9,68,61,0.42),transparent_42%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-32 h-72 bg-bottom bg-repeat-x opacity-65"
        style={{ backgroundImage: 'url("/images/clay-forest/evergreen-skyline.png")', backgroundSize: 'auto 100%' }}
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-72 h-[28rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(163,230,243,0.72),rgba(14,116,144,0.45)_32%,rgba(6,78,59,0.28)_68%,transparent_100%)]" />
      <div aria-hidden="true" className="absolute -left-24 top-44 h-80 w-80 rounded-full bg-emerald-200/28 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-24 top-16 h-96 w-96 rounded-full bg-sky-100/38 blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-72 bg-[linear-gradient(180deg,rgba(6,61,55,0),rgba(5,45,38,0.48))]" />

      <div className="relative mx-auto grid max-w-[1580px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[168px_minmax(0,1fr)] lg:px-8">
        <aside className="order-2 lg:sticky lg:top-5 lg:order-1 lg:self-start">
          <div className="rounded-lg border border-white/75 bg-[#0f3d35]/82 p-3 text-white shadow-[0_18px_48px_rgba(5,44,38,0.26)] backdrop-blur-md">
            <div className="mb-3 grid place-items-center rounded-lg border border-white/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.16),rgba(34,197,94,0.08))] p-3">
              <div className="grid h-16 w-16 place-items-center rounded-full border border-lime-200/60 bg-[radial-gradient(circle_at_35%_28%,#ffffff,#a7f3d0_42%,#14532d_100%)] text-[#123a33] shadow-[inset_0_1px_8px_rgba(255,255,255,0.88),0_10px_22px_rgba(0,0,0,0.22)]">
                <Trees className="h-7 w-7" />
              </div>
              <p className="mt-2 text-center text-xs font-bold leading-5 text-emerald-50">WolfWhale</p>
            </div>

            <a
              href="#dashboard-top"
              className="group flex min-h-12 items-center gap-3 rounded-lg bg-gradient-to-r from-lime-500/28 to-emerald-300/20 px-3 py-2 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-lime-200 focus:ring-offset-2 focus:ring-offset-[#0f3d35]"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard home</span>
            </a>

            <div className="mt-3 grid gap-2">
              <a
                href="/student/settings"
                className="flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white transition hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-lime-200 focus:ring-offset-2 focus:ring-offset-[#0f3d35]"
              >
                <Settings className="h-4 w-4" />
                Settings
              </a>
              <div className="rounded-lg border border-white/15 bg-white/10 px-3 py-2">
                <p className="text-xs font-bold text-emerald-100">Momentum</p>
                <p className="mt-1 text-2xl font-black leading-none text-white">{momentum}</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 px-3 py-2">
                <p className="text-xs font-bold text-emerald-100">Due soon</p>
                <p className="mt-1 text-2xl font-black leading-none text-white">{view.assignments.length}</p>
              </div>
            </div>

            <form action="/api/auth/logout" method="post" className="mt-3">
              <button
                type="submit"
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-[linear-gradient(135deg,rgba(94,53,24,0.94),rgba(132,88,42,0.94))] px-3 py-2 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-lime-200 focus:ring-offset-2 focus:ring-offset-[#0f3d35]"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <div className="order-1 min-w-0 space-y-5 lg:order-2">
          <section className="relative overflow-hidden rounded-lg border border-white/80 bg-white/62 p-5 shadow-[0_22px_62px_rgba(24,80,70,0.14)] backdrop-blur-md sm:p-6">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(186,230,253,0.55),rgba(255,255,255,0))]" />
            <div aria-hidden="true" className="absolute bottom-0 right-0 h-40 w-72 rounded-tl-full bg-[radial-gradient(circle_at_70%_90%,rgba(22,101,52,0.24),transparent_62%)]" />
            <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/72 px-3 py-1 text-xs font-bold text-[#285549] shadow-sm">
                    <CloudSun className="h-3.5 w-3.5 text-sky-600" />
                    Today
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-800">
                    <Leaf className="h-3.5 w-3.5" />
                    {unreadNotifications} alert{unreadNotifications === 1 ? '' : 's'}
                  </span>
                </div>
                <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-[#102f29] sm:text-4xl">
                  Student dashboard
                </h1>
                <p className="mt-2 max-w-3xl text-base font-semibold leading-7 text-[#345c52]">
                  Good morning, {studentFirstName}. Your courses, quests, feedback, and learning signals are ready.
                </p>
              </div>

              <div className="rounded-lg border border-white/75 bg-[#f8fff9]/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_14px_30px_rgba(17,94,89,0.1)]">
                <div className="flex items-center gap-3">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,#8ee7d1_45%,#0f766e_100%)] shadow-[inset_0_1px_9px_rgba(255,255,255,0.9),0_10px_22px_rgba(13,148,136,0.22)]">
                    <Compass className="h-7 w-7 text-[#12443b]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-[#17352c]">Next waypoint</p>
                    <p className="mt-1 text-sm leading-6 text-[#48675e]">
                      {nextAssignment ? `${nextAssignment.title} due ${formatShortDate(nextAssignment.dueAt)}` : 'No assignment due soon'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <nav
            aria-label="Dashboard tools"
            className="rounded-lg border border-white/70 bg-[#0b3f39]/72 p-3 shadow-[0_18px_52px_rgba(5,44,38,0.26)] backdrop-blur-md"
          >
            <div className="flex flex-col gap-1 px-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-black text-white">Tool hub</h2>
              <span className="text-xs font-bold text-emerald-100">{studentTools.length} dashboard tools</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
              {studentTools.map((tool, index) => {
                const Icon = tool.icon

                return (
                  <a
                    key={tool.href}
                    href={tool.href}
                    aria-label={`${tool.label} ${tool.description}`}
                    className="group relative min-h-[7rem] overflow-hidden rounded-lg border border-white/20 bg-[linear-gradient(145deg,rgba(17,61,49,0.94),rgba(48,89,55,0.9))] p-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_12px_26px_rgba(4,33,29,0.2)] transition hover:translate-y-[-2px] hover:border-lime-200/60 focus:outline-none focus:ring-2 focus:ring-lime-200 focus:ring-offset-2 focus:ring-offset-[#0b3f39]"
                  >
                    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-10 bg-[linear-gradient(180deg,rgba(132,204,22,0),rgba(132,204,22,0.2))]" />
                    <div aria-hidden="true" className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/12" />
                    <span className={`relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br ${toolStyles[index % toolStyles.length]} text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_9px_18px_rgba(0,0,0,0.22)]`}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="relative mt-3 block">
                      <span className="block text-base font-black leading-tight text-white">{tool.label}</span>
                      <span className="mt-1 block text-xs font-semibold leading-5 text-emerald-50/86">{tool.description}</span>
                    </span>
                  </a>
                )
              })}
            </div>
          </nav>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_25rem]">
            <BorealPanel id="courses" title="Courses" icon={Trees}>
              {view.courses.length === 0 ? (
                <EmptyForestState>No enrolled courses.</EmptyForestState>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {view.courses.map((course) => {
                    const gradebook = view.gradebook.find((item) => item.courseId === course.id)
                    const progress = clampPercent(gradebook?.currentPercentage ?? 0)

                    return (
                      <a
                        key={course.id}
                        href={`/student/courses/${course.id}`}
                        className="group relative min-h-36 overflow-hidden rounded-lg border border-emerald-100 bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(217,245,229,0.76))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_24px_rgba(17,94,89,0.1)] transition hover:translate-y-[-2px] hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
                      >
                        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-10 bg-[linear-gradient(90deg,rgba(74,118,62,0.16),rgba(14,165,233,0.12))]" />
                        <div className="relative flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-base font-black leading-tight text-[#17352c]">{course.title}</p>
                            <p className="mt-1 text-xs font-semibold text-[#55736a]">{course.subject} - Grade {course.gradeLevel}</p>
                          </div>
                          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full p-1.5" style={ringStyle(progress, '#059669')}>
                            <div className="grid h-full w-full place-items-center rounded-full bg-[#f8fff9] text-sm font-black text-[#17352c]">{progress}%</div>
                          </div>
                        </div>
                        <div className="relative mt-4 flex items-center justify-between gap-3 text-sm">
                          <span className="inline-flex items-center gap-2 font-bold text-emerald-800">
                            <Mountain className="h-4 w-4" />
                            Trail progress
                          </span>
                          <span className="inline-flex items-center gap-1 font-bold text-[#23544b]">
                            View progress
                            <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </a>
                    )
                  })}
                </div>
              )}
            </BorealPanel>

            <BorealPanel title="Student analytics" icon={Gauge} className="xl:row-span-2">
              <div className="grid gap-3">
                <div className="rounded-lg border border-emerald-100 bg-[linear-gradient(145deg,rgba(248,255,249,0.96),rgba(220,246,239,0.84))] p-4">
                  <div className="flex items-center gap-4">
                    <div className="grid h-32 w-32 shrink-0 place-items-center rounded-full p-3 shadow-[inset_0_1px_8px_rgba(255,255,255,0.9),0_14px_28px_rgba(17,94,89,0.16)]" style={ringStyle(momentum, '#0ea5e9', 'rgba(14, 116, 144, 0.16)')}>
                      <div className="grid h-full w-full place-items-center rounded-full bg-white text-center">
                        <span className="text-3xl font-black leading-none text-[#123a33]">{momentum}</span>
                        <span className="text-xs font-bold text-[#55736a]">momentum</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-base font-black text-[#17352c]">Learning cockpit</p>
                      <p className="mt-2 text-sm leading-6 text-[#48675e]">
                        Mastery, attendance, and workload combined into one quick signal.
                      </p>
                    </div>
                  </div>
                </div>

                <LearningDial value={gradeAverage} label="Mastery" detail={`${gradedCount} marked assignment${gradedCount === 1 ? '' : 's'}`} color="#16a34a" />
                <LearningDial
                  value={attendanceAverage}
                  label="Attendance weather"
                  detail={`${attendanceAverage} percent present or online average`}
                  color="#0ea5e9"
                  valueDisplay={`${attendanceAverage} pct`}
                />
                <LearningDial value={100 - Math.min(100, missingWork * 25)} label="Workload health" detail={`${missingWork} missing assignment${missingWork === 1 ? '' : 's'}`} color="#f59e0b" />
                <StudentCompanionWidget compact />
              </div>
            </BorealPanel>

            <BorealPanel id="assignments" title="Assignments" icon={Target}>
              {view.assignments.length === 0 ? (
                <EmptyForestState>No assigned work.</EmptyForestState>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {view.assignments.map((assignment, index) => (
                    <article
                      key={assignment.id}
                      className="relative overflow-hidden rounded-lg border border-emerald-100 bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(233,248,238,0.8))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_22px_rgba(17,94,89,0.1)]"
                    >
                      <div aria-hidden="true" className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-200/45" />
                      <div className="relative flex items-start gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[radial-gradient(circle_at_34%_28%,#ffffff,#b7e7d3_48%,#587c61_100%)] text-[#17352c] shadow-[inset_0_1px_5px_rgba(255,255,255,0.8)]">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-black leading-snug text-[#17352c]">{assignment.title}</h3>
                          <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-[#55736a]">
                            <Clock className="h-4 w-4 text-amber-700" />
                            Due {formatShortDate(assignment.dueAt)}
                          </p>
                        </div>
                      </div>
                      <a
                        href="#submit-work"
                        className="relative mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#17352c] px-4 py-2 text-sm font-bold text-white shadow-[0_8px_18px_rgba(23,53,44,0.2)] transition hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
                      >
                        <Send className="h-4 w-4" />
                        Submit work
                      </a>
                    </article>
                  ))}
                </div>
              )}
            </BorealPanel>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <BorealPanel id="grades-feedback" title="Grades and feedback" icon={GraduationCap}>
              {view.grades.length === 0 ? (
                <EmptyForestState>No marked work yet.</EmptyForestState>
              ) : (
                <ul className="grid gap-3">
                  {view.grades.map((grade) => (
                    <li key={grade.assignmentTitle} className="rounded-lg border border-emerald-100 bg-white/70 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <span className="font-black text-[#17352c]">{grade.assignmentTitle}</span>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-800">{grade.scoreLabel}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#48675e]">{grade.feedback}</p>
                    </li>
                  ))}
                </ul>
              )}
            </BorealPanel>

            <BorealPanel id="notifications" title="Notifications" icon={Bell}>
              {view.notifications.length === 0 ? (
                <EmptyForestState>No alerts.</EmptyForestState>
              ) : (
                <ul className="grid gap-3">
                  {view.notifications.map((notification) => (
                    <li key={notification.id} className="rounded-lg border border-sky-100 bg-white/70 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                      <span className="inline-flex items-center gap-2 font-black text-[#17352c]">
                        <Bell className="h-4 w-4 text-sky-700" />
                        {notification.title}
                      </span>
                      <p className="mt-1 text-sm leading-6 text-[#48675e]">{notification.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </BorealPanel>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <BorealPanel id="gradebook" title="Gradebook" icon={BarChart3}>
              {view.gradebook.length === 0 ? (
                <EmptyForestState>No gradebook rows.</EmptyForestState>
              ) : (
                <ul className="grid gap-3">
                  {view.gradebook.map((course) => (
                    <li key={course.courseId} className="rounded-lg border border-emerald-100 bg-white/72 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <p className="font-black text-[#17352c]">{course.courseTitle}</p>
                          <p className="mt-1 text-sm font-semibold text-[#55736a]">Learning health is {course.riskLevel}</p>
                        </div>
                        <span className={`w-fit rounded-full border px-3 py-1 text-sm font-black capitalize ${riskTone(course.riskLevel)}`}>
                          {course.riskLevel}
                        </span>
                      </div>
                      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                        <div className="rounded-lg bg-emerald-50/80 p-3">
                          <dt className="font-bold text-[#55736a]">Current</dt>
                          <dd className="mt-1 font-black text-[#17352c]">{course.currentPercentage}% {course.letterGrade}</dd>
                        </div>
                        <div className="rounded-lg bg-amber-50/80 p-3">
                          <dt className="font-bold text-[#55736a]">Missing</dt>
                          <dd className="mt-1 font-black text-[#17352c]">{course.missingAssignments}</dd>
                        </div>
                        <div className="rounded-lg bg-sky-50/80 p-3">
                          <dt className="font-bold text-[#55736a]">Attendance</dt>
                          <dd className="mt-1 font-black text-[#17352c]">{course.attendanceRate}%</dd>
                        </div>
                        <div className="rounded-lg bg-lime-50/80 p-3">
                          <dt className="font-bold text-[#55736a]">Graded</dt>
                          <dd className="mt-1 font-black text-[#17352c]">{course.gradedAssignments}</dd>
                        </div>
                      </dl>
                    </li>
                  ))}
                </ul>
              )}
            </BorealPanel>

            <BorealPanel id="attendance" title="Attendance" icon={CalendarCheck}>
              {view.attendance.length === 0 ? (
                <EmptyForestState>No attendance records.</EmptyForestState>
              ) : (
                <ul className="grid gap-3">
                  {view.attendance.map((summary) => (
                    <li key={summary.courseId} className="rounded-lg border border-sky-100 bg-white/72 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                      <div className="flex items-center gap-3">
                        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full p-1.5" style={ringStyle(summary.attendanceRate, '#0ea5e9')}>
                          <div className="grid h-full w-full place-items-center rounded-full bg-[#f8fff9] text-sm font-black text-[#17352c]">{summary.attendanceRate} pct</div>
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-[#17352c]">{summary.courseTitle}</p>
                          <p className="mt-1 text-sm leading-6 text-[#48675e]">
                            {summary.attendanceRate} percent present/online, {summary.absent} absent, {summary.tardy} tardy
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </BorealPanel>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            <BorealPanel id="calendar" title="Calendar" icon={CalendarDays}>
              {view.calendar.length === 0 ? (
                <EmptyForestState>No dated LMS items.</EmptyForestState>
              ) : (
                <ul className="grid gap-3">
                  {view.calendar.map((item) => (
                    <li key={item.id} className="rounded-lg border border-sky-100 bg-white/72 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                      <span className="font-black text-[#17352c]">{item.title}</span>
                      <span className="mt-1 block font-semibold text-[#55736a]">
                        {item.courseTitle} - {formatShortDate(item.dueAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </BorealPanel>

            <BorealPanel id="resources" title="Resources" icon={FileText}>
              {view.resources.length === 0 ? (
                <EmptyForestState>No course resources.</EmptyForestState>
              ) : (
                <ul className="grid gap-3">
                  {view.resources.map((resource) => (
                    <li key={resource.id} className="rounded-lg border border-emerald-100 bg-white/72 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                      <a
                        href={`/api/lms/resources/${resource.id}`}
                        className="inline-flex items-center gap-2 font-black text-emerald-800 transition hover:text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
                      >
                        <FileText className="h-4 w-4" />
                        {resource.title}
                      </a>
                      <span className="mt-1 block font-semibold text-[#55736a]">
                        {resource.courseTitle} - {resource.fileName}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </BorealPanel>

            <BorealPanel id="messages" title="Messages" icon={MessageSquare}>
              {view.messages.length === 0 ? (
                <EmptyForestState>No visible messages.</EmptyForestState>
              ) : (
                <ul className="grid gap-3">
                  {view.messages.slice(0, 5).map((message) => (
                    <li key={message.id} className="rounded-lg border border-sky-100 bg-white/72 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                      <span className="font-black text-[#17352c]">{message.subject}</span>
                      <span className="mt-1 block font-semibold text-[#55736a]">
                        {message.senderName} - {formatShortDate(message.createdAt)}
                      </span>
                      <p className="mt-1 leading-6 text-[#48675e]">{message.content}</p>
                    </li>
                  ))}
                </ul>
              )}
            </BorealPanel>
          </div>

          <BorealPanel id="submit-work" title="Submit work" icon={Send}>
            {view.assignments.length === 0 ? (
              <EmptyForestState>No assignment forms available.</EmptyForestState>
            ) : (
              <ul className="grid gap-4">
                {view.assignments.map((assignment) => (
                  <li key={assignment.id} className="rounded-lg border border-emerald-100 bg-white/72 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="font-black text-[#17352c]">{assignment.title}</span>
                      <span className="text-sm font-bold text-[#55736a]">Due {formatShortDate(assignment.dueAt)}</span>
                    </div>
                    <form action="/api/lms/submissions" method="post" className="mt-3 grid gap-3">
                      <input name="assignmentId" type="hidden" value={assignment.id} />
                      <label className="grid gap-2 text-sm font-black text-[#17352c]">
                        Response
                        <textarea
                          name="content"
                          required
                          rows={4}
                          className="rounded-lg border border-emerald-200 bg-[#fbfffc] px-3 py-2 text-sm font-semibold text-[#17352c] shadow-inner outline-none transition placeholder:text-[#7a938a] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
                        />
                      </label>
                      <button
                        type="submit"
                        aria-label={`Submit ${assignment.title}`}
                        className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#16423a] to-[#0f766e] px-4 py-2 text-sm font-black text-white shadow-[0_10px_22px_rgba(17,94,89,0.24)] transition hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
                      >
                        <Send className="h-4 w-4" />
                        Submit work
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </BorealPanel>

        </div>
      </div>
    </main>
  )
}
