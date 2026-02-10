'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { BookOpen, Calendar, User, TrendingUp, ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface CourseCard {
  id: string;
  name: string;
  teacher: string;
  subject: string;
  icon: string;
  nextAssignmentDue: string;
  currentGrade: number;
  progressPercent: number;
}

const mockCourses: CourseCard[] = [
  {
    id: '1',
    name: 'Mathematics 9',
    teacher: 'Ms. Chen',
    subject: 'Mathematics',
    icon: '🔢',
    nextAssignmentDue: 'Problem Set - Tomorrow',
    currentGrade: 92,
    progressPercent: 75,
  },
  {
    id: '2',
    name: 'English Literature',
    teacher: 'Mr. Patterson',
    subject: 'English',
    icon: '📚',
    nextAssignmentDue: 'Essay - Mar 15',
    currentGrade: 87,
    progressPercent: 65,
  },
  {
    id: '3',
    name: 'Biology I',
    teacher: 'Dr. Martinez',
    subject: 'Science',
    icon: '🔬',
    nextAssignmentDue: 'Lab Report - Mar 10',
    currentGrade: 88,
    progressPercent: 70,
  },
  {
    id: '4',
    name: 'Chemistry I',
    teacher: 'Dr. Williams',
    subject: 'Science',
    icon: '⚗️',
    nextAssignmentDue: 'Quiz - This Week',
    currentGrade: 85,
    progressPercent: 68,
  },
  {
    id: '5',
    name: 'U.S. History',
    teacher: 'Mr. Thompson',
    subject: 'History',
    icon: '🏛️',
    nextAssignmentDue: 'Project - Mar 22',
    currentGrade: 91,
    progressPercent: 72,
  },
  {
    id: '6',
    name: 'World Languages - Spanish',
    teacher: 'Ms. Garcia',
    subject: 'Language',
    icon: '🗣️',
    nextAssignmentDue: 'Speaking Test - Mar 20',
    currentGrade: 89,
    progressPercent: 71,
  },
];

const getGradeColor = (grade: number) => {
  if (grade >= 90) return 'bg-green-500/20 text-green-700 dark:text-green-200';
  if (grade >= 80) return 'bg-blue-500/20 text-blue-700 dark:text-blue-200';
  if (grade >= 70) return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-200';
  return 'bg-red-500/20 text-red-700 dark:text-red-200';
};

export default function StudentCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = mockCourses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.teacher.toLowerCase().includes(searchQuery.toLowerCase())
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
            You are enrolled in {mockCourses.length} classes
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
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 h-24 flex items-center justify-center rounded-t-2xl group-hover:scale-105 transition-transform">
                  <span className="text-5xl">{course.icon}</span>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {course.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <User className="w-4 h-4" />
                      {course.teacher}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={cn('text-sm', getGradeColor(course.currentGrade))}>
                      Grade: {course.currentGrade}%
                    </Badge>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Course Progress</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {course.progressPercent}%
                      </span>
                    </div>
                    <Progress value={course.progressPercent} className="h-2" />
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {course.nextAssignmentDue}
                    </p>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      View Class <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
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
                No classes found matching "{searchQuery}"
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
