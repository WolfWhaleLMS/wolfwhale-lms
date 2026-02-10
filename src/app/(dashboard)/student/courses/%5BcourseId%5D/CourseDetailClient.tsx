'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import {
  BookOpen,
  Calendar,
  MessageSquare,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseDetailData {
  course: {
    id: string;
    name: string;
    description: string;
    subject: string;
    grade_level: string;
    semester: string;
    start_date: string;
    end_date: string;
    status: string;
    teacherName: string;
    teacherAvatar: string | null;
    [key: string]: any;
  };
  enrollment: {
    id: string;
    status: string;
    grade_letter: string | null;
    grade_numeric: number | null;
    [key: string]: any;
  };
  lessons: Array<{
    id: string;
    title: string;
    description: string;
    order_index: number;
    status: string;
    [key: string]: any;
  }>;
  assignments: Array<{
    id: string;
    title: string;
    description: string;
    type: string;
    due_date: string;
    max_points: number;
    status: string;
    submission: any | null;
    grade: any | null;
    [key: string]: any;
  }>;
  classmates: Array<{
    id: string;
    name: string;
    avatar: string | null;
  }>;
  announcements: Array<{
    id: string;
    title: string;
    content: string;
    published_at: string;
    [key: string]: any;
  }>;
  progress: {
    completionPercentage: number;
    averageGrade: number | null;
    totalAssignments: number;
    gradedAssignments: number;
  };
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'submitted':
      return 'bg-green-500/20 text-green-700 dark:text-green-200';
    case 'in_progress':
      return 'bg-blue-500/20 text-blue-700 dark:text-blue-200';
    case 'graded':
      return 'bg-purple-500/20 text-purple-700 dark:text-purple-200';
    case 'not_started':
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

function getAssignmentStatus(assignment: CourseDetailData['assignments'][0]): string {
  if (assignment.grade) return 'graded';
  if (assignment.submission) return 'submitted';
  const now = new Date();
  const due = new Date(assignment.due_date);
  if (due < now) return 'overdue';
  return 'not_started';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHr < 24) return `${diffHr} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface CourseDetailClientProps {
  data: CourseDetailData;
}

export function CourseDetailClient({ data }: CourseDetailClientProps) {
  const { course, enrollment, lessons, assignments, classmates, announcements, progress } = data;
  const [expandedModules, setExpandedModules] = useState<string[]>(['all']);

  const currentGrade = progress.averageGrade ?? enrollment.grade_numeric ?? 0;
  const completedLessons = lessons.filter((l) => l.status === 'completed' || l.status === 'published').length;
  const assignmentCompletionPct =
    progress.totalAssignments > 0
      ? Math.round((progress.gradedAssignments / progress.totalAssignments) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {course.name}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {course.teacherName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
              {currentGrade > 0 ? `${Math.round(currentGrade)}%` : 'N/A'}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Current Grade</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="modules">Lessons</TabsTrigger>
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
                    <p className="text-slate-900 dark:text-white">
                      {course.description || 'No description available.'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Semester</p>
                    <p className="text-slate-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {course.semester || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Subject</p>
                    <p className="text-slate-900 dark:text-white">{course.subject || 'General'}</p>
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
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {Math.round(progress.completionPercentage)}%
                      </span>
                    </div>
                    <Progress value={progress.completionPercentage} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        Assignment Completion
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {assignmentCompletionPct}%
                      </span>
                    </div>
                    <Progress value={assignmentCompletionPct} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        Lessons Available
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {lessons.length}
                      </span>
                    </div>
                    <Progress
                      value={lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0}
                      className="h-3"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {announcements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    Recent Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {announcements.map((ann, idx) => (
                    <div
                      key={ann.id}
                      className={cn(
                        'p-4 rounded-lg border',
                        idx === 0
                          ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                      )}
                    >
                      <p className="font-semibold text-slate-900 dark:text-white mb-1">
                        {ann.title}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                        {ann.content}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {timeAgo(ann.published_at)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="modules" className="space-y-4">
            {lessons.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No lessons have been published yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 space-y-3">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:shadow-md transition-shadow flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-sm font-bold text-purple-600 dark:text-purple-300">
                          {lesson.order_index}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {lesson.title}
                          </p>
                          {lesson.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                              {lesson.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            {assignments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-slate-600 dark:text-slate-400">
                    No assignments yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              assignments.map((assignment) => {
                const status = getAssignmentStatus(assignment);
                return (
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
                              Due: {formatDate(assignment.due_date)}
                            </span>
                            <span>Points: {assignment.max_points}</span>
                          </div>
                        </div>
                        <Badge
                          className={cn(
                            'text-sm whitespace-nowrap',
                            getStatusBadgeColor(status)
                          )}
                        >
                          {status === 'submitted' && 'Submitted'}
                          {status === 'in_progress' && 'In Progress'}
                          {status === 'graded' && 'Graded'}
                          {status === 'not_started' && 'Not Started'}
                          {status === 'overdue' && 'Overdue'}
                        </Badge>
                      </div>

                      {assignment.submission && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                          Submitted{' '}
                          {assignment.submission.submitted_at
                            ? timeAgo(assignment.submission.submitted_at)
                            : ''}
                        </p>
                      )}

                      {assignment.grade && (
                        <div className="mb-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                            Grade: {assignment.grade.points_earned}/{assignment.max_points}
                            {assignment.grade.letter_grade && ` (${assignment.grade.letter_grade})`}
                          </p>
                          {assignment.grade.feedback && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                              {assignment.grade.feedback}
                            </p>
                          )}
                        </div>
                      )}

                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        {status === 'not_started' && 'Start Assignment'}
                        {status === 'in_progress' && 'Continue Assignment'}
                        {status === 'submitted' && 'View Submission'}
                        {status === 'graded' && 'View Grade & Feedback'}
                        {status === 'overdue' && 'Submit Late'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Grades Tab */}
          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle>Grade Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {assignments.filter((a) => a.grade).length === 0 ? (
                  <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                    No graded assignments yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {assignments
                      .filter((a) => a.grade)
                      .map((a) => (
                        <div
                          key={a.id}
                          className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{a.title}</p>
                            {a.grade?.feedback && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                {a.grade.feedback}
                              </p>
                            )}
                          </div>
                          <Badge className="bg-green-500/20 text-green-700 dark:text-green-200">
                            {a.grade.points_earned}/{a.max_points}
                          </Badge>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classmates Tab */}
          <TabsContent value="classmates">
            <Card>
              <CardHeader>
                <CardTitle>Classmates ({classmates.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {classmates.length === 0 ? (
                  <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                    No classmates found.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {classmates.map((classmate) => (
                      <div
                        key={classmate.id}
                        className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center gap-3"
                      >
                        <Avatar>
                          <AvatarImage src={classmate.avatar || undefined} />
                          <AvatarFallback>
                            {classmate.name ? classmate.name[0].toUpperCase() : '?'}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {classmate.name || 'Unknown'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
