'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Users, BookOpen, ArrowRight, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseCard {
  id: string;
  name: string;
  subject: string;
  section: string;
  studentCount: number;
  term: string;
  icon: string;
  enrollmentCapacity: number;
}

const mockCourses: CourseCard[] = [
  {
    id: '1',
    name: 'Mathematics 9',
    subject: 'Math',
    section: 'Period 1, 3',
    studentCount: 53,
    enrollmentCapacity: 60,
    term: 'Spring 2024',
    icon: '🔢',
  },
  {
    id: '2',
    name: 'Honors Algebra 2',
    subject: 'Math',
    section: 'Period 5',
    studentCount: 20,
    enrollmentCapacity: 25,
    term: 'Spring 2024',
    icon: '🔢',
  },
  {
    id: '3',
    name: 'AP Calculus',
    subject: 'Math',
    section: 'Period 6',
    studentCount: 18,
    enrollmentCapacity: 20,
    term: 'Spring 2024',
    icon: '🔢',
  },
  {
    id: '4',
    name: 'Statistics',
    subject: 'Math',
    section: 'Period 7',
    studentCount: 25,
    enrollmentCapacity: 30,
    term: 'Spring 2024',
    icon: '📊',
  },
];

export default function TeacherCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = mockCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEnrollmentColor = (current: number, capacity: number) => {
    const percent = (current / capacity) * 100;
    if (percent >= 90) return 'bg-red-500/20 text-red-700 dark:text-red-200';
    if (percent >= 75) return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-200';
    return 'bg-green-500/20 text-green-700 dark:text-green-200';
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
              Manage {mockCourses.length} classes across different sections
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create New Class
          </Button>
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
          {filteredCourses.map((course) => {
            const enrollmentPercent = (course.studentCount / course.enrollmentCapacity) * 100;

            return (
              <Card
                key={course.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 h-20 flex items-center justify-center rounded-t-2xl group-hover:scale-105 transition-transform">
                    <span className="text-4xl">{course.icon}</span>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Course Header */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        {course.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {course.subject} • {course.section}
                      </p>
                    </div>

                    {/* Term Badge */}
                    <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-200 w-fit">
                      {course.term}
                    </Badge>

                    {/* Enrollment */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            Enrollment
                          </span>
                        </div>
                        <Badge className={cn('text-xs', getEnrollmentColor(course.studentCount, course.enrollmentCapacity))}>
                          {course.studentCount}/{course.enrollmentCapacity}
                        </Badge>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={cn(
                            'h-full transition-all',
                            enrollmentPercent >= 90
                              ? 'bg-red-500'
                              : enrollmentPercent >= 75
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          )}
                          style={{ width: `${Math.min(100, enrollmentPercent)}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <div className="text-center">
                        <p className="text-xs text-slate-600 dark:text-slate-400">Avg Grade</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">84%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-600 dark:text-slate-400">Attendance</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">95%</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                      Manage Class <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
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
                No classes found matching "{searchQuery}"
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
