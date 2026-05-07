// =============================================================================
// SINGLE SOURCE OF TRUTH — WolfWhale Product Data
// =============================================================================
// Update features, pricing, or stats here and EVERY page on the site picks it up.
// Used by: landing page, info page, SEO city/division pages, feature detail pages.
// =============================================================================

export const PRODUCT = {
  name: 'WolfWhale',
  tagline: 'Improving the most important tool in education',
  description:
    'The only LMS built from the ground up around cognitive load theory, on-device AI, and original textbooks — designed for how students actually learn.',
  url: 'https://wolfwhale.ca',
  email: 'info@wolfwhale.ca',
  phone: '+1 (306) 981-5926',
  appStoreId: '6759676805',

  // Origin
  origin: {
    country: 'Canada',
    territory: 'Treaty 6',
    ownership: 'First Nations owned',
    province: 'Saskatchewan',
    city: 'Saskatoon',
  },

  // Pricing — update once, every page updates
  pricing: {
    perStudent: 12,
    period: 'year',
    currency: 'CAD',
    includes: [
      'All 72 textbooks and AI tools',
      'Unlimited teachers, parents & admins',
      'No per-feature upsells',
      'Volume discounts for districts',
    ],
  },

  // Stats — update once, every page updates
  stats: {
    textbooks: 72,
    chapters: '288+',
    curriculumOutcomes: 682,
    userRoles: 5,
    teacherTools: 11,
    aiTools: 6,
    provinces: 13,
  },

  // Core differentiators — what makes WolfWhale different
  differentiators: [
    'Lessons designed around cognitive load theory',
    'On-device AI — student data never leaves the device',
    '72 original textbooks (WolfWhale Books)',
    'Full Saskatchewan K-12 curriculum coverage',
    'Built natively for iOS',
    '$12/student/year — all features included',
    '100% designed and built in Canada',
    'First Nations owned, Treaty 6 territory',
  ],

  // Feature list — the canonical set. Add/remove here, all pages update.
  features: {
    cognitiveLoadLessons: {
      title: 'Cognitive Load Theory Lessons',
      short: 'Research-backed lesson format: Hook → Lesson → Compare → Quiz',
      description:
        'Every lesson follows a structure based on cognitive load theory — the science of how students absorb information. Content is broken into focused sections with reading timers and gated quizzes that unlock after comprehension.',
      keywords: ['cognitive load theory', 'micro-lessons', 'research-backed learning', 'gated quizzes'],
    },
    onDeviceAI: {
      title: 'On-Device AI (6 Tools)',
      short: 'AI Tutor, Lesson Converter, Plan Builder — data never leaves the device',
      description:
        'Six AI tools powered by Apple Intelligence that run entirely on-device. AI Tutor with curriculum awareness, Micro-Lesson Converter (industry first), Lesson Plan Builder, Report Card Comments, AI Search, and content recommendations.',
      keywords: ['on-device AI', 'AI tutor', 'Apple Intelligence', 'private AI', 'lesson converter'],
    },
    textbooks: {
      title: '72 Original Textbooks',
      short: '288+ chapters covering full SK K-12 curriculum with interactive content',
      description:
        'WolfWhale Books — our own publisher brand. 72 textbooks written to achieve every Saskatchewan learning outcome. 288+ chapters with flashcards, quizzes, activities, and Indigenous connections woven throughout.',
      keywords: ['digital textbooks', 'Saskatchewan curriculum', 'K-12 textbooks', 'interactive textbooks'],
    },
    offlineLearning: {
      title: 'Offline Learning',
      short: 'AES-GCM encrypted storage with auto sync on reconnect',
      description:
        'Full course and textbook access offline with military-grade AES-GCM encryption. Perfect for rural Saskatchewan schools with unreliable internet. Auto-syncs when connection returns.',
      keywords: ['offline learning', 'rural schools', 'encrypted storage', 'offline LMS'],
    },
    teacherTools: {
      title: '11 Teacher Tools',
      short: 'Lesson Converter, Plan Builder, Gradebook, Rubrics, Seating Chart & more',
      description:
        'A complete toolkit: AI Lesson Converter, Lesson Plan Builder, Gradebook, Rubric Builder, Seating Chart, Weekly Planner, Report Card Comments, Assignment Builder, Quiz Builder, Attendance, and Messaging.',
      keywords: ['teacher tools', 'lesson plan builder', 'gradebook', 'rubric builder'],
    },
    gamification: {
      title: 'Gamification & XP',
      short: 'XP system, streaks, leaderboards, study pets, and badge rarities',
      description:
        'Students earn XP for completing lessons, quizzes, and flashcards. Streaks encourage daily learning. Leaderboards foster healthy competition. Study Pet companions (fish collection) reward consistency. Badges range from Common to Legendary.',
      keywords: ['gamification', 'XP system', 'student engagement', 'leaderboards', 'study pets'],
    },
    constellationCurriculum: {
      title: 'Constellation Curriculum Map',
      short: 'Visual skill tree mapping 682 Saskatchewan curriculum outcomes',
      description:
        'An interactive star map where each star represents a curriculum outcome. Students see their learning progress as a constellation that lights up as they master skills. Cross-subject connections become visible.',
      keywords: ['curriculum mapping', 'skill tree', 'visual learning progress', 'Saskatchewan outcomes'],
    },
    fiveRoles: {
      title: '5 User Roles',
      short: 'Student, Teacher, Parent, School Admin, Super Admin — each with a purpose-built dashboard',
      description:
        'Every stakeholder gets a tailored experience. Students see courses and XP. Teachers get 11 tools. Parents monitor progress. School Admins manage their school. Super Admins control the multi-tenant platform.',
      keywords: ['user roles', 'parent portal', 'admin dashboard', 'multi-tenant LMS'],
    },
    indigenousEducation: {
      title: 'Indigenous Education & TRC',
      short: 'Supporting Truth & Reconciliation Calls to Action 6-12',
      description:
        'Indigenous connections are woven throughout all 72 textbooks. Culturally responsive curriculum mapping supports First Nations, Métis, and Inuit perspectives. Built on Treaty 6 territory by a First Nations-owned company.',
      keywords: ['Indigenous education', 'TRC', 'Truth and Reconciliation', 'First Nations', 'culturally responsive'],
    },
    privacy: {
      title: 'Privacy & Security',
      short: 'On-device AI, AES-GCM encryption, row-level security, PIPEDA & FOIP compliant',
      description:
        'Student data never leaves the device for AI processing. All offline data is AES-GCM encrypted. Supabase row-level security on every table. Fully compliant with PIPEDA, FOIP, and LAFOIP.',
      keywords: ['PIPEDA compliant', 'FOIP compliant', 'student data privacy', 'encrypted LMS', 'Canadian data sovereignty'],
    },
  },

  // Competitors — for comparison pages
  competitors: {
    canvas: { name: 'Canvas', weakness: 'US-hosted, no Canadian data sovereignty, no cognitive load theory, no original textbooks' },
    googleClassroom: { name: 'Google Classroom', weakness: 'Not a full LMS, no textbooks, no offline, student data goes to Google' },
    moodle: { name: 'Moodle', weakness: 'Requires self-hosting, outdated UX, no built-in AI, no mobile app' },
    brightspace: { name: 'Brightspace (D2L)', weakness: 'Enterprise pricing, complex setup, no cognitive load theory format' },
    edsby: { name: 'Edsby', weakness: 'No AI tools, no original textbooks, no gamification, no offline mode' },
    schoology: { name: 'Schoology', weakness: 'Owned by PowerSchool (US), no Canadian focus, no cognitive load theory' },
  },
} as const

// Helper to get feature list as array
export function getFeatureList() {
  return Object.values(PRODUCT.features)
}

// Helper to get all feature keywords for SEO
export function getAllKeywords(): string[] {
  return Object.values(PRODUCT.features).flatMap((f) => f.keywords)
}
