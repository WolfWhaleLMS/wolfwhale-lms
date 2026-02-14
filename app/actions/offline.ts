'use server'

import { z } from 'zod'
import { rateLimitAction } from '@/lib/rate-limit-action'
import { getActionContext } from '@/lib/actions/context'

// ---------------------------------------------------------------------------
// Offline data download — bulk fetch for IndexedDB caching
// ---------------------------------------------------------------------------

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

// ---------------------------------------------------------------------------
// downloadUserCourses — enrolled courses with teacher names
// ---------------------------------------------------------------------------

export async function downloadUserCourses(): Promise<
  ActionResult<
    {
      id: string
      name: string
      subject: string | null
      description: string | null
      teacher_name: string
      created_at: string
    }[]
  >
> {
  try {
    const rl = await rateLimitAction('offlineDownload')
    if (!rl.success) return { success: false, error: rl.error ?? 'Too many requests' }

    const { supabase, user, tenantId } = await getActionContext()

    // Get enrolled courses
    const { data: enrollments, error: enrollError } = await supabase
      .from('course_enrollments')
      .select(`
        course_id,
        courses (
          id,
          name,
          subject,
          description,
          created_by,
          created_at
        )
      `)
      .eq('tenant_id', tenantId)
      .eq('student_id', user.id)
      .eq('status', 'active')

    if (enrollError) {
      return { success: false, error: 'Failed to fetch courses' }
    }

    type JoinedCourse = {
      id: string
      name: string
      subject: string | null
      description: string | null
      created_by: string
      created_at: string
    }

    const courses = (enrollments || [])
      .filter((e) => e.courses)
      .map((e) => e.courses as unknown as JoinedCourse)

    // Resolve teacher names
    const teacherIds = [...new Set(courses.map((c) => c.created_by))]
    let profileMap: Record<string, string> = {}

    if (teacherIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', teacherIds)

      for (const p of profiles || []) {
        profileMap[p.id] =
          `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Teacher'
      }
    }

    const data = courses.map((c) => ({
      id: c.id,
      name: c.name,
      subject: c.subject,
      description: c.description,
      teacher_name: profileMap[c.created_by] || 'Teacher',
      created_at: c.created_at,
    }))

    return { success: true, data }
  } catch (err) {
    console.error('[offline] downloadUserCourses error:', err)
    return { success: false, error: 'Failed to download courses' }
  }
}

// ---------------------------------------------------------------------------
// downloadUserLessons — all lessons for given courses
// ---------------------------------------------------------------------------

export async function downloadUserLessons(
  courseIds: string[]
): Promise<
  ActionResult<
    {
      id: string
      course_id: string
      title: string
      content: string | null
      order_index: number
    }[]
  >
> {
  try {
    const parsed = z.array(z.string().uuid()).safeParse(courseIds)
    if (!parsed.success) return { success: false, error: 'Invalid course IDs' }
    if (parsed.data.length === 0) return { success: true, data: [] }

    const rl = await rateLimitAction('offlineDownload')
    if (!rl.success) return { success: false, error: rl.error ?? 'Too many requests' }

    const { supabase } = await getActionContext()

    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('id, course_id, title, content, order_index')
      .in('course_id', parsed.data)
      .order('order_index', { ascending: true })

    if (error) {
      return { success: false, error: 'Failed to fetch lessons' }
    }

    return { success: true, data: lessons || [] }
  } catch (err) {
    console.error('[offline] downloadUserLessons error:', err)
    return { success: false, error: 'Failed to download lessons' }
  }
}

// ---------------------------------------------------------------------------
// downloadUserAssignments — all assignments for given courses
// ---------------------------------------------------------------------------

export async function downloadUserAssignments(
  courseIds: string[]
): Promise<
  ActionResult<
    {
      id: string
      course_id: string
      title: string
      description: string | null
      due_date: string | null
      max_points: number
      assignment_type: string
    }[]
  >
> {
  try {
    const parsed = z.array(z.string().uuid()).safeParse(courseIds)
    if (!parsed.success) return { success: false, error: 'Invalid course IDs' }
    if (parsed.data.length === 0) return { success: true, data: [] }

    const rl = await rateLimitAction('offlineDownload')
    if (!rl.success) return { success: false, error: rl.error ?? 'Too many requests' }

    const { supabase } = await getActionContext()

    const { data: assignments, error } = await supabase
      .from('assignments')
      .select('id, course_id, title, description, due_date, max_points, type')
      .in('course_id', parsed.data)
      .order('due_date', { ascending: true })

    if (error) {
      return { success: false, error: 'Failed to fetch assignments' }
    }

    // Map 'type' column to 'assignment_type' for the offline schema
    const data = (assignments || []).map((a) => ({
      id: a.id,
      course_id: a.course_id,
      title: a.title,
      description: a.description,
      due_date: a.due_date,
      max_points: a.max_points,
      assignment_type: a.type,
    }))

    return { success: true, data }
  } catch (err) {
    console.error('[offline] downloadUserAssignments error:', err)
    return { success: false, error: 'Failed to download assignments' }
  }
}

// ---------------------------------------------------------------------------
// downloadUserGrades — all grades with assignment and course info
// ---------------------------------------------------------------------------

export async function downloadUserGrades(): Promise<
  ActionResult<
    {
      id: string
      assignment_id: string
      course_name: string
      assignment_title: string
      points_earned: number
      percentage: number
      graded_at: string
    }[]
  >
> {
  try {
    const rl = await rateLimitAction('offlineDownload')
    if (!rl.success) return { success: false, error: rl.error ?? 'Too many requests' }

    const { supabase, user, tenantId } = await getActionContext()

    // Fetch grades with assignment info
    const { data: grades, error } = await supabase
      .from('grades')
      .select(`
        id,
        assignment_id,
        points_earned,
        percentage,
        graded_at,
        assignments:assignment_id(title, course_id)
      `)
      .eq('student_id', user.id)
      .eq('tenant_id', tenantId)
      .order('graded_at', { ascending: false })
      .limit(500)

    if (error) {
      return { success: false, error: 'Failed to fetch grades' }
    }

    if (!grades || grades.length === 0) {
      return { success: true, data: [] }
    }

    // Collect unique course IDs from assignments
    type AssignmentJoin = { title: string; course_id: string }
    const courseIdSet = new Set<string>()

    for (const g of grades) {
      const assignment = g.assignments as unknown as AssignmentJoin | null
      if (assignment?.course_id) {
        courseIdSet.add(assignment.course_id)
      }
    }

    // Fetch course names
    let courseMap: Record<string, string> = {}
    const uniqueCourseIds = [...courseIdSet]

    if (uniqueCourseIds.length > 0) {
      const { data: courses } = await supabase
        .from('courses')
        .select('id, name')
        .in('id', uniqueCourseIds)

      for (const c of courses || []) {
        courseMap[c.id] = c.name
      }
    }

    // Map to the offline-friendly shape
    const data = grades
      .map((g) => {
        const assignment = g.assignments as unknown as AssignmentJoin | null
        if (!assignment) return null

        return {
          id: g.id,
          assignment_id: g.assignment_id,
          course_name: courseMap[assignment.course_id] || 'Unknown Course',
          assignment_title: assignment.title || 'Unknown Assignment',
          points_earned: g.points_earned,
          percentage: g.percentage,
          graded_at: g.graded_at,
        }
      })
      .filter((g): g is NonNullable<typeof g> => g !== null)

    return { success: true, data }
  } catch (err) {
    console.error('[offline] downloadUserGrades error:', err)
    return { success: false, error: 'Failed to download grades' }
  }
}
