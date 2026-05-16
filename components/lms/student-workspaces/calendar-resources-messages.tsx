import { Bell, MessageSquare } from 'lucide-react'

import { CellArchitectureResourceCenter } from '@/components/lms/resource-center/CellArchitectureResourceCenter'
import { FurTradeRoutesMap } from '@/components/lms/resource-center/FurTradeRoutesMap'
import { HumanBodyResourceCenter } from '@/components/lms/resource-center/HumanBodyResourceCenter'
import { InteractiveResourceLibraryCatalog } from '@/components/lms/resource-center/InteractiveResourceLibraryCatalog'
import { SolarSystemResourceCenter } from '@/components/lms/resource-center/SolarSystemResourceCenter'

import { courseCalendar, courseMessages, courseResources, formatShortDate } from './helpers'
import { EmptyState, StudentWorkspaceShell, WorkspaceCourseSection, WorkspacePanel } from './shared'
import type { StudentView } from './types'

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
    <StudentWorkspaceShell title="Resource Center" subtitle="Interactive learning diagrams and course files collected in one place.">
      <div className="grid gap-5">
        <InteractiveResourceLibraryCatalog />
        <CellArchitectureResourceCenter />
        <HumanBodyResourceCenter />
        <SolarSystemResourceCenter />
        <FurTradeRoutesMap />

        <div id="course-files" className="scroll-mt-28">
          <div className="student-workspace-panel rounded-lg border border-white/75 bg-white/84 p-4 shadow-[0_18px_50px_rgba(5,44,38,0.18)] backdrop-blur-md">
            <h2 className="text-xl font-black text-[#17352c]">Course files</h2>
            <p className="mt-1 text-sm font-semibold text-[#55736a]">Teacher-uploaded materials grouped by the class and lesson they belong to.</p>
          </div>
        </div>

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
        {view.courses.length > 0 ? (
          <WorkspacePanel title="Message a teacher" icon={MessageSquare}>
            <form action="/api/lms/messages" method="post" className="grid gap-3">
              <input type="hidden" name="returnTo" value="/student/messages" />
              <label className="grid gap-1 text-sm font-black text-[#17352c]">
                Course
                <select name="courseId" required className="h-11 rounded-lg border border-sky-100 bg-white/86 px-3 text-sm font-semibold text-[#17352c]">
                  {view.courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-black text-[#17352c]">
                Subject
                <input
                  name="subject"
                  maxLength={255}
                  className="h-11 rounded-lg border border-sky-100 bg-white/86 px-3 text-sm font-semibold text-[#17352c]"
                />
              </label>
              <label className="grid gap-1 text-sm font-black text-[#17352c]">
                Message
                <textarea
                  name="content"
                  required
                  maxLength={5000}
                  rows={3}
                  className="rounded-lg border border-sky-100 bg-white/86 px-3 py-2 text-sm font-semibold text-[#17352c]"
                />
              </label>
              <button type="submit" className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-lg bg-[#17352c] px-4 text-sm font-black text-white">
                <MessageSquare className="h-4 w-4" />
                Send message
              </button>
            </form>
          </WorkspacePanel>
        ) : null}

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
