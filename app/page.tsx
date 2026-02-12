import Link from 'next/link'
import Image from 'next/image'
import { GraduationCap, Brain, ArrowRight, Sparkles, BookOpen, Users, BarChart3, Shield, ShieldAlert, Eye, Radio, LineChart } from 'lucide-react'

export default function EdTechHubPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Aqua Neon Dark Background */}
      <div className="fixed inset-0 z-0">
        {/* Chrome texture base */}
        <div className="absolute inset-0">
          <Image src="/chrome-bg-2.jpg" alt="" fill className="object-cover opacity-30" priority />
        </div>
        {/* Base gradient — Deep dark aqua */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#041428]/90 via-[#0A2040]/85 to-[#041428]/90" />

        {/* Ambient neon glow layers */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 150% 80% at 50% 20%, rgba(0,191,255,0.25) 0%, transparent 60%)',
            animation: 'ocean-pulse 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 120% 60% at 30% 30%, rgba(51,255,51,0.15) 0%, transparent 50%)',
            animation: 'ocean-drift 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background: 'radial-gradient(ellipse 100% 50% at 70% 25%, rgba(0,255,255,0.15) 0%, transparent 45%)',
            animation: 'ocean-wave-slow 15s ease-in-out infinite reverse',
          }}
        />

        {/* Underwater sunbeam light rays */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {/* Beam 1 — Wide diffuse beam, center-left */}
          <div
            className="absolute sunbeam"
            style={{
              top: '-5%',
              left: '15%',
              width: '180px',
              height: '120%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(0,191,255,0.03) 40%, transparent 85%)',
              transform: 'rotate(8deg)',
              transformOrigin: 'top center',
              animation: 'sunbeam-sway-1 18s ease-in-out infinite',
              filter: 'blur(20px)',
            }}
          />
          {/* Beam 2 — Narrow bright beam, center */}
          <div
            className="absolute sunbeam"
            style={{
              top: '-5%',
              left: '40%',
              width: '90px',
              height: '110%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(0,255,255,0.04) 35%, transparent 75%)',
              transform: 'rotate(-3deg)',
              transformOrigin: 'top center',
              animation: 'sunbeam-sway-2 22s ease-in-out infinite',
              filter: 'blur(12px)',
            }}
          />
          {/* Beam 3 — Medium beam, right of center */}
          <div
            className="absolute sunbeam"
            style={{
              top: '-5%',
              left: '58%',
              width: '140px',
              height: '115%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(0,191,255,0.025) 45%, transparent 80%)',
              transform: 'rotate(5deg)',
              transformOrigin: 'top center',
              animation: 'sunbeam-sway-3 25s ease-in-out infinite',
              filter: 'blur(18px)',
            }}
          />
          {/* Beam 4 — Thin subtle beam, far left */}
          <div
            className="absolute sunbeam"
            style={{
              top: '-5%',
              left: '5%',
              width: '60px',
              height: '100%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,255,255,0.02) 30%, transparent 65%)',
              transform: 'rotate(12deg)',
              transformOrigin: 'top center',
              animation: 'sunbeam-sway-4 20s ease-in-out infinite',
              filter: 'blur(10px)',
            }}
          />
          {/* Beam 5 — Wide soft beam, far right */}
          <div
            className="absolute sunbeam"
            style={{
              top: '-5%',
              left: '78%',
              width: '200px',
              height: '120%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,191,255,0.02) 50%, transparent 90%)',
              transform: 'rotate(-6deg)',
              transformOrigin: 'top center',
              animation: 'sunbeam-sway-5 28s ease-in-out infinite',
              filter: 'blur(25px)',
            }}
          />
          {/* Beam 6 — Very narrow accent beam */}
          <div
            className="absolute sunbeam"
            style={{
              top: '-5%',
              left: '30%',
              width: '45px',
              height: '95%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(0,255,255,0.03) 25%, transparent 60%)',
              transform: 'rotate(-8deg)',
              transformOrigin: 'top center',
              animation: 'sunbeam-sway-6 15s ease-in-out infinite',
              filter: 'blur(8px)',
            }}
          />

          {/* Water surface caustic ripple pattern at top edge */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: '120px',
              background: `
                repeating-conic-gradient(
                  from 0deg at 50% 0%,
                  rgba(0,255,255,0.03) 0deg,
                  transparent 15deg,
                  rgba(255,255,255,0.04) 30deg,
                  transparent 45deg
                )
              `,
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
              animation: 'caustic-shimmer 8s ease-in-out infinite',
              filter: 'blur(6px)',
            }}
          />
          {/* Secondary caustic layer for more realism */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: '80px',
              background: `
                radial-gradient(ellipse 30% 50% at 20% 0%, rgba(0,191,255,0.06) 0%, transparent 70%),
                radial-gradient(ellipse 25% 40% at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 70%),
                radial-gradient(ellipse 35% 45% at 80% 0%, rgba(0,255,255,0.04) 0%, transparent 70%)
              `,
              animation: 'caustic-drift 12s ease-in-out infinite',
            }}
          />
        </div>

        {/* Floating bubble particles */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {[...Array(40)].map((_, i) => {
            // Determine if this bubble is near a sunbeam path for illumination effect
            const leftPos = (i * 2.5) % 100;
            const isNearBeam = (
              (leftPos > 12 && leftPos < 22) ||  // near beam 1
              (leftPos > 38 && leftPos < 45) ||  // near beam 2
              (leftPos > 55 && leftPos < 65) ||  // near beam 3
              (leftPos > 28 && leftPos < 34)     // near beam 6
            );
            const baseOpacity = (i % 4) * 0.1 + 0.1;
            return (
              <div
                key={i}
                className={`absolute rounded-full ${isNearBeam ? 'animate-twinkle-bright' : 'animate-twinkle'}`}
                style={{
                  left: `${leftPos}%`,
                  top: `${(i * 1.25) % 50}%`,
                  width: isNearBeam ? '2px' : '4px',
                  height: isNearBeam ? '2px' : '4px',
                  backgroundColor: isNearBeam ? '#00FFFF' : '#00BFFF',
                  boxShadow: isNearBeam ? '0 0 6px 2px rgba(0,255,255,0.4)' : 'none',
                  animationDelay: `${(i * 0.125) % 5}s`,
                  opacity: isNearBeam ? baseOpacity + 0.2 : baseOpacity,
                }}
              />
            );
          })}
        </div>

        {/* Depth overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#041428] via-transparent to-transparent opacity-60" />
      </div>

      {/* Header / Nav */}
      <header className="relative z-10 px-4 py-4 sm:p-6">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 sm:gap-3 group shrink-0">
            <Image src="/logo.png" alt="WolfWhale" width={40} height={40} className="rounded-xl object-contain shadow-lg border-2 border-black sm:w-12 sm:h-12" />
            <span className="text-sm sm:text-lg font-display font-bold text-white group-hover:text-[#00BFFF] transition-colors tracking-wider uppercase">
              WolfWhale EdTech
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-6">
            <a href="#products" className="text-sm text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
              Products
            </a>
            <a href="#about" className="text-sm text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
              About
            </a>
            <a href="#contact" className="text-sm text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
              Contact
            </a>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-chrome-3d-blue text-white text-sm font-semibold transition-all hover:scale-105"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile sign-in */}
          <Link
            href="/login"
            className="sm:hidden inline-flex items-center gap-2 px-3 py-2 rounded-xl btn-chrome-3d-blue text-white text-xs font-semibold"
          >
            Sign In
          </Link>
        </nav>

        {/* Mobile nav links */}
        <div className="flex sm:hidden items-center justify-center gap-4 mt-3">
          <a href="#products" className="text-xs text-white/70 hover:text-[#00BFFF] transition-colors font-medium">
            Products
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
            {/* Logo */}
            <div className="inline-flex rounded-2xl shadow-2xl overflow-hidden chrome-shine">
              <Image src="/logo.png" alt="WolfWhale EdTech" width={160} height={160} className="rounded-2xl object-contain border-2 border-black w-24 h-24 sm:w-40 sm:h-40" />
            </div>

            {/* Heading */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-[#00BFFF] via-[#00FFFF] to-[#33FF33] bg-clip-text text-transparent text-glow-blue tracking-wide sm:tracking-wider">
                WOLFWHALE EDTECH
              </h1>
              <p className="text-base sm:text-xl md:text-2xl text-white/90 text-white-outlined max-w-2xl mx-auto leading-relaxed">
                Building the future of education technology
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2 sm:pt-4">
              <a
                href="#products"
                className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-xl btn-chrome-3d-blue text-white text-sm sm:text-base font-semibold transition-all hover:scale-105 w-full sm:w-auto justify-center"
              >
                Explore Our Products
                <ArrowRight className="h-5 w-5" />
              </a>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-xl border-2 border-[#00BFFF]/30 text-white text-sm sm:text-base font-semibold hover:border-[#00BFFF] hover:bg-[#00BFFF]/5 transition-all w-full sm:w-auto justify-center"
              >
                Sign In to LMS
              </Link>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section id="products" className="px-4 py-12 sm:py-20">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white text-glow-blue tracking-wider">
                OUR PRODUCTS
              </h2>
              <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto">
                Education technology solutions designed to transform how students learn and educators teach.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {/* Product 1: WolfWhale LMS */}
              <div className="bg-[#0A1628]/85 backdrop-blur-xl border border-[#00BFFF]/20 shadow-xl rounded-2xl p-5 sm:p-8 group hover:neon-border-blue transition-all flex flex-col">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex p-3 rounded-xl bg-[#00BFFF]/15 border border-[#00BFFF]/25 group-hover:bg-[#00BFFF]/25 transition-colors">
                    <GraduationCap className="h-7 w-7 text-[#00BFFF]" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#33FF33]/20 text-[#33FF33] border border-[#33FF33]/30 neon-glow-green">
                    Live
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">WolfWhale LMS</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-5">
                  Canada&apos;s modern learning management system with built-in spaced repetition flashcards. Designed for K-12 and post-secondary education.
                </p>

                {/* Feature bullets */}
                <ul className="space-y-2 mb-6 flex-1">
                  {[
                    { icon: Sparkles, text: 'Spaced repetition flashcards' },
                    { icon: BookOpen, text: 'Interactive courses & quizzes' },
                    { icon: Users, text: 'Real-time collaboration' },
                    { icon: BarChart3, text: 'Analytics & grade tracking' },
                    { icon: Shield, text: 'FERPA & PIPEDA compliant' },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-2 text-white/75 text-sm">
                      <Icon className="h-4 w-4 text-[#00BFFF] shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Link
                    href="/info"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl btn-chrome-3d-silver text-sm font-semibold transition-all hover:scale-105"
                  >
                    Learn More
                  </Link>
                  <Link
                    href="/login"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl btn-chrome-3d-blue text-white text-sm font-semibold transition-all hover:scale-105"
                  >
                    Sign In
                  </Link>
                </div>
              </div>

              {/* Product 2: AI Consulting — Coming Soon */}
              <div className="bg-[#0A1628]/85 backdrop-blur-xl border border-[#00BFFF]/20 shadow-xl rounded-2xl p-5 sm:p-8 group transition-all opacity-70 flex flex-col">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex p-3 rounded-xl bg-[#A78BFA]/15 border border-[#A78BFA]/25">
                    <Brain className="h-7 w-7 text-[#A78BFA]" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#A78BFA]/20 text-[#A78BFA] border border-[#A78BFA]/30">
                    Coming Soon
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">AI Consulting</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-5">
                  Custom AI solutions for education institutions. From intelligent tutoring systems to automated assessment and curriculum optimization.
                </p>

                {/* Feature bullets */}
                <ul className="space-y-2 mb-6 flex-1">
                  {[
                    'AI-powered tutoring systems',
                    'Automated assessment tools',
                    'Curriculum optimization',
                    'Custom integrations',
                  ].map((text) => (
                    <li key={text} className="flex items-center gap-2 text-white/75 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#A78BFA]/50 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>

                {/* Disabled button */}
                <div className="flex gap-3">
                  <button
                    disabled
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/30 text-sm font-semibold cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>

              {/* Product 3: Cerebus — Coming Soon */}
              <div className="bg-[#0A1628]/85 backdrop-blur-xl border border-[#FF4444]/20 shadow-xl rounded-2xl p-5 sm:p-8 group transition-all opacity-70 flex flex-col">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex p-3 rounded-xl bg-[#FF4444]/15 border border-[#FF4444]/25">
                    <ShieldAlert className="h-7 w-7 text-[#FF4444]" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FF4444]/20 text-[#FF4444] border border-[#FF4444]/30">
                    Coming Soon
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">WolfWhale: Cerebus</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-5">
                  AI-powered surveillance and data security platform designed for First Nations reserves and bands. Combines intelligent monitoring with powerful data collection and visualization tools to protect community infrastructure and sovereignty.
                </p>

                {/* Feature bullets */}
                <ul className="space-y-2 mb-6 flex-1">
                  {[
                    { icon: Eye, text: 'AI surveillance & threat detection' },
                    { icon: Shield, text: 'Community data sovereignty tools' },
                    { icon: LineChart, text: 'Real-time data visualization dashboards' },
                    { icon: Radio, text: 'Secure infrastructure monitoring' },
                    { icon: BarChart3, text: 'Band council analytics & reporting' },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-2 text-white/75 text-sm">
                      <Icon className="h-4 w-4 text-[#FF4444] shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <div className="flex gap-3">
                  <Link
                    href="/cerebus"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF4444]/10 border border-[#FF4444]/25 text-[#FF4444] text-sm font-semibold hover:bg-[#FF4444]/20 transition-all hover:scale-105"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="px-4 py-12 sm:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#0A1628]/85 backdrop-blur-xl border border-[#00BFFF]/20 shadow-xl rounded-2xl p-5 sm:p-8 md:p-12 space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white text-glow-blue tracking-wider">
                ABOUT WOLFWHALE EDTECH
              </h2>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-white/80 leading-relaxed">
                <p>
                  WolfWhale EdTech is a Canadian education technology company on a mission to make powerful, accessible learning tools available to every student and educator.
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

        {/* Contact CTA */}
        <section id="contact" className="px-4 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white text-glow-blue tracking-wider">
              GET IN TOUCH
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-lg mx-auto">
              Interested in WolfWhale for your school or institution? We&apos;d love to hear from you.
            </p>
            <a
              href="mailto:contact@wolfwhale.ca"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl btn-chrome-3d-blue text-white font-semibold transition-all hover:scale-105"
            >
              contact@wolfwhale.ca
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-px bg-[#00BFFF]/15 mb-6" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/65">
              &copy; 2026 WolfWhale EdTech. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-white/65 hover:text-[#00BFFF] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-white/65 hover:text-[#00BFFF] transition-colors">
                Terms
              </Link>
              <Link href="/help" className="text-sm text-white/65 hover:text-[#00BFFF] transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Animation keyframes */}
      <style>{`
        @keyframes ocean-pulse {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.3; }
          50% { transform: scale(1.1) translateY(-5%); opacity: 0.4; }
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
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        @keyframes twinkle-bright {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.5); }
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
        @keyframes sunbeam-sway-4 {
          0%, 100% { transform: rotate(12deg) scaleX(1); opacity: 1; }
          40% { transform: rotate(9deg) scaleX(1.2); opacity: 0.7; }
          70% { transform: rotate(14deg) scaleX(0.85); opacity: 1; }
        }
        @keyframes sunbeam-sway-5 {
          0%, 100% { transform: rotate(-6deg) scaleX(1); opacity: 1; }
          20% { transform: rotate(-3deg) scaleX(1.08); opacity: 0.85; }
          50% { transform: rotate(-8deg) scaleX(0.92); opacity: 1; }
          80% { transform: rotate(-5deg) scaleX(1.05); opacity: 0.9; }
        }
        @keyframes sunbeam-sway-6 {
          0%, 100% { transform: rotate(-8deg) scaleX(1); opacity: 1; }
          50% { transform: rotate(-5deg) scaleX(1.3); opacity: 0.7; }
        }
        @keyframes caustic-shimmer {
          0%, 100% { transform: scaleX(1) translateX(0); opacity: 0.6; }
          25% { transform: scaleX(1.02) translateX(1%); opacity: 0.8; }
          50% { transform: scaleX(0.98) translateX(-1%); opacity: 0.5; }
          75% { transform: scaleX(1.01) translateX(0.5%); opacity: 0.7; }
        }
        @keyframes caustic-drift {
          0%, 100% { transform: translateX(0); opacity: 0.7; }
          33% { transform: translateX(3%); opacity: 0.9; }
          66% { transform: translateX(-2%); opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
