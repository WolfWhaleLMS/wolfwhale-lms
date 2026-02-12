import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  Users,
  Calendar,
  Globe,
  Shield,
} from 'lucide-react'

const PLAN_STYLES: Record<string, string> = {
  free: 'bg-muted text-muted-foreground',
  starter:
    'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  growth:
    'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
  pro: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
  enterprise:
    'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
}

const STATUS_STYLES: Record<string, string> = {
  active:
    'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
  inactive: 'bg-muted text-muted-foreground',
  suspended:
    'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  trial:
    'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
}

export default async function AdminTenantsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Check super_admin role via header
  const headersList = await headers()
  const role = headersList.get('x-user-role')

  if (role !== 'super_admin') {
    return (
      <div className="space-y-4 sm:space-y-6 overflow-x-hidden max-w-full">
        <Link
          href="/admin/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="ocean-card rounded-2xl p-8 sm:p-12 text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <h2 className="text-lg font-semibold text-foreground">
            Access Denied
          </h2>
          <p className="mt-2 text-muted-foreground">
            Only super admins can manage tenants. Contact your system
            administrator for access.
          </p>
        </div>
      </div>
    )
  }

  // Fetch all tenants (super_admin sees all, no tenant filter)
  const { data: tenants, error: tenantsError } = await supabase
    .from('tenants')
    .select('id, name, slug, status, created_at, subscription_plan, max_users, branding')
    .order('created_at', { ascending: false })

  // Fetch member counts per tenant
  let memberCounts: Record<string, number> = {}

  if (tenants && tenants.length > 0) {
    try {
      const tenantIds = tenants.map((t: any) => t.id)
      const { data: memberships } = await supabase
        .from('tenant_memberships')
        .select('tenant_id')
        .in('tenant_id', tenantIds)

      if (memberships) {
        for (const m of memberships) {
          const tid = (m as any).tenant_id
          memberCounts[tid] = (memberCounts[tid] || 0) + 1
        }
      }
    } catch {
      // Membership count may fail silently
    }
  }

  const tenantList = tenants ?? []

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Tenant Management
          </h1>
          <p className="mt-1 text-muted-foreground">
            View and manage all tenants across the platform.
          </p>
        </div>
        <div className="ocean-card flex items-center gap-2 rounded-2xl px-4 py-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">
            {tenantList.length} tenant{tenantList.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Error State */}
      {tenantsError && (
        <div className="ocean-card rounded-2xl p-8 text-center">
          <p className="text-sm text-red-500">
            Failed to load tenants: {tenantsError.message}
          </p>
        </div>
      )}

      {/* Tenant Grid */}
      {tenantList.length === 0 && !tenantsError ? (
        <div className="ocean-card rounded-2xl p-12 text-center">
          <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            No tenants found in the system.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tenantList.map((tenant: any) => {
            const status = tenant.status ?? 'active'
            const plan = tenant.subscription_plan ?? 'free'
            const members = memberCounts[tenant.id] ?? 0
            const maxUsers = tenant.max_users ?? 50
            const statusStyle =
              STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground'
            const planStyle =
              PLAN_STYLES[plan] ?? 'bg-muted text-muted-foreground'

            return (
              <div
                key={tenant.id}
                className="ocean-card rounded-2xl p-4 sm:p-6 transition-shadow hover:shadow-lg"
              >
                {/* Tenant Name & Status */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {tenant.name ?? 'Unnamed Tenant'}
                      </h3>
                      {tenant.slug && (
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          {tenant.slug}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyle}`}
                  >
                    {status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="rounded-xl bg-muted/50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Seats
                      </div>
                      <span className={`text-sm font-semibold ${members >= maxUsers ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
                        {members}/{maxUsers}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${
                          members >= maxUsers
                            ? 'bg-red-500'
                            : members >= maxUsers * 0.8
                              ? 'bg-amber-500'
                              : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(100, maxUsers > 0 ? Math.round((members / maxUsers) * 100) : 0)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                    <span className="text-sm text-muted-foreground">Plan</span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${planStyle}`}
                    >
                      {plan}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Created
                    </div>
                    <span className="text-sm text-foreground">
                      {tenant.created_at
                        ? new Date(tenant.created_at).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )
                        : '--'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
