'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import {
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Users,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  enrollmentStatus: 'active';
  averageGrade: number | null;
  attendanceRate: number;
}

interface AssignmentData {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  type: 'homework' | 'quiz' | 'project' | 'exam' | 'discussion';
  dueDate: string;
  maxPoints: number;
  status: 'draft' | 'published' | 'archived';
  totalSubmissions: number;
  gradedSubmissions: number;
}

interface SubmissionData {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  status: 'submitted' | 'graded' | 'returned';
  grade: {
    pointsEarned: number;
    percentage: number;
    letterGrade: string;
    feedback: string;
  } | null;
}

interface CourseData {
  id: string;
  name: string;
  gradeLevel: string;
  studentCount: number;
  students: StudentData[];
  assignments: AssignmentData[];
  submissions: SubmissionData[];
  averageGrade: number;
  percentGraded: number;
  belowC: number;
}

interface TeacherGradesClientProps {
  courses: CourseData[];
}

export function TeacherGradesClient({ courses }: TeacherGradesClientProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 dark:text-green-400';
    if (grade >= 80) return 'text-blue-600 dark:text-blue-400';
    if (grade >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (grade >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getLetterGrade = (pct: number) => {
    if (pct >= 93) return 'A';
    if (pct >= 90) return 'A-';
    if (pct >= 87) return 'B+';
    if (pct >= 83) return 'B';
    if (pct >= 80) return 'B-';
    if (pct >= 77) return 'C+';
    if (pct >= 73) return 'C';
    if (pct >= 70) return 'C-';
    if (pct >= 60) return 'D';
    return 'F';
  };

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              Gradebook
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              No courses found. Create a course first.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedCourse) return null;

  // Calculate grade distribution for the selected course
  const gradeDistribution = (() => {
    const dist = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    selectedCourse.students.forEach((s) => {
      if (s.averageGrade !== null) {
        const letter = getLetterGrade(s.averageGrade);
        if (letter.startsWith('A')) dist.A++;
        else if (letter.startsWith('B')) dist.B++;
        else if (letter.startsWith('C')) dist.C++;
        else if (letter.startsWith('D')) dist.D++;
        else dist.F++;
      }
    });
    return dist;
  })();

  const totalStudentsWithGrades = Object.values(gradeDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            Gradebook
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            View and manage grades across your classes
          </p>
        </div>

        {/* Course Selector */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourseId(course.id)}
              className={cn(
                'flex-shrink-0 p-4 rounded-xl border-2 transition-all duration-200 text-left min-w-[220px]',
                selectedCourseId === course.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 hover:border-indigo-300'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                  {course.name}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>{course.studentCount} students</span>
                <span className={getGradeColor(course.averageGrade)}>
                  Avg: {course.averageGrade}%
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Course Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Class Average</p>
                  <p className={cn('text-3xl font-bold', getGradeColor(selectedCourse.averageGrade))}>
                    {selectedCourse.averageGrade}%
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    {getLetterGrade(selectedCourse.averageGrade)} grade
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Students</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {selectedCourse.studentCount}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    Active enrollment
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Graded</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {selectedCourse.percentGraded}%
                  </p>
                  <Progress value={selectedCourse.percentGraded} className="h-1.5 mt-2" />
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
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Below C</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {selectedCourse.belowC}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    Students at risk
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Grade Distribution - {selectedCourse.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 h-40">
              {Object.entries(gradeDistribution).map(([letter, count]) => {
                const maxCount = Math.max(...Object.values(gradeDistribution), 1);
                const height = (count / maxCount) * 100;
                const colors: Record<string, string> = {
                  A: 'bg-green-500',
                  B: 'bg-blue-500',
                  C: 'bg-yellow-500',
                  D: 'bg-orange-500',
                  F: 'bg-red-500',
                };
                return (
                  <div key={letter} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {count}
                    </span>
                    <div className="w-full flex items-end" style={{ height: '120px' }}>
                      <div
                        className={cn('w-full rounded-t-lg transition-all', colors[letter])}
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {letter}
                    </span>
                    <span className="text-xs text-slate-400">
                      {totalStudentsWithGrades > 0
                        ? Math.round((count / totalStudentsWithGrades) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Student Performance List */}
        <Card>
          <CardHeader>
            <CardTitle>Student Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedCourse.students
              .filter((s) => s.enrollmentStatus === 'active')
              .sort((a, b) => (b.averageGrade ?? 0) - (a.averageGrade ?? 0))
              .map((student, idx) => (
                <div
                  key={student.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg transition-colors',
                    idx % 2 === 0
                      ? 'bg-slate-50/50 dark:bg-slate-800/20'
                      : 'bg-white dark:bg-slate-900/20'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                      {student.firstName[0]}
                      {student.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-white">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Grade {student.gradeLevel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 hidden md:block">
                      <Progress value={student.averageGrade ?? 0} className="h-2" />
                    </div>
                    <span
                      className={cn(
                        'text-sm font-bold w-12 text-right',
                        getGradeColor(student.averageGrade ?? 0)
                      )}
                    >
                      {student.averageGrade !== null ? `${student.averageGrade}%` : '--'}
                    </span>
                    <Badge
                      className={cn(
                        'text-xs w-8 text-center justify-center',
                        student.averageGrade !== null
                          ? student.averageGrade >= 70
                            ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                            : 'bg-red-500/20 text-red-700 dark:text-red-300'
                          : 'bg-slate-500/20 text-slate-500'
                      )}
                    >
                      {student.averageGrade !== null ? getLetterGrade(student.averageGrade) : '--'}
                    </Badge>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
