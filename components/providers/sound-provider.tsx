'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useSoundEffects } from '@/hooks/useSoundEffects'

type SoundContextType = ReturnType<typeof useSoundEffects>

const SoundContext = createContext<SoundContextType | null>(null)

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const sounds = useSoundEffects()

  // Global click event listener for all interactive elements
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement

      // Find the closest interactive element
      const interactive = target.closest('button, a[href], [role="button"]')

      if (interactive) {
        // Skip if the element has a data-no-sound attribute
        if (interactive.hasAttribute('data-no-sound')) {
          return
        }

        // Play click sound for all interactive elements
        sounds.playClick()
      }
    }

    // Add listener to document
    document.addEventListener('click', handleClick, { capture: true })

    return () => {
      document.removeEventListener('click', handleClick, { capture: true })
    }
  }, [sounds])

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
