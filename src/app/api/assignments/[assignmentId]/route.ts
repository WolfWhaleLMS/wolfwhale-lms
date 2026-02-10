import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withRole } from '@/lib/api';
import { apiResponse, apiError } from '@/lib/api';
import { updateAssignmentSchema } from '@/lib/validation/schemas';

function getAssignmentId(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split('/');
  // /api/assignments/[assignmentId] or /api/assignments/[assignmentId]/submissions
  const idx = segments.indexOf('assignments');
  return segments[idx + 1];
}

/**
 * GET /api/assignments/[assignmentId]
 */
export const GET = withRole(['student', 'teacher', 'admin'], async (req, opts) => {
  try {
    const supabase = await createClient();
    const assignmentId = getAssignmentId(req);

    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', assignmentId)
      .eq('tenant_id', opts.tenantId)
      .single();

    if (assignmentError || !assignment) {
      return apiError('Assignment not found', 404, 'NOT_FOUND');
    }

    if (opts.userRole === 'student') {
      const { data: enrollment } = await supabase
        .from('class_enrollments')
        .select('id')
        .eq('student_id', opts.userId)
        .eq('class_id', assignment.class_id)
        .single();

      if (!enrollment) {
        return apiError('Access denied', 403, 'FORBIDDEN');
      }
    } else if (opts.userRole === 'teacher') {
      const { data: classTeacher } = await supabase
        .from('class_teachers')
        .select('id')
        .eq('teacher_id', opts.userId)
        .eq('class_id', assignment.class_id)
        .single();

      if (!classTeacher) {
        return apiError('Access denied', 403, 'FORBIDDEN');
      }
    }

    let submissions = null;
    if (opts.userRole === 'teacher' || opts.userRole === 'admin') {
      const { data: submissionData } = await supabase
        .from('assignment_submissions')
        .select('*')
        .eq('assignment_id', assignmentId)
        .order('submitted_at', { ascending: false });

      submissions = submissionData;
    }

    return apiResponse({
      assignment,
      submissions,
      submissionCount: submissions?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return apiError('Failed to fetch assignment', 500, 'FETCH_ERROR');
  }
});

/**
 * PUT /api/assignments/[assignmentId]
 */
export const PUT = withRole(['teacher', 'admin'], async (req, opts) => {
  try {
    const supabase = await createClient();
    const assignmentId = getAssignmentId(req);
    const body = await req.json();

    const validation = updateAssignmentSchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        'Validation failed',
        400,
        'VALIDATION_ERROR',
        validation.error.flatten().fieldErrors
      );
    }

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
    }

    const updateData: any = {};
    const validation_data = validation.data;

    if (validation_data.title) updateData.title = validation_data.title;
    if (validation_data.description) updateData.description = validation_data.description;
    if (validation_data.type) updateData.type = validation_data.type;
    if (validation_data.dueDate) updateData.due_date = validation_data.dueDate;
    if (validation_data.pointsPossible !== undefined) updateData.points_possible = validation_data.pointsPossible;
    if (validation_data.xpReward !== undefined) updateData.xp_reward = validation_data.xpReward;
    if (validation_data.allowLate !== undefined) updateData.allow_late = validation_data.allowLate;
    if (validation_data.latePenaltyPercent !== undefined) updateData.late_penalty_percent = validation_data.latePenaltyPercent;

    updateData.updated_at = new Date().toISOString();

    const { data: updatedAssignment, error } = await supabase
      .from('assignments')
      .update(updateData)
      .eq('id', assignmentId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return apiResponse(updatedAssignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    return apiError('Failed to update assignment', 500, 'UPDATE_ERROR');
  }
});

/**
 * DELETE /api/assignments/[assignmentId]
 */
export const DELETE = withRole(['teacher', 'admin'], async (req, opts) => {
  try {
    const supabase = await createClient();
    const assignmentId = getAssignmentId(req);

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
    }

    const { error } = await supabase
      .from('assignments')
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', assignmentId);

    if (error) {
      throw error;
    }

    return apiResponse({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return apiError('Failed to delete assignment', 500, 'DELETE_ERROR');
  }
});
