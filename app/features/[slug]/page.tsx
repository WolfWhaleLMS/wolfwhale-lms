import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import { GlowingLogo } from '@/components/ui/glowing-logo'
import { ThemeToggle } from '@/components/landing/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { landingContent, type Lang } from '@/lib/landing-i18n'
import CurriculumOutcomesMap from '@/components/landing/CurriculumOutcomesMap'

/* ============================================
   Feature Detail Data
   ============================================ */

interface FeatureDetail {
  headline: string
  description: string
  sections: {
    title: string
    items: string[]
  }[]
  callout?: {
    label: string
    text: string
  }
}

const featureDetails: Record<string, Partial<Record<Lang, FeatureDetail>> & { en: FeatureDetail }> = {
  'micro-lessons': {
    en: {
      headline: 'Research-Backed Micro-Lessons',
      description: 'WolfWhale uses cognitive load theory to structure every piece of content into bite-sized micro-lessons. Instead of overwhelming students with long chapters, content is broken into sequential sections that maximize comprehension and retention.',
      sections: [
        {
          title: 'How Each Micro-Lesson Works',
          items: [
            'Hook — A 2-sentence relatable scenario that grabs attention ("Imagine you\'re counting LEGO bricks...")',
            'Lesson — 3-5 plain-language sentences explaining ONE concept',
            '"This Is / This Is Not" Comparison — Side-by-side cards showing what the concept IS (green, checkmarks) vs. common misconceptions (red, X marks)',
            'Reading Timer — Configurable countdown (default 20-30 seconds) ensuring students actually read before rushing to the quiz',
            'Gated Quiz — 5 quiz questions per section, locked until the reading timer completes',
          ],
        },
        {
          title: 'Where Micro-Lessons Appear',
          items: [
            'All 288 textbook chapters (72 textbooks across every subject)',
            'Course lesson content created by teachers',
            'Quiz wrong-answer explanations (mini micro-lesson cards for each mistake)',
            'AI Tutor responses (structured as hook, lesson, comparison)',
            'Learning recommendation previews',
            'Flashcard "Explain" button for deeper understanding',
          ],
        },
        {
          title: 'Why It Works',
          items: [
            'Based on cognitive load theory — students process one concept at a time',
            'Reading timer prevents skipping straight to quizzes',
            'Timer completion is persisted so students don\'t re-wait on previously read sections',
            'Each textbook chapter contains 3-5 micro-lessons, completed sequentially',
            '"This Is / This Is Not" format directly addresses common misconceptions',
            'Students retain more because they engage with content before being tested',
          ],
        },
      ],
      callout: {
        label: 'Industry First',
        text: 'WolfWhale is the only school platform that structures ALL content using cognitive load theory. This isn\'t a feature bolted on — it\'s the foundation of how every piece of content is delivered.',
      },
    },
    fr: {
      headline: 'Micro-le\u00e7ons bas\u00e9es sur la recherche',
      description: 'WolfWhale utilise la theorie de la charge cognitive pour structurer chaque contenu en micro-lecons. Au lieu de submerger les eleves avec de longs chapitres, le contenu est divise en sections sequentielles qui maximisent la comprehension.',
      sections: [
        {
          title: 'Comment fonctionne chaque micro-lecon',
          items: [
            'Accroche — Un scenario de 2 phrases qui capte l\'attention',
            'Lecon — 3-5 phrases simples expliquant UN seul concept',
            'Comparaison "C\'est / Ce n\'est pas" — Cartes cote a cote montrant le concept correct vs. les idees fausses',
            'Minuterie de lecture — Compte a rebours configurable pour s\'assurer que les eleves lisent',
            'Quiz verrouille — 5 questions par section, deverrouillees apres la minuterie',
          ],
        },
        {
          title: 'Ou apparaissent les micro-lecons',
          items: [
            'Les 288 chapitres de manuels (72 manuels)',
            'Le contenu des cours cree par les enseignants',
            'Les explications de mauvaises reponses aux quiz',
            'Les reponses du tuteur IA',
            'Les recommandations d\'apprentissage',
            'Le bouton "Expliquer" des cartes memoire',
          ],
        },
        {
          title: 'Pourquoi ca fonctionne',
          items: [
            'Base sur la theorie de la charge cognitive',
            'La minuterie empeche de sauter directement aux quiz',
            'Chaque chapitre contient 3-5 micro-lecons sequentielles',
            'Le format "C\'est / Ce n\'est pas" cible directement les idees fausses',
          ],
        },
      ],
      callout: {
        label: 'Premiere mondiale',
        text: 'WolfWhale est le seul SGA qui structure TOUT le contenu selon la theorie de la charge cognitive.',
      },
    },
  },
  'ai-tools': {
    en: {
      headline: '6 AI-Powered Tools — All On-Device',
      description: 'WolfWhale includes 6 AI tools that run entirely on-device using Apple Intelligence (Apple FoundationModels on iOS 26+). Student data never leaves the phone. Zero API costs for schools.',
      sections: [
        {
          title: 'The 6 AI Tools',
          items: [
            'AI Tutor — Chat-based tutoring with full curriculum context. Prerequisite-aware. Responses are structured as micro-lessons (hook, lesson, comparison). Knows what students have learned and what comes next.',
            'Micro-Lesson Converter — Industry first. Teachers paste any text (lesson notes, textbook excerpts, Wikipedia articles, handouts), select a grade level, and tap "Convert." AI generates 1-5 structured micro-lessons with hooks, lesson text, "This Is / This Is Not" comparisons, and 5 quiz questions each.',
            'AI Search — Natural language search across all app content. Students type questions in plain language and get relevant results from courses, textbooks, flashcards, and assignments.',
            'Lesson Plan Builder — AI-generated, curriculum-aligned lesson plans. Teachers select subject, grade, and outcomes, and get complete lesson plans with activities, assessments, and materials.',
            'Report Card Comments — AI-generated student comments based on grade data, attendance, and engagement metrics. Teachers can customize, edit, and approve before publishing.',
            'Content Moderation — Automatic inappropriate content filtering across messaging, submissions, and user-generated content.',
          ],
        },
        {
          title: 'Why On-Device AI Matters',
          items: [
            'Student data never leaves the device — full COPPA, FERPA, and PIPEDA compliance',
            'No API costs for schools — AI runs on Apple silicon, not cloud servers',
            'Works offline — AI features available without internet connection',
            'No data harvesting — conversations aren\'t sent to third-party AI companies',
            'Instant responses — no network latency, AI runs locally',
            'Requires iOS 26+ with Apple FoundationModels support',
          ],
        },
        {
          title: 'Teacher Micro-Lesson Converter Details',
          items: [
            'Auto-Convert Mode: Paste any text, select grade level, tap Convert. Preview exactly what students will see.',
            'Build from Scratch Mode: Structured form with Title, Hook, Lesson Text, "This Is" items, "This Is Not" items, and Quiz questions.',
            'Live preview shows the exact student-facing card as you build',
            'Saved micro-lessons are stored in a searchable library',
            'Assign to any course with one tap',
            'Edit anything before saving — full teacher control over AI output',
          ],
        },
      ],
      callout: {
        label: 'Only on WolfWhale',
        text: 'No other school platform offers AI-powered micro-lesson conversion. Teachers paste any text and get structured, research-backed micro-lessons in seconds.',
      },
    },
    fr: {
      headline: '6 outils IA — entierement sur l\'appareil',
      description: 'WolfWhale inclut 6 outils IA fonctionnant entierement sur l\'appareil via Apple Intelligence. Les donnees des eleves ne quittent jamais le telephone. Aucun cout d\'API.',
      sections: [
        {
          title: 'Les 6 outils IA',
          items: [
            'Tuteur IA — Tutorat par chat avec contexte du programme',
            'Convertisseur de micro-lecons — Premiere mondiale. Collez du texte, obtenez des micro-lecons',
            'Recherche IA — Recherche en langage naturel dans tout le contenu',
            'Generateur de plans de cours — Plans alignes sur le programme',
            'Commentaires de bulletins — Generes par l\'IA a partir des donnees',
            'Moderation de contenu — Filtrage automatique du contenu inapproprie',
          ],
        },
        {
          title: 'Pourquoi l\'IA sur l\'appareil',
          items: [
            'Les donnees ne quittent jamais l\'appareil',
            'Aucun cout d\'API pour les ecoles',
            'Fonctionne hors ligne',
            'Pas de collecte de donnees par des tiers',
            'Reponses instantanees sans latence reseau',
          ],
        },
      ],
      callout: {
        label: 'Exclusif a WolfWhale',
        text: 'Aucun autre SGA n\'offre la conversion IA de micro-lecons.',
      },
    },
  },
  'textbooks': {
    en: {
      headline: '72 Original Textbooks — WolfWhale Books',
      description: 'WolfWhale Books is our own publishing brand — a division of WolfWhale EdTech. 72 original textbooks with 288+ chapters, fully integrated with micro-lessons, flashcards, and interactive activities. No external links, no licensing fees — everything is built in.',
      sections: [
        {
          title: 'Replacing 19 Legacy Textbooks',
          items: [
            '19 textbooks from Nelson, McGraw-Hill Ryerson, and Glencoe have been fully replaced with WolfWhale originals',
            'No more annual licensing fees or publisher dependencies',
            'Content updated instantly — no waiting for new print editions',
            'Every replacement covers the same curriculum outcomes with improved pedagogy',
            'Schools save thousands per year on textbook costs',
          ],
        },
        {
          title: 'Full Saskatchewan K-12 Coverage',
          items: [
            'Math K-9, Math 10/20/30, Foundations Math 20',
            'Science K-10, Physics 20/30, Biology 30, Chemistry 30',
            'ELA K-9, ELA 20/30',
            'Social Studies K-9',
            'Health 1-9',
            'Arts Education 1/4/7',
            'Physical Education 1/4/7/9',
            'Career Education 6-9',
            'French 1',
          ],
        },
        {
          title: 'Cognitive Load Theory Format',
          items: [
            'Every chapter uses the micro-lesson format: Hook, Lesson, This Is / This Is Not, Reading Timer, Gated Quiz',
            '3-5 micro-lessons per chapter — students absorb one concept at a time',
            'Reading timer ensures comprehension before quizzes unlock',
            'Written in authoritative 1950s textbook prose with modern school platform enhancements',
            'Key terms, Indigenous connections, quizzes, and activities woven into every chapter',
          ],
        },
        {
          title: 'Content Architecture',
          items: [
            '70% pan-Canadian core (WNCP) — works across provinces',
            '30% Saskatchewan-specific content — local examples, Treaty education',
            'Indigenous connections woven throughout every subject',
            '682 Saskatchewan curriculum outcomes mapped to chapters',
            'Content blocks: text, images, callouts, quizzes, activities, code blocks, micro-lessons',
          ],
        },
        {
          title: 'Digital-First Features',
          items: [
            'Interactive content blocks — not static PDFs',
            'Spaced repetition flashcards for every chapter with multiple study modes',
            '"Explain" button on flashcards generates micro-lesson explanations via on-device AI',
            'Reading progress tracking synced across devices via Supabase',
            'Key terms sidebar for each chapter',
            'Available offline — download textbooks for learning anywhere',
          ],
        },
        {
          title: '6 Interactive Activity Types',
          items: [
            'Matching — Drag items to pair with correct matches',
            'Sorting — Drag items into 2-4 labeled category buckets',
            'Fill in the Blank — Type answers into inline blanks',
            'Labeling — Tap hotspots on diagrams to assign labels',
            'Sequencing — Drag items into correct order',
            'Drawing — PencilKit canvas with prompts',
          ],
        },
        {
          title: 'Teacher Integration',
          items: [
            'Insert textbook chapters directly into course lessons',
            'Assign specific chapters as required reading with progress tracking',
            'Track which students have completed each chapter',
            'Use the AI Micro-Lesson Converter to create supplementary content from any text',
            'Align textbook content with specific curriculum outcomes in the gradebook',
          ],
        },
      ],
      callout: {
        label: 'Only on WolfWhale',
        text: 'WolfWhale is the only school platform with its own original textbook library. 72 textbooks, 288+ chapters, all built on cognitive load theory — not links to third-party publishers. Teachers and students get everything in one app, fully integrated with courses, grades, and AI tools.',
      },
    },
    fr: {
      headline: '72 manuels originaux — WolfWhale Books',
      description: 'WolfWhale Books est notre propre marque editoriale. 72 manuels originaux avec 288+ chapitres, integres avec micro-lecons, cartes memoire et activites interactives. Aucun lien externe, aucun frais de licence.',
      sections: [
        {
          title: 'Remplacement de 19 manuels traditionnels',
          items: [
            '19 manuels de Nelson, McGraw-Hill Ryerson et Glencoe remplaces par des originaux WolfWhale',
            'Plus de frais de licence annuels',
            'Contenu mis a jour instantanement — pas besoin d\'attendre de nouvelles editions imprimees',
            'Les ecoles economisent des milliers de dollars par annee',
          ],
        },
        {
          title: 'Couverture complete K-12 de la Saskatchewan',
          items: [
            'Math K-12 (y compris Fondements des math 20)',
            'Sciences K-10, Physique 20/30, Bio 30, Chimie 30',
            'Francais K-9, Francais 20/30',
            'Etudes sociales K-9, Sante 1-9, Arts 1/4/7, Ed. physique 1/4/7/9',
            'Ed. aux carrieres 6-9, Francais 1',
          ],
        },
        {
          title: 'Format base sur la theorie de la charge cognitive',
          items: [
            'Chaque chapitre utilise le format micro-lecon : Accroche, Lecon, C\'est / Ce n\'est pas, Minuterie, Quiz',
            '3-5 micro-lecons par chapitre',
            'Les eleves absorbent un concept a la fois',
          ],
        },
        {
          title: 'Fonctionnalites numeriques',
          items: [
            'Blocs de contenu interactifs — pas de PDF statiques',
            'Cartes memoire a repetition espacee pour chaque chapitre',
            'Suivi de progression de lecture synchronise entre appareils',
            'Disponible hors ligne',
          ],
        },
        {
          title: '6 types d\'activites interactives',
          items: [
            'Appariement, Tri, Texte a trous, Etiquetage, Sequencage, Dessin',
          ],
        },
        {
          title: 'Integration enseignant',
          items: [
            'Inserez des chapitres directement dans les lecons de cours',
            'Assignez des chapitres comme lecture obligatoire',
            'Suivez la progression de lecture des eleves',
            'Utilisez le convertisseur IA pour creer du contenu supplementaire',
          ],
        },
      ],
      callout: {
        label: 'Exclusif a WolfWhale',
        text: 'WolfWhale est le seul SGA avec sa propre bibliotheque de manuels originaux. 72 manuels, 288+ chapitres, tous bases sur la theorie de la charge cognitive.',
      },
    },
  },
  'offline': {
    en: {
      headline: 'Full Offline Learning',
      description: 'WolfWhale works without internet. Students in remote communities, on buses, or at home without Wi-Fi can access their full course load, textbooks, and flashcards offline.',
      sections: [
        {
          title: 'What Works Offline',
          items: [
            'Full course content and lesson materials',
            'All 72 textbooks and 288+ chapters',
            'Flashcard decks with all study modes',
            'Assignment viewing and draft submissions',
            'AI Tutor (on-device, no network needed)',
            'AI Search across cached content',
            'Quiz practice and review',
            'Reading progress tracking (syncs when reconnected)',
          ],
        },
        {
          title: 'Security & Sync',
          items: [
            'AES-GCM encrypted local storage — data is secure on device',
            'Automatic sync when internet connection is restored',
            'Conflict resolution for offline edits',
            'Selective caching — students choose what to download',
            'Background sync to keep content current',
          ],
        },
        {
          title: 'Why This Matters',
          items: [
            'Rural and remote Canadian communities often have unreliable internet',
            'Supports TRC Call to Action #6 — eliminating education gaps',
            'Students on buses or in areas without Wi-Fi can study anywhere',
            'No excuses for missed learning — content is always available',
            'Critical for Indigenous communities in northern Canada',
          ],
        },
      ],
    },
    fr: {
      headline: 'Apprentissage hors ligne complet',
      description: 'WolfWhale fonctionne sans internet. Les eleves des communautes eloignees peuvent acceder a tout leur contenu hors ligne.',
      sections: [
        {
          title: 'Ce qui fonctionne hors ligne',
          items: [
            'Tout le contenu des cours',
            'Les 72 manuels et 288+ chapitres',
            'Les cartes memoire',
            'Le tuteur IA (sur l\'appareil)',
            'Le suivi de progression de lecture',
          ],
        },
        {
          title: 'Securite et synchronisation',
          items: [
            'Stockage local chiffre AES-GCM',
            'Synchronisation automatique a la reconnexion',
            'Resolution de conflits pour les modifications hors ligne',
          ],
        },
      ],
    },
  },
  'teacher-tools': {
    en: {
      headline: '12+ Specialized Teacher Tools',
      description: 'WolfWhale gives teachers a complete hub of purpose-built tools — from AI-powered lesson planning to gradebooks, attendance tracking, and report card generation. Every tool is designed to save time, reduce admin work, and improve teaching outcomes.',
      sections: [
        {
          title: 'Daily Essentials',
          items: [
            'Attendance Tracking — Mark daily or period-based attendance with one tap. Automatic parent alerts for absences and tardies. Pattern reporting for administrators.',
            'Gradebook — Full-featured gradebook with category weighting, grade curves, standards-based grading, CSV import/export, and offline support.',
            'Report Cards — Generate complete report cards with AI-assisted comments based on grades, attendance, and engagement data. Customize and approve before publishing.',
            'Lesson Plan Builder — AI-assisted, curriculum-aligned lesson plans. Select subject, grade, and outcomes to generate complete plans.',
            'Classroom Tools — Projection timer for activities, random student picker for fair participation.',
            'Micro-Lesson Converter (NEW) — AI auto-conversion of any text into structured micro-lessons. Industry first.',
          ],
        },
        {
          title: 'Weekly Planning',
          items: [
            'Rubric Builder — Create, manage, and share rubrics across courses. Attach to assignments for consistent grading.',
            'Observation Notes — Quick student observation capture during class. Tag by student, date, and category.',
            'Seating Chart — Drag-and-drop student placement with PDF export for printing.',
            'Weekly Planner — Week-at-a-glance calendar editor. Plan lessons, activities, and assessments.',
          ],
        },
        {
          title: 'Engagement & Compliance',
          items: [
            'Parent Communication — Email templates and parent update tools. Keep families informed about student progress.',
            'Curriculum Tracker — Track which standards have been covered. PDF export for administrators and accreditation.',
          ],
        },
        {
          title: 'Additional Capabilities',
          items: [
            'Report card generation with customizable templates and AI-assisted comments',
            'Assignment creation with templates and rubric attachment',
            'Peer review setup for student-to-student feedback',
            'Student insights dashboard with engagement and attendance metrics',
            'Attendance pattern reporting and absence trend analysis',
            'Parent-teacher conference scheduling with in-app booking',
            'Standards mastery view across entire class',
            'Grade and attendance data export for SIS compliance',
          ],
        },
      ],
    },
    fr: {
      headline: '11 outils enseignant specialises',
      description: 'WolfWhale offre aux enseignants un centre complet d\'outils dedies — de la planification IA au carnet de notes hors ligne.',
      sections: [
        {
          title: 'Essentiels quotidiens',
          items: [
            'Commentaires de bulletins IA',
            'Generateur de plans de cours',
            'Carnet de notes hors ligne',
            'Outils de classe (minuterie, selection aleatoire)',
            'Convertisseur de micro-lecons (NOUVEAU)',
          ],
        },
        {
          title: 'Planification hebdomadaire',
          items: [
            'Createur de rubriques',
            'Notes d\'observation',
            'Plan de classe avec export PDF',
            'Planificateur hebdomadaire',
          ],
        },
        {
          title: 'Engagement et conformite',
          items: [
            'Communication parentale',
            'Suivi du programme avec export PDF',
          ],
        },
      ],
    },
  },
  'gamification': {
    en: {
      headline: 'Gamification & Engagement System',
      description: 'WolfWhale uses meaningful game mechanics tied to real learning outcomes. Students earn XP, maintain streaks, collect badges, compete on leaderboards, and care for virtual pets — all by doing their schoolwork.',
      sections: [
        {
          title: 'XP & Progression',
          items: [
            'Earn XP for completing assignments, quizzes, lessons, and mastering skills',
            'Daily streak tracking rewards consistent engagement',
            'Class-wide leaderboards for friendly competition',
            'XP displayed on student dashboard and profile',
          ],
        },
        {
          title: 'Badges & Achievements',
          items: [
            '10+ badge types: First Assignment, Quiz Master, Perfect Score, 7-Day Streak, Course Complete, Early Bird, Social Learner, 30-Day Streak, and more',
            '4 rarity tiers: Common, Rare, Epic, Legendary',
            'Badges displayed on student profile and achievement showcase',
            'Unlock progression — earlier badges unlock harder ones',
          ],
        },
        {
          title: 'Study Pet',
          items: [
            'Tamagotchi-style virtual companion that students care for through learning',
            'Pet grows and evolves as students complete work',
            'Fish collection system — discover new species by learning',
            'Pet needs attention — encourages daily engagement',
            'Displayed on student dashboard and iOS widget',
          ],
        },
        {
          title: 'Educational Mini-Games',
          items: [
            'Chess — classic strategy game',
            'Kahoot integration — interactive quiz competitions',
            'French vocabulary quiz',
            'Spelling bee challenge',
            'Grammar quest',
            'Math quiz with difficulty levels',
            'Typing tutor with WPM tracking',
            'Word builder game',
          ],
        },
      ],
    },
    fr: {
      headline: 'Systeme de ludification et d\'engagement',
      description: 'WolfWhale utilise des mecaniques de jeu significatives liees aux resultats d\'apprentissage reels.',
      sections: [
        {
          title: 'XP et progression',
          items: [
            'Gagnez des XP pour les devoirs, quiz, lecons et competences',
            'Suivi des series quotidiennes',
            'Classements par classe',
          ],
        },
        {
          title: 'Badges et realisations',
          items: [
            '10+ types de badges avec 4 niveaux de rarete',
            'Commun, Rare, Epique, Legendaire',
          ],
        },
        {
          title: 'Compagnon d\'etude',
          items: [
            'Compagnon virtuel de style Tamagotchi',
            'Collection de poissons',
            'Grandit avec l\'apprentissage',
          ],
        },
        {
          title: 'Mini-jeux educatifs',
          items: [
            'Echecs, Kahoot, quiz vocabulaire, abeille d\'orthographe, et plus',
          ],
        },
      ],
    },
  },
  'liquid-glass': {
    en: {
      headline: 'Apple Liquid Glass UI',
      description: 'WolfWhale is built with Apple\'s latest Liquid Glass design language — translucent materials, depth effects, and fluid animations that make the app feel alive.',
      sections: [
        {
          title: 'Native iOS Design',
          items: [
            'Built with SwiftUI and Apple\'s Liquid Glass SDK',
            'Translucent materials that adapt to content behind them',
            'Depth-of-field effects and fluid animations',
            'Designed to match iOS 26 system aesthetics',
          ],
        },
        {
          title: 'Why Design Matters in Education',
          items: [
            'Students engage more with apps that feel premium',
            'Native iOS performance — no web wrapper lag',
            'Accessibility built into every component',
            'Dark mode support throughout the entire app',
          ],
        },
      ],
    },
  },
  'connected': {
    en: {
      headline: 'Everyone Connected in One App',
      description: 'WolfWhale is a complete school platform — not just a learning tool. Students, teachers, parents, and administrators all use the same app with purpose-built dashboards for each role. Built-in SIS features mean no separate portals, no switching between apps, and no third-party integrations required.',
      sections: [
        {
          title: 'Four User Roles',
          items: [
            'Student — courses, grades, textbooks, flashcards, gamification, attendance history',
            'Teacher — gradebook, attendance tracking, report cards, lesson planner, micro-lesson converter, rubrics, seating chart',
            'Parent — track child\'s progress, view grades and report cards, receive alerts, schedule parent-teacher conferences',
            'Admin — school-wide dashboard, enrollment management, user management, analytics, compliance reporting',
          ],
        },
        {
          title: 'Built-In SIS Features',
          items: [
            'Attendance Tracking — Daily and period-based attendance with absence alerts sent automatically to parents',
            'Gradebook — Full-featured gradebook with category weighting, grade curves, and standards-based grading',
            'Report Cards — Generate, customize, and publish report cards with AI-assisted comments',
            'Parent Alerts — Automatic notifications for absences, missing assignments, grade changes, and announcements',
            'Enrollment Management — Student enrollment, class rostering, and schedule management for administrators',
            'Conference Scheduling — Parents book parent-teacher conferences directly in the app with calendar integration',
          ],
        },
        {
          title: 'Real-Time Communication',
          items: [
            'Announcements from teachers and admins pushed to all connected users',
            'Assignment notifications and due date reminders',
            'Absence and tardy alerts sent to parents in real time',
            'Progress updates and grade change notifications for parents',
            'All in one app — no email chains, no separate SIS portals, no third-party add-ons',
          ],
        },
      ],
      callout: {
        label: 'Complete School Platform',
        text: 'Most schools juggle an LMS, a separate SIS, a parent portal, and a messaging tool. WolfWhale replaces all of them. Attendance, gradebook, report cards, enrollment, parent communication, and learning — all in one native iOS app.',
      },
    },
  },
  'land-based': {
    en: {
      headline: 'Land-Based Lesson Library',
      description: 'Pre-built Indigenous lessons aligned to TRC Call to Action #62. Culturally responsive content built in partnership with Indigenous communities.',
      sections: [
        {
          title: 'Indigenous Education',
          items: [
            'Pre-built lessons on land-based learning, treaty education, and Indigenous history',
            'Aligned to TRC Calls to Action #62 (curriculum), #14-15 (language)',
            'Content developed with input from Indigenous educators',
            'Available in Plains Cree (Y-dialect) and Woods Cree (Th-dialect)',
          ],
        },
        {
          title: 'Culturally Responsive Design',
          items: [
            'Flexible content framework respecting diverse knowledge systems',
            'Offline access for remote and northern communities',
            'Partnership-ready for Indigenous education authorities',
            'Supports Indigenous language delivery across the curriculum',
          ],
        },
      ],
    },
  },
}



