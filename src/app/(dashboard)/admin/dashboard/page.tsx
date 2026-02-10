import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  School,
  Activity,
  AlertTriangle,
  UserPlus,
  Settings,
  FileText,
  GraduationCap,
} from 'lucide-react';
import { requireRole, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  await requireRole(['admin', 'super_admin']);
  const tenantId = await getUserTenantId();
  const supabase = await createClient();

  if (!tenantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">No school found for your account.</p>
      </div>
    );
  }

  // Fetch tenant info
  const { data: tenant } = await supabase
    .from('tenants')
    .select('name, slug, subscription_plan, status')
    .eq('id', tenantId)
    .single();

  // Fetch membership counts by role
  const { data: memberships } = await supabase
    .from('tenant_memberships')
    .select('role, status')
    .eq('tenant_id', tenantId);

  const allMembers = memberships || [];
  const totalStudents = allMembers.filter((m) => m.role === 'student').length;
  const totalTeachers = allMembers.filter((m) => m.role === 'teacher').length;
  const totalParents = allMembers.filter((m) => m.role === 'parent').length;
  const totalAdmins = allMembers.filter((m) => m.role === 'admin' || m.role === 'super_admin').length;
  const activeUsers = allMembers.filter((m) => m.status === 'active').length;
  const totalUsers = allMembers.length;

  // Fetch course count
  const { count: courseCount } = await supabase
    .from('courses')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)
    .eq('status', 'active');

  // Fetch total enrollment count
  const { count: enrollmentCount } = await supabase
    .from('course_enrollments')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)
    .eq('status', 'active');

  // Fetch recent audit logs
  const { data: recentLogs } = await supabase
    .from('audit_logs')
    .select('id, action, resource_type, details, created_at, user_id')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(5);

  // For each audit log, fetch user profile names
  const logUserIds = [...new Set((recentLogs || []).map((l) => l.user_id).filter(Boolean))];
  const { data: logProfiles } = logUserIds.length > 0
    ? await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', logUserIds)
    : { data: [] };

  const profileMap = new Map(
    (logProfiles || []).map((p) => [p.id, `${p.first_name || ''} ${p.last_name || ''}`.trim()])
  );

  const recentActivity = (recentLogs || []).map((log) => ({
    id: log.id,
    action: log.action,
    resourceType: log.resource_type || 'system',
    details: typeof log.details === 'object' && log.details !== null
      ? (log.details as Record<string, string>).description || log.action
      : log.action,
    timestamp: log.created_at,
    actor: log.user_id ? (profileMap.get(log.user_id) || 'Unknown') : 'System',
  }));

  // Fetch recent announcements count
  const { count: announcementCount } = await supabase
    .from('announcements')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)
    .eq('status', 'active');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-cyan-950 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            School Administration
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {tenant?.name || 'Your School'} &middot;{' '}
            <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-200 capitalize">
              {tenant?.subscription_plan || 'starter'}
            </Badge>
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Students</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalStudents}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Teachers</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalTeachers}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Courses</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{courseCount ?? 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <School className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Users</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{activeUsers}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Parents</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalParents}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Enrollments</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{enrollmentCount ?? 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                  <GraduationCap className="w-5 h-5 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Announcements</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{announcementCount ?? 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>User Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  Students
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {totalStudents} / {totalUsers}
                </span>
              </div>
              <Progress value={totalUsers > 0 ? (totalStudents / totalUsers) * 100 : 0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  Teachers
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {totalTeachers} / {totalUsers}
                </span>
              </div>
              <Progress value={totalUsers > 0 ? (totalTeachers / totalUsers) * 100 : 0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  Parents
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {totalParents} / {totalUsers}
                </span>
              </div>
              <Progress value={totalUsers > 0 ? (totalParents / totalUsers) * 100 : 0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  Admins
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {totalAdmins} / {totalUsers}
                </span>
              </div>
              <Progress value={totalUsers > 0 ? (totalAdmins / totalUsers) * 100 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {activity.details}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {activity.actor} &middot; {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge
                    className={`text-xs ${
                      activity.resourceType === 'system'
                        ? 'bg-slate-500/20'
                        : activity.resourceType === 'user'
                        ? 'bg-blue-500/20'
                        : 'bg-green-500/20'
                    }`}
                  >
                    {activity.resourceType}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No recent activity to display
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/admin/users/create">
              <Button variant="outline" className="h-12 w-full">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </Link>
            <Link href="/admin/classes">
              <Button variant="outline" className="h-12 w-full">
                <School className="w-4 h-4 mr-2" />
                Manage Classes
              </Button>
            </Link>
            <Link href="/admin/audit-logs">
              <Button variant="outline" className="h-12 w-full">
                <FileText className="w-4 h-4 mr-2" />
                View Audit Logs
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline" className="h-12 w-full">
                <Settings className="w-4 h-4 mr-2" />
                School Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
