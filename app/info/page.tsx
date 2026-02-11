'use client'

import Link from 'next/link'
import {
  BookOpen,
  ClipboardCheck,
  BarChart3,
  MessageSquare,
  CalendarCheck,
  Users,
  Trophy,
  Clock,
  Shield,
  Building2,
  Calendar,
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  Zap,
  Mail,
  ChevronRight,
  CheckCircle2
} from 'lucide-react'

export default function InfoPage() {
  return (
    <div className="min-h-screen text-[#1a2a4e]">
      {/* Light Ocean Background — matches login page */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #e8f0fe 0%, #dce8f5 25%, #c5d8ee 50%, #b8d4e8 75%, #d0e4f0 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: 'radial-gradient(ellipse 150% 80% at 50% 20%, rgba(20,184,166,0.15) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background: 'radial-gradient(ellipse 120% 60% at 30% 70%, rgba(26,42,78,0.08) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Header Navigation */}
      <header className="relative z-10 border-b border-[#1a2a4e]/10 liquid-glass-heavy">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Wolf Whale" className="h-14 w-14 rounded-full object-cover shadow-lg" />
            <div>
              <h1 className="text-xl font-bold text-[#1a2a4e]">Wolf Whale LMS</h1>
              <p className="text-xs text-[#1a2a4e]/60">Learning Management System</p>
            </div>
          </div>
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-lg bg-[#1a2a4e] text-white hover:bg-[#0a4d68] transition-all text-sm font-medium shadow-md"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a2a4e]/5 border border-[#1a2a4e]/10 mb-6">
            <Sparkles className="h-4 w-4 text-[#0a4d68]" />
            <span className="text-sm text-[#1a2a4e]/80">The Modern K-12 Learning Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#1a2a4e] to-[#0a4d68] bg-clip-text text-transparent leading-tight">
            Wolf Whale LMS
          </h1>

          <p className="text-xl md:text-2xl text-[#1a2a4e]/70 mb-4 max-w-3xl mx-auto">
            The comprehensive learning management system built for K-12 schools
          </p>

          <p className="text-base md:text-lg text-[#1a2a4e]/60 mb-10 max-w-2xl mx-auto">
            Empower teachers, engage students, and connect parents with a unified platform that combines course management, real-time messaging, gamification, and compliance—all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#1a2a4e] to-[#0a4d68] hover:shadow-[0_0_30px_oklch(0.70_0.12_180/0.4)] transition-all font-semibold text-white flex items-center gap-2 group btn-glow"
            >
              Request a Demo
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl border-2 border-[#1a2a4e]/20 hover:border-[#0a4d68] hover:bg-white/50 transition-all font-semibold text-[#1a2a4e]"
            >
              Login to Your School
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-lg text-[#1a2a4e]/60 max-w-2xl mx-auto">
              A complete suite of tools designed specifically for K-12 education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course Management */}
            <div className="rounded-2xl p-6 liquid-glass liquid-glass-hover group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#1a2a4e]/10 to-[#0a4d68]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6 text-[#0a4d68]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Course Management</h3>
              <p className="text-[#1a2a4e]/70 text-sm leading-relaxed">
                Teachers create courses with modules and lessons using our intuitive block-based content builder. Support for videos, documents, quizzes, and interactive content.
              </p>
            </div>

            {/* Assignment & Testing */}
            <div className="rounded-2xl p-6 liquid-glass liquid-glass-hover group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#1a2a4e]/10 to-[#0a4d68]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <ClipboardCheck className="h-6 w-6 text-[#0a4d68]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Assignment & Testing</h3>
              <p className="text-[#1a2a4e]/70 text-sm leading-relaxed">
                Rich quiz builder with multiple choice, true/false, short answer, and essay questions. Auto-grading support and detailed analytics for student performance.
              </p>
            </div>

            {/* Gradebook */}
            <div className="rounded-2xl p-6 liquid-glass liquid-glass-hover group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#1a2a4e]/10 to-[#0a4d68]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6 text-[#0a4d68]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gradebook</h3>
              <p className="text-[#1a2a4e]/70 text-sm leading-relaxed">
                Traditional weighted gradebook with A-F grading, category weighting, grade statistics, and CSV/PDF export. Full control over grading policies and late work.
              </p>
            </div>

            {/* Real-Time Messaging */}
            <div className="rounded-2xl p-6 liquid-glass liquid-glass-hover group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#1a2a4e]/10 to-[#0a4d68]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6 text-[#0a4d68]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Messaging</h3>
              <p className="text-[#1a2a4e]/70 text-sm leading-relaxed">
                Direct messages, group conversations, and class discussions with real-time delivery. File sharing, typing indicators, read receipts, and message search.
              </p>
            </div>

            {/* Attendance Tracking */}
            <div className="rounded-2xl p-6 liquid-glass liquid-glass-hover group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#1a2a4e]/10 to-[#0a4d68]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <CalendarCheck className="h-6 w-6 text-[#0a4d68]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Attendance Tracking</h3>
              <p className="text-[#1a2a4e]/70 text-sm leading-relaxed">
                Daily attendance with present/absent/tardy/excused statuses. Pattern detection alerts teachers and parents to potential issues before they escalate.
              </p>
            </div>

            {/* Parent Portal */}
            <div className="rounded-2xl p-6 liquid-glass liquid-glass-hover group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#1a2a4e]/10 to-[#0a4d68]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-[#0a4d68]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Parent Portal</h3>
              <p className="text-[#1a2a4e]/70 text-sm leading-relaxed">
                At-a-glance visual dashboard with grade dials, attendance gauges, upcoming assignments, and easy teacher messaging. Keep parents engaged and informed.
              </p>
            </div>

            {/* Gamification */}
            <div className="rounded-2xl p-6 liquid-glass liquid-glass-hover group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#1a2a4e]/10 to-[#0a4d68]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="h-6 w-6 text-[#0a4d68]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gamification</h3>
              <p className="text-[#1a2a4e]/70 text-sm leading-relaxed">
                XP system with 40 levels, 4 tiers, achievements, badges, and age-appropriate leaderboards. Motivate students through friendly competition and recognition.
              </p>
            </div>

            {/* Study Mode */}
            <div className="rounded-2xl p-6 liquid-glass liquid-glass-hover group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#1a2a4e]/10 to-[#0a4d68]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6 text-[#0a4d68]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Study Mode</h3>
              <p className="text-[#1a2a4e]/70 text-sm leading-relaxed">
                Focus timer with ambient music, DND mode, and XP rewards for completion. Helps students build healthy study habits and stay focused on their work.
              </p>
            </div>

            {/* Compliance */}
            <div className="rounded-2xl p-6 liquid-glass liquid-glass-hover group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#1a2a4e]/10 to-[#0a4d68]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-[#0a4d68]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Compliance</h3>
              <p className="text-[#1a2a4e]/70 text-sm leading-relaxed">
                FERPA, COPPA, and PIPEDA compliant with full audit logging and data export. Built from the ground up with student privacy and security in mind.
              </p>
            </div>

            {/* Multi-Tenant */}
            <div className="rounded-2xl p-6 liquid-glass liquid-glass-hover group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#1a2a4e]/10 to-[#0a4d68]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="h-6 w-6 text-[#0a4d68]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-Tenant</h3>
              <p className="text-[#1a2a4e]/70 text-sm leading-relaxed">
                Each school gets their own subdomain with isolated data, custom branding, and independent settings. Secure, scalable, and fully customizable.
              </p>
            </div>

            {/* Calendar */}
            <div className="rounded-2xl p-6 liquid-glass liquid-glass-hover group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#1a2a4e]/10 to-[#0a4d68]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-[#0a4d68]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Calendar</h3>
              <p className="text-[#1a2a4e]/70 text-sm leading-relaxed">
                Auto-populated with assignments, events, and school calendar items. .ics export for external calendar apps. Never miss a deadline or school event.
              </p>
            </div>

            {/* Admin Dashboard */}
            <div className="rounded-2xl p-6 liquid-glass liquid-glass-hover group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#1a2a4e]/10 to-[#0a4d68]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <LayoutDashboard className="h-6 w-6 text-[#0a4d68]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Admin Dashboard</h3>
              <p className="text-[#1a2a4e]/70 text-sm leading-relaxed">
                School health overview, user management, enrollment stats, and system monitoring. Comprehensive tools for school administrators to manage their LMS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Previews */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Every Role</h2>
            <p className="text-lg text-[#1a2a4e]/60 max-w-2xl mx-auto">
              Tailored experiences for students, teachers, parents, and administrators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Dashboard Preview */}
            <div className="rounded-2xl p-8 liquid-glass liquid-glass-hover overflow-hidden group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#1a2a4e] to-[#0a4d68]">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Student Dashboard</h3>
                  <p className="text-xs text-[#1a2a4e]/60">Your learning command center</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-16 rounded-lg bg-gradient-to-r from-[#1a2a4e]/5 to-[#1a2a4e]/8 border border-[#1a2a4e]/10 p-3">
                  <div className="h-2 w-24 bg-[#1a2a4e]/20 rounded mb-2"></div>
                  <div className="h-2 w-32 bg-[#1a2a4e]/10 rounded"></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 rounded-lg bg-gradient-to-br from-[#1a2a4e]/5 to-[#0a4d68]/5 border border-[#1a2a4e]/10 p-3">
                    <div className="h-2 w-16 bg-[#1a2a4e]/20 rounded mb-2"></div>
                    <div className="h-3 w-12 bg-[#0a4d68] rounded"></div>
                  </div>
                  <div className="h-20 rounded-lg bg-gradient-to-br from-[#1a2a4e]/5 to-[#0a4d68]/5 border border-[#1a2a4e]/10 p-3">
                    <div className="h-2 w-16 bg-[#1a2a4e]/20 rounded mb-2"></div>
                    <div className="h-3 w-12 bg-[#0a4d68] rounded"></div>
                  </div>
                </div>
                <div className="h-24 rounded-lg bg-gradient-to-r from-[#1a2a4e]/5 to-[#1a2a4e]/8 border border-[#1a2a4e]/10 p-3">
                  <div className="h-2 w-28 bg-[#1a2a4e]/20 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-[#1a2a4e]/10 rounded"></div>
                    <div className="h-2 w-3/4 bg-[#1a2a4e]/10 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Dashboard Preview */}
            <div className="rounded-2xl p-8 liquid-glass liquid-glass-hover overflow-hidden group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#1a2a4e] to-[#0a4d68]">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Teacher Dashboard</h3>
                  <p className="text-xs text-[#1a2a4e]/60">Manage courses and students</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-16 rounded-lg bg-gradient-to-r from-[#1a2a4e]/5 to-[#1a2a4e]/8 border border-[#1a2a4e]/10 p-3">
                  <div className="h-2 w-32 bg-[#1a2a4e]/20 rounded mb-2"></div>
                  <div className="h-2 w-40 bg-[#1a2a4e]/10 rounded"></div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-16 rounded-lg bg-gradient-to-br from-[#1a2a4e]/5 to-[#0a4d68]/5 border border-[#1a2a4e]/10 p-2">
                    <div className="h-2 w-12 bg-[#1a2a4e]/20 rounded"></div>
                  </div>
                  <div className="h-16 rounded-lg bg-gradient-to-br from-[#1a2a4e]/5 to-[#0a4d68]/5 border border-[#1a2a4e]/10 p-2">
                    <div className="h-2 w-12 bg-[#1a2a4e]/20 rounded"></div>
                  </div>
                  <div className="h-16 rounded-lg bg-gradient-to-br from-[#1a2a4e]/5 to-[#0a4d68]/5 border border-[#1a2a4e]/10 p-2">
                    <div className="h-2 w-12 bg-[#1a2a4e]/20 rounded"></div>
                  </div>
                </div>
                <div className="h-24 rounded-lg bg-gradient-to-r from-[#1a2a4e]/5 to-[#1a2a4e]/8 border border-[#1a2a4e]/10 p-3">
                  <div className="h-2 w-24 bg-[#1a2a4e]/20 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-[#1a2a4e]/10 rounded"></div>
                    <div className="h-2 w-5/6 bg-[#1a2a4e]/10 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Parent Dashboard Preview */}
            <div className="rounded-2xl p-8 liquid-glass liquid-glass-hover overflow-hidden group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#1a2a4e] to-[#0a4d68]">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Parent Dashboard</h3>
                  <p className="text-xs text-[#1a2a4e]/60">Monitor child progress</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-24 rounded-lg bg-gradient-to-br from-[#1a2a4e]/5 to-[#0a4d68]/5 border border-[#1a2a4e]/10 p-3 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-[#0a4d68] flex items-center justify-center">
                      <div className="text-xl font-bold text-[#0a4d68]">A</div>
                    </div>
                  </div>
                  <div className="h-24 rounded-lg bg-gradient-to-br from-[#1a2a4e]/5 to-[#0a4d68]/5 border border-[#1a2a4e]/10 p-3 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-600 flex items-center justify-center">
                      <div className="text-sm font-bold text-emerald-600">98%</div>
                    </div>
                  </div>
                </div>
                <div className="h-20 rounded-lg bg-gradient-to-r from-[#1a2a4e]/5 to-[#1a2a4e]/8 border border-[#1a2a4e]/10 p-3">
                  <div className="h-2 w-32 bg-[#1a2a4e]/20 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-[#1a2a4e]/10 rounded"></div>
                    <div className="h-2 w-2/3 bg-[#1a2a4e]/10 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Dashboard Preview */}
            <div className="rounded-2xl p-8 liquid-glass liquid-glass-hover overflow-hidden group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#1a2a4e] to-[#0a4d68]">
                  <LayoutDashboard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Admin Dashboard</h3>
                  <p className="text-xs text-[#1a2a4e]/60">School-wide insights</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-16 rounded-lg bg-gradient-to-br from-[#1a2a4e]/5 to-[#0a4d68]/5 border border-[#1a2a4e]/10 p-2">
                    <div className="h-2 w-8 bg-[#1a2a4e]/20 rounded mb-1"></div>
                    <div className="h-3 w-12 bg-[#0a4d68] rounded"></div>
                  </div>
                  <div className="h-16 rounded-lg bg-gradient-to-br from-[#1a2a4e]/5 to-[#0a4d68]/5 border border-[#1a2a4e]/10 p-2">
                    <div className="h-2 w-8 bg-[#1a2a4e]/20 rounded mb-1"></div>
                    <div className="h-3 w-12 bg-[#0a4d68] rounded"></div>
                  </div>
                  <div className="h-16 rounded-lg bg-gradient-to-br from-[#1a2a4e]/5 to-[#0a4d68]/5 border border-[#1a2a4e]/10 p-2">
                    <div className="h-2 w-8 bg-[#1a2a4e]/20 rounded mb-1"></div>
                    <div className="h-3 w-12 bg-[#0a4d68] rounded"></div>
                  </div>
                </div>
                <div className="h-28 rounded-lg bg-gradient-to-r from-[#1a2a4e]/5 to-[#1a2a4e]/8 border border-[#1a2a4e]/10 p-3">
                  <div className="h-2 w-28 bg-[#1a2a4e]/20 rounded mb-2"></div>
                  <div className="h-16 w-full bg-gradient-to-t from-[#0a4d68]/30 to-transparent rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Overview */}
      <section className="relative z-10 py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Five User Roles</h2>
            <p className="text-lg text-[#1a2a4e]/60 max-w-2xl mx-auto">
              Each role has specific capabilities designed for their needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Student */}
            <div className="rounded-xl p-5 liquid-glass liquid-glass-hover">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#1a2a4e]/10 to-[#0a4d68]/10 w-fit mb-3">
                <GraduationCap className="h-5 w-5 text-[#0a4d68]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm">Student</h3>
              <ul className="space-y-2 text-xs text-[#1a2a4e]/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>View courses & lessons</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Submit assignments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Take quizzes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Earn XP & badges</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Message teachers</span>
                </li>
              </ul>
            </div>

            {/* Teacher */}
            <div className="rounded-xl p-5 liquid-glass liquid-glass-hover">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#1a2a4e]/10 to-[#0a4d68]/10 w-fit mb-3">
                <BookOpen className="h-5 w-5 text-[#0a4d68]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm">Teacher</h3>
              <ul className="space-y-2 text-xs text-[#1a2a4e]/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Create courses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Build lessons & quizzes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Grade assignments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Track attendance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Message students/parents</span>
                </li>
              </ul>
            </div>

            {/* Parent */}
            <div className="rounded-xl p-5 liquid-glass liquid-glass-hover">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#1a2a4e]/10 to-[#0a4d68]/10 w-fit mb-3">
                <Users className="h-5 w-5 text-[#0a4d68]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm">Parent</h3>
              <ul className="space-y-2 text-xs text-[#1a2a4e]/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>View child grades</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Monitor attendance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>See upcoming work</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Message teachers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Receive alerts</span>
                </li>
              </ul>
            </div>

            {/* School Admin */}
            <div className="rounded-xl p-5 liquid-glass liquid-glass-hover">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#1a2a4e]/10 to-[#0a4d68]/10 w-fit mb-3">
                <Building2 className="h-5 w-5 text-[#0a4d68]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm">School Admin</h3>
              <ul className="space-y-2 text-xs text-[#1a2a4e]/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Manage users</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Configure school</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>View reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Bulk enrollment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Custom branding</span>
                </li>
              </ul>
            </div>

            {/* Platform Admin */}
            <div className="rounded-xl p-5 liquid-glass liquid-glass-hover">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#1a2a4e]/10 to-[#0a4d68]/10 w-fit mb-3">
                <Shield className="h-5 w-5 text-[#0a4d68]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm">Platform Admin</h3>
              <ul className="space-y-2 text-xs text-[#1a2a4e]/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Manage all tenants</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>System monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Global settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Audit logs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#0a4d68] mt-0.5 flex-shrink-0" />
                  <span>Feature flags</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative z-10 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Modern Tech Stack</h2>
            <p className="text-lg text-[#1a2a4e]/60">
              Built with cutting-edge technologies for performance and scalability
            </p>
          </div>

          <div className="rounded-2xl p-8 liquid-glass">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-6 w-6 text-[#0a4d68]" />
                  <h3 className="text-xl font-semibold">Frontend</h3>
                </div>
                <ul className="space-y-2 text-[#1a2a4e]/70">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#0a4d68]"></div>
                    Next.js 16 with App Router
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#0a4d68]"></div>
                    React 19 with Server Components
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#0a4d68]"></div>
                    Tailwind CSS 4 for styling
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#0a4d68]"></div>
                    TypeScript throughout
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-[#0a4d68]" />
                  <h3 className="text-xl font-semibold">Backend</h3>
                </div>
                <ul className="space-y-2 text-[#1a2a4e]/70">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#0a4d68]"></div>
                    Supabase for database & auth
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#0a4d68]"></div>
                    Real-time with Supabase Realtime
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#0a4d68]"></div>
                    Edge functions on Vercel
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#0a4d68]"></div>
                    PostgreSQL with Row Level Security
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="contact" className="relative z-10 py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-[#1a2a4e]/60 mb-12 max-w-2xl mx-auto">
            Wolf Whale LMS is priced per school. Contact us for a custom quote tailored to your needs.
          </p>

          <div className="rounded-2xl p-10 liquid-glass max-w-2xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Contact Sales</h3>
                <p className="text-[#1a2a4e]/60">Get a personalized demo and pricing for your school</p>
              </div>

              <div className="flex items-center justify-center gap-2 text-[#0a4d68]">
                <Mail className="h-5 w-5" />
                <a href="mailto:sales@wolfwhale.ca" className="text-lg font-medium hover:underline">
                  sales@wolfwhale.ca
                </a>
              </div>

              <div className="pt-6">
                <a
                  href="mailto:sales@wolfwhale.ca?subject=Wolf%20Whale%20LMS%20Demo%20Request"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#1a2a4e] to-[#0a4d68] hover:shadow-[0_0_30px_oklch(0.70_0.12_180/0.4)] transition-all font-semibold text-white group btn-glow"
                >
                  Request a Demo
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="pt-4 text-sm text-[#1a2a4e]/50">
                We typically respond within 24 hours
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1a2a4e]/10 py-12 liquid-glass-heavy">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Wolf Whale" className="h-14 w-14 rounded-full object-cover shadow-lg" />
                <div>
                  <h3 className="font-bold">Wolf Whale LMS</h3>
                  <p className="text-xs text-[#1a2a4e]/60">Modern K-12 Learning Platform</p>
                </div>
              </div>
              <p className="text-sm text-[#1a2a4e]/60 max-w-md">
                Empowering schools with a comprehensive learning management system designed specifically for K-12 education.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-[#1a2a4e]/60">
                <li><a href="#" className="hover:text-[#0a4d68] transition-colors">Features</a></li>
                <li><a href="#contact" className="hover:text-[#0a4d68] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[#0a4d68] transition-colors">Documentation</a></li>
                <li><Link href="/login" className="hover:text-[#0a4d68] transition-colors">Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-[#1a2a4e]/60">
                <li><Link href="/privacy" className="hover:text-[#0a4d68] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#0a4d68] transition-colors">Terms of Service</Link></li>
                <li><Link href="/help" className="hover:text-[#0a4d68] transition-colors">Help Center</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#1a2a4e]/10 text-center text-sm text-[#1a2a4e]/50">
            <p>&copy; 2026 Wolf Whale LMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
