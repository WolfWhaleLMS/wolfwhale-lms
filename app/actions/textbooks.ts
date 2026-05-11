'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { calculateNextReview, type SM2State } from '@/lib/flashcards/sm2'
import { sanitizeText } from '@/lib/sanitize'
import { tryAwardServerCompanionXp } from '@/lib/companion/server-xp'

async function getContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) throw new Error('No tenant context')
  return { supabase, user, tenantId }
}

// ---------------------------------------------------------------------------
// BROWSE / READ (Students)
// ---------------------------------------------------------------------------

export async function getTextbooks(filters?: { subject?: string; grade_level?: string }) {
  const { supabase, tenantId } = await getContext()

  let query = supabase
    .from('textbooks')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('is_published', true)
    .order('title', { ascending: true })

  if (filters?.subject) {
    query = query.eq('subject', filters.subject)
  }
  if (filters?.grade_level) {
    query = query.eq('grade_level', filters.grade_level)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getTextbook(textbookId: string) {
  const parsed = z.string().uuid().safeParse(textbookId)
  if (!parsed.success) throw new Error('Invalid textbook ID')

  const { supabase, tenantId } = await getContext()

  // Fetch textbook
  const { data: textbook, error: tbError } = await supabase
    .from('textbooks')
    .select('*')
    .eq('id', textbookId)
    .eq('tenant_id', tenantId)
    .single()

  if (tbError) throw tbError

  // Fetch units with their chapters
  const { data: units, error: uError } = await supabase
    .from('textbook_units')
    .select('*')
    .eq('textbook_id', textbookId)
    .eq('tenant_id', tenantId)
    .order('unit_number', { ascending: true })

  if (uError) throw uError

  const { data: chapters, error: chError } = await supabase
    .from('textbook_chapters')
    .select('*')
    .eq('textbook_id', textbookId)
    .eq('tenant_id', tenantId)
    .order('chapter_number', { ascending: true })

  if (chError) throw chError

  // Fetch curriculum outcomes linked to this textbook's chapters
  const chapterIds = (chapters ?? []).map((c) => c.id)
  let outcomes: any[] = []
  if (chapterIds.length > 0) {
    const { data: mappings } = await supabase
      .from('textbook_chapter_outcomes')
      .select('outcome_id')
      .in('chapter_id', chapterIds)

    const outcomeIds = (mappings ?? []).map((m) => m.outcome_id)
    if (outcomeIds.length > 0) {
      const { data: outcomeRows } = await supabase
        .from('curriculum_outcomes')
        .select('*')
        .in('id', outcomeIds)

      outcomes = outcomeRows ?? []
    }
  }

  // Group chapters under their units
  const unitsWithChapters = (units ?? []).map((unit) => ({
    ...unit,
    chapters: (chapters ?? []).filter((ch) => ch.unit_id === unit.id),
  }))

  // Include any chapters not assigned to a unit
  const unassignedChapters = (chapters ?? []).filter((ch) => !ch.unit_id)
  if (unassignedChapters.length > 0) {
    unitsWithChapters.push({
      id: 'unassigned',
      tenant_id: tenantId,
      textbook_id: textbookId,
      unit_number: 9999,
      title: 'Additional Chapters',
      description: null,
      big_idea: null,
      essential_question: null,
      created_at: textbook.created_at,
      updated_at: textbook.updated_at,
      chapters: unassignedChapters,
    })
  }

  return {
    ...textbook,
    units: unitsWithChapters,
    outcomes,
  }
}

export async function getChapter(chapterId: string) {
  const parsed = z.string().uuid().safeParse(chapterId)
  if (!parsed.success) throw new Error('Invalid chapter ID')

  const { supabase, tenantId } = await getContext()

  const { data: chapter, error } = await supabase
    .from('textbook_chapters')
    .select('*')
    .eq('id', chapterId)
    .eq('tenant_id', tenantId)
    .single()

  if (error) throw error

  // Get flashcard count
  const { count } = await supabase
    .from('textbook_flashcards')
    .select('id', { count: 'exact', head: true })
    .eq('chapter_id', chapterId)
    .eq('tenant_id', tenantId)

  return {
    ...chapter,
    flashcard_count: count ?? 0,
  }
}

export async function getChapterOutcomes(chapterId: string) {
  const parsed = z.string().uuid().safeParse(chapterId)
  if (!parsed.success) throw new Error('Invalid chapter ID')

  const { supabase } = await getContext()

  const { data: mappings, error: mapError } = await supabase
    .from('textbook_chapter_outcomes')
    .select('outcome_id')
    .eq('chapter_id', chapterId)

  if (mapError) throw mapError

  const outcomeIds = (mappings ?? []).map((m) => m.outcome_id)
  if (outcomeIds.length === 0) return []

  const { data, error } = await supabase
    .from('curriculum_outcomes')
    .select('*')
    .in('id', outcomeIds)

  if (error) throw error
  return data ?? []
}

export async function getMyTextbooks() {
  const { supabase, user, tenantId } = await getContext()

  const { data: assignments, error } = await supabase
    .from('student_textbook_assignments')
    .select('*, textbook:textbook_id(*)')
    .eq('student_id', user.id)
    .eq('tenant_id', tenantId)
    .order('last_accessed_at', { ascending: false })

  if (error) throw error
  return assignments ?? []
}

// ---------------------------------------------------------------------------
// PROGRESS (Students)
// ---------------------------------------------------------------------------

export async function trackReadingProgress(
  chapterId: string,
  status: string,
  timeSpentSeconds?: number,
  scrollPosition?: number
) {
  const parsed = z.object({
    chapterId: z.string().uuid(),
    status: z.enum(['not_started', 'in_progress', 'completed']),
    timeSpentSeconds: z.number().int().min(0).optional(),
    scrollPosition: z.number().min(0).optional(),
  }).safeParse({ chapterId, status, timeSpentSeconds, scrollPosition })
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, user, tenantId } = await getContext()

  // Look up textbook_id from chapter
  const { data: chapter, error: chError } = await supabase
    .from('textbook_chapters')
    .select('textbook_id')
    .eq('id', chapterId)
    .single()

  if (chError) throw chError

  const now = new Date().toISOString()

  // Check for existing progress
  const { data: existing } = await supabase
    .from('student_reading_progress')
    .select('id, status, time_spent_seconds')
    .eq('student_id', user.id)
    .eq('chapter_id', chapterId)
    .eq('tenant_id', tenantId)
    .maybeSingle()

  if (existing) {
    const updateData: Record<string, unknown> = {
      status,
      last_accessed_at: now,
    }
    if (timeSpentSeconds !== undefined) {
      updateData.time_spent_seconds = existing.time_spent_seconds + timeSpentSeconds
    }
    if (scrollPosition !== undefined) {
      updateData.scroll_position = scrollPosition
    }
    if (status === 'completed') {
      updateData.completed_at = now
    }

    const { error } = await supabase
      .from('student_reading_progress')
      .update(updateData)
      .eq('id', existing.id)

    if (error) throw error
  } else {
    const { error } = await supabase
      .from('student_reading_progress')
      .insert({
        tenant_id: tenantId,
        student_id: user.id,
        chapter_id: chapterId,
        textbook_id: chapter.textbook_id,
        status,
        scroll_position: scrollPosition ?? 0,
        time_spent_seconds: timeSpentSeconds ?? 0,
        started_at: status !== 'not_started' ? now : null,
        completed_at: status === 'completed' ? now : null,
        last_accessed_at: now,
        bookmarks: [],
        notes: [],
      })

    if (error) throw error
  }

  if (status === 'completed' && (!existing || existing.status !== 'completed')) {
    await tryAwardServerCompanionXp(supabase, {
      tenantId,
      studentId: user.id,
      source: 'lesson_completed',
      label: 'Lesson completed',
      occurredAt: now,
    })
  }

  // Update last_accessed_at on the student assignment
  await supabase
    .from('student_textbook_assignments')
    .update({ last_accessed_at: now })
    .eq('student_id', user.id)
    .eq('textbook_id', chapter.textbook_id)
    .eq('tenant_id', tenantId)

  revalidatePath('/student/textbooks')
}

export async function getReadingProgress(textbookId: string) {
  const parsed = z.string().uuid().safeParse(textbookId)
  if (!parsed.success) throw new Error('Invalid textbook ID')

  const { supabase, user, tenantId } = await getContext()

  const { data, error } = await supabase
    .from('student_reading_progress')
    .select('*')
    .eq('student_id', user.id)
    .eq('textbook_id', textbookId)
    .eq('tenant_id', tenantId)

  if (error) throw error
  return data ?? []
}

// ---------------------------------------------------------------------------
// FLASHCARDS (Students)
// ---------------------------------------------------------------------------

export async function getChapterFlashcards(chapterId: string) {
  const parsed = z.string().uuid().safeParse(chapterId)
  if (!parsed.success) throw new Error('Invalid chapter ID')

  const { supabase, user, tenantId } = await getContext()

  // Get flashcards
  const { data: flashcards, error } = await supabase
    .from('textbook_flashcards')
    .select('*')
    .eq('chapter_id', chapterId)
    .eq('tenant_id', tenantId)
    .order('order_index', { ascending: true })

  if (error) throw error
  if (!flashcards || flashcards.length === 0) return { flashcards: [], progress: {} }

  // Get student progress
  const flashcardIds = flashcards.map((f) => f.id)
  const { data: progress } = await supabase
    .from('student_textbook_flashcard_progress')
    .select('*')
    .eq('student_id', user.id)
    .eq('chapter_id', chapterId)
    .eq('tenant_id', tenantId)
    .in('flashcard_id', flashcardIds)

  const progressMap: Record<string, any> = {}
  for (const p of progress ?? []) {
    progressMap[p.flashcard_id] = p
  }

  // Sort: due/new cards first
  const now = new Date()
  const sortedFlashcards = [...flashcards].sort((a, b) => {
    const pa = progressMap[a.id]
    const pb = progressMap[b.id]
    const aDue = !pa || !pa.next_review_at || new Date(pa.next_review_at) <= now
    const bDue = !pb || !pb.next_review_at || new Date(pb.next_review_at) <= now
    if (aDue && !bDue) return -1
    if (!aDue && bDue) return 1
    return 0
  })

  return { flashcards: sortedFlashcards, progress: progressMap }
}

export async function reviewTextbookFlashcard(flashcardId: string, chapterId: string, quality: number) {
  const parsed = z.object({
    flashcardId: z.string().uuid(),
    chapterId: z.string().uuid(),
    quality: z.number().int().min(0).max(3),
  }).safeParse({ flashcardId, chapterId, quality })
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, user, tenantId } = await getContext()

  // Get existing progress
  const { data: existing } = await supabase
    .from('student_textbook_flashcard_progress')
    .select('*')
    .eq('student_id', user.id)
    .eq('flashcard_id', flashcardId)
    .eq('tenant_id', tenantId)
    .maybeSingle()

  const currentState: SM2State = existing
    ? {
        easeFactor: Number(existing.ease_factor),
        intervalDays: existing.interval_days,
        repetitions: existing.repetitions,
      }
    : { easeFactor: 2.5, intervalDays: 0, repetitions: 0 }

  const result = calculateNextReview(quality, currentState)
  const now = new Date().toISOString()

  if (existing) {
    await supabase
      .from('student_textbook_flashcard_progress')
      .update({
        ease_factor: result.easeFactor,
        interval_days: result.intervalDays,
        repetitions: result.repetitions,
        next_review_at: result.nextReviewAt.toISOString(),
        last_quality: quality,
        last_reviewed_at: now,
        updated_at: now,
      })
      .eq('id', existing.id)
  } else {
    await supabase
      .from('student_textbook_flashcard_progress')
      .insert({
        tenant_id: tenantId,
        student_id: user.id,
        flashcard_id: flashcardId,
        chapter_id: chapterId,
        ease_factor: result.easeFactor,
        interval_days: result.intervalDays,
        repetitions: result.repetitions,
        next_review_at: result.nextReviewAt.toISOString(),
        last_quality: quality,
        last_reviewed_at: now,
      })
  }

  return result
}

