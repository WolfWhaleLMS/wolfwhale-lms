'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const { setTheme } = useTheme()

  // Force dark mode immediately before paint — prevents light flash
  useLayoutEffect(() => {
    document.documentElement.classList.remove('light')
    document.documentElement.classList.add('dark')
    document.documentElement.style.colorScheme = 'dark'
  }, [])

  // Keep next-themes state in sync so it persists correctly
  useEffect(() => {
    setMounted(true)
    setTheme('dark')
  }, [setTheme])

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0A0E1A]">
      {/* Dark Neon Background */}
      <div className="fixed inset-0 z-0">
        {/* Chrome texture base — dark */}
        <div className="absolute inset-0">
          <Image src="/chrome-bg.jpg" alt="" fill className="object-cover opacity-8" priority />
        </div>
        {/* Base gradient — deep ocean dark */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#0A0E1A]/95 via-[#0D1525]/90 to-[#0A1A2E]/95"
        />

        {/* Ambient neon glow — cyan */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 150% 80% at 50% 20%, rgba(0,191,255,0.15) 0%, transparent 60%)',
            animation: 'ocean-pulse 8s ease-in-out infinite',
          }}
        />
        {/* Ambient neon glow — green */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 120% 60% at 30% 70%, rgba(51,255,51,0.08) 0%, transparent 50%)',
            animation: 'ocean-drift 12s ease-in-out infinite',
          }}
        />

        {/* Blob backgrounds */}
        <div className="blob-ocean absolute top-[-10%] right-[-5%] w-[500px] h-[500px] opacity-30" />
        <div className="blob-teal absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] opacity-20" />
      </div>

      {/* Main Content — full screen, children handle layout */}
      <main className="relative z-10 min-h-screen">
        {children}
      </main>

      {/* Footer — minimal */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 p-4 text-center">
        <p className="text-xs text-white/40">
          &copy; {new Date().getFullYear()} WolfWhale Inc.
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
      `}</style>

      {/* Fish swim styles */}
      <style jsx global>{`
        @keyframes fish-swim-right {
          0%, 100% { transform: translateX(0) translateY(0) scaleX(1); }
          25% { transform: translateX(30px) translateY(-15px) scaleX(1); }
          50% { transform: translateX(50px) translateY(5px) scaleX(1); }
          75% { transform: translateX(20px) translateY(-10px) scaleX(1); }
        }
        @keyframes fish-swim-left {
          0%, 100% { transform: translateX(0) translateY(0) scaleX(-1); }
          25% { transform: translateX(-25px) translateY(-12px) scaleX(-1); }
          50% { transform: translateX(-45px) translateY(8px) scaleX(-1); }
          75% { transform: translateX(-15px) translateY(-8px) scaleX(-1); }
        }
        @keyframes fish-bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(3deg); }
          66% { transform: translateY(5px) rotate(-2deg); }
        }
      `}</style>
    </div>
  )
}
