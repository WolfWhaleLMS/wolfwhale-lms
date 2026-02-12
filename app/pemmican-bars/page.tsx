import Link from 'next/link'
import Image from 'next/image'
import { Wheat, Leaf, Heart, MapPin, Apple, Users, Sparkles, ArrowLeft, GraduationCap, Shirt } from 'lucide-react'

export const metadata = {
  title: 'Pemmican Bars - Healthy Vending Machines for Schools',
  description:
    'Pemmican Bars: Healthy, locally-sourced vending machines for schools. Traditional Indigenous-inspired nutrition meets modern convenience. Dried berries, pemmican, and all-natural snacks from Saskatchewan and across Canada.',
}

export default function PemmicanBarsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Dark Warm Background */}
      <div className="fixed inset-0 z-0">
        {/* Chrome texture base */}
        <div className="absolute inset-0">
          <Image src="/chrome-bg-2.jpg" alt="" fill className="object-cover opacity-25" priority />
        </div>
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#041428]/90 via-[#0A2040]/85 to-[#041428]/90" />

        {/* Ambient amber glow layers */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 150% 80% at 50% 20%, rgba(217,119,6,0.20) 0%, transparent 60%)',
            animation: 'pemmican-pulse 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background: 'radial-gradient(ellipse 120% 60% at 30% 40%, rgba(180,83,9,0.12) 0%, transparent 50%)',
            animation: 'pemmican-drift 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'radial-gradient(ellipse 100% 50% at 70% 25%, rgba(245,158,11,0.10) 0%, transparent 45%)',
            animation: 'pemmican-wave 15s ease-in-out infinite reverse',
          }}
        />

        {/* Subtle floating particles */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {[...Array(18)].map((_, i) => {
            const leftPos = (i * 5.5) % 100
            const topPos = (i * 4.2 + 10) % 85
            const isAmber = i % 3 === 0
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                  width: isAmber ? '3px' : '2px',
                  height: isAmber ? '3px' : '2px',
                  backgroundColor: isAmber ? '#D97706' : '#F59E0B',
                  boxShadow: isAmber ? '0 0 6px 2px rgba(217,119,6,0.3)' : '0 0 4px 1px rgba(245,158,11,0.2)',
                  animation: `pemmican-twinkle ${2.5 + (i % 4) * 0.5}s ease-in-out infinite`,
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
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/70 hover:text-[#D97706] transition-colors font-medium shrink-0"
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
            <span className="text-sm sm:text-lg font-display font-bold text-white group-hover:text-[#D97706] transition-colors tracking-wider uppercase hidden sm:inline">
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
            {/* Icon with amber glow */}
            <div className="inline-flex items-center justify-center">
              <div
                className="relative p-4 sm:p-6 rounded-2xl bg-[#0A1628]/80 border border-[#D97706]/30"
                style={{
                  boxShadow: '0 0 40px rgba(217,119,6,0.25), 0 0 80px rgba(217,119,6,0.10)',
                }}
              >
                <Wheat className="h-10 w-10 sm:h-16 sm:w-16 text-[#D97706]" />
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(217,119,6,0.15) 0%, transparent 70%)',
                  }}
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#B45309] bg-clip-text text-transparent tracking-wide sm:tracking-wider">
                PEMMICAN BARS
              </h1>
              <p className="text-lg sm:text-2xl text-white/90 text-white-outlined font-semibold">
                Pemmican Bars
              </p>
              <p className="text-sm sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                Healthy, locally-sourced vending machines for schools &mdash; traditional nutrition meets modern convenience
              </p>
            </div>

            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#D97706]/15 border border-[#D97706]/30">
              <div className="h-2 w-2 rounded-full bg-[#D97706] animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-wider text-[#F59E0B]">
                Coming Soon &mdash; Phase 3
              </span>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="px-4 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#0A1628]/85 backdrop-blur-xl border border-[#D97706]/20 shadow-xl rounded-2xl p-5 sm:p-8 md:p-12 space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-wider">
                WHAT WE OFFER
              </h2>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-white/80 leading-relaxed">
                <p>
                  Pemmican Bars brings healthy, locally-sourced vending machines into schools across Saskatchewan
                  and Canada. Our machines dispense dried berries, dried meat, pemmican, and other all-natural snacks &mdash;
                  replacing junk food with real nutrition rooted in Indigenous food traditions.
                </p>
                <p>
                  Every product is sourced from local Saskatchewan and Canadian producers, supporting local farmers
                  and Indigenous food makers while giving students access to food that actually fuels their learning.
                </p>
              </div>

              {/* Key points */}
              <div className="grid sm:grid-cols-3 gap-4 pt-4">
                {[
                  {
                    emoji: '\uD83E\uDED0',
                    title: 'Dried Berries',
                    desc: 'Saskatoon berries, cranberries, blueberries \u2014 all locally sourced from Saskatchewan and Canadian farms.',
                  },
                  {
                    emoji: '\uD83E\uDD69',
                    title: 'Dried Meat & Pemmican',
                    desc: 'Traditional Indigenous protein. Pemmican, jerky, and dried meat snacks.',
                  },
                  {
                    emoji: '\uD83C\uDF3F',
                    title: 'All Natural',
                    desc: 'No artificial preservatives, colors, or flavors. 100% real food from local producers.',
                  },
                ].map(({ emoji, title, desc }) => (
                  <div
                    key={title}
                    className="p-4 rounded-xl bg-[#D97706]/5 border border-[#D97706]/10"
                  >
                    <span className="text-2xl mb-2 block">{emoji}</span>
                    <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
                    <p className="text-xs text-white/65 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Pemmican Bars Section */}
        <section className="px-4 py-10 sm:py-16">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-wider">
                WHY PEMMICAN BARS
              </h2>
              <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto">
                More than a vending machine &mdash; a commitment to student health, local communities,
                and Indigenous food traditions.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  icon: MapPin,
                  title: 'Locally Sourced',
                  desc: 'All products sourced from Saskatchewan and Canadian producers. We know where our food comes from, and so will you.',
                },
                {
                  icon: Leaf,
                  title: 'Traditional Nutrition',
                  desc: 'Inspired by Indigenous food traditions. Pemmican has fueled people for centuries \u2014 nutrient-dense, portable, and proven.',
                },
                {
                  icon: Heart,
                  title: 'Healthy Alternative',
                  desc: 'Replace chips and candy with real, nutritious food. Dried berries, lean meat, and whole ingredients students can feel good about.',
                },
                {
                  icon: Apple,
                  title: 'School-Friendly',
                  desc: 'Vending machines designed for school environments with age-appropriate portions, clear labeling, and allergen information.',
                },
                {
                  icon: Users,
                  title: 'Supporting Local',
                  desc: 'Every purchase supports Canadian farmers and Indigenous food producers. Building a local food economy, one snack at a time.',
                },
                {
                  icon: Sparkles,
                  title: 'Complete Ecosystem',
                  desc: 'Part of the WolfWhale vision: educate the mind, equip the body, fuel with nutrition. A complete ecosystem for student success.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-[#0A1628]/80 backdrop-blur-xl border border-[#D97706]/15 shadow-xl rounded-2xl p-4 sm:p-6 group hover:border-[#D97706]/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex p-3 rounded-xl bg-[#D97706]/10 border border-[#D97706]/20 group-hover:bg-[#D97706]/20 transition-colors">
                      <Icon className="h-6 w-6 text-[#F59E0B]" />
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
            <div className="bg-[#0A1628]/85 backdrop-blur-xl border border-[#D97706]/20 shadow-xl rounded-2xl p-5 sm:p-8 md:p-12 space-y-6 sm:space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-wider">
                  THE WOLFWHALE VISION
                </h2>
                <p className="text-sm sm:text-base text-white/70 max-w-lg mx-auto">
                  Mind, body, and nutrition &mdash; a complete ecosystem for student success.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {/* Phase 1 */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#00BFFF]/5 border border-[#00BFFF]/20">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="h-5 w-5 text-[#00BFFF]" />
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#33FF33]/20 text-[#33FF33] border border-[#33FF33]/30">
                      Live
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">Phase 1: WolfWhale LMS</h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Educate the mind. Canada&apos;s modern learning management system with spaced repetition flashcards.
                  </p>
                </div>

                {/* Phase 2 */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#8B5CF6]/5 border border-[#8B5CF6]/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Shirt className="h-5 w-5 text-[#8B5CF6]" />
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">
                      Coming Soon
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">Phase 2: School Uniforms</h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Equip the body. Affordable, high-quality school uniform packages for Canadian schools.
                  </p>
                </div>

                {/* Phase 3 */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#D97706]/10 border border-[#D97706]/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Wheat className="h-5 w-5 text-[#D97706]" />
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/30">
                      Coming Soon
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">Phase 3: Pemmican Bars</h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Fuel with nutrition. Healthy, locally-sourced vending machines with Indigenous-inspired foods.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interest / Contact Section */}
        <section className="px-4 py-12 sm:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#0A1628]/85 backdrop-blur-xl border border-[#D97706]/20 shadow-xl rounded-2xl p-5 sm:p-8 md:p-12 text-center space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-wider">
                INTERESTED IN PEMMICAN BARS FOR YOUR SCHOOL?
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-white/80 max-w-lg mx-auto leading-relaxed">
                <p>
                  Pemmican Bars is coming soon. We&apos;re looking for schools, school divisions, and community
                  partners across Saskatchewan and Canada who want to bring healthy, locally-sourced snacks
                  to their students.
                </p>
                <p>
                  If you&apos;re interested in replacing vending machine junk food with real nutrition,
                  we&apos;d love to hear from you.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                <a
                  href="mailto:info@wolfwhale.ca"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-b from-[#D97706] via-[#B45309] to-[#92400E] border border-[#F59E0B]/30 text-white font-semibold transition-all hover:scale-105 shadow-lg"
                  style={{
                    boxShadow: '0 4px 15px rgba(217,119,6,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
                  }}
                >
                  info@wolfwhale.ca
                </a>
                <a
                  href="tel:+13069815926"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-[#D97706]/30 text-[#F59E0B] font-semibold hover:border-[#D97706] hover:bg-[#D97706]/5 transition-all"
                >
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
          <div className="h-px bg-[#D97706]/15 mb-6" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/50">
              &copy; 2026 WolfWhale EdTech. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-white/50 hover:text-[#D97706] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-white/50 hover:text-[#D97706] transition-colors">
                Terms
              </Link>
              <Link href="/help" className="text-sm text-white/50 hover:text-[#D97706] transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Animation keyframes */}
      <style>{`
        @keyframes pemmican-pulse {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.2; }
          50% { transform: scale(1.1) translateY(-5%); opacity: 0.3; }
        }
        @keyframes pemmican-drift {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(8%) scale(1.05); }
        }
        @keyframes pemmican-wave {
          0%, 100% { transform: translateX(0) translateY(0); }
          33% { transform: translateX(-5%) translateY(3%); }
          66% { transform: translateX(5%) translateY(-3%); }
        }
        @keyframes pemmican-twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
