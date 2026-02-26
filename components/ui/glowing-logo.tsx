'use client'

import Image from 'next/image'

interface GlowingLogoProps {
  size?: number
  className?: string
}

export function GlowingLogo({ size = 48, className = '' }: GlowingLogoProps) {
  // Logo image stays at `size`
  // Tile is 30% larger than before (was 1.6x, now ~2.08x)
  const tileSize = size * 2.08
  const borderRadius = tileSize * 0.22

  // Glow scales with tile
  const g = tileSize * 0.5

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Static purple glow behind tile */}
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
          zIndex: 0,
        }}
      />

      {/* Soft halo — static, behind everything */}
      <div
        className="absolute"
        style={{
          width: tileSize * 1.5,
          height: tileSize * 1.5,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* App tile — sits ON TOP of glow, hard black edge blocks bleed */}
      <div
        className="overflow-hidden bg-black flex items-center justify-center"
        style={{
          position: 'relative',
          zIndex: 1,
          width: tileSize,
          height: tileSize,
          borderRadius,
          boxShadow: `
            0 0 0 3px #000000,
            0 4px 24px rgba(0,0,0,0.7)
          `,
        }}
      >
        {/* Logo image — stays at original `size` */}
        <Image
          src="/logo.png"
          alt="WolfWhale"
          width={Math.round(size)}
          height={Math.round(size)}
          sizes={`${Math.round(size)}px`}
          className="object-contain"
          style={{ width: size, height: size }}
        />
      </div>
    </div>
  )
}
