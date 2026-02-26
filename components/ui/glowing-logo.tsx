'use client'

import Image from 'next/image'

interface GlowingLogoProps {
  size?: number
  className?: string
}

export function GlowingLogo({ size = 48, className = '' }: GlowingLogoProps) {
  // App tile is bigger than the logo — 22% border-radius like iOS icons
  const tileSize = size * 1.6
  const borderRadius = tileSize * 0.22

  // Strong static glow behind the tile
  const g = size * 0.8

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Static purple glow behind tile — doubled intensity */}
      <div
        className="absolute"
        style={{
          width: tileSize,
          height: tileSize,
          borderRadius,
          boxShadow: `
            0 0 ${g * 0.4}px ${g * 0.15}px rgba(139, 92, 246, 0.7),
            0 0 ${g * 0.8}px ${g * 0.4}px rgba(139, 92, 246, 0.45),
            0 0 ${g * 1.2}px ${g * 0.6}px rgba(139, 92, 246, 0.25),
            0 0 ${g * 2}px ${g * 1}px rgba(139, 92, 246, 0.12)
          `,
        }}
      />

      {/* Soft halo — static */}
      <div
        className="absolute"
        style={{
          width: tileSize * 1.5,
          height: tileSize * 1.5,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)',
        }}
      />

      {/* App tile container */}
      <div
        className="relative overflow-hidden bg-black"
        style={{
          width: tileSize,
          height: tileSize,
          borderRadius,
          boxShadow: '0 2px 20px rgba(0,0,0,0.5)',
        }}
      >
        <Image
          src="/logo.png"
          alt="WolfWhale"
          width={Math.round(tileSize)}
          height={Math.round(tileSize)}
          sizes={`${Math.round(tileSize)}px`}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  )
}
