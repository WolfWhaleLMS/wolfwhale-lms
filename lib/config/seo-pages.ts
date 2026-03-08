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

  // ========== SASKATCHEWAN SCHOOL DIVISION PAGES ==========

  'saskatoon-public-schools': {
    city: 'Saskatoon',
    province: 'Saskatchewan',
    title: 'LMS for Saskatoon Public Schools | WolfWhale',
    h1: 'The LMS Built in Saskatoon, for Saskatoon Public Schools',
    description:
      'WolfWhale LMS is built right here in Saskatoon. 72 original textbooks aligned to Saskatchewan curriculum, on-device AI, and cognitive load theory lessons. $12/student/year.',
    keywords: [
      'Saskatoon Public Schools LMS',
      'learning management system Saskatoon',
      'LMS Saskatchewan',
      'Saskatoon school district 13',
      'K-12 LMS Saskatoon',
    ],
    heroText:
      'WolfWhale was born in Saskatoon. Built on Treaty 6 territory by a First Nations-owned company, our LMS covers every Saskatchewan learning outcome with 72 original textbooks, on-device AI that keeps student data private, and lessons designed around cognitive load theory.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Saskatoon Public Schools serves over 27,000 students across 60+ schools. WolfWhale is the only LMS that ships with 72 textbooks written specifically to Saskatchewan curriculum outcomes — not adapted from American content, but written here for SK students. Our offline mode is built for the reality that not every classroom has reliable Wi-Fi.',
  },

  'greater-saskatoon-catholic': {
    city: 'Saskatoon',
    province: 'Saskatchewan',
    title: 'LMS for Greater Saskatoon Catholic Schools | WolfWhale',
    h1: 'WolfWhale LMS for Greater Saskatoon Catholic Schools',
    description:
      'WolfWhale LMS serves Greater Saskatoon Catholic Schools with 72 Saskatchewan-aligned textbooks, Indigenous education integration, on-device AI, and FOIP compliance. Built in Saskatoon.',
    keywords: [
      'Greater Saskatoon Catholic Schools LMS',
      'St Pauls RCSSD 20 LMS',
      'Catholic school LMS Saskatchewan',
      'Saskatoon Catholic schools technology',
    ],
    heroText:
      'Greater Saskatoon Catholic Schools (St. Paul\'s RCSSD #20) can access a locally-built LMS that respects Catholic educational values while delivering modern learning science. 72 original textbooks with Indigenous connections supporting TRC Calls to Action 6-12, on-device AI, and lessons built on cognitive load theory.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Catholic schools in Saskatoon have a unique mandate to integrate faith, culture, and academic excellence. WolfWhale supports this by providing Saskatchewan curriculum-aligned content with Indigenous perspectives woven throughout, supporting both academic outcomes and the TRC Calls to Action that Catholic school boards have committed to.',
  },

  'regina-public-schools': {
    city: 'Regina',
    province: 'Saskatchewan',
    title: 'LMS for Regina Public Schools | WolfWhale',
    h1: 'WolfWhale LMS for Regina Public Schools',
    description:
      'Regina Public Schools can access Saskatchewan\'s own LMS. 72 textbooks aligned to SK curriculum, on-device AI, cognitive load theory lessons, and offline learning. $12/student/year.',
    keywords: [
      'Regina Public Schools LMS',
      'learning management system Regina',
      'LMS Regina Saskatchewan',
      'Regina school district 4',
      'K-12 LMS Regina',
    ],
    heroText:
      'Regina Public Schools serves the capital city\'s students. WolfWhale LMS is the only platform with 72 original textbooks written to every Saskatchewan learning outcome, on-device AI that keeps student data on the device, and a lesson format designed around cognitive load theory — the science of how students actually learn.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Gradebook & Analytics',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'As Saskatchewan\'s capital, Regina schools set the standard for the province. WolfWhale gives Regina Public Schools a homegrown alternative to American LMS platforms — one that actually covers Saskatchewan curriculum outcomes instead of forcing teachers to adapt US-centric content. All student data stays in Canada.',
  },

  'regina-catholic-schools': {
    city: 'Regina',
    province: 'Saskatchewan',
    title: 'LMS for Regina Catholic Schools | WolfWhale',
    h1: 'WolfWhale LMS for Regina Catholic School Division',
    description:
      'Regina Catholic School Division gets Saskatchewan\'s own LMS. 72 textbooks with Indigenous connections, on-device AI, TRC Calls to Action support, and FOIP compliance.',
    keywords: [
      'Regina Catholic Schools LMS',
      'Regina Catholic School Division 81',
      'Catholic school LMS Saskatchewan',
      'Regina Catholic schools technology',
    ],
    heroText:
      'Regina Catholic School Division can leverage an LMS built in Saskatchewan with Indigenous education and TRC Calls to Action woven into every textbook. On-device AI, cognitive load theory lessons, and 72 original textbooks — all designed for how Saskatchewan students actually learn.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Parent Portal',
      'Gamification & XP',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Regina Catholic schools are committed to reconciliation and academic excellence. WolfWhale is First Nations-owned and built on Treaty 6 territory, with Indigenous connections in all 72 textbooks supporting TRC Calls to Action 6-12. This isn\'t a checkbox — it\'s foundational to how WolfWhale was built.',
  },

  'prairie-valley-school-division': {
    city: 'Southeast Saskatchewan',
    province: 'Saskatchewan',
    title: 'LMS for Prairie Valley School Division | WolfWhale',
    h1: 'WolfWhale LMS for Prairie Valley School Division',
    description:
      'Prairie Valley School Division gets an LMS built for rural Saskatchewan. Offline learning, 72 SK-aligned textbooks, on-device AI, and $12/student/year.',
    keywords: [
      'Prairie Valley School Division LMS',
      'Prairie Valley SD 208',
      'rural Saskatchewan LMS',
      'southeast Saskatchewan schools',
    ],
    heroText:
      'Prairie Valley School Division covers a vast rural area in southeast Saskatchewan. WolfWhale\'s offline learning mode means students can access all 72 textbooks and course content even without internet — critical for rural communities. When they reconnect, everything syncs automatically.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Rural school divisions face a reality that urban-focused LMS companies don\'t understand: unreliable internet, multi-grade classrooms, and long distances between schools. WolfWhale was built in Saskatchewan and designed for these exact challenges. Offline mode with AES-GCM encryption means learning doesn\'t stop when the Wi-Fi does.',
  },

  'prairie-south-school-division': {
    city: 'Moose Jaw',
    province: 'Saskatchewan',
    title: 'LMS for Prairie South School Division | WolfWhale',
    h1: 'WolfWhale LMS for Prairie South School Division',
    description:
      'Prairie South School Division gets Saskatchewan\'s own LMS. Offline learning for rural schools, 72 SK curriculum textbooks, on-device AI. Based in Moose Jaw.',
    keywords: [
      'Prairie South School Division LMS',
      'Prairie South SD 210',
      'Moose Jaw schools LMS',
      'south central Saskatchewan LMS',
    ],
    heroText:
      'Prairie South School Division serves Moose Jaw and south-central Saskatchewan. WolfWhale provides 72 textbooks covering every SK learning outcome, on-device AI that works without internet, and a lesson format built on cognitive load theory. All for $12/student/year.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Gradebook & Analytics',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Moose Jaw and surrounding communities need technology that works in their context — not a Silicon Valley product adapted for Canada. WolfWhale is Saskatchewan-built, Saskatchewan-focused, and priced for public school budgets at $12/student/year with every feature included.',
  },

  'south-east-cornerstone-school-division': {
    city: 'Weyburn',
    province: 'Saskatchewan',
    title: 'LMS for South East Cornerstone School Division | WolfWhale',
    h1: 'WolfWhale LMS for South East Cornerstone',
    description:
      'South East Cornerstone School Division gets offline-capable LMS with 72 Saskatchewan textbooks, on-device AI, and cognitive load theory lessons. Built in SK.',
    keywords: [
      'South East Cornerstone School Division LMS',
      'South East Cornerstone SD 209',
      'Weyburn schools LMS',
      'Estevan schools LMS',
      'southeast Saskatchewan schools LMS',
    ],
    heroText:
      'South East Cornerstone serves Weyburn, Estevan, and communities across southeast Saskatchewan. WolfWhale\'s offline learning ensures students in every community can access 72 textbooks and all course content — no internet required. On-device AI keeps data private.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'South East Cornerstone covers one of the largest geographic areas in Saskatchewan. WolfWhale understands that reliable internet is not a given in every school or home in this region. Our offline-first approach and Saskatchewan-specific content make us the natural choice for this division.',
  },

  'sun-west-school-division': {
    city: 'Rosetown',
    province: 'Saskatchewan',
    title: 'LMS for Sun West School Division | WolfWhale',
    h1: 'WolfWhale LMS for Sun West School Division',
    description:
      'Sun West School Division — pioneers of distance learning in SK — gets an LMS with offline mode, 72 Saskatchewan textbooks, and on-device AI. $12/student/year.',
    keywords: [
      'Sun West School Division LMS',
      'Sun West SD 207',
      'Sun West distance learning',
      'Rosetown schools LMS',
      'west central Saskatchewan LMS',
    ],
    heroText:
      'Sun West School Division has been a leader in distance learning through the Saskatchewan Distance Learning Centre. WolfWhale takes that further with 72 original textbooks, offline learning on iOS, on-device AI, and lessons designed around cognitive load theory.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Gamification & XP',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Sun West already understands the power of technology in education through the Saskatchewan Distance Learning Centre. WolfWhale builds on that foundation with a modern iOS app that works offline, AI tools that run on-device, and 72 textbooks that cover every SK learning outcome.',
  },

  'living-sky-school-division': {
    city: 'North Battleford',
    province: 'Saskatchewan',
    title: 'LMS for Living Sky School Division | WolfWhale',
    h1: 'WolfWhale LMS for Living Sky School Division',
    description:
      'Living Sky School Division gets an LMS built for Saskatchewan. 72 textbooks, offline learning, Indigenous education, on-device AI. First Nations owned.',
    keywords: [
      'Living Sky School Division LMS',
      'Living Sky SD 202',
      'North Battleford schools LMS',
      'Battlefords schools technology',
    ],
    heroText:
      'Living Sky School Division serves the Battlefords and surrounding communities. WolfWhale is First Nations-owned and built on Treaty 6 territory — with Indigenous connections in all 72 textbooks and TRC Calls to Action 6-12 supported throughout the platform.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Parent Portal',
      'Gamification & XP',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'The Battlefords region has a significant Indigenous student population. WolfWhale is the only LMS that is First Nations-owned with Indigenous perspectives woven into every textbook — not as an add-on module, but as a core part of the content. This matters for Living Sky\'s commitment to reconciliation.',
  },

  'north-east-school-division': {
    city: 'Melfort',
    province: 'Saskatchewan',
    title: 'LMS for North East School Division | WolfWhale',
    h1: 'WolfWhale LMS for North East School Division',
    description:
      'North East School Division gets offline-first LMS with 72 SK textbooks, on-device AI, and cognitive load theory lessons. Built in Saskatchewan.',
    keywords: [
      'North East School Division LMS',
      'North East SD 200',
      'Melfort schools LMS',
      'northeast Saskatchewan schools',
    ],
    heroText:
      'North East School Division serves Melfort and northeast Saskatchewan communities. WolfWhale provides offline learning that works without internet, 72 textbooks aligned to SK curriculum, and on-device AI — all built right here in Saskatchewan.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Gradebook & Analytics',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Northeast Saskatchewan schools need technology built for their context. WolfWhale\'s offline mode ensures that even schools with spotty internet can deliver a full digital learning experience. 72 textbooks written for Saskatchewan — not adapted from American content.',
  },

  'saskatchewan-rivers-school-division': {
    city: 'Prince Albert',
    province: 'Saskatchewan',
    title: 'LMS for Saskatchewan Rivers School Division | WolfWhale',
    h1: 'WolfWhale LMS for Saskatchewan Rivers School Division',
    description:
      'Saskatchewan Rivers School Division gets a locally-built LMS. 72 SK textbooks, Indigenous education, offline learning, on-device AI. Prince Albert and region.',
    keywords: [
      'Saskatchewan Rivers School Division LMS',
      'Sask Rivers SD 119',
      'Prince Albert schools LMS',
      'Prince Albert school technology',
    ],
    heroText:
      'Saskatchewan Rivers School Division serves Prince Albert and surrounding communities with a large Indigenous student population. WolfWhale is First Nations-owned with TRC Calls to Action 6-12 embedded in all 72 textbooks, plus offline learning for communities with limited connectivity.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Parent Portal',
      'Gamification & XP',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Prince Albert and the Saskatchewan Rivers region have unique needs: significant Indigenous populations, rural communities, and a mix of urban and remote schools. WolfWhale was built for exactly this reality — First Nations-owned, offline-capable, and with Indigenous education woven into every piece of content.',
  },

  'prince-albert-catholic': {
    city: 'Prince Albert',
    province: 'Saskatchewan',
    title: 'LMS for Prince Albert Catholic Schools | WolfWhale',
    h1: 'WolfWhale LMS for Prince Albert Catholic School Division',
    description:
      'Prince Albert Catholic School Division gets Saskatchewan\'s LMS. Indigenous education, 72 SK textbooks, TRC support, on-device AI. First Nations owned.',
    keywords: [
      'Prince Albert Catholic Schools LMS',
      'Prince Albert Catholic SD 6',
      'Catholic school LMS Prince Albert',
      'PA Catholic schools technology',
    ],
    heroText:
      'Prince Albert Catholic School Division educates students in faith and academic excellence. WolfWhale supports both with 72 Saskatchewan-aligned textbooks featuring Indigenous connections, on-device AI, and a lesson format built on cognitive load theory.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Prince Albert Catholic schools serve a community deeply connected to Indigenous culture and reconciliation. WolfWhale is the only LMS that is First Nations-owned with TRC Calls to Action integrated into the curriculum content — aligning with Catholic education\'s commitment to justice and reconciliation.',
  },

  'chinook-school-division': {
    city: 'Swift Current',
    province: 'Saskatchewan',
    title: 'LMS for Chinook School Division | WolfWhale',
    h1: 'WolfWhale LMS for Chinook School Division',
    description:
      'Chinook School Division gets an LMS built for southwest Saskatchewan. Offline learning, 72 SK textbooks, on-device AI. $12/student/year.',
    keywords: [
      'Chinook School Division LMS',
      'Chinook SD 211',
      'Swift Current schools LMS',
      'southwest Saskatchewan schools',
    ],
    heroText:
      'Chinook School Division serves Swift Current and southwest Saskatchewan. WolfWhale provides 72 textbooks covering every SK learning outcome, offline learning for rural communities, and on-device AI — all at $12/student/year with every feature included.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Gradebook & Analytics',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Southwest Saskatchewan schools operate across vast distances with varying connectivity. WolfWhale\'s offline-first design and Saskatchewan-specific content make it the natural fit for Chinook\'s schools — from Swift Current to the smallest rural community in the division.',
  },

  'good-spirit-school-division': {
    city: 'Yorkton',
    province: 'Saskatchewan',
    title: 'LMS for Good Spirit School Division | WolfWhale',
    h1: 'WolfWhale LMS for Good Spirit School Division',
    description:
      'Good Spirit School Division gets Saskatchewan\'s own LMS. 72 textbooks, offline mode, on-device AI, cognitive load theory lessons. Based in Yorkton.',
    keywords: [
      'Good Spirit School Division LMS',
      'Good Spirit SD 204',
      'Yorkton schools LMS',
      'east central Saskatchewan schools',
    ],
    heroText:
      'Good Spirit School Division serves Yorkton and east-central Saskatchewan. WolfWhale delivers 72 original textbooks aligned to every SK curriculum outcome, offline learning that works without internet, and lessons designed around cognitive load theory.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Yorkton and the surrounding region need technology that works for their schools — not a product designed for Toronto and scaled out. WolfWhale is built in Saskatchewan, priced for Saskatchewan school budgets, and aligned to Saskatchewan curriculum.',
  },

  'horizon-school-division': {
    city: 'Humboldt',
    province: 'Saskatchewan',
    title: 'LMS for Horizon School Division | WolfWhale',
    h1: 'WolfWhale LMS for Horizon School Division',
    description:
      'Horizon School Division gets a locally-built LMS with 72 SK textbooks, offline learning, and on-device AI. Serving Humboldt and central Saskatchewan.',
    keywords: [
      'Horizon School Division LMS',
      'Horizon SD 205',
      'Humboldt schools LMS',
      'central Saskatchewan schools',
    ],
    heroText:
      'Horizon School Division serves Humboldt and central Saskatchewan communities. WolfWhale provides offline-capable learning with 72 textbooks written for SK curriculum outcomes, on-device AI, and gamification to keep students engaged.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Gradebook & Analytics',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Central Saskatchewan schools deserve technology built for their reality. WolfWhale is the only LMS with content written specifically for Saskatchewan students — not adapted from American textbooks. Offline mode ensures learning continues regardless of connectivity.',
  },

  'prairie-spirit-school-division': {
    city: 'Warman',
    province: 'Saskatchewan',
    title: 'LMS for Prairie Spirit School Division | WolfWhale',
    h1: 'WolfWhale LMS for Prairie Spirit School Division',
    description:
      'Prairie Spirit School Division — one of SK\'s fastest-growing — gets an LMS with 72 textbooks, on-device AI, and cognitive load theory lessons. $12/student/year.',
    keywords: [
      'Prairie Spirit School Division LMS',
      'Prairie Spirit SD 206',
      'Warman schools LMS',
      'Martensville schools LMS',
      'Saskatoon area schools',
    ],
    heroText:
      'Prairie Spirit is one of Saskatchewan\'s fastest-growing school divisions, serving Warman, Martensville, and communities surrounding Saskatoon. WolfWhale scales with that growth — 72 textbooks, on-device AI, and a $12/student/year price that works for expanding budgets.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'As Saskatoon\'s bedroom communities grow rapidly, Prairie Spirit needs technology that scales without breaking the budget. WolfWhale\'s flat $12/student/year pricing with all features included means no surprises as enrollment climbs. And because we\'re built locally, support is never a timezone away.',
  },

  'northwest-school-division': {
    city: 'Meadow Lake',
    province: 'Saskatchewan',
    title: 'LMS for Northwest School Division | WolfWhale',
    h1: 'WolfWhale LMS for Northwest School Division',
    description:
      'Northwest School Division gets an LMS built for northern Saskatchewan. Offline learning, Indigenous education, 72 SK textbooks. First Nations owned.',
    keywords: [
      'Northwest School Division LMS',
      'Northwest SD 203',
      'Meadow Lake schools LMS',
      'northwest Saskatchewan schools',
    ],
    heroText:
      'Northwest School Division serves Meadow Lake and northwest Saskatchewan — including many Indigenous communities. WolfWhale is First Nations-owned with Indigenous connections in all 72 textbooks, offline learning for remote areas, and TRC Calls to Action 6-12 supported throughout.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Northwest Saskatchewan has unique challenges: remote communities, significant Indigenous populations, and connectivity issues. WolfWhale addresses all three — offline learning, First Nations-owned with Indigenous perspectives in every textbook, and a price point that works for rural division budgets.',
  },

  'holy-trinity-catholic': {
    city: 'Moose Jaw',
    province: 'Saskatchewan',
    title: 'LMS for Holy Trinity Catholic Schools | WolfWhale',
    h1: 'WolfWhale LMS for Holy Trinity Catholic School Division',
    description:
      'Holy Trinity RCSSD gets Saskatchewan\'s LMS. 72 textbooks with TRC integration, on-device AI, and cognitive load theory lessons. Moose Jaw, Swift Current & area.',
    keywords: [
      'Holy Trinity Catholic Schools LMS',
      'Holy Trinity RCSSD 22',
      'Catholic school LMS Moose Jaw',
      'Moose Jaw Catholic schools',
    ],
    heroText:
      'Holy Trinity Catholic School Division serves Moose Jaw, Swift Current, and surrounding communities. WolfWhale provides 72 Saskatchewan-aligned textbooks with Indigenous education integrated throughout, supporting Catholic education\'s commitment to TRC Calls to Action.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Catholic schools in southern Saskatchewan need a platform that aligns with both provincial curriculum standards and Catholic educational values, including reconciliation. WolfWhale is the only LMS that is First Nations-owned with TRC integration built into the content.',
  },

  'holy-family-catholic': {
    city: 'Weyburn',
    province: 'Saskatchewan',
    title: 'LMS for Holy Family Catholic Schools | WolfWhale',
    h1: 'WolfWhale LMS for Holy Family Catholic School Division',
    description:
      'Holy Family RCSSD gets Saskatchewan\'s LMS with 72 textbooks, Indigenous education, on-device AI, and offline learning. Weyburn and southeast SK.',
    keywords: [
      'Holy Family Catholic Schools LMS',
      'Holy Family RCSSD 140',
      'Weyburn Catholic schools LMS',
      'southeast Saskatchewan Catholic schools',
    ],
    heroText:
      'Holy Family Catholic School Division serves Weyburn and southeast Saskatchewan. WolfWhale delivers 72 textbooks aligned to SK curriculum with Indigenous perspectives, offline learning for rural areas, and on-device AI that keeps student data private.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Holy Family\'s schools across southeast Saskatchewan benefit from WolfWhale\'s offline learning — ensuring students in every community have full access to textbooks and courses. First Nations-owned with TRC Calls to Action woven throughout all content.',
  },

  'christ-the-teacher-catholic': {
    city: 'Yorkton',
    province: 'Saskatchewan',
    title: 'LMS for Christ the Teacher Catholic Schools | WolfWhale',
    h1: 'WolfWhale LMS for Christ the Teacher Catholic School Division',
    description:
      'Christ the Teacher RCSSD gets Saskatchewan\'s LMS. 72 textbooks, TRC integration, on-device AI, offline learning. Yorkton and east-central SK.',
    keywords: [
      'Christ the Teacher Catholic Schools LMS',
      'Christ the Teacher RCSSD 212',
      'Yorkton Catholic schools LMS',
      'east central Saskatchewan Catholic schools',
    ],
    heroText:
      'Christ the Teacher Catholic School Division serves Yorkton and east-central Saskatchewan. WolfWhale provides 72 Saskatchewan curriculum textbooks with Indigenous connections, cognitive load theory lessons, and on-device AI — all built by a First Nations-owned company.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Christ the Teacher schools benefit from WolfWhale\'s commitment to reconciliation. As a First Nations-owned company, Indigenous perspectives aren\'t a bolt-on feature — they\'re fundamental to how our textbooks and platform were built.',
  },

  'light-of-christ-catholic': {
    city: 'North Battleford',
    province: 'Saskatchewan',
    title: 'LMS for Light of Christ Catholic Schools | WolfWhale',
    h1: 'WolfWhale LMS for Light of Christ Catholic School Division',
    description:
      'Light of Christ RCSSD gets Saskatchewan\'s LMS with Indigenous education, 72 SK textbooks, offline learning, and on-device AI. Battlefords region.',
    keywords: [
      'Light of Christ Catholic Schools LMS',
      'Light of Christ RCSSD 16',
      'North Battleford Catholic schools LMS',
      'Battlefords Catholic schools',
    ],
    heroText:
      'Light of Christ Catholic School Division serves the Battlefords with a commitment to faith, learning, and reconciliation. WolfWhale is First Nations-owned with Indigenous perspectives in all 72 textbooks, offline learning, and on-device AI.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'The Battlefords region has deep ties to Indigenous communities. WolfWhale is the only LMS built by a First Nations-owned company with TRC Calls to Action 6-12 embedded in the content — making it a natural fit for Light of Christ\'s reconciliation commitments.',
  },

  'northern-lights-school-division': {
    city: 'La Ronge',
    province: 'Saskatchewan',
    title: 'LMS for Northern Lights School Division | WolfWhale',
    h1: 'WolfWhale LMS for Northern Lights School Division',
    description:
      'Northern Lights School Division gets an LMS built for northern Saskatchewan. Offline-first, Indigenous education, 72 SK textbooks. First Nations owned.',
    keywords: [
      'Northern Lights School Division LMS',
      'Northern Lights SD 113',
      'La Ronge schools LMS',
      'northern Saskatchewan schools',
      'remote schools LMS',
    ],
    heroText:
      'Northern Lights School Division serves some of Saskatchewan\'s most remote communities. WolfWhale was built for exactly this — offline learning that works without internet, Indigenous education from a First Nations-owned company, and 72 textbooks aligned to every SK learning outcome.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Northern Lights serves communities where internet is unreliable or unavailable. Most LMS platforms simply don\'t work in this context. WolfWhale\'s offline-first design means students download textbooks and courses to their device and learn anywhere. AES-GCM encryption keeps data safe. Auto-sync when they\'re back online.',
  },

  'ile-a-la-crosse-school-division': {
    city: 'Île-à-la-Crosse',
    province: 'Saskatchewan',
    title: 'LMS for Île-à-la-Crosse School Division | WolfWhale',
    h1: 'WolfWhale LMS for Île-à-la-Crosse School Division',
    description:
      'Île-à-la-Crosse School Division gets an LMS built for Métis and northern communities. Offline-first, Indigenous education, 72 SK textbooks. First Nations owned.',
    keywords: [
      'Ile a la Crosse School Division LMS',
      'Ile a la Crosse SD 112',
      'Métis community LMS',
      'northern Saskatchewan Métis schools',
    ],
    heroText:
      'Île-à-la-Crosse is one of the oldest Métis communities in western Canada. WolfWhale is First Nations-owned and built with Indigenous perspectives throughout — supporting the unique cultural and educational needs of Métis students with 72 SK textbooks and offline learning.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Île-à-la-Crosse has a proud Métis heritage that should be reflected in the technology students use. WolfWhale is the only LMS that is Indigenous-owned with cultural perspectives woven into every textbook. Offline mode ensures learning continues in a remote northern community.',
  },

  'creighton-school-division': {
    city: 'Creighton',
    province: 'Saskatchewan',
    title: 'LMS for Creighton School Division | WolfWhale',
    h1: 'WolfWhale LMS for Creighton School Division',
    description:
      'Creighton School Division gets an LMS built for northern SK. Offline learning, 72 textbooks, on-device AI, Indigenous education. $12/student/year.',
    keywords: [
      'Creighton School Division LMS',
      'Creighton SD 111',
      'Creighton schools technology',
      'Flin Flon area schools LMS',
    ],
    heroText:
      'Creighton School Division serves the Creighton-Flin Flon area on Saskatchewan\'s northern border. WolfWhale provides offline learning for remote connectivity, 72 textbooks aligned to SK curriculum, and on-device AI — all at $12/student/year.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Gradebook & Analytics',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Northern border communities like Creighton need technology that works offline and is priced for smaller division budgets. WolfWhale delivers both — full Saskatchewan curriculum content at $12/student/year with no hidden costs.',
  },

  'lloydminster-public-school-division': {
    city: 'Lloydminster',
    province: 'Saskatchewan',
    title: 'LMS for Lloydminster Public School Division | WolfWhale',
    h1: 'WolfWhale LMS for Lloydminster Public School Division',
    description:
      'Lloydminster Public SD gets Saskatchewan\'s LMS. 72 SK textbooks, on-device AI, offline learning, cognitive load theory lessons. $12/student/year.',
    keywords: [
      'Lloydminster School Division LMS',
      'Lloydminster SD 99',
      'Lloydminster schools technology',
      'SK Alberta border schools LMS',
    ],
    heroText:
      'Lloydminster straddles the Saskatchewan-Alberta border, but Saskatchewan students deserve Saskatchewan-aligned content. WolfWhale\'s 72 textbooks cover every SK learning outcome, with on-device AI and cognitive load theory lessons.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Lloydminster\'s unique position on the SK-AB border means students need content aligned to the right curriculum. WolfWhale\'s textbooks are written specifically for Saskatchewan learning outcomes — ensuring Lloydminster SD students get the right content.',
  },

  'lloydminster-catholic': {
    city: 'Lloydminster',
    province: 'Saskatchewan',
    title: 'LMS for Lloydminster Catholic Schools | WolfWhale',
    h1: 'WolfWhale LMS for Lloydminster Catholic School Division',
    description:
      'Lloydminster RCSSD gets Saskatchewan\'s LMS with 72 textbooks, TRC integration, on-device AI. Catholic values and Indigenous education.',
    keywords: [
      'Lloydminster Catholic Schools LMS',
      'Lloydminster RCSSD 89',
      'Lloydminster Catholic schools technology',
    ],
    heroText:
      'Lloydminster Catholic School Division educates students with faith and academic excellence. WolfWhale supports both with 72 SK curriculum textbooks, Indigenous education throughout, and on-device AI that keeps student data private.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Lloydminster Catholic schools benefit from WolfWhale\'s First Nations ownership and TRC-integrated content, aligning technology with the Catholic commitment to reconciliation and justice.',
  },

  'conseil-scolaire-fransaskois': {
    city: 'Regina',
    province: 'Saskatchewan',
    title: 'LMS pour le Conseil scolaire fransaskois | WolfWhale',
    h1: 'WolfWhale LMS pour le Conseil scolaire fransaskois',
    description:
      'Le Conseil scolaire fransaskois obtient un LMS avec 72 manuels scolaires SK, apprentissage hors ligne, IA sur appareil et soutien bilingue. 12 $/élève/an.',
    keywords: [
      'Conseil scolaire fransaskois LMS',
      'école francophone Saskatchewan LMS',
      'LMS français Saskatchewan',
      'Fransaskois schools technology',
      'French language LMS Canada',
    ],
    heroText:
      'Le Conseil scolaire fransaskois serves Saskatchewan\'s Francophone community. WolfWhale supports French-language instruction with 72 textbooks aligned to SK curriculum, on-device AI, and a bilingual interface — all built in Saskatchewan.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Saskatchewan\'s Fransaskois community needs an LMS that supports French-language instruction while aligning to SK curriculum. WolfWhale provides bilingual support, 72 SK-aligned textbooks, and a locally-built platform that understands the unique needs of Francophone education in Saskatchewan.',
  },

  // ========== SASKATCHEWAN KEYWORD PAGES ==========

  'saskatchewan-lms': {
    province: 'Saskatchewan',
    title: 'Best LMS for Saskatchewan Schools | WolfWhale',
    h1: 'The Only LMS Built in Saskatchewan, for Saskatchewan',
    description:
      'WolfWhale is the only LMS built in Saskatchewan. 72 textbooks covering all SK learning outcomes, on-device AI, offline learning, and cognitive load theory lessons. $12/student/year.',
    keywords: [
      'LMS Saskatchewan',
      'Saskatchewan learning management system',
      'best LMS for Saskatchewan schools',
      'SK school LMS',
      'Saskatchewan education technology',
      'Saskatchewan school software',
    ],
    heroText:
      'WolfWhale is the only learning management system built in Saskatchewan, for Saskatchewan. Every other LMS was designed in Silicon Valley or Toronto and adapted for our province. We started with Saskatchewan\'s 682 curriculum outcomes and built everything around them — 72 original textbooks, on-device AI, and lessons designed around cognitive load theory.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Saskatchewan has 27 school divisions serving students from Estevan to La Ronge. WolfWhale understands this province — the rural connectivity challenges, the Indigenous education priorities, the FOIP compliance requirements, and the SK curriculum inside and out. We mapped all 682 learning outcomes and wrote 72 textbooks to cover every single one.',
  },

  'rural-saskatchewan-lms': {
    province: 'Saskatchewan',
    title: 'LMS for Rural Saskatchewan Schools | WolfWhale',
    h1: 'The LMS Built for Rural Saskatchewan Schools',
    description:
      'WolfWhale LMS works offline — built for rural Saskatchewan schools with unreliable internet. 72 SK textbooks, on-device AI, AES-GCM encryption. $12/student/year.',
    keywords: [
      'rural Saskatchewan LMS',
      'offline LMS Saskatchewan',
      'rural school technology Saskatchewan',
      'LMS without internet',
      'remote school LMS Canada',
    ],
    heroText:
      'Rural Saskatchewan schools can\'t rely on consistent internet. WolfWhale was built for this reality — full offline access to all 72 textbooks and courses, AES-GCM encrypted storage, and automatic sync when connection returns. On-device AI means no cloud dependency.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Most LMS platforms assume every student has high-speed internet at home and school. That\'s not Saskatchewan\'s reality. WolfWhale\'s offline-first architecture was designed specifically for rural and remote communities. Students download content to their iPad, learn anywhere, and sync when they\'re back online. No internet required for learning.',
  },

  'indigenous-education-lms-saskatchewan': {
    province: 'Saskatchewan',
    title: 'Indigenous Education LMS for Saskatchewan | WolfWhale',
    h1: 'The First Nations-Owned LMS for Indigenous Education in Saskatchewan',
    description:
      'WolfWhale is First Nations-owned, built on Treaty 6 territory. Indigenous perspectives in all 72 textbooks. TRC Calls to Action 6-12. Made for Saskatchewan.',
    keywords: [
      'Indigenous education LMS',
      'First Nations LMS',
      'TRC education technology',
      'Treaty 6 LMS',
      'Indigenous learning platform Saskatchewan',
      'reconciliation education technology',
    ],
    heroText:
      'WolfWhale is the only LMS that is First Nations-owned and built on Treaty 6 territory. Indigenous connections aren\'t an add-on module — they\'re woven into all 72 textbooks, supporting TRC Calls to Action 6-12. First Nations, Métis, and Inuit perspectives are foundational to every piece of content.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Saskatchewan has the highest proportion of Indigenous students in Canada. Most LMS platforms treat Indigenous content as an optional add-on. WolfWhale is different — we are First Nations-owned, and Indigenous perspectives are built into every textbook from the ground up. This isn\'t performative. It\'s who we are.',
  },

  'foip-compliant-lms-saskatchewan': {
    province: 'Saskatchewan',
    title: 'FOIP Compliant LMS for Saskatchewan Schools | WolfWhale',
    h1: 'FOIP & LAFOIP Compliant LMS Built in Saskatchewan',
    description:
      'WolfWhale LMS is FOIP, LAFOIP, and PIPEDA compliant. On-device AI means student data never leaves the device. Canadian-hosted. Saskatchewan-built.',
    keywords: [
      'FOIP compliant LMS',
      'LAFOIP compliant LMS',
      'Saskatchewan school privacy',
      'PIPEDA LMS Saskatchewan',
      'student data privacy Saskatchewan',
    ],
    heroText:
      'Saskatchewan\'s FOIP and LAFOIP regulations require that student data is handled with care. WolfWhale goes further than compliance — our on-device AI means student data never leaves the device. No cloud AI processing, no data sent to US servers. Built in Saskatchewan, hosted in Canada.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Row-Level Security',
      'Audit Logging',
      'Built for Canadian Schools',
      'Role-Based Access Control',
    ],
    whyExtra:
      'Most LMS platforms send student data to US-based cloud AI services, creating FOIP compliance risks. WolfWhale uses Apple Intelligence for all AI features — processing happens entirely on the student\'s device. Zero student data is transmitted to external servers. Row-level security in PostgreSQL ensures each user only sees their own data.',
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
