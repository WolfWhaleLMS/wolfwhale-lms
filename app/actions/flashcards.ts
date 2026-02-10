'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { calculateNextReview, type SM2State } from '@/lib/flashcards/sm2'
import { sanitizeText } from '@/lib/sanitize'

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
// TEACHER: Deck CRUD
// ---------------------------------------------------------------------------

export async function getDecks(courseId: string) {
  const { supabase, tenantId } = await getContext()

  const { data, error } = await supabase
    .from('flashcard_decks')
    .select('*')
    .eq('course_id', courseId)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createDeck(courseId: string, title: string, description?: string) {
  const parsed = z.object({
    courseId: z.string().uuid(),
    title: z.string().min(1).max(255),
    description: z.string().max(2000).optional(),
  }).safeParse({ courseId, title, description })
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase, user, tenantId } = await getContext()

  const { data, error } = await supabase
    .from('flashcard_decks')
    .insert({
      tenant_id: tenantId,
      course_id: courseId,
      title: sanitizeText(title),
      description: description ? sanitizeText(description) : null,
      created_by: user.id,
      status: 'draft',
    })
    .select('id')
    .single()

  if (error) throw error
  revalidatePath(`/teacher/courses/${courseId}/flashcards`)
  return data
}

export async function updateDeck(deckId: string, updates: { title?: string; description?: string; status?: string }) {
  const { supabase, user } = await getContext()

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (updates.title) updateData.title = sanitizeText(updates.title)
  if (updates.description !== undefined) updateData.description = updates.description ? sanitizeText(updates.description) : null
  if (updates.status) updateData.status = updates.status

  const { error } = await supabase
    .from('flashcard_decks')
    .update(updateData)
    .eq('id', deckId)
    .eq('created_by', user.id)

  if (error) throw error
}

export async function deleteDeck(deckId: string) {
  const { supabase, user } = await getContext()

  const { error } = await supabase
    .from('flashcard_decks')
    .delete()
    .eq('id', deckId)
    .eq('created_by', user.id)

  if (error) throw error
}

// ---------------------------------------------------------------------------
// TEACHER: Card CRUD
// ---------------------------------------------------------------------------

