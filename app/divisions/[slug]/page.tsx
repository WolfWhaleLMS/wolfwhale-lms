import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CheckCircle2, ArrowRight, Sparkles, ShieldCheck, ExternalLink } from 'lucide-react'
import { ThemeToggle } from '@/components/landing/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { landingContent, type Lang } from '@/lib/landing-i18n'

/* ============================================
   Division Feature Detail Data
   ============================================ */

interface DivisionDetail {
  headline: string
  description: string
  sections: {
    title: string
    items: string[]
  }[]
  references?: { label: string; url: string }[]
  callout?: {
    label: string
    text: string
  }
}

const divisionDetails: Record<string, { en: DivisionDetail }> = {
  'sso-identity': {
    en: {
      headline: 'Enterprise SSO & Identity Management',
      description: 'WolfWhale integrates with the identity providers Saskatchewan school divisions already use, so every student and teacher signs in with the same credentials they use for everything else.',
      sections: [
        {
          title: 'Supported Identity Providers',
          items: [
            'SAML 2.0 federation for enterprise-grade single sign-on',
            'Google Workspace for Education integration — sign in with school Google accounts',
            'Microsoft 365 / Azure AD integration — compatible with divisions using Microsoft ecosystems',
            'Apple School Manager integration for managed Apple ID sign-in on iPad and iPhone',
            'One login across all roles — students, teachers, parents, and administrators',
          ],
        },
        {
          title: 'How WolfWhale Aligns with Saskatchewan Requirements',
          items: [
            'LAFOIP Section 23.2 requires a written agreement before any personal information is shared with a service provider — WolfWhale provides a standard Information Management Service Provider Agreement for every division',
            'SSO means no new passwords are created or stored — authentication is delegated to your existing identity provider, reducing the attack surface',
            'Supports the Saskatchewan OIPC recommendation that school divisions maintain control over who accesses student data',
            'Role-based access control (Student, Teacher, Parent, Admin) enforced at the database level with Supabase Row Level Security',
            'All authentication tokens are short-lived and scoped — no persistent session tokens stored on device',
          ],
        },
        {
          title: 'Provisioning & Deprovisioning',
          items: [
            'Bulk CSV import for students and teachers — match your division\'s SIS export format',
            'Automatic account deprovisioning when a user is removed from your identity provider',
            'Enrollment approval workflows with capacity tracking and waitlist management',
            'Multi-tenant architecture — each school division is fully isolated at the database level',
          ],
        },
      ],
      references: [
        { label: 'LAFOIP Section 23.2 — Information Management Service Providers', url: 'https://www.canlii.org/t/wrx' },
        { label: 'Saskatchewan OIPC Advisory to Teachers and School Boards', url: 'https://oipc.sk.ca/updated-advisory-from-the-office-of-the-information-and-privacy-commissioner-of-saskatchewan-to-teachers-school-boards-parents-and-students/' },
      ],
      callout: {
        label: 'Zero New Passwords',
        text: 'Teachers and students sign in with the Google or Microsoft accounts they already have. No new credentials to manage, no password reset tickets, no additional security risk.',
      },
    },
  },
  'bulk-deployment': {
    en: {
      headline: 'Bulk Deployment & Device Management',
      description: 'WolfWhale is a native iOS app built for managed device environments. It deploys silently through Apple School Manager and MDM with zero-touch setup across your entire division.',
      sections: [
        {
          title: 'Apple School Manager & MDM',
          items: [
            'Volume Purchase Program (VPP) — assign licenses to devices or users through Apple School Manager',
            'MDM-ready — compatible with Jamf, Mosyle, Kandji, SimpleMDM, and Apple Business Essentials',
            'Zero-touch deployment — app installs silently on managed devices, no student interaction needed',
            'Managed App Configuration — pre-configure division settings, default school, and role assignments via MDM payload',
            'Automatic updates — push new versions through MDM without disrupting classroom time',
          ],
        },
        {
          title: 'Saskatchewan Division IT Considerations',
          items: [
            'Compatible with SaskTel CommunityNet — the network infrastructure connecting Saskatchewan schools',
            'Offline-first architecture — lessons, textbooks, and AI tools work without internet, syncing when connectivity returns',
            'Low bandwidth requirements — core features work on limited school Wi-Fi; heavy assets cached locally',
            'All data transmitted over TLS 1.3 encryption — meets Saskatchewan OIPC security expectations for electronic records',
            'App size optimized for school device storage constraints',
          ],
        },
        {
          title: 'Deployment Process',
          items: [
            'Step 1: Division IT adds WolfWhale to Apple School Manager and assigns VPP licenses',
            'Step 2: MDM pushes the app to all target devices with pre-configured settings',
            'Step 3: Teachers and students sign in with existing Google/Microsoft/Apple credentials',
            'Step 4: Division analytics dashboard goes live — track adoption across all schools from day one',
            'White-glove onboarding included — WolfWhale staff walk your IT team through the entire process',
          ],
        },
      ],
      references: [
        { label: 'Apple School Manager Documentation', url: 'https://support.apple.com/guide/apple-school-manager/welcome/web' },
        { label: 'SaskTel CommunityNet', url: 'https://www.sasktel.com/business/products-and-solutions/information-technology/communitynet' },
      ],
      callout: {
        label: 'Tested in Saskatchewan',
        text: 'WolfWhale is designed and tested for Saskatchewan school environments — from CommunityNet bandwidth to Apple School Manager workflows. It works the way your IT department already operates.',
      },
    },
  },
  'division-analytics': {
    en: {
      headline: 'Division-Wide Analytics & Reporting',
      description: 'Real-time dashboards that give division administrators visibility across every school, classroom, and student — without compromising individual privacy.',
      sections: [
        {
          title: 'What Division Administrators See',
          items: [
            'Aggregate engagement metrics across all schools in the division — app usage, lesson completion rates, textbook reading progress',
            'Attendance tracking with calendar history, streak analytics, and CSV export for provincial reporting',
            'Gradebook analytics — grade distributions, category breakdowns, and trend lines by school or division-wide',
            'Curriculum outcome progress — track how students are performing against the 682 Saskatchewan curriculum outcomes mapped in the platform',
            'Report card and transcript generation — PDF exports aligned with Saskatchewan report card standards',
          ],
        },
        {
          title: 'Privacy-Preserving Design',
          items: [
            'LAFOIP Section 28 compliance — personal information is only disclosed to users with appropriate role-based access',
            'Division admins see aggregate data by default; individual student records require explicit drill-down authorization',
            'All analytics queries are scoped to the division\'s tenant — no cross-division data leakage is architecturally possible',
            'Supabase Row Level Security (RLS) enforces data boundaries at the database level, not just the application level',
            'Audit logging tracks every data access event — available for LAFOIP compliance reviews and OIPC investigations',
          ],
        },
        {
          title: 'Provincial Reporting Support',
          items: [
            'Attendance data exportable in formats compatible with Saskatchewan Ministry of Education reporting requirements',
            'Student outcome data structured around the Saskatchewan curriculum — ready for provincial achievement reporting',
            'Built-in support for the four Saskatchewan education goals: achievement, engagement, reconciliation, and well-being',
            'CSV and PDF export options for all reports — compatible with SaskTenders procurement audit requirements',
          ],
        },
      ],
      references: [
        { label: 'LAFOIP Section 28 — Disclosure of Personal Information', url: 'https://www.canlii.org/t/wrx' },
        { label: 'Saskatchewan Education Sector Strategic Plan', url: 'https://www.saskatchewan.ca/government/government-structure/ministries/education' },
      ],
      callout: {
        label: 'One Dashboard, Every School',
        text: 'No more stitching together reports from separate systems. Attendance, grades, engagement, and curriculum progress — all in one view, all in real time, across every school in your division.',
      },
    },
  },
  'dedicated-onboarding': {
    en: {
      headline: 'Dedicated Onboarding & Professional Development',
      description: 'Every division deployment includes hands-on training for teachers, IT staff, and administrators — aligned with STF professional development standards.',
      sections: [
        {
          title: 'What Onboarding Includes',
          items: [
            'Dedicated WolfWhale onboarding specialist assigned to your division for the first 90 days',
            'IT staff training — Apple School Manager setup, MDM configuration, SSO integration, and division analytics walkthrough',
            'Administrator training — gradebook configuration, attendance setup, report card templates, enrollment workflows',
            'Teacher training — course creation, micro-lesson builder, AI tools (Snap & Convert, Quiz Maker, Differentiation Helper), textbook assignment',
            'Parent orientation materials — how to access the parent portal, weekly digests, and conference scheduling',
          ],
        },
        {
          title: 'Alignment with STF Standards',
          items: [
            'STF emphasizes that teachers need time and professional learning to use new technology effectively — WolfWhale onboarding is built around this principle',
            'AI tools are presented as professional aids that support teacher autonomy, not replacements — aligning with STF President\'s position on ethical AI use',
            'Training materials available for the STF\'s suggested approach: teachers as guides for responsible technology use in classrooms',
            'Supports the STF Technology and Education Working Committee\'s mandate to examine how technology affects teachers\' working conditions',
            'Professional development hours from WolfWhale training can be documented for teacher growth plans',
          ],
        },
        {
          title: 'Ongoing Support',
          items: [
            'Priority support channel for division IT contacts — direct access to WolfWhale engineering team',
            'Quarterly check-ins with your division to review analytics, address feedback, and plan feature rollouts',
            'New feature training included — when WolfWhale ships updates, your division gets walkthrough sessions',
            'Teacher Innovation and Support Fund (TISF) compatibility — WolfWhale deployments can be included in TISF grant applications to the Saskatchewan Ministry of Education',
          ],
        },
      ],
      references: [
        { label: 'STF Technology and Education Working Committee', url: 'https://www.stf.sk.ca/about-stf/get-involved/technology-and-education-working-committee/' },
        { label: 'STF on Guiding Ethical AI Use', url: 'https://www.stf.sk.ca/about-stf/news/guiding-ethical-ai-use/' },
        { label: 'Saskatchewan Teacher Innovation and Support Fund', url: 'https://www.saskatchewan.ca/residents/education-and-learning/prek-12-education-early-learning-and-schools/teacher-innovation-and-support-fund' },
      ],
      callout: {
        label: 'Not Just Software',
        text: 'A platform is only as good as the training behind it. Every WolfWhale deployment includes dedicated onboarding because we know that teacher confidence with the tool directly determines student outcomes.',
      },
    },
  },
  'volume-licensing': {
    en: {
      headline: 'Volume Licensing & Procurement',
      description: 'Flexible licensing designed for Saskatchewan school division procurement processes — from SaskTenders RFPs to multi-year contracts.',
      sections: [
        {
          title: 'Licensing Structure',
          items: [
            'Per-student licensing — teachers always free, no per-teacher charges',
            'Volume pricing available for divisions with 500+ students',
            'Multi-year contracts with predictable, locked-in per-student costs — no surprise price increases',
            'Flexible billing — annual or multi-year prepay options',
            'Free pilot program — test with a single school before committing to a division-wide license',
          ],
        },
        {
          title: 'Saskatchewan Procurement Compatibility',
          items: [
            'Registered on SaskTenders — ready to respond to school division RFPs and RFQs',
            'Compatible with the Government of Saskatchewan\'s upcoming GEM procurement system',
            'All required vendor documentation available: W-9 equivalent, proof of insurance, business registration',
            'Information Management Service Provider Agreement template ready — as required by LAFOIP Section 23.2 for any vendor handling student data',
            'Privacy Impact Assessment (PIA) self-assessment pre-completed — ready for division review per OIPC guidance',
          ],
        },
        {
          title: 'What\'s Included in Every License',
          items: [
            'Full platform access — LMS + SIS features, all 72 textbooks, all AI tools, all 682 curriculum outcomes',
            'Dedicated onboarding and training for your division',
            'Division-wide analytics dashboard',
            'Priority support with direct engineering access',
            'All future updates and new features included — no add-on charges',
            'Canadian-hosted infrastructure with LAFOIP-compliant data handling',
          ],
        },
      ],
      references: [
        { label: 'SaskTenders — Public Sector Procurement', url: 'https://www.sasktenders.ca/' },
        { label: 'LAFOIP Section 23.2 — Vendor Agreements', url: 'https://www.canlii.org/t/wrx' },
        { label: 'OIPC Privacy Impact Assessment Guidance', url: 'https://oipc.sk.ca/assets/privacy-impact-assessment-guidance-document.pdf' },
      ],
      callout: {
        label: 'Teachers Always Free',
        text: 'You should never have to choose between equipping teachers and staying on budget. WolfWhale licenses are per-student only — every teacher account is included at no additional cost.',
      },
    },
  },
  'data-sovereignty': {
    en: {
      headline: 'Data Sovereignty & Privacy Compliance',
      description: 'WolfWhale is built from the ground up for LAFOIP compliance. All student data is hosted in Canada, encrypted in transit and at rest, and never leaves the country.',
      sections: [
        {
          title: 'LAFOIP Compliance',
          items: [
            'LAFOIP Section 23.2 — WolfWhale provides a written Information Management Service Provider Agreement governing data access, use, disclosure, storage, and destruction',
            'LAFOIP Section 24 — platform collects only information required for educational purposes authorized by the school division',
            'LAFOIP Section 25 — personal information is collected directly from the student or parent/guardian, never from third-party sources',
            'LAFOIP Section 28 — personal information is disclosed only to users with role-based authorization; no cross-division data sharing',
            'All records stored in WolfWhale remain under the school division\'s legal control for LAFOIP purposes',
          ],
        },
        {
          title: 'Data Residency & Infrastructure',
          items: [
            'All data hosted on Supabase with Canadian region infrastructure — student data never leaves Canadian jurisdiction',
            'PostgreSQL database with Row Level Security (RLS) — tenant isolation enforced at the database engine level, not just application code',
            'TLS 1.3 encryption for all data in transit between devices and servers',
            'AES-256 encryption for data at rest in the database',
            'On-device AI processing — the AI tutor and micro-lesson tools run locally on the student\'s device, not in the cloud; no student prompts or responses are sent to external AI services',
          ],
        },
        {
          title: 'Privacy Compliance Framework',
          items: [
            'PIPEDA compliant — WolfWhale as a commercial entity adheres to all 10 Fair Information Principles',
            'Pre-completed Privacy Impact Assessment (PIA) available for division review — aligned with Saskatchewan OIPC guidance',
            'Privacy breach response plan documented per OIPC guidelines: contain, investigate, notify, report, prevent',
            'Accessible Saskatchewan Act compliance — WCAG 2.0 AA for all digital interfaces, as required for school division vendor platforms',
            'Digital Citizenship Education alignment — platform design supports the Saskatchewan Ministry of Education\'s K-12 Digital Citizenship Continuum for safe online behaviour',
          ],
        },
        {
          title: 'Additional Compliance',
          items: [
            'COPPA-ready architecture — parental consent workflows built in for users under 13, should the platform expand to U.S. markets',
            'Saskatchewan OIPC cloud computing guidance followed — PIA conducted before deployment, data remains under division control, no secondary use of student data',
            'Supports the four Saskatchewan OIPC foundational questions: authority to collect, defined use, authority to disclose, adequate safeguards',
            'Data retention and destruction policies configurable per division — when a division ends its contract, all data is permanently deleted within 30 days with written confirmation',
          ],
        },
      ],
      references: [
        { label: 'LAFOIP Full Text', url: 'https://www.canlii.org/t/wrx' },
        { label: 'OIPC Advisory to Teachers and School Boards', url: 'https://oipc.sk.ca/updated-advisory-from-the-office-of-the-information-and-privacy-commissioner-of-saskatchewan-to-teachers-school-boards-parents-and-students/' },
        { label: 'OIPC Privacy Breach Guidelines', url: 'https://oipc.sk.ca/assets/privacy-breach-guidelines-for-government-institutions-and-local-authorities.pdf' },
        { label: 'OIPC PIA Guidance Document', url: 'https://oipc.sk.ca/assets/privacy-impact-assessment-guidance-document.pdf' },
        { label: 'Saskatchewan Schools Privacy Portal', url: 'https://saskschoolsprivacy.com/' },
        { label: 'Accessible Saskatchewan Act', url: 'https://www.saskatchewan.ca/government/government-structure/ministries/social-services/accessibility' },
        { label: 'Digital Citizenship Education in SK Schools', url: 'https://pubsaskdev.blob.core.windows.net/pubsask-prod/83322/83322-DC_Guide_-_ENGLISH_2.pdf' },
      ],
      callout: {
        label: 'Built for Saskatchewan Law',
        text: 'WolfWhale is not a U.S. platform adapted for Canada. It was designed in Saskatchewan, for Saskatchewan schools, with LAFOIP compliance as a foundational architecture decision — not an afterthought.',
      },
    },
  },
}

