import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Check, GraduationCap, Sparkles, WifiOff, type LucideIcon } from 'lucide-react'
import { landingContent } from '@/lib/landing-i18n'

const t = landingContent.en

const clayAnimals = {
  mammoth: '/images/landing/clay-ice-age/woolly-mammoth.png',
  smilodon: '/images/landing/clay-ice-age/saber-tooth-cat.png',
  sloth: '/images/landing/clay-ice-age/giant-ground-sloth.png',
  rhino: '/images/landing/clay-ice-age/woolly-rhino.png',
  elk: '/images/landing/clay-ice-age/giant-elk.png',
  glyptodont: '/images/landing/clay-ice-age/glyptodont.png',
} as const

function DecorativeClayAnimal({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string
  alt: string
  className: string
  priority?: boolean
}) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute select-none ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 34vw, 22vw"
        className="object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.42)]"
      />
    </div>
  )
}

function FeatureTile({ title, copy, icon: Icon }: { title: string; copy: string; icon: LucideIcon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur-md transition duration-200 hover:border-cyan-200/30 hover:bg-white/[0.075]">
      <Icon className="mb-4 h-6 w-6 text-cyan-200" />
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/64">{copy}</p>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#061014] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#061014]/82 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
          <Link href="/" className="flex items-center gap-3" aria-label="WolfWhale home">
            <Image src="/logo.png" alt="" width={42} height={42} className="rounded-xl invert opacity-90" />
            <div>
              <p className="font-display text-sm tracking-[0.24em] text-white">WOLFWHALE</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-100/55">{t.lms}</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-white/62 md:flex">
            <a href="#features" className="transition hover:text-white">
              {t.nav.features}
            </a>
            <a href="#preview" className="transition hover:text-white">
              Preview
            </a>
            <a href="#packages" className="transition hover:text-white">
              {t.nav.pricing}
            </a>
            <a href="#contact" className="transition hover:text-white">
              {t.nav.contact}
            </a>
          </nav>
          <Link
            href="/login?next=%2Fstudent"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/78 transition hover:border-white/35 hover:text-white"
          >
            {t.nav.signIn}
          </Link>
        </div>
      </header>

      <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,176,196,0.18)_0%,rgba(12,34,41,0.42)_42%,rgba(6,16,20,0)_100%),linear-gradient(135deg,#061014_0%,#0c2229_46%,#081318_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#061014] to-transparent" />
        <DecorativeClayAnimal
          src={clayAnimals.mammoth}
          alt="Claymation woolly mammoth"
          priority
          className="ww-clay-float right-[-7rem] top-[7rem] hidden h-[30rem] w-[32rem] opacity-95 lg:block"
        />
        <DecorativeClayAnimal
          src={clayAnimals.smilodon}
          alt="Claymation saber-tooth cat"
          className="ww-clay-float-slow bottom-[-2rem] left-[-3rem] hidden h-[18rem] w-[24rem] -rotate-6 opacity-95 md:block"
        />
        <DecorativeClayAnimal
          src={clayAnimals.glyptodont}
          alt="Claymation glyptodont"
          className="ww-clay-float bottom-8 right-3 z-[15] h-[6.5rem] w-[9rem] rotate-3 opacity-95 sm:bottom-[4rem] sm:right-[18%] sm:h-[11rem] sm:w-[16rem] lg:right-[34%]"
        />

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-cyan-200/25 bg-cyan-100/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
              Built in Saskatchewan
            </p>
            <h1 className="font-display text-5xl leading-[0.94] tracking-[0.02em] text-white sm:text-6xl lg:text-7xl">
              WolfWhale
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">{t.heroTagline}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:info@wolfwhale.ca?subject=WolfWhale%20Demo%20Request"
                className="inline-flex items-center justify-center rounded-full bg-cyan-200 px-6 py-3 text-sm font-bold text-[#061014] shadow-[0_18px_40px_rgba(103,232,249,0.2)] transition hover:bg-white"
              >
                {t.requestDemo}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/78 transition hover:border-white/35 hover:text-white"
              >
                {t.seeFeatures}
              </a>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 text-center">
              {[
                ['72', 'Textbooks'],
                ['30+', 'Tools'],
                ['682', 'Outcomes'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-4 backdrop-blur-md">
                  <p className="text-3xl font-bold text-white">{value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/48">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rounded-[2rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl" />
            <div className="relative overflow-hidden rounded-[1.6rem] border border-white/14 bg-[#0d1c23] p-4 shadow-2xl shadow-black/40">
              <Image
                src="/screenshots/student-dashboard.png"
                alt="WolfWhale student dashboard"
                width={1200}
                height={800}
                priority
                className="aspect-[4/3] rounded-[1.1rem] object-cover"
              />
            </div>
            <div className="absolute -bottom-9 left-8 right-8 rounded-2xl border border-white/12 bg-[#10262c]/85 p-4 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/60">Ice Age Companion ready</p>
              <p className="mt-1 text-sm text-white/72">Students earn XP, hatch a friendly companion, and keep moving through the next helpful lesson.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 py-24">
        <DecorativeClayAnimal
          src={clayAnimals.sloth}
          alt="Claymation giant ground sloth"
          className="ww-clay-float-slow -right-12 top-10 hidden h-[18rem] w-[17rem] rotate-6 opacity-90 lg:block"
        />
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/72">{t.featuresTitle}</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">A complete school platform with a little magic around the edges.</h2>
            <p className="mt-5 text-lg leading-8 text-white/64">{t.featuresSubtitle}</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureTile title="Original textbooks" copy="WolfWhale Books gives schools a built-in curriculum library instead of a folder of disconnected links." icon={BookOpen} />
            <FeatureTile title="Offline learning" copy="Remote, rural, and northern learners keep working when the connection disappears." icon={WifiOff} />
            <FeatureTile title="Teacher tools" copy="Gradebook, attendance, reports, lesson builders, and classroom tools live in one place." icon={GraduationCap} />
            <FeatureTile title="Companion XP" copy="The Ice Age pet loop turns progress into celebration without punishment or pressure." icon={Sparkles} />
          </div>
        </div>
      </section>

      <section id="preview" className="relative overflow-hidden border-y border-white/10 bg-white/[0.04] py-24">
        <DecorativeClayAnimal
          src={clayAnimals.rhino}
          alt="Claymation woolly rhino"
          className="ww-clay-float left-[-4rem] top-[6rem] hidden h-[18rem] w-[22rem] -rotate-3 opacity-90 lg:block"
        />
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/72">{t.appPreview}</p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">{t.appPreviewSub}</h2>
          </div>
          <div className="mt-12 grid items-end gap-5 md:grid-cols-3">
            {[
              ['/screenshots/student-dashboard.png', t.dashboardLabel],
              ['/screenshots/teacher-dashboard.png', 'Teacher Dashboard'],
              ['/screenshots/admin-dashboard.png', 'Admin Dashboard'],
            ].map(([src, label], index) => (
              <div
                key={label}
                className={`rounded-[1.5rem] border border-white/10 bg-[#0b1a20] p-3 shadow-xl shadow-black/24 ${index === 1 ? 'md:-translate-y-8' : ''}`}
              >
                <Image src={src} alt={label} width={900} height={640} className="aspect-[4/3] rounded-[1rem] object-cover" />
                <p className="px-2 py-3 text-sm font-medium text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="packages" className="relative py-24">
        <DecorativeClayAnimal
          src={clayAnimals.elk}
          alt="Claymation giant elk"
          className="ww-clay-float-slow right-[-5rem] top-[-4rem] hidden h-[21rem] w-[20rem] rotate-6 opacity-90 lg:block"
        />
        <DecorativeClayAnimal
          src={clayAnimals.glyptodont}
          alt="Claymation glyptodont"
          className="ww-clay-float bottom-[-2rem] left-[4%] hidden h-[12rem] w-[18rem] -rotate-2 opacity-95 md:block"
        />
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/72">{t.pricingTitle}</p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">{t.pricingSub}</h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {t.packages.map((pkg) => (
              <div key={pkg.name} className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-100/58">{pkg.best}</p>
                <h3 className="mt-3 text-3xl font-bold text-white">{pkg.name}</h3>
                <ul className="mt-6 grid gap-3">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm leading-6 text-white/70">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-200" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:info@wolfwhale.ca?subject=WolfWhale%20Package%20Quote"
                  className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-[#061014] transition hover:bg-cyan-100"
                >
                  {pkg.cta}
                </a>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-6 text-white/55">{t.customNote}</p>
        </div>
      </section>

      <section id="contact" className="relative border-t border-white/10 bg-[#08171b] py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/72">{t.contactTitle}</p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">Bring the Ice Age companion into the classroom.</h2>
            <p className="mt-4 text-lg text-white/62">{t.contactSub}</p>
          </div>
          <a
            href="mailto:info@wolfwhale.ca?subject=WolfWhale%20Ice%20Age%20Companion"
            className="inline-flex items-center justify-center rounded-full bg-cyan-200 px-7 py-4 text-sm font-bold text-[#061014] transition hover:bg-white"
          >
            Talk to WolfWhale
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050b0e] py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 text-sm text-white/50 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={34} height={34} className="rounded-lg invert opacity-75" />
            <span>{t.footerCopyright}</span>
          </div>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition hover:text-white">
              {t.privacy}
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              {t.terms}
            </Link>
            <Link href="/help" className="transition hover:text-white">
              {t.help}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
