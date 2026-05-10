import type { ReactNode } from 'react'
import { CalendarDays, FileText, MessageSquare, ShieldCheck, Upload } from 'lucide-react'
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

const resourceStatusLabels: Record<string, string> = {
  clean: 'Clean',
  pending: 'Pending scan',
  blocked: 'Quarantined',
  error: 'Scan error',
  unreviewed: 'Unreviewed',
}

function resourceStatusClass(status: string) {
  switch (status) {
    case 'clean':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100'
    case 'blocked':
    case 'error':
      return 'border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100'
    case 'pending':
      return 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100'
    default:
      return 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
  }
}

function formatLmsDateTime(value: string) {
  const parsed = Date.parse(value)
  if (!Number.isFinite(parsed)) return value

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(parsed))
}

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
                {item.courseTitle} - {formatLmsDateTime(item.dueAt)}
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
  canReview = false,
}: {
  id?: string
  resources: LmsResourceSummary[]
  actions?: ReactNode
  canReview?: boolean
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
              <span className={`mt-2 inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${resourceStatusClass(resource.scanStatus)}`}>
                <ShieldCheck className="h-3.5 w-3.5" />
                {resourceStatusLabels[resource.scanStatus] ?? resource.scanStatus}
                {resource.legalHold ? ' - legal hold' : ''}
              </span>
              {resource.retentionExpiresAt ? (
                <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">Retains until {resource.retentionExpiresAt.slice(0, 10)}</span>
              ) : null}
              {canReview ? (
                <form action={`/api/lms/resources/${resource.id}`} method="post" className="mt-3 grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950">
                  <input type="hidden" name="returnTo" value="/admin" />
                  <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Scan status
                    <select
                      name="scanStatus"
                      defaultValue={['pending', 'clean', 'blocked', 'error'].includes(resource.scanStatus) ? resource.scanStatus : 'pending'}
                      className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm font-normal normal-case tracking-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      <option value="pending">Pending scan</option>
                      <option value="clean">Clean</option>
                      <option value="blocked">Quarantined</option>
                      <option value="error">Scan error</option>
                    </select>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm font-semibold">
                    <input type="checkbox" name="legalHold" defaultChecked={resource.legalHold} className="h-4 w-4 rounded border-slate-300 text-teal-700" />
                    Legal hold
                  </label>
                  <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Quarantine note
                    <input
                      name="quarantineReason"
                      defaultValue={resource.quarantineReason}
                      maxLength={500}
                      placeholder="Reason for block or scan exception"
                      className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm font-normal normal-case tracking-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </label>
                  <button type="submit" className="inline-flex h-9 w-fit items-center gap-2 rounded-md bg-slate-900 px-3 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                    <ShieldCheck className="h-4 w-4" />
                    Save review
                  </button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </LmsPanel>
  )
}

export function MessageComposer({
  courses,
  recipients = [],
  returnTo,
  recipientLabel = 'Recipient',
  contentLabel = 'Message',
}: {
  courses: LmsCourseSummary[]
  recipients?: Array<{ id: string; name: string }>
  returnTo: '/teacher' | '/guardian' | '/admin' | '/student/messages'
  recipientLabel?: string
  contentLabel?: string
}) {
  if (courses.length === 0) return null

  return (
    <form action="/api/lms/messages" method="post" className="mb-3 grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
      <input type="hidden" name="returnTo" value={returnTo} />
      <div className="grid gap-3 sm:grid-cols-2">
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
        {recipients.length > 0 ? (
          <label className="grid gap-1 text-sm font-semibold">
            {recipientLabel}
            <select
              name="recipientId"
              required
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {recipients.map((recipient) => (
                <option key={recipient.id} value={recipient.id}>
                  {recipient.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
      <label className="grid gap-1 text-sm font-semibold">
        Subject
        <input
          name="subject"
          maxLength={255}
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        {contentLabel}
        <textarea
          name="content"
          required
          maxLength={5000}
          rows={3}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </label>
      <button type="submit" className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800">
        <MessageSquare className="h-4 w-4" />
        Send message
      </button>
    </form>
  )
}

export function MessagesPanel({ id = 'messages', messages, actions }: { id?: string; messages: LmsMessageSummary[]; actions?: ReactNode }) {
  return (
    <LmsPanel id={id} title="Messages">
      {actions}
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
