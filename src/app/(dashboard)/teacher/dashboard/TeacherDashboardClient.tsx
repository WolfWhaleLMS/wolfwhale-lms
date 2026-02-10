'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Users,
  Clock,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClassStat {
  classId: string;
  className: string;
  enrollment: number;
  averageGrade: number;
  attendanceRate: number;
}

interface RecentSubmission {
  id: string;
  studentName: string;
  assignmentTitle: string;
  submittedAt: string;
  status: 'pending' | 'reviewed';
  courseName: string;
}

interface TeacherDashboardClientProps {
  teacherName: string;
  totalStudents: number;
  pendingGrades: number;
  classStats: ClassStat[];
  recentSubmissions: RecentSubmission[];
  gradeDistribution: Array<{ grade: string; count: number }>;
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}

export function TeacherDashboardClient({
  teacherName,
  totalStudents,
  pendingGrades,
  classStats,
  recentSubmissions,
  gradeDistribution,
}: TeacherDashboardClientProps) {
  const averageAttendance =
    classStats.length > 0
      ? classStats.reduce((sum, cls) => sum + cls.attendanceRate, 0) / classStats.length
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome back, {teacherName}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Here&apos;s what&apos;s happening in your classes
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Students</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalStudents}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    Across {classStats.length} classes
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg Attendance</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {Math.round(averageAttendance)}%
                  </p>
                  <Progress value={averageAttendance} className="h-1.5 mt-2" />
                </div>
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pending Grades</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{pendingGrades}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    Submissions to grade
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Classes</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {classStats.length}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    This semester
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Your Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {classStats.map((cls) => (
              <Link
                key={cls.classId}
                href={`/teacher/courses/${cls.classId}`}
                className="block p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {cls.className}
                  </h4>
                  <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {cls.enrollment} students
                    </span>
                    <span>Avg: {cls.averageGrade}%</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
            ))}
            {classStats.length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-4">
                No active classes found.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grade Distribution */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Grade Distribution (All Classes)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,100,0.1)" />
                  <XAxis dataKey="grade" stroke="currentColor" />
                  <YAxis stroke="currentColor" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link href="/teacher/assignments">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assignment
                </Link>
              </Button>
              <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white" asChild>
                <Link href="/teacher/attendance">
                  <Clock className="w-4 h-4 mr-2" />
                  Take Attendance
                </Link>
              </Button>
              <Button className="w-full justify-start bg-green-600 hover:bg-green-700 text-white" asChild>
                <Link href="/teacher/grades">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Grade Submissions
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions Needing Grading */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-between">
              <span className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Submissions Needing Review
              </span>
              <Badge className="bg-orange-500/20 text-orange-700 dark:text-orange-200">
                {pendingGrades}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {submission.studentName.split(' ')[0]?.[0] || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">
                        {submission.studentName}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {submission.assignmentTitle} - {submission.courseName}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    Submitted {formatTimeAgo(submission.submittedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      'text-xs',
                      submission.status === 'pending'
                        ? 'bg-orange-500/20 text-orange-700 dark:text-orange-200'
                        : 'bg-green-500/20 text-green-700 dark:text-green-200'
                    )}
                  >
                    {submission.status === 'pending' ? 'Pending' : 'Reviewed'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
            {recentSubmissions.length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-4">
                No submissions to review.
              </p>
            )}
            <Button className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white" asChild>
              <Link href="/teacher/grades">
                View All Submissions <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Class Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Class Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classStats.map((stat) => (
                <div key={stat.classId} className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {stat.className}
                    </h4>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {stat.enrollment} students
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Avg Grade: {stat.averageGrade}%
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Grade Average</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {stat.averageGrade}%
                        </span>
                      </div>
                      <Progress value={stat.averageGrade} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Attendance Rate</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {stat.attendanceRate}%
                        </span>
                      </div>
                      <Progress value={stat.attendanceRate} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
