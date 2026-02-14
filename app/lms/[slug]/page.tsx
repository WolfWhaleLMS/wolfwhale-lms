import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Brain,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'
import { PAGES, FEATURE_ICONS } from '@/lib/config/seo-pages'

// ---------------------------------------------------------------------------
// Static params — pre-render all pages at build time
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }))
}

// ---------------------------------------------------------------------------
// Dynamic metadata
// ---------------------------------------------------------------------------

const SITE_URL = 'https://wolfwhale.ca'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = PAGES[slug]
  if (!page) return {}

  const canonical = `${SITE_URL}/lms/${slug}`

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      siteName: 'WolfWhale LMS',
      type: 'website',
      locale: 'en_CA',
      images: [
        {
          url: '/ww-card.png',
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: ['/ww-card.png'],
    },
  }
}

// ---------------------------------------------------------------------------
// Competitor comparison data
// ---------------------------------------------------------------------------

interface ComparisonRow {
  feature: string
  wolfWhale: boolean | string
  competitor: boolean | string
}

function getComparisonRows(competitor: string): ComparisonRow[] {
  const base: ComparisonRow[] = [
    {
      feature: 'Built-in Spaced Repetition Flashcards',
      wolfWhale: true,
      competitor: false,
    },
    {
      feature: 'Canadian Data Sovereignty',
      wolfWhale: true,
      competitor: competitor === 'Brightspace' || competitor === 'Edsby' ? true : false,
    },
    {
      feature: 'PIPEDA Compliant',
      wolfWhale: true,
      competitor: competitor === 'Brightspace' || competitor === 'Edsby' ? true : 'Partial',
    },
    {
      feature: 'Age-Adaptive UI (K-5, 6-8, 9-12)',
      wolfWhale: true,
      competitor: false,
    },
    {
      feature: 'Gamification & XP System',
      wolfWhale: true,
      competitor: false,
    },
    {
      feature: 'Parent Portal',
      wolfWhale: true,
      competitor: competitor === 'Canvas' ? 'Limited' : competitor === 'Edsby' ? true : false,
    },
    {
      feature: 'Real-Time Messaging',
      wolfWhale: true,
      competitor: competitor === 'Canvas' || competitor === 'Edsby' ? true : 'Plugin required',
    },
    {
      feature: 'Zero Server Maintenance',
      wolfWhale: true,
      competitor: competitor === 'Moodle' ? false : true,
    },
    {
      feature: 'Transparent Per-User Pricing',
      wolfWhale: true,
      competitor: competitor === 'Moodle' ? 'Self-hosted' : false,
    },
  ]
  return base
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = PAGES[slug]
  if (!page) notFound()

  const isCity = !!page.city
  const isCompetitor = !!page.competitor
  const canonical = `${SITE_URL}/lms/${slug}`

  return (
    <div className="min-h-screen text-[#0A2540]">
      {/* JSON-LD Structured Data */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: page.title,
          description: page.description,
          url: canonical,
          publisher: {
            '@type': 'Organization',
            name: 'WolfWhale Inc.',
            url: 'https://wolfwhale.ca',
            logo: 'https://wolfwhale.ca/logo.png',
          },
          ...(isCity
            ? {
                about: {
                  '@type': 'City',
                  name: page.city,
                  containedInPlace: {
                    '@type': 'AdministrativeArea',
                    name: page.province,
                    containedInPlace: {
                      '@type': 'Country',
                      name: 'Canada',
                    },
                  },
                },
              }
            : {}),
        }}
      />

      {/* Light Ocean Background — matches /info page */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #E8F8FF 0%, #D0F0FF 25%, #B0E8FF 50%, #D0F0FF 75%, #E8F8FF 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 150% 80% at 50% 20%, rgba(2,194,173,0.15) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              'radial-gradient(ellipse 120% 60% at 30% 70%, rgba(0,60,153,0.08) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[#0A2540]/10 backdrop-blur-md bg-white/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="WolfWhale"
              className="h-14 w-14 rounded-xl object-contain shadow-lg border-2 border-black"
            />
            <div>
              <span className="text-xl font-display font-bold text-[#0A2540] block tracking-wider uppercase">
                WolfWhale LMS
              </span>
              <span className="text-xs text-[#0A2540]/60 font-display font-semibold tracking-widest uppercase">
                Learning Management System
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/info"
              className="hidden sm:inline-block text-sm text-[#0A2540]/70 hover:text-[#00BFFF] transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-lg bg-[#0A2540] text-white hover:bg-[#00BFFF] transition-all text-sm font-medium shadow-md"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* ============================================================
          HERO SECTION
          ============================================================ */}
      <section className="relative z-10 py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 text-center">
          {isCity && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A2540]/5 border border-[#0A2540]/10 mb-6">
              <MapPin className="h-4 w-4 text-[#00BFFF]" />
              <span className="text-sm text-[#0A2540]/80">
                Serving {page.city}, {page.province}
              </span>
            </div>
          )}

          {!isCity && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A2540]/5 border border-[#0A2540]/10 mb-6">
              <Brain className="h-4 w-4 text-[#00BFFF]" />
              <span className="text-sm text-[#0A2540]/80">
                100% Canadian Built &amp; Hosted
              </span>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00BFFF] to-[#33FF33] bg-clip-text text-transparent leading-tight">
            {page.h1}
          </h1>

          <p className="text-lg md:text-xl text-[#0A2540]/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            {page.heroText}
          </p>

          {/* Canadian Badge */}
          <div className="flex items-center justify-center gap-3 mb-10 px-6 py-3 rounded-xl bg-white/60 border border-[#0A2540]/10 w-fit mx-auto shadow-sm">
            <img
              src="/canada-coat-of-arms.png"
              alt="Coat of Arms of Canada"
              className="h-16 w-auto object-contain"
            />
            <div className="text-left">
              <p className="text-sm font-bold text-[#0A2540]">
                100% Canadian Owned &amp; Built
              </p>
              <p className="text-xs text-[#0A2540]/60">
                Student data stays in Canada
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#33FF33] hover:shadow-[0_0_30px_rgba(0,191,255,0.4)] transition-all font-semibold text-white text-white-outlined group neon-glow-blue"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/info"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-[#0A2540]/20 hover:border-[#00BFFF] hover:bg-white/50 transition-all font-semibold text-[#0A2540]"
            >
              See All Features
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURES GRID
          ============================================================ */}
      <section className="relative z-10 py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isCity
                ? `Everything ${page.city} Schools Need`
                : 'Everything Your School Needs'}
            </h2>
            <p className="text-lg text-[#0A2540]/60 max-w-2xl mx-auto">
              A complete learning platform with features no other LMS can match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {page.features.map((feature) => {
              const Icon = FEATURE_ICONS[feature] || CheckCircle2
              return (
                <div
                  key={feature}
                  className="rounded-2xl p-6 liquid-glass liquid-glass-hover group"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#0A2540]/10 to-[#00BFFF]/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-[#00BFFF]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature}</h3>
                  <p className="text-[#0A2540]/70 text-sm leading-relaxed">
                    {getFeatureDescription(feature)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          WHY WOLF WHALE? — Spaced Repetition USP
          ============================================================ */}
      <section className="relative z-10 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why WolfWhale LMS?
            </h2>
            <p className="text-lg text-[#0A2540]/60 max-w-2xl mx-auto">
              The only learning management system with built-in spaced
              repetition flashcards
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* USP Card */}
            <div className="rounded-2xl p-8 liquid-glass">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#00BFFF] to-[#33FF33] text-white-outlined">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">
                  Spaced Repetition Flashcards
                </h3>
              </div>
              <p className="text-[#0A2540]/70 leading-relaxed mb-4">
                Students forget up to 80% of new information within a week. Our
                built-in spaced repetition system combats the forgetting curve by
                scheduling flashcard reviews at scientifically optimal intervals.
                No other LMS has this feature built in.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[#0A2540]/70">
                    Teachers create flashcard decks alongside course content
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[#0A2540]/70">
                    Algorithm schedules reviews based on student performance
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[#0A2540]/70">
                    Up to 200% improvement in long-term knowledge retention
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[#0A2540]/70">
                    No third-party apps needed — everything is inside the LMS
                  </span>
                </li>
              </ul>
            </div>

            {/* Why extra + stats */}
            <div className="space-y-6">
              <div className="rounded-2xl p-8 liquid-glass">
                <h3 className="text-lg font-bold mb-3">
                  {isCity
                    ? `Built for ${page.city}`
                    : 'Built for Canadian Education'}
                </h3>
                <p className="text-[#0A2540]/70 leading-relaxed">
                  {page.whyExtra}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl p-5 liquid-glass text-center">
                  <p className="text-3xl font-bold text-[#00BFFF]">200%</p>
                  <p className="text-xs text-[#0A2540]/60 mt-1">
                    Better Retention
                  </p>
                </div>
                <div className="rounded-xl p-5 liquid-glass text-center">
                  <p className="text-3xl font-bold text-[#00BFFF]">100%</p>
                  <p className="text-xs text-[#0A2540]/60 mt-1">
                    Canadian Hosted
                  </p>
                </div>
                <div className="rounded-xl p-5 liquid-glass text-center">
                  <p className="text-3xl font-bold text-[#00BFFF]">K-12+</p>
                  <p className="text-xs text-[#0A2540]/60 mt-1">
                    All Grade Levels
                  </p>
                </div>
                <div className="rounded-xl p-5 liquid-glass text-center">
                  <p className="text-3xl font-bold text-[#00BFFF]">$12</p>
                  <p className="text-xs text-[#0A2540]/60 mt-1">
                    CAD / User / Mo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          COMPARISON TABLE (only on competitor pages)
          ============================================================ */}
      {isCompetitor && (
        <section className="relative z-10 py-20 bg-white/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                WolfWhale vs {page.competitor}
              </h2>
              <p className="text-lg text-[#0A2540]/60 max-w-2xl mx-auto">
                See how WolfWhale LMS compares to {page.competitor} on the
                features that matter most to Canadian schools
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden liquid-glass">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#0A2540]/10">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[#0A2540]">
                      Feature
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#00BFFF]">
                      WolfWhale
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#0A2540]/60">
                      {page.competitor}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getComparisonRows(page.competitor!).map((row, i) => (
                    <tr
                      key={row.feature}
                      className={
                        i % 2 === 0 ? 'bg-white/20' : 'bg-transparent'
                      }
                    >
                      <td className="py-3 px-6 text-sm text-[#0A2540]/80">
                        {row.feature}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {renderComparisonCell(row.wolfWhale)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {renderComparisonCell(row.competitor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          BOTTOM CTA
          ============================================================ */}
      <section className="relative z-10 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="rounded-2xl p-10 liquid-glass">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isCity
                ? `Ready to Transform Learning in ${page.city}?`
                : 'Ready to Transform Your School?'}
            </h2>
            <p className="text-lg text-[#0A2540]/60 mb-8 max-w-xl mx-auto">
              Join the growing number of Canadian schools choosing WolfWhale
              LMS. Start with a free account today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#33FF33] hover:shadow-[0_0_30px_rgba(0,191,255,0.4)] transition-all font-semibold text-white text-white-outlined group neon-glow-blue"
              >
                Get Started Free
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="mailto:info@wolfwhale.ca?subject=Wolf%20Whale%20LMS%20-%20Demo%20Request"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-[#0A2540]/20 hover:border-[#00BFFF] hover:bg-white/50 transition-all font-semibold text-[#0A2540]"
              >
                Request a Demo
              </a>
            </div>
            <p className="text-sm text-[#0A2540]/50 mt-6">
              $12 CAD per user per month. All features included. No hidden
              fees.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="relative z-10 border-t border-[#0A2540]/10 py-12 backdrop-blur-md bg-white/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/logo.png"
                  alt="WolfWhale"
                  className="h-14 w-14 rounded-xl object-contain shadow-lg border-2 border-black"
                />
                <div>
                  <span className="font-display font-bold block tracking-wider uppercase">
                    WolfWhale LMS
                  </span>
                  <span className="text-xs text-[#0A2540]/60 font-display font-semibold tracking-widest uppercase">
                    Modern K-12 &amp; Post-Secondary Learning Platform
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#0A2540]/60 max-w-md mb-3">
                Canadian-built learning management system with built-in spaced
                repetition flashcards. FERPA, COPPA, and PIPEDA compliant.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 text-sm text-[#0A2540]/60">
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
              <ul className="space-y-2 text-sm text-[#0A2540]/60">
                <li>
                  <Link
                    href="/info"
                    className="hover:text-[#00BFFF] transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="hover:text-[#00BFFF] transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lms/k-12"
                    className="hover:text-[#00BFFF] transition-colors"
                  >
                    K-12 Schools
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lms/post-secondary"
                    className="hover:text-[#00BFFF] transition-colors"
                  >
                    Post-Secondary
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-[#0A2540]/60">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-[#00BFFF] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-[#00BFFF] transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="hover:text-[#00BFFF] transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#0A2540]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#0A2540]/50">
            <p>&copy; 2026 WolfWhale LMS. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <img
                src="/canada-coat-of-arms.png"
                alt="Coat of Arms of Canada"
                className="h-12 w-auto object-contain"
              />
              <span className="text-xs font-semibold text-[#0A2540]/60">
                100% Canadian Owned &amp; Built
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Helper: render comparison cell
// ---------------------------------------------------------------------------

function renderComparisonCell(value: boolean | string) {
  if (value === true) {
    return (
      <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
    )
  }
  if (value === false) {
    return (
      <span className="inline-block h-5 w-5 leading-5 text-center text-red-400 font-bold">
        &mdash;
      </span>
    )
  }
  return (
    <span className="text-xs text-amber-600 font-medium">{value}</span>
  )
}

// ---------------------------------------------------------------------------
// Helper: feature descriptions for the grid cards
// ---------------------------------------------------------------------------

function getFeatureDescription(feature: string): string {
  const descriptions: Record<string, string> = {
    'FERPA & PIPEDA Compliant':
      'Full compliance with FERPA, COPPA, and PIPEDA. Student data is protected by Canadian and international privacy standards with complete audit logging.',
    'Canadian Data Sovereignty':
      'All data is stored on Canadian infrastructure. Student information never leaves the country, meeting the strictest provincial and federal requirements.',
    'Spaced Repetition Flashcards':
      'The only LMS with built-in spaced repetition. Teachers create flashcard decks alongside courses. The algorithm schedules reviews at optimal intervals for long-term retention.',
    'Interactive Courses & Quizzes':
      'Rich course authoring with modules, lessons, videos, and documents. Quiz builder supports multiple choice, true/false, short answer, and essay questions with auto-grading.',
    'Certificate Issuance':
      'Automatically generate and issue certificates when students complete courses. Customizable templates with school branding for professional recognition.',
    'K-12 & Post-Secondary':
      'Age-adaptive interface that adjusts for elementary (K-5), middle school (6-8), high school (9-12), and post-secondary students. One platform for every level.',
    'Real-Time Messaging':
      'Built-in messaging with direct messages, group conversations, and class discussions. File sharing, typing indicators, read receipts, and full message search.',
    'Gradebook & Analytics':
      'Traditional weighted gradebook with A-F grading, category weighting, grade statistics, and CSV/PDF export. Detailed analytics to track student progress over time.',
    'Parent Portal':
      'Visual dashboard giving parents at-a-glance grade dials, attendance gauges, upcoming assignments, and direct teacher messaging to keep families engaged.',
    'Gamification & XP':
      'XP system with 40 levels, 4 tiers, achievements, badges, and age-appropriate leaderboards. Motivate students through friendly competition and recognition.',
    'Assignment & Testing':
      'Comprehensive assignment creation with due dates, rubrics, and file submissions. Auto-grading for objective questions and intuitive manual grading for essays.',
    'Attendance Tracking':
      'Daily attendance with present, absent, tardy, and excused statuses. Pattern detection alerts teachers and parents to potential issues before they escalate.',
    'Multi-Tenant Architecture':
      'Each school gets its own subdomain with isolated data, custom branding, and independent settings. Scalable from a single classroom to an entire district.',
    'Built-in Study Mode':
      'Focus timer with ambient music, do-not-disturb mode, and XP rewards for completion. Helps students build healthy study habits and maintain concentration.',
    'No Self-Hosting Required':
      'WolfWhale is fully managed in the cloud. No servers to maintain, no software to update, no plugins to troubleshoot. Your teachers log in and teach.',
    'Role-Based Access Control':
      'Four distinct roles — student, teacher, parent, and admin — each with specific permissions. Row-level security in PostgreSQL ensures data isolation.',
    'Auto-Grading':
      'Objective questions are graded instantly. Students receive immediate feedback on quizzes and assessments, reducing teacher workload and accelerating learning loops.',
    'Calendar & Scheduling':
      'Unified calendar auto-populated with assignments, events, and school dates. ICS export for external calendar apps so nothing is ever missed.',
    'Custom Branding per School':
      'Each school can customize their subdomain with logos, colors, and branding. Students and parents see a familiar, school-branded experience.',
    'Age-Adaptive UI':
      'Playful rounded interfaces for K-5, balanced layouts for grades 6-8, and sleek professional dashboards for 9-12. Every detail is age-appropriate.',
    'FERPA, COPPA & PIPEDA':
      'Triple compliance across FERPA, COPPA, and PIPEDA. Built from the ground up with student privacy as a core architectural principle, not a bolted-on afterthought.',
    'Modern Tech Stack':
      'Built on Next.js, React, Supabase, and PostgreSQL. Server-side rendering for speed, real-time subscriptions for collaboration, and TypeScript for reliability.',
    'Curriculum-Aligned Content':
      'Course tools designed to align with Canadian provincial curriculum standards. Teachers can tag lessons and assessments to specific learning outcomes.',
    'Built for Canadian Schools':
      'Every feature in WolfWhale was designed with Canadian schools in mind. From PIPEDA compliance to bilingual support, this is a platform that understands your context.',
    'Spaced Repetition Built-In':
      'No plugins or third-party apps needed. Spaced repetition flashcards are a core feature of WolfWhale LMS, integrated directly into the course experience.',
    'Zero Maintenance for Teachers':
      'Teachers should teach, not troubleshoot software. WolfWhale handles all infrastructure, updates, and security so educators can focus on their students.',
    'Student Progress Tracking':
      'Detailed dashboards show student progress across courses, assignments, and flashcard mastery. Teachers identify struggling students early and intervene effectively.',
    'Engaging Gamification':
      'Points, levels, achievements, and leaderboards make learning feel rewarding. Students earn XP for completing lessons, scoring well on quizzes, and reviewing flashcards.',
    'Unlimited Courses':
      'Create as many courses as your school needs. No per-course fees, no storage limits for standard content. Scale your digital learning library without restrictions.',
    'Dedicated Support':
      'Canadian-based support team that understands the education system. Responsive help when you need it, from people who know your challenges.',
    'Active Recall & Spacing':
      'Flashcards use active recall — the most effective study technique according to cognitive science. Combined with spaced intervals, retention improves dramatically.',
    'Science-Backed Retention':
      'Decades of research support spaced repetition as the most effective method for long-term memory. WolfWhale brings this science directly into the classroom.',
    'FERPA & COPPA Compliant':
      'Meets the requirements of both FERPA and COPPA for protecting student and child data. Safe for K-12 schools serving students under 13.',
    'Audit Logging':
      'Every significant action in the system is logged with timestamps and user attribution. Complete audit trail for compliance reviews and investigations.',
    'Data Export & Portability':
      'Export student data, grades, and records in standard formats at any time. No vendor lock-in — your data belongs to your school.',
    'Row-Level Security':
      'PostgreSQL row-level security ensures that database queries only return data the authenticated user is authorized to see. Defense in depth at the database layer.',
  }

  return (
    descriptions[feature] ||
    'A powerful feature designed to improve teaching and learning outcomes for Canadian schools.'
  )
}
