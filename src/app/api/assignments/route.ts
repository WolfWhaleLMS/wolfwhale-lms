import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withRole } from '@/lib/api';
import { apiResponse, apiError, getPaginationParams, getPaginationMetadata } from '@/lib/api';
import { createAssignmentSchema } from '@/lib/validation/schemas';

/**
 * GET /api/assignments
 * Fetch assignments
 * - Students: their assignments
 * - Teachers: their class assignments
 * - Admins: all assignments in tenant
 */
export const GET = withRole(['student', 'teacher', 'admin'], async (req, opts) => {
  try {
    const supabase = await createClient();
    const { page, pageSize, sortBy, sortOrder } = getPaginationParams(req);
    const searchParams = req.nextUrl.searchParams;
    const classId = searchParams.get('classId');
    const status = searchParams.get('status');
    const dueDateFrom = searchParams.get('dueDateFrom');
    const dueDateTo = searchParams.get('dueDateTo');

    let query = supabase
      .from('assignments')
      .select('*', { count: 'exact' })
      .eq('tenant_id', opts.tenantId)
      .order(sortBy, { ascending: sortOrder === 'asc' });

    // Filter by role
    if (opts.userRole === 'student') {
      // Get student's enrolled classes
      const { data: enrollments } = await supabase
        .from('class_enrollments')
        .select('class_id')
        .eq('student_id', opts.userId);

      if (!enrollments || enrollments.length === 0) {
        return apiResponse({
          assignments: [],
          pagination: getPaginationMetadata(page, pageSize, 0),
        });
      }

      const classIds = enrollments.map((e) => e.class_id);
      query = query.in('class_id', classIds);
    } else if (opts.userRole === 'teacher') {
      // Get teacher's classes
      const { data: teaching } = await supabase
        .from('class_teachers')
        .select('class_id')
        .eq('teacher_id', opts.userId);

      if (!teaching || teaching.length === 0) {
        return apiResponse({
          assignments: [],
          pagination: getPaginationMetadata(page, pageSize, 0),
        });
      }

      const classIds = teaching.map((t) => t.class_id);
      query = query.in('class_id', classIds);
    }

    // Apply filters
    if (classId) {
      query = query.eq('class_id', classId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (dueDateFrom) {
      query = query.gte('due_date', dueDateFrom);
    }

    if (dueDateTo) {
      query = query.lte('due_date', dueDateTo);
    }

    const { data: assignments, count, error } = await query.range(
      (page - 1) * pageSize,
      page * pageSize - 1
    );

    if (error) {
      throw error;
    }

    return apiResponse({
      assignments: assignments || [],
      pagination: getPaginationMetadata(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return apiError('Failed to fetch assignments', 500, 'FETCH_ERROR');
  }
});

/**
 * POST /api/assignments
 * Create new assignment (teacher only)
 */
export const POST = withRole(['teacher', 'admin'], async (req, opts) => {
  try {
    const body = await req.json();

    // Validate request
    const validation = createAssignmentSchema.safeParse(body);
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

    // Verify teacher has access to this class
    if (opts.userRole === 'teacher') {
      const { data: classTeacher } = await supabase
        .from('class_teachers')
        .select('id')
        .eq('class_id', data.classId)
        .eq('teacher_id', opts.userId)
        .single();

      if (!classTeacher) {
        return apiError('Access denied to this class', 403, 'FORBIDDEN');
      }
    }

    // Create assignment
    const { data: newAssignment, error } = await supabase
      .from('assignments')
      .insert({
        tenant_id: opts.tenantId,
        class_id: data.classId,
        title: data.title,
        description: data.description,
        type: data.type,
        due_date: data.dueDate,
        points_possible: data.pointsPossible,
        xp_reward: data.xpReward,
        allow_late: data.allowLate,
        late_penalty_percent: data.latePenaltyPercent || 0,
        status: 'published',
        created_by: opts.userId,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return apiResponse(newAssignment, 201);
  } catch (error) {
    console.error('Error creating assignment:', error);
    return apiError('Failed to create assignment', 500, 'CREATE_ERROR');
  }
});
