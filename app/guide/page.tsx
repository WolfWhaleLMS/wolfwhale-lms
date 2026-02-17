'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Brain,
  BarChart3,
  Trophy,
  GraduationCap,
  Users,
  Building2,
  CalendarCheck,
  MessageSquare,
  Settings,
  Shield,
  FileText,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Mail,
  Phone,
  type LucideIcon,
} from 'lucide-react'

/* ============================================
   Types
   ============================================ */
type Role = 'student' | 'teacher' | 'parent' | 'admin'

interface FeatureItem {
  icon: LucideIcon
  title: string
  description: string
}

interface WorkflowStep {
  step: number
  text: string
}

interface Workflow {
  title: string
  steps: WorkflowStep[]
}

/* ============================================
   Role Configurations
   ============================================ */
const ROLE_CONFIG: Record<
  Role,
  { label: string; color: string; glowColor: string; borderColor: string }
> = {
  student: {
    label: 'Student',
    color: '#33FF33',
    glowColor: 'rgba(51,255,51,0.4)',
    borderColor: 'rgba(51,255,51,0.5)',
  },
  teacher: {
    label: 'Teacher',
    color: '#00BFFF',
    glowColor: 'rgba(0,191,255,0.4)',
    borderColor: 'rgba(0,191,255,0.5)',
  },
  parent: {
    label: 'Parent',
    color: '#00FFFF',
    glowColor: 'rgba(0,255,255,0.4)',
    borderColor: 'rgba(0,255,255,0.5)',
  },
  admin: {
    label: 'Admin',
    color: '#FFD700',
    glowColor: 'rgba(255,215,0,0.4)',
    borderColor: 'rgba(255,215,0,0.5)',
  },
}

const ROLE_FEATURES: Record<Role, FeatureItem[]> = {
  student: [
    { icon: LayoutDashboard, title: 'Dashboard', description: 'Your personalized learning command center with progress and XP' },
    { icon: BookOpen, title: 'Courses', description: 'Join courses via code and access all modules and lessons' },
    { icon: ClipboardCheck, title: 'Assignments', description: 'View, complete, and submit your work before deadlines' },
    { icon: Brain, title: 'Flashcards', description: 'Study with spaced repetition to master any subject' },
    { icon: BarChart3, title: 'Grades', description: 'Track your progress across every course and assignment' },
    { icon: Trophy, title: 'Achievements', description: 'Earn badges, XP, and climb leaderboards as you learn' },
    { icon: GraduationCap, title: 'Study Mode', description: 'Focused learning with timers and do-not-disturb mode' },
    { icon: Users, title: 'Virtual Plaza', description: 'Social space to connect with classmates and share progress' },
  ],
  teacher: [
    { icon: LayoutDashboard, title: 'Dashboard', description: 'Overview of your classes, tasks, and student activity' },
    { icon: BookOpen, title: 'Create Courses', description: 'Build courses with modules, lessons, and rich content blocks' },
    { icon: ClipboardCheck, title: 'Assignments', description: 'Create assignments and review student submissions' },
    { icon: BarChart3, title: 'Gradebook', description: 'View, enter, and export grades with weighted categories' },
    { icon: FileText, title: 'Quizzes', description: 'Build quizzes with multiple choice, true/false, and more' },
    { icon: Brain, title: 'Flashcard Decks', description: 'Create spaced repetition decks for your students' },
    { icon: CalendarCheck, title: 'Attendance', description: 'Track daily attendance with status and pattern alerts' },
  ],
  parent: [
    { icon: LayoutDashboard, title: 'Dashboard', description: 'At-a-glance view of your child&apos;s academic life' },
    { icon: Users, title: 'My Children', description: 'Switch between linked child accounts easily' },
    { icon: BarChart3, title: 'Grades', description: 'Monitor grades across all courses in real time' },
    { icon: ClipboardCheck, title: 'Assignments', description: 'Track upcoming and completed assignments' },
    { icon: CalendarCheck, title: 'Attendance', description: 'View attendance records and pattern alerts' },
    { icon: MessageSquare, title: 'Messaging', description: 'Contact teachers directly with questions or concerns' },
  ],
  admin: [
    { icon: LayoutDashboard, title: 'Dashboard', description: 'School-wide health metrics and quick actions' },
    { icon: Users, title: 'Users', description: 'Manage all student, teacher, parent, and admin accounts' },
    { icon: GraduationCap, title: 'Classes', description: 'Organize classes, sections, and enrollments' },
    { icon: BarChart3, title: 'Reports', description: 'Analytics on grades, attendance, and engagement' },
    { icon: CalendarCheck, title: 'Attendance', description: 'School-wide attendance tracking and reports' },
    { icon: Settings, title: 'Settings', description: 'Configure school branding, policies, and features' },
    { icon: Shield, title: 'Compliance', description: 'FERPA, PIPEDA, and regulatory compliance tools' },
    { icon: FileText, title: 'Audit Logs', description: 'Track every change with detailed activity logs' },
  ],
}

