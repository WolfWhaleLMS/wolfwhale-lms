'use client'

import Link from 'next/link'
import Image from 'next/image'
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
  Phone,
  ChevronRight,
  CheckCircle2
} from 'lucide-react'

export default function InfoPage() {
  return (
    <div className="min-h-screen text-[#0A2540]">
      {/* Bright Aqua Background */}
      <div className="fixed inset-0 z-0">
        {/* Chrome texture base */}
        <div className="absolute inset-0">
          <Image src="/chrome-bg-2.jpg" alt="" fill className="object-cover opacity-20" priority />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#E8F8FF]/85 via-[#D0F0FF]/80 to-[#B0E8FF]/85"
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: 'radial-gradient(ellipse 150% 80% at 50% 20%, rgba(0,191,255,0.18) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background: 'radial-gradient(ellipse 120% 60% at 30% 70%, rgba(51,255,51,0.08) 0%, transparent 50%)',
          }}
        />
        {/* Blob backgrounds */}
        <div className="blob-ocean absolute top-[-10%] right-[-5%] w-[500px] h-[500px] opacity-20" />
        <div className="blob-teal absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] opacity-15" />

      </div>

      {/* Header Navigation */}
      <header className="relative z-10 border-b border-[#00BFFF]/10 backdrop-blur-md bg-white/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Wolf Whale" width={56} height={56} className="rounded-xl object-contain shadow-lg border-2 border-black" />
            <div>
              <h1 className="text-xl font-display font-bold text-[#0A2540] tracking-wider uppercase">WolfWhale</h1>
              <p className="text-xs text-[#0A2540]/80 font-display font-semibold tracking-widest uppercase">Learning Management System</p>
            </div>
          </div>
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-lg bg-[#00BFFF] text-white hover:shadow-[0_0_20px_rgba(0,191,255,0.4)] transition-all text-sm font-medium shadow-md"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00BFFF]/10 border border-[#00BFFF]/20 mb-6">
            <Sparkles className="h-4 w-4 text-[#00BFFF]" />
            <span className="text-sm text-[#0A2540]/80">The Modern K-12 & Post-Secondary Learning Platform</span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-display font-extrabold mb-6 tracking-wider leading-tight"
            style={{
              background: 'linear-gradient(to right, #00BFFF, #33FF33)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '1.5px rgba(0,0,0,0.35)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
            }}
          >
            WOLFWHALE
          </h1>

          <p className="text-lg md:text-xl text-[#0A2540]/80 mb-2 tracking-[0.15em] uppercase font-display font-bold"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.10)' }}
          >
            Learning Management System
          </p>
          <p className="text-xl md:text-2xl text-[#0A2540]/80 mb-4 max-w-3xl mx-auto">
            The comprehensive learning management system built for K-12 and post-secondary institutions
          </p>

          <p className="text-base md:text-lg text-[#0A2540]/80 mb-6 max-w-2xl mx-auto">
            Empower teachers, engage students, and connect parents with a unified platform that combines course management, real-time messaging, gamification, and compliance—all in one place.
          </p>

          {/* Canadian Badge */}
          <div className="flex items-center justify-center gap-3 mb-10 px-6 py-3 rounded-xl ocean-card w-fit mx-auto shadow-sm">
            <Image src="/canada-coat-of-arms.png" alt="Coat of Arms of Canada" width={40} height={80} className="h-20 w-auto object-contain" />
            <div className="text-left">
              <p className="text-sm font-bold text-[#0A2540]">100% Canadian Owned &amp; Built</p>
              <p className="text-xs text-[#0A2540]/80">Proudly designed and developed in Canada</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#pricing"
              className="px-8 py-4 rounded-xl bg-[#00BFFF] hover:shadow-[0_0_30px_rgba(0,191,255,0.4)] transition-all font-semibold text-white flex items-center gap-2 group neon-glow-blue"
            >
              Request a Demo
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl border-2 border-[#00BFFF]/20 hover:border-[#00BFFF] hover:bg-[#00BFFF]/5 transition-all font-semibold text-[#0A2540]"
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
            <p className="text-lg text-[#0A2540]/80 max-w-2xl mx-auto">
              A complete suite of tools designed for K-12 and post-secondary education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course Management */}
            <div className="rounded-2xl p-6 ocean-card group hover:neon-border-blue transition-all">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Course Management</h3>
              <p className="text-[#0A2540]/80 text-sm leading-relaxed">
                Teachers create courses with modules and lessons using our intuitive block-based content builder. Support for videos, documents, quizzes, and interactive content.
              </p>
            </div>

            {/* Assignment & Testing */}
            <div className="rounded-2xl p-6 ocean-card group hover:neon-border-blue transition-all">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <ClipboardCheck className="h-6 w-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Assignment & Testing</h3>
              <p className="text-[#0A2540]/80 text-sm leading-relaxed">
                Rich quiz builder with multiple choice, true/false, short answer, and essay questions. Auto-grading support and detailed analytics for student performance.
              </p>
            </div>

            {/* Gradebook */}
            <div className="rounded-2xl p-6 ocean-card group hover:neon-border-blue transition-all">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gradebook</h3>
              <p className="text-[#0A2540]/80 text-sm leading-relaxed">
                Traditional weighted gradebook with A-F grading, category weighting, grade statistics, and CSV/PDF export. Full control over grading policies and late work.
              </p>
            </div>

            {/* Real-Time Messaging */}
            <div className="rounded-2xl p-6 ocean-card group hover:neon-border-blue transition-all">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Messaging</h3>
              <p className="text-[#0A2540]/80 text-sm leading-relaxed">
                Direct messages, group conversations, and class discussions with real-time delivery. File sharing, typing indicators, read receipts, and message search.
              </p>
            </div>

            {/* Attendance Tracking */}
            <div className="rounded-2xl p-6 ocean-card group hover:neon-border-blue transition-all">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <CalendarCheck className="h-6 w-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Attendance Tracking</h3>
              <p className="text-[#0A2540]/80 text-sm leading-relaxed">
                Daily attendance with present/absent/tardy/excused statuses. Pattern detection alerts teachers and parents to potential issues before they escalate.
              </p>
            </div>

            {/* Parent Portal */}
            <div className="rounded-2xl p-6 ocean-card group hover:neon-border-blue transition-all">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Parent Portal</h3>
              <p className="text-[#0A2540]/80 text-sm leading-relaxed">
                At-a-glance visual dashboard with grade dials, attendance gauges, upcoming assignments, and easy teacher messaging. Keep parents engaged and informed.
              </p>
            </div>

            {/* Gamification */}
            <div className="rounded-2xl p-6 ocean-card group hover:neon-border-blue transition-all">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="h-6 w-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gamification</h3>
              <p className="text-[#0A2540]/80 text-sm leading-relaxed">
                XP system with 40 levels, 4 tiers, achievements, badges, and age-appropriate leaderboards. Motivate students through friendly competition and recognition.
              </p>
            </div>

            {/* Study Mode */}
            <div className="rounded-2xl p-6 ocean-card group hover:neon-border-blue transition-all">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Study Mode</h3>
              <p className="text-[#0A2540]/80 text-sm leading-relaxed">
                Focus timer with ambient music, DND mode, and XP rewards for completion. Helps students build healthy study habits and stay focused on their work.
              </p>
            </div>

            {/* Compliance */}
            <div className="rounded-2xl p-6 ocean-card group hover:neon-border-blue transition-all">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Compliance</h3>
              <p className="text-[#0A2540]/80 text-sm leading-relaxed">
                FERPA, COPPA, and PIPEDA compliant with full audit logging and data export. Built from the ground up with student privacy and security in mind.
              </p>
            </div>

            {/* Multi-Tenant */}
            <div className="rounded-2xl p-6 ocean-card group hover:neon-border-blue transition-all">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="h-6 w-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-Tenant</h3>
              <p className="text-[#0A2540]/80 text-sm leading-relaxed">
                Each school gets their own subdomain with isolated data, custom branding, and independent settings. Secure, scalable, and fully customizable.
              </p>
            </div>

            {/* Calendar */}
            <div className="rounded-2xl p-6 ocean-card group hover:neon-border-blue transition-all">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Calendar</h3>
              <p className="text-[#0A2540]/80 text-sm leading-relaxed">
                Auto-populated with assignments, events, and school calendar items. .ics export for external calendar apps. Never miss a deadline or school event.
              </p>
            </div>

            {/* Admin Dashboard */}
            <div className="rounded-2xl p-6 ocean-card group hover:neon-border-blue transition-all">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <LayoutDashboard className="h-6 w-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Admin Dashboard</h3>
              <p className="text-[#0A2540]/80 text-sm leading-relaxed">
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
            <p className="text-lg text-[#0A2540]/80 max-w-2xl mx-auto">
              Tailored experiences for students, teachers, parents, and administrators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Dashboard */}
            <div className="rounded-2xl overflow-hidden ocean-card group hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 p-5 border-b border-[#00BFFF]/10">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF] to-[#33FF33] text-white-outlined">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Student Dashboard</h3>
                  <p className="text-xs text-[#0A2540]/80">Your learning command center</p>
                </div>
              </div>
              <Image src="/screenshot-student.png" alt="Student Dashboard" width={800} height={500} className="w-full h-auto" />
            </div>

            {/* Teacher Dashboard */}
            <div className="rounded-2xl overflow-hidden ocean-card group hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 p-5 border-b border-[#00BFFF]/10">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF] to-[#33FF33] text-white-outlined">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Teacher Dashboard</h3>
                  <p className="text-xs text-[#0A2540]/80">Manage courses and students</p>
                </div>
              </div>
              <Image src="/screenshot-teacher.png" alt="Teacher Dashboard" width={800} height={500} className="w-full h-auto" />
            </div>

            {/* Parent Dashboard */}
            <div className="rounded-2xl overflow-hidden ocean-card group hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 p-5 border-b border-[#00BFFF]/10">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF] to-[#33FF33] text-white-outlined">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Parent Dashboard</h3>
                  <p className="text-xs text-[#0A2540]/80">Monitor child progress</p>
                </div>
              </div>
              <Image src="/screenshot-parent.png" alt="Parent Dashboard" width={800} height={500} className="w-full h-auto" />
            </div>

            {/* Admin Dashboard */}
            <div className="rounded-2xl overflow-hidden ocean-card group hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 p-5 border-b border-[#00BFFF]/10">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF] to-[#33FF33] text-white-outlined">
                  <LayoutDashboard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Admin Dashboard</h3>
                  <p className="text-xs text-[#0A2540]/80">School-wide insights</p>
                </div>
              </div>
              <Image src="/screenshot-admin.png" alt="Admin Dashboard" width={800} height={500} className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Role Overview */}
      <section className="relative z-10 py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Four User Roles</h2>
            <p className="text-lg text-[#0A2540]/80 max-w-2xl mx-auto">
              Each role has specific capabilities designed for their needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Student */}
            <div className="rounded-xl p-5 ocean-card hover:neon-border-blue transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-3">
                <GraduationCap className="h-5 w-5 text-[#00BFFF]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm">Student</h3>
              <ul className="space-y-2 text-xs text-[#0A2540]/80">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>View courses & lessons</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>Submit assignments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>Take quizzes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>Earn XP & badges</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>Message teachers</span>
                </li>
              </ul>
            </div>

            {/* Teacher */}
            <div className="rounded-xl p-5 ocean-card hover:neon-border-blue transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-3">
                <BookOpen className="h-5 w-5 text-[#00BFFF]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm">Teacher</h3>
              <ul className="space-y-2 text-xs text-[#0A2540]/80">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>Create courses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>Build lessons & quizzes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>Grade assignments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>Track attendance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>Message students/parents</span>
                </li>
              </ul>
            </div>

            {/* Parent */}
            <div className="rounded-xl p-5 ocean-card hover:neon-border-blue transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-3">
                <Users className="h-5 w-5 text-[#00BFFF]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm">Parent</h3>
              <ul className="space-y-2 text-xs text-[#0A2540]/80">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>View child grades</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>Monitor attendance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>See upcoming work</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>Message teachers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>Receive alerts</span>
                </li>
              </ul>
            </div>

            {/* School Admin */}
            <div className="rounded-xl p-5 ocean-card hover:neon-border-blue transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-3">
                <Building2 className="h-5 w-5 text-[#00BFFF]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm">School Admin</h3>
              <ul className="space-y-2 text-xs text-[#0A2540]/80">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>Manage users</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>Configure school</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>View reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>Bulk enrollment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span>Custom branding</span>
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
            <p className="text-lg text-[#0A2540]/80">
              Built with cutting-edge technologies for performance and scalability
            </p>
          </div>

          <div className="rounded-2xl p-8 ocean-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-6 w-6 text-[#00BFFF]" />
                  <h3 className="text-xl font-semibold">Frontend</h3>
                </div>
                <ul className="space-y-2 text-[#0A2540]/80">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]"></div>
                    Next.js 16 with App Router
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]"></div>
                    React 19 with Server Components
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]"></div>
                    Tailwind CSS 4 for styling
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]"></div>
                    TypeScript throughout
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-[#00BFFF]" />
                  <h3 className="text-xl font-semibold">Backend</h3>
                </div>
                <ul className="space-y-2 text-[#0A2540]/80">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]"></div>
                    Supabase for database & auth
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]"></div>
                    Real-time with Supabase Realtime
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]"></div>
                    Edge functions on Vercel
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]"></div>
                    PostgreSQL with Row Level Security
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-lg text-[#0A2540]/80 mb-12 max-w-2xl mx-auto">
            One plan. All features. No hidden fees.
          </p>

          <div className="rounded-2xl p-10 ocean-card max-w-2xl mx-auto neon-border-blue">
            <div className="space-y-8">
              {/* Price */}
              <div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#33FF33] bg-clip-text text-transparent">$20</span>
                  <span className="text-lg text-[#0A2540]/80">CAD</span>
                </div>
                <p className="text-[#0A2540]/80 mt-2">per user account, per month</p>
              </div>

              {/* Key details */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full ocean-card">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF]" />
                  <span className="text-[#0A2540]/80">All features included</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full ocean-card">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF]" />
                  <span className="text-[#0A2540]/80">2-year minimum contract</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full ocean-card">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF]" />
                  <span className="text-[#0A2540]/80">Single tier</span>
                </div>
              </div>

              {/* What's included */}
              <div className="grid grid-cols-2 gap-3 text-left text-sm max-w-md mx-auto">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Unlimited courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Real-time messaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Gradebook & reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Gamification & XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Parent portal</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Attendance tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Custom branding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">FERPA & COPPA compliant</span>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 space-y-4">
                <a
                  href="mailto:info@wolfwhale.ca?subject=Wolf%20Whale%20LMS%20-%20Get%20Started"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#00BFFF] hover:shadow-[0_0_30px_rgba(0,191,255,0.4)] transition-all font-semibold text-white group neon-glow-blue"
                >
                  Get Started
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[#00BFFF]">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href="mailto:info@wolfwhale.ca" className="text-sm font-medium hover:underline">
                      info@wolfwhale.ca
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a href="tel:+13069815926" className="text-sm font-medium hover:underline">
                      +1 (306) 981-5926
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#00BFFF]/10 py-12 backdrop-blur-md bg-white/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="Wolf Whale" width={56} height={56} className="rounded-xl object-contain shadow-lg border-2 border-black" />
                <div>
                  <h3 className="font-display font-bold tracking-wider uppercase">WolfWhale</h3>
                  <p className="text-xs text-[#0A2540]/80 font-display tracking-widest uppercase">Modern K-12 & Post-Secondary Learning Platform</p>
                </div>
              </div>
              <p className="text-sm text-[#0A2540]/80 max-w-md mb-3">
                Empowering schools with a comprehensive learning management system designed for K-12 and post-secondary education.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 text-sm text-[#0A2540]/80">
                <a href="mailto:info@wolfwhale.ca" className="flex items-center gap-1.5 hover:text-[#00BFFF] transition-colors">
                  <Mail className="h-3.5 w-3.5" /> info@wolfwhale.ca
                </a>
                <a href="tel:+13069815926" className="flex items-center gap-1.5 hover:text-[#00BFFF] transition-colors">
                  <Phone className="h-3.5 w-3.5" /> +1 (306) 981-5926
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-[#0A2540]/80">
                <li><a href="#" className="hover:text-[#00BFFF] transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-[#00BFFF] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[#00BFFF] transition-colors">Documentation</a></li>
                <li><Link href="/login" className="hover:text-[#00BFFF] transition-colors">Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-[#0A2540]/80">
                <li><Link href="/privacy" className="hover:text-[#00BFFF] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#00BFFF] transition-colors">Terms of Service</Link></li>
                <li><Link href="/help" className="hover:text-[#00BFFF] transition-colors">Help Center</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#00BFFF]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#0A2540]/80">
            <p>&copy; 2026 WolfWhale Learning Management System. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <Image src="/canada-coat-of-arms.png" alt="Coat of Arms of Canada" width={24} height={48} className="h-12 w-auto object-contain" />
              <span className="text-xs font-semibold text-[#0A2540]/80">100% Canadian Owned &amp; Built</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
