import { Activity, AlertTriangle, Bell, BookOpen, CalendarCheck, CalendarDays, ClipboardCheck, Download, FileText, MessageSquare, Plus, Upload, UserCheck, UserPlus, Users, UserX } from 'lucide-react'
import { LmsPanel, LmsShell } from '@/components/lms/LmsShell'
import { CalendarEventForm, CalendarPanel, MessagesPanel, ResourceUploadForm, ResourcesPanel } from '@/components/lms/SharedLmsPanels'
import type { buildLmsDashboardViews } from '@/lib/lms/read-model'

type AdminView = ReturnType<typeof buildLmsDashboardViews>['admin']

const metricIcons = [Users, Users, BookOpen, Users, ClipboardCheck, ClipboardCheck, Bell]

const adminTools = [
  { href: '#school', label: 'School', description: 'Review school status', icon: BookOpen },
  { href: '#audit', label: 'Audit trail', description: 'Inspect system activity', icon: Activity },
  { href: '#metrics', label: 'Metrics', description: 'Monitor launch health', icon: Activity },
  { href: '#risk', label: 'Risk', description: 'Find student support needs', icon: AlertTriangle },
  { href: '#attendance', label: 'Attendance', description: 'Review attendance exports', icon: CalendarCheck },
  { href: '#calendar', label: 'Calendar', description: 'See school LMS dates', icon: CalendarDays },
  { href: '#resources', label: 'Resources', description: 'Open shared files', icon: FileText },
  { href: '#messages', label: 'Messages', description: 'Read school messages', icon: MessageSquare },
  { href: '#create-course', label: 'Create course', description: 'Add classes and sections', icon: Plus },
  { href: '#school-users', label: 'Users', description: 'Activate or pause accounts', icon: UserCheck },
  { href: '#invite-user', label: 'Invite user', description: 'Send a school invite', icon: UserPlus },
  { href: '#guardian-links', label: 'Guardian links', description: 'Connect parents to students', icon: Users },
  { href: '#enroll-student', label: 'Enroll student', description: 'Place students in courses', icon: UserPlus },
  { href: '#roster-import', label: 'Roster import', description: 'Bulk-load school users', icon: Upload },
]

