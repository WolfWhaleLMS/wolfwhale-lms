'use client'

import Link from 'next/link'
import {
  GraduationCap,
  Calendar,
  ClipboardList,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Zap,
  Clock,
} from 'lucide-react'
import { useState } from 'react'

// SVG Circular Gauge Component
function CircularGauge({
  value,
  label,
  centerText,
  centerSubtext,
  color = 'text-blue-500',
  size = 160,
}: {
  value: number // 0-100 percentage
  label: string
  centerText: string
  centerSubtext?: string
  color?: string
  size?: number
}) {
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (value / 100) * circumference

  // Map text-color to actual hex for stroke
  const colorMap: Record<string, string> = {
    'text-green-500': '#10b981',
    'text-blue-500': '#3b82f6',
    'text-amber-500': '#f59e0b',
    'text-red-500': '#ef4444',
    'text-purple-500': '#a855f7',
  }

  const strokeColor = colorMap[color] || '#3b82f6'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-3xl font-bold ${color}`}>{centerText}</div>
          {centerSubtext && (
            <div className="text-sm text-muted-foreground">{centerSubtext}</div>
          )}
        </div>
      </div>
      <div className="text-center">
        <div className="text-lg font-semibold text-foreground">{label}</div>
      </div>
    </div>
  )
}

// Large Action Button Component
function ActionButton({
  icon,
  label,
  description,
  href,
  color = 'text-blue-500',
}: {
  icon: React.ReactNode
  label: string
  description: string
  href: string
  color?: string
}) {
  return (
    <Link href={href}>
      <div
        className="ocean-card rounded-2xl p-6 flex flex-col items-center gap-3 text-center transition-all hover:scale-105 hover:shadow-lg min-h-[120px] justify-center cursor-pointer"
        style={{ minHeight: '120px' }}
      >
        <div className={`${color}`}>{icon}</div>
        <div>
          <div className="text-lg font-bold text-foreground">{label}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
      </div>
    </Link>
  )
}

export default function ParentDashboardPage() {
  // Mock data for demonstration
  // In production, this would come from server actions or API calls
  const [selectedChild] = useState({
    id: 'mock-1',
    name: 'Alex Johnson',
    grade: '7th',
    avatarUrl: null,
    overallGrade: 87,
    letterGrade: 'B+',
    attendance: 95,
    assignmentsCompleted: 12,
    assignmentsTotal: 15,
    xpLevel: 12,
    xpCurrent: 850,
    xpNext: 1000,
  })

  const upcomingAssignments = [
    {
      id: '1',
      title: 'Math Chapter 5 Quiz',
      course: 'Algebra I',
      dueDate: '2026-02-10',
      status: 'due-today',
    },
    {
      id: '2',
      title: 'Science Lab Report',
      course: 'Biology',
      dueDate: '2026-02-11',
      status: 'upcoming',
    },
    {
      id: '3',
      title: 'History Essay',
      course: 'World History',
      dueDate: '2026-02-13',
      status: 'upcoming',
    },
    {
      id: '4',
      title: 'English Reading Response',
      course: 'English 7',
      dueDate: '2026-02-15',
      status: 'upcoming',
    },
    {
      id: '5',
      title: 'Spanish Vocabulary Test',
      course: 'Spanish I',
      dueDate: '2026-02-17',
      status: 'upcoming',
    },
  ]

  const recentGrades = [
    {
      id: '1',
      assignment: 'Math Quiz - Chapter 4',
      course: 'Algebra I',
      grade: 92,
      letter: 'A-',
      date: '2026-02-08',
    },
    {
      id: '2',
      assignment: 'Science Project',
      course: 'Biology',
      grade: 88,
      letter: 'B+',
      date: '2026-02-07',
    },
    {
      id: '3',
      assignment: 'History Presentation',
      course: 'World History',
      grade: 85,
      letter: 'B',
      date: '2026-02-06',
    },
    {
      id: '4',
      assignment: 'English Essay',
      course: 'English 7',
      grade: 90,
      letter: 'A-',
      date: '2026-02-05',
    },
    {
      id: '5',
      assignment: 'Spanish Oral Exam',
      course: 'Spanish I',
      grade: 78,
      letter: 'C+',
      date: '2026-02-04',
    },
  ]

  // Calculate values for gauges
  const attendanceValue = selectedChild.attendance
  const assignmentCompletionValue = Math.round(
    (selectedChild.assignmentsCompleted / selectedChild.assignmentsTotal) * 100
  )
  const xpProgressValue = Math.round(
    (selectedChild.xpCurrent / selectedChild.xpNext) * 100
  )

  // Helper to get grade color
  const getGradeColor = (grade: number): string => {
    if (grade >= 90) return 'text-green-500'
    if (grade >= 80) return 'text-blue-500'
    if (grade >= 70) return 'text-amber-500'
    return 'text-red-500'
  }

  // Helper to get letter grade color classes
  const getGradeColorClass = (letter: string): string => {
    if (letter.startsWith('A')) return 'text-green-600 dark:text-green-400'
    if (letter.startsWith('B')) return 'text-blue-600 dark:text-blue-400'
    if (letter.startsWith('C')) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  // Helper to get assignment status
  const getAssignmentStatus = (dueDate: string, status: string) => {
    const today = new Date().toISOString().split('T')[0]
    if (dueDate < today) {
      return { label: 'Overdue', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
    }
    if (dueDate === today || status === 'due-today') {
      return { label: 'Due Today', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' }
    }
    return { label: 'Upcoming', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }
  }

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
          Parent Dashboard
        </h1>
        <p className="text-xl text-muted-foreground">
          Quick view of your child&apos;s progress
        </p>
      </div>

      {/* Child Selector Card */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
            {selectedChild.avatarUrl ? (
              <img
                src={selectedChild.avatarUrl}
                alt={selectedChild.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              selectedChild.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">
              {selectedChild.name}
            </h2>
            <p className="text-lg text-muted-foreground">
              Grade {selectedChild.grade}
            </p>
          </div>
          {/* Placeholder for future dropdown to switch children */}
          <div className="text-sm text-muted-foreground italic">
            (Multiple children selector coming soon)
          </div>
        </div>
      </div>

      {/* Visual Gauges - 2x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="ocean-card rounded-2xl p-6 flex items-center justify-center">
          <CircularGauge
            value={selectedChild.overallGrade}
            label="Overall Grade"
            centerText={selectedChild.letterGrade}
            centerSubtext={`${selectedChild.overallGrade}%`}
            color={getGradeColor(selectedChild.overallGrade)}
            size={180}
          />
        </div>

        <div className="ocean-card rounded-2xl p-6 flex items-center justify-center">
          <CircularGauge
            value={attendanceValue}
            label="Attendance Rate"
            centerText={`${attendanceValue}%`}
            color={
              attendanceValue >= 95
                ? 'text-green-500'
                : attendanceValue >= 85
                  ? 'text-amber-500'
                  : 'text-red-500'
            }
            size={180}
          />
        </div>

        <div className="ocean-card rounded-2xl p-6 flex items-center justify-center">
          <CircularGauge
            value={assignmentCompletionValue}
            label="Assignments Completed"
            centerText={`${selectedChild.assignmentsCompleted}/${selectedChild.assignmentsTotal}`}
            centerSubtext={`${assignmentCompletionValue}%`}
            color={
              assignmentCompletionValue >= 80
                ? 'text-green-500'
                : assignmentCompletionValue >= 60
                  ? 'text-amber-500'
                  : 'text-red-500'
            }
            size={180}
          />
        </div>

        <div className="ocean-card rounded-2xl p-6 flex items-center justify-center">
          <CircularGauge
            value={xpProgressValue}
            label="XP Progress"
            centerText={`Level ${selectedChild.xpLevel}`}
            centerSubtext={`${selectedChild.xpCurrent}/${selectedChild.xpNext}`}
            color="text-purple-500"
            size={180}
          />
        </div>
      </div>

      {/* Large Action Buttons - 2x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActionButton
          icon={<GraduationCap size={48} />}
          label="View Grades"
          description="See all course grades"
          href={`/parent/children/${selectedChild.id}/grades`}
          color="text-blue-500"
        />
        <ActionButton
          icon={<ClipboardList size={48} />}
          label="Assignments"
          description="Track homework"
          href={`/parent/children/${selectedChild.id}/assignments`}
          color="text-green-500"
        />
        <ActionButton
          icon={<Calendar size={48} />}
          label="Attendance"
          description="View attendance record"
          href={`/parent/children/${selectedChild.id}/attendance`}
          color="text-amber-500"
        />
        <ActionButton
          icon={<MessageSquare size={48} />}
          label="Message Teacher"
          description="Contact teachers"
          href="/messaging"
          color="text-purple-500"
        />
      </div>

      {/* Upcoming Assignments */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-foreground">
            Upcoming Assignments
          </h2>
        </div>
        <div className="space-y-3">
          {upcomingAssignments.map((assignment) => {
            const statusInfo = getAssignmentStatus(assignment.dueDate, assignment.status)
            return (
              <div
                key={assignment.id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-foreground truncate">
                    {assignment.title}
                  </p>
                  <p className="text-base text-muted-foreground">
                    {assignment.course}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock size={16} />
                      <span className="text-base font-medium">
                        {formatDate(assignment.dueDate)}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Grades */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-6 w-6 text-green-500" />
          <h2 className="text-2xl font-bold text-foreground">Recent Grades</h2>
        </div>
        <div className="space-y-3">
          {recentGrades.map((gradeItem) => (
            <div
              key={gradeItem.id}
              className="flex items-center justify-between gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-foreground truncate">
                  {gradeItem.assignment}
                </p>
                <p className="text-base text-muted-foreground">
                  {gradeItem.course}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getGradeColorClass(gradeItem.letter)}`}>
                    {gradeItem.letter}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {gradeItem.grade}%
                  </div>
                </div>
                <div className="text-sm text-muted-foreground text-right min-w-[60px]">
                  {formatDate(gradeItem.date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note about mock data */}
      <div className="ocean-card rounded-2xl p-4 border-l-4 border-l-blue-500">
        <p className="text-sm text-muted-foreground italic">
          <strong>Note:</strong> This dashboard currently displays sample data for demonstration purposes.
          Real student data will be loaded once children are linked to your parent account.
        </p>
      </div>
    </div>
  )
}
