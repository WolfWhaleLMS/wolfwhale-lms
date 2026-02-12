'use client'

import Image from 'next/image'
import { Menu, Search, Sun, Moon } from 'lucide-react'
import { NotificationBell } from '@/components/layout/NotificationBell'
import { RadioDropdown } from '@/components/layout/RadioDropdown'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { getRoleLabel, type UserRole } from '@/lib/auth/permissions'
import { useSound } from '@/components/providers/sound-provider'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TopBarProps {
  userName: string
  userAvatar?: string | null
  role: UserRole
  onMenuToggle: () => void
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Derives up to two initials from a full name. */
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/** Maps role to a Tailwind color scheme for the badge. */
function roleBadgeClasses(role: UserRole): string {
  const map: Record<UserRole, string> = {
    student:     'bg-[#059669]/15 text-[#059669] dark:text-[#34D399] border-[#059669]/30',
    teacher:     'bg-[#00BFFF]/15 text-[#0284C7] dark:text-[#7DD3FC] border-[#00BFFF]/30',
    parent:      'bg-[#00FFFF]/15 text-[#0891B2] dark:text-[#67E8F9] border-[#00FFFF]/30',
    admin:       'bg-[#FFD700]/15 text-[#B45309] dark:text-[#FCD34D] border-[#FFD700]/30',
    super_admin: 'bg-[#FFAA00]/15 text-[#D97706] dark:text-[#FBBF24] border-[#FFAA00]/30',
  }
  return map[role] ?? 'bg-muted text-muted-foreground'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TopBar({ userName, userAvatar, role, onMenuToggle }: TopBarProps) {
  const initials = getInitials(userName)
  const roleLabel = getRoleLabel(role)
  const { theme, setTheme } = useTheme()
  const sounds = useSound()

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 liquid-glass-heavy chrome-texture-topbar border-b-2 border-[#00BFFF]/30 neon-glow-blue px-4 md:px-6">
      {/* --------------------------------------------------------------- */}
      {/* Mobile hamburger                                                 */}
      {/* --------------------------------------------------------------- */}
      <button
        type="button"
        onClick={() => {
          sounds.playClick()
          onMenuToggle()
        }}
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* --------------------------------------------------------------- */}
      {/* Search bar (placeholder UI)                                      */}
      {/* --------------------------------------------------------------- */}
      <div className="relative hidden flex-1 sm:block sm:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search courses, assignments..."
          className={cn(
            'h-9 w-full rounded-xl border border-white/20 bg-white/30 dark:bg-white/5 backdrop-blur-sm pl-9 pr-4 text-sm',
            'placeholder:text-muted-foreground/60',
            'focus:border-[#00BFFF]/50 focus:outline-none focus:ring-2 focus:ring-[#00BFFF]/30',
            'transition-colors'
          )}
          readOnly
        />
      </div>

      {/* Spacer so the right-side content is pushed to the end */}
      <div className="flex-1 sm:hidden" />

      {/* --------------------------------------------------------------- */}
      {/* Right side: notifications, avatar, name, role badge              */}
      {/* --------------------------------------------------------------- */}
      <div className="flex items-center gap-3">
        {/* Radio player */}
        <RadioDropdown />

        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick()
            setTheme(theme === 'dark' ? 'light' : 'dark')
          }}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Notification bell */}
        <NotificationBell />

        {/* Divider */}
        <div className="hidden h-6 w-px bg-border/60 md:block" />

        {/* User info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-muted chrome-ring">
            {userAvatar ? (
              <Image
                src={userAvatar}
                alt={userName}
                fill
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center whale-gradient text-xs font-bold text-white text-white-outlined">
                {initials}
              </span>
            )}
          </div>

          {/* Name + role (hidden on very small screens) */}
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-medium leading-tight text-foreground">
              {userName}
            </span>
            <span
              className={cn(
                'mt-0.5 inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-none',
                roleBadgeClasses(role)
              )}
            >
              {roleLabel}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
