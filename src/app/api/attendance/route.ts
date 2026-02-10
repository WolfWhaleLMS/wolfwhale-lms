import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withRole } from '@/lib/api';
import { apiResponse, apiError, getPaginationParams, getPaginationMetadata } from '@/lib/api';
import { attendanceRecordSchema } from '@/lib/validation/schemas';

/**
 * GET /api/attendance
 * Fetch attendance records
 * - Students: their own attendance
 * - Teachers: their class attendance
 * - Parents: their children's attendance
 * - Admins: all attendance in tenant
 */
export const GET = withRole(['student', 'teacher', 'admin', 'parent'], async (req, opts) => {
  try {
    const supabase = await createClient();
    const { page, pageSize, sortBy, sortOrder } = getPaginationParams(req);
    const searchParams = req.nextUrl.searchParams;
    const classId = searchParams.get('classId');
    const studentId = searchParams.get('studentId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const status = searchParams.get('status');

    let query = supabase
      .from('attendance')
      .select('*', { count: 'exact' })
      .eq('tenant_id', opts.tenantId)
      .order(sortBy, { ascending: sortOrder === 'asc' });

    // Filter by role
    if (opts.userRole === 'student') {
      query = query.eq('student_id', opts.userId);
    } else if (opts.userRole === 'parent') {
      const { data: children } = await supabase
        .from('parent_student_relationships')
        .select('student_id')
        .eq('parent_id', opts.userId);

      if (!children || children.length === 0) {
        return apiResponse({
          attendance: [],
          pagination: getPaginationMetadata(page, pageSize, 0),
        });
      }

      const studentIds = children.map((c) => c.student_id);
      query = query.in('student_id', studentIds);
    } else if (opts.userRole === 'teacher') {
      const { data: teaching } = await supabase
        .from('class_teachers')
        .select('class_id')
        .eq('teacher_id', opts.userId);

      if (!teaching || teaching.length === 0) {
        return apiResponse({
          attendance: [],
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

    if (studentId && (opts.userRole === 'teacher' || opts.userRole === 'admin')) {
      query = query.eq('student_id', studentId);
    }

    if (dateFrom) {
      query = query.gte('record_date', dateFrom);
    }

    if (dateTo) {
      query = query.lte('record_date', dateTo);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: attendance, count, error } = await query.range(
      (page - 1) * pageSize,
      page * pageSize - 1
    );

    if (error) {
      throw error;
    }

    return apiResponse({
      attendance: attendance || [],
      pagination: getPaginationMetadata(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return apiError('Failed to fetch attendance', 500, 'FETCH_ERROR');
  }
});

/**
 * POST /api/attendance
 * Record attendance for a class (teacher only)
 */
export const POST = withRole(['teacher', 'admin'], async (req, opts) => {
  try {
    const body = await req.json();

    // Validate request
    const validation = attendanceRecordSchema.safeParse(body);
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

    // Verify teacher access if not admin
    if (opts.userRole === 'teacher') {
      const { data: classTeacher } = await supabase
        .from('class_teachers')
        .select('id')
        .eq('teacher_id', opts.userId)
        .eq('class_id', data.classId)
        .single();

      if (!classTeacher) {
        return apiError('Access denied', 403, 'FORBIDDEN');
      }
    }

    // Insert attendance records
    const attendanceRecords = data.attendance.map((record) => ({
      tenant_id: opts.tenantId,
      class_id: data.classId,
      student_id: record.studentId,
      record_date: data.recordDate,
      status: record.status,
      notes: record.notes,
      recorded_by: opts.userId,
      created_at: new Date().toISOString(),
    }));

    const { data: inserted, error } = await supabase
      .from('attendance')
      .insert(attendanceRecords)
      .select();

    if (error) {
      throw error;
    }

    return apiResponse(
      {
        inserted: inserted?.length || 0,
        total: data.attendance.length,
      },
      201
    );
  } catch (error) {
    console.error('Error recording attendance:', error);
    return apiError('Failed to record attendance', 500, 'RECORD_ERROR');
  }
});