const ROLE_WORKFLOWS: Record<Role, Workflow[]> = {
  student: [
    {
      title: 'Join a Course',
      steps: [
        { step: 1, text: 'Get the course code from your teacher' },
        { step: 2, text: 'Click "Join Course" on your dashboard' },
        { step: 3, text: 'Enter the code and confirm' },
        { step: 4, text: 'Start learning right away' },
      ],
    },
    {
      title: 'Study Flashcards',
      steps: [
        { step: 1, text: 'Open your course and go to Flashcards' },
        { step: 2, text: 'Start a study session with spaced repetition' },
        { step: 3, text: 'Rate your confidence on each card' },
        { step: 4, text: 'Track your mastery progress over time' },
      ],
    },
    {
      title: 'Submit an Assignment',
      steps: [
        { step: 1, text: 'Open the assignment from your dashboard or course' },
        { step: 2, text: 'Upload your work or type your response' },
        { step: 3, text: 'Add any notes for your teacher' },
        { step: 4, text: 'Submit before the deadline' },
      ],
    },
  ],
  teacher: [
    {
      title: 'Create a Course',
      steps: [
        { step: 1, text: 'Click "New Course" on your dashboard' },
        { step: 2, text: 'Add course name, description, and settings' },
        { step: 3, text: 'Create modules to organize your content' },
        { step: 4, text: 'Add lessons with text, images, and video' },
      ],
    },
    {
      title: 'Grade Assignments',
      steps: [
        { step: 1, text: 'Open Assignments and select a class' },
        { step: 2, text: 'Choose a student submission to review' },
        { step: 3, text: 'Review the work and enter a grade' },
        { step: 4, text: 'Add feedback and save' },
      ],
    },
    {
      title: 'Take Attendance',
      steps: [
        { step: 1, text: 'Select your class from the Attendance page' },
        { step: 2, text: 'Mark each student present, absent, or tardy' },
        { step: 3, text: 'Save the attendance record' },
        { step: 4, text: 'View reports and pattern alerts' },
      ],
    },
  ],
  parent: [
    {
      title: "Check Your Child's Grades",
      steps: [
        { step: 1, text: 'Select your child from the dashboard' },
        { step: 2, text: 'Navigate to the Grades section' },
        { step: 3, text: 'View grades organized by course' },
        { step: 4, text: 'Tap any grade for assignment details' },
      ],
    },
    {
      title: 'Message a Teacher',
      steps: [
        { step: 1, text: 'Go to the Messages section' },
        { step: 2, text: "Select a teacher from your child's school" },
        { step: 3, text: 'Write your message' },
        { step: 4, text: 'Send and get notified when they reply' },
      ],
    },
  ],
  admin: [
    {
      title: 'Add Users',
      steps: [
        { step: 1, text: 'Go to Users in the admin panel' },
        { step: 2, text: 'Click "Add User" or use bulk import' },
        { step: 3, text: 'Enter user details and assign a role' },
        { step: 4, text: 'Save -- the user receives login credentials' },
      ],
    },
    {
      title: 'View Reports',
      steps: [
        { step: 1, text: 'Open Reports from the admin dashboard' },
        { step: 2, text: 'Select the report type (grades, attendance, etc.)' },
        { step: 3, text: 'Set the date range and filters' },
        { step: 4, text: 'View results or export as CSV/PDF' },
      ],
    },
    {
      title: 'Configure Settings',
      steps: [
        { step: 1, text: 'Open Settings from the admin panel' },
        { step: 2, text: 'Choose a category (branding, policies, features)' },
        { step: 3, text: 'Update the values as needed' },
        { step: 4, text: 'Save changes -- they take effect immediately' },
      ],
    },
  ],
}

