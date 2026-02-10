'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function StudentDashboardPage() {
  const [greeting, setGreeting] = useState('Good day')
  const studentName = 'Student' // Placeholder

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  // Placeholder data
  const stats = {
    coursesEnrolled: 0,
    assignmentsDue: 0,
    currentGPA: '—',
    streak: 0,
  }

  const xpData = {
    currentXP: 0,
    nextLevelXP: 100,
    level: 1,
    levelName: 'Rookie Navigator',
    tier: 'Bronze',
  }

  const upcomingAssignments: { id: number; name: string; course: string; dueDate: string; points: number; urgency: string }[] = [
  ]

  const enrolledCourses: { id: number; name: string; teacher: string; progress: number; nextLesson: string }[] = [
  ]

  const grades: { courseId: number; courseName: string; grade: string; percentage: number }[] = [
  ]

  const achievements: { id: number; name: string; icon: string; earnedAt: string }[] = [
  ]

  const xpProgress = (xpData.currentXP / xpData.nextLevelXP) * 100

  // Helper function to get grade color
  const getGradeColor = (grade: string) => {
    if (grade === 'A') return 'text-green-600 bg-green-50 border-green-200'
    if (grade === 'B') return 'text-blue-600 bg-blue-50 border-blue-200'
    if (grade === 'C') return 'text-amber-600 bg-amber-50 border-amber-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  // Helper function to get urgency color
  const getUrgencyColor = (urgency: string) => {
    if (urgency === 'overdue') return 'border-l-red-500 bg-red-50/50'
    if (urgency === 'today') return 'border-l-amber-500 bg-amber-50/50'
    return 'border-l-blue-500 bg-blue-50/20'
  }

  return (
    <div className="min-h-screen space-y-6 pb-12">
      {/* Welcome Header */}
      <div className="whale-gradient rounded-3xl p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h1 className="mb-2 text-4xl font-bold">
              {greeting}, {studentName}!
            </h1>
            <p className="text-lg text-white/90">
              Ready to make some waves today?
            </p>

            {/* XP Progress */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="font-semibold">
                    Level {xpData.level} - {xpData.levelName}
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                    {xpData.tier}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {xpData.currentXP} / {xpData.nextLevelXP} XP
                </span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
                <div
                  className="h-full rounded-full bg-white shadow-lg transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-2xl font-bold">{stats.streak}</p>
                  <p className="text-sm text-white/80">Day Streak</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="text-2xl font-bold">{stats.coursesEnrolled}</p>
                  <p className="text-sm text-white/80">Courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{stats.assignmentsDue}</p>
            <p className="text-sm text-white/80">Due This Week</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{stats.currentGPA}</p>
            <p className="text-sm text-white/80">Current GPA</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{xpData.currentXP}</p>
            <p className="text-sm text-white/80">Total XP</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{achievements.length}</p>
            <p className="text-sm text-white/80">Achievements</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="space-y-6 lg:col-span-2">
          {/* Today's Tasks - Priority Section */}
          <div className="ocean-card rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <h2 className="text-xl font-bold text-foreground">
                  Today&apos;s Tasks
                </h2>
              </div>
              <Link
                href="/student/assignments"
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            {upcomingAssignments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAssignments.map((assignment: any) => (
                  <div
                    key={assignment.id}
                    className={`rounded-xl border-l-4 p-4 transition-all hover:shadow-md ${getUrgencyColor(
                      assignment.urgency
                    )}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {assignment.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {assignment.course}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {assignment.points} pts
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due {assignment.dueDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 text-6xl opacity-40">🌊</div>
                <p className="text-lg font-medium text-foreground">
                  Smooth sailing ahead!
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  No assignments due in the next 7 days. Time to get ahead or
                  relax!
                </p>
              </div>
            )}
          </div>

          {/* My Courses Grid */}
          <div className="ocean-card rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📖</span>
                <h2 className="text-xl font-bold text-foreground">
                  My Courses
                </h2>
              </div>
              <Link
                href="/student/courses"
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {enrolledCourses.map((course: any) => (
                  <Link
                    key={course.id}
                    href={`/student/courses/${course.id}`}
                    className="group overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-muted/30 p-5 transition-all hover:shadow-lg"
                  >
                    <div className="mb-3">
                      <h3 className="font-semibold text-foreground group-hover:text-primary">
                        {course.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {course.teacher}
                      </p>
                    </div>
                    <div className="mb-2">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">
                          {course.progress}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Next: {course.nextLesson}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 text-6xl opacity-40">🐺</div>
                <p className="text-lg font-medium text-foreground">
                  No courses yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ask your teacher to enroll you in a course to get started!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Grade Overview */}
          <div className="ocean-card rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <h2 className="text-xl font-bold text-foreground">Grades</h2>
              </div>
              <Link
                href="/student/grades"
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            {grades.length > 0 ? (
              <div className="space-y-3">
                {grades.map((grade: any) => (
                  <div
                    key={grade.courseId}
                    className={`rounded-xl border p-4 ${getGradeColor(
                      grade.grade
                    )}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {grade.courseName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{grade.grade}</p>
                        <p className="text-xs">{grade.percentage}%</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Overall GPA */}
                <div className="mt-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white">
                  <p className="text-sm font-medium">Overall GPA</p>
                  <p className="text-3xl font-bold">{stats.currentGPA}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 text-5xl opacity-40">📈</div>
                <p className="text-sm text-muted-foreground">
                  No grades yet. Keep working hard!
                </p>
              </div>
            )}
          </div>

          {/* Achievement Spotlight */}
          <div className="ocean-card rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <h2 className="text-xl font-bold text-foreground">
                  Achievements
                </h2>
              </div>
              <Link
                href="/student/achievements"
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            {achievements.length > 0 ? (
              <div className="space-y-3">
                {achievements.slice(0, 3).map((achievement: any) => (
                  <div
                    key={achievement.id}
                    className="rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 p-4 border border-amber-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {achievement.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {achievement.earnedAt}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 text-5xl opacity-40">🎖️</div>
                <p className="text-sm text-muted-foreground">
                  Earn achievements by completing tasks!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="ocean-card rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Link
            href="/student/study"
            className="group flex flex-col items-center gap-2 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <span className="text-4xl">📚</span>
            <span className="text-sm font-medium text-foreground group-hover:text-primary">
              Study Mode
            </span>
          </Link>

          <Link
            href="/student/messages"
            className="group flex flex-col items-center gap-2 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <span className="text-4xl">💬</span>
            <span className="text-sm font-medium text-foreground group-hover:text-primary">
              Messages
            </span>
          </Link>

          <Link
            href="/student/calendar"
            className="group flex flex-col items-center gap-2 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <span className="text-4xl">📅</span>
            <span className="text-sm font-medium text-foreground group-hover:text-primary">
              Calendar
            </span>
          </Link>

          <Link
            href="/student/leaderboard"
            className="group flex flex-col items-center gap-2 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <span className="text-4xl">🏅</span>
            <span className="text-sm font-medium text-foreground group-hover:text-primary">
              Leaderboard
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