// ---------------------------------------------------------------------------
// AUTO-ASSIGNMENT
// ---------------------------------------------------------------------------

export async function autoAssignTextbooks(studentId: string, courseId: string) {
  const parsed = z.object({
    studentId: z.string().uuid(),
    courseId: z.string().uuid(),
  }).safeParse({ studentId, courseId })
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, tenantId } = await getContext()

  // Get course subject and grade_level
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('subject, grade_level')
    .eq('id', courseId)
    .eq('tenant_id', tenantId)
    .single()

  if (courseError) throw courseError
  if (!course.subject || !course.grade_level) return []

  // Find published textbooks matching the course
  const { data: textbooks, error: tbError } = await supabase
    .from('textbooks')
    .select('id')
    .eq('tenant_id', tenantId)
    .eq('is_published', true)
    .eq('subject', course.subject)
    .eq('grade_level', course.grade_level)

  if (tbError) throw tbError
  if (!textbooks || textbooks.length === 0) return []

  const now = new Date().toISOString()

  // Upsert assignments
  const rows = textbooks.map((tb) => ({
    tenant_id: tenantId,
    student_id: studentId,
    textbook_id: tb.id,
    course_id: courseId,
    auto_assigned: true,
    manually_added: false,
    last_accessed_at: now,
  }))

  const { data, error } = await supabase
    .from('student_textbook_assignments')
    .upsert(rows, { onConflict: 'tenant_id,student_id,textbook_id' })
    .select('id')

  if (error) throw error
  return data ?? []
}