/* ============================================
   Static Params for SSG
   ============================================ */
export function generateStaticParams() {
  return Object.keys(divisionDetails).map((slug) => ({ slug }))
}

/* ============================================
   Page Component
   ============================================ */

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string }>
}

export default async function DivisionDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const sp = await searchParams
  const validLangs: Lang[] = ['en', 'fr']
  const lang: Lang = validLangs.includes(sp.lang as Lang) ? (sp.lang as Lang) : 'en'
  const lp = lang !== 'en' ? `?lang=${lang}` : ''

  const detail = divisionDetails[slug]
  if (!detail) notFound()

  const content = detail.en
  const t = landingContent[lang]
  const color = '#00BFFF'

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-white dark:bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-xl bg-white dark:bg-black border-b border-gray-200 dark:border-white/5">
        <nav className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href={`/${lp}`} className="inline-flex flex-col group shrink-0 min-w-0">
            <span className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#00BFFF] transition-colors duration-100 tracking-normal uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
              WolfWhale
            </span>
            <span className="hidden sm:block text-xs text-gray-500 dark:text-white/60 tracking-[0.15em] uppercase font-medium -mt-0.5">
              {t.lms}
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link href={`/${lp}#divisions`} className="text-sm text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors duration-100 font-medium hidden sm:inline">
              {t.nav.divisions}
            </Link>
            <LanguageToggle lang={lang} />
            <ThemeToggle />
            <a
              href={`/${lp}#contact`}
              className="inline-flex items-center h-9 sm:h-10 px-2.5 sm:px-4 rounded-lg sm:rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-[11px] sm:text-sm font-semibold transition-all duration-100 hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              {t.nav.contact}
            </a>
          </div>
        </nav>
      </header>
      <div className="h-[50px] sm:h-[56px]" />

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-16">
        {/* Back link */}
        <Link
          href={`/${lp}#divisions`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-white/50 hover:text-[#00BFFF] transition-colors duration-100 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {lang === 'fr' ? 'Retour aux divisions' : 'Back to Divisions'}
        </Link>

        {/* Hero */}
        <div className="space-y-4 mb-12">
          {content.callout && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase" style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}>
              <ShieldCheck className="h-3 w-3" />
              {content.callout.label}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            {content.headline}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl">
            {content.description}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {content.sections.map(({ title, items }) => (
            <div key={title}>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4" style={{ borderLeft: `3px solid ${color}`, paddingLeft: '12px' }}>
                {title}
              </h2>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm sm:text-base text-gray-600 dark:text-white/70 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* References */}
        {content.references && content.references.length > 0 && (
          <div className="mt-12 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03]">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">References</h3>
            <ul className="space-y-2">
              {content.references.map((ref) => (
                <li key={ref.url}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-[#00BFFF] hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    {ref.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Callout box */}
        {content.callout && (
          <div className="mt-8 rounded-2xl p-6 sm:p-8 border" style={{ backgroundColor: `${color}08`, borderColor: `${color}20` }}>
            <p className="text-sm sm:text-base text-gray-700 dark:text-white/80 leading-relaxed">
              {content.callout.text}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-start gap-4">
          <a
            href={`/${lp}#contact`}
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold transition-all duration-100 hover:bg-gray-800 dark:hover:bg-gray-100"
          >
            {t.requestDemo}
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link
            href={`/${lp}#divisions`}
            className="inline-flex items-center gap-1.5 h-12 px-6 text-sm text-gray-500 dark:text-white/50 hover:text-[#00BFFF] transition-colors duration-100 font-medium"
          >
            {lang === 'fr' ? 'Voir toutes les capacités' : 'See all capabilities'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 pb-8 mt-12">
        <div className="max-w-4xl mx-auto">
          <div className="h-px bg-gray-200 dark:bg-white/10 mb-6" />
          <p className="text-xs text-gray-400 dark:text-white/40">
            &copy; {new Date().getFullYear()} {t.footerCopyright}
          </p>
        </div>
      </footer>

      <style>{`
        html { scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth; }
        html::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
