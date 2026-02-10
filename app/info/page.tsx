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
    <div className="min-h-screen bg-gradient-to-b from-[oklch(0.16_0.04_260)] via-[oklch(0.18_0.04_258)] to-[oklch(0.16_0.04_260)] text-white">
      {/* Ambient Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob-ocean absolute top-20 left-20 w-96 h-96" />
        <div className="blob-teal absolute top-40 right-20 w-[500px] h-[500px]" />
        <div className="blob-midnight absolute bottom-20 left-1/3 w-[600px] h-[600px]" />
      </div>

      {/* Header Navigation */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220)] to-[oklch(0.70_0.12_180)]">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Wolf Whale LMS</h1>
              <p className="text-xs text-white/60">Learning Management System</p>
            </div>
          </div>
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-lg border border-white/20 hover:border-[oklch(0.70_0.12_180)] hover:bg-white/5 transition-all text-sm font-medium"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Sparkles className="h-4 w-4 text-[oklch(0.74_0.13_180)]" />
            <span className="text-sm text-white/80">The Modern K-12 Learning Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-[oklch(0.90_0.08_180)] to-[oklch(0.74_0.13_180)] bg-clip-text text-transparent leading-tight">
            Wolf Whale LMS
          </h1>

          <p className="text-xl md:text-2xl text-white/70 mb-4 max-w-3xl mx-auto">
            The comprehensive learning management system built for K-12 schools
          </p>

          <p className="text-base md:text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            Empower teachers, engage students, and connect parents with a unified platform that combines course management, real-time messaging, gamification, and compliance—all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[oklch(0.35_0.08_220)] to-[oklch(0.70_0.12_180)] hover:shadow-lg hover:shadow-[oklch(0.70_0.12_180/0.3)] transition-all font-semibold text-white flex items-center gap-2 group"
            >
              Request a Demo
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl border-2 border-white/20 hover:border-[oklch(0.70_0.12_180)] hover:bg-white/5 transition-all font-semibold"
            >
              Login to Your School
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              A complete suite of tools designed specifically for K-12 education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course Management */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.5)] transition-all group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[oklch(0.35_0.08_220/0.3)] to-[oklch(0.70_0.12_180/0.2)] w-fit mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Course Management</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Teachers create courses with modules and lessons using our intuitive block-based content builder. Support for videos, documents, quizzes, and interactive content.
              </p>
            </div>

            {/* Assignment & Testing */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.5)] transition-all group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[oklch(0.35_0.08_220/0.3)] to-[oklch(0.70_0.12_180/0.2)] w-fit mb-4 group-hover:scale-110 transition-transform">
                <ClipboardCheck className="h-6 w-6 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Assignment & Testing</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Rich quiz builder with multiple choice, true/false, short answer, and essay questions. Auto-grading support and detailed analytics for student performance.
              </p>
            </div>

            {/* Gradebook */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.5)] transition-all group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[oklch(0.35_0.08_220/0.3)] to-[oklch(0.70_0.12_180/0.2)] w-fit mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gradebook</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Traditional weighted gradebook with A-F grading, category weighting, grade statistics, and CSV/PDF export. Full control over grading policies and late work.
              </p>
            </div>

            {/* Real-Time Messaging */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.5)] transition-all group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[oklch(0.35_0.08_220/0.3)] to-[oklch(0.70_0.12_180/0.2)] w-fit mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Messaging</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Direct messages, group conversations, and class discussions with real-time delivery. File sharing, typing indicators, read receipts, and message search.
              </p>
            </div>

            {/* Attendance Tracking */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.5)] transition-all group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[oklch(0.35_0.08_220/0.3)] to-[oklch(0.70_0.12_180/0.2)] w-fit mb-4 group-hover:scale-110 transition-transform">
                <CalendarCheck className="h-6 w-6 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Attendance Tracking</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Daily attendance with present/absent/tardy/excused statuses. Pattern detection alerts teachers and parents to potential issues before they escalate.
              </p>
            </div>

            {/* Parent Portal */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.5)] transition-all group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[oklch(0.35_0.08_220/0.3)] to-[oklch(0.70_0.12_180/0.2)] w-fit mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Parent Portal</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                At-a-glance visual dashboard with grade dials, attendance gauges, upcoming assignments, and easy teacher messaging. Keep parents engaged and informed.
              </p>
            </div>

            {/* Gamification */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.5)] transition-all group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[oklch(0.35_0.08_220/0.3)] to-[oklch(0.70_0.12_180/0.2)] w-fit mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="h-6 w-6 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gamification</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                XP system with 40 levels, 4 tiers, achievements, badges, and age-appropriate leaderboards. Motivate students through friendly competition and recognition.
              </p>
            </div>

            {/* Study Mode */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.5)] transition-all group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[oklch(0.35_0.08_220/0.3)] to-[oklch(0.70_0.12_180/0.2)] w-fit mb-4 group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Study Mode</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Focus timer with ambient music, DND mode, and XP rewards for completion. Helps students build healthy study habits and stay focused on their work.
              </p>
            </div>

            {/* Compliance */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.5)] transition-all group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[oklch(0.35_0.08_220/0.3)] to-[oklch(0.70_0.12_180/0.2)] w-fit mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Compliance</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                FERPA, COPPA, and PIPEDA compliant with full audit logging and data export. Built from the ground up with student privacy and security in mind.
              </p>
            </div>

            {/* Multi-Tenant */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.5)] transition-all group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[oklch(0.35_0.08_220/0.3)] to-[oklch(0.70_0.12_180/0.2)] w-fit mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="h-6 w-6 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-Tenant</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Each school gets their own subdomain with isolated data, custom branding, and independent settings. Secure, scalable, and fully customizable.
              </p>
            </div>

            {/* Calendar */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.5)] transition-all group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[oklch(0.35_0.08_220/0.3)] to-[oklch(0.70_0.12_180/0.2)] w-fit mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Calendar</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Auto-populated with assignments, events, and school calendar items. .ics export for external calendar apps. Never miss a deadline or school event.
              </p>
            </div>

            {/* Admin Dashboard */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.5)] transition-all group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[oklch(0.35_0.08_220/0.3)] to-[oklch(0.70_0.12_180/0.2)] w-fit mb-4 group-hover:scale-110 transition-transform">
                <LayoutDashboard className="h-6 w-6 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Admin Dashboard</h3>
              <p className="text-white/70 text-sm leading-relaxed">
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
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Tailored experiences for students, teachers, parents, and administrators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Dashboard Preview */}
            <div className="glass-panel rounded-2xl p-8 border border-[oklch(0.70_0.12_180/0.3)] overflow-hidden group hover:border-[oklch(0.70_0.12_180/0.5)] transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220)] to-[oklch(0.70_0.12_180)]">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Student Dashboard</h3>
                  <p className="text-xs text-white/60">Your learning command center</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-16 rounded-lg bg-gradient-to-r from-white/5 to-white/10 border border-white/10 p-3">
                  <div className="h-2 w-24 bg-white/30 rounded mb-2"></div>
                  <div className="h-2 w-32 bg-white/20 rounded"></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220/0.2)] to-[oklch(0.70_0.12_180/0.1)] border border-white/10 p-3">
                    <div className="h-2 w-16 bg-white/30 rounded mb-2"></div>
                    <div className="h-3 w-12 bg-[oklch(0.74_0.13_180)] rounded"></div>
                  </div>
                  <div className="h-20 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220/0.2)] to-[oklch(0.70_0.12_180/0.1)] border border-white/10 p-3">
                    <div className="h-2 w-16 bg-white/30 rounded mb-2"></div>
                    <div className="h-3 w-12 bg-[oklch(0.74_0.13_180)] rounded"></div>
                  </div>
                </div>
                <div className="h-24 rounded-lg bg-gradient-to-r from-white/5 to-white/10 border border-white/10 p-3">
                  <div className="h-2 w-28 bg-white/30 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-white/20 rounded"></div>
                    <div className="h-2 w-3/4 bg-white/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Dashboard Preview */}
            <div className="glass-panel rounded-2xl p-8 border border-[oklch(0.70_0.12_180/0.3)] overflow-hidden group hover:border-[oklch(0.70_0.12_180/0.5)] transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220)] to-[oklch(0.70_0.12_180)]">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Teacher Dashboard</h3>
                  <p className="text-xs text-white/60">Manage courses and students</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-16 rounded-lg bg-gradient-to-r from-white/5 to-white/10 border border-white/10 p-3">
                  <div className="h-2 w-32 bg-white/30 rounded mb-2"></div>
                  <div className="h-2 w-40 bg-white/20 rounded"></div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-16 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220/0.2)] to-[oklch(0.70_0.12_180/0.1)] border border-white/10 p-2">
                    <div className="h-2 w-12 bg-white/30 rounded"></div>
                  </div>
                  <div className="h-16 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220/0.2)] to-[oklch(0.70_0.12_180/0.1)] border border-white/10 p-2">
                    <div className="h-2 w-12 bg-white/30 rounded"></div>
                  </div>
                  <div className="h-16 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220/0.2)] to-[oklch(0.70_0.12_180/0.1)] border border-white/10 p-2">
                    <div className="h-2 w-12 bg-white/30 rounded"></div>
                  </div>
                </div>
                <div className="h-24 rounded-lg bg-gradient-to-r from-white/5 to-white/10 border border-white/10 p-3">
                  <div className="h-2 w-24 bg-white/30 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-white/20 rounded"></div>
                    <div className="h-2 w-5/6 bg-white/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Parent Dashboard Preview */}
            <div className="glass-panel rounded-2xl p-8 border border-[oklch(0.70_0.12_180/0.3)] overflow-hidden group hover:border-[oklch(0.70_0.12_180/0.5)] transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220)] to-[oklch(0.70_0.12_180)]">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Parent Dashboard</h3>
                  <p className="text-xs text-white/60">Monitor child progress</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-24 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220/0.2)] to-[oklch(0.70_0.12_180/0.1)] border border-white/10 p-3 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-[oklch(0.74_0.13_180)] flex items-center justify-center">
                      <div className="text-xl font-bold text-[oklch(0.74_0.13_180)]">A</div>
                    </div>
                  </div>
                  <div className="h-24 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220/0.2)] to-[oklch(0.70_0.12_180/0.1)] border border-white/10 p-3 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-[oklch(0.68_0.17_160)] flex items-center justify-center">
                      <div className="text-sm font-bold text-[oklch(0.68_0.17_160)]">98%</div>
                    </div>
                  </div>
                </div>
                <div className="h-20 rounded-lg bg-gradient-to-r from-white/5 to-white/10 border border-white/10 p-3">
                  <div className="h-2 w-32 bg-white/30 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-white/20 rounded"></div>
                    <div className="h-2 w-2/3 bg-white/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Dashboard Preview */}
            <div className="glass-panel rounded-2xl p-8 border border-[oklch(0.70_0.12_180/0.3)] overflow-hidden group hover:border-[oklch(0.70_0.12_180/0.5)] transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220)] to-[oklch(0.70_0.12_180)]">
                  <LayoutDashboard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Admin Dashboard</h3>
                  <p className="text-xs text-white/60">School-wide insights</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-16 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220/0.2)] to-[oklch(0.70_0.12_180/0.1)] border border-white/10 p-2">
                    <div className="h-2 w-8 bg-white/30 rounded mb-1"></div>
                    <div className="h-3 w-12 bg-[oklch(0.74_0.13_180)] rounded"></div>
                  </div>
                  <div className="h-16 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220/0.2)] to-[oklch(0.70_0.12_180/0.1)] border border-white/10 p-2">
                    <div className="h-2 w-8 bg-white/30 rounded mb-1"></div>
                    <div className="h-3 w-12 bg-[oklch(0.74_0.13_180)] rounded"></div>
                  </div>
                  <div className="h-16 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220/0.2)] to-[oklch(0.70_0.12_180/0.1)] border border-white/10 p-2">
                    <div className="h-2 w-8 bg-white/30 rounded mb-1"></div>
                    <div className="h-3 w-12 bg-[oklch(0.74_0.13_180)] rounded"></div>
                  </div>
                </div>
                <div className="h-28 rounded-lg bg-gradient-to-r from-white/5 to-white/10 border border-white/10 p-3">
                  <div className="h-2 w-28 bg-white/30 rounded mb-2"></div>
                  <div className="h-16 w-full bg-gradient-to-t from-[oklch(0.74_0.13_180/0.3)] to-transparent rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Overview */}
      <section className="relative z-10 py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Five User Roles</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Each role has specific capabilities designed for their needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Student */}
            <div className="glass-panel rounded-xl p-5 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.5)] transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220/0.3)] to-[oklch(0.70_0.12_180/0.2)] w-fit mb-3">
                <GraduationCap className="h-5 w-5 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm">Student</h3>
              <ul className="space-y-2 text-xs text-white/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>View courses & lessons</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Submit assignments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Take quizzes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Earn XP & badges</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Message teachers</span>
                </li>
              </ul>
            </div>

            {/* Teacher */}
            <div className="glass-panel rounded-xl p-5 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.5)] transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220/0.3)] to-[oklch(0.70_0.12_180/0.2)] w-fit mb-3">
                <BookOpen className="h-5 w-5 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm">Teacher</h3>
              <ul className="space-y-2 text-xs text-white/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Create courses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Build lessons & quizzes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Grade assignments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Track attendance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Message students/parents</span>
                </li>
              </ul>
            </div>

            {/* Parent */}
            <div className="glass-panel rounded-xl p-5 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.5)] transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220/0.3)] to-[oklch(0.70_0.12_180/0.2)] w-fit mb-3">
                <Users className="h-5 w-5 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm">Parent</h3>
              <ul className="space-y-2 text-xs text-white/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>View child grades</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Monitor attendance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>See upcoming work</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Message teachers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Receive alerts</span>
                </li>
              </ul>
            </div>

            {/* School Admin */}
            <div className="glass-panel rounded-xl p-5 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.5)] transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220/0.3)] to-[oklch(0.70_0.12_180/0.2)] w-fit mb-3">
                <Building2 className="h-5 w-5 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm">School Admin</h3>
              <ul className="space-y-2 text-xs text-white/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Manage users</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Configure school</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>View reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Bulk enrollment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Custom branding</span>
                </li>
              </ul>
            </div>

            {/* Platform Admin */}
            <div className="glass-panel rounded-xl p-5 border border-white/10 hover:border-[oklch(0.70_0.12_180/0.5)] transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220/0.3)] to-[oklch(0.70_0.12_180/0.2)] w-fit mb-3">
                <Shield className="h-5 w-5 text-[oklch(0.74_0.13_180)]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm">Platform Admin</h3>
              <ul className="space-y-2 text-xs text-white/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Manage all tenants</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>System monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Global settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
                  <span>Audit logs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[oklch(0.74_0.13_180)] mt-0.5 flex-shrink-0" />
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
            <p className="text-lg text-white/60">
              Built with cutting-edge technologies for performance and scalability
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-8 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-6 w-6 text-[oklch(0.74_0.13_180)]" />
                  <h3 className="text-xl font-semibold">Frontend</h3>
                </div>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.13_180)]"></div>
                    Next.js 16 with App Router
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.13_180)]"></div>
                    React 19 with Server Components
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.13_180)]"></div>
                    Tailwind CSS 4 for styling
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.13_180)]"></div>
                    TypeScript throughout
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-[oklch(0.74_0.13_180)]" />
                  <h3 className="text-xl font-semibold">Backend</h3>
                </div>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.13_180)]"></div>
                    Supabase for database & auth
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.13_180)]"></div>
                    Real-time with Supabase Realtime
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.13_180)]"></div>
                    Edge functions on Vercel
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.13_180)]"></div>
                    PostgreSQL with Row Level Security
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="contact" className="relative z-10 py-20 bg-black/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
            Wolf Whale LMS is priced per school. Contact us for a custom quote tailored to your needs.
          </p>

          <div className="glass-panel rounded-2xl p-10 border border-white/10 max-w-2xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Contact Sales</h3>
                <p className="text-white/60">Get a personalized demo and pricing for your school</p>
              </div>

              <div className="flex items-center justify-center gap-2 text-[oklch(0.74_0.13_180)]">
                <Mail className="h-5 w-5" />
                <a href="mailto:sales@wolfwhale.ca" className="text-lg font-medium hover:underline">
                  sales@wolfwhale.ca
                </a>
              </div>

              <div className="pt-6">
                <a
                  href="mailto:sales@wolfwhale.ca?subject=Wolf%20Whale%20LMS%20Demo%20Request"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[oklch(0.35_0.08_220)] to-[oklch(0.70_0.12_180)] hover:shadow-lg hover:shadow-[oklch(0.70_0.12_180/0.3)] transition-all font-semibold text-white group"
                >
                  Request a Demo
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="pt-4 text-sm text-white/50">
                We typically respond within 24 hours
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 bg-black/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[oklch(0.35_0.08_220)] to-[oklch(0.70_0.12_180)]">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Wolf Whale LMS</h3>
                  <p className="text-xs text-white/60">Modern K-12 Learning Platform</p>
                </div>
              </div>
              <p className="text-sm text-white/60 max-w-md">
                Empowering schools with a comprehensive learning management system designed specifically for K-12 education.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-[oklch(0.74_0.13_180)] transition-colors">Features</a></li>
                <li><a href="#contact" className="hover:text-[oklch(0.74_0.13_180)] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[oklch(0.74_0.13_180)] transition-colors">Documentation</a></li>
                <li><Link href="/login" className="hover:text-[oklch(0.74_0.13_180)] transition-colors">Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/privacy" className="hover:text-[oklch(0.74_0.13_180)] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[oklch(0.74_0.13_180)] transition-colors">Terms of Service</Link></li>
                <li><Link href="/help" className="hover:text-[oklch(0.74_0.13_180)] transition-colors">Help Center</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-sm text-white/50">
            <p>&copy; 2026 Wolf Whale LMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
