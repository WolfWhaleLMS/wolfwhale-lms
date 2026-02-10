'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
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
  MapPin,
} from 'lucide-react';
import { allMockUsers, mockClasses } from '@/data/admin-mock-data';
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

// Mock activity log for the user
const mockUserActivity = [
  { id: '1', action: 'Logged in', timestamp: '2026-02-09T10:30:00Z', type: 'auth' },
  { id: '2', action: 'Updated profile information', timestamp: '2026-02-08T14:15:00Z', type: 'profile' },
  { id: '3', action: 'Submitted assignment: Math Quiz 5', timestamp: '2026-02-07T09:45:00Z', type: 'assignment' },
  { id: '4', action: 'Joined class: Grade 3 Science', timestamp: '2026-02-06T11:00:00Z', type: 'enrollment' },
  { id: '5', action: 'Logged in', timestamp: '2026-02-05T08:20:00Z', type: 'auth' },
  { id: '6', action: 'Changed password', timestamp: '2026-02-03T16:30:00Z', type: 'security' },
  { id: '7', action: 'Logged in', timestamp: '2026-02-02T09:00:00Z', type: 'auth' },
];

const activityTypeColors: Record<string, string> = {
  auth: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  profile: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  assignment: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  enrollment: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  security: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  // Find the user from mock data
  const user = allMockUsers.find((u) => u.id === userId);

  // Get classes for the user if teacher
  const userClasses = user?.role === 'teacher'
    ? mockClasses.filter((c) => c.teacherId === user.id)
    : user?.role === 'student' && user.grade
    ? mockClasses.filter((c) => c.grade === user.grade).slice(0, 4)
    : [];

  if (!user) {
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
                The user with ID &quot;{userId}&quot; could not be found.
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

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

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
                <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </h1>
                  <div className="flex gap-2">
                    <Badge className={roleColors[user.role]}>
                      {user.role}
                    </Badge>
                    <Badge className={statusColors[user.status]}>
                      {user.status}
                    </Badge>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    Last login {formatRelativeTime(user.lastLogin)}
                  </div>
                  {user.grade && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <GraduationCap className="w-4 h-4" />
                      {user.grade === 'K' ? 'Kindergarten' : `Grade ${user.grade}`}
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
                  {user.status === 'active' ? (
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
                <code className="text-sm font-mono text-slate-700 dark:text-slate-300">{user.id}</code>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                <span className="text-sm text-slate-500 dark:text-slate-400">Role</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">{user.status}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                <span className="text-sm text-slate-500 dark:text-slate-400">Created</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                <span className="text-sm text-slate-500 dark:text-slate-400">Last Login</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {formatRelativeTime(user.lastLogin)}
                </span>
              </div>
              {user.grade && (
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Grade Level</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {user.grade === 'K' ? 'Kindergarten' : `Grade ${user.grade}`}
                  </span>
                </div>
              )}
              {user.linkedStudentIds && user.linkedStudentIds.length > 0 && (
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Linked Students</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {user.linkedStudentIds.length} student{user.linkedStudentIds.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {user.role === 'teacher' ? 'Teaching Classes' : 'Enrolled Classes'}
              </CardTitle>
              <CardDescription>
                {userClasses.length === 0
                  ? 'No classes assigned'
                  : `${userClasses.length} class${userClasses.length !== 1 ? 'es' : ''}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {userClasses.length > 0 ? (
                userClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-100/60 dark:bg-indigo-900/30">
                        <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {cls.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {cls.room}
                          </span>
                          <span>Period {cls.period}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {cls.studentCount} students
                      </p>
                      <Badge className={`text-[10px] ${statusColors[cls.status] || statusColors.active}`}>
                        {cls.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No classes found for this user
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
              {mockUserActivity.map((activity) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
