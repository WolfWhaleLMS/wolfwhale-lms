import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Mail, Phone, MapPin, Brain, WifiOff, Gamepad2, Bot, Smartphone, CheckCircle2, X as XIcon, Minus, Paintbrush, Flag, Globe, Heart, Code, Palette, Layers, Accessibility, Zap, Linkedin, Twitter, ChevronDown, Feather, BookOpen, Users, Fingerprint, MessageCircle, GraduationCap, Music, Activity, Trophy, Wrench, Eye } from 'lucide-react'
import { GlowingLogo } from '@/components/ui/glowing-logo'
import { ContactForm } from '@/components/landing/ContactForm'
import { ThemeToggle } from '@/components/landing/ThemeToggle'
import { FAQAccordion } from '@/components/ui/FAQAccordion'

export default function LMSHubPage() {
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-white dark:bg-black">
      {/* Force scroll to top on every page load */}
      <script dangerouslySetInnerHTML={{ __html: `
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
        if (window.location.hash) history.replaceState(null, '', window.location.pathname);
      `}} />
      {/* LocalBusiness schema for local SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "WolfWhale Inc.",
          "description": "Canadian learning management system for K-12 and post-secondary schools with built-in spaced repetition flashcards.",
          "url": "https://wolfwhale.ca",
          "logo": "https://wolfwhale.ca/logo.png",
          "email": "info@wolfwhale.ca",
          "telephone": "+1-306-981-5926",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Vancouver",
            "addressRegion": "BC",
            "addressCountry": "CA"
          },
          "areaServed": [
            { "@type": "Country", "name": "Canada" },
            { "@type": "City", "name": "Vancouver" },
            { "@type": "City", "name": "Toronto" },
            { "@type": "City", "name": "Calgary" },
            { "@type": "City", "name": "Ottawa" },
            { "@type": "City", "name": "Edmonton" },
            { "@type": "City", "name": "Montreal" },
            { "@type": "City", "name": "Winnipeg" },
            { "@type": "City", "name": "Halifax" }
          ],
          "priceRange": "$$"
        }) }}
      />
      {/* Corinthian Pillar Borders — Real Marble Image */}
      {/* Left Pillar — starts just below header, extends past viewport bottom to eliminate gap */}
      <div className="fixed top-[15px] -bottom-[60px] left-0 w-[80px] sm:w-[130px] md:w-[190px] lg:w-[260px] z-[5] pointer-events-none" aria-hidden="true">
        <img
          src="/pillar.jpg"
          alt=""
          className="block w-full h-full object-cover object-top mix-blend-multiply dark:mix-blend-lighten dark:invert opacity-90 dark:opacity-40"
        />
      </div>
      {/* Right Pillar — mirrored */}
      <div className="fixed top-[15px] -bottom-[60px] right-0 w-[80px] sm:w-[130px] md:w-[190px] lg:w-[260px] z-[5] pointer-events-none" style={{ transform: 'scaleX(-1)' }} aria-hidden="true">
        <img
          src="/pillar.jpg"
          alt=""
          className="block w-full h-full object-cover object-top mix-blend-multiply dark:mix-blend-lighten dark:invert opacity-90 dark:opacity-40"
        />
      </div>

      {/* Background with subtle neon glows (dark mode only) */}
      <div className="fixed inset-0 z-0 hidden dark:block">
        {/* Pure black base */}
        <div className="absolute inset-0 bg-black" />

        {/* Ambient neon glow layers — subtle on black */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 150% 80% at 50% 20%, rgba(139,92,246,0.12) 0%, transparent 60%)',
            animation: 'ocean-pulse 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 120% 60% at 30% 30%, rgba(0,191,255,0.06) 0%, transparent 50%)',
            animation: 'ocean-drift 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background: 'radial-gradient(ellipse 100% 50% at 70% 25%, rgba(139,92,246,0.08) 0%, transparent 45%)',
            animation: 'ocean-wave-slow 15s ease-in-out infinite reverse',
          }}
        />

        {/* Subtle light beams — purple/blue on black */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {/* Beam 1 */}
          <div
            className="absolute sunbeam"
            style={{
              top: '-5%',
              left: '15%',
              width: '180px',
              height: '120%',
              background: 'linear-gradient(180deg, rgba(139,92,246,0.15) 0%, rgba(0,191,255,0.04) 40%, transparent 85%)',
              transform: 'rotate(8deg)',
              transformOrigin: 'top center',
              animation: 'sunbeam-sway-1 18s ease-in-out infinite',
              filter: 'blur(20px)',
            }}
          />
          {/* Beam 2 */}
          <div
            className="absolute sunbeam"
            style={{
              top: '-5%',
              left: '40%',
              width: '90px',
              height: '110%',
              background: 'linear-gradient(180deg, rgba(139,92,246,0.18) 0%, rgba(0,191,255,0.06) 35%, transparent 75%)',
              transform: 'rotate(-3deg)',
              transformOrigin: 'top center',
              animation: 'sunbeam-sway-2 22s ease-in-out infinite',
              filter: 'blur(12px)',
            }}
          />
          {/* Beam 3 */}
          <div
            className="absolute sunbeam"
            style={{
              top: '-5%',
              left: '58%',
              width: '140px',
              height: '115%',
              background: 'linear-gradient(180deg, rgba(0,191,255,0.10) 0%, rgba(139,92,246,0.04) 45%, transparent 80%)',
              transform: 'rotate(5deg)',
              transformOrigin: 'top center',
              animation: 'sunbeam-sway-3 25s ease-in-out infinite',
              filter: 'blur(18px)',
            }}
          />
          {/* Beam 4 */}
          <div
            className="absolute sunbeam"
            style={{
              top: '-5%',
              left: '78%',
              width: '200px',
              height: '120%',
              background: 'linear-gradient(180deg, rgba(139,92,246,0.08) 0%, rgba(0,191,255,0.03) 50%, transparent 90%)',
              transform: 'rotate(-6deg)',
              transformOrigin: 'top center',
              animation: 'sunbeam-sway-5 28s ease-in-out infinite',
              filter: 'blur(25px)',
            }}
          />
        </div>

      </div>

      {/* Header / Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-xl bg-white dark:bg-black border-b border-gray-200 dark:border-white/5">
        <nav className="flex items-center justify-between">
          <Link href="/" className="inline-flex flex-col group shrink-0">
            <span className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#00BFFF] transition-colors tracking-normal uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
              WolfWhale
            </span>
            <span className="text-[9px] sm:text-xs text-gray-500 dark:text-white/60 tracking-[0.15em] uppercase font-medium -mt-0.5">
              Learning Management System
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
              Features
            </a>
            <a href="#compare" className="text-sm text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
              Compare
            </a>
            <a href="#pricing" className="text-sm text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
              Pricing
            </a>
            <a href="#faq" className="text-sm text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
              FAQ
            </a>
            <Link href="/sign-in" className="text-sm text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
              Sign In
            </Link>
            <ThemeToggle />
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-chrome-3d-dark text-white text-sm font-semibold"
            >
              Contact
            </a>
          </div>

          {/* Mobile CTA */}
          <div className="sm:hidden flex items-center gap-3">
            <ThemeToggle />
            <Link href="/sign-in" className="text-xs text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
              Sign In
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl btn-chrome-3d-dark text-white text-xs font-semibold"
            >
              Contact
            </a>
          </div>
        </nav>

        {/* Mobile nav links */}
        <div className="flex sm:hidden items-center justify-center gap-4 mt-3 max-w-6xl mx-auto">
          <a href="#features" className="text-xs text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
            Features
          </a>
          <a href="#compare" className="text-xs text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
            Compare
          </a>
          <a href="#pricing" className="text-xs text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
            Pricing
          </a>
          <a href="#faq" className="text-xs text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
            FAQ
          </a>
        </div>
      </header>
      {/* Spacer for fixed header */}
      <div className="h-[50px] sm:h-[56px]" />

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="flex items-center justify-center min-h-[60vh] sm:min-h-[calc(100vh-200px)] px-4 py-10 sm:py-16">
          <div className="w-full max-w-5xl text-center space-y-6 sm:space-y-8 animate-fade-in-up">
            {/* Logo app tile */}
            <div className="mb-8 sm:mb-16">
              <GlowingLogo size={96} />
            </div>

            {/* Heading — relative z-10 so glow renders BEHIND the text */}
            <div className="relative z-10 space-y-1 sm:space-y-2">
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal text-gray-900 dark:text-white tracking-[-0.03em] sm:tracking-[-0.04em] uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                WolfWhale
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-gray-500 dark:text-white/70 tracking-[0.25em] uppercase font-normal">
                Learning Management System
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4 pt-4 sm:pt-6">
              {/* Primary CTA — conversion action */}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 sm:px-10 sm:py-4 rounded-xl btn-chrome-3d-dark text-white text-sm sm:text-base font-semibold"
              >
                Request a Demo
                <ArrowRight className="h-5 w-5" />
              </a>
              {/* Secondary CTA — explore features */}
              <a
                href="#features"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-white/50 hover:text-[#00BFFF] transition-colors font-medium"
              >
                See Features
                <ArrowRight className="h-4 w-4" />
              </a>
              {/* App Store Badge */}
              <div
                className="inline-block mt-3 cursor-default"
                aria-label="Coming soon to the App Store"
                title="Coming soon"
              >
                <div className="bg-black rounded-lg border border-gray-700 px-4 py-2 flex items-center gap-2.5">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white flex-shrink-0">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/90 leading-none">Download on the</span>
                    <span className="text-base font-semibold text-white leading-tight">App Store</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-white/30 mt-1 text-center tracking-wider uppercase">Coming Soon</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-4 py-12 sm:py-20">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-wider">
                106+ FEATURES
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-xl mx-auto">
                122,000 lines of native Swift. 30 Apple frameworks. One powerful platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  icon: Bot,
                  title: 'On-Device AI Tutor',
                  points: ['Apple Intelligence powered', 'Runs entirely on-device', 'Data never leaves the phone'],
                  color: '#00BFFF',
                },
                {
                  icon: Eye,
                  title: 'AR Experiences',
                  points: ['8 subject categories', '4 experience types', 'Grade-level tagging'],
                  color: '#FFD700',
                },
                {
                  icon: Wrench,
                  title: '100+ Learning Tools',
                  points: ['Periodic Table', 'Fraction Builder', 'Geometry Explorer', 'Typing Tutor', 'and more'],
                  color: '#FF6B9D',
                },
                {
                  icon: WifiOff,
                  title: 'Offline Learning',
                  points: ['AES-GCM encrypted storage', '8 cached entity types', 'Auto sync on reconnect'],
                  color: '#34D399',
                },
                {
                  icon: GraduationCap,
                  title: 'Teacher Command Center',
                  points: ['Gradebook', 'NFC attendance', 'Plagiarism detection', 'Rubric builder', 'Live Activity'],
                  color: '#8B5CF6',
                },
                {
                  icon: Gamepad2,
                  title: 'Gamification & XP',
                  points: ['5 XP tiers', '10 badge types', 'Virtual aquarium', 'Study pet', 'Retro sound effects'],
                  color: '#FFD700',
                },
              ].map(({ icon: Icon, title, points, color }) => (
                <div
                  key={title}
                  className="bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 hover:border-gray-300 dark:hover:border-white/20 transition-all group"
                >
                  <div
                    className="inline-flex p-3 rounded-xl mb-4 border transition-colors"
                    style={{
                      backgroundColor: `${color}10`,
                      borderColor: `${color}30`,
                    }}
                  >
                    <Icon className="h-6 w-6" style={{ color }} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                  <ul className="space-y-1">
                    {points.map((pt) => (
                      <li key={pt} className="text-sm text-gray-600 dark:text-white/65 flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App Screenshots Section */}
        <section id="screenshots" className="px-4 py-12 sm:py-20">
          <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-wider">
                APP PREVIEW
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-xl mx-auto">
                Beautiful on every device. Built for iOS from day one.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
              {/* Screenshot 1 — Sign In */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-full max-w-[260px] aspect-[9/19.5] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30">
                  <Image
                    src="/screenshot-iphone-light.png"
                    alt="WolfWhale LMS Sign In on iPhone"
                    width={1170}
                    height={2532}
                    className="w-full h-full object-cover object-top"
                    priority
                  />
                </div>
                <p className="text-sm text-gray-900 dark:text-white/80 font-medium">Sign In</p>
              </div>

              {/* Screenshot 2 — My Courses (Light Mode) */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-full max-w-[260px] aspect-[9/19.5] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30">
                  <Image
                    src="/screenshot-courses-light.png"
                    alt="WolfWhale LMS My Courses on iPhone"
                    width={1170}
                    height={2532}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <p className="text-sm text-gray-900 dark:text-white/80 font-medium">My Courses</p>
              </div>

              {/* Screenshot 3 — Home Dashboard (Dark Mode) */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-full max-w-[260px] aspect-[9/19.5] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30">
                  <Image
                    src="/screenshot-home-dark.png"
                    alt="WolfWhale LMS Student Dashboard on iPhone"
                    width={1170}
                    height={2532}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <p className="text-sm text-gray-900 dark:text-white/80 font-medium">Student Dashboard</p>
              </div>
            </div>

            {/* Landscape Screenshots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 justify-items-center mt-10 sm:mt-14">
              {/* Landscape Screenshot 1 */}
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="w-full max-w-[400px] aspect-[19.5/9] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[1.5rem] overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30 flex items-center justify-center">
                  <p className="text-xs text-gray-400 dark:text-white/30 tracking-wider uppercase">Screenshot Coming Soon</p>
                </div>
                <p className="text-sm text-gray-900 dark:text-white/80 font-medium">Landscape View 1</p>
              </div>

              {/* Landscape Screenshot 2 */}
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="w-full max-w-[400px] aspect-[19.5/9] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[1.5rem] overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30 flex items-center justify-center">
                  <p className="text-xs text-gray-400 dark:text-white/30 tracking-wider uppercase">Screenshot Coming Soon</p>
                </div>
                <p className="text-sm text-gray-900 dark:text-white/80 font-medium">Landscape View 2</p>
              </div>
            </div>
          </div>
        </section>

        {/* LMS Comparison Section */}
        <section id="compare" className="px-4 py-12 sm:py-20">
          <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-wider">
                HOW WE COMPARE
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-xl mx-auto">
                See how WolfWhale stacks up against other learning management systems used in Canadian schools.
              </p>
            </div>

            {/* Comparison Table — scrollable on mobile */}
            <div className="bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  {/* Table Header */}
                  <div className="grid grid-cols-6 gap-0 text-center border-b border-gray-200 dark:border-white/10">
                    <div className="p-3 sm:p-4 text-left text-xs sm:text-sm font-bold text-gray-500 dark:text-white/60 uppercase tracking-wider">
                      Feature
                    </div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-normal text-[#8B5CF6] border-l border-gray-100 dark:border-white/5 bg-[#8B5CF6]/5 uppercase tracking-wider" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                      WolfWhale
                    </div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-gray-500 dark:text-white/60 border-l border-gray-100 dark:border-white/5">
                      Canvas
                    </div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-gray-500 dark:text-white/60 border-l border-gray-100 dark:border-white/5">
                      Brightspace
                    </div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-gray-500 dark:text-white/60 border-l border-gray-100 dark:border-white/5">
                      Edsby
                    </div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-gray-500 dark:text-white/60 border-l border-gray-100 dark:border-white/5">
                      Moodle
                    </div>
                  </div>

                  {/* Table Rows */}
                  {[
                    { feature: 'On-Device AI Tutor', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
                    { feature: '100+ Learning Tools', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: 'partial' },
                    { feature: 'AR Experiences', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
                    { feature: 'Offline Learning', wolfwhale: true, canvas: 'partial', brightspace: false, edsby: false, moodle: 'partial' },
                    { feature: 'Gamification & XP', wolfwhale: true, canvas: false, brightspace: false, edsby: 'partial', moodle: 'partial' },
                    { feature: 'Native iOS App', wolfwhale: true, canvas: true, brightspace: true, edsby: true, moodle: 'partial' },
                    { feature: 'Parent Portal', wolfwhale: true, canvas: 'partial', brightspace: 'partial', edsby: true, moodle: false },
                    { feature: 'Canadian Data Hosting', wolfwhale: true, canvas: false, brightspace: true, edsby: true, moodle: 'partial' },
                  ].map(({ feature, wolfwhale, canvas, brightspace, edsby, moodle }, idx) => (
                    <div
                      key={feature}
                      className={`grid grid-cols-6 gap-0 text-center ${idx % 2 === 0 ? 'bg-white/[0.02]' : ''} ${idx < 7 ? 'border-b border-gray-100 dark:border-white/5' : ''}`}
                    >
                      <div className="p-3 sm:p-4 text-left text-xs sm:text-sm text-gray-700 dark:text-white/80">
                        {feature}
                      </div>
                      {[wolfwhale, canvas, brightspace, edsby, moodle].map((val, i) => (
                        <div
                          key={i}
                          className={`p-3 sm:p-4 flex items-center justify-center border-l border-gray-100 dark:border-white/5 ${i === 0 ? 'bg-[#8B5CF6]/5' : ''}`}
                        >
                          {val === true ? (
                            <CheckCircle2 className={`h-4 w-4 sm:h-5 sm:w-5 ${i === 0 ? 'text-[#8B5CF6]' : 'text-emerald-600 dark:text-emerald-300'}`} />
                          ) : val === 'partial' ? (
                            <Minus className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 dark:text-yellow-300" />
                          ) : (
                            <XIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 dark:text-white/20" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-white/30 text-center py-2 sm:hidden">Swipe to see all competitors →</p>
            </div>

            <div className="text-center space-y-6">
              <p className="text-xs text-gray-400 dark:text-white/40">
                Comparison based on publicly available feature lists as of 2026. Partial (—) indicates limited or plugin-dependent support.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl btn-chrome-3d-dark text-white text-sm font-semibold"
              >
                Ready to switch?
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-4 py-12 sm:py-20">
          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-wider">
                SIMPLE PRICING
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-xl mx-auto">
                One plan. Everything included. No hidden fees.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 text-center space-y-6 relative overflow-hidden">
                {/* Accent glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 to-[#00BFFF]/5 pointer-events-none" />

                <div className="relative space-y-2">
                  <p className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-widest font-medium">Per User Account</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>$12</span>
                    <span className="text-lg text-gray-500 dark:text-white/50 font-medium">/ month</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-white/40">Minimum 1-year contract</p>
                </div>

                <div className="relative h-px bg-gray-200 dark:bg-white/10" />

                <ul className="relative space-y-3 text-left">
                  {[
                    'All 106+ features included',
                    'On-device AI tutor',
                    '100+ learning tools & AR',
                    'Offline learning & gamification',
                    'Canadian hosting (PIPEDA & FERPA)',
                    'Onboarding & priority support',
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-white/75">
                      <CheckCircle2 className="h-4 w-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="relative pt-2 space-y-3">
                  <a
                    href="#contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl btn-chrome-3d-dark text-white text-sm font-semibold"
                  >
                    Request a Demo
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <p className="text-xs text-gray-400 dark:text-white/40">
                    Volume discounts available for school boards and districts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="px-4 py-12 sm:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-[#8B5CF6]/5 rounded-2xl p-5 sm:p-8 md:p-12 space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-wider uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                About WolfWhale
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/75 leading-relaxed">
                Canadian edtech company building the most powerful native iOS LMS. 106+ features across 122K lines of Swift, deeply integrated with 30 Apple frameworks. Built for K-12, post-secondary, and training organizations with Canadian values — privacy, accessibility, and bilingual support.
              </p>
            </div>
          </div>
        </section>

        {/* Built in Canada Section */}
        <section id="canada" className="px-4 py-12 sm:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-[#8B5CF6]/5 rounded-2xl p-6 sm:p-10 md:p-14">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Flags */}
                <div className="shrink-0 flex flex-col items-center gap-4">
                  {/* Canadian Flag */}
                  <div className="rounded-lg overflow-hidden border border-white/10 shadow-lg">
                    <Image src="/canada-flag.png" alt="Canadian Flag" width={256} height={128} className="w-24 sm:w-32 h-auto" />
                  </div>
                  <span className="text-xs text-gray-400 dark:text-white/40 tracking-widest uppercase">Est. 2024</span>
                </div>

                <div className="space-y-4 sm:space-y-5 text-center md:text-left">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-wider uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                    Proudly Built in Canada
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 leading-relaxed">
                    Headquartered in Vancouver, BC. Designed, developed, and hosted entirely on Canadian soil.
                  </p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                    {[
                      { icon: Flag, label: 'Canadian Owned' },
                      { icon: Shield, label: 'PIPEDA Compliant' },
                      { icon: Globe, label: 'Hosted in Canada' },
                      { icon: Heart, label: 'Built for Canadians' },
                    ].map((badge, i) => (
                      <div
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-500 dark:text-white/60"
                      >
                        <badge.icon className="h-3 w-3 text-red-400" />
                        {badge.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRC Calls to Action Section */}
        <section id="trc" className="px-4 py-12 sm:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-amber-900/10 to-orange-900/5 backdrop-blur-xl border border-amber-500/10 rounded-2xl p-6 sm:p-10 md:p-14 space-y-6 sm:space-y-8">
              <div className="space-y-3 text-center">
                <div className="inline-flex p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mx-auto">
                  <Feather className="h-6 w-6 text-amber-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-wider uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                  Responding to the TRC Calls to Action
                </h2>
                <p className="text-sm sm:text-base text-gray-500 dark:text-white/60 max-w-2xl mx-auto">
                  Building a more equitable education system aligned with the TRC Calls to Action.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {[
                  {
                    icon: BookOpen,
                    title: 'Indigenous Language Support',
                    desc: 'Curriculum delivery in Indigenous languages (Calls #14-15)',
                  },
                  {
                    icon: Users,
                    title: 'Culturally Responsive Design',
                    desc: 'Flexible content respecting diverse knowledge systems (Calls #10, #62)',
                  },
                  {
                    icon: WifiOff,
                    title: 'Remote & Northern Access',
                    desc: 'Offline learning for equal access in remote communities (Calls #7-8)',
                  },
                  {
                    icon: Heart,
                    title: 'Partnership-Ready',
                    desc: 'Supporting Indigenous education authorities (Calls #9-12)',
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 sm:p-5"
                  >
                    <div className="inline-flex p-2 rounded-lg bg-amber-500/10 border border-amber-500/15 mb-3">
                      <Icon className="h-4 w-4 text-amber-400" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1.5">{title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-white/55 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              <div className="text-center pt-2">
                <a
                  href="https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/indigenous-people/aboriginal-peoples-documents/calls_to_action_english2.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-amber-400/80 hover:text-amber-400 transition-colors font-medium"
                >
                  Read the full TRC Calls to Action
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="px-4 py-12 sm:py-20">
          <div className="max-w-3xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-wider">
                FREQUENTLY ASKED QUESTIONS
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-xl mx-auto">
                Everything you need to know about WolfWhale LMS.
              </p>
            </div>

            <FAQAccordion
              sections={[
                {
                  id: 'top',
                  heading: '',
                  items: [
                    { q: 'How much does WolfWhale cost?', a: '$12/user/month with a 1-year contract. All features included, no hidden fees. Volume discounts available for school boards.' },
                    { q: 'Is there a free trial?', a: 'Yes — we offer a full-featured pilot program. Request a demo and we\'ll set your school up.' },
                    { q: 'Where is student data stored?', a: 'Exclusively on Canadian servers. PIPEDA & FERPA compliant. Data is never sold or shared. Encrypted with TLS 1.3 and AES-256.' },
                    { q: 'What about Android support?', a: 'WolfWhale is built exclusively for iOS using native SwiftUI. A web companion is planned for desktop access.' },
                  ],
                },
              ]}
            />

            {/* FAQ Schema for SEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  { "@type": "Question", "name": "How much does WolfWhale cost?", "acceptedAnswer": { "@type": "Answer", "text": "WolfWhale is $12 per user account per month, with a minimum 1-year contract." } },
                  { "@type": "Question", "name": "Where is student data stored?", "acceptedAnswer": { "@type": "Answer", "text": "All data is stored exclusively on Canadian servers." } },
                  { "@type": "Question", "name": "Is WolfWhale PIPEDA and FERPA compliant?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. WolfWhale is fully compliant with PIPEDA and FERPA." } },
                  { "@type": "Question", "name": "How long does onboarding take?", "acceptedAnswer": { "@type": "Answer", "text": "Most schools are fully onboarded within 2-4 weeks." } },
                  { "@type": "Question", "name": "Does offline learning really work?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Students can download courses for fully offline access." } },
                ]
              }) }}
            />
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="px-4 py-12 sm:py-20">
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-wider">
                GET IN TOUCH
              </h2>
              <p className="text-sm sm:text-base text-white/70 max-w-lg mx-auto">
                Interested in WolfWhale for your school or institution? Fill out the form below and we&apos;ll get back to you within 1-2 business days.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-8">
              <ContactForm />
            </div>

            <p className="text-center text-xs text-gray-400 dark:text-white/40">
              Or email us directly at{' '}
              <a href="mailto:info@wolfwhale.ca" className="text-[#00BFFF]/70 hover:text-[#00BFFF] transition-colors">
                info@wolfwhale.ca
              </a>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-px bg-gray-200 dark:bg-white/10 mb-6" />
          <div className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-normal text-gray-700 dark:text-white/70 uppercase tracking-wider" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>WolfWhale Inc.</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-white/60">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Vancouver, BC, Canada</span>
                  <a href="mailto:info@wolfwhale.ca" className="flex items-center gap-1 hover:text-[#00BFFF] transition-colors"><Mail className="h-3 w-3" /> info@wolfwhale.ca</a>
                  <a href="tel:+13069815926" className="flex items-center gap-1 hover:text-[#00BFFF] transition-colors"><Phone className="h-3 w-3" /> +1 (306) 981-5926</a>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex gap-6">
                  <Link href="/privacy" className="text-sm text-gray-500 dark:text-white/60 hover:text-[#00BFFF] transition-colors">
                    Privacy
                  </Link>
                  <Link href="/terms" className="text-sm text-gray-500 dark:text-white/60 hover:text-[#00BFFF] transition-colors">
                    Terms
                  </Link>
                  <Link href="/help" className="text-sm text-gray-500 dark:text-white/60 hover:text-[#00BFFF] transition-colors">
                    Help
                  </Link>
                  <Link href="/sign-in" className="text-sm text-gray-500 dark:text-white/60 hover:text-[#00BFFF] transition-colors">
                    Sign In
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <a href="https://linkedin.com/company/wolfwhale" target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-white/40 hover:text-[#00BFFF] transition-colors" aria-label="LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="https://x.com/wolfwhale" target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-white/40 hover:text-[#00BFFF] transition-colors" aria-label="X (Twitter)">
                    <Twitter className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-white/40">
              &copy; {new Date().getFullYear()} WolfWhale Learning Management System. All rights reserved. Canadian-built LMS for K-12 &amp; post-secondary schools.
            </p>
          </div>
        </div>
      </footer>

      {/* Animation keyframes */}
      <style>{`
        @keyframes ocean-pulse {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.3; }
          50% { transform: scale(1.1) translateY(-5%); opacity: 0.45; }
        }
        @keyframes ocean-drift {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(10%) scale(1.05); }
        }
        @keyframes ocean-wave-slow {
          0%, 100% { transform: translateX(0) translateY(0); }
          33% { transform: translateX(-5%) translateY(3%); }
          66% { transform: translateX(5%) translateY(-3%); }
        }
        @keyframes sunbeam-sway-1 {
          0%, 100% { transform: rotate(8deg) scaleX(1); opacity: 1; }
          25% { transform: rotate(5deg) scaleX(1.1); opacity: 0.8; }
          50% { transform: rotate(10deg) scaleX(0.9); opacity: 1; }
          75% { transform: rotate(6deg) scaleX(1.05); opacity: 0.85; }
        }
        @keyframes sunbeam-sway-2 {
          0%, 100% { transform: rotate(-3deg) scaleX(1); opacity: 1; }
          30% { transform: rotate(-6deg) scaleX(1.15); opacity: 0.9; }
          60% { transform: rotate(0deg) scaleX(0.85); opacity: 1; }
          80% { transform: rotate(-4deg) scaleX(1.05); opacity: 0.95; }
        }
        @keyframes sunbeam-sway-3 {
          0%, 100% { transform: rotate(5deg) scaleX(1); opacity: 1; }
          35% { transform: rotate(8deg) scaleX(0.9); opacity: 0.85; }
          65% { transform: rotate(3deg) scaleX(1.1); opacity: 1; }
        }
        @keyframes sunbeam-sway-5 {
          0%, 100% { transform: rotate(-6deg) scaleX(1); opacity: 1; }
          20% { transform: rotate(-3deg) scaleX(1.08); opacity: 0.85; }
          50% { transform: rotate(-8deg) scaleX(0.92); opacity: 1; }
          80% { transform: rotate(-5deg) scaleX(1.05); opacity: 0.9; }
        }
      `}</style>
    </div>
  )
}
