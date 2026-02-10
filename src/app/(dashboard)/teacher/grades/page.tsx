import { redirect } from 'next/navigation';
import { requireRole, getUser, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { TeacherGradesClient } from './TeacherGradesClient';

export default async function TeacherGradesPage() {
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
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('created_by', user.id)
    .eq('status', 'active')
    .order('name');

  const courseList = courses || [];
  const courseIds = courseList.map((c) => c.id);

  if (courseIds.length === 0) {
    return <TeacherGradesClient courses={[]} />;
  }

  // Fetch enrollments with student profiles for each course
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('course_id, student_id, status')
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

  // Fetch all assignments for teacher's courses
  const { data: assignments } = await supabase
    .from('assignments')
    .select('id, course_id, title, max_points, type, due_date, status')
    .eq('tenant_id', tenantId)
    .in('course_id', courseIds)
    .order('due_date');

  const assignmentList = assignments || [];
  const assignmentIds = assignmentList.map((a) => a.id);

  // Fetch all submissions
  let submissionList: Array<{
    id: string;
    assignment_id: string;
    student_id: string;
    status: string;
    submitted_at: string;
  }> = [];
  if (assignmentIds.length > 0) {
    const { data: submissions } = await supabase
      .from('submissions')
      .select('id, assignment_id, student_id, status, submitted_at')
      .eq('tenant_id', tenantId)
      .in('assignment_id', assignmentIds);
    submissionList = submissions || [];
  }

  // Fetch all grades
  let gradeList: Array<{
    id: string;
    submission_id: string;
    assignment_id: string;
    student_id: string;
    course_id: string;
    points_earned: number;
    percentage: number;
    letter_grade: string;
    feedback: string;
  }> = [];
  if (courseIds.length > 0) {
    const { data: grades } = await supabase
      .from('grades')
      .select('id, submission_id, assignment_id, student_id, course_id, points_earned, percentage, letter_grade, feedback')
      .eq('tenant_id', tenantId)
      .in('course_id', courseIds);
    gradeList = (grades || []).map((g) => ({
      ...g,
      points_earned: Number(g.points_earned) || 0,
      percentage: Number(g.percentage) || 0,
    }));
  }

  // Fetch attendance data for each course to compute attendance rates
  let attendanceMap: Record<string, Record<string, { total: number; present: number }>> = {};
  if (courseIds.length > 0) {
    const { data: attendanceRecords } = await supabase
      .from('attendance_records')
      .select('course_id, student_id, status')
      .eq('tenant_id', tenantId)
      .in('course_id', courseIds);

    (attendanceRecords || []).forEach((ar) => {
      if (!attendanceMap[ar.course_id]) attendanceMap[ar.course_id] = {};
      if (!attendanceMap[ar.course_id][ar.student_id]) {
        attendanceMap[ar.course_id][ar.student_id] = { total: 0, present: 0 };
      }
      attendanceMap[ar.course_id][ar.student_id].total++;
      if (ar.status === 'present' || ar.status === 'tardy') {
        attendanceMap[ar.course_id][ar.student_id].present++;
      }
    });
  }

  // Build course data for client
  const courseData = courseList.map((course) => {
    const courseEnrollments = enrollmentList.filter((e) => e.course_id === course.id);
    const courseAssignments = assignmentList.filter((a) => a.course_id === course.id);
    const courseGrades = gradeList.filter((g) => g.course_id === course.id);

    // Build students with grades
    const students = courseEnrollments.map((enrollment) => {
      const profile = profileMap[enrollment.student_id];
      const studentGrades = courseGrades.filter((g) => g.student_id === enrollment.student_id);
      const avgGrade = studentGrades.length > 0
        ? Math.round(studentGrades.reduce((sum, g) => sum + g.percentage, 0) / studentGrades.length)
        : null;

      const attendance = attendanceMap[course.id]?.[enrollment.student_id];
      const attendanceRate = attendance && attendance.total > 0
        ? Math.round((attendance.present / attendance.total) * 100)
        : 100;

      return {
        id: enrollment.student_id,
        firstName: profile?.first_name || 'Unknown',
        lastName: profile?.last_name || '',
        gradeLevel: course.grade_level || '',
        enrollmentStatus: 'active' as const,
        averageGrade: avgGrade,
        attendanceRate,
      };
    });

    // Build assignment data for this course
    const assignmentData = courseAssignments.map((a) => {
      const assignSubmissions = submissionList.filter((s) => s.assignment_id === a.id);
      const assignGraded = assignSubmissions.filter((s) => s.status === 'graded').length;
      return {
        id: a.id,
        courseId: a.course_id,
        courseName: course.name,
        title: a.title,
        type: (a.type || 'homework') as 'homework' | 'quiz' | 'project' | 'exam' | 'discussion',
        dueDate: a.due_date,
        maxPoints: Number(a.max_points) || 100,
        status: a.status === 'assigned' ? 'published' as const : (a.status || 'draft') as 'draft' | 'published' | 'archived',
        totalSubmissions: assignSubmissions.length,
        gradedSubmissions: assignGraded,
      };
    });

    // Build submission data for this course
    const submissionData = submissionList
      .filter((s) => courseAssignments.some((a) => a.id === s.assignment_id))
      .map((s) => {
        const assignment = courseAssignments.find((a) => a.id === s.assignment_id);
        const grade = courseGrades.find((g) => g.submission_id === s.id);
        const profile = profileMap[s.student_id];
        return {
          id: s.id,
          assignmentId: s.assignment_id,
          assignmentTitle: assignment?.title || '',
          studentId: s.student_id,
          studentName: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown',
          status: s.status as 'submitted' | 'graded' | 'returned',
          grade: grade ? {
            pointsEarned: grade.points_earned,
            percentage: grade.percentage,
            letterGrade: grade.letter_grade,
            feedback: grade.feedback || '',
          } : null,
        };
      });

    // Compute course-level stats
    const gradePercentages = courseGrades.map((g) => g.percentage);
    const averageGrade = gradePercentages.length > 0
      ? Math.round(gradePercentages.reduce((a, b) => a + b, 0) / gradePercentages.length)
      : 0;

    const totalPossibleGrades = courseAssignments.filter((a) => a.status === 'assigned' || a.status === 'published').length * students.length;
    const percentGraded = totalPossibleGrades > 0
      ? Math.round((courseGrades.length / totalPossibleGrades) * 100)
      : 0;

    const belowC = students.filter((s) => s.averageGrade !== null && s.averageGrade < 70).length;

    return {
      id: course.id,
      name: course.name,
      gradeLevel: course.grade_level || '',
      studentCount: students.length,
      students,
      assignments: assignmentData,
      submissions: submissionData,
      averageGrade,
      percentGraded: Math.min(percentGraded, 100),
      belowC,
    };
  });

  return <TeacherGradesClient courses={courseData} />;
}
