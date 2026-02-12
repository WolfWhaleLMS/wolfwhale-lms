'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import { GraduationCap, Shield, Users, ArrowRight } from 'lucide-react'

function LoginFormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-[#00BFFF]/10 rounded-lg" />
      <div className="h-10 bg-[#00BFFF]/10 rounded-lg" />
      <div className="h-12 bg-[#00BFFF]/10 rounded-lg" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="space-y-6">
      {/* Aqua Neon Title */}
      <div className="text-center space-y-2">
        <h1
          className="text-[2.6rem] sm:text-5xl md:text-6xl font-display font-extrabold tracking-wider text-glow-blue leading-none whitespace-nowrap bg-gradient-to-r from-[#00BFFF] to-[#33FF33] bg-clip-text text-transparent"
        >
          WOLF WHALE
        </h1>
        <p
          className="text-sm sm:text-base tracking-[0.2em] uppercase text-[#00BFFF] font-display font-bold"
        >
          Learning Management System
        </p>
      </div>

      {/* Learn More — BIG button near the top */}
      <Link
        href="/info"
        className="!mt-16 flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl bg-[#00BFFF] text-white font-semibold text-lg shadow-lg hover:shadow-[0_0_30px_rgba(0,191,255,0.4)] hover:scale-[1.02] transition-all group neon-glow-blue"
      >
        <span>Learn More About Wolf Whale LMS</span>
        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Glass Card with neon border */}
      <div className="rounded-2xl overflow-hidden ocean-card neon-border-blue shadow-xl">
        {/* Header */}
        <div className="relative px-8 py-5 bg-gradient-to-r from-[#00BFFF]/5 via-[#33FF33]/5 to-[#00BFFF]/5 border-b border-[#00BFFF]/15">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-[#0A2540]">Welcome Back</h2>
            <p className="text-[#6B8FA3] text-sm">
              Sign in to continue your learning journey
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <p className="text-sm text-[#6B8FA3] mb-4 text-center">
            Sign in with credentials assigned by your administrator
          </p>
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-[#00BFFF]/[0.03] border-t border-[#00BFFF]/10 text-center">
          <p className="text-sm text-[#6B8FA3]">
            Need access?{' '}
            <span className="text-[#00BFFF] font-medium">
              Contact your administrator for credentials
            </span>
          </p>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl p-4 text-center ocean-card hover:neon-border-blue transition-all hover:scale-105">
          <GraduationCap className="h-5 w-5 text-[#00BFFF] mx-auto mb-2" />
          <p className="text-xs font-medium text-[#6B8FA3]">All-in-One</p>
        </div>
        <div className="rounded-xl p-4 text-center ocean-card hover:neon-border-blue transition-all hover:scale-105">
          <Users className="h-5 w-5 text-[#00BFFF] mx-auto mb-2" />
          <p className="text-xs font-medium text-[#6B8FA3]">K-12 & Post-Sec</p>
        </div>
        <div className="rounded-xl p-4 text-center ocean-card hover:neon-border-blue transition-all hover:scale-105">
          <Shield className="h-5 w-5 text-[#00BFFF] mx-auto mb-2" />
          <p className="text-xs font-medium text-[#6B8FA3]">FERPA Secure</p>
        </div>
      </div>

      {/* School Access Info */}
      <div className="rounded-xl p-4 ocean-card">
        <p className="text-xs text-center text-[#6B8FA3]">
          <span className="text-[#00BFFF] font-medium">School Access:</span>{' '}
          Contact your school administrator or{' '}
          <Link href="/#contact" className="text-[#00BFFF] hover:underline font-medium">
            request a demo
          </Link>
        </p>
      </div>

    </div>
  )
}
