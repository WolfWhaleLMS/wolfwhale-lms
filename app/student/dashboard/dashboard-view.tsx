import Link from 'next/link'
import {
  BookOpen,
  Calendar,
  CalendarDays,
  ChevronRight,
  Clock,
  Crown,
  Flame,
  GraduationCap,
  Library,
  MessageCircle,
  PartyPopper,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from 'lucide-react'

import { AnnouncementBanner } from '@/components/announcements/AnnouncementBanner'
import { CircularGauge } from '@/components/ui/circular-gauge'

import type { StudentDashboardData } from './dashboard-data'

export function StudentDashboardView({ data }: { data: StudentDashboardData }) {
  const {
    studentName,
    greeting,
    enrolledCourses,
    upcomingAssignments,
    achievements,
    xpData,
    xpProgress,
    xpMessage,
    attendanceRate,
    assignedTextbooks,
    stats,
    streakMessage,
  } = data

  const courseGradients = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-orange-400 to-pink-500',
    'from-fuchsia-500 to-rose-500',
    'from-amber-400 to-orange-500',
  ]

  const taskGradients = [
    'from-sky-400 to-blue-500',
    'from-violet-400 to-purple-500',
    'from-emerald-400 to-green-500',
    'from-amber-400 to-orange-500',
    'from-pink-400 to-rose-500',
  ]

  return (
    <div className="min-h-screen space-y-8 pb-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-500 p-8 text-white shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-1/4 top-1/2 h-20 w-20 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-yellow-300" />
            <p className="text-lg font-medium text-white/80">{greeting}</p>
          </div>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Hey {studentName}!
          </h1>
          <p className="mt-2 text-xl text-white/90">
            Ready to learn something awesome today?
          </p>

          {stats.streak > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 text-base font-semibold backdrop-blur-sm">
              <Flame className="h-5 w-5 text-orange-300" />
              {stats.streak}-day streak &mdash; {streakMessage}
            </div>
          )}
        </div>
      </div>

      <AnnouncementBanner />

      <div className="rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 p-6 shadow-lg sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/30 text-3xl font-black text-white shadow-inner backdrop-blur-sm">
              {xpData.level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-white" />
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  {xpData.levelName}
                </h2>
              </div>
              <p className="text-sm font-medium text-white/80">
                {xpData.tier} Tier &middot; {xpMessage}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-white">
              {xpData.currentXP}
              <span className="text-lg font-medium text-white/70">
                {' '}
                / {xpData.nextLevelXP} XP
              </span>
            </p>
          </div>
        </div>

        <div className="mt-5 h-6 w-full overflow-hidden rounded-full bg-white/30 shadow-inner backdrop-blur-sm">
          <div
            className="flex h-full items-center justify-end rounded-full bg-white px-3 shadow-lg transition-all duration-700 ease-out"
            style={{ width: `${Math.max(xpProgress, 3)}%` }}
          >
            {xpProgress >= 10 && (
              <Zap className="h-4 w-4 text-amber-500" />
            )}
          </div>
        </div>
      </div>

      <section>
        <div className="ocean-card rounded-3xl p-6 sm:p-8">
          <h2 className="mb-6 text-center text-lg font-bold text-foreground">
            Your Performance at a Glance
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <CircularGauge
              value={stats.currentGPA !== '--' ? parseFloat(stats.currentGPA) : 0}
              max={4}
              label="GPA"
              sublabel={stats.currentGPA !== '--' ? (parseFloat(stats.currentGPA) >= 3.5 ? 'Excellent' : parseFloat(stats.currentGPA) >= 2.5 ? 'Good' : parseFloat(stats.currentGPA) >= 1.5 ? 'Fair' : 'Needs Work') : undefined}
              valueDisplay={stats.currentGPA !== '--' ? stats.currentGPA : '--'}
              colorThresholds={[
                { value: 87.5, color: '#22c55e', bgColor: '#22c55e20' },
                { value: 62.5, color: '#3b82f6', bgColor: '#3b82f620' },
                { value: 37.5, color: '#f59e0b', bgColor: '#f59e0b20' },
                { value: 0, color: '#ef4444', bgColor: '#ef444420' },
              ]}
            />
            <CircularGauge
              value={attendanceRate}
              label="Attendance"
              sublabel={attendanceRate > 0 ? (attendanceRate >= 95 ? 'Excellent' : attendanceRate >= 85 ? 'Good' : 'Needs Attention') : undefined}
              colorThresholds={[
                { value: 95, color: '#22c55e', bgColor: '#22c55e20' },
                { value: 85, color: '#f59e0b', bgColor: '#f59e0b20' },
                { value: 0, color: '#ef4444', bgColor: '#ef444420' },
              ]}
            />
            <div className="flex flex-col items-center gap-2" role="status" aria-label={`${stats.coursesEnrolled} courses enrolled`}>
              <div className="flex h-[140px] w-[140px] items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/20">
                <div className="text-center">
                  <BookOpen className="mx-auto mb-1 h-6 w-6 text-blue-500" />
                  <p className="text-2xl font-extrabold text-foreground">{stats.coursesEnrolled}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground">Courses</p>
              <p className="text-xs text-muted-foreground">Enrolled</p>
            </div>
            <div className="flex flex-col items-center gap-2" role="status" aria-label={`${stats.assignmentsDue} assignments due this week`}>
              <div className={`flex h-[140px] w-[140px] items-center justify-center rounded-full ${stats.assignmentsDue > 0 ? 'bg-amber-50 dark:bg-amber-950/20' : 'bg-muted/30'}`}>
                <div className="text-center">
                  <Calendar className={`mx-auto mb-1 h-6 w-6 ${stats.assignmentsDue > 0 ? 'text-amber-500' : 'text-muted-foreground'}`} />
                  <p className={`text-2xl font-extrabold ${stats.assignmentsDue > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>{stats.assignmentsDue}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground">Due Soon</p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-md">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Today&apos;s Tasks
            </h2>
          </div>
          <Link
            href="/student/assignments"
            className="flex items-center gap-1 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-100 hover:scale-105 dark:bg-blue-950 dark:text-blue-300"
          >
            See All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {upcomingAssignments.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingAssignments.slice(0, 5).map((assignment, idx) => {
              const gradient = taskGradients[idx % taskGradients.length]
              const isUrgent =
                assignment.urgency === 'today' ||
                assignment.urgency === 'overdue'
              return (
                <div
                  key={assignment.id}
                  className="group relative overflow-hidden rounded-2xl p-5 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all duration-300 group-hover:scale-105`}
                  />
                  <div className="relative z-10">
                    {isUrgent && (
                      <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/25 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
                        <Clock className="h-3 w-3" />
                        {assignment.urgency === 'overdue'
                          ? 'Overdue'
                          : 'Due Today'}
                      </span>
                    )}
                    <h3 className="mt-1 text-lg font-bold leading-snug">
                      {assignment.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/80">
                      {assignment.course}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold backdrop-blur-sm">
                        <Zap className="h-3.5 w-3.5" /> {assignment.points} pts
                      </span>
                      <span className="text-sm font-medium text-white/90">
                        {assignment.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50/50 py-16 text-center dark:border-blue-800 dark:bg-blue-950/30">
            <Rocket className="mb-4 h-16 w-16 text-blue-300" />
            <p className="text-xl font-bold text-foreground">
              All clear! Nothing due soon.
            </p>
            <p className="mt-2 text-base text-muted-foreground">
              You&apos;re all caught up &mdash; nice work!
            </p>
          </div>
        )}
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">My Classes</h2>
          </div>
          <Link
            href="/student/courses"
            className="flex items-center gap-1 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 transition-all hover:bg-emerald-100 hover:scale-105 dark:bg-emerald-950 dark:text-emerald-300"
          >
            See All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course, idx) => {
              const gradient = courseGradients[idx % courseGradients.length]
              return (
                <Link
                  key={course.id}
                  href={`/student/courses/${course.id}`}
                  className="group relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`h-28 bg-gradient-to-br ${gradient} flex items-end p-5 transition-all duration-300 group-hover:h-32`}
                  >
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold text-white drop-shadow-sm">
                        {course.name}
                      </h3>
                      <p className="flex items-center gap-1 text-sm text-white/80">
                        <GraduationCap className="h-3.5 w-3.5" />{' '}
                        {course.teacher}
                      </p>
                    </div>
                    <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
                  </div>

                  <div className="rounded-b-2xl bg-card p-5">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-muted-foreground">
                        Progress
                      </span>
                      <span className="font-bold text-foreground">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {course.progress === 100 ? (
                        <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                          <PartyPopper className="h-4 w-4" /> All caught up!
                        </span>
                      ) : (
                        <>
                          <span className="text-muted-foreground">
                            Up next:{' '}
                          </span>
                          <span className="font-medium text-foreground">
                            {course.nextLesson}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 py-16 text-center dark:border-emerald-800 dark:bg-emerald-950/30">
            <BookOpen className="mb-4 h-16 w-16 text-emerald-300" />
            <p className="text-xl font-bold text-foreground">No classes yet</p>
            <p className="mt-2 text-base text-muted-foreground">
              Ask your teacher to enroll you in a class to get started!
            </p>
          </div>
        )}
      </section>

      {assignedTextbooks.length > 0 && (
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 shadow-md">
                <Library className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">My Textbooks</h2>
            </div>
            <Link
              href="/student/textbooks"
              className="flex items-center gap-1 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition-all hover:bg-indigo-100 hover:scale-105 dark:bg-indigo-950 dark:text-indigo-300"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {assignedTextbooks.map((textbook) => {
              const subjectGradients: Record<string, string> = {
                math: 'from-blue-500 to-indigo-600',
                science: 'from-emerald-500 to-teal-600',
                physics: 'from-cyan-500 to-blue-600',
                chemistry: 'from-purple-500 to-fuchsia-600',
                biology: 'from-green-500 to-emerald-600',
                ela: 'from-rose-500 to-pink-600',
              }
              const gradient = subjectGradients[textbook.subject] || 'from-gray-500 to-slate-600'

              const subjectLabels: Record<string, string> = {
                math: 'Mathematics',
                science: 'Science',
                physics: 'Physics',
                chemistry: 'Chemistry',
                biology: 'Biology',
                ela: 'English Language Arts',
              }
              const subjectLabel = subjectLabels[textbook.subject] || textbook.subject

              return (
                <Link
                  key={textbook.id}
                  href={`/student/textbooks/${textbook.textbookId}`}
                  className="group relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`h-24 bg-gradient-to-br ${gradient} flex items-end p-4 transition-all duration-300 group-hover:h-28`}
                  >
                    <div className="relative z-10">
                      <h3 className="text-base font-bold text-white drop-shadow-sm line-clamp-2">
                        {textbook.title}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-white/80">
                        <BookOpen className="h-3 w-3" /> {subjectLabel}
                      </p>
                    </div>
                    <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
                  </div>

                  <div className="rounded-b-2xl bg-card p-4">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-muted-foreground">
                        Reading
                      </span>
                      <span className="font-bold text-foreground">
                        {textbook.readingProgress}%
                      </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                        style={{ width: `${textbook.readingProgress}%` }}
                      />
                    </div>
                    <p className="mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      Continue Reading
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Achievements
            </h2>
          </div>
          <Link
            href="/student/achievements"
            className="flex items-center gap-1 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-600 transition-all hover:bg-amber-100 hover:scale-105 dark:bg-amber-950 dark:text-amber-300"
          >
            See All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.slice(0, 3).map((achievement) => (
              <div
                key={achievement.id}
                className="group flex items-center gap-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-amber-800 dark:from-amber-950/50 dark:to-yellow-950/50"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-2xl shadow-md transition-transform duration-300 group-hover:scale-110">
                  {achievement.icon}
                </span>
                <div className="flex-1">
                  <p className="text-base font-bold text-foreground">
                    {achievement.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {achievement.earnedAt}
                  </p>
                </div>
                <Crown className="h-5 w-5 text-amber-400" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-amber-200 bg-amber-50/50 py-12 text-center dark:border-amber-800 dark:bg-amber-950/30">
            <Trophy className="mb-4 h-14 w-14 text-amber-300" />
            <p className="text-lg font-bold text-foreground">
              Your trophy case is waiting!
            </p>
            <p className="mt-2 text-base text-muted-foreground">
              Complete tasks and lessons to earn awesome achievements.
            </p>
          </div>
        )}
      </section>

      <section>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              href: '/student/study-mode',
              label: 'Study Mode',
              icon: <Rocket className="h-7 w-7" />,
              gradient: 'from-blue-500 to-cyan-400',
              bg: 'bg-blue-50 dark:bg-blue-950/40',
            },
            {
              href: '/messaging',
              label: 'Messages',
              icon: <MessageCircle className="h-7 w-7" />,
              gradient: 'from-purple-500 to-pink-400',
              bg: 'bg-purple-50 dark:bg-purple-950/40',
            },
            {
              href: '/calendar',
              label: 'Calendar',
              icon: <CalendarDays className="h-7 w-7" />,
              gradient: 'from-emerald-500 to-green-400',
              bg: 'bg-emerald-50 dark:bg-emerald-950/40',
            },
            {
              href: '/student/leaderboard',
              label: 'Leaderboard',
              icon: <Crown className="h-7 w-7" />,
              gradient: 'from-amber-500 to-orange-400',
              bg: 'bg-amber-50 dark:bg-amber-950/40',
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`group flex flex-col items-center gap-3 rounded-2xl ${action.bg} border border-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700`}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${action.gradient} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
              >
                {action.icon}
              </div>
              <span className="text-sm font-bold text-foreground">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
