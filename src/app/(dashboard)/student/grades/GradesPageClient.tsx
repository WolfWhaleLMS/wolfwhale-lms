'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { ChevronDown, TrendingUp, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseGrade {
  id: string;
  className: string;
  subject: string;
  teacher: string;
  currentGrade: number;
  assignmentsDone: number;
  assignmentsTotal: number;
  assignments: {
    id: string;
    name: string;
    type: string;
    score: number;
    total: number;
    percentage: number;
    letterGrade: string;
    date: string;
    feedback: string;
    weight: string;
  }[];
}

interface GradesData {
  courses: CourseGrade[];
  overallAverage: number;
}

const getGradeColor = (grade: number) => {
  if (grade >= 90) return 'bg-green-500/20 text-green-700 dark:text-green-200';
  if (grade >= 80) return 'bg-blue-500/20 text-blue-700 dark:text-blue-200';
  if (grade >= 70) return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-200';
  return 'bg-red-500/20 text-red-700 dark:text-red-200';
};

function getLetterGrade(grade: number): string {
  if (grade >= 90) return 'A';
  if (grade >= 80) return 'B';
  if (grade >= 70) return 'C';
  if (grade >= 60) return 'D';
  return 'F';
}

interface GradesPageClientProps {
  gradesData: GradesData;
}

export function GradesPageClient({ gradesData }: GradesPageClientProps) {
  const [expandedClasses, setExpandedClasses] = useState<string[]>([]);
  const { courses, overallAverage } = gradesData;

  const toggleClass = (classId: string) => {
    setExpandedClasses((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              My Grades
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Grade summary across all classes
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Overall Grade Summary */}
        <Card variant="fun">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Overall GPA</p>
                <p className="text-5xl font-bold text-slate-900 dark:text-white">
                  {overallAverage > 0 ? `${overallAverage}%` : 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Cumulative</p>
                <Badge className={cn('text-lg px-4 py-2', getGradeColor(overallAverage))}>
                  {overallAverage > 0 ? getLetterGrade(overallAverage) : 'N/A'}
                </Badge>
              </div>
            </div>
            {overallAverage > 0 && <Progress value={overallAverage} className="h-3 mt-4" />}
          </CardContent>
        </Card>

        {/* Grade Breakdown by Class */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Classes</h2>
          {courses.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  No grade data available yet. Grades will appear here once your assignments are graded.
                </p>
              </CardContent>
            </Card>
          ) : (
            courses.map((classGrade) => (
              <Card
                key={classGrade.id}
                className="hover:shadow-lg transition-all duration-300"
              >
                <button
                  onClick={() => toggleClass(classGrade.id)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {classGrade.className}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {classGrade.teacher} - {classGrade.assignmentsDone}/
                      {classGrade.assignmentsTotal} assignments graded
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 max-w-xs">
                        <Progress value={classGrade.currentGrade} className="h-2" />
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {classGrade.assignmentsTotal > 0
                          ? `${Math.round((classGrade.assignmentsDone / classGrade.assignmentsTotal) * 100)}% complete`
                          : '0% complete'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-6">
                    <div className="text-right">
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        {classGrade.currentGrade > 0 ? `${classGrade.currentGrade}%` : 'N/A'}
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-slate-600 transition-transform',
                        expandedClasses.includes(classGrade.id) && 'rotate-180'
                      )}
                    />
                  </div>
                </button>

                {expandedClasses.includes(classGrade.id) && (
                  <CardContent className="border-t border-slate-200 dark:border-slate-700 p-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                        All Assignments
                      </h4>
                      {classGrade.assignments.length === 0 ? (
                        <p className="text-sm text-slate-500">No graded assignments yet.</p>
                      ) : (
                        classGrade.assignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-slate-900 dark:text-white">
                                {assignment.name}
                              </p>
                              <div className="flex gap-3 text-xs text-slate-600 dark:text-slate-400">
                                <span>{assignment.weight}</span>
                                <span>{assignment.date}</span>
                              </div>
                              {assignment.feedback && (
                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                  {assignment.feedback}
                                </p>
                              )}
                            </div>
                            <Badge className={cn('text-sm', getGradeColor(assignment.percentage))}>
                              {assignment.score}/{assignment.total}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
