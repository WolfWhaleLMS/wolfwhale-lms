import type { ReactNode } from 'react'
import { CalendarDays, FileText, MessageSquare, Upload } from 'lucide-react'
import { EmptyState, LmsPanel } from '@/components/lms/LmsShell'
import type { LmsCalendarItem, LmsCourseSummary, LmsMessageSummary, LmsResourceSummary } from '@/lib/lms/types'

const resourceAcceptTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/gif',
  'video/mp4',
  'audio/mpeg',
  'application/zip',
].join(',')

export function CalendarPanel({ id = 'calendar', items }: { id?: string; items: LmsCalendarItem[] }) {
  return (
    <LmsPanel id={id} title="Calendar">
      {items.length === 0 ? (
        <EmptyState>No dated LMS items.</EmptyState>
      ) : (
        <ul className="grid gap-2">
          {items.map((item) => (
            <li key={item.id} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
              <span className="inline-flex items-center gap-2 font-semibold">
                <CalendarDays className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                {item.title}
              </span>
              <span className="mt-1 block text-slate-500 dark:text-slate-400">
                {item.courseTitle} - {item.dueAt}
              </span>
            </li>
          ))}
        </ul>
      )}
    </LmsPanel>
  )
}

export function ResourceUploadForm({
  courses,
  returnTo,
}: {
  courses: LmsCourseSummary[]
  returnTo: '/teacher' | '/admin'
}) {
  if (courses.length === 0) {
    return <EmptyState>Create a course before uploading resources.</EmptyState>
  }

  return (
    <form action="/api/lms/resources" method="post" encType="multipart/form-data" className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
      <input type="hidden" name="returnTo" value={returnTo} />
      <label className="grid gap-1 text-sm font-semibold">
        Course
        <select
          name="courseId"
          required
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Display name
        <input
          name="displayName"
          maxLength={255}
          placeholder="Unit guide, lab sheet, slide deck..."
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        File
        <input
          name="file"
          type="file"
          required
          accept={resourceAcceptTypes}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-950 file:mr-3 file:rounded-md file:border-0 file:bg-teal-700 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </label>
      <button
        type="submit"
        className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
      >
        <Upload className="h-4 w-4" />
        Upload resource
      </button>
      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">PDF, Office, text, image, audio, video, and ZIP files up to 100 MB. Downloads use signed private links.</p>
    </form>
  )
}

export function ResourcesPanel({
  id = 'resources',
  resources,
  actions,
}: {
  id?: string
  resources: LmsResourceSummary[]
  actions?: ReactNode
}) {
  return (
    <LmsPanel id={id} title="Resources">
      {actions ? <div className="mb-4">{actions}</div> : null}
      {resources.length === 0 ? (
        <EmptyState>No course resources.</EmptyState>
      ) : (
        <ul className="grid gap-2">
          {resources.map((resource) => (
            <li key={resource.id} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
              <a href={`/api/lms/resources/${resource.id}`} className="inline-flex items-center gap-2 font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-200 dark:hover:text-teal-100">
                <FileText className="h-4 w-4" />
                {resource.title}
              </a>
              <span className="mt-1 block text-slate-500 dark:text-slate-400">
                {resource.courseTitle} - {resource.fileName}
              </span>
            </li>
          ))}
        </ul>
      )}
    </LmsPanel>
  )
}

export function MessagesPanel({ id = 'messages', messages }: { id?: string; messages: LmsMessageSummary[] }) {
  return (
    <LmsPanel id={id} title="Messages">
      {messages.length === 0 ? (
        <EmptyState>No visible messages.</EmptyState>
      ) : (
        <ul className="grid gap-2">
          {messages.slice(0, 5).map((message) => (
            <li key={message.id} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
              <span className="inline-flex items-center gap-2 font-semibold">
                <MessageSquare className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                {message.subject}
              </span>
              <span className="mt-1 block text-slate-500 dark:text-slate-400">
                {message.senderName} - {message.createdAt}
              </span>
              <p className="mt-1 text-slate-700 dark:text-slate-200">{message.content}</p>
            </li>
          ))}
        </ul>
      )}
    </LmsPanel>
  )
}
