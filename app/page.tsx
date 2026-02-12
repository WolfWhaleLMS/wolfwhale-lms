'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { GraduationCap, Shield, Zap, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Aqua Neon Dark Background */}
      <div className="fixed inset-0 z-0">
        {/* Chrome texture base */}
        <div className="absolute inset-0">
          <img src="/chrome-bg-2.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
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

        {/* Floating bubble particles */}
        {mounted && (
          <div className="absolute inset-0">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-[#00BFFF] rounded-full animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 50}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.4 + 0.1,
                }}
              />
            ))}
          </div>
        )}

        {/* Depth overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#041428] via-transparent to-transparent opacity-60" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <img src="/logo.png" alt="WolfWhale" className="h-16 w-16 rounded-xl object-contain shadow-lg border-2 border-black" />
          <span className="text-xl font-display font-bold text-white group-hover:text-[#00BFFF] transition-colors tracking-wider uppercase">
            WolfWhale
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
        <div className="w-full max-w-4xl space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-8 animate-fade-in-up">
            {/* Logo */}
            <div className="inline-flex rounded-2xl shadow-2xl overflow-hidden chrome-shine">
              <img src="/logo.png" alt="WolfWhale" className="h-48 w-48 rounded-2xl object-contain border-2 border-black" />
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-[#00BFFF] to-[#33FF33] bg-clip-text text-transparent text-glow-blue tracking-wider">
                WOLF WHALE LMS
              </h1>
              <p className="text-xl md:text-2xl text-white/90 text-white-outlined max-w-2xl mx-auto">
                The Modern Learning Platform for K-12 & Post-Secondary
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#00BFFF] text-white font-semibold hover:shadow-[0_0_40px_rgba(0,191,255,0.5)] transition-all hover:scale-105 neon-glow-blue"
              >
                Sign In
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/info"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-[#00BFFF]/30 text-white font-semibold hover:border-[#00BFFF] hover:bg-[#00BFFF]/5 transition-all"
              >
                Learn More
              </Link>
            </div>
          </section>

          {/* Feature Highlights */}
          <section className="grid md:grid-cols-3 gap-6 pt-8">
            {/* Feature 1 */}
            <div className="ocean-card rounded-2xl p-6 group hover:neon-border-blue transition-all">
              <div className="inline-flex p-3 rounded-xl bg-[#00BFFF]/15 border border-[#00BFFF]/25 mb-4 group-hover:bg-[#00BFFF]/25 transition-colors">
                <GraduationCap className="h-6 w-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Built for K-12 & Post-Secondary</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Designed for elementary, middle, high school, and post-secondary students with adaptive UI that grows with learners.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="ocean-card rounded-2xl p-6 group hover:neon-border-blue transition-all">
              <div className="inline-flex p-3 rounded-xl bg-[#33FF33]/15 border border-[#33FF33]/25 mb-4 group-hover:bg-[#33FF33]/25 transition-colors">
                <Zap className="h-6 w-6 text-[#059669]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-Time Everything</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Live messaging, instant notifications, and real-time collaboration keep students and teachers connected throughout the day.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="ocean-card rounded-2xl p-6 group hover:neon-border-blue transition-all">
              <div className="inline-flex p-3 rounded-xl bg-[#00FFFF]/15 border border-[#00FFFF]/25 mb-4 group-hover:bg-[#00FFFF]/25 transition-colors">
                <Shield className="h-6 w-6 text-[#00FFFF]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Secure & Compliant</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                FERPA, COPPA, and PIPEDA compliant with enterprise-grade security, full audit logging, and role-based access control.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Divider */}
          <div className="h-px bg-[#00BFFF]/15 mb-6" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/50">
              &copy; 2026 WolfWhale LMS. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-white/50 hover:text-[#00BFFF] transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-white/50 hover:text-[#00BFFF] transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/help"
                className="text-sm text-white/50 hover:text-[#00BFFF] transition-colors"
              >
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Animation keyframes */}
      <style jsx>{`
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
      `}</style>
    </div>
  )
}
