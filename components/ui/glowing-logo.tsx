'use client'

import Image from 'next/image'

interface GlowingLogoProps {
  size?: number
  className?: string
}

export function GlowingLogo({ size = 48, className = '' }: GlowingLogoProps) {
  const tileSize = size * 2.08
  const borderRadius = tileSize * 0.22
  const g = tileSize * 0.35

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Light mode glow — indigo */}
      <div
        className="absolute rounded-full dark:hidden"
        style={{
          width: tileSize * 2.2,
          height: tileSize * 2.2,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          background: 'radial-gradient(circle, rgba(79,70,229,0.55) 0%, rgba(79,70,229,0.25) 40%, rgba(79,70,229,0) 70%)',
          filter: `blur(${g}px)`,
        }}
      />
      {/* Dark mode glow — purple */}
      <div
        className="absolute rounded-full hidden dark:block"
        style={{
          width: tileSize * 2.2,
          height: tileSize * 2.2,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          background: 'radial-gradient(circle, rgba(139,92,246,0.7) 0%, rgba(139,92,246,0.35) 40%, rgba(139,92,246,0) 70%)',
          filter: `blur(${g}px)`,
        }}
      />
      {/* App tile */}
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
