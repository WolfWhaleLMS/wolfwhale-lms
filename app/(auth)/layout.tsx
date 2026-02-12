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
        {/* Chrome texture base */}
        <div className="absolute inset-0">
          <img src="/chrome-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
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

        {/* Blob backgrounds */}
        <div className="blob-ocean absolute top-[-10%] right-[-5%] w-[500px] h-[500px] opacity-30" />
        <div className="blob-teal absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] opacity-20" />

        {/* Lava lamp chrome blobs */}
        {mounted && (
          <div className="absolute inset-0">
            {/* Large lava blobs — organic, slow-morphing chrome shapes */}
            <div className="lava-blob" style={{ width: '120px', height: '120px', left: '5%', animationDuration: '14s', animationDelay: '0s' }} />
            <div className="lava-blob" style={{ width: '90px', height: '90px', right: '8%', animationDuration: '18s', animationDelay: '2s' }} />
            <div className="lava-blob" style={{ width: '150px', height: '150px', left: '25%', animationDuration: '20s', animationDelay: '4s' }} />
            <div className="lava-blob" style={{ width: '70px', height: '70px', right: '25%', animationDuration: '16s', animationDelay: '6s' }} />
            <div className="lava-blob" style={{ width: '100px', height: '100px', left: '60%', animationDuration: '22s', animationDelay: '1s' }} />
            <div className="lava-blob" style={{ width: '80px', height: '80px', left: '45%', animationDuration: '15s', animationDelay: '8s' }} />
            <div className="lava-blob" style={{ width: '60px', height: '60px', right: '15%', animationDuration: '17s', animationDelay: '3s' }} />
            <div className="lava-blob" style={{ width: '110px', height: '110px', left: '80%', animationDuration: '19s', animationDelay: '5s' }} />

          </div>
        )}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <img src="/logo.png" alt="Wolf Whale" className="h-20 w-20 rounded-xl object-contain shadow-lg" />
          <div>
            <span className="text-xl font-display font-bold text-[#0A2540] group-hover:text-[#00BFFF] transition-colors block tracking-wider uppercase">
              WolfWhale
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

      {/* Fish swim + Lava blob styles */}
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
        .lava-blob {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(
            180deg,
            rgba(240, 248, 255, 0.85) 0%,
            rgba(192, 216, 232, 0.70) 25%,
            rgba(232, 244, 255, 0.80) 50%,
            rgba(168, 200, 224, 0.65) 75%,
            rgba(224, 240, 255, 0.75) 100%
          );
          box-shadow:
            0 0 30px rgba(0, 191, 255, 0.20),
            0 0 60px rgba(0, 191, 255, 0.10),
            inset -8px -8px 20px rgba(0, 0, 0, 0.08),
            inset 8px 8px 20px rgba(255, 255, 255, 0.60);
          animation: lava-float linear infinite;
          filter: blur(1px);
          opacity: 0.55;
          pointer-events: none;
        }
        .lava-blob::before {
          content: '';
          position: absolute;
          top: 12%;
          left: 18%;
          width: 40%;
          height: 35%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.75) 0%,
            rgba(255, 255, 255, 0.15) 60%,
            transparent 100%
          );
          border-radius: 50%;
        }
        @keyframes lava-float {
          0% {
            bottom: -15%;
            border-radius: 50% 45% 55% 48%;
            transform: scale(1) translateX(0);
          }
          15% {
            border-radius: 45% 55% 48% 52%;
            transform: scale(1.08) translateX(15px);
          }
          30% {
            border-radius: 52% 48% 45% 55%;
            transform: scale(0.95) translateX(-10px);
          }
          50% {
            bottom: 105%;
            border-radius: 48% 52% 55% 45%;
            transform: scale(1.12) translateX(20px);
          }
          51% {
            bottom: -15%;
            opacity: 0;
          }
          55% {
            opacity: 0.55;
            border-radius: 55% 45% 50% 50%;
            transform: scale(1) translateX(0);
          }
          70% {
            border-radius: 45% 52% 48% 55%;
            transform: scale(1.05) translateX(-15px);
          }
          85% {
            border-radius: 50% 48% 55% 45%;
            transform: scale(0.98) translateX(10px);
          }
          100% {
            bottom: 105%;
            border-radius: 50% 45% 55% 48%;
            transform: scale(1) translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
