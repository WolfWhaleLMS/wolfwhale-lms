'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getAuthUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return { supabase, user }
}

async function getTenantId(): Promise<string> {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) throw new Error('No tenant context')
  return tenantId
}

async function requireTeacher() {
  const { supabase, user } = await getAuthUser()
  const tenantId = await getTenantId()

  const { data: membership } = await supabase
    .from('tenant_memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .eq('status', 'active')
    .single()

  if (!membership || !['teacher', 'admin', 'super_admin'].includes(membership.role)) {
    throw new Error('Not authorized - teacher role required')
  }

  return { supabase, user, tenantId, role: membership.role }
}

// ---------------------------------------------------------------------------
// getCourses - teacher sees their own, student sees enrolled
// ---------------------------------------------------------------------------

export async function getCourses() {
  const { supabase, user } = await getAuthUser()
  const tenantId = await getTenantId()

  const headersList = await headers()
  const userRole = headersList.get('x-user-role')

  if (userRole === 'teacher' || userRole === 'admin' || userRole === 'super_admin') {
    // Teacher: get courses they created
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        id,
        name,
        description,
        subject,
        grade_level,
        semester,
        status,
        settings,
        created_at,
        updated_at
      `)
      .eq('tenant_id', tenantId)
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching teacher courses:', error)
      return []
    }

    // Get student counts and class codes for each course
    const courseIds = (courses || []).map((c) => c.id)

    const [enrollmentResult, codeResult] = await Promise.all([
      courseIds.length > 0
        ? supabase
            .from('course_enrollments')
            .select('course_id')
            .in('course_id', courseIds)
            .eq('status', 'active')
        : { data: [] },
      courseIds.length > 0
        ? supabase
            .from('class_codes')
            .select('course_id, code, is_active')
            .in('course_id', courseIds)
            .eq('is_active', true)
        : { data: [] },
    ])

    const enrollments = enrollmentResult.data || []
    const classCodes = codeResult.data || []

    return (courses || []).map((course) => ({
      ...course,
      student_count: enrollments.filter((e) => e.course_id === course.id).length,
      class_code: classCodes.find((c) => c.course_id === course.id)?.code || null,
    }))
  }

  // Student: get enrolled courses
  const { data: enrollments, error: enrollError } = await supabase
    .from('course_enrollments')
    .select(`
      course_id,
      status,
      enrolled_at,
      courses (
        id,
        name,
        description,
        subject,
        grade_level,
        semester,
        status,
        created_by,
        created_at
      )
    `)
    .eq('tenant_id', tenantId)
    .eq('student_id', user.id)
    .eq('status', 'active')
    .order('enrolled_at', { ascending: false })

  if (enrollError) {
    console.error('Error fetching student enrollments:', enrollError)
    return []
  }

  // Resolve teacher names and lesson counts for enrolled courses
  const courseData = (enrollments || [])
    .filter((e) => e.courses)
    .map((e) => e.courses as any)

  const teacherIds = [...new Set(courseData.map((c: any) => c.created_by))]
  const courseIds = courseData.map((c: any) => c.id)

  const [profileResult, lessonResult, progressResult] = await Promise.all([
    teacherIds.length > 0
      ? supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', teacherIds)
      : { data: [] },
    courseIds.length > 0
      ? supabase
          .from('lessons')
          .select('id, course_id')
          .in('course_id', courseIds)
      : { data: [] },
    courseIds.length > 0
      ? supabase
          .from('lesson_progress')
          .select('lesson_id, status')
          .eq('user_id', user.id)
      : { data: [] },
  ])

  const profiles = profileResult.data || []
  const lessons = lessonResult.data || []
  const progress = progressResult.data || []

  return courseData.map((course: any) => {
    const teacher = profiles.find((p) => p.id === course.created_by)
    const courseLessons = lessons.filter((l) => l.course_id === course.id)
    const completedLessons = courseLessons.filter((l) =>
      progress.some((p) => p.lesson_id === l.id && p.status === 'completed')
    )

    return {
      ...course,
      teacher_name: teacher
        ? `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() || 'Teacher'
        : 'Teacher',
      lesson_count: courseLessons.length,
      completed_lessons: completedLessons.length,
      progress_percentage:
        courseLessons.length > 0
          ? Math.round((completedLessons.length / courseLessons.length) * 100)
          : 0,
    }
  })
}

// ---------------------------------------------------------------------------
// getCourse - single course with lesson count and enrolled students
// ---------------------------------------------------------------------------

