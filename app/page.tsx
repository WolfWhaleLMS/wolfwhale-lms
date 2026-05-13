import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  FileText,
  GraduationCap,
  Leaf,
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

interface PageProps {
  searchParams: Promise<{ lang?: string }>
}

const navItems = [
  { label: 'What it is', href: '#what' },
  { label: 'Who it is for', href: '#roles' },
  { label: 'What it does', href: '#does' },
  { label: 'Resources', href: '#resources' },
  { label: 'Pilot', href: '#pilot' },
]

const proofBadges = [
  'For students',
  'For teachers',
  'For families',
  'For school teams',
]

const simpleExplainers = [
  {
    icon: CalendarCheck,
    title: 'What is WolfWhale?',
    body: 'WolfWhale is a school website where learning work lives. It gives each person one place to find classes, work, grades, files, messages, and school updates.',
  },
  {
    icon: GraduationCap,
    title: 'Who uses it?',
    body: 'Students use it to learn and turn in work. Teachers use it to teach and grade. Families use it to see progress. Admin teams use it to keep school records organized.',
  },
  {
    icon: BookOpen,
    title: 'What does it do?',
    body: 'It keeps courses, assignments, attendance, grades, calendars, learning resources, and messages together so school days are easier to follow.',
  },
  {
    icon: ShieldCheck,
    title: 'How do people get in?',
    body: 'The public site opens first. The Enter LMS button takes signed-in users into protected student, teacher, guardian, and admin spaces.',
  },
]

const featureIndex = [
  {
    group: 'Students',
    items: ['Open courses', 'See assignments', 'Submit work', 'Read feedback', 'Check grades', 'Use resources'],
  },
  {
    group: 'Teachers',
    items: ['Create assignments', 'Take attendance', 'Grade submissions', 'Share files', 'Message students', 'Export gradebooks'],
  },
  {
    group: 'Families',
    items: ['Follow progress', 'View attendance', 'See feedback', 'Read messages', 'Check calendars', 'Support students'],
  },
  {
    group: 'School teams',
    items: ['Manage rosters', 'Track courses', 'Review resources', 'Export records', 'Check launch health', 'Keep audit history'],
  },
]

const roles = [
  {
    title: 'Students',
    body: 'A simple home base for classes, due dates, submitted work, grades, teacher feedback, attendance, messages, and study tools.',
    image: '/screenshots/actual-student-dashboard.png',
  },
  {
    title: 'Teachers',
    body: 'A teaching workspace for class lists, assignments, grading, rubrics, attendance, course files, gradebook exports, and feedback.',
    image: '/screenshots/actual-teacher-dashboard.png',
  },
  {
    title: 'Guardians',
    body: 'A family view of student progress, attendance, grades, feedback, calendar items, messages, and school updates.',
    image: '/screenshots/actual-guardian-dashboard.png',
  },
  {
    title: 'Admins',
    body: 'A school operations view for setup, rosters, courses, attendance exports, audit trails, resources, messages, and launch checks.',
    image: '/screenshots/actual-admin-dashboard.png',
  },
]

const readiness = [
  {
    icon: UsersRound,
    title: 'One login path',
    body: 'People start at the public site, then use Enter LMS or Sign In to reach the protected LMS.',
  },
  {
    icon: UploadCloud,
    title: 'Everyday school flow',
    body: 'Assignments, submissions, grades, rubrics, attendance, roster imports, and private resources stay connected.',
  },
  {
    icon: FileText,
    title: 'Records can leave the system',
    body: 'Gradebook, attendance, report-card, SIS, OneRoster, SSO config, and district proof checks are documented.',
  },
  {
    icon: MessagesSquare,
    title: 'Ready for focused pilots',
    body: 'WolfWhale is ready for single-school and carefully scoped multi-school pilots.',
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
              <p className="ww-kicker">WolfWhale LMS</p>
              <h1>A simple home base for school.</h1>
              <p className="ww-lede">
                WolfWhale is a learning management system for K-12 schools. It helps students, teachers, families, and school staff see the school work they need in one clear place.
              </p>

              <div className="ww-hero-actions">
                <Link href="/login" className="ww-button">
                  Enter LMS
                  <ArrowRight size={18} />
                </Link>
                <a href="#contact" className="ww-button">
                  Talk to Us
                  <ArrowRight size={18} />
                </a>
                <a href="#what" className="ww-button ww-button-secondary">
                  Learn What It Does
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

        <section id="what" className="ww-section">
          <SectionIntro
            label="What it is"
            title="Plain English version"
            body="WolfWhale is the online place where a school day gets organized."
          />

          <div className="ww-shell ww-pillar-grid">
            {simpleExplainers.map(({ icon: Icon, title, body }) => (
              <article key={title} className="ww-glass-card">
                <Icon size={28} />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="does" className="ww-section ww-feature-index-section">
          <SectionIntro
            label="What it does"
            title="The everyday jobs it handles"
            body="WolfWhale keeps the common school tasks close together so people are not hunting through different tools."
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
            label="Who it is for"
            title="Each person gets the right view"
            body="Students, teachers, guardians, and admins each see the tools and records meant for their role."
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

        <section id="resources" className="ww-section ww-resource-section">
          <SectionIntro
            label="Resources"
            title="Learning materials can be more than files"
            body="The Resource Center can hold class files, diagrams, and visual learning tools, including updated plant-cell courseware."
          />

          <div className="ww-shell ww-resource-showcase">
            <div className="ww-resource-copy">
              <p className="ww-kicker">Resource Center</p>
              <h3>Open the lesson, inspect the model, keep learning.</h3>
              <p>
                Teachers can share course resources. Students can open diagrams and files from the same LMS space where their assignments, grades, and messages already live.
              </p>
              <div className="ww-hero-actions">
                <Link href="/login" className="ww-button">
                  Enter LMS
                  <ArrowRight size={18} />
                </Link>
                <Link href="/student/resources" className="ww-button ww-button-secondary">
                  Resource Center
                  <Leaf size={18} />
                </Link>
              </div>
            </div>

            <div className="ww-plant-cell-visual" aria-label="Plant cell courseware preview">
              <Image
                src="/cell-architecture/reference/image-gen-hd-cell-model-reference.png"
                alt="Updated plant-cell visual reference for WolfWhale Resource Center courseware"
                width={1200}
                height={900}
                style={{ width: '100%', height: 'auto' }}
              />
              <div className="ww-plant-cell-caption">
                <MicroscopeIcon />
                <span>Plant-cell visual pack for resource lessons</span>
              </div>
            </div>
          </div>
        </section>

        <section id="access" className="ww-section">
          <SectionIntro
            label="Access"
            title="The landing page comes first"
            body="wolfwhale.ca opens to this public explanation first. LMS pages stay protected, and existing login behavior still sends people to the right dashboard."
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
                WolfWhale is ready for a clear pilot: set up roles, add courses, try daily workflows, check family visibility, and prove the support path before growing.
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

function GlossyBubbles() {
  return (
    <>
      <span className="ww-bubble ww-bubble-1" aria-hidden="true" />
      <span className="ww-bubble ww-bubble-2" aria-hidden="true" />
      <span className="ww-bubble ww-bubble-3" aria-hidden="true" />
    </>
  )
}

function MicroscopeIcon() {
  return <Leaf size={16} aria-hidden="true" />
}
