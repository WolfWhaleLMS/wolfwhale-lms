import { Activity, AlertTriangle, BookOpen, Bell, CalendarCheck, ClipboardCheck, Download, Plus, Upload, UserPlus, Users } from 'lucide-react'
import { LmsPanel, LmsShell } from '@/components/lms/LmsShell'
import { CalendarPanel, MessagesPanel, ResourcesPanel } from '@/components/lms/SharedLmsPanels'
import type { buildLmsDashboardViews } from '@/lib/lms/read-model'

type AdminView = ReturnType<typeof buildLmsDashboardViews>['admin']

const metricIcons = [Users, Users, BookOpen, Users, ClipboardCheck, ClipboardCheck, Bell]

export function AdminDashboard({ view }: { view: AdminView }) {
  const metrics = [
    ['Active students', view.metrics.activeStudents],
    ['Active teachers', view.metrics.activeTeachers],
    ['Active courses', view.metrics.activeCourses],
    ['Active enrollments', view.metrics.activeEnrollments],
    ['Open assignments', view.metrics.openAssignments],
    ['Pending submissions', view.metrics.pendingSubmissions],
    ['Unread notifications', view.metrics.unreadNotifications],
  ] as const

  return (
    <LmsShell title="Admin dashboard" subtitle="School operations, launch health, roster, courses, and audit visibility.">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <LmsPanel title="School">
          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Name</dt>
              <dd className="mt-1 text-sm font-semibold">{view.school.name}</dd>
            </div>
            <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Slug</dt>
              <dd className="mt-1 text-sm font-semibold">{view.school.slug}</dd>
            </div>
            <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Status</dt>
              <dd className="mt-1 text-sm font-semibold">{view.school.status}</dd>
            </div>
          </dl>
        </LmsPanel>

        <LmsPanel title="Audit trail">
          <ul className="grid gap-2">
            {view.auditTrail.map((entry) => (
              <li key={entry.id} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                <Activity className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                <span className="font-semibold">{entry.action}</span>
                <span className="text-slate-500 dark:text-slate-400">{entry.resourceType}</span>
              </li>
            ))}
          </ul>
        </LmsPanel>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([label, value], index) => {
          const Icon = metricIcons[index]

          return (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-200">
                <Icon className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                {label}
              </div>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
            </div>
          )
        })}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <LmsPanel title="Risk summary">
          <div className="mb-3 flex flex-wrap gap-2">
            <a
              href="/api/lms/exports/gradebook"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              Export gradebook
            </a>
            <a
              href="/api/lms/exports/sis"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              Export SIS package
            </a>
          </div>
          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <dt className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                <Users className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                Good
              </dt>
              <dd className="mt-1 text-2xl font-semibold">{view.riskSummary.good}</dd>
            </div>
            <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <dt className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                Watch
              </dt>
              <dd className="mt-1 text-2xl font-semibold">{view.riskSummary.watch}</dd>
            </div>
            <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <dt className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-300" />
                High
              </dt>
              <dd className="mt-1 text-2xl font-semibold">{view.riskSummary.high}</dd>
            </div>
          </dl>
        </LmsPanel>

        <LmsPanel title="Attendance">
          <div className="mb-3">
            <a
              href="/api/lms/exports/attendance"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              Export attendance
            </a>
          </div>
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

      <div className="grid gap-4 lg:grid-cols-2">
        <LmsPanel title="Create course">
          <form action="/api/lms/courses" method="post" className="grid gap-3">
            <label className="grid gap-1 text-sm font-semibold">
              Course name
              <input
                name="name"
                required
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-semibold">
                Subject
                <input
                  name="subject"
                  className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                Grade
                <input
                  name="gradeLevel"
                  className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
            </div>
            <label className="grid gap-1 text-sm font-semibold">
              Description
              <textarea
                name="description"
                rows={3}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
            >
              <Plus className="h-4 w-4" />
              Create course
            </button>
          </form>
        </LmsPanel>

        <LmsPanel title="Enroll student">
          <form action="/api/lms/enrollments" method="post" className="grid gap-3">
            <label className="grid gap-1 text-sm font-semibold">
              Course
              <select
                name="courseId"
                required
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                {view.courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Student
              <select
                name="studentId"
                required
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                {view.students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Teacher
              <select
                name="teacherId"
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                {view.teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold">
              <input name="notifyStudent" type="checkbox" className="h-4 w-4 rounded border-slate-300" />
              Notify student
            </label>
            <button
              type="submit"
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
            >
              <UserPlus className="h-4 w-4" />
              Enroll student
            </button>
          </form>
        </LmsPanel>

        <LmsPanel title="Roster import">
          <form action="/api/lms/roster/import" method="post" className="grid gap-3">
            <label className="grid gap-1 text-sm font-semibold">
              CSV rows
              <textarea
                name="rosterCsv"
                required
                rows={6}
                defaultValue={'email,first_name,last_name,role,grade_level\nstudent@example.edu,Alex,Student,student,8\nteacher@example.edu,Tessa,Teacher,teacher,'}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-xs font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
            >
              <Upload className="h-4 w-4" />
              Import roster
            </button>
          </form>
        </LmsPanel>
      </div>
    </LmsShell>
  )
}
