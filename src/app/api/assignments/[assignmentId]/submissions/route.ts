import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withRole } from '@/lib/api';
import { apiResponse, apiError, getPaginationParams, getPaginationMetadata } from '@/lib/api';

function getAssignmentId(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split('/');
  const idx = segments.indexOf('assignments');
  return segments[idx + 1];
}

/**
 * GET /api/assignments/[assignmentId]/submissions
 */
export const GET = withRole(['student', 'teacher', 'admin'], async (req, opts) => {
  try {
    const supabase = await createClient();
    const assignmentId = getAssignmentId(req);
    const { page, pageSize, sortBy, sortOrder } = getPaginationParams(req);
    const searchParams = req.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');

    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select('class_id')
      .eq('id', assignmentId)
      .eq('tenant_id', opts.tenantId)
      .single();

    if (assignmentError || !assignment) {
      return apiError('Assignment not found', 404, 'NOT_FOUND');
    }

    if (opts.userRole === 'teacher') {
      const { data: classTeacher } = await supabase
        .from('class_teachers')
        .select('id')
        .eq('teacher_id', opts.userId)
        .eq('class_id', assignment.class_id)
        .single();

      if (!classTeacher) {
        return apiError('Access denied', 403, 'FORBIDDEN');
      }
    } else if (opts.userRole === 'student') {
      const { data: enrollment } = await supabase
        .from('class_enrollments')
        .select('id')
        .eq('student_id', opts.userId)
        .eq('class_id', assignment.class_id)
        .single();

      if (!enrollment) {
        return apiError('Access denied', 403, 'FORBIDDEN');
      }
    }

    let query = supabase
      .from('assignment_submissions')
      .select('*', { count: 'exact' })
      .eq('assignment_id', assignmentId)
      .order(sortBy, { ascending: sortOrder === 'asc' });

    if (studentId && (opts.userRole === 'teacher' || opts.userRole === 'admin')) {
      query = query.eq('student_id', studentId);
    }

    if (opts.userRole === 'student') {
      query = query.eq('student_id', opts.userId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: submissions, count, error } = await query.range(
      (page - 1) * pageSize,
      page * pageSize - 1
    );

    if (error) {
      throw error;
    }

    return apiResponse({
      submissions: submissions || [],
      pagination: getPaginationMetadata(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return apiError('Failed to fetch submissions', 500, 'FETCH_ERROR');
  }
});

/**
 * POST /api/assignments/[assignmentId]/submissions
 */
export const POST = withRole(['student'], async (req, opts) => {
  try {
    const supabase = await createClient();
    const assignmentId = getAssignmentId(req);
    const body = await req.json();

    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select('id, class_id, due_date, allow_late')
      .eq('id', assignmentId)
      .eq('tenant_id', opts.tenantId)
      .single();

    if (assignmentError || !assignment) {
      return apiError('Assignment not found', 404, 'NOT_FOUND');
    }

    const { data: enrollment } = await supabase
      .from('class_enrollments')
      .select('id')
      .eq('student_id', opts.userId)
      .eq('class_id', assignment.class_id)
      .single();

    if (!enrollment) {
      return apiError('Access denied', 403, 'FORBIDDEN');
    }

    const now = new Date();
    const dueDate = new Date(assignment.due_date);
    const isLate = now > dueDate;

    if (isLate && !assignment.allow_late) {
      return apiError('Assignment submission deadline has passed', 400, 'DEADLINE_PASSED');
    }

    const { content, attachments, externalUrl } = body;

    const { data: submission, error } = await supabase
      .from('assignment_submissions')
      .insert({
        assignment_id: assignmentId,
        student_id: opts.userId,
        tenant_id: opts.tenantId,
        content,
        attachments: attachments || [],
        external_url: externalUrl,
        submitted_at: new Date().toISOString(),
        status: 'submitted',
        is_late: isLate,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return apiResponse(submission, 201);
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return apiError('Failed to submit assignment', 500, 'SUBMISSION_ERROR');
  }
});
