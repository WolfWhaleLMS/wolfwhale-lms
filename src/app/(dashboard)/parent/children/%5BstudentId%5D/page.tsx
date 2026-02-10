import { createClient } from '@/lib/supabase/server';
import { requireRole, getSupabaseUser, getUserTenantId } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { ArrowLeft, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function ParentChildDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  await requireRole(['parent']);
  const user = await getSupabaseUser();
  const tenantId = await getUserTenantId();
  const supabase = await createClient();
  const { studentId } = await params;

  if (!user || !tenantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Unable to load data.</p>
      </div>
    );
  }

  // Verify this parent is linked to this student
  const { data: link } = await supabase
    .from('student_parents')
    .select('id')
    .eq('parent_id', user.id)
    .eq('student_id', studentId)
    .eq('tenant_id', tenantId)
    .single();

  if (!link) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-950 dark:via-green-950 dark:to-emerald-950 p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-slate-600 dark:text-slate-400">Student not found or not linked to your account.</p>
          <Link href="/parent/children">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Children
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get student profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url')
    .eq('id', studentId)
    .single();

  // Get tenant info for school name
  const { data: tenant } = await supabase
    .from('tenants')
    .select('name')
    .eq('id', tenantId)
    .single();

  // Get enrollments
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('course_id, grade_numeric, grade_letter, courses(id, name, subject, grade_level)')
    .eq('tenant_id', tenantId)
    .eq('student_id', studentId)
    .eq('status', 'active');

  // Get grades
  const { data: grades } = await supabase
    .from('grades')
    .select('course_id, percentage, letter_grade')
    .eq('tenant_id', tenantId)
    .eq('student_id', studentId);

  // Get attendance
  const { data: attendanceRecords } = await supabase
    .from('attendance_records')
    .select('status, attendance_date')
    .eq('tenant_id', tenantId)
    .eq('student_id', studentId);

  // Get assignments
  const courseIds = (enrollments || []).map((e) => e.course_id);
  const { data: assignments } = courseIds.length > 0
    ? await supabase
        .from('assignments')
        .select('id, title, due_date, course_id, status')
        .eq('tenant_id', tenantId)
        .in('course_id', courseIds)
        .order('due_date', { ascending: true })
        .limit(10)
    : { data: [] };

  const { data: submissions } = courseIds.length > 0
    ? await supabase
        .from('submissions')
        .select('assignment_id, status')
        .eq('tenant_id', tenantId)
        .eq('student_id', studentId)
    : { data: [] };

  // Compute data
  const childName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    : 'Unknown Student';

  const gradeLevel = enrollments?.[0]
    ? (enrollments[0] as any).courses?.grade_level || ''
    : '';

  // Subject grades
  const recentGrades = (enrollments || []).map((enrollment) => {
    const course = (enrollment as any).courses;
    const courseGrades = (grades || []).filter((g) => g.course_id === enrollment.course_id);
    const avgGrade = courseGrades.length > 0
      ? Math.round(courseGrades.reduce((sum, g) => sum + (g.percentage || 0), 0) / courseGrades.length)
      : enrollment.grade_numeric || 0;
    return {
      subject: course?.name || 'Unknown',
      grade: avgGrade,
      trend: 'stable' as const,
    };
  });

  // Overall GPA
  const allGradeValues = recentGrades.map((g) => g.grade).filter((g) => g > 0);
  const currentGPA = allGradeValues.length > 0
    ? Math.round(allGradeValues.reduce((s, g) => s + g, 0) / allGradeValues.length)
    : 0;

  // Attendance stats
  const totalDays = (attendanceRecords || []).length;
  const presentDays = (attendanceRecords || []).filter(
    (a) => a.status === 'present' || a.status === 'online'
  ).length;
  const absentDays = (attendanceRecords || []).filter((a) => a.status === 'absent').length;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  // Upcoming assignments
  const upcomingAssignments = (assignments || []).map((a) => {
    const submission = (submissions || []).find((s) => s.assignment_id === a.id);
    const dueDate = new Date(a.due_date);
    const now = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    let dueDateStr = a.due_date;
    if (diffDays === 0) dueDateStr = 'Today';
    else if (diffDays === 1) dueDateStr = 'Tomorrow';
    else {
      dueDateStr = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    let status = 'not_started';
    if (submission) {
      status = submission.status === 'graded' ? 'graded' : 'in_progress';
    }

    return { title: a.title, dueDate: dueDateStr, status };
  });

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'bg-green-500/20 text-green-700 dark:text-green-200';
    if (grade >= 80) return 'bg-blue-500/20 text-blue-700 dark:text-blue-200';
    return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-950 dark:via-green-950 dark:to-emerald-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/parent/children">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {childName}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {gradeLevel ? `Grade ${gradeLevel}` : ''}{gradeLevel && tenant?.name ? ' - ' : ''}{tenant?.name || ''}
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Current GPA</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {currentGPA}%
              </p>
              <Progress value={currentGPA} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Classes</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {(enrollments || []).length}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Enrolled courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Attendance</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {attendanceRate}%
              </p>
              <Progress value={attendanceRate} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Days</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {totalDays}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                recorded
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Subject Grades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Subject Grades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentGrades.length > 0 ? (
              recentGrades.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {item.subject}
                    </p>
                  </div>
                  <Badge className={getGradeColor(item.grade)}>
                    {item.grade}%
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm">No grade data available.</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming & Recent Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAssignments.length > 0 ? (
              upcomingAssignments.map((assignment, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {assignment.title}
                    </p>
                    <Badge
                      className={
                        assignment.status === 'in_progress'
                          ? 'bg-blue-500/20 text-blue-700 dark:text-blue-200'
                          : assignment.status === 'graded'
                          ? 'bg-green-500/20 text-green-700 dark:text-green-200'
                          : 'bg-gray-500/20 text-gray-700 dark:text-gray-200'
                      }
                    >
                      {assignment.status === 'in_progress' ? 'In Progress' : assignment.status === 'graded' ? 'Graded' : 'Not Started'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Due: {assignment.dueDate}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm">No upcoming assignments.</p>
            )}
          </CardContent>
        </Card>

        {/* Attendance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <p className="text-sm text-slate-600 dark:text-slate-400">Present Days</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {presentDays}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                <p className="text-sm text-slate-600 dark:text-slate-400">Absent Days</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {absentDays}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Overall attendance rate: {attendanceRate}%
            </p>
          </CardContent>
        </Card>

        {/* Contact Teacher */}
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Have questions about your child&apos;s progress?
            </p>
            <Link href="/parent/messages">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Message Teachers
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
