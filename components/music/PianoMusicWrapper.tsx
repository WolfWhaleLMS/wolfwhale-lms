'use client'

import { useEffect } from 'react'
import { Music, VolumeX } from 'lucide-react'
import { usePianoMusic } from '@/hooks/usePianoMusic'

/**
 * Client wrapper that enables piano music playback and shows a toggle button.
 * Used on pages outside the (auth) route group (e.g. /info) that should share
 * the same background music experience as the login page.
 *
 * The usePianoMusic hook uses a global singleton, so the audio continues
 * seamlessly when navigating between pages that both use this wrapper.
 */
export function PianoMusicWrapper({ children }: { children: React.ReactNode }) {
  const { isPlaying, toggle, start } = usePianoMusic()

  // Start music on first user interaction (mirrors auth layout behaviour)
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
    <>
      {children}

      {/* Music Toggle — matches the auth layout button */}
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
    </>
  )
}
