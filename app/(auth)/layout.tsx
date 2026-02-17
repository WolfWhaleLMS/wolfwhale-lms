import Image from 'next/image'

import { AuthDarkModeScript } from './AuthDarkModeScript'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0A0E1A]">
      <AuthDarkModeScript />
      {/* Dark Neon Background */}
      <div className="fixed inset-0 z-0">
        {/* Chrome texture base — dark */}
        <div className="absolute inset-0">
          <Image src="/chrome-bg.jpg" alt="" fill sizes="100vw" className="object-cover opacity-8" priority />
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

      {/* Animation keyframes -- uses ocean-pulse-ambient and ocean-drift-ambient from globals.css */}
    </div>
  )
}