// ---------------------------------------------------------------------------
// ADMIN: Browse helpers
// ---------------------------------------------------------------------------

export async function getAdminTextbooks(filters?: { subject?: string; grade_level?: string; status?: string }) {
  const { supabase, tenantId } = await getContext()

  let query = supabase
    .from('textbooks')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (filters?.subject) {
    query = query.eq('subject', filters.subject)
  }
  if (filters?.grade_level) {
    query = query.eq('grade_level', filters.grade_level)
  }
  if (filters?.status === 'published') {
    query = query.eq('is_published', true)
  } else if (filters?.status === 'draft') {
    query = query.eq('is_published', false)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getAdminChapterFlashcards(chapterId: string) {
  const parsed = z.string().uuid().safeParse(chapterId)
  if (!parsed.success) throw new Error('Invalid chapter ID')

  const { supabase, tenantId } = await getContext()

  const { data, error } = await supabase
    .from('textbook_flashcards')
    .select('*')
    .eq('chapter_id', chapterId)
    .eq('tenant_id', tenantId)
    .order('order_index', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function deleteTextbook(textbookId: string) {
  const parsed = z.string().uuid().safeParse(textbookId)
  if (!parsed.success) throw new Error('Invalid textbook ID')

  const { supabase, tenantId } = await getContext()

  const { error } = await supabase
    .from('textbooks')
    .delete()
    .eq('id', textbookId)
    .eq('tenant_id', tenantId)

  if (error) throw error
  revalidatePath('/admin/textbooks')
}

export async function deleteChapter(chapterId: string, textbookId: string) {
  const idParsed = z.string().uuid().safeParse(chapterId)
  if (!idParsed.success) throw new Error('Invalid chapter ID')

  const { supabase, tenantId } = await getContext()

  const { error } = await supabase
    .from('textbook_chapters')
    .delete()
    .eq('id', chapterId)
    .eq('tenant_id', tenantId)

  if (error) throw error

  // Update chapter count on textbook
  const { count } = await supabase
    .from('textbook_chapters')
    .select('id', { count: 'exact', head: true })
    .eq('textbook_id', textbookId)
    .eq('tenant_id', tenantId)

  await supabase
    .from('textbooks')
    .update({ chapter_count: count ?? 0, updated_at: new Date().toISOString() })
    .eq('id', textbookId)

  revalidatePath('/admin/textbooks')
}

export async function getCurriculumOutcomes(province: string, framework: string, subject: string, gradeLevel: string) {
  const { supabase } = await getContext()

  const { data, error } = await supabase
    .from('curriculum_outcomes')
    .select('*')
    .eq('province', province)
    .eq('framework', framework)
    .eq('subject', subject)
    .eq('grade_level', gradeLevel)
    .order('outcome_code', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function linkChapterOutcome(chapterId: string, outcomeId: string) {
  const parsed = z.object({
    chapterId: z.string().uuid(),
    outcomeId: z.string().uuid(),
  }).safeParse({ chapterId, outcomeId })
  if (!parsed.success) throw new Error('Invalid input')

  const { supabase, tenantId } = await getContext()

  const { error } = await supabase
    .from('textbook_chapter_outcomes')
    .upsert({
      chapter_id: chapterId,
      outcome_id: outcomeId,
      tenant_id: tenantId,
    }, { onConflict: 'chapter_id,outcome_id' })

  if (error) throw error
  revalidatePath('/admin/textbooks')
}

export async function unlinkChapterOutcome(chapterId: string, outcomeId: string) {
  const parsed = z.object({
    chapterId: z.string().uuid(),
    outcomeId: z.string().uuid(),
  }).safeParse({ chapterId, outcomeId })
  if (!parsed.success) throw new Error('Invalid input')

  const { supabase, tenantId } = await getContext()

  const { error } = await supabase
    .from('textbook_chapter_outcomes')
    .delete()
    .eq('chapter_id', chapterId)
    .eq('outcome_id', outcomeId)

  if (error) throw error
  revalidatePath('/admin/textbooks')
}

// ---------------------------------------------------------------------------
// ADMIN: Textbook CRUD
// ---------------------------------------------------------------------------

const createTextbookSchema = z.object({
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(255),
  subject: z.enum(['math', 'science', 'physics', 'chemistry', 'biology', 'ela']),
  grade_level: z.string().min(1).max(50),
  sk_course_name: z.string().max(255).optional(),
  curriculum_url: z.string().url().optional(),
  province: z.string().min(1).max(100),
  curriculum_framework: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  cover_image_url: z.string().url().optional(),
  replaces_textbooks: z.array(z.object({
    title: z.string(),
    publisher: z.string(),
    price: z.number(),
    lineage: z.string(),
  })).optional(),
  is_published: z.boolean().optional(),
})

export async function createTextbook(data: z.infer<typeof createTextbookSchema>) {
  const parsed = createTextbookSchema.safeParse(data)
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, user, tenantId } = await getContext()
  const v = parsed.data

  const { data: textbook, error } = await supabase
    .from('textbooks')
    .insert({
      tenant_id: tenantId,
      title: sanitizeText(v.title),
      slug: v.slug,
      subject: v.subject,
      grade_level: v.grade_level,
      sk_course_name: v.sk_course_name ? sanitizeText(v.sk_course_name) : null,
      curriculum_url: v.curriculum_url ?? null,
      province: v.province,
      curriculum_framework: v.curriculum_framework,
      description: v.description ? sanitizeText(v.description) : null,
      cover_image_url: v.cover_image_url ?? null,
      replaces_textbooks: v.replaces_textbooks ?? [],
      is_published: v.is_published ?? false,
      chapter_count: 0,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (error) throw error
  revalidatePath('/admin/textbooks')
  return textbook
}

const updateTextbookSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  slug: z.string().min(1).max(255).optional(),
  subject: z.enum(['math', 'science', 'physics', 'chemistry', 'biology', 'ela']).optional(),
  grade_level: z.string().min(1).max(50).optional(),
  sk_course_name: z.string().max(255).nullable().optional(),
  curriculum_url: z.string().url().nullable().optional(),
  province: z.string().min(1).max(100).optional(),
  curriculum_framework: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).nullable().optional(),
  cover_image_url: z.string().url().nullable().optional(),
  replaces_textbooks: z.array(z.object({
    title: z.string(),
    publisher: z.string(),
    price: z.number(),
    lineage: z.string(),
  })).optional(),
  is_published: z.boolean().optional(),
})

export async function updateTextbook(textbookId: string, data: z.infer<typeof updateTextbookSchema>) {
  const idParsed = z.string().uuid().safeParse(textbookId)
  if (!idParsed.success) throw new Error('Invalid textbook ID')

  const parsed = updateTextbookSchema.safeParse(data)
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, tenantId } = await getContext()
  const v = parsed.data

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (v.title !== undefined) updateData.title = sanitizeText(v.title)
  if (v.slug !== undefined) updateData.slug = v.slug
  if (v.subject !== undefined) updateData.subject = v.subject
  if (v.grade_level !== undefined) updateData.grade_level = v.grade_level
  if (v.sk_course_name !== undefined) updateData.sk_course_name = v.sk_course_name ? sanitizeText(v.sk_course_name) : null
  if (v.curriculum_url !== undefined) updateData.curriculum_url = v.curriculum_url
  if (v.province !== undefined) updateData.province = v.province
  if (v.curriculum_framework !== undefined) updateData.curriculum_framework = v.curriculum_framework
  if (v.description !== undefined) updateData.description = v.description ? sanitizeText(v.description) : null
  if (v.cover_image_url !== undefined) updateData.cover_image_url = v.cover_image_url
  if (v.replaces_textbooks !== undefined) updateData.replaces_textbooks = v.replaces_textbooks
  if (v.is_published !== undefined) updateData.is_published = v.is_published

  const { error } = await supabase
    .from('textbooks')
    .update(updateData)
    .eq('id', textbookId)
    .eq('tenant_id', tenantId)

  if (error) throw error
  revalidatePath('/admin/textbooks')
}

// ---------------------------------------------------------------------------
// ADMIN: Unit CRUD
// ---------------------------------------------------------------------------

const createUnitSchema = z.object({
  unit_number: z.number().int().min(1),
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  big_idea: z.string().max(2000).optional(),
  essential_question: z.string().max(2000).optional(),
})

export async function createUnit(textbookId: string, data: z.infer<typeof createUnitSchema>) {
  const idParsed = z.string().uuid().safeParse(textbookId)
  if (!idParsed.success) throw new Error('Invalid textbook ID')

  const parsed = createUnitSchema.safeParse(data)
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, tenantId } = await getContext()
  const v = parsed.data

  const { data: unit, error } = await supabase
    .from('textbook_units')
    .insert({
      tenant_id: tenantId,
      textbook_id: textbookId,
      unit_number: v.unit_number,
      title: sanitizeText(v.title),
      description: v.description ? sanitizeText(v.description) : null,
      big_idea: v.big_idea ? sanitizeText(v.big_idea) : null,
      essential_question: v.essential_question ? sanitizeText(v.essential_question) : null,
    })
    .select('id')
    .single()

  if (error) throw error
  revalidatePath('/admin/textbooks')
  return unit
}

// ---------------------------------------------------------------------------
// ADMIN: Chapter CRUD
// ---------------------------------------------------------------------------

const createChapterSchema = z.object({
  unit_id: z.string().uuid().optional(),
  chapter_number: z.number().int().min(1),
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  content: z.array(z.unknown()).optional(),
  key_terms: z.array(z.object({
    term: z.string(),
    definition: z.string(),
  })).optional(),
  indigenous_connection: z.string().max(5000).optional(),
  estimated_minutes: z.number().int().min(1).optional(),
  is_published: z.boolean().optional(),
})

export async function createChapter(textbookId: string, data: z.infer<typeof createChapterSchema>) {
  const idParsed = z.string().uuid().safeParse(textbookId)
  if (!idParsed.success) throw new Error('Invalid textbook ID')

  const parsed = createChapterSchema.safeParse(data)
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, tenantId } = await getContext()
  const v = parsed.data

  const { data: chapter, error } = await supabase
    .from('textbook_chapters')
    .insert({
      tenant_id: tenantId,
      textbook_id: textbookId,
      unit_id: v.unit_id ?? null,
      chapter_number: v.chapter_number,
      title: sanitizeText(v.title),
      slug: v.slug,
      description: v.description ? sanitizeText(v.description) : null,
      content: v.content ?? [],
      key_terms: v.key_terms ?? [],
      indigenous_connection: v.indigenous_connection ? sanitizeText(v.indigenous_connection) : null,
      estimated_minutes: v.estimated_minutes ?? null,
      is_published: v.is_published ?? false,
    })
    .select('id')
    .single()

  if (error) throw error

  // Update chapter count on textbook
  const { count } = await supabase
    .from('textbook_chapters')
    .select('id', { count: 'exact', head: true })
    .eq('textbook_id', textbookId)
    .eq('tenant_id', tenantId)

  await supabase
    .from('textbooks')
    .update({ chapter_count: count ?? 0, updated_at: new Date().toISOString() })
    .eq('id', textbookId)

  revalidatePath('/admin/textbooks')
  return chapter
}

const updateChapterSchema = z.object({
  unit_id: z.string().uuid().nullable().optional(),
  chapter_number: z.number().int().min(1).optional(),
  title: z.string().min(1).max(500).optional(),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).nullable().optional(),
  content: z.array(z.unknown()).optional(),
  key_terms: z.array(z.object({
    term: z.string(),
    definition: z.string(),
  })).optional(),
  indigenous_connection: z.string().max(5000).nullable().optional(),
  estimated_minutes: z.number().int().min(1).nullable().optional(),
  is_published: z.boolean().optional(),
})

