import {
  Shield,
  GraduationCap,
  BookOpen,
  Brain,
  Award,
  Globe,
  CheckCircle2,
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PageData {
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
  /** Extra paragraphs for the "Why WolfWhale?" section */
  whyExtra?: string
}

// ---------------------------------------------------------------------------
// Feature icon mapping
// ---------------------------------------------------------------------------

export const FEATURE_ICONS: Record<string, React.ElementType> = {
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

export const PAGES: Record<string, PageData> = {
  // ========== CITY PAGES ==========

  toronto: {
    city: 'Toronto',
    province: 'Ontario',
    title: 'LMS for Schools in Toronto | WolfWhale',
    h1: 'The Best Learning Management System for Toronto Schools',
    description:
      'WolfWhale LMS is the Canadian-built learning management system trusted by Toronto schools. FERPA-secure with built-in spaced repetition flashcards, interactive courses, quizzes, and certificates.',
    keywords: [
      'LMS for schools Toronto',
      'learning management system Toronto',
      'K-12 LMS Toronto',
      'online learning platform Toronto',
    ],
    heroText:
      'Toronto schools deserve a learning platform built for Canadian education. WolfWhale LMS combines interactive courses, assessments, and the only built-in spaced repetition flashcards in any LMS.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Certificate Issuance',
      'K-12 & Post-Secondary',
    ],
    whyExtra:
      'Toronto is home to the largest school district in Canada. From the TDSB to independent schools in Midtown, educators need a platform that handles Ontario curriculum alignment, bilingual classrooms, and the privacy expectations of Canadian families. WolfWhale was designed from day one for exactly this context.',
  },

  vancouver: {
    city: 'Vancouver',
    province: 'British Columbia',
    title: 'LMS for Schools in Vancouver | WolfWhale',
    h1: 'The Leading Learning Management System for Vancouver Schools',
    description:
      'WolfWhale LMS helps Vancouver schools deliver engaging digital learning. Canadian-hosted, PIPEDA compliant, with spaced repetition flashcards that no other LMS offers.',
    keywords: [
      'LMS for schools Vancouver',
      'learning management system Vancouver',
      'K-12 LMS Vancouver',
      'BC school LMS',
      'online learning platform Vancouver',
    ],
    heroText:
      'Vancouver educators need a platform that respects BC curriculum standards and Canadian data privacy. WolfWhale LMS is 100% Canadian-built with built-in spaced repetition flashcards to help students retain what they learn.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Gradebook & Analytics',
      'K-12 & Post-Secondary',
    ],
    whyExtra:
      'British Columbia schools face unique demands: diverse student populations, outdoor and experiential education models, and strict provincial privacy requirements. WolfWhale keeps student data in Canada and provides the flexible course tools Vancouver teachers need to create lessons that work for every learner.',
  },

  calgary: {
    city: 'Calgary',
    province: 'Alberta',
    title: 'LMS for Schools in Calgary | WolfWhale',
    h1: 'Calgary Schools Choose WolfWhale LMS',
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
      'Calgary schools need reliable, secure technology that aligns with Alberta Education standards. WolfWhale LMS delivers interactive courses, real-time assessments, and the only built-in spaced repetition flashcards available in a learning management system.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Spaced Repetition Flashcards',
      'Assignment & Testing',
      'Parent Portal',
      'Gamification & XP',
    ],
    whyExtra:
      'Alberta schools have been early adopters of educational technology, and Calgary is no exception. Whether your school is part of the CBE or an independent institution, WolfWhale gives teachers the tools to create compelling digital lessons while keeping student data safely within Canadian borders.',
  },

  ottawa: {
    city: 'Ottawa',
    province: 'Ontario',
    title: 'LMS for Schools in Ottawa | WolfWhale',
    h1: 'Ottawa Schools Trust WolfWhale LMS',
    description:
      'WolfWhale LMS is the Canadian learning management system built for Ottawa schools. Bilingual support, PIPEDA compliance, and built-in spaced repetition flashcards.',
    keywords: [
      'LMS for schools Ottawa',
      'learning management system Ottawa',
      'K-12 LMS Ottawa',
      'Ottawa school platform',
      'bilingual LMS Canada',
    ],
    heroText:
      'As Canada\'s capital, Ottawa schools serve a uniquely bilingual community. WolfWhale LMS supports French and English instruction with interactive courses, real-time messaging, and the only built-in spaced repetition flashcards in any learning management system.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Spaced Repetition Flashcards',
      'Real-Time Messaging',
      'Attendance Tracking',
      'K-12 & Post-Secondary',
    ],
    whyExtra:
      'Ottawa\'s school boards serve tens of thousands of students across English and French programs. WolfWhale understands the bilingual reality of the National Capital Region and provides a platform where teachers can build courses in either language with full curriculum alignment.',
  },

  edmonton: {
    city: 'Edmonton',
    province: 'Alberta',
    title: 'LMS for Schools in Edmonton | WolfWhale',
    h1: 'Edmonton Schools Powered by WolfWhale LMS',
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
      'Edmonton educators are embracing digital learning tools that actually improve outcomes. WolfWhale LMS is built in Canada for Canadian schools, with spaced repetition flashcards proven to boost long-term retention by up to 200%.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Spaced Repetition Flashcards',
      'Gradebook & Analytics',
      'Certificate Issuance',
      'Gamification & XP',
    ],
    whyExtra:
      'Edmonton Public Schools is one of the largest districts in western Canada. WolfWhale LMS scales from individual classrooms to district-wide deployments with multi-tenant architecture, ensuring each school gets its own branded experience while administrators maintain oversight across the board.',
  },

  montreal: {
    city: 'Montreal',
    province: 'Quebec',
    title: 'LMS for Schools in Montreal | WolfWhale',
    h1: 'Montreal Schools Embrace WolfWhale LMS',
    description:
      'WolfWhale LMS serves Montreal schools with a Canadian-built, PIPEDA-compliant platform. Built-in spaced repetition flashcards, interactive courses, and bilingual support.',
    keywords: [
      'LMS for schools Montreal',
      'learning management system Montreal',
      'K-12 LMS Montreal',
      'Quebec school LMS',
      'plateforme apprentissage Montreal',
    ],
    heroText:
      'Montreal\'s vibrant education community demands tools that support French-language instruction, Quebec curriculum standards, and Canadian data sovereignty. WolfWhale LMS delivers all three, plus the only built-in spaced repetition flashcards in any LMS.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Multi-Tenant Architecture',
      'K-12 & Post-Secondary',
    ],
    whyExtra:
      'Quebec has its own privacy legislation (Law 25) and curriculum frameworks. Montreal schools need a platform that understands these requirements natively, not as an afterthought. WolfWhale is Canadian-owned and Canadian-hosted, providing peace of mind that student data never leaves the country.',
  },

  winnipeg: {
    city: 'Winnipeg',
    province: 'Manitoba',
    title: 'LMS for Schools in Winnipeg | WolfWhale',
    h1: 'Winnipeg Schools Thrive with WolfWhale LMS',
    description:
      'WolfWhale LMS is the Canadian learning platform for Winnipeg schools. Spaced repetition flashcards, PIPEDA compliance, interactive courses, and a built-in parent portal.',
    keywords: [
      'LMS for schools Winnipeg',
      'learning management system Winnipeg',
      'K-12 LMS Winnipeg',
      'Manitoba school LMS',
      'Winnipeg online learning',
    ],
    heroText:
      'Winnipeg schools can now access a truly Canadian learning management system. WolfWhale LMS features interactive course building, real-time assessments, gamification, and the only built-in spaced repetition flashcards to help Manitoba students retain more of what they learn.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Spaced Repetition Flashcards',
      'Parent Portal',
      'Gamification & XP',
      'Attendance Tracking',
    ],
    whyExtra:
      'Manitoba schools are increasingly looking for digital tools that keep student data in Canada. WolfWhale LMS is hosted entirely on Canadian infrastructure and built to support the Manitoba curriculum, giving Winnipeg educators a platform they can trust.',
  },

  halifax: {
    city: 'Halifax',
    province: 'Nova Scotia',
    title: 'LMS for Schools in Halifax | WolfWhale',
    h1: 'Halifax Schools Discover WolfWhale LMS',
    description:
      'Canadian-built LMS for Halifax schools. WolfWhale features spaced repetition flashcards, PIPEDA compliance, interactive courses, quizzes, and certificates for Nova Scotia educators.',
    keywords: [
      'LMS for schools Halifax',
      'learning management system Halifax',
      'K-12 LMS Halifax',
      'Nova Scotia school LMS',
      'Halifax online learning platform',
    ],
    heroText:
      'Halifax and Nova Scotia schools deserve a learning platform that understands Atlantic Canadian education. WolfWhale LMS provides interactive courses, real-time collaboration, and the only built-in spaced repetition flashcards in any learning management system.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Real-Time Messaging',
      'Certificate Issuance',
    ],
    whyExtra:
      'Nova Scotia\'s education system has been a national leader in adopting technology to improve student outcomes. WolfWhale LMS builds on that tradition with a modern, Canadian-hosted platform that helps Halifax teachers create engaging digital experiences while respecting provincial and federal privacy laws.',
  },

  // ========== USE-CASE PAGES ==========

  'k-12': {
    title: 'K-12 LMS for Canadian Schools | WolfWhale',
    h1: 'K-12 Learning Management System Built for Canadian Schools',
    description:
      'WolfWhale LMS is purpose-built for K-12 education in Canada. Age-adaptive UI, spaced repetition flashcards, gamification, parent portal, and full FERPA/PIPEDA compliance.',
    keywords: [
      'K-12 LMS Canada',
      'best LMS for K-12 schools',
      'elementary school LMS',
      'high school learning management system',
      'K-12 online learning platform Canada',
    ],
    heroText:
      'From kindergarten through grade 12, WolfWhale LMS adapts to every age group. Our age-adaptive interface makes learning intuitive for young children while remaining sophisticated enough for high school students preparing for post-secondary. Plus, we are the only LMS with built-in spaced repetition flashcards.',
    features: [
      'Age-Adaptive UI',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
      'Gradebook & Analytics',
    ],
    whyExtra:
      'Most LMS platforms were designed for universities and retrofitted for younger students. WolfWhale was built from the ground up for K-12, with playful interfaces for elementary students (K-5), balanced layouts for middle schoolers (6-8), and professional dashboards for high schoolers (9-12). Every detail is age-appropriate.',
  },

  'post-secondary': {
    title: 'Post-Secondary LMS for Canadian Colleges | WolfWhale',
    h1: 'The Modern LMS for Canadian Colleges and Universities',
    description:
      'WolfWhale LMS empowers post-secondary institutions with interactive courses, spaced repetition flashcards, certificates, and compliance-ready architecture. Canadian-built and hosted.',
    keywords: [
      'post-secondary LMS Canada',
      'college LMS Canada',
      'university learning management system',
      'higher education LMS',
      'Canadian post-secondary learning platform',
    ],
    heroText:
      'Canadian colleges and universities need a learning management system that scales. WolfWhale LMS provides rich course authoring, auto-grading, certificate issuance, and the only built-in spaced repetition flashcards in any LMS, helping students retain knowledge across semesters.',
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
    title: 'Canvas Alternative for Canadian Schools | WolfWhale',
    h1: 'Why Canadian Schools Are Switching from Canvas to WolfWhale',
    description:
      'Looking for a Canvas alternative? WolfWhale LMS offers Canadian data sovereignty, built-in spaced repetition flashcards, and PIPEDA compliance that Canvas cannot match.',
    keywords: [
      'Canvas alternative',
      'Canvas alternative Canada',
      'Canvas LMS replacement',
      'better than Canvas LMS',
      'Canvas vs WolfWhale',
    ],
    heroText:
      'Canvas is a popular LMS, but it was built for the American market. Canadian schools need Canadian data sovereignty, PIPEDA compliance, and a platform that understands our curriculum. WolfWhale LMS delivers everything Canvas does, plus built-in spaced repetition flashcards that Canvas will never have.',
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
      'Canvas stores data on American servers governed by US law, including the CLOUD Act. WolfWhale keeps all student data in Canada on Canadian infrastructure. For schools that take PIPEDA and provincial privacy regulations seriously, that difference matters enormously.',
  },

  'moodle-alternative': {
    title: 'Moodle Alternative - Modern Cloud LMS | WolfWhale',
    h1: 'A Modern Moodle Alternative That Teachers Actually Enjoy',
    description:
      'Tired of Moodle? WolfWhale LMS is a modern, cloud-hosted alternative with built-in spaced repetition flashcards, gamification, and zero server maintenance.',
    keywords: [
      'Moodle alternative',
      'Moodle alternative Canada',
      'Moodle replacement',
      'better than Moodle',
      'Moodle vs WolfWhale',
      'modern LMS alternative to Moodle',
    ],
    heroText:
      'Moodle is open-source and flexible, but it comes with a heavy price: server maintenance, plugin conflicts, clunky interfaces, and no built-in spaced repetition. WolfWhale LMS gives you a modern, cloud-hosted platform that teachers love, with zero IT overhead.',
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
      'Moodle requires dedicated server infrastructure, PHP expertise, and constant plugin updates. Schools spend thousands on hosting and IT staff just to keep Moodle running. WolfWhale is fully managed in the cloud. Your teachers log in and teach. That is it. No servers, no updates, no downtime.',
  },

  'brightspace-alternative': {
    title: 'Brightspace Alternative for Canadian Schools | WolfWhale',
    h1: 'The Brightspace Alternative Built for Canadian Schools',
    description:
      'Considering a Brightspace alternative? WolfWhale LMS offers built-in spaced repetition flashcards, Canadian data sovereignty, gamification, and a modern interface at a competitive price.',
    keywords: [
      'Brightspace alternative',
      'D2L Brightspace alternative',
      'Brightspace alternative Canada',
      'Brightspace replacement',
      'D2L vs WolfWhale',
    ],
    heroText:
      'Brightspace is a capable platform, but WolfWhale LMS offers something it does not: built-in spaced repetition flashcards, age-adaptive interfaces for K-12, and a pricing model that does not require an enterprise sales process. Canadian-built for Canadian schools.',
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
      'Brightspace is a strong enterprise product, but its complexity and pricing can be prohibitive for smaller schools and independent institutions. WolfWhale offers transparent, per-user pricing with every feature included. No tiers, no add-ons, no surprise invoices.',
  },

  'spaced-repetition-lms': {
    title: 'LMS with Built-in Spaced Repetition Flashcards | WolfWhale',
    h1: 'Finally: An LMS with Built-in Spaced Repetition',
    description:
      'WolfWhale is the only learning management system with built-in spaced repetition flashcards. Stop losing knowledge to the forgetting curve. Backed by decades of cognitive science.',
    keywords: [
      'spaced repetition LMS',
      'LMS with flashcards',
      'spaced repetition learning platform',
      'flashcard LMS',
      'forgetting curve LMS',
      'active recall learning management system',
    ],
    heroText:
      'Every other LMS treats spaced repetition as an afterthought, if they address it at all. WolfWhale is the first and only learning management system with built-in spaced repetition flashcards. Teachers create flashcard decks alongside their courses, and the system automatically schedules reviews at scientifically optimal intervals.',
    features: [
      'Active Recall & Spacing',
      'Science-Backed Retention',
      'Interactive Courses & Quizzes',
      'Gradebook & Analytics',
      'Gamification & XP',
      'K-12 & Post-Secondary',
    ],
    whyExtra:
      'The forgetting curve is real: students forget up to 80% of new material within a week without reinforcement. Spaced repetition combats this by scheduling reviews at precisely the right moment, just before a memory fades. Research shows this approach can improve long-term retention by 200% or more. WolfWhale integrates this directly into the LMS so teachers do not need to rely on third-party apps like Anki or Quizlet.',
  },

  'teacher-collaboration': {
    title: 'Teacher Collaboration Tools for K-12 | WolfWhale',
    h1: 'Teacher Collaboration Tools That Actually Change Instruction Quality',
    description:
      'Great instruction doesn\'t happen in isolation. WolfWhale LMS gives K-12 teachers built-in collaboration tools for aligned curriculum, shared lesson planning, peer feedback, and consistent student support — all in one platform.',
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
      'Great instruction doesn\'t happen in isolation. It happens when teachers share, refine, and elevate each other\'s practice. WolfWhale LMS gives every educator built-in real-time messaging, shared course authoring, discussion threads, and file sharing — so collaboration isn\'t an afterthought bolted on through third-party tools. It\'s foundational to how your school runs.',
    features: [
      'Real-Time Messaging',
      'Shared Lesson Planning',
      'Curriculum Alignment',
      'Peer Feedback & Discussion',
      'Parent Portal',
      'Gradebook & Analytics',
    ],
    whyExtra:
      'Most schools cobble together collaboration from email, Slack, Google Drive, and separate LMS logins. Teachers waste hours switching between tools instead of actually teaching. WolfWhale unifies everything: lesson planning, grading discussions, parent communication, and professional development all happen inside the same platform students use. Aligned curriculum, shared lesson clarity, peer feedback loops, and consistent student support aren\'t aspirational goals — they\'re built into the workflow.',
  },

  'edsby-alternative': {
    title: 'Edsby Alternative for Canadian Schools | WolfWhale',
    h1: 'The Edsby Alternative with Spaced Repetition and Modern UX',
    description:
      'Looking for an Edsby alternative? WolfWhale LMS offers built-in spaced repetition flashcards, gamification, real-time messaging, and a modern interface that teachers and students actually enjoy using.',
    keywords: [
      'Edsby alternative',
      'Edsby alternative Canada',
      'Edsby replacement',
      'better than Edsby',
      'Edsby vs WolfWhale',
      'K-12 LMS alternative to Edsby',
    ],
    heroText:
      'Edsby is a well-known K-12 platform in Canada, but it lacks the modern learning science features that drive real student outcomes. WolfWhale LMS includes everything Edsby offers — plus built-in spaced repetition flashcards, gamification with XP and achievements, age-adaptive interfaces, and a technology stack built for speed.',
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
      'Edsby provides solid teacher collaboration and parent engagement, but WolfWhale goes further. Our spaced repetition flashcards are backed by decades of cognitive science research, proven to improve long-term retention by over 200%. Our gamification system keeps students engaged with XP, achievements, leaderboards, and skill trees. And our age-adaptive UI automatically adjusts the interface for K-5, 6-8, and 9-12 students — something no other Canadian LMS offers.',
  },

  'ferpa-compliant-lms': {
    title: 'FERPA & PIPEDA Compliant LMS | WolfWhale',
    h1: 'FERPA, COPPA, and PIPEDA Compliant Learning Management System',
    description:
      'WolfWhale LMS meets FERPA, COPPA, and PIPEDA compliance standards. Canadian-hosted with row-level security, audit logging, and full data export capabilities.',
    keywords: [
      'FERPA compliant LMS',
      'PIPEDA compliant LMS',
      'COPPA compliant LMS Canada',
      'secure LMS for schools',
      'privacy compliant learning platform',
      'Canadian data sovereignty LMS',
    ],
    heroText:
      'Compliance is not optional when student data is involved. WolfWhale LMS is built from the ground up with FERPA, COPPA, and PIPEDA compliance. Canadian-hosted infrastructure, row-level security in PostgreSQL, complete audit logging, and full data export ensure your school meets every regulatory requirement.',
    features: [
      'FERPA, COPPA & PIPEDA',
      'Audit Logging',
      'Data Export & Portability',
      'Row-Level Security',
      'Canadian Data Sovereignty',
      'Role-Based Access Control',
    ],
    whyExtra:
      'Many LMS platforms claim compliance but store data on US servers subject to the CLOUD Act and Patriot Act. WolfWhale is different. We are a Canadian company hosting on Canadian infrastructure. Row-level security in PostgreSQL ensures that users can only access their own data. Every action is audit-logged. And if you ever need to leave, full data export is available in standard formats.',
  },
}
