import { CalendarDays, FileText, MessageSquare } from 'lucide-react'
import { EmptyState, LmsPanel } from '@/components/lms/LmsShell'
import type { LmsCalendarItem, LmsMessageSummary, LmsResourceSummary } from '@/lib/lms/types'

export function CalendarPanel({ items }: { items: LmsCalendarItem[] }) {
  return (
    <LmsPanel title="Calendar">
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

export function ResourcesPanel({ resources }: { resources: LmsResourceSummary[] }) {
  return (
    <LmsPanel title="Resources">
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

export function MessagesPanel({ messages }: { messages: LmsMessageSummary[] }) {
  return (
    <LmsPanel title="Messages">
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
