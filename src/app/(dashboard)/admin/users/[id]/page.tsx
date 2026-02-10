import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  Shield,
  Edit2,
  KeyRound,
  UserX,
  UserCheck,
  GraduationCap,
  BookOpen,
  Activity,
} from 'lucide-react';
import { requireRole, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { formatRelativeTime } from '@/lib/utils';

const roleColors: Record<string, string> = {
  student: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  teacher: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  parent: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  invited: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const activityTypeColors: Record<string, string> = {
  auth: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  profile: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  assignment: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  enrollment: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  security: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  user: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  settings: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: PageProps) {
  await requireRole(['admin', 'super_admin']);
  const tenantId = await getUserTenantId();
  const supabase = await createClient();
  const { id: userId } = await params;

  if (!tenantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">No school found for your account.</p>
      </div>
    );
  }

  // Verify user belongs to this tenant
  const { data: membership } = await supabase
    .from('tenant_memberships')
    .select('id, role, status, joined_at')
    .eq('tenant_id', tenantId)
    .eq('user_id', userId)
    .single();

  if (!membership) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-cyan-950 dark:to-blue-950 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <Shield className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                User Not Found
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                The user could not be found in your school.
              </p>
              <Link href="/admin/users">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Users
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  // Fetch email from admin client
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const adminClient = createAdminClient();
  const { data: authData } = await adminClient.auth.admin.getUserById(userId);
  const email = authData?.user?.email || '';
  const lastSignIn = authData?.user?.last_sign_in_at || null;

  const firstName = profile?.first_name || '';
  const lastName = profile?.last_name || '';
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
  const role = membership.role;
  const status = membership.status;

  // Fetch courses for this user
  let userCourses: Array<{
    id: string;
    name: string;
    subject: string | null;
    grade_level: string | null;
    status: string;
    studentCount: number;
  }> = [];

  if (role === 'teacher') {
    // Get courses where user is the creator/teacher
    const { data: courses } = await supabase
      .from('courses')
      .select('id, name, subject, grade_level, status')
      .eq('tenant_id', tenantId)
      .eq('created_by', userId);

    if (courses) {
      // Get enrollment counts for each course
      for (const course of courses) {
        const { count } = await supabase
          .from('course_enrollments')
          .select('id', { count: 'exact', head: true })
          .eq('course_id', course.id)
          .eq('status', 'active');

        userCourses.push({
          ...course,
          studentCount: count ?? 0,
        });
      }
    }
  } else if (role === 'student') {
    // Get courses where user is enrolled
    const { data: enrollments } = await supabase
      .from('course_enrollments')
      .select(`
        course_id,
        courses:course_id (
          id,
          name,
          subject,
          grade_level,
          status
        )
      `)
      .eq('tenant_id', tenantId)
      .eq('student_id', userId)
      .eq('status', 'active');

    if (enrollments) {
      for (const enrollment of enrollments) {
        const course = enrollment.courses as unknown as {
          id: string;
          name: string;
          subject: string | null;
          grade_level: string | null;
          status: string;
        } | null;

        if (course) {
          const { count } = await supabase
            .from('course_enrollments')
            .select('id', { count: 'exact', head: true })
            .eq('course_id', course.id)
            .eq('status', 'active');

          userCourses.push({
            ...course,
            studentCount: count ?? 0,
          });
        }
      }
    }
  }

  // For parents, get linked students
  let linkedStudents: Array<{ id: string; firstName: string; lastName: string; relationship: string | null }> = [];
  if (role === 'parent') {
    const { data: studentParents } = await supabase
      .from('student_parents')
      .select(`
        student_id,
        relationship,
        profiles:student_id (
          id,
          first_name,
          last_name
        )
      `)
      .eq('tenant_id', tenantId)
      .eq('parent_id', userId);

    if (studentParents) {
      linkedStudents = studentParents.map((sp) => {
        const studentProfile = sp.profiles as unknown as {
          id: string;
          first_name: string | null;
          last_name: string | null;
        } | null;
        return {
          id: sp.student_id,
          firstName: studentProfile?.first_name || '',
          lastName: studentProfile?.last_name || '',
          relationship: sp.relationship,
        };
      });
    }
  }

  // Fetch recent audit logs for this user
  const { data: userLogs } = await supabase
    .from('audit_logs')
    .select('id, action, resource_type, details, created_at')
    .eq('tenant_id', tenantId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  const recentActivity = (userLogs || []).map((log) => ({
    id: log.id,
    action: typeof log.details === 'object' && log.details !== null
      ? (log.details as Record<string, string>).description || log.action
      : log.action,
    timestamp: log.created_at,
    type: log.resource_type || 'system',
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-cyan-950 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href="/admin/users">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Button>
        </Link>

        {/* User Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {firstName} {lastName}
                  </h1>
                  <div className="flex gap-2">
                    <Badge className={roleColors[role] || roleColors.admin}>
                      {role}
                    </Badge>
                    <Badge className={statusColors[status] || statusColors.active}>
                      {status}
                    </Badge>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Mail className="w-4 h-4" />
                    {email}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(membership.joined_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  {lastSignIn && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Clock className="w-4 h-4" />
                      Last login {formatRelativeTime(lastSignIn)}
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Phone className="w-4 h-4" />
                      {profile.phone}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <KeyRound className="w-4 h-4 mr-2" />
                    Reset Password
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  {status === 'active' ? (
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20">
                      <UserX className="w-4 h-4 mr-2" />
                      Deactivate
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/20">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Reactivate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                <span className="text-sm text-slate-500 dark:text-slate-400">User ID</span>
                <code className="text-sm font-mono text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{userId}</code>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                <span className="text-sm text-slate-500 dark:text-slate-400">Role</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">{role}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">{status}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                <span className="text-sm text-slate-500 dark:text-slate-400">Joined</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {new Date(membership.joined_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {lastSignIn && (
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Last Login</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {formatRelativeTime(lastSignIn)}
                  </span>
                </div>
              )}
              {profile?.bio && (
                <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                  <span className="text-sm text-slate-500 dark:text-slate-400 block mb-1">Bio</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{profile.bio}</p>
                </div>
              )}
              {linkedStudents.length > 0 && (
                <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                  <span className="text-sm text-slate-500 dark:text-slate-400 block mb-1">Linked Students</span>
                  <div className="space-y-1">
                    {linkedStudents.map((student) => (
                      <Link
                        key={student.id}
                        href={`/admin/users/${student.id}`}
                        className="text-sm text-blue-600 hover:underline block"
                      >
                        {student.firstName} {student.lastName}
                        {student.relationship && (
                          <span className="text-slate-400 ml-1">({student.relationship})</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {role === 'teacher' ? 'Teaching Courses' : 'Enrolled Courses'}
              </CardTitle>
              <CardDescription>
                {userCourses.length === 0
                  ? 'No courses assigned'
                  : `${userCourses.length} course${userCourses.length !== 1 ? 's' : ''}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {userCourses.length > 0 ? (
                userCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-100/60 dark:bg-indigo-900/30">
                        <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {course.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          {course.subject && <span>{course.subject}</span>}
                          {course.grade_level && (
                            <span>
                              {course.grade_level === 'K' ? 'Kindergarten' : `Grade ${course.grade_level}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {course.studentCount} students
                      </p>
                      <Badge className={`text-[10px] ${statusColors[course.status] || statusColors.active}`}>
                        {course.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {role === 'parent'
                      ? 'Parent accounts do not have direct course enrollment'
                      : 'No courses found for this user'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Recent actions performed by this user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={activityTypeColors[activity.type] || activityTypeColors.profile}>
                        {activity.type}
                      </Badge>
                      <span className="text-sm text-slate-900 dark:text-white">
                        {activity.action}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap ml-4">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No recent activity recorded
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
