import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { Users, UserPlus, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserSearchBar } from './user-search-bar'

const ROLE_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  student: {
    label: 'Student',
    className:
      'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  },
  teacher: {
    label: 'Teacher',
    className:
      'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
  },
  parent: {
    label: 'Parent',
    className:
      'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
  },
  admin: {
    label: 'Admin',
    className:
      'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  },
  super_admin: {
    label: 'Super Admin',
    className:
      'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  },
  school_admin: {
    label: 'School Admin',
    className:
      'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  },
}

interface UsersPageProps {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams
  const search = params.q?.trim() ?? ''

  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  let query = supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url, role, grade_level, created_at, is_active')
    .order('created_at', { ascending: false })

  if (tenantId) {
    query = query.eq('tenant_id', tenantId)
  }

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  query = query.limit(100)

  const { data: users, error } = await query

  // Aggregate role counts
  const roleCounts: Record<string, number> = {}
  for (const user of users ?? []) {
    const role = user.role ?? 'student'
    roleCounts[role] = (roleCounts[role] ?? 0) + 1
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            User Management
          </h1>
          <p className="mt-1 text-muted-foreground">
            View and manage all users across your institution.
          </p>
        </div>
        <Button size="sm" disabled title="Coming soon">
          <UserPlus className="size-4" />
          Add User
        </Button>
      </div>

      {/* Role summary chips */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(roleCounts).map(([role, count]) => {
          const config = ROLE_CONFIG[role] ?? {
            label: role,
            className: 'bg-muted text-muted-foreground',
          }
          return (
            <div
              key={role}
              className="ocean-card flex items-center gap-2 rounded-2xl px-4 py-2"
            >
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${config.className}`}
              >
                {config.label}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {count}
              </span>
            </div>
          )
        })}
        <div className="ocean-card flex items-center gap-2 rounded-2xl px-4 py-2">
          <Users className="size-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">
            {(users ?? []).length} total
          </span>
        </div>
      </div>

      {/* Search */}
      <Suspense fallback={null}>
        <UserSearchBar defaultValue={search} />
      </Suspense>

      {/* Table */}
      <div className="ocean-card overflow-hidden rounded-2xl">
        {error ? (
          <div className="p-8 text-center text-sm text-red-500">
            Failed to load users: {error.message}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Grade
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(users ?? []).length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-muted-foreground"
                    >
                      {search
                        ? `No users found matching "${search}".`
                        : 'No users in this tenant yet.'}
                    </td>
                  </tr>
                ) : (
                  (users ?? []).map((user) => {
                    const role = user.role ?? 'student'
                    const config = ROLE_CONFIG[role] ?? {
                      label: role,
                      className: 'bg-muted text-muted-foreground',
                    }
                    const isActive = user.is_active !== false

                    return (
                      <tr
                        key={user.id}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt=""
                                className="size-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                {(user.full_name ?? '?')
                                  .split(' ')
                                  .map((n: string) => n[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                            )}
                            <span className="font-medium text-foreground">
                              {user.full_name ?? 'Unnamed User'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {user.email ?? '--'}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
                          >
                            {config.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {user.grade_level ?? '--'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`size-2 rounded-full ${
                                isActive ? 'bg-green-500' : 'bg-muted-foreground/40'
                              }`}
                            />
                            <span className="text-xs text-muted-foreground">
                              {isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-xs text-muted-foreground">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )
                            : '--'}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
