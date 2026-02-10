'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { BookOpen, Calendar, User, TrendingUp, ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface CourseData {
  id: string;
  name: string;
  description: string;
  subject: string;
  gradeLevel: string;
  semester: string;
  startDate: string;
  endDate: string;
  teacherName: string;
  teacherAvatar: string | null;
  enrollmentStatus: string;
  gradeLetter: string | null;
  gradeNumeric: number | null;
  completionPercentage: number;
  averageGrade: number | null;
  totalAssignments: number;
  gradedAssignments: number;
  nextAssignmentTitle: string | null;
  nextAssignmentDue: string | null;
}

const SUBJECT_ICONS: Record<string, string> = {
  mathematics: '\uD83D\uDD22',
  math: '\uD83D\uDD22',
  english: '\uD83D\uDCDA',
  'english language arts': '\uD83D\uDCDA',
  science: '\uD83D\uDD2C',
  biology: '\uD83D\uDD2C',
  chemistry: '\u2697\uFE0F',
  physics: '\u269B\uFE0F',
  history: '\uD83C\uDFDB\uFE0F',
  'social studies': '\uD83C\uDF0D',
  language: '\uD83D\uDDE3\uFE0F',
  art: '\uD83C\uDFA8',
  music: '\uD83C\uDFB5',
  'physical education': '\u26BD',
};

function getSubjectIcon(subject: string): string {
  const lower = subject.toLowerCase();
  for (const [key, icon] of Object.entries(SUBJECT_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return '\uD83D\uDCD6';
}

const getGradeColor = (grade: number) => {
  if (grade >= 90) return 'bg-green-500/20 text-green-700 dark:text-green-200';
  if (grade >= 80) return 'bg-blue-500/20 text-blue-700 dark:text-blue-200';
  if (grade >= 70) return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-200';
  return 'bg-red-500/20 text-red-700 dark:text-red-200';
};

function formatNextDue(title: string | null, date: string | null): string {
  if (!title || !date) return 'No upcoming assignments';
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  let dateLabel: string;
  if (diffDays <= 0) dateLabel = 'Today';
  else if (diffDays === 1) dateLabel = 'Tomorrow';
  else dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${title} - ${dateLabel}`;
}

interface StudentCoursesClientProps {
  courses: CourseData[];
}

export function StudentCoursesClient({ courses }: StudentCoursesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            My Classes
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            You are enrolled in {courses.length} classes
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search classes or teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const displayGrade = course.averageGrade ?? course.gradeNumeric ?? 0;
            return (
              <Card
                key={course.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 h-24 flex items-center justify-center rounded-t-2xl group-hover:scale-105 transition-transform">
                    <span className="text-5xl">{getSubjectIcon(course.subject)}</span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        {course.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <User className="w-4 h-4" />
                        {course.teacherName}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={cn('text-sm', getGradeColor(displayGrade))}>
                        Grade: {displayGrade > 0 ? `${Math.round(displayGrade)}%` : 'N/A'}
                      </Badge>
                      {displayGrade > 0 && <TrendingUp className="w-4 h-4 text-green-600" />}
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Course Progress</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {Math.round(course.completionPercentage)}%
                        </span>
                      </div>
                      <Progress value={course.completionPercentage} className="h-2" />
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {formatNextDue(course.nextAssignmentTitle, course.nextAssignmentDue)}
                      </p>
                      <Link href={`/student/courses/${course.id}`}>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                          View Class <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                {searchQuery
                  ? `No classes found matching "${searchQuery}"`
                  : 'You are not enrolled in any classes yet.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
