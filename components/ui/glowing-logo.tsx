'use client'

import Image from 'next/image'

interface GlowingLogoProps {
  size?: number
  className?: string
}

export function GlowingLogo({ size = 48, className = '' }: GlowingLogoProps) {
  const tileSize = size * 2.08
  const borderRadius = tileSize * 0.22
  const g = tileSize * 0.5

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Glow layer — large circular purple glow BEHIND the tile */}
      <div
        className="absolute inset-0 m-auto rounded-full"
        style={{
          width: tileSize * 1.8,
          height: tileSize * 1.8,
          zIndex: 0,
          background: 'radial-gradient(circle, rgba(139,92,246,0.7) 0%, rgba(139,92,246,0.35) 40%, rgba(139,92,246,0) 70%)',
          filter: `blur(${g * 0.6}px)`,
        }}
      />
      {/* App tile — sits ON TOP of the glow */}
      <div
        className="relative overflow-hidden bg-white dark:bg-black flex items-center justify-center"
        style={{
          width: tileSize,
          height: tileSize,
          borderRadius,
          padding: tileSize * 0.05,
          zIndex: 1,
          boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
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
