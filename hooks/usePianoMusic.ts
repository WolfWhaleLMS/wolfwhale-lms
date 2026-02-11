'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Plays a copyright-free recording of Mozart's Piano Sonata No. 16 in C Major,
 * K. 545 "Sonata Facile" - I. Allegro on loop.
 *
 * Recording: Public domain performance from the Internet Archive / Musopen collection.
 * Mozart's compositions (1756-1791) are in the public domain worldwide.
 */
export function usePianoMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isPlayingRef = useRef(false)

  const getAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current

    const audio = new Audio('/mozart-piano.mp3')
    audio.loop = true
    audio.volume = 0.15
    audio.preload = 'auto'

    audio.addEventListener('ended', () => {
      // Fallback loop in case loop attribute doesn't work
      audio.currentTime = 0
      audio.play().catch(() => {})
    })

    audioRef.current = audio
    return audio
  }, [])

  const start = useCallback(() => {
    if (isPlayingRef.current) return

    const audio = getAudio()
    audio.play().then(() => {
      isPlayingRef.current = true
      setIsPlaying(true)
    }).catch(() => {
      // Autoplay blocked — will retry on next user interaction
    })
  }, [getAudio])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    isPlayingRef.current = false
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (isPlayingRef.current) {
      stop()
    } else {
      start()
    }
  }, [start, stop])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }
    }
  }, [])

  return { isPlaying, toggle, start, stop }
}
