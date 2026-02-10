'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import { GraduationCap, Shield, Users } from 'lucide-react'

function LoginFormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-white/10 rounded-lg" />
      <div className="h-10 bg-white/10 rounded-lg" />
      <div className="h-12 bg-white/10 rounded-lg" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="space-y-8">
      {/* Glass Card */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="relative px-8 py-6 bg-gradient-to-r from-[oklch(0.35_0.08_220/0.30)] via-[oklch(0.70_0.12_180/0.15)] to-[oklch(0.35_0.08_220/0.30)] border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          <div className="relative text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-[oklch(0.70_0.12_180/0.20)] border border-[oklch(0.70_0.12_180/0.30)] mb-2">
              <svg className="h-6 w-6 text-[oklch(0.74_0.13_180)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-white/60 text-sm">
              Sign in to continue your learning journey
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <p className="text-sm text-white/60 mb-4 text-center">
            Sign in with credentials assigned by your administrator
          </p>
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-white/[0.02] border-t border-white/10 text-center">
          <p className="text-sm text-white/60">
            Need access?{' '}
            <span className="text-[oklch(0.74_0.13_180)]">
              Contact your administrator for credentials
            </span>
          </p>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-4 text-center border border-white/5 hover:border-[oklch(0.70_0.12_180/0.30)] transition-colors">
          <GraduationCap className="h-5 w-5 text-[oklch(0.74_0.13_180)] mx-auto mb-2" />
          <p className="text-xs text-white/60">100+ Tools</p>
        </div>
        <div className="glass-panel rounded-xl p-4 text-center border border-white/5 hover:border-[oklch(0.70_0.12_180/0.30)] transition-colors">
          <Users className="h-5 w-5 text-[oklch(0.74_0.13_180)] mx-auto mb-2" />
          <p className="text-xs text-white/60">K-12 Ready</p>
        </div>
        <div className="glass-panel rounded-xl p-4 text-center border border-white/5 hover:border-[oklch(0.70_0.12_180/0.30)] transition-colors">
          <Shield className="h-5 w-5 text-[oklch(0.74_0.13_180)] mx-auto mb-2" />
          <p className="text-xs text-white/60">FERPA Secure</p>
        </div>
      </div>

      {/* Info */}
      <div className="glass-panel rounded-xl p-4 border border-[oklch(0.70_0.12_180/0.20)]">
        <p className="text-xs text-center text-white/50">
          <span className="text-[oklch(0.74_0.13_180)] font-medium">School Access:</span>{' '}
          Contact your school administrator or{' '}
          <Link href="/#contact" className="text-[oklch(0.74_0.13_180)] hover:underline">
            request a demo
          </Link>
        </p>
      </div>
    </div>
  )
}
