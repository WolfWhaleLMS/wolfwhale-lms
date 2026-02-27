import { Bot, Eye, Wrench, WifiOff, GraduationCap, Gamepad2, BookOpen, Users, Heart, Flag, Shield, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type Lang = 'en' | 'fr'

interface FeatureCard {
  icon: LucideIcon
  title: string
  points: string[]
  color: string
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
}

export const landingContent: Record<Lang, LandingContent> = {
  en: {
    lms: 'Learning Management System',
    nav: { features: 'Features', compare: 'Compare', pricing: 'Pricing', faq: 'FAQ', signIn: 'Sign In', contact: 'Contact' },
    requestDemo: 'Request a Demo',
    seeFeatures: 'See Features',
    downloadOn: 'Download on the',
    appStore: 'App Store',
    comingSoon: 'Coming Soon',
    featuresTitle: '106+ FEATURES',
    featuresSubtitle: '',
    features: [
      { icon: Bot, title: 'On-Device AI Tutor', points: ['Apple Intelligence powered', 'Runs entirely on-device', 'Data never leaves the phone'], color: '#00BFFF' },
      { icon: Eye, title: 'AR Experiences', points: ['8 subject categories', '4 experience types', 'Grade-level tagging'], color: '#FFD700' },
      { icon: Wrench, title: '100+ Learning Tools', points: ['Periodic Table', 'Fraction Builder', 'Geometry Explorer', 'Typing Tutor', 'and more'], color: '#FF6B9D' },
      { icon: WifiOff, title: 'Offline Learning', points: ['AES-GCM encrypted storage', '8 cached entity types', 'Auto sync on reconnect'], color: '#34D399' },
      { icon: GraduationCap, title: 'Teacher Command Center', points: ['Gradebook', 'NFC attendance', 'Plagiarism detection', 'Rubric builder', 'Live Activity'], color: '#8B5CF6' },
      { icon: Gamepad2, title: 'Gamification & XP', points: ['5 XP tiers', '10 badge types', 'Virtual aquarium', 'Study pet', 'Retro sound effects'], color: '#FFD700' },
    ],
    appPreview: 'APP PREVIEW',
    appPreviewSub: 'Beautiful on every device. Built for iOS from day one.',
    signInLight: 'Sign In (Light Mode)',
    signInDark: 'Sign In (Dark Mode)',
    myCoursesLabel: 'My Courses',
    dashboardLabel: 'Student Dashboard',
    screenshotLabel4: 'Progress Report',
    screenshotLabel5: 'Create Course (Teacher)',
    screenshotLabel6: 'Flashcard Creator',
    screenshotLabel7: 'Create Quiz (Teacher)',
    screenshotSoon: 'Screenshot Coming Soon',
    compareTitle: 'HOW WE COMPARE',
    compareSub: 'See how WolfWhale stacks up against other learning management systems used in Canadian schools.',
    featureLabel: 'Feature',
    compareRows: [
      { feature: 'On-Device AI Tutor', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: '100+ Learning Tools', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'AR Experiences', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'Offline Learning', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'Gamification & XP', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'Native iOS App', wolfwhale: true, canvas: true, brightspace: true, edsby: true, moodle: false },
      { feature: 'Parent Portal', wolfwhale: true, canvas: false, brightspace: false, edsby: true, moodle: false },
      { feature: 'Canadian Data Hosting', wolfwhale: true, canvas: false, brightspace: true, edsby: true, moodle: false },
    ],
    swipeHint: 'Swipe to see all competitors \u2192',
    compareDisclaimer: 'Comparison based on publicly available feature lists as of 2026. Partial (\u2014) indicates limited or plugin-dependent support.',
    readyToSwitch: 'Ready to switch?',
    pricingTitle: 'SIMPLE PRICING',
    pricingSub: 'One plan. Everything included. No hidden fees.',
    perUser: 'Per User Account',
    perMonth: '/ month',
    minContract: 'Minimum 1-year contract',
    pricingFeatures: [
      'All 106+ features included',
      'On-device AI tutor',
      '100+ learning tools & AR',
      'Offline learning & gamification',
      'Canadian hosting (PIPEDA & FERPA)',
      'Onboarding & priority support',
    ],
    volumeDiscounts: 'Volume discounts available for school boards and districts.',
    aboutTitle: 'About WolfWhale',
    aboutText: 'Canadian edtech company building the most powerful native iOS LMS. 106+ features across 122K lines of Swift, deeply integrated with 30 Apple frameworks. Built for K-12, post-secondary, and training organizations with Canadian values \u2014 privacy, accessibility, and bilingual support.',
    canadaTitle: 'Proudly Built in Canada',
    canadaSub: 'Headquartered in Vancouver, BC. Designed, developed, and hosted entirely on Canadian soil.',
    canadaBadges: [
      { icon: Flag, label: 'Canadian Owned' },
      { icon: Shield, label: 'PIPEDA Compliant' },
      { icon: Globe, label: 'Hosted in Canada' },
      { icon: Heart, label: 'Built for Canadians' },
    ],
    trcTitle: 'Responding to the TRC Calls to Action',
    trcSub: 'Building a more equitable education system aligned with the TRC Calls to Action.',
    trcCards: [
      { icon: BookOpen, title: 'Indigenous Language Support', desc: 'Curriculum delivery in Indigenous languages (Calls #14-15)' },
      { icon: Users, title: 'Culturally Responsive Design', desc: 'Flexible content respecting diverse knowledge systems (Calls #10, #62)' },
      { icon: WifiOff, title: 'Remote & Northern Access', desc: 'Offline learning for equal access in remote communities (Calls #7-8)' },
      { icon: Heart, title: 'Partnership-Ready', desc: 'Supporting Indigenous education authorities (Calls #9-12)' },
    ],
    trcLink: 'Read the full TRC Calls to Action',
    faqTitle: 'FREQUENTLY ASKED QUESTIONS',
    faqSub: 'Everything you need to know about WolfWhale LMS.',
    faqItems: [
      { q: 'How much does WolfWhale cost?', a: '$12/user/month with a 1-year contract. All features included, no hidden fees. Volume discounts available for school boards.' },
      { q: 'Is there a free trial?', a: 'Yes \u2014 we offer a full-featured pilot program. Request a demo and we\'ll set your school up.' },
      { q: 'Where is student data stored?', a: 'Exclusively on Canadian servers. PIPEDA & FERPA compliant. Data is never sold or shared. Encrypted with TLS 1.3 and AES-256.' },
      { q: 'What about Android support?', a: 'WolfWhale is built exclusively for iOS using native SwiftUI. A web companion is planned for desktop access.' },
    ],
    contactTitle: 'GET IN TOUCH',
    contactSub: 'Interested in WolfWhale for your school or institution? Fill out the form below and we\'ll get back to you within 1-2 business days.',
    emailDirect: 'Or email us directly at',
    footerCopyright: 'WolfWhale Learning Management System. All rights reserved. Canadian-built LMS for K-12 & post-secondary schools.',
    privacy: 'Privacy',
    terms: 'Terms',
    help: 'Help',
  },
  fr: {
    lms: 'Syst\u00e8me de gestion de l\u2019apprentissage',
    nav: { features: 'Fonctionnalit\u00e9s', compare: 'Comparer', pricing: 'Tarifs', faq: 'FAQ', signIn: 'Connexion', contact: 'Contact' },
    requestDemo: 'Demander une d\u00e9mo',
    seeFeatures: 'Voir les fonctionnalit\u00e9s',
    downloadOn: 'T\u00e9l\u00e9charger sur l\u2019',
    appStore: 'App Store',
    comingSoon: 'Bient\u00f4t disponible',
    featuresTitle: '106+ FONCTIONNALIT\u00c9S',
    featuresSubtitle: '',
    features: [
      { icon: Bot, title: 'Tuteur IA sur l\u2019appareil', points: ['Propuls\u00e9 par Apple Intelligence', 'Fonctionne enti\u00e8rement sur l\u2019appareil', 'Les donn\u00e9es ne quittent jamais le t\u00e9l\u00e9phone'], color: '#00BFFF' },
      { icon: Eye, title: 'Exp\u00e9riences RA', points: ['8 cat\u00e9gories de mati\u00e8res', '4 types d\u2019exp\u00e9riences', 'Balisage par niveau scolaire'], color: '#FFD700' },
      { icon: Wrench, title: '100+ outils d\u2019apprentissage', points: ['Tableau p\u00e9riodique', 'Constructeur de fractions', 'Explorateur de g\u00e9om\u00e9trie', 'Tuteur de dactylographie', 'et plus encore'], color: '#FF6B9D' },
      { icon: WifiOff, title: 'Apprentissage hors ligne', points: ['Stockage chiffr\u00e9 AES-GCM', '8 types d\u2019entit\u00e9s en cache', 'Sync auto \u00e0 la reconnexion'], color: '#34D399' },
      { icon: GraduationCap, title: 'Centre de commande enseignant', points: ['Carnet de notes', 'Pr\u00e9sence NFC', 'D\u00e9tection de plagiat', 'Cr\u00e9ateur de rubriques', 'Live Activity'], color: '#8B5CF6' },
      { icon: Gamepad2, title: 'Ludification et XP', points: ['5 niveaux XP', '10 types de badges', 'Aquarium virtuel', 'Animal d\u2019\u00e9tude', 'Effets sonores r\u00e9tro'], color: '#FFD700' },
    ],
    appPreview: 'APER\u00c7U DE L\u2019APPLICATION',
    appPreviewSub: 'Magnifique sur chaque appareil. Con\u00e7u pour iOS d\u00e8s le premier jour.',
    signInLight: 'Connexion (mode clair)',
    signInDark: 'Connexion (mode sombre)',
    myCoursesLabel: 'Mes cours',
    dashboardLabel: 'Tableau de bord \u00e9l\u00e8ve',
    screenshotLabel4: 'Rapport de progrès',
    screenshotLabel5: 'Créer un cours (enseignant)',
    screenshotLabel6: 'Créateur de cartes mémoire',
    screenshotLabel7: 'Créer un quiz (enseignant)',
    screenshotSoon: 'Capture d\u2019\u00e9cran \u00e0 venir',
    compareTitle: 'COMMENT NOUS NOUS COMPARONS',
    compareSub: 'D\u00e9couvrez comment WolfWhale se compare aux autres syst\u00e8mes de gestion de l\u2019apprentissage utilis\u00e9s dans les \u00e9coles canadiennes.',
    featureLabel: 'Fonctionnalit\u00e9',
    compareRows: [
      { feature: 'Tuteur IA sur l\u2019appareil', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: '100+ outils d\u2019apprentissage', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'Exp\u00e9riences RA', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'Apprentissage hors ligne', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'Ludification et XP', wolfwhale: true, canvas: false, brightspace: false, edsby: false, moodle: false },
      { feature: 'App iOS native', wolfwhale: true, canvas: true, brightspace: true, edsby: true, moodle: false },
      { feature: 'Portail parents', wolfwhale: true, canvas: false, brightspace: false, edsby: true, moodle: false },
      { feature: 'H\u00e9bergement canadien', wolfwhale: true, canvas: false, brightspace: true, edsby: true, moodle: false },
    ],
    swipeHint: 'Glissez pour voir tous les concurrents \u2192',
    compareDisclaimer: 'Comparaison fond\u00e9e sur les listes de fonctionnalit\u00e9s publiques de 2026. Partiel (\u2014) indique un soutien limit\u00e9 ou d\u00e9pendant de modules.',
    readyToSwitch: 'Pr\u00eat \u00e0 changer\u00a0?',
    pricingTitle: 'TARIFICATION SIMPLE',
    pricingSub: 'Un seul forfait. Tout inclus. Aucuns frais cach\u00e9s.',
    perUser: 'Par compte utilisateur',
    perMonth: '/ mois',
    minContract: 'Contrat minimum d\u2019un an',
    pricingFeatures: [
      'Les 106+ fonctionnalit\u00e9s incluses',
      'Tuteur IA sur l\u2019appareil',
      '100+ outils et RA',
      'Apprentissage hors ligne et ludification',
      'H\u00e9bergement canadien (LPRPDE et FERPA)',
      'Int\u00e9gration et soutien prioritaire',
    ],
    volumeDiscounts: 'Rabais de volume offerts pour les commissions scolaires et les districts.',
    aboutTitle: '\u00c0 propos de WolfWhale',
    aboutText: 'Entreprise edtech canadienne qui construit le SGA iOS natif le plus puissant. 106+ fonctionnalit\u00e9s sur 122K lignes de Swift, int\u00e9gr\u00e9 en profondeur avec 30 frameworks Apple. Con\u00e7u pour la maternelle \u00e0 la 12e ann\u00e9e, le postsecondaire et les organismes de formation avec des valeurs canadiennes \u2014 vie priv\u00e9e, accessibilit\u00e9 et bilinguisme.',
    canadaTitle: 'Fi\u00e8rement construit au Canada',
    canadaSub: 'Si\u00e8ge social \u00e0 Vancouver, C.-B. Con\u00e7u, d\u00e9velopp\u00e9 et h\u00e9berg\u00e9 enti\u00e8rement en sol canadien.',
    canadaBadges: [
      { icon: Flag, label: 'Propri\u00e9t\u00e9 canadienne' },
      { icon: Shield, label: 'Conforme \u00e0 la LPRPDE' },
      { icon: Globe, label: 'H\u00e9berg\u00e9 au Canada' },
      { icon: Heart, label: 'Con\u00e7u pour les Canadiens' },
    ],
    trcTitle: 'R\u00e9pondre aux appels \u00e0 l\u2019action de la CVR',
    trcSub: 'B\u00e2tir un syst\u00e8me \u00e9ducatif plus \u00e9quitable, align\u00e9 sur les appels \u00e0 l\u2019action de la CVR.',
    trcCards: [
      { icon: BookOpen, title: 'Soutien aux langues autochtones', desc: 'Diffusion de programmes en langues autochtones (appels no 14-15)' },
      { icon: Users, title: 'Conception culturellement adapt\u00e9e', desc: 'Contenu flexible respectant les syst\u00e8mes de savoirs diversifi\u00e9s (appels no 10, 62)' },
      { icon: WifiOff, title: 'Acc\u00e8s \u00e9loign\u00e9 et nordique', desc: 'Apprentissage hors ligne pour un acc\u00e8s \u00e9quitable en r\u00e9gion \u00e9loign\u00e9e (appels no 7-8)' },
      { icon: Heart, title: 'Pr\u00eat pour les partenariats', desc: 'Soutien aux autorit\u00e9s \u00e9ducatives autochtones (appels no 9-12)' },
    ],
    trcLink: 'Lire les appels \u00e0 l\u2019action de la CVR',
    faqTitle: 'FOIRE AUX QUESTIONS',
    faqSub: 'Tout ce que vous devez savoir sur WolfWhale LMS.',
    faqItems: [
      { q: 'Combien co\u00fbte WolfWhale\u00a0?', a: '12\u00a0$/utilisateur/mois avec un contrat d\u2019un an. Toutes les fonctionnalit\u00e9s incluses, aucuns frais cach\u00e9s. Rabais de volume pour les commissions scolaires.' },
      { q: 'Y a-t-il un essai gratuit\u00a0?', a: 'Oui \u2014 nous offrons un programme pilote complet. Demandez une d\u00e9mo et nous configurerons votre \u00e9cole.' },
      { q: 'O\u00f9 sont stock\u00e9es les donn\u00e9es des \u00e9l\u00e8ves\u00a0?', a: 'Exclusivement sur des serveurs canadiens. Conforme \u00e0 la LPRPDE et au FERPA. Les donn\u00e9es ne sont jamais vendues ni partag\u00e9es. Chiffr\u00e9es avec TLS 1.3 et AES-256.' },
      { q: 'Qu\u2019en est-il du soutien Android\u00a0?', a: 'WolfWhale est construit exclusivement pour iOS avec SwiftUI natif. Un compagnon Web est pr\u00e9vu pour l\u2019acc\u00e8s sur ordinateur.' },
    ],
    contactTitle: 'NOUS JOINDRE',
    contactSub: 'Int\u00e9ress\u00e9 par WolfWhale pour votre \u00e9cole ou votre \u00e9tablissement\u00a0? Remplissez le formulaire ci-dessous et nous vous r\u00e9pondrons dans un d\u00e9lai de 1 \u00e0 2 jours ouvrables.',
    emailDirect: 'Ou \u00e9crivez-nous directement \u00e0',
    footerCopyright: 'WolfWhale Syst\u00e8me de gestion de l\u2019apprentissage. Tous droits r\u00e9serv\u00e9s. SGA canadien pour les \u00e9coles de la maternelle \u00e0 la 12e ann\u00e9e et le postsecondaire.',
    privacy: 'Confidentialit\u00e9',
    terms: 'Conditions',
    help: 'Aide',
  },
}
