'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useSoundEffects } from '@/hooks/useSoundEffects'

type SoundContextType = ReturnType<typeof useSoundEffects>

const SoundContext = createContext<SoundContextType | null>(null)

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const sounds = useSoundEffects()
  const { playClick, playHover } = sounds

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const interactive = target.closest('button, a[href], [role="button"]')

      if (interactive) {
        if (interactive.hasAttribute('data-no-sound')) return
        playClick()
      }
    }

    let lastHover = 0
    function handleHover(e: MouseEvent) {
      const now = Date.now()
      if (now - lastHover < 100) return
      const target = e.target as HTMLElement
      const interactive = target.closest('button, a[href], [role="button"]')
      if (interactive && !interactive.hasAttribute('data-no-sound')) {
        lastHover = now
        playHover()
      }
    }

    document.addEventListener('click', handleClick, { capture: true })
    document.addEventListener('mouseenter', handleHover, { capture: true })

    return () => {
      document.removeEventListener('click', handleClick, { capture: true })
      document.removeEventListener('mouseenter', handleHover, { capture: true })
    }
  }, [playClick, playHover])

  return <SoundContext.Provider value={sounds}>{children}</SoundContext.Provider>
}

export function useSound() {
  const context = useContext(SoundContext)
  if (!context) {
    // Return no-ops if outside provider
    return {
      playClick: () => {},
      playSuccess: () => {},
      playNavigate: () => {},
      playHover: () => {},
    }
  }
  return context
}