export async function updateChapter(chapterId: string, data: z.infer<typeof updateChapterSchema>) {
  const idParsed = z.string().uuid().safeParse(chapterId)
  if (!idParsed.success) throw new Error('Invalid chapter ID')

  const parsed = updateChapterSchema.safeParse(data)
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, tenantId } = await getContext()
  const v = parsed.data

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (v.unit_id !== undefined) updateData.unit_id = v.unit_id
  if (v.chapter_number !== undefined) updateData.chapter_number = v.chapter_number
  if (v.title !== undefined) updateData.title = sanitizeText(v.title)
  if (v.slug !== undefined) updateData.slug = v.slug
  if (v.description !== undefined) updateData.description = v.description ? sanitizeText(v.description) : null
  if (v.content !== undefined) updateData.content = v.content
  if (v.key_terms !== undefined) updateData.key_terms = v.key_terms
  if (v.indigenous_connection !== undefined) updateData.indigenous_connection = v.indigenous_connection ? sanitizeText(v.indigenous_connection) : null
  if (v.estimated_minutes !== undefined) updateData.estimated_minutes = v.estimated_minutes
  if (v.is_published !== undefined) updateData.is_published = v.is_published

  const { error } = await supabase
    .from('textbook_chapters')
    .update(updateData)
    .eq('id', chapterId)
    .eq('tenant_id', tenantId)

  if (error) throw error
  revalidatePath('/admin/textbooks')
}