export async function getCards(deckId: string) {
  const { supabase } = await getContext()

  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('deck_id', deckId)
    .order('order_index', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function addCard(deckId: string, frontText: string, backText: string, hint?: string) {
  const parsed = z.object({
    deckId: z.string().uuid(),
    frontText: z.string().min(1).max(5000),
    backText: z.string().min(1).max(5000),
    hint: z.string().max(500).optional(),
  }).safeParse({ deckId, frontText, backText, hint })
  if (!parsed.success) throw new Error('Invalid input: ' + parsed.error.issues[0].message)

  const { supabase } = await getContext()

  // Get current max order
  const { data: existing } = await supabase
    .from('flashcards')
    .select('order_index')
    .eq('deck_id', deckId)
    .order('order_index', { ascending: false })
    .limit(1)

  const nextOrder = existing && existing.length > 0 ? existing[0].order_index + 1 : 0

  const { data, error } = await supabase
    .from('flashcards')
    .insert({
      deck_id: deckId,
      front_text: sanitizeText(frontText),
      back_text: sanitizeText(backText),
      hint: hint ? sanitizeText(hint) : null,
      order_index: nextOrder,
    })
    .select('id')
    .single()

  if (error) throw error

  // Update card count
  await supabase
    .from('flashcard_decks')
    .update({ card_count: nextOrder + 1, updated_at: new Date().toISOString() })
    .eq('id', deckId)

  return data
}

export async function updateCard(cardId: string, updates: { frontText?: string; backText?: string; hint?: string }) {
  const { supabase } = await getContext()

  const updateData: Record<string, unknown> = {}
  if (updates.frontText) updateData.front_text = sanitizeText(updates.frontText)
  if (updates.backText) updateData.back_text = sanitizeText(updates.backText)
  if (updates.hint !== undefined) updateData.hint = updates.hint ? sanitizeText(updates.hint) : null

  const { error } = await supabase
    .from('flashcards')
    .update(updateData)
    .eq('id', cardId)

  if (error) throw error
}

export async function deleteCard(cardId: string, deckId: string) {
  const { supabase } = await getContext()

  const { error } = await supabase
    .from('flashcards')
    .delete()
    .eq('id', cardId)

  if (error) throw error

  // Update card count
  const { count } = await supabase
    .from('flashcards')
    .select('id', { count: 'exact', head: true })
    .eq('deck_id', deckId)

  await supabase
    .from('flashcard_decks')
    .update({ card_count: count || 0, updated_at: new Date().toISOString() })
    .eq('id', deckId)
}

// ---------------------------------------------------------------------------
// STUDENT: Study
// ---------------------------------------------------------------------------

export async function getStudentDecks() {
  const { supabase, user, tenantId } = await getContext()

  // Get enrolled courses
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('course_id')
    .eq('student_id', user.id)
    .eq('tenant_id', tenantId)

  const courseIds = (enrollments || []).map((e) => e.course_id)
  if (courseIds.length === 0) return []

  const { data: decks } = await supabase
    .from('flashcard_decks')
    .select('*, courses:course_id(name)')
    .eq('tenant_id', tenantId)
    .eq('status', 'published')
    .in('course_id', courseIds)
    .order('updated_at', { ascending: false })

  // Get progress counts for each deck
  const deckIds = (decks || []).map((d) => d.id)
  let progressMap: Record<string, { total: number; due: number }> = {}

  if (deckIds.length > 0) {
    const { data: progress } = await supabase
      .from('flashcard_progress')
      .select('deck_id, next_review_at')
      .eq('student_id', user.id)
      .in('deck_id', deckIds)

    const now = new Date()
    for (const p of progress || []) {
      if (!progressMap[p.deck_id]) progressMap[p.deck_id] = { total: 0, due: 0 }
      progressMap[p.deck_id].total++
      if (!p.next_review_at || new Date(p.next_review_at) <= now) {
        progressMap[p.deck_id].due++
      }
    }
  }

  return (decks || []).map((d) => ({
    ...d,
    courseName: (d.courses as any)?.name || 'Unknown Course',
    studiedCards: progressMap[d.id]?.total || 0,
    dueCards: progressMap[d.id]?.due || 0,
  }))
}

export async function getStudyCards(deckId: string) {
  const { supabase, user, tenantId } = await getContext()

  // Get all cards in deck
  const { data: cards } = await supabase
    .from('flashcards')
    .select('*')
    .eq('deck_id', deckId)
    .order('order_index', { ascending: true })

  if (!cards || cards.length === 0) return { cards: [], progress: {} }

  // Get student progress
  const { data: progress } = await supabase
    .from('flashcard_progress')
    .select('*')
    .eq('student_id', user.id)
    .eq('deck_id', deckId)
    .eq('tenant_id', tenantId)

  const progressMap: Record<string, any> = {}
  for (const p of progress || []) {
    progressMap[p.card_id] = p
  }

  // Sort: due/new cards first, then by next_review_at
  const now = new Date()
  const sortedCards = [...cards].sort((a, b) => {
    const pa = progressMap[a.id]
    const pb = progressMap[b.id]
    const aDue = !pa || !pa.next_review_at || new Date(pa.next_review_at) <= now
    const bDue = !pb || !pb.next_review_at || new Date(pb.next_review_at) <= now
    if (aDue && !bDue) return -1
    if (!aDue && bDue) return 1
    return 0
  })

  return { cards: sortedCards, progress: progressMap }
}

export async function reviewCard(deckId: string, cardId: string, quality: number) {
  const parsed = z.object({
    deckId: z.string().uuid(),
    cardId: z.string().uuid(),
    quality: z.number().int().min(0).max(3),
  }).safeParse({ deckId, cardId, quality })
  if (!parsed.success) throw new Error('Invalid input')

  const { supabase, user, tenantId } = await getContext()

  // Get existing progress
  const { data: existing } = await supabase
    .from('flashcard_progress')
    .select('*')
    .eq('student_id', user.id)
    .eq('card_id', cardId)
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

  if (existing) {
    await supabase
      .from('flashcard_progress')
      .update({
        ease_factor: result.easeFactor,
        interval_days: result.intervalDays,
        repetitions: result.repetitions,
        next_review_at: result.nextReviewAt.toISOString(),
        last_quality: quality,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
  } else {
    await supabase
      .from('flashcard_progress')
      .insert({
        tenant_id: tenantId,
        student_id: user.id,
        card_id: cardId,
        deck_id: deckId,
        ease_factor: result.easeFactor,
        interval_days: result.intervalDays,
        repetitions: result.repetitions,
        next_review_at: result.nextReviewAt.toISOString(),
        last_quality: quality,
      })
  }

  return result
}
