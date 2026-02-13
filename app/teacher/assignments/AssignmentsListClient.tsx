'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ClipboardList,
  Calendar,
  Award,
  FileText,
  ChevronDown,
  Layers,
  List,
  BookOpen,
} from 'lucide-react'

interface Assignment {
  id: string
  title: string
  course_id: string
  type: string
  due_date: string | null
  max_points: number | null
  status: string
  created_at: string
  courseName: string
  submissionCount: number
  displayStatus: string
}

interface CourseInfo {
  id: string
  name: string
}

interface Props {
  assignments: Assignment[]
  courses: CourseInfo[]
}

function statusBadge(status: string) {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    case 'past_due':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    case 'due_soon':
      return 'bg-[#FFAA00]/10 text-[#D97706] dark:bg-[#FFAA00]/10 dark:text-[#D97706]'
    case 'published':
      return 'bg-[#33FF33]/10 text-[#059669] dark:bg-[#33FF33]/10 dark:text-[#059669]'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'draft':
      return 'Draft'
    case 'past_due':
      return 'Past Due'
    case 'due_soon':
      return 'Due Soon'
    case 'published':
      return 'Active'
    default:
      return status
  }
}

function typeBadge(type: string) {
  switch (type) {
    case 'homework':
      return 'bg-[#00BFFF]/10 text-[#00BFFF] dark:bg-[#00BFFF]/10 dark:text-[#00BFFF]'
    case 'quiz':
      return 'bg-[#00BFFF]/10 text-[#00BFFF] dark:bg-[#00BFFF]/10 dark:text-[#00BFFF]'
    case 'test':
    case 'exam':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    case 'project':
      return 'bg-[#00FFFF]/10 text-[#00FFFF] dark:bg-[#00FFFF]/10 dark:text-[#00FFFF]'
    case 'essay':
      return 'bg-[#00BFFF]/10 text-[#00BFFF] dark:bg-[#00BFFF]/10 dark:text-[#00BFFF]'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'No due date'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function AssignmentRow({ assignment }: { assignment: Assignment }) {
  return (
    <tr className="transition-colors hover:bg-muted/30">
      <td className="px-4 py-3">
        <Link
          href={`/teacher/courses/${assignment.course_id}/assignments/${assignment.id}/submissions`}
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          {assignment.title}
        </Link>
      </td>
      <td className="px-4 py-3">
        <Link
          href={`/teacher/courses/${assignment.course_id}`}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {assignment.courseName}
        </Link>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeBadge(assignment.type)}`}
        >
          {assignment.type || 'general'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span className="text-xs">{formatDate(assignment.due_date)}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-1">
          <Award className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium text-foreground">
            {assignment.max_points ?? 0}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-1">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium text-foreground">
            {assignment.submissionCount}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge(assignment.displayStatus)}`}
        >
          {statusLabel(assignment.displayStatus)}
        </span>
      </td>
    </tr>
  )
}

function TableHeader() {
  return (
    <thead>
      <tr className="border-b border-border bg-muted/50">
        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
          Assignment
        </th>
        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
          Course
        </th>
        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
          Type
        </th>
        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
          Due Date
        </th>
        <th className="px-4 py-3 text-center font-medium text-muted-foreground">
          Points
        </th>
        <th className="px-4 py-3 text-center font-medium text-muted-foreground">
          Submissions
        </th>
        <th className="px-4 py-3 text-right font-medium text-muted-foreground">
          Status
        </th>
      </tr>
    </thead>
  )
}

export default function AssignmentsListClient({ assignments, courses }: Props) {
  const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped')
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  )

  // Group assignments by course
  const grouped = assignments.reduce<
    Record<string, { name: string; courseId: string; assignments: Assignment[] }>
  >((acc, assignment) => {
    const courseId = assignment.course_id || 'uncategorized'
    if (!acc[courseId]) {
      acc[courseId] = {
        name: assignment.courseName || 'Uncategorized',
        courseId,
        assignments: [],
      }
    }
    acc[courseId].assignments.push(assignment)
    return acc
  }, {})

  // Sort course groups alphabetically by name
  const sortedGroups = Object.entries(grouped).sort(([, a], [, b]) =>
    a.name.localeCompare(b.name)
  )

  function toggleSection(courseId: string) {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(courseId)) {
        next.delete(courseId)
      } else {
        next.add(courseId)
      }
      return next
    })
  }

  function expandAll() {
    setCollapsedSections(new Set())
  }

  function collapseAll() {
    setCollapsedSections(new Set(sortedGroups.map(([id]) => id)))
  }

  // Empty state
  if (assignments.length === 0) {
    return (
      <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-20 text-center">
        <ClipboardList className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h3 className="text-lg font-semibold text-foreground">
          No assignments yet
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Create assignments from within your courses. They will appear here for
          a cross-course overview.
        </p>
        <Link
          href="/teacher/courses"
          className="whale-gradient mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
        >
          Go to Courses
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* View Toggle Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="ocean-card inline-flex items-center rounded-xl p-1">
            <button
              onClick={() => setViewMode('grouped')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                viewMode === 'grouped'
                  ? 'bg-[#00BFFF]/15 text-[#00BFFF] shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              By Course
            </button>
            <button
              onClick={() => setViewMode('flat')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                viewMode === 'flat'
                  ? 'bg-[#00BFFF]/15 text-[#00BFFF] shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              View All
            </button>
          </div>
        </div>

        {viewMode === 'grouped' && sortedGroups.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Expand All
            </button>
            <span className="text-muted-foreground/40">|</span>
            <button
              onClick={collapseAll}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Collapse All
            </button>
          </div>
        )}
      </div>

      {/* Flat View */}
      {viewMode === 'flat' && (
        <div className="ocean-card overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <TableHeader />
              <tbody className="divide-y divide-border">
                {assignments.map((assignment) => (
                  <AssignmentRow key={assignment.id} assignment={assignment} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border bg-muted/30 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              {assignments.length} assignment
              {assignments.length !== 1 ? 's' : ''} across {courses.length}{' '}
              course{courses.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Grouped View */}
      {viewMode === 'grouped' && (
        <div className="space-y-4">
          {sortedGroups.map(([courseId, group]) => {
            const isCollapsed = collapsedSections.has(courseId)
            return (
              <div
                key={courseId}
                className="ocean-card overflow-hidden rounded-2xl"
              >
                {/* Course Section Header */}
                <button
                  onClick={() => toggleSection(courseId)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-[#00BFFF]" />
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-sm font-semibold text-foreground">
                        {group.name}
                      </h3>
                      <span className="inline-flex items-center justify-center rounded-full bg-[#00BFFF]/10 px-2 py-0.5 text-xs font-medium text-[#00BFFF]">
                        {group.assignments.length}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                      isCollapsed ? '-rotate-90' : 'rotate-0'
                    }`}
                  />
                </button>

                {/* Collapsible Assignment Table */}
                <div
                  className={`overflow-hidden transition-all duration-200 ease-in-out ${
                    isCollapsed ? 'max-h-0' : 'max-h-[5000px]'
                  }`}
                >
                  <div className="border-t border-border">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <TableHeader />
                        <tbody className="divide-y divide-border">
                          {group.assignments.map((assignment) => (
                            <AssignmentRow
                              key={assignment.id}
                              assignment={assignment}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Summary footer */}
          <div className="px-1 py-1">
            <p className="text-sm text-muted-foreground">
              {assignments.length} assignment
              {assignments.length !== 1 ? 's' : ''} across{' '}
              {sortedGroups.length} course
              {sortedGroups.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
