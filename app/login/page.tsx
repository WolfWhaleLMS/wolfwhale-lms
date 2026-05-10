import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, KeyRound, LifeBuoy, LogIn, Mail, ShieldCheck } from 'lucide-react'
import { WolfWhaleBrand } from '@/components/ui/wolfwhale-brand'

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
  'rate-limited': 'Too many sign-in attempts. Wait a few minutes, then try again.',
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
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(125,211,252,0.55),transparent_30rem),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.9),transparent_24rem),linear-gradient(135deg,#e0f7ff,#f8fcff_48%,#c8efff)] px-4 py-6 text-slate-950 dark:bg-[radial-gradient(circle_at_20%_10%,rgba(14,165,233,0.22),transparent_30rem),radial-gradient(circle_at_78%_18%,rgba(20,184,166,0.14),transparent_24rem),linear-gradient(135deg,#03182f,#062a4f_52%,#031426)] dark:text-white sm:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.38)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.28)_1px,transparent_1px)] bg-[size:72px_72px] opacity-60 dark:opacity-10" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col justify-center gap-5">
        <div className="flex items-center justify-between gap-3">
          <WolfWhaleBrand
            href="/"
            logoSize={54}
            priority
            markClassName="rounded-2xl border-white/80 shadow-lg shadow-sky-900/10"
            textClassName="text-2xl text-blue-700 dark:text-white"
            taglineClassName="text-xs font-semibold text-blue-900/70 dark:text-cyan-100/75"
          />
          <Link
            href="/help"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/80 bg-white/72 px-4 text-sm font-bold text-blue-800 shadow-sm shadow-sky-900/10 backdrop-blur hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-cyan-100 dark:hover:bg-white/15"
          >
            <LifeBuoy className="h-4 w-4" />
            Help
          </Link>
        </div>

        <section className="grid overflow-hidden rounded-[2rem] border border-white/80 bg-white/76 shadow-2xl shadow-sky-900/18 backdrop-blur-2xl dark:border-white/15 dark:bg-slate-950/70 dark:shadow-black/30 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="p-6 sm:p-8 lg:p-10">
          <WolfWhaleBrand
            logoSize={72}
            priority
            className="w-full justify-start"
            markClassName="rounded-2xl border-white/80 shadow-md shadow-sky-900/10"
            textClassName="text-3xl text-blue-700 sm:text-4xl dark:text-white"
            taglineClassName="text-sm font-semibold text-blue-900/70 sm:text-base dark:text-cyan-100/75"
          />
          <p className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
            <ShieldCheck className="h-4 w-4" />
            WolfWhale Core
          </p>
          <h1 className="mt-4 text-5xl font-black leading-none tracking-normal text-blue-950 sm:text-6xl dark:text-white">
            School account access.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-700 dark:text-slate-100">
            Sign in to courses, assignments, grades, attendance, messages, and role dashboards.
          </p>

          {error && errors[error] ? (
            <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
              {errors[error]}
            </p>
          ) : null}

          {loggedOut ? (
            <p className="mt-5 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-100">
              You have been signed out.
            </p>
          ) : null}

          <form action="/api/auth/login" method="post" className="mt-8 grid gap-4">
            <input type="hidden" name="next" value={next} />
            <label className="grid gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
              School email
              <input
                name="email"
                type="email"
                autoComplete="email"
                className="h-14 rounded-2xl border border-sky-200 bg-white/88 px-4 text-base text-slate-950 shadow-inner shadow-sky-900/5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-white/15 dark:bg-white/8 dark:text-white dark:focus:border-cyan-300"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                className="h-14 rounded-2xl border border-sky-200 bg-white/88 px-4 text-base text-slate-950 shadow-inner shadow-sky-900/5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-white/15 dark:bg-white/8 dark:text-white dark:focus:border-cyan-300"
                required
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-sky-400 via-blue-600 to-blue-800 px-6 text-sm font-black text-white shadow-xl shadow-blue-900/20 transition hover:brightness-105"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </button>
          </form>

          <div className="mt-6 rounded-3xl border border-sky-100 bg-sky-50/70 p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            <p className="inline-flex items-center gap-2 font-black text-slate-900 dark:text-white">
              <KeyRound className="h-4 w-4" />
              Demo launch accounts
            </p>
            <div className="mt-3 grid gap-2">
              {demoAccounts.map((account) => (
                <div
                  key={account.email}
                  className="grid gap-2 rounded-2xl border border-white/80 bg-white/80 p-3 shadow-sm shadow-sky-900/5 dark:border-white/10 dark:bg-white/5 sm:grid-cols-[5.5rem_1fr]"
                >
                  <p className="font-black text-blue-900 dark:text-cyan-100">{account.role}</p>
                  <div className="grid gap-1">
                    <code className="break-all rounded-xl bg-white px-2 py-1 text-xs font-bold text-slate-900 dark:bg-slate-900 dark:text-white">
                      {account.email}
                    </code>
                    <code className="break-all rounded-xl bg-white px-2 py-1 text-xs font-bold text-slate-900 dark:bg-slate-900 dark:text-white">
                      {account.password}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="mailto:info@wolfwhale.ca?subject=WolfWhale%20school%20account%20access"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-white px-5 text-sm font-bold text-blue-800 transition hover:bg-sky-50 dark:border-white/15 dark:bg-white/8 dark:text-cyan-100 dark:hover:bg-white/12"
            >
              <Mail className="h-4 w-4" />
              Request access
            </a>
            <Link
              href="/help"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-white px-5 text-sm font-bold text-blue-800 transition hover:bg-sky-50 dark:border-white/15 dark:bg-white/8 dark:text-cyan-100 dark:hover:bg-white/12"
            >
              Visit help center
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          </div>

          <div className="relative hidden min-h-[42rem] overflow-hidden border-l border-white/70 bg-gradient-to-br from-sky-200/80 via-cyan-100/60 to-white/70 p-8 dark:border-white/10 dark:from-sky-950/70 dark:via-blue-950/60 dark:to-slate-950/70 lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_18%,rgba(255,255,255,0.88),transparent_15rem),linear-gradient(90deg,rgba(255,255,255,0.38)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.28)_1px,transparent_1px)] bg-[size:auto,64px_64px,64px_64px] dark:opacity-20" />
            <div className="relative flex h-full flex-col gap-7">
              <div className="max-w-md">
                <p className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm shadow-sky-900/10 dark:border-white/15 dark:bg-white/10 dark:text-cyan-100">
                  <CheckCircle2 className="h-4 w-4" />
                  Real LMS
                </p>
                <h2 className="mt-4 text-4xl font-black leading-tight text-blue-950 dark:text-white">
                  One login for every role.
                </h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-blue-900/75 dark:text-cyan-100/75">
                  Students, teachers, guardians, and admins land directly in the tools they need.
                </p>
              </div>

              <div className="relative rounded-[1.7rem] border border-white/85 bg-white/80 p-3 shadow-2xl shadow-blue-950/18 dark:border-white/15 dark:bg-white/8">
                <Image
                  src="/screenshots/actual-teacher-dashboard.png"
                  alt="Actual WolfWhale teacher dashboard"
                  width={1440}
                  height={960}
                  priority
                  className="rounded-[1.15rem] border border-sky-100 object-cover dark:border-white/10"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {['Courses', 'Grades', 'Messages'].map((item) => (
                  <span
                    key={item}
                    className="rounded-2xl border border-white/80 bg-white/72 px-3 py-3 text-center text-xs font-black text-blue-800 shadow-sm shadow-sky-900/10 dark:border-white/15 dark:bg-white/10 dark:text-cyan-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
