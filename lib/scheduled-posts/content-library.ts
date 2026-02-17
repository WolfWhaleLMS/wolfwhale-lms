/**
 * Content library for Wolf Whale EdTech scheduled posts.
 * Pre-written engaging content about LMS features and Indigenous Education.
 */

export type PostCategory = 'lms_feature' | 'indigenous_education' | 'community' | 'tip'

export interface ContentTemplate {
  title: string
  content: string
  category: PostCategory
}

export const CONTENT_LIBRARY: ContentTemplate[] = [
  // --- LMS Features ---
  {
    title: 'Track Your Progress with Skill Trees',
    content:
      'Did you know Wolf Whale LMS has interactive skill trees? Students can visualize their learning journey, unlock new skills, and see exactly what they need to master next. Check out your skill tree in the student dashboard today!',
    category: 'lms_feature',
  },
  {
    title: 'New: Flashcard Study System',
    content:
      'Study smarter with our built-in flashcard system! Create custom decks for any subject, use spaced repetition to retain knowledge longer, and track your mastery over time. Perfect for exam prep and daily review.',
    category: 'lms_feature',
  },
  {
    title: 'Gamification Makes Learning Fun',
    content:
      'Earn XP, level up, and collect achievements as you learn! Our gamification system rewards consistent effort and celebrates milestones. Every assignment completed, every quiz aced, every lesson finished brings you closer to your next level.',
    category: 'lms_feature',
  },
  {
    title: 'Parent Dashboard: Stay Connected',
    content:
      'Parents can now track their children\'s progress in real-time through the Parent Dashboard. View attendance, grades, upcoming assignments, and teacher announcements all in one place. Education is a team effort!',
    category: 'lms_feature',
  },
  {
    title: 'Offline Learning Mode',
    content:
      'No internet? No problem! Wolf Whale LMS supports offline learning so students in remote communities can continue their education without interruption. Work offline and sync when you reconnect.',
    category: 'lms_feature',
  },
  {
    title: 'Quiz Builder for Teachers',
    content:
      'Teachers can create engaging quizzes with multiple question types, auto-grading, and instant feedback. Build assessments that truly measure understanding and help students learn from their mistakes.',
    category: 'lms_feature',
  },
  {
    title: 'Real-Time Attendance Tracking',
    content:
      'Our attendance system gives administrators instant visibility into school-wide attendance patterns. Identify trends, support at-risk students, and ensure every learner is accounted for.',
    category: 'lms_feature',
  },
  {
    title: 'Secure File Sharing for Classrooms',
    content:
      'Share documents, images, and resources securely within your courses. Our file management system keeps materials organized and accessible to the right people at the right time.',
    category: 'lms_feature',
  },

  // --- Indigenous Education ---
  {
    title: 'Honouring Truth and Reconciliation in Education',
    content:
      'Wolf Whale EdTech is committed to integrating the Truth and Reconciliation Commission\'s Calls to Action into our platform. Education technology should serve all communities, especially those historically underserved. Together, we build a more inclusive future.',
    category: 'indigenous_education',
  },
  {
    title: 'Land-Based Learning in the Digital Age',
    content:
      'Technology and traditional knowledge can work together. Our platform supports land-based learning by helping teachers document and share place-based curriculum that connects students to their territories, languages, and cultural practices.',
    category: 'indigenous_education',
  },
  {
    title: 'Supporting Indigenous Language Revitalization',
    content:
      'Language carries culture. Wolf Whale LMS is designed to support Indigenous language programs, making it easier for communities to create, share, and teach in their own languages. Every word preserved is a victory for future generations.',
    category: 'indigenous_education',
  },
  {
    title: 'Saskatchewan Curriculum Outcomes Integration',
    content:
      'Our platform aligns with Saskatchewan curriculum outcomes, including Treaty Education and Indigenous perspectives. Teachers can map lessons directly to provincial standards while honouring local knowledge and traditions.',
    category: 'indigenous_education',
  },
  {
    title: 'Community-Centered Education Technology',
    content:
      'Wolf Whale EdTech was built with Indigenous communities in mind. Our multi-tenant system means each school and community maintains sovereignty over their own data, curriculum, and learning environment. Your data, your community, your way.',
    category: 'indigenous_education',
  },
  {
    title: 'Bridging Digital Divides in Remote Communities',
    content:
      'Access to quality education technology shouldn\'t depend on geography. Our offline-first features and lightweight design ensure students in remote and rural Indigenous communities get the same powerful learning tools as anyone else.',
    category: 'indigenous_education',
  },
  {
    title: 'Elder Knowledge in Modern Classrooms',
    content:
      'Elders hold irreplaceable wisdom. Our platform helps schools create digital archives of Elder teachings, oral histories, and cultural knowledge—preserving these treasures for future generations while respecting protocols around sacred and sensitive content.',
    category: 'indigenous_education',
  },
  {
    title: 'Two-Eyed Seeing: Blending Knowledge Systems',
    content:
      'Two-Eyed Seeing (Etuaptmumk) means learning to see from one eye with the strengths of Indigenous knowledge, and from the other eye with the strengths of Western knowledge. Wolf Whale LMS creates space for both perspectives to thrive in the classroom.',
    category: 'indigenous_education',
  },

  // --- Community ---
  {
    title: 'Welcome to the Wolf Whale Community',
    content:
      'Education is stronger when we learn together. The Wolf Whale community includes educators, students, parents, and community members all working toward the same goal: empowering the next generation through culturally responsive, technology-enhanced learning.',
    category: 'community',
  },
  {
    title: 'Teacher Spotlight: Sharing Best Practices',
    content:
      'Our teachers are doing incredible work every day. From integrating land-based learning with digital tools to creating engaging quizzes that celebrate cultural knowledge—share your best practices and inspire fellow educators!',
    category: 'community',
  },

  // --- Tips ---
  {
    title: 'Tip: Organize Your Courses with Modules',
    content:
      'Break your courses into clear modules for better organization. Students can track their progress through each module, and you can release content on a schedule. A well-structured course keeps learners engaged and on track.',
    category: 'tip',
  },
  {
    title: 'Tip: Use Announcements to Keep Everyone Informed',
    content:
      'Pin important announcements to the top of your course page so students never miss critical updates. Regular communication builds trust and keeps your learning community connected.',
    category: 'tip',
  },
  {
    title: 'Tip: Set Up Your Parent Dashboard',
    content:
      'Parents play a crucial role in student success. Encourage families to set up their Parent Dashboard so they can stay informed about assignments, grades, and school announcements. Connected families mean supported students.',
    category: 'tip',
  },
  {
    title: 'Tip: Leverage the Calendar for Assignment Planning',
    content:
      'Use the built-in calendar to plan assignments and deadlines. Students can see everything at a glance, and you can avoid scheduling conflicts. A clear timeline reduces stress and improves outcomes.',
    category: 'tip',
  },
]

/**
 * Pick a random post from the content library, optionally filtered by category.
 */
export function getRandomContent(category?: PostCategory): ContentTemplate {
  const pool = category
    ? CONTENT_LIBRARY.filter((p) => p.category === category)
    : CONTENT_LIBRARY
  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * Get content templates by category.
 */
export function getContentByCategory(category: PostCategory): ContentTemplate[] {
  return CONTENT_LIBRARY.filter((p) => p.category === category)
}
