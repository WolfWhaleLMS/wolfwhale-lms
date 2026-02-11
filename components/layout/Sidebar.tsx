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
  Layers,
  Megaphone,
  Map,
  Dices,
  GitFork,
  LogOut,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { getRoleMenuItems, type UserRole } from '@/lib/auth/permissions'
import { useSound } from '@/components/providers/sound-provider'
import { SidebarXPWidget } from '@/components/gamification/SidebarXPWidget'

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
  Layers,
  Megaphone,
  Map,
  Dices,
  GitFork,
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
  const navRef = useRef<HTMLElement>(null)
  const [canScrollDown, setCanScrollDown] = useState(false)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    function check() {
      if (!nav) return
      setCanScrollDown(nav.scrollTop + nav.clientHeight < nav.scrollHeight - 8)
    }
    check()
    nav.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      nav.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [menuItems.length])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="relative z-10 flex h-full flex-col text-sidebar-foreground">
      {/* ----------------------------------------------------------------- */}
      {/* Header: tenant branding + mobile close button                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-5">
        <Link href="/" className="group flex items-center gap-3 min-w-0">
          {/* Wolf Whale logo */}
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl shadow-lg shadow-ocean-500/20 transition-shadow group-hover:shadow-ocean-500/40">
            <Image
              src={tenantLogo || '/logo.png'}
              alt={tenantName}
              fill
              className="object-contain"
            />
          </div>

          <span className="text-base font-bold tracking-tight leading-tight line-clamp-2">
            {tenantName}
          </span>
        </Link>

        {/* Mobile close button */}
        {onClose && (
          <button
            type="button"
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
      <div className="relative flex-1 min-h-0">
        <nav
          ref={navRef}
          className="h-full overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-sidebar-border hover:scrollbar-thumb-sidebar-foreground/20"
        >
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

        {/* Scroll fade indicator */}
        <div
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-sidebar to-transparent transition-opacity duration-300',
            canScrollDown ? 'opacity-100' : 'opacity-0'
          )}
        />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Student XP Widget                                                  */}
      {/* ----------------------------------------------------------------- */}
      {role === 'student' && <SidebarXPWidget />}

      {/* ----------------------------------------------------------------- */}
      {/* Footer: sign-out button                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="border-t border-sidebar-border p-3">
        <button
          type="button"
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
