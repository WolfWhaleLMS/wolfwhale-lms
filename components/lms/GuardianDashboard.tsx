import { BarChart3, BookOpen, CalendarCheck, CalendarDays, FileText, GraduationCap, MessageSquare, Users } from 'lucide-react'
import { LmsPanel, LmsShell } from '@/components/lms/LmsShell'
import { CalendarPanel, MessageComposer, MessagesPanel, ResourcesPanel } from '@/components/lms/SharedLmsPanels'
import { gradeTrendLabel } from '@/lib/lms/grade-trends'
import type { buildLmsDashboardViews } from '@/lib/lms/read-model'

type GuardianView = ReturnType<typeof buildLmsDashboardViews>['guardian']

const guardianTools = [
  { href: '#linked-students', label: 'Linked students', description: 'Review student summaries', icon: Users },
  { href: '#attendance', label: 'Attendance', description: 'Check presence records', icon: CalendarCheck },
  { href: '#calendar', label: 'Calendar', description: 'See upcoming course work', icon: CalendarDays },
  { href: '#resources', label: 'Resources', description: 'Open shared course files', icon: FileText },
  { href: '#messages', label: 'Messages', description: 'Read school and teacher messages', icon: MessageSquare },
]

function guardianMessageCourses(view: GuardianView) {
  const courses = new Map<string, GuardianView['students'][number]['courses'][number]>()

  for (const student of view.students) {
    for (const course of student.courses) {
      courses.set(course.id, course)
    }
  }

  return [...courses.values()]
}

export function GuardianDashboard({ view }: { view: GuardianView }) {
  const messageCourses = guardianMessageCourses(view)

  return (
    <LmsShell title="Guardian dashboard" subtitle="Linked student progress, grades, upcoming work, and school alerts." tools={guardianTools}>
      <section id="linked-students" data-testid="guardian-linked-students" className="scroll-mt-28 grid gap-4 lg:grid-cols-2">
        {view.students.map((student) => (
          <LmsPanel key={student.id} title={student.name}>
            <div className="grid gap-3">
              <div>
                <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
                  <BookOpen className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                  Courses
                </h3>
                <ul className="mt-2 grid gap-2">
                  {student.courses.map((course) => (
                    <li key={course.id} className="rounded-md border border-slate-200 text-sm dark:border-slate-800">
                      <a href="#attendance" className="flex px-3 py-2 font-semibold hover:bg-teal-50 dark:hover:bg-teal-950/40">
                        {course.title}
                        {course.sectionLabel ? ` section ${course.sectionLabel}` : ''}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
                  <GraduationCap className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                  Grades
                </h3>
                <ul className="mt-2 grid gap-2">
                  {student.grades.map((grade) => (
                    <li key={grade.assignmentTitle} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                      <span className="font-semibold">{grade.assignmentTitle}</span>
                      <span className="ml-2 font-semibold text-teal-700 dark:text-teal-200">{grade.scoreLabel}</span>
                      <p className="mt-1 text-slate-600 dark:text-slate-200">{grade.feedback}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
                  <FileText className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                  Submitted files
                </h3>
                <ul className="mt-2 grid gap-2">
                  {student.assignments
                    .filter((assignment) => assignment.submissionFileHref)
                    .map((assignment) => (
                      <li key={assignment.submissionId} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                        <span className="block font-semibold">{assignment.title}</span>
                        <a href={assignment.submissionFileHref} className="mt-1 inline-flex font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-200 dark:hover:text-teal-100">
                          Download submitted file {assignment.submittedFileName}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>

              <div>
                <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
                  <BarChart3 className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                  Gradebook
                </h3>
                <ul className="mt-2 grid gap-2">
                  {student.gradebook.map((course) => (
                    <li key={course.courseId} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                      <span className="font-semibold">{course.courseTitle}</span>
                      <span className="ml-2 text-teal-700 dark:text-teal-200">{course.currentPercentage}% {course.letterGrade}</span>
                      <span className="mt-1 block text-slate-500 dark:text-slate-400">
                        {course.attendanceRate}% attendance, {course.missingAssignments} missing, {gradeTrendLabel(course.gradeTrend)} trend, {course.riskLevel} risk
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </LmsPanel>
        ))}
      </section>

      <LmsPanel id="attendance" title="Attendance">
        <ul className="grid gap-2">
          {view.attendance.map((summary) => (
            <li key={summary.courseId} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
              <span className="inline-flex items-center gap-2 font-semibold">
                <CalendarCheck className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                {summary.courseTitle}
              </span>
              <span className="ml-2 text-slate-500 dark:text-slate-400">
                {summary.attendanceRate}% present/online
              </span>
            </li>
          ))}
        </ul>
      </LmsPanel>

      <div className="grid gap-4 lg:grid-cols-3">
        <CalendarPanel items={view.calendar} />
        <ResourcesPanel resources={view.resources} />
        <MessagesPanel
          messages={view.messages}
          actions={<MessageComposer courses={messageCourses} returnTo="/guardian" contentLabel="Message to teacher" />}
        />
      </div>
    </LmsShell>
  )
}
