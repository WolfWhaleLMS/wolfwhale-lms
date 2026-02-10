'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { AssignmentCard } from '@/components/assignments/AssignmentCard';
import { AssignmentRow } from '@/components/assignments/AssignmentRow';
import { useGradeLevel } from '@/hooks/useGradeLevel';
import { mockAssignments } from '@/lib/mock-data';
import type { AssignmentStatus, MockAssignment } from '@/lib/mock-data';

/* ── Filter Tabs ───────────────────────────────────────── */

type FilterTab = 'all' | 'not_started' | 'due_soon' | 'submitted' | 'graded';

const FILTER_TABS: { value: FilterTab; label: string; k5Label: string }[] = [
  { value: 'all', label: 'All', k5Label: 'All' },
  { value: 'not_started', label: 'Not Started', k5Label: 'Not Started' },
  { value: 'due_soon', label: 'Due Soon', k5Label: 'Due Soon' },
  { value: 'submitted', label: 'Submitted', k5Label: 'Turned In' },
  { value: 'graded', label: 'Graded', k5Label: 'Graded' },
];

/* ── Sort Options (6-12 only) ──────────────────────────── */

type SortField = 'due_date' | 'class' | 'status' | 'grade';
type SortOrder = 'asc' | 'desc';

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'due_date', label: 'Due Date' },
  { value: 'class', label: 'Class' },
  { value: 'status', label: 'Status' },
  { value: 'grade', label: 'Grade' },
];

const STATUS_PRIORITY: Record<AssignmentStatus, number> = {
  overdue: 0,
  due_soon: 1,
  in_progress: 2,
  not_started: 3,
  submitted: 4,
  graded: 5,
};

const ITEMS_PER_PAGE = 25;

/* ── Helpers ───────────────────────────────────────────── */

function matchesFilter(assignment: MockAssignment, filter: FilterTab): boolean {
  if (filter === 'all') return true;
  if (filter === 'not_started') {
    return assignment.status === 'not_started' || assignment.status === 'in_progress';
  }
  if (filter === 'due_soon') {
    return assignment.status === 'due_soon' || assignment.status === 'overdue';
  }
  return assignment.status === filter;
}

function sortAssignments(
  assignments: MockAssignment[],
  field: SortField,
  order: SortOrder
): MockAssignment[] {
  const sorted = [...assignments].sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case 'due_date':
        cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'class':
        cmp = a.courseName.localeCompare(b.courseName);
        break;
      case 'status':
        cmp = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
        break;
      case 'grade': {
        const aGrade = a.grade?.percentage ?? -1;
        const bGrade = b.grade?.percentage ?? -1;
        cmp = aGrade - bGrade;
        break;
      }
    }
    return order === 'asc' ? cmp : -cmp;
  });
  return sorted;
}

/* ── Page Component ────────────────────────────────────── */

export default function AssignmentsPage() {
  const { variant, loading, isElementary, gradeLabel } = useGradeLevel();
  const isK5 = variant === 'k5';

  // State
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('due_date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filtered + sorted assignments
  const filteredAssignments = useMemo(() => {
    let result = mockAssignments.filter((a) => matchesFilter(a, activeFilter));

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.courseName.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q)
      );
    }

    // Sort
    return sortAssignments(result, sortField, sortOrder);
  }, [activeFilter, searchQuery, sortField, sortOrder]);

  // Pagination (6-12 only)
  const totalPages = Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE);
  const paginatedAssignments = isK5
    ? filteredAssignments
    : filteredAssignments.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Filter counts
  const filterCounts = useMemo(() => {
    return FILTER_TABS.reduce(
      (acc, tab) => {
        acc[tab.value] = mockAssignments.filter((a) => matchesFilter(a, tab.value)).length;
        return acc;
      },
      {} as Record<FilterTab, number>
    );
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        >
          <div>
            <h1
              className={cn(
                'font-bold text-slate-900 dark:text-white mb-1',
                isK5 ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'
              )}
            >
              {isK5 ? 'My Assignments' : 'Assignments'}
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400">
              {isK5
                ? `You have ${filterCounts.all} assignments. Let's do this!`
                : `${filterCounts.all} assignments across all classes`}
            </p>
          </div>

          {/* Search (both views) */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder={isK5 ? 'Search...' : 'Search assignments...'}
              className={cn(
                'w-full pl-9 pr-4 py-2.5 rounded-xl text-sm',
                'glass backdrop-blur-md bg-white/60 dark:bg-slate-800/40',
                'border border-white/40 dark:border-slate-700/40',
                'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                'transition-all duration-200'
              )}
            />
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveFilter(tab.value);
                setPage(1);
              }}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                activeFilter === tab.value
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
                  : 'glass bg-white/50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800/50 border border-white/40 dark:border-slate-700/40'
              )}
            >
              {isK5 ? tab.k5Label : tab.label}
              <span
                className={cn(
                  'ml-1.5 text-xs',
                  activeFilter === tab.value
                    ? 'text-indigo-200'
                    : 'text-slate-400 dark:text-slate-500'
                )}
              >
                ({filterCounts[tab.value]})
              </span>
            </button>
          ))}
        </motion.div>

        {/* Sort controls (6-12 only) */}
        {!isK5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Sort
            </button>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      if (sortField === opt.value) {
                        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                      } else {
                        setSortField(opt.value);
                        setSortOrder('asc');
                      }
                    }}
                    className={cn(
                      'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                      sortField === opt.value
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                  >
                    {opt.label}
                    {sortField === opt.value && (
                      <ArrowUpDown className="h-3 w-3" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Assignment list */}
        {paginatedAssignments.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="h-8 w-8 text-slate-400" />}
            title={isK5 ? 'No assignments here!' : 'No assignments found'}
            description={
              searchQuery
                ? 'Try a different search term.'
                : isK5
                ? 'Check back later for new work!'
                : 'No assignments match the current filters.'
            }
          />
        ) : isK5 ? (
          /* ── K-5 Card View ─────────────────────────────── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedAssignments.map((assignment, idx) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                index={idx}
              />
            ))}
          </div>
        ) : (
          /* ── 6-12 Table View ───────────────────────────── */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl overflow-hidden glass backdrop-blur-xl bg-white/70 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30"
          >
            {/* Table header */}
            <div className="flex items-center gap-4 py-3 px-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-900/30">
              <div className="flex-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Assignment
              </div>
              <div className="w-32 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:block">
                Class
              </div>
              <div className="w-28 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right hidden sm:block">
                Due Date
              </div>
              <div className="w-24 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right hidden lg:block">
                Days Left
              </div>
              <div className="w-28 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                Status
              </div>
              <div className="w-28 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                Points
              </div>
            </div>

            {/* Table body */}
            <table className="w-full">
              <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
                {paginatedAssignments.map((assignment, idx) => (
                  <AssignmentRow
                    key={assignment.id}
                    assignment={assignment}
                    index={idx}
                  />
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200/50 dark:border-slate-700/50">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1}-
                  {Math.min(page * ITEMS_PER_PAGE, filteredAssignments.length)} of{' '}
                  {filteredAssignments.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
