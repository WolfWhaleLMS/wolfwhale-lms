'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import { ArrowRight } from 'lucide-react'

function LoginFormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 bg-white/5 rounded-lg" />
      <div className="h-12 bg-white/5 rounded-lg" />
      <div className="h-14 bg-white/5 rounded-lg" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      {/* Title — Evangelion-style, bold */}
      <h1
        className="text-6xl sm:text-7xl md:text-8xl font-[var(--font-dela-gothic)] text-white tracking-tight leading-none mb-4"
      >
        WOLFWHALE
      </h1>

      <p className="text-white/80 text-sm tracking-[0.3em] uppercase mb-16">
        Learning Management System
      </p>

      {/* Login Card — minimal, clean */}
      <div className="w-full max-w-sm space-y-6">
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-white/70 text-sm">
          Need access? Contact your school administrator
        </p>
      </div>

      {/* Bottom links — spaced, minimal */}
      <div className="flex gap-8 mt-16">
        <Link
          href="/info"
          className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors group"
        >
          <span>Learn More</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/guide"
          className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors group"
        >
          <span>User Guide</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
