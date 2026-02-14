'use client'

import { TopBar } from './TopBar'
import type { UserRole } from '@/lib/auth/permissions'
import dynamic from 'next/dynamic'
import { useAutoSync } from '@/lib/offline/hooks'

const OfflineStatusBar = dynamic(
  () => import('./OfflineStatusBar').then((m) => ({ default: m.OfflineStatusBar })),
  { ssr: false, loading: () => null }
)

interface HubDashboardLayoutProps {
  children: React.ReactNode
  role: UserRole
  userName: string
  userAvatar?: string | null
  tenantName: string
  tenantLogo?: string | null
  gradeLevel?: string | null
}

export function HubDashboardLayout({
  children,
  role,
  userName,
  userAvatar,
}: HubDashboardLayoutProps) {
  useAutoSync()

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background max-w-[100vw]" data-role={role}>
      {/* Chrome texture background */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
        style={{
          backgroundImage: 'url(/chrome-bg-3.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.10,
        }}
      />

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="blob-ocean absolute -top-1/4 -right-1/4 h-[800px] w-[800px] animate-blob-drift opacity-50" />
        <div className="blob-teal absolute -bottom-1/4 -left-1/4 h-[700px] w-[700px] animate-blob-drift opacity-40" style={{ animationDelay: '-7s' }} />
        <div className="bubble-float absolute left-[10%] top-[15%] h-3 w-3 rounded-full bg-[#00BFFF]/10" style={{ animationDelay: '0s' }} />
        <div className="bubble-float absolute left-[55%] top-[20%] h-5 w-5 rounded-full bg-[#00FFFF]/8" style={{ animationDelay: '-5s' }} />
        <div className="bubble-float absolute left-[80%] top-[60%] h-4 w-4 rounded-full bg-[#00BFFF]/10" style={{ animationDelay: '-8s' }} />
        <div className="bubble-float absolute left-[35%] top-[70%] h-6 w-6 rounded-full bg-[#00FFFF]/8" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Main content — NO sidebar */}
      <div className="chrome-overlay relative z-10 flex min-w-0 w-full flex-1 flex-col overflow-hidden">
        <TopBar
          userName={userName}
          userAvatar={userAvatar}
          role={role}
          onMenuToggle={() => {}}
          isHub
        />

        <OfflineStatusBar />

        <main className="relative flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="glass-reflection pointer-events-none absolute inset-0 z-0" aria-hidden="true" />
          <div className="relative z-10 flex items-start justify-center">
            <div className="w-full max-w-[800px]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
