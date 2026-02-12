'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Music, VolumeX } from 'lucide-react'
import { usePianoMusic } from '@/hooks/usePianoMusic'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const { isPlaying, toggle, start } = usePianoMusic()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Try to auto-start music immediately, then on any interaction
  useEffect(() => {
    // Attempt immediate autoplay
    start()

    // Also try on every user interaction until it works
    function handleInteraction() {
      start()
    }
    document.addEventListener('click', handleInteraction)
    document.addEventListener('keydown', handleInteraction)
    document.addEventListener('touchstart', handleInteraction)
    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }
  }, [start])

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#E8F8FF]">
      {/* Aqua Neon Background */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient — bright aqua-futuristic */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#E8F8FF] via-[#D0F0FF] to-[#B0E8FF]"
        />

        {/* Ambient neon glow — cyan */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: 'radial-gradient(ellipse 150% 80% at 50% 20%, rgba(0,191,255,0.18) 0%, transparent 60%)',
            animation: 'ocean-pulse 8s ease-in-out infinite',
          }}
        />
        {/* Ambient neon glow — green */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background: 'radial-gradient(ellipse 120% 60% at 30% 70%, rgba(51,255,51,0.10) 0%, transparent 50%)',
            animation: 'ocean-drift 12s ease-in-out infinite',
          }}
        />

        {/* Blob backgrounds */}
        <div className="blob-ocean absolute top-[-10%] right-[-5%] w-[500px] h-[500px] opacity-30" />
        <div className="blob-teal absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] opacity-20" />

        {/* Floating bubble particles */}
        {mounted && (
          <div className="absolute inset-0">
            {/* Bubbles with bubble-float animation */}
            <div className="absolute bubble-float rounded-full bg-[#00BFFF]/8 w-3 h-3" style={{ left: '8%', top: '15%', animationDelay: '0s' }} />
            <div className="absolute bubble-float rounded-full bg-[#00FFFF]/6 w-4 h-4" style={{ left: '85%', top: '20%', animationDelay: '0.8s' }} />
            <div className="absolute bubble-float rounded-full bg-[#00BFFF]/8 w-2 h-2" style={{ left: '25%', top: '60%', animationDelay: '1.5s' }} />
            <div className="absolute bubble-float rounded-full bg-[#00FFFF]/6 w-5 h-5" style={{ left: '70%', top: '75%', animationDelay: '2.2s' }} />
            <div className="absolute bubble-float rounded-full bg-[#00BFFF]/8 w-3.5 h-3.5" style={{ left: '45%', top: '10%', animationDelay: '3s' }} />
            <div className="absolute bubble-float rounded-full bg-[#00FFFF]/6 w-2.5 h-2.5" style={{ left: '15%', top: '85%', animationDelay: '3.8s' }} />
            <div className="absolute bubble-float rounded-full bg-[#00BFFF]/8 w-4 h-4" style={{ left: '60%', top: '45%', animationDelay: '4.5s' }} />
            <div className="absolute bubble-float rounded-full bg-[#00FFFF]/6 w-3 h-3" style={{ left: '90%', top: '55%', animationDelay: '5.2s' }} />
            <div className="absolute bubble-float rounded-full bg-[#00BFFF]/6 w-2 h-2" style={{ left: '35%', top: '35%', animationDelay: '1s' }} />
            <div className="absolute bubble-float rounded-full bg-[#00FFFF]/8 w-3 h-3" style={{ left: '50%', top: '90%', animationDelay: '2.8s' }} />

            {/* Chrome orb decorations */}
            <div className="absolute chrome-orb orb-float w-5 h-5" style={{ left: '10%', top: '30%', animationDelay: '0s' }} />
            <div className="absolute chrome-orb orb-float w-7 h-7" style={{ right: '12%', top: '65%', animationDelay: '1.5s' }} />
            <div className="absolute chrome-orb orb-float w-4 h-4" style={{ left: '55%', top: '8%', animationDelay: '3s' }} />
          </div>
        )}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <img src="/logo.png" alt="Wolf Whale" className="h-20 w-20 rounded-xl object-contain shadow-lg" />
          <div>
            <span className="text-xl font-display font-bold text-[#0A2540] group-hover:text-[#00BFFF] transition-colors block tracking-wider uppercase">
              Wolf Whale
            </span>
            <span className="text-xs text-[#0A2540]/60 block font-display font-semibold tracking-widest uppercase">
              Learning Management System
            </span>
          </div>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6 sm:px-10 lg:px-16">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-sm text-[#0A2540]/50">
          &copy; {new Date().getFullYear()} Wolf Whale Inc. All rights reserved.
        </p>
      </footer>

      {/* Music Toggle */}
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full ocean-card shadow-lg hover:shadow-[0_0_20px_rgba(0,191,255,0.3)] transition-all hover:scale-110 group"
        title={isPlaying ? 'Mute music' : 'Play music'}
      >
        {isPlaying ? (
          <Music className="h-5 w-5 text-[#00BFFF] animate-pulse" />
        ) : (
          <VolumeX className="h-5 w-5 text-[#0A2540]/50" />
        )}
      </button>

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
    </div>
  )
}
