'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Music, VolumeX, ArrowLeft } from 'lucide-react'
import { useTheme } from 'next-themes'
import { GlowingLogo } from '@/components/ui/glowing-logo'
import { usePianoMusic } from '@/hooks/usePianoMusic'
import UnderwaterSunbeams from '@/components/effects/UnderwaterSunbeams'
import LavaBlobs from '@/components/effects/LavaBlobs'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const { isPlaying, toggle, start } = usePianoMusic()
  const { setTheme } = useTheme()

  // Force light mode immediately before paint — prevents dark flash
  useLayoutEffect(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
    document.documentElement.style.colorScheme = 'light'
  }, [])

  // Keep next-themes state in sync so it persists correctly
  useEffect(() => {
    setMounted(true)
    setTheme('light')
  }, [setTheme])

  // Start music on first user interaction only (no eager autoplay)
  useEffect(() => {
    function handleInteraction() {
      start()
    }
    document.addEventListener('click', handleInteraction, { once: true })
    document.addEventListener('keydown', handleInteraction, { once: true })
    document.addEventListener('touchstart', handleInteraction, { once: true })
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
        {/* Chrome texture base */}
        <div className="absolute inset-0">
          <Image src="/chrome-bg.jpg" alt="" fill className="object-cover opacity-20" priority />
        </div>
        {/* Base gradient — bright aqua-futuristic */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#E8F8FF]/85 via-[#D0F0FF]/80 to-[#B0E8FF]/85"
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

        {/* Underwater sunbeam light rays */}
        <UnderwaterSunbeams />

        {/* Blob backgrounds */}
        <div className="blob-ocean absolute top-[-10%] right-[-5%] w-[500px] h-[500px] opacity-30" />
        <div className="blob-teal absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] opacity-20" />

        {/* Lava lamp chrome blobs */}
        <LavaBlobs />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 mb-4 sm:mb-6">
        <Link href="/" className="hidden sm:inline-flex items-center gap-3 group">
          <GlowingLogo size={80} />
          <div>
            <span className="text-xl font-display font-bold text-[#0A2540] group-hover:text-[#00BFFF] transition-colors block tracking-wider uppercase">
              WolfWhale
            </span>
            <span className="text-xs text-[#0A2540]/60 block font-display font-semibold tracking-widest uppercase">
              Learning Management System
            </span>
          </div>
        </Link>
        {/* EdTech Hub Button — static, below the logo */}
        <div className="sm:mt-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 sm:gap-2.5 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl btn-chrome-3d-silver font-semibold text-xs sm:text-sm tracking-wide transition-all hover:scale-105 neon-glow-blue group shadow-lg"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:-translate-x-1 transition-transform" />
            <span>WolfWhale EdTech Hub</span>
          </Link>
        </div>
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
          &copy; {new Date().getFullYear()} WolfWhale Inc. All rights reserved.
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
