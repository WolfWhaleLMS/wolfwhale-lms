'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  Search,
  Plus,
  BookOpen,
  Users,
  Clock,
  MoreVertical,
  Download,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

interface ClassItem {
  id: string;
  name: string;
  subject: string;
  gradeLevel: string;
  status: 'active' | 'archived' | 'draft';
  semester: string;
  teacherName: string;
  teacherId: string;
  studentCount: number;
  startDate: string | null;
  endDate: string | null;
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  archived: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

const PAGE_SIZE = 10;

export default function AdminClassesClient({ classes }: { classes: ClassItem[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);

  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const matchesSearch =
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.subject.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === 'all') return matchesSearch;
      return matchesSearch && cls.status === activeTab;
    });
  }, [classes, searchQuery, activeTab]);

  const totalPages = Math.ceil(filteredClasses.length / PAGE_SIZE);
  const paginatedClasses = filteredClasses.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const stats = useMemo(() => ({
    all: classes.length,
    active: classes.filter((c) => c.status === 'active').length,
    draft: classes.filter((c) => c.status === 'draft').length,
    archived: classes.filter((c) => c.status === 'archived').length,
  }), [classes]);

  const totalStudents = classes.reduce((sum, c) => sum + c.studentCount, 0);
  const avgClassSize = classes.length > 0 ? Math.round(totalStudents / classes.length) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-cyan-950 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              Class Management
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              View and manage all classes across your school
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Classes</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.all}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100/60 dark:bg-blue-900/30">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Classes</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.active}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-100/60 dark:bg-green-900/30">
                  <GraduationCap className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Enrolled</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalStudents}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-100/60 dark:bg-purple-900/30">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg Class Size</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{avgClassSize}</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-100/60 dark:bg-orange-900/30">
                  <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search by class name, teacher, or subject..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setPage(1); }}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({stats.all})</TabsTrigger>
            <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
            <TabsTrigger value="draft">Draft ({stats.draft})</TabsTrigger>
            <TabsTrigger value="archived">Archived ({stats.archived})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-4">
            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-white/30 dark:border-slate-700/30 glass backdrop-blur-lg bg-white/50 dark:bg-slate-800/30">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Class Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden md:table-cell">
                      Teacher
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                      Grade
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Students
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden md:table-cell">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                      Semester
                    </th>
                    <th className="w-12 px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {paginatedClasses.map((cls) => (
                    <tr
                      key={cls.id}
                      className="border-b border-white/10 dark:border-slate-700/20 hover:bg-white/20 dark:hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-indigo-100/60 dark:bg-indigo-900/30">
                            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-slate-900 dark:text-white">
                              {cls.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {cls.subject}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {cls.teacherName}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {cls.gradeLevel === 'K' ? 'Kindergarten' : cls.gradeLevel ? `Grade ${cls.gradeLevel}` : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {cls.studentCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge className={statusColors[cls.status]}>
                          {cls.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {cls.semester || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Class</DropdownMenuItem>
                            <DropdownMenuItem>Manage Students</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {cls.status === 'active' ? (
                              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                Archive Class
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-green-600 dark:text-green-400">
                                Restore Class
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {paginatedClasses.length === 0 && (
                <div className="p-12 text-center">
                  <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No classes found matching your search
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredClasses.length > PAGE_SIZE && (
              <div className="flex items-center justify-between px-2 py-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, filteredClasses.length)} of {filteredClasses.length} classes
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