export async function getCourse(courseId: string) {
  const parsed = z.object({ courseId: z.string().uuid() }).safeParse({ courseId })
  if (!parsed.success) return null

  const { supabase, user } = await getAuthUser()
  const tenantId = await getTenantId()

  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .eq('tenant_id', tenantId)
    .single()

  if (error || !course) {
    console.error('Error fetching course:', error)
    return null
  }

  // Get lesson count, enrollment count, class codes, and enrolled students
  const [lessonResult, enrollmentResult, codeResult, studentsResult] =
    await Promise.all([
      supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId),
      supabase
        .from('course_enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('status', 'active'),
      supabase
        .from('class_codes')
        .select('id, code, is_active, expires_at, use_count, max_uses')
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1),
      supabase
        .from('course_enrollments')
        .select(`
          id,
          student_id,
          status,
          enrolled_at,
          grade_letter,
          grade_numeric
        `)
        .eq('course_id', courseId)
        .eq('status', 'active'),
    ])

  // Get student profiles
  const studentIds = (studentsResult.data || []).map((s) => s.student_id)
  let studentProfiles: any[] = []
  if (studentIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', studentIds)
    studentProfiles = profiles || []
  }

  const enrolledStudents = (studentsResult.data || []).map((enrollment) => {
    const profile = studentProfiles.find((p) => p.id === enrollment.student_id)
    return {
      ...enrollment,
      name: profile
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Student'
        : 'Student',
      avatar_url: profile?.avatar_url || null,
    }
  })

  return {
    ...course,
    lesson_count: lessonResult.data?.length || 0,
    enrollment_count: enrollmentResult.data?.length || 0,
    class_code: codeResult.data?.[0]?.code || null,
    class_code_details: codeResult.data?.[0] || null,
    enrolled_students: enrolledStudents,
  }
}

// ---------------------------------------------------------------------------
// createCourse
// ---------------------------------------------------------------------------

interface CreateCourseInput {
  name: string
  description?: string
  subject?: string
  grade_level?: string
  semester?: string
}

export async function createCourse(input: CreateCourseInput) {
  const createCourseSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().max(5000).optional(),
    subject: z.string().max(100).optional(),
    grade_level: z.string().max(50).optional(),
    semester: z.string().max(50).optional(),
  })
  const parsed = createCourseSchema.safeParse(input)
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const { supabase, user, tenantId } = await requireTeacher()

  const { data: course, error } = await supabase
    .from('courses')
    .insert({
      tenant_id: tenantId,
      created_by: user.id,
      name: parsed.data.name,
      description: parsed.data.description || null,
      subject: parsed.data.subject || null,
      grade_level: parsed.data.grade_level || null,
      semester: parsed.data.semester || null,
      status: 'active',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating course:', error)
    return { error: 'Failed to create course' }
  }

  // Auto-generate a class code for the new course
  const code = generateRandomCode()
  await supabase.from('class_codes').insert({
    tenant_id: tenantId,
    course_id: course.id,
    code,
    is_active: true,
    created_by: user.id,
  })

  revalidatePath('/teacher/courses')
  return { success: true, courseId: course.id }
}

// ---------------------------------------------------------------------------
// updateCourse
// ---------------------------------------------------------------------------

export async function updateCourse(
  courseId: string,
  input: Partial<CreateCourseInput> & { status?: string }
) {
  const updateCourseSchema = z.object({
    courseId: z.string().uuid(),
    name: z.string().min(1).max(255).optional(),
    description: z.string().max(5000).optional(),
    subject: z.string().max(100).optional(),
    grade_level: z.string().max(50).optional(),
    semester: z.string().max(50).optional(),
    status: z.string().max(50).optional(),
  })
  const parsed = updateCourseSchema.safeParse({ courseId, ...input })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const { supabase, user, tenantId } = await requireTeacher()

  // Verify ownership
  const { data: existing } = await supabase
    .from('courses')
    .select('created_by')
    .eq('id', courseId)
    .eq('tenant_id', tenantId)
    .single()

  if (!existing || existing.created_by !== user.id) {
    return { error: 'Not authorized to edit this course' }
  }

  const updateData: Record<string, unknown> = {}
  if (input.name !== undefined) updateData.name = input.name
  if (input.description !== undefined) updateData.description = input.description
  if (input.subject !== undefined) updateData.subject = input.subject
  if (input.grade_level !== undefined) updateData.grade_level = input.grade_level
  if (input.semester !== undefined) updateData.semester = input.semester
  if (input.status !== undefined) updateData.status = input.status

  const { error } = await supabase
    .from('courses')
    .update(updateData)
    .eq('id', courseId)

  if (error) {
    console.error('Error updating course:', error)
    return { error: 'Failed to update course' }
  }

  revalidatePath(`/teacher/courses/${courseId}`)
  revalidatePath('/teacher/courses')
  return { success: true }
}

