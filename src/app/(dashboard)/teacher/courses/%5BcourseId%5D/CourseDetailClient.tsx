'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Users, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Student {
  id: string;
  name: string;
  email: string;
  currentGrade: number;
  status: string;
  attendanceRate: number;
}

interface LessonData {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  status: string;
}

interface AssignmentData {
  id: string;
  title: string;
  dueDate: string;
  pointsPossible: number;
  submissionCount: number;
  studentCount: number;
  status: string;
}

interface CourseData {
  id: string;
  name: string;
  term: string;
  description: string;
  subject: string;
  gradeLevel: string;
  startDate: string;
  endDate: string;
}

interface CourseDetailClientProps {
  course: CourseData;
  students: Student[];
  lessons: LessonData[];
  assignments: AssignmentData[];
}

const getGradeColor = (grade: number) => {
  if (grade >= 90) return 'bg-green-500/20 text-green-700 dark:text-green-200';
  if (grade >= 80) return 'bg-blue-500/20 text-blue-700 dark:text-blue-200';
  if (grade >= 70) return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-200';
  return 'bg-red-500/20 text-red-700 dark:text-red-200';
};

export function CourseDetailClient({ course, students, lessons, assignments }: CourseDetailClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgGrade = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.currentGrade, 0) / students.length)
    : 0;
  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length)
    : 0;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {course.name}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {course.description} {course.subject ? `- ${course.subject}` : ''}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Students</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{students.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg Grade</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {avgGrade > 0 ? `${avgGrade}%` : '--'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Attendance</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {avgAttendance > 0 ? `${avgAttendance}%` : '--'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Lessons</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{lessons.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roster">Roster</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
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
                  <label className="text-sm font-medium text-slate-900 dark:text-white">Description</label>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{course.description || 'No description provided.'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-white">Subject</label>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{course.subject || '--'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-white">Grade Level</label>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{course.gradeLevel || '--'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-white">Term</label>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{course.term || '--'}</p>
                </div>
                {course.startDate && course.endDate && (
                  <div>
                    <label className="text-sm font-medium text-slate-900 dark:text-white">Schedule</label>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
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
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white">{student.name}</h4>
                        <div className="flex gap-4 text-sm mt-2">
                          <div>
                            <p className="text-slate-600 dark:text-slate-400">Attendance</p>
                            <div className="flex items-center gap-2">
                              <Progress value={student.attendanceRate} className="h-1.5 w-16" />
                              <span className="font-semibold text-slate-900 dark:text-white">{student.attendanceRate}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={cn('text-lg mb-3 block', getGradeColor(student.currentGrade))}>
                        {student.currentGrade > 0 ? `${student.currentGrade}%` : '--'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredStudents.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500 dark:text-slate-400">No students found.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full" asChild>
              <Link href={`/teacher/courses/${course.id}/lessons/create`}>
                <Plus className="w-4 h-4 mr-2" />
                Create Lesson
              </Link>
            </Button>

            {lessons.map((lesson) => (
              <Card key={lesson.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{lesson.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{lesson.description}</p>
                    </div>
                    <Badge className={cn(
                      lesson.status === 'published'
                        ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                        : 'bg-slate-500/20 text-slate-700 dark:text-slate-300'
                    )}>
                      {lesson.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            {lessons.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-slate-500 dark:text-slate-400">No lessons yet. Create your first lesson above.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full" asChild>
              <Link href={`/teacher/courses/${course.id}/assignments/create`}>
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Link>
            </Button>

            {assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{assignment.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Due: {formatDate(assignment.dueDate)} - {assignment.pointsPossible} points
                      </p>
                    </div>
                    <Badge>
                      {assignment.submissionCount}/{assignment.studentCount}
                    </Badge>
                  </div>
                  {assignment.studentCount > 0 && (
                    <Progress
                      value={(assignment.submissionCount / assignment.studentCount) * 100}
                      className="h-2"
                    />
                  )}
                </CardContent>
              </Card>
            ))}

            {assignments.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-slate-500 dark:text-slate-400">No assignments yet. Create your first assignment above.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">Edit Course Details</Button>
                <Button variant="outline" className="w-full justify-start">Manage Enrollment</Button>
                <Button variant="outline" className="w-full justify-start">Grading Policy</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
