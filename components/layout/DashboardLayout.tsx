'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import type { UserRole } from '@/lib/auth/permissions'

interface DashboardLayoutProps {
  children: React.ReactNode
  role: UserRole
  userName: string
  userAvatar?: string | null
  tenantName: string
  tenantLogo?: string | null
  gradeLevel?: string | null
}

export function DashboardLayout({
  children,
  role,
  userName,
  userAvatar,
  tenantName,
  tenantLogo,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative flex h-screen overflow-hidden bg-background" data-role={role}>
      {/* Ambient blobs for glass depth effect */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="blob-ocean absolute -top-1/4 -right-1/4 h-[600px] w-[600px] animate-blob-drift opacity-40" />
        <div className="blob-teal absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] animate-blob-drift opacity-30" style={{ animationDelay: '-7s' }} />
        <div className="blob-midnight absolute top-1/2 left-1/3 h-[400px] w-[400px] animate-blob-drift opacity-20" style={{ animationDelay: '-14s' }} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform
          liquid-glass-heavy border-r border-sidebar-border/50
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar
          role={role}
          tenantName={tenantName}
          tenantLogo={tenantLogo}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <TopBar
          userName={userName}
          userAvatar={userAvatar}
          role={role}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
