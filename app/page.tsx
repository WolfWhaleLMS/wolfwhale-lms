import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarCheck,
  CheckCircle2,
  Gamepad2,
  GraduationCap,
  Mail,
  MapPin,
  Shield,
  Users,
  X as XIcon,
} from 'lucide-react'

import { ContactForm } from '@/components/landing/ContactForm'
import { CommandPalette, CopyEmailButton, ScrollPersist } from '@/components/landing/LandingInteractions'
import { ThemeToggle } from '@/components/landing/ThemeToggle'
import { FAQAccordion } from '@/components/ui/FAQAccordion'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { landingContent, type Lang } from '@/lib/landing-i18n'

interface PageProps {
  searchParams: Promise<{ lang?: string }>
}

const stats = [
  { value: '92', label: 'Original textbooks' },
  { value: '1,836+', label: 'Curriculum outcomes' },
  { value: '1,249+', label: 'Learning games' },
  { value: '5', label: 'Provinces mapped' },
]

const featureCards = [
  {
    icon: GraduationCap,
    title: 'School Management',
    body: 'Attendance, gradebook, report cards, enrollment, parent portal, live classroom, and reporting for daily operations.',
    tone: 'amber',
  },
  {
    icon: BookOpen,
    title: 'Teaching & Learning',
    body: 'Micro-lessons, textbooks, AI tools, learning games, language learning, and offline access for focused practice.',
    tone: 'teal',
  },
]

const outcomes = [
  {
    icon: CalendarCheck,
    title: 'Run the school day',
    body: 'Attendance, grades, report cards, parent portal, enrollment, and reporting in one system.',
  },
  {
    icon: Brain,
    title: 'Teach faster',
    body: 'Micro-lessons, AI tools, original textbooks, and curriculum-aligned classroom content.',
  },
  {
    icon: Gamepad2,
    title: 'Keep students engaged',
    body: 'Games, cards, badges, skill trees, and progress loops students actually want to revisit.',
  },
  {
    icon: Shield,
    title: 'Stay compliant',
    body: 'Canadian hosting, synchronized data, and school-ready controls for privacy-sensitive workflows.',
  },
]

const roles = [
  { title: 'Student', body: 'Courses, grades, assignments, streaks, games, and practice.' },
  { title: 'Teacher', body: 'Classes, attendance, grading, lessons, AI tools, and feedback.' },
  { title: 'Parent', body: 'Progress, messages, absences, grades, and next steps.' },
  { title: 'Admin', body: 'Enrollment, reporting, trends, risk signals, and school setup.' },
]

const screenshots = [
  {
    src: '/screenshots/iphone-student-light.png',
    alt: 'WolfWhale student dashboard on iPhone',
    title: 'Student dashboard',
    body: 'Courses, progress, streaks, and upcoming work.',
  },
  {
    src: '/screenshots/iphone-teacher-light.png',
    alt: 'WolfWhale teacher dashboard on iPhone',
    title: 'Teacher dashboard',
    body: 'Fast access to classes, assignments, and tools.',
  },
  {
    src: '/screenshots/parent-dashboard.png',
    alt: 'WolfWhale parent dashboard',
    title: 'Parent view',
    body: 'Clear progress and school communication.',
  },
  {
    src: '/screenshots/admin-dashboard.png',
    alt: 'WolfWhale admin dashboard',
    title: 'Admin dashboard',
    body: 'The whole school in one operational view.',
  },
]

const compareRows = [
  ['AI Micro-Lesson Converter', true, false, false, false],
  ['92 Original Textbooks', true, false, false, false],
  ['1,249+ Learning Games', true, false, false, false],
  ['Live Classroom', true, true, true, false],
  ['Multi-Province Curriculum', true, false, true, false],
  ['Cree Language Learning', true, false, false, false],
  ['Installable PWA for Chromebooks', true, true, true, true],
  ['Canadian Data Hosting', true, false, true, true],
] as const

const faqItems = [
  {
    q: 'What is a school operating system?',
    a: 'WolfWhale combines the SIS work schools need to operate with the LMS work teachers and students need to learn. One platform, one login, one product model.',
  },
  {
    q: 'Can schools pilot WolfWhale?',
    a: 'Yes. We can shape a pilot around your school size, roles, implementation priorities, and reporting needs.',
  },
  {
    q: 'Where is student data stored?',
    a: 'WolfWhale is built around Canadian hosting and privacy-sensitive school workflows, with export paths and role-scoped access.',
  },
  {
    q: 'What platforms does it support?',
    a: 'WolfWhale is available on the web, installable as a PWA, and designed alongside native iOS and macOS experiences.',
  },
]

