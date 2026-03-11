import { Bot, Eye, Wrench, WifiOff, GraduationCap, Gamepad2, BookOpen, Users, Heart, Flag, Shield, Globe, Brain, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type Lang = 'en' | 'fr'

interface FeatureCard {
  icon: LucideIcon
  title: string
  points: string[]
  color: string
  slug: string
}

interface CompareRow {
  feature: string
  wolfwhale: boolean
  canvas: boolean
  brightspace: boolean
  edsby: boolean
  moodle: boolean
  veracross: boolean
  powerschool: boolean
}

interface TRCCard {
  icon: LucideIcon
  title: string
  desc: string
}

interface FAQItem {
  q: string
  a: string
}

interface Badge {
  icon: LucideIcon
  label: string
}

export interface LandingContent {
  // Header
  lms: string
  nav: { features: string; compare: string; pricing: string; faq: string; signIn: string; contact: string; divisions: string }
  // Hero
  heroTagline: string
  requestDemo: string
  seeFeatures: string
  downloadOn: string
  appStore: string
  comingSoon: string
  // Features
  featuresTitle: string
  featuresSubtitle: string
  features: FeatureCard[]
  // Screenshots
  appPreview: string
  appPreviewSub: string
  signInLight: string
  signInDark: string
  myCoursesLabel: string
  dashboardLabel: string
  screenshotLabel4: string
  screenshotLabel5: string
  screenshotLabel6: string
  screenshotLabel7: string
  ipadDashboardLabel: string
  ipadTextbookLabel: string
  macCoursesLabel: string
  screenshotSoon: string
  // Compare
  compareTitle: string
  compareSub: string
  featureLabel: string
  compareRows: CompareRow[]
  swipeHint: string
  compareDisclaimer: string
  readyToSwitch: string
  // Pricing
  pricingTitle: string
  pricingSub: string
  perUser: string
  perMonth: string
  minContract: string
  pricingFeatures: string[]
  volumeDiscounts: string
  // About
  aboutTitle: string
  aboutText: string
  // Canada
  canadaTitle: string
  canadaSub: string
  canadaBadges: Badge[]
  // TRC
  trcTitle: string
  trcSub: string
  trcCards: TRCCard[]
  trcLink: string
  // FAQ
  faqTitle: string
  faqSub: string
  faqItems: FAQItem[]
  // Contact
  contactTitle: string
  contactSub: string
  emailDirect: string
  // Footer
  footerCopyright: string
  privacy: string
  terms: string
  help: string
  // Micro-Lessons
  microLessonsTitle: string
  microLessonsSub: string
  microLessonsSteps: { title: string; desc: string }[]
  microLessonsConverterTitle: string
  microLessonsConverterDesc: string
  // Textbooks
  textbooksTitle: string
  textbooksSub: string
  textbooksStats: { value: string; label: string }[]
  // Key Differentiators
  differentiators: { title: string; desc: string }[]
  // Mission & Impact
  missionTitle: string
  missionTagline: string
  missionStats: { value: string; label: string; source: string }[]
  missions: { title: string; desc: string }[]
  // IT Summit Banner
  itSummitBanner: string
  itSummitDate: string
  itSummitLocation: string
  // For School Divisions
  divisionsTitle: string
  divisionsSub: string
  divisionsFeatures: { icon: string; title: string; desc: string }[]
  divisionsCTA: string
  // Pilot CTA
  startPilot: string
  pilotSub: string
}

export const landingContent: Record<Lang, LandingContent> = {
  en: {
    lms: 'School Platform',
    nav: { features: 'Features', compare: 'Compare', pricing: 'Pricing', faq: 'FAQ', signIn: 'Sign In', contact: 'Contact', divisions: 'Divisions' },
    heroTagline: 'The complete school operating system for Canadian K\u201312 and post-secondary. Attendance, gradebook, report cards, a digital textbook library, AI tools \u2014 one app, zero data leaving Canada.',
    requestDemo: 'Get a Demo',
    seeFeatures: 'See Features',
    downloadOn: 'Download on the',
    appStore: 'App Store',
    comingSoon: 'Coming Soon',
    featuresTitle: 'POWERFUL FEATURES',
    featuresSubtitle: 'Learning Management System (LMS) + Student Information System (SIS) in one native iOS app. From micro-lessons to report cards — everything your school needs.',
    features: [
      { icon: Brain, title: 'Micro-Lessons', slug: 'micro-lessons', points: ['Research-backed cognitive load theory', 'Hook \u2192 Lesson \u2192 Compare \u2192 Quiz format', 'Reading timer ensures comprehension', 'Gated quizzes unlock after reading'], color: '#8B5CF6' },
      { icon: Bot, title: 'On-Device AI (6 Tools)', slug: 'ai-tools', points: ['AI Tutor with curriculum awareness', 'Micro-Lesson Converter (industry first)', 'Lesson Plan Builder', 'Report Card Comments', 'AI Search across all content', 'Apple Intelligence \u2014 data never leaves device'], color: '#00BFFF' },
      { icon: BookOpen, title: '72 Original Textbooks', slug: 'textbooks', points: ['288+ chapters with interactive content', 'Full SK K-12 curriculum coverage', 'WolfWhale Books publisher brand', 'Flashcards, quizzes & activities built in'], color: '#FFD700' },
      { icon: WifiOff, title: 'Offline Learning', slug: 'offline', points: ['Works without internet \u2014 anywhere', 'Full courses & textbooks available offline', 'Syncs automatically when back online', 'All data encrypted on device'], color: '#34D399' },
      { icon: GraduationCap, title: '30+ Classroom Tools', slug: 'teacher-tools', points: ['Free for all teacher accounts', 'Micro-Lesson Converter (AI)', 'Lesson Plan Builder & Gradebook', 'Rubric Builder, Seating Chart & more', '30+ tools \u2014 all included at no cost'], color: '#FF6B9D' },
      { icon: Gamepad2, title: 'Gamification & XP', slug: 'gamification', points: ['XP system with streaks & leaderboards', 'Study Pet companion (fish collection)', 'Chess, Kahoot, spelling bee & more', 'Common to Legendary badge rarity'], color: '#FFD700' },
      { icon: Eye, title: 'Apple Liquid Glass UI', slug: 'liquid-glass', points: ['Built with Apple\'s latest Liquid Glass SDK', 'Stunning, native iOS design language', 'Translucent materials and depth effects', 'Students actually want to use it'], color: '#00BFFF' },
      { icon: Users, title: 'Everyone Connected', slug: 'connected', points: ['Students, teachers, parents, and admins', 'Purpose-built dashboard for each role', 'Real-time messaging and announcements', 'All in one app \u2014 no separate portals'], color: '#8B5CF6' },
      { icon: Heart, title: 'Land-Based Lesson Library', slug: 'land-based', points: ['Pre-built Indigenous lessons', 'Aligned to TRC Call to Action #62', 'Culturally responsive content', 'Built for Indigenous communities'], color: '#F59E0B' },
    ],
    appPreview: 'APP PREVIEW',
    appPreviewSub: 'iPhone, iPad, and Mac. Built native for every screen.',
    signInLight: 'Sign In',
    signInDark: 'Sign In (Dark Mode)',
    myCoursesLabel: 'My Courses',
    dashboardLabel: 'Student Dashboard',
    screenshotLabel4: 'Progress Report',
    screenshotLabel5: 'Create Course (Teacher)',
    screenshotLabel6: 'Flashcard Creator',
    screenshotLabel7: 'Create Quiz (Teacher)',
    ipadDashboardLabel: 'iPad \u2014 Student Dashboard',
    ipadTextbookLabel: 'iPad \u2014 Dark Mode',
    macCoursesLabel: 'Mac \u2014 Student Dashboard',
    screenshotSoon: 'Screenshot Coming Soon',
    compareTitle: 'HOW WE COMPARE',
    compareSub: 'WolfWhale vs every major Canadian school platform.',
    featureLabel: 'Feature',
    compareRows: [
      { feature: 'AI Micro-Lesson Converter', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false, veracross: false, powerschool: false },
      { feature: 'On-Device AI Tutor', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false, veracross: false, powerschool: false },
      { feature: '72 Original Textbooks', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false, veracross: false, powerschool: false },
      { feature: 'Offline Learning', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false, veracross: false, powerschool: false },
      { feature: 'Gamification & XP', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false, veracross: false, powerschool: false },
      { feature: 'Attendance Tracking', wolfwhale: true, canvas: false, brightspace: false, edsby: true, moodle: false, veracross: true, powerschool: true },
      { feature: 'Gradebook & Report Cards', wolfwhale: true, canvas: true, brightspace: true, edsby: true, moodle: false, veracross: true, powerschool: true },
      { feature: 'Student Enrollment & Records', wolfwhale: true, canvas: false, brightspace: false, edsby: true, moodle: false, veracross: true, powerschool: true },
      { feature: 'Parent Portal', wolfwhale: true, canvas: false, brightspace: false, edsby: true, moodle: false, veracross: true, powerschool: true },
      { feature: 'Timetable & Scheduling', wolfwhale: true, canvas: false, brightspace: false, edsby: true, moodle: false, veracross: true, powerschool: true },
      { feature: 'Canadian Data Hosting', wolfwhale: true, canvas: false, brightspace: true, edsby: true, moodle: false, veracross: false, powerschool: false },
      { feature: 'Native iOS App', wolfwhale: true, canvas: true, brightspace: true, edsby: true, moodle: false, veracross: false, powerschool: false },
    ],
    swipeHint: 'Swipe to see all competitors \u2192',
    compareDisclaimer: 'Comparison based on publicly available feature lists as of 2026. Partial (\u2014) indicates limited or plugin-dependent support.',
    readyToSwitch: 'Ready to switch?',
    pricingTitle: 'SIMPLE PRICING',
    pricingSub: 'One plan. Everything included. No surprises.',
    perUser: 'Per User Account',
    perMonth: '/ month',
    minContract: 'Minimum 1-year contract',
    pricingFeatures: [
      'All features included',
      '72 original textbooks with micro-lessons',
      'On-device AI tutor & micro-lesson converter',
      '100+ learning tools & AR experiences',
      'Offline learning & gamification',
      '682 curriculum outcomes mapped',
      'Canadian hosting (PIPEDA, FERPA & COPPA)',
      'Onboarding & priority support',
    ],
    volumeDiscounts: 'Teachers always free. Division pricing available for 500+ users.',
    aboutTitle: 'Why WolfWhale',
    aboutText: 'WolfWhale is the only school platform that combines cognitive load theory, on-device AI, and 72 original textbooks into one native iOS app. Built for 4 user roles \u2014 Student, Teacher, Parent, and Admin \u2014 with 682 Saskatchewan curriculum outcomes mapped and expanding nationally. Student data never leaves the device. Canadian values drive everything we ship \u2014 privacy, accessibility, Indigenous connections, and bilingual support.',
    canadaTitle: 'Built in Canada',
    canadaSub: 'Saskatoon, SK. Designed, developed, hosted in Canada. Saskatchewan-first curriculum, expanding to all 13 provinces and territories.',
    canadaBadges: [
      { icon: Flag, label: 'Canadian Owned' },
      { icon: Shield, label: 'PIPEDA Compliant' },
      { icon: Shield, label: 'COPPA Compliant' },
      { icon: Globe, label: 'Hosted in Canada' },
      { icon: Heart, label: 'Built for Canadians' },
    ],
    trcTitle: 'TRC Calls to Action',
    trcSub: 'Education technology that honours reconciliation.',
    trcCards: [
      { icon: BookOpen, title: 'Indigenous Language Support', desc: 'Curriculum delivery in Indigenous languages (Calls #14-15)' },
      { icon: Users, title: 'Culturally Responsive Design', desc: 'Flexible content respecting diverse knowledge systems (Calls #10, #62)' },
      { icon: WifiOff, title: 'Remote & Northern Access', desc: 'Offline learning for equal access in remote communities (Calls #7-8)' },
      { icon: Heart, title: 'Partnership-Ready', desc: 'Supporting Indigenous education authorities (Calls #9-12)' },
    ],
    trcLink: 'Read the full TRC Calls to Action',
    faqTitle: 'FREQUENTLY ASKED QUESTIONS',
    faqSub: 'Quick answers about WolfWhale.',
    faqItems: [
      { q: 'How much does WolfWhale cost?', a: '$12/user/month with a 1-year contract. All features included. Teachers get free access. Volume discounts for school boards.' },
      { q: 'What are micro-lessons?', a: 'Research-backed bite-sized lessons using cognitive load theory. Each has a hook, a lesson, a comparison card, a reading timer, and gated quiz questions.' },
      { q: 'Is there a free trial?', a: 'Yes \u2014 we offer a full-featured pilot program. Request a demo and we\'ll set your school up.' },
      { q: 'Where is student data stored?', a: 'AI runs on-device \u2014 data never leaves the phone. Backend data is on Canadian servers only. COPPA, FERPA, and PIPEDA compliant.' },
      { q: 'Can WolfWhale work in remote or northern communities?', a: 'Yes. Full offline mode \u2014 all content, textbooks, and tools work without internet. Data syncs when connectivity returns.' },
    ],
    contactTitle: 'TALK TO US',
    contactSub: 'We reply within two business days.',
    emailDirect: 'Or email us at',
    footerCopyright: 'WolfWhale Inc. All rights reserved.',
    privacy: 'Privacy',
    terms: 'Terms',
    help: 'Help',
    // Micro-Lessons
    microLessonsTitle: 'MICRO-LESSONS',
    microLessonsSub: 'Research-backed learning based on cognitive load theory. Every piece of content follows this format.',
    microLessonsSteps: [
      { title: 'Hook', desc: 'A 2-sentence relatable scenario that grabs attention' },
      { title: 'Lesson', desc: '3-5 plain-language sentences explaining one concept' },
      { title: '\u201cThis Is / This Is Not\u201d', desc: 'Side-by-side comparison cards showing what the concept IS vs. common misconceptions' },
      { title: 'Reading Timer', desc: 'Configurable countdown ensuring students read before rushing to the quiz' },
      { title: 'Gated Quiz', desc: '5 quiz questions per section, locked until the reading timer completes' },
    ],
    microLessonsConverterTitle: 'AI Micro-Lesson Converter',
    microLessonsConverterDesc: 'No other school platform has this. Teachers paste any text \u2014 lesson notes, textbook excerpts, articles \u2014 and on-device AI converts it into structured micro-lessons instantly. Preview, edit, and assign in minutes.',
    // Textbooks
    textbooksTitle: 'WOLFWHALE BOOKS',
    textbooksSub: 'A digital textbook library of 72 original textbooks \u2014 built backwards from learning outcomes. Every textbook covers all curriculum outcomes for its subject and grade. Fully integrated with micro-lessons, flashcards, and interactive activities.',
    textbooksStats: [
      { value: '72', label: 'Original Textbooks' },
      { value: '288+', label: 'Chapters' },
      { value: '682', label: 'Curriculum Outcomes' },
      { value: '6', label: 'Interactive Activity Types' },
    ],
    // Key Differentiators
    differentiators: [
      { title: 'Only school platform with AI micro-lesson conversion', desc: 'Teachers paste any text, get structured micro-lessons instantly' },
      { title: 'Cognitive load theory in every lesson', desc: 'Not just pretty UI \u2014 research-backed learning science' },
      { title: 'On-device AI, full privacy', desc: 'Student data never leaves the device' },
      { title: 'Visual curriculum constellation', desc: 'Gamified skill tree showing all 682+ learning outcomes' },
      { title: '72 original textbooks', desc: 'With interactive activities, not just links to external content' },
      { title: 'Canadian-first', desc: 'Built for Canadian curriculum with PIPEDA compliance' },
      { title: 'Free for all teachers', desc: '30+ classroom tools at no cost \u2014 teacher accounts are always free' },
    ],
    // Mission & Impact
    missionTitle: 'OUR MISSION',
    missionTagline: "Advancing education's most important tool.",
    missionStats: [
      { value: '44%', label: 'Indigenous graduation rate in Canada', source: 'Statistics Canada, 2021' },
      { value: '88%', label: 'Non-Indigenous graduation rate in Canada', source: 'Statistics Canada, 2021' },
    ],
    missions: [
      { title: 'Mission 1', desc: 'Raise Indigenous graduation rates' },
      { title: 'Mission 2', desc: 'Replace outdated school platforms with one app' },
      { title: 'Mission 3', desc: 'Bring K\u201312 and post-secondary onto one platform' },
      { title: 'Mission 4', desc: 'Give every Canadian student access \u2014 urban, rural, and remote' },
    ],
    // IT Summit Banner
    itSummitBanner: 'See us at IT Summit 2026 \u2014 Saskatoon, May 28-29',
    itSummitDate: 'May 28-29, 2026',
    itSummitLocation: 'TCU Place, Saskatoon',
    // For School Divisions
    divisionsTitle: 'FOR SCHOOL DIVISIONS',
    divisionsSub: 'Enterprise-ready deployment for any Saskatchewan school division.',
    divisionsFeatures: [
      { icon: 'shield', title: 'SSO & Identity', desc: 'SAML 2.0, Google Workspace, and Microsoft 365 single sign-on. One login for every student and teacher.' },
      { icon: 'server', title: 'Bulk Deployment', desc: 'Apple School Manager and MDM-ready. Push to every device in your division with zero-touch setup.' },
      { icon: 'chart', title: 'Division Analytics', desc: 'Usage dashboards, engagement metrics, and outcome tracking across every school in your division.' },
      { icon: 'users', title: 'Dedicated Onboarding', desc: 'White-glove setup for your division. Training for teachers, IT staff, and administrators included.' },
      { icon: 'dollar', title: 'Volume Licensing', desc: 'Custom pricing for 500+ users. Multi-year contracts with predictable per-student costs.' },
      { icon: 'lock', title: 'Data Sovereignty', desc: 'All data hosted in Canada. PIPEDA, COPPA, and FERPA compliant. Student data never leaves the country.' },
    ],
    divisionsCTA: 'Start a Free Pilot',
    // Pilot CTA
    startPilot: 'Start a Free Pilot',
    pilotSub: '30-day full-featured pilot for one school. No cost, no commitment.',
  },
  fr: {
    lms: 'Plateforme scolaire',
    nav: { features: 'Fonctionnalit\u00e9s', compare: 'Comparer', pricing: 'Tarifs', faq: 'FAQ', signIn: 'Connexion', contact: 'Contact', divisions: 'Divisions scolaires' },
    heroTagline: 'Le syst\u00e8me scolaire complet pour le K\u201312 et le postsecondaire au Canada. Pr\u00e9sences, carnet de notes, bulletins, une biblioth\u00e8que de manuels num\u00e9riques, outils IA \u2014 une seule app, aucune donn\u00e9e hors du Canada.',
    requestDemo: 'Demander une d\u00e9mo',
    seeFeatures: 'Voir les fonctionnalit\u00e9s',
    downloadOn: 'T\u00e9l\u00e9charger sur l\u2019',
    appStore: 'App Store',
    comingSoon: 'Bient\u00f4t disponible',
    featuresTitle: 'FONCTIONNALIT\u00c9S PUISSANTES',
    featuresSubtitle: 'Système de gestion de l’apprentissage (SGA) + Système d’information scolaire (SIS) dans une seule app iOS native. Des micro-le\u00e7ons aux bulletins \u2014 tout ce dont votre \u00e9cole a besoin.',
    features: [
      { icon: Brain, title: 'Micro-le\u00e7ons', slug: 'micro-lessons', points: ['Th\u00e9orie de la charge cognitive', 'Format : accroche \u2192 le\u00e7on \u2192 comparaison \u2192 quiz', 'Minuterie de lecture pour la compr\u00e9hension', 'Quiz verrouill\u00e9s jusqu\u2019\u00e0 la fin de la lecture'], color: '#8B5CF6' },
      { icon: Bot, title: 'IA sur l\u2019appareil (6 outils)', slug: 'ai-tools', points: ['Tuteur IA avec contexte du programme', 'Convertisseur de micro-le\u00e7ons (premi\u00e8re mondiale)', 'G\u00e9n\u00e9rateur de plans de cours', 'Commentaires de bulletins', 'Recherche IA dans tout le contenu', 'Apple Intelligence \u2014 donn\u00e9es sur l\u2019appareil'], color: '#00BFFF' },
      { icon: BookOpen, title: '72 manuels originaux', slug: 'textbooks', points: ['288+ chapitres avec contenu interactif', 'Couverture compl\u00e8te du programme SK K-12', 'Marque \u00e9ditoriale WolfWhale Books', 'Cartes m\u00e9moire, quiz et activit\u00e9s int\u00e9gr\u00e9s'], color: '#FFD700' },
      { icon: WifiOff, title: 'Apprentissage hors ligne', slug: 'offline', points: ['Fonctionne sans internet \u2014 partout', 'Cours et manuels disponibles hors ligne', 'Synchronisation automatique au retour', 'Toutes les donn\u00e9es chiffr\u00e9es sur l\u2019appareil'], color: '#34D399' },
      { icon: GraduationCap, title: '30+ outils p\u00e9dagogiques', slug: 'teacher-tools', points: ['Gratuit pour tous les enseignants', 'Convertisseur de micro-le\u00e7ons (IA)', 'Plans de cours et carnet de notes', 'Rubriques, plan de classe et plus', '30+ outils \u2014 tous inclus sans frais'], color: '#FF6B9D' },
      { icon: Gamepad2, title: 'Ludification et XP', slug: 'gamification', points: ['Syst\u00e8me XP avec s\u00e9ries et classements', 'Compagnon d\u2019\u00e9tude (collection de poissons)', '\u00c9checs, Kahoot, quiz orthographe et plus', 'Badges de Commun \u00e0 L\u00e9gendaire'], color: '#FFD700' },
      { icon: Eye, title: 'Apple Liquid Glass UI', slug: 'liquid-glass', points: ['Con\u00e7u avec le dernier SDK Liquid Glass d\u2019Apple', 'Design iOS natif \u00e9poustouflant', 'Mat\u00e9riaux translucides et effets de profondeur', 'Les \u00e9l\u00e8ves veulent vraiment l\u2019utiliser'], color: '#00BFFF' },
      { icon: Users, title: 'Tous connect\u00e9s', slug: 'connected', points: ['\u00c9l\u00e8ves, enseignants, parents et admins', 'Tableau de bord d\u00e9di\u00e9 \u00e0 chaque r\u00f4le', 'Messagerie et annonces en temps r\u00e9el', 'Tout dans une seule app \u2014 aucun portail s\u00e9par\u00e9'], color: '#8B5CF6' },
      { icon: Heart, title: 'Biblioth\u00e8que de le\u00e7ons territoriales', slug: 'land-based', points: ['Le\u00e7ons autochtones pr\u00e9con\u00e7ues', 'Align\u00e9 sur l\u2019appel \u00e0 l\u2019action no 62 de la CVR', 'Contenu culturellement adapt\u00e9', 'Con\u00e7u pour les communaut\u00e9s autochtones'], color: '#F59E0B' },
    ],
    appPreview: 'APER\u00c7U DE L\u2019APPLICATION',
    appPreviewSub: 'iPhone, iPad et Mac. Natif sur chaque \u00e9cran.',
    signInLight: 'Connexion',
    signInDark: 'Connexion (mode sombre)',
    myCoursesLabel: 'Mes cours',
    dashboardLabel: 'Tableau de bord \u00e9l\u00e8ve',
    screenshotLabel4: 'Rapport de progr\u00e8s',
    screenshotLabel5: 'Cr\u00e9er un cours (enseignant)',
    screenshotLabel6: 'Cr\u00e9ateur de cartes m\u00e9moire',
    screenshotLabel7: 'Cr\u00e9er un quiz (enseignant)',
    ipadDashboardLabel: 'iPad \u2014 Tableau de bord',
    ipadTextbookLabel: 'iPad \u2014 Mode sombre',
    macCoursesLabel: 'Mac \u2014 Tableau de bord',
    screenshotSoon: 'Capture d\u2019\u00e9cran \u00e0 venir',
    compareTitle: 'COMMENT NOUS NOUS COMPARONS',
    compareSub: 'WolfWhale vs chaque plateforme scolaire canadienne majeure.',
    featureLabel: 'Fonctionnalit\u00e9',
    compareRows: [
      { feature: 'Convertisseur de micro-le\u00e7ons IA', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false, veracross: false, powerschool: false },
      { feature: 'Tuteur IA sur l\u2019appareil', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false, veracross: false, powerschool: false },
      { feature: '72 manuels originaux', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false, veracross: false, powerschool: false },
      { feature: 'Apprentissage hors ligne', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false, veracross: false, powerschool: false },
      { feature: 'Ludification et XP', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false, veracross: false, powerschool: false },
      { feature: 'Suivi des pr\u00e9sences', wolfwhale: true, canvas: false, brightspace: false, edsby: true, moodle: false, veracross: true, powerschool: true },
      { feature: 'Carnet de notes et bulletins', wolfwhale: true, canvas: true, brightspace: true, edsby: true, moodle: false, veracross: true, powerschool: true },
      { feature: 'Inscription et dossiers \u00e9l\u00e8ves', wolfwhale: true, canvas: false, brightspace: false, edsby: true, moodle: false, veracross: true, powerschool: true },
      { feature: 'Portail parents', wolfwhale: true, canvas: false, brightspace: false, edsby: true, moodle: false, veracross: true, powerschool: true },
      { feature: 'Horaires et emploi du temps', wolfwhale: true, canvas: false, brightspace: false, edsby: true, moodle: false, veracross: true, powerschool: true },
      { feature: 'H\u00e9bergement canadien', wolfwhale: true, canvas: false, brightspace: true, edsby: true, moodle: false, veracross: false, powerschool: false },
      { feature: 'App iOS native', wolfwhale: true, canvas: true, brightspace: true, edsby: true, moodle: false, veracross: false, powerschool: false },
    ],
    swipeHint: 'Glissez pour voir tous les concurrents \u2192',
    compareDisclaimer: 'Comparaison fond\u00e9e sur les listes de fonctionnalit\u00e9s publiques de 2026.',
    readyToSwitch: 'Pr\u00eat \u00e0 changer\u00a0?',
    pricingTitle: 'TARIFICATION SIMPLE',
    pricingSub: 'Un seul forfait. Tout inclus. Aucuns frais cach\u00e9s.',
    perUser: 'Par compte utilisateur',
    perMonth: '/ mois',
    minContract: 'Contrat minimum d\u2019un an',
    pricingFeatures: [
      'Toutes les fonctionnalit\u00e9s incluses',
      '72 manuels originaux avec micro-le\u00e7ons',
      'Tuteur IA et convertisseur de micro-le\u00e7ons',
      '100+ outils et exp\u00e9riences RA',
      'Apprentissage hors ligne et ludification',
      '682 r\u00e9sultats du programme cart\u00e9s',
      'H\u00e9bergement canadien (LPRPDE, FERPA et COPPA)',
      'Int\u00e9gration et soutien prioritaire',
    ],
    volumeDiscounts: 'Acc\u00e8s gratuit pour les enseignants. Rabais de volume pour les commissions scolaires.',
    aboutTitle: '\u00c0 propos de WolfWhale',
    aboutText: 'WolfWhale est la seule plateforme scolaire qui combine la th\u00e9orie de la charge cognitive, l\u2019IA sur l\u2019appareil et 72 manuels originaux dans une seule app iOS native. Con\u00e7u pour 4 r\u00f4les \u2014 \u00c9l\u00e8ve, Enseignant, Parent et Admin \u2014 avec 682 r\u00e9sultats du programme de la Saskatchewan, en expansion nationale. Les donn\u00e9es des \u00e9l\u00e8ves ne quittent jamais l\u2019appareil. Les valeurs canadiennes guident tout ce que nous livrons \u2014 confidentialit\u00e9, accessibilit\u00e9, liens autochtones et soutien bilingue.',
    canadaTitle: 'Fi\u00e8rement construit au Canada',
    canadaSub: 'Saskatoon, SK. Con\u00e7u, d\u00e9velopp\u00e9 et h\u00e9berg\u00e9 au Canada. Programme de la Saskatchewan d\u2019abord, expansion nationale.',
    canadaBadges: [
      { icon: Flag, label: 'Propri\u00e9t\u00e9 canadienne' },
      { icon: Shield, label: 'Conforme LPRPDE' },
      { icon: Shield, label: 'Conforme COPPA' },
      { icon: Globe, label: 'H\u00e9berg\u00e9 au Canada' },
      { icon: Heart, label: 'Con\u00e7u pour les Canadiens' },
    ],
    trcTitle: 'Appels \u00e0 l\u2019action de la CVR',
    trcSub: 'Une technologie \u00e9ducative qui honore la r\u00e9conciliation.',
    trcCards: [
      { icon: BookOpen, title: 'Soutien aux langues autochtones', desc: 'Diffusion de programmes en langues autochtones (appels no 14-15)' },
      { icon: Users, title: 'Conception culturellement adapt\u00e9e', desc: 'Contenu flexible respectant les syst\u00e8mes de savoirs diversifi\u00e9s (appels no 10, 62)' },
      { icon: WifiOff, title: 'Acc\u00e8s \u00e9loign\u00e9 et nordique', desc: 'Apprentissage hors ligne pour un acc\u00e8s \u00e9quitable (appels no 7-8)' },
      { icon: Heart, title: 'Pr\u00eat pour les partenariats', desc: 'Soutien aux autorit\u00e9s \u00e9ducatives autochtones (appels no 9-12)' },
    ],
    trcLink: 'Lire les appels \u00e0 l\u2019action de la CVR',
    faqTitle: 'FOIRE AUX QUESTIONS',
    faqSub: 'Tout ce que vous devez savoir sur WolfWhale.',
    faqItems: [
      { q: 'Combien co\u00fbte WolfWhale\u00a0?', a: '12\u00a0$/utilisateur/mois avec un contrat d\u2019un an. Tout inclus \u2014 72 manuels, tuteur IA, micro-le\u00e7ons, ludification. Acc\u00e8s gratuit pour les enseignants. Rabais de volume pour les commissions scolaires.' },
      { q: 'Que sont les micro-le\u00e7ons\u00a0?', a: 'Les micro-le\u00e7ons sont notre format de contenu fond\u00e9 sur la th\u00e9orie de la charge cognitive. Chacune comprend une accroche, une le\u00e7on courte, une carte de comparaison, une minuterie de lecture et 5 questions de quiz.' },
      { q: 'Les enseignants peuvent-ils cr\u00e9er leurs propres micro-le\u00e7ons\u00a0?', a: 'Oui \u2014 WolfWhale est la seule plateforme scolaire avec un convertisseur de micro-le\u00e7ons IA. Collez n\u2019importe quel texte et l\u2019IA le convertit en micro-le\u00e7ons structur\u00e9es.' },
      { q: 'Y a-t-il un essai gratuit\u00a0?', a: 'Oui \u2014 nous offrons un programme pilote complet. Demandez une d\u00e9mo.' },
      { q: 'O\u00f9 sont stock\u00e9es les donn\u00e9es\u00a0?', a: 'L\u2019IA fonctionne sur l\u2019appareil \u2014 les donn\u00e9es ne quittent jamais le t\u00e9l\u00e9phone. Les donn\u00e9es serveur sont exclusivement sur des serveurs canadiens. Conforme COPPA, FERPA et LPRPDE.' },
      { q: 'Quels sujets et niveaux\u00a0?', a: 'Couverture compl\u00e8te K-12 de la Saskatchewan : Math, Sciences, Fran\u00e7ais, \u00c9tudes sociales, Sant\u00e9, Arts, \u00c9d. physique, \u00c9d. aux carri\u00e8res, plus Physique, Bio et Chimie au secondaire.' },
      { q: 'Support Android\u00a0?', a: 'WolfWhale est con\u00e7u exclusivement pour iOS/iPadOS avec SwiftUI natif. iOS 17+ requis, fonctionnalit\u00e9s IA sur iOS 26+.' },
      { q: 'Quels r\u00f4les sont pris en charge\u00a0?', a: 'Quatre r\u00f4les : \u00c9l\u00e8ve, Enseignant, Parent et Admin. Chacun a son propre tableau de bord.' },
      { q: 'WolfWhale fonctionne-t-il dans les communaut\u00e9s \u00e9loign\u00e9es ou nordiques\u00a0?', a: 'Oui. Le mode hors ligne permet aux \u00e9l\u00e8ves d\u2019apprendre partout \u2014 m\u00eame sans internet fiable. Tout le contenu, les manuels et les outils sont disponibles hors ligne avec chiffrement sur l\u2019appareil. Les donn\u00e9es se synchronisent automatiquement au retour de la connectivit\u00e9.' },
    ],
    contactTitle: 'NOUS JOINDRE',
    contactSub: 'Nous r\u00e9pondons sous deux jours ouvrables.',
    emailDirect: 'Ou \u00e9crivez-nous \u00e0',
    footerCopyright: 'WolfWhale Inc. Tous droits r\u00e9serv\u00e9s.',
    privacy: 'Confidentialit\u00e9',
    terms: 'Conditions',
    help: 'Aide',
    // Micro-Lessons
    microLessonsTitle: 'MICRO-LE\u00c7ONS',
    microLessonsSub: 'Apprentissage fond\u00e9 sur la th\u00e9orie de la charge cognitive. Chaque contenu suit ce format.',
    microLessonsSteps: [
      { title: 'Accroche', desc: 'Un sc\u00e9nario de 2 phrases qui capte l\u2019attention' },
      { title: 'Le\u00e7on', desc: '3-5 phrases simples expliquant un seul concept' },
      { title: '\u00ab\u00a0C\u2019est / Ce n\u2019est pas\u00a0\u00bb', desc: 'Cartes de comparaison c\u00f4te \u00e0 c\u00f4te : concept correct vs. id\u00e9es fausses' },
      { title: 'Minuterie de lecture', desc: 'Compte \u00e0 rebours pour s\u2019assurer que les \u00e9l\u00e8ves lisent avant le quiz' },
      { title: 'Quiz verrouill\u00e9', desc: '5 questions par section, d\u00e9verrouill\u00e9es apr\u00e8s la minuterie' },
    ],
    microLessonsConverterTitle: 'Convertisseur de micro-le\u00e7ons IA',
    microLessonsConverterDesc: 'Aucune autre plateforme scolaire n\u2019a cette fonctionnalit\u00e9. Les enseignants collent n\u2019importe quel texte et l\u2019IA le convertit en micro-le\u00e7ons structur\u00e9es.',
    // Textbooks
    textbooksTitle: 'WOLFWHALE BOOKS',
    textbooksSub: 'Une biblioth\u00e8que num\u00e9rique de 72 manuels originaux \u2014 con\u00e7us \u00e0 rebours des r\u00e9sultats d\u2019apprentissage. Chaque manuel couvre tous les r\u00e9sultats du programme pour sa mati\u00e8re et son niveau. Int\u00e9gr\u00e9s avec micro-le\u00e7ons, cartes m\u00e9moire et activit\u00e9s interactives.',
    textbooksStats: [
      { value: '72', label: 'Manuels originaux' },
      { value: '288+', label: 'Chapitres' },
      { value: '682', label: 'R\u00e9sultats du programme' },
      { value: '6', label: 'Types d\u2019activit\u00e9s interactives' },
    ],
    // Key Differentiators
    differentiators: [
      { title: 'Seule plateforme scolaire avec conversion IA de micro-le\u00e7ons', desc: 'Les enseignants collent du texte, obtiennent des micro-le\u00e7ons' },
      { title: 'Th\u00e9orie de la charge cognitive dans chaque le\u00e7on', desc: 'Science de l\u2019apprentissage fond\u00e9e sur la recherche' },
      { title: 'IA sur l\u2019appareil, confidentialit\u00e9 totale', desc: 'Les donn\u00e9es ne quittent jamais l\u2019appareil' },
      { title: 'Constellation du programme', desc: 'Arbre de comp\u00e9tences montrant les 682+ r\u00e9sultats' },
      { title: '72 manuels originaux', desc: 'Avec activit\u00e9s interactives, pas de contenu externe' },
      { title: 'Canadien d\u2019abord', desc: 'Con\u00e7u pour le programme canadien, conforme LPRPDE' },
      { title: 'Gratuit pour tous les enseignants', desc: '30+ outils p\u00e9dagogiques sans frais \u2014 les comptes enseignants sont toujours gratuits' },
    ],
    // Mission & Impact
    missionTitle: 'NOTRE MISSION',
    missionTagline: "Faire progresser l\u2019outil le plus important de l\u2019\u00e9ducation.",
    missionStats: [
      { value: '44%', label: 'Taux de diplomation autochtone au Canada', source: 'Statistique Canada, 2021' },
      { value: '88%', label: 'Taux de diplomation non autochtone au Canada', source: 'Statistique Canada, 2021' },
    ],
    missions: [
      { title: 'Mission 1', desc: 'Augmenter les taux de diplomation autochtones' },
      { title: 'Mission 2', desc: 'Remplacer les plateformes scolaires d\u00e9pass\u00e9es par une seule app' },
      { title: 'Mission 3', desc: 'R\u00e9unir le K\u201312 et le postsecondaire sur une seule plateforme' },
      { title: 'Mission 4', desc: 'Donner acc\u00e8s \u00e0 chaque \u00e9l\u00e8ve canadien \u2014 urbain, rural et \u00e9loign\u00e9' },
    ],
    // IT Summit Banner
    itSummitBanner: 'Visitez-nous au IT Summit 2026 \u2014 Saskatoon, 28-29 mai',
    itSummitDate: '28-29 mai 2026',
    itSummitLocation: 'TCU Place, Saskatoon',
    // For School Divisions
    divisionsTitle: 'POUR LES DIVISIONS SCOLAIRES',
    divisionsSub: 'D\u00e9ploiement pr\u00eat pour toute division scolaire de la Saskatchewan.',
    divisionsFeatures: [
      { icon: 'shield', title: 'SSO et identit\u00e9', desc: 'SAML 2.0, Google Workspace et Microsoft 365. Une seule connexion pour chaque \u00e9l\u00e8ve et enseignant.' },
      { icon: 'server', title: 'D\u00e9ploiement en masse', desc: 'Compatible Apple School Manager et MDM. Installation sans contact sur tous les appareils.' },
      { icon: 'chart', title: 'Analytique de division', desc: 'Tableaux de bord, m\u00e9triques d\u2019engagement et suivi des r\u00e9sultats pour chaque \u00e9cole.' },
      { icon: 'users', title: 'Int\u00e9gration d\u00e9di\u00e9e', desc: 'Mise en place personnalis\u00e9e. Formation pour enseignants, personnel TI et administrateurs incluse.' },
      { icon: 'dollar', title: 'Licences en volume', desc: 'Tarification personnalis\u00e9e pour 500+ utilisateurs. Contrats pluriannuels avec co\u00fbts pr\u00e9visibles.' },
      { icon: 'lock', title: 'Souverainet\u00e9 des donn\u00e9es', desc: 'Toutes les donn\u00e9es h\u00e9berg\u00e9es au Canada. Conforme LPRPDE, COPPA et FERPA.' },
    ],
    divisionsCTA: 'D\u00e9marrer un essai gratuit',
    // Pilot CTA
    startPilot: 'D\u00e9marrer un essai gratuit',
    pilotSub: 'Essai gratuit de 30 jours pour une \u00e9cole. Sans frais, sans engagement.',
  },
}