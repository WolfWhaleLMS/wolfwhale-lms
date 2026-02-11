'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import { GraduationCap, Shield, Users, ArrowRight } from 'lucide-react'

function LoginFormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-[#1a2a4e]/10 rounded-lg" />
      <div className="h-10 bg-[#1a2a4e]/10 rounded-lg" />
      <div className="h-12 bg-[#1a2a4e]/10 rounded-lg" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="space-y-6">
      {/* EVA-style Title */}
      <div className="text-center space-y-2 mb-2">
        <h1 className="leading-none">
          <span
            className="block text-5xl sm:text-6xl font-extrabold tracking-tight text-[#1a2a4e]"
            style={{
              fontFamily: "'Shippori Mincho B1', Georgia, 'Times New Roman', serif",
              fontWeight: 800,
              letterSpacing: '0.15em',
            }}
          >
            WOLF
          </span>
          <span
            className="block text-5xl sm:text-6xl font-extrabold tracking-tight text-[#1a2a4e]"
            style={{
              fontFamily: "'Shippori Mincho B1', Georgia, 'Times New Roman', serif",
              fontWeight: 800,
              letterSpacing: '0.02em',
            }}
          >
            WHALE
          </span>
        </h1>
        <p
          className="text-sm sm:text-base tracking-[0.2em] uppercase text-[#0a4d68] font-bold"
          style={{
            fontFamily: "'Shippori Mincho B1', Georgia, 'Times New Roman', serif",
            fontWeight: 800,
          }}
        >
          Learning Management System
        </p>
      </div>

      {/* Learn More — BIG button near the top */}
      <Link
        href="/info"
        className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#1a2a4e] to-[#0a4d68] text-white font-semibold text-lg shadow-lg hover:shadow-[0_0_30px_oklch(0.70_0.12_180/0.4)] hover:scale-[1.02] transition-all group btn-glow"
      >
        <span>Learn More About Wolf Whale LMS</span>
        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Glass Card */}
      <div className="rounded-2xl overflow-hidden liquid-glass shadow-xl">
        {/* Header */}
        <div className="relative px-8 py-5 bg-gradient-to-r from-[#1a2a4e]/5 via-[#0a4d68]/5 to-[#1a2a4e]/5 border-b border-[#1a2a4e]/10">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-[#1a2a4e]">Welcome Back</h2>
            <p className="text-[#1a2a4e]/50 text-sm">
              Sign in to continue your learning journey
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <p className="text-sm text-[#1a2a4e]/50 mb-4 text-center">
            Sign in with credentials assigned by your administrator
          </p>
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-[#1a2a4e]/[0.02] border-t border-[#1a2a4e]/10 text-center">
          <p className="text-sm text-[#1a2a4e]/50">
            Need access?{' '}
            <span className="text-[#0a4d68] font-medium">
              Contact your administrator for credentials
            </span>
          </p>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl p-4 text-center liquid-glass-subtle hover:border-[#0a4d68]/30 transition-all hover:scale-105">
          <GraduationCap className="h-5 w-5 text-[#0a4d68] mx-auto mb-2" />
          <p className="text-xs font-medium text-[#1a2a4e]/60">100+ Tools</p>
        </div>
        <div className="rounded-xl p-4 text-center liquid-glass-subtle hover:border-[#0a4d68]/30 transition-all hover:scale-105">
          <Users className="h-5 w-5 text-[#0a4d68] mx-auto mb-2" />
          <p className="text-xs font-medium text-[#1a2a4e]/60">K-12 Ready</p>
        </div>
        <div className="rounded-xl p-4 text-center liquid-glass-subtle hover:border-[#0a4d68]/30 transition-all hover:scale-105">
          <Shield className="h-5 w-5 text-[#0a4d68] mx-auto mb-2" />
          <p className="text-xs font-medium text-[#1a2a4e]/60">FERPA Secure</p>
        </div>
      </div>

      {/* School Access Info */}
      <div className="rounded-xl p-4 liquid-glass-subtle">
        <p className="text-xs text-center text-[#1a2a4e]/50">
          <span className="text-[#0a4d68] font-medium">School Access:</span>{' '}
          Contact your school administrator or{' '}
          <Link href="/#contact" className="text-[#0a4d68] hover:underline font-medium">
            request a demo
          </Link>
        </p>
      </div>

    </div>
  )
}
