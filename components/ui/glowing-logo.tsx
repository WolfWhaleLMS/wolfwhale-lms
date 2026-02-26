'use client'

import Image from 'next/image'

interface GlowingLogoProps {
  size?: number
  className?: string
}

export function GlowingLogo({ size = 48, className = '' }: GlowingLogoProps) {
  // Glow layers scale with logo size
  const glowSpread = size * 0.6
  const outerGlow = size * 1.0

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Warm radial glow — like a sun behind the logo */}
      <div
        className="absolute rounded-2xl"
        style={{
          width: size,
          height: size,
          boxShadow: `
            0 0 ${glowSpread * 0.3}px ${glowSpread * 0.1}px rgba(139, 92, 246, 0.5),
            0 0 ${glowSpread * 0.7}px ${glowSpread * 0.3}px rgba(139, 92, 246, 0.25),
            0 0 ${outerGlow}px ${glowSpread * 0.5}px rgba(139, 92, 246, 0.12),
            0 0 ${outerGlow * 1.5}px ${outerGlow * 0.6}px rgba(139, 92, 246, 0.05)
          `,
          animation: 'logo-glow-pulse 4s ease-in-out infinite',
        }}
      />

      {/* Secondary soft halo for extra warmth */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 1.4,
          height: size * 1.4,
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)',
          animation: 'logo-halo-breathe 4s ease-in-out infinite',
        }}
      />

      {/* Logo image */}
      <div
        className="relative rounded-xl overflow-hidden bg-black"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt="WolfWhale"
          width={size}
          height={size}
          sizes={`${size}px`}
          className="w-full h-full object-contain"
        />
      </div>

      <style>{`
        @keyframes logo-glow-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
        @keyframes logo-halo-breathe {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  )
}
