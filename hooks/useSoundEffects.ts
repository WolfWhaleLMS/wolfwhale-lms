'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// ============================================================================
// Nintendo Zelda/Mario retro game sounds via Web Audio API
// All sounds are synthesized using OscillatorNode + GainNode — no audio files.
// Square and triangle waves give the authentic 8-bit retro feel.
// ============================================================================

function createAudioContext() {
  if (typeof window === 'undefined') return null
  return new (window.AudioContext || (window as any).webkitAudioContext)()
}

export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const [volume, setVolume] = useState(1.0)
  const [muted, setMuted] = useState(false)

  function getCtx() {
    if (!ctxRef.current) {
      ctxRef.current = createAudioContext()
      if (ctxRef.current) {
        masterGainRef.current = ctxRef.current.createGain()
        masterGainRef.current.connect(ctxRef.current.destination)
      }
    }
    // Resume if suspended (browser autoplay policy)
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }

  function getMaster() {
    getCtx() // ensure created
    return masterGainRef.current
  }

  // Keep master gain in sync with volume/mute state
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = muted ? 0 : volume
    }
  }, [volume, muted])

  // --------------------------------------------------------------------------
  // 1. playClick — Zelda menu cursor move
  //    Two rapid ascending square wave tones (~800Hz -> ~1200Hz), 50ms total
  // --------------------------------------------------------------------------
  const playClick = useCallback(() => {
    const ctx = getCtx()
    const master = getMaster()
    if (!ctx || !master) return
    const t = ctx.currentTime

    // First chirp: 800Hz, quick attack
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.connect(gain1)
    gain1.connect(master)
    osc1.type = 'square'
    osc1.frequency.setValueAtTime(800, t)
    osc1.frequency.setValueAtTime(1000, t + 0.015)
    gain1.gain.setValueAtTime(0.10, t)
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.025)
    osc1.start(t)
    osc1.stop(t + 0.025)

    // Second chirp: 1200Hz, slightly delayed
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.connect(gain2)
    gain2.connect(master)
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(1200, t + 0.02)
    gain2.gain.setValueAtTime(0, t)
    gain2.gain.setValueAtTime(0.10, t + 0.02)
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
    osc2.start(t + 0.02)
    osc2.stop(t + 0.05)
  }, [])

  // --------------------------------------------------------------------------
  // 2. playSuccess — Mario coin collect sound
  //    Two ascending tones: B5 (988Hz) 80ms then E6 (1319Hz) 120ms, square wave
  // --------------------------------------------------------------------------
  const playSuccess = useCallback(() => {
    const ctx = getCtx()
    const master = getMaster()
    if (!ctx || !master) return
    const t = ctx.currentTime

    // First note: B5
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.connect(gain1)
    gain1.connect(master)
    osc1.type = 'square'
    osc1.frequency.setValueAtTime(988, t)
    gain1.gain.setValueAtTime(0.12, t)
    gain1.gain.setValueAtTime(0.12, t + 0.06)
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
    osc1.start(t)
    osc1.stop(t + 0.08)

    // Second note: E6 — the iconic higher tone
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.connect(gain2)
    gain2.connect(master)
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(1319, t + 0.08)
    gain2.gain.setValueAtTime(0, t)
    gain2.gain.setValueAtTime(0.12, t + 0.08)
    gain2.gain.setValueAtTime(0.10, t + 0.14)
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.20)
    osc2.start(t + 0.08)
    osc2.stop(t + 0.20)
  }, [])

  // --------------------------------------------------------------------------
  // 3. playError — Zelda "can't do that" buzz
  //    Low square wave ~150Hz with pitch wobble, 200ms, quick fade
  // --------------------------------------------------------------------------
  const playError = useCallback(() => {
    const ctx = getCtx()
    const master = getMaster()
    if (!ctx || !master) return
    const t = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(master)
    osc.type = 'square'
    // Low buzzy tone with pitch wobble
    osc.frequency.setValueAtTime(150, t)
    osc.frequency.setValueAtTime(120, t + 0.05)
    osc.frequency.setValueAtTime(150, t + 0.10)
    osc.frequency.setValueAtTime(110, t + 0.15)
    gain.gain.setValueAtTime(0.12, t)
    gain.gain.setValueAtTime(0.10, t + 0.10)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.20)
    osc.start(t)
    osc.stop(t + 0.20)

    // Second dissonant tone for extra buzz
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.connect(gain2)
    gain2.connect(master)
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(180, t)
    osc2.frequency.setValueAtTime(140, t + 0.05)
    osc2.frequency.setValueAtTime(170, t + 0.10)
    gain2.gain.setValueAtTime(0.08, t)
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.18)
    osc2.start(t)
    osc2.stop(t + 0.18)
  }, [])

  // --------------------------------------------------------------------------
  // 4. playToggle — Mario pipe/warp sound
  //    Quick descending then ascending sweep: 600Hz -> 300Hz -> 500Hz, 150ms
  // --------------------------------------------------------------------------
  const playToggle = useCallback(() => {
    const ctx = getCtx()
    const master = getMaster()
    if (!ctx || !master) return
    const t = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(master)
    osc.type = 'sine'
    // Descend then ascend
    osc.frequency.setValueAtTime(600, t)
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.07)
    osc.frequency.exponentialRampToValueAtTime(500, t + 0.15)
    gain.gain.setValueAtTime(0.12, t)
    gain.gain.setValueAtTime(0.10, t + 0.08)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16)
    osc.start(t)
    osc.stop(t + 0.16)
  }, [])

  // --------------------------------------------------------------------------
  // 5. playNotification — Zelda "secret found" jingle
  //    Three ascending notes: C5 -> E5 -> G5, each 80ms, triangle wave
  // --------------------------------------------------------------------------
  const playNotification = useCallback(() => {
    const ctx = getCtx()
    const master = getMaster()
    if (!ctx || !master) return
    const t = ctx.currentTime

    const notes = [
      { freq: 523, start: 0 },      // C5
      { freq: 659, start: 0.09 },    // E5
      { freq: 784, start: 0.18 },    // G5
    ]

    notes.forEach(({ freq, start }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(master)
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, t + start)
      gain.gain.setValueAtTime(0, t + start)
      gain.gain.linearRampToValueAtTime(0.13, t + start + 0.01)
      gain.gain.setValueAtTime(0.13, t + start + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, t + start + 0.12)
      osc.start(t + start)
      osc.stop(t + start + 0.12)
    })
  }, [])

  // --------------------------------------------------------------------------
  // 6. playNavigate — Mario jump sound
  //    Quick ascending sweep: square wave 200Hz -> 800Hz, 100ms with decay
  // --------------------------------------------------------------------------
  const playNavigate = useCallback(() => {
    const ctx = getCtx()
    const master = getMaster()
    if (!ctx || !master) return
    const t = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(master)
    osc.type = 'square'
    osc.frequency.setValueAtTime(200, t)
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.06)
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.10)
    gain.gain.setValueAtTime(0.10, t)
    gain.gain.setValueAtTime(0.08, t + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.10)
    osc.start(t)
    osc.stop(t + 0.10)
  }, [])

  // --------------------------------------------------------------------------
  // 7. playHover — Subtle retro hover tick (light square blip)
  // --------------------------------------------------------------------------
  const playHover = useCallback(() => {
    const ctx = getCtx()
    const master = getMaster()
    if (!ctx || !master) return
    const t = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(master)
    osc.type = 'square'
    osc.frequency.setValueAtTime(1400, t)
    gain.gain.setValueAtTime(0.03, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02)
    osc.start(t)
    osc.stop(t + 0.02)
  }, [])

  // --------------------------------------------------------------------------
  // Master volume controls
  // --------------------------------------------------------------------------
  const setMasterVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v))
    setVolume(clamped)
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = muted ? 0 : clamped
    }
  }, [muted])

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      if (masterGainRef.current) {
        masterGainRef.current.gain.value = next ? 0 : volume
      }
      return next
    })
  }, [volume])

  // Cleanup
  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.close()
        ctxRef.current = null
        masterGainRef.current = null
      }
    }
  }, [])

  return useMemo(
    () => ({
      playClick,
      playSuccess,
      playError,
      playToggle,
      playNotification,
      playNavigate,
      playHover,
      volume,
      muted,
      setMasterVolume,
      toggleMute,
    }),
    [playClick, playSuccess, playError, playToggle, playNotification, playNavigate, playHover, volume, muted, setMasterVolume, toggleMute]
  )
}
