import Link from 'next/link'
import Image from 'next/image'
import { Brain, Lightbulb, ClipboardCheck, TrendingUp, Puzzle, BarChart3, GraduationCap, ArrowLeft, Phone, Mail } from 'lucide-react'

export const metadata = {
  title: 'AI Consulting - Custom AI Solutions for Education',
  description:
    'WolfWhale AI Consulting: Custom AI solutions for education institutions including intelligent tutoring, automated assessment, curriculum optimization, and predictive analytics.',
}

export default function AIConsultingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Dark Underwater Background */}
      <div className="fixed inset-0 z-0">
        {/* Chrome texture base */}
        <div className="absolute inset-0">
          <Image src="/chrome-bg-2.jpg" alt="" fill className="object-cover opacity-25" priority />
        </div>
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#041428]/90 via-[#0A2040]/85 to-[#041428]/90" />

        {/* Ambient purple glow layers */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 150% 80% at 50% 20%, rgba(167,139,250,0.20) 0%, transparent 60%)',
            animation: 'ai-pulse 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background: 'radial-gradient(ellipse 120% 60% at 30% 40%, rgba(196,167,255,0.12) 0%, transparent 50%)',
            animation: 'ai-drift 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'radial-gradient(ellipse 100% 50% at 70% 25%, rgba(0,191,255,0.10) 0%, transparent 45%)',
            animation: 'ai-wave 15s ease-in-out infinite reverse',
          }}
        />

        {/* Subtle floating particles */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {[...Array(18)].map((_, i) => {
            const leftPos = (i * 5.5) % 100
            const topPos = (i * 4.2 + 10) % 85
            const isPurple = i % 3 === 0
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                  width: isPurple ? '3px' : '2px',
                  height: isPurple ? '3px' : '2px',
                  backgroundColor: isPurple ? '#A78BFA' : '#00BFFF',
                  boxShadow: isPurple ? '0 0 6px 2px rgba(167,139,250,0.3)' : '0 0 4px 1px rgba(0,191,255,0.2)',
                  animation: `ai-twinkle ${2.5 + (i % 4) * 0.5}s ease-in-out infinite`,
                  animationDelay: `${(i * 0.3) % 5}s`,
                  opacity: 0.2 + (i % 5) * 0.1,
                }}
              />
            )
          })}
        </div>

        {/* Depth overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#041428] via-transparent to-transparent opacity-60" />
      </div>

      {/* Header / Nav */}
      <header className="relative z-10 px-4 py-4 sm:p-6">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/70 hover:text-[#A78BFA] transition-colors font-medium shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Back to Hub
          </Link>

          <Link href="/" className="inline-flex items-center gap-2 sm:gap-3 group">
            <Image
              src="/logo.png"
              alt="WolfWhale"
              width={36}
              height={36}
              className="rounded-xl object-contain shadow-lg border-2 border-black sm:w-[42px] sm:h-[42px]"
            />
            <span className="text-sm sm:text-lg font-display font-bold text-white group-hover:text-[#A78BFA] transition-colors tracking-wider uppercase hidden sm:inline">
              WolfWhale EdTech
            </span>
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl btn-chrome-3d-blue text-white text-xs sm:text-sm font-semibold transition-all hover:scale-105"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="flex items-center justify-center min-h-[50vh] sm:min-h-[60vh] px-4 py-12 sm:py-20">
          <div className="w-full max-w-4xl text-center space-y-6 sm:space-y-8 animate-fade-in-up">
            {/* Icon with purple glow */}
            <div className="inline-flex items-center justify-center">
              <div
                className="relative p-4 sm:p-6 rounded-2xl bg-[#0A1628]/80 border border-[#A78BFA]/30"
                style={{
                  boxShadow: '0 0 40px rgba(167,139,250,0.25), 0 0 80px rgba(167,139,250,0.10)',
                }}
              >
                <Brain className="h-10 w-10 sm:h-16 sm:w-16 text-[#A78BFA]" />
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(167,139,250,0.15) 0%, transparent 70%)',
                  }}
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold bg-gradient-to-r from-[#A78BFA] via-[#C4A7FF] to-[#A78BFA] bg-clip-text text-transparent tracking-wide sm:tracking-wider">
                AI CONSULTING
              </h1>
              <p className="text-lg sm:text-2xl text-white/90 text-white-outlined font-semibold">
                AI Consulting
              </p>
              <p className="text-sm sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                Custom AI Solutions for Education Institutions
              </p>
            </div>

            {/* Now Available Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#33FF33]/15 border border-[#33FF33]/30">
              <div className="h-2 w-2 rounded-full bg-[#33FF33] animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-wider text-[#33FF33]">
                Now Available
              </span>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="px-4 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#0A1628]/85 backdrop-blur-xl border border-[#A78BFA]/20 shadow-xl rounded-2xl p-5 sm:p-8 md:p-12 space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-wider">
                WHAT WE OFFER
              </h2>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-white/80 leading-relaxed">
                <p>
                  WolfWhale AI Consulting delivers custom artificial intelligence solutions purpose-built
                  for education institutions across Canada. We partner with schools, districts, and
                  post-secondary institutions to design, build, and deploy AI systems that enhance
                  teaching and learning outcomes.
                </p>
                <p>
                  From intelligent tutoring systems that adapt to each student&apos;s learning style to
                  automated assessment tools that save educators hours of grading time, our consulting
                  services bring the power of AI directly into your classrooms and administrative workflows.
                </p>
              </div>

              {/* Key points */}
              <div className="grid sm:grid-cols-3 gap-4 pt-4">
                {[
                  {
                    icon: Lightbulb,
                    title: 'Intelligent Tutoring',
                    desc: 'Custom AI tutoring systems tailored to your curriculum.',
                  },
                  {
                    icon: ClipboardCheck,
                    title: 'Automated Assessment',
                    desc: 'AI-powered grading, feedback, and assessment tools.',
                  },
                  {
                    icon: TrendingUp,
                    title: 'Curriculum Optimization',
                    desc: 'Data-driven insights to optimize learning outcomes.',
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="p-4 rounded-xl bg-[#A78BFA]/5 border border-[#A78BFA]/10"
                  >
                    <Icon className="h-6 w-6 text-[#C4A7FF] mb-2" />
                    <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
                    <p className="text-xs text-white/65 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="px-4 py-10 sm:py-16">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-wider">
                OUR SERVICES
              </h2>
              <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto">
                A comprehensive suite of AI consulting services designed to transform education
                institutions with intelligent technology.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  icon: Lightbulb,
                  title: 'AI Tutoring Systems',
                  desc: 'Custom-built intelligent tutoring systems with natural language understanding, personalized learning paths, and real-time student support.',
                },
                {
                  icon: ClipboardCheck,
                  title: 'Automated Assessment',
                  desc: 'AI grading and feedback systems that save educators hours while providing students detailed, personalized feedback.',
                },
                {
                  icon: BarChart3,
                  title: 'Curriculum Analytics',
                  desc: 'Data-driven curriculum analysis and optimization, identifying gaps and opportunities for improved learning outcomes.',
                },
                {
                  icon: Puzzle,
                  title: 'Custom Integrations',
                  desc: 'Seamless AI integration with existing LMS platforms, SIS systems, and educational tools your institution already uses.',
                },
                {
                  icon: TrendingUp,
                  title: 'Predictive Analytics',
                  desc: 'Early warning systems for student at-risk identification, enrollment forecasting, and resource planning.',
                },
                {
                  icon: GraduationCap,
                  title: 'Training & Support',
                  desc: 'Comprehensive training programs for educators and administrators to effectively leverage AI tools in their workflow.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-[#0A1628]/80 backdrop-blur-xl border border-[#A78BFA]/15 shadow-xl rounded-2xl p-4 sm:p-6 group hover:border-[#A78BFA]/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex p-3 rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/20 group-hover:bg-[#A78BFA]/20 transition-colors">
                      <Icon className="h-6 w-6 text-[#C4A7FF]" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / CTA Section */}
        <section className="px-4 py-12 sm:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#0A1628]/85 backdrop-blur-xl border border-[#A78BFA]/20 shadow-xl rounded-2xl p-5 sm:p-8 md:p-12 text-center space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-wider">
                READY TO TRANSFORM YOUR INSTITUTION?
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-white/80 max-w-lg mx-auto leading-relaxed">
                <p>
                  Whether you&apos;re exploring AI for the first time or looking to scale existing
                  initiatives, our team is ready to help you design and implement solutions that
                  make a real difference for your students and educators.
                </p>
                <p>
                  Get in touch to schedule a free consultation and discover how AI can
                  transform teaching and learning at your institution.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                <a
                  href="mailto:info@wolfwhale.ca"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl btn-chrome-3d-blue text-white font-semibold transition-all hover:scale-105"
                >
                  <Mail className="h-5 w-5" />
                  info@wolfwhale.ca
                </a>
                <a
                  href="tel:+13069815926"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-[#A78BFA]/30 text-white font-semibold hover:border-[#A78BFA] hover:bg-[#A78BFA]/5 transition-all"
                >
                  <Phone className="h-5 w-5 text-[#A78BFA]" />
                  +1(306)981-5926
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-px bg-[#A78BFA]/15 mb-6" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/50">
              &copy; 2026 WolfWhale EdTech. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-white/50 hover:text-[#A78BFA] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-white/50 hover:text-[#A78BFA] transition-colors">
                Terms
              </Link>
              <Link href="/help" className="text-sm text-white/50 hover:text-[#A78BFA] transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Animation keyframes */}
      <style>{`
        @keyframes ai-pulse {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.2; }
          50% { transform: scale(1.1) translateY(-5%); opacity: 0.3; }
        }
        @keyframes ai-drift {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(8%) scale(1.05); }
        }
        @keyframes ai-wave {
          0%, 100% { transform: translateX(0) translateY(0); }
          33% { transform: translateX(-5%) translateY(3%); }
          66% { transform: translateX(5%) translateY(-3%); }
        }
        @keyframes ai-twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
