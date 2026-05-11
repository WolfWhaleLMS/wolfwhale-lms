import { BarChart3, BookOpen, CalendarCheck, CalendarDays, ClipboardCheck, Download, FileText, MessageSquare, Plus, Users } from 'lucide-react'
import { EmptyState, LmsPanel, LmsShell } from '@/components/lms/LmsShell'
import { CalendarEventForm, CalendarPanel, MessageComposer, MessagesPanel, ResourceUploadForm, ResourcesPanel } from '@/components/lms/SharedLmsPanels'
import { gradeTrendLabel } from '@/lib/lms/grade-trends'
import type { buildLmsDashboardViews } from '@/lib/lms/read-model'

type TeacherView = ReturnType<typeof buildLmsDashboardViews>['teacher']

const teacherTools = [
  { href: '#courses', label: 'Courses', description: 'Manage class sections', icon: BookOpen },
  { href: '#roster', label: 'Roster', description: 'Review enrolled students', icon: Users },
  { href: '#assignments', label: 'Assignments', description: 'Inspect assigned work', icon: ClipboardCheck },
  { href: '#create-assignment', label: 'Create assignment', description: 'Publish new work', icon: Plus },
  { href: '#gradebook', label: 'Gradebook', description: 'Review grades and exports', icon: BarChart3 },
  { href: '#attendance', label: 'Attendance', description: 'Record attendance', icon: CalendarCheck },
  { href: '#rubrics', label: 'Rubrics', description: 'Build scoring guides', icon: FileText },
  { href: '#grading-queue', label: 'Grading queue', description: 'Post scores and feedback', icon: ClipboardCheck },
  { href: '#calendar', label: 'Calendar', description: 'See dated class items', icon: CalendarDays },
  { href: '#resources', label: 'Resources', description: 'Open course files', icon: FileText },
  { href: '#messages', label: 'Messages', description: 'Read class messages', icon: MessageSquare },
]

