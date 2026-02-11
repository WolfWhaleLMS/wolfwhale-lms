'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f0f4f8]">
      {/* Light Ocean Background */}
      <div className="fixed inset-0 z-0">
        {/* Base — soft arctic white to light ocean blue */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #e8f0fe 0%, #dce8f5 25%, #c5d8ee 50%, #b8d4e8 75%, #d0e4f0 100%)',
          }}
        />

        {/* Ambient teal glow */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: 'radial-gradient(ellipse 150% 80% at 50% 20%, rgba(20,184,166,0.15) 0%, transparent 60%)',
            animation: 'ocean-pulse 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background: 'radial-gradient(ellipse 120% 60% at 30% 70%, rgba(26,42,78,0.08) 0%, transparent 50%)',
            animation: 'ocean-drift 12s ease-in-out infinite',
          }}
        />

        {/* Subtle floating particles */}
        {mounted && (
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full animate-twinkle"
                style={{
                  background: 'rgba(26,42,78,0.12)',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.3 + 0.1,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <img src="/logo.png" alt="Wolf Whale" className="h-20 w-20 rounded-full object-cover shadow-lg" />
          <div>
            <span className="text-xl font-bold text-[#1a2a4e] group-hover:text-[#0a4d68] transition-colors block">
              Wolf Whale
            </span>
            <span className="text-xs text-[#1a2a4e]/60 block">
              Learning Management System
            </span>
          </div>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-sm text-[#1a2a4e]/50">
          &copy; {new Date().getFullYear()} Wolf Whale Inc. All rights reserved.
        </p>
      </footer>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes ocean-pulse {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.4; }
          50% { transform: scale(1.1) translateY(-5%); opacity: 0.5; }
        }
        @keyframes ocean-drift {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(10%) scale(1.05); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
        .animate-twinkle {
          animation: twinkle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
