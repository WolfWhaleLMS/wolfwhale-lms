'use client'

import { useState, useEffect, useCallback } from 'react'
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

  // Close sidebar on Escape key
  useEffect(() => {
    if (!sidebarOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sidebarOpen])

  return (
    <div className="relative flex h-screen overflow-hidden bg-background" data-role={role}>
      {/* Ambient blobs for glass depth effect — LARGER & more vivid */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="blob-ocean absolute -top-1/4 -right-1/4 h-[800px] w-[800px] animate-blob-drift opacity-50" />
        <div className="blob-teal absolute -bottom-1/4 -left-1/4 h-[700px] w-[700px] animate-blob-drift opacity-40" style={{ animationDelay: '-7s' }} />
        <div className="blob-midnight absolute top-1/2 left-1/3 h-[600px] w-[600px] animate-blob-drift opacity-30" style={{ animationDelay: '-14s' }} />

        {/* Floating bubble particles */}
        <div className="bubble-float absolute left-[10%] top-[15%] h-3 w-3 rounded-full bg-[#00BFFF]/10" style={{ animationDelay: '0s' }} />
        <div className="bubble-float absolute left-[25%] top-[70%] h-5 w-5 rounded-full bg-[#00FFFF]/8" style={{ animationDelay: '-3s' }} />
        <div className="bubble-float absolute left-[55%] top-[20%] h-2 w-2 rounded-full bg-[#00BFFF]/10" style={{ animationDelay: '-5s' }} />
        <div className="bubble-float absolute left-[80%] top-[60%] h-4 w-4 rounded-full bg-[#00FFFF]/8" style={{ animationDelay: '-8s' }} />
        <div className="bubble-float absolute left-[40%] top-[85%] h-6 w-6 rounded-full bg-[#00BFFF]/10" style={{ animationDelay: '-2s' }} />
        <div className="bubble-float absolute left-[70%] top-[10%] h-3 w-3 rounded-full bg-[#00FFFF]/8" style={{ animationDelay: '-11s' }} />
        <div className="bubble-float absolute left-[15%] top-[45%] h-4 w-4 rounded-full bg-[#00BFFF]/10" style={{ animationDelay: '-6s' }} />
        <div className="bubble-float absolute left-[90%] top-[35%] h-2 w-2 rounded-full bg-[#00FFFF]/8" style={{ animationDelay: '-9s' }} />
        <div className="bubble-float absolute left-[50%] top-[50%] h-5 w-5 rounded-full bg-[#00BFFF]/10" style={{ animationDelay: '-4s' }} />
        <div className="bubble-float absolute left-[35%] top-[30%] h-3 w-3 rounded-full bg-[#00FFFF]/8" style={{ animationDelay: '-13s' }} />

        {/* Chrome orb decorations */}
        <div className="chrome-orb orb-float absolute left-[20%] top-[25%] h-5 w-5" style={{ animationDelay: '-2s' }} />
        <div className="chrome-orb orb-float absolute left-[75%] top-[65%] h-7 w-7" style={{ animationDelay: '-7s' }} />
        <div className="chrome-orb orb-float absolute left-[45%] top-[80%] h-4 w-4" style={{ animationDelay: '-12s' }} />

        {/* Frutiger Aero fish — subtle background decorations */}
        <img
          src="/fish/clownfish-mid-right.png"
          alt=""
          className="absolute pointer-events-none select-none opacity-[0.07]"
          style={{ right: '5%', top: '15%', width: '140px', animation: 'gentle-float 20s ease-in-out infinite' }}
        />
        <img
          src="/fish/clownfish-bot-left.png"
          alt=""
          className="absolute pointer-events-none select-none opacity-[0.06]"
          style={{ left: '30%', bottom: '10%', width: '110px', animation: 'gentle-float 18s ease-in-out infinite', animationDelay: '-5s', transform: 'scaleX(-1)' }}
        />
        <img
          src="/fish/clownfish-small-front.png"
          alt=""
          className="absolute pointer-events-none select-none opacity-[0.05]"
          style={{ right: '35%', top: '55%', width: '70px', animation: 'gentle-float 15s ease-in-out infinite', animationDelay: '-10s' }}
        />
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
      <div className="chrome-overlay relative z-10 flex flex-1 flex-col overflow-hidden">
        <TopBar
          userName={userName}
          userAvatar={userAvatar}
          role={role}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="relative flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {/* Subtle glass reflection gradient overlay */}
          <div className="glass-reflection pointer-events-none absolute inset-0 z-0" aria-hidden="true" />
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
