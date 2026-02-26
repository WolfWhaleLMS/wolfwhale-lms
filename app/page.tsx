import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Mail, Phone, MapPin, Brain, WifiOff, Gamepad2, Bot, Smartphone, Monitor, Tablet, CheckCircle2, X as XIcon, Minus, Paintbrush, Flag, Globe, Heart, Code, Palette, Layers, Accessibility, Zap } from 'lucide-react'
import { GlowingLogo } from '@/components/ui/glowing-logo'

export default function LMSHubPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#000000' }}>
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
      {/* Dark Background with subtle neon glows */}
      <div className="fixed inset-0 z-0">
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

        {/* Floating sparkle particles — bright neon on black */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {[...Array(40)].map((_, i) => {
            const leftPos = (i * 2.5) % 100;
            const isNearBeam = (
              (leftPos > 12 && leftPos < 22) ||
              (leftPos > 38 && leftPos < 45) ||
              (leftPos > 55 && leftPos < 65) ||
              (leftPos > 28 && leftPos < 34)
            );
            const baseOpacity = (i % 4) * 0.08 + 0.12;
            return (
              <div
                key={i}
                className={`absolute rounded-full ${isNearBeam ? 'animate-twinkle-bright' : 'animate-twinkle'}`}
                style={{
                  left: `${leftPos}%`,
                  top: `${(i * 1.25) % 50}%`,
                  width: isNearBeam ? '2px' : '3px',
                  height: isNearBeam ? '2px' : '3px',
                  backgroundColor: isNearBeam ? '#8B5CF6' : '#00BFFF',
                  boxShadow: isNearBeam ? '0 0 8px 2px rgba(139,92,246,0.4)' : '0 0 6px 2px rgba(0,191,255,0.3)',
                  animationDelay: `${(i * 0.125) % 5}s`,
                  opacity: isNearBeam ? baseOpacity + 0.15 : baseOpacity,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Header / Nav */}
      <header className="relative z-10 px-4 py-4 sm:px-6 sm:py-5">
        <nav className="flex items-center justify-between">
          <Link href="/" className="inline-flex flex-col group shrink-0">
            <span className="text-sm sm:text-lg font-bold text-white group-hover:text-[#00BFFF] transition-colors tracking-normal uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
              WolfWhale
            </span>
            <span className="text-[9px] sm:text-xs text-white/60 tracking-[0.15em] uppercase font-medium -mt-0.5">
              Learning Management System
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-6">
            <a href="#features" className="text-sm text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
              Features
            </a>
            <a href="#compare" className="text-sm text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
              Compare
            </a>
            <a href="#about" className="text-sm text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
              About
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-chrome-3d-dark text-white text-sm font-semibold"
            >
              Contact
            </a>
          </div>

          {/* Mobile CTA */}
          <a
            href="#contact"
            className="sm:hidden inline-flex items-center gap-2 px-3 py-2 rounded-xl btn-chrome-3d-dark text-white text-xs font-semibold"
          >
            Contact
          </a>
        </nav>

        {/* Mobile nav links */}
        <div className="flex sm:hidden items-center justify-center gap-4 mt-3">
          <a href="#features" className="text-xs text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
            Features
          </a>
          <a href="#compare" className="text-xs text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
            Compare
          </a>
          <a href="#about" className="text-xs text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
            About
          </a>
          <a href="#contact" className="text-xs text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
            Contact
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="flex items-center justify-center min-h-[60vh] sm:min-h-[calc(100vh-200px)] px-4 py-10 sm:py-16">
          <div className="w-full max-w-5xl text-center space-y-6 sm:space-y-8 animate-fade-in-up">
            {/* Logo app tile */}
            <div className="mb-16 sm:mb-24">
              <GlowingLogo size={96} className="sm:hidden" />
              <GlowingLogo size={160} className="hidden sm:inline-flex" />
            </div>

            {/* Heading — relative z-10 so glow renders BEHIND the text */}
            <div className="relative z-10 space-y-1 sm:space-y-2">
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal text-white tracking-[0.03em] sm:tracking-[0.05em] uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                WolfWhale
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-white/70 tracking-[0.25em] uppercase font-normal">
                Learning Management System
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="relative z-10 flex flex-col items-center gap-4 pt-4 sm:pt-6">
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-3.5 sm:px-10 sm:py-4 rounded-xl btn-chrome-3d-dark text-white text-sm sm:text-base font-semibold"
              >
                Product Features
                <ArrowRight className="h-5 w-5" />
              </a>
              {/* App Store Badge */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 opacity-90 hover:opacity-100 transition-opacity"
                aria-label="Download on the App Store"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" className="h-14 sm:h-16">
                  <rect width="120" height="40" rx="6" fill="#000" stroke="#fff" strokeWidth="0.8" />
                  <g fill="#fff">
                    <path d="M24.77 20.3a4.95 4.95 0 0 1 2.36-4.15 5.07 5.07 0 0 0-3.99-2.16c-1.68-.18-3.31 1.01-4.17 1.01-.87 0-2.19-.99-3.61-.96a5.31 5.31 0 0 0-4.47 2.73c-1.93 3.34-.49 8.27 1.36 10.97.93 1.33 2.01 2.82 3.43 2.76 1.39-.06 1.91-.88 3.59-.88 1.67 0 2.15.88 3.6.85 1.49-.02 2.42-1.33 3.32-2.67a11 11 0 0 0 1.52-3.09 4.79 4.79 0 0 1-2.94-4.41zM22.04 12.21a4.87 4.87 0 0 0 1.12-3.49 4.96 4.96 0 0 0-3.21 1.66 4.64 4.64 0 0 0-1.15 3.36 4.1 4.1 0 0 0 3.24-1.53z" />
                    <text x="38" y="15" fontSize="7" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="400" letterSpacing="0.02em" fill="#fff">Download on the</text>
                    <text x="38" y="27" fontSize="12" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" letterSpacing="0.01em" fill="#fff">App Store</text>
                  </g>
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-4 py-12 sm:py-20">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-wider">
                KEY FEATURES
              </h2>
              <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto">
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
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-white/20 transition-all group"
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
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/65 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App Screenshots Section */}
        <section id="screenshots" className="px-4 py-12 sm:py-20">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-wider">
                APP PREVIEW
              </h2>
              <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto">
                See WolfWhale LMS in action across all your devices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Screenshot 1 — Mobile */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-full aspect-[9/16] max-w-[280px] bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex items-center justify-center">
                  {/* Replace src with actual screenshot */}
                  <div className="text-center p-6 space-y-3">
                    <Smartphone className="h-12 w-12 text-white/20 mx-auto" />
                    <p className="text-xs text-white/30 uppercase tracking-wider">Mobile View</p>
                    <p className="text-[10px] text-white/20">Screenshot coming soon</p>
                  </div>
                </div>
                <p className="text-sm text-white/60 font-medium">iPhone</p>
              </div>

              {/* Screenshot 2 — Tablet */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-full aspect-[3/4] max-w-[360px] bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex items-center justify-center">
                  <div className="text-center p-6 space-y-3">
                    <Tablet className="h-12 w-12 text-white/20 mx-auto" />
                    <p className="text-xs text-white/30 uppercase tracking-wider">Tablet View</p>
                    <p className="text-[10px] text-white/20">Screenshot coming soon</p>
                  </div>
                </div>
                <p className="text-sm text-white/60 font-medium">iPad</p>
              </div>

              {/* Screenshot 3 — Desktop */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-full aspect-[16/10] bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center">
                  <div className="text-center p-6 space-y-3">
                    <Monitor className="h-12 w-12 text-white/20 mx-auto" />
                    <p className="text-xs text-white/30 uppercase tracking-wider">Desktop View</p>
                    <p className="text-[10px] text-white/20">Screenshot coming soon</p>
                  </div>
                </div>
                <p className="text-sm text-white/60 font-medium">Web Dashboard</p>
              </div>
            </div>
          </div>
        </section>

        {/* Built by Design Section */}
        <section id="design" className="px-4 py-12 sm:py-20">
          <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-white tracking-wider uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Built by Design
              </h2>
              <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto">
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
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-[#8B5CF6]/30 hover:shadow-lg hover:shadow-[#8B5CF6]/10 transition-all"
                >
                  <div className="inline-flex p-2.5 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 mb-4">
                    <item.icon className="h-5 w-5 text-[#8B5CF6]" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LMS Comparison Section */}
        <section id="compare" className="px-4 py-12 sm:py-20">
          <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-wider">
                HOW WE COMPARE
              </h2>
              <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto">
                See how WolfWhale stacks up against other learning management systems used in Canadian schools.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-6 gap-0 text-center border-b border-white/10">
                <div className="p-3 sm:p-4 text-left text-xs sm:text-sm font-bold text-white/60 uppercase tracking-wider">
                  Feature
                </div>
                <div className="p-3 sm:p-4 text-xs sm:text-sm font-normal text-[#8B5CF6] border-l border-white/5 bg-[#8B5CF6]/5 uppercase tracking-wider" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                  WolfWhale
                </div>
                <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-white/60 border-l border-white/5">
                  Canvas
                </div>
                <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-white/60 border-l border-white/5">
                  Brightspace
                </div>
                <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-white/60 border-l border-white/5">
                  Edsby
                </div>
                <div className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-white/60 border-l border-white/5">
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
                { feature: 'Free for Students', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: true },
              ].map(({ feature, wolfwhale, canvas, brightspace, edsby, moodle }, idx) => (
                <div
                  key={feature}
                  className={`grid grid-cols-6 gap-0 text-center ${idx % 2 === 0 ? 'bg-white/[0.02]' : ''} ${idx < 9 ? 'border-b border-white/5' : ''}`}
                >
                  <div className="p-3 sm:p-4 text-left text-xs sm:text-sm text-white/80">
                    {feature}
                  </div>
                  {[wolfwhale, canvas, brightspace, edsby, moodle].map((val, i) => (
                    <div
                      key={i}
                      className={`p-3 sm:p-4 flex items-center justify-center border-l border-white/5 ${i === 0 ? 'bg-[#8B5CF6]/5' : ''}`}
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

            <div className="text-center">
              <p className="text-xs text-white/40">
                Comparison based on publicly available feature lists as of 2025. Partial (—) indicates limited or plugin-dependent support.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="px-4 py-12 sm:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-[#8B5CF6]/5 rounded-2xl p-5 sm:p-8 md:p-12 space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-white tracking-wider uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                About WolfWhale
              </h2>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-white/75 leading-relaxed">
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
                  {/* Treaty 6 Territory Flag */}
                  <div className="rounded-lg overflow-hidden border border-white/10 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 120" className="w-24 sm:w-32 h-auto">
                      <rect width="240" height="120" fill="#1a3a6b"/>
                      {/* Sun / Circle of Treaty */}
                      <circle cx="120" cy="60" r="30" fill="#FFD700" opacity="0.9"/>
                      <circle cx="120" cy="60" r="22" fill="#1a3a6b"/>
                      <circle cx="120" cy="60" r="18" fill="#FFD700" opacity="0.3"/>
                      {/* Four directions */}
                      <rect x="116" y="20" width="8" height="16" rx="2" fill="#FFD700" opacity="0.7"/>
                      <rect x="116" y="84" width="8" height="16" rx="2" fill="#FFD700" opacity="0.7"/>
                      <rect x="80" y="56" width="16" height="8" rx="2" fill="#FFD700" opacity="0.7"/>
                      <rect x="144" y="56" width="16" height="8" rx="2" fill="#FFD700" opacity="0.7"/>
                      {/* Text */}
                      <text x="120" y="112" textAnchor="middle" fontSize="8" fill="#FFD700" fontFamily="system-ui, sans-serif" letterSpacing="0.1em" opacity="0.8">TREATY 6 TERRITORY</text>
                    </svg>
                  </div>
                  <span className="text-xs text-white/40 tracking-widest uppercase">Est. 2024</span>
                </div>

                <div className="space-y-4 sm:space-y-5 text-center md:text-left">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-white tracking-wider uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                    Proudly Built in Canada
                  </h2>
                  <div className="space-y-3 text-sm sm:text-base text-white/70 leading-relaxed">
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60"
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

        {/* Contact CTA */}
        <section id="contact" className="px-4 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-wider">
              GET IN TOUCH
            </h2>
            <p className="text-sm sm:text-base text-white/70 max-w-lg mx-auto">
              Interested in WolfWhale for your school or institution? We&apos;d love to hear from you.
            </p>
            <a
              href="mailto:info@wolfwhale.ca"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl btn-chrome-3d-dark text-white font-semibold"
            >
              <Mail className="h-5 w-5" />
              info@wolfwhale.ca
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-px bg-white/10 mb-6" />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-normal text-white/70 uppercase tracking-wider" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>WolfWhale Inc.</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Vancouver, BC, Canada</span>
                  <a href="mailto:info@wolfwhale.ca" className="flex items-center gap-1 hover:text-[#00BFFF] transition-colors"><Mail className="h-3 w-3" /> info@wolfwhale.ca</a>
                  <a href="tel:+13069815926" className="flex items-center gap-1 hover:text-[#00BFFF] transition-colors"><Phone className="h-3 w-3" /> +1 (306) 981-5926</a>
                </div>
              </div>
              <div className="flex gap-6">
                <Link href="/privacy" className="text-sm text-white/60 hover:text-[#00BFFF] transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-sm text-white/60 hover:text-[#00BFFF] transition-colors">
                  Terms
                </Link>
                <Link href="/help" className="text-sm text-white/60 hover:text-[#00BFFF] transition-colors">
                  Help
                </Link>
              </div>
            </div>
            <p className="text-xs text-white/40">
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
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        @keyframes twinkle-bright {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.5); }
        }
        .animate-twinkle-bright {
          animation: twinkle-bright 2.5s ease-in-out infinite;
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
