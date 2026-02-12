'use server'

// WolfWhale LMS - AI Tutor Context Builder
// Server-side utility that fetches course data from Supabase
// and formats it into text blocks for the tutor system prompt.

import { createClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------------------
// buildCourseContext — assembles course info for the system prompt
// ---------------------------------------------------------------------------

/**
 * Fetch a student's enrolled courses and format them into a readable
 * text block that gets injected into the tutor's system prompt.
 *
 * If `courseId` is provided, only that course is included (with full detail).
 * Otherwise, all active enrollments are summarized.
 */
export async function buildCourseContext(
  studentId: string,
  courseId?: string,
): Promise<string> {
  const supabase = await createClient()

  // 1. Get the student's active enrollments
  let enrollmentQuery = supabase
    .from('course_enrollments')
    .select('course_id')
    .eq('student_id', studentId)
    .eq('status', 'active')

  if (courseId) {
    enrollmentQuery = enrollmentQuery.eq('course_id', courseId)
  }

  const { data: enrollments } = await enrollmentQuery

  if (!enrollments || enrollments.length === 0) {
    return 'The student is not currently enrolled in any courses.'
  }

  const courseIds = enrollments.map((e) => e.course_id)

  // 2. Fetch course details
  const { data: courses } = await supabase
    .from('courses')
    .select('id, name, subject, grade_level, description')
    .in('id', courseIds)
    .eq('status', 'active')

  if (!courses || courses.length === 0) {
    return 'No active courses found.'
  }

  // 3. Fetch latest published lesson per course
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, course_id, title, description, learning_objectives, content, order_index')
    .in('course_id', courseIds)
    .eq('status', 'published')
    .order('order_index', { ascending: false })

  // Group lessons by course, keep only the latest per course
  const latestLessonByCourse = new Map<string, {
    id: string
    title: string
    description: string | null
    learning_objectives: string[] | null
    content: unknown[]
  }>()

  if (lessons) {
    for (const lesson of lessons) {
      if (!latestLessonByCourse.has(lesson.course_id)) {
        latestLessonByCourse.set(lesson.course_id, {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          learning_objectives: lesson.learning_objectives as string[] | null,
          content: lesson.content as unknown[],
        })
      }
    }
  }

  // 4. Fetch flashcard decks with card counts
  const { data: decks } = await supabase
    .from('flashcard_decks')
    .select('id, course_id, title, status')
    .in('course_id', courseIds)
    .eq('status', 'published')

  // Count cards per deck
  const deckIds = (decks || []).map((d) => d.id)
  let cardCountByDeck = new Map<string, number>()
  let dueCountByDeck = new Map<string, number>()

  if (deckIds.length > 0) {
    const { data: cards } = await supabase
      .from('flashcards')
      .select('id, deck_id')
      .in('deck_id', deckIds)

    if (cards) {
      for (const card of cards) {
        cardCountByDeck.set(card.deck_id, (cardCountByDeck.get(card.deck_id) || 0) + 1)
      }
    }

    // Get due cards for this student
    const { data: progress } = await supabase
      .from('flashcard_progress')
      .select('deck_id, next_review_at')
      .eq('student_id', studentId)
      .in('deck_id', deckIds)

    const now = new Date()
    if (progress) {
      for (const p of progress) {
        if (!p.next_review_at || new Date(p.next_review_at) <= now) {
          dueCountByDeck.set(p.deck_id, (dueCountByDeck.get(p.deck_id) || 0) + 1)
        }
      }
    }
  }

  // Group decks by course
  const decksByCourse = new Map<string, { id: string; title: string; cardCount: number; dueCount: number }[]>()
  if (decks) {
    for (const deck of decks) {
      const list = decksByCourse.get(deck.course_id) || []
      list.push({
        id: deck.id,
        title: deck.title,
        cardCount: cardCountByDeck.get(deck.id) || 0,
        dueCount: dueCountByDeck.get(deck.id) || 0,
      })
      decksByCourse.set(deck.course_id, list)
    }
  }

  // 5. Fetch recent assignments (last 10 per course)
  const { data: assignments } = await supabase
    .from('assignments')
    .select('id, course_id, title, type, due_date, max_points, status')
    .in('course_id', courseIds)
    .eq('status', 'assigned')
    .order('due_date', { ascending: false })
    .limit(10)

  // Group assignments by course
  const assignmentsByCourse = new Map<string, { id: string; title: string; type: string; dueDate: string | null; points: number }[]>()
  if (assignments) {
    for (const a of assignments) {
      const list = assignmentsByCourse.get(a.course_id) || []
      list.push({
        id: a.id,
        title: a.title,
        type: a.type,
        dueDate: a.due_date,
        points: a.max_points,
      })
      assignmentsByCourse.set(a.course_id, list)
    }
  }

  // 6. Build the text block
  const sections: string[] = []

  for (const course of courses) {
    const lines: string[] = []
    lines.push(`--- ${course.name} ---`)
    lines.push(`Subject: ${course.subject || 'Not specified'}`)
    lines.push(`Grade Level: ${course.grade_level || 'Not specified'}`)

    if (course.description) {
      lines.push(`Description: ${course.description}`)
    }

    // Current lesson
    const lesson = latestLessonByCourse.get(course.id)
    if (lesson) {
      lines.push('')
      lines.push(`Current Lesson: ${lesson.title}`)
      if (lesson.description) {
        lines.push(`  Summary: ${lesson.description}`)
      }
      if (lesson.learning_objectives && lesson.learning_objectives.length > 0) {
        lines.push(`  Learning Objectives:`)
        for (const obj of lesson.learning_objectives) {
          lines.push(`    - ${obj}`)
        }
      }
    }

    // Flashcard decks
    const courseDecks = decksByCourse.get(course.id)
    if (courseDecks && courseDecks.length > 0) {
      lines.push('')
      lines.push('Flashcard Decks:')
      for (const deck of courseDecks) {
        const dueLabel = deck.dueCount > 0 ? ` (${deck.dueCount} due for review)` : ''
        lines.push(`  - ${deck.title}: ${deck.cardCount} cards${dueLabel}`)
      }
    }

    // Recent assignments
    const courseAssignments = assignmentsByCourse.get(course.id)
    if (courseAssignments && courseAssignments.length > 0) {
      lines.push('')
      lines.push('Recent Assignments:')
      for (const a of courseAssignments) {
        const dueLabel = a.dueDate ? ` (due: ${a.dueDate})` : ''
        lines.push(`  - ${a.title} [${a.type}] — ${a.points} points${dueLabel}`)
      }
    }

    sections.push(lines.join('\n'))
  }

  return sections.join('\n\n')
}

// ---------------------------------------------------------------------------
// buildGradingContext — assembles submission data for teacher grading
// ---------------------------------------------------------------------------

/**
 * Fetch a student's submission along with the assignment details,
 * rubric criteria, and student info. Formats into text for the
 * teacher grading prompt.
 */
export async function buildGradingContext(
  submissionId: string,
): Promise<string> {
  const supabase = await createClient()

  // 1. Get the submission
  const { data: submission } = await supabase
    .from('submissions')
    .select(`
      id,
      submission_text,
      file_name,
      submission_url,
      attempt_number,
      status,
      submitted_at,
      submitted_late,
      student_id,
      assignment_id
    `)
    .eq('id', submissionId)
    .single()

  if (!submission) {
    return 'Submission not found.'
  }

  // 2. Get the assignment
  const { data: assignment } = await supabase
    .from('assignments')
    .select(`
      id,
      title,
      description,
      instructions,
      type,
      max_points,
      category,
      course_id
    `)
    .eq('id', submission.assignment_id)
    .single()

  if (!assignment) {
    return 'Assignment not found for this submission.'
  }

  // 3. Get the rubric (if any)
  const { data: rubric } = await supabase
    .from('rubrics')
    .select('name, description, criteria')
    .eq('assignment_id', assignment.id)
    .maybeSingle()

  // 4. Get student info
  const { data: student } = await supabase
    .from('profiles')
    .select('full_name, grade_level')
    .eq('id', submission.student_id)
    .single()

  // 5. Get course name
  const { data: course } = await supabase
    .from('courses')
    .select('name, subject, grade_level')
    .eq('id', assignment.course_id)
    .single()

  // 6. Build the text block
  const lines: string[] = []

  lines.push('=== GRADING TASK ===')
  lines.push('')
  lines.push(`Student: ${student?.full_name || 'Unknown'}`)
  lines.push(`Student Grade Level: ${student?.grade_level || 'Not specified'}`)
  lines.push(`Course: ${course?.name || 'Unknown'} (${course?.subject || ''})`)
  lines.push('')
  lines.push('--- Assignment Details ---')
  lines.push(`Title: ${assignment.title}`)
  lines.push(`Type: ${assignment.type}`)
  lines.push(`Max Points: ${assignment.max_points}`)
  if (assignment.category) {
    lines.push(`Category: ${assignment.category}`)
  }
  if (assignment.description) {
    lines.push(`Description: ${assignment.description}`)
  }
  if (assignment.instructions) {
    lines.push(`Instructions: ${assignment.instructions}`)
  }

  // Rubric
  if (rubric) {
    lines.push('')
    lines.push('--- Rubric ---')
    lines.push(`Rubric Name: ${rubric.name}`)
    if (rubric.description) {
      lines.push(`Rubric Description: ${rubric.description}`)
    }

    const criteria = rubric.criteria as Array<{
      name: string
      description?: string
      max_points: number
      levels?: Array<{ label: string; points: number; description?: string }>
    }>

    if (criteria && criteria.length > 0) {
      lines.push('Criteria:')
      for (const c of criteria) {
        lines.push(`  - ${c.name} (max ${c.max_points} pts)${c.description ? ': ' + c.description : ''}`)
        if (c.levels && c.levels.length > 0) {
          for (const level of c.levels) {
            lines.push(`      ${level.label} (${level.points} pts)${level.description ? ' — ' + level.description : ''}`)
          }
        }
      }
    }
  }

  // Submission
  lines.push('')
  lines.push('--- Student Submission ---')
  lines.push(`Attempt: ${submission.attempt_number}`)
  lines.push(`Submitted: ${submission.submitted_at}`)
  if (submission.submitted_late) {
    lines.push('NOTE: This submission was submitted late.')
  }
  if (submission.submission_text) {
    lines.push('')
    lines.push('Submission Text:')
    lines.push(submission.submission_text)
  }
  if (submission.file_name) {
    lines.push(`Attached File: ${submission.file_name}`)
  }
  if (submission.submission_url) {
    lines.push(`Submission URL: ${submission.submission_url}`)
  }

  lines.push('')
  lines.push('Please provide a suggested score and detailed feedback based on the rubric criteria above.')

  return lines.join('\n')
}
