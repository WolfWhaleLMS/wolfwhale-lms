import Link from 'next/link'
import Image from 'next/image'
import { Eye, ShieldAlert, Database, BarChart3, Radar, FileBarChart, Lock, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Cerebus - AI Surveillance & Data Security',
  description:
    'Cerebus: AI-powered surveillance, data security, and data visualization platform designed for First Nations reserves and Indigenous communities.',
}

export default function CerebusPage() {
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

        {/* Ambient crimson glow layers */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 150% 80% at 50% 20%, rgba(255,68,68,0.20) 0%, transparent 60%)',
            animation: 'cerebus-pulse 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background: 'radial-gradient(ellipse 120% 60% at 30% 40%, rgba(255,107,107,0.12) 0%, transparent 50%)',
            animation: 'cerebus-drift 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'radial-gradient(ellipse 100% 50% at 70% 25%, rgba(0,191,255,0.10) 0%, transparent 45%)',
            animation: 'cerebus-wave 15s ease-in-out infinite reverse',
          }}
        />

        {/* Subtle floating particles — fewer than hub page */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {[...Array(18)].map((_, i) => {
            const leftPos = (i * 5.5) % 100
            const topPos = (i * 4.2 + 10) % 85
            const isRed = i % 3 === 0
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                  width: isRed ? '3px' : '2px',
                  height: isRed ? '3px' : '2px',
                  backgroundColor: isRed ? '#FF4444' : '#00BFFF',
                  boxShadow: isRed ? '0 0 6px 2px rgba(255,68,68,0.3)' : '0 0 4px 1px rgba(0,191,255,0.2)',
                  animation: `cerebus-twinkle ${2.5 + (i % 4) * 0.5}s ease-in-out infinite`,
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
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/70 hover:text-[#FF6B6B] transition-colors font-medium shrink-0"
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
            <span className="text-sm sm:text-lg font-display font-bold text-white group-hover:text-[#FF6B6B] transition-colors tracking-wider uppercase hidden sm:inline">
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
            {/* Icon with crimson glow */}
            <div className="inline-flex items-center justify-center">
              <div
                className="relative p-4 sm:p-6 rounded-2xl bg-[#0A1628]/80 border border-[#FF4444]/30"
                style={{
                  boxShadow: '0 0 40px rgba(255,68,68,0.25), 0 0 80px rgba(255,68,68,0.10)',
                }}
              >
                <Eye className="h-10 w-10 sm:h-16 sm:w-16 text-[#FF4444]" />
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255,68,68,0.15) 0%, transparent 70%)',
                  }}
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold bg-gradient-to-r from-[#FF4444] via-[#FF6B6B] to-[#FF4444] bg-clip-text text-transparent tracking-wide sm:tracking-wider">
                CEREBUS
              </h1>
              <p className="text-lg sm:text-2xl text-white/90 text-white-outlined font-semibold">
                Cerebus
              </p>
              <p className="text-sm sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                AI-Powered Surveillance &amp; Data Sovereignty for Indigenous Communities
              </p>
            </div>

            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FF4444]/15 border border-[#FF4444]/30">
              <div className="h-2 w-2 rounded-full bg-[#FF4444] animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-wider text-[#FF6B6B]">
                In Development &mdash; Coming Soon
              </span>
            </div>
          </div>
        </section>

        {/* What is Cerebus? Section */}
        <section className="px-4 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#0A1628]/85 backdrop-blur-xl border border-[#FF4444]/20 shadow-xl rounded-2xl p-5 sm:p-8 md:p-12 space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-wider">
                WHAT IS CEREBUS?
              </h2>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-white/80 leading-relaxed">
                <p>
                  Cerebus is an AI-powered surveillance, data security, and data visualization platform
                  purpose-built for First Nations reserves, bands, and Indigenous communities across Canada.
                </p>
                <p>
                  In a world where data is power, Cerebus ensures that Indigenous communities own, control,
                  and benefit from their own data. From physical infrastructure monitoring with computer vision
                  to comprehensive band council analytics, Cerebus puts community sovereignty first.
                </p>
              </div>

              {/* Key points */}
              <div className="grid sm:grid-cols-3 gap-4 pt-4">
                {[
                  {
                    icon: ShieldAlert,
                    title: 'Community Protection',
                    desc: 'AI-powered monitoring to protect community infrastructure and assets.',
                  },
                  {
                    icon: Database,
                    title: 'Data Sovereignty',
                    desc: 'Your nation, your data. Full ownership and control over community information.',
                  },
                  {
                    icon: BarChart3,
                    title: 'Data Visualization',
                    desc: 'Interactive dashboards for band councils, leaders, and decision-makers.',
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="p-4 rounded-xl bg-[#FF4444]/5 border border-[#FF4444]/10"
                  >
                    <Icon className="h-6 w-6 text-[#FF6B6B] mb-2" />
                    <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
                    <p className="text-xs text-white/65 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-4 py-10 sm:py-16">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-wider">
                PLATFORM FEATURES
              </h2>
              <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto">
                A comprehensive suite of tools designed to empower Indigenous communities with
                AI-driven security and data intelligence.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  icon: Eye,
                  title: 'AI Surveillance',
                  desc: 'Intelligent monitoring with computer vision and anomaly detection for community infrastructure. Automated alerts keep your community safe around the clock.',
                },
                {
                  icon: Database,
                  title: 'Data Sovereignty',
                  desc: 'Community-owned data storage. Your data stays with your nation. Full control over who accesses what, ensuring OCAP principles are respected.',
                },
                {
                  icon: BarChart3,
                  title: 'Real-Time Dashboards',
                  desc: 'Interactive data visualization with customizable dashboards for band councils and community leaders. See your community data at a glance.',
                },
                {
                  icon: Radar,
                  title: 'Threat Detection',
                  desc: 'AI-powered security threat identification and alerting across digital and physical infrastructure. Stay ahead of emerging risks.',
                },
                {
                  icon: FileBarChart,
                  title: 'Analytics & Reporting',
                  desc: 'Comprehensive reporting tools for band council governance, resource management, and community metrics. Data-driven decision making.',
                },
                {
                  icon: Lock,
                  title: 'Secure Infrastructure',
                  desc: 'End-to-end encrypted infrastructure monitoring with zero-trust security architecture. Built from the ground up for data protection.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-[#0A1628]/80 backdrop-blur-xl border border-[#FF4444]/15 shadow-xl rounded-2xl p-4 sm:p-6 group hover:border-[#FF4444]/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex p-3 rounded-xl bg-[#FF4444]/10 border border-[#FF4444]/20 group-hover:bg-[#FF4444]/20 transition-colors">
                      <Icon className="h-6 w-6 text-[#FF6B6B]" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interest / Contact Section */}
        <section className="px-4 py-12 sm:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#0A1628]/85 backdrop-blur-xl border border-[#FF4444]/20 shadow-xl rounded-2xl p-5 sm:p-8 md:p-12 text-center space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-wider">
                INTERESTED IN CEREBUS?
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-white/80 max-w-lg mx-auto leading-relaxed">
                <p>
                  Cerebus is currently in early development. We&apos;re seeking First Nations communities,
                  band councils, and Indigenous organizations to partner with us in shaping this platform.
                </p>
                <p>
                  If your community is interested in AI-powered security, data sovereignty, or
                  community analytics, we&apos;d love to hear from you.
                </p>
              </div>
              <div className="pt-2">
                <a
                  href="mailto:contact@wolfwhale.ca"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl btn-chrome-3d-red text-white font-semibold transition-all hover:scale-105"
                >
                  contact@wolfwhale.ca
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-px bg-[#FF4444]/15 mb-6" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/50">
              &copy; 2026 WolfWhale EdTech. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-white/50 hover:text-[#FF6B6B] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-white/50 hover:text-[#FF6B6B] transition-colors">
                Terms
              </Link>
              <Link href="/help" className="text-sm text-white/50 hover:text-[#FF6B6B] transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Animation keyframes */}
      <style>{`
        @keyframes cerebus-pulse {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.2; }
          50% { transform: scale(1.1) translateY(-5%); opacity: 0.3; }
        }
        @keyframes cerebus-drift {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(8%) scale(1.05); }
        }
        @keyframes cerebus-wave {
          0%, 100% { transform: translateX(0) translateY(0); }
          33% { transform: translateX(-5%) translateY(3%); }
          66% { transform: translateX(5%) translateY(-3%); }
        }
        @keyframes cerebus-twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
