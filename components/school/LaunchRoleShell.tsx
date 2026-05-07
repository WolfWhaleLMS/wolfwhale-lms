import Link from 'next/link'
import { ArrowLeft, ClipboardCheck, LockKeyhole, ShieldAlert } from 'lucide-react'
import type { RoleSurface } from '@/lib/school-launch/role-surfaces'

interface LaunchRoleShellProps {
  surface: RoleSurface
}

export function LaunchRoleShell({ surface }: LaunchRoleShellProps) {
  return (
    <main
      data-role={surface.role}
      data-launch-surface={surface.status}
      className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-200 dark:hover:text-teal-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to WolfWhale
        </Link>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900 dark:bg-amber-950 dark:text-amber-100">
              <ShieldAlert className="h-4 w-4" />
              Controlled pilot only
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-200">
              {surface.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{surface.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700 dark:text-slate-100">{surface.summary}</p>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <LockKeyhole className="h-5 w-5 text-teal-700 dark:text-teal-200" />
              <h2 className="text-lg font-semibold">Access status</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-200">
              This route is protected by pilot middleware until Supabase Auth, role sessions, and row-level security tests
              are connected end to end.
            </p>
          </aside>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-5 w-5 text-teal-700 dark:text-teal-200" />
              <h2 className="text-lg font-semibold">Workflow surface</h2>
            </div>
            <ul className="mt-5 space-y-3">
              {surface.primaryWorkflows.map((workflow) => (
                <li key={workflow} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                  {workflow}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-700 dark:text-amber-200" />
              <h2 className="text-lg font-semibold">Required before real data</h2>
            </div>
            <ul className="mt-5 space-y-3">
              {surface.requiredBeforeRealData.map((requirement) => (
                <li key={requirement} className="rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                  {requirement}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}
