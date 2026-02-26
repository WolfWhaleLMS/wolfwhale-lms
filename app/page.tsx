import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Mail, Phone, MapPin, Brain, WifiOff, Gamepad2, Bot, Smartphone, CheckCircle2, X as XIcon, Minus, Paintbrush, Flag, Globe, Heart, Code, Palette, Layers, Accessibility, Zap, Linkedin, Twitter, ChevronDown, Feather, BookOpen, Users } from 'lucide-react'
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
      <header className="fixed top-0 left-0 right-0 z-50 px-3 py-2 sm:px-4 sm:py-3 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-white/5">
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
      <div className="h-[56px] sm:h-[64px]" />

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
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal text-gray-900 dark:text-white tracking-[0.03em] sm:tracking-[0.05em] uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" className="h-11 sm:h-12">
                  <rect width="120" height="40" rx="6" fill="#000" stroke="#333" strokeWidth="0.8" />
                  <g fill="#fff">
                    <path d="M24.77 20.3a4.95 4.95 0 0 1 2.36-4.15 5.07 5.07 0 0 0-3.99-2.16c-1.68-.18-3.31 1.01-4.17 1.01-.87 0-2.19-.99-3.61-.96a5.31 5.31 0 0 0-4.47 2.73c-1.93 3.34-.49 8.27 1.36 10.97.93 1.33 2.01 2.82 3.43 2.76 1.39-.06 1.91-.88 3.59-.88 1.67 0 2.15.88 3.6.85 1.49-.02 2.42-1.33 3.32-2.67a11 11 0 0 0 1.52-3.09 4.79 4.79 0 0 1-2.94-4.41zM22.04 12.21a4.87 4.87 0 0 0 1.12-3.49 4.96 4.96 0 0 0-3.21 1.66 4.64 4.64 0 0 0-1.15 3.36 4.1 4.1 0 0 0 3.24-1.53z" />
                    <text x="38" y="15" fontSize="7" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="400" letterSpacing="0.02em" fill="#fff">Download on the</text>
                    <text x="38" y="27" fontSize="12" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" letterSpacing="0.01em" fill="#fff">App Store</text>
                  </g>
                </svg>
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
                KEY FEATURES
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-xl mx-auto">
                Everything educators and students need — built into one powerful platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  icon: Brain,
                  title: 'Spaced Repetition',
                  desc: 'Built-in flashcard system using scientifically proven spaced repetition algorithms for long-term knowledge retention.',
                  color: '#8B5CF6',
                },
                {
                  icon: Bot,
                  title: 'AI Tutoring',
                  desc: 'Intelligent AI tutor that adapts to each student\'s learning pace, providing personalized explanations and feedback.',
                  color: '#00BFFF',
                },
                {
                  icon: WifiOff,
                  title: 'Offline Learning',
                  desc: 'Download courses and study materials for offline access. Perfect for students in areas with limited connectivity.',
                  color: '#33FF33',
                },
                {
                  icon: Gamepad2,
                  title: 'Gamification',
                  desc: 'Points, streaks, leaderboards, and achievements keep students motivated and engaged throughout their learning journey.',
                  color: '#FFD700',
                },
                {
                  icon: Shield,
                  title: 'Privacy First',
                  desc: 'FERPA and PIPEDA compliant. Student data is encrypted, stored in Canada, and never sold to third parties.',
                  color: '#00FFFF',
                },
                {
                  icon: Smartphone,
                  title: 'Native iOS App',
                  desc: 'Beautiful native iOS experience designed specifically for iPhone and iPad — not just a website wrapper.',
                  color: '#FF6B9D',
                },
              ].map(({ icon: Icon, title, desc, color }) => (
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
                  <p className="text-sm text-gray-600 dark:text-white/65 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof / Trust Section */}
        <section id="trust" className="px-4 py-12 sm:py-20">
          <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-wider">
                BUILT FOR EDUCATORS
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-xl mx-auto">
                Pilot program launching 2025 — we&apos;re partnering with forward-thinking schools across Canada.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { stat: 'K-12 & Post-Secondary', label: 'Designed for all levels of education' },
                { stat: 'Canadian Hosted', label: 'All data stays on Canadian soil' },
                { stat: '$12 / User / Month', label: 'Simple, transparent pricing' },
              ].map(({ stat, label }) => (
                <div
                  key={stat}
                  className="bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 text-center"
                >
                  <p className="text-lg sm:text-xl font-bold text-[#00BFFF] mb-1">{stat}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-white/60">{label}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl btn-chrome-3d-dark text-white text-sm font-semibold"
              >
                Join the Pilot Program
                <ArrowRight className="h-4 w-4" />
              </a>
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
                <p className="text-sm text-gray-500 dark:text-white/60 font-medium">Sign In</p>
              </div>

              {/* Screenshot 2 — Placeholder */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-full max-w-[260px] aspect-[9/19.5] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30 flex items-center justify-center">
                  <div className="text-center p-6 space-y-3">
                    <Smartphone className="h-12 w-12 text-gray-300 dark:text-white/20 mx-auto" />
                    <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider">Courses</p>
                    <p className="text-[10px] text-gray-300 dark:text-white/20">Screenshot coming soon</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-white/60 font-medium">Course Browser</p>
              </div>

              {/* Screenshot 3 — Placeholder for future screenshot */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-full max-w-[260px] aspect-[9/19.5] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30 flex items-center justify-center">
                  <div className="text-center p-6 space-y-3">
                    <Smartphone className="h-12 w-12 text-gray-300 dark:text-white/20 mx-auto" />
                    <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider">Dashboard</p>
                    <p className="text-[10px] text-gray-300 dark:text-white/20">Screenshot coming soon</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-white/60 font-medium">Student Dashboard</p>
              </div>
            </div>
          </div>
        </section>

        {/* Built by Design Section */}
        <section id="design" className="px-4 py-12 sm:py-20">
          <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-gray-900 dark:text-white tracking-wider uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Built by Design
              </h2>
              <p className="text-sm sm:text-base text-gray-500 dark:text-white/60 max-w-2xl mx-auto">
                Every pixel, interaction, and feature is intentional. WolfWhale is crafted with obsessive attention to detail — not assembled from templates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { icon: Palette, title: 'Design-First Approach', desc: 'Interface designed from the ground up for clarity and focus. No clutter, no distractions — just learning.' },
                { icon: Layers, title: 'Consistent Experience', desc: 'Unified design language across iOS, web, and tablet. Learn anywhere with the same intuitive interface.' },
                { icon: Zap, title: 'Performance Obsessed', desc: 'Sub-second load times and instant interactions. Built on modern architecture that never makes you wait.' },
                { icon: Accessibility, title: 'Accessible to All', desc: 'WCAG compliant, screen reader compatible, and designed for every learner regardless of ability.' },
                { icon: Code, title: 'Native, Not Wrapped', desc: 'True native iOS app — not a web wrapper. Built with platform-specific APIs for the best possible experience.' },
                { icon: Paintbrush, title: 'Refined Aesthetics', desc: 'Dark mode by default. Thoughtful typography, spacing, and motion that makes learning feel premium.' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 hover:border-[#8B5CF6]/30 hover:shadow-lg hover:shadow-[#8B5CF6]/10 transition-all"
                >
                  <div className="inline-flex p-2.5 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 mb-4">
                    <item.icon className="h-5 w-5 text-[#8B5CF6]" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-white/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
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
                  <div className="grid grid-cols-6 gap-0 text-center border-b border-white/10">
                    <div className="p-3 sm:p-4 text-left text-xs sm:text-sm font-bold text-white/60 uppercase tracking-wider">
                      Feature
                    </div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-normal text-[#8B5CF6] border-l border-gray-100 dark:border-white/5 bg-[#8B5CF6]/5 uppercase tracking-wider" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                      WolfWhale
                    </div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-white/60 border-l border-gray-100 dark:border-white/5">
                      Canvas
                    </div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-white/60 border-l border-gray-100 dark:border-white/5">
                      Brightspace
                    </div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-white/60 border-l border-gray-100 dark:border-white/5">
                      Edsby
                    </div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-white/60 border-l border-gray-100 dark:border-white/5">
                      Moodle
                    </div>
                  </div>

                  {/* Table Rows */}
                  {[
                    { feature: 'Spaced Repetition Flashcards', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
                    { feature: 'AI Tutoring', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
                    { feature: 'Offline Learning', wolfwhale: true, canvas: 'partial', brightspace: false, edsby: false, moodle: 'partial' },
                    { feature: 'Native iOS App', wolfwhale: true, canvas: true, brightspace: true, edsby: true, moodle: 'partial' },
                    { feature: 'Gamification & Streaks', wolfwhale: true, canvas: false, brightspace: false, edsby: 'partial', moodle: 'partial' },
                    { feature: 'Canadian Data Hosting', wolfwhale: true, canvas: false, brightspace: true, edsby: true, moodle: 'partial' },
                    { feature: 'PIPEDA Compliant', wolfwhale: true, canvas: 'partial', brightspace: true, edsby: true, moodle: 'partial' },
                    { feature: 'Built-in Quiz Builder', wolfwhale: true, canvas: true, brightspace: true, edsby: true, moodle: true },
                    { feature: 'Real-time Collaboration', wolfwhale: true, canvas: true, brightspace: 'partial', edsby: 'partial', moodle: false },
                    { feature: 'Transparent Per-User Pricing', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: true },
                  ].map(({ feature, wolfwhale, canvas, brightspace, edsby, moodle }, idx) => (
                    <div
                      key={feature}
                      className={`grid grid-cols-6 gap-0 text-center ${idx % 2 === 0 ? 'bg-white/[0.02]' : ''} ${idx < 9 ? 'border-b border-gray-100 dark:border-white/5' : ''}`}
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
                            <CheckCircle2 className={`h-4 w-4 sm:h-5 sm:w-5 ${i === 0 ? 'text-[#8B5CF6]' : 'text-green-400/70'}`} />
                          ) : val === 'partial' ? (
                            <Minus className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400/60" />
                          ) : (
                            <XIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white/20" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-white/30 text-center py-2 sm:hidden">Swipe to see all competitors →</p>
            </div>

            <div className="text-center space-y-6">
              <p className="text-xs text-gray-400 dark:text-white/40">
                Comparison based on publicly available feature lists as of 2025. Partial (—) indicates limited or plugin-dependent support.
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
                    'Unlimited courses & content',
                    'Spaced repetition flashcards',
                    'AI tutoring for every student',
                    'Offline learning & sync',
                    'Gamification & leaderboards',
                    'Built-in quiz builder',
                    'Canadian data hosting',
                    'PIPEDA & FERPA compliant',
                    'Onboarding & teacher training',
                    'Email support (24hr response)',
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
              <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-900 dark:text-white tracking-wider uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                About WolfWhale
              </h2>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600 dark:text-white/75 leading-relaxed">
                <p>
                  WolfWhale is a Canadian education technology company on a mission to make powerful, accessible learning tools available to every student and educator.
                </p>
                <p>
                  Our flagship product, WolfWhale LMS, is the only learning management system with spaced repetition technology built in — giving students a scientifically proven advantage in long-term knowledge retention. We serve K-12 schools, post-secondary institutions, and training organizations across Canada.
                </p>
                <p>
                  We believe technology should amplify great teaching, not replace it. Every product we build is designed with educators and learners at the center.
                </p>
              </div>
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
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-gray-900 dark:text-white tracking-wider uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                    Proudly Built in Canada
                  </h2>
                  <div className="space-y-3 text-sm sm:text-base text-gray-600 dark:text-white/70 leading-relaxed">
                    <p>
                      WolfWhale is a Canadian company headquartered in Vancouver, BC. Our team designs, develops, and hosts everything on Canadian soil.
                    </p>
                    <p>
                      We believe Canadian students and educators deserve world-class tools built with Canadian values — privacy, accessibility, and bilingual support at the core.
                    </p>
                  </div>

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
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-gray-900 dark:text-white tracking-wider uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                  Responding to the TRC Calls to Action
                </h2>
                <p className="text-sm sm:text-base text-gray-500 dark:text-white/60 max-w-2xl mx-auto">
                  The Truth and Reconciliation Commission&apos;s Calls to Action challenge all Canadians to build a more equitable education system. WolfWhale is designed with these commitments in mind.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {[
                  {
                    icon: BookOpen,
                    title: 'Indigenous Language Support',
                    desc: 'Our platform supports curriculum delivery in Indigenous languages, responding to Calls #14-15 which call for preserving and revitalizing Indigenous languages through education.',
                  },
                  {
                    icon: Users,
                    title: 'Culturally Responsive Design',
                    desc: 'Built to support culturally appropriate curricula as called for in Calls #10 and #62, with flexible content frameworks that respect diverse knowledge systems.',
                  },
                  {
                    icon: WifiOff,
                    title: 'Remote & Northern Access',
                    desc: 'Offline learning ensures students in remote and northern communities have equal access to education, addressing the equity gaps highlighted in Calls #7-8.',
                  },
                  {
                    icon: Heart,
                    title: 'Partnership-Ready',
                    desc: 'Designed to support partnerships with Indigenous education authorities and communities, aligned with Calls #9-12 on Indigenous control of Indigenous education.',
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
                  id: 'pricing',
                  heading: 'Pricing & Plans',
                  items: [
                    { q: 'How much does WolfWhale cost?', a: 'WolfWhale is $12 per user account per month, with a minimum 1-year contract. This includes all features — spaced repetition flashcards, AI tutoring, offline learning, gamification, and more. No hidden fees.' },
                    { q: 'Are there volume discounts?', a: 'Yes. School boards and districts with large deployments qualify for volume pricing. Contact us for a custom quote tailored to your institution.' },
                    { q: 'Is there a free trial?', a: 'Yes — we offer a full-featured pilot program so your school can evaluate WolfWhale before committing. Request a demo and we\'ll set you up.' },
                    { q: 'Are there any hidden fees?', a: 'No. Your license includes all features, updates, Canadian hosting, and standard support. There are no add-on charges for core functionality.' },
                  ],
                },
                {
                  id: 'privacy',
                  heading: 'Data & Privacy',
                  items: [
                    { q: 'Where is student data stored?', a: 'All data is stored exclusively on Canadian servers. We never transfer student data outside of Canada.' },
                    { q: 'Is WolfWhale PIPEDA and FERPA compliant?', a: 'Yes. WolfWhale is fully compliant with PIPEDA (Canada\'s federal privacy law) and FERPA (U.S. student privacy standards). We undergo regular privacy audits.' },
                    { q: 'Do you sell student data to third parties?', a: 'Absolutely not. Student data is never sold, shared, or used for advertising. Period. Your data belongs to you.' },
                    { q: 'How is data encrypted?', a: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We follow industry best practices for data security and access controls.' },
                  ],
                },
                {
                  id: 'getting-started',
                  heading: 'Getting Started',
                  items: [
                    { q: 'How long does onboarding take?', a: 'Most schools are fully onboarded within 2-4 weeks, including teacher training and content migration. Our team handles the heavy lifting.' },
                    { q: 'Do you provide training for teachers?', a: 'Yes. Every license includes onboarding training sessions for educators. We also provide ongoing support documentation and video tutorials.' },
                    { q: 'Can we migrate from our existing LMS?', a: 'Yes. We support migration from Canvas, Brightspace, Moodle, and other major platforms. Our team will help transfer your courses and data.' },
                    { q: 'What support is available?', a: 'All institutions get email support with a 24-hour response time. Priority support with a dedicated account manager is available on enterprise plans.' },
                  ],
                },
                {
                  id: 'technical',
                  heading: 'Technical',
                  items: [
                    { q: 'Does offline learning really work?', a: 'Yes. Students can download courses and study materials to their device for fully offline access. Progress syncs automatically when they reconnect.' },
                    { q: 'What browsers are supported?', a: 'WolfWhale works on all modern browsers — Chrome, Safari, Firefox, and Edge. Our native iOS app is available for iPhone and iPad.' },
                    { q: 'Is there an API for integrations?', a: 'Yes. We provide a REST API for integrating WolfWhale with your existing school systems, SIS platforms, and other tools.' },
                    { q: 'What about Android support?', a: 'Our web app works great on Android devices through the browser. A dedicated Android app is on our roadmap.' },
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
