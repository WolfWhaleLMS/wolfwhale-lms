import Link from 'next/link'
import Image from 'next/image'
import { DemoLoginButtons } from '@/components/auth/DemoLoginButtons'
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
  Music,
  Moon,
  Bell,
  Dog,
  Monitor,
  Bot,
  Heart,
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
        <Icon className={`h-6 w-6 ${highlight ? 'text-[#33FF33]' : 'text-[#0077B6]'}`} />
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
   Role Capability Item
   ============================================ */
function RoleItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="h-3 w-3 text-[#0077B6] mt-0.5 flex-shrink-0" />
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
          <Image src="/chrome-bg-2.jpg" alt="" fill sizes="100vw" className="object-cover opacity-20" priority />
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

        {/* Floating bubble particles */}
        <div className="bubble-float absolute left-[10%] top-[15%] h-3 w-3 rounded-full bg-[#00BFFF]/10" style={{ animationDelay: '0s' }} />
        <div className="bubble-float absolute left-[25%] top-[70%] h-5 w-5 rounded-full bg-[#00FFFF]/8" style={{ animationDelay: '-3s' }} />
        <div className="bubble-float absolute left-[55%] top-[20%] h-2 w-2 rounded-full bg-[#00BFFF]/10" style={{ animationDelay: '-5s' }} />
        <div className="bubble-float absolute left-[80%] top-[60%] h-4 w-4 rounded-full bg-[#00FFFF]/8" style={{ animationDelay: '-8s' }} />
        <div className="bubble-float absolute left-[40%] top-[85%] h-6 w-6 rounded-full bg-[#00BFFF]/10" style={{ animationDelay: '-2s' }} />
        <div className="bubble-float absolute left-[70%] top-[10%] h-3 w-3 rounded-full bg-[#00FFFF]/8" style={{ animationDelay: '-11s' }} />
        <div className="bubble-float absolute left-[15%] top-[45%] h-4 w-4 rounded-full bg-[#00BFFF]/10" style={{ animationDelay: '-6s' }} />
        <div className="bubble-float absolute left-[90%] top-[35%] h-2 w-2 rounded-full bg-[#00FFFF]/8" style={{ animationDelay: '-9s' }} />
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
            className="px-6 py-2.5 rounded-lg btn-chrome-3d-blue text-white transition-all text-sm font-bold"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00BFFF]/10 border border-[#00BFFF]/20 mb-6">
            <Sparkles className="h-4 w-4 text-[#0077B6]" />
            <span className="text-sm text-[#0A2540]/80">The Modern K-12 & Post-Secondary Learning Platform</span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-display font-extrabold mb-6 tracking-wider leading-tight"
            style={{
              background: 'linear-gradient(to right, #00BFFF, #33FF33)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '3px rgba(0,0,0,0.6)',
              filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))',
            }}
          >
            WOLFWHALE
          </h1>

          <p className="text-lg md:text-xl text-[#0A2540]/80 mb-6 tracking-[0.15em] uppercase font-display font-bold"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.10)' }}
          >
            Learning Management System
          </p>
          <p className="text-xl md:text-2xl text-[#0A2540]/80 mb-4 max-w-3xl mx-auto">
            Innovating the most important tool in education
          </p>

          <p className="text-base md:text-lg text-[#0A2540]/80 mb-6 max-w-2xl mx-auto">
            Browser-based AI tutoring. Spaced repetition flashcards. Full offline mode. No other LMS has these.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="#pricing"
              className="px-8 py-4 rounded-xl btn-chrome-3d-blue text-white transition-all font-bold flex items-center gap-2 group"
            >
              Request a Demo
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl btn-chrome-3d-silver transition-all font-bold"
            >
              Login to Your School
            </Link>
          </div>

        </div>
      </section>

      {/* Dashboard Previews */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Every Role</h2>
            <p className="text-lg text-[#0A2540]/80 max-w-2xl mx-auto mb-8">
              Tailored experiences for students, teachers, parents, and administrators
            </p>

            {/* One-Click Demo Accounts */}
            <div className="max-w-2xl mx-auto">
              <div className="rounded-2xl p-6 ocean-card">
                <DemoLoginButtons />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Dashboard */}
            <div className="rounded-2xl overflow-hidden ocean-card group hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 p-5 border-b border-[#00BFFF]/10">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF] to-[#33FF33] text-white">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Student Dashboard</h3>
                  <p className="text-xs text-[#0A2540]/80">Your learning command center</p>
                </div>
              </div>
              <div className="relative">
                <Image src="/screenshots/student-dashboard.png" alt="Student Dashboard — performance gauges, courses, tasks, XP, and virtual pets" width={1440} height={900} sizes="(max-width: 768px) 100vw, 50vw" className="w-full h-auto" />
              </div>
            </div>

            {/* Teacher Dashboard */}
            <div className="rounded-2xl overflow-hidden ocean-card group hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 p-5 border-b border-[#00BFFF]/10">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#00BFFF] to-[#8B5CF6] text-white">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Teacher Dashboard</h3>
                  <p className="text-xs text-[#0A2540]/80">Manage courses and students</p>
                </div>
              </div>
              <div className="relative">
                <Image src="/screenshots/teacher-dashboard.png" alt="Teacher Dashboard — courses, gradebook, students, and quick actions" width={1440} height={900} sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" className="w-full h-auto" />
              </div>
            </div>

            {/* Parent Dashboard */}
            <div className="rounded-2xl overflow-hidden ocean-card group hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 p-5 border-b border-[#00BFFF]/10">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#00FFFF] to-[#00BFFF] text-white">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Parent Dashboard</h3>
                  <p className="text-xs text-[#0A2540]/80">Monitor your child&apos;s progress</p>
                </div>
              </div>
              <div className="relative">
                <Image src="/screenshots/parent-dashboard.png" alt="Parent Dashboard — grades, attendance, assignments, and child progress" width={1440} height={900} sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" className="w-full h-auto" />
              </div>
            </div>

            {/* Admin Dashboard */}
            <div className="rounded-2xl overflow-hidden ocean-card group hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 p-5 border-b border-[#00BFFF]/10">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#D97706] to-[#F59E0B] text-white">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Admin Dashboard</h3>
                  <p className="text-xs text-[#0A2540]/80">School overview and management</p>
                </div>
              </div>
              <div className="relative">
                <Image src="/screenshots/admin-dashboard.png" alt="Admin Dashboard — school health, enrollment, users, and system settings" width={1440} height={900} sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four User Roles */}
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
                <GraduationCap className="h-5 w-5 text-[#0077B6]" />
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
                <BookOpen className="h-5 w-5 text-[#0077B6]" />
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
                <Users className="h-5 w-5 text-[#0077B6]" />
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
                <Building2 className="h-5 w-5 text-[#0077B6]" />
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

      {/* Features Grid */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-lg text-[#0A2540]/80 max-w-2xl mx-auto">
              A complete suite of tools designed for K-12 and post-secondary education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={BookOpen} title="Interactive Courses" description="Modules, lessons, and rich content blocks — text, images, and video." />
            <FeatureCard icon={ClipboardCheck} title="Quiz Builder" description="Multiple choice, true/false, short answer, essay. Auto-grading included." />
            <FeatureCard icon={BarChart3} title="Gradebook" description="Weighted grades, A-F scale, category stats, CSV/PDF export." />
            <FeatureCard icon={Bot} title="AI Tutor (WebLLM)" description="Runs in-browser. Zero API costs, full privacy — no data leaves the device." />
            <FeatureCard icon={WifiOff} title="Offline Mode" description="Study anywhere. Lessons and flashcards sync when you reconnect." />
            <FeatureCard icon={Trophy} title="Gamification" description="XP, levels, badges, leaderboards, and streak tracking." />
            <FeatureCard icon={Dog} title="Virtual Pets" description="Adopt pets that grow as you learn. Study more, level them up." />
            <FeatureCard icon={CalendarCheck} title="Attendance" description="Daily tracking with pattern alerts for teachers and parents." />
            <FeatureCard icon={Users} title="Parent Dashboard" description="Grades, attendance, assignments, and teacher messaging at a glance." />
            <FeatureCard icon={Gamepad2} title="Student Tools" description="Chess, mini-games, focus timers, and study mode with DND." />
            <FeatureCard icon={Music} title="Study Music" description="Ambient lo-fi and focus tracks built right into the platform." />
            <FeatureCard icon={Bell} title="Notifications" description="Real-time alerts for grades, assignments, and messages." />
            <FeatureCard icon={LayoutDashboard} title="Role Dashboards" description="Tailored views for students, teachers, parents, and admins." />
            <FeatureCard icon={Moon} title="Dark & Light Mode" description="Smooth theme switching for any environment." />
            <FeatureCard icon={Shield} title="FERPA & PIPEDA" description="Audit logging, data export, and full regulatory compliance." />
            <FeatureCard icon={Building2} title="Multi-Tenant" description="Per-school subdomains with isolated data and custom branding." />
            <FeatureCard icon={MessageSquare} title="Messaging" description="DMs, group chats, file sharing, and read receipts." />
            <FeatureCard icon={Monitor} title="Mobile Responsive" description="Works on desktop, tablet, and phone — any device, anywhere." />
          </div>
        </div>
      </section>

      {/* TRC Calls to Action */}
      <section className="relative z-10 py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D97706]/10 border border-[#D97706]/20 mb-6">
              <Heart className="h-4 w-4 text-[#D97706]" />
              <span className="text-sm text-[#0A2540]/80">Advancing Reconciliation Through Technology</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Supporting TRC Calls to Action</h2>
            <p className="text-lg text-[#0A2540]/80 max-w-3xl mx-auto">
              WolfWhale is built to support the Truth and Reconciliation Commission&apos;s Education Calls to Action (6-12), helping schools deliver culturally responsive education through technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Call 6 */}
            <div className="rounded-2xl p-6 ocean-card hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#D97706]/15 text-[#D97706] font-bold text-sm">#6</div>
                <h3 className="font-semibold text-base">Eliminate Education Gaps</h3>
              </div>
              <p className="text-sm text-[#0A2540]/80 leading-relaxed">
                Offline learning mode ensures students in remote and rural communities have full access to courses, flashcards, and study materials -- even without internet connectivity.
              </p>
            </div>

            {/* Call 7 */}
            <div className="rounded-2xl p-6 ocean-card hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#D97706]/15 text-[#D97706] font-bold text-sm">#7</div>
                <h3 className="font-semibold text-base">Culturally Appropriate Curricula</h3>
              </div>
              <p className="text-sm text-[#0A2540]/80 leading-relaxed">
                Culturally responsive content templates and flexible course builders allow educators to create curricula that reflect Indigenous perspectives, traditions, and ways of knowing.
              </p>
            </div>

            {/* Call 8 */}
            <div className="rounded-2xl p-6 ocean-card hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#D97706]/15 text-[#D97706] font-bold text-sm">#8</div>
                <h3 className="font-semibold text-base">Indigenous Language Instruction</h3>
              </div>
              <p className="text-sm text-[#0A2540]/80 leading-relaxed">
                Built-in support for Indigenous language content through spaced repetition flashcards and multimedia lessons, enabling language revitalization programs within the platform.
              </p>
            </div>

            {/* Call 9 */}
            <div className="rounded-2xl p-6 ocean-card hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#D97706]/15 text-[#D97706] font-bold text-sm">#9</div>
                <h3 className="font-semibold text-base">Residential Schools History</h3>
              </div>
              <p className="text-sm text-[#0A2540]/80 leading-relaxed">
                Ready-to-use course modules on residential schools history, designed to be age-appropriate and delivered through interactive lessons, ensuring all students learn this essential history.
              </p>
            </div>

            {/* Call 10 */}
            <div className="rounded-2xl p-6 ocean-card hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#D97706]/15 text-[#D97706] font-bold text-sm">#10</div>
                <h3 className="font-semibold text-base">Share Best Practices</h3>
              </div>
              <p className="text-sm text-[#0A2540]/80 leading-relaxed">
                Community-driven content creation and Indigenous educator collaboration tools allow schools to share teaching resources, pedagogical approaches, and successful program models.
              </p>
            </div>

            {/* Call 11 */}
            <div className="rounded-2xl p-6 ocean-card hover:neon-border-blue transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#D97706]/15 text-[#D97706] font-bold text-sm">#11</div>
                <h3 className="font-semibold text-base">Teacher Training</h3>
              </div>
              <p className="text-sm text-[#0A2540]/80 leading-relaxed">
                Professional development courses on Indigenous knowledge systems and First Nations pedagogical approaches, delivered right within the platform teachers already use daily.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-[#0A2540]/70 max-w-2xl mx-auto italic">
              WolfWhale is committed to supporting reconciliation through technology. We believe every student deserves access to education that honors Indigenous ways of knowing and learning.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing</h2>
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
                  <CheckCircle2 className="h-4 w-4 text-[#0077B6]" />
                  <span className="text-[#0A2540]/80">All features included</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full ocean-card">
                  <CheckCircle2 className="h-4 w-4 text-[#0077B6]" />
                  <span className="text-[#0A2540]/80">2-year minimum contract</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full ocean-card">
                  <CheckCircle2 className="h-4 w-4 text-[#0077B6]" />
                  <span className="text-[#0A2540]/80">Single tier</span>
                </div>
              </div>

              {/* What's included */}
              <div className="grid grid-cols-2 gap-3 text-left text-sm max-w-lg mx-auto">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0077B6] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Unlimited courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0077B6] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Spaced repetition flashcards</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0077B6] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">AI Tutor (zero API cost)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0077B6] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Full offline mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0077B6] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Gradebook & reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0077B6] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Gamification & XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0077B6] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Virtual pet companions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0077B6] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Parent portal</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0077B6] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Attendance tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0077B6] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Real-time messaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0077B6] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">Custom branding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0077B6] flex-shrink-0" />
                  <span className="text-[#0A2540]/80">FERPA & PIPEDA compliant</span>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 space-y-4">
                <a
                  href="mailto:info@wolfwhale.ca?subject=Wolf%20Whale%20LMS%20-%20Get%20Started"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl btn-chrome-3d-blue text-white transition-all font-bold group"
                >
                  Get Started
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[#0077B6]">
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
                <a href="mailto:info@wolfwhale.ca" className="flex items-center gap-1.5 hover:text-[#0077B6] transition-colors">
                  <Mail className="h-3.5 w-3.5" /> info@wolfwhale.ca
                </a>
                <a href="tel:+13069815926" className="flex items-center gap-1.5 hover:text-[#0077B6] transition-colors">
                  <Phone className="h-3.5 w-3.5" /> +1 (306) 981-5926
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-[#0A2540]/80">
                <li><a href="#" className="hover:text-[#0077B6] transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-[#0077B6] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[#0077B6] transition-colors">Documentation</a></li>
                <li><Link href="/login" className="hover:text-[#0077B6] transition-colors">Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-[#0A2540]/80">
                <li><Link href="/privacy" className="hover:text-[#0077B6] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#0077B6] transition-colors">Terms of Service</Link></li>
                <li><Link href="/help" className="hover:text-[#0077B6] transition-colors">Help Center</Link></li>
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
