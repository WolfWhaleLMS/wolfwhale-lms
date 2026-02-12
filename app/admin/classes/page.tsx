import { getTenantClasses } from '@/app/actions/school-admin'
import { BookOpen, Users, GraduationCap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function statusColor(status: string) {
  switch (status) {
    case 'active':
    case 'published':
      return 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400'
    case 'draft':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    case 'archived':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export default async function AdminClassesPage() {
  let classes: any[] = []
  try {
    classes = await getTenantClasses()
  } catch {
    // fall through with empty
  }

  return (
    <div className="space-y-4 sm:space-y-8 overflow-x-hidden max-w-full">
      {/* Back Button */}
      <Link
        href="/admin/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Classes</h1>
          <p className="mt-1 text-muted-foreground">
            Manage all courses and classes in your school.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-3">
        <div className="ocean-card rounded-2xl p-3 sm:p-5 text-center">
          <BookOpen className="mx-auto mb-1 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <p className="text-xl sm:text-2xl font-bold text-foreground">{classes.length}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Total Classes</p>
        </div>
        <div className="ocean-card rounded-2xl p-3 sm:p-5 text-center">
          <GraduationCap className="mx-auto mb-1 h-5 w-5 sm:h-6 sm:w-6 text-teal-500" />
          <p className="text-xl sm:text-2xl font-bold text-foreground">
            {classes.filter((c) => c.status === 'active' || c.status === 'published').length}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
        </div>
        <div className="ocean-card rounded-2xl p-3 sm:p-5 text-center col-span-2 sm:col-span-1">
          <Users className="mx-auto mb-1 h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
          <p className="text-xl sm:text-2xl font-bold text-foreground">
            {classes.reduce((sum: number, c: any) => sum + (c.course_enrollments?.[0]?.count ?? 0), 0)}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">Total Enrollments</p>
        </div>
      </div>

      {/* Classes Table */}
      {classes.length === 0 ? (
        <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
          <BookOpen className="mb-3 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold text-foreground">No classes yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Classes created by teachers will appear here.
          </p>
        </div>
      ) : (
        <div className="ocean-card overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Teacher
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Students
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {classes.map((cls: any) => (
                  <tr key={cls.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{cls.name}</p>
                        {cls.grade_level && (
                          <p className="text-xs text-muted-foreground">
                            Grade {cls.grade_level}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {cls.profiles?.full_name || 'Unassigned'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {cls.subject || '--'}
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-foreground">
                      {cls.course_enrollments?.[0]?.count ?? 0}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(cls.status)}`}
                      >
                        {cls.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
