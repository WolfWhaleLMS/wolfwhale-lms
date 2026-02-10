'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Users,
  BookOpen,
  School,
  Activity,
  AlertTriangle,
  TrendingUp,
  ServerCog,
  Database,
} from 'lucide-react';

const enrollmentData = [
  { grade: 'K', students: 45 },
  { grade: '1', students: 52 },
  { grade: '2', students: 48 },
  { grade: '3', students: 55 },
  { grade: '4', students: 51 },
  { grade: '5', students: 49 },
  { grade: '6', students: 58 },
  { grade: '7', students: 62 },
  { grade: '8', students: 60 },
];

const activityData = [
  { date: 'Mon', users: 245, assignments: 18 },
  { date: 'Tue', users: 298, assignments: 22 },
  { date: 'Wed', users: 267, assignments: 19 },
  { date: 'Thu', users: 315, assignments: 25 },
  { date: 'Fri', users: 289, assignments: 21 },
  { date: 'Sat', users: 145, assignments: 8 },
  { date: 'Sun', users: 167, assignments: 12 },
];

const recentActivity = [
  { timestamp: '2 hours ago', action: 'New teacher registered: Mr. Thompson', type: 'user' },
  { timestamp: '4 hours ago', action: 'System backup completed successfully', type: 'system' },
  { timestamp: '1 day ago', action: '125 new students enrolled this week', type: 'enrollment' },
  { timestamp: '2 days ago', action: 'Gamification feature enabled for 3 schools', type: 'feature' },
];

const alerts = [
  { severity: 'warning', message: 'Storage usage at 72% capacity for Lincoln High School' },
  { severity: 'info', message: 'Scheduled maintenance: March 15, 2AM - 3AM PST' },
];

export default function AdminDashboard() {
  const totalStudents = 536;
  const totalTeachers = 42;
  const totalClasses = 86;
  const activeUsers = 298;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-cyan-950 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            School Administration
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Manage your school, users, and platform settings
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
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Classes</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalClasses}</p>
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

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 flex items-start gap-3 ${
                  alert.severity === 'warning'
                    ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-500'
                    : 'bg-blue-50 dark:bg-blue-950 border-blue-500'
                }`}
              >
                <AlertTriangle
                  className={`w-5 h-5 flex-shrink-0 ${
                    alert.severity === 'warning'
                      ? 'text-yellow-600'
                      : 'text-blue-600'
                  }`}
                />
                <p
                  className={`${
                    alert.severity === 'warning'
                      ? 'text-yellow-700 dark:text-yellow-200'
                      : 'text-blue-700 dark:text-blue-200'
                  }`}
                >
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment by Grade Level</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={enrollmentData}>
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
                  <Bar dataKey="students" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,100,0.1)" />
                  <XAxis dataKey="date" stroke="currentColor" />
                  <YAxis stroke="currentColor" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    dot={{ fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ServerCog className="w-5 h-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  Server Uptime
                </span>
                <Badge className="bg-green-500/20 text-green-700 dark:text-green-200">
                  99.9%
                </Badge>
              </div>
              <Progress value={99.9} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  Storage Usage
                </span>
                <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-200">
                  72%
                </Badge>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  API Latency
                </span>
                <Badge className="bg-green-500/20 text-green-700 dark:text-green-200">
                  45ms
                </Badge>
              </div>
              <Progress value={20} className="h-2" />
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
            {recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {activity.timestamp}
                  </p>
                </div>
                <Badge
                  className={`text-xs ${
                    activity.type === 'system'
                      ? 'bg-slate-500/20'
                      : activity.type === 'enrollment'
                      ? 'bg-blue-500/20'
                      : 'bg-green-500/20'
                  }`}
                >
                  {activity.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-12">
              Add User
            </Button>
            <Button variant="outline" className="h-12">
              Manage Classes
            </Button>
            <Button variant="outline" className="h-12">
              View Reports
            </Button>
            <Button variant="outline" className="h-12">
              School Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