// ---------------------------------------------------------------------------
// ADMIN: Flashcard CRUD
// ---------------------------------------------------------------------------

const addFlashcardSchema = z.object({
  front_text: z.string().min(1).max(5000),
  back_text: z.string().min(1).max(5000),
  hint: z.string().max(500).optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
  tags: z.array(z.string()).optional(),
  key_term_ref: z.string().max(255).optional(),
})

export async function addFlashcard(chapterId: string, data: z.infer<typeof addFlashcardSchema>) {
  const idParsed = z.string().uuid().safeParse(chapterId)
  if (!idParsed.success) throw new Error('Invalid chapter ID')

  const parsed = addFlashcardSchema.safeParse(data)
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, tenantId } = await getContext()
  const v = parsed.data

  // Get current max order_index
  const { data: existing } = await supabase
    .from('textbook_flashcards')
    .select('order_index')
    .eq('chapter_id', chapterId)
    .eq('tenant_id', tenantId)
    .order('order_index', { ascending: false })
    .limit(1)

  const nextOrder = existing && existing.length > 0 ? existing[0].order_index + 1 : 0

  const { data: flashcard, error } = await supabase
    .from('textbook_flashcards')
    .insert({
      tenant_id: tenantId,
      chapter_id: chapterId,
      front_text: sanitizeText(v.front_text),
      back_text: sanitizeText(v.back_text),
      hint: v.hint ? sanitizeText(v.hint) : null,
      difficulty: v.difficulty ?? 1,
      tags: v.tags ?? [],
      key_term_ref: v.key_term_ref ?? null,
      order_index: nextOrder,
    })
    .select('id')
    .single()

  if (error) throw error
  revalidatePath('/admin/textbooks')
  return flashcard
}

export async function deleteFlashcard(flashcardId: string) {
  const parsed = z.string().uuid().safeParse(flashcardId)
  if (!parsed.success) throw new Error('Invalid flashcard ID')

  const { supabase, tenantId } = await getContext()

  const { error } = await supabase
    .from('textbook_flashcards')
    .delete()
    .eq('id', flashcardId)
    .eq('tenant_id', tenantId)

  if (error) throw error
  revalidatePath('/admin/textbooks')
}
