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
  Shield,
  Building2,
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  Mail,
  Phone,
  ChevronRight,
  CheckCircle2,
  WifiOff,
  Gamepad2,
  Moon,
  Bell,
  Dog,
  Monitor,
  Bot,
  Heart,
  Brain,
  Puzzle,
  FileText,
  Accessibility,
  Smartphone,
  Eye,
  Wrench,
  type LucideIcon
} from 'lucide-react'

/* ============================================
   Feature Card Component
   ============================================ */
function FeatureCard({
  icon: Icon,
  title,
  description,
  highlight = false,
  tag,
}: {
  icon: LucideIcon
  title: string
  description: string
  highlight?: boolean
  tag?: string
}) {
  return (
    <div
      className={`rounded-2xl p-6 ocean-card group hover:neon-border-blue transition-all ${
        highlight ? 'md:col-span-2 lg:col-span-3 neon-border-blue' : ''
      }`}
    >
      <div
        className={`p-3 rounded-xl bg-gradient-to-br w-fit mb-4 group-hover:scale-110 transition-transform ${
          highlight
            ? 'from-[#8B5CF6]/20 to-[#00BFFF]/20'
            : 'from-[#00BFFF]/10 to-[#8B5CF6]/10'
        }`}
      >
        <Icon className={`h-6 w-6 ${highlight ? 'text-[#8B5CF6]' : 'text-[#00BFFF]'}`} />
      </div>
      <h3 className={`font-semibold mb-3 text-white ${highlight ? 'text-2xl' : 'text-xl'}`}>
        {title}
        {tag && (
          <span className="ml-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8B5CF6]/15 text-[#C4B5FD] text-xs font-bold uppercase tracking-wider border border-[#8B5CF6]/30">
            <Sparkles className="h-3 w-3" />
            {tag}
          </span>
        )}
      </h3>
      <p className={`text-white/70 leading-relaxed ${highlight ? 'text-base max-w-3xl' : 'text-sm'}`}>
        {description}
      </p>
    </div>
  )
}


/* ============================================
   Role Capability Item
   ============================================ */
function RoleItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="h-3 w-3 text-[#00BFFF] mt-0.5 flex-shrink-0" />
      <span>{text}</span>
    </li>
  )
}

/* ============================================
   Stat Card
   ============================================ */
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl p-5 ocean-card text-center">
      <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#8B5CF6] bg-clip-text text-transparent">{value}</p>
      <p className="text-xs text-white/60 mt-1 tracking-wider uppercase">{label}</p>
    </div>
  )
}

/* ============================================
   Main Info Page
   ============================================ */
