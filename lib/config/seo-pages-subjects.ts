import type { PageData } from './seo-pages'

export const SUBJECT_PAGES: Record<string, PageData> = {
  // ---------------------------------------------------------------------------
  // SUBJECT PAGES
  // ---------------------------------------------------------------------------

  'math-education-technology': {
    title: 'Math Education Technology | K-12 Math LMS | WolfWhale',
    h1: 'Math Education Technology for Canadian Classrooms',
    description: 'Teach K-12 math with curriculum-aligned lessons, adaptive quizzes, and spaced repetition flashcards. Built for Saskatchewan and Canadian schools.',
    keywords: [
      'math education technology',
      'math LMS',
      'K-12 math platform',
      'math edtech Canada',
      'Saskatchewan math curriculum',
      'math learning management system',
      'elementary math technology',
      'high school math software',
    ],
    heroText:
      'WolfWhale covers Math from Kindergarten through Calculus 30 with 72 original textbooks written to Saskatchewan curriculum standards. Every lesson uses cognitive load theory to break complex concepts into manageable steps, while spaced repetition flashcards ensure long-term retention of formulas and procedures.',
    features: [
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Gradebook & Analytics',
      'Gamification & XP',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Traditional math software treats every student the same, delivering rigid problem sets that frustrate struggling learners and bore advanced ones. WolfWhale adapts to each student with on-device AI that identifies knowledge gaps and serves targeted practice. From number sense in Kindergarten to derivatives in Calculus 30, every lesson is mapped to Saskatchewan curriculum outcomes. Teachers get real-time analytics showing exactly where each student stands, and at $12 per student per year, it costs a fraction of legacy math platforms.',
  },

  'science-education-technology': {
    title: 'Science Education Technology | K-10 Science LMS | WolfWhale',
    h1: 'Science Education Technology That Sparks Curiosity',
    description: 'Deliver K-10 science curriculum with interactive lessons, digital lab tools, and gamified learning. Built for Canadian classrooms.',
    keywords: [
      'science education technology',
      'science LMS',
      'K-10 science platform',
      'science edtech Canada',
      'Saskatchewan science curriculum',
      'digital science tools',
      'science learning software',
      'STEM education platform',
    ],
    heroText:
      'WolfWhale brings science to life with curriculum-aligned lessons covering Life Science, Physical Science, and Earth and Space Science from Kindergarten through Grade 10. Interactive quizzes test conceptual understanding while gamification keeps students motivated to explore.',
    features: [
      'Curriculum-Aligned Content',
      'Interactive Courses & Quizzes',
      'Gamification & XP',
      'Gradebook & Analytics',
      'Built for Canadian Schools',
      'FERPA & PIPEDA Compliant',
    ],
    whyExtra:
      'Science education demands more than static textbook pages. WolfWhale delivers lessons built on cognitive load theory that scaffold complex ideas like ecosystems, chemical reactions, and weather systems into digestible steps. Each chapter includes embedded quizzes, key term flashcards, and hands-on activity prompts that connect digital learning to real-world investigation. Indigenous knowledge systems are woven into environmental and life science units, honouring Saskatchewan perspectives while meeting WNCP standards.',
  },

  'english-language-arts-technology': {
    title: 'English Language Arts Technology | K-9 ELA LMS | WolfWhale',
    h1: 'English Language Arts Technology for Literacy Success',
    description: 'Build reading, writing, and critical thinking skills with curriculum-aligned ELA lessons and interactive comprehension tools.',
    keywords: [
      'English language arts technology',
      'ELA LMS',
      'literacy technology',
      'reading comprehension software',
      'Saskatchewan ELA curriculum',
      'language arts edtech',
      'writing education platform',
      'K-9 ELA platform',
    ],
    heroText:
      'WolfWhale supports English Language Arts from Kindergarten through Grade 9 and senior ELA 20/30 with original textbooks that build reading comprehension, writing fluency, and critical thinking. Every lesson is aligned to Saskatchewan ELA outcomes and designed to develop confident communicators.',
    features: [
      'Curriculum-Aligned Content',
      'Interactive Courses & Quizzes',
      'Spaced Repetition Flashcards',
      'Gradebook & Analytics',
      'Parent Portal',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Literacy is the foundation of every subject, yet many ELA platforms focus narrowly on reading levels without addressing the full scope of language arts. WolfWhale covers comprehension, composition, oral communication, and media literacy in an integrated approach that mirrors how Saskatchewan teachers actually teach. Spaced repetition flashcards reinforce vocabulary and literary terms, while the parent portal lets families track reading progress at home. With offline support, students in rural communities can continue building literacy skills even without reliable internet.',
  },

  'social-studies-education-technology': {
    title: 'Social Studies Education Technology | K-9 LMS | WolfWhale',
    h1: 'Social Studies Education Technology for Canadian Classrooms',
    description: 'Teach K-9 social studies with curriculum-aligned lessons covering history, geography, citizenship, and Indigenous perspectives.',
    keywords: [
      'social studies education technology',
      'social studies LMS',
      'Canadian history edtech',
      'Saskatchewan social studies',
      'citizenship education platform',
      'Indigenous education technology',
      'geography learning software',
      'K-9 social studies',
    ],
    heroText:
      'WolfWhale delivers Social Studies from Kindergarten through Grade 9 with lessons that explore Canadian history, geography, governance, and Indigenous perspectives. Students build critical thinking about identity, community, and citizenship through curriculum-aligned content.',
    features: [
      'Curriculum-Aligned Content',
      'Interactive Courses & Quizzes',
      'Canadian Data Sovereignty',
      'Gamification & XP',
      'Gradebook & Analytics',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Social studies education in Saskatchewan requires sensitivity to Treaty relationships, Metis history, and First Nations perspectives that American-built platforms simply cannot provide. WolfWhale textbooks are written from a Canadian lens, with Indigenous connections embedded throughout rather than relegated to a single unit. From community helpers in Kindergarten to governance structures in Grade 9, every chapter aligns to Saskatchewan outcomes while encouraging students to think critically about the world around them.',
  },

  'stem-education-platform': {
    title: 'STEM Education Platform | Science, Tech, Engineering & Math | WolfWhale',
    h1: 'STEM Education Platform Built for Canadian Schools',
    description: 'Integrated STEM learning with math, science, and technology courses aligned to Canadian curriculum. Gamified, offline-ready, $12/student/year.',
    keywords: [
      'STEM education platform',
      'STEM learning software',
      'STEM edtech Canada',
      'science technology engineering math',
      'STEM curriculum platform',
      'K-12 STEM education',
      'Saskatchewan STEM',
      'integrated STEM learning',
    ],
    heroText:
      'WolfWhale unifies math, science, and technology education into a single platform with 72 original textbooks covering K-12 curriculum. On-device AI personalizes learning paths while gamification with XP and achievements keeps students engaged across every STEM discipline.',
    features: [
      'Curriculum-Aligned Content',
      'Gamification & XP',
      'Interactive Courses & Quizzes',
      'Spaced Repetition Flashcards',
      'Gradebook & Analytics',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Most STEM platforms bolt together disconnected tools for each subject, creating a fragmented experience for teachers and students alike. WolfWhale provides a unified platform where Math, Science, and senior courses like Physics 20/30, Biology 30, and Chemistry 30 share a consistent interface, gradebook, and analytics dashboard. Teachers can track cross-disciplinary progress in one place, and students earn XP across all subjects in a single gamification system. Built in Saskatchewan, every lesson reflects Canadian curriculum priorities rather than adapting American content as an afterthought.',
  },

  'french-immersion-lms': {
    title: 'French Immersion LMS | Core French Education Platform | WolfWhale',
    h1: 'French Immersion and Core French Learning Platform',
    description: 'Support French immersion and Core French programs with curriculum-aligned lessons, flashcards, and offline learning for Canadian schools.',
    keywords: [
      'French immersion LMS',
      'Core French education platform',
      'French language learning school',
      'Saskatchewan French curriculum',
      'Canadian French immersion technology',
      'FSL education software',
      'French second language edtech',
      'bilingual education platform',
    ],
    heroText:
      'WolfWhale supports Core French instruction with curriculum-aligned lessons and spaced repetition flashcards designed for Saskatchewan FSL programs. Students build vocabulary, grammar, and communication skills through interactive content that reinforces learning over time.',
    features: [
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'FERPA & PIPEDA Compliant',
      'Gamification & XP',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'French language education in Saskatchewan schools demands content aligned to provincial outcomes, not generic French-learning apps built for tourists. WolfWhale provides Core French textbook content with spaced repetition flashcards that leverage proven memory science to build lasting vocabulary retention. Every lesson is structured using cognitive load theory so students acquire new language skills without overwhelm. Gamification rewards consistent practice, and offline support means students in rural Saskatchewan can study French even without internet access.',
  },

  'health-education-technology': {
    title: 'Health Education Technology | K-9 Health & Wellness LMS | WolfWhale',
    h1: 'Health Education Technology for Student Wellness',
    description: 'Deliver K-9 health and wellness curriculum with age-appropriate lessons on nutrition, mental health, safety, and personal development.',
    keywords: [
      'health education technology',
      'health LMS',
      'wellness education platform',
      'Saskatchewan health curriculum',
      'mental health education software',
      'K-9 health education',
      'student wellness technology',
      'health literacy edtech',
    ],
    heroText:
      'WolfWhale covers Health Education from Grade 1 through Grade 9 with age-appropriate lessons on nutrition, mental health, relationships, safety, and personal development. Every chapter aligns to Saskatchewan Health Education outcomes and is written with sensitivity to the topics students need most.',
    features: [
      'Curriculum-Aligned Content',
      'Interactive Courses & Quizzes',
      'Parent Portal',
      'FERPA & PIPEDA Compliant',
      'Gradebook & Analytics',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Health education touches on sensitive topics that require culturally appropriate, age-aligned content. WolfWhale textbooks are written specifically for Saskatchewan classrooms, addressing mental health, substance awareness, healthy relationships, and personal safety in language that respects community values. The parent portal gives families visibility into what their children are learning, building trust between home and school. Privacy compliance ensures student wellness data stays protected under both PIPEDA and FERPA standards.',
  },

  'arts-education-technology': {
    title: 'Arts Education Technology | Visual & Performing Arts LMS | WolfWhale',
    h1: 'Arts Education Technology for Creative Classrooms',
    description: 'Support arts education with curriculum-aligned lessons in visual arts, music, drama, and dance for Saskatchewan schools.',
    keywords: [
      'arts education technology',
      'arts LMS',
      'visual arts edtech',
      'music education platform',
      'Saskatchewan arts curriculum',
      'creative arts education software',
      'performing arts technology',
      'K-12 arts education',
    ],
    heroText:
      'WolfWhale brings arts education into the digital age with curriculum-aligned textbooks covering visual arts, music, drama, and dance at the Grade 1, 4, and 7 levels. Students explore creative expression, art history, and artistic techniques through interactive lessons and activities.',
    features: [
      'Curriculum-Aligned Content',
      'Interactive Courses & Quizzes',
      'Gamification & XP',
      'Attendance Tracking',
      'Gradebook & Analytics',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Arts education is often underserved by education technology because creative subjects resist the multiple-choice format that most platforms rely on. WolfWhale takes a different approach with activity-based content blocks that prompt hands-on creation, critical analysis of artworks, and reflection exercises. Saskatchewan curriculum outcomes for Arts Education emphasize creative and critical thinking, and WolfWhale textbooks are structured to support both. Teachers can track student engagement and progress through the gradebook while students earn XP for completing creative challenges.',
  },

  'physical-education-technology': {
    title: 'Physical Education Technology | PE & Fitness LMS | WolfWhale',
    h1: 'Physical Education Technology for Active Learning',
    description: 'Manage PE classes with curriculum-aligned fitness content, attendance tracking, and gradebook tools. Built for Canadian schools.',
    keywords: [
      'physical education technology',
      'PE LMS',
      'fitness education platform',
      'Saskatchewan PE curriculum',
      'physical education software',
      'phys ed technology',
      'PE attendance tracking',
      'K-12 physical education',
    ],
    heroText:
      'WolfWhale supports Physical Education at Grade 1, 4, 7, and 9 with curriculum-aligned content covering movement skills, fitness concepts, and active living. Attendance tracking and gradebook tools help PE teachers manage classes while students learn the foundations of lifelong physical wellness.',
    features: [
      'Curriculum-Aligned Content',
      'Attendance Tracking',
      'Gradebook & Analytics',
      'Gamification & XP',
      'Interactive Courses & Quizzes',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Physical education teachers need tools that work in gymnasiums and on playing fields, not just in computer labs. WolfWhale provides PE-specific content for theory components like fitness principles, nutrition, and safety, while attendance tracking and gradebook features handle the administrative side of managing active classes. The gamification system rewards students for both knowledge and participation, and offline support means content loads instantly even in schools where gym areas lack reliable Wi-Fi coverage.',
  },

  'career-education-technology': {
    title: 'Career Education Technology | Grade 6-9 Career LMS | WolfWhale',
    h1: 'Career Education Technology for Future-Ready Students',
    description: 'Prepare Grade 6-9 students with career exploration, financial literacy, and life skills through curriculum-aligned digital lessons.',
    keywords: [
      'career education technology',
      'career education LMS',
      'career exploration platform',
      'Saskatchewan career education',
      'life skills education software',
      'Grade 6-9 career education',
      'work education technology',
      'career readiness edtech',
    ],
    heroText:
      'WolfWhale delivers Career Education for Grades 6 through 9 with lessons on career exploration, workplace skills, financial literacy, and personal management. Students discover their strengths, explore career pathways, and develop the life skills they need beyond the classroom.',
    features: [
      'Curriculum-Aligned Content',
      'Interactive Courses & Quizzes',
      'Gamification & XP',
      'Gradebook & Analytics',
      'Parent Portal',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Career Education is a required subject in Saskatchewan from Grade 6 through Grade 9, yet few digital platforms offer dedicated content for it. WolfWhale fills this gap with original textbooks that guide students through self-assessment, career research, workplace expectations, and financial planning. Each chapter uses real-world scenarios relevant to Saskatchewan communities, from agriculture and mining to technology and healthcare. The parent portal allows families to participate in career conversations at home, extending learning beyond the school day.',
  },

  'environmental-education-technology': {
    title: 'Environmental Education Technology | Climate & Ecology LMS | WolfWhale',
    h1: 'Environmental Education Technology for Sustainable Futures',
    description: 'Teach environmental science, climate literacy, and sustainability through curriculum-aligned lessons with Indigenous ecological knowledge.',
    keywords: [
      'environmental education technology',
      'climate education platform',
      'sustainability education LMS',
      'ecological literacy software',
      'environmental science edtech',
      'climate change education',
      'Indigenous ecological knowledge',
      'green education technology',
    ],
    heroText:
      'WolfWhale integrates environmental education across science, social studies, and health curricula with content that covers ecosystems, climate science, sustainability, and Indigenous ecological knowledge. Students develop environmental literacy through lessons grounded in Saskatchewan landscapes and global perspectives.',
    features: [
      'Curriculum-Aligned Content',
      'Interactive Courses & Quizzes',
      'Canadian Data Sovereignty',
      'Spaced Repetition Flashcards',
      'Gradebook & Analytics',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Environmental education is woven throughout Saskatchewan curriculum rather than existing as a standalone subject, which makes it difficult for teachers to find cohesive digital resources. WolfWhale addresses this by embedding environmental themes across science, social studies, and health textbooks. Prairie ecosystems, boreal forests, water systems, and climate patterns are explored through a Saskatchewan lens, with Indigenous ecological knowledge honoured as a valid and vital perspective. Students build environmental literacy not as an add-on, but as an integral part of their core education.',
  },

  'financial-literacy-education': {
    title: 'Financial Literacy Education | Money Skills for K-12 | WolfWhale',
    h1: 'Financial Literacy Education for Canadian Students',
    description: 'Build financial literacy with curriculum-aligned lessons on budgeting, saving, and money management integrated across K-12 subjects.',
    keywords: [
      'financial literacy education',
      'financial literacy K-12',
      'money skills education platform',
      'budgeting education software',
      'financial education Canada',
      'Saskatchewan financial literacy',
      'student financial skills',
      'money management edtech',
    ],
    heroText:
      'WolfWhale integrates financial literacy across math and career education curricula, teaching students practical money skills from basic counting in Kindergarten to budgeting and investment concepts in high school. Every lesson connects financial concepts to real-world Saskatchewan contexts.',
    features: [
      'Curriculum-Aligned Content',
      'Interactive Courses & Quizzes',
      'Gamification & XP',
      'Parent Portal',
      'Spaced Repetition Flashcards',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Financial literacy is increasingly recognized as essential but remains scattered across different subjects in most Canadian curricula. WolfWhale weaves money skills into math lessons on percentages, decimals, and data analysis, and into Career Education units on workplace skills and personal management. Students learn with Canadian currency, tax systems, and banking examples rather than American-centric content. The parent portal encourages families to reinforce financial concepts at home, and gamification rewards students for mastering budgeting challenges and savings goals.',
  },

  'coding-education-k12': {
    title: 'Coding Education K-12 | Computer Science Learning Platform | WolfWhale',
    h1: 'Coding and Computer Science Education for K-12',
    description: 'Introduce computational thinking and coding concepts through curriculum-aligned lessons integrated into math and science courses.',
    keywords: [
      'coding education K-12',
      'computer science education platform',
      'computational thinking edtech',
      'coding for schools',
      'K-12 programming education',
      'CS education Canada',
      'coding curriculum platform',
      'digital literacy education',
    ],
    heroText:
      'WolfWhale introduces computational thinking and coding concepts through math and science curricula, building digital literacy from pattern recognition in elementary grades to algorithmic thinking in high school. Students develop problem-solving skills that transfer across every subject.',
    features: [
      'Interactive Courses & Quizzes',
      'Curriculum-Aligned Content',
      'Gamification & XP',
      'Gradebook & Analytics',
      'FERPA & PIPEDA Compliant',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Computational thinking is increasingly embedded in Canadian math and science curricula, but many coding platforms operate as isolated tools disconnected from classroom learning. WolfWhale integrates coding concepts directly into curriculum-aligned content, so students encounter pattern recognition, decomposition, and algorithmic reasoning as natural extensions of math and science lessons. The platform does not require separate accounts or logins for coding activities, and teachers can track computational thinking progress alongside other subjects in a single gradebook.',
  },

  'reading-comprehension-technology': {
    title: 'Reading Comprehension Technology | Literacy Tools for K-9 | WolfWhale',
    h1: 'Reading Comprehension Technology That Builds Strong Readers',
    description: 'Strengthen reading comprehension with curriculum-aligned passages, vocabulary flashcards, and interactive quizzes for K-9 students.',
    keywords: [
      'reading comprehension technology',
      'literacy tools K-9',
      'reading education platform',
      'comprehension software',
      'vocabulary building edtech',
      'Saskatchewan reading curriculum',
      'reading fluency tools',
      'literacy learning management system',
    ],
    heroText:
      'WolfWhale builds reading comprehension through curriculum-aligned ELA textbooks with embedded vocabulary flashcards, comprehension quizzes, and scaffolded passages. Students develop fluency, critical thinking, and a love of reading from Kindergarten through Grade 9.',
    features: [
      'Spaced Repetition Flashcards',
      'Curriculum-Aligned Content',
      'Interactive Courses & Quizzes',
      'Parent Portal',
      'Gradebook & Analytics',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Reading comprehension is the single strongest predictor of academic success, yet many literacy tools focus narrowly on decoding without building the deeper understanding that Saskatchewan ELA outcomes demand. WolfWhale textbooks use cognitive load theory to scaffold complex texts, presenting vocabulary in context and reinforcing it with spaced repetition flashcards. Comprehension quizzes go beyond recall to test inference, synthesis, and critical analysis. The parent portal gives families visibility into reading progress, and offline support ensures students can practice reading anywhere, even in communities with limited internet.',
  },

  'science-lab-digital-tools': {
    title: 'Digital Science Lab Tools | Virtual Lab Platform for Schools | WolfWhale',
    h1: 'Digital Science Lab Tools for Modern Classrooms',
    description: 'Supplement hands-on labs with digital science tools, interactive simulations, and curriculum-aligned experiment guides for K-10.',
    keywords: [
      'digital science lab tools',
      'virtual lab platform',
      'science simulation software',
      'lab education technology',
      'Saskatchewan science labs',
      'digital experiment tools',
      'science lab management',
      'K-10 lab resources',
    ],
    heroText:
      'WolfWhale supplements hands-on science with digital lab preparation materials, experiment guides, and post-lab quizzes aligned to Saskatchewan science curriculum. Students arrive at the lab bench prepared, and teachers can assess understanding before and after every experiment.',
    features: [
      'Curriculum-Aligned Content',
      'Interactive Courses & Quizzes',
      'Gradebook & Analytics',
      'FERPA & PIPEDA Compliant',
      'Spaced Repetition Flashcards',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Lab time is precious and expensive, and too often students arrive unprepared, wasting valuable hands-on minutes on procedures they should have learned beforehand. WolfWhale science textbooks include pre-lab reading, safety protocols, and comprehension checks that ensure students understand the theory before they touch equipment. Post-lab quizzes reinforce what students observed, and flashcards help retain key terms and concepts. For schools with limited lab resources, the digital content provides a strong conceptual foundation that maximizes the impact of whatever hands-on time is available.',
  },

  // ---------------------------------------------------------------------------
  // GRADE LEVEL PAGES
  // ---------------------------------------------------------------------------

  'kindergarten-learning-platform': {
    title: 'Kindergarten Learning Platform | Early Education LMS | WolfWhale',
    h1: 'Kindergarten Learning Platform for Early Education',
    description: 'Engage kindergarten learners with age-appropriate math, ELA, and social studies content. Gamified, curriculum-aligned, and parent-friendly.',
    keywords: [
      'kindergarten learning platform',
      'kindergarten LMS',
      'early education technology',
      'kindergarten edtech',
      'Saskatchewan kindergarten curriculum',
      'K learning management system',
      'early childhood education platform',
      'kindergarten math and reading',
    ],
    heroText:
      'WolfWhale welcomes Kindergarten learners with age-appropriate lessons in Math, Social Studies, and early literacy designed for short attention spans and big curiosity. Colourful gamification with XP rewards turns first school experiences into joyful learning adventures.',
    features: [
      'Curriculum-Aligned Content',
      'Gamification & XP',
      'Parent Portal',
      'Interactive Courses & Quizzes',
      'FERPA & PIPEDA Compliant',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Kindergarten learners need technology that respects their developmental stage rather than scaling down content designed for older students. WolfWhale Kindergarten content is built from the ground up for five-year-olds, with lessons structured around cognitive load theory to keep activities short, focused, and achievable. The parent portal is especially important at this stage, giving families a window into what their child is learning and how they are progressing. Privacy protections meet the highest standards for young learners, and the interface requires minimal reading so students can navigate with confidence.',
  },

  'elementary-school-lms': {
    title: 'Elementary School LMS | K-5 Learning Platform | WolfWhale',
    h1: 'Elementary School LMS for K-5 Classrooms',
    description: 'A complete K-5 learning management system with curriculum-aligned textbooks, quizzes, flashcards, and gradebook. $12/student/year.',
    keywords: [
      'elementary school LMS',
      'K-5 learning platform',
      'elementary education technology',
      'primary school edtech',
      'Saskatchewan elementary curriculum',
      'elementary gradebook software',
      'K-5 learning management system',
      'elementary classroom technology',
    ],
    heroText:
      'WolfWhale provides a complete learning management system for elementary schools with curriculum-aligned textbooks across Math, Science, ELA, Social Studies, Health, Arts, and PE. One platform, one login, one gradebook for everything a K-5 teacher needs.',
    features: [
      'Curriculum-Aligned Content',
      'Gradebook & Analytics',
      'Gamification & XP',
      'Spaced Repetition Flashcards',
      'Attendance Tracking',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Elementary teachers often juggle multiple disconnected platforms for different subjects, creating login fatigue and fragmented data. WolfWhale consolidates everything into a single system where one teacher can manage Math, Science, ELA, Social Studies, Health, Arts, and PE from a unified dashboard. The gradebook tracks progress across all subjects, attendance is built in, and gamification creates a consistent reward system that motivates students throughout the day. At $12 per student per year, WolfWhale replaces multiple subscriptions with a single affordable solution that covers the entire elementary curriculum.',
  },

  'middle-school-lms': {
    title: 'Middle School LMS | Grade 6-8 Learning Platform | WolfWhale',
    h1: 'Middle School LMS for Grade 6-8 Students',
    description: 'Engage middle school students with gamified, curriculum-aligned lessons across all subjects. Gradebook, analytics, and parent portal included.',
    keywords: [
      'middle school LMS',
      'Grade 6-8 learning platform',
      'middle school education technology',
      'junior high edtech',
      'Saskatchewan middle school curriculum',
      'Grade 6-8 learning management system',
      'middle school gradebook',
      'tween education platform',
    ],
    heroText:
      'WolfWhale keeps middle school students engaged during the most challenging years of education with gamified lessons, XP rewards, and curriculum-aligned content across every Grade 6-8 subject. The platform meets students where they are with age-appropriate design and meaningful achievement systems.',
    features: [
      'Gamification & XP',
      'Curriculum-Aligned Content',
      'Gradebook & Analytics',
      'Parent Portal',
      'Interactive Courses & Quizzes',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Middle school is where student engagement often drops, and generic LMS platforms do nothing to address this. WolfWhale is designed with the Grade 6-8 age group in mind, using gamification that feels rewarding without being childish. Career Education content begins in Grade 6, helping students connect classroom learning to real-world goals. The parent portal keeps families informed during years when communication between home and school often breaks down. Every subject is covered in a single platform, eliminating the app fatigue that disengages students who already have short attention spans for academic tools.',
  },

  'high-school-lms': {
    title: 'High School LMS | Grade 9-12 Learning Platform | WolfWhale',
    h1: 'High School LMS for Grade 9-12 Success',
    description: 'Prepare high school students with senior-level math, science, and ELA courses. Gradebook, analytics, and university-prep tools included.',
    keywords: [
      'high school LMS',
      'Grade 9-12 learning platform',
      'high school education technology',
      'senior high school edtech',
      'Saskatchewan high school curriculum',
      'Grade 9-12 learning management system',
      'high school gradebook',
      'university prep education platform',
    ],
    heroText:
      'WolfWhale supports high school students with senior-level courses including Math 10/20/30, Foundations Math 20, Physics 20/30, Biology 30, Chemistry 30, and ELA 20/30. Spaced repetition flashcards and structured lessons prepare students for provincial exams and post-secondary success.',
    features: [
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gradebook & Analytics',
      'Interactive Courses & Quizzes',
      'FERPA & PIPEDA Compliant',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'High school students face increasing academic pressure with higher stakes and more complex content. WolfWhale senior courses are built with cognitive load theory to break advanced topics like calculus, organic chemistry, and electromagnetic theory into manageable learning sequences. Spaced repetition flashcards are especially valuable at this level, helping students retain the volume of terminology and formulas that senior courses demand. Teachers get detailed analytics that identify struggling students early, and the gradebook handles the weighted grade calculations that high school reporting requires.',
  },

  'early-years-education-technology': {
    title: 'Early Years Education Technology | Pre-K to Grade 3 | WolfWhale',
    h1: 'Early Years Education Technology for Pre-K to Grade 3',
    description: 'Support early learners with developmentally appropriate lessons in literacy, numeracy, and social skills. Built for Canadian classrooms.',
    keywords: [
      'early years education technology',
      'Pre-K to Grade 3 platform',
      'early childhood edtech',
      'early literacy technology',
      'early numeracy platform',
      'Saskatchewan early years curriculum',
      'primary education LMS',
      'young learner education software',
    ],
    heroText:
      'WolfWhale supports the critical early years from Pre-K to Grade 3 with lessons built for developing minds. Short, focused activities build foundational literacy and numeracy skills while gamification makes learning feel like play.',
    features: [
      'Curriculum-Aligned Content',
      'Gamification & XP',
      'Parent Portal',
      'Interactive Courses & Quizzes',
      'FERPA & PIPEDA Compliant',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'The early years are when learning habits form and attitudes toward school solidify, making it essential that technology supports rather than overwhelms young students. WolfWhale early years content is designed around cognitive load theory principles adapted for developing minds, with shorter lessons, more visual content, and frequent positive reinforcement through XP rewards. The parent portal is especially valuable for this age group, letting families celebrate achievements and reinforce concepts at home. Every piece of content meets PIPEDA privacy standards, and the platform works offline so early learners are never interrupted by connectivity issues.',
  },

  'grade-4-6-learning-platform': {
    title: 'Grade 4-6 Learning Platform | Upper Elementary LMS | WolfWhale',
    h1: 'Grade 4-6 Learning Platform for Upper Elementary',
    description: 'Challenge upper elementary students with curriculum-aligned content in math, science, ELA, and social studies. Gamified and offline-ready.',
    keywords: [
      'Grade 4-6 learning platform',
      'upper elementary LMS',
      'Grade 4-6 education technology',
      'intermediate elementary edtech',
      'Saskatchewan Grade 4-6 curriculum',
      'upper elementary learning management system',
      'Grade 4-6 classroom technology',
      'intermediate education platform',
    ],
    heroText:
      'WolfWhale meets upper elementary students at their growing edge with curriculum-aligned content that bridges the gap between foundational and intermediate learning. Grades 4 through 6 cover increasingly complex math, deeper science inquiry, and expanded social studies perspectives.',
    features: [
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gamification & XP',
      'Gradebook & Analytics',
      'Interactive Courses & Quizzes',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Grades 4 through 6 represent a pivotal transition where students move from learning to read to reading to learn, and from concrete math to abstract reasoning. WolfWhale content is calibrated for this developmental stage, introducing spaced repetition flashcards as students become capable of independent study habits. The gamification system grows more sophisticated too, with achievement milestones that reward persistence and mastery rather than just completion. Teachers can use gradebook analytics to identify students who need intervention before they fall behind in the critical middle school transition.',
  },

  'grade-7-9-learning-platform': {
    title: 'Grade 7-9 Learning Platform | Junior High LMS | WolfWhale',
    h1: 'Grade 7-9 Learning Platform for Junior High',
    description: 'Engage junior high students with subject-specific courses, career education, and gamified learning. Curriculum-aligned and affordable.',
    keywords: [
      'Grade 7-9 learning platform',
      'junior high LMS',
      'Grade 7-9 education technology',
      'junior high school edtech',
      'Saskatchewan Grade 7-9 curriculum',
      'junior high learning management system',
      'Grade 7-9 classroom technology',
      'adolescent education platform',
    ],
    heroText:
      'WolfWhale supports the Grade 7-9 transition with subject-specific courses across math, science, ELA, social studies, health, arts, PE, and career education. As students prepare for high school, on-device AI helps identify and fill knowledge gaps before they compound.',
    features: [
      'Curriculum-Aligned Content',
      'Gradebook & Analytics',
      'Gamification & XP',
      'Interactive Courses & Quizzes',
      'Attendance Tracking',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'The Grade 7-9 years are when academic trajectories diverge, and students who fall behind often never catch up. WolfWhale uses on-device AI to detect knowledge gaps early, serving targeted review material before small misunderstandings become major barriers. Career Education content in these grades helps students see the purpose behind their learning, connecting classroom subjects to real career pathways. The attendance tracking system helps administrators identify disengagement patterns, and the gamification system is tuned for adolescents who respond to meaningful challenges rather than childish rewards.',
  },

  'grade-10-12-learning-platform': {
    title: 'Grade 10-12 Learning Platform | Senior High LMS | WolfWhale',
    h1: 'Grade 10-12 Learning Platform for Senior High',
    description: 'Prepare senior students for graduation and post-secondary with advanced math, science, and ELA courses. Exam-ready flashcards included.',
    keywords: [
      'Grade 10-12 learning platform',
      'senior high LMS',
      'Grade 10-12 education technology',
      'senior high school edtech',
      'Saskatchewan Grade 10-12 curriculum',
      'senior high learning management system',
      'university prep platform',
      'Grade 12 exam preparation',
    ],
    heroText:
      'WolfWhale delivers senior-level courses including Math 10/20/30, Foundations Math 20, Physics 20/30, Biology 30, Chemistry 30, and ELA 20/30 with the rigour students need for provincial exams and post-secondary admission. Spaced repetition flashcards make exam preparation systematic rather than frantic.',
    features: [
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Gradebook & Analytics',
      'Interactive Courses & Quizzes',
      'Canadian Data Sovereignty',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Senior high school is where the stakes are highest and the content most demanding. WolfWhale senior courses are structured to build understanding incrementally, using cognitive load theory to prevent the overwhelm that causes students to disengage from challenging subjects like Physics 30 or Chemistry 30. The spaced repetition system is particularly powerful at this level, scheduling review of formulas, definitions, and procedures at scientifically optimal intervals. Canadian data sovereignty ensures student records remain in Canada, and the gradebook provides the detailed analytics that senior-level teachers need for report cards and university recommendation letters.',
  },

  'multi-grade-classroom-technology': {
    title: 'Multi-Grade Classroom Technology | Combined Class LMS | WolfWhale',
    h1: 'Multi-Grade Classroom Technology for Combined Classes',
    description: 'Manage multi-grade and combined classrooms with individualized, curriculum-aligned content for every student. Built for rural schools.',
    keywords: [
      'multi-grade classroom technology',
      'combined classroom LMS',
      'multi-age education platform',
      'rural school technology',
      'Saskatchewan rural education',
      'split-grade classroom software',
      'multi-grade learning management system',
      'combined class edtech',
    ],
    heroText:
      'WolfWhale is built for the reality of rural Saskatchewan schools where multi-grade classrooms are the norm, not the exception. One teacher can manage students across multiple grade levels with individualized, curriculum-aligned content that lets each student work at their own pace.',
    features: [
      'Curriculum-Aligned Content',
      'Gradebook & Analytics',
      'Gamification & XP',
      'Interactive Courses & Quizzes',
      'Attendance Tracking',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Multi-grade classrooms are common across rural Saskatchewan, yet most education technology assumes one teacher teaches one grade. WolfWhale was designed with combined classes in mind from the start. A single teacher can assign Grade 3 math to one group and Grade 5 math to another, all within the same classroom dashboard. The gradebook separates reporting by grade level while giving the teacher a unified view of their entire class. Offline support is critical in rural communities where internet connectivity is unreliable, and at $12 per student per year, even the smallest school division can afford comprehensive curriculum coverage for every grade in the building.',
  },

  'senior-math-science-platform': {
    title: 'Senior Math & Science Platform | Physics, Bio, Chem, Math 10-30 | WolfWhale',
    h1: 'Senior Math and Science Platform for Grades 10-12',
    description: 'Master Physics 20/30, Biology 30, Chemistry 30, and Math 10/20/30 with structured lessons and exam-prep flashcards. $12/student/year.',
    keywords: [
      'senior math science platform',
      'Physics 20 30 LMS',
      'Biology 30 platform',
      'Chemistry 30 education',
      'Math 10 20 30 learning',
      'Saskatchewan senior science',
      'senior STEM education',
      'high school math science technology',
    ],
    heroText:
      'WolfWhale provides dedicated courses for Physics 20/30, Biology 30, Chemistry 30, Math 10/20/30, and Foundations Math 20, each written with the depth and precision that senior science and math demand. Cognitive load theory structures every chapter so complex topics build logically from prerequisite knowledge.',
    features: [
      'Curriculum-Aligned Content',
      'Spaced Repetition Flashcards',
      'Interactive Courses & Quizzes',
      'Gradebook & Analytics',
      'Gamification & XP',
      'Built for Canadian Schools',
    ],
    whyExtra:
      'Senior math and science courses have the highest failure rates in Saskatchewan high schools, often because students hit a wall of complexity without adequate scaffolding. WolfWhale senior STEM courses are meticulously structured so that every lesson builds on the previous one, with embedded quizzes that check understanding before students move forward. Spaced repetition flashcards cover the hundreds of formulas, constants, and definitions that Physics, Chemistry, and Biology demand. The gradebook gives teachers granular insight into which specific concepts each student has mastered and which need reteaching, enabling targeted intervention that can mean the difference between a student passing or failing a prerequisite for university admission.',
  },
}
