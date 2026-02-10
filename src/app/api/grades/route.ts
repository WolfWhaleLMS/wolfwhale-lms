import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withRole } from '@/lib/api';
import { apiResponse, apiError, getPaginationParams, getPaginationMetadata } from '@/lib/api';
import { gradeSubmissionSchema } from '@/lib/validation/schemas';

/**
 * GET /api/grades
 * Fetch grades
 * - Students: their own grades
 * - Teachers: grades for their classes
 * - Parents: grades for their children
 * - Admins: all grades in tenant
 */
export const GET = withRole(['student', 'teacher', 'admin', 'parent'], async (req, opts) => {
  try {
    const supabase = await createClient();
    const { page, pageSize, sortBy, sortOrder } = getPaginationParams(req);
    const searchParams = req.nextUrl.searchParams;
    const classId = searchParams.get('classId');
    const studentId = searchParams.get('studentId');
    const minGrade = searchParams.get('minGrade');
    const maxGrade = searchParams.get('maxGrade');

    let query = supabase
      .from('grades')
      .select('*', { count: 'exact' })
      .eq('tenant_id', opts.tenantId)
      .order(sortBy, { ascending: sortOrder === 'asc' });

    // Filter by role
    if (opts.userRole === 'student') {
      query = query.eq('student_id', opts.userId);
    } else if (opts.userRole === 'parent') {
      // Get children IDs
      const { data: children } = await supabase
        .from('parent_student_relationships')
        .select('student_id')
        .eq('parent_id', opts.userId);

      if (!children || children.length === 0) {
        return apiResponse({
          grades: [],
          pagination: getPaginationMetadata(page, pageSize, 0),
        });
      }

      const studentIds = children.map((c) => c.student_id);
      query = query.in('student_id', studentIds);
    } else if (opts.userRole === 'teacher') {
      // Get teacher's classes
      const { data: teaching } = await supabase
        .from('class_teachers')
        .select('class_id')
        .eq('teacher_id', opts.userId);

      if (!teaching || teaching.length === 0) {
        return apiResponse({
          grades: [],
          pagination: getPaginationMetadata(page, pageSize, 0),
        });
      }

      const classIds = teaching.map((t) => t.class_id);
      query = query.in('class_id', classIds);
    }

    // Apply additional filters
    if (classId) {
      query = query.eq('class_id', classId);
    }

    if (studentId && (opts.userRole === 'teacher' || opts.userRole === 'admin')) {
      query = query.eq('student_id', studentId);
    }

    if (minGrade) {
      query = query.gte('score', parseInt(minGrade));
    }

    if (maxGrade) {
      query = query.lte('score', parseInt(maxGrade));
    }

    const { data: grades, count, error } = await query.range(
      (page - 1) * pageSize,
      page * pageSize - 1
    );

    if (error) {
      throw error;
    }

    return apiResponse({
      grades: grades || [],
      pagination: getPaginationMetadata(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Error fetching grades:', error);
    return apiError('Failed to fetch grades', 500, 'FETCH_ERROR');
  }
});

/**
 * POST /api/grades
 * Grade a submission (teacher only)
 */
export const POST = withRole(['teacher', 'admin'], async (req, opts) => {
  try {
    const body = await req.json();

    // Validate request
    const validation = gradeSubmissionSchema.safeParse(body);
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

    // Get submission
    const { data: submission, error: submissionError } = await supabase
      .from('assignment_submissions')
      .select('*, assignments(*)')
      .eq('id', data.submissionId)
      .eq('tenant_id', opts.tenantId)
      .single();

    if (submissionError || !submission) {
      return apiError('Submission not found', 404, 'NOT_FOUND');
    }

    // Verify teacher access
    if (opts.userRole === 'teacher') {
      const { data: classTeacher } = await supabase
        .from('class_teachers')
        .select('id')
        .eq('teacher_id', opts.userId)
        .eq('class_id', submission.assignments.class_id)
        .single();

      if (!classTeacher) {
        return apiError('Access denied', 403, 'FORBIDDEN');
      }
    }

    // Create grade record
    const { data: grade, error: gradeError } = await supabase
      .from('grades')
      .insert({
        tenant_id: opts.tenantId,
        assignment_id: submission.assignment_id,
        class_id: submission.assignments.class_id,
        student_id: submission.student_id,
        submission_id: data.submissionId,
        score: data.score,
        feedback: data.feedback,
        rubric_scores: data.rubricScores || {},
        graded_by: opts.userId,
        graded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (gradeError) {
      throw gradeError;
    }

    // Update submission status
    await supabase
      .from('assignment_submissions')
      .update({
        status: 'graded',
        graded_at: new Date().toISOString(),
      })
      .eq('id', data.submissionId);

    // Award XP if specified
    if (data.awardedXP && data.awardedXP > 0) {
      // Award XP to student
      const { data: studentXP } = await supabase
        .from('student_xp')
        .select('total_xp')
        .eq('student_id', submission.student_id)
        .single();

      const newTotalXP = (studentXP?.total_xp || 0) + data.awardedXP;

      await supabase
        .from('student_xp')
        .upsert({
          student_id: submission.student_id,
          tenant_id: opts.tenantId,
          total_xp: newTotalXP,
          updated_at: new Date().toISOString(),
        });

      // Create XP transaction log
      await supabase.from('xp_transactions').insert({
        student_id: submission.student_id,
        tenant_id: opts.tenantId,
        amount: data.awardedXP,
        source_type: 'grade',
        source_id: grade.id,
        description: `XP awarded for grading on assignment ${submission.assignments.title}`,
        created_at: new Date().toISOString(),
      });
    }

    return apiResponse(grade, 201);
  } catch (error) {
    console.error('Error grading submission:', error);
    return apiError('Failed to grade submission', 500, 'GRADE_ERROR');
  }
});
