import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Shield,
  GraduationCap,
  BookOpen,
  Brain,
  Award,
  Globe,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ClipboardCheck,
  BarChart3,
  Users,
  Trophy,
  Zap,
  MapPin,
  Repeat,
  Building2,
  Lock,
} from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageData {
  city?: string
  province?: string
  title: string
  h1: string
  description: string
  keywords: string[]
  heroText: string
  features: string[]
  /** If present, the page renders a competitor-comparison table */
  competitor?: string
  /** Extra paragraphs for the "Why Wolf Whale?" section */
  whyExtra?: string
}

// ---------------------------------------------------------------------------
// Feature icon mapping
// ---------------------------------------------------------------------------

const FEATURE_ICONS: Record<string, React.ElementType> = {
  'FERPA & PIPEDA Compliant': Shield,
  'Canadian Data Sovereignty': Globe,
  'Spaced Repetition Flashcards': Brain,
  'Interactive Courses & Quizzes': BookOpen,
  'Certificate Issuance': Award,
  'K-12 & Post-Secondary': GraduationCap,
  'Real-Time Messaging': Zap,
  'Gradebook & Analytics': BarChart3,
  'Parent Portal': Users,
  'Gamification & XP': Trophy,
  'Assignment & Testing': ClipboardCheck,
  'Attendance Tracking': CheckCircle2,
  'Multi-Tenant Architecture': Building2,
  'Built-in Study Mode': Brain,
  'No Self-Hosting Required': Globe,
  'Role-Based Access Control': Lock,
  'Auto-Grading': ClipboardCheck,
  'Calendar & Scheduling': BookOpen,
  'Custom Branding per School': Award,
  'Age-Adaptive UI': Users,
  'FERPA, COPPA & PIPEDA': Shield,
  'Modern Tech Stack': Zap,
  'Curriculum-Aligned Content': BookOpen,
  'Built for Canadian Schools': MapPin,
  'Spaced Repetition Built-In': Brain,
  'Zero Maintenance for Teachers': Zap,
  'Student Progress Tracking': BarChart3,
  'Engaging Gamification': Trophy,
  'Unlimited Courses': BookOpen,
  'Dedicated Support': Users,
  'Active Recall & Spacing': Brain,
  'Science-Backed Retention': Repeat,
  'FERPA & COPPA Compliant': Shield,
  'Audit Logging': Lock,
  'Data Export & Portability': Globe,
  'Row-Level Security': Shield,
  'Teacher Collaboration Tools': Users,
  'Shared Lesson Planning': BookOpen,
  'Peer Feedback & Discussion': Zap,
  'Curriculum Alignment': ClipboardCheck,
  'Unified Communication': Zap,
}

// ---------------------------------------------------------------------------
// PAGE DATA — Every entry is fully unique for SEO
// ---------------------------------------------------------------------------

