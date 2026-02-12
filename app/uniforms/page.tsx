import Link from 'next/link'
import Image from 'next/image'
import { Equal, Users, Brain, Layers, Sparkles, Rocket, ArrowLeft, Mail, Phone } from 'lucide-react'
import { GlowingBlazer } from '@/components/ui/glowing-blazer'

export const metadata = {
  title: 'School Blazer - WolfWhale School Uniform',
  description:
    'The WolfWhale School Blazer: A premium grey blazer with gold buttons and blue gingham lining, included with every student\'s WolfWhale LMS account. Manufactured by Eton Kidds.',
}

export default function UniformsPage() {
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

        {/* Ambient teal glow layers */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 150% 80% at 50% 20%, rgba(20,184,166,0.20) 0%, transparent 60%)',
            animation: 'uniform-pulse 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background: 'radial-gradient(ellipse 120% 60% at 30% 40%, rgba(13,148,136,0.12) 0%, transparent 50%)',
            animation: 'uniform-drift 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'radial-gradient(ellipse 100% 50% at 70% 25%, rgba(0,191,255,0.10) 0%, transparent 45%)',
            animation: 'uniform-wave 15s ease-in-out infinite reverse',
          }}
        />

        {/* Subtle floating particles */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {[...Array(18)].map((_, i) => {
            const leftPos = (i * 5.5) % 100
            const topPos = (i * 4.2 + 10) % 85
            const isTeal = i % 3 === 0
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                  width: isTeal ? '3px' : '2px',
                  height: isTeal ? '3px' : '2px',
                  backgroundColor: isTeal ? '#14B8A6' : '#00BFFF',
                  boxShadow: isTeal ? '0 0 6px 2px rgba(20,184,166,0.3)' : '0 0 4px 1px rgba(0,191,255,0.2)',
                  animation: `uniform-twinkle ${2.5 + (i % 4) * 0.5}s ease-in-out infinite`,
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
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/70 hover:text-[#14B8A6] transition-colors font-medium shrink-0"
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
            <span className="text-sm sm:text-lg font-display font-bold text-white group-hover:text-[#14B8A6] transition-colors tracking-wider uppercase hidden sm:inline">
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
            {/* Blazer hero visual */}
            <div className="inline-flex items-center justify-center">
              <GlowingBlazer size={280} className="sm:hidden" />
              <GlowingBlazer size={400} className="hidden sm:inline-flex" />
            </div>

            {/* Title */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold bg-gradient-to-r from-[#14B8A6] via-[#2DD4BF] to-[#14B8A6] bg-clip-text text-transparent tracking-wide sm:tracking-wider">
                SCHOOL BLAZER
              </h1>
              <p className="text-lg sm:text-2xl text-white/90 text-white-outlined font-semibold">
                The WolfWhale School Blazer
              </p>
              <p className="text-sm sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                A premium school blazer included with every student&apos;s WolfWhale LMS account
              </p>
            </div>

            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#14B8A6]/15 border border-[#14B8A6]/30">
              <div className="h-2 w-2 rounded-full bg-[#14B8A6] animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-wider text-[#2DD4BF]">
                Coming Soon &mdash; Phase 2
              </span>
            </div>
          </div>
        </section>

        {/* The Blazer Section */}
        <section className="px-4 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-wider">
                THE WOLFWHALE BLAZER
              </h2>
              <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto">
                A classic school blazer manufactured by Eton Kidds, included with every student account.
              </p>
            </div>

            {/* Hero product shot */}
            <div className="flex justify-center">
              <GlowingBlazer size={280} className="sm:hidden" />
              <GlowingBlazer size={400} className="hidden sm:inline-flex" />
            </div>

            {/* Detail cards */}
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  emoji: '\uD83E\uDDE5',
                  title: 'Grey Twill Fabric',
                  desc: 'Classic grey blazer with refined texture. Durable, breathable, and professional.',
                },
                {
                  emoji: '\u2728',
                  title: 'Gold Buttons',
                  desc: 'Polished gold buttons with embossed detailing. A touch of distinction for every student.',
                },
                {
                  emoji: '\uD83D\uDD35',
                  title: 'Gingham Lining',
                  desc: 'Blue checkered gingham interior lining. Attention to detail inside and out.',
                },
              ].map(({ emoji, title, desc }) => (
                <div
                  key={title}
                  className="bg-[#0A1628]/80 backdrop-blur-xl border border-[#14B8A6]/15 shadow-xl rounded-2xl p-4 sm:p-6 group hover:border-[#14B8A6]/40 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{emoji}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why a School Blazer Section */}
        <section className="px-4 py-10 sm:py-16">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-wider">
                WHY A SCHOOL BLAZER?
              </h2>
              <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto">
                A school blazer creates equity, builds identity, and removes barriers to learning.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  icon: Equal,
                  title: 'Equal Playing Field',
                  desc: 'Every student looks the same, reducing bullying and economic barriers. No student is singled out for what they wear.',
                },
                {
                  icon: Users,
                  title: 'School Identity',
                  desc: 'The WolfWhale blazer creates a shared identity across all partner schools. Students feel part of something bigger than themselves.',
                },
                {
                  icon: Brain,
                  title: 'Ready to Learn',
                  desc: 'Students arrive dressed and ready, reducing morning decisions. One less thing to worry about each day.',
                },
                {
                  icon: Layers,
                  title: 'Premium Quality',
                  desc: 'Manufactured by Eton Kidds, a leading school uniform brand. Built to last.',
                },
                {
                  icon: Sparkles,
                  title: 'Classic Style',
                  desc: 'Timeless blazer design with gold buttons and gingham lining. Professional and polished.',
                },
                {
                  icon: Rocket,
                  title: 'Included with LMS',
                  desc: 'Every student account comes with their own blazer. No separate purchase required.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-[#0A1628]/80 backdrop-blur-xl border border-[#14B8A6]/15 shadow-xl rounded-2xl p-4 sm:p-6 group hover:border-[#14B8A6]/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex p-3 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 group-hover:bg-[#14B8A6]/20 transition-colors">
                      <Icon className="h-6 w-6 text-[#14B8A6]" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The WolfWhale Vision Section */}
        <section className="px-4 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#0A1628]/85 backdrop-blur-xl border border-[#14B8A6]/20 shadow-xl rounded-2xl p-5 sm:p-8 md:p-12 space-y-6 sm:space-y-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-wider text-center">
                THE WOLFWHALE VISION
              </h2>
              <p className="text-sm sm:text-base text-white/80 text-center max-w-2xl mx-auto leading-relaxed">
                We&apos;re building a complete ecosystem for student success &mdash; mind, body, and nutrition.
              </p>

              <div className="space-y-4 sm:space-y-5">
                {/* Phase 1 */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#00BFFF]/5 border border-[#00BFFF]/15">
                  <div className="shrink-0 mt-0.5">
                    <div className="h-8 w-8 rounded-full bg-[#33FF33]/20 border border-[#33FF33]/40 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#33FF33]">1</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm sm:text-base font-bold text-white">WolfWhale LMS</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#33FF33]/20 text-[#33FF33] border border-[#33FF33]/30">
                        Live
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
                      Powering education with technology. Canada&apos;s modern learning management system with built-in spaced repetition.
                    </p>
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#14B8A6]/8 border border-[#14B8A6]/25">
                  <div className="shrink-0 mt-0.5">
                    <div className="h-8 w-8 rounded-full bg-[#14B8A6]/20 border border-[#14B8A6]/40 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#14B8A6]">2</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm sm:text-base font-bold text-white">School Blazer</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/30">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
                      A premium school blazer for every student, included with the LMS.
                    </p>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F59E0B]/5 border border-[#F59E0B]/15">
                  <div className="shrink-0 mt-0.5">
                    <div className="h-8 w-8 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#F59E0B]">3</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm sm:text-base font-bold text-white">Pemmican Bars</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
                      Healthy nutrition in every school. Pemmican-based vending machines bringing traditional, nutritious food to students.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interest / Contact Section */}
        <section className="px-4 py-12 sm:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#0A1628]/85 backdrop-blur-xl border border-[#14B8A6]/20 shadow-xl rounded-2xl p-5 sm:p-8 md:p-12 text-center space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-wider">
                INTERESTED IN THE SCHOOL BLAZER?
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-white/80 max-w-lg mx-auto leading-relaxed">
                <p>
                  The WolfWhale School Blazer is coming soon as part of Phase 2.
                  Schools using WolfWhale LMS will be first to access this program.
                </p>
                <p>
                  Get in touch to express interest or learn more about including blazers with your LMS subscription.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                <a
                  href="mailto:info@wolfwhale.ca"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#14B8A6]/15 border border-[#14B8A6]/30 text-[#14B8A6] font-semibold transition-all hover:bg-[#14B8A6]/25 hover:scale-105"
                >
                  <Mail className="h-5 w-5" />
                  info@wolfwhale.ca
                </a>
                <a
                  href="tel:+13069815926"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#14B8A6]/15 border border-[#14B8A6]/30 text-[#14B8A6] font-semibold transition-all hover:bg-[#14B8A6]/25 hover:scale-105"
                >
                  <Phone className="h-5 w-5" />
                  +1 (306) 981-5926
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-px bg-[#14B8A6]/15 mb-6" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/50">
              &copy; 2026 WolfWhale EdTech. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-white/50 hover:text-[#14B8A6] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-white/50 hover:text-[#14B8A6] transition-colors">
                Terms
              </Link>
              <Link href="/help" className="text-sm text-white/50 hover:text-[#14B8A6] transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Animation keyframes */}
      <style>{`
        @keyframes uniform-pulse {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.2; }
          50% { transform: scale(1.1) translateY(-5%); opacity: 0.3; }
        }
        @keyframes uniform-drift {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(8%) scale(1.05); }
        }
        @keyframes uniform-wave {
          0%, 100% { transform: translateX(0) translateY(0); }
          33% { transform: translateX(-5%) translateY(3%); }
          66% { transform: translateX(5%) translateY(-3%); }
        }
        @keyframes uniform-twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
