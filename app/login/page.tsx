import type { Metadata } from 'next'
import Link from 'next/link'
import { KeyRound, LifeBuoy, LogIn, Mail, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'School Account Sign In',
  description: 'Sign in to WolfWhale with a school-provisioned account.',
}

interface LoginPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

const errors: Record<string, string> = {
  'missing-credentials': 'Enter your school email and password.',
  'invalid-credentials': 'The email or password did not match a WolfWhale account.',
  'no-membership': 'This account is not assigned to an active school role.',
  'auth-confirmation-failed': 'The sign-in link could not be confirmed. Request a new link from your school admin.',
}

const demoAccounts = [
  { role: 'Student', email: 'student@wolfwhale.ca', password: 'WolfWhale-Student-2026' },
  { role: 'Teacher', email: 'teacher@wolfwhale.ca', password: 'WolfWhale-Teacher-2026' },
  { role: 'Guardian', email: 'parent@wolfwhale.ca', password: 'WolfWhale-Parent-2026' },
  { role: 'Admin', email: 'admin@wolfwhale.ca', password: 'WolfWhale-Admin-2026' },
]

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {}
  const next = firstParam(params.next) ?? ''
  const error = firstParam(params.error)
  const loggedOut = firstParam(params.loggedOut)

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col justify-center">
        <Link
          href="/help"
          className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-200 dark:hover:text-teal-100"
        >
          <LifeBuoy className="h-4 w-4" />
          Account help
        </Link>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-200">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight sm:text-5xl">School account access</h1>
          <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-100">
            WolfWhale accounts are provisioned by your school. Sign in with your school email and password to access
            your courses, assignments, grades, messages, and family dashboard.
          </p>

          {error && errors[error] ? (
            <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
              {errors[error]}
            </p>
          ) : null}

          {loggedOut ? (
            <p className="mt-5 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-100">
              You have been signed out.
            </p>
          ) : null}

          <form action="/api/auth/login" method="post" className="mt-8 grid gap-4">
            <input type="hidden" name="next" value={next} />
            <label className="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              School email
              <input
                name="email"
                type="email"
                autoComplete="email"
                className="h-12 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                className="h-12 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                required
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-teal-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </button>
          </form>

          <div className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
            <p className="inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
              <KeyRound className="h-4 w-4" />
              Demo launch accounts
            </p>
            <div className="mt-3 grid gap-3">
              {demoAccounts.map((account) => (
                <div
                  key={account.email}
                  className="grid gap-2 rounded-md border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-[6rem_1fr]"
                >
                  <p className="font-semibold text-slate-900 dark:text-white">{account.role}</p>
                  <div className="grid gap-1">
                    <p>
                      <span className="font-semibold">Email:</span>{' '}
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-900 dark:bg-slate-800 dark:text-white">
                        {account.email}
                      </code>
                    </p>
                    <p>
                      <span className="font-semibold">Password:</span>{' '}
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-900 dark:bg-slate-800 dark:text-white">
                        {account.password}
                      </code>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="mailto:info@wolfwhale.ca?subject=WolfWhale%20school%20account%20access"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-teal-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
            >
              <Mail className="h-4 w-4" />
              Request access
            </a>
            <Link
              href="/help"
              className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              Visit help center
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
