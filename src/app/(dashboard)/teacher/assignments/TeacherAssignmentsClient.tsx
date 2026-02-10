'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  Plus,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Filter,
  ArrowRight,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssignmentData {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  instructions: string;
  type: 'homework' | 'quiz' | 'project' | 'exam' | 'discussion';
  dueDate: string;
  maxPoints: number;
  submissionType: 'text' | 'file' | 'link' | 'discussion';
  allowLateSubmission: boolean;
  lateSubmissionDays: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  totalSubmissions: number;
  gradedSubmissions: number;
}

type FilterStatus = 'all' | 'published' | 'draft' | 'needs_grading';

interface TeacherAssignmentsClientProps {
  assignments: AssignmentData[];
}

export function TeacherAssignmentsClient({ assignments }: TeacherAssignmentsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const getUngradedCount = (assignment: AssignmentData) => {
    return assignment.totalSubmissions - assignment.gradedSubmissions;
  };

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.courseName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (filterStatus) {
      case 'published':
        return a.status === 'published';
      case 'draft':
        return a.status === 'draft';
      case 'needs_grading':
        return a.status === 'published' && getUngradedCount(a) > 0;
      default:
        return true;
    }
  });

  const totalAssignments = assignments.length;
  const publishedCount = assignments.filter((a) => a.status === 'published').length;
  const draftCount = assignments.filter((a) => a.status === 'draft').length;
  const needsGradingCount = assignments.filter(
    (a) => a.status === 'published' && getUngradedCount(a) > 0
  ).length;
  const totalUngraded = assignments.reduce(
    (sum, a) => sum + (a.status === 'published' ? getUngradedCount(a) : 0),
    0
  );

  const getTypeColor = (type: AssignmentData['type']) => {
    switch (type) {
      case 'homework':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'quiz':
        return 'bg-purple-500/20 text-purple-700 dark:text-purple-300';
      case 'project':
        return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'exam':
        return 'bg-red-500/20 text-red-700 dark:text-red-300';
      case 'discussion':
        return 'bg-orange-500/20 text-orange-700 dark:text-orange-300';
      default:
        return 'bg-slate-500/20 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusBadge = (assignment: AssignmentData) => {
    if (assignment.status === 'draft') {
      return (
        <Badge className="bg-slate-500/20 text-slate-700 dark:text-slate-300 text-xs">
          Draft
        </Badge>
      );
    }
    const ungraded = getUngradedCount(assignment);
    if (ungraded > 0) {
      return (
        <Badge className="bg-orange-500/20 text-orange-700 dark:text-orange-300 text-xs">
          {ungraded} to grade
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 text-xs">
        All graded
      </Badge>
    );
  };

  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffMs = due.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 3;
  };

  const isPastDue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              Assignments
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Manage assignments across all your classes
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Assignment
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalAssignments}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    Across all classes
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Published</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{publishedCount}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    Active assignments
                  </p>
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
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Needs Grading</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalUngraded}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    Submissions to grade
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Drafts</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{draftCount}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    Not yet published
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700/30">
                  <Clock className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search assignments by title or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(
              [
                { key: 'all', label: 'All' },
                { key: 'published', label: 'Published' },
                { key: 'needs_grading', label: 'Needs Grading' },
                { key: 'draft', label: 'Drafts' },
              ] as { key: FilterStatus; label: string }[]
            ).map((filter) => (
              <Button
                key={filter.key}
                variant={filterStatus === filter.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(filter.key)}
                className={cn(
                  filterStatus === filter.key &&
                    'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                )}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Assignment List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => {
            const ungraded = getUngradedCount(assignment);
            const dueSoon = isDueSoon(assignment.dueDate);
            const pastDue = isPastDue(assignment.dueDate);

            return (
              <Card
                key={assignment.id}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {assignment.title}
                        </h3>
                        <Badge className={cn('text-xs capitalize', getTypeColor(assignment.type))}>
                          {assignment.type}
                        </Badge>
                        {getStatusBadge(assignment)}
                        {dueSoon && assignment.status === 'published' && (
                          <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 text-xs">
                            Due soon
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {assignment.courseName}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span
                            className={cn(
                              pastDue && assignment.status === 'published' && 'text-red-500 dark:text-red-400'
                            )}
                          >
                            {pastDue ? 'Due: ' : 'Due: '}
                            {formatDueDate(assignment.dueDate)}
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          {assignment.maxPoints} pts
                        </span>
                        {assignment.status === 'published' && (
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {assignment.totalSubmissions} submitted
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {assignment.status === 'published' && (
                        <div className="text-right hidden md:block">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {assignment.gradedSubmissions}/{assignment.totalSubmissions}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">graded</p>
                        </div>
                      )}
                      <Button variant="outline" size="sm">
                        {assignment.status === 'draft' ? 'Edit' : ungraded > 0 ? 'Grade' : 'View'}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress bar for published assignments */}
                  {assignment.status === 'published' && assignment.totalSubmissions > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-500 dark:text-slate-400">Grading progress</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {Math.round((assignment.gradedSubmissions / assignment.totalSubmissions) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={cn(
                            'h-full transition-all rounded-full',
                            assignment.gradedSubmissions === assignment.totalSubmissions
                              ? 'bg-green-500'
                              : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                          )}
                          style={{
                            width: `${(assignment.gradedSubmissions / assignment.totalSubmissions) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {filteredAssignments.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
                  No assignments found
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  {searchQuery
                    ? `No assignments match "${searchQuery}"`
                    : 'Try changing your filter or create a new assignment'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
