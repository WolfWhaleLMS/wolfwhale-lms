import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
  Mail,
  Phone,
  ChevronRight,
  WifiOff,
  Gamepad2,
  Bot,
  Brain,
  Smartphone,
  ArrowRight,
  Heart,
  Shield,
  DollarSign,
  type LucideIcon
} from 'lucide-react'

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
   Info Card — clickable card for topic sections
   ============================================ */
function InfoCard({
  icon: Icon,
  title,
  description,
  color,
  bullets,
  href,
}: {
  icon: LucideIcon
  title: string
  description: string
  color: string
  bullets: string[]
  href?: string
}) {
  const content = (
    <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group cursor-pointer h-full">
      <div
        className="inline-flex p-3 rounded-xl mb-4 border"
        style={{ backgroundColor: `${color}10`, borderColor: `${color}30` }}
      >
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00BFFF] transition-colors">{title}</h3>
      <p className="text-sm text-white/60 mb-4">{description}</p>
      <ul className="space-y-1.5">
        {bullets.map((b) => (
          <li key={b} className="text-sm text-white/50 flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
            {b}
          </li>
        ))}
      </ul>
      {href && (
        <p className="text-xs text-white/30 mt-4 group-hover:text-[#00BFFF]/60 transition-colors flex items-center gap-1">
          Learn more <ArrowRight className="h-3 w-3" />
        </p>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}

/* ============================================
   Main Info Page
   ============================================ */
export default function InfoPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Dark Background with subtle neon accents */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#00BFFF]/3 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-[#8B5CF6]/3 blur-[120px]" />
      </div>

      {/* Corinthian Pillar Borders (hidden on small mobile) */}
      <div className="fixed top-0 -bottom-[60px] left-0 w-[30px] sm:w-[130px] md:w-[190px] lg:w-[260px] z-[5] pointer-events-none hidden sm:block" aria-hidden="true">
        <img src="/pillar.jpg" alt="" className="block w-full h-full object-cover object-top invert opacity-40" />
      </div>
      <div className="fixed top-0 -bottom-[60px] right-0 w-[30px] sm:w-[130px] md:w-[190px] lg:w-[260px] z-[5] pointer-events-none hidden sm:block" style={{ transform: 'scaleX(-1)' }} aria-hidden="true">
        <img src="/pillar.jpg" alt="" className="block w-full h-full object-cover object-top invert opacity-40" />
      </div>

      {/* Header Navigation */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-md bg-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors font-medium">
            Home
          </Link>
          <a href="mailto:info@wolfwhale.ca" className="px-5 py-2 rounded-lg btn-chrome-3d-blue text-white transition-all text-sm font-bold">
            Contact Us
          </a>
        </div>
      </header>

      {/* ==========================================
          HERO — centered glass logo, minimal text
          ========================================== */}
      <section className="relative z-10 py-20 md:py-28 bg-black/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
          <Image src="/logo.png" alt="WolfWhale" width={160} height={160} className="rounded-2xl object-contain shadow-2xl shadow-purple-500/30 mb-8" />

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-normal mb-4 tracking-wider leading-tight text-white">
            WolfWhale
          </h1>

          <p className="text-lg md:text-xl text-white/60 mb-8 tracking-[0.15em] uppercase font-display">
            Improving the most important tool in education
          </p>

          {/* What is an LMS? */}
          <div className="max-w-3xl mb-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-8 py-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wider mb-4">What is an LMS?</h2>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              A Learning Management System is the digital backbone of a classroom — where courses are delivered, grades are tracked, and students learn. WolfWhale is the only one built from the ground up around how students actually absorb information.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <a
              href="mailto:info@wolfwhale.ca?subject=WolfWhale%20LMS%20-%20Demo%20Request"
              className="px-8 py-4 rounded-xl btn-chrome-3d-blue text-white transition-all font-bold flex items-center gap-2 group"
            >
              Request a Demo
              <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <Link href="/" className="px-8 py-4 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all font-medium">
              Back to Home
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
            <StatCard value="72" label="Original Textbooks" />
            <StatCard value="288+" label="Chapters" />
            <StatCard value="682" label="Curriculum Outcomes" />
            <StatCard value="5" label="User Roles" />
          </div>
        </div>
      </section>

      {/* ==========================================
          FEATURE CARDS — 6 clickable, link to detail pages
          ========================================== */}
      <section className="relative z-10 py-20 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wider">Features</h2>
            <p className="text-lg text-white/70 max-w-xl mx-auto">
              Tap any card to learn more.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Brain, title: 'Cognitive Load Lessons', slug: 'micro-lessons', points: ['Research-backed lesson format', 'Hook → Lesson → Compare → Quiz', 'Reading timer ensures comprehension', 'Gated quizzes unlock after reading'], color: '#8B5CF6' },
              { icon: Bot, title: 'On-Device AI (6 Tools)', slug: 'ai-tools', points: ['AI Tutor with curriculum awareness', 'Lesson Converter (industry first)', 'Lesson Plan & Report Card builders', 'Apple Intelligence — data stays on device'], color: '#00BFFF' },
              { icon: BookOpen, title: '72 Original Textbooks', slug: 'textbooks', points: ['288+ chapters, full SK K-12 coverage', 'WolfWhale Books publisher brand', 'Flashcards, quizzes & activities built in'], color: '#FFD700' },
              { icon: WifiOff, title: 'Offline Learning', slug: 'offline', points: ['AES-GCM encrypted storage', 'Full course & textbook access offline', 'Auto sync on reconnect'], color: '#34D399' },
              { icon: GraduationCap, title: '11 Teacher Tools', slug: 'teacher-tools', points: ['Lesson Converter & Plan Builder', 'Gradebook & Rubric Builder', 'Seating Chart & Weekly Planner'], color: '#FF6B9D' },
              { icon: Gamepad2, title: 'Gamification & XP', slug: 'gamification', points: ['XP system with streaks & leaderboards', 'Study Pet companion (fish collection)', 'Chess, Kahoot, spelling bee & more'], color: '#FFD700' },
            ].map(({ icon: Icon, title, points, color, slug }) => (
              <Link
                key={title}
                href={`/features/${slug}`}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-white/20 transition-all duration-100 group cursor-pointer"
              >
                <div
                  className="inline-flex p-3 rounded-xl mb-4 border transition-colors duration-100"
                  style={{
                    backgroundColor: `${color}10`,
                    borderColor: `${color}30`,
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00BFFF] transition-colors duration-100">{title}</h3>
                <ul className="space-y-1">
                  {points.map((pt) => (
                    <li key={pt} className="text-sm text-white/65 flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      {pt}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-white/30 mt-3 group-hover:text-[#00BFFF]/60 transition-colors duration-100 flex items-center gap-1">
                  Learn more <ArrowRight className="h-3 w-3" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          APP SCREENSHOTS — placeholder iPhone frames
          ========================================== */}
      <section className="relative z-10 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wider">See It in Action</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Built natively for iOS. Beautiful, fast, and designed for the classroom.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Student Dashboard', file: 'student-dashboard.png' },
              { label: 'Micro-Lesson View', file: 'micro-lesson.png' },
              { label: 'Textbook Reader', file: 'textbook-reader.png' },
              { label: 'AI Tutor', file: 'ai-tutor.png' },
              { label: 'Teacher Tools', file: 'teacher-tools.png' },
              { label: 'Quiz Builder', file: 'quiz-builder.png' },
              { label: 'Gamification & XP', file: 'gamification.png' },
              { label: 'Constellation Map', file: 'constellation.png' },
            ].map(({ label, file }) => (
              <div key={file} className="flex flex-col items-center gap-3">
                <div className="w-full aspect-[9/19.5] rounded-[2rem] border-2 border-white/20 bg-white/5 backdrop-blur-sm overflow-hidden flex items-center justify-center relative">
                  {/* Replace with: <Image src={`/screenshots/${file}`} alt={label} fill className="object-cover" /> */}
                  <div className="flex flex-col items-center gap-3 text-center px-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-white/40" />
                    </div>
                    <p className="text-xs text-white/30 font-medium">{file}</p>
                  </div>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full" />
                </div>
                <p className="text-sm text-white/60 font-medium text-center">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          INFO CARDS — compact topic cards
          ========================================== */}
      <section className="relative z-10 py-20 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wider">More About WolfWhale</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <InfoCard
              icon={Users}
              title="5 User Roles"
              description="Purpose-built dashboards for every stakeholder."
              color="#00BFFF"
              bullets={[
                'Student — courses, XP, study pets, constellation',
                'Teacher — 11 tools, gradebook, lesson builder',
                'Parent — child progress monitoring',
                'School Admin — school-wide management',
                'Super Admin — multi-tenant platform control',
              ]}
            />
            <InfoCard
              icon={Heart}
              title="Indigenous Education & TRC"
              description="Supporting Truth & Reconciliation Calls to Action 6-12."
              color="#FF6B9D"
              bullets={[
                'Indigenous connections in all 72 textbooks',
                'Culturally responsive curriculum mapping',
                'Land acknowledgement integration',
                'First Nations, Métis & Inuit perspectives',
              ]}
            />
            <InfoCard
              icon={DollarSign}
              title="Simple Pricing"
              description="$12 per student per year. That's it."
              color="#34D399"
              bullets={[
                'Unlimited teachers, parents & admins',
                'All 72 textbooks and AI tools included',
                'No per-feature upsells',
                'Volume discounts for districts',
              ]}
            />
            <InfoCard
              icon={Shield}
              title="Privacy & Security"
              description="On-device AI means student data never leaves the device."
              color="#8B5CF6"
              bullets={[
                'Apple Intelligence — no cloud AI',
                'AES-GCM encrypted offline storage',
                'Row-level security on all data',
                'PIPEDA & FOIP compliant',
              ]}
            />
            <InfoCard
              icon={BookOpen}
              title="WolfWhale Books"
              description="Our own publisher brand — 72 textbooks, 288+ chapters."
              color="#FFD700"
              bullets={[
                'Full Saskatchewan K-12 coverage',
                '70% pan-Canadian core (WNCP)',
                '30% province-specific content',
                'Interactive content blocks & flashcards',
              ]}
            />
            <InfoCard
              icon={Sparkles}
              title="Constellation Curriculum"
              description="Visual skill tree mapping 682 curriculum outcomes."
              color="#00BFFF"
              bullets={[
                'Interactive star map of learning progress',
                'Standards-aligned to SK curriculum',
                'Cross-subject connections visible',
                'Expandable to all Canadian provinces',
              ]}
            />
          </div>
        </div>
      </section>

      {/* ==========================================
          FOOTER — simple, with Canada + Treaty 6
          ========================================== */}
      <footer className="relative z-10 border-t border-white/10 py-12 backdrop-blur-md bg-black/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="WolfWhale" width={48} height={48} className="rounded-xl object-contain shadow-lg shadow-purple-500/20" />
                <div>
                  <h3 className="font-display font-bold tracking-wider uppercase text-white">WolfWhale</h3>
                  <p className="text-xs text-white/60 tracking-widest uppercase">K-12 Learning Management System</p>
                </div>
              </div>
              <p className="text-sm text-white/60 max-w-md mb-4">
                100% designed and built in Canada. First Nations owned, operating on Treaty 6 territory.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 text-sm text-white/60">
                <a href="mailto:info@wolfwhale.ca" className="flex items-center gap-1.5 hover:text-[#00BFFF] transition-colors">
                  <Mail className="h-3.5 w-3.5" /> info@wolfwhale.ca
                </a>
                <a href="tel:+13069815926" className="flex items-center gap-1.5 hover:text-[#00BFFF] transition-colors">
                  <Phone className="h-3.5 w-3.5" /> +1 (306) 981-5926
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm text-white">Links</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/" className="hover:text-[#00BFFF] transition-colors">Home</Link></li>
                <li><Link href="/#features" className="hover:text-[#00BFFF] transition-colors">Features</Link></li>
                <li><Link href="/privacy" className="hover:text-[#00BFFF] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#00BFFF] transition-colors">Terms of Service</Link></li>
                <li><a href="mailto:info@wolfwhale.ca" className="hover:text-[#00BFFF] transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p>&copy; 2026 WolfWhale Inc. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Image src="/canada-flag.png" alt="Canadian Flag" width={28} height={14} className="object-contain" />
                <span className="text-xs font-medium text-white/60">100% Designed &amp; Built in Canada</span>
              </div>
              <div className="flex items-center gap-2">
                {/* TODO: Add Treaty 6 flag image at /public/treaty-6-flag.png */}
                <span className="text-xs font-medium text-white/60">Treaty 6 Territory</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
