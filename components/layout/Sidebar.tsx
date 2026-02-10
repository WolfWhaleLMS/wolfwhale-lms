'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Brain,
  Trophy,
  Medal,
  Gamepad2,
  Users,
  CalendarCheck,
  BarChart3,
  Settings,
  Shield,
  FileText,
  Building2,
  LogOut,
  X,
  type LucideIcon,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { getRoleMenuItems, type UserRole } from '@/lib/auth/permissions'
import { useSound } from '@/components/providers/sound-provider'

// ---------------------------------------------------------------------------
// Icon mapping: string name -> lucide-react component
// ---------------------------------------------------------------------------

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Brain,
  Trophy,
  Medal,
  Gamepad2,
  Users,
  CalendarCheck,
  BarChart3,
  Settings,
  Shield,
  FileText,
  Building2,
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SidebarProps {
  role: UserRole
  tenantName: string
  tenantLogo?: string | null
  onClose?: () => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Sidebar({ role, tenantName, tenantLogo, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const menuItems = getRoleMenuItems(role)
  const sounds = useSound()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* ----------------------------------------------------------------- */}
      {/* Header: tenant branding + mobile close button                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-5">
        <Link href="/" className="group flex items-center gap-3 min-w-0">
          {/* Tenant logo or "W" fallback */}
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl whale-gradient shadow-lg shadow-ocean-500/20 transition-shadow group-hover:shadow-ocean-500/40">
            {tenantLogo ? (
              <Image
                src={tenantLogo}
                alt={tenantName}
                fill
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
                W
              </span>
            )}
          </div>

          <span className="truncate text-lg font-bold tracking-tight">
            {tenantName}
          </span>
        </Link>

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Navigation links                                                   */}
      {/* ----------------------------------------------------------------- */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1" role="list">
          {menuItems.map((item) => {
            const Icon = ICON_MAP[item.icon] ?? LayoutDashboard
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href + '/'))

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => {
                    sounds.playNavigate()
                    onClose?.()
                  }}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'wolf-gradient text-white shadow-md shadow-ocean-500/20 glow-border-ocean'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 flex-shrink-0',
                      isActive ? 'text-white' : 'text-sidebar-foreground/50'
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* ----------------------------------------------------------------- */}
      {/* Footer: sign-out button                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
