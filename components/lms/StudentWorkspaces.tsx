import {
  ArrowLeft,
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  MessageSquare,
  Send,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { StudentCompanionWidget } from '@/components/lms/StudentCompanionWidget'
import { StudentPreferenceBridge, StudentThemeSettings } from '@/components/lms/StudentThemeSettings'
import type { buildLmsDashboardViews } from '@/lib/lms/read-model'

type StudentView = ReturnType<typeof buildLmsDashboardViews>['student']
type StudentCourse = StudentView['courses'][number]
type StudentAssignment = StudentView['assignments'][number]

function formatShortDate(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function courseAssignments(view: StudentView, courseId: string) {
  return view.assignments.filter((assignment) => assignment.courseId === courseId)
}

function courseGrades(view: StudentView, courseId: string) {
  return view.grades.filter((grade) => grade.courseId === courseId)
}

function courseResources(view: StudentView, courseId: string) {
  return view.resources.filter((resource) => resource.courseId === courseId)
}

function courseLessons(view: StudentView, courseId: string) {
  return view.lessons.filter((lesson) => lesson.courseId === courseId)
}

function courseCalendar(view: StudentView, courseId: string) {
  return view.calendar.filter((item) => item.courseId === courseId)
}

function courseMessages(view: StudentView, courseId: string) {
  return view.messages.filter((message) => message.courseId === courseId)
}

function courseById(view: StudentView, courseId: string) {
  return view.courses.find((course) => course.id === courseId)
}

function gradebookForCourse(view: StudentView, courseId: string) {
  return view.gradebook.find((course) => course.courseId === courseId)
}

function attendanceForCourse(view: StudentView, courseId: string) {
  return view.attendance.find((course) => course.courseId === courseId)
}

function StudentWorkspaceShell({
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

function WorkspacePanel({
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

function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-emerald-300 bg-emerald-50/70 px-3 py-3 text-sm font-semibold text-[#31544b]">{children}</p>
}

function AssignmentSubmitCard({ assignment }: { assignment: StudentAssignment }) {
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
      <form action="/api/lms/submissions" method="post" className="mt-3 grid gap-3">
        <input name="assignmentId" type="hidden" value={assignment.id} />
        <label className="grid gap-2 text-sm font-black text-[#17352c]">
          Response
          <textarea
            name="content"
            required
            rows={4}
            className="rounded-lg border border-emerald-200 bg-[#fbfffc] px-3 py-2 text-sm font-semibold text-[#17352c] shadow-inner outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
          />
        </label>
        <button type="submit" aria-label={`Submit ${assignment.title}`} className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg bg-[#17352c] px-4 py-2 text-sm font-black text-white">
          <Send className="h-4 w-4" />
          Submit work
        </button>
      </form>
    </article>
  )
}

function CourseCard({ course, view }: { course: StudentCourse; view: StudentView }) {
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

function WorkspaceCourseSection({
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

export function StudentCoursesWorkspace({ view }: { view: StudentView }) {
  return (
    <StudentWorkspaceShell title="Courses" subtitle="Choose a course to open its syllabus, materials, assignments, submission portals, feedback, attendance, and messages.">
      <div className="grid gap-4 lg:grid-cols-2">
        {view.courses.map((course) => (
          <CourseCard key={course.id} course={course} view={view} />
        ))}
      </div>
    </StudentWorkspaceShell>
  )
}

export function StudentCourseWorkspace({ view, courseId }: { view: StudentView; courseId: string }) {
  const course = courseById(view, courseId)
  if (!course) return null

  const assignments = courseAssignments(view, courseId)
  const resources = courseResources(view, courseId)
  const lessons = courseLessons(view, courseId)
  const grades = courseGrades(view, courseId)
  const gradebook = gradebookForCourse(view, courseId)
  const attendance = attendanceForCourse(view, courseId)
  const calendar = courseCalendar(view, courseId)
  const messages = courseMessages(view, courseId)
  const assignmentCategories = Array.from(new Set(assignments.map((assignment) => assignment.category))).filter(Boolean)

  return (
    <StudentWorkspaceShell title={course.title} subtitle="Everything for this course is collected here: syllabus, lessons, resources, assignments, submissions, grading, attendance, calendar, and messages.">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-5">
          <WorkspacePanel title="Course syllabus" icon={BookOpen}>
            <dl className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-emerald-50/80 p-3">
                <dt className="text-sm font-bold text-[#55736a]">Subject</dt>
                <dd className="font-black text-[#17352c]">{course.subject}</dd>
              </div>
              <div className="rounded-lg bg-sky-50/80 p-3">
                <dt className="text-sm font-bold text-[#55736a]">Grade</dt>
                <dd className="font-black text-[#17352c]">{course.gradeLevel}</dd>
              </div>
              <div className="rounded-lg bg-amber-50/80 p-3">
                <dt className="text-sm font-bold text-[#55736a]">Current</dt>
                <dd className="font-black text-[#17352c]">{gradebook ? `${gradebook.currentPercentage}% ${gradebook.letterGrade}` : 'Not graded'}</dd>
              </div>
            </dl>
            {assignmentCategories.length > 0 ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {assignmentCategories.map((category) => (
                  <div key={category} className="rounded-lg border border-emerald-100 bg-white/74 p-3">
                    <p className="font-black text-[#17352c]">{category}</p>
                    <p className="mt-1 text-sm font-semibold text-[#48675e]">Course grading category</p>
                  </div>
                ))}
              </div>
            ) : null}
          </WorkspacePanel>

          <WorkspacePanel title="Lessons" icon={BookOpen}>
            {lessons.length === 0 ? (
              <EmptyState>No published lessons yet.</EmptyState>
            ) : (
              <ul className="grid gap-2">
                {lessons.map((lesson) => (
                  <li key={lesson.id} className="rounded-lg border border-emerald-100 bg-white/74 px-3 py-2">
                    <span className="font-black text-[#17352c]">{lesson.title}</span>
                    <span className="ml-2 rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold capitalize text-emerald-800">{lesson.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </WorkspacePanel>

          <WorkspacePanel id="submit-work" title="Assignments and submissions" icon={ClipboardCheck}>
            {assignments.length === 0 ? (
              <EmptyState>No assignments in this course.</EmptyState>
            ) : (
              <div className="grid gap-3">
                {assignments.map((assignment) => (
                  <AssignmentSubmitCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            )}
          </WorkspacePanel>

          <WorkspacePanel title="Grades and feedback" icon={GraduationCap}>
            {grades.length === 0 ? (
              <EmptyState>No feedback posted for this course yet.</EmptyState>
            ) : (
              <ul className="grid gap-2">
                {grades.map((grade) => (
                  <li key={grade.assignmentId} className="rounded-lg border border-emerald-100 bg-white/74 px-3 py-2">
                    <span className="font-black text-[#17352c]">{grade.assignmentTitle}</span>
                    <span className="ml-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-800">{grade.scoreLabel}</span>
                    <p className="mt-1 text-sm font-semibold text-[#48675e]">{grade.feedback}</p>
                  </li>
                ))}
              </ul>
            )}
          </WorkspacePanel>
        </div>

        <div className="space-y-5">
          <WorkspacePanel title="Course materials" icon={FileText}>
            {resources.length === 0 ? (
              <EmptyState>No course materials yet.</EmptyState>
            ) : (
              <ul className="grid gap-2">
                {resources.map((resource) => (
                  <li key={resource.id} className="rounded-lg border border-emerald-100 bg-white/74 px-3 py-2">
                    <a href={`/api/lms/resources/${resource.id}`} className="font-black text-emerald-800 hover:text-emerald-950">
                      {resource.title}
                    </a>
                    <p className="mt-1 text-sm font-semibold text-[#48675e]">{resource.fileName}</p>
                  </li>
                ))}
              </ul>
            )}
          </WorkspacePanel>

          <WorkspacePanel title="Gradebook" icon={BarChart3}>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-emerald-50/80 p-3">
                <dt className="font-bold text-[#55736a]">Current</dt>
                <dd className="font-black text-[#17352c]">{gradebook ? `${gradebook.currentPercentage}% ${gradebook.letterGrade}` : 'Not graded'}</dd>
              </div>
              <div className="rounded-lg bg-amber-50/80 p-3">
                <dt className="font-bold text-[#55736a]">Missing</dt>
                <dd className="font-black text-[#17352c]">{gradebook?.missingAssignments ?? 0}</dd>
              </div>
            </dl>
          </WorkspacePanel>

          <WorkspacePanel title="Attendance" icon={CalendarCheck}>
            {attendance ? (
              <p className="rounded-lg bg-sky-50/80 p-3 text-sm font-semibold text-[#48675e]">
                <span className="font-black text-[#17352c]">{attendance.attendanceRate}%</span> present/online, {attendance.absent} absent, {attendance.tardy} tardy.
              </p>
            ) : (
              <EmptyState>No attendance in this course.</EmptyState>
            )}
          </WorkspacePanel>

          <WorkspacePanel title="Calendar" icon={CalendarDays}>
            {calendar.length === 0 ? (
              <EmptyState>No dated course items.</EmptyState>
            ) : (
              <ul className="grid gap-2">
                {calendar.map((item) => (
                  <li key={item.id} className="rounded-lg border border-sky-100 bg-white/74 px-3 py-2 text-sm font-semibold text-[#48675e]">
                    <span className="font-black text-[#17352c]">{item.title}</span> - {formatShortDate(item.dueAt)}
                  </li>
                ))}
              </ul>
            )}
          </WorkspacePanel>

          <WorkspacePanel title="Messages" icon={MessageSquare}>
            {messages.length === 0 ? (
              <EmptyState>No messages for this course.</EmptyState>
            ) : (
              <ul className="grid gap-2">
                {messages.map((message) => (
                  <li key={message.id} className="rounded-lg border border-sky-100 bg-white/74 px-3 py-2">
                    <span className="font-black text-[#17352c]">{message.subject}</span>
                    <p className="mt-1 text-sm font-semibold text-[#48675e]">{message.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </WorkspacePanel>
        </div>
      </div>
    </StudentWorkspaceShell>
  )
}

export function StudentAssignmentsWorkspace({ view }: { view: StudentView }) {
  return (
    <StudentWorkspaceShell title="Assignments" subtitle="All student assignment portals grouped by course, with instructions, due dates, points, and submission boxes in one place.">
      <div id="submit-work" className="grid gap-5 scroll-mt-28">
        {view.courses.map((course) => {
          const assignments = courseAssignments(view, course.id)

          return (
            <section key={course.id} aria-label={`${course.title} assignments`} className="student-workspace-panel rounded-lg border border-white/75 bg-white/84 p-4 shadow-[0_18px_50px_rgba(5,44,38,0.18)] backdrop-blur-md">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-xl font-black text-[#17352c]">{course.title}</h2>
                <a href={`/student/courses/${course.id}`} className="rounded-lg border border-emerald-200 bg-white/72 px-3 py-2 text-sm font-black text-[#17352c]">
                  Open course
                </a>
              </div>
              {assignments.length === 0 ? (
                <EmptyState>No assignments in this course.</EmptyState>
              ) : (
                <div className="grid gap-3">
                  {assignments.map((assignment) => (
                    <AssignmentSubmitCard key={assignment.id} assignment={assignment} />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </StudentWorkspaceShell>
  )
}

export function StudentGradesFeedbackWorkspace({ view }: { view: StudentView }) {
  return (
    <StudentWorkspaceShell title="Grades and feedback" subtitle="Marked work grouped by course, with feedback next to the assignment it belongs to.">
      <div className="grid gap-5">
        {view.courses.map((course) => {
          const grades = courseGrades(view, course.id)

          return (
            <WorkspaceCourseSection key={course.id} course={course} label="grades and feedback">
              {grades.length === 0 ? (
                <EmptyState>No feedback posted for this course yet.</EmptyState>
              ) : (
                <ul className="grid gap-3">
                  {grades.map((grade) => (
                    <li key={grade.assignmentId} className="rounded-lg border border-emerald-100 bg-white/74 px-4 py-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <span className="font-black text-[#17352c]">{grade.assignmentTitle}</span>
                        <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-800">{grade.scoreLabel}</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[#48675e]">{grade.feedback}</p>
                    </li>
                  ))}
                </ul>
              )}
            </WorkspaceCourseSection>
          )
        })}
      </div>
    </StudentWorkspaceShell>
  )
}

export function StudentGradebookWorkspace({ view }: { view: StudentView }) {
  return (
    <StudentWorkspaceShell title="Gradebook" subtitle="Course standing, missing-work counts, graded-work counts, attendance health, and learning risk in one place.">
      <div className="grid gap-5">
        {view.courses.map((course) => {
          const gradebook = gradebookForCourse(view, course.id)

          return (
            <WorkspaceCourseSection key={course.id} course={course} label="gradebook">
              {gradebook ? (
                <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <div className="rounded-lg bg-emerald-50/80 p-3">
                    <dt className="text-sm font-bold text-[#55736a]">Current</dt>
                    <dd className="font-black text-[#17352c]">{gradebook.currentPercentage}% {gradebook.letterGrade}</dd>
                  </div>
                  <div className="rounded-lg bg-amber-50/80 p-3">
                    <dt className="text-sm font-bold text-[#55736a]">Missing</dt>
                    <dd className="font-black text-[#17352c]">{gradebook.missingAssignments}</dd>
                  </div>
                  <div className="rounded-lg bg-sky-50/80 p-3">
                    <dt className="text-sm font-bold text-[#55736a]">Attendance</dt>
                    <dd className="font-black text-[#17352c]">{gradebook.attendanceRate}%</dd>
                  </div>
                  <div className="rounded-lg bg-lime-50/80 p-3">
                    <dt className="text-sm font-bold text-[#55736a]">Graded</dt>
                    <dd className="font-black text-[#17352c]">{gradebook.gradedAssignments}</dd>
                  </div>
                  <div className="rounded-lg bg-white/74 p-3">
                    <dt className="text-sm font-bold text-[#55736a]">Learning health</dt>
                    <dd className="font-black capitalize text-[#17352c]">{gradebook.riskLevel}</dd>
                  </div>
                </dl>
              ) : (
                <EmptyState>No gradebook row for this course yet.</EmptyState>
              )}
            </WorkspaceCourseSection>
          )
        })}
      </div>
    </StudentWorkspaceShell>
  )
}

export function StudentAttendanceWorkspace({ view }: { view: StudentView }) {
  return (
    <StudentWorkspaceShell title="Attendance" subtitle="Attendance summaries grouped by course so students can see where they are on track.">
      <div className="grid gap-5">
        {view.courses.map((course) => {
          const attendance = attendanceForCourse(view, course.id)

          return (
            <WorkspaceCourseSection key={course.id} course={course} label="attendance">
              {attendance ? (
                <p className="rounded-lg bg-sky-50/80 p-4 text-sm font-semibold leading-6 text-[#48675e]">
                  <span className="font-black text-[#17352c]">{attendance.attendanceRate} percent present/online</span>, {attendance.absent} absent, {attendance.tardy} tardy, and {attendance.present} present records.
                </p>
              ) : (
                <EmptyState>No attendance records for this course yet.</EmptyState>
              )}
            </WorkspaceCourseSection>
          )
        })}
      </div>
    </StudentWorkspaceShell>
  )
}

export function StudentCalendarWorkspace({ view }: { view: StudentView }) {
  return (
    <StudentWorkspaceShell title="Calendar" subtitle="Dated course work grouped by course, with direct links back to the course workspace.">
      <div className="grid gap-5">
        {view.courses.map((course) => {
          const calendar = courseCalendar(view, course.id)

          return (
            <WorkspaceCourseSection key={course.id} course={course} label="calendar">
              {calendar.length === 0 ? (
                <EmptyState>No dated items for this course.</EmptyState>
              ) : (
                <ul className="grid gap-3">
                  {calendar.map((item) => (
                    <li key={item.id} className="rounded-lg border border-sky-100 bg-white/74 px-4 py-3">
                      <span className="font-black text-[#17352c]">{item.title}</span>
                      <span className="mt-1 block text-sm font-semibold text-[#55736a]">Due {formatShortDate(item.dueAt)} - {item.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </WorkspaceCourseSection>
          )
        })}
      </div>
    </StudentWorkspaceShell>
  )
}

export function StudentResourcesWorkspace({ view }: { view: StudentView }) {
  return (
    <StudentWorkspaceShell title="Resources" subtitle="Course files and materials grouped by the class and lesson they belong to.">
      <div className="grid gap-5">
        {view.courses.map((course) => {
          const resources = courseResources(view, course.id)

          return (
            <WorkspaceCourseSection key={course.id} course={course} label="resources">
              {resources.length === 0 ? (
                <EmptyState>No course resources yet.</EmptyState>
              ) : (
                <ul className="grid gap-3">
                  {resources.map((resource) => (
                    <li key={resource.id} className="rounded-lg border border-emerald-100 bg-white/74 px-4 py-3 text-sm">
                      <a href={`/api/lms/resources/${resource.id}`} className="font-black text-emerald-800 hover:text-emerald-950">
                        {resource.title}
                      </a>
                      <span className="mt-1 block font-semibold text-[#55736a]">{resource.fileName}</span>
                    </li>
                  ))}
                </ul>
              )}
            </WorkspaceCourseSection>
          )
        })}
      </div>
    </StudentWorkspaceShell>
  )
}

export function StudentMessagesWorkspace({ view }: { view: StudentView }) {
  const generalMessages = view.messages.filter((message) => !message.courseId)

  return (
    <StudentWorkspaceShell title="Messages" subtitle="Teacher and school messages grouped with the course they belong to.">
      <div className="grid gap-5">
        {view.courses.map((course) => {
          const messages = courseMessages(view, course.id)

          return (
            <WorkspaceCourseSection key={course.id} course={course} label="messages">
              {messages.length === 0 ? (
                <EmptyState>No messages for this course.</EmptyState>
              ) : (
                <ul className="grid gap-3">
                  {messages.map((message) => (
                    <li key={message.id} className="rounded-lg border border-sky-100 bg-white/74 px-4 py-3">
                      <span className="font-black text-[#17352c]">{message.subject}</span>
                      <span className="mt-1 block text-sm font-semibold text-[#55736a]">{message.senderName} - {formatShortDate(message.createdAt)}</span>
                      <p className="mt-1 text-sm font-semibold leading-6 text-[#48675e]">{message.content}</p>
                    </li>
                  ))}
                </ul>
              )}
            </WorkspaceCourseSection>
          )
        })}

        {generalMessages.length > 0 ? (
          <WorkspacePanel title="School-wide messages" icon={MessageSquare}>
            <ul className="grid gap-3">
              {generalMessages.map((message) => (
                <li key={message.id} className="rounded-lg border border-sky-100 bg-white/74 px-4 py-3">
                  <span className="font-black text-[#17352c]">{message.subject}</span>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#48675e]">{message.content}</p>
                </li>
              ))}
            </ul>
          </WorkspacePanel>
        ) : null}
      </div>
    </StudentWorkspaceShell>
  )
}

export function StudentNotificationsWorkspace({ view }: { view: StudentView }) {
  return (
    <StudentWorkspaceShell title="Notifications" subtitle="Latest alerts for grading, submissions, attendance, and school updates.">
      <WorkspacePanel title="Alerts" icon={Bell}>
        {view.notifications.length === 0 ? (
          <EmptyState>No notifications right now.</EmptyState>
        ) : (
          <ul className="grid gap-3">
            {view.notifications.map((notification) => (
              <li key={notification.id} className="rounded-lg border border-sky-100 bg-white/74 px-4 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <span className="font-black text-[#17352c]">{notification.title}</span>
                  <span className="w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-800">{notification.read ? 'Read' : 'New'}</span>
                </div>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#48675e]">{notification.message}</p>
                <span className="mt-2 block text-xs font-bold text-[#55736a]">{formatShortDate(notification.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </WorkspacePanel>
    </StudentWorkspaceShell>
  )
}

export function StudentSettingsWorkspace() {
  return (
    <StudentWorkspaceShell title="Student settings" subtitle="Personalize the student dashboard background and manage the local study companion.">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_28rem]">
        <StudentThemeSettings />
        <StudentCompanionWidget />
      </div>
    </StudentWorkspaceShell>
  )
}
