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
      {/* Ocean Background */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient — Midnight Blue to Deep Ocean */}
        <div className="absolute inset-0 wolf-gradient" />

        {/* Ambient ocean glow layers */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 150% 80% at 50% 20%, oklch(0.70 0.12 180 / 0.30) 0%, transparent 60%)',
            animation: 'ocean-pulse 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 120% 60% at 30% 30%, oklch(0.35 0.08 220 / 0.25) 0%, transparent 50%)',
            animation: 'ocean-drift 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background: 'radial-gradient(ellipse 100% 50% at 70% 25%, oklch(0.74 0.13 180 / 0.20) 0%, transparent 45%)',
            animation: 'ocean-wave-slow 15s ease-in-out infinite reverse',
          }}
        />

        {/* Subtle star dots */}
        {mounted && (
          <div className="absolute inset-0">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
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
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.15_0.04_262)] via-transparent to-transparent opacity-60" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <img src="/logo.png" alt="Wolf Whale" className="h-14 w-14 rounded-full object-cover shadow-lg" />
          <span className="text-xl font-bold text-white group-hover:text-[oklch(0.74_0.13_180)] transition-colors">
            Wolf Whale
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
        <div className="w-full max-w-4xl space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-8 animate-fade-in-up">
            {/* Logo */}
            <div className="inline-flex rounded-full shadow-2xl overflow-hidden">
              <img src="/logo.png" alt="Wolf Whale" className="h-36 w-36 rounded-full object-cover" />
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                Wolf Whale LMS
              </h1>
              <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto">
                The Modern Learning Platform for K-12 Schools
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[oklch(0.35_0.08_220)] to-[oklch(0.70_0.12_180)] text-white font-semibold hover:shadow-2xl hover:shadow-[oklch(0.70_0.12_180/0.30)] transition-all hover:scale-105"
              >
                Sign In
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/info"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/20 text-white font-semibold hover:border-[oklch(0.70_0.12_180)] hover:bg-white/5 transition-all"
              >
                Learn More
              </Link>
            </div>
          </section>

          {/* Feature Highlights */}
          <section className="grid md:grid-cols-3 gap-6 pt-8">
            {/* Feature 1 */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.30)] transition-all hover:scale-105 group">
              <div className="inline-flex p-3 rounded-xl bg-[oklch(0.70_0.12_180/0.20)] border border-[oklch(0.70_0.12_180/0.30)] mb-4 group-hover:bg-[oklch(0.70_0.12_180/0.30)] transition-colors">
                <GraduationCap className="h-6 w-6 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Built for K-12</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Age-appropriate interfaces for elementary, middle, and high school students with adaptive UI that grows with learners.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.30)] transition-all hover:scale-105 group">
              <div className="inline-flex p-3 rounded-xl bg-[oklch(0.70_0.12_180/0.20)] border border-[oklch(0.70_0.12_180/0.30)] mb-4 group-hover:bg-[oklch(0.70_0.12_180/0.30)] transition-colors">
                <Zap className="h-6 w-6 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-Time Everything</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Live messaging, instant notifications, and real-time collaboration keep students and teachers connected throughout the day.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.30)] transition-all hover:scale-105 group">
              <div className="inline-flex p-3 rounded-xl bg-[oklch(0.70_0.12_180/0.20)] border border-[oklch(0.70_0.12_180/0.30)] mb-4 group-hover:bg-[oklch(0.70_0.12_180/0.30)] transition-colors">
                <Shield className="h-6 w-6 text-[oklch(0.74_0.13_180)]" />
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
          <div className="h-px bg-white/10 mb-6" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/50">
              &copy; 2026 Wolf Whale LMS. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-white/50 hover:text-[oklch(0.74_0.13_180)] transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-white/50 hover:text-[oklch(0.74_0.13_180)] transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/help"
                className="text-sm text-white/50 hover:text-[oklch(0.74_0.13_180)] transition-colors"
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
