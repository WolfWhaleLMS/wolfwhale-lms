import Link from 'next/link'
import { getTenantSettings } from '@/app/actions/school-admin'
import { Settings, Building2, Palette, Shield, Bell, ArrowLeft } from 'lucide-react'

export default async function AdminSettingsPage() {
  let settings
  try {
    settings = await getTenantSettings()
  } catch {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">School Settings</h1>
        <div className="ocean-card rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">Unable to load settings. Please try again.</p>
        </div>
      </div>
    )
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

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">School Settings</h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
          Manage your school&apos;s profile, branding, and policies.
        </p>
      </div>

      {/* School Profile */}
      <div className="ocean-card rounded-2xl p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">School Profile</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">School Name</label>
            <p className="mt-1 text-foreground">{settings?.name || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Slug</label>
            <p className="mt-1 font-mono text-sm text-foreground">{settings?.slug || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Domain</label>
            <p className="mt-1 text-foreground">
              {settings?.slug ? `${settings.slug}.wolfwhale.ca` : 'Not configured'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Created</label>
            <p className="mt-1 text-foreground">
              {settings?.created_at
                ? new Date(settings.created_at).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="ocean-card rounded-2xl p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Branding</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Logo</label>
            <div className="mt-2 flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
              {settings?.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt="School logo"
                  className="h-16 w-16 object-contain"
                />
              ) : (
                <Building2 className="h-8 w-8 text-muted-foreground/40" />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Theme</label>
            <p className="mt-1 text-foreground">WolfWhale Default</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Midnight Blue + Ocean Teal
            </p>
          </div>
        </div>
      </div>

      {/* Privacy & Compliance */}
      <div className="ocean-card rounded-2xl p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Privacy & Compliance</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 rounded-xl bg-muted/30 p-3 sm:p-4">
            <div>
              <p className="text-sm font-medium text-foreground">FERPA Compliance</p>
              <p className="text-xs text-muted-foreground">Student education record protection</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-xl bg-muted/30 p-3 sm:p-4">
            <div>
              <p className="text-sm font-medium text-foreground">COPPA Compliance</p>
              <p className="text-xs text-muted-foreground">Children&apos;s online privacy protection</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-xl bg-muted/30 p-3 sm:p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Audit Logging</p>
              <p className="text-xs text-muted-foreground">All sensitive actions are recorded</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
              Enabled
            </span>
          </div>
        </div>
      </div>

      {/* Notification Policies */}
      <div className="ocean-card rounded-2xl p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Notification Policies</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Grade notifications to parents</span>
            <span className="text-sm text-muted-foreground">Enabled</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Attendance alerts</span>
            <span className="text-sm text-muted-foreground">After 3 absences</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Assignment reminders</span>
            <span className="text-sm text-muted-foreground">24h before due</span>
          </div>
        </div>
      </div>

      {/* Settings Management Note */}
      <div className="rounded-2xl border border-border bg-muted/20 p-4 text-center">
        <Settings className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Settings editing will be available in a future update.
          Contact support to make changes.
        </p>
      </div>
    </div>
  )
}
