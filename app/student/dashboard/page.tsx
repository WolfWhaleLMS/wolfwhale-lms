'use client'

import { useState } from 'react'

function DashboardCard({
  title,
  icon,
  children,
  className = '',
}: {
  title: string
  icon: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`ocean-card rounded-2xl p-6 ${className}`}>
      <div className="mb-4 flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here is what is happening in your learning journey today.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="ocean-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="mt-1 text-sm text-muted-foreground">Tasks Due Today</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="mt-1 text-sm text-muted-foreground">Enrolled Courses</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="mt-1 text-sm text-muted-foreground">Upcoming Assignments</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-primary">0 XP</p>
          <p className="mt-1 text-sm text-muted-foreground">Total Experience</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Tasks */}
        <DashboardCard title="Today's Tasks" icon="🐋">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 text-5xl opacity-40">🌊</div>
            <p className="text-muted-foreground">
              Smooth sailing! No tasks due today.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Check back later or browse your courses.
            </p>
          </div>
        </DashboardCard>

        {/* Enrolled Courses */}
        <DashboardCard title="Enrolled Courses" icon="📚">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 text-5xl opacity-40">🐺</div>
            <p className="text-muted-foreground">
              No courses yet. Time to dive in!
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask your teacher to enroll you in a course.
            </p>
          </div>
        </DashboardCard>

        {/* Upcoming Assignments */}
        <DashboardCard title="Upcoming Assignments" icon="📝">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                No upcoming assignments
              </p>
            </div>
          </div>
        </DashboardCard>

        {/* XP Progress */}
        <DashboardCard title="XP Progress" icon="⭐">
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Level 1</span>
                <span className="font-medium text-foreground">0 / 100 XP</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                  style={{ width: '0%' }}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Complete assignments and participate in class to earn XP!
            </p>
          </div>
        </DashboardCard>

        {/* Recent Grades */}
        <DashboardCard title="Recent Grades" icon="📊" className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Assignment
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Course
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Grade
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No grades recorded yet. Keep up the great work!
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
