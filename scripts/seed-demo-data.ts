/**
 * Wolf Whale Learning Management System - Seed Demo Data
 *
 * Populates ALL 4 demo accounts (student, teacher, parent, admin) with rich,
 * realistic data so dashboards look full and impressive.
 *
 * Prerequisites:
 *   - Run `npx tsx scripts/create-test-accounts.ts` first to ensure demo
 *     accounts and tenant exist.
 *   - NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Usage:
 *   npx tsx scripts/seed-demo-data.ts
 *
 * Idempotent: deletes old demo data before inserting fresh data.
 */

import { createClient } from '@supabase/supabase-js'
import * as path from 'path'
import * as fs from 'fs'

// ---------------------------------------------------------------------------
// Load environment variables from .env.local
// ---------------------------------------------------------------------------

function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return
  const content = fs.readFileSync(filePath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    const value = trimmed.slice(eqIndex + 1).trim()
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvFile(path.resolve(__dirname, '../.env.local'))

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL is required.')
  process.exit(1)
}
if (!SUPABASE_SERVICE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is required.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

function dateOnly(daysOffset: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  return d.toISOString().split('T')[0]
}

/** Returns an array of past weekday dates (YYYY-MM-DD), going back N school days */
function getSchoolDays(count: number): string[] {
  const dates: string[] = []
  const d = new Date()
  while (dates.length < count) {
    d.setDate(d.getDate() - 1)
    const dayOfWeek = d.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push(d.toISOString().split('T')[0])
    }
  }
  return dates
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('====================================================================')
  console.log('Wolf Whale Learning Management System - Seed Demo Data')
  console.log('====================================================================')
  console.log(`Supabase URL: ${SUPABASE_URL}`)
  console.log('')

  // =========================================================================
  // Step 1: Look up demo users and tenant
  // =========================================================================
  console.log('Step 1: Looking up demo users and tenant...')
  console.log('--------------------------------------------------------------------')

  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
  if (usersError) {
    console.error(`  [ERROR] Failed to list users: ${usersError.message}`)
    process.exit(1)
  }

  const studentUser = usersData.users.find(u => u.email === 'student@wolfwhale.ca')
  const teacherUser = usersData.users.find(u => u.email === 'teacher@wolfwhale.ca')
  const parentUser  = usersData.users.find(u => u.email === 'parent@wolfwhale.ca')
  const adminUser   = usersData.users.find(u => u.email === 'admin@wolfwhale.ca')

  if (!studentUser || !teacherUser || !parentUser || !adminUser) {
    console.error('  [ERROR] Could not find all demo users. Run create-test-accounts.ts first.')
    console.error(`  student: ${studentUser?.id || 'NOT FOUND'}`)
    console.error(`  teacher: ${teacherUser?.id || 'NOT FOUND'}`)
    console.error(`  parent:  ${parentUser?.id  || 'NOT FOUND'}`)
    console.error(`  admin:   ${adminUser?.id   || 'NOT FOUND'}`)
    process.exit(1)
  }

  const studentId = studentUser.id
  const teacherId = teacherUser.id
  const parentId  = parentUser.id
  const adminId   = adminUser.id

  console.log(`  student: ${studentId}`)
  console.log(`  teacher: ${teacherId}`)
  console.log(`  parent:  ${parentId}`)
  console.log(`  admin:   ${adminId}`)

  // Look up tenant
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', 'demo')
    .single()

  if (tenantError || !tenant) {
    console.error(`  [ERROR] Could not find tenant with slug 'demo': ${tenantError?.message}`)
    process.exit(1)
  }

  const tenantId = tenant.id
  console.log(`  tenant:  ${tenantId}`)
  console.log('')

  // =========================================================================
  // Step 2: Clean up old demo data
  // =========================================================================
  console.log('Step 2: Cleaning up old demo data...')
  console.log('--------------------------------------------------------------------')

  // Delete in reverse dependency order
  const courseNames = [
    'Mathematics 8', 'English Language Arts', 'Science 8',
    'Social Studies', 'Physical Education', 'Introduction to Science',
  ]

  // First, get existing course IDs to clean up related data
  const { data: existingCourses } = await supabase
    .from('courses')
    .select('id')
    .eq('tenant_id', tenantId)
    .in('name', courseNames)

  const existingCourseIds = (existingCourses || []).map(c => c.id)

  if (existingCourseIds.length > 0) {
    // Delete grades first (references submissions and assignments)
    const { error: e1 } = await supabase.from('grades').delete().in('course_id', existingCourseIds)
    if (e1) console.warn(`  [WARN] grades cleanup: ${e1.message}`)
    else console.log('  [OK] Cleaned up grades')

    // Delete submissions (references assignments)
    const { data: existingAssignments } = await supabase
      .from('assignments')
      .select('id')
      .in('course_id', existingCourseIds)
    const existingAssignmentIds = (existingAssignments || []).map(a => a.id)

    if (existingAssignmentIds.length > 0) {
      const { error: e2 } = await supabase.from('submissions').delete().in('assignment_id', existingAssignmentIds)
      if (e2) console.warn(`  [WARN] submissions cleanup: ${e2.message}`)
      else console.log('  [OK] Cleaned up submissions')
    }

    // Delete assignments
    const { error: e3 } = await supabase.from('assignments').delete().in('course_id', existingCourseIds)
    if (e3) console.warn(`  [WARN] assignments cleanup: ${e3.message}`)
    else console.log('  [OK] Cleaned up assignments')

    // Delete attendance records
    const { error: e4 } = await supabase.from('attendance_records').delete().in('course_id', existingCourseIds)
    if (e4) console.warn(`  [WARN] attendance_records cleanup: ${e4.message}`)
    else console.log('  [OK] Cleaned up attendance records')

    // Delete lessons
    const { error: e5 } = await supabase.from('lessons').delete().in('course_id', existingCourseIds)
    if (e5) console.warn(`  [WARN] lessons cleanup: ${e5.message}`)
    else console.log('  [OK] Cleaned up lessons')

    // Delete course enrollments
    const { error: e6 } = await supabase.from('course_enrollments').delete().in('course_id', existingCourseIds)
    if (e6) console.warn(`  [WARN] course_enrollments cleanup: ${e6.message}`)
    else console.log('  [OK] Cleaned up course enrollments')

    // Delete announcements tied to these courses
    const { error: e7 } = await supabase.from('announcements').delete().in('course_id', existingCourseIds)
    if (e7) console.warn(`  [WARN] announcements cleanup: ${e7.message}`)
    else console.log('  [OK] Cleaned up course announcements')

    // Delete the courses themselves
    const { error: e8 } = await supabase.from('courses').delete().in('id', existingCourseIds)
    if (e8) console.warn(`  [WARN] courses cleanup: ${e8.message}`)
    else console.log('  [OK] Cleaned up courses')
  }

  // Clean school-wide announcements
  const { error: annErr } = await supabase
    .from('announcements')
    .delete()
    .eq('tenant_id', tenantId)
    .is('course_id', null)
  if (annErr) console.warn(`  [WARN] school-wide announcements cleanup: ${annErr.message}`)
  else console.log('  [OK] Cleaned up school-wide announcements')

  // Clean audit logs
  const { error: auditErr } = await supabase.from('audit_logs').delete().eq('tenant_id', tenantId)
  if (auditErr) console.warn(`  [WARN] audit_logs cleanup: ${auditErr.message}`)
  else console.log('  [OK] Cleaned up audit logs')

  // Clean conversations and messages
  const { data: existingConvos } = await supabase
    .from('conversations')
    .select('id')
    .eq('tenant_id', tenantId)
  const existingConvoIds = (existingConvos || []).map(c => c.id)
  if (existingConvoIds.length > 0) {
    await supabase.from('message_read_receipts').delete().in('message_id',
      (await supabase.from('messages').select('id').in('conversation_id', existingConvoIds)).data?.map(m => m.id) || []
    )
    await supabase.from('messages').delete().in('conversation_id', existingConvoIds)
    await supabase.from('conversation_members').delete().in('conversation_id', existingConvoIds)
    await supabase.from('conversations').delete().in('id', existingConvoIds)
    console.log('  [OK] Cleaned up conversations and messages')
  }

  // Clean gamification data for student
  await supabase.from('xp_transactions').delete().eq('student_id', studentId).eq('tenant_id', tenantId)
  await supabase.from('coin_transactions').delete().eq('student_id', studentId).eq('tenant_id', tenantId)
  await supabase.from('student_achievements').delete().eq('student_id', studentId).eq('tenant_id', tenantId)
  await supabase.from('student_xp').delete().eq('student_id', studentId).eq('tenant_id', tenantId)
  await supabase.from('student_pets').delete().eq('student_id', studentId).eq('tenant_id', tenantId)
  console.log('  [OK] Cleaned up gamification data')

  // Clean notifications
  await supabase.from('notifications').delete().eq('tenant_id', tenantId)
  console.log('  [OK] Cleaned up notifications')

  console.log('')

  // =========================================================================
  // Step 3: Create Courses
  // =========================================================================
  console.log('Step 3: Creating courses...')
  console.log('--------------------------------------------------------------------')

  const courseDefs = [
    {
      name: 'Mathematics 8',
      description: 'Grade 8 Mathematics covering algebra, geometry, statistics, and problem-solving strategies. Students develop critical thinking through real-world mathematical applications.',
      subject: 'Mathematics',
      grade_level: '8',
      semester: 'Spring 2026',
    },
    {
      name: 'English Language Arts',
      description: 'Grade 8 English Language Arts focusing on reading comprehension, creative and analytical writing, grammar, vocabulary development, and public speaking skills.',
      subject: 'English',
      grade_level: '8',
      semester: 'Spring 2026',
    },
    {
      name: 'Science 8',
      description: 'Grade 8 Science exploring earth sciences, biology, chemistry, and physics through hands-on experiments and the scientific method.',
      subject: 'Science',
      grade_level: '8',
      semester: 'Spring 2026',
    },
    {
      name: 'Social Studies',
      description: 'Grade 8 Social Studies examining Canadian history, geography, government, economics, and civic responsibility.',
      subject: 'Social Studies',
      grade_level: '8',
      semester: 'Spring 2026',
    },
    {
      name: 'Physical Education',
      description: 'Grade 8 Physical Education promoting fitness, teamwork, and healthy lifestyle habits through sports, exercise routines, and wellness education.',
      subject: 'Physical Education',
      grade_level: '8',
      semester: 'Spring 2026',
    },
  ]

  const courseIds: Record<string, string> = {}

  for (const courseDef of courseDefs) {
    const { data: course, error: courseErr } = await supabase
      .from('courses')
      .insert({
        tenant_id: tenantId,
        name: courseDef.name,
        description: courseDef.description,
        subject: courseDef.subject,
        grade_level: courseDef.grade_level,
        semester: courseDef.semester,
        created_by: teacherId,
        status: 'active',
        start_date: '2026-01-06',
        end_date: '2026-06-26',
      })
      .select('id')
      .single()

    if (courseErr) {
      console.error(`  [ERROR] Failed to create "${courseDef.name}": ${courseErr.message}`)
      continue
    }

    courseIds[courseDef.name] = course.id
    console.log(`  [OK] "${courseDef.name}" => ${course.id}`)
  }

  console.log('')

  // =========================================================================
  // Step 4: Enroll student in all courses
  // =========================================================================
  console.log('Step 4: Enrolling student in all courses...')
  console.log('--------------------------------------------------------------------')

  for (const [name, courseId] of Object.entries(courseIds)) {
    const { error: enrollErr } = await supabase
      .from('course_enrollments')
      .insert({
        tenant_id: tenantId,
        course_id: courseId,
        student_id: studentId,
        teacher_id: teacherId,
        status: 'active',
      })

    if (enrollErr) {
      console.error(`  [ERROR] Enrollment in "${name}": ${enrollErr.message}`)
    } else {
      console.log(`  [OK] Enrolled student in "${name}"`)
    }
  }

  console.log('')

  // =========================================================================
  // Step 5: Create Lessons
  // =========================================================================
  console.log('Step 5: Creating lessons...')
  console.log('--------------------------------------------------------------------')

  const lessonDefs: Record<string, { title: string; description: string; content: string }[]> = {
    'Mathematics 8': [
      { title: 'Introduction to Algebra', description: 'Variables, expressions, and equations', content: 'In this lesson we explore the fundamentals of algebra. We start with understanding variables as placeholders for unknown values, then move to writing and evaluating algebraic expressions. Students will learn to translate word problems into equations and solve simple one-step equations.' },
      { title: 'Linear Equations and Graphing', description: 'Graphing on the coordinate plane', content: 'Students learn to plot points on a coordinate plane, identify slope and y-intercept, and graph linear equations in slope-intercept form (y = mx + b). Practice problems reinforce connecting equations to their visual representations.' },
      { title: 'Geometry: Area and Perimeter', description: 'Calculating area and perimeter of shapes', content: 'This lesson covers formulas for area and perimeter of rectangles, triangles, parallelograms, and circles. Students apply these concepts to real-world scenarios like designing a garden or calculating paint needed for a room.' },
      { title: 'Statistics and Data Analysis', description: 'Mean, median, mode, and data representation', content: 'Students learn to calculate measures of central tendency (mean, median, mode) and create data displays including histograms, box plots, and scatter plots. We discuss how to interpret data and avoid common statistical pitfalls.' },
    ],
    'English Language Arts': [
      { title: 'Elements of a Short Story', description: 'Plot, character, setting, conflict, theme', content: 'This lesson introduces the five key elements of a short story. We read "The Most Dangerous Game" by Richard Connell and identify each element. Students begin to understand how authors craft narratives using these building blocks.' },
      { title: 'Persuasive Writing Techniques', description: 'Ethos, pathos, logos in writing', content: 'Students explore the three rhetorical appeals and how to use them effectively in persuasive essays. We analyze sample editorials and advertisements before students draft their own persuasive paragraph on a topic of their choice.' },
      { title: 'Poetry Analysis', description: 'Figurative language and poetic devices', content: 'We study metaphor, simile, personification, alliteration, imagery, and rhyme scheme through classic and contemporary poems. Students practice identifying devices and explaining their effect on meaning and tone.' },
      { title: 'Research and Citation Skills', description: 'Finding sources and MLA format', content: 'Students learn to evaluate online and library sources for credibility, take effective notes, and cite sources using MLA format. We discuss plagiarism and the importance of academic integrity.' },
    ],
    'Science 8': [
      { title: 'The Scientific Method', description: 'Hypothesis, experiment, conclusion', content: 'This lesson covers the steps of the scientific method: observation, question, hypothesis, experiment, data collection, analysis, and conclusion. Students design their own simple experiment to test a hypothesis about plant growth.' },
      { title: 'Cells and Cell Division', description: 'Cell structure, mitosis, and meiosis', content: 'We explore the parts of animal and plant cells using microscope observation. Students learn about cell organelles and their functions, then study the processes of mitosis and meiosis through animations and diagrams.' },
      { title: 'Forces and Motion', description: 'Newton\'s laws of motion', content: 'Students discover Newton\'s three laws of motion through hands-on experiments with toy cars, ramps, and spring scales. We calculate force, mass, and acceleration using F=ma and discuss friction and gravity.' },
      { title: 'Earth\'s Water Cycle', description: 'Evaporation, condensation, precipitation', content: 'This lesson traces water through the hydrological cycle. Students build mini water cycle models in sealed containers and observe evaporation, condensation, and precipitation. We discuss the importance of fresh water conservation.' },
    ],
    'Social Studies': [
      { title: 'Canadian Confederation', description: 'The formation of Canada in 1867', content: 'We examine the political, economic, and social factors that led to Confederation. Students study the key figures including Sir John A. Macdonald, George-Etienne Cartier, and George Brown, and debate the perspectives of each province.' },
      { title: 'Indigenous Peoples and Treaties', description: 'First Nations, Metis, and Inuit history', content: 'This lesson covers the diverse cultures and histories of Indigenous peoples in Canada, treaty relationships, the impact of colonization, and the ongoing journey toward reconciliation. We read primary source documents and personal narratives.' },
      { title: 'Government and Democracy', description: 'How Canadian government works', content: 'Students learn about the three branches of government (executive, legislative, judicial), the parliamentary system, how laws are made, and the roles of municipal, provincial, and federal governments.' },
    ],
    'Physical Education': [
      { title: 'Fitness Assessment and Goal Setting', description: 'Baseline testing and personal goals', content: 'Students complete baseline fitness assessments including the pacer test, sit-and-reach, push-ups, and curl-ups. They learn about the five components of fitness and set SMART goals for the semester.' },
      { title: 'Basketball Fundamentals', description: 'Dribbling, passing, and shooting', content: 'This unit covers proper dribbling technique, chest and bounce passes, layups, and free throw shooting form. Students practice through drills and modified games, focusing on teamwork and sportsmanship.' },
      { title: 'Nutrition and Healthy Living', description: 'Canada\'s Food Guide and balanced diet', content: 'Students learn about macronutrients and micronutrients, read nutrition labels, and plan balanced meals using Canada\'s Food Guide. We discuss the connection between nutrition, physical activity, and mental health.' },
    ],
  }

  const lessonIds: Record<string, string[]> = {}

  for (const [courseName, lessons] of Object.entries(lessonDefs)) {
    const courseId = courseIds[courseName]
    if (!courseId) continue

    lessonIds[courseName] = []

    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i]
      const { data: lessonData, error: lessonErr } = await supabase
        .from('lessons')
        .insert({
          tenant_id: tenantId,
          course_id: courseId,
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          order_index: i + 1,
          created_by: teacherId,
          status: 'published',
          published_at: daysAgo(30 - i * 5),
        })
        .select('id')
        .single()

      if (lessonErr) {
        console.error(`  [ERROR] Lesson "${lesson.title}": ${lessonErr.message}`)
        continue
      }

      lessonIds[courseName].push(lessonData.id)
    }

    console.log(`  [OK] Created ${lessons.length} lessons for "${courseName}"`)
  }

  console.log('')

  // =========================================================================
  // Step 6: Create Assignments
  // =========================================================================
  console.log('Step 6: Creating assignments...')
  console.log('--------------------------------------------------------------------')

  interface AssignmentDef {
    title: string
    description: string
    type: string
    dueOffset: number   // days from now (negative = past)
    maxPoints: number
    instructions: string
  }

  const assignmentDefs: Record<string, AssignmentDef[]> = {
    'Mathematics 8': [
      { title: 'Algebra Problem Set #1', description: 'Solve 20 algebra problems covering variables and expressions', type: 'homework', dueOffset: -14, maxPoints: 100, instructions: 'Complete all 20 problems showing your work. Simplify all expressions fully.' },
      { title: 'Linear Equations Quiz', description: 'Quiz on graphing and solving linear equations', type: 'quiz', dueOffset: -7, maxPoints: 100, instructions: 'Answer all 15 questions. You have 30 minutes. No calculator on Part A.' },
      { title: 'Geometry Measurement Project', description: 'Measure and calculate areas in your home', type: 'project', dueOffset: 5, maxPoints: 100, instructions: 'Choose 5 rooms in your home. Measure dimensions, draw floor plans to scale, and calculate total area and perimeter for each.' },
      { title: 'Statistics Unit Exam', description: 'Comprehensive exam on data analysis and statistics', type: 'exam', dueOffset: 14, maxPoints: 100, instructions: 'This exam covers all material from the statistics unit. Bring a pencil and calculator.' },
    ],
    'English Language Arts': [
      { title: 'Short Story Analysis Essay', description: 'Analyze the theme of "The Most Dangerous Game"', type: 'homework', dueOffset: -12, maxPoints: 100, instructions: 'Write a 5-paragraph essay analyzing the theme of survival in the story. Include at least 3 textual evidence quotes.' },
      { title: 'Persuasive Essay Draft', description: 'First draft of persuasive essay on a social issue', type: 'homework', dueOffset: -5, maxPoints: 100, instructions: 'Choose a school or community issue and write a 4-5 paragraph persuasive essay using ethos, pathos, and logos.' },
      { title: 'Poetry Portfolio', description: 'Create a portfolio of original poems', type: 'project', dueOffset: 3, maxPoints: 100, instructions: 'Write 4 original poems using different forms (haiku, sonnet, free verse, limerick). Include a reflection on your creative process.' },
      { title: 'Vocabulary Quiz: Unit 4', description: 'Quiz on vocabulary words from Unit 4 readings', type: 'quiz', dueOffset: 7, maxPoints: 100, instructions: 'Define each term and use it correctly in a sentence. 25 words total.' },
    ],
    'Science 8': [
      { title: 'Lab Report: Plant Growth Experiment', description: 'Write up your plant growth hypothesis experiment', type: 'homework', dueOffset: -10, maxPoints: 100, instructions: 'Follow the lab report template. Include hypothesis, materials, procedure, data table, graph, and conclusion.' },
      { title: 'Cell Diagram and Functions Quiz', description: 'Label cell parts and describe their functions', type: 'quiz', dueOffset: -3, maxPoints: 100, instructions: 'Label the provided cell diagram and write one sentence describing each organelle\'s function. 20 points per section.' },
      { title: 'Science Fair Project Proposal', description: 'Submit your science fair project proposal', type: 'project', dueOffset: 4, maxPoints: 100, instructions: 'Describe your research question, hypothesis, planned experiment, materials list, and timeline. 2-3 pages.' },
      { title: 'Forces and Motion Exam', description: 'Unit test on Newton\'s Laws', type: 'exam', dueOffset: 10, maxPoints: 100, instructions: 'Multiple choice, short answer, and calculation problems. Covers all three of Newton\'s Laws. 60 minutes.' },
    ],
    'Social Studies': [
      { title: 'Confederation Timeline', description: 'Create an illustrated timeline of events leading to Confederation', type: 'homework', dueOffset: -15, maxPoints: 100, instructions: 'Include at least 10 key events from 1840-1867. Each event needs a date, description, and illustration or image.' },
      { title: 'Indigenous History Reflection', description: 'Write a reflection on Indigenous perspectives', type: 'homework', dueOffset: -6, maxPoints: 100, instructions: 'After reading the assigned primary sources, write a 2-page reflection on what you learned about Indigenous experiences. Use specific references.' },
      { title: 'Government Research Presentation', description: 'Research and present on a branch of government', type: 'project', dueOffset: 6, maxPoints: 100, instructions: 'Create a 5-minute presentation on your assigned branch of government. Include visuals and be prepared for Q&A.' },
    ],
    'Physical Education': [
      { title: 'Fitness Goal Progress Report', description: 'Report on progress toward your fitness goals', type: 'homework', dueOffset: -8, maxPoints: 100, instructions: 'Review your SMART goals from the beginning of the unit. Track your progress with data and write about what worked and what you would change.' },
      { title: 'Basketball Skills Assessment', description: 'Demonstrate dribbling, passing, and shooting skills', type: 'exam', dueOffset: -2, maxPoints: 100, instructions: 'You will be assessed on dribbling (crossover and between legs), 3 types of passes, and shooting (layup and free throw). Rubric provided.' },
      { title: 'Nutrition Log and Analysis', description: 'Track your food intake for 5 days and analyze nutrition', type: 'project', dueOffset: 8, maxPoints: 100, instructions: 'Log everything you eat for 5 consecutive days. Use Canada\'s Food Guide to analyze your intake. Write a 1-page summary of findings.' },
    ],
  }

  // Track assignments for submissions/grades
  const assignmentData: { id: string; courseName: string; courseId: string; dueOffset: number; title: string; maxPoints: number }[] = []

  for (const [courseName, assignments] of Object.entries(assignmentDefs)) {
    const courseId = courseIds[courseName]
    if (!courseId) continue

    for (const asgn of assignments) {
      const { data: asgnData, error: asgnErr } = await supabase
        .from('assignments')
        .insert({
          tenant_id: tenantId,
          course_id: courseId,
          title: asgn.title,
          description: asgn.description,
          instructions: asgn.instructions,
          type: asgn.type,
          created_by: teacherId,
          due_date: daysFromNow(asgn.dueOffset),
          available_date: daysAgo(Math.abs(asgn.dueOffset) + 7),
          max_points: asgn.maxPoints,
          submission_type: 'text',
          allow_late_submission: true,
          late_submission_days: 3,
          status: 'assigned',
        })
        .select('id')
        .single()

      if (asgnErr) {
        console.error(`  [ERROR] Assignment "${asgn.title}": ${asgnErr.message}`)
        continue
      }

      assignmentData.push({
        id: asgnData.id,
        courseName,
        courseId,
        dueOffset: asgn.dueOffset,
        title: asgn.title,
        maxPoints: asgn.maxPoints,
      })
    }

    console.log(`  [OK] Created ${assignments.length} assignments for "${courseName}"`)
  }

  console.log('')

  // =========================================================================
  // Step 7: Create Submissions & Grades for past-due assignments
  // =========================================================================
  console.log('Step 7: Creating submissions & grades...')
  console.log('--------------------------------------------------------------------')

  const gradeSpread = [
    { percentage: 95, letter: 'A+', feedback: 'Outstanding work! Your understanding of the material is excellent.' },
    { percentage: 91, letter: 'A',  feedback: 'Great job! Very thorough and well-organized submission.' },
    { percentage: 88, letter: 'A-', feedback: 'Strong work. A few minor areas could use more detail.' },
    { percentage: 85, letter: 'B+', feedback: 'Good effort. Consider expanding on your analysis in future assignments.' },
    { percentage: 82, letter: 'B',  feedback: 'Solid understanding shown. Review the section on key concepts for improvement.' },
    { percentage: 78, letter: 'B-', feedback: 'Decent work but some key points were missed. See my annotations.' },
    { percentage: 75, letter: 'C+', feedback: 'Adequate work. Please come to office hours to discuss areas for improvement.' },
    { percentage: 72, letter: 'C+', feedback: 'Needs improvement in several areas. Let\'s work together on strengthening your skills.' },
    { percentage: 98, letter: 'A+', feedback: 'Exceptional! This is some of the best work I\'ve seen this semester.' },
    { percentage: 93, letter: 'A',  feedback: 'Excellent analysis and presentation. Keep up the great work!' },
  ]

  const pastAssignments = assignmentData.filter(a => a.dueOffset < 0)
  let gradeIndex = 0
  let submittedCount = 0
  let missingCount = 0

  for (const asgn of pastAssignments) {
    // Leave ~15% of past assignments without submissions (missing)
    if (gradeIndex % 7 === 4) {
      missingCount++
      gradeIndex++
      continue
    }

    const grade = gradeSpread[gradeIndex % gradeSpread.length]
    const pointsEarned = Math.round((grade.percentage / 100) * asgn.maxPoints * 100) / 100

    // Create submission
    const { data: subData, error: subErr } = await supabase
      .from('submissions')
      .insert({
        tenant_id: tenantId,
        assignment_id: asgn.id,
        student_id: studentId,
        submission_text: `This is my completed work for "${asgn.title}". I have followed all the instructions and included all required components.`,
        status: 'graded',
        submitted_at: daysFromNow(asgn.dueOffset - 1),
        submitted_late: false,
        graded_at: daysFromNow(asgn.dueOffset + 2),
        graded_by: teacherId,
      })
      .select('id')
      .single()

    if (subErr) {
      console.error(`  [ERROR] Submission for "${asgn.title}": ${subErr.message}`)
      gradeIndex++
      continue
    }

    // Create grade
    const { error: gradeErr } = await supabase
      .from('grades')
      .insert({
        tenant_id: tenantId,
        submission_id: subData.id,
        assignment_id: asgn.id,
        student_id: studentId,
        course_id: asgn.courseId,
        points_earned: pointsEarned,
        percentage: grade.percentage,
        letter_grade: grade.letter,
        feedback: grade.feedback,
        graded_by: teacherId,
        graded_at: daysFromNow(asgn.dueOffset + 2),
      })

    if (gradeErr) {
      console.error(`  [ERROR] Grade for "${asgn.title}": ${gradeErr.message}`)
    }

    submittedCount++
    gradeIndex++
  }

  console.log(`  [OK] Created ${submittedCount} submissions with grades`)
  console.log(`  [OK] Left ${missingCount} assignments as "missing" (no submission)`)
  console.log('')

  // =========================================================================
  // Step 8: Create Attendance Records
  // =========================================================================
  console.log('Step 8: Creating attendance records...')
  console.log('--------------------------------------------------------------------')

  const schoolDays = getSchoolDays(30)
  const attendanceStatuses = ['present', 'present', 'present', 'present', 'present',
    'present', 'present', 'present', 'present', 'present',
    'present', 'present', 'present', 'present', 'present',
    'present', 'present', 'tardy', 'absent', 'excused']

  let attendanceCount = 0

  for (const courseId of Object.values(courseIds)) {
    const records = schoolDays.map(date => ({
      tenant_id: tenantId,
      course_id: courseId,
      student_id: studentId,
      attendance_date: date,
      status: randomPick(attendanceStatuses),
      marked_by: teacherId,
      notes: null as string | null,
    }))

    // Add notes for non-present statuses
    for (const record of records) {
      if (record.status === 'tardy') record.notes = 'Arrived 10 minutes late'
      if (record.status === 'absent') record.notes = 'Unexcused absence'
      if (record.status === 'excused') record.notes = 'Doctor appointment'
    }

    const { error: attErr } = await supabase.from('attendance_records').insert(records)

    if (attErr) {
      console.error(`  [ERROR] Attendance for course ${courseId}: ${attErr.message}`)
    } else {
      attendanceCount += records.length
    }
  }

  console.log(`  [OK] Created ${attendanceCount} attendance records across ${Object.keys(courseIds).length} courses`)
  console.log('')

  // =========================================================================
  // Step 9: Create Gamification Data
  // =========================================================================
  console.log('Step 9: Creating gamification data...')
  console.log('--------------------------------------------------------------------')

  // Student XP record
  const { error: xpErr } = await supabase
    .from('student_xp')
    .upsert({
      tenant_id: tenantId,
      student_id: studentId,
      total_xp: 1250,
      current_level: 7,
      current_tier: 'Adventurer',
      streak_days: 12,
      last_login_date: dateOnly(0),
      coins: 340,
      total_coins_earned: 520,
      total_coins_spent: 180,
    }, { onConflict: 'tenant_id,student_id' })

  if (xpErr) console.error(`  [ERROR] Student XP: ${xpErr.message}`)
  else console.log('  [OK] Student XP record (level 7, 1250 XP, 340 coins, 12-day streak)')

  // XP Transactions (20+ events over last 14 days)
  const xpEventTypes = [
    { source_type: 'assignment', amount: 50, description: 'Submitted assignment on time' },
    { source_type: 'lesson', amount: 25, description: 'Completed lesson' },
    { source_type: 'lesson_complete', amount: 30, description: 'Finished all lesson content' },
    { source_type: 'grade_a', amount: 75, description: 'Earned an A on assignment' },
    { source_type: 'grade_b', amount: 50, description: 'Earned a B on assignment' },
    { source_type: 'daily_login', amount: 10, description: 'Daily login bonus' },
    { source_type: 'streak', amount: 100, description: 'Login streak milestone' },
    { source_type: 'achievement', amount: 150, description: 'Achievement unlocked!' },
    { source_type: 'assignment_submit_ontime', amount: 60, description: 'Submitted homework before deadline' },
    { source_type: 'assignment_submit_early', amount: 80, description: 'Submitted assignment 2 days early' },
  ]

  const xpTransactions = []
  for (let i = 0; i < 25; i++) {
    const event = xpEventTypes[i % xpEventTypes.length]
    xpTransactions.push({
      tenant_id: tenantId,
      student_id: studentId,
      amount: event.amount,
      source_type: event.source_type,
      description: event.description,
      created_at: daysAgo(Math.floor(i * 14 / 25)),
    })
  }

  const { error: xpTxErr } = await supabase.from('xp_transactions').insert(xpTransactions)
  if (xpTxErr) console.error(`  [ERROR] XP transactions: ${xpTxErr.message}`)
  else console.log(`  [OK] Created ${xpTransactions.length} XP transactions`)

  // Coin Transactions
  const coinTransactions = [
    { amount: 50, transaction_type: 'earn', source_type: 'xp', description: 'Earned coins from XP milestone' },
    { amount: 75, transaction_type: 'earn', source_type: 'achievement', description: 'Achievement reward: First Perfect Score' },
    { amount: 25, transaction_type: 'earn', source_type: 'daily_bonus', description: 'Daily login bonus coins' },
    { amount: 100, transaction_type: 'earn', source_type: 'level_up', description: 'Level up reward!' },
    { amount: 50, transaction_type: 'earn', source_type: 'streak', description: '7-day streak bonus' },
    { amount: 30, transaction_type: 'earn', source_type: 'xp', description: 'XP milestone reached' },
    { amount: 40, transaction_type: 'earn', source_type: 'achievement', description: 'Achievement reward: Consistent Learner' },
    { amount: 150, transaction_type: 'earn', source_type: 'level_up', description: 'Level 7 reward!' },
    { amount: -80, transaction_type: 'spend', source_type: 'cosmetic', description: 'Purchased Arctic Explorer hat' },
    { amount: -100, transaction_type: 'spend', source_type: 'pet_interaction', description: 'Special treat for pet' },
  ].map((ct, i) => ({
    tenant_id: tenantId,
    student_id: studentId,
    amount: Math.abs(ct.amount),
    transaction_type: ct.transaction_type,
    source_type: ct.source_type,
    description: ct.description,
    created_at: daysAgo(Math.floor(i * 14 / 10)),
  }))

  const { error: coinTxErr } = await supabase.from('coin_transactions').insert(coinTransactions)
  if (coinTxErr) console.error(`  [ERROR] Coin transactions: ${coinTxErr.message}`)
  else console.log(`  [OK] Created ${coinTransactions.length} coin transactions`)

  // Student Achievements
  const achievements = [
    { achievement_id: 'first_login', unlocked_at: daysAgo(35) },
    { achievement_id: 'first_submission', unlocked_at: daysAgo(28) },
    { achievement_id: 'perfect_score', unlocked_at: daysAgo(20) },
    { achievement_id: 'streak_7', unlocked_at: daysAgo(14) },
    { achievement_id: 'bookworm', unlocked_at: daysAgo(10) },
    { achievement_id: 'all_courses_active', unlocked_at: daysAgo(7) },
  ].map(a => ({
    tenant_id: tenantId,
    student_id: studentId,
    achievement_id: a.achievement_id,
    unlocked_at: a.unlocked_at,
    displayed: true,
  }))

  const { error: achErr } = await supabase.from('student_achievements').insert(achievements)
  if (achErr) console.error(`  [ERROR] Achievements: ${achErr.message}`)
  else console.log(`  [OK] Created ${achievements.length} achievements`)

  // Student Pet
  const { error: petErr } = await supabase
    .from('student_pets')
    .upsert({
      tenant_id: tenantId,
      student_id: studentId,
      name: 'Luna',
      species: 'wolf',
      stage: 'adolescent',
      happiness: 85,
      energy: 70,
      knowledge: 65,
      health: 90,
      total_xp: 850,
      equipped_items: JSON.stringify(['arctic_hat', 'snow_boots']),
      unlocked_cosmetics: JSON.stringify(['arctic_hat', 'snow_boots', 'star_collar', 'forest_scarf']),
      last_fed_at: daysAgo(0),
      last_played_at: daysAgo(0),
      last_studied_at: daysAgo(1),
      last_rested_at: daysAgo(0),
    }, { onConflict: 'tenant_id,student_id' })

  if (petErr) console.error(`  [ERROR] Student pet: ${petErr.message}`)
  else console.log('  [OK] Student pet "Luna" (wolf, adolescent stage)')

  console.log('')

  // =========================================================================
  // Step 10: Create Announcements
  // =========================================================================
  console.log('Step 10: Creating announcements...')
  console.log('--------------------------------------------------------------------')

  const announcementsList = [
    {
      title: 'Welcome to Spring Semester 2026',
      content: 'Welcome back, everyone! We are excited to kick off the Spring 2026 semester at Wolf Whale Learning Management System. Please review your course schedules and make sure you have all required materials. Parent-teacher conferences will be held on February 20th. Contact the office if you have any questions. Let\'s make this a great semester!',
      course_id: null,
      created_by: adminId,
    },
    {
      title: 'Math Test Next Friday',
      content: 'Reminder: The Statistics Unit Exam is coming up next Friday. Please review chapters 8-11 in your textbook and complete all practice problems. Study guides are available on the course page. Come to Tuesday\'s review session if you need extra help. You may bring a calculator and one page of handwritten notes.',
      course_id: courseIds['Mathematics 8'],
      created_by: teacherId,
    },
    {
      title: 'Science Fair Projects Due Soon',
      content: 'Science Fair project proposals are due next week! Make sure your proposal includes: a clear research question, hypothesis, planned experiment procedure, materials list, and timeline. I\'ll provide feedback within 2 days so you can start your experiments. See the rubric posted on the course page for grading criteria.',
      course_id: courseIds['Science 8'],
      created_by: teacherId,
    },
  ]

  for (const ann of announcementsList) {
    const { error: annInsertErr } = await supabase
      .from('announcements')
      .insert({
        tenant_id: tenantId,
        course_id: ann.course_id,
        title: ann.title,
        content: ann.content,
        created_by: ann.created_by,
        published_at: ann.course_id ? daysAgo(3) : daysAgo(7),
        status: 'published',
      })

    if (annInsertErr) {
      console.error(`  [ERROR] Announcement "${ann.title}": ${annInsertErr.message}`)
    } else {
      console.log(`  [OK] "${ann.title}" ${ann.course_id ? '(course)' : '(school-wide)'}`)
    }
  }

  console.log('')

  // =========================================================================
  // Step 11: Create Conversations & Messages
  // =========================================================================
  console.log('Step 11: Creating conversations & messages...')
  console.log('--------------------------------------------------------------------')

  // Conversation 1: Student <-> Teacher about homework
  const { data: conv1, error: conv1Err } = await supabase
    .from('conversations')
    .insert({
      tenant_id: tenantId,
      type: 'direct',
      subject: 'Question about Algebra Homework',
      created_by: studentId,
    })
    .select('id')
    .single()

  if (conv1Err) {
    console.error(`  [ERROR] Conversation 1: ${conv1Err.message}`)
  } else {
    // Add members
    await supabase.from('conversation_members').insert([
      { conversation_id: conv1.id, user_id: studentId },
      { conversation_id: conv1.id, user_id: teacherId },
    ])

    // Add messages
    const messages1 = [
      { sender_id: studentId, content: 'Hi Mr. Teacher, I\'m having trouble with problem 15 on the algebra homework. I keep getting x = -3 but the answer key says x = 3. Can you help me see where I\'m going wrong?', created_at: daysAgo(3) },
      { sender_id: teacherId, content: 'Hi Alex! Good question. Check step 3 of your work - when you divide both sides by -1, the sign of x should flip. Remember: dividing or multiplying by a negative number reverses the inequality/sign. Try it again and let me know!', created_at: daysAgo(3) },
      { sender_id: studentId, content: 'Oh I see it now! I forgot to flip the sign when dividing by the negative. I got x = 3 this time. Thank you so much!', created_at: daysAgo(2) },
      { sender_id: teacherId, content: 'Perfect! That\'s a very common mistake. Great job catching it. If you run into any more issues, don\'t hesitate to ask. Keep up the good work! 🎉', created_at: daysAgo(2) },
    ]

    for (const msg of messages1) {
      await supabase.from('messages').insert({
        tenant_id: tenantId,
        conversation_id: conv1.id,
        sender_id: msg.sender_id,
        content: msg.content,
        created_at: msg.created_at,
      })
    }

    console.log('  [OK] Student-Teacher conversation (4 messages about algebra homework)')
  }

  // Conversation 2: Parent <-> Teacher about progress
  const { data: conv2, error: conv2Err } = await supabase
    .from('conversations')
    .insert({
      tenant_id: tenantId,
      type: 'direct',
      subject: 'Alex\'s Progress Update',
      created_by: parentId,
    })
    .select('id')
    .single()

  if (conv2Err) {
    console.error(`  [ERROR] Conversation 2: ${conv2Err.message}`)
  } else {
    await supabase.from('conversation_members').insert([
      { conversation_id: conv2.id, user_id: parentId },
      { conversation_id: conv2.id, user_id: teacherId },
    ])

    const messages2 = [
      { sender_id: parentId, content: 'Hello, this is Morgan Parent. I wanted to check in on how Alex is doing in your classes. I noticed a couple of assignments might be missing. Is everything okay?', created_at: daysAgo(5) },
      { sender_id: teacherId, content: 'Hi Morgan, thanks for reaching out! Alex is doing well overall - maintaining a B+ average across subjects. There is one missing assignment in Social Studies that I\'d encourage Alex to make up. Otherwise, Alex participates actively in class and shows strong critical thinking skills.', created_at: daysAgo(4) },
      { sender_id: parentId, content: 'Thank you for the update! I\'ll make sure Alex works on that missing assignment this weekend. Is there anything we can do at home to help support Alex\'s learning?', created_at: daysAgo(4) },
      { sender_id: teacherId, content: 'Great to hear! Encouraging daily reading (even 20 minutes) helps a lot. Also, Alex mentioned interest in the science fair - that enthusiasm is wonderful to nurture. I\'m always available for parent-teacher conferences if you\'d like to discuss anything in more detail.', created_at: daysAgo(3) },
    ]

    for (const msg of messages2) {
      await supabase.from('messages').insert({
        tenant_id: tenantId,
        conversation_id: conv2.id,
        sender_id: msg.sender_id,
        content: msg.content,
        created_at: msg.created_at,
      })
    }

    console.log('  [OK] Parent-Teacher conversation (4 messages about student progress)')
  }

  console.log('')

  // =========================================================================
  // Step 12: Create Audit Logs
  // =========================================================================
  console.log('Step 12: Creating audit logs...')
  console.log('--------------------------------------------------------------------')

  const auditLogEntries = [
    { user_id: adminId,   action: 'user.login',        resource_type: 'auth',        details: { method: 'email', ip: '192.168.1.100' } },
    { user_id: teacherId, action: 'user.login',        resource_type: 'auth',        details: { method: 'email', ip: '192.168.1.101' } },
    { user_id: studentId, action: 'user.login',        resource_type: 'auth',        details: { method: 'email', ip: '192.168.1.102' } },
    { user_id: parentId,  action: 'user.login',        resource_type: 'auth',        details: { method: 'email', ip: '192.168.1.103' } },
    { user_id: teacherId, action: 'course.create',     resource_type: 'course',      details: { course_name: 'Mathematics 8', subject: 'Mathematics' } },
    { user_id: teacherId, action: 'course.create',     resource_type: 'course',      details: { course_name: 'English Language Arts', subject: 'English' } },
    { user_id: teacherId, action: 'course.create',     resource_type: 'course',      details: { course_name: 'Science 8', subject: 'Science' } },
    { user_id: teacherId, action: 'grade.update',      resource_type: 'grade',       details: { student: 'Alex Student', assignment: 'Algebra Problem Set #1', grade: 'A+' } },
    { user_id: teacherId, action: 'grade.update',      resource_type: 'grade',       details: { student: 'Alex Student', assignment: 'Short Story Analysis', grade: 'A' } },
    { user_id: teacherId, action: 'grade.update',      resource_type: 'grade',       details: { student: 'Alex Student', assignment: 'Lab Report', grade: 'A-' } },
    { user_id: adminId,   action: 'enrollment.create', resource_type: 'enrollment',  details: { student: 'Alex Student', course: 'Mathematics 8' } },
    { user_id: adminId,   action: 'enrollment.create', resource_type: 'enrollment',  details: { student: 'Alex Student', course: 'Science 8' } },
    { user_id: adminId,   action: 'settings.update',   resource_type: 'tenant',      details: { setting: 'gamification_enabled', value: true } },
    { user_id: adminId,   action: 'settings.update',   resource_type: 'tenant',      details: { setting: 'grade_scale', value: 'traditional' } },
    { user_id: teacherId, action: 'user.login',        resource_type: 'auth',        details: { method: 'email', ip: '192.168.1.101' } },
    { user_id: adminId,   action: 'user.login',        resource_type: 'auth',        details: { method: 'email', ip: '192.168.1.100' } },
    { user_id: studentId, action: 'user.login',        resource_type: 'auth',        details: { method: 'email', ip: '192.168.1.102' } },
    { user_id: teacherId, action: 'course.create',     resource_type: 'course',      details: { course_name: 'Social Studies', subject: 'Social Studies' } },
    { user_id: teacherId, action: 'course.create',     resource_type: 'course',      details: { course_name: 'Physical Education', subject: 'Physical Education' } },
    { user_id: adminId,   action: 'enrollment.create', resource_type: 'enrollment',  details: { student: 'Alex Student', course: 'English Language Arts' } },
  ]

  const auditRecords = auditLogEntries.map((entry, i) => ({
    tenant_id: tenantId,
    user_id: entry.user_id,
    action: entry.action,
    resource_type: entry.resource_type,
    details: entry.details,
    ip_address: (entry.details as Record<string, unknown>).ip || '192.168.1.1',
    created_at: daysAgo(Math.floor(i * 7 / auditLogEntries.length)),
  }))

  const { error: auditInsertErr } = await supabase.from('audit_logs').insert(auditRecords)
  if (auditInsertErr) {
    console.error(`  [ERROR] Audit logs: ${auditInsertErr.message}`)
  } else {
    console.log(`  [OK] Created ${auditRecords.length} audit log entries`)
  }

  console.log('')

  // =========================================================================
  // Step 13: Create Notifications
  // =========================================================================
  console.log('Step 13: Creating notifications...')
  console.log('--------------------------------------------------------------------')

  const notifications = [
    // For student
    { user_id: studentId, type: 'grade_posted', title: 'New Grade Posted', message: 'Your Algebra Problem Set #1 has been graded: A+', read: true, created_at: daysAgo(12) },
    { user_id: studentId, type: 'grade_posted', title: 'New Grade Posted', message: 'Your Short Story Analysis Essay has been graded: A', read: true, created_at: daysAgo(10) },
    { user_id: studentId, type: 'assignment_due', title: 'Assignment Due Soon', message: 'Geometry Measurement Project is due in 5 days', read: false, created_at: daysAgo(2) },
    { user_id: studentId, type: 'assignment_due', title: 'Assignment Due Soon', message: 'Poetry Portfolio is due in 3 days', read: false, created_at: daysAgo(1) },
    { user_id: studentId, type: 'new_announcement', title: 'New Announcement', message: 'Math Test Next Friday - review chapters 8-11', read: true, created_at: daysAgo(3) },
    { user_id: studentId, type: 'new_announcement', title: 'New Announcement', message: 'Welcome to Spring Semester 2026', read: true, created_at: daysAgo(7) },
    { user_id: studentId, type: 'message_received', title: 'New Message', message: 'Jordan Teacher replied to your message', read: true, created_at: daysAgo(3) },
    // For teacher
    { user_id: teacherId, type: 'submission_graded', title: 'New Submission', message: 'Alex Student submitted Algebra Problem Set #1', read: true, created_at: daysAgo(14) },
    { user_id: teacherId, type: 'submission_graded', title: 'New Submission', message: 'Alex Student submitted Lab Report: Plant Growth', read: true, created_at: daysAgo(10) },
    { user_id: teacherId, type: 'message_received', title: 'New Message', message: 'Morgan Parent sent you a message about Alex\'s progress', read: true, created_at: daysAgo(5) },
    { user_id: teacherId, type: 'message_received', title: 'New Message', message: 'Alex Student has a question about homework', read: true, created_at: daysAgo(3) },
    // For parent
    { user_id: parentId, type: 'grade_posted', title: 'Grade Update', message: 'Alex received an A+ on Algebra Problem Set #1', read: true, created_at: daysAgo(12) },
    { user_id: parentId, type: 'grade_posted', title: 'Grade Update', message: 'Alex received an A on Short Story Analysis Essay', read: false, created_at: daysAgo(10) },
    { user_id: parentId, type: 'new_announcement', title: 'School Announcement', message: 'Welcome to Spring Semester 2026', read: true, created_at: daysAgo(7) },
    { user_id: parentId, type: 'message_received', title: 'New Message', message: 'Jordan Teacher replied about Alex\'s progress', read: false, created_at: daysAgo(3) },
    // For admin
    { user_id: adminId, type: 'system_alert', title: 'System Update', message: 'Platform maintenance completed successfully', read: true, created_at: daysAgo(5) },
    { user_id: adminId, type: 'enrollment_approved', title: 'New Enrollment', message: '5 new student enrollments processed', read: true, created_at: daysAgo(3) },
    { user_id: adminId, type: 'system_alert', title: 'Usage Report', message: 'Monthly usage report is ready for review', read: false, created_at: daysAgo(1) },
  ]

  for (const notif of notifications) {
    const { error: notifErr } = await supabase
      .from('notifications')
      .insert({
        tenant_id: tenantId,
        user_id: notif.user_id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        read: notif.read,
        read_at: notif.read ? daysAgo(0) : null,
        created_at: notif.created_at,
      })

    if (notifErr) {
      console.error(`  [ERROR] Notification "${notif.title}" for user ${notif.user_id}: ${notifErr.message}`)
    }
  }

  console.log(`  [OK] Created ${notifications.length} notifications across all users`)
  console.log('')

  // =========================================================================
  // Summary
  // =========================================================================
  console.log('====================================================================')
  console.log('DEMO DATA SEEDING COMPLETE')
  console.log('====================================================================')
  console.log('')
  console.log('  Data created:')
  console.log(`    - ${Object.keys(courseIds).length} courses`)
  console.log(`    - ${Object.keys(courseIds).length} course enrollments`)
  console.log(`    - ${Object.values(lessonIds).flat().length} lessons`)
  console.log(`    - ${assignmentData.length} assignments`)
  console.log(`    - ${submittedCount} submissions with grades`)
  console.log(`    - ${missingCount} missing assignments`)
  console.log(`    - ${attendanceCount} attendance records`)
  console.log(`    - ${xpTransactions.length} XP transactions`)
  console.log(`    - ${coinTransactions.length} coin transactions`)
  console.log(`    - ${achievements.length} achievements`)
  console.log('    - 1 student pet (Luna the wolf)')
  console.log(`    - ${announcementsList.length} announcements`)
  console.log('    - 2 conversations with 8 messages')
  console.log(`    - ${auditRecords.length} audit log entries`)
  console.log(`    - ${notifications.length} notifications`)
  console.log('')
  console.log('  Dashboards should now show rich data for:')
  console.log('    - student@wolfwhale.ca  (courses, grades, attendance, XP, pet)')
  console.log('    - teacher@wolfwhale.ca  (courses, students, grading, messages)')
  console.log('    - parent@wolfwhale.ca   (child progress, grades, messages)')
  console.log('    - admin@wolfwhale.ca    (audit logs, usage, announcements)')
  console.log('')
  console.log('====================================================================')
  console.log('Done! Sign in at http://localhost:3000')
  console.log('====================================================================')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
