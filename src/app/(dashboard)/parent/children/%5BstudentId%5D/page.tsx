'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { ArrowLeft, Download, TrendingUp, Award, Calendar } from 'lucide-react';

export default function ParentChildDetailPage({
  params,
}: {
  params: { studentId: string };
}) {
  const childData = {
    name: 'Emma Johnson',
    grade: '9',
    school: 'Hillside Academy',
    currentGPA: 92,
    level: 12,
    xp: 3250,
    attendanceRate: 98,
    streak: 7,
    lastLogin: '2 hours ago',
  };

  const recentGrades = [
    { subject: 'Mathematics', grade: 92, trend: 'up' },
    { subject: 'English Literature', grade: 87, trend: 'stable' },
    { subject: 'Biology', grade: 88, trend: 'up' },
    { subject: 'Chemistry', grade: 85, trend: 'down' },
  ];

  const upcomingAssignments = [
    { title: 'Math Problem Set', dueDate: 'Tomorrow', status: 'in_progress' },
    { title: 'Essay: The Great Gatsby', dueDate: 'Mar 15', status: 'not_started' },
    { title: 'Chemistry Quiz', dueDate: 'Mar 18', status: 'not_started' },
  ];

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
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {childData.name}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Grade {childData.grade} • {childData.school}
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Current GPA</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {childData.currentGPA}%
              </p>
              <Progress value={childData.currentGPA} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Level</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {childData.level}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                {childData.xp.toLocaleString()} XP
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Attendance</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {childData.attendanceRate}%
              </p>
              <Progress value={childData.attendanceRate} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Streak</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {childData.streak}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="grades" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          {/* Grades Tab */}
          <TabsContent value="grades" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Subject Grades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentGrades.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {item.subject}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {item.trend === 'up' && '📈 Improving'}
                        {item.trend === 'down' && '📉 Declining'}
                        {item.trend === 'stable' && '➡️ Stable'}
                      </p>
                    </div>
                    <Badge className={getGradeColor(item.grade)}>
                      {item.grade}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                View Detailed Grades
              </Button>
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming & Recent Assignments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingAssignments.map((assignment, idx) => (
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
                            : 'bg-gray-500/20 text-gray-700 dark:text-gray-200'
                        }
                      >
                        {assignment.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Due: {assignment.dueDate}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-4">
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
                      94
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Absent Days</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                      2
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Overall attendance rate: {childData.attendanceRate}%
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Teacher */}
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Have questions about your child's progress?
            </p>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              Message Teachers
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
