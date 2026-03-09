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
  nav: { features: string; compare: string; pricing: string; faq: string; signIn: string; contact: string }
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
}

export const landingContent: Record<Lang, LandingContent> = {
  en: {
    lms: 'Learning Management System',
    nav: { features: 'Features', compare: 'Compare', pricing: 'Pricing', faq: 'FAQ', signIn: 'Sign In', contact: 'Contact' },
    heroTagline: 'The only native iOS LMS built for Canadian schools. AI tutoring, 72 original textbooks, offline learning — one app, zero data leaving Canada.',
    requestDemo: 'Get a Demo',
    seeFeatures: 'See Features',
    downloadOn: 'Download on the',
    appStore: 'App Store',
    comingSoon: 'Coming Soon',
    featuresTitle: 'POWERFUL FEATURES',
    featuresSubtitle: 'Everything a modern school needs, built into one native iOS app.',
    features: [
      { icon: Brain, title: 'Micro-Lessons', slug: 'micro-lessons', points: ['Research-backed cognitive load theory', 'Hook \u2192 Lesson \u2192 Compare \u2192 Quiz format', 'Reading timer ensures comprehension', 'Gated quizzes unlock after reading'], color: '#8B5CF6' },
      { icon: Bot, title: 'On-Device AI (6 Tools)', slug: 'ai-tools', points: ['AI Tutor with curriculum awareness', 'Micro-Lesson Converter (industry first)', 'Lesson Plan Builder', 'Report Card Comments', 'AI Search across all content', 'Apple Intelligence \u2014 data never leaves device'], color: '#00BFFF' },
      { icon: BookOpen, title: '72 Original Textbooks', slug: 'textbooks', points: ['288+ chapters with interactive content', 'Full SK K-12 curriculum coverage', 'WolfWhale Books publisher brand', 'Flashcards, quizzes & activities built in'], color: '#FFD700' },
      { icon: WifiOff, title: 'Offline Learning', slug: 'offline', points: ['Works without internet — anywhere', 'Full courses & textbooks available offline', 'Syncs automatically when back online', 'All data encrypted on device'], color: '#34D399' },
      { icon: GraduationCap, title: '11 Teacher Tools', slug: 'teacher-tools', points: ['Micro-Lesson Converter (AI)', 'Lesson Plan Builder', 'Gradebook & Rubric Builder', 'Seating Chart & Weekly Planner', 'Report Card Comments'], color: '#FF6B9D' },
      { icon: Gamepad2, title: 'Gamification & XP', slug: 'gamification', points: ['XP system with streaks & leaderboards', 'Study Pet companion (fish collection)', 'Chess, Kahoot, spelling bee & more', 'Common to Legendary badge rarity'], color: '#FFD700' },
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
    ipadDashboardLabel: 'iPad — Student Dashboard',
    ipadTextbookLabel: 'iPad — Dark Mode',
    macCoursesLabel: 'Mac — Student Dashboard',
    screenshotSoon: 'Screenshot Coming Soon',
    compareTitle: 'HOW WE COMPARE',
    compareSub: 'WolfWhale vs every major Canadian LMS.',
    featureLabel: 'Feature',
    compareRows: [
      { feature: 'AI Micro-Lesson Converter', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'On-Device AI Tutor', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: '72 Original Textbooks', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: '100+ Learning Tools', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'AR Experiences', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'Offline Learning', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'Gamification & XP', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'Visual Curriculum Constellation', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'Native iOS App', wolfwhale: true, canvas: true, brightspace: true, edsby: true, moodle: false },
      { feature: 'Parent Portal', wolfwhale: true, canvas: false, brightspace: false, edsby: true, moodle: false },
      { feature: 'Canadian Data Hosting', wolfwhale: true, canvas: false, brightspace: true, edsby: true, moodle: false },
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
    volumeDiscounts: 'Teachers get free access. Volume discounts for school boards.',
    aboutTitle: 'Why WolfWhale',
    aboutText: 'WolfWhale is the only LMS that combines cognitive load theory, on-device AI, and 72 original textbooks into one native iOS app. Built for 4 user roles \u2014 Student, Teacher, Parent, and Admin \u2014 with 682 Saskatchewan curriculum outcomes mapped and expanding nationally. Student data never leaves the device. Canadian values drive everything we ship \u2014 privacy, accessibility, Indigenous connections, and bilingual support.',
    canadaTitle: 'Built in Canada',
    canadaSub: 'Vancouver, BC. Designed, developed, hosted here. Saskatchewan-first curriculum, expanding to all 13 provinces and territories.',
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
    faqSub: 'Quick answers about WolfWhale LMS.',
    faqItems: [
      { q: 'How much does WolfWhale cost?', a: '$12/user/month with a 1-year contract. All features included \u2014 72 textbooks, AI tutor, micro-lessons, gamification, everything. Teachers get free access. Volume discounts available for school boards.' },
      { q: 'What are micro-lessons?', a: 'Micro-lessons are our research-backed content format based on cognitive load theory. Each one has a relatable hook, a short lesson explaining one concept, a "This Is / This Is Not" comparison card, a reading timer, and 5 gated quiz questions. Every textbook chapter contains 3-5 micro-lessons.' },
      { q: 'Can teachers create their own micro-lessons?', a: 'Yes \u2014 WolfWhale is the only LMS with an AI-powered micro-lesson converter. Teachers paste any text (lesson notes, textbook excerpts, articles) and on-device AI converts it into structured micro-lessons with hooks, comparisons, and quizzes. They can also build from scratch.' },
      { q: 'Is there a free trial?', a: 'Yes \u2014 we offer a full-featured pilot program. Request a demo and we\'ll set your school up.' },
      { q: 'Where is student data stored?', a: 'All AI runs on-device using Apple Intelligence \u2014 student data never leaves the phone. Backend data is stored exclusively on Canadian servers. COPPA, FERPA, and PIPEDA compliant. Encrypted with TLS 1.3 and AES-256.' },
      { q: 'What subjects and grades are covered?', a: 'Full Saskatchewan K-12 coverage: Math K-12, Science K-10, ELA K-9, Social Studies K-9, Health 1-9, Arts, PE, Career Ed 6-9, French 1, plus senior Physics, Biology, and Chemistry. 682 curriculum outcomes mapped.' },
      { q: 'What about Android support?', a: 'WolfWhale is built exclusively for iOS/iPadOS using native SwiftUI. Requires iOS 17+, with AI features on iOS 26+.' },
      { q: 'What user roles are supported?', a: 'Four roles: Student, Teacher, Parent, and Admin. Each has a purpose-built dashboard and feature set.' },
      { q: 'Can WolfWhale work in remote or northern communities?', a: 'Yes. Offline mode means students can learn anywhere \u2014 even without reliable internet. All content, textbooks, and tools are available offline with on-device encryption. Data syncs automatically when connectivity returns.' },
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
      { title: '"This Is / This Is Not"', desc: 'Side-by-side comparison cards showing what the concept IS vs. common misconceptions' },
      { title: 'Reading Timer', desc: 'Configurable countdown ensuring students read before rushing to the quiz' },
      { title: 'Gated Quiz', desc: '5 quiz questions per section, locked until the reading timer completes' },
    ],
    microLessonsConverterTitle: 'AI Micro-Lesson Converter',
    microLessonsConverterDesc: 'No other LMS has this. Teachers paste any text \u2014 lesson notes, textbook excerpts, articles \u2014 and on-device AI converts it into structured micro-lessons instantly. Preview, edit, and assign in minutes.',
    // Textbooks
    textbooksTitle: 'WOLFWHALE BOOKS',
    textbooksSub: '72 original textbooks published under our own brand. Not links to external content \u2014 fully integrated with micro-lessons, flashcards, and interactive activities.',
    textbooksStats: [
      { value: '72', label: 'Original Textbooks' },
      { value: '288+', label: 'Chapters' },
      { value: '682', label: 'Curriculum Outcomes' },
      { value: '6', label: 'Interactive Activity Types' },
    ],
    // Key Differentiators
    differentiators: [
      { title: 'Only LMS with AI micro-lesson conversion', desc: 'Teachers paste any text, get structured micro-lessons instantly' },
      { title: 'Cognitive load theory in every lesson', desc: 'Not just pretty UI \u2014 research-backed learning science' },
      { title: 'On-device AI, full privacy', desc: 'Student data never leaves the device' },
      { title: 'Visual curriculum constellation', desc: 'Gamified skill tree showing all 682+ learning outcomes' },
      { title: '72 original textbooks', desc: 'With interactive activities, not just links to external content' },
      { title: 'Canadian-first', desc: 'Built for Canadian curriculum with PIPEDA compliance' },
    ],
  },
  fr: {
    lms: 'Syst\u00e8me de gestion de l\u2019apprentissage',
    nav: { features: 'Fonctionnalit\u00e9s', compare: 'Comparer', pricing: 'Tarifs', faq: 'FAQ', signIn: 'Connexion', contact: 'Contact' },
    heroTagline: 'Le seul SGA iOS natif con\u00e7u pour les \u00e9coles canadiennes. Tutorat IA, 72 manuels originaux, apprentissage hors ligne \u2014 une seule app, aucune donn\u00e9e hors du Canada.',
    requestDemo: 'Demander une d\u00e9mo',
    seeFeatures: 'Voir les fonctionnalit\u00e9s',
    downloadOn: 'T\u00e9l\u00e9charger sur l\u2019',
    appStore: 'App Store',
    comingSoon: 'Bient\u00f4t disponible',
    featuresTitle: 'FONCTIONNALIT\u00c9S PUISSANTES',
    featuresSubtitle: 'Tout ce dont une \u00e9cole moderne a besoin, int\u00e9gr\u00e9 dans une seule app iOS native.',
    features: [
      { icon: Brain, title: 'Micro-le\u00e7ons', slug: 'micro-lessons', points: ['Th\u00e9orie de la charge cognitive', 'Format : accroche \u2192 le\u00e7on \u2192 comparaison \u2192 quiz', 'Minuterie de lecture pour la compr\u00e9hension', 'Quiz verrouill\u00e9s jusqu\u2019\u00e0 la fin de la lecture'], color: '#8B5CF6' },
      { icon: Bot, title: 'IA sur l\u2019appareil (6 outils)', slug: 'ai-tools', points: ['Tuteur IA avec contexte du programme', 'Convertisseur de micro-le\u00e7ons (premi\u00e8re mondiale)', 'G\u00e9n\u00e9rateur de plans de cours', 'Commentaires de bulletins', 'Recherche IA dans tout le contenu', 'Apple Intelligence \u2014 donn\u00e9es sur l\u2019appareil'], color: '#00BFFF' },
      { icon: BookOpen, title: '72 manuels originaux', slug: 'textbooks', points: ['288+ chapitres avec contenu interactif', 'Couverture compl\u00e8te du programme SK K-12', 'Marque \u00e9ditoriale WolfWhale Books', 'Cartes m\u00e9moire, quiz et activit\u00e9s int\u00e9gr\u00e9s'], color: '#FFD700' },
      { icon: WifiOff, title: 'Apprentissage hors ligne', slug: 'offline', points: ['Fonctionne sans internet \u2014 partout', 'Cours et manuels disponibles hors ligne', 'Synchronisation automatique au retour', 'Toutes les donn\u00e9es chiffr\u00e9es sur l\u2019appareil'], color: '#34D399' },
      { icon: GraduationCap, title: '11 outils enseignant', slug: 'teacher-tools', points: ['Convertisseur de micro-le\u00e7ons (IA)', 'G\u00e9n\u00e9rateur de plans de cours', 'Carnet de notes et rubriques', 'Plan de classe et planificateur', 'Commentaires de bulletins'], color: '#FF6B9D' },
      { icon: Gamepad2, title: 'Ludification et XP', slug: 'gamification', points: ['Syst\u00e8me XP avec s\u00e9ries et classements', 'Compagnon d\u2019\u00e9tude (collection de poissons)', '\u00c9checs, Kahoot, quiz orthographe et plus', 'Badges de Commun \u00e0 L\u00e9gendaire'], color: '#FFD700' },
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
    compareSub: 'WolfWhale vs chaque SGA canadien majeur.',
    featureLabel: 'Fonctionnalit\u00e9',
    compareRows: [
      { feature: 'Convertisseur de micro-le\u00e7ons IA', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'Tuteur IA sur l\u2019appareil', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: '72 manuels originaux', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: '100+ outils d\u2019apprentissage', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'Exp\u00e9riences RA', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'Apprentissage hors ligne', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'Ludification et XP', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'Constellation du programme', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'App iOS native', wolfwhale: true, canvas: true, brightspace: true, edsby: true, moodle: false },
      { feature: 'Portail parents', wolfwhale: true, canvas: false, brightspace: false, edsby: true, moodle: false },
      { feature: 'H\u00e9bergement canadien', wolfwhale: true, canvas: false, brightspace: true, edsby: true, moodle: false },
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
    aboutText: 'WolfWhale est le seul SGA qui combine la th\u00e9orie de la charge cognitive, l\u2019IA sur l\u2019appareil et 72 manuels originaux dans une seule app iOS native. Con\u00e7u pour 4 r\u00f4les \u2014 \u00c9l\u00e8ve, Enseignant, Parent et Admin \u2014 avec 682 r\u00e9sultats du programme de la Saskatchewan, en expansion nationale. Les donn\u00e9es des \u00e9l\u00e8ves ne quittent jamais l\u2019appareil. Les valeurs canadiennes guident tout ce que nous livrons \u2014 confidentialit\u00e9, accessibilit\u00e9, liens autochtones et soutien bilingue.',
    canadaTitle: 'Fi\u00e8rement construit au Canada',
    canadaSub: 'Vancouver, C.-B. Con\u00e7u, d\u00e9velopp\u00e9 et h\u00e9berg\u00e9 au Canada. Programme de la Saskatchewan d\u2019abord, expansion nationale.',
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
    faqSub: 'Tout ce que vous devez savoir sur WolfWhale LMS.',
    faqItems: [
      { q: 'Combien co\u00fbte WolfWhale\u00a0?', a: '12\u00a0$/utilisateur/mois avec un contrat d\u2019un an. Tout inclus \u2014 72 manuels, tuteur IA, micro-le\u00e7ons, ludification. Acc\u00e8s gratuit pour les enseignants. Rabais de volume pour les commissions scolaires.' },
      { q: 'Que sont les micro-le\u00e7ons\u00a0?', a: 'Les micro-le\u00e7ons sont notre format de contenu fond\u00e9 sur la th\u00e9orie de la charge cognitive. Chacune comprend une accroche, une le\u00e7on courte, une carte de comparaison, une minuterie de lecture et 5 questions de quiz.' },
      { q: 'Les enseignants peuvent-ils cr\u00e9er leurs propres micro-le\u00e7ons\u00a0?', a: 'Oui \u2014 WolfWhale est le seul SGA avec un convertisseur de micro-le\u00e7ons IA. Collez n\u2019importe quel texte et l\u2019IA le convertit en micro-le\u00e7ons structur\u00e9es.' },
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
    microLessonsConverterDesc: 'Aucun autre SGA n\u2019a cette fonctionnalit\u00e9. Les enseignants collent n\u2019importe quel texte et l\u2019IA le convertit en micro-le\u00e7ons structur\u00e9es.',
    // Textbooks
    textbooksTitle: 'WOLFWHALE BOOKS',
    textbooksSub: '72 manuels originaux publi\u00e9s sous notre propre marque. Pas de liens vers du contenu externe \u2014 int\u00e9gr\u00e9s avec micro-le\u00e7ons, cartes m\u00e9moire et activit\u00e9s interactives.',
    textbooksStats: [
      { value: '72', label: 'Manuels originaux' },
      { value: '288+', label: 'Chapitres' },
      { value: '682', label: 'R\u00e9sultats du programme' },
      { value: '6', label: 'Types d\u2019activit\u00e9s interactives' },
    ],
    // Key Differentiators
    differentiators: [
      { title: 'Seul SGA avec conversion IA de micro-le\u00e7ons', desc: 'Les enseignants collent du texte, obtiennent des micro-le\u00e7ons' },
      { title: 'Th\u00e9orie de la charge cognitive dans chaque le\u00e7on', desc: 'Science de l\u2019apprentissage fond\u00e9e sur la recherche' },
      { title: 'IA sur l\u2019appareil, confidentialit\u00e9 totale', desc: 'Les donn\u00e9es ne quittent jamais l\u2019appareil' },
      { title: 'Constellation du programme', desc: 'Arbre de comp\u00e9tences montrant les 682+ r\u00e9sultats' },
      { title: '72 manuels originaux', desc: 'Avec activit\u00e9s interactives, pas de contenu externe' },
      { title: 'Canadien d\u2019abord', desc: 'Con\u00e7u pour le programme canadien, conforme LPRPDE' },
    ],
  },
}
