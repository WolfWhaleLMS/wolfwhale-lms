import type { PageData } from './seo-pages'

export const METHODOLOGY_PAGES: Record<string, PageData> = {
  // -------------------------------------------------------------------------
  // TEACHING METHODOLOGIES
  // -------------------------------------------------------------------------

  'differentiated-instruction-technology': {
    title: 'Differentiated Instruction Technology | WolfWhale LMS',
    h1: 'Differentiated Instruction Made Simple with WolfWhale',
    description:
      'Deliver differentiated instruction at scale with WolfWhale LMS. Adaptive pathways, tiered assignments, and real-time analytics for every learner.',
    keywords: [
      'differentiated instruction technology',
      'differentiated instruction LMS',
      'tiered instruction platform',
      'adaptive learning Canada',
      'differentiated learning software',
      'student-centered instruction tools',
    ],
    heroText:
      'Every student learns differently, and your LMS should reflect that. WolfWhale gives teachers the tools to tier content, adjust pacing, and track mastery across multiple readiness levels — all within a single classroom dashboard.',
    features: [
      'Curriculum-Aligned Content',
      'Gradebook & Analytics',
      'Interactive Courses & Quizzes',
      'Gamification & XP',
      'Role-Based Access Control',
      'Parent Portal',
    ],
    whyExtra:
      'WolfWhale was built from the ground up to support differentiated instruction without adding teacher workload. Our 72 original textbooks include built-in scaffolding, vocabulary callouts, and tiered quiz questions that automatically adapt to student performance. With on-device AI processing and spaced repetition flashcards, each student receives a personalized review cycle tuned to their retention curve. Teachers see real-time mastery data across every outcome, making it easy to regroup students and assign targeted interventions — no spreadsheets required.',
  },

  'universal-design-for-learning': {
    title: 'Universal Design for Learning (UDL) Platform | WolfWhale LMS',
    h1: 'A UDL-Aligned Learning Management System for Canadian Schools',
    description:
      'Apply Universal Design for Learning principles with WolfWhale. Multiple means of engagement, representation, and action built into every lesson.',
    keywords: [
      'universal design for learning LMS',
      'UDL platform',
      'UDL technology for schools',
      'accessible learning management system',
      'inclusive education technology Canada',
      'UDL curriculum tools',
    ],
    heroText:
      'Universal Design for Learning calls for multiple means of engagement, representation, and action. WolfWhale embeds all three into every lesson with interactive content blocks, gamified progression, and flexible assessment options.',
    features: [
      'Interactive Courses & Quizzes',
      'Gamification & XP',
      'Curriculum-Aligned Content',
      'Gradebook & Analytics',
      'FERPA & PIPEDA Compliant',
      'Parent Portal',
    ],
    whyExtra:
      'UDL is more than an accessibility checkbox — it is a design philosophy that shapes how content is authored, delivered, and assessed. WolfWhale textbooks use a modular content-block architecture (headings, callouts, activities, quizzes, lists, and images) so teachers can present the same concept through multiple representations without rebuilding lessons. Gamification and XP systems provide intrinsic motivation pathways, while the parent portal keeps families informed and engaged. Because WolfWhale is PIPEDA-compliant and stores data on Canadian servers, schools can implement UDL strategies without compromising student privacy.',
  },

  'project-based-learning-lms': {
    title: 'Project-Based Learning LMS | WolfWhale',
    h1: 'Power Project-Based Learning with WolfWhale LMS',
    description:
      'Run project-based learning units with built-in rubrics, milestone tracking, and collaborative tools. Canadian curriculum-aligned PBL platform.',
    keywords: [
      'project-based learning LMS',
      'PBL platform Canada',
      'project-based learning technology',
      'PBL rubrics and tracking',
      'collaborative learning platform',
      'PBL for K-12',
    ],
    heroText:
      'Project-based learning transforms students from passive recipients into active problem-solvers. WolfWhale provides the scaffolding PBL demands — milestone tracking, curriculum-aligned rubrics, and collaborative workspaces — so teachers can focus on mentoring, not managing logistics.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Gradebook & Analytics',
      'Interactive Courses & Quizzes',
      'Role-Based Access Control',
      'Attendance Tracking',
    ],
    whyExtra:
      'Effective PBL requires more than a shared document — it needs structure. WolfWhale lets teachers design multi-week projects with clear milestones tied to specific curriculum outcomes. Students track their own progress through a gamified XP system that rewards effort and iteration, not just final products. Our gradebook captures formative checkpoints alongside summative deliverables, giving teachers a holistic view of each student\'s growth. At $12 per student per year, WolfWhale makes PBL infrastructure affordable for every school, from urban centres to remote northern communities.',
  },

  'inquiry-based-learning-technology': {
    title: 'Inquiry-Based Learning Technology | WolfWhale LMS',
    h1: 'Support Inquiry-Based Learning with WolfWhale',
    description:
      'Foster student-driven inquiry with guided questions, research tools, and formative check-ins. Inquiry-based learning technology for Canadian K-12.',
    keywords: [
      'inquiry-based learning technology',
      'inquiry learning platform',
      'guided inquiry LMS',
      'student-driven learning tools',
      'inquiry-based education Canada',
      'discovery learning software',
    ],
    heroText:
      'Inquiry-based learning puts questions before answers. WolfWhale structures the inquiry cycle — ask, investigate, create, discuss, reflect — with embedded prompts, formative quizzes, and cognitive-load-optimized content that keeps curiosity alive without overwhelming learners.',
    features: [
      'Interactive Courses & Quizzes',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gradebook & Analytics',
      'Built for Canadian Schools',
      'Gamification & XP',
    ],
    whyExtra:
      'Inquiry learning fails when students hit dead ends without support or when teachers cannot monitor twenty different investigations at once. WolfWhale solves both problems. Our 72 textbooks include inquiry-ready activity blocks that guide students through structured and open inquiry cycles while staying anchored to Saskatchewan and pan-Canadian curriculum outcomes. Teachers see real-time progress dashboards that flag students who are stuck, allowing just-in-time intervention. Spaced repetition flashcards ensure that vocabulary and key concepts discovered during inquiry are retained long after the unit ends.',
  },

  'flipped-classroom-technology': {
    title: 'Flipped Classroom Technology | WolfWhale LMS',
    h1: 'Flip Your Classroom with WolfWhale LMS',
    description:
      'Deliver pre-class content and track completion with WolfWhale. Purpose-built flipped classroom technology for Canadian teachers.',
    keywords: [
      'flipped classroom technology',
      'flipped classroom LMS',
      'flipped learning platform',
      'pre-class content delivery',
      'blended learning Canada',
      'flipped instruction tools',
    ],
    heroText:
      'The flipped classroom moves direct instruction home so class time becomes active learning time. WolfWhale delivers pre-class readings with built-in comprehension checks, then gives teachers a clear picture of who is prepared before the bell rings.',
    features: [
      'Interactive Courses & Quizzes',
      'Curriculum-Aligned Content',
      'Gradebook & Analytics',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
      'Attendance Tracking',
    ],
    whyExtra:
      'Flipped classrooms only work when students actually engage with pre-class material. WolfWhale textbooks are designed with cognitive load theory in mind — lessons are chunked into digestible content blocks with embedded quizzes that confirm understanding before students move on. Teachers receive completion reports showing exactly who read the material and how they performed on comprehension checks, enabling targeted warm-up activities. The parent portal keeps families aware of nightly assignments, and offline mode ensures students without reliable internet can download lessons at school and complete them at home.',
  },

  'competency-based-education': {
    title: 'Competency-Based Education Platform | WolfWhale LMS',
    h1: 'Competency-Based Education with WolfWhale',
    description:
      'Track mastery, not seat time. WolfWhale supports competency-based education with outcome-level tracking and flexible pacing for every student.',
    keywords: [
      'competency-based education platform',
      'CBE LMS',
      'mastery-based learning system',
      'competency tracking software',
      'outcome-based education Canada',
      'flexible pacing LMS',
    ],
    heroText:
      'Competency-based education measures what students know, not how long they sat in class. WolfWhale tracks mastery at the outcome level across 682 Saskatchewan curriculum outcomes, letting students advance when they demonstrate understanding.',
    features: [
      'Curriculum-Aligned Content',
      'Gradebook & Analytics',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Role-Based Access Control',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Moving to competency-based education requires an LMS that can track granular mastery data and communicate progress clearly to students, teachers, and parents. WolfWhale maps every quiz, assignment, and flashcard set to specific curriculum outcomes, building a real-time competency profile for each learner. Teachers can set mastery thresholds and allow students to re-attempt assessments until they demonstrate proficiency. The gradebook displays competency progress alongside traditional grades, easing the transition for schools that are adopting CBE incrementally. With five user roles and multi-tenant architecture, WolfWhale scales from a single pilot classroom to an entire division.',
  },

  'personalized-learning-platform': {
    title: 'Personalized Learning Platform for Schools | WolfWhale LMS',
    h1: 'Personalized Learning at Scale with WolfWhale',
    description:
      'Personalize learning paths with on-device AI, adaptive flashcards, and curriculum-aligned content. Built for Canadian K-12 schools.',
    keywords: [
      'personalized learning platform',
      'adaptive learning LMS',
      'personalized education technology',
      'AI learning platform Canada',
      'student-centered LMS',
      'individualized learning software',
    ],
    heroText:
      'True personalized learning adapts to each student without creating unsustainable workloads for teachers. WolfWhale uses on-device AI and spaced repetition algorithms to tailor review schedules, surface knowledge gaps, and recommend next steps — all while keeping student data private and on Canadian soil.',
    features: [
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Curriculum-Aligned Content',
      'Canadian Data Sovereignty',
      'Gradebook & Analytics',
      'Interactive Courses & Quizzes',
    ],
    whyExtra:
      'Personalized learning platforms often promise AI magic but deliver surveillance-heavy systems that ship student data offshore. WolfWhale takes a different approach. Our on-device AI runs locally, meaning student interaction data never leaves the device. Spaced repetition flashcards automatically adjust interval timing based on individual recall performance, ensuring each student reviews the right material at the right time. Combined with 72 curriculum-aligned textbooks and gamified XP progression, WolfWhale delivers genuine personalization at $12 per student per year — a fraction of the cost of adaptive platforms that charge per-module licensing fees.',
  },

  'formative-assessment-tools': {
    title: 'Formative Assessment Tools for Teachers | WolfWhale LMS',
    h1: 'Real-Time Formative Assessment with WolfWhale',
    description:
      'Embed formative assessments directly into lessons. Exit tickets, comprehension checks, and instant feedback — all curriculum-aligned.',
    keywords: [
      'formative assessment tools',
      'formative assessment LMS',
      'exit ticket software',
      'real-time student feedback',
      'assessment for learning technology',
      'formative assessment Canada',
    ],
    heroText:
      'Formative assessment should be seamless, not a separate app. WolfWhale embeds comprehension checks, exit tickets, and quick quizzes directly into every lesson, giving teachers instant feedback on student understanding without disrupting instructional flow.',
    features: [
      'Interactive Courses & Quizzes',
      'Gradebook & Analytics',
      'Curriculum-Aligned Content',
      'Gamification & XP',
      'Attendance Tracking',
      'Parent Portal',
    ],
    whyExtra:
      'The best formative assessment happens in the moment, not after students have moved on. WolfWhale textbooks include quiz blocks embedded at natural pause points within each chapter — after a key concept introduction, before a new topic begins, or at the end of a section. Teachers see aggregated results in real time, making it possible to adjust instruction mid-lesson. Unlike standalone assessment tools that require students to switch apps, WolfWhale keeps everything in one place. Quiz results feed directly into the gradebook and contribute to the student\'s XP progression, turning low-stakes checks into motivating learning moments.',
  },

  'summative-assessment-technology': {
    title: 'Summative Assessment Technology | WolfWhale LMS',
    h1: 'Summative Assessment Made Reliable with WolfWhale',
    description:
      'Build, deliver, and grade summative assessments tied to curriculum outcomes. Secure, PIPEDA-compliant assessment technology for Canadian schools.',
    keywords: [
      'summative assessment technology',
      'summative assessment LMS',
      'online exam platform schools',
      'curriculum-aligned assessment tools',
      'secure assessment software Canada',
      'end-of-unit assessment platform',
    ],
    heroText:
      'Summative assessments carry high stakes and demand reliable infrastructure. WolfWhale provides secure, curriculum-aligned assessment delivery with automatic grading, outcome-level reporting, and offline capability for schools with unreliable connectivity.',
    features: [
      'Interactive Courses & Quizzes',
      'Gradebook & Analytics',
      'FERPA & PIPEDA Compliant',
      'Curriculum-Aligned Content',
      'Canadian Data Sovereignty',
      'Role-Based Access Control',
    ],
    whyExtra:
      'Summative assessments need to be both rigorous and fair. WolfWhale lets teachers build end-of-unit and end-of-term assessments from a bank of curriculum-aligned questions, with each item mapped to specific learning outcomes. Results are automatically scored and broken down by outcome, showing teachers and administrators exactly where students met expectations and where gaps remain. Because WolfWhale works offline, students in northern and remote communities can complete assessments without worrying about connectivity drops invalidating their work. All assessment data is stored on Canadian servers and protected by PIPEDA-compliant security policies.',
  },

  'backwards-design-education': {
    title: 'Backwards Design & Understanding by Design LMS | WolfWhale',
    h1: 'Backwards Design Starts with WolfWhale',
    description:
      'Plan with the end in mind. WolfWhale aligns content, assessments, and activities to curriculum outcomes using backwards design principles.',
    keywords: [
      'backwards design education',
      'understanding by design LMS',
      'UbD planning tools',
      'backwards design curriculum planning',
      'outcome-aligned instruction',
      'Wiggins and McTighe technology',
    ],
    heroText:
      'Understanding by Design begins with desired results and works backward to learning activities. WolfWhale is structured around this principle — every textbook chapter starts with curriculum outcomes and builds toward mastery through carefully sequenced content, activities, and assessments.',
    features: [
      'Curriculum-Aligned Content',
      'Interactive Courses & Quizzes',
      'Gradebook & Analytics',
      'Built for Canadian Schools',
      'Spaced Repetition Flashcards',
      'Role-Based Access Control',
    ],
    whyExtra:
      'Backwards design is elegant in theory but difficult to implement when your LMS treats content and assessment as separate silos. WolfWhale was authored with backwards design as a foundational assumption. Each of our 72 textbooks maps directly to provincial curriculum outcomes, and every chapter includes embedded assessments that measure exactly what the outcomes demand. Teachers do not need to reverse-engineer alignment — it is already done. The gradebook reports mastery by outcome rather than by assignment, making it easy to verify that instruction achieved its intended results. For teachers who want to customize, WolfWhale\'s content-block architecture makes it simple to rearrange, extend, or replace any lesson while maintaining outcome alignment.',
  },

  'social-emotional-learning-technology': {
    title: 'Social-Emotional Learning Technology | WolfWhale LMS',
    h1: 'Support Social-Emotional Learning with WolfWhale',
    description:
      'Integrate SEL into daily instruction with check-ins, reflective activities, and progress tracking. Safe, PIPEDA-compliant SEL technology.',
    keywords: [
      'social emotional learning technology',
      'SEL platform for schools',
      'SEL LMS',
      'student wellbeing technology',
      'social emotional learning tools Canada',
      'CASEL aligned technology',
    ],
    heroText:
      'Social-emotional learning cannot be a standalone program bolted onto the school day. WolfWhale integrates SEL into everyday instruction through reflective activities, collaborative projects, and a gamification system that rewards growth mindset behaviours — not just correct answers.',
    features: [
      'Gamification & XP',
      'Parent Portal',
      'Attendance Tracking',
      'FERPA & PIPEDA Compliant',
      'Interactive Courses & Quizzes',
      'Gradebook & Analytics',
    ],
    whyExtra:
      'Effective SEL requires safety, consistency, and visibility. WolfWhale provides all three. Our gamification system awards XP for effort, persistence, and collaboration — reinforcing the CASEL competencies of self-management and responsible decision-making. The parent portal gives families insight into their child\'s engagement patterns, opening conversations about school experience at home. Attendance tracking helps teachers identify students who may be disengaging before it becomes a crisis. Because WolfWhale is PIPEDA-compliant and First Nations owned (Treaty 6), schools can trust that sensitive student wellbeing data is handled with the cultural awareness and legal protections their communities expect.',
  },

  'trauma-informed-education-technology': {
    title: 'Trauma-Informed Education Technology | WolfWhale LMS',
    h1: 'Trauma-Informed Teaching with WolfWhale LMS',
    description:
      'Create predictable, safe digital learning environments. WolfWhale supports trauma-informed practices with consistent structure and student agency.',
    keywords: [
      'trauma-informed education technology',
      'trauma-informed LMS',
      'trauma-sensitive classroom tools',
      'safe learning environment technology',
      'trauma-informed teaching platform',
      'student safety LMS Canada',
    ],
    heroText:
      'Trauma-informed education demands predictability, safety, and student agency. WolfWhale delivers a consistent, low-anxiety digital environment where students know what to expect, control their own pacing, and never face public shaming through leaderboards or competitive mechanics.',
    features: [
      'FERPA & PIPEDA Compliant',
      'Canadian Data Sovereignty',
      'Parent Portal',
      'Gamification & XP',
      'Attendance Tracking',
      'Role-Based Access Control',
    ],
    whyExtra:
      'Many ed-tech platforms inadvertently re-traumatize students through unpredictable interfaces, public failure displays, and surveillance-style monitoring. WolfWhale was designed with trauma-informed principles from the start. Our gamification system uses personal XP progression rather than competitive leaderboards, so students compete only with their past selves. Cognitive load theory drives our lesson design, ensuring content is chunked into manageable pieces that reduce overwhelm. The platform\'s consistent navigation and predictable structure create the psychological safety that trauma-affected students need to engage. As a First Nations owned company operating on Treaty 6 territory, we understand the intergenerational trauma that many Indigenous students carry and have built our platform to honour that reality.',
  },

  'restorative-justice-education': {
    title: 'Restorative Justice in Education | WolfWhale LMS',
    h1: 'Restorative Practices Meet Digital Learning with WolfWhale',
    description:
      'Support restorative justice in schools with relationship-centred technology. Community building, reflection tools, and equitable assessment.',
    keywords: [
      'restorative justice education technology',
      'restorative practices schools',
      'restorative justice LMS',
      'relationship-centred education',
      'community building school technology',
      'equitable assessment tools',
    ],
    heroText:
      'Restorative practices prioritize relationships and community over punishment and compliance. WolfWhale supports this philosophy with assessment systems that value growth over perfection, reflection-based activities, and communication tools that keep families connected to the learning community.',
    features: [
      'Parent Portal',
      'Gradebook & Analytics',
      'Gamification & XP',
      'Attendance Tracking',
      'Built for Canadian Schools',
      'Interactive Courses & Quizzes',
    ],
    whyExtra:
      'Restorative justice in education requires tools that build community rather than sort students into winners and losers. WolfWhale\'s XP system rewards effort and improvement, not just achievement, reflecting the restorative belief that every student can grow. Our gradebook tracks mastery over time, allowing students to demonstrate learning through reassessment rather than being defined by a single poor performance. The parent portal facilitates transparent, ongoing communication between school and home — a critical component of the restorative circle. Attendance tracking helps identify patterns that may indicate a student needs support, enabling proactive outreach rather than reactive discipline.',
  },

  // -------------------------------------------------------------------------
  // SCHOOL TYPES
  // -------------------------------------------------------------------------

  'private-school-lms': {
    title: 'Private School LMS | WolfWhale Learning Management System',
    h1: 'The LMS Built for Canadian Private Schools',
    description:
      'WolfWhale LMS gives private schools curriculum-aligned content, parent communication, and analytics at $12/student/year. PIPEDA compliant.',
    keywords: [
      'private school LMS',
      'private school learning management system',
      'independent school LMS Canada',
      'private school technology',
      'private school curriculum platform',
      'affordable LMS private schools',
    ],
    heroText:
      'Private schools demand a premium learning experience without enterprise pricing. WolfWhale delivers 72 curriculum-aligned textbooks, a full gradebook, parent portal, and gamified student engagement at $12 per student per year — giving your school the technology infrastructure of a large division at a fraction of the cost.',
    features: [
      'Parent Portal',
      'Curriculum-Aligned Content',
      'Gradebook & Analytics',
      'Gamification & XP',
      'FERPA & PIPEDA Compliant',
      'Multi-Tenant Architecture',
    ],
    whyExtra:
      'Private schools face a unique challenge: parents expect cutting-edge technology, but budgets rarely match public division purchasing power. WolfWhale closes that gap. Our multi-tenant architecture means each school gets its own isolated environment with full administrative control, branded experience, and role-based access for teachers, students, parents, and administrators. The parent portal provides real-time visibility into grades, attendance, and learning progress — the transparency that private school families expect. At $12 per student per year with no per-module upsells, WolfWhale lets private schools invest their technology budgets in the classroom rather than in licensing fees.',
  },

  'independent-school-lms-canada': {
    title: 'Independent School LMS Canada | WolfWhale',
    h1: 'WolfWhale LMS for Canadian Independent Schools',
    description:
      'Canadian-built LMS for independent schools. Curriculum-aligned textbooks, data sovereignty, and five user roles at $12/student/year.',
    keywords: [
      'independent school LMS Canada',
      'Canadian independent school technology',
      'independent school learning platform',
      'CAIS school LMS',
      'independent school digital curriculum',
      'Canadian data sovereign LMS',
    ],
    heroText:
      'Canadian independent schools need an LMS that respects their autonomy while aligning to provincial curricula. WolfWhale offers 72 original textbooks mapped to Canadian learning outcomes, full data sovereignty on Canadian servers, and the flexibility to customize courses for your school\'s unique educational philosophy.',
    features: [
      'Canadian Data Sovereignty',
      'Curriculum-Aligned Content',
      'Multi-Tenant Architecture',
      'Gradebook & Analytics',
      'Parent Portal',
      'Role-Based Access Control',
    ],
    whyExtra:
      'Independent schools in Canada operate under provincial oversight while maintaining their own educational identity. WolfWhale supports both requirements. Our content is built on 70% pan-Canadian core curriculum (WNCP framework) with province-specific modules, so schools in any province can adopt it with confidence. The multi-tenant architecture ensures each school operates in its own secure environment with custom branding and administrative independence. Canadian data sovereignty means student records never cross the border — a critical consideration for schools that serve diplomatic, military, or privacy-conscious families. Five user roles (student, teacher, parent, admin, super-admin) provide the granular access control that independent school governance structures require.',
  },

  'homeschool-lms-canada': {
    title: 'Homeschool LMS Canada | WolfWhale',
    h1: 'The Complete Homeschool Platform for Canadian Families',
    description:
      'Homeschool with confidence using WolfWhale. 72 curriculum-aligned textbooks, progress tracking, and offline learning for Canadian families.',
    keywords: [
      'homeschool LMS Canada',
      'homeschool curriculum platform',
      'homeschool learning management system',
      'Canadian homeschool resources',
      'homeschool tracking software',
      'online homeschool program Canada',
    ],
    heroText:
      'Homeschooling families need curriculum confidence without institutional overhead. WolfWhale provides 72 Canadian curriculum-aligned textbooks, automatic progress tracking, and spaced repetition flashcards — everything you need to document learning and ensure your child meets provincial outcomes.',
    features: [
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Parent Portal',
      'Interactive Courses & Quizzes',
      'Gradebook & Analytics',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Canadian homeschool families face a constant challenge: proving that their children are meeting provincial curriculum outcomes. WolfWhale solves this with 72 textbooks that map directly to provincial learning objectives, complete with embedded quizzes that document mastery. The parent portal doubles as a teaching dashboard, giving homeschool parents the same gradebook and analytics tools that classroom teachers use. Spaced repetition flashcards handle the review cycle automatically, ensuring long-term retention without parent-managed drill schedules. Offline mode means learning continues on road trips, at the cabin, or anywhere else the homeschool classroom travels. At $12 per student per year, WolfWhale costs less than a single traditional textbook.',
  },

  'faith-based-school-lms': {
    title: 'Faith-Based School LMS | WolfWhale',
    h1: 'LMS for Faith-Based and Religious Schools in Canada',
    description:
      'WolfWhale LMS serves faith-based schools with curriculum-aligned content, privacy protection, and parent engagement tools. PIPEDA compliant.',
    keywords: [
      'faith-based school LMS',
      'religious school learning management system',
      'Catholic school LMS Canada',
      'Christian school technology',
      'faith-based education platform',
      'parochial school LMS',
    ],
    heroText:
      'Faith-based schools integrate spiritual formation with academic excellence. WolfWhale provides the academic infrastructure — 72 curriculum-aligned textbooks, gradebook, and analytics — while giving your school the flexibility to layer faith-specific content and values into every course.',
    features: [
      'Curriculum-Aligned Content',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
      'Multi-Tenant Architecture',
      'Gradebook & Analytics',
      'Role-Based Access Control',
    ],
    whyExtra:
      'Faith-based schools need technology that serves their mission without compromising their values. WolfWhale\'s multi-tenant architecture gives each school full control over its learning environment, including the ability to add supplementary faith-based content alongside curriculum-aligned material. The parent portal is especially important for religious school communities where family involvement in education is a core value — parents see grades, attendance, and learning progress in real time. PIPEDA compliance and Canadian data sovereignty ensure that student information is protected by Canadian privacy law, not subject to foreign government access requests. Our content is values-neutral by design, providing the academic core that faith-based schools can build upon with their own spiritual curriculum.',
  },

  'alternative-school-lms': {
    title: 'Alternative School LMS | WolfWhale',
    h1: 'Flexible LMS for Alternative Schools',
    description:
      'WolfWhale supports alternative schools with flexible pacing, competency tracking, and student-centred design. Built for non-traditional learning.',
    keywords: [
      'alternative school LMS',
      'alternative education technology',
      'flexible learning platform',
      'non-traditional school LMS',
      'self-paced learning management system',
      'alternative school curriculum platform',
    ],
    heroText:
      'Alternative schools exist because one size does not fit all. WolfWhale matches that philosophy with flexible pacing, competency-based tracking, and a gamification system that motivates students who have disengaged from traditional schooling.',
    features: [
      'Gamification & XP',
      'Gradebook & Analytics',
      'Curriculum-Aligned Content',
      'Attendance Tracking',
      'Interactive Courses & Quizzes',
      'Role-Based Access Control',
    ],
    whyExtra:
      'Alternative schools serve students who have not thrived in conventional settings — and those students need technology that feels different too. WolfWhale\'s XP and gamification system provides the dopamine feedback loop that re-engages disaffected learners, turning daily progress into visible achievement. Flexible pacing means students can accelerate through content they already understand and slow down where they need support, without being locked into a class-wide schedule. The gradebook tracks competency mastery rather than just assignment completion, giving alternative school educators the evidence they need to demonstrate that their students are meeting curriculum outcomes through non-traditional pathways. Attendance tracking helps schools maintain accountability with provincial authorities while honouring flexible scheduling.',
  },

  'virtual-school-platform': {
    title: 'Virtual School Platform | WolfWhale LMS',
    h1: 'Complete Virtual School Platform for Canadian Education',
    description:
      'Run a fully virtual school on WolfWhale. Async content, live assessments, gradebook, and parent portal — all PIPEDA compliant and Canadian-hosted.',
    keywords: [
      'virtual school platform',
      'online school LMS Canada',
      'virtual learning management system',
      'virtual school software',
      'online school platform',
      'asynchronous learning platform Canada',
    ],
    heroText:
      'Virtual schools need more than a video call and a file share. WolfWhale provides the complete infrastructure — 72 textbooks for asynchronous learning, embedded assessments, a full gradebook, attendance tracking, and a parent portal — everything a virtual school needs to operate as a credible educational institution.',
    features: [
      'Interactive Courses & Quizzes',
      'Gradebook & Analytics',
      'Attendance Tracking',
      'Parent Portal',
      'Canadian Data Sovereignty',
      'Curriculum-Aligned Content',
    ],
    whyExtra:
      'Virtual schools learned during the pandemic that stitching together Zoom, Google Classroom, and a dozen other tools creates administrative chaos and learning gaps. WolfWhale consolidates the entire virtual school operation into a single platform. Students access curriculum-aligned textbooks with embedded quizzes and activities asynchronously, completing work at their own pace. Teachers monitor progress through real-time dashboards and the gradebook tracks both formative and summative assessment data. The parent portal keeps remote families connected to their child\'s education, and attendance tracking provides the documentation that provincial regulators require. Canadian data sovereignty ensures compliance with provincial education privacy legislation.',
  },

  'montessori-education-technology': {
    title: 'Montessori Education Technology | WolfWhale LMS',
    h1: 'Technology That Respects Montessori Principles',
    description:
      'WolfWhale supports Montessori schools with self-paced learning, mastery tracking, and minimal-distraction design. Student-led, teacher-guided.',
    keywords: [
      'Montessori education technology',
      'Montessori LMS',
      'Montessori school software',
      'self-paced learning Montessori',
      'Montessori digital tools',
      'Montessori progress tracking',
    ],
    heroText:
      'Montessori education values self-directed learning, intrinsic motivation, and mastery at the child\'s own pace. WolfWhale honours these principles with a clean, distraction-free interface, self-paced content progression, and mastery tracking that replaces traditional grading with competency-based records.',
    features: [
      'Curriculum-Aligned Content',
      'Gradebook & Analytics',
      'Spaced Repetition Flashcards',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
      'Role-Based Access Control',
    ],
    whyExtra:
      'Many ed-tech platforms contradict Montessori philosophy with flashy animations, competitive leaderboards, and teacher-controlled pacing. WolfWhale takes a different approach. Our cognitive load theory-based lesson design presents content in clean, well-structured blocks that minimize distraction. Students navigate at their own pace, choosing when to move forward and when to revisit material. Spaced repetition flashcards support the Montessori emphasis on deep retention over surface-level memorization. The gradebook can be configured to track competency mastery rather than letter grades, aligning with Montessori assessment practices. For upper elementary and adolescent Montessori programs that need to document provincial curriculum alignment, our 72 textbooks provide that coverage without sacrificing pedagogical philosophy.',
  },

  'small-school-lms': {
    title: 'Small School LMS | WolfWhale',
    h1: 'Enterprise LMS Features at Small School Prices',
    description:
      'WolfWhale gives small schools under 100 students the same LMS features as large divisions. 72 textbooks, gradebook, and parent portal at $12/student.',
    keywords: [
      'small school LMS',
      'LMS for small schools',
      'affordable school LMS',
      'small school technology',
      'rural school learning management system',
      'budget LMS for schools',
    ],
    heroText:
      'Small schools deserve the same technology as large divisions without the large division price tag. WolfWhale delivers a complete LMS — 72 textbooks, gradebook, parent portal, attendance tracking, and gamification — starting at $12 per student per year with no minimum seat requirements.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Gradebook & Analytics',
      'Parent Portal',
      'Attendance Tracking',
      'Gamification & XP',
    ],
    whyExtra:
      'Small schools are the backbone of rural Canada, yet most LMS vendors either ignore them or price them out with minimum seat requirements and per-module licensing. WolfWhale charges a flat $12 per student per year with no minimums — a school with 30 students pays $360 annually for the same platform that serves schools with 500 students. Our 72 original textbooks eliminate the need to purchase separate digital curriculum resources, and the built-in gradebook replaces standalone grading software. For the multi-grade teacher juggling three or four grades in one classroom, WolfWhale\'s self-paced content and outcome-level tracking make differentiated instruction manageable rather than heroic.',
  },

  'northern-remote-school-technology': {
    title: 'Northern & Remote School Technology | WolfWhale LMS',
    h1: 'LMS Built for Northern and Remote Canadian Schools',
    description:
      'WolfWhale works offline, runs on low bandwidth, and stores data in Canada. Purpose-built technology for northern and remote schools.',
    keywords: [
      'northern remote school technology',
      'remote school LMS',
      'offline learning management system',
      'low bandwidth LMS',
      'northern education technology Canada',
      'rural school technology',
    ],
    heroText:
      'Northern and remote schools face challenges that most ed-tech companies have never considered — satellite internet, power outages, high staff turnover, and communities that have been failed by southern-designed systems. WolfWhale was built in Saskatchewan with these realities in mind, offering full offline capability, on-device AI, and content authored for Canadian students.',
    features: [
      'Canadian Data Sovereignty',
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gradebook & Analytics',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Most LMS platforms assume fast, reliable internet — an assumption that fails immediately in northern Canada. WolfWhale\'s offline mode allows students to download entire textbooks and complete lessons, quizzes, and flashcard reviews without any connectivity. When the connection returns, progress syncs automatically. On-device AI means adaptive features work locally without sending data to distant servers. Our content is authored for Canadian students with references, examples, and contexts they recognize, including Indigenous perspectives integrated authentically — not as tokenistic add-ons. As a First Nations owned company operating on Treaty 6 territory, we understand the communities we serve. High staff turnover in remote schools means the LMS must be intuitive for new teachers; WolfWhale\'s clean interface and role-based access control reduce onboarding time to minutes rather than days.',
  },

  'band-operated-school-lms': {
    title: 'Band-Operated School LMS | WolfWhale',
    h1: 'LMS for Band-Operated and First Nations Schools',
    description:
      'WolfWhale is First Nations owned and built for band-operated schools. Offline learning, Canadian data sovereignty, and culturally grounded design.',
    keywords: [
      'band-operated school LMS',
      'First Nations school technology',
      'Indigenous education LMS',
      'band school learning management system',
      'First Nations education technology',
      'Indigenous school platform Canada',
    ],
    heroText:
      'Band-operated schools deserve technology built by and for Indigenous communities. WolfWhale is First Nations owned, operates on Treaty 6 territory, and was designed to meet the unique needs of band-operated schools — offline capability, Canadian data sovereignty, and a platform that respects Indigenous approaches to teaching and learning.',
    features: [
      'Canadian Data Sovereignty',
      'Built for Canadian Schools',
      'FERPA & PIPEDA Compliant',
      'Curriculum-Aligned Content',
      'Gradebook & Analytics',
      'Multi-Tenant Architecture',
    ],
    whyExtra:
      'Band-operated schools have been historically underserved by ed-tech companies that treat Indigenous education as an afterthought. WolfWhale is different because we are Indigenous-owned. Our platform was built with the understanding that band-operated schools often face connectivity challenges, high teacher turnover, and the need to integrate Indigenous knowledge systems alongside provincial curricula. Offline mode ensures learning continues regardless of internet reliability. Canadian data sovereignty means student data stays in Canada, protected by Canadian law — critical for communities that have experienced generations of data extraction and surveillance. The multi-tenant architecture gives each band full administrative control over their school\'s digital environment, and five user roles allow band education authorities to maintain oversight while teachers manage day-to-day instruction.',
  },

  'hutterite-colony-school-technology': {
    title: 'Hutterite Colony School Technology | WolfWhale LMS',
    h1: 'LMS for Hutterite Colony Schools',
    description:
      'WolfWhale serves Hutterite colony schools with offline learning, curriculum-aligned content, and simple administration. Built on the prairies.',
    keywords: [
      'Hutterite colony school technology',
      'Hutterite school LMS',
      'colony school learning management system',
      'Hutterite education technology',
      'prairie school LMS',
      'colony school curriculum platform',
    ],
    heroText:
      'Hutterite colony schools are a vital part of prairie education, often serving small, multi-grade classrooms with limited connectivity. WolfWhale provides curriculum-aligned content that works offline, simple administration tools for colony teachers, and a straightforward interface that focuses on learning rather than flashy technology.',
    features: [
      'Built for Canadian Schools',
      'Curriculum-Aligned Content',
      'Gradebook & Analytics',
      'Attendance Tracking',
      'Interactive Courses & Quizzes',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Colony schools across Saskatchewan, Alberta, and Manitoba share common characteristics: small student populations, multi-grade classrooms, limited internet access, and a community that values practical, no-nonsense education. WolfWhale fits this context perfectly. Our offline capability means students can work through curriculum-aligned textbooks and quizzes even when the colony\'s internet is down or restricted. The multi-grade teacher managing a classroom of students across several grades can assign self-paced work through WolfWhale while providing direct instruction to one group. Our 72 textbooks cover the full Saskatchewan curriculum, so colony teachers working with school division curricula have complete coverage. The administration interface is deliberately simple — attendance, grades, and progress reports without unnecessary complexity.',
  },

  'distance-learning-platform-canada': {
    title: 'Distance Learning Platform Canada | WolfWhale LMS',
    h1: 'Canadian Distance Learning Platform with Offline Support',
    description:
      'WolfWhale powers distance learning across Canada with async textbooks, embedded assessments, and offline mode. PIPEDA compliant, $12/student/year.',
    keywords: [
      'distance learning platform Canada',
      'correspondence learning LMS',
      'distance education technology',
      'asynchronous learning platform',
      'distance learning software Canada',
      'remote learning LMS',
    ],
    heroText:
      'Distance learning in Canada spans vast geography, multiple time zones, and wildly varying connectivity. WolfWhale delivers a complete asynchronous learning platform with 72 curriculum-aligned textbooks, embedded assessments, and full offline capability — everything a distance learner needs without requiring a live internet connection.',
    features: [
      'Curriculum-Aligned Content',
      'Interactive Courses & Quizzes',
      'Spaced Repetition Flashcards',
      'Gradebook & Analytics',
      'Parent Portal',
      'Canadian Data Sovereignty',
    ],
    whyExtra:
      'Distance learning in Canada is not a pandemic workaround — it is a permanent reality for students in remote communities, travelling families, students with medical needs, and young athletes with competition schedules that conflict with traditional school calendars. WolfWhale provides the asynchronous backbone these learners need. Our 72 textbooks include embedded quizzes and activities that document learning without requiring synchronous teacher interaction. Spaced repetition flashcards maintain retention between study sessions, which may be days or weeks apart for some distance learners. The parent portal is essential for distance learning families who serve as learning coaches at home, and the gradebook gives supervising teachers a complete picture of student progress regardless of geographic distance. All data stays on Canadian servers, ensuring compliance with provincial education privacy regulations across every jurisdiction.',
  },
}
