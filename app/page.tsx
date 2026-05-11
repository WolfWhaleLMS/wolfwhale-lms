import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: 'WolfWhale | School Platform',
  description:
    'WolfWhale is a Canadian school platform for courses, attendance, grades, resources, messages, family visibility, and fish rewards.',
  openGraph: {
    title: 'WolfWhale',
    description:
      'A polished Canadian school platform for real classroom workflows, private records, and fish rewards.',
    images: [
      {
        url: '/landing/websummit-water-garden.png',
        width: 1672,
        height: 941,
        alt: 'Bright underwater WolfWhale landing background with sunlight, bubbles, and aquatic plants',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WolfWhale',
    description:
      'A Canadian school platform for dashboards, grades, attendance, resources, messages, and fish rewards.',
    images: ['/landing/websummit-water-garden.png'],
  },
}

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
  'Demo',
  'Real tools',
  'Private data',
  'Fish rewards',
]

const productPillars = [
  {
    icon: CalendarCheck,
    title: 'Classes',
    body: 'Courses, assignments, grades, calendars, and attendance together.',
  },
  {
    icon: GraduationCap,
    title: 'Teaching',
    body: 'Create work, review submissions, post feedback, and share resources.',
  },
  {
    icon: BookOpen,
    title: 'Learning',
    body: 'Simple tasks, study tools, textbooks, games, and fish rewards.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy',
    body: 'Role access, private files, audit logs, and clear exports.',
  },
]

const featureIndex = [
  {
    group: 'Learn',
    items: ['Courses', 'Enrollments', 'Assignments', 'Submissions', 'Feedback', 'Alerts'],
  },
  {
    group: 'Grade',
    items: ['Weighted grades', 'Gradebook', 'Rubrics', 'Posted grades', 'Missing work', 'Risk view'],
  },
  {
    group: 'Run',
    items: ['Attendance', 'Calendar', 'Rosters', 'Invites', 'Reports', 'Admin tools'],
  },
  {
    group: 'Share',
    items: ['Uploads', 'Downloads', 'Lessons', 'Resources', 'Workspaces', 'Study tools'],
  },
  {
    group: 'Talk',
    items: ['Messages', 'Family view', 'Dashboards', 'Linked students', 'Class calendars', 'Updates'],
  },
  {
    group: 'Export',
    items: ['Grades', 'Attendance', 'SIS', 'OneRoster', 'SSO checks', 'Launch checks'],
  },
]

const roles = [
  {
    title: 'Students',
    body: 'Assignments, grades, feedback, messages, resources, and fish rewards.',
    image: '/screenshots/actual-student-dashboard.png',
  },
  {
    title: 'Teachers',
    body: 'Rosters, assignments, grading, rubrics, attendance, resources, and feedback.',
    image: '/screenshots/actual-teacher-dashboard.png',
  },
  {
    title: 'Guardians',
    body: 'Progress, attendance, grades, feedback, calendar items, and messages.',
    image: '/screenshots/actual-guardian-dashboard.png',
  },
  {
    title: 'Admins',
    body: 'Schools, users, rosters, courses, exports, audit trails, and operations.',
    image: '/screenshots/actual-admin-dashboard.png',
  },
]

const readiness = [
  {
    icon: UsersRound,
    title: 'Dashboards',
    body: 'Each role sees the right tools and records.',
  },
  {
    icon: UploadCloud,
    title: 'Workflows',
    body: 'Assignments, grades, attendance, rosters, and resources are connected.',
  },
  {
    icon: FileText,
    title: 'Exports',
    body: 'Grades, attendance, SIS, OneRoster, and launch checks are covered.',
  },
  {
    icon: MessagesSquare,
    title: 'Pilots',
    body: 'Pilot small, prove it, then grow.',
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
            logoSize={62}
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
            src="/landing/websummit-water-garden.png"
            alt=""
            width={1672}
            height={941}
            priority
            className="ww-hero-bg"
            style={{ width: '100%', height: '100%' }}
          />

          <div className="ww-shell ww-hero-grid">
            <div className="ww-hero-copy">
              <h1 className="ww-hero-title">
                <span className="ww-wordmark">WolfWhale</span>
              </h1>
              <p className="ww-lede">
                Simple school tools with grades, attendance, messages, resources, and fish rewards.
              </p>

              <div className="ww-hero-actions">
                <Link href="/login" className="ww-button">
                  Try Demo
                  <ArrowRight size={18} />
                </Link>
                <a href="#product" className="ww-button ww-button-secondary">
                  See Product
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
            title="What it does"
            body="The core school tools in one place."
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
            title="Tools"
            body="The essentials schools ask for first."
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
            title="For everyone"
            body="Students, teachers, families, and admins each get a clear view."
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
            title="Safe by design"
            body="Role access, private files, audit trails, and launch checks are built in."
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
              <h2>Start small.</h2>
              <p>
                Pilot with one school, prove the workflows, then expand.
              </p>
            </div>
            <div className="ww-pilot-list">
              {['Roles', 'Rosters', 'Courses', 'Families', 'Exports'].map((item) => (
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
            title="Talk to us"
            body="Show it to your school, board, or training program."
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
              logoSize={56}
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
          <p>© 2026 <span className="ww-inline-wordmark">WolfWhale</span> Inc. All rights reserved.</p>
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
