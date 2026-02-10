'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { MessageSquare, Zap, TrendingUp, Calendar, AlertCircle, ArrowRight } from 'lucide-react';

interface ChildData {
  id: string;
  name: string;
  grade: string;
  avatar: string | null;
  currentGrade: number;
  attendanceRate: number;
  classes: { name: string; grade: number }[];
}

interface AssignmentData {
  title: string;
  dueDate: string;
  status: string;
}

interface Props {
  children: ChildData[];
  assignments: AssignmentData[];
  teachers: string[];
}

const getGradeColor = (grade: number) => {
  if (grade >= 90) return 'bg-green-500/20 text-green-700 dark:text-green-200';
  if (grade >= 80) return 'bg-blue-500/20 text-blue-700 dark:text-blue-200';
  return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-200';
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ParentDashboardClient({ children: childrenData, assignments, teachers }: Props) {
  const [selectedChild, setSelectedChild] = useState(childrenData[0]?.id || '');
  const activeChild = childrenData.find((c) => c.id === selectedChild);

  if (childrenData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-950 dark:via-green-950 dark:to-emerald-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">Parent Dashboard</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">No children data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-950 dark:via-green-950 dark:to-emerald-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            Parent Dashboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Monitor your child's progress and achievements
          </p>
        </div>

        {/* Child Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {childrenData.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child.id)}
              className={`p-6 rounded-2xl border-2 transition-all text-left ${
                selectedChild === child.id
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={child.avatar || undefined} />
                  <AvatarFallback>{child.name.split(' ')[0]?.[0] || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{child.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {child.grade ? `Grade ${child.grade}` : 'Grade N/A'}
                  </p>
                </div>
              </div>
              <Badge className={cn(getGradeColor(child.currentGrade))}>
                GPA: {child.currentGrade}%
              </Badge>
            </button>
          ))}
        </div>

        {/* Active Child Info */}
        {activeChild && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Current GPA</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        {activeChild.currentGrade}%
                      </p>
                    </div>
                    <Badge className={cn(getGradeColor(activeChild.currentGrade))}>
                      {activeChild.currentGrade >= 90 ? 'A' : activeChild.currentGrade >= 80 ? 'B' : 'C'}
                    </Badge>
                  </div>
                  <Progress value={activeChild.currentGrade} className="h-2 mt-4" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Attendance
                      </p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        {activeChild.attendanceRate}%
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <Progress value={activeChild.attendanceRate} className="h-2 mt-4" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Classes</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        {activeChild.classes.length}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    Enrolled courses
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
                    <CardTitle>Classes & Grades</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {activeChild.classes.length > 0 ? (
                      activeChild.classes.map((cls, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
                        >
                          <p className="font-medium text-slate-900 dark:text-white">{cls.name}</p>
                          <Badge className={cn(getGradeColor(cls.grade))}>
                            {cls.grade}%
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400 text-sm">No grade data available yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Assignments Tab */}
              <TabsContent value="assignments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming & Recent Assignments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {assignments.length > 0 ? (
                      assignments.map((assignment, idx) => (
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
                      ))
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400 text-sm">No upcoming assignments.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Attendance Tab */}
              <TabsContent value="attendance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400">
                      Overall attendance: {activeChild.attendanceRate}%
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Contact Teacher */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Communicate with Teachers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teachers.length > 0 ? (
                    teachers.map((teacher, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
                      >
                        <p className="font-medium text-slate-900 dark:text-white">{teacher}</p>
                        <Button variant="outline" size="sm">
                          Message
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">No teachers found for enrolled courses.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
