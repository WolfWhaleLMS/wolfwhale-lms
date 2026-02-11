'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Plays a copyright-free recording of Mozart's Piano Sonata No. 16 in C Major,
 * K. 545 "Sonata Facile" - I. Allegro on loop.
 *
 * Recording: Public domain performance from the Internet Archive / Musopen collection.
 * Mozart's compositions (1756-1791) are in the public domain worldwide.
 *
 * Uses a global singleton so the audio persists across page navigations.
 */

// Global singleton — survives React component unmounts and re-mounts
let globalAudio: HTMLAudioElement | null = null
let globalIsPlaying = false

function getGlobalAudio(): HTMLAudioElement {
  if (globalAudio) return globalAudio

  const audio = new Audio('/mozart-piano.mp3')
  audio.loop = true
  audio.volume = 0.15
  audio.preload = 'auto'

  // Fallback loop
  audio.addEventListener('ended', () => {
    audio.currentTime = 0
    audio.play().catch(() => {})
  })

  globalAudio = audio
  return audio
}

export function usePianoMusic() {
  const [isPlaying, setIsPlaying] = useState(globalIsPlaying)
  const syncRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Sync local state with global state periodically
  useEffect(() => {
    setIsPlaying(globalIsPlaying)
    syncRef.current = setInterval(() => {
      setIsPlaying(globalIsPlaying)
    }, 500)
    return () => {
      if (syncRef.current) clearInterval(syncRef.current)
    }
  }, [])

  const start = useCallback(() => {
    if (globalIsPlaying) return

    const audio = getGlobalAudio()
    audio.play().then(() => {
      globalIsPlaying = true
      setIsPlaying(true)
    }).catch(() => {
      // Autoplay blocked — will retry on next user interaction
    })
  }, [])

  const stop = useCallback(() => {
    const audio = globalAudio
    if (!audio) return

    audio.pause()
    globalIsPlaying = false
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (globalIsPlaying) {
      stop()
    } else {
      start()
    }
  }, [start, stop])

  // Do NOT clean up globalAudio on unmount — that's the whole point
  return { isPlaying, toggle, start, stop }
}
