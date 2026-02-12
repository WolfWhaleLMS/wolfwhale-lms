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
  Zap,
  Mail,
  Phone,
  ChevronRight,
  CheckCircle2,
  Brain,
  WifiOff,
  Gamepad2,
  Music,
  Moon,
  Bell,
  Dog,
  Monitor,
  Repeat,
  Bot,
  Wifi,
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
}: {
  icon: LucideIcon
  title: string
  description: string
  highlight?: boolean
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
            ? 'from-[#00BFFF]/20 to-[#33FF33]/20'
            : 'from-[#00BFFF]/10 to-[#33FF33]/10'
        }`}
      >
        <Icon className={`h-6 w-6 ${highlight ? 'text-[#33FF33]' : 'text-[#00BFFF]'}`} />
      </div>
      <h3 className={`font-semibold mb-3 ${highlight ? 'text-2xl' : 'text-xl'}`}>
        {title}
        {highlight && (
          <span className="ml-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#33FF33]/15 text-[#0A8020] text-xs font-bold uppercase tracking-wider border border-[#33FF33]/30">
            <Sparkles className="h-3 w-3" />
            Only on WolfWhale
          </span>
        )}
      </h3>
      <p className={`text-[#0A2540]/80 leading-relaxed ${highlight ? 'text-base max-w-3xl' : 'text-sm'}`}>
        {description}
      </p>
    </div>
  )
}

/* ============================================
   Screenshot Placeholder Card Component
   ============================================ */
