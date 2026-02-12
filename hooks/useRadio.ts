'use client'

import { useSyncExternalStore } from 'react'

// ---------------------------------------------------------------------------
// Track definitions
// ---------------------------------------------------------------------------

export interface RadioTrack {
  name: string
  src: string
  icon: string
}

export const RADIO_TRACKS: RadioTrack[] = [
  { name: 'Classical Piano',   src: '/mozart-piano.mp3',            icon: '\u{1F3B9}' },
  { name: 'Flute Relaxation',  src: '/radio/flute-relaxation.mp3',  icon: '\u{1FA88}' },
  { name: 'Lofi Beat',         src: '/radio/lofi-beat.mp3',         icon: '\u{1F3A7}' },
  { name: 'Violin Strings',    src: '/radio/violin-strings.mp3',    icon: '\u{1F3BB}' },
]

// ---------------------------------------------------------------------------
// Module-level singleton (persists across React unmounts / page navigations)
// ---------------------------------------------------------------------------

let globalAudio: HTMLAudioElement | null = null
let globalIsPlaying = false
let globalTrackIndex = 0
let globalVolume = 0.20
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((l) => l())
}

function getAudio(): HTMLAudioElement {
  if (!globalAudio && typeof window !== 'undefined') {
    globalAudio = new Audio()
    globalAudio.preload = 'none'
    globalAudio.volume = globalVolume
    globalAudio.src = RADIO_TRACKS[0].src

    // Auto-advance to next track when current ends (loops back to first)
    globalAudio.addEventListener('ended', () => {
      globalTrackIndex = (globalTrackIndex + 1) % RADIO_TRACKS.length
      globalAudio!.src = RADIO_TRACKS[globalTrackIndex].src
      globalAudio!.play().catch(() => {})
      notify()
    })
  }
  return globalAudio!
}

// ---------------------------------------------------------------------------
// Snapshot for useSyncExternalStore
// ---------------------------------------------------------------------------

interface RadioSnapshot {
  isPlaying: boolean
  trackIndex: number
  volume: number
}

let snapshotCache: RadioSnapshot = {
  isPlaying: globalIsPlaying,
  trackIndex: globalTrackIndex,
  volume: globalVolume,
}

function getStableSnapshot(): RadioSnapshot {
  if (
    snapshotCache.isPlaying !== globalIsPlaying ||
    snapshotCache.trackIndex !== globalTrackIndex ||
    snapshotCache.volume !== globalVolume
  ) {
    snapshotCache = {
      isPlaying: globalIsPlaying,
      trackIndex: globalTrackIndex,
      volume: globalVolume,
    }
  }
  return snapshotCache
}

const SERVER_SNAPSHOT: RadioSnapshot = { isPlaying: false, trackIndex: 0, volume: 0.20 }

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useRadio() {
  const snapshot = useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => { listeners.delete(cb) }
    },
    getStableSnapshot,
    () => SERVER_SNAPSHOT,
  )

  const toggle = () => {
    const audio = getAudio()
    if (globalIsPlaying) {
      audio.pause()
      globalIsPlaying = false
    } else {
      audio.play().catch(() => {})
      globalIsPlaying = true
    }
    notify()
  }

  const skip = () => {
    const audio = getAudio()
    globalTrackIndex = (globalTrackIndex + 1) % RADIO_TRACKS.length
    audio.src = RADIO_TRACKS[globalTrackIndex].src
    if (globalIsPlaying) {
      audio.play().catch(() => {})
    }
    notify()
  }

  const playTrack = (index: number) => {
    if (index < 0 || index >= RADIO_TRACKS.length) return
    const audio = getAudio()
    globalTrackIndex = index
    audio.src = RADIO_TRACKS[index].src
    audio.play().catch(() => {})
    globalIsPlaying = true
    notify()
  }

  const setVolume = (vol: number) => {
    globalVolume = Math.max(0, Math.min(1, vol))
    const audio = getAudio()
    audio.volume = globalVolume
    notify()
  }

  return {
    isPlaying: snapshot.isPlaying,
    currentTrack: RADIO_TRACKS[snapshot.trackIndex],
    trackIndex: snapshot.trackIndex,
    volume: snapshot.volume,
    toggle,
    skip,
    playTrack,
    setVolume,
  }
}
