'use client'

import { offlineDB } from './db'
import {
  downloadUserCourses,
  downloadUserLessons,
  downloadUserAssignments,
  downloadUserFlashcards,
  downloadUserGrades,
} from '@/app/actions/offline'

// ---------------------------------------------------------------------------
// Offline sync manager — orchestrates data download and IndexedDB persistence
// ---------------------------------------------------------------------------

/**
 * Download all user data for offline use.
 *
 * Calls each server action sequentially, saves results to IndexedDB,
 * and reports progress via the callback. If any step fails, the remaining
 * steps still execute so partial offline data is available.
 */
export async function downloadAllUserData(
  onProgress: (progress: number, phase: string) => void
): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = []

  // ---- 1. Courses (0 → 20%) ----
  try {
    onProgress(0, 'courses')
    const coursesResult = await downloadUserCourses()

    if (coursesResult.success) {
      await offlineDB.courses.bulkPut(coursesResult.data)
    } else {
      errors.push(`Courses: ${coursesResult.error}`)
    }
  } catch (err) {
    errors.push(`Courses: ${err instanceof Error ? err.message : 'Unknown error'}`)
  }
  onProgress(20, 'courses')

  // ---- Extract course IDs for subsequent fetches ----
  let courseIds: string[] = []
  try {
    const allCourses = await offlineDB.courses.toArray()
    courseIds = allCourses.map((c) => c.id)
  } catch {
    // If we can't read courses from IndexedDB, the remaining steps will get empty arrays
    errors.push('Failed to read cached courses for subsequent downloads')
  }

  // ---- 2. Lessons (20 → 40%) ----
  try {
    onProgress(20, 'lessons')
    const lessonsResult = await downloadUserLessons(courseIds)

    if (lessonsResult.success) {
      await offlineDB.lessons.bulkPut(lessonsResult.data)
    } else {
      errors.push(`Lessons: ${lessonsResult.error}`)
    }
  } catch (err) {
    errors.push(`Lessons: ${err instanceof Error ? err.message : 'Unknown error'}`)
  }
  onProgress(40, 'lessons')

  // ---- 3. Assignments (40 → 60%) ----
  try {
    onProgress(40, 'assignments')
    const assignmentsResult = await downloadUserAssignments(courseIds)

    if (assignmentsResult.success) {
      await offlineDB.assignments.bulkPut(assignmentsResult.data)
    } else {
      errors.push(`Assignments: ${assignmentsResult.error}`)
    }
  } catch (err) {
    errors.push(`Assignments: ${err instanceof Error ? err.message : 'Unknown error'}`)
  }
  onProgress(60, 'assignments')

  // ---- 4. Flashcards (60 → 80%) ----
  try {
    onProgress(60, 'flashcards')
    const flashcardsResult = await downloadUserFlashcards(courseIds)

    if (flashcardsResult.success) {
      const { decks, cards } = flashcardsResult.data

      // Map server card shape → offline card shape
      await offlineDB.flashcardDecks.bulkPut(decks)
      await offlineDB.flashcards.bulkPut(
        cards.map((c) => ({
          id: c.id,
          deck_id: c.deck_id,
          front: c.front_text,
          back: c.back_text,
          ease_factor: 2.5,
          interval: 0,
          next_review: null,
        }))
      )
    } else {
      errors.push(`Flashcards: ${flashcardsResult.error}`)
    }
  } catch (err) {
    errors.push(`Flashcards: ${err instanceof Error ? err.message : 'Unknown error'}`)
  }
  onProgress(80, 'flashcards')

  // ---- 5. Grades (80 → 95%) ----
  try {
    onProgress(80, 'grades')
    const gradesResult = await downloadUserGrades()

    if (gradesResult.success) {
      await offlineDB.grades.bulkPut(gradesResult.data)
    } else {
      errors.push(`Grades: ${gradesResult.error}`)
    }
  } catch (err) {
    errors.push(`Grades: ${err instanceof Error ? err.message : 'Unknown error'}`)
  }
  onProgress(95, 'grades')

  // ---- Done ----
  onProgress(100, 'complete')

  return {
    success: errors.length === 0,
    errors,
  }
}

// ---------------------------------------------------------------------------
// Clear all offline data
// ---------------------------------------------------------------------------

export async function clearOfflineData(): Promise<void> {
  await Promise.all([
    offlineDB.courses.clear(),
    offlineDB.lessons.clear(),
    offlineDB.assignments.clear(),
    offlineDB.flashcardDecks.clear(),
    offlineDB.flashcards.clear(),
    offlineDB.grades.clear(),
    offlineDB.pendingActions.clear(),
  ])
}

// ---------------------------------------------------------------------------
// Sync pending actions back to server (placeholder)
// ---------------------------------------------------------------------------

export async function syncPendingActions(): Promise<{
  synced: number
  errors: number
}> {
  // TODO: Implement sync-back logic — read pendingActions, replay them
  // against the appropriate server actions, and remove on success.
  const pending = await offlineDB.pendingActions.count()
  return { synced: 0, errors: pending }
}
