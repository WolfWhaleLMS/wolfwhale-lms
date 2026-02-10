import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withRole } from '@/lib/api';
import { apiResponse, apiError, getPaginationParams, getPaginationMetadata } from '@/lib/api';
import { createCourseSchema } from '@/lib/validation/schemas';
import { ValidationError } from '@/lib/api/errors';

/**
 * GET /api/courses
 * Fetch courses for current user
 * - Students: courses they're enrolled in
 * - Teachers: courses they teach
 * - Admins: all courses in tenant
 */
export const GET = withRole(['student', 'teacher', 'admin'], async (req, opts) => {
  try {
    const supabase = await createClient();
    const { page, pageSize, sortBy, sortOrder } = getPaginationParams(req);
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search');
    const classId = searchParams.get('classId');

    let query = supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .eq('tenant_id', opts.tenantId)
      .order(sortBy, { ascending: sortOrder === 'asc' });

    // Filter by role
    if (opts.userRole === 'student') {
      // Get enrolled courses
      const { data: enrollments } = await supabase
        .from('class_enrollments')
        .select('class_id')
        .eq('student_id', opts.userId);

      if (!enrollments || enrollments.length === 0) {
        return apiResponse({
          courses: [],
          pagination: getPaginationMetadata(page, pageSize, 0),
        });
      }

      const classIds = enrollments.map((e) => e.class_id);
      const { data: classes } = await supabase
        .from('classes')
        .select('course_id')
        .in('id', classIds);

      if (!classes || classes.length === 0) {
        return apiResponse({
          courses: [],
          pagination: getPaginationMetadata(page, pageSize, 0),
        });
      }

      const courseIds = classes.map((c) => c.course_id);
      query = query.in('id', courseIds);
    } else if (opts.userRole === 'teacher') {
      // Get taught courses
      const { data: teaching } = await supabase
        .from('class_teachers')
        .select('class_id')
        .eq('teacher_id', opts.userId);

      if (teaching && teaching.length > 0) {
        const classIds = teaching.map((t) => t.class_id);
        const { data: classes } = await supabase
          .from('classes')
          .select('course_id')
          .in('id', classIds);

        if (classes && classes.length > 0) {
          const courseIds = classes.map((c) => c.course_id);
          query = query.in('id', courseIds);
        } else {
          return apiResponse({
            courses: [],
            pagination: getPaginationMetadata(page, pageSize, 0),
          });
        }
      }
    }

    // Filter by search
    if (search) {
      query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%`);
    }

    // Filter by class
    if (classId) {
      const { data: courseData } = await supabase
        .from('classes')
        .select('course_id')
        .eq('id', classId)
        .single();

      if (courseData) {
        query = query.eq('id', courseData.course_id);
      }
    }

    const { data: courses, count, error } = await query.range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      throw error;
    }

    return apiResponse({
      courses: courses || [],
      pagination: getPaginationMetadata(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return apiError('Failed to fetch courses', 500, 'FETCH_ERROR');
  }
});

/**
 * POST /api/courses
 * Create new course (teacher/admin only)
 */
export const POST = withRole(['teacher', 'admin'], async (req, opts) => {
  try {
    const body = await req.json();

    // Validate request
    const validation = createCourseSchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        'Validation failed',
        400,
        'VALIDATION_ERROR',
        validation.error.flatten().fieldErrors
      );
    }

    const supabase = await createClient();
    const data = validation.data;

    // Check if course code already exists in tenant
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('id')
      .eq('tenant_id', opts.tenantId)
      .eq('code', data.code)
      .single();

    if (existingCourse) {
      return apiError('Course code already exists', 409, 'CONFLICT');
    }

    // Create course
    const { data: newCourse, error } = await supabase
      .from('courses')
      .insert({
        tenant_id: opts.tenantId,
        name: data.name,
        code: data.code,
        description: data.description,
        academic_term_id: data.academicTermId,
        grade_level_start: data.gradeLevelStart,
        grade_level_end: data.gradeLevelEnd,
        credits: data.credits,
        color: data.color || '#3B82F6',
        created_by: opts.userId,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return apiResponse(newCourse, 201);
  } catch (error) {
    console.error('Error creating course:', error);
    return apiError('Failed to create course', 500, 'CREATE_ERROR');
  }
});
