import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  FileText,
  GraduationCap,
  Layers3,
  Mail,
  MapPin,
  MessagesSquare,
  Microscope,
  Moon,
  ScanSearch,
  ShieldCheck,
  Sun,
  UploadCloud,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'

import { ContactForm } from '@/components/landing/ContactForm'
import { CommandPalette, CopyEmailButton, ScrollPersist } from '@/components/landing/LandingInteractions'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { WolfWhaleBrand } from '@/components/ui/wolfwhale-brand'
import type { Lang } from '@/lib/landing-i18n'

interface PageProps {
  searchParams: Promise<{ lang?: string }>
}

const navItems = [
  { label: 'Resources', href: '#resources' },
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'Roles', href: '#roles' },
  { label: 'Trust', href: '#trust' },
  { label: 'Pilot', href: '#pilot' },
]

const proofBadges = [
  'Resource Center',
  'Interactive biology',
  'Course workspaces',
  'Pilot-ready',
]

const productPillars = [
  {
    icon: Microscope,
    title: 'Visual resources',
    body: 'Students open course materials inside a calm Resource Center built for diagrams, primary sources, files, and interactive science views.',
  },
  {
    icon: GraduationCap,
    title: 'Teacher workflow',
    body: 'Resource uploads, assignments, feedback, grade posting, private materials, and teacher tools stay connected to the same course record.',
  },
  {
    icon: BookOpen,
    title: 'Learning content',
    body: 'WolfWhale connects Canadian curriculum, textbooks, study tools, resource files, offline learning, and Indigenous education opportunities.',
  },
  {
    icon: ShieldCheck,
    title: 'Data controls',
    body: 'Role-scoped access, hardened Supabase RLS, private resources, export paths, and launch checks are part of the product foundation.',
  },
]

const resourceShots = [
  {
    title: 'Resource Center overview',
    body: 'Course files are grouped by class inside the same glass woodland shell students use in WolfWhale Core.',
    image: '/screenshots/resource-tab-overview.png',
    alt: 'Current WolfWhale Resource Center showing course resources grouped inside the student workspace',
  },
  {
    title: 'Plant cell resource view',
    body: 'Interactive biology resources sit beside course materials so students can inspect visual content without leaving the LMS.',
    image: '/screenshots/resource-plant-cell-view.png',
    alt: 'WolfWhale plant cell resource view showing a detailed plant cell learning model inside the Resource Center',
  },
]

const featureIndex = [
  {
    group: 'Core LMS',
    items: ['Courses', 'Enrollments', 'Assignments', 'Submissions', 'Feedback', 'Notifications'],
  },
  {
    group: 'Assessment',
    items: ['Weighted grades', 'Gradebook', 'Rubrics', 'Grade posting', 'Missing work', 'Risk visibility'],
  },
  {
    group: 'School Operations',
    items: ['Attendance', 'Calendar', 'Rosters', 'Invitations', 'Report cards', 'Admin tools'],
  },
  {
    group: 'Resources',
    items: ['Private uploads', 'Signed downloads', 'Lesson materials', 'Course resources', 'Student workspaces', 'Study tools'],
  },
  {
    group: 'Communication',
    items: ['Messages', 'Guardian visibility', 'Role dashboards', 'Linked-student views', 'Course calendars', 'Alerts'],
  },
  {
    group: 'Exports and Setup',
    items: ['Gradebook CSV', 'Attendance CSV', 'SIS export', 'OneRoster validation', 'SSO config checks', 'Launch proof checks'],
  },
]

const roles: Array<{ title: string; body: string; icon: LucideIcon }> = [
  {
    title: 'Students',
    body: 'Courses, assignments, submissions, grades, feedback, attendance, messages, resources, and a study companion.',
    icon: UsersRound,
  },
  {
    title: 'Teachers',
    body: 'Course rosters, assignment creation, grading queues, rubrics, attendance, resource uploads, gradebook exports, and feedback.',
    icon: CalendarCheck,
  },
  {
    title: 'Guardians',
    body: 'Linked-student progress, attendance, grades, feedback, calendar items, messages, and school visibility without extra portals.',
    icon: MessagesSquare,
  },
  {
    title: 'Admins',
    body: 'School setup, launch health, rosters, courses, attendance exports, audit trails, resources, messages, and operational visibility.',
    icon: Layers3,
  },
]

