import { BookOpen, ClipboardCheck, GraduationCap, ShieldCheck, Users } from 'lucide-react'
import { LmsPanel, LmsShell, type LmsToolLink } from '@/components/lms/LmsShell'
import type {
  getPilotAdminView,
  getPilotGuardianView,
  getPilotStudentView,
  getPilotTeacherView,
} from '@/lib/pilot/data'
import type { SchoolRole } from '@/lib/school-launch/role-surfaces'

type AdminView = ReturnType<typeof getPilotAdminView>
type TeacherView = ReturnType<typeof getPilotTeacherView>
type StudentView = ReturnType<typeof getPilotStudentView>
type GuardianView = ReturnType<typeof getPilotGuardianView>

type PilotRoleDashboardProps =
  | { role: 'admin'; view: AdminView }
  | { role: 'teacher'; view: TeacherView }
  | { role: 'student'; view: StudentView }
  | { role: 'guardian'; view: GuardianView }

const headings: Record<SchoolRole, string> = {
  admin: 'Admin dashboard',
  teacher: 'Teacher dashboard',
  student: 'Student dashboard',
  guardian: 'Guardian dashboard',
}

const subtitles: Record<SchoolRole, string> = {
  admin: 'Pilot school setup, launch checks, users, courses, and enrollments.',
  teacher: 'Course roster, assignment status, submissions, and grading queue.',
  student: 'Enrolled course, current assignment, submission status, and feedback.',
  guardian: 'Linked student progress only, with no access to unrelated students.',
}

const pilotTools: Record<SchoolRole, LmsToolLink[]> = {
  admin: [
    { href: '#pilot-school', label: 'Pilot school', description: 'Review setup state', icon: ShieldCheck },
    { href: '#launch-checks', label: 'Launch checks', description: 'Inspect pilot gates', icon: ClipboardCheck },
    { href: '#pilot-users', label: 'Pilot users', description: 'See demo accounts', icon: Users },
    { href: '#courses-and-sections', label: 'Courses', description: 'Review sections', icon: BookOpen },
  ],
  teacher: [
    { href: '#class', label: 'Class', description: 'Course and roster', icon: Users },
    { href: '#assignment', label: 'Assignment', description: 'Current work', icon: BookOpen },
    { href: '#roster', label: 'Roster', description: 'Pilot students', icon: Users },
    { href: '#submission-review', label: 'Submission review', description: 'Grade pilot work', icon: ClipboardCheck },
  ],
  student: [
    { href: '#my-course', label: 'My course', description: 'Course details', icon: BookOpen },
    { href: '#current-assignment', label: 'Assignment', description: 'Current task', icon: ClipboardCheck },
    { href: '#submission', label: 'Submission', description: 'Turn in work', icon: ClipboardCheck },
    { href: '#grade-and-feedback', label: 'Feedback', description: 'Read grade notes', icon: GraduationCap },
  ],
  guardian: [
    { href: '#guardian', label: 'Guardian', description: 'Linked profile', icon: Users },
    { href: '#linked-student-progress', label: 'Progress', description: 'Linked student only', icon: GraduationCap },
  ],
}

function panelId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function DashboardFrame({ role, children }: { role: SchoolRole; children: React.ReactNode }) {
  return (
    <LmsShell
      role={role}
      title={headings[role]}
      subtitle={subtitles[role]}
      tools={pilotTools[role]}
      schoolName="WolfWhale Pilot School"
      userName={headings[role].replace(' dashboard', '')}
      signOutAction="/api/pilot/logout"
      homeHref="/"
      spotlight={{
        label: 'Controlled Pilot',
        title: headings[role],
        tag: 'Demo data',
        status: 'Active',
        meta: ['Pilot data is separate from live school records.', 'Use real login for production accounts.'],
      }}
      statusItems={[
        { label: 'Pilot Gate', value: 'On', tone: 'ok' },
        { label: 'Live Data', value: 'Separate', tone: 'info' },
        { label: 'Route Frame', value: 'Unified', tone: 'ok' },
      ]}
      feedback={{
        title: 'Pilot Scope',
        name: headings[role],
        body: subtitles[role],
      }}
    >
      {children}
    </LmsShell>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <LmsPanel id={panelId(title)} title={title}>
      {children}
    </LmsPanel>
  )
}

function DetailList({ items }: { items: Array<{ label: string; value: string | number }> }) {
  return (
    <dl className="grid gap-3">
      {items.map((item) => (
        <div key={item.label} className="grid gap-1 rounded-md border border-slate-200 p-3 dark:border-slate-800">
          <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{item.label}</dt>
          <dd className="text-sm font-semibold">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function SimpleList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
          {item}
        </li>
      ))}
    </ul>
  )
}

function AdminDashboard({ view }: { view: AdminView }) {
  return (
    <DashboardFrame role="admin">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Pilot school">
          <DetailList
            items={[
              { label: 'School', value: view.school.name },
              { label: 'Region', value: view.school.region },
              { label: 'Course count', value: view.courses.length },
              { label: 'Enrollment count', value: view.enrollments.length },
            ]}
          />
        </Panel>
        <Panel title="Launch checks">
          <SimpleList items={view.launchChecks} />
        </Panel>
        <Panel title="Pilot users">
          <SimpleList items={view.users.map((user) => `${user.name} - ${user.role}`)} />
        </Panel>
        <Panel title="Courses and sections">
          <SimpleList items={view.courses.map((course) => `${course.title} - Section ${course.section}`)} />
        </Panel>
      </div>
    </DashboardFrame>
  )
}

