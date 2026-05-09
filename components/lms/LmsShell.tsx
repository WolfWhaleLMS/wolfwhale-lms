import { LayoutDashboard, LogOut, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type LmsToolLink = {
  href: string
  label: string
  description: string
  icon: LucideIcon
}

export function LmsShell({
  title,
  subtitle,
  tools = [],
  children,
}: {
  title: string
  subtitle: string
  tools?: LmsToolLink[]
  children: ReactNode
}) {
  return (
    <main id="dashboard-top" className="lms-dashboard-shell min-h-screen scroll-mt-28 bg-slate-50 px-4 py-8 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl min-w-0 flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="#dashboard-top"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-200 dark:hover:text-teal-100"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard home
          </a>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>

        <section className="border-b border-slate-200 pb-5 dark:border-slate-800">
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-200">{subtitle}</p>
        </section>

        {tools.length > 0 ? (
          <nav
            aria-label="Dashboard tools"
            className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-semibold text-slate-950 dark:text-white">Dashboard tools</h2>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{tools.length} available tools</span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {tools.map((tool) => {
                const Icon = tool.icon

                return (
                  <a
                    key={tool.href}
                    href={tool.href}
                    className="group flex min-h-16 items-start gap-3 rounded-md border border-slate-200 px-3 py-3 text-left text-sm hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 dark:border-slate-800 dark:hover:border-teal-500 dark:hover:bg-teal-950/40 dark:focus:ring-offset-slate-950"
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-200" />
                    <span className="grid gap-0.5">
                      <span className="font-semibold text-slate-950 dark:text-white">{tool.label}</span>
                      <span className="text-xs leading-5 text-slate-500 dark:text-slate-400">{tool.description}</span>
                    </span>
                  </a>
                )
              })}
            </div>
          </nav>
        ) : null}

        {children}
      </div>
    </main>
  )
}

export function LmsPanel({
  id,
  title,
  actions,
  children,
}: {
  id?: string
  title: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} className="min-w-0 scroll-mt-28 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="mt-3 min-w-0">{children}</div>
    </section>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">{children}</p>
}