const readiness = [
  {
    icon: UsersRound,
    title: 'Role dashboards',
    body: 'Protected student, teacher, admin, and guardian surfaces are backed by persistent school records.',
  },
  {
    icon: UploadCloud,
    title: 'Persistent workflows',
    body: 'Assignments, submissions, grades, rubrics, attendance, roster imports, and private resources are wired through the app.',
  },
  {
    icon: ScanSearch,
    title: 'Resource safety',
    body: 'Private resource downloads, scan status, retention controls, and admin review paths are part of the operational model.',
  },
  {
    icon: FileText,
    title: 'Pilot scope',
    body: 'WolfWhale is ready for single-school and carefully scoped multi-school pilots, not yet a proven large-district Canvas replacement.',
  },
]

export default async function LMSHubPage({ searchParams }: PageProps) {
  const params = await searchParams
  const lang: Lang = params.lang === 'fr' ? 'fr' : 'en'
  const lp = lang === 'fr' ? '?lang=fr' : ''

  return (
    <div className="ww-landing">
      <ScrollPersist />
      <CommandPalette items={[...navItems, { label: 'Contact', href: '#contact' }]} />

      <header className="ww-nav">
        <nav className="ww-nav-inner" aria-label="Primary">
          <WolfWhaleBrand
            href={`/${lp}`}
            logoSrc="/wolfwhale-logo-final.png"
            logoSize={48}
            priority
            className="ww-main-brand"
            markClassName="ww-main-brand-mark"
            textClassName="ww-main-brand-text"
            taglineClassName="ww-main-brand-tagline"
          />

          <div className="ww-nav-links">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="ww-nav-actions">
            <LanguageToggle lang={lang} />
            <label className="ww-theme-toggle" aria-label="Toggle dark mode">
              <input className="ww-theme-checkbox" type="checkbox" />
              <Moon className="ww-theme-moon" size={17} aria-hidden />
              <Sun className="ww-theme-sun" size={17} aria-hidden />
            </label>
            <Link href="/login" className="ww-small-button">
              Sign In
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="ww-hero">
          <WoodlandLight />

          <Image
            src="/chrome-bg-2.jpg"
            alt=""
            width={832}
            height={1248}
            priority
            className="ww-hero-app"
            style={{ width: '100%', height: '100%' }}
          />

          <div className="ww-shell ww-hero-grid">
            <div className="ww-hero-copy">
              <p className="ww-kicker">WolfWhale Core Resource Center</p>
              <h1>Course resources, made visible.</h1>
              <p className="ww-lede">
                A K-12 LMS where files, diagrams, plant cell models, assignments, grades, and messages live in one woodland-glass workspace.
              </p>

              <div className="ww-hero-actions">
                <a href="#contact" className="ww-button">
                  Plan a Pilot
                  <ArrowRight size={18} />
                </a>
                <a href="#resources" className="ww-button ww-button-secondary">
                  See Resources
                  <ArrowRight size={18} />
                </a>
              </div>

              <div className="ww-proof-badges" aria-label="WolfWhale proof points">
                {proofBadges.map((badge) => (
                  <span key={badge}>{badge}</span>
                ))}
              </div>
            </div>

            <div className="ww-resource-stack" aria-label="WolfWhale Resource Center preview">
              <div className="ww-resource-frame ww-resource-frame-main">
                <Image
                  src="/screenshots/resource-tab-overview.png"
                  alt="Current WolfWhale Resource Center showing course resources in the student workspace"
                  width={1440}
                  height={960}
                  priority
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
              <div className="ww-resource-frame ww-resource-frame-float">
                <Image
                  src="/screenshots/resource-plant-cell-view.png"
                  alt="Plant cell resource view in WolfWhale"
                  width={1440}
                  height={960}
                  priority
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="resources" className="ww-section ww-resource-section">
          <SectionIntro
            label="Resources"
            title="Current Resource Center"
            body="The landing page now leads with the same resource workspace students actually use."
          />

          <div className="ww-shell ww-resource-showcase">
            {resourceShots.map((shot) => (
              <article key={shot.title} className="ww-resource-card">
                <Image src={shot.image} alt={shot.alt} width={1440} height={960} />
                <div>
                  <h3>{shot.title}</h3>
                  <p>{shot.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="product" className="ww-section">
          <SectionIntro
            label="Product"
            title="A calmer LMS frame"
            body="WolfWhale connects resource-rich learning, school operations, family visibility, and data controls."
          />

          <div className="ww-shell ww-pillar-grid">
            {productPillars.map(({ icon: Icon, title, body }) => (
              <article key={title} className="ww-glass-card">
                <Icon size={28} />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="features" className="ww-section ww-feature-index-section">
          <SectionIntro
            label="Features"
            title="Feature index"
            body="A direct view of the main workflows documented in the product."
          />

          <div className="ww-shell ww-feature-index">
            {featureIndex.map((group) => (
              <article key={group.group} className="ww-feature-group">
                <h3>{group.group}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={15} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="roles" className="ww-section ww-section-alt">
          <SectionIntro
            label="Roles"
            title="Role dashboards"
            body="Students, teachers, guardians, and admins each see the tools and records they are allowed to use."
          />

          <div className="ww-shell ww-role-grid">
            {roles.map(({ icon: Icon, title, body }) => (
              <article key={title} className="ww-role-card">
                <span className="ww-role-icon">
                  <Icon size={21} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="trust" className="ww-section">
          <SectionIntro
            label="Trust"
            title="School data controls"
            body="Auth, role routing, Supabase RLS, private resources, exports, support runbooks, smoke tests, and launch checks are documented."
          />

          <div className="ww-shell ww-readiness-grid">
            {readiness.map(({ icon: Icon, title, body }) => (
              <article key={title} className="ww-glass-card ww-readiness-card">
                <Icon size={26} />
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="pilot" className="ww-pilot">
          <div className="ww-shell ww-pilot-inner">
            <div>
              <p className="ww-kicker">Pilot</p>
              <h2>Start with one school.</h2>
              <p>
                WolfWhale is ready for single-school and controlled multi-school pilots. Large-district replacement claims come later, after customer-specific SSO, SIS, support, and restore evidence.
              </p>
            </div>
            <div className="ww-pilot-list">
              {['Role setup', 'Rosters and courses', 'Teacher workflows', 'Guardian visibility', 'Exports and support'].map((item) => (
                <span key={item}>
                  <CheckCircle2 size={16} />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="ww-section">
          <SectionIntro
            label="Contact"
            title="Contact WolfWhale"
            body="Tell us about your school, board, training program, or implementation question."
          />
          <div className="ww-shell ww-contact-card">
            <ContactForm />
            <div className="ww-contact-meta">
              <p>
                Or email{' '}
                <a href="mailto:info@wolfwhale.ca">
                  info@wolfwhale.ca
                </a>
              </p>
              <CopyEmailButton />
            </div>
          </div>
        </section>
      </main>

      <footer className="ww-footer">
        <div className="ww-shell ww-footer-inner">
          <div>
            <WolfWhaleBrand
              logoSrc="/wolfwhale-logo-final.png"
              logoSize={46}
              className="ww-main-footer-brand"
              markClassName="ww-main-brand-mark"
              textClassName="ww-main-brand-text"
              taglineClassName="ww-main-brand-tagline"
            />
            <p>
              <MapPin size={14} /> Saskatoon, SK, Canada
            </p>
            <a href="mailto:info@wolfwhale.ca">
              <Mail size={14} /> info@wolfwhale.ca
            </a>
          </div>
          <p>© 2026 WolfWhale Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function SectionIntro({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div className="ww-shell ww-section-intro">
      <p className="ww-kicker">{label}</p>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  )
}

function WoodlandLight() {
  return (
    <>
      <span className="ww-light ww-light-1" aria-hidden="true" />
      <span className="ww-light ww-light-2" aria-hidden="true" />
      <span className="ww-light ww-light-3" aria-hidden="true" />
      <span className="ww-leaf-shadow ww-leaf-shadow-1" aria-hidden="true" />
      <span className="ww-leaf-shadow ww-leaf-shadow-2" aria-hidden="true" />
    </>
  )
}
