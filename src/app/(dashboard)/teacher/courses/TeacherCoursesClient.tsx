'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Users, BookOpen, ArrowRight, Plus, Search } from 'lucide-react';

interface CourseCard {
  id: string;
  name: string;
  subject: string;
  gradeLevel: string;
  studentCount: number;
  term: string;
  status: string;
  averageGrade: number;
  description: string;
}

interface TeacherCoursesClientProps {
  courses: CourseCard[];
}

export function TeacherCoursesClient({ courses }: TeacherCoursesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSubjectIcon = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes('math')) return '\u{1F522}';
    if (s.includes('science')) return '\u{1F52C}';
    if (s.includes('english') || s.includes('language')) return '\u{1F4DA}';
    if (s.includes('history') || s.includes('social')) return '\u{1F30D}';
    return '\u{1F4D6}';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              My Classes
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Manage {courses.length} classes across different sections
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search classes by name or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 h-20 flex items-center justify-center rounded-t-2xl group-hover:scale-105 transition-transform">
                  <span className="text-4xl">{getSubjectIcon(course.subject)}</span>
                </div>

                <div className="p-6 space-y-4">
                  {/* Course Header */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {course.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {course.subject} {course.gradeLevel ? `- Grade ${course.gradeLevel}` : ''}
                    </p>
                  </div>

                  {/* Term Badge */}
                  {course.term && (
                    <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-200 w-fit">
                      {course.term}
                    </Badge>
                  )}

                  {/* Enrollment */}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {course.studentCount} students enrolled
                    </span>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Avg Grade</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {course.averageGrade > 0 ? `${course.averageGrade}%` : '--'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Status</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                        {course.status}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" asChild>
                    <Link href={`/teacher/courses/${course.id}`}>
                      Manage Class <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                {searchQuery
                  ? `No classes found matching "${searchQuery}"`
                  : 'No classes found. You have not been assigned any courses yet.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
