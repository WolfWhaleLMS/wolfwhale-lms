import Link from 'next/link'
import {
  Users,
  GraduationCap,
  Calendar,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react'
import { getChildren } from '@/app/actions/parent'

export default async function ChildrenListPage() {
  let children: Awaited<ReturnType<typeof getChildren>> = []
  let error: string | null = null

  try {
    children = await getChildren()
  } catch (e: any) {
    error = e.message ?? 'Failed to load children'
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href="/parent/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          My Children
        </h1>
        <p className="mt-1 text-muted-foreground">
          View and monitor your children&apos;s academic progress.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="ocean-card rounded-2xl p-6">
          <div className="flex items-center gap-3 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!error && children.length === 0 && (
        <div className="ocean-card rounded-2xl p-12 text-center">
          <Users className="mx-auto h-16 w-16 text-muted-foreground/30" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            No Children Linked
          </h3>
          <p className="mt-2 max-w-md mx-auto text-muted-foreground">
            Your account is not linked to any students yet. Contact your
            school&apos;s administrator to connect your account with your
            child&apos;s profile.
          </p>
        </div>
      )}

      {/* Children Grid */}
      {children.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {children.map((child) => (
            <Link
              key={child.studentId}
              href={`/parent/children/${child.studentId}`}
              className="group"
            >
              <div className="ocean-card rounded-2xl overflow-hidden transition-all group-hover:scale-[1.02] group-hover:shadow-lg">
                {/* Child Header */}
                <div className="whale-gradient p-6">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white shadow-lg">
                      {child.avatarUrl ? (
                        <img
                          src={child.avatarUrl}
                          alt={child.fullName}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        child.fullName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white group-hover:underline">
                        {child.fullName}
                      </h3>
                      <p className="text-white/70">
                        {child.gradeLevel
                          ? `Grade ${child.gradeLevel}`
                          : 'Grade N/A'}
                        {child.relationship && (
                          <span className="ml-2 capitalize">
                            ({child.relationship})
                          </span>
                        )}
                      </p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {/* GPA */}
                    <div className="rounded-xl bg-muted/50 p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <GraduationCap className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {child.gpa > 0 ? `${child.gpa}%` : '--'}
                      </p>
                      <p className="text-xs text-muted-foreground">GPA</p>
                    </div>

                    {/* Attendance */}
                    <div className="rounded-xl bg-muted/50 p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Calendar className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {child.attendanceRate > 0
                          ? `${child.attendanceRate}%`
                          : '--'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Attendance
                      </p>
                    </div>

                    {/* Courses */}
                    <div className="rounded-xl bg-muted/50 p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {child.courseCount}
                      </p>
                      <p className="text-xs text-muted-foreground">Courses</p>
                    </div>

                    {/* Missing */}
                    <div className="rounded-xl bg-muted/50 p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <AlertCircle
                          className={`h-4 w-4 ${child.missingAssignments > 0 ? 'text-red-500' : 'text-muted-foreground'}`}
                        />
                      </div>
                      <p
                        className={`text-lg font-bold ${child.missingAssignments > 0 ? 'text-red-500' : 'text-foreground'}`}
                      >
                        {child.missingAssignments}
                      </p>
                      <p className="text-xs text-muted-foreground">Missing</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Info Card */}
      {children.length > 0 && (
        <div className="ocean-card rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">
                About Parent Accounts
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Click on any child to view their detailed grades, assignments,
                attendance, and academic progress. If you need to link additional
                children, contact your school administrator.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