const PAGES: Record<string, PageData> = {
  // ========== CITY PAGES ==========

  toronto: {
    city: 'Toronto',
    province: 'Ontario',
    title: 'LMS for Schools in Toronto',
    h1: 'The Best Learning Management System for Toronto Schools',
    description:
      'Wolf Whale LMS is the Canadian-built learning management system trusted by Toronto schools. FERPA-secure with built-in spaced repetition flashcards, interactive courses, quizzes, and certificates.',
    keywords: [
      'LMS for schools Toronto',
      'learning management system Toronto',
      'K-12 LMS Toronto',
      'online learning platform Toronto',
    ],
    heroText:
      'Toronto schools deserve a learning platform built for Canadian education. Wolf Whale LMS combines interactive courses, assessments, and the only built-in spaced repetition flashcards in any LMS.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Certificate Issuance',
      'K-12 & Post-Secondary',
    ],
    whyExtra:
      'Toronto is home to the largest school district in Canada. From the TDSB to independent schools in Midtown, educators need a platform that handles Ontario curriculum alignment, bilingual classrooms, and the privacy expectations of Canadian families. Wolf Whale was designed from day one for exactly this context.',
  },

  vancouver: {
    city: 'Vancouver',
    province: 'British Columbia',
    title: 'LMS for Schools in Vancouver',
    h1: 'The Leading Learning Management System for Vancouver Schools',
    description:
      'Wolf Whale LMS helps Vancouver schools deliver engaging digital learning. Canadian-hosted, PIPEDA compliant, with spaced repetition flashcards that no other LMS offers.',
    keywords: [
      'LMS for schools Vancouver',
      'learning management system Vancouver',
      'K-12 LMS Vancouver',
      'BC school LMS',
      'online learning platform Vancouver',
    ],
    heroText:
      'Vancouver educators need a platform that respects BC curriculum standards and Canadian data privacy. Wolf Whale LMS is 100% Canadian-built with built-in spaced repetition flashcards to help students retain what they learn.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Gradebook & Analytics',
      'K-12 & Post-Secondary',
    ],
    whyExtra:
      'British Columbia schools face unique demands: diverse student populations, outdoor and experiential education models, and strict provincial privacy requirements. Wolf Whale keeps student data in Canada and provides the flexible course tools Vancouver teachers need to create lessons that work for every learner.',
  },

  calgary: {
    city: 'Calgary',
    province: 'Alberta',
    title: 'LMS for Schools in Calgary',
    h1: 'Calgary Schools Choose Wolf Whale LMS',
    description:
      'The modern Canadian LMS for Calgary schools. FERPA & PIPEDA compliant with built-in spaced repetition flashcards, quizzes, gradebook, and parent portal.',
    keywords: [
      'LMS for schools Calgary',
      'learning management system Calgary',
      'K-12 LMS Calgary',
      'Alberta school LMS',
      'Calgary online learning platform',
    ],
    heroText:
      'Calgary schools need reliable, secure technology that aligns with Alberta Education standards. Wolf Whale LMS delivers interactive courses, real-time assessments, and the only built-in spaced repetition flashcards available in a learning management system.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Spaced Repetition Flashcards',
      'Assignment & Testing',
      'Parent Portal',
      'Gamification & XP',
    ],
    whyExtra:
      'Alberta schools have been early adopters of educational technology, and Calgary is no exception. Whether your school is part of the CBE or an independent institution, Wolf Whale gives teachers the tools to create compelling digital lessons while keeping student data safely within Canadian borders.',
  },

  ottawa: {
    city: 'Ottawa',
    province: 'Ontario',
    title: 'LMS for Schools in Ottawa',
    h1: 'Ottawa Schools Trust Wolf Whale LMS',
    description:
      'Wolf Whale LMS is the Canadian learning management system built for Ottawa schools. Bilingual support, PIPEDA compliance, and built-in spaced repetition flashcards.',
    keywords: [
      'LMS for schools Ottawa',
      'learning management system Ottawa',
      'K-12 LMS Ottawa',
      'Ottawa school platform',
      'bilingual LMS Canada',
    ],
    heroText:
      'As Canada\'s capital, Ottawa schools serve a uniquely bilingual community. Wolf Whale LMS supports French and English instruction with interactive courses, real-time messaging, and the only built-in spaced repetition flashcards in any learning management system.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Spaced Repetition Flashcards',
      'Real-Time Messaging',
      'Attendance Tracking',
      'K-12 & Post-Secondary',
    ],
    whyExtra:
      'Ottawa\'s school boards serve tens of thousands of students across English and French programs. Wolf Whale understands the bilingual reality of the National Capital Region and provides a platform where teachers can build courses in either language with full curriculum alignment.',
  },

  edmonton: {
    city: 'Edmonton',
    province: 'Alberta',
    title: 'LMS for Schools in Edmonton',
    h1: 'Edmonton Schools Powered by Wolf Whale LMS',
    description:
      'The Canadian-built LMS for Edmonton schools. Features spaced repetition flashcards, real-time grading, parent portal, and full PIPEDA compliance.',
    keywords: [
      'LMS for schools Edmonton',
      'learning management system Edmonton',
      'K-12 LMS Edmonton',
      'Edmonton online learning',
      'Alberta education LMS',
    ],
    heroText:
      'Edmonton educators are embracing digital learning tools that actually improve outcomes. Wolf Whale LMS is built in Canada for Canadian schools, with spaced repetition flashcards proven to boost long-term retention by up to 200%.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Spaced Repetition Flashcards',
      'Gradebook & Analytics',
      'Certificate Issuance',
      'Gamification & XP',
    ],
    whyExtra:
      'Edmonton Public Schools is one of the largest districts in western Canada. Wolf Whale LMS scales from individual classrooms to district-wide deployments with multi-tenant architecture, ensuring each school gets its own branded experience while administrators maintain oversight across the board.',
  },

  montreal: {
    city: 'Montreal',
    province: 'Quebec',
    title: 'LMS for Schools in Montreal',
    h1: 'Montreal Schools Embrace Wolf Whale LMS',
    description:
      'Wolf Whale LMS serves Montreal schools with a Canadian-built, PIPEDA-compliant platform. Built-in spaced repetition flashcards, interactive courses, and bilingual support.',
    keywords: [
      'LMS for schools Montreal',
      'learning management system Montreal',
      'K-12 LMS Montreal',
      'Quebec school LMS',
      'plateforme apprentissage Montreal',
    ],
    heroText:
      'Montreal\'s vibrant education community demands tools that support French-language instruction, Quebec curriculum standards, and Canadian data sovereignty. Wolf Whale LMS delivers all three, plus the only built-in spaced repetition flashcards in any LMS.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Multi-Tenant Architecture',
      'K-12 & Post-Secondary',
    ],
    whyExtra:
      'Quebec has its own privacy legislation (Law 25) and curriculum frameworks. Montreal schools need a platform that understands these requirements natively, not as an afterthought. Wolf Whale is Canadian-owned and Canadian-hosted, providing peace of mind that student data never leaves the country.',
  },

  winnipeg: {
    city: 'Winnipeg',
    province: 'Manitoba',
    title: 'LMS for Schools in Winnipeg',
    h1: 'Winnipeg Schools Thrive with Wolf Whale LMS',
    description:
      'Wolf Whale LMS is the Canadian learning platform for Winnipeg schools. Spaced repetition flashcards, PIPEDA compliance, interactive courses, and a built-in parent portal.',
    keywords: [
      'LMS for schools Winnipeg',
      'learning management system Winnipeg',
      'K-12 LMS Winnipeg',
      'Manitoba school LMS',
      'Winnipeg online learning',
    ],
    heroText:
      'Winnipeg schools can now access a truly Canadian learning management system. Wolf Whale LMS features interactive course building, real-time assessments, gamification, and the only built-in spaced repetition flashcards to help Manitoba students retain more of what they learn.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Spaced Repetition Flashcards',
      'Parent Portal',
      'Gamification & XP',
      'Attendance Tracking',
    ],
    whyExtra:
      'Manitoba schools are increasingly looking for digital tools that keep student data in Canada. Wolf Whale LMS is hosted entirely on Canadian infrastructure and built to support the Manitoba curriculum, giving Winnipeg educators a platform they can trust.',
  },

  halifax: {
    city: 'Halifax',
    province: 'Nova Scotia',
    title: 'LMS for Schools in Halifax',
    h1: 'Halifax Schools Discover Wolf Whale LMS',
    description:
      'Canadian-built LMS for Halifax schools. Wolf Whale features spaced repetition flashcards, PIPEDA compliance, interactive courses, quizzes, and certificates for Nova Scotia educators.',
    keywords: [
      'LMS for schools Halifax',
      'learning management system Halifax',
      'K-12 LMS Halifax',
      'Nova Scotia school LMS',
      'Halifax online learning platform',
    ],
    heroText:
      'Halifax and Nova Scotia schools deserve a learning platform that understands Atlantic Canadian education. Wolf Whale LMS provides interactive courses, real-time collaboration, and the only built-in spaced repetition flashcards in any learning management system.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Real-Time Messaging',
      'Certificate Issuance',
    ],
    whyExtra:
      'Nova Scotia\'s education system has been a national leader in adopting technology to improve student outcomes. Wolf Whale LMS builds on that tradition with a modern, Canadian-hosted platform that helps Halifax teachers create engaging digital experiences while respecting provincial and federal privacy laws.',
  },

  // ========== USE-CASE PAGES ==========

  'k-12': {
    title: 'Best LMS for K-12 Schools in Canada',
    h1: 'K-12 Learning Management System Built for Canadian Schools',
    description:
      'Wolf Whale LMS is purpose-built for K-12 education in Canada. Age-adaptive UI, spaced repetition flashcards, gamification, parent portal, and full FERPA/PIPEDA compliance.',
    keywords: [
      'K-12 LMS Canada',
      'best LMS for K-12 schools',
      'elementary school LMS',
      'high school learning management system',
      'K-12 online learning platform Canada',
    ],
    heroText:
      'From kindergarten through grade 12, Wolf Whale LMS adapts to every age group. Our age-adaptive interface makes learning intuitive for young children while remaining sophisticated enough for high school students preparing for post-secondary. Plus, we are the only LMS with built-in spaced repetition flashcards.',
    features: [
      'Age-Adaptive UI',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
      'Gradebook & Analytics',
    ],
    whyExtra:
      'Most LMS platforms were designed for universities and retrofitted for younger students. Wolf Whale was built from the ground up for K-12, with playful interfaces for elementary students (K-5), balanced layouts for middle schoolers (6-8), and professional dashboards for high schoolers (9-12). Every detail is age-appropriate.',
  },

  'post-secondary': {
    title: 'LMS for Post-Secondary Education in Canada',
    h1: 'The Modern LMS for Canadian Colleges and Universities',
    description:
      'Wolf Whale LMS empowers post-secondary institutions with interactive courses, spaced repetition flashcards, certificates, and compliance-ready architecture. Canadian-built and hosted.',
    keywords: [
      'post-secondary LMS Canada',
      'college LMS Canada',
      'university learning management system',
      'higher education LMS',
      'Canadian post-secondary learning platform',
    ],
    heroText:
      'Canadian colleges and universities need a learning management system that scales. Wolf Whale LMS provides rich course authoring, auto-grading, certificate issuance, and the only built-in spaced repetition flashcards in any LMS, helping students retain knowledge across semesters.',
    features: [
      'Spaced Repetition Flashcards',
      'Certificate Issuance',
      'Auto-Grading',
      'Multi-Tenant Architecture',
      'FERPA & PIPEDA Compliant',
      'Gradebook & Analytics',
    ],
    whyExtra:
      'Post-secondary students juggle multiple courses and need to retain information over months and years. Our built-in spaced repetition system schedules review sessions at scientifically optimal intervals, dramatically improving retention rates compared to traditional study methods. No plugins, no third-party integrations, just effective learning out of the box.',
  },

  'canvas-alternative': {
    title: 'Best Canvas Alternative for Canadian Schools',
    h1: 'Why Canadian Schools Are Switching from Canvas to Wolf Whale',
    description:
      'Looking for a Canvas alternative? Wolf Whale LMS offers Canadian data sovereignty, built-in spaced repetition flashcards, and PIPEDA compliance that Canvas cannot match.',
    keywords: [
      'Canvas alternative',
      'Canvas alternative Canada',
      'Canvas LMS replacement',
      'better than Canvas LMS',
      'Canvas vs Wolf Whale',
    ],
    heroText:
      'Canvas is a popular LMS, but it was built for the American market. Canadian schools need Canadian data sovereignty, PIPEDA compliance, and a platform that understands our curriculum. Wolf Whale LMS delivers everything Canvas does, plus built-in spaced repetition flashcards that Canvas will never have.',
    features: [
      'Canadian Data Sovereignty',
      'Spaced Repetition Built-In',
      'FERPA & PIPEDA Compliant',
      'Gamification & XP',
      'Parent Portal',
      'K-12 & Post-Secondary',
    ],
    competitor: 'Canvas',
    whyExtra:
      'Canvas stores data on American servers governed by US law, including the CLOUD Act. Wolf Whale keeps all student data in Canada on Canadian infrastructure. For schools that take PIPEDA and provincial privacy regulations seriously, that difference matters enormously.',
  },

  'moodle-alternative': {
    title: 'Best Moodle Alternative for Schools',
    h1: 'A Modern Moodle Alternative That Teachers Actually Enjoy',
    description:
      'Tired of Moodle? Wolf Whale LMS is a modern, cloud-hosted alternative with built-in spaced repetition flashcards, gamification, and zero server maintenance.',
    keywords: [
      'Moodle alternative',
      'Moodle alternative Canada',
      'Moodle replacement',
      'better than Moodle',
      'Moodle vs Wolf Whale',
      'modern LMS alternative to Moodle',
    ],
    heroText:
      'Moodle is open-source and flexible, but it comes with a heavy price: server maintenance, plugin conflicts, clunky interfaces, and no built-in spaced repetition. Wolf Whale LMS gives you a modern, cloud-hosted platform that teachers love, with zero IT overhead.',
    features: [
      'No Self-Hosting Required',
      'Spaced Repetition Built-In',
      'Modern Tech Stack',
      'Gamification & XP',
      'FERPA & PIPEDA Compliant',
      'Real-Time Messaging',
    ],
    competitor: 'Moodle',
    whyExtra:
      'Moodle requires dedicated server infrastructure, PHP expertise, and constant plugin updates. Schools spend thousands on hosting and IT staff just to keep Moodle running. Wolf Whale is fully managed in the cloud. Your teachers log in and teach. That is it. No servers, no updates, no downtime.',
  },

  'brightspace-alternative': {
    title: 'Brightspace Alternative - Wolf Whale LMS',
    h1: 'The Brightspace Alternative Built for Canadian Schools',
    description:
      'Considering a Brightspace alternative? Wolf Whale LMS offers built-in spaced repetition flashcards, Canadian data sovereignty, gamification, and a modern interface at a competitive price.',
    keywords: [
      'Brightspace alternative',
      'D2L Brightspace alternative',
      'Brightspace alternative Canada',
      'Brightspace replacement',
      'D2L vs Wolf Whale',
    ],
    heroText:
      'Brightspace is a capable platform, but Wolf Whale LMS offers something it does not: built-in spaced repetition flashcards, age-adaptive interfaces for K-12, and a pricing model that does not require an enterprise sales process. Canadian-built for Canadian schools.',
    features: [
      'Spaced Repetition Built-In',
      'Age-Adaptive UI',
      'Canadian Data Sovereignty',
      'Gamification & XP',
      'FERPA & PIPEDA Compliant',
      'Certificate Issuance',
    ],
    competitor: 'Brightspace',
    whyExtra:
      'Brightspace is a strong enterprise product, but its complexity and pricing can be prohibitive for smaller schools and independent institutions. Wolf Whale offers transparent, per-user pricing with every feature included. No tiers, no add-ons, no surprise invoices.',
  },

  'spaced-repetition-lms': {
    title: 'The Only LMS with Built-in Spaced Repetition Flashcards',
    h1: 'Finally: An LMS with Built-in Spaced Repetition',
    description:
      'Wolf Whale is the only learning management system with built-in spaced repetition flashcards. Stop losing knowledge to the forgetting curve. Backed by decades of cognitive science.',
    keywords: [
      'spaced repetition LMS',
      'LMS with flashcards',
      'spaced repetition learning platform',
      'flashcard LMS',
      'forgetting curve LMS',
      'active recall learning management system',
    ],
    heroText:
      'Every other LMS treats spaced repetition as an afterthought, if they address it at all. Wolf Whale is the first and only learning management system with built-in spaced repetition flashcards. Teachers create flashcard decks alongside their courses, and the system automatically schedules reviews at scientifically optimal intervals.',
    features: [
      'Active Recall & Spacing',
      'Science-Backed Retention',
      'Interactive Courses & Quizzes',
      'Gradebook & Analytics',
      'Gamification & XP',
      'K-12 & Post-Secondary',
    ],
    whyExtra:
      'The forgetting curve is real: students forget up to 80% of new material within a week without reinforcement. Spaced repetition combats this by scheduling reviews at precisely the right moment, just before a memory fades. Research shows this approach can improve long-term retention by 200% or more. Wolf Whale integrates this directly into the LMS so teachers do not need to rely on third-party apps like Anki or Quizlet.',
  },

  'teacher-collaboration': {
    title: 'Teacher Collaboration Tools for K-12 Schools | Wolf Whale LMS',
    h1: 'Teacher Collaboration Tools That Actually Change Instruction Quality',
    description:
      'Great instruction doesn\'t happen in isolation. Wolf Whale LMS gives K-12 teachers built-in collaboration tools for aligned curriculum, shared lesson planning, peer feedback, and consistent student support — all in one platform.',
    keywords: [
      'teacher collaboration tools',
      'K-12 teacher collaboration platform',
      'teacher communication tools LMS',
      'shared lesson planning software',
      'peer feedback tools for teachers',
      'curriculum alignment platform',
      'teacher collaboration LMS Canada',
    ],
    heroText:
      'Great instruction doesn\'t happen in isolation. It happens when teachers share, refine, and elevate each other\'s practice. Wolf Whale LMS gives every educator built-in real-time messaging, shared course authoring, discussion threads, and file sharing — so collaboration isn\'t an afterthought bolted on through third-party tools. It\'s foundational to how your school runs.',
    features: [
      'Real-Time Messaging',
      'Shared Lesson Planning',
      'Curriculum Alignment',
      'Peer Feedback & Discussion',
      'Parent Portal',
      'Gradebook & Analytics',
    ],
    whyExtra:
      'Most schools cobble together collaboration from email, Slack, Google Drive, and separate LMS logins. Teachers waste hours switching between tools instead of actually teaching. Wolf Whale unifies everything: lesson planning, grading discussions, parent communication, and professional development all happen inside the same platform students use. Aligned curriculum, shared lesson clarity, peer feedback loops, and consistent student support aren\'t aspirational goals — they\'re built into the workflow.',
  },

  'edsby-alternative': {
    title: 'Best Edsby Alternative for Canadian Schools | Wolf Whale LMS',
    h1: 'The Edsby Alternative with Spaced Repetition and Modern UX',
    description:
      'Looking for an Edsby alternative? Wolf Whale LMS offers built-in spaced repetition flashcards, gamification, real-time messaging, and a modern interface that teachers and students actually enjoy using.',
    keywords: [
      'Edsby alternative',
      'Edsby alternative Canada',
      'Edsby replacement',
      'better than Edsby',
      'Edsby vs Wolf Whale',
      'K-12 LMS alternative to Edsby',
    ],
    heroText:
      'Edsby is a well-known K-12 platform in Canada, but it lacks the modern learning science features that drive real student outcomes. Wolf Whale LMS includes everything Edsby offers — plus built-in spaced repetition flashcards, gamification with XP and achievements, age-adaptive interfaces, and a technology stack built for speed.',
    features: [
      'Spaced Repetition Built-In',
      'Gamification & XP',
      'Age-Adaptive UI',
      'Real-Time Messaging',
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
    ],
    competitor: 'Edsby',
    whyExtra:
      'Edsby provides solid teacher collaboration and parent engagement, but Wolf Whale goes further. Our spaced repetition flashcards are backed by decades of cognitive science research, proven to improve long-term retention by over 200%. Our gamification system keeps students engaged with XP, achievements, leaderboards, and skill trees. And our age-adaptive UI automatically adjusts the interface for K-5, 6-8, and 9-12 students — something no other Canadian LMS offers.',
  },

  'ferpa-compliant-lms': {
    title: 'FERPA Compliant LMS for Canadian Schools',
    h1: 'FERPA, COPPA, and PIPEDA Compliant Learning Management System',
    description:
      'Wolf Whale LMS meets FERPA, COPPA, and PIPEDA compliance standards. Canadian-hosted with row-level security, audit logging, and full data export capabilities.',
    keywords: [
      'FERPA compliant LMS',
      'PIPEDA compliant LMS',
      'COPPA compliant LMS Canada',
      'secure LMS for schools',
      'privacy compliant learning platform',
      'Canadian data sovereignty LMS',
    ],
    heroText:
      'Compliance is not optional when student data is involved. Wolf Whale LMS is built from the ground up with FERPA, COPPA, and PIPEDA compliance. Canadian-hosted infrastructure, row-level security in PostgreSQL, complete audit logging, and full data export ensure your school meets every regulatory requirement.',
    features: [
      'FERPA, COPPA & PIPEDA',
      'Audit Logging',
      'Data Export & Portability',
      'Row-Level Security',
      'Canadian Data Sovereignty',
      'Role-Based Access Control',
    ],
    whyExtra:
      'Many LMS platforms claim compliance but store data on US servers subject to the CLOUD Act and Patriot Act. Wolf Whale is different. We are a Canadian company hosting on Canadian infrastructure. Row-level security in PostgreSQL ensures that users can only access their own data. Every action is audit-logged. And if you ever need to leave, full data export is available in standard formats.',
  },
}

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
      siteName: 'Wolf Whale LMS',
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
            name: 'Wolf Whale Inc.',
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
              alt="Wolf Whale"
              className="h-14 w-14 rounded-xl object-contain shadow-lg"
            />
            <div>
              <span className="text-xl font-display font-bold text-[#0A2540] block tracking-wider uppercase">
                Wolf Whale LMS
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
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#33FF33] hover:shadow-[0_0_30px_rgba(0,191,255,0.4)] transition-all font-semibold text-white group neon-glow-blue"
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
              Why Wolf Whale LMS?
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
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#00BFFF] to-[#33FF33]">
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
                Wolf Whale vs {page.competitor}
              </h2>
              <p className="text-lg text-[#0A2540]/60 max-w-2xl mx-auto">
                See how Wolf Whale LMS compares to {page.competitor} on the
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
                      Wolf Whale
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
              Join the growing number of Canadian schools choosing Wolf Whale
              LMS. Start with a free account today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#33FF33] hover:shadow-[0_0_30px_rgba(0,191,255,0.4)] transition-all font-semibold text-white group neon-glow-blue"
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
                  alt="Wolf Whale"
                  className="h-14 w-14 rounded-xl object-contain shadow-lg"
                />
                <div>
                  <span className="font-display font-bold block tracking-wider uppercase">
                    Wolf Whale LMS
                  </span>
                  <span className="text-xs text-[#0A2540]/60 font-display font-semibold tracking-widest uppercase">
                    Modern K-12 &amp; Post-Secondary Learning Platform
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#0A2540]/60 max-w-md">
                Canadian-built learning management system with built-in spaced
                repetition flashcards. FERPA, COPPA, and PIPEDA compliant.
              </p>
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
            <p>&copy; 2026 Wolf Whale LMS. All rights reserved.</p>
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
      'Wolf Whale is fully managed in the cloud. No servers to maintain, no software to update, no plugins to troubleshoot. Your teachers log in and teach.',
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
      'Every feature in Wolf Whale was designed with Canadian schools in mind. From PIPEDA compliance to bilingual support, this is a platform that understands your context.',
    'Spaced Repetition Built-In':
      'No plugins or third-party apps needed. Spaced repetition flashcards are a core feature of Wolf Whale LMS, integrated directly into the course experience.',
    'Zero Maintenance for Teachers':
      'Teachers should teach, not troubleshoot software. Wolf Whale handles all infrastructure, updates, and security so educators can focus on their students.',
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
      'Decades of research support spaced repetition as the most effective method for long-term memory. Wolf Whale brings this science directly into the classroom.',
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