function TeacherDashboard({ view }: { view: TeacherView }) {
  return (
    <DashboardFrame role="teacher">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Class">
          <DetailList
            items={[
              { label: 'Teacher', value: view.teacher.name },
              { label: 'Course', value: view.course.title },
              { label: 'Section', value: view.course.section },
              { label: 'Roster size', value: view.roster.length },
            ]}
          />
        </Panel>
        <Panel title="Assignment">
          <div className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-teal-700 dark:text-teal-200" />
            <div>
              <h3 className="font-semibold">{view.assignment.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-200">{view.assignment.instructions}</p>
            </div>
          </div>
        </Panel>
        <Panel title="Roster">
          <SimpleList items={view.roster.map((student) => student.name)} />
        </Panel>
        <Panel title="Submission review">
          {view.submissions.length === 0 ? (
            <p className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">No submissions yet</p>
          ) : (
            <div className="grid gap-4">
              {view.submissions.map((submission) => {
                const grade = view.grades.find((item) => item.studentId === submission.studentId)

                return (
                  <div
                    key={`${submission.assignmentId}-${submission.studentId}`}
                    className="rounded-md border border-slate-200 p-3 dark:border-slate-800"
                  >
                    <p className="text-sm">
                      {submission.studentId}: {submission.content}
                    </p>
                    {grade ? (
                      <p className="mt-3 rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-100">
                        Graded: {grade.score}/{view.assignment.pointsPossible} - {grade.feedback}
                      </p>
                    ) : null}
                    <form action="/api/pilot/grade" method="post" className="mt-4 grid gap-3 sm:grid-cols-[8rem_1fr_auto]">
                      <input type="hidden" name="studentId" value={submission.studentId} />
                      <label className="grid gap-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                        Score
                        <input
                          name="score"
                          type="number"
                          min="0"
                          max={view.assignment.pointsPossible}
                          required
                          defaultValue={grade?.score}
                          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        />
                      </label>
                      <label className="grid gap-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                        Feedback
                        <input
                          name="feedback"
                          required
                          defaultValue={grade?.feedback}
                          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        />
                      </label>
                      <button
                        type="submit"
                        className="mt-auto inline-flex h-10 items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
                      >
                        Grade
                      </button>
                    </form>
                  </div>
                )
              })}
            </div>
          )}
        </Panel>
      </div>
    </DashboardFrame>
  )
}

function StudentDashboard({ view }: { view: StudentView }) {
  return (
    <DashboardFrame role="student">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel title="My course">
          <DetailList
            items={[
              { label: 'Student', value: view.student.name },
              { label: 'Course', value: view.course.title },
              { label: 'Section', value: view.course.section },
            ]}
          />
        </Panel>
        <Panel title="Current assignment">
          <div className="flex items-start gap-3">
            <ClipboardCheck className="mt-1 h-5 w-5 text-teal-700 dark:text-teal-200" />
            <div>
              <h3 className="font-semibold">{view.assignment.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-200">{view.assignment.instructions}</p>
              <p className="mt-3 text-sm font-semibold">Due: {view.assignment.dueLabel}</p>
            </div>
          </div>
        </Panel>
        <Panel title="Submission">
          <form action="/api/pilot/submit" method="post" className="grid gap-3">
            <label className="grid gap-2 text-sm font-semibold">
              Reflection response
              <textarea
                name="content"
                required
                rows={5}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder="Write your launch reflection..."
                defaultValue={view.submission?.content ?? ''}
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-10 w-fit items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
            >
              {view.submission ? 'Update submission' : 'Submit assignment'}
            </button>
            <p className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
              {view.submission ? `Submitted: ${view.submission.content}` : 'Submission not started'}
            </p>
          </form>
        </Panel>
        <Panel title="Grade and feedback">
          <p className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
            {view.grade ? `${view.grade.score}/${view.assignment.pointsPossible}: ${view.grade.feedback}` : 'Not graded yet'}
          </p>
        </Panel>
      </div>
    </DashboardFrame>
  )
}

function GuardianDashboard({ view }: { view: GuardianView }) {
  return (
    <DashboardFrame role="guardian">
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Panel title="Guardian">
          <DetailList
            items={[
              { label: 'Name', value: view.guardian.name },
              { label: 'Linked students', value: view.students.length },
            ]}
          />
        </Panel>
        <Panel title="Linked student progress">
          <div className="grid gap-3">
            {view.students.map((student) => (
              <div key={student.id} className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                  <h3 className="font-semibold">{student.name}</h3>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">{student.course.title}</p>
                <p className="mt-2 text-sm font-semibold">{student.assignment.title}</p>
                <p className="mt-2 text-sm">
                  {student.grade ? `${student.grade.score}: ${student.grade.feedback}` : 'Awaiting submission and feedback'}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardFrame>
  )
}

export function PilotRoleDashboard(props: PilotRoleDashboardProps) {
  if (props.role === 'admin') return <AdminDashboard view={props.view} />
  if (props.role === 'teacher') return <TeacherDashboard view={props.view} />
  if (props.role === 'student') return <StudentDashboard view={props.view} />

  return <GuardianDashboard view={props.view} />
}