export function TeacherDashboard({ view }: { view: TeacherView }) {
  return (
    <LmsShell title="Teacher dashboard" subtitle="Courses, rosters, assignments, submissions, and grading queue." tools={teacherTools}>
      <div className="grid gap-4 lg:grid-cols-3">
        <LmsPanel id="courses" title="Courses">
          <ul className="grid gap-2">
            {view.courses.map((course) => (
              <li key={course.id} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <span className="flex items-center gap-2 font-semibold">
                    <BookOpen className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                    {course.title}
                  </span>
                  <a href="#gradebook" className="text-sm font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-200 dark:hover:text-teal-100">
                    Open gradebook
                  </a>
                </div>
                <span className="mt-1 block text-slate-500 dark:text-slate-400">
                  {course.subject} grade {course.gradeLevel}
                  {course.sectionLabel ? ` section ${course.sectionLabel}` : ''}
                  {course.termLabel ? ` - ${course.termLabel}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </LmsPanel>

        <LmsPanel id="roster" title="Roster">
          <ul className="grid gap-2">
            {view.roster.map((student) => (
              <li key={student.id} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                <Users className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                {student.name}
              </li>
            ))}
          </ul>
        </LmsPanel>

        <LmsPanel id="assignments" title="Assignments">
          <ul className="grid gap-2">
            {view.assignments.map((assignment) => (
              <li key={assignment.id} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <span className="font-semibold">{assignment.title}</span>
                  <a href="#grading-queue" className="text-sm font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-200 dark:hover:text-teal-100">
                    Grade submissions
                  </a>
                </div>
                <span className="mt-1 block text-slate-500 dark:text-slate-400">{assignment.maxPoints} points</span>
              </li>
            ))}
          </ul>
        </LmsPanel>
      </div>

      <LmsPanel id="create-assignment" title="Create assignment">
        <form action="/api/lms/assignments" method="post" className="grid gap-3 lg:grid-cols-[1fr_1fr_10rem_auto] lg:items-end">
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
            Title
            <input
              name="title"
              required
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Points
            <input
              name="maxPoints"
              required
              type="number"
              min="1"
              step="0.5"
              defaultValue="10"
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="grid gap-1 text-sm font-semibold lg:col-span-2">
            Category
            <input
              name="category"
              defaultValue={view.gradebook[0]?.categoryWeights[0]?.name ?? 'Coursework'}
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="grid gap-1 text-sm font-semibold lg:col-span-3">
            Due date
            <input
              name="dueDate"
              required
              type="datetime-local"
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
          >
            <Plus className="h-4 w-4" />
            Create
          </button>
          <label className="grid gap-1 text-sm font-semibold lg:col-span-4">
            Instructions
            <textarea
              name="instructions"
              rows={3}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
        </form>
      </LmsPanel>

      <div className="grid gap-4 lg:grid-cols-3">
        <CalendarPanel items={view.calendar} actions={<CalendarEventForm courses={view.courses} returnTo="/teacher" />} />
        <ResourcesPanel resources={view.resources} actions={<ResourceUploadForm courses={view.courses} returnTo="/teacher" />} />
        <MessagesPanel
          messages={view.messages}
          canModerate
          moderationReturnTo="/teacher"
          actions={
            <>
              <a
                href="/api/lms/exports/messages"
                className="mb-3 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
              >
                <Download className="h-4 w-4" />
                Export messages
              </a>
              <MessageComposer
                courses={view.courses}
                recipients={view.roster}
                returnTo="/teacher"
                recipientLabel="Student"
                contentLabel="Message to student"
              />
            </>
          }
        />
      </div>

      <LmsPanel id="gradebook" title="Gradebook">
        <div className="mb-3 flex flex-wrap gap-2">
          <a
            href="/api/lms/exports/gradebook"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            Export gradebook
          </a>
          <a
            href="/api/lms/exports/attendance"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            Export attendance
          </a>
        </div>
        <div className="grid gap-4">
          {view.gradebook.map((course) => (
            <section key={course.courseId} className="grid gap-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
                  <BarChart3 className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                  {course.courseTitle}
                </h3>
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  {course.categoryWeights.map((category) => `${category.name} ${category.weight}%`).join(' / ')}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-3 py-2">Student</th>
                      <th className="px-3 py-2">Grade</th>
                      <th className="px-3 py-2">Missing</th>
                      <th className="px-3 py-2">Attendance</th>
                      <th className="px-3 py-2">Trend</th>
                      <th className="px-3 py-2">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.students.map((student) => (
                      <tr key={student.studentId} className="border-t border-slate-200 dark:border-slate-800">
                        <td className="px-3 py-2 font-semibold">{student.studentName}</td>
                        <td className="px-3 py-2">{student.currentPercentage}% {student.letterGrade}</td>
                        <td className="px-3 py-2">{student.missingAssignments}</td>
                        <td className="px-3 py-2">{student.attendanceRate}%</td>
                        <td className="px-3 py-2">{gradeTrendLabel(student.gradeTrend)}</td>
                        <td className="px-3 py-2 capitalize">{student.riskLevel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </LmsPanel>

      <div className="grid gap-4 lg:grid-cols-2">
        <LmsPanel id="attendance" title="Attendance">
          <form action="/api/lms/attendance" method="post" className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
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
                  {view.roster.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                Date
                <input
                  name="attendanceDate"
                  required
                  type="date"
                  className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                Status
                <select
                  name="status"
                  required
                  className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="tardy">Tardy</option>
                  <option value="excused">Excused</option>
                  <option value="online">Online</option>
                </select>
              </label>
            </div>
            <label className="grid gap-1 text-sm font-semibold">
              Notes
              <input
                name="notes"
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
            >
              <CalendarCheck className="h-4 w-4" />
              Save attendance
            </button>
          </form>
          <ul className="mt-4 grid gap-2">
            {view.attendance.map((summary) => (
              <li key={summary.courseId} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                <span className="font-semibold">{summary.courseTitle}</span>
                <span className="ml-2 text-slate-500 dark:text-slate-400">{summary.attendanceRate}% present/online</span>
              </li>
            ))}
          </ul>
        </LmsPanel>

        <LmsPanel id="rubrics" title="Rubrics">
          <form action="/api/lms/rubrics" method="post" className="grid gap-3">
            <label className="grid gap-1 text-sm font-semibold">
              Assignment
              <select
                name="assignmentId"
                required
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                {view.assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Rubric name
              <input
                name="name"
                required
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Criteria JSON
              <textarea
                name="criteria"
                required
                rows={4}
                defaultValue={'[{"name":"Claim","points":4},{"name":"Evidence","points":6}]'}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-xs font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
            >
              <FileText className="h-4 w-4" />
              Save rubric
            </button>
          </form>
          <ul className="mt-4 grid gap-2">
            {view.rubrics.map((rubric) => (
              <li key={rubric.id} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                <span className="font-semibold">{rubric.name}</span>
                <span className="ml-2 text-slate-500 dark:text-slate-400">
                  {rubric.assignmentTitle}, {rubric.criteriaCount} criteria
                </span>
              </li>
            ))}
          </ul>
        </LmsPanel>
      </div>

      <LmsPanel id="grading-queue" title="Grading queue">
        {view.gradingQueue.length === 0 ? (
          <EmptyState>No submissions need grading.</EmptyState>
        ) : (
          <ul className="grid gap-2">
            {view.gradingQueue.map((item) => (
              <li key={item.submissionId} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="inline-flex items-center gap-2 font-semibold">
                    <ClipboardCheck className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                    {item.assignmentTitle}
                  </span>
                  <span>{item.studentName}</span>
                  <span className="text-slate-500 dark:text-slate-400">{item.submittedAt}</span>
                </div>
                {item.fileName ? (
                  <a
                    href={`/api/lms/submissions/${item.submissionId}/file`}
                    className="mt-2 inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-teal-700 hover:border-teal-400 hover:text-teal-800 dark:border-slate-800 dark:text-teal-200"
                  >
                    <FileText className="h-4 w-4" />
                    {item.fileName}
                  </a>
                ) : null}
                <form action="/api/lms/grades" method="post" className="mt-3 grid gap-3 sm:grid-cols-[8rem_1fr_auto]">
                  <input name="submissionId" type="hidden" value={item.submissionId} />
                  <label className="grid gap-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    Score
                    <input
                      name="pointsEarned"
                      required
                      type="number"
                      min="0"
                      max={item.maxPoints}
                      step="0.5"
                      className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </label>
                  <label className="grid gap-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    Feedback
                    <input
                      name="feedback"
                      className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
                  >
                    Post grade
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </LmsPanel>
    </LmsShell>
  )
}