export function AdminDashboard({ view }: { view: AdminView }) {
  const auditTrail = [...view.auditTrail]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 25)
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
    <LmsShell title="Admin dashboard" subtitle="School operations, launch health, roster, courses, and audit visibility." tools={adminTools}>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <LmsPanel id="school" title="School">
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

        <LmsPanel id="audit" title="Audit trail">
          <ul className="grid max-h-[32rem] gap-2 overflow-y-auto pr-1">
            {auditTrail.map((entry) => (
              <li key={entry.id} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                <Activity className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                <span className="font-semibold">{entry.action}</span>
                <span className="text-slate-500 dark:text-slate-400">{entry.resourceType}</span>
              </li>
            ))}
          </ul>
          {view.auditTrail.length > auditTrail.length ? (
            <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Showing latest {auditTrail.length} of {view.auditTrail.length} audit events.
            </p>
          ) : null}
        </LmsPanel>
      </div>

      <section id="metrics" className="scroll-mt-28 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
        <LmsPanel id="risk" title="Risk summary">
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

        <LmsPanel id="attendance" title="Attendance">
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
        <CalendarPanel items={view.calendar} actions={<CalendarEventForm courses={view.courses} returnTo="/admin" allowSchoolWide />} />
        <ResourcesPanel resources={view.resources} actions={<ResourceUploadForm courses={view.courses} returnTo="/admin" />} canReview />
        <MessagesPanel messages={view.messages} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LmsPanel id="create-course" title="Create course">
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
              <label className="grid gap-1 text-sm font-semibold">
                Section
                <input
                  name="sectionLabel"
                  placeholder="8A"
                  className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                Term
                <input
                  name="termLabel"
                  placeholder="Spring 2026"
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

        <LmsPanel id="invite-user" title="Invite user">
          <form action="/api/lms/invitations" method="post" className="grid gap-3">
            <label className="grid gap-1 text-sm font-semibold">
              Email
              <input
                name="email"
                type="email"
                required
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-semibold">
                First name
                <input
                  name="firstName"
                  className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                Last name
                <input
                  name="lastName"
                  className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                Role
                <select
                  name="role"
                  required
                  defaultValue="student"
                  className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                Grade
                <input
                  name="gradeLevel"
                  className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
            </div>
            <button
              type="submit"
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
            >
              <UserPlus className="h-4 w-4" />
              Send invite
            </button>
          </form>
        </LmsPanel>

        <LmsPanel id="school-users" title="School users">
          <ul className="grid gap-2">
            {view.memberships.map((membership) => {
              const nextStatus = membership.status === 'active' ? 'inactive' : 'active'
              const isActive = membership.status === 'active'
              const StatusIcon = isActive ? UserX : UserCheck

              return (
                <li key={membership.userId} className="flex flex-col gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{membership.name}</p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {membership.email} · {membership.role} · {membership.status}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <form action="/api/lms/invitations/resend" method="post">
                      <input type="hidden" name="userId" value={membership.userId} />
                      <button
                        type="submit"
                        disabled={membership.isCurrentAdmin}
                        className="inline-flex h-9 w-fit items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
                      >
                        <UserPlus className="h-4 w-4" />
                        Resend invite
                      </button>
                    </form>
                    <form action="/api/lms/memberships/status" method="post">
                      <input type="hidden" name="userId" value={membership.userId} />
                      <input type="hidden" name="status" value={nextStatus} />
                      <button
                        type="submit"
                        disabled={membership.isCurrentAdmin}
                        className="inline-flex h-9 w-fit items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
                      >
                        <StatusIcon className="h-4 w-4" />
                        {isActive ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </form>
                    <form action="/api/lms/memberships/role" method="post" className="flex flex-wrap gap-2 sm:justify-end">
                      <input type="hidden" name="userId" value={membership.userId} />
                      <select
                        name="role"
                        aria-label={`Role for ${membership.name}`}
                        defaultValue={membership.role}
                        disabled={membership.isCurrentAdmin}
                        className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm font-normal text-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="parent">Parent</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        type="submit"
                        disabled={membership.isCurrentAdmin}
                        className="inline-flex h-9 w-fit items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
                      >
                        <UserCheck className="h-4 w-4" />
                        Update role
                      </button>
                    </form>
                  </div>
                </li>
              )
            })}
          </ul>
        </LmsPanel>

        <LmsPanel id="guardian-links" title="Guardian links">
          <form action="/api/lms/guardian-links" method="post" className="grid gap-3">
            <label className="grid gap-1 text-sm font-semibold">
              Student
              <select
                name="studentId"
                required
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                {view.students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Guardian
              <select
                name="guardianId"
                required
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                {view.guardians.map((guardian) => (
                  <option key={guardian.id} value={guardian.id}>
                    {guardian.name} - {guardian.id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Relationship
              <select
                name="relationship"
                defaultValue="guardian"
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="guardian">Guardian</option>
                <option value="mother">Mother</option>
                <option value="father">Father</option>
                <option value="grandparent">Grandparent</option>
                <option value="other">Other</option>
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
            >
              <Users className="h-4 w-4" />
              Link guardian
            </button>
          </form>
          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
            <h3 className="text-sm font-semibold">Active guardian links</h3>
            {view.guardianLinks.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No active guardian links.</p>
            ) : (
              <ul className="mt-2 grid gap-2">
                {view.guardianLinks.map((link) => (
                  <li key={`${link.studentId}:${link.guardianId}`} className="grid gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span>
                        <strong>{link.studentName}</strong>
                        <span className="text-slate-500 dark:text-slate-400"> linked to {link.guardianName}</span>
                      </span>
                      <form action="/api/lms/guardian-links/unlink" method="post">
                        <input type="hidden" name="studentId" value={link.studentId} />
                        <input type="hidden" name="guardianId" value={link.guardianId} />
                        <button
                          type="submit"
                          className="inline-flex h-9 w-fit items-center justify-center rounded-md border border-rose-200 bg-rose-50 px-3 text-sm font-semibold text-rose-800 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100"
                        >
                          Unlink
                        </button>
                      </form>
                    </div>
                    <form action="/api/lms/guardian-links/contact" method="post" className="grid gap-2 rounded-md bg-slate-50 p-2 dark:bg-slate-950/50">
                      <input type="hidden" name="studentId" value={link.studentId} />
                      <input type="hidden" name="guardianId" value={link.guardianId} />
                      <div className="flex flex-wrap gap-3">
                        <label className="inline-flex items-center gap-2 text-xs font-semibold">
                          <input name="primaryContact" type="checkbox" defaultChecked={link.primaryContact} className="h-4 w-4 rounded border-slate-300" />
                          Primary contact
                        </label>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold">
                          <input name="consentGiven" type="checkbox" defaultChecked={link.consentGiven} className="h-4 w-4 rounded border-slate-300" />
                          Consent recorded
                        </label>
                        <label className="grid gap-1 text-xs font-semibold">
                          Method
                          <select
                            name="consentMethod"
                            defaultValue={link.consentMethod}
                            className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                          >
                            <option value="">None</option>
                            <option value="electronic">Electronic</option>
                            <option value="signed_form">Signed form</option>
                            <option value="email">Email</option>
                            <option value="in_person">In person</option>
                            <option value="other">Other</option>
                          </select>
                        </label>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <label className="grid gap-1 text-xs font-semibold">
                          Consent notes
                          <textarea
                            name="consentNotes"
                            defaultValue={link.consentNotes}
                            rows={2}
                            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                          />
                        </label>
                        <label className="grid gap-1 text-xs font-semibold">
                          Custody notes
                          <textarea
                            name="custodyNotes"
                            defaultValue={link.custodyNotes}
                            rows={2}
                            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                          />
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="inline-flex h-9 w-fit items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
                      >
                        Save contact details
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </LmsPanel>

        <LmsPanel id="enroll-student" title="Enroll student">
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
                    {student.name} - {student.id.slice(0, 8)}
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
                    {teacher.name} - {teacher.id.slice(0, 8)}
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

        <LmsPanel id="roster-import" title="Roster import">
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