/* ============================================
   Feature Card Component
   ============================================ */
function GuideFeatureCard({
  icon: Icon,
  title,
  description,
  roleColor,
}: {
  icon: LucideIcon
  title: string
  description: string
  roleColor: string
}) {
  return (
    <div className="rounded-2xl p-5 ocean-card group hover:neon-border-blue transition-all">
      <div
        className="p-2.5 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform"
        style={{ backgroundColor: `${roleColor}15` }}
      >
        <Icon className="h-5 w-5" style={{ color: roleColor }} />
      </div>
      <h4 className="font-semibold text-base mb-1.5 text-[#0A2540]">{title}</h4>
      <p className="text-sm text-[#0A2540]/75 leading-relaxed">{description}</p>
    </div>
  )
}

/* ============================================
   Workflow Card Component
   ============================================ */
function WorkflowCard({
  workflow,
  roleColor,
}: {
  workflow: Workflow
  roleColor: string
}) {
  return (
    <div className="rounded-2xl p-6 ocean-card hover:neon-border-blue transition-all">
      <h4 className="font-semibold text-lg mb-5 text-[#0A2540] flex items-center gap-2">
        <ChevronRight className="h-5 w-5" style={{ color: roleColor }} />
        {workflow.title}
      </h4>
      <div className="relative pl-8">
        {/* Chrome gradient timeline line */}
        <div
          className="absolute left-3 top-1 bottom-1 w-0.5 rounded-full"
          style={{
            background: `linear-gradient(180deg, ${roleColor}, ${roleColor}40)`,
          }}
        />
        <div className="space-y-4">
          {workflow.steps.map((s) => (
            <div key={s.step} className="relative flex items-start gap-3">
              {/* Step number dot */}
              <div
                className="absolute -left-5 top-0.5 flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold text-white shrink-0"
                style={{ backgroundColor: roleColor, boxShadow: `0 0 8px ${roleColor}60` }}
              >
                {s.step}
              </div>
              <p className="text-sm text-[#0A2540]/80 leading-relaxed pt-0.5 pl-1">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ============================================
   Main Guide Page
   ============================================ */
export default function GuidePage() {
  const [activeRole, setActiveRole] = useState<Role>('student')
  const config = ROLE_CONFIG[activeRole]
  const features = ROLE_FEATURES[activeRole]
  const workflows = ROLE_WORKFLOWS[activeRole]

  return (
    <div className="min-h-screen text-[#0A2540]">
      {/* Background -- matches info page pattern */}
      <div className="fixed inset-0 z-0">
        {/* Chrome texture base */}
        <div className="absolute inset-0">
          <Image src="/chrome-bg-2.jpg" alt="" fill className="object-cover opacity-20" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8F8FF]/85 via-[#D0F0FF]/80 to-[#B0E8FF]/85" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 150% 80% at 50% 20%, rgba(0,191,255,0.18) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              'radial-gradient(ellipse 120% 60% at 30% 70%, rgba(51,255,51,0.08) 0%, transparent 50%)',
          }}
        />
        {/* Blob backgrounds */}
        <div className="blob-ocean absolute top-[-10%] right-[-5%] w-[500px] h-[500px] opacity-20" />
        <div className="blob-teal absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] opacity-15" />

        {/* Floating bubble particles */}
        <div className="bubble-float absolute left-[10%] top-[15%] h-3 w-3 rounded-full bg-[#00BFFF]/10" style={{ animationDelay: '0s' }} />
        <div className="bubble-float absolute left-[25%] top-[70%] h-5 w-5 rounded-full bg-[#00FFFF]/8" style={{ animationDelay: '-3s' }} />
        <div className="bubble-float absolute left-[55%] top-[20%] h-2 w-2 rounded-full bg-[#00BFFF]/10" style={{ animationDelay: '-5s' }} />
        <div className="bubble-float absolute left-[80%] top-[60%] h-4 w-4 rounded-full bg-[#00FFFF]/8" style={{ animationDelay: '-8s' }} />
        <div className="bubble-float absolute left-[40%] top-[85%] h-6 w-6 rounded-full bg-[#00BFFF]/10" style={{ animationDelay: '-2s' }} />
        <div className="bubble-float absolute left-[70%] top-[10%] h-3 w-3 rounded-full bg-[#00FFFF]/8" style={{ animationDelay: '-11s' }} />
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 border-b border-[#00BFFF]/10 backdrop-blur-md bg-white/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="WolfWhale"
              width={48}
              height={48}
              className="rounded-xl object-contain shadow-lg border-2 border-black"
            />
            <div>
              <h1 className="text-lg font-display font-bold text-[#0A2540] tracking-wider uppercase">
                WolfWhale
              </h1>
              <p className="text-xs text-[#0A2540]/80 font-display font-semibold tracking-widest uppercase">
                User Guide
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="px-5 py-2 rounded-lg bg-[#00BFFF] text-white hover:shadow-[0_0_20px_rgba(0,191,255,0.4)] transition-all text-sm font-medium shadow-md"
          >
            Back to Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00BFFF]/10 border border-[#00BFFF]/20 mb-6">
            <Sparkles className="h-4 w-4 text-[#00BFFF]" />
            <span className="text-sm text-[#0A2540]/80">Complete Platform Guide</span>
          </div>

          <h2
            className="text-4xl md:text-6xl font-display font-extrabold mb-4 tracking-wider leading-tight"
            style={{
              background: 'linear-gradient(to right, #00BFFF, #33FF33)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '1.5px rgba(0,0,0,0.35)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
            }}
          >
            USER GUIDE
          </h2>

          <p className="text-lg md:text-xl text-[#0A2540]/80 max-w-2xl mx-auto">
            Everything you need to know about WolfWhale LMS
          </p>
        </div>
      </section>

      {/* Role Tab Bar -- sticky, horizontally scrollable on mobile */}
      <div className="sticky top-[73px] z-20 backdrop-blur-md bg-white/50 border-b border-[#00BFFF]/10">
        <div className="max-w-5xl mx-auto px-6">
          <nav
            className="flex gap-1 py-3 overflow-x-auto scrollbar-hide"
            role="tablist"
            aria-label="User role tabs"
          >
            {(Object.keys(ROLE_CONFIG) as Role[]).map((role) => {
              const rc = ROLE_CONFIG[role]
              const isActive = activeRole === role
              return (
                <button
                  key={role}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveRole(role)}
                  className="relative px-6 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all shrink-0"
                  style={{
                    color: isActive ? '#0A2540' : '#0A2540B3',
                    backgroundColor: isActive ? `${rc.color}20` : 'transparent',
                    border: isActive ? `2px solid ${rc.borderColor}` : '2px solid transparent',
                    boxShadow: isActive ? `0 0 16px ${rc.glowColor}` : 'none',
                  }}
                >
                  {rc.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                      style={{ backgroundColor: rc.color }}
                    />
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <main className="relative z-10 py-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section: Features */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="h-8 w-1 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <h3 className="text-2xl md:text-3xl font-bold text-[#0A2540]">
                {config.label} Features
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {features.map((feat) => (
                <GuideFeatureCard
                  key={feat.title}
                  icon={feat.icon}
                  title={feat.title}
                  description={feat.description}
                  roleColor={config.color}
                />
              ))}
            </div>
          </div>

          {/* Section: Workflows */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="h-8 w-1 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <h3 className="text-2xl md:text-3xl font-bold text-[#0A2540]">
                Common Workflows
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((wf) => (
                <WorkflowCard
                  key={wf.title}
                  workflow={wf}
                  roleColor={config.color}
                />
              ))}
            </div>
          </div>

          {/* Quick Tips Section */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="h-8 w-1 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <h3 className="text-2xl md:text-3xl font-bold text-[#0A2540]">
                Quick Tips
              </h3>
            </div>

            <div className="rounded-2xl p-6 md:p-8 ocean-card">
              {activeRole === 'student' && (
                <ul className="space-y-3 text-sm text-[#0A2540]/80">
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#33FF33] mt-0.5 shrink-0" />
                    <span><strong>Study daily</strong> -- even 10 minutes of flashcard review helps retention dramatically thanks to spaced repetition.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#33FF33] mt-0.5 shrink-0" />
                    <span><strong>Use Study Mode</strong> -- activate focus timers and do-not-disturb to minimize distractions.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#33FF33] mt-0.5 shrink-0" />
                    <span><strong>Go offline</strong> -- download lessons and flashcards before a trip or commute to keep learning anywhere.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#33FF33] mt-0.5 shrink-0" />
                    <span><strong>Check achievements</strong> -- earn XP and badges by completing assignments, quizzes, and study streaks.</span>
                  </li>
                </ul>
              )}

              {activeRole === 'teacher' && (
                <ul className="space-y-3 text-sm text-[#0A2540]/80">
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#00BFFF] mt-0.5 shrink-0" />
                    <span><strong>Use content blocks</strong> -- mix text, images, and videos in lessons to keep students engaged.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#00BFFF] mt-0.5 shrink-0" />
                    <span><strong>Create flashcard decks</strong> -- spaced repetition is proven to boost retention; your students will thank you.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#00BFFF] mt-0.5 shrink-0" />
                    <span><strong>Monitor attendance patterns</strong> -- catch issues early by reviewing the attendance alerts dashboard.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#00BFFF] mt-0.5 shrink-0" />
                    <span><strong>Export grades</strong> -- use CSV or PDF export from the gradebook for report cards and records.</span>
                  </li>
                </ul>
              )}

              {activeRole === 'parent' && (
                <ul className="space-y-3 text-sm text-[#0A2540]/80">
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#00FFFF] mt-0.5 shrink-0" />
                    <span><strong>Check in weekly</strong> -- a quick look at grades and attendance helps you stay informed and supportive.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#00FFFF] mt-0.5 shrink-0" />
                    <span><strong>Enable notifications</strong> -- get alerts for new grades, missing assignments, and attendance changes.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#00FFFF] mt-0.5 shrink-0" />
                    <span><strong>Message teachers directly</strong> -- no need for email; use the built-in messaging for faster responses.</span>
                  </li>
                </ul>
              )}

              {activeRole === 'admin' && (
                <ul className="space-y-3 text-sm text-[#0A2540]/80">
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#FFD700] mt-0.5 shrink-0" />
                    <span><strong>Use bulk import</strong> -- upload a CSV to add hundreds of users at once instead of one by one.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#FFD700] mt-0.5 shrink-0" />
                    <span><strong>Review audit logs regularly</strong> -- stay on top of compliance by checking activity logs weekly.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#FFD700] mt-0.5 shrink-0" />
                    <span><strong>Customize branding</strong> -- set your school logo, colors, and subdomain in Settings for a personalized experience.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#FFD700] mt-0.5 shrink-0" />
                    <span><strong>Schedule reports</strong> -- set up recurring report exports so you always have the latest data.</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#00BFFF]/10 py-12 backdrop-blur-md bg-white/40">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="WolfWhale"
                width={48}
                height={48}
                className="rounded-xl object-contain shadow-lg border-2 border-black"
              />
              <div>
                <h3 className="font-display font-bold tracking-wider uppercase text-sm">
                  WolfWhale
                </h3>
                <p className="text-xs text-[#0A2540]/80 font-display tracking-widest uppercase">
                  Learning Management System
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-lg bg-[#00BFFF] text-white hover:shadow-[0_0_20px_rgba(0,191,255,0.4)] transition-all text-sm font-medium shadow-md"
              >
                Back to Login
              </Link>
              <Link
                href="/info"
                className="px-5 py-2.5 rounded-lg border-2 border-[#00BFFF]/20 hover:border-[#00BFFF] hover:bg-[#00BFFF]/5 transition-all text-sm font-medium text-[#0A2540]"
              >
                About WolfWhale
              </Link>
              <Link
                href="/help"
                className="px-5 py-2.5 rounded-lg border-2 border-[#00BFFF]/20 hover:border-[#00BFFF] hover:bg-[#00BFFF]/5 transition-all text-sm font-medium text-[#0A2540]"
              >
                Help Center
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-[#00BFFF]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#0A2540]/50">
              &copy; {new Date().getFullYear()} WolfWhale Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-[#0A2540]/70">
              <a
                href="mailto:info@wolfwhale.ca"
                className="flex items-center gap-1.5 hover:text-[#00BFFF] transition-colors"
              >
                <Mail className="h-3.5 w-3.5" /> info@wolfwhale.ca
              </a>
              <a
                href="tel:+13069815926"
                className="flex items-center gap-1.5 hover:text-[#00BFFF] transition-colors"
              >
                <Phone className="h-3.5 w-3.5" /> +1 (306) 981-5926
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scrollbar hide utility */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
