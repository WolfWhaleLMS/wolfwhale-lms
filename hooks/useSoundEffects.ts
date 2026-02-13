'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// ============================================================================
// Soft Futuristic UI Sounds via Web Audio API
// All sounds use sine waves with smooth attack/release envelopes.
// Lower frequencies, gentle fades, and subtle layering create a warm,
// futuristic hum aesthetic — no harsh edges or retro clicks.
// ============================================================================

function createAudioContext() {
  if (typeof window === 'undefined') return null
  return new (window.AudioContext || (window as any).webkitAudioContext)()
}

export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const [volume, setVolume] = useState(0.6)
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
  // 1. playClick — Soft tap / gentle blip
  //    A single sine tone at ~520Hz with a smooth 10ms fade-in and 60ms
  //    fade-out. Feels like tapping glass with a fingertip.
  // --------------------------------------------------------------------------
  const playClick = useCallback(() => {
    const ctx = getCtx()
    const master = getMaster()
    if (!ctx || !master) return
    const t = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(master)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(520, t)
    osc.frequency.exponentialRampToValueAtTime(480, t + 0.08)
    // Smooth envelope: fade in, hold briefly, long fade out
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.linearRampToValueAtTime(0.045, t + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08)
    osc.start(t)
    osc.stop(t + 0.09)
  }, [])

  // --------------------------------------------------------------------------
  // 2. playSuccess — Gentle ascending chime
  //    Two overlapping sine tones that glide upward with long, warm tails.
  //    A soft harmonic shimmer on top. Feels like a quiet "ding" of approval.
  // --------------------------------------------------------------------------
  const playSuccess = useCallback(() => {
    const ctx = getCtx()
    const master = getMaster()
    if (!ctx || !master) return
    const t = ctx.currentTime

    // First tone: warm fundamental, gentle rise
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.connect(gain1)
    gain1.connect(master)
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(440, t)
    osc1.frequency.exponentialRampToValueAtTime(520, t + 0.12)
    gain1.gain.setValueAtTime(0.0001, t)
    gain1.gain.linearRampToValueAtTime(0.04, t + 0.02)
    gain1.gain.setValueAtTime(0.04, t + 0.08)
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.25)
    osc1.start(t)
    osc1.stop(t + 0.26)

    // Second tone: higher harmonic, delayed entrance
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.connect(gain2)
    gain2.connect(master)
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(660, t + 0.07)
    osc2.frequency.exponentialRampToValueAtTime(784, t + 0.2)
    gain2.gain.setValueAtTime(0.0001, t + 0.07)
    gain2.gain.linearRampToValueAtTime(0.03, t + 0.1)
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
    osc2.start(t + 0.07)
    osc2.stop(t + 0.36)

    // Subtle shimmer: very quiet high tone for sparkle
    const osc3 = ctx.createOscillator()
    const gain3 = ctx.createGain()
    osc3.connect(gain3)
    gain3.connect(master)
    osc3.type = 'sine'
    osc3.frequency.setValueAtTime(1320, t + 0.1)
    gain3.gain.setValueAtTime(0.0001, t + 0.1)
    gain3.gain.linearRampToValueAtTime(0.012, t + 0.14)
    gain3.gain.exponentialRampToValueAtTime(0.0001, t + 0.4)
    osc3.start(t + 0.1)
    osc3.stop(t + 0.41)
  }, [])

  // --------------------------------------------------------------------------
  // 3. playError — Soft low hum / gentle warning
  //    Two low sine tones with a subtle dissonance, creating a muted
  //    "hmm" feel rather than a harsh buzz. Smooth fade in and out.
  // --------------------------------------------------------------------------
  const playError = useCallback(() => {
    const ctx = getCtx()
    const master = getMaster()
    if (!ctx || !master) return
    const t = ctx.currentTime

    // Primary low tone
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.connect(gain1)
    gain1.connect(master)
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(180, t)
    osc1.frequency.exponentialRampToValueAtTime(150, t + 0.25)
    gain1.gain.setValueAtTime(0.0001, t)
    gain1.gain.linearRampToValueAtTime(0.05, t + 0.03)
    gain1.gain.setValueAtTime(0.05, t + 0.12)
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.3)
    osc1.start(t)
    osc1.stop(t + 0.31)

    // Slightly detuned second tone for gentle dissonance
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.connect(gain2)
    gain2.connect(master)
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(195, t)
    osc2.frequency.exponentialRampToValueAtTime(160, t + 0.25)
    gain2.gain.setValueAtTime(0.0001, t)
    gain2.gain.linearRampToValueAtTime(0.03, t + 0.04)
    gain2.gain.setValueAtTime(0.03, t + 0.1)
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.28)
    osc2.start(t)
    osc2.stop(t + 0.29)
  }, [])

  // --------------------------------------------------------------------------
  // 4. playToggle — Soft state-change hum
  //    A gentle sine sweep that dips down then settles, like a futuristic
  //    switch being toggled. Smooth and brief.
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
    // Gentle descend then settle
    osc.frequency.setValueAtTime(480, t)
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.06)
    osc.frequency.exponentialRampToValueAtTime(380, t + 0.14)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.linearRampToValueAtTime(0.04, t + 0.01)
    gain.gain.setValueAtTime(0.035, t + 0.06)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
    osc.start(t)
    osc.stop(t + 0.19)
  }, [])

  // --------------------------------------------------------------------------
  // 5. playNotification — Gentle two-tone ping
  //    Two soft sine notes a fifth apart, each with smooth attack and long
  //    release. Like a distant wind chime catching a breeze.
  // --------------------------------------------------------------------------
  const playNotification = useCallback(() => {
    const ctx = getCtx()
    const master = getMaster()
    if (!ctx || !master) return
    const t = ctx.currentTime

    const notes = [
      { freq: 440, start: 0, duration: 0.25 },       // A4
      { freq: 660, start: 0.12, duration: 0.3 },      // E5
    ]

    notes.forEach(({ freq, start, duration }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(master)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t + start)
      // Smooth envelope
      gain.gain.setValueAtTime(0.0001, t + start)
      gain.gain.linearRampToValueAtTime(0.035, t + start + 0.02)
      gain.gain.setValueAtTime(0.03, t + start + duration * 0.4)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + start + duration)
      osc.start(t + start)
      osc.stop(t + start + duration + 0.01)
    })
  }, [])

  // --------------------------------------------------------------------------
  // 6. playNavigate — Subtle whoosh / soft sweep
  //    A filtered sine sweep that gently rises, evoking movement through
  //    space. Very brief and understated.
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
    osc.type = 'sine'
    // Gentle ascending sweep
    osc.frequency.setValueAtTime(280, t)
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.08)
    osc.frequency.exponentialRampToValueAtTime(380, t + 0.14)
    // Smooth envelope
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.linearRampToValueAtTime(0.035, t + 0.015)
    gain.gain.setValueAtTime(0.03, t + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14)
    osc.start(t)
    osc.stop(t + 0.15)

    // Add a very quiet breathy noise layer for the "whoosh" texture
    const bufferSize = ctx.sampleRate * 0.15
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1)
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.setValueAtTime(600, t)
    noiseFilter.frequency.exponentialRampToValueAtTime(1200, t + 0.1)
    noiseFilter.Q.value = 1.5

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.0001, t)
    noiseGain.gain.linearRampToValueAtTime(0.012, t + 0.02)
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.13)

    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(master)
    noise.start(t)
  }, [])

  // --------------------------------------------------------------------------
  // 7. playHover — Barely audible soft breath
  //    An extremely quiet, brief sine tone that gives tactile feedback
  //    without being intrusive. Almost felt more than heard.
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
    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, t)
    osc.frequency.exponentialRampToValueAtTime(560, t + 0.04)
    // Very quiet with smooth fade
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.linearRampToValueAtTime(0.015, t + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04)
    osc.start(t)
    osc.stop(t + 0.05)
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