export default async function LMSHubPage({ searchParams }: PageProps) {
  const params = await searchParams
  const lang: Lang = params.lang === 'fr' ? 'fr' : 'en'
  const t = landingContent[lang]
  const lp = lang === 'fr' ? '?lang=fr' : ''

  return (
    <div className="woodland-aero min-h-screen overflow-x-hidden">
      <ScrollPersist />
      <CommandPalette
        items={[
          { label: t.nav.features, href: '#features' },
          { label: t.nav.compare, href: '#compare' },
          { label: t.nav.pricing, href: '#pricing' },
          { label: t.nav.faq, href: '#faq' },
          { label: t.nav.contact, href: '#contact' },
        ]}
      />

      <header className="aero-nav fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href={`/${lp}`} className="flex items-center" aria-label="WolfWhale home">
            <Image
              src="/wolfwhale-wordmark.png"
              alt="WolfWhale"
              width={752}
              height={73}
              className="aero-wordmark h-auto w-[150px] invert dark:invert-0 sm:w-[220px]"
              priority
            />
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-teal-700 dark:text-slate-100 dark:hover:text-teal-300">
              {t.nav.features}
            </a>
            <a href="#compare" className="text-sm font-medium text-slate-600 hover:text-teal-700 dark:text-slate-100 dark:hover:text-teal-300">
              {t.nav.compare}
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-teal-700 dark:text-slate-100 dark:hover:text-teal-300">
              {t.nav.pricing}
            </a>
            <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-teal-700 dark:text-slate-100 dark:hover:text-teal-300">
              {t.nav.faq}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle lang={lang} />
            <ThemeToggle />
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-lg bg-slate-950 px-3 text-[11px] font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 sm:h-11 sm:px-5 sm:text-sm"
            >
              {t.nav.signIn}
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10 pt-16">
        <section className="aero-hero relative isolate flex min-h-[82svh] items-center overflow-hidden border-b border-slate-200 dark:border-slate-800">
          <div aria-hidden="true" className="aero-bubble aero-bubble-one" />
          <div aria-hidden="true" className="aero-bubble aero-bubble-two" />
          <div aria-hidden="true" className="aero-bubble aero-bubble-three" />
          <AnimalArt
            src="/images/clay-forest/evergreen-skyline.png"
            className="aero-forest -bottom-24 left-1/2 w-[980px] -translate-x-1/2 opacity-25 dark:opacity-22 sm:w-[1180px] lg:-bottom-28 lg:w-[1500px] xl:w-[1720px]"
          />
          <AnimalArt
            src="/images/chibi-animals/clay-fox.png"
            className="aero-hero-fox bottom-1 left-6 w-40 -rotate-12 opacity-95 sm:left-16 sm:w-56 lg:bottom-1 lg:left-[34%] lg:w-52 xl:left-[35%] xl:w-60"
          />
          <AnimalArt
            src="/images/chibi-animals/clay-rainbow-trout.png"
            className="aero-hero-trout bottom-16 right-[-3.5rem] hidden w-56 rotate-12 opacity-90 sm:block lg:bottom-4 lg:right-[9%] lg:w-64 xl:right-[12%] xl:w-72"
          />

          <Image
            src="/screenshots/web-teacher-light.png"
            alt=""
            width={2880}
            height={1800}
            className="aero-hero-app-bg absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-25"
            priority
          />
          <Image
            src="/screenshots/web-teacher-dark.png"
            alt=""
            width={2880}
            height={1800}
            className="hidden"
            priority
          />
          <div className="aero-hero-wash absolute inset-0 -z-10 bg-white/88 dark:bg-slate-950/88" />
          <div className="aero-hero-ground absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-950" />

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-4 pb-52 pt-14 sm:px-6 sm:pb-64 sm:pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-20">
            <div className="max-w-3xl">
              <p className="aero-kicker mb-5 inline-flex rounded-md border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-teal-800 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-200">
                One school app
              </p>
              <h1 className="aero-headline text-balance font-serif text-5xl font-semibold leading-[0.95] tracking-normal text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
                One clear app for the whole school.
              </h1>
              <p className="aero-copy mt-5 max-w-2xl text-lg leading-8 text-slate-700 dark:text-white sm:text-xl">
                Attendance, grades, report cards, textbooks, learning games, parent updates, and AI teacher tools in one calm, connected school app.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#contact" className="aero-button inline-flex h-12 items-center justify-center gap-2 rounded-md bg-teal-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-teal-800">
                  Get a Demo
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#screenshots" className="aero-button aero-button-secondary inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
                  See the product
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="mt-7 flex flex-wrap gap-2">
                {['School management + learning', 'Built for Canadian K-12', 'School pilots available'].map((label) => (
                  <span key={label} className="aero-chip rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="aero-product-frame overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40">
                <Image
                  src="/screenshots/mac-teacher-dashboard-light.png"
                  alt="WolfWhale teacher dashboard"
                  width={3420}
                  height={2138}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="aero-stat-band border-b border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-950 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="aero-card rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                <p className="font-serif text-4xl font-semibold text-slate-950 dark:text-white">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="aero-section scroll-mt-20 relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
          <AnimalArt
            src="/images/clay-forest/birch-cluster.png"
            className="aero-birch -left-12 top-8 hidden w-64 -rotate-6 opacity-60 md:block lg:left-0 lg:w-72"
          />
          <AnimalArt
            src="/images/chibi-animals/clay-moose.png"
            className="aero-moose right-[-2rem] top-14 hidden w-52 rotate-6 opacity-85 lg:block xl:right-8 xl:w-64"
          />

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-200">Features</p>
              <h2 className="mt-3 text-balance font-serif text-3xl font-semibold text-slate-950 dark:text-white sm:text-5xl">
                School operations and learning, together.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-700 dark:text-white">
                Most schools juggle separate tools for the office, the classroom, and family communication. WolfWhale brings the daily work together so everyone can move with more confidence.
              </p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {featureCards.map(({ icon: Icon, title, body, tone }) => (
                <div
                  key={title}
                  className={`aero-card rounded-lg border p-6 ${
                    tone === 'amber'
                      ? 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40'
                      : 'border-teal-200 bg-teal-50 dark:border-teal-900 dark:bg-teal-950/40'
                  }`}
                >
                  <Icon className={`h-8 w-8 ${tone === 'amber' ? 'text-amber-700 dark:text-amber-300' : 'text-teal-700 dark:text-teal-200'}`} />
                  <h3 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-white">{body}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {outcomes.map(({ icon: Icon, title, body }) => (
                <div key={title} className="aero-card rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <Icon className="h-6 w-6 text-teal-700 dark:text-teal-200" />
                  <h3 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-100">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="aero-demo relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-20">
          <AnimalArt
            src="/images/chibi-animals/clay-rainbow-trout.png"
            className="aero-demo-trout left-[27%] top-2 hidden w-52 -rotate-6 opacity-90 lg:block"
          />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_10%,rgba(20,184,166,0.32),transparent_34rem),linear-gradient(135deg,#020617,#0f172a_45%,#042f2e)]" />
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-200">Instant demo</p>
              <h2 className="mt-3 max-w-xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                Explore without signing up.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-200">
                Pick a role and try WolfWhale with sample data. The fastest way to understand the product is to move through it like a school would.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {roles.map((role) => (
                <a
                  key={role.title}
                  href="/login"
                  className="aero-role-card rounded-lg border border-white/10 bg-white p-6 text-center text-slate-950 shadow-xl shadow-black/20 transition-transform hover:-translate-y-1"
                >
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-teal-50 text-teal-700">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{role.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{role.body}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="screenshots" className="aero-section aero-screens scroll-mt-20 relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
          <AnimalArt
            src="/images/chibi-animals/clay-owl.png"
            className="aero-owl left-[-1rem] top-10 hidden w-56 -rotate-6 opacity-80 lg:block"
          />
          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-200">App preview</p>
              <h2 className="mt-3 text-balance font-serif text-3xl font-semibold text-slate-950 dark:text-white sm:text-5xl">
                A real app, not a brochure.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-700 dark:text-white">
                Native on iOS and Mac. Available on the web. Designed for classrooms that need simple access across devices.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {screenshots.map((shot) => (
                <article key={shot.title} className="aero-card rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                    <Image src={shot.src} alt={shot.alt} width={1170} height={2532} className="aspect-[9/16] w-full object-cover object-top" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">{shot.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-100">{shot.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="compare" className="aero-section scroll-mt-20 bg-white px-4 py-16 dark:bg-slate-950 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-200">How we compare</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-950 dark:text-white sm:text-5xl">
                Built for Canadian schools from the first screen.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-700 dark:text-white">
                WolfWhale combines core school operations with classroom learning tools that usually live in separate products.
              </p>
            </div>
            <div className="mt-10 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="overflow-x-auto">
                <div className="min-w-[720px]">
                  <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50 text-sm font-semibold dark:border-slate-800 dark:bg-slate-900">
                    {['Feature', 'WolfWhale', 'Canvas', 'Brightspace', 'Edsby'].map((heading) => (
                      <div key={heading} className="p-4 text-left text-slate-700 dark:text-white">
                        {heading}
                      </div>
                    ))}
                  </div>
                  {compareRows.map(([feature, wolfwhale, canvas, brightspace, edsby]) => (
                    <div key={feature} className="grid grid-cols-5 border-b border-slate-100 bg-white text-sm last:border-b-0 dark:border-slate-800 dark:bg-slate-950">
                      <div className="p-4 font-medium text-slate-800 dark:text-white">{feature}</div>
                      {[wolfwhale, canvas, brightspace, edsby].map((value, index) => (
                        <div key={`${feature}-${index}`} className="flex items-center p-4">
                          {value ? <CheckCircle2 className="h-5 w-5 text-teal-700 dark:text-teal-200" /> : <XIcon className="h-5 w-5 text-slate-300 dark:text-slate-700" />}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-200">
              Comparison based on publicly available feature lists as of 2026.
            </p>
          </div>
        </section>

        <section id="pricing" className="aero-section scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-200">Simple pricing</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-950 dark:text-white sm:text-5xl">
                One plan. Everything included.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-700 dark:text-white">
                Teachers get free access. Volume discounts are available for school boards and multi-school pilots.
              </p>
            </div>
            <div className="aero-card rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-8">
              <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">Contact us for pricing</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-100">
                We will help shape the pilot around your school size, roles, and priorities.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {['Full SIS + LMS', 'Original textbooks', 'AI tools for teachers', 'Parent visibility', 'Canadian hosting', 'Setup support'].map((item) => (
                  <div key={item} className="flex gap-2.5 text-sm leading-6 text-slate-700 dark:text-white">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-200" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <a href="#contact" className="aero-button mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-teal-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-teal-800">
                Get a Demo
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="aero-canada bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-200">Built in Canada</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-5xl">School data should feel close to home.</h2>
              <p className="mt-5 text-base leading-8 text-slate-200">
                Saskatoon, SK. Canadian owned, PIPEDA-aware, and designed for schools that need trust, exportability, and clear operations.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {['Data stays in Canada', 'Export anytime', 'Canadian Owned', 'PIPEDA Compliant', 'Hosted in Canada'].map((badge) => (
                <span key={badge} className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="aero-section scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-200">FAQ</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-950 dark:text-white sm:text-5xl">
                Quick answers.
              </h2>
            </div>
            <div className="mt-10">
              <FAQAccordion sections={[{ id: 'top', heading: '', items: faqItems }]} />
            </div>
          </div>
        </section>

        <section id="contact" className="aero-section scroll-mt-20 bg-white px-4 py-16 dark:bg-slate-950 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-200">Talk to us</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-950 dark:text-white sm:text-5xl">
                Let’s shape the pilot.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-700 dark:text-white">
                Tell us about your school, board, or program. We reply within two business days.
              </p>
            </div>
            <div className="aero-card mt-10 rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <ContactForm />
            </div>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <p className="text-xs text-slate-500 dark:text-slate-200">
                Or email us at{' '}
                <a href="mailto:info@wolfwhale.ca" className="font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-200 dark:hover:text-teal-100">
                  info@wolfwhale.ca
                </a>
              </p>
              <CopyEmailButton />
            </div>
          </div>
        </section>
      </main>

      <footer className="aero-footer border-t border-slate-200 bg-white px-4 py-8 dark:border-slate-800 dark:bg-slate-950 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Image src="/wolfwhale-wordmark.png" alt="WolfWhale" width={752} height={73} className="aero-wordmark h-auto w-[160px] invert dark:invert-0" />
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-200">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Saskatoon, SK, Canada
              </span>
              <a href="mailto:info@wolfwhale.ca" className="inline-flex items-center gap-1 hover:text-teal-700 dark:hover:text-teal-300">
                <Mail className="h-3 w-3" /> info@wolfwhale.ca
              </a>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-200">© 2026 WolfWhale Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function AnimalArt({ src, className }: { src: string; className: string }) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={1254}
      height={1254}
      className={`pointer-events-none absolute z-0 h-auto select-none drop-shadow-[0_24px_36px_rgba(15,23,42,0.22)] dark:drop-shadow-[0_24px_40px_rgba(0,0,0,0.5)] ${className}`}
    />
  )
}
