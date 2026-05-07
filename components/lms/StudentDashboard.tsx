import { BarChart3, Bell, BookOpen, CalendarCheck, CalendarDays, ClipboardCheck, FileText, GraduationCap, MessageSquare, Send } from 'lucide-react'
import { LmsPanel, LmsShell } from '@/components/lms/LmsShell'
import { CalendarPanel, MessagesPanel, ResourcesPanel } from '@/components/lms/SharedLmsPanels'
import type { buildLmsDashboardViews } from '@/lib/lms/read-model'

type StudentView = ReturnType<typeof buildLmsDashboardViews>['student']

const studentTools = [
  { href: '#courses', label: 'Courses', description: 'Open enrolled classes', icon: BookOpen },
  { href: '#assignments', label: 'Assignments', description: 'Review upcoming work', icon: ClipboardCheck },
  { href: '#submit-work', label: 'Submit work', description: 'Turn in assignment responses', icon: Send },
  { href: '#grades-feedback', label: 'Grades and feedback', description: 'Read marked work', icon: GraduationCap },
  { href: '#gradebook', label: 'Gradebook', description: 'Track current standing', icon: BarChart3 },
  { href: '#attendance', label: 'Attendance', description: 'Check presence history', icon: CalendarCheck },
  { href: '#calendar', label: 'Calendar', description: 'See dated course items', icon: CalendarDays },
  { href: '#resources', label: 'Resources', description: 'Download class files', icon: FileText },
  { href: '#messages', label: 'Messages', description: 'Read teacher messages', icon: MessageSquare },
  { href: '#notifications', label: 'Notifications', description: 'Review latest alerts', icon: Bell },
]

export function StudentDashboard({ view }: { view: StudentView }) {
  return (
    <LmsShell title="Student dashboard" subtitle="Courses, upcoming assignments, submissions, grades, and feedback." tools={studentTools}>
      <div className="grid gap-4 lg:grid-cols-3">
        <LmsPanel id="courses" title="My courses">
          <ul className="grid gap-2">
            {view.courses.map((course) => (
              <li key={course.id} className="rounded-md border border-slate-200 text-sm dark:border-slate-800">
                <a href="#gradebook" className="flex items-center gap-2 px-3 py-2 hover:bg-teal-50 dark:hover:bg-teal-950/40">
                  <BookOpen className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                  <span className="grid gap-0.5">
                    <span className="font-semibold">{course.title}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">View progress</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </LmsPanel>

        <LmsPanel id="assignments" title="Assignments">
          <ul className="grid gap-2">
            {view.assignments.map((assignment) => (
              <li key={assignment.id} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <span className="inline-flex items-center gap-2 font-semibold">
                    <ClipboardCheck className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                    {assignment.title}
                  </span>
                  <a href="#submit-work" className="text-sm font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-200 dark:hover:text-teal-100">
                    Submit work
                  </a>
                </div>
                <span className="mt-1 block text-slate-500 dark:text-slate-400">Due {assignment.dueAt}</span>
              </li>
            ))}
          </ul>
        </LmsPanel>

        <LmsPanel id="notifications" title="Notifications">
          <ul className="grid gap-2">
            {view.notifications.map((notification) => (
              <li key={notification.id} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                <span className="inline-flex items-center gap-2 font-semibold">
                  <Bell className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                  {notification.title}
                </span>
                <span className="mt-1 block text-slate-500 dark:text-slate-400">{notification.message}</span>
              </li>
            ))}
          </ul>
        </LmsPanel>
      </div>

      <LmsPanel id="grades-feedback" title="Grades and feedback">
        <ul className="grid gap-2">
          {view.grades.map((grade) => (
            <li key={grade.assignmentTitle} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
              <span className="font-semibold">{grade.assignmentTitle}</span>
              <span className="ml-2 font-semibold text-teal-700 dark:text-teal-200">{grade.scoreLabel}</span>
              <p className="mt-1 text-slate-600 dark:text-slate-200">{grade.feedback}</p>
            </li>
          ))}
        </ul>
      </LmsPanel>

      <div className="grid gap-4 lg:grid-cols-2">
        <LmsPanel id="gradebook" title="Gradebook">
          <ul className="grid gap-2">
            {view.gradebook.map((course) => (
              <li key={course.courseId} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                <span className="inline-flex items-center gap-2 font-semibold">
                  <BarChart3 className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                  {course.courseTitle}
                </span>
                <dl className="mt-2 grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-200 sm:grid-cols-4">
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Current</dt>
                    <dd className="font-semibold">{course.currentPercentage}% {course.letterGrade}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Missing</dt>
                    <dd className="font-semibold">{course.missingAssignments}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Attendance</dt>
                    <dd className="font-semibold">{course.attendanceRate}%</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Risk</dt>
                    <dd className="font-semibold capitalize">{course.riskLevel}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </LmsPanel>

        <LmsPanel id="attendance" title="Attendance">
          <ul className="grid gap-2">
            {view.attendance.map((summary) => (
              <li key={summary.courseId} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                <span className="inline-flex items-center gap-2 font-semibold">
                  <CalendarCheck className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                  {summary.courseTitle}
                </span>
                <span className="mt-1 block text-slate-500 dark:text-slate-400">
                  {summary.attendanceRate}% present/online, {summary.absent} absent, {summary.tardy} tardy
                </span>
              </li>
            ))}
          </ul>
        </LmsPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <CalendarPanel items={view.calendar} />
        <ResourcesPanel resources={view.resources} />
        <MessagesPanel messages={view.messages} />
      </div>

      <LmsPanel id="submit-work" title="Submit work">
        <ul className="grid gap-3">
          {view.assignments.map((assignment) => (
            <li key={assignment.id} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold">{assignment.title}</span>
                <span className="text-slate-500 dark:text-slate-400">Due {assignment.dueAt}</span>
              </div>
              <form action="/api/lms/submissions" method="post" className="mt-3 grid gap-3">
                <input name="assignmentId" type="hidden" value={assignment.id} />
                <label className="grid gap-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  Response
                  <textarea
                    name="content"
                    required
                    rows={4}
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </label>
                <button
                  type="submit"
                  aria-label={`Submit ${assignment.title}`}
                  className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
                >
                  <Send className="h-4 w-4" />
                  Submit work
                </button>
              </form>
            </li>
          ))}
        </ul>
      </LmsPanel>
    </LmsShell>
  )
}