function ScreenshotCard({
  icon: Icon,
  title,
  subtitle,
  description,
  gradientFrom,
  gradientTo,
}: {
  icon: LucideIcon
  title: string
  subtitle: string
  description: string
  gradientFrom: string
  gradientTo: string
}) {
  return (
    <div className="rounded-2xl overflow-hidden ocean-card group hover:neon-border-blue transition-all">
      <div className="flex items-center gap-3 p-5 border-b border-[#00BFFF]/10">
        <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF] to-[#33FF33] text-white">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-xs text-[#0A2540]/80">{subtitle}</p>
        </div>
      </div>
      {/* Glass placeholder with gradient + icon where screenshot will go */}
      <div
        className="relative h-56 md:h-64 flex flex-col items-center justify-center gap-4 p-6"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}18, ${gradientTo}12, ${gradientFrom}08)`,
        }}
      >
        {/* Decorative grid dots */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #0A2540 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          className="relative p-5 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}25, ${gradientTo}15)`,
          }}
        >
          <Icon className="h-10 w-10 text-white drop-shadow-lg" />
        </div>
        <div className="relative text-center">
          <p className="text-sm font-semibold text-[#0A2540]/70">{description}</p>
          <p className="text-xs text-[#0A2540]/50 mt-1">Screenshot coming soon</p>
        </div>
      </div>
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
   Main Info Page
   ============================================ */
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
            <Image src="/logo.png" alt="WolfWhale" width={56} height={56} className="rounded-xl object-contain shadow-lg border-2 border-black" />
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
            Spaced repetition flashcards, AI tutoring, offline learning, gamification, and complete course management -- all in one platform. Empower teachers, engage students, and connect parents.
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

      {/* USP Highlight — Spaced Repetition Flashcards */}
      <section className="relative z-10 py-16 bg-white/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#33FF33]/10 border border-[#33FF33]/25 mb-4">
              <Brain className="h-4 w-4 text-[#33FF33]" />
              <span className="text-sm font-semibold text-[#0A2540]/80">What Sets Us Apart</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Spaced Repetition Flashcards</h2>
            <p className="text-lg text-[#0A2540]/80 max-w-3xl mx-auto">
              The only LMS with a built-in SM-2 spaced repetition system. Students retain more, study smarter, and see measurable improvements in long-term memory -- a feature no competitor offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="rounded-2xl p-6 ocean-card text-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#33FF33]/15 to-[#00BFFF]/10 w-fit mx-auto mb-4">
                <Repeat className="h-7 w-7 text-[#33FF33]" />
              </div>
              <h3 className="font-semibold mb-2">SM-2 Algorithm</h3>
              <p className="text-sm text-[#0A2540]/80">
                Scientifically proven spaced repetition scheduling adjusts review intervals based on how well each student knows the material.
              </p>
            </div>
            <div className="rounded-2xl p-6 ocean-card text-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#33FF33]/15 to-[#00BFFF]/10 w-fit mx-auto mb-4">
                <Brain className="h-7 w-7 text-[#33FF33]" />
              </div>
              <h3 className="font-semibold mb-2">Long-Term Retention</h3>
              <p className="text-sm text-[#0A2540]/80">
                Students review at optimal intervals so knowledge moves from short-term to long-term memory. Less cramming, better results.
              </p>
            </div>
            <div className="rounded-2xl p-6 ocean-card text-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#33FF33]/15 to-[#00BFFF]/10 w-fit mx-auto mb-4">
                <Sparkles className="h-7 w-7 text-[#33FF33]" />
              </div>
              <h3 className="font-semibold mb-2">XP Integration</h3>
              <p className="text-sm text-[#0A2540]/80">
                Flashcard reviews earn XP, feeding into the gamification system. Students stay motivated as studying directly levels up their profile.
              </p>
            </div>
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
            {/* Interactive Courses */}
            <FeatureCard
              icon={BookOpen}
              title="Interactive Courses"
              description="Create courses with modules and lessons using our rich lesson builder. Content blocks for text, headings, images, and video make building engaging lessons intuitive and fast."
            />

            {/* Quiz Builder */}
            <FeatureCard
              icon={ClipboardCheck}
              title="Quiz Builder"
              description="Build quizzes with multiple question types: multiple choice, true/false, short answer, and essay. Auto-grading support and detailed analytics for student performance."
            />

            {/* Gradebook */}
            <FeatureCard
              icon={BarChart3}
              title="Gradebook & Grade Tracking"
              description="Traditional weighted gradebook with A-F grading, category weighting, grade statistics, and CSV/PDF export. Full control over grading policies and late work handling."
            />

            {/* AI Tutor */}
            <FeatureCard
              icon={Bot}
              title="AI Tutor (WebLLM)"
              description="Intelligent tutoring powered by WebLLM that runs entirely in the browser. Zero API costs, full student privacy, and instant help whenever students need it -- no data leaves the device."
            />

            {/* Offline Mode */}
            <FeatureCard
              icon={WifiOff}
              title="Full Offline Mode"
              description="Study anywhere with complete offline support powered by IndexedDB storage. Lessons, flashcards, and progress sync automatically when connectivity returns."
            />

            {/* Gamification */}
            <FeatureCard
              icon={Trophy}
              title="Gamification"
              description="XP system with levels, achievements, badges, leaderboards, and streak tracking. Motivate students through friendly competition and recognition of consistent effort."
            />

            {/* Virtual Pet Companions */}
            <FeatureCard
              icon={Dog}
              title="Virtual Pet Companions"
              description="Students adopt virtual pets that evolve and grow as they learn. Pets level up through study activity, creating a fun, nurturing motivation loop alongside academic progress."
            />

            {/* Attendance Tracking */}
            <FeatureCard
              icon={CalendarCheck}
              title="Attendance Tracking"
              description="Daily attendance with present, absent, tardy, and excused statuses. Pattern detection alerts teachers and parents to potential issues before they escalate."
            />

            {/* Parent Dashboard */}
            <FeatureCard
              icon={Users}
              title="Parent Dashboard"
              description="At-a-glance visual dashboard with grade dials, attendance gauges, upcoming assignments, and easy teacher messaging. Keep parents engaged and informed about their child's progress."
            />

            {/* Student Tools */}
            <FeatureCard
              icon={Gamepad2}
              title="Student Tools"
              description="Chess, mini-games, and a dedicated study mode with focus timers and DND. Students earn XP for study sessions, building healthy habits while having fun."
            />

            {/* Study Music Radio */}
            <FeatureCard
              icon={Music}
              title="Study Music Radio"
              description="Built-in ambient music radio player to help students stay focused during study sessions. Lo-fi beats, nature sounds, and focus tracks available at the click of a button."
            />

            {/* Real-Time Notifications */}
            <FeatureCard
              icon={Bell}
              title="Real-Time Notifications"
              description="Instant notifications for assignments, grades, messages, and school announcements. Students, teachers, and parents stay in the loop with real-time updates."
            />

            {/* Role-Based Dashboards */}
            <FeatureCard
              icon={LayoutDashboard}
              title="Role-Based Dashboards"
              description="Tailored experiences for students, teachers, parents, and administrators. Each role sees exactly the tools and information most relevant to their needs."
            />

            {/* Dark/Light Mode */}
            <FeatureCard
              icon={Moon}
              title="Dark & Light Mode"
              description="Full dark and light theme support with smooth transitions. Comfortable viewing in any environment -- classrooms, libraries, or late-night study sessions."
            />

            {/* Compliance */}
            <FeatureCard
              icon={Shield}
              title="FERPA & PIPEDA Compliant"
              description="Built from the ground up with student privacy and security in mind. Full audit logging, data export, and compliance with FERPA, COPPA, and PIPEDA regulations."
            />

            {/* Multi-Tenant */}
            <FeatureCard
              icon={Building2}
              title="Multi-Tenant Architecture"
              description="Each school gets their own subdomain with isolated data, custom branding, and independent settings. Secure, scalable, and fully customizable per institution."
            />

            {/* Real-Time Messaging */}
            <FeatureCard
              icon={MessageSquare}
              title="Real-Time Messaging"
              description="Direct messages, group conversations, and class discussions with real-time delivery. File sharing, typing indicators, read receipts, and message search built in."
            />

            {/* Mobile Responsive */}
            <FeatureCard
              icon={Monitor}
              title="Mobile Responsive"
              description="Fully responsive design that works beautifully on desktops, tablets, and phones. Students and teachers can access everything from any device, anywhere."
            />
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
            <ScreenshotCard
              icon={GraduationCap}
              title="Student Dashboard"
              subtitle="Your learning command center"
              description="Performance gauges, upcoming tasks, enrolled classes, XP progress, and virtual pet status"
              gradientFrom="#00BFFF"
              gradientTo="#33FF33"
            />

            {/* Teacher Dashboard */}
            <ScreenshotCard
              icon={BookOpen}
              title="Teacher Dashboard"
              subtitle="Manage courses and students"
              description="Course management, gradebook overview, student analytics, and attendance tracking"
              gradientFrom="#00BFFF"
              gradientTo="#8B5CF6"
            />

            {/* AI Tutor */}
            <ScreenshotCard
              icon={Bot}
              title="AI Tutor"
              subtitle="Browser-based intelligent tutoring"
              description="WebLLM-powered AI tutor running entirely in the browser -- zero API cost, full privacy"
              gradientFrom="#33FF33"
              gradientTo="#00BFFF"
            />

            {/* Offline Mode */}
            <ScreenshotCard
              icon={Wifi}
              title="Offline Mode"
              subtitle="Study anywhere, anytime"
              description="Full offline support with IndexedDB storage and automatic sync when back online"
              gradientFrom="#FFAA00"
              gradientTo="#00BFFF"
            />
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
                <RoleItem text="View courses & lessons" />
                <RoleItem text="Spaced repetition flashcards" />
                <RoleItem text="Take quizzes & submit work" />
                <RoleItem text="Earn XP, badges & streaks" />
                <RoleItem text="AI Tutor for instant help" />
                <RoleItem text="Virtual pet companion" />
                <RoleItem text="Chess, mini-games & study tools" />
                <RoleItem text="Study music radio" />
                <RoleItem text="Full offline study mode" />
              </ul>
            </div>

            {/* Teacher */}
            <div className="rounded-xl p-5 ocean-card hover:neon-border-blue transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-3">
                <BookOpen className="h-5 w-5 text-[#00BFFF]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm">Teacher</h3>
              <ul className="space-y-2 text-xs text-[#0A2540]/80">
                <RoleItem text="Create courses & modules" />
                <RoleItem text="Rich lesson builder with content blocks" />
                <RoleItem text="Build quizzes (multiple types)" />
                <RoleItem text="Create flashcard decks" />
                <RoleItem text="Gradebook & grade management" />
                <RoleItem text="Track attendance" />
                <RoleItem text="Student analytics" />
                <RoleItem text="Message students & parents" />
              </ul>
            </div>

            {/* Parent */}
            <div className="rounded-xl p-5 ocean-card hover:neon-border-blue transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-3">
                <Users className="h-5 w-5 text-[#00BFFF]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm">Parent</h3>
              <ul className="space-y-2 text-xs text-[#0A2540]/80">
                <RoleItem text="Monitor child grades & progress" />
                <RoleItem text="View attendance patterns" />
                <RoleItem text="See upcoming assignments" />
                <RoleItem text="Track XP & achievements" />
                <RoleItem text="Message teachers directly" />
                <RoleItem text="Receive real-time alerts" />
                <RoleItem text="Visual performance dashboards" />
              </ul>
            </div>

            {/* School Admin */}
            <div className="rounded-xl p-5 ocean-card hover:neon-border-blue transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF]/10 to-[#33FF33]/10 w-fit mb-3">
                <Building2 className="h-5 w-5 text-[#00BFFF]" />
              </div>
              <h3 className="font-semibold mb-3 text-sm">School Admin</h3>
              <ul className="space-y-2 text-xs text-[#0A2540]/80">
                <RoleItem text="Manage all users & roles" />
                <RoleItem text="Configure school settings" />
                <RoleItem text="View school-wide reports" />
                <RoleItem text="Bulk enrollment" />
                <RoleItem text="Custom branding & subdomain" />
                <RoleItem text="Audit logs & compliance" />
                <RoleItem text="System monitoring" />
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
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]"></div>
                    WebLLM for on-device AI
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]"></div>
                    IndexedDB for offline storage
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
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]"></div>
                    Multi-tenant data isolation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]"></div>
                    FERPA & PIPEDA audit logging
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
              <div className="grid grid-cols-2 gap-3 text-left text-sm max-w-lg mx-auto">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Unlimited courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Spaced repetition flashcards</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">AI Tutor (zero API cost)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Full offline mode</span>
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
                  <span className="text-[#0A2540]/80">Virtual pet companions</span>
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
                  <span className="text-[#0A2540]/80">Real-time messaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Custom branding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00BFFF] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">FERPA & PIPEDA compliant</span>
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
                <Image src="/logo.png" alt="WolfWhale" width={56} height={56} className="rounded-xl object-contain shadow-lg border-2 border-black" />
                <div>
                  <h3 className="font-display font-bold tracking-wider uppercase">WolfWhale</h3>
                  <p className="text-xs text-[#0A2540]/80 font-display tracking-widest uppercase">Modern K-12 & Post-Secondary Learning Platform</p>
                </div>
              </div>
              <p className="text-sm text-[#0A2540]/80 max-w-md mb-3">
                Empowering schools with a comprehensive learning management system designed for K-12 and post-secondary education. Featuring the only built-in spaced repetition system and browser-based AI tutoring.
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
