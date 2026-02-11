'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'

// Use Web Audio API to generate simple retro/video-game-like synth sounds
// No external audio files needed!

function createAudioContext() {
  if (typeof window === 'undefined') return null
  return new (window.AudioContext || (window as any).webkitAudioContext)()
}

export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null)

  function getCtx() {
    if (!ctxRef.current) {
      ctxRef.current = createAudioContext()
    }
    return ctxRef.current
  }

  // Quick "click" sound — retro button press with dual oscillator
  const playClick = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime

    // Primary tone — bright chirp
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.type = 'square'
    osc1.frequency.setValueAtTime(880, t)
    osc1.frequency.exponentialRampToValueAtTime(1320, t + 0.04)
    gain1.gain.setValueAtTime(0.06, t)
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
    osc1.start(t)
    osc1.stop(t + 0.08)

    // Sub tone — body
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(440, t)
    osc2.frequency.exponentialRampToValueAtTime(660, t + 0.05)
    gain2.gain.setValueAtTime(0.08, t)
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.1)
    osc2.start(t)
    osc2.stop(t + 0.1)
  }, [])

  // "Success" sound — triumphant ascending arpeggio
  const playSuccess = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    const notes = [523, 659, 784, 1047] // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = i < 3 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, t + i * 0.08)
      gain.gain.setValueAtTime(0, t + i * 0.08)
      gain.gain.linearRampToValueAtTime(0.1, t + i * 0.08 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.15)
      osc.start(t + i * 0.08)
      osc.stop(t + i * 0.08 + 0.15)
    })
  }, [])

  // "Navigate" sound — quick whoosh blip
  const playNavigate = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(500, t)
    osc.frequency.exponentialRampToValueAtTime(1000, t + 0.06)
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.1)
    gain.gain.setValueAtTime(0.07, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
    osc.start(t)
    osc.stop(t + 0.12)
  }, [])

  // "Hover" sound — subtle glass tap
  const playHover = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, t)
    osc.frequency.exponentialRampToValueAtTime(1400, t + 0.02)
    gain.gain.setValueAtTime(0.02, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03)
    osc.start(t)
    osc.stop(t + 0.03)
  }, [])

  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.close()
        ctxRef.current = null
      }
    }
  }, [])

  return useMemo(
    () => ({ playClick, playSuccess, playNavigate, playHover }),
    [playClick, playSuccess, playNavigate, playHover]
  )
}
