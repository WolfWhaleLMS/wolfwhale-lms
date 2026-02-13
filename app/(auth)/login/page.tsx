'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import { GraduationCap, Shield, Users, ArrowRight, BookOpen } from 'lucide-react'

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
      <div className="text-center space-y-3">
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-wider leading-none whitespace-nowrap"
          style={{
            filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))',
          }}
        >
          {/* Letters W-O-L-F-W-H-A-L get the blue-to-green gradient */}
          <span
            style={{
              background: 'linear-gradient(to right, #00BFFF, #33FF33)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '3px rgba(0,0,0,0.6)',
            }}
          >
            WOLFWHAL
          </span>
          {/* The "E" is fully lime green */}
          <span
            style={{
              WebkitTextFillColor: '#33FF33',
              WebkitTextStroke: '3px rgba(0,0,0,0.6)',
            }}
          >
            E
          </span>
        </h1>
        <p
          className="text-sm sm:text-base tracking-[0.2em] uppercase font-display font-bold"
          style={{
            color: '#00BFFF',
            textShadow: '0 1px 2px rgba(0,0,0,0.15)',
          }}
        >
          Learning Management System
        </p>
      </div>

      {/* Spacer between title and Learn More */}
      <div className="!mt-32 sm:!mt-40" />

      {/* Learn More — BIG button */}
      <Link
        href="/info"
        className="!mt-0 flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl btn-chrome-3d-blue text-white text-white-outlined font-bold text-lg transition-all group"
      >
        <span>Learn More About WolfWhale LMS</span>
        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* User Guide — silver chrome button */}
      <Link
        href="/guide"
        className="!mt-0 flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl btn-chrome-3d-silver font-bold text-lg transition-all group"
      >
        <BookOpen className="h-5 w-5" />
        <span>User Guide</span>
        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Glass Card with neon border */}
      <div className="rounded-2xl overflow-hidden ocean-card neon-border-blue shadow-xl">
        {/* Header */}
        <div className="relative px-8 py-5 bg-gradient-to-r from-[#00BFFF]/5 via-[#33FF33]/5 to-[#00BFFF]/5 border-b border-[#00BFFF]/15">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-[#0A2540]">Welcome Back</h2>
            <p className="text-muted-foreground text-sm">
              Sign in to continue your learning journey
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Sign in with credentials assigned by your administrator
          </p>
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-[#00BFFF]/[0.03] border-t border-[#00BFFF]/10 text-center">
          <p className="text-sm text-muted-foreground">
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
          <p className="text-xs font-medium text-muted-foreground">All-in-One</p>
        </div>
        <div className="rounded-xl p-4 text-center ocean-card hover:neon-border-blue transition-all hover:scale-105">
          <Users className="h-5 w-5 text-[#00BFFF] mx-auto mb-2" />
          <p className="text-xs font-medium text-muted-foreground">K-12 & Post-Sec</p>
        </div>
        <div className="rounded-xl p-4 text-center ocean-card hover:neon-border-blue transition-all hover:scale-105">
          <Shield className="h-5 w-5 text-[#00BFFF] mx-auto mb-2" />
          <p className="text-xs font-medium text-muted-foreground">FERPA Secure</p>
        </div>
      </div>

      {/* School Access Info */}
      <div className="rounded-xl p-4 ocean-card">
        <p className="text-xs text-center text-muted-foreground">
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