// ---------------------------------------------------------------------------
// deleteCourse (soft delete via archiving)
// ---------------------------------------------------------------------------

export async function deleteCourse(courseId: string) {
  const parsed = z.object({ courseId: z.string().uuid() }).safeParse({ courseId })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const { supabase, user, tenantId } = await requireTeacher()

  const { data: existing } = await supabase
    .from('courses')
    .select('created_by')
    .eq('id', courseId)
    .eq('tenant_id', tenantId)
    .single()

  if (!existing || existing.created_by !== user.id) {
    return { error: 'Not authorized to delete this course' }
  }

  const { error } = await supabase
    .from('courses')
    .update({ status: 'archived', archived_at: new Date().toISOString() })
    .eq('id', courseId)

  if (error) {
    console.error('Error archiving course:', error)
    return { error: 'Failed to delete course' }
  }

  revalidatePath('/teacher/courses')
  return { success: true }
}

// ---------------------------------------------------------------------------
// enrollWithCode - student enrolls using a class code
// ---------------------------------------------------------------------------

export async function enrollWithCode(code: string) {
  const parsed = z.object({ code: z.string().min(1).max(20) }).safeParse({ code })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const { supabase, user } = await getAuthUser()
  const tenantId = await getTenantId()

  // Look up the class code
  const { data: classCode, error: codeError } = await supabase
    .from('class_codes')
    .select('id, course_id, tenant_id, is_active, expires_at, max_uses, use_count')
    .eq('code', code.toUpperCase().trim())
    .single()

  if (codeError || !classCode) {
    return { error: 'Invalid class code. Please check and try again.' }
  }

  if (!classCode.is_active) {
    return { error: 'This class code is no longer active.' }
  }

  if (classCode.expires_at && new Date(classCode.expires_at) < new Date()) {
    return { error: 'This class code has expired.' }
  }

  if (classCode.max_uses && classCode.use_count >= classCode.max_uses) {
    return { error: 'This class code has reached its maximum number of uses.' }
  }

  // Check if already enrolled
  const { data: existingEnrollment } = await supabase
    .from('course_enrollments')
    .select('id')
    .eq('course_id', classCode.course_id)
    .eq('student_id', user.id)
    .maybeSingle()

  if (existingEnrollment) {
    return { error: 'You are already enrolled in this course.' }
  }

  // Get the course teacher
  const { data: course } = await supabase
    .from('courses')
    .select('created_by')
    .eq('id', classCode.course_id)
    .single()

  // Create enrollment
  const { error: enrollError } = await supabase.from('course_enrollments').insert({
    tenant_id: classCode.tenant_id,
    course_id: classCode.course_id,
    student_id: user.id,
    teacher_id: course?.created_by || null,
    status: 'active',
  })

  if (enrollError) {
    console.error('Enrollment error:', enrollError)
    return { error: 'Failed to enroll. Please try again.' }
  }

  // Increment class code usage
  await supabase
    .from('class_codes')
    .update({ use_count: (classCode.use_count || 0) + 1 })
    .eq('id', classCode.id)

  revalidatePath('/student/courses')
  return { success: true, courseId: classCode.course_id }
}

// ---------------------------------------------------------------------------
// generateClassCode - create a new class code for a course
// ---------------------------------------------------------------------------

export async function generateClassCode(courseId: string) {
  const parsed = z.object({ courseId: z.string().uuid() }).safeParse({ courseId })
  if (!parsed.success) return { error: 'Invalid input: ' + parsed.error.issues[0].message }

  const { supabase, user, tenantId } = await requireTeacher()

  // Verify course ownership
  const { data: course } = await supabase
    .from('courses')
    .select('created_by')
    .eq('id', courseId)
    .eq('tenant_id', tenantId)
    .single()

  if (!course || course.created_by !== user.id) {
    return { error: 'Not authorized' }
  }

  // Deactivate existing codes
  await supabase
    .from('class_codes')
    .update({ is_active: false })
    .eq('course_id', courseId)

  // Generate new code
  const code = generateRandomCode()
  const { error } = await supabase.from('class_codes').insert({
    tenant_id: tenantId,
    course_id: courseId,
    code,
    is_active: true,
    created_by: user.id,
  })

  if (error) {
    console.error('Error generating class code:', error)
    return { error: 'Failed to generate class code' }
  }

  revalidatePath(`/teacher/courses/${courseId}`)
  return { success: true, code }
}

// ---------------------------------------------------------------------------
// Utility: generate a random 6-character alphanumeric code
// ---------------------------------------------------------------------------

function generateRandomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
