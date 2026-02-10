'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  Users,
  BookOpen,
  FileText,
  BarChart3,
  Calendar,
  Settings,
  Plus,
  Search,
  ChevronDown,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface Student {
  id: string;
  name: string;
  email: string;
  currentGrade: number;
  status: 'active' | 'inactive';
  attendanceRate: number;
}

interface Module {
  id: string;
  title: string;
  lessonCount: number;
  expanded: boolean;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  pointsPossible: number;
  submissionCount: number;
  studentCount: number;
}

const mockCourseData = {
  id: '1',
  name: 'Mathematics 9 - Period 1',
  term: 'Spring 2024',
  description: 'Introduction to algebra and geometry concepts for 9th grade',
  room: '201',
  schedule: 'Mon, Wed, Fri - 9:00 AM',
};

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Emma Wilson',
    email: 'emma.wilson@school.edu',
    currentGrade: 92,
    status: 'active',
    attendanceRate: 98,
  },
  {
    id: '2',
    name: 'Liam Brown',
    email: 'liam.brown@school.edu',
    currentGrade: 88,
    status: 'active',
    attendanceRate: 95,
  },
  {
    id: '3',
    name: 'Sophia Johnson',
    email: 'sophia.johnson@school.edu',
    currentGrade: 85,
    status: 'active',
    attendanceRate: 92,
  },
  {
    id: '4',
    name: 'Noah Davis',
    email: 'noah.davis@school.edu',
    currentGrade: 78,
    status: 'active',
    attendanceRate: 88,
  },
  {
    id: '5',
    name: 'Olivia Miller',
    email: 'olivia.miller@school.edu',
    currentGrade: 95,
    status: 'active',
    attendanceRate: 100,
  },
];

const mockModules: Module[] = [
  { id: '1', title: 'Unit 1: Linear Equations & Systems', lessonCount: 4, expanded: true },
  { id: '2', title: 'Unit 2: Polynomials & Factoring', lessonCount: 3, expanded: false },
  { id: '3', title: 'Unit 3: Quadratic Functions', lessonCount: 5, expanded: false },
];

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Problem Set Ch. 1',
    dueDate: 'Mar 8',
    pointsPossible: 20,
    submissionCount: 26,
    studentCount: 28,
  },
  {
    id: '2',
    title: 'Quiz 1',
    dueDate: 'Mar 10',
    pointsPossible: 50,
    submissionCount: 28,
    studentCount: 28,
  },
  {
    id: '3',
    title: 'Problem Set Ch. 2',
    dueDate: 'Mar 15',
    pointsPossible: 25,
    submissionCount: 22,
    studentCount: 28,
  },
];

const getGradeColor = (grade: number) => {
  if (grade >= 90) return 'bg-green-500/20 text-green-700 dark:text-green-200';
  if (grade >= 80) return 'bg-blue-500/20 text-blue-700 dark:text-blue-200';
  if (grade >= 70) return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-200';
  return 'bg-red-500/20 text-red-700 dark:text-red-200';
};

export default function TeacherCourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState<string[]>(['1']);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const filteredStudents = mockStudents.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgGrade =
    mockStudents.reduce((sum, s) => sum + s.currentGrade, 0) / mockStudents.length;
  const avgAttendance =
    mockStudents.reduce((sum, s) => sum + s.attendanceRate, 0) / mockStudents.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {mockCourseData.name}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {mockCourseData.description} • Room {mockCourseData.room}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Students</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {mockStudents.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg Grade</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {Math.round(avgGrade)}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Attendance</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {Math.round(avgAttendance)}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Modules</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {mockModules.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roster">Roster</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-white">
                    Description
                  </label>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {mockCourseData.description}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-white">
                    Schedule
                  </label>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {mockCourseData.schedule}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-white">
                    Room
                  </label>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {mockCourseData.room}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roster Tab */}
          <TabsContent value="roster" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {filteredStudents.map((student) => (
              <Card key={student.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar>
                        <AvatarImage src={student.email} />
                        <AvatarFallback>{student.name.split(' ')[0][0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {student.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {student.email}
                        </p>
                        <div className="flex gap-4 text-sm">
                          <div>
                            <p className="text-slate-600 dark:text-slate-400">Attendance</p>
                            <div className="flex items-center gap-2">
                              <Progress value={student.attendanceRate} className="h-1.5 w-16" />
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {student.attendanceRate}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={cn('text-lg mb-3 block', getGradeColor(student.currentGrade))}
                      >
                        {student.currentGrade}%
                      </Badge>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </Button>

            {mockModules.map((module) => (
              <Card key={module.id}>
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {module.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {module.lessonCount} lessons
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-slate-600 transition-transform',
                      expandedModules.includes(module.id) && 'rotate-180'
                    )}
                  />
                </button>

                {expandedModules.includes(module.id) && (
                  <CardContent className="border-t border-slate-200 dark:border-slate-700 p-6 space-y-2">
                    {Array.from({ length: module.lessonCount }).map((_, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
                      >
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          Lesson {idx + 1}: {module.title.split(':')[1]}
                        </p>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Lesson
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>

            {mockAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {assignment.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Due: {assignment.dueDate} • {assignment.pointsPossible} points
                      </p>
                    </div>
                    <Badge>
                      {assignment.submissionCount}/{assignment.studentCount}
                    </Badge>
                  </div>
                  <Progress
                    value={
                      (assignment.submissionCount / assignment.studentCount) * 100
                    }
                    className="h-2"
                  />
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Grades Tab */}
          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle>Class Gradebook</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Grade distribution and detailed student grades view
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Edit Course Details
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Manage Enrollment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Grading Policy
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
