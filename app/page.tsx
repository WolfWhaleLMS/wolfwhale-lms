import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Mail, Phone, MapPin, CheckCircle2, X as XIcon, Feather, Linkedin, Twitter, Brain, Sparkles, BookOpen, Target, Building2, Server, BarChart3, Shield as ShieldIcon, DollarSign, Lock } from 'lucide-react'
import { GlowingLogo } from '@/components/ui/glowing-logo'
import { ContactForm } from '@/components/landing/ContactForm'
import { ThemeToggle } from '@/components/landing/ThemeToggle'
import { FAQAccordion } from '@/components/ui/FAQAccordion'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { CommandPalette, CopyEmailButton, ScrollPersist } from '@/components/landing/LandingInteractions'
import { landingContent, type Lang } from '@/lib/landing-i18n'

interface PageProps {
  searchParams: Promise<{ lang?: string }>
}

export default async function LMSHubPage({ searchParams }: PageProps) {
  const params = await searchParams
  const validLangs: Lang[] = ['en', 'fr']
  const lang: Lang = validLangs.includes(params.lang as Lang) ? (params.lang as Lang) : 'en'
  const t = landingContent[lang]
  const lp = lang !== 'en' ? `?lang=${lang}` : ''

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-white dark:bg-black">
      {/* Principle 4: persistent resumable scroll state */}
      <ScrollPersist />



      {/* LocalBusiness schema for local SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Wolf Whale",
          "description": "Complete school operating system for Canadian K-12. Combines a Learning Management System (LMS) + Student Information System (SIS) with 72 original textbooks, AI tools, attendance, gradebook, and report cards in one native iOS app.",
          "url": "https://wolfwhale.ca",
          "logo": "https://wolfwhale.ca/logo.png",
          "email": "info@wolfwhale.ca",
          "telephone": "+1-306-981-5926",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Saskatoon",
            "addressRegion": "SK",
            "addressCountry": "CA"
          },
          "areaServed": [
            { "@type": "Country", "name": "Canada" },
            { "@type": "City", "name": "Saskatoon" },
            { "@type": "City", "name": "Regina" },
            { "@type": "City", "name": "Toronto" },
            { "@type": "City", "name": "Calgary" },
            { "@type": "City", "name": "Ottawa" },
            { "@type": "City", "name": "Edmonton" },
            { "@type": "City", "name": "Montreal" },
            { "@type": "City", "name": "Winnipeg" },
            { "@type": "City", "name": "Halifax" },
            { "@type": "City", "name": "Vancouver" }
          ],
          "priceRange": "$$"
        }) }}
      />


      {/* Principle 13: cmd+k command palette */}
      <CommandPalette items={[
        { label: t.nav.features, href: '#features' },
        { label: t.nav.compare, href: '#compare' },
        { label: t.nav.pricing, href: '#pricing' },
        { label: t.nav.faq, href: '#faq' },
        { label: t.nav.contact, href: '#contact' },
      ]} />

      {/* Header / Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-xl bg-white dark:bg-black border-b border-gray-200 dark:border-white/5">
        <nav className="flex items-center justify-between">
          <Link href={`/${lp}`} className="inline-flex flex-col group shrink-0 min-w-0">
            <span className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#00BFFF] transition-colors duration-100 tracking-normal uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
              WolfWhale
            </span>
            <span className="hidden sm:block text-xs text-gray-500 dark:text-white/60 tracking-[0.15em] uppercase font-medium -mt-0.5">
              {t.lms}
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-4">
            <a href="#features" className="text-sm text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors duration-100 font-medium">
              {t.nav.features}
            </a>
            <Link href={`/${lp}#divisions`} className="text-sm text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors duration-100 font-medium hidden sm:inline">
              Divisions
            </Link>
            <a href="#compare" className="text-sm text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors duration-100 font-medium">
              {t.nav.compare}
            </a>
            <a href="#pricing" className="text-sm text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors duration-100 font-medium">
              {t.nav.pricing}
            </a>
            <a href="#faq" className="text-sm text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors duration-100 font-medium">
              {t.nav.faq}
            </a>
            <LanguageToggle lang={lang} />
            <ThemeToggle />
            {/* Principle 11: larger hit targets — h-11 */}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold transition-all duration-100 hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              {t.nav.contact}
            </a>
          </div>

          {/* Mobile CTA */}
          <div className="sm:hidden flex items-center gap-1.5 shrink-0">
            <LanguageToggle lang={lang} />
            <ThemeToggle />
            <a
              href="#contact"
              className="inline-flex items-center h-9 px-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black text-[11px] font-semibold transition-all duration-100"
            >
              {t.nav.contact}
            </a>
          </div>
        </nav>

        {/* Mobile nav links */}
        <div className="flex sm:hidden items-center justify-center gap-4 mt-3 max-w-6xl mx-auto">
          <a href="#features" className="text-xs text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors duration-100 font-medium">
            {t.nav.features}
          </a>
          <a href="#compare" className="text-xs text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors duration-100 font-medium">
            {t.nav.compare}
          </a>
          <a href="#pricing" className="text-xs text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors duration-100 font-medium">
            {t.nav.pricing}
          </a>
          <a href="#faq" className="text-xs text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors duration-100 font-medium">
            {t.nav.faq}
          </a>
        </div>
      </header>
      {/* Spacer for fixed header */}
      <div className="h-[80px] sm:h-[86px]" />

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="flex items-center justify-center min-h-[60vh] sm:min-h-[calc(100vh-200px)] px-4 py-10 sm:py-16">
          <div className="w-full max-w-5xl text-center space-y-6 sm:space-y-8 animate-fade-in-up">
            <div className="mb-8 sm:mb-16">
              <GlowingLogo size={96} />
            </div>

            <div className="relative z-10 space-y-1 sm:space-y-2">
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal text-gray-900 dark:text-white tracking-[-0.03em] sm:tracking-[-0.04em] uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                WolfWhale
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-gray-500 dark:text-white/70 tracking-[0.25em] uppercase font-normal">
                {t.lms}
              </p>
            </div>

            <p className="text-base sm:text-lg text-gray-500 dark:text-white/60 max-w-2xl mx-auto">
              {t.heroTagline}
            </p>

            {/* Principle 17: L to R — primary CTA first */}
            <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4 pt-4 sm:pt-6">
              {/* Principle 11: larger hit targets — h-12 */}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 h-12 px-8 sm:px-10 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm sm:text-base font-semibold transition-all duration-100 hover:bg-gray-800 dark:hover:bg-gray-100"
              >
                {t.startPilot}
                <ArrowRight className="h-5 w-5 -mr-1" />
              </a>
              <p className="text-xs text-gray-400 dark:text-white/40">{t.pilotSub}</p>
              <a
                href="#features"
                className="inline-flex items-center gap-1.5 h-10 text-sm text-gray-400 dark:text-white/50 hover:text-[#00BFFF] transition-colors duration-100 font-medium"
              >
                {t.seeFeatures}
                <ArrowRight className="h-4 w-4" />
              </a>
              {/* App Store Badge */}
              <a
                href="https://apps.apple.com/app/id6759676805"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3"
              >
                <div className="bg-black rounded-lg border border-gray-700 px-4 py-2 flex items-center gap-2.5 hover:bg-gray-900 transition-colors duration-100">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white flex-shrink-0">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/90 leading-none">{t.downloadOn}</span>
                    <span className="text-base font-semibold text-white leading-tight">{t.appStore}</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>


        {/* Mission & Impact Section */}
        <section id="mission" className="px-4 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-wider">
                {t.missionTitle}
              </h2>
              <p className="text-base sm:text-lg text-gray-500 dark:text-white/60 italic">
                {t.missionTagline}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
              {t.missionStats.map(({ value, label, source }) => (
                <div
                  key={value}
                  className="bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-center space-y-2"
                >
                  <p className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                    {value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-white/70 leading-snug">{label}</p>
                  <p className="text-[10px] text-gray-400 dark:text-white/30 tracking-wider">{source}</p>
                </div>
              ))}
            </div>

            {/* Missions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {t.missions.map(({ title, desc }) => (
                <div
                  key={title}
                  className="bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-5 flex items-start gap-3"
                >
                  <div className="inline-flex p-2 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/20 shrink-0 mt-0.5">
                    <Target className="h-4 w-4 text-[#00BFFF]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-white/40 uppercase tracking-widest font-semibold mb-1">{title}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Learning Management System (LMS) + Student Information System (SIS) in One App */}
        <section className="px-4 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-10 md:p-14">
              <div className="text-center space-y-6">
                <p className="text-xs text-gray-400 dark:text-white/40 tracking-widest uppercase font-medium">Why WolfWhale is Different</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-wider" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                  Learning Management System (LMS) + Student Information System (SIS) in One App
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-2xl mx-auto leading-relaxed">
                  Most schools run a separate Learning Management System (LMS) for learning and a separate Student Information System (SIS) for administration. WolfWhale combines both into a single native iOS app — micro-lessons, textbooks, attendance, gradebook, report cards, enrollment, parent portal, and scheduling. No more juggling six different logins.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4">
                  <div className="bg-white/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl p-5 text-left">
                    <p className="text-xs text-gray-400 dark:text-white/40 tracking-widest uppercase font-semibold mb-2">LMS Side</p>
                    <ul className="space-y-1.5 text-sm text-gray-600 dark:text-white/70">
                      <li className="flex items-start gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-[#8B5CF6] shrink-0" />Micro-lessons &amp; textbooks</li>
                      <li className="flex items-start gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-[#8B5CF6] shrink-0" />AI tutor &amp; lesson converter</li>
                      <li className="flex items-start gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-[#8B5CF6] shrink-0" />Gamification &amp; XP</li>
                      <li className="flex items-start gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-[#8B5CF6] shrink-0" />Offline learning</li>
                      <li className="flex items-start gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-[#8B5CF6] shrink-0" />Curriculum constellation</li>
                    </ul>
                  </div>
                  <div className="bg-white/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl p-5 text-left">
                    <p className="text-xs text-gray-400 dark:text-white/40 tracking-widest uppercase font-semibold mb-2">SIS Side</p>
                    <ul className="space-y-1.5 text-sm text-gray-600 dark:text-white/70">
                      <li className="flex items-start gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-[#00BFFF] shrink-0" />Attendance tracking</li>
                      <li className="flex items-start gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-[#00BFFF] shrink-0" />Gradebook &amp; report cards</li>
                      <li className="flex items-start gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-[#00BFFF] shrink-0" />Student enrollment &amp; records</li>
                      <li className="flex items-start gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-[#00BFFF] shrink-0" />Parent portal &amp; messaging</li>
                      <li className="flex items-start gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-[#00BFFF] shrink-0" />Timetable &amp; scheduling</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-4 py-10 sm:py-16">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-wider">
                {t.featuresTitle}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-xl mx-auto">
                {t.featuresSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {t.features.map(({ icon: Icon, title, points, color, slug }) => (
                <Link
                  key={title}
                  href={`/features/${slug}${lp}`}
                  className="bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-100 group cursor-pointer"
                >
                  <div
                    className="inline-flex p-3 rounded-xl mb-4 border transition-colors duration-100"
                    style={{
                      backgroundColor: `${color}10`,
                      borderColor: `${color}30`,
                    }}
                  >
                    <Icon className="h-6 w-6" style={{ color }} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#00BFFF] transition-colors duration-100">{title}</h3>
                  <ul className="space-y-1">
                    {points.map((pt) => (
                      <li key={pt} className="text-sm text-gray-600 dark:text-white/65 flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-400 dark:text-white/30 mt-3 group-hover:text-[#00BFFF]/60 transition-colors duration-100 flex items-center gap-1">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Download on the App Store */}
        <section id="download" className="px-4 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-10 md:p-14 text-center space-y-6">
              <p className="text-xs text-gray-400 dark:text-white/40 tracking-widest uppercase font-medium">Available Now</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-wider" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Download WolfWhale
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-2xl mx-auto leading-relaxed">
                Native on iPhone, iPad, and Mac. One app for students, teachers, parents, and administrators.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <a
                  href="https://apps.apple.com/app/id6759676805"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <div className="bg-black rounded-xl border border-gray-700 px-6 py-3 flex items-center gap-3 hover:bg-gray-900 transition-colors duration-100">
                    <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white flex-shrink-0">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] text-white/90 leading-none">{t.downloadOn}</span>
                      <span className="text-lg font-semibold text-white leading-tight">{t.appStore}</span>
                    </div>
                  </div>
                </a>
              </div>
              <div className="flex flex-wrap justify-center gap-6 pt-4 text-xs text-gray-400 dark:text-white/30">
                <span>iPhone</span>
                <span>iPad</span>
                <span>Mac (Apple Silicon)</span>
                <span>iOS 17+</span>
              </div>
            </div>
          </div>
        </section>

        {/* School Platform Comparison Section */}
        <section id="compare" className="px-4 py-10 sm:py-16">
          <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-wider">
                {t.compareTitle}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-xl mx-auto">
                {t.compareSub}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  <div className="grid grid-cols-8 gap-0 text-center border-b border-gray-200 dark:border-white/10">
                    <div className="p-3 sm:p-4 text-left text-xs sm:text-sm font-bold text-gray-500 dark:text-white/60 uppercase tracking-wider">
                      {t.featureLabel}
                    </div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-normal text-gray-900 dark:text-white border-l border-gray-100 dark:border-white/5 bg-gray-900/5 dark:bg-white/5 uppercase tracking-wider" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                      WolfWhale
                    </div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-gray-500 dark:text-white/60 border-l border-gray-100 dark:border-white/5">Canvas</div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-gray-500 dark:text-white/60 border-l border-gray-100 dark:border-white/5">Brightspace</div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-gray-500 dark:text-white/60 border-l border-gray-100 dark:border-white/5">Edsby</div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-gray-500 dark:text-white/60 border-l border-gray-100 dark:border-white/5">Moodle</div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-gray-500 dark:text-white/60 border-l border-gray-100 dark:border-white/5">Veracross</div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-gray-500 dark:text-white/60 border-l border-gray-100 dark:border-white/5">PowerSchool</div>
                  </div>

                  {t.compareRows.map(({ feature, wolfwhale, canvas, brightspace, edsby, moodle, veracross, powerschool }, idx) => (
                    <div
                      key={feature}
                      className={`grid grid-cols-8 gap-0 text-center ${idx % 2 === 0 ? 'bg-white/[0.02]' : ''} ${idx < t.compareRows.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''}`}
                    >
                      <div className="p-3 sm:p-4 text-left text-xs sm:text-sm text-gray-700 dark:text-white/80">
                        {feature}
                      </div>
                      {[wolfwhale, canvas, brightspace, edsby, moodle, veracross, powerschool].map((val, i) => (
                        <div
                          key={i}
                          className={`p-3 sm:p-4 flex items-center justify-center border-l border-gray-100 dark:border-white/5 ${i === 0 ? 'bg-gray-900/5 dark:bg-white/5' : ''}`}
                        >
                          {val === true ? (
                            <CheckCircle2 className={`h-4 w-4 sm:h-5 sm:w-5 ${i === 0 ? 'text-gray-900 dark:text-white' : 'text-emerald-600 dark:text-emerald-300'}`} />
                          ) : (
                            <XIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 dark:text-white/20" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-white/30 text-center py-2 sm:hidden">{t.swipeHint}</p>
            </div>

            <div className="text-center space-y-6">
              <p className="text-xs text-gray-400 dark:text-white/40">{t.compareDisclaimer}</p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold transition-all duration-100 hover:bg-gray-800 dark:hover:bg-gray-100"
              >
                {t.readyToSwitch}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://apps.apple.com/app/id6759676805"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-white/40 hover:text-[#00BFFF] transition-colors duration-100 mt-2"
              >
                Or download now on the App Store <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-4 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-wider">
                {t.pricingTitle}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-xl mx-auto">
                {t.pricingSub}
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 text-center space-y-6 relative overflow-hidden">
                <div className="relative space-y-2">
                  <p className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-widest font-medium">{t.perUser}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>$12</span>
                    <span className="text-lg text-gray-500 dark:text-white/50 font-medium">{t.perMonth}</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-white/40">{t.minContract}</p>
                </div>
                <div className="relative h-px bg-gray-200 dark:bg-white/10" />
                <ul className="relative space-y-3 text-left">
                  {t.pricingFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-white/75">
                      <CheckCircle2 className="h-4 w-4 text-gray-900 dark:text-white shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="relative pt-2 space-y-3">
                  <a
                    href="#contact"
                    className="w-full inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold transition-all duration-100 hover:bg-gray-800 dark:hover:bg-gray-100"
                  >
                    {t.requestDemo}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="https://apps.apple.com/app/id6759676805"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 h-10 text-sm text-gray-400 dark:text-white/40 hover:text-[#00BFFF] transition-colors duration-100"
                  >
                    Download on the App Store <ArrowRight className="h-3 w-3" />
                  </a>
                  <p className="text-xs text-gray-400 dark:text-white/40">{t.volumeDiscounts}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ambassador Program Teaser */}
        <section className="px-4 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 text-center space-y-4">
              <p className="text-xs text-gray-400 dark:text-white/40 tracking-widest uppercase font-medium">Ambassador Program</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Know a School That Needs WolfWhale?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
                Earn 5% of Year 1 revenue for every school you bring. Teachers, parents, community members — anyone can join.
              </p>
              <a href="/referrals" className="inline-flex items-center gap-2 h-10 px-6 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold transition-all duration-100 hover:bg-gray-800 dark:hover:bg-gray-100">
                Learn More & Sign Up
              </a>
            </div>
          </div>
        </section>

        {/* For School Divisions */}
        <section id="divisions" className="px-4 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-wider">
                {t.divisionsTitle}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-xl mx-auto">
                {t.divisionsSub}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.divisionsFeatures.map((f) => (
                <div key={f.title} className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    {f.icon === 'shield' && <ShieldIcon className="h-5 w-5 text-[#00BFFF]" />}
                    {f.icon === 'server' && <Server className="h-5 w-5 text-[#00BFFF]" />}
                    {f.icon === 'chart' && <BarChart3 className="h-5 w-5 text-[#00BFFF]" />}
                    {f.icon === 'users' && <Building2 className="h-5 w-5 text-[#00BFFF]" />}
                    {f.icon === 'dollar' && <DollarSign className="h-5 w-5 text-[#00BFFF]" />}
                    {f.icon === 'lock' && <Lock className="h-5 w-5 text-[#00BFFF]" />}
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-white/60 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 h-12 px-8 sm:px-10 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm sm:text-base font-semibold transition-all duration-100 hover:bg-gray-800 dark:hover:bg-gray-100"
              >
                {t.divisionsCTA}
                <ArrowRight className="h-5 w-5 -mr-1" />
              </a>
              <p className="text-xs text-gray-400 dark:text-white/40 mt-3">{t.pilotSub}</p>
              <a
                href="https://apps.apple.com/app/id6759676805"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-gray-400 dark:text-white/30 hover:text-[#00BFFF] transition-colors duration-100 mt-1"
              >
                Available on the App Store <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </section>
        {/* Built in Canada & Reconciliation Section */}
        <section id="canada" className="px-4 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-10 md:p-14">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="shrink-0 flex flex-col items-center gap-4">
                  <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 shadow-lg">
                    <Image src="/canada-flag.png" alt="Canadian Flag" width={256} height={128} className="w-24 sm:w-32 h-auto" />
                  </div>
                  <span className="text-xs text-gray-400 dark:text-white/40 tracking-widest uppercase">Est. 2024</span>
                </div>
                <div className="space-y-4 sm:space-y-5 text-center md:text-left">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-wider uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                    {t.canadaTitle}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 leading-relaxed">
                    {t.canadaSub}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                    {t.canadaBadges.map((badge, i) => (
                      <div
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-500 dark:text-white/60"
                      >
                        <badge.icon className="h-3 w-3 text-red-500" />
                        {badge.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* TRC Calls to Action */}
            <div className="bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-10 md:p-14 space-y-6">
              <div className="flex items-center justify-center gap-3">
                <div className="inline-flex p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Feather className="h-5 w-5 text-amber-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-wider uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                  {t.trcTitle}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {t.trcCards.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-white/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl p-4 sm:p-5">
                    <div className="inline-flex p-2 rounded-lg bg-amber-500/10 border border-amber-500/15 mb-3">
                      <Icon className="h-4 w-4 text-amber-500" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1.5">{title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-white/55 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="px-4 py-10 sm:py-16">
          <div className="max-w-3xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-wider">
                {t.faqTitle}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-xl mx-auto">
                {t.faqSub}
              </p>
            </div>

            <FAQAccordion
              sections={[
                {
                  id: 'top',
                  heading: '',
                  items: t.faqItems,
                },
              ]}
            />

            {/* FAQ Schema for SEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": t.faqItems.map(item => ({
                  "@type": "Question",
                  "name": item.q,
                  "acceptedAnswer": { "@type": "Answer", "text": item.a },
                }))
              }) }}
            />
          </div>
        </section>

        {/* Contact Form — principle 10: copy email button */}
        <section id="contact" className="px-4 py-10 sm:py-16">
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-wider">
                {t.contactTitle}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-lg mx-auto">
                {t.contactSub}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-8">
              <ContactForm />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <p className="text-xs text-gray-400 dark:text-white/40">
                {t.emailDirect}{' '}
                <a href="mailto:info@wolfwhale.ca" className="text-[#00BFFF]/70 hover:text-[#00BFFF] transition-colors duration-100">
                  info@wolfwhale.ca
                </a>
              </p>
              <CopyEmailButton />
            </div>
          </div>
        </section>

        {/* Principle 18: reassurance about loss */}
        <section className="px-4 py-10">
          <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-gray-400 dark:text-white/25">
            <span>{lang === 'fr' ? 'Données au Canada' : 'Data stays in Canada'}</span>
            <span>{lang === 'fr' ? 'Exportez quand vous voulez' : 'Export anytime'}</span>
            <span>{lang === 'fr' ? 'Annulez en un clic' : 'Cancel in one click'}</span>
            <span>{lang === 'fr' ? 'Aucun verrouillage' : 'No lock-in'}</span>
          </div>
        </section>
      </main>

      {/* Footer — principle 8: brand kit link */}
      <footer className="relative z-10 p-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-px bg-gray-200 dark:bg-white/10 mb-6" />
          <div className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-normal text-gray-700 dark:text-white/70 uppercase tracking-wider" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>WOLFWHALE <span className="text-gray-400 dark:text-white/30 mx-1">|</span> School Platform</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-white/60">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Saskatoon, SK, Canada</span>
                  <a href="mailto:info@wolfwhale.ca" className="flex items-center gap-1 hover:text-[#00BFFF] transition-colors duration-100"><Mail className="h-3 w-3" /> info@wolfwhale.ca</a>
                  <a href="tel:+13069815926" className="flex items-center gap-1 hover:text-[#00BFFF] transition-colors duration-100"><Phone className="h-3 w-3" /> +1 (306) 981-5926</a>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <Link href="/brand" className="text-sm text-gray-500 dark:text-white/60 hover:text-[#00BFFF] transition-colors duration-100">
                    Brand
                  </Link>
                  <Link href={`/privacy${lp}`} className="text-sm text-gray-500 dark:text-white/60 hover:text-[#00BFFF] transition-colors duration-100">
                    {t.privacy}
                  </Link>
                  <Link href={`/terms${lp}`} className="text-sm text-gray-500 dark:text-white/60 hover:text-[#00BFFF] transition-colors duration-100">
                    {t.terms}
                  </Link>
                  <Link href={`/help${lp}`} className="text-sm text-gray-500 dark:text-white/60 hover:text-[#00BFFF] transition-colors duration-100">
                    {t.help}
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <a href="https://linkedin.com/company/wolfwhale-learning" target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-white/40 hover:text-[#00BFFF] transition-colors duration-100" aria-label="LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="https://x.com/wolfwhale" target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-white/40 hover:text-[#00BFFF] transition-colors duration-100" aria-label="X (Twitter)">
                    <Twitter className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-white/40">
              &copy; {new Date().getFullYear()} {t.footerCopyright}
            </p>
          </div>
        </div>
      </footer>

      {/* Principle 6: no visible scrollbars / smooth scroll for hash links */}
      <style>{`
        html {
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-behavior: smooth;
        }
        html::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Clear hash from URL after scrolling so refresh stays at top */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('click', function(e) {
          var a = e.target.closest('a[href^="#"]');
          if (a) {
            setTimeout(function() {
              history.replaceState(null, '', window.location.pathname + window.location.search);
            }, 800);
          }
        });
      `}} />
    </div>
  )
}
