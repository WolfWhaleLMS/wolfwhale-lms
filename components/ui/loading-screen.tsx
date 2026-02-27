'use client'

import { GlowingLogo } from '@/components/ui/glowing-logo'

export function LoadingScreen({ fullScreen = false }: { fullScreen?: boolean }) {
  return (
    <div
      className={`relative flex items-center justify-center bg-black ${
        fullScreen ? 'min-h-screen' : 'min-h-[60vh] rounded-xl'
      }`}
    >
      <div className="animate-pulse">
        <GlowingLogo size={64} />
      </div>
    </div>
  )
}