export default function InfoPage() {
  return (
    <div className="min-h-screen text-white">
      {/* Dark Background with subtle neon accents */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 150% 80% at 50% 20%, rgba(139,92,246,0.12) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 120% 60% at 30% 70%, rgba(0,191,255,0.06) 0%, transparent 50%)',
          }}
        />

        <div className="absolute left-[10%] top-[15%] h-2 w-2 rounded-full bg-[#8B5CF6]/20 animate-pulse" />
        <div className="absolute left-[25%] top-[70%] h-3 w-3 rounded-full bg-[#00BFFF]/15 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute left-[55%] top-[20%] h-1.5 w-1.5 rounded-full bg-[#8B5CF6]/15 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute left-[80%] top-[60%] h-2.5 w-2.5 rounded-full bg-[#00BFFF]/20 animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute left-[40%] top-[85%] h-3 w-3 rounded-full bg-[#8B5CF6]/15 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute left-[70%] top-[10%] h-2 w-2 rounded-full bg-[#00BFFF]/15 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Header Navigation */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-md bg-black/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="WolfWhale" width={56} height={56} className="rounded-xl object-contain shadow-lg shadow-purple-500/20" />
            <div>
              <h1 className="text-xl font-display font-bold text-white tracking-wider uppercase">WolfWhale</h1>
              <p className="text-xs text-white/70 font-display font-semibold tracking-widest uppercase">Learning Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="px-4 py-2.5 rounded-lg text-white/70 hover:text-white transition-colors text-sm font-medium">
              Home
            </Link>
            <a
              href="mailto:info@wolfwhale.ca"
              className="px-6 py-2.5 rounded-lg btn-chrome-3d-blue text-white transition-all text-sm font-bold"
            >
              Contact Us
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Sparkles className="h-4 w-4 text-[#00BFFF]" />
            <span className="text-sm text-white/80">The Comprehensive K-12 Learning Platform</span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-display font-extrabold mb-6 tracking-wider leading-tight"
            style={{
              background: 'linear-gradient(to right, #00BFFF, #8B5CF6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 3px 12px rgba(139,92,246,0.3))',
            }}
          >
            WolfWhale
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-4 tracking-[0.15em] uppercase font-display font-bold">
            Learning Management System
          </p>
          <p className="text-xl md:text-2xl text-white/80 mb-4 max-w-3xl mx-auto">
            Cognitive load theory meets on-device AI. The only LMS with research-backed micro-lessons, 72 original textbooks, and AI-powered content conversion.
          </p>

          <p className="text-base md:text-lg text-white/70 mb-6 max-w-2xl mx-auto">
            5 user roles. 682 curriculum outcomes. Student data never leaves the device.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="mailto:info@wolfwhale.ca?subject=WolfWhale%20LMS%20-%20Demo%20Request"
              className="px-8 py-4 rounded-xl btn-chrome-3d-blue text-white transition-all font-bold flex items-center gap-2 group"
            >
              Request a Demo
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/"
              className="px-8 py-4 rounded-xl btn-chrome-3d-silver transition-all font-bold"
            >
              Back to Home
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12">
            <StatCard value="72" label="Original Textbooks" />
            <StatCard value="288+" label="Chapters" />
            <StatCard value="682" label="Curriculum Outcomes" />
            <StatCard value="5" label="User Roles" />
          </div>
        </div>
      </section>

      {/* NEW: Micro-Lesson System — Hero Feature */}
      <section className="relative z-10 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 mb-6">
              <Brain className="h-4 w-4 text-[#8B5CF6]" />
              <span className="text-sm text-white/80 font-semibold">NEW — Industry First</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Micro-Lesson System</h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Research-backed learning based on cognitive load theory. Instead of long chapters, content is broken into bite-sized sections that maximize comprehension and retention.
            </p>
          </div>

          {/* 5-step flow */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-12">
            {[
              { num: '1', title: 'Hook', desc: 'A 2-sentence relatable scenario that grabs attention', color: '#00BFFF' },
              { num: '2', title: 'Lesson', desc: '3-5 plain-language sentences explaining ONE concept', color: '#8B5CF6' },
              { num: '3', title: '"This Is / This Is Not"', desc: 'Side-by-side cards: what it IS (green) vs. misconceptions (red)', color: '#34D399' },
              { num: '4', title: 'Reading Timer', desc: 'Configurable countdown ensuring students actually read', color: '#FFD700' },
              { num: '5', title: 'Gated Quiz', desc: '5 quiz questions per section, locked until timer completes', color: '#FF6B9D' },
            ].map(({ num, title, desc, color }) => (
              <div key={num} className="rounded-xl p-5 ocean-card text-center space-y-3">
                <div
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full font-bold text-lg border-2"
                  style={{ borderColor: color, color }}
                >
                  {num}
                </div>
                <h3 className="text-sm font-bold text-white">{title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Where micro-lessons appear */}
          <div className="rounded-2xl p-6 sm:p-8 ocean-card neon-border-blue">
            <h3 className="text-xl font-bold text-white mb-4">Where Micro-Lessons Appear</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {[
                'All 288 textbook chapters',
                'Course lesson content',
                'Quiz wrong-answer explanations',
                'AI Tutor responses',
                'Learning recommendation previews',
                'Flashcard "Explain" button',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span className="text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Teacher Micro-Lesson Converter */}
      <section className="relative z-10 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-2xl p-8 sm:p-12 ocean-card neon-border-blue relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10" style={{
              background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
            }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 mb-4">
                <Sparkles className="h-3 w-3 text-[#8B5CF6]" />
                <span className="text-xs text-[#C4B5FD] font-bold uppercase tracking-wider">Only on WolfWhale</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">AI Micro-Lesson Converter</h2>
              <p className="text-lg text-white/70 mb-8 max-w-3xl">
                No other LMS has this. Teachers can convert ANY text into structured micro-lessons automatically using on-device AI.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl p-6 bg-white/5 border border-white/10">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Bot className="h-5 w-5 text-[#00BFFF]" />
                    Auto-Convert Mode
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    Paste any text — lesson notes, textbook excerpt, Wikipedia article, handout. Select grade level. Tap &quot;Convert.&quot; On-device AI generates 1-5 micro-lessons with hooks, lesson text, &quot;This Is / This Is Not&quot; comparisons, and 5 quiz questions each. Preview, edit, save, or assign.
                  </p>
                </div>
                <div className="rounded-xl p-6 bg-white/5 border border-white/10">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#8B5CF6]" />
                    Build from Scratch
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    Structured form: Title, Hook, Lesson Text, &quot;This Is&quot; items, &quot;This Is Not&quot; items, Quiz questions. Live preview shows the exact student-facing card. Saved micro-lessons are stored in a searchable library and can be assigned to any course.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WolfWhale Books — Textbook System */}
      <section className="relative z-10 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">WolfWhale Books</h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              72 original textbooks published under our own brand. Not links to external content — fully integrated with micro-lessons, flashcards, and interactive activities.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <StatCard value="72" label="Original Textbooks" />
            <StatCard value="288+" label="Chapters" />
            <StatCard value="6" label="Activity Types" />
            <StatCard value="K-12" label="Grade Coverage" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl p-6 ocean-card">
              <h3 className="font-bold text-white mb-3">Curriculum Coverage</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <RoleItem text="Math K-12 (including Foundations Math 20)" />
                <RoleItem text="Science K-10, Physics 20/30, Biology 30, Chemistry 30" />
                <RoleItem text="ELA K-9, ELA 20/30" />
                <RoleItem text="Social Studies K-9" />
                <RoleItem text="Health 1-9, PE 1/4/7/9, Arts 1/4/7" />
                <RoleItem text="Career Education 6-9, French 1" />
              </ul>
              <p className="text-xs text-white/50 mt-3">70% pan-Canadian (WNCP) core, 30% Saskatchewan-specific. Indigenous connections woven throughout.</p>
            </div>
            <div className="rounded-xl p-6 ocean-card">
              <h3 className="font-bold text-white mb-3">6 Interactive Activity Types</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <RoleItem text="Matching — Drag items to pair with correct matches" />
                <RoleItem text="Sorting — Drag items into labeled category buckets" />
                <RoleItem text="Fill in the Blank — Type answers into inline blanks" />
                <RoleItem text="Labeling — Tap hotspots on diagrams to assign labels" />
                <RoleItem text="Sequencing — Drag items into correct order" />
                <RoleItem text="Drawing — PencilKit canvas with prompts" />
              </ul>
            </div>
          </div>

          <div className="rounded-xl p-5 ocean-card text-center">
            <p className="text-sm text-white/60">
              Each chapter includes micro-lessons, integrated flashcards with multiple study modes (classic, card sheets, quiz), reading progress tracking with Supabase sync, and interactive activities.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Previews */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built for Every Role</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
              Tailored experiences for students, teachers, parents, administrators, and super admins
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="rounded-2xl p-6 ocean-card">
                <p className="text-sm text-white/70 mb-4">Want to see the platform in action?</p>
                <a
                  href="mailto:info@wolfwhale.ca?subject=WolfWhale%20LMS%20-%20Demo%20Request"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg btn-chrome-3d-blue text-white transition-all text-sm font-bold"
                >
                  Request a Demo
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl overflow-hidden ocean-card group hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 p-5 border-b border-white/10">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF] to-[#8B5CF6] text-white">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Student Dashboard</h3>
                  <p className="text-xs text-white/70">Your learning command center</p>
                </div>
              </div>
              <div className="relative">
                <Image src="/screenshots/student-dashboard.png" alt="Student Dashboard" width={1440} height={900} sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" className="w-full h-auto" />
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden ocean-card group hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 p-5 border-b border-white/10">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF] to-[#8B5CF6] text-white">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Teacher Dashboard</h3>
                  <p className="text-xs text-white/70">Manage courses, tools, and students</p>
                </div>
              </div>
              <div className="relative">
                <Image src="/screenshots/teacher-dashboard.png" alt="Teacher Dashboard" width={1440} height={900} sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" className="w-full h-auto" />
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden ocean-card group hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 p-5 border-b border-white/10">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF] to-[#8B5CF6] text-white">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Parent Dashboard</h3>
                  <p className="text-xs text-white/70">Monitor your child&apos;s progress</p>
                </div>
              </div>
              <div className="relative">
                <Image src="/screenshots/parent-dashboard.png" alt="Parent Dashboard" width={1440} height={900} sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" className="w-full h-auto" />
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden ocean-card group hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 p-5 border-b border-white/10">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#D97706] to-[#F59E0B] text-white">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Admin Dashboard</h3>
                  <p className="text-xs text-white/70">School overview and management</p>
                </div>
              </div>
              <div className="relative">
                <Image src="/screenshots/admin-dashboard.png" alt="Admin Dashboard" width={1440} height={900} sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Five User Roles */}
      <section className="relative z-10 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Five User Roles</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Each role has a purpose-built dashboard and feature set
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Student */}
            <div className="rounded-xl p-5 ocean-card hover:neon-border-blue transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#8B5CF6]/10 to-[#00BFFF]/10 w-fit mb-3">
                <GraduationCap className="h-5 w-5 text-[#8B5CF6]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm text-white">Student</h3>
              <ul className="space-y-2 text-xs text-white/70">
                <RoleItem text="Personalized dashboard with GPA, due dates, and recommendations" />
                <RoleItem text="Courses with progress tracking and module navigation" />
                <RoleItem text="Micro-lesson textbooks with gated quizzes" />
                <RoleItem text="Assignments: file, photo, drawing, and scanned submissions" />
                <RoleItem text="Quizzes: multiple choice, T/F, fill-blank, matching, essay" />
                <RoleItem text="Grade breakdown, trends, transcript PDF, predicted grades" />
                <RoleItem text="Skill Tree constellation (682 SK curriculum outcomes)" />
                <RoleItem text="AI Tutor with curriculum context and micro-lesson responses" />
                <RoleItem text="Flashcards with classic, card sheet, and quiz modes" />
                <RoleItem text="Messaging, study groups, and peer review" />
                <RoleItem text="Gamification: XP, streaks, leaderboards, and badges" />
                <RoleItem text="Study Pet companion with fish collection" />
                <RoleItem text="Mini-games: chess, Kahoot, spelling bee, and more" />
              </ul>
            </div>

            {/* Teacher */}
            <div className="rounded-xl p-5 ocean-card hover:neon-border-blue transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF]/10 to-[#8B5CF6]/10 w-fit mb-3">
                <BookOpen className="h-5 w-5 text-[#00BFFF]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm text-white">Teacher</h3>
              <p className="text-xs text-[#C4B5FD] mb-2 font-semibold">11 Specialized Tools:</p>
              <ul className="space-y-2 text-xs text-white/70">
                <RoleItem text="Micro-Lesson Converter (AI-powered, industry first)" />
                <RoleItem text="Lesson Plan Builder (AI-assisted, curriculum-aligned)" />
                <RoleItem text="Report Card Comments (AI-generated)" />
                <RoleItem text="Offline Gradebook with category weighting and CSV export" />
                <RoleItem text="Rubric Builder: create, manage, and share" />
                <RoleItem text="Seating Chart: drag-and-drop with PDF export" />
                <RoleItem text="Weekly Planner: week-at-a-glance editor" />
                <RoleItem text="Observation Notes for quick student captures" />
                <RoleItem text="Classroom Tools: projection timer, random picker" />
                <RoleItem text="Parent Communication: email templates and updates" />
                <RoleItem text="Curriculum Tracker: standards coverage with PDF export" />
                <RoleItem text="Assignment creation with rubrics and peer review setup" />
                <RoleItem text="Student insights dashboard with engagement metrics" />
              </ul>
            </div>

            {/* Parent */}
            <div className="rounded-xl p-5 ocean-card hover:neon-border-blue transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#34D399]/10 to-[#00BFFF]/10 w-fit mb-3">
                <Users className="h-5 w-5 text-[#34D399]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm text-white">Parent</h3>
              <ul className="space-y-2 text-xs text-white/70">
                <RoleItem text="Child progress monitoring dashboard" />
                <RoleItem text="Course grades and assignment tracking" />
                <RoleItem text="Attendance visibility" />
                <RoleItem text="Teacher communication (messaging)" />
                <RoleItem text="Weekly digest emails" />
                <RoleItem text="Conference scheduling" />
                <RoleItem text="Customizable notification preferences" />
                <RoleItem text="COPPA-compliant data access (age-appropriate)" />
              </ul>
            </div>

            {/* School Admin */}
            <div className="rounded-xl p-5 ocean-card hover:neon-border-blue transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#D97706]/10 to-[#F59E0B]/10 w-fit mb-3">
                <Building2 className="h-5 w-5 text-[#D97706]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm text-white">Admin</h3>
              <ul className="space-y-2 text-xs text-white/70">
                <RoleItem text="User management with bulk import" />
                <RoleItem text="Academic calendar setup" />
                <RoleItem text="School-wide announcements" />
                <RoleItem text="Audit logs and compliance tracking" />
                <RoleItem text="Analytics dashboard (engagement, completion, performance)" />
                <RoleItem text="Class section management" />
                <RoleItem text="Report card administration" />
              </ul>
            </div>

            {/* Super Admin */}
            <div className="rounded-xl p-5 ocean-card hover:neon-border-blue transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#FF6B9D]/10 to-[#8B5CF6]/10 w-fit mb-3">
                <Shield className="h-5 w-5 text-[#FF6B9D]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm text-white">Super Admin</h3>
              <ul className="space-y-2 text-xs text-white/70">
                <RoleItem text="Multi-school management" />
                <RoleItem text="Cross-school analytics and reporting" />
                <RoleItem text="Global configuration and settings" />
                <RoleItem text="School creation and onboarding" />
                <RoleItem text="System-wide audit logs" />
              </ul>
            </div>

            {/* AI Features */}
            <div className="rounded-xl p-5 ocean-card hover:neon-border-blue transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF]/10 to-[#8B5CF6]/10 w-fit mb-3">
                <Bot className="h-5 w-5 text-[#00BFFF]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm text-white">6 AI-Powered Tools</h3>
              <p className="text-xs text-[#C4B5FD] mb-2 font-semibold">All on-device via Apple Intelligence</p>
              <ul className="space-y-2 text-xs text-white/70">
                <RoleItem text="AI Tutor: contextual chat with curriculum awareness" />
                <RoleItem text="AI Search: natural language across all content" />
                <RoleItem text="Micro-Lesson Converter: any text to micro-lessons" />
                <RoleItem text="Lesson Plan Builder: curriculum-aligned plans" />
                <RoleItem text="Report Card Comments: AI-generated" />
                <RoleItem text="Content Moderation: automatic filtering" />
              </ul>
              <p className="text-xs text-white/50 mt-3">Requires iOS 26+ with Apple FoundationModels. Student data never leaves the device.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Features Grid */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              A complete suite of tools designed for K-12 education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={Brain} title="Micro-Lesson System" description="Research-backed cognitive load theory format: hook, lesson, comparison, reading timer, and gated quiz. Every piece of content follows this structure." highlight tag="Industry First" />
            <FeatureCard icon={BookOpen} title="72 Original Textbooks" description="WolfWhale Books: 288+ chapters with interactive content, flashcards, and 6 activity types. Full SK K-12 coverage." />
            <FeatureCard icon={ClipboardCheck} title="Quiz Builder" description="Multiple choice, true/false, fill-blank, matching, essay. Timed quizzes with instant grading and micro-lesson explanations for wrong answers." />
            <FeatureCard icon={BarChart3} title="Gradebook" description="Category weighting, grade curves, CSV import/export, SIS integration. Transcript export and predicted grades." />
            <FeatureCard icon={Bot} title="6 AI Tools (On-Device)" description="AI Tutor, micro-lesson converter, lesson plan builder, report card comments, AI search, and content moderation. Apple Intelligence — zero API cost, full privacy." />
            <FeatureCard icon={WifiOff} title="Offline Mode" description="Full course and textbook access offline. AES-GCM encrypted. Auto sync on reconnect." />
            <FeatureCard icon={Trophy} title="Gamification" description="XP system, streaks, leaderboards, and 10+ badge types with rarity tiers (Common, Rare, Epic, Legendary)." />
            <FeatureCard icon={Dog} title="Study Pet" description="Tamagotchi-style companion that grows as you learn. Fish collection system." />
            <FeatureCard icon={Puzzle} title="6 Interactive Activities" description="Matching, sorting, fill-in-the-blank, labeling, sequencing, and PencilKit drawing. Built into textbooks and assignable by teachers." />
            <FeatureCard icon={Eye} title="AR Experiences" description="Augmented reality across 8 subject categories. Human cell AR visualization and more." />
            <FeatureCard icon={Wrench} title="100+ Learning Tools" description="Periodic table, fraction builder, geometry explorer, unit converter, human body diagram, world map quiz, typing tutor, and more." />
            <FeatureCard icon={CalendarCheck} title="Attendance" description="Daily tracking with pattern alerts. Conference scheduling for teachers and parents." />
            <FeatureCard icon={Users} title="Parent Dashboard" description="Grades, attendance, assignments, and teacher messaging. Weekly digest emails. COPPA-compliant." />
            <FeatureCard icon={Gamepad2} title="Educational Games" description="Chess, Kahoot integration, French vocabulary, spelling bee, grammar quest, math quiz, typing tutor, word builder." />
            <FeatureCard icon={MessageSquare} title="Messaging & Collaboration" description="Real-time chat, study groups, peer review with anonymous rubric-based feedback. SharePlay support." />
            <FeatureCard icon={LayoutDashboard} title="5 Role Dashboards" description="Purpose-built views for Student, Teacher, Parent, Admin, and Super Admin." />
            <FeatureCard icon={Moon} title="Dark & Light Mode" description="Smooth theme switching. iOS Widgets for assignments, grades, schedule, study pet, and dashboard." />
            <FeatureCard icon={Bell} title="Smart Notifications" description="Real-time alerts for grades, assignments, and messages. Live Activities support." />
            <FeatureCard icon={Shield} title="COPPA, FERPA & PIPEDA" description="Full compliance with age-based parental consent, data minimization, audit logging, certificate pinning, and on-device AI." />
            <FeatureCard icon={Building2} title="Multi-Tenant" description="Per-school data isolation with row-level security. Custom branding. Multi-school management for Super Admins." />
            <FeatureCard icon={Smartphone} title="Native iOS/iPadOS" description="Built in SwiftUI. iPad-optimized layouts. Spotlight search, Wallet pass, Live Activities, and iOS Widgets." />
            <FeatureCard icon={Accessibility} title="Full Accessibility" description="VoiceOver, Dynamic Type, high contrast, color blindness filters, speech-to-text, keyboard navigation, haptic feedback, biometric auth." />
          </div>
        </div>
      </section>

      {/* Gamification Detail */}
      <section className="relative z-10 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Gamification & Engagement</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Students stay motivated through meaningful game mechanics tied to real learning
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl p-5 ocean-card text-center">
              <Trophy className="h-8 w-8 text-[#FFD700] mx-auto mb-3" />
              <h3 className="font-semibold text-sm text-white mb-2">XP & Streaks</h3>
              <p className="text-xs text-white/60">Earn points for assignments, quizzes, lessons, and skill mastery. Daily streaks for consistency.</p>
            </div>
            <div className="rounded-xl p-5 ocean-card text-center">
              <BarChart3 className="h-8 w-8 text-[#00BFFF] mx-auto mb-3" />
              <h3 className="font-semibold text-sm text-white mb-2">Leaderboards</h3>
              <p className="text-xs text-white/60">Class-wide XP rankings drive friendly competition and motivation.</p>
            </div>
            <div className="rounded-xl p-5 ocean-card text-center">
              <Sparkles className="h-8 w-8 text-[#8B5CF6] mx-auto mb-3" />
              <h3 className="font-semibold text-sm text-white mb-2">Badges</h3>
              <p className="text-xs text-white/60">10+ types with rarity tiers: Common, Rare, Epic, Legendary. First Assignment, Quiz Master, Perfect Score, and more.</p>
            </div>
            <div className="rounded-xl p-5 ocean-card text-center">
              <Dog className="h-8 w-8 text-[#34D399] mx-auto mb-3" />
              <h3 className="font-semibold text-sm text-white mb-2">Study Pet</h3>
              <p className="text-xs text-white/60">Tamagotchi-style companion that students care for through learning. Fish collection system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRC Calls to Action */}
      <section className="relative z-10 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D97706]/10 border border-[#D97706]/20 mb-6">
              <Heart className="h-4 w-4 text-[#D97706]" />
              <span className="text-sm text-white/80">Advancing Reconciliation Through Technology</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Supporting TRC Calls to Action</h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              WolfWhale supports the Truth and Reconciliation Commission&apos;s Education Calls to Action (6-12), helping schools deliver culturally responsive education through technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: '#6', title: 'Eliminate Education Gaps', desc: 'Offline learning mode ensures students in remote and rural communities have full access to courses, flashcards, and study materials — even without internet connectivity.' },
              { num: '#7', title: 'Culturally Appropriate Curricula', desc: 'Culturally responsive content templates and flexible course builders allow educators to create curricula that reflect Indigenous perspectives, traditions, and ways of knowing.' },
              { num: '#8', title: 'Indigenous Language Instruction', desc: 'Built-in support for Indigenous language content through spaced repetition flashcards and multimedia lessons, enabling language revitalization programs.' },
              { num: '#9', title: 'Residential Schools History', desc: 'Ready-to-use course modules on residential schools history, designed to be age-appropriate and delivered through interactive lessons.' },
              { num: '#10', title: 'Share Best Practices', desc: 'Community-driven content creation and Indigenous educator collaboration tools allow schools to share teaching resources and successful models.' },
              { num: '#11', title: 'Teacher Training', desc: 'Professional development courses on Indigenous knowledge systems and First Nations pedagogical approaches, delivered within the platform.' },
            ].map(({ num, title, desc }) => (
              <div key={num} className="rounded-2xl p-6 ocean-card hover:neon-border-blue transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#D97706]/15 text-[#D97706] font-bold text-sm">{num}</div>
                  <h3 className="font-semibold text-base text-white">{title}</h3>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-white/60 max-w-2xl mx-auto italic">
              WolfWhale is committed to supporting reconciliation through technology. Indigenous connections are woven throughout all 72 textbooks and the curriculum mapping system.
            </p>
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section className="relative z-10 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Business Model</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Simple, transparent pricing. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl p-6 ocean-card text-center">
              <GraduationCap className="h-8 w-8 text-[#34D399] mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Teachers</h3>
              <p className="text-lg font-bold text-[#34D399]">Free</p>
              <p className="text-xs text-white/60 mt-1">Full access to all features</p>
            </div>
            <div className="rounded-xl p-6 ocean-card text-center">
              <Building2 className="h-8 w-8 text-[#00BFFF] mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Schools</h3>
              <p className="text-lg font-bold text-[#00BFFF]">$12/user/month</p>
              <p className="text-xs text-white/60 mt-1">Student, parent, and admin accounts</p>
            </div>
            <div className="rounded-xl p-6 ocean-card text-center">
              <Users className="h-8 w-8 text-[#8B5CF6] mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Homeschool</h3>
              <p className="text-lg font-bold text-[#8B5CF6]">Available</p>
              <p className="text-xs text-white/60 mt-1">Individual family purchase</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-white/60">Saskatchewan first, then Canada, then global. 1-year minimum contract. Volume discounts for school boards.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pricing</h2>
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
            One plan. All features. No hidden fees.
          </p>

          <div className="rounded-2xl p-10 ocean-card max-w-2xl mx-auto neon-border-blue">
            <div className="space-y-8">
              <div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#8B5CF6] bg-clip-text text-transparent">$12</span>
                  <span className="text-lg text-white/70">CAD</span>
                </div>
                <p className="text-white/70 mt-2">per user account, per month</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full ocean-card">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF]" />
                  <span className="text-white/70">All features included</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full ocean-card">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF]" />
                  <span className="text-white/70">1-year minimum contract</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full ocean-card">
                  <CheckCircle2 className="h-4 w-4 text-[#34D399]" />
                  <span className="text-white/70">Teachers: FREE</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left text-sm max-w-lg mx-auto">
                {[
                  '72 original textbooks',
                  'Micro-lesson system',
                  'AI Tutor & converter',
                  '100+ learning tools',
                  'Full offline mode',
                  'Gamification & XP',
                  'Study Pet companion',
                  'Parent portal',
                  'Attendance tracking',
                  'Real-time messaging',
                  'Interactive activities',
                  'COPPA, FERPA & PIPEDA',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#00BFFF] flex-shrink-0" />
                    <span className="text-white/70">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-4">
                <a
                  href="mailto:info@wolfwhale.ca?subject=Wolf%20Whale%20LMS%20-%20Get%20Started"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl btn-chrome-3d-blue text-white transition-all font-bold group"
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

      {/* Platform & Technical */}
      <section className="relative z-10 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Platform & Technical</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: 'Native iOS/iPadOS (SwiftUI)', icon: Smartphone },
              { label: 'iOS 17+ required', icon: Monitor },
              { label: 'iOS 26+ for AI features', icon: Bot },
              { label: 'iPad-optimized layouts', icon: LayoutDashboard },
              { label: 'iOS Widgets (5 types)', icon: LayoutDashboard },
              { label: 'Offline with auto sync', icon: WifiOff },
              { label: 'Real-time messaging', icon: MessageSquare },
              { label: 'SharePlay support', icon: Users },
              { label: 'Spotlight search', icon: Eye },
              { label: 'Wallet pass (school IDs)', icon: Shield },
              { label: 'Live Activities', icon: Bell },
              { label: '682 curriculum outcomes', icon: BookOpen },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl p-4 ocean-card">
                <Icon className="h-4 w-4 text-[#00BFFF] flex-shrink-0" />
                <span className="text-xs text-white/70">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 backdrop-blur-md bg-black/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="WolfWhale" width={56} height={56} className="rounded-xl object-contain shadow-lg shadow-purple-500/20" />
                <div>
                  <h3 className="font-display font-bold tracking-wider uppercase text-white">WolfWhale</h3>
                  <p className="text-xs text-white/70 font-display tracking-widest uppercase">K-12 Learning Management System</p>
                </div>
              </div>
              <p className="text-sm text-white/70 max-w-md mb-3">
                The only LMS with AI-powered micro-lesson conversion, 72 original textbooks, on-device AI tutoring, and a visual curriculum constellation. Built for Canadian schools, designed for the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 text-sm text-white/70">
                <a href="mailto:info@wolfwhale.ca" className="flex items-center gap-1.5 hover:text-[#00BFFF] transition-colors">
                  <Mail className="h-3.5 w-3.5" /> info@wolfwhale.ca
                </a>
                <a href="tel:+13069815926" className="flex items-center gap-1.5 hover:text-[#00BFFF] transition-colors">
                  <Phone className="h-3.5 w-3.5" /> +1 (306) 981-5926
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm text-white">Product</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link href="/#features" className="hover:text-[#00BFFF] transition-colors">Features</Link></li>
                <li><a href="#pricing" className="hover:text-[#00BFFF] transition-colors">Pricing</a></li>
                <li><Link href="/" className="hover:text-[#00BFFF] transition-colors">Home</Link></li>
                <li><a href="mailto:info@wolfwhale.ca" className="hover:text-[#00BFFF] transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link href="/privacy" className="hover:text-[#00BFFF] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#00BFFF] transition-colors">Terms of Service</Link></li>
                <li><Link href="/help" className="hover:text-[#00BFFF] transition-colors">Help Center</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/60">
            <p>&copy; 2026 WolfWhale Inc. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <Image src="/canada-coat-of-arms.png" alt="Coat of Arms of Canada" width={24} height={48} className="h-12 w-auto object-contain" />
              <span className="text-xs font-semibold text-white/70">100% Canadian Owned &amp; Built</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
