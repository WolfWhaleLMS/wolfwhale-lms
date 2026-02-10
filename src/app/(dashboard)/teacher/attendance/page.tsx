import { redirect } from 'next/navigation';
import { requireRole, getUser, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { TeacherAttendanceClient } from './TeacherAttendanceClient';

export default async function TeacherAttendancePage() {
  await requireRole(['teacher', 'admin']);
  const user = await getUser();
  const tenantId = await getUserTenantId();

  if (!user || !tenantId) {
    redirect('/login');
  }

  const supabase = await createClient();

  // Fetch courses taught by this teacher
  const { data: courses } = await supabase
    .from('courses')
    .select('id, name, grade_level')
    .eq('tenant_id', tenantId)
    .eq('created_by', user.id)
    .eq('status', 'active')
    .order('name');

  const courseList = courses || [];
  const courseIds = courseList.map((c) => c.id);

  if (courseIds.length === 0) {
    return <TeacherAttendanceClient courses={[]} teacherId={user.id} tenantId={tenantId} />;
  }

  // Fetch enrollments
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('course_id, student_id')
    .eq('tenant_id', tenantId)
    .in('course_id', courseIds)
    .eq('status', 'active');

  const enrollmentList = enrollments || [];
  const allStudentIds = [...new Set(enrollmentList.map((e) => e.student_id))];

  // Fetch student profiles
  let profileMap: Record<string, { first_name: string; last_name: string }> = {};
  if (allStudentIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', allStudentIds);

    (profiles || []).forEach((p) => {
      profileMap[p.id] = { first_name: p.first_name, last_name: p.last_name };
    });
  }

  // Fetch attendance records for this week (Monday through today)
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - mondayOffset);
  const mondayStr = monday.toISOString().split('T')[0];
  const todayStr = now.toISOString().split('T')[0];

  const { data: attendanceRecords } = await supabase
    .from('attendance_records')
    .select('course_id, student_id, attendance_date, status, notes')
    .eq('tenant_id', tenantId)
    .in('course_id', courseIds)
    .gte('attendance_date', mondayStr)
    .lte('attendance_date', todayStr);

  const attendanceList = attendanceRecords || [];

  // Also fetch overall attendance for each student to compute their attendance rates
  const { data: allAttendance } = await supabase
    .from('attendance_records')
    .select('course_id, student_id, status')
    .eq('tenant_id', tenantId)
    .in('course_id', courseIds);

  const overallAttendanceMap: Record<string, Record<string, { total: number; present: number }>> = {};
  (allAttendance || []).forEach((ar) => {
    if (!overallAttendanceMap[ar.course_id]) overallAttendanceMap[ar.course_id] = {};
    if (!overallAttendanceMap[ar.course_id][ar.student_id]) {
      overallAttendanceMap[ar.course_id][ar.student_id] = { total: 0, present: 0 };
    }
    overallAttendanceMap[ar.course_id][ar.student_id].total++;
    if (ar.status === 'present' || ar.status === 'tardy') {
      overallAttendanceMap[ar.course_id][ar.student_id].present++;
    }
  });

  // Build week attendance data
  const weekDates: string[] = [];
  const dayLabels: string[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(d.toISOString().split('T')[0]);
    dayLabels.push(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i]);
  }

  // Build course data for client
  const courseData = courseList.map((course) => {
    const courseEnrollments = enrollmentList.filter((e) => e.course_id === course.id);

    const students = courseEnrollments.map((enrollment) => {
      const profile = profileMap[enrollment.student_id];
      const overall = overallAttendanceMap[course.id]?.[enrollment.student_id];
      const attendanceRate = overall && overall.total > 0
        ? Math.round((overall.present / overall.total) * 100)
        : 100;

      return {
        id: enrollment.student_id,
        firstName: profile?.first_name || 'Unknown',
        lastName: profile?.last_name || '',
        attendanceRate,
      };
    });

    // Build weekly attendance summary
    const weekSummary = weekDates.map((date, idx) => {
      const dayRecords = attendanceList.filter(
        (ar) => ar.course_id === course.id && ar.attendance_date === date
      );
      let present = 0;
      let absent = 0;
      let tardy = 0;
      let excused = 0;
      dayRecords.forEach((r) => {
        if (r.status === 'present') present++;
        else if (r.status === 'absent') absent++;
        else if (r.status === 'tardy') tardy++;
        else if (r.status === 'excused') excused++;
      });
      return {
        date,
        day: dayLabels[idx],
        present,
        absent,
        tardy,
        excused,
        rate: students.length > 0 ? Math.round((present / students.length) * 100) : 0,
      };
    });

    // Get today's attendance for pre-filling
    const todayRecords: Record<string, { status: string; notes: string }> = {};
    attendanceList
      .filter((ar) => ar.course_id === course.id && ar.attendance_date === todayStr)
      .forEach((ar) => {
        todayRecords[ar.student_id] = {
          status: ar.status || '',
          notes: ar.notes || '',
        };
      });

    return {
      id: course.id,
      name: course.name,
      gradeLevel: course.grade_level || '',
      studentCount: students.length,
      students,
      weekSummary,
      todayRecords,
    };
  });

  return (
    <TeacherAttendanceClient
      courses={courseData}
      teacherId={user.id}
      tenantId={tenantId}
    />
  );
}
