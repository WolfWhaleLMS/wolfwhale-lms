'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import {
  BookOpen,
  Calendar,
  FileText,
  MessageSquare,
  Users,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  pointsPossible: number;
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded';
  submittedDate?: string;
  grade?: number;
}

interface Classmate {
  id: string;
  name: string;
  avatar?: string;
}

const mockCourseData = {
  id: '1',
  name: 'Mathematics 9',
  teacher: 'Ms. Chen',
  schedule: 'Mon, Wed, Fri - 9:00 AM',
  room: '201',
  description: 'Comprehensive introduction to algebra and geometry concepts',
  currentGrade: 92,
  gradeProgression: [85, 88, 90, 92],
  announcementCount: 3,
};

const mockModules: Module[] = [
  {
    id: '1',
    title: 'Unit 1: Linear Equations & Systems',
    lessons: [
      { id: '1-1', title: 'Introduction to Variables', duration: 15, completed: true },
      { id: '1-2', title: 'Solving Linear Equations', duration: 20, completed: true },
      { id: '1-3', title: 'Systems of Equations', duration: 25, completed: false },
      { id: '1-4', title: 'Graphing Linear Functions', duration: 18, completed: false },
    ],
  },
  {
    id: '2',
    title: 'Unit 2: Polynomials & Factoring',
    lessons: [
      { id: '2-1', title: 'Polynomial Operations', duration: 20, completed: false },
      { id: '2-2', title: 'Factoring Trinomials', duration: 25, completed: false },
      { id: '2-3', title: 'Special Products', duration: 15, completed: false },
    ],
  },
  {
    id: '3',
    title: 'Unit 3: Quadratic Functions',
    lessons: [
      { id: '3-1', title: 'Quadratic Formula', duration: 20, completed: false },
      { id: '3-2', title: 'Graphing Parabolas', duration: 25, completed: false },
    ],
  },
];

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Linear Equations Practice',
    dueDate: 'Today',
    pointsPossible: 20,
    status: 'submitted',
    submittedDate: '2 hours ago',
    grade: 19,
  },
  {
    id: '2',
    title: 'Systems of Equations Quiz',
    dueDate: 'Tomorrow',
    pointsPossible: 50,
    status: 'in_progress',
  },
  {
    id: '3',
    title: 'Problem Set Ch. 5',
    dueDate: 'Mar 15',
    pointsPossible: 30,
    status: 'not_started',
  },
  {
    id: '4',
    title: 'Unit 1 Exam',
    dueDate: 'Mar 22',
    pointsPossible: 100,
    status: 'not_started',
  },
];

const mockGrades = [
  { assignment: 'Equations Worksheet', score: 95, total: 100 },
  { assignment: 'Graphing Quiz', score: 92, total: 100 },
  { assignment: 'Problem Set 1', score: 88, total: 100 },
  { assignment: 'Mid-Chapter Test', score: 90, total: 100 },
];

const mockClassmates: Classmate[] = [
  { id: '1', name: 'Jordan Smith' },
  { id: '2', name: 'Emma Wilson' },
  { id: '3', name: 'Liam Brown' },
  { id: '4', name: 'Sophia Johnson' },
  { id: '5', name: 'Noah Davis' },
  { id: '6', name: 'Olivia Miller' },
];

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'submitted':
      return 'bg-green-500/20 text-green-700 dark:text-green-200';
    case 'in_progress':
      return 'bg-blue-500/20 text-blue-700 dark:text-blue-200';
    case 'graded':
      return 'bg-purple-500/20 text-purple-700 dark:text-purple-200';
    case 'not_started':
      return 'bg-gray-500/20 text-gray-700 dark:text-gray-200';
    default:
      return 'bg-gray-500/20 text-gray-700 dark:text-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'submitted':
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    case 'in_progress':
      return <Clock className="w-4 h-4 text-blue-600" />;
    case 'graded':
      return <Award className="w-4 h-4 text-purple-600" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-600" />;
  }
};

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const [expandedModules, setExpandedModules] = useState<string[]>(['1']);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {mockCourseData.name}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {mockCourseData.teacher} • Room {mockCourseData.room}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
              {mockCourseData.currentGrade}%
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Current Grade</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="modules">Modules & Lessons</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="classmates">Classmates</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Description</p>
                    <p className="text-slate-900 dark:text-white">{mockCourseData.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Schedule</p>
                    <p className="text-slate-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {mockCourseData.schedule}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Location</p>
                    <p className="text-slate-900 dark:text-white">Room {mockCourseData.room}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        Course Completion
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">68%</span>
                    </div>
                    <Progress value={68} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        Assignment Completion
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">50%</span>
                    </div>
                    <Progress value={50} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        Lessons Completed
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">2/7</span>
                    </div>
                    <Progress value={29} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Recent Announcements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">
                    Quiz Tomorrow!
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Quick reminder that we have a quiz on Systems of Equations tomorrow. Review chapters 3-4.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">2 days ago</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">
                    Problem Set Available
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Chapter 5 problem set is now available on the modules page. Due Mar 15.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">1 week ago</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modules & Lessons Tab */}
          <TabsContent value="modules" className="space-y-4">
            {mockModules.map((module) => (
              <Card key={module.id}>
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {module.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-slate-600 transition-transform',
                      expandedModules.includes(module.id) && 'rotate-180'
                    )}
                  />
                </button>

                {expandedModules.includes(module.id) && (
                  <CardContent className="border-t border-slate-200 dark:border-slate-700 space-y-3">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:shadow-md transition-shadow flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {lesson.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-white">
                              {lesson.title}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {lesson.duration} minutes
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            {mockAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {assignment.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due: {assignment.dueDate}
                        </span>
                        <span>Points: {assignment.pointsPossible}</span>
                      </div>
                    </div>
                    <Badge className={cn('text-sm whitespace-nowrap', getStatusBadgeColor(assignment.status))}>
                      {assignment.status === 'submitted' && 'Submitted'}
                      {assignment.status === 'in_progress' && 'In Progress'}
                      {assignment.status === 'graded' && 'Graded'}
                      {assignment.status === 'not_started' && 'Not Started'}
                    </Badge>
                  </div>

                  {assignment.status === 'submitted' && assignment.submittedDate && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                      Submitted {assignment.submittedDate}
                    </p>
                  )}

                  {assignment.grade !== undefined && (
                    <div className="mb-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                        Grade: {assignment.grade}/{assignment.pointsPossible}
                      </p>
                    </div>
                  )}

                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    {assignment.status === 'not_started' && 'Start Assignment'}
                    {assignment.status === 'in_progress' && 'Continue Assignment'}
                    {assignment.status === 'submitted' && 'View Submission'}
                    {assignment.status === 'graded' && 'View Grade & Feedback'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Grades Tab */}
          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle>Grade Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockGrades.map((grade, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
                    >
                      <p className="font-medium text-slate-900 dark:text-white">{grade.assignment}</p>
                      <Badge className="bg-green-500/20 text-green-700 dark:text-green-200">
                        {grade.score}/{grade.total}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classmates Tab */}
          <TabsContent value="classmates">
            <Card>
              <CardHeader>
                <CardTitle>Classmates ({mockClassmates.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockClassmates.map((classmate) => (
                    <div
                      key={classmate.id}
                      className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center gap-3"
                    >
                      <Avatar>
                        <AvatarImage src={classmate.avatar} />
                        <AvatarFallback>{classmate.name.split(' ')[0][0]}</AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-slate-900 dark:text-white">{classmate.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
