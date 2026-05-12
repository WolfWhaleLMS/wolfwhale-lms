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
    'WolfWhale is a Canadian school platform for learning management, student records, family visibility, private files, and fish rewards.',
  openGraph: {
    title: 'WolfWhale',
    description:
      'A Canadian school platform that connects courses, student records, family visibility, private files, and fish rewards.',
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
      'A Canadian school platform for courses, records, families, privacy, and fish rewards.',
    images: ['/landing/websummit-water-garden.png'],
  },
}

interface PageProps {
  searchParams: Promise<{ lang?: string }>
}

const navItems = [
  { label: 'Product', href: '#product' },
  { label: 'Roles', href: '#roles' },
  { label: 'Trust', href: '#trust' },
  { label: 'Pilot', href: '#pilot' },
  { label: 'Contact', href: '#contact' },
]

const proofBadges = [
  'School pilot',
  'Role-based',
  'Private files',
  'Family-ready',
]

const productPillars = [
  {
    icon: CalendarCheck,
    title: 'Learning management',
    body: 'Courses, assignments, submissions, rubrics, feedback, and resources.',
  },
  {
    icon: GraduationCap,
    title: 'Student records',
    body: 'Attendance, gradebook, rosters, calendar dates, reports, and exports.',
  },
  {
    icon: BookOpen,
    title: 'Family visibility',
    body: 'Guardians see progress, feedback, missing work, attendance, and messages.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy controls',
    body: 'Role access, private uploads, audit logs, and clear data paths.',
  },
]

const featureIndex = [
  {
    group: 'Classroom',
    items: ['Courses', 'Modules', 'Assignments', 'Submissions', 'Rubrics', 'Feedback'],
  },
  {
    group: 'Records',
    items: ['Gradebook', 'Attendance', 'Rosters', 'Terms', 'Calendar', 'Missing work'],
  },
  {
    group: 'Families',
    items: ['Linked children', 'Progress', 'Teacher notes', 'Messages', 'Due dates', 'Alerts'],
  },
  {
    group: 'Admin',
    items: ['Schools', 'Users', 'Invites', 'Sections', 'Audit logs', 'Reports'],
  },
  {
    group: 'Files',
    items: ['Uploads', 'Downloads', 'Lessons', 'Resources', 'Student work', 'Teacher files'],
  },
  {
    group: 'Pilot',
    items: ['Demo roles', 'Grade exports', 'Attendance exports', 'SIS path', 'OneRoster checks', 'Support plan'],
  },
]

const roles = [
  {
    title: 'Students',
    body: 'A simple place for today’s work, feedback, grades, resources, messages, and fish rewards.',
    image: '/screenshots/actual-student-dashboard.png',
  },
  {
    title: 'Teachers',
    body: 'Create work, review submissions, grade with rubrics, take attendance, and message families.',
    image: '/screenshots/actual-teacher-dashboard.png',
  },
  {
    title: 'Guardians',
    body: 'See linked-child progress, missing work, attendance, teacher feedback, and key dates.',
    image: '/screenshots/actual-guardian-dashboard.png',
  },
  {
    title: 'Admins',
    body: 'Set up schools, users, courses, sections, exports, audit trails, and launch checks.',
    image: '/screenshots/actual-admin-dashboard.png',
  },
]

const readiness = [
  {
    icon: UsersRound,
    title: 'Role access',
    body: 'Students, teachers, guardians, and admins get separate, scoped views.',
  },
  {
    icon: UploadCloud,
    title: 'Private work',
    body: 'Uploads, submissions, and resources are treated as school records.',
  },
  {
    icon: FileText,
    title: 'Proof paths',
    body: 'Gradebook, attendance, SIS, OneRoster, and support checks are tracked.',
  },
  {
    icon: MessagesSquare,
    title: 'Pilot scope',
    body: 'Start with one school, verify workflows, then expand deliberately.',
  },
]

export default async function LMSHubPage({ searchParams }: PageProps) {
  const params = await searchParams
  const lang: Lang = params.lang === 'fr' ? 'fr' : 'en'
  const lp = lang === 'fr' ? '?lang=fr' : ''

  return (
    <div className="ww-landing">
      <ScrollPersist />
      <CommandPalette items={navItems} />

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
                Learning management, student records, and family visibility in one friendly school platform.
              </p>

              <div className="ww-hero-actions">
                <Link href="/login" className="ww-button">
                  Try Demo
                  <ArrowRight size={18} />
                </Link>
                <a href="#contact" className="ww-button ww-button-secondary">
                  Book Demo
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
            title="One school platform"
            body="Classes, records, messages, files, and family updates stay connected."
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
            title="What schools get"
            body="The daily workflows a serious pilot needs first."
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
            title="Clear for every role"
            body="Students, teachers, families, and admins each get the right view."
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
            title="Privacy first"
            body="School records need role access, private files, exports, and audit trails."
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
                Prove onboarding, classes, grading, attendance, family access, support, and exports.
              </p>
            </div>
            <div className="ww-pilot-list">
              {['Demo roles', 'Rosters', 'Courses', 'Families', 'Exports', 'Support'].map((item) => (
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
            body="Use WolfWhale for school demos, board conversations, and event follow-ups."
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
