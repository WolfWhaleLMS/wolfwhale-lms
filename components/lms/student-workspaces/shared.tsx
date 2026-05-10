import {
  ArrowLeft,
  Send,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { StudentPreferenceBridge } from '@/components/lms/StudentThemeSettings'

import { courseAssignments, courseResources, formatShortDate, gradebookForCourse } from './helpers'
import type { StudentAssignment, StudentCourse, StudentView } from './types'

export function StudentWorkspaceShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <main className="student-theme-shell relative min-h-screen overflow-hidden bg-[#063d37] px-4 py-5 text-[#17352c] sm:px-6 lg:px-8">
      <StudentPreferenceBridge />
      <div aria-hidden="true" className="absolute inset-0 student-theme-backdrop" />
      <div aria-hidden="true" className="absolute inset-x-0 top-28 h-72 bg-bottom bg-repeat-x opacity-55" style={{ backgroundImage: 'url("/images/clay-forest/evergreen-skyline.png")', backgroundSize: 'auto 100%' }} />
      <div className="relative mx-auto max-w-7xl space-y-5">
        <header className="student-workspace-panel rounded-lg border border-white/75 bg-white/84 p-5 shadow-[0_18px_50px_rgba(5,44,38,0.18)] backdrop-blur-md">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a href="/student" className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#17352c] px-3 py-2 text-sm font-black text-white">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </a>
            <a href="/student/settings" className="inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-200 bg-white/72 px-3 py-2 text-sm font-black text-[#17352c]">
              <Settings className="h-4 w-4" />
              Settings
            </a>
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-[#48675e]">{subtitle}</p>
        </header>
        {children}
      </div>
    </main>
  )
}

export function WorkspacePanel({
  id,
  title,
  icon: Icon,
  children,
}: {
  id?: string
  title: string
  icon: LucideIcon
  children: ReactNode
}) {
  return (
    <section id={id} className="student-workspace-panel scroll-mt-28 rounded-lg border border-white/75 bg-white/84 p-4 shadow-[0_18px_50px_rgba(5,44,38,0.18)] backdrop-blur-md">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-sky-400 text-white">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-lg font-black text-[#17352c]">{title}</h2>
      </div>
      {children}
    </section>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-emerald-300 bg-emerald-50/70 px-3 py-3 text-sm font-semibold text-[#31544b]">{children}</p>
}

export function AssignmentSubmitCard({ assignment }: { assignment: StudentAssignment }) {
  return (
    <article className="rounded-lg border border-emerald-100 bg-white/74 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-black text-[#17352c]">{assignment.title}</h3>
          <p className="mt-1 text-sm font-semibold text-[#48675e]">{assignment.instructions}</p>
        </div>
        <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-900">
          Due {formatShortDate(assignment.dueAt)}
        </span>
      </div>
      <form action="/api/lms/submissions" method="post" encType="multipart/form-data" className="mt-3 grid gap-3">
        <input name="assignmentId" type="hidden" value={assignment.id} />
        <label className="grid gap-2 text-sm font-black text-[#17352c]">
          Response
          <textarea
            name="content"
            rows={4}
            className="rounded-lg border border-emerald-200 bg-[#fbfffc] px-3 py-2 text-sm font-semibold text-[#17352c] shadow-inner outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
          />
        </label>
        <label className="grid gap-2 text-sm font-black text-[#17352c]">
          Attach file
          <input
            name="file"
            type="file"
            accept=".pdf,.doc,.docx,.pptx,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.mp3,.mp4,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,image/jpeg,image/png,image/gif,audio/mpeg,video/mp4,application/zip"
            className="rounded-lg border border-emerald-200 bg-[#fbfffc] px-3 py-2 text-sm font-semibold text-[#17352c] file:mr-3 file:rounded-md file:border-0 file:bg-[#17352c] file:px-3 file:py-1.5 file:text-sm file:font-black file:text-white"
          />
        </label>
        <p className="text-xs font-semibold leading-5 text-[#48675e]">Add a response, a file, or both. Files must be 25 MB or smaller.</p>
        <button type="submit" aria-label={`Submit ${assignment.title}`} className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg bg-[#17352c] px-4 py-2 text-sm font-black text-white">
          <Send className="h-4 w-4" />
          Submit work
        </button>
      </form>
    </article>
  )
}

export function CourseCard({ course, view }: { course: StudentCourse; view: StudentView }) {
  const gradebook = gradebookForCourse(view, course.id)
  const assignments = courseAssignments(view, course.id)
  const resources = courseResources(view, course.id)

  return (
    <a href={`/student/courses/${course.id}`} className="group rounded-lg border border-emerald-100 bg-white/80 p-4 shadow-[0_10px_24px_rgba(17,94,89,0.1)] transition hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-[#17352c]">{course.title}</h2>
          <p className="mt-1 text-sm font-semibold text-[#48675e]">{course.subject} - Grade {course.gradeLevel}</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-800">{gradebook?.currentPercentage ?? 0}%</span>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-lg bg-emerald-50 p-3">
          <dt className="font-bold text-[#55736a]">Assignments</dt>
          <dd className="font-black text-[#17352c]">{assignments.length}</dd>
        </div>
        <div className="rounded-lg bg-sky-50 p-3">
          <dt className="font-bold text-[#55736a]">Materials</dt>
          <dd className="font-black text-[#17352c]">{resources.length}</dd>
        </div>
        <div className="rounded-lg bg-amber-50 p-3">
          <dt className="font-bold text-[#55736a]">Missing</dt>
          <dd className="font-black text-[#17352c]">{gradebook?.missingAssignments ?? 0}</dd>
        </div>
      </dl>
    </a>
  )
}

export function WorkspaceCourseSection({
  course,
  label,
  children,
}: {
  course: StudentCourse
  label: string
  children: ReactNode
}) {
  return (
    <section aria-label={`${course.title} ${label}`} className="student-workspace-panel rounded-lg border border-white/75 bg-white/84 p-4 shadow-[0_18px_50px_rgba(5,44,38,0.18)] backdrop-blur-md">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-[#17352c]">{course.title}</h2>
          <p className="mt-1 text-sm font-semibold text-[#55736a]">{course.subject} - Grade {course.gradeLevel}</p>
        </div>
        <a href={`/student/courses/${course.id}`} className="inline-flex w-fit rounded-lg border border-emerald-200 bg-white/72 px-3 py-2 text-sm font-black text-[#17352c]">
          Open course
        </a>
      </div>
      {children}
    </section>
  )
}