/* ============================================
   Static Params for SSG
   ============================================ */
export function generateStaticParams() {
  return Object.keys(featureDetails).map((slug) => ({ slug }))
}

/* ============================================
   Page Component
   ============================================ */

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string }>
}

export default async function FeatureDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const sp = await searchParams
  const validLangs: Lang[] = ['en', 'fr']
  const lang: Lang = validLangs.includes(sp.lang as Lang) ? (sp.lang as Lang) : 'en'
  const lp = lang !== 'en' ? `?lang=${lang}` : ''

  const detail = featureDetails[slug]
  if (!detail) notFound()

  const content = detail[lang] || detail.en
  const t = landingContent[lang]

  // Find the matching feature card for color/icon
  const featureCard = t.features.find((f) => f.slug === slug)
  const color = featureCard?.color || '#0891B2'

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-white dark:bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-xl bg-white dark:bg-black border-b border-gray-200 dark:border-white/5">
        <nav className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href={`/${lp}`} className="inline-flex flex-col group shrink-0 min-w-0">
            <span className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#0891B2] transition-colors duration-100 tracking-normal uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
              WolfWhale
            </span>
            <span className="hidden sm:block text-xs text-gray-500 dark:text-white/60 tracking-[0.15em] uppercase font-medium -mt-0.5">
              {t.lms}
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link href={`/${lp}#features`} className="text-sm text-gray-600 dark:text-white/70 hover:text-[#0891B2] transition-colors duration-100 font-medium hidden sm:inline">
              {t.nav.features}
            </Link>
            <LanguageToggle lang={lang} />
            <ThemeToggle />
            <a
              href={`/${lp}#contact`}
              className="inline-flex items-center h-9 sm:h-10 px-2.5 sm:px-4 rounded-lg sm:rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-[11px] sm:text-sm font-semibold transition-all duration-100 hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              {t.nav.contact}
            </a>
          </div>
        </nav>
      </header>
      <div className="h-[50px] sm:h-[56px]" />

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-16">
        {/* Back link */}
        <Link
          href={`/${lp}#features`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-white/50 hover:text-[#0891B2] transition-colors duration-100 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {lang === 'fr' ? 'Retour aux fonctionnalites' : 'Back to Features'}
        </Link>

        {/* Hero */}
        <div className="space-y-4 mb-12">
          {content.callout && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase" style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}>
              <Sparkles className="h-3 w-3" />
              {content.callout.label}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            {content.headline}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl">
            {content.description}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {content.sections.map(({ title, items }) => (
            <div key={title}>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4" style={{ borderLeft: `3px solid ${color}`, paddingLeft: '12px' }}>
                {title}
              </h2>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm sm:text-base text-gray-600 dark:text-white/70 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Callout box */}
        {content.callout && (
          <div className="mt-12 rounded-2xl p-6 sm:p-8 border" style={{ backgroundColor: `${color}08`, borderColor: `${color}20` }}>
            <p className="text-sm sm:text-base text-gray-700 dark:text-white/80 leading-relaxed">
              {content.callout.text}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-start gap-4">
          <a
            href={`/${lp}#contact`}
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold transition-all duration-100 hover:bg-gray-800 dark:hover:bg-gray-100"
          >
            {t.requestDemo}
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link
            href={`/info${lp}`}
            className="inline-flex items-center gap-1.5 h-12 px-6 text-sm text-gray-500 dark:text-white/50 hover:text-[#0891B2] transition-colors duration-100 font-medium"
          >
            {lang === 'fr' ? 'Voir toutes les fonctionnalites' : 'See all features'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 pb-8 mt-12">
        <div className="max-w-4xl mx-auto">
          <div className="h-px bg-gray-200 dark:bg-white/10 mb-6" />
          <p className="text-xs text-gray-400 dark:text-white/40">
            &copy; {new Date().getFullYear()} {t.footerCopyright}
          </p>
        </div>
      </footer>

      <style>{`
        html { scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth; }
        html::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
