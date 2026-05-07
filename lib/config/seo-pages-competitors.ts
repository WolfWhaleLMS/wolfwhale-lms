import type { PageData } from './seo-pages'

// ---------------------------------------------------------------------------
// Competitor SEO landing pages – 50 pages targeting competitor-related searches
// ---------------------------------------------------------------------------

export const COMPETITOR_PAGES: Record<string, PageData> = {
  // ==========================================================================
  // CANVAS (8 pages)
  // ==========================================================================

  'canvas-vs-wolfwhale': {
    competitor: 'Canvas',
    title: 'Canvas vs WolfWhale LMS — Canadian K-12 LMS Comparison',
    h1: 'Canvas vs WolfWhale: Which LMS Is Better for Canadian K-12?',
    description: 'Compare Canvas and WolfWhale LMS side by side. See why Canadian schools are choosing WolfWhale for K-12 learning.',
    keywords: ['canvas vs wolfwhale', 'canvas lms comparison', 'canvas alternative canada', 'k-12 lms comparison', 'canadian lms'],
    heroText: 'Canvas was built for US universities. WolfWhale was built for Canadian K-12 classrooms. With 72 curriculum-aligned textbooks, on-device AI, and offline learning at $12/student/year, WolfWhale delivers everything Canvas cannot.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gamification & XP', 'Canadian Data Sovereignty', 'FERPA & PIPEDA Compliant', 'Gradebook & Analytics'],
    whyExtra: 'Canvas, owned by Instructure (a US private equity-backed company), stores student data on American servers and was designed primarily for higher education. It offers no built-in textbooks, no offline mode, and no cognitive load theory-based lesson design. WolfWhale is First Nations owned, built in Saskatchewan on Treaty 6 territory, and keeps every byte of student data in Canada. Our 72 original textbooks are aligned to provincial curricula, and our on-device AI tutoring works even without an internet connection — critical for rural and remote Canadian communities.',
  },

  'canvas-lms-review': {
    competitor: 'Canvas',
    title: 'Canvas LMS Review 2026 — Strengths, Weaknesses & Alternatives',
    h1: 'Canvas LMS Review: Is It the Right Fit for Canadian K-12?',
    description: 'An honest review of Canvas LMS for Canadian K-12 schools. Discover its strengths, limitations, and better alternatives.',
    keywords: ['canvas lms review', 'canvas lms problems', 'canvas lms pros cons', 'canvas for k-12', 'instructure canvas review'],
    heroText: 'Canvas is a powerful LMS for universities, but Canadian K-12 schools face real challenges with it. From US data hosting to the lack of curriculum-aligned content, here is what you need to know before committing.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Interactive Courses & Quizzes', 'FERPA & PIPEDA Compliant', 'Attendance Tracking', 'Parent Portal'],
    whyExtra: 'While Canvas excels as a higher-education platform with robust API integrations and a large plugin ecosystem, it falls short for K-12 in several critical areas. There are no built-in textbooks or curriculum-aligned content — teachers must source or build everything themselves. The interface was designed for adult learners, not Grade 3 students. Canvas has no offline capability, no on-device AI, and no cognitive load theory-informed lesson structure. For Canadian schools, the biggest concern is data sovereignty: Instructure is a US company owned by Thoma Bravo private equity, and student data is processed on American servers subject to US law.',
  },

  'canvas-pricing-comparison': {
    competitor: 'Canvas',
    title: 'Canvas LMS Pricing vs WolfWhale — True Cost Comparison 2026',
    h1: 'Canvas Pricing vs WolfWhale: What Does an LMS Really Cost?',
    description: 'Compare Canvas LMS pricing with WolfWhale at $12/student/year. No hidden fees, no content costs, textbooks included.',
    keywords: ['canvas lms pricing', 'canvas lms cost', 'instructure pricing', 'canvas vs wolfwhale price', 'affordable lms canada'],
    heroText: 'Canvas pricing is opaque and enterprise-driven, often costing $15–30+ per student with no textbooks included. WolfWhale is $12/student/year with 72 original textbooks, on-device AI, and zero hidden fees.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gradebook & Analytics', 'Gamification & XP', 'FERPA & PIPEDA Compliant', 'Interactive Courses & Quizzes'],
    whyExtra: 'Canvas uses enterprise sales pricing that varies by district size, typically ranging from $15 to $30+ per student per year — and that is just for the platform. Textbooks, content, third-party integrations, and training are all extra. WolfWhale includes everything at a flat $12/student/year: 72 curriculum-aligned textbooks, spaced repetition flashcards, on-device AI tutoring, gamification, parent portal, gradebook analytics, and Canadian data hosting. For a school of 500 students, that is $6,000/year all-in versus potentially $15,000–$25,000+ with Canvas before content costs.',
  },

  'canvas-alternative-canada': {
    competitor: 'Canvas',
    title: 'Best Canvas Alternative for Canadian Schools — WolfWhale LMS',
    h1: 'Looking for a Canvas Alternative? WolfWhale Was Built for Canada.',
    description: 'WolfWhale is the Canadian-built Canvas alternative with data sovereignty, curriculum content, and $12/student pricing.',
    keywords: ['canvas alternative canada', 'canvas alternative', 'canadian lms alternative', 'replace canvas lms', 'canvas substitute'],
    heroText: 'Canadian schools deserve an LMS that was built for them — not adapted from a US university platform. WolfWhale offers everything Canvas does for K-12, plus 72 original textbooks, on-device AI, and guaranteed Canadian data sovereignty.',
    features: ['Canadian Data Sovereignty', 'Built for Canadian Schools', 'Curriculum-Aligned Content', 'FERPA & PIPEDA Compliant', 'Parent Portal', 'Attendance Tracking'],
    whyExtra: 'Many Canadian school divisions adopted Canvas because it was the most well-known LMS on the market. But Canvas was never designed for Canadian K-12. It lacks curriculum-aligned content, stores data in the US, and prices out smaller districts with enterprise contracts. WolfWhale is First Nations owned, Saskatchewan-built, and purpose-designed for Canadian K-12 education. Every feature — from our 72 original textbooks to our cognitive load theory lesson design — was created with Canadian classrooms in mind. Our data never leaves Canada, and our pricing at $12/student/year makes a world-class LMS accessible to every school division.',
  },

  'canvas-lms-problems': {
    competitor: 'Canvas',
    title: 'Common Canvas LMS Problems — Issues Canadian Schools Face',
    h1: '7 Canvas LMS Problems That Canadian K-12 Schools Keep Reporting',
    description: 'Discover the most common Canvas LMS issues for Canadian K-12 schools and how WolfWhale solves every one of them.',
    keywords: ['canvas lms problems', 'canvas lms issues', 'canvas lms complaints', 'canvas lms frustrations', 'canvas not working'],
    heroText: 'From data sovereignty concerns to missing K-12 features, Canadian schools report recurring frustrations with Canvas. Here are the most common problems — and how WolfWhale addresses each one.',
    features: ['Built for Canadian Schools', 'Canadian Data Sovereignty', 'Curriculum-Aligned Content', 'Parent Portal', 'Gamification & XP', 'FERPA & PIPEDA Compliant'],
    whyExtra: 'The most frequently reported Canvas problems in Canadian K-12 include: US-based data storage that conflicts with provincial privacy legislation, no built-in curriculum-aligned content forcing teachers to build everything from scratch, an interface designed for university students that confuses younger learners, no offline capability for rural and remote communities, enterprise pricing that excludes smaller school divisions, and no meaningful parent engagement tools. WolfWhale was specifically engineered to solve these problems. Our platform keeps data in Canada, includes 72 original textbooks, uses age-adaptive UI, works offline with on-device AI, costs $12/student/year, and includes a dedicated parent portal.',
  },

  'switch-from-canvas': {
    competitor: 'Canvas',
    title: 'Switch from Canvas to WolfWhale — Migration Guide for Schools',
    h1: 'How to Switch from Canvas to WolfWhale LMS',
    description: 'Step-by-step guide to migrating your school from Canvas to WolfWhale. Keep your data, gain 72 textbooks and AI tools.',
    keywords: ['switch from canvas', 'canvas migration', 'leave canvas lms', 'canvas to wolfwhale', 'replace canvas'],
    heroText: 'Switching LMS platforms does not have to be painful. WolfWhale offers guided migration from Canvas with dedicated support, data transfer assistance, and teacher training — so your school is up and running in weeks, not months.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gradebook & Analytics', 'Interactive Courses & Quizzes', 'Role-Based Access Control', 'Attendance Tracking'],
    whyExtra: 'Our migration team has helped dozens of schools transition from Canvas to WolfWhale. The process starts with a data export from Canvas — grades, rosters, and course structures transfer cleanly. Because WolfWhale includes 72 curriculum-aligned textbooks out of the box, teachers do not need to rebuild their content libraries. Our cognitive load theory-based lesson design means less prep time, not more. We provide dedicated onboarding support, teacher training sessions, and a 90-day migration window so your team can transition at a comfortable pace. Most schools are fully operational on WolfWhale within 4–6 weeks.',
  },

  'canvas-vs-wolfwhale-k12': {
    competitor: 'Canvas',
    title: 'Canvas vs WolfWhale for K-12 — Why K-12 Schools Choose WolfWhale',
    h1: 'Canvas vs WolfWhale: The K-12 Showdown',
    description: 'Canvas was built for universities. WolfWhale was built for K-12. Compare features purpose-designed for younger learners.',
    keywords: ['canvas k-12', 'canvas for elementary', 'canvas for k-12', 'k-12 lms', 'canvas vs wolfwhale k12'],
    heroText: 'Canvas is the world\'s most popular university LMS — but K-12 is a fundamentally different challenge. WolfWhale was purpose-built for K-12 with age-adaptive interfaces, gamification, cognitive load theory lessons, and 72 textbooks from Kindergarten through Grade 12.',
    features: ['Built for Canadian Schools', 'Gamification & XP', 'Curriculum-Aligned Content', 'Parent Portal', 'Spaced Repetition Flashcards', 'Interactive Courses & Quizzes'],
    whyExtra: 'K-12 students are not university undergrads. A Grade 2 student needs a fundamentally different learning experience than a college sophomore. Canvas offers a single interface designed for adult learners — there is no age-adaptive UI, no gamification to maintain engagement, and no cognitive load theory to prevent overwhelm. WolfWhale adapts to every grade level: younger students see simplified interfaces with XP rewards and visual progress tracking, while senior students get advanced analytics and study tools. Our 72 original textbooks cover Math, Science, ELA, Social Studies, Health, Arts, PE, Career Education, and French from Kindergarten through Grade 12, all aligned to provincial curricula.',
  },

  'canvas-data-privacy-concerns': {
    competitor: 'Canvas',
    title: 'Canvas Data Privacy Concerns for Canadian Schools — FOIP & PIPEDA',
    h1: 'Canvas Data Privacy: What Canadian Schools Need to Know',
    description: 'Canvas stores student data in the US. Learn why this matters for FOIP and PIPEDA compliance in Canadian schools.',
    keywords: ['canvas data privacy', 'canvas foip', 'canvas pipeda', 'canvas us data', 'instructure privacy concerns'],
    heroText: 'Instructure, the company behind Canvas, is US-based and owned by private equity. Student data processed on American servers is subject to US law, including the Patriot Act and CLOUD Act. For Canadian schools bound by FOIP and PIPEDA, this is a serious compliance risk.',
    features: ['Canadian Data Sovereignty', 'FERPA & PIPEDA Compliant', 'Built for Canadian Schools', 'Audit Logging', 'Role-Based Access Control', 'Multi-Tenant Architecture'],
    whyExtra: 'Canadian privacy law is clear: student data should be stored and processed in Canada. Provincial FOIP legislation and federal PIPEDA set strict requirements for how educational institutions handle personal information of minors. Canvas, owned by Thoma Bravo (a US private equity firm), processes data through American infrastructure. Even with contractual commitments, US-hosted data remains subject to the Patriot Act and CLOUD Act, which can compel disclosure without Canadian judicial oversight. WolfWhale guarantees Canadian data sovereignty — every byte of student data stays on Canadian servers. Our platform includes audit logging, role-based access control, and multi-tenant architecture designed from the ground up for FOIP and PIPEDA compliance.',
  },

  // ==========================================================================
  // BRIGHTSPACE / D2L (8 pages)
  // ==========================================================================

  'brightspace-vs-wolfwhale': {
    competitor: 'Brightspace',
    title: 'Brightspace vs WolfWhale LMS — K-12 LMS Comparison 2026',
    h1: 'Brightspace vs WolfWhale: Which LMS Wins for K-12?',
    description: 'Compare D2L Brightspace and WolfWhale LMS for K-12. See why schools choose WolfWhale for content, AI, and pricing.',
    keywords: ['brightspace vs wolfwhale', 'd2l vs wolfwhale', 'brightspace comparison', 'brightspace alternative', 'k-12 lms comparison'],
    heroText: 'Brightspace by D2L is a capable enterprise LMS, but it was designed for universities and corporate training. WolfWhale was purpose-built for Canadian K-12 with 72 textbooks, on-device AI, and cognitive load theory lessons at a fraction of the cost.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gamification & XP', 'Gradebook & Analytics', 'FERPA & PIPEDA Compliant', 'Spaced Repetition Flashcards'],
    whyExtra: 'D2L is a Canadian company, which is a point in their favour for data sovereignty. However, Brightspace is an enterprise platform with enterprise pricing and enterprise complexity. It was built for universities and corporate training, then adapted for K-12 — not designed for it. Brightspace includes no original textbooks, no cognitive load theory lesson design, no on-device AI tutoring, and no gamification system with XP and leveling. WolfWhale was born in a Saskatchewan classroom and built from day one for K-12. Our 72 original textbooks, spaced repetition flashcards, and on-device AI tutoring are features Brightspace simply does not offer at any price point.',
  },

  'brightspace-review': {
    competitor: 'Brightspace',
    title: 'Brightspace D2L Review 2026 — Pros, Cons & K-12 Limitations',
    h1: 'Brightspace Review: Strengths and Limitations for K-12 Schools',
    description: 'Honest review of D2L Brightspace for K-12 schools. Learn where it excels, where it falls short, and what alternatives exist.',
    keywords: ['brightspace review', 'd2l review', 'brightspace pros cons', 'brightspace k-12 review', 'brightspace limitations'],
    heroText: 'Brightspace is a well-established LMS with strong enterprise features. But for K-12 schools, its complexity, pricing, and lack of built-in content create real challenges that school divisions need to consider.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Interactive Courses & Quizzes', 'Parent Portal', 'Attendance Tracking', 'Gamification & XP'],
    whyExtra: 'Brightspace earns praise for its adaptive learning pathways, robust API ecosystem, and Canadian company headquarters. However, K-12 teachers consistently report that Brightspace is overly complex for their needs — the interface was designed for instructional designers at universities, not classroom teachers managing 30 students. There are no built-in textbooks, so teachers must source or create all content. The pricing model is enterprise-tier, often requiring multi-year contracts that strain school division budgets. And while D2L is Canadian, Brightspace still lacks features that K-12 specifically demands: gamification, cognitive load theory lessons, offline learning, on-device AI, and parent engagement tools.',
  },

  'brightspace-pricing-comparison': {
    competitor: 'Brightspace',
    title: 'Brightspace Pricing vs WolfWhale — LMS Cost Comparison 2026',
    h1: 'Brightspace Pricing vs WolfWhale: Enterprise Cost vs K-12 Value',
    description: 'D2L Brightspace uses enterprise pricing. WolfWhale is $12/student/year with 72 textbooks included. Compare the true cost.',
    keywords: ['brightspace pricing', 'd2l pricing', 'brightspace cost', 'brightspace vs wolfwhale price', 'affordable lms'],
    heroText: 'Brightspace pricing is built for enterprise buyers — multi-year contracts, implementation fees, and per-seat licensing that can reach $20–40+ per student. WolfWhale is $12/student/year, all-inclusive, with 72 textbooks and on-device AI.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gradebook & Analytics', 'Canadian Data Sovereignty', 'Interactive Courses & Quizzes', 'FERPA & PIPEDA Compliant'],
    whyExtra: 'D2L uses a traditional enterprise sales model with custom quotes, implementation fees, annual contracts, and tiered feature access. Schools report Brightspace costs of $20–40+ per student per year before factoring in content, training, and integration costs. WolfWhale eliminates this complexity with a flat $12/student/year that includes everything: 72 curriculum-aligned textbooks, on-device AI tutoring, spaced repetition flashcards, gamification, parent portal, gradebook analytics, attendance tracking, and Canadian data hosting. There are no implementation fees, no multi-year lock-ins, and no hidden costs. For a 1,000-student school, that is $12,000/year versus potentially $40,000+ with Brightspace.',
  },

  'brightspace-alternative-saskatchewan': {
    competitor: 'Brightspace',
    province: 'Saskatchewan',
    title: 'Brightspace Alternative for Saskatchewan Schools — WolfWhale LMS',
    h1: 'Saskatchewan Schools: A Brightspace Alternative Built Here',
    description: 'WolfWhale is the Saskatchewan-built Brightspace alternative with SK curriculum alignment, FOIP compliance, and $12/student.',
    keywords: ['brightspace alternative saskatchewan', 'saskatchewan lms', 'sk school lms', 'brightspace replacement', 'd2l alternative sk'],
    heroText: 'WolfWhale was born in Saskatchewan, on Treaty 6 territory. Our 72 textbooks are aligned to Saskatchewan curricula, our data stays in Canada, and our pricing makes a world-class LMS accessible to every SK school division.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Canadian Data Sovereignty', 'FERPA & PIPEDA Compliant', 'Gamification & XP', 'Parent Portal'],
    whyExtra: 'Saskatchewan school divisions using Brightspace often find themselves paying enterprise prices for an enterprise platform that was never designed for their K-12 classrooms. WolfWhale was built right here in Saskatchewan by educators who understand the unique needs of SK schools — from the rural connectivity challenges that demand offline learning to the provincial curriculum standards that our 72 textbooks are aligned to. As a First Nations owned company on Treaty 6 territory, we are deeply committed to Indigenous education and reconciliation. Our platform costs $12/student/year with everything included, and our data never leaves Canada, ensuring full FOIP and PIPEDA compliance.',
  },

  'brightspace-lms-problems': {
    competitor: 'Brightspace',
    title: 'Common Brightspace Problems for K-12 — Issues Schools Report',
    h1: '6 Brightspace Problems That K-12 Schools Keep Encountering',
    description: 'K-12 schools report these recurring Brightspace issues. See how WolfWhale solves each one with purpose-built K-12 tools.',
    keywords: ['brightspace problems', 'd2l problems', 'brightspace issues', 'brightspace complaints', 'brightspace k-12 issues'],
    heroText: 'Brightspace is a powerful platform — but power without purpose creates frustration. K-12 schools consistently report these issues: excessive complexity, missing content, enterprise pricing, and features designed for the wrong audience.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gamification & XP', 'Parent Portal', 'Interactive Courses & Quizzes', 'Attendance Tracking'],
    whyExtra: 'The most common Brightspace complaints from K-12 schools include: an interface too complex for classroom teachers without instructional design training, no built-in curriculum content forcing massive teacher workload, enterprise pricing that strains school division budgets, multi-year contracts that lock schools into commitments before they know if the platform works for them, lack of age-appropriate engagement tools like gamification for younger students, and no offline capability for schools in rural or remote communities. WolfWhale was specifically designed to avoid every one of these problems. Our interface is intuitive for any teacher, our 72 textbooks eliminate content creation burden, and our $12/student/year pricing has no lock-in period.',
  },

  'switch-from-brightspace': {
    competitor: 'Brightspace',
    title: 'Switch from Brightspace to WolfWhale — LMS Migration Guide',
    h1: 'How to Switch from Brightspace to WolfWhale LMS',
    description: 'Migrate from Brightspace to WolfWhale with guided support. Transfer grades, gain 72 textbooks, and reduce your LMS costs.',
    keywords: ['switch from brightspace', 'brightspace migration', 'leave brightspace', 'brightspace to wolfwhale', 'replace d2l'],
    heroText: 'Transitioning away from Brightspace is easier than you think. WolfWhale provides guided migration support, data transfer assistance, and teacher training to get your school running on a purpose-built K-12 platform.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gradebook & Analytics', 'Role-Based Access Control', 'Interactive Courses & Quizzes', 'Attendance Tracking'],
    whyExtra: 'Our Brightspace migration process is straightforward. We start by exporting your existing data — student rosters, grade histories, and course structures. Because WolfWhale includes 72 curriculum-aligned textbooks, your teachers gain an instant content library instead of rebuilding courses from scratch. The cognitive load theory-based lesson design in WolfWhale means less teacher prep time while delivering better learning outcomes. We provide hands-on training sessions for teachers, administrators, and IT staff, plus a dedicated support channel during the 90-day transition window. Most schools complete their migration within 3–5 weeks and immediately see reduced workload and improved student engagement through our gamification system.',
  },

  'brightspace-vs-wolfwhale-k12': {
    competitor: 'Brightspace',
    title: 'Brightspace vs WolfWhale for K-12 — Purpose-Built Wins',
    h1: 'Brightspace vs WolfWhale: Why Purpose-Built K-12 Beats Adapted Enterprise',
    description: 'Brightspace adapts enterprise tools for K-12. WolfWhale was built for K-12 from day one. See the difference it makes.',
    keywords: ['brightspace k-12', 'brightspace for k-12', 'd2l k-12', 'brightspace vs wolfwhale k12', 'k-12 lms'],
    heroText: 'There is a fundamental difference between adapting a university LMS for K-12 and building one for K-12 from scratch. WolfWhale was designed from the ground up for Kindergarten through Grade 12, and it shows in every feature.',
    features: ['Built for Canadian Schools', 'Gamification & XP', 'Curriculum-Aligned Content', 'Spaced Repetition Flashcards', 'Parent Portal', 'Gradebook & Analytics'],
    whyExtra: 'Brightspace started as a university LMS and added K-12 features over time. WolfWhale started as a K-12 LMS and has never been anything else. This foundational difference shows up everywhere: our age-adaptive UI adjusts complexity based on grade level, our gamification system with XP and leveling keeps younger students engaged, our cognitive load theory lessons prevent overwhelm, and our 72 textbooks span every subject from Kindergarten through Grade 12. Brightspace offers none of these. Our spaced repetition flashcard system uses evidence-based learning science to improve long-term retention, and our on-device AI tutoring provides personalized support without sending student data to external servers.',
  },

  'd2l-alternative-canada': {
    competitor: 'Brightspace',
    title: 'D2L Alternative for Canadian Schools — WolfWhale LMS',
    h1: 'The Canadian D2L Alternative That Was Built for K-12',
    description: 'Looking for a D2L alternative in Canada? WolfWhale offers K-12 focus, 72 textbooks, and $12/student pricing.',
    keywords: ['d2l alternative', 'd2l alternative canada', 'brightspace alternative canada', 'd2l replacement', 'canadian lms'],
    heroText: 'D2L is a proud Canadian company — and so is WolfWhale. The difference is focus. D2L serves universities and corporations worldwide. WolfWhale serves Canadian K-12 classrooms exclusively, with purpose-built tools and $12/student/year pricing.',
    features: ['Built for Canadian Schools', 'Canadian Data Sovereignty', 'Curriculum-Aligned Content', 'FERPA & PIPEDA Compliant', 'Gamification & XP', 'Interactive Courses & Quizzes'],
    whyExtra: 'We respect what D2L has accomplished — they are a Canadian success story in the global EdTech market. But serving universities, corporations, and K-12 schools with the same platform means compromises everywhere. WolfWhale made a different choice: we serve only Canadian K-12 schools, and we serve them exceptionally well. Our 72 original textbooks are aligned to provincial curricula. Our on-device AI tutoring works offline for rural communities. Our cognitive load theory lesson design is built on learning science, not marketing. And at $12/student/year, we make world-class education technology accessible to every school division in Canada — not just the ones with enterprise budgets.',
  },

  // ==========================================================================
  // EDSBY (8 pages)
  // ==========================================================================

  'edsby-vs-wolfwhale': {
    competitor: 'Edsby',
    title: 'Edsby vs WolfWhale LMS — Canadian K-12 LMS Comparison',
    h1: 'Edsby vs WolfWhale: Two Canadian LMS Platforms, One Clear Winner',
    description: 'Compare Edsby and WolfWhale LMS for Canadian K-12. Both Canadian, but WolfWhale adds AI, textbooks, and gamification.',
    keywords: ['edsby vs wolfwhale', 'edsby comparison', 'edsby alternative', 'canadian k-12 lms', 'edsby or wolfwhale'],
    heroText: 'Edsby and WolfWhale are both Canadian K-12 platforms — but that is where the similarities end. WolfWhale includes 72 original textbooks, on-device AI tutoring, spaced repetition flashcards, gamification with XP, and offline learning. Edsby offers none of these.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gamification & XP', 'Spaced Repetition Flashcards', 'Canadian Data Sovereignty', 'FERPA & PIPEDA Compliant'],
    whyExtra: 'Edsby deserves credit for being a Canadian-built K-12 platform — that alone puts it ahead of US-based competitors on data sovereignty. However, Edsby functions primarily as a student information system with LMS features bolted on. It lacks original textbook content, AI-powered tutoring, cognitive load theory lesson design, gamification with XP and leveling, spaced repetition flashcards, and offline learning capability. WolfWhale was built as a complete learning ecosystem: 72 curriculum-aligned textbooks, on-device AI that works without internet, evidence-based lesson design, and a gamification system that keeps students genuinely engaged. Plus, WolfWhale is First Nations owned on Treaty 6 territory, with deep roots in Indigenous education and reconciliation.',
  },

  'edsby-review': {
    competitor: 'Edsby',
    title: 'Edsby Review 2026 — Strengths, Gaps & Better Alternatives',
    h1: 'Edsby Review: What It Does Well and Where It Falls Short',
    description: 'An honest Edsby review for Canadian K-12 schools. Strong SIS features, but missing AI, textbooks, and gamification.',
    keywords: ['edsby review', 'edsby pros cons', 'edsby limitations', 'edsby lms review', 'edsby problems'],
    heroText: 'Edsby is a solid Canadian K-12 platform with good communication and SIS features. But as a learning management system, it has significant gaps — no original content, no AI tools, no gamification, and no offline capability.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Interactive Courses & Quizzes', 'Gamification & XP', 'Parent Portal', 'Gradebook & Analytics'],
    whyExtra: 'Edsby\'s strengths are real: it offers strong parent-teacher communication, attendance tracking, and integration with provincial SIS systems. These are valuable features for school administration. However, when evaluated as a learning platform — the place where students actually learn — Edsby falls short. There are no original textbooks, so teachers must source all content externally. There is no AI-powered tutoring to provide personalized support. There is no gamification system to drive student engagement. There is no cognitive load theory-based lesson design. And there is no offline mode for students without reliable internet access. WolfWhale covers all of these areas while also providing the administrative tools schools expect.',
  },

  'edsby-pricing-comparison': {
    competitor: 'Edsby',
    title: 'Edsby Pricing vs WolfWhale — K-12 LMS Cost Comparison',
    h1: 'Edsby Pricing vs WolfWhale: What Do You Actually Get?',
    description: 'Compare Edsby and WolfWhale pricing for K-12. WolfWhale is $12/student/year with 72 textbooks and AI included.',
    keywords: ['edsby pricing', 'edsby cost', 'edsby vs wolfwhale price', 'k-12 lms pricing', 'edsby pricing comparison'],
    heroText: 'Pricing matters, but value matters more. WolfWhale at $12/student/year includes 72 curriculum-aligned textbooks, on-device AI, gamification, and offline learning. Compare that to what Edsby includes at their price point.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gamification & XP', 'Gradebook & Analytics', 'Interactive Courses & Quizzes', 'FERPA & PIPEDA Compliant'],
    whyExtra: 'When comparing LMS pricing, the sticker price only tells part of the story. Edsby provides a platform, but schools still need to purchase or create content separately — textbooks, digital resources, and learning materials are all additional costs. WolfWhale bundles everything into a flat $12/student/year: 72 original textbooks covering Math, Science, ELA, Social Studies, Health, Arts, PE, Career Education, and French; on-device AI tutoring; spaced repetition flashcards; gamification with XP and leveling; parent portal; gradebook analytics; and attendance tracking. When you factor in the content costs that Edsby requires on top of its platform fee, WolfWhale delivers dramatically more value per dollar.',
  },

  'edsby-alternative-saskatchewan': {
    competitor: 'Edsby',
    province: 'Saskatchewan',
    title: 'Edsby Alternative for Saskatchewan — WolfWhale LMS',
    h1: 'Saskatchewan Schools: The Edsby Alternative Built on Treaty 6',
    description: 'WolfWhale is the Saskatchewan-built Edsby alternative with 72 SK-aligned textbooks, AI tutoring, and $12/student pricing.',
    keywords: ['edsby alternative saskatchewan', 'saskatchewan lms', 'edsby replacement sk', 'sk school platform', 'edsby substitute'],
    heroText: 'WolfWhale was built in Saskatchewan, on Treaty 6 territory, by educators who understand what SK schools need. Our 72 textbooks are aligned to Saskatchewan curricula, and our First Nations ownership reflects our commitment to reconciliation.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Canadian Data Sovereignty', 'Gamification & XP', 'FERPA & PIPEDA Compliant', 'Attendance Tracking'],
    whyExtra: 'Saskatchewan schools have used Edsby for its SIS and communication features, and those tools serve a purpose. But WolfWhale offers a fundamentally more complete learning experience for SK students. Our 72 original textbooks are specifically aligned to Saskatchewan curriculum outcomes — not generic Canadian content, but real SK standards. Our on-device AI tutoring works offline, critical for rural SK communities where internet can be unreliable. Our cognitive load theory lesson design is grounded in learning science. And as a First Nations owned company on Treaty 6 territory, Indigenous perspectives are woven into our content and our company DNA, not treated as an afterthought or add-on module.',
  },

  'edsby-lms-problems': {
    competitor: 'Edsby',
    title: 'Common Edsby Problems — Limitations Schools Should Know',
    h1: 'Edsby Limitations: What Schools Wish They Knew Before Adopting',
    description: 'Edsby is solid for SIS but limited as an LMS. No AI, no textbooks, no gamification, no offline. See the full picture.',
    keywords: ['edsby problems', 'edsby limitations', 'edsby issues', 'edsby complaints', 'edsby gaps'],
    heroText: 'Edsby is a competent school communication platform, but schools looking for a complete learning management system often find gaps. No original content, no AI tools, no gamification, and no offline learning leave teachers doing extra work.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Interactive Courses & Quizzes', 'Gamification & XP', 'Spaced Repetition Flashcards', 'Gradebook & Analytics'],
    whyExtra: 'Schools that adopted Edsby primarily for its SIS and communication features are generally satisfied. The problems emerge when schools try to use Edsby as their primary learning platform. Teachers report having to source all instructional content externally, which creates significant workload. There are no AI-powered tools to provide personalized student support. The absence of gamification features means student engagement depends entirely on content quality — content that teachers must create themselves. There is no offline mode, which is a dealbreaker for schools in communities with unreliable internet. And without cognitive load theory-based lesson design, the platform offers no pedagogical framework for how content should be structured and delivered.',
  },

  'switch-from-edsby': {
    competitor: 'Edsby',
    title: 'Switch from Edsby to WolfWhale — Migration Guide',
    h1: 'How to Switch from Edsby to WolfWhale LMS',
    description: 'Migrate from Edsby to WolfWhale with guided support. Gain 72 textbooks, AI tutoring, and gamification from day one.',
    keywords: ['switch from edsby', 'edsby migration', 'leave edsby', 'edsby to wolfwhale', 'replace edsby'],
    heroText: 'Switching from Edsby to WolfWhale means gaining 72 curriculum-aligned textbooks, on-device AI tutoring, gamification, and offline learning — all while keeping the administrative features your school depends on.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gradebook & Analytics', 'Attendance Tracking', 'Role-Based Access Control', 'Parent Portal'],
    whyExtra: 'The transition from Edsby to WolfWhale is straightforward because WolfWhale includes all the core administrative features schools use in Edsby — gradebook, attendance, parent communication, and role-based access — plus a complete learning ecosystem on top. Our migration team handles roster imports, grade history transfers, and system configuration. Because WolfWhale includes 72 curriculum-aligned textbooks, teachers gain an instant content library instead of starting from scratch. The on-device AI tutoring, spaced repetition flashcards, and gamification system are all available from day one. We provide teacher training sessions and a 90-day support window to ensure a smooth transition.',
  },

  'edsby-vs-wolfwhale-features': {
    competitor: 'Edsby',
    title: 'Edsby vs WolfWhale Features — Side-by-Side Comparison',
    h1: 'Edsby vs WolfWhale: Feature-by-Feature Comparison',
    description: 'Compare every feature of Edsby and WolfWhale LMS side by side. See where each platform excels and where gaps exist.',
    keywords: ['edsby vs wolfwhale features', 'edsby feature comparison', 'edsby features list', 'edsby capabilities', 'lms feature comparison'],
    heroText: 'A fair comparison requires a complete feature breakdown. We have laid out every major LMS feature side by side so you can see exactly what Edsby and WolfWhale each offer — and where the gaps are.',
    features: ['Curriculum-Aligned Content', 'Gamification & XP', 'Spaced Repetition Flashcards', 'Interactive Courses & Quizzes', 'Gradebook & Analytics', 'Attendance Tracking'],
    whyExtra: 'In a direct feature comparison, both platforms offer gradebook management, attendance tracking, parent communication, and role-based access control. Where the platforms diverge dramatically is in learning features. WolfWhale includes 72 original curriculum-aligned textbooks — Edsby includes zero. WolfWhale offers on-device AI tutoring — Edsby has no AI tools. WolfWhale has a gamification system with XP, leveling, and achievement badges — Edsby has no gamification. WolfWhale provides spaced repetition flashcards based on learning science — Edsby does not. WolfWhale works offline for rural and remote communities — Edsby requires constant connectivity. And WolfWhale uses cognitive load theory to structure every lesson — Edsby provides no pedagogical framework.',
  },

  'edsby-alternative-western-canada': {
    competitor: 'Edsby',
    title: 'Edsby Alternative for Western Canada — WolfWhale LMS',
    h1: 'Western Canadian Schools: The Edsby Alternative With More',
    description: 'WolfWhale is the western Canadian Edsby alternative with 72 textbooks, AI, gamification, and $12/student pricing.',
    keywords: ['edsby alternative western canada', 'western canada lms', 'edsby alternative alberta', 'edsby alternative bc', 'edsby alternative manitoba'],
    heroText: 'From British Columbia to Manitoba, western Canadian schools need an LMS that understands their communities. WolfWhale was built in Saskatchewan and designed for the realities of western Canadian education — rural connectivity, Indigenous perspectives, and provincial curriculum alignment.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Canadian Data Sovereignty', 'FERPA & PIPEDA Compliant', 'Gamification & XP', 'Parent Portal'],
    whyExtra: 'Western Canada has unique educational needs that national or international LMS platforms often overlook. Rural and remote communities need offline learning capability — WolfWhale works without internet through on-device AI. Indigenous education and reconciliation are priorities across western provinces — WolfWhale is First Nations owned with Indigenous perspectives integrated throughout our content. Provincial curricula across western Canada share WNCP (Western and Northern Canadian Protocol) foundations — our 72 textbooks are built on 70% pan-Canadian WNCP core content with 30% province-specific alignment. And at $12/student/year, we are accessible to small rural school divisions, not just large urban districts with enterprise budgets.',
  },

  // ==========================================================================
  // GOOGLE CLASSROOM (8 pages)
  // ==========================================================================

  'google-classroom-vs-wolfwhale': {
    competitor: 'Google Classroom',
    title: 'Google Classroom vs WolfWhale LMS — Complete Comparison',
    h1: 'Google Classroom vs WolfWhale: Free Is Not Always Better',
    description: 'Google Classroom is free but limited. WolfWhale is $12/student with 72 textbooks, AI, gradebook, and Canadian data hosting.',
    keywords: ['google classroom vs wolfwhale', 'google classroom alternative', 'google classroom comparison', 'google classroom vs lms', 'google classroom limitations'],
    heroText: 'Google Classroom is free and familiar — but it is not a learning management system. It is an assignment distribution tool. WolfWhale is a complete K-12 LMS with 72 textbooks, on-device AI, gamification, gradebook analytics, and Canadian data sovereignty for $12/student/year.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gradebook & Analytics', 'Gamification & XP', 'Canadian Data Sovereignty', 'FERPA & PIPEDA Compliant'],
    whyExtra: 'Google Classroom became popular because it is free and integrates with Google Workspace tools that many schools already use. But free comes with significant trade-offs. Google Classroom has no built-in textbooks or curriculum content. It has no real gradebook analytics — just a basic grade list. There is no gamification, no spaced repetition, no cognitive load theory lesson design. It does not work offline. And most critically for Canadian schools, student data flows through Google\'s US-based servers, raising serious FOIP and PIPEDA compliance concerns. WolfWhale provides everything Google Classroom lacks — a complete learning ecosystem with 72 original textbooks, on-device AI tutoring, and guaranteed Canadian data sovereignty — for just $12/student/year.',
  },

  'google-classroom-limitations': {
    competitor: 'Google Classroom',
    title: 'Google Classroom Limitations — Why Schools Need a Real LMS',
    h1: 'Google Classroom Limitations Every School Should Understand',
    description: 'Google Classroom lacks gradebook analytics, textbooks, AI, offline mode, and data sovereignty. Here is what schools miss.',
    keywords: ['google classroom limitations', 'google classroom problems', 'google classroom not enough', 'google classroom missing features', 'google classroom issues'],
    heroText: 'Google Classroom is an assignment tool, not a learning management system. Schools relying solely on Google Classroom are missing gradebook analytics, curriculum content, AI tutoring, gamification, offline learning, and Canadian data sovereignty.',
    features: ['Gradebook & Analytics', 'Curriculum-Aligned Content', 'Interactive Courses & Quizzes', 'Gamification & XP', 'Spaced Repetition Flashcards', 'Attendance Tracking'],
    whyExtra: 'Google Classroom was designed to do one thing well: distribute and collect assignments through Google Drive. It was never intended to be a complete learning platform, and it shows. There is no gradebook with analytics — teachers get a simple spreadsheet of grades with no trend analysis, no class performance insights, and no early warning indicators. There are no built-in textbooks or curriculum resources. There is no attendance tracking. There is no AI-powered tutoring. There is no gamification to drive student engagement. There is no offline mode for communities without reliable internet. And there is no parent portal with meaningful engagement tools. Schools that need an actual LMS — not just an assignment inbox — need a purpose-built platform like WolfWhale.',
  },

  'google-classroom-privacy-concerns-canada': {
    competitor: 'Google Classroom',
    title: 'Google Classroom Privacy Concerns for Canadian Schools',
    h1: 'Google Classroom and Canadian Student Privacy: What Schools Must Know',
    description: 'Google Classroom sends student data to US servers. Learn the FOIP and PIPEDA implications for Canadian schools.',
    keywords: ['google classroom privacy canada', 'google classroom foip', 'google classroom pipeda', 'google classroom data concerns', 'google classroom student data'],
    heroText: 'When students use Google Classroom, their data is processed by Google — a US company with servers worldwide. For Canadian schools bound by FOIP and PIPEDA, this creates real compliance risks that cannot be ignored.',
    features: ['Canadian Data Sovereignty', 'FERPA & PIPEDA Compliant', 'Built for Canadian Schools', 'Audit Logging', 'Role-Based Access Control', 'Multi-Tenant Architecture'],
    whyExtra: 'Google\'s privacy policies allow the company to collect and process vast amounts of student data — including usage patterns, interaction data, and metadata — on servers located outside Canada. While Google offers contractual commitments about data use for education accounts, the fundamental issue remains: student data on US servers is subject to US law, including the Patriot Act and CLOUD Act, which allow US authorities to compel access without Canadian judicial oversight. Several Canadian provinces have raised concerns about Google Workspace in education settings. WolfWhale eliminates this risk entirely: all student data is hosted on Canadian servers, processed by a Canadian company, and governed exclusively by Canadian law. Our audit logging provides complete transparency into data access.',
  },

  'google-classroom-alternative-canada': {
    competitor: 'Google Classroom',
    title: 'Google Classroom Alternative for Canadian Schools — WolfWhale',
    h1: 'The Canadian Google Classroom Alternative With Real LMS Features',
    description: 'WolfWhale replaces Google Classroom with a full LMS: 72 textbooks, AI, gradebook, gamification, and Canadian data hosting.',
    keywords: ['google classroom alternative canada', 'google classroom replacement', 'google classroom substitute', 'canadian google classroom alternative', 'better than google classroom'],
    heroText: 'Canadian schools need more than an assignment tool — they need a complete learning platform with Canadian data sovereignty. WolfWhale replaces Google Classroom with 72 textbooks, gradebook analytics, on-device AI, and guaranteed FOIP compliance.',
    features: ['Built for Canadian Schools', 'Canadian Data Sovereignty', 'Curriculum-Aligned Content', 'Gradebook & Analytics', 'FERPA & PIPEDA Compliant', 'Gamification & XP'],
    whyExtra: 'Google Classroom became the default for many Canadian schools because it was free and easy to set up during the pandemic rush to remote learning. But as schools move beyond emergency measures, they are recognizing the limitations: no real gradebook, no curriculum content, no AI tutoring, no gamification, and student data flowing to US servers. WolfWhale was built specifically for Canadian K-12 schools. Our 72 original textbooks align to provincial curricula. Our on-device AI tutoring works offline for rural communities. Our gamification system keeps students engaged. Our gradebook provides real analytics. And every byte of student data stays in Canada. At $12/student/year, it is a modest investment for a transformative upgrade.',
  },

  'beyond-google-classroom': {
    competitor: 'Google Classroom',
    title: 'Beyond Google Classroom — Why Schools Need a Full LMS',
    h1: 'Beyond Google Classroom: What a Real LMS Looks Like',
    description: 'Google Classroom is a starting point, not a destination. See what schools gain by upgrading to WolfWhale LMS.',
    keywords: ['beyond google classroom', 'upgrade from google classroom', 'google classroom not enough', 'real lms for schools', 'full lms vs google classroom'],
    heroText: 'Google Classroom was a lifeline during the pandemic. But schools have outgrown assignment distribution. A real LMS provides curriculum content, AI tutoring, gamification, gradebook analytics, and learning science-based lesson design.',
    features: ['Curriculum-Aligned Content', 'Gradebook & Analytics', 'Gamification & XP', 'Interactive Courses & Quizzes', 'Spaced Repetition Flashcards', 'Parent Portal'],
    whyExtra: 'The pandemic proved that digital learning tools are essential, not optional. Google Classroom served as a bridge, but bridges are not destinations. Schools that remain on Google Classroom are missing the transformative potential of a real learning management system. WolfWhale provides what Google Classroom cannot: 72 original textbooks that reduce teacher workload, on-device AI tutoring that provides personalized support to every student, spaced repetition flashcards that improve long-term retention, gamification that makes learning genuinely engaging, gradebook analytics that help teachers identify struggling students early, and cognitive load theory lesson design that prevents overwhelm and maximizes learning. The future of K-12 education is not assignment distribution — it is a complete, intelligent learning ecosystem.',
  },

  'switch-from-google-classroom': {
    competitor: 'Google Classroom',
    title: 'Switch from Google Classroom to WolfWhale — Upgrade Guide',
    h1: 'How to Upgrade from Google Classroom to WolfWhale LMS',
    description: 'Upgrade from Google Classroom to WolfWhale LMS. Gain 72 textbooks, AI, gradebook, and Canadian data sovereignty.',
    keywords: ['switch from google classroom', 'google classroom migration', 'leave google classroom', 'google classroom to lms', 'upgrade google classroom'],
    heroText: 'Upgrading from Google Classroom to WolfWhale is not a disruption — it is a transformation. Your teachers keep their workflow simplicity while gaining 72 textbooks, AI tutoring, real gradebook analytics, and Canadian data sovereignty.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gradebook & Analytics', 'Canadian Data Sovereignty', 'Gamification & XP', 'Interactive Courses & Quizzes'],
    whyExtra: 'Schools moving from Google Classroom to WolfWhale consistently report the transition being smoother than expected. Because Google Classroom has minimal data beyond assignment submissions and grades, there is less to migrate. WolfWhale provides an intuitive interface that teachers find easy to learn — our platform was designed for classroom teachers, not IT administrators. The biggest immediate impact is content: teachers who spent hours finding and uploading resources to Google Classroom now have 72 curriculum-aligned textbooks ready to go. The gradebook analytics provide insights Google Classroom never could. And the on-device AI tutoring gives every student a personal learning assistant without sending data to US servers.',
  },

  'google-classroom-vs-full-lms': {
    competitor: 'Google Classroom',
    title: 'Google Classroom vs a Full LMS — Why Classroom Is Not Enough',
    h1: 'Google Classroom Is Not an LMS. Here Is What an LMS Actually Does.',
    description: 'Google Classroom handles assignments. A real LMS like WolfWhale handles learning, assessment, analytics, and content.',
    keywords: ['google classroom vs lms', 'is google classroom an lms', 'google classroom not lms', 'full lms features', 'google classroom missing'],
    heroText: 'Google Classroom distributes assignments and collects submissions. That is not learning management — that is file management. A real LMS provides curriculum content, adaptive learning, analytics, engagement tools, and data-driven insights.',
    features: ['Curriculum-Aligned Content', 'Gradebook & Analytics', 'Interactive Courses & Quizzes', 'Gamification & XP', 'Attendance Tracking', 'Parent Portal'],
    whyExtra: 'A learning management system manages learning — the entire cycle from content delivery to assessment to feedback to intervention. Google Classroom manages the narrowest slice of that cycle: distributing assignments and collecting them back. It has no content library, no adaptive learning pathways, no meaningful assessment tools, no analytics dashboard, no attendance tracking, no parent engagement tools, no AI tutoring, no gamification, no offline capability, and no spaced repetition for long-term retention. WolfWhale is a complete LMS built on learning science. Our cognitive load theory lessons, spaced repetition flashcards, and on-device AI create a genuine learning ecosystem — not just a digital assignment dropbox.',
  },

  'google-classroom-data-residency': {
    competitor: 'Google Classroom',
    title: 'Google Classroom Data Residency Issues for Canadian Schools',
    h1: 'Where Does Google Classroom Store Your Students\' Data?',
    description: 'Google Classroom data residency is a concern for Canadian schools. Learn why and discover a Canadian-hosted alternative.',
    keywords: ['google classroom data residency', 'google classroom data location', 'google data sovereignty canada', 'google classroom servers', 'google education data'],
    heroText: 'Google does not guarantee Canadian data residency for education accounts. Student data may be processed and stored across Google\'s global server network, including in the United States. For Canadian schools, this creates real compliance concerns.',
    features: ['Canadian Data Sovereignty', 'FERPA & PIPEDA Compliant', 'Built for Canadian Schools', 'Audit Logging', 'Multi-Tenant Architecture', 'Role-Based Access Control'],
    whyExtra: 'Data residency is not a theoretical concern — it is a legal requirement in many Canadian provinces. When student data leaves Canada, it becomes subject to foreign laws that Canadian schools have no control over. Google\'s terms of service for education do not guarantee that data will remain in Canada. Google operates a global server infrastructure and routes data based on performance optimization, not jurisdictional compliance. Several Canadian provinces have specifically flagged this issue, and some have restricted or banned certain Google services in educational settings. WolfWhale provides a clear, simple guarantee: all student data is stored and processed on Canadian servers, period. No exceptions, no fine print, no routing through foreign jurisdictions.',
  },

  // ==========================================================================
  // MOODLE (6 pages)
  // ==========================================================================

  'moodle-vs-wolfwhale': {
    competitor: 'Moodle',
    title: 'Moodle vs WolfWhale LMS — Open Source vs Purpose-Built K-12',
    h1: 'Moodle vs WolfWhale: Why Open Source Is Not Always the Answer',
    description: 'Compare Moodle and WolfWhale for K-12. Moodle is free but costly to run. WolfWhale is $12/student, fully managed.',
    keywords: ['moodle vs wolfwhale', 'moodle alternative', 'moodle comparison', 'moodle vs cloud lms', 'moodle for k-12'],
    heroText: 'Moodle is free to download — but free software is not free to run. Between hosting, IT staff, plugin management, and an outdated UX, Moodle often costs more than purpose-built alternatives. WolfWhale is $12/student/year, fully managed, with 72 textbooks included.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gamification & XP', 'Gradebook & Analytics', 'Interactive Courses & Quizzes', 'FERPA & PIPEDA Compliant'],
    whyExtra: 'Moodle\'s open-source model is appealing on paper: free software that you can customize however you want. In practice, K-12 schools face significant hidden costs. You need a server (or cloud hosting contract), an IT administrator to maintain and update the installation, plugins to add basic features that other LMS platforms include out of the box, and ongoing troubleshooting when plugins conflict after updates. The user interface, while improved in recent versions, remains complex and dated compared to modern platforms. There is no native mobile app. There are no built-in textbooks. There is no on-device AI. WolfWhale eliminates all of this complexity with a fully managed cloud platform at $12/student/year, including 72 curriculum-aligned textbooks and on-device AI tutoring.',
  },

  'moodle-hosting-costs': {
    competitor: 'Moodle',
    title: 'True Cost of Moodle — Hosting, IT, Plugins & Hidden Expenses',
    h1: 'The True Cost of Moodle: Why "Free" Software Is Not Free',
    description: 'Moodle is free to download but expensive to run. Hosting, IT, plugins, and maintenance add up fast. See the real numbers.',
    keywords: ['moodle hosting cost', 'moodle total cost', 'moodle hidden costs', 'moodle it costs', 'moodle plugin costs'],
    heroText: 'Moodle charges $0 for the software. But hosting costs $2,000–10,000/year. A part-time IT admin adds $20,000–40,000. Plugins, themes, and integrations cost another $1,000–5,000. For a 500-student school, that is $50–100+ per student before anyone builds a single lesson.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gradebook & Analytics', 'Canadian Data Sovereignty', 'Interactive Courses & Quizzes', 'Attendance Tracking'],
    whyExtra: 'School divisions that choose Moodle often discover the true costs only after implementation. A production-ready Moodle installation requires reliable hosting with adequate storage and bandwidth ($2,000–10,000/year depending on scale), IT staff time for installation, configuration, updates, backups, and troubleshooting ($20,000–40,000/year for part-time coverage), premium plugins and themes ($1,000–5,000/year), SSL certificates and security monitoring, and ongoing training as staff turn over. For a 500-student school, these costs easily reach $50–100+ per student per year — and that is before any content is created. WolfWhale is $12/student/year with everything included: hosting, maintenance, security, 72 curriculum-aligned textbooks, on-device AI, gamification, and dedicated support. Zero IT overhead.',
  },

  'moodle-alternative-no-hosting': {
    competitor: 'Moodle',
    title: 'Moodle Alternative Without Self-Hosting — WolfWhale Cloud LMS',
    h1: 'Tired of Self-Hosting Moodle? WolfWhale Is Fully Managed.',
    description: 'WolfWhale is the Moodle alternative that requires zero hosting, zero IT, and zero plugins. Fully managed at $12/student/year.',
    keywords: ['moodle alternative no hosting', 'moodle cloud alternative', 'moodle replacement', 'hosted moodle alternative', 'moodle without servers'],
    heroText: 'No servers. No plugins. No update nightmares. No IT overhead. WolfWhale is a fully managed K-12 LMS that replaces self-hosted Moodle with a cloud platform, 72 textbooks, and on-device AI at $12/student/year.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Canadian Data Sovereignty', 'Gamification & XP', 'FERPA & PIPEDA Compliant', 'Gradebook & Analytics'],
    whyExtra: 'Self-hosting an LMS made sense when cloud options were expensive and unreliable. That era is over. WolfWhale provides a fully managed cloud LMS hosted on Canadian servers with automatic updates, security patches, backups, and 99.9% uptime — all included in the $12/student/year price. Your IT staff can focus on supporting teachers and students instead of maintaining servers and debugging plugin conflicts. Our 72 curriculum-aligned textbooks mean teachers have content ready from day one. Our on-device AI tutoring provides personalized support without any server-side AI infrastructure. And our gamification system drives student engagement without requiring custom plugin installations.',
  },

  'switch-from-moodle': {
    competitor: 'Moodle',
    title: 'Switch from Moodle to WolfWhale — Migration Guide for Schools',
    h1: 'How to Migrate from Moodle to WolfWhale LMS',
    description: 'Migrate from self-hosted Moodle to WolfWhale. Eliminate hosting costs, gain 72 textbooks, and free your IT team.',
    keywords: ['switch from moodle', 'moodle migration', 'leave moodle', 'moodle to wolfwhale', 'replace moodle'],
    heroText: 'Migrating from Moodle to WolfWhale means eliminating hosting costs, IT overhead, and plugin management while gaining 72 curriculum-aligned textbooks, on-device AI, and a modern learning experience.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gradebook & Analytics', 'Role-Based Access Control', 'Interactive Courses & Quizzes', 'Attendance Tracking'],
    whyExtra: 'Our Moodle migration process handles the complexity so your team does not have to. We export your existing Moodle data — user accounts, grade histories, and course structures — and import them into WolfWhale. Because WolfWhale includes 72 curriculum-aligned textbooks, your teachers do not need to rebuild their courses from Moodle\'s content format. The biggest immediate benefit is IT relief: no more server maintenance, no more plugin updates, no more security patches, no more backup management. Your IT staff reclaim hours every week. Teachers gain a modern, intuitive interface with built-in content and AI tools. And your school division saves thousands of dollars per year in hosting and IT costs.',
  },

  'moodle-problems-k12': {
    competitor: 'Moodle',
    title: 'Why Moodle Does Not Work for K-12 — Common Problems',
    h1: 'Why Moodle Fails in K-12: Problems Schools Cannot Ignore',
    description: 'Moodle was built for universities, not K-12. Outdated UX, no mobile app, plugin nightmares, and IT overhead make it wrong.',
    keywords: ['moodle problems k-12', 'moodle issues schools', 'moodle not for k-12', 'moodle k-12 problems', 'moodle outdated'],
    heroText: 'Moodle was designed for university lecture courses in 2002. K-12 in 2026 needs age-adaptive interfaces, gamification, mobile apps, offline learning, and AI tutoring. Moodle offers none of these without extensive custom development.',
    features: ['Built for Canadian Schools', 'Gamification & XP', 'Curriculum-Aligned Content', 'Interactive Courses & Quizzes', 'Parent Portal', 'Spaced Repetition Flashcards'],
    whyExtra: 'Moodle\'s fundamental architecture was designed for a university model: instructor creates course, students log in and complete activities. This model does not translate well to K-12 for several reasons. The interface is complex and intimidating for younger students — there is no age-adaptive UI. There is no native mobile app, and the mobile-web experience is poor. Gamification requires plugins that may conflict with other plugins. There is no parent portal. There is no offline capability for rural schools. And the administrative overhead of self-hosting means schools spend more time maintaining the technology than using it. WolfWhale was designed from day one for K-12: every interface, feature, and design decision was made with 5-to-18-year-old learners in mind.',
  },

  'moodle-vs-wolfwhale-cost': {
    competitor: 'Moodle',
    title: 'Moodle vs WolfWhale Total Cost — The Real Numbers',
    h1: 'Moodle vs WolfWhale: A Total Cost of Ownership Comparison',
    description: 'Moodle is "free" but costs $50–100/student when you add hosting, IT, and plugins. WolfWhale is $12/student, all included.',
    keywords: ['moodle vs wolfwhale cost', 'moodle total cost ownership', 'moodle vs wolfwhale price', 'moodle hidden costs', 'moodle true price'],
    heroText: 'The total cost of ownership for Moodle — hosting, IT staff, plugins, training, and maintenance — often reaches $50–100+ per student per year. WolfWhale is $12/student/year with everything included. The math speaks for itself.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gradebook & Analytics', 'Canadian Data Sovereignty', 'Gamification & XP', 'FERPA & PIPEDA Compliant'],
    whyExtra: 'Let us break down the real numbers for a 500-student school. Moodle: hosting $3,000–8,000/year, IT administration (0.25 FTE) $15,000–25,000/year, plugins and themes $1,500–3,000/year, security and SSL $500–1,000/year, training $1,000–2,000/year, content creation (teachers\' time) — priceless but significant. Total: $21,000–39,000/year, or $42–78/student. WolfWhale: $12/student x 500 = $6,000/year. Everything included — hosting, security, updates, support, 72 curriculum-aligned textbooks, on-device AI, gamification, gradebook, attendance, parent portal. Your school saves $15,000–33,000/year while gaining features Moodle cannot match at any price.',
  },

  // ==========================================================================
  // SCHOOLOGY / POWERSCHOOL (6 pages)
  // ==========================================================================

  'schoology-vs-wolfwhale': {
    competitor: 'Schoology',
    title: 'Schoology vs WolfWhale LMS — K-12 LMS Comparison',
    h1: 'Schoology vs WolfWhale: US Platform vs Canadian Purpose-Built LMS',
    description: 'Compare Schoology and WolfWhale for Canadian K-12. Schoology is US-owned. WolfWhale is Canadian with 72 textbooks.',
    keywords: ['schoology vs wolfwhale', 'schoology comparison', 'schoology alternative', 'schoology vs wolfwhale lms', 'schoology canada'],
    heroText: 'Schoology, now owned by PowerSchool (a US company), stores data on American servers and offers no Canadian curriculum content. WolfWhale is Canadian-built, Canadian-hosted, with 72 curriculum-aligned textbooks and on-device AI at $12/student/year.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Canadian Data Sovereignty', 'Gamification & XP', 'FERPA & PIPEDA Compliant', 'Gradebook & Analytics'],
    whyExtra: 'Schoology gained popularity in US schools as a well-designed LMS with good course management features. However, its acquisition by PowerSchool — a large US education technology company — has raised concerns about data privacy and corporate priorities. For Canadian schools, the issues are compounded: student data is processed on US servers, there is no Canadian curriculum alignment, and PowerSchool\'s product roadmap is driven by the US market. WolfWhale was built exclusively for Canadian K-12 schools. Our 72 original textbooks align to provincial curricula. Our on-device AI tutoring works offline. Our data stays in Canada. And at $12/student/year, our pricing reflects our commitment to accessibility, not shareholder returns.',
  },

  'schoology-privacy-canada': {
    competitor: 'Schoology',
    title: 'Schoology Privacy Concerns for Canadian Schools — FOIP & PIPEDA',
    h1: 'Schoology and Canadian Privacy: What PowerSchool Ownership Means',
    description: 'Schoology is owned by PowerSchool (US). Student data is on US servers. Learn the privacy risks for Canadian schools.',
    keywords: ['schoology privacy canada', 'schoology foip', 'schoology pipeda', 'powerschool privacy', 'schoology data concerns'],
    heroText: 'PowerSchool, the US company that owns Schoology, has faced data security scrutiny, and stores student data on American servers. For Canadian schools bound by FOIP and PIPEDA, this raises compliance concerns that demand attention.',
    features: ['Canadian Data Sovereignty', 'FERPA & PIPEDA Compliant', 'Built for Canadian Schools', 'Audit Logging', 'Multi-Tenant Architecture', 'Role-Based Access Control'],
    whyExtra: 'PowerSchool\'s acquisition of Schoology brought one of the most popular LMS platforms under the umbrella of a large US education data company. PowerSchool processes data for millions of students worldwide, and that data sits on US servers subject to US law. For Canadian schools governed by provincial FOIP legislation and federal PIPEDA, using a US-hosted platform for student data creates real compliance exposure. The risk is not theoretical — US law enforcement and intelligence agencies have broad authority to access data on US servers, regardless of contractual privacy commitments. WolfWhale provides a straightforward alternative: Canadian company, Canadian servers, Canadian law. Every feature is designed with FOIP and PIPEDA compliance as a foundation, not an afterthought.',
  },

  'switch-from-schoology': {
    competitor: 'Schoology',
    title: 'Switch from Schoology to WolfWhale — Migration Guide',
    h1: 'How to Switch from Schoology to WolfWhale LMS',
    description: 'Migrate from Schoology to WolfWhale with guided support. Gain Canadian data sovereignty, 72 textbooks, and AI tools.',
    keywords: ['switch from schoology', 'schoology migration', 'leave schoology', 'schoology to wolfwhale', 'replace schoology'],
    heroText: 'Moving from Schoology to WolfWhale means gaining Canadian data sovereignty, 72 curriculum-aligned textbooks, on-device AI tutoring, and gamification — all while keeping the course management features your teachers rely on.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gradebook & Analytics', 'Canadian Data Sovereignty', 'Interactive Courses & Quizzes', 'Attendance Tracking'],
    whyExtra: 'Our migration team makes the Schoology-to-WolfWhale transition seamless. We handle data exports — rosters, grade histories, and course structures — and set up your WolfWhale instance with your school\'s branding and configuration. Teachers who are used to Schoology\'s course management will find WolfWhale intuitive and familiar, with the added benefit of 72 built-in textbooks that eliminate content sourcing. The on-device AI tutoring, spaced repetition flashcards, and gamification system are features Schoology never offered. And the shift to Canadian data hosting gives your school division peace of mind on privacy compliance. We provide training sessions, migration support, and a dedicated success manager throughout the transition.',
  },

  'powerschool-vs-wolfwhale': {
    competitor: 'PowerSchool',
    title: 'PowerSchool vs WolfWhale LMS — Canadian K-12 Comparison',
    h1: 'PowerSchool vs WolfWhale: US Data Giant vs Canadian K-12 LMS',
    description: 'Compare PowerSchool and WolfWhale for Canadian K-12. PowerSchool is a US data company. WolfWhale is Canadian-built.',
    keywords: ['powerschool vs wolfwhale', 'powerschool comparison', 'powerschool alternative', 'powerschool lms comparison', 'powerschool canada'],
    heroText: 'PowerSchool is a US education data company that owns Schoology, among other products. WolfWhale is a Canadian K-12 LMS with 72 original textbooks, on-device AI, and guaranteed Canadian data sovereignty. The difference is not just features — it is philosophy.',
    features: ['Built for Canadian Schools', 'Canadian Data Sovereignty', 'Curriculum-Aligned Content', 'FERPA & PIPEDA Compliant', 'Gamification & XP', 'Gradebook & Analytics'],
    whyExtra: 'PowerSchool is one of the largest education technology companies in the world, serving over 45 million students globally. That scale means their priorities are driven by the US market, their product roadmap serves the broadest possible audience, and their infrastructure is US-based. For Canadian schools, this means using a platform that was not designed for Canadian curricula, stores data on US servers, and prices its products for US school district budgets. WolfWhale takes the opposite approach: we serve Canadian K-12 exclusively. Our 72 textbooks align to provincial curricula. Our data stays in Canada. Our on-device AI tutoring works offline for rural communities. And at $12/student/year, we are accessible to every school division, from large urban districts to small rural communities.',
  },

  'powerschool-alternative-canada': {
    competitor: 'PowerSchool',
    title: 'PowerSchool Alternative for Canadian Schools — WolfWhale LMS',
    h1: 'Canadian Schools: The PowerSchool Alternative Built for You',
    description: 'WolfWhale is the Canadian-built PowerSchool alternative with data sovereignty, 72 textbooks, and $12/student pricing.',
    keywords: ['powerschool alternative canada', 'powerschool replacement', 'powerschool substitute', 'canadian powerschool alternative', 'powerschool alternative'],
    heroText: 'Canadian schools deserve an LMS built by Canadians, for Canadians. WolfWhale replaces PowerSchool\'s LMS offerings with 72 curriculum-aligned textbooks, on-device AI, cognitive load theory lessons, and guaranteed Canadian data sovereignty.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Canadian Data Sovereignty', 'FERPA & PIPEDA Compliant', 'Parent Portal', 'Attendance Tracking'],
    whyExtra: 'PowerSchool has built an empire by acquiring education technology companies and bundling their products. But consolidation does not equal innovation, and scale does not equal fit. Canadian schools using PowerSchool products are using US-designed tools adapted for a Canadian context, not Canadian-designed tools built for Canadian classrooms. WolfWhale was founded on Treaty 6 territory in Saskatchewan by educators who have lived the challenges of Canadian K-12 education — from rural connectivity gaps to Indigenous education priorities to provincial curriculum requirements. Our 72 original textbooks, on-device AI, and offline learning capability are features born from real Canadian classroom needs, not US market research.',
  },

  'powerschool-lms-pricing': {
    competitor: 'PowerSchool',
    title: 'PowerSchool LMS Pricing vs WolfWhale — Cost Comparison 2026',
    h1: 'PowerSchool Pricing vs WolfWhale: What Does Value Look Like?',
    description: 'PowerSchool LMS pricing is enterprise-tier with bundled products. WolfWhale is $12/student/year, all-inclusive. Compare value.',
    keywords: ['powerschool pricing', 'powerschool lms cost', 'powerschool pricing comparison', 'powerschool vs wolfwhale price', 'schoology pricing'],
    heroText: 'PowerSchool sells bundled enterprise packages with opaque pricing. WolfWhale is transparent: $12/student/year for everything — 72 textbooks, on-device AI, gamification, gradebook, parent portal, and Canadian hosting. No bundles, no surprises.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gradebook & Analytics', 'Gamification & XP', 'Interactive Courses & Quizzes', 'FERPA & PIPEDA Compliant'],
    whyExtra: 'PowerSchool\'s pricing model is built on product bundles — schools often must purchase packages that include tools they do not need to access the ones they do. Contract negotiations can take months, and pricing varies widely based on district size, product bundle, and negotiation leverage. WolfWhale takes a fundamentally different approach to pricing: $12/student/year, everything included, no bundles, no negotiation, no hidden costs. That price covers 72 curriculum-aligned textbooks, on-device AI tutoring, spaced repetition flashcards, gamification with XP and leveling, gradebook analytics, attendance tracking, parent portal, and Canadian data hosting. We believe every Canadian school deserves access to the best learning technology, regardless of budget or negotiating power.',
  },

  // ==========================================================================
  // GENERAL COMPETITOR PAGES (6 pages)
  // ==========================================================================

  'best-lms-canada-2026': {
    competitor: 'General',
    title: 'Best LMS in Canada 2026 — Top K-12 Learning Platforms Ranked',
    h1: 'Best LMS in Canada 2026: The Definitive Ranking for K-12',
    description: 'Compare the best LMS platforms for Canadian K-12 in 2026. Data sovereignty, content, pricing, and features compared.',
    keywords: ['best lms canada 2026', 'top lms canada', 'canadian lms ranking', 'best k-12 lms canada', 'lms comparison canada 2026'],
    heroText: 'Canadian schools have more LMS options than ever in 2026 — but most were not built for Canadian classrooms. We compare the top platforms on data sovereignty, curriculum alignment, pricing, AI tools, and K-12 suitability to help you choose.',
    features: ['Built for Canadian Schools', 'Canadian Data Sovereignty', 'Curriculum-Aligned Content', 'FERPA & PIPEDA Compliant', 'Gamification & XP', 'Gradebook & Analytics'],
    whyExtra: 'The Canadian K-12 LMS market in 2026 includes Canvas (US, university-focused), Brightspace (Canadian, enterprise-focused), Edsby (Canadian, SIS-focused), Google Classroom (free, limited), Moodle (open source, self-hosted), and Schoology/PowerSchool (US, bundled). WolfWhale stands apart as the only platform that combines Canadian data sovereignty, 72 original curriculum-aligned textbooks, on-device AI tutoring, cognitive load theory lesson design, gamification, offline learning, and $12/student/year pricing. No other platform offers all of these in a single product. For Canadian K-12 schools that need a complete learning ecosystem — not just a platform — WolfWhale is the clear choice in 2026.',
  },

  'lms-comparison-canada': {
    competitor: 'General',
    title: 'Canadian LMS Comparison Guide — Canvas, Brightspace, Edsby & More',
    h1: 'Canadian LMS Comparison: Every Major Platform Reviewed',
    description: 'Side-by-side comparison of every major LMS available to Canadian schools. Features, pricing, data sovereignty, and more.',
    keywords: ['lms comparison canada', 'canadian lms comparison', 'compare lms canada', 'lms comparison chart', 'school lms comparison'],
    heroText: 'Choosing an LMS for your Canadian school is one of the most important technology decisions you will make. This guide compares every major platform on the features that matter most: data sovereignty, curriculum content, pricing, and K-12 suitability.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Canadian Data Sovereignty', 'Gradebook & Analytics', 'FERPA & PIPEDA Compliant', 'Interactive Courses & Quizzes'],
    whyExtra: 'Our comparison evaluates each platform across the criteria that matter most to Canadian K-12 schools. Data sovereignty: only WolfWhale and Edsby guarantee Canadian data hosting (Brightspace is Canadian but uses mixed infrastructure). Curriculum alignment: only WolfWhale includes 72 original textbooks aligned to provincial curricula. Pricing: WolfWhale is $12/student/year, Google Classroom is free (with limitations), and the rest range from $15 to $40+ per student. AI tools: only WolfWhale offers on-device AI tutoring. Offline learning: only WolfWhale works without internet. Gamification: only WolfWhale has a built-in XP and leveling system. Every school has unique needs, but for Canadian K-12 schools that want a complete, affordable, privacy-compliant learning platform, WolfWhale offers unmatched value.',
  },

  'best-lms-k12-2026': {
    competitor: 'General',
    title: 'Best K-12 LMS 2026 — Top Platforms for Elementary & High School',
    h1: 'Best K-12 LMS in 2026: What Schools Actually Need',
    description: 'The best K-12 LMS in 2026 includes textbooks, AI, gamification, and age-adaptive design. See which platforms deliver.',
    keywords: ['best k-12 lms 2026', 'best lms for schools', 'top lms k-12', 'elementary school lms', 'high school lms'],
    heroText: 'K-12 is not a niche within education — it is the foundation. The best K-12 LMS in 2026 must handle Kindergarten through Grade 12 with age-adaptive design, built-in content, AI tutoring, gamification, and offline capability.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Gamification & XP', 'Spaced Repetition Flashcards', 'Interactive Courses & Quizzes', 'Parent Portal'],
    whyExtra: 'Most LMS platforms were built for universities and adapted for K-12. This approach fails because K-12 is fundamentally different from higher education. A Grade 1 student needs a completely different experience than a university freshman. The best K-12 LMS must provide age-adaptive interfaces, engagement tools like gamification, parent communication portals, curriculum-aligned content, offline capability for rural communities, and AI tutoring that works safely for minors. WolfWhale is the only platform in 2026 that checks every one of these boxes. Our 72 original textbooks cover every core subject from Kindergarten through Grade 12. Our on-device AI processes data locally, never sending student information to external servers. And our cognitive load theory lesson design ensures every student learns at their optimal pace.',
  },

  'lms-comparison-saskatchewan': {
    competitor: 'General',
    province: 'Saskatchewan',
    title: 'Best LMS for Saskatchewan Schools — SK LMS Comparison 2026',
    h1: 'Saskatchewan LMS Comparison: Which Platform Is Right for SK Schools?',
    description: 'Compare LMS platforms for Saskatchewan schools. SK curriculum alignment, FOIP compliance, and rural connectivity matter.',
    keywords: ['saskatchewan lms', 'sk school lms', 'best lms saskatchewan', 'lms comparison saskatchewan', 'saskatchewan education technology'],
    heroText: 'Saskatchewan schools face unique challenges: vast distances, rural connectivity gaps, diverse communities including a significant Indigenous population, and SK-specific curriculum requirements. The right LMS must address all of these — not just deliver content.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Canadian Data Sovereignty', 'FERPA & PIPEDA Compliant', 'Gamification & XP', 'Attendance Tracking'],
    whyExtra: 'Saskatchewan is home to over 750 schools serving approximately 180,000 students across a vast geographic area. Many communities lack reliable high-speed internet. Indigenous students make up nearly 30% of the school population, and Treaty responsibilities demand meaningful representation in educational content. SK has its own curriculum distinct from other provinces. These realities must inform LMS selection. WolfWhale was built in Saskatchewan on Treaty 6 territory specifically to address these needs. Our offline learning with on-device AI serves rural and remote communities. Our First Nations ownership ensures Indigenous perspectives are authentic, not performative. Our 72 textbooks are aligned to Saskatchewan curriculum outcomes. And our $12/student/year pricing ensures every SK school division — from Saskatoon to the smallest northern community — can access world-class learning technology.',
  },

  'best-lms-indigenous-education': {
    competitor: 'General',
    title: 'Best LMS for Indigenous Education — First Nations Owned Platform',
    h1: 'The Best LMS for Indigenous Education Is First Nations Owned',
    description: 'WolfWhale is the only First Nations owned K-12 LMS. Built on Treaty 6 territory with Indigenous perspectives throughout.',
    keywords: ['indigenous education lms', 'first nations lms', 'indigenous learning platform', 'lms for indigenous students', 'reconciliation education technology'],
    heroText: 'Representation in education technology matters. WolfWhale is the only K-12 LMS that is First Nations owned, built on Treaty 6 territory, with Indigenous perspectives woven throughout its 72 original textbooks — not added as an afterthought module.',
    features: ['Built for Canadian Schools', 'Curriculum-Aligned Content', 'Canadian Data Sovereignty', 'FERPA & PIPEDA Compliant', 'Gamification & XP', 'Interactive Courses & Quizzes'],
    whyExtra: 'Indigenous education is not a feature to be checked off — it is a responsibility to be honoured. Most LMS platforms treat Indigenous content as a supplementary module or optional add-on, if they address it at all. WolfWhale is different because our company is different. As a First Nations owned company built on Treaty 6 territory in Saskatchewan, Indigenous perspectives are not something we add to our product — they are part of who we are. Our 72 original textbooks integrate Indigenous knowledge, perspectives, and connections throughout the curriculum, reflecting the TRC Calls to Action. Our offline learning capability serves remote First Nations communities where internet access is limited. Our on-device AI ensures student data from Indigenous communities stays private and sovereign. And our $12/student/year pricing ensures Indigenous schools — which are often the most under-resourced — have equal access to the best learning technology available.',
  },

  'lms-with-textbooks': {
    competitor: 'General',
    title: 'The Only LMS With Built-In Textbooks — WolfWhale LMS',
    h1: 'WolfWhale: The Only LMS That Includes Its Own Textbooks',
    description: 'WolfWhale is the only LMS with 72 built-in curriculum-aligned textbooks. No extra content costs. No third-party licenses.',
    keywords: ['lms with textbooks', 'lms includes content', 'lms with built-in content', 'lms textbook included', 'lms no content costs'],
    heroText: 'Every other LMS is an empty platform — teachers must find, buy, or build all content. WolfWhale is the only LMS that includes 72 original, curriculum-aligned textbooks covering every core subject from Kindergarten through Grade 12.',
    features: ['Curriculum-Aligned Content', 'Built for Canadian Schools', 'Interactive Courses & Quizzes', 'Spaced Repetition Flashcards', 'Gamification & XP', 'Gradebook & Analytics'],
    whyExtra: 'The dirty secret of the LMS industry is that buying a platform is just the beginning. Canvas, Brightspace, Edsby, Schoology, Google Classroom, and Moodle all sell you an empty container — the content is your problem. Schools spend thousands of dollars on third-party textbook licenses, digital resource subscriptions, and teacher time creating original content. WolfWhale breaks this model entirely. Our 72 original textbooks, published by WolfWhale Books, cover Math, Science, ELA, Social Studies, Health, Arts, PE, Career Education, and French from Kindergarten through Grade 12. Every textbook is aligned to provincial curricula, designed using cognitive load theory, and enhanced with quizzes, activities, flashcards, and Indigenous connections. No other LMS in the world includes its own complete textbook library. At $12/student/year, WolfWhale does not just save you the platform cost — it saves you the content cost that every other LMS forces you to pay on top.',
  },
}
