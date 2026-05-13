import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  MessagesSquare,
  Moon,
  ShieldCheck,
  Sun,
  UploadCloud,
  UsersRound,
} from 'lucide-react'

import { ContactForm } from '@/components/landing/ContactForm'
import { CommandPalette, CopyEmailButton, ScrollPersist } from '@/components/landing/LandingInteractions'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { WolfWhaleBrand } from '@/components/ui/wolfwhale-brand'
import type { Lang } from '@/lib/landing-i18n'
import { PRODUCT } from '@/lib/wolfwhale-product'

interface PageProps {
  searchParams: Promise<{ lang?: string }>
}

const navItems = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'Roles', href: '#roles' },
  { label: 'Trust', href: '#trust' },
  { label: 'Pilot', href: '#pilot' },
]

const proofBadges = [
  'Role dashboards',
  'Attendance and gradebook',
  'Resources and messages',
  'Pilot-ready',
]

const productPillars = [
  {
    icon: CalendarCheck,
    title: 'Daily operations',
    body: 'Attendance, assignments, weighted grades, rubrics, calendars, resources, and report-card workflows live in one calm operating system.',
  },
  {
    icon: GraduationCap,
    title: 'Teacher workflow',
    body: 'Courses, lessons, submissions, feedback, grade posting, private materials, and teacher tools stay connected to the same school record.',
  },
  {
    icon: BookOpen,
    title: 'Learning content',
    body: 'WolfWhale is built around Canadian curriculum alignment, textbooks, study tools, games, offline learning, and Indigenous education opportunities.',
  },
  {
    icon: ShieldCheck,
    title: 'Data controls',
    body: 'Role-scoped access, hardened Supabase RLS, private resources, export paths, and launch checks are part of the product foundation.',
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

const roles = [
  {
    title: 'Students',
    body: 'Courses, assignments, submissions, grades, feedback, attendance, messages, resources, and a study companion.',
    image: '/screenshots/actual-student-dashboard.png',
  },
  {
    title: 'Teachers',
    body: 'Course rosters, assignment creation, grading queues, rubrics, attendance, resource uploads, gradebook exports, and feedback.',
    image: '/screenshots/actual-teacher-dashboard.png',
  },
  {
    title: 'Guardians',
    body: 'Linked-student progress, attendance, grades, feedback, calendar items, messages, and school visibility without extra portals.',
    image: '/screenshots/actual-guardian-dashboard.png',
  },
  {
    title: 'Admins',
    body: 'School setup, launch health, rosters, courses, attendance exports, audit trails, resources, messages, and operational visibility.',
    image: '/screenshots/actual-admin-dashboard.png',
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
    icon: FileText,
    title: 'Exports',
    body: 'Gradebook, attendance, report-card, SIS, OneRoster, SSO config, and district proof checks are documented in the repo.',
  },
  {
    icon: MessagesSquare,
    title: 'Pilot scope',
    body: 'WolfWhale is ready for single-school and carefully scoped multi-school pilots, not yet a proven large-district Canvas replacement.',
  },
]

const contactEmail = PRODUCT.email
const contactEmailHref = `mailto:${contactEmail}`

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
          <GlossyBubbles />

          <Image
            src="/screenshots/actual-teacher-dashboard.png"
            alt=""
            width={1440}
            height={960}
            priority
            className="ww-hero-app"
            style={{ width: '100%', height: '100%' }}
          />

          <div className="ww-shell ww-hero-grid">
            <div className="ww-hero-copy">
              <p className="ww-kicker">WolfWhale Core</p>
              <h1>School LMS operating system.</h1>
              <p className="ww-lede">
                Courses, attendance, grading, resources, messages, and role dashboards in one K-12 platform.
              </p>

              <div className="ww-hero-actions">
                <a href="#contact" className="ww-button">
                  Plan a Pilot
                  <ArrowRight size={18} />
                </a>
                <a href="#product" className="ww-button ww-button-secondary">
                  See the Product
                  <ArrowRight size={18} />
                </a>
              </div>

              <div className="ww-proof-badges" aria-label="WolfWhale proof points">
                {proofBadges.map((badge) => (
                  <span key={badge}>{badge}</span>
                ))}
              </div>
            </div>

            <div className="ww-product-window" aria-label="WolfWhale teacher dashboard preview">
              <Image
                src="/screenshots/actual-teacher-dashboard.png"
                alt="Actual WolfWhale teacher dashboard showing classes, roster, assignments, and grading tools"
                width={1440}
                height={960}
                priority
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </section>

        <section id="product" className="ww-section">
          <SectionIntro
            label="Product"
            title="Core product"
            body="WolfWhale connects classroom work, school operations, family visibility, and data controls."
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
            {roles.map((role) => (
              <article key={role.title} className="ww-role-card">
                <div>
                  <h3>{role.title}</h3>
                  <p>{role.body}</p>
                </div>
                <Image src={role.image} alt={`Actual WolfWhale ${role.title.toLowerCase()} dashboard`} width={1440} height={960} />
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
              <p className="ww-pilot-contact">
                Prefer direct contact? Email <a href={contactEmailHref}>{contactEmail}</a>.
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
                <a href={contactEmailHref}>{contactEmail}</a>
              </p>
              <CopyEmailButton email={contactEmail} />
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
            <a href={contactEmailHref}>
              <Mail size={14} /> {contactEmail}
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

function GlossyBubbles() {
  return (
    <>
      <span className="ww-bubble ww-bubble-1" aria-hidden="true" />
      <span className="ww-bubble ww-bubble-2" aria-hidden="true" />
      <span className="ww-bubble ww-bubble-3" aria-hidden="true" />
    </>
  )
}
