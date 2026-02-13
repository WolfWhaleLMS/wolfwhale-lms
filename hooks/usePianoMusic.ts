'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Ambient dubstep soundscape using the Web Audio API.
 *
 * Produces a chill, atmospheric audio backdrop (underwater / deep-space vibes):
 *   - Deep sub-bass sine oscillator with slow pitch drift
 *   - Filtered pad (sawtooth) with LFO-modulated low-pass for subtle wobble
 *   - High-frequency noise texture for air / atmosphere
 *   - Slow chord progression: Cm -> Ab -> Eb -> Bb (8-bar cycle per chord)
 *
 * Uses a global singleton so the audio persists across page navigations.
 * Exports the same API surface as the previous piano hook for backward compat.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AmbientEngine {
  ctx: AudioContext
  master: GainNode

  // Sub-bass
  subOsc: OscillatorNode
  subGain: GainNode
  subLfo: OscillatorNode
  subLfoGain: GainNode

  // Pad
  padOsc: OscillatorNode
  padFilter: BiquadFilterNode
  padGain: GainNode
  wobbleLfo: OscillatorNode
  wobbleLfoGain: GainNode

  // Noise texture
  noiseSource: AudioBufferSourceNode
  noiseFilter: BiquadFilterNode
  noiseGain: GainNode
  noiseDelay: DelayNode
  noiseDelayGain: GainNode

  // Chord scheduling
  chordInterval: ReturnType<typeof setInterval> | null
  chordIndex: number
}

// ---------------------------------------------------------------------------
// Globals
// ---------------------------------------------------------------------------

let engine: AmbientEngine | null = null
let globalIsPlaying = false

// Chord root frequencies (MIDI-ish). We use octave-2/3 range for warmth.
// Cm  -> C3  = 130.81
// Ab  -> Ab2 = 103.83
// Eb  -> Eb3 = 155.56
// Bb  -> Bb2 = 116.54
const CHORD_ROOTS = [130.81, 103.83, 155.56, 116.54]
// Pad plays the fifth above root for a fuller sound
const FIFTH_RATIO = 1.498  // ~perfect fifth

const CHORD_DURATION = 12 // seconds per chord
const MASTER_VOLUME = 0.18
const FADE_IN_TIME = 2.5  // seconds
const FADE_OUT_TIME = 1.5 // seconds

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a stereo noise buffer (2 seconds, loopable). */
function createNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const sampleRate = ctx.sampleRate
  const length = sampleRate * 2
  const buffer = ctx.createBuffer(2, length, sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1
    }
  }
  return buffer
}

/** Smoothly transition an oscillator frequency over `dur` seconds. */
function glideFreq(
  osc: OscillatorNode,
  target: number,
  dur: number,
  ctx: AudioContext,
) {
  osc.frequency.setTargetAtTime(target, ctx.currentTime, dur / 3)
}

// ---------------------------------------------------------------------------
// Engine lifecycle
// ---------------------------------------------------------------------------

function buildEngine(): AmbientEngine {
  const ctx = new AudioContext()

  // ---- Master gain --------------------------------------------------------
  const master = ctx.createGain()
  master.gain.value = 0 // start silent; fade-in handled separately
  master.connect(ctx.destination)

  // ---- Sub-bass -----------------------------------------------------------
  const subOsc = ctx.createOscillator()
  subOsc.type = 'sine'
  subOsc.frequency.value = CHORD_ROOTS[0] / 2 // one octave below root

  const subGain = ctx.createGain()
  subGain.gain.value = 0.55 // relative to master

  // Slow pitch-drift LFO for sub-bass
  const subLfo = ctx.createOscillator()
  subLfo.type = 'sine'
  subLfo.frequency.value = 0.07 // very slow drift

  const subLfoGain = ctx.createGain()
  subLfoGain.gain.value = 3 // +/- 3 Hz drift

  subLfo.connect(subLfoGain)
  subLfoGain.connect(subOsc.frequency)

  subOsc.connect(subGain)
  subGain.connect(master)

  // ---- Pad ----------------------------------------------------------------
  const padOsc = ctx.createOscillator()
  padOsc.type = 'sawtooth'
  padOsc.frequency.value = CHORD_ROOTS[0]

  const padFilter = ctx.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.value = 800
  padFilter.Q.value = 2

  const padGain = ctx.createGain()
  padGain.gain.value = 0.18

  // Wobble LFO on filter cutoff
  const wobbleLfo = ctx.createOscillator()
  wobbleLfo.type = 'sine'
  wobbleLfo.frequency.value = 0.8 // slow, atmospheric wobble

  const wobbleLfoGain = ctx.createGain()
  wobbleLfoGain.gain.value = 350 // cutoff sweeps ~450-1150 Hz

  wobbleLfo.connect(wobbleLfoGain)
  wobbleLfoGain.connect(padFilter.frequency)

  padOsc.connect(padFilter)
  padFilter.connect(padGain)
  padGain.connect(master)

  // ---- Noise texture ------------------------------------------------------
  const noiseBuffer = createNoiseBuffer(ctx)
  const noiseSource = ctx.createBufferSource()
  noiseSource.buffer = noiseBuffer
  noiseSource.loop = true

  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'bandpass'
  noiseFilter.frequency.value = 3500
  noiseFilter.Q.value = 0.5

  const noiseGain = ctx.createGain()
  noiseGain.gain.value = 0.06 // very subtle

  // Slight delay / echo on the noise for depth
  const noiseDelay = ctx.createDelay(1.0)
  noiseDelay.delayTime.value = 0.35

  const noiseDelayGain = ctx.createGain()
  noiseDelayGain.gain.value = 0.3 // echo level

  noiseSource.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(master)

  // Echo path: filter -> delay -> delayGain -> master
  noiseFilter.connect(noiseDelay)
  noiseDelay.connect(noiseDelayGain)
  noiseDelayGain.connect(master)

  // ---- Start all oscillators & sources ------------------------------------
  const now = ctx.currentTime
  subOsc.start(now)
  subLfo.start(now)
  padOsc.start(now)
  wobbleLfo.start(now)
  noiseSource.start(now)

  return {
    ctx,
    master,
    subOsc,
    subGain,
    subLfo,
    subLfoGain,
    padOsc,
    padFilter,
    padGain,
    wobbleLfo,
    wobbleLfoGain,
    noiseSource,
    noiseFilter,
    noiseGain,
    noiseDelay,
    noiseDelayGain,
    chordInterval: null,
    chordIndex: 0,
  }
}

/** Advance to the next chord with smooth glides. */
function advanceChord(e: AmbientEngine) {
  e.chordIndex = (e.chordIndex + 1) % CHORD_ROOTS.length
  const root = CHORD_ROOTS[e.chordIndex]

  // Sub-bass glides to one octave below root
  glideFreq(e.subOsc, root / 2, CHORD_DURATION * 0.4, e.ctx)

  // Pad glides to root
  glideFreq(e.padOsc, root, CHORD_DURATION * 0.5, e.ctx)

  // Slowly shift noise center frequency for variety
  const noiseCenters = [3500, 4200, 2800, 3800]
  e.noiseFilter.frequency.setTargetAtTime(
    noiseCenters[e.chordIndex],
    e.ctx.currentTime,
    CHORD_DURATION * 0.3,
  )

  // Slightly vary wobble speed per chord
  const wobbleSpeeds = [0.8, 1.1, 0.6, 1.4]
  e.wobbleLfo.frequency.setTargetAtTime(
    wobbleSpeeds[e.chordIndex],
    e.ctx.currentTime,
    2,
  )
}

function startChordCycle(e: AmbientEngine) {
  if (e.chordInterval) return
  e.chordInterval = setInterval(() => advanceChord(e), CHORD_DURATION * 1000)
}

function stopChordCycle(e: AmbientEngine) {
  if (e.chordInterval) {
    clearInterval(e.chordInterval)
    e.chordInterval = null
  }
}

// ---------------------------------------------------------------------------
// Public singleton controls
// ---------------------------------------------------------------------------

function getEngine(): AmbientEngine {
  if (engine) return engine
  engine = buildEngine()
  return engine
}

function fadeIn(e: AmbientEngine) {
  const now = e.ctx.currentTime
  e.master.gain.cancelScheduledValues(now)
  e.master.gain.setValueAtTime(e.master.gain.value, now)
  e.master.gain.linearRampToValueAtTime(MASTER_VOLUME, now + FADE_IN_TIME)
}

function fadeOut(e: AmbientEngine): Promise<void> {
  return new Promise((resolve) => {
    const now = e.ctx.currentTime
    e.master.gain.cancelScheduledValues(now)
    e.master.gain.setValueAtTime(e.master.gain.value, now)
    e.master.gain.linearRampToValueAtTime(0, now + FADE_OUT_TIME)
    setTimeout(resolve, FADE_OUT_TIME * 1000 + 50)
  })
}

function destroyEngine() {
  if (!engine) return
  stopChordCycle(engine)

  // Stop all sources (ignore errors if already stopped)
  try { engine.subOsc.stop() } catch { /* already stopped */ }
  try { engine.subLfo.stop() } catch { /* already stopped */ }
  try { engine.padOsc.stop() } catch { /* already stopped */ }
  try { engine.wobbleLfo.stop() } catch { /* already stopped */ }
  try { engine.noiseSource.stop() } catch { /* already stopped */ }

  // Disconnect everything
  engine.subLfoGain.disconnect()
  engine.subLfo.disconnect()
  engine.subOsc.disconnect()
  engine.subGain.disconnect()

  engine.wobbleLfoGain.disconnect()
  engine.wobbleLfo.disconnect()
  engine.padOsc.disconnect()
  engine.padFilter.disconnect()
  engine.padGain.disconnect()

  engine.noiseSource.disconnect()
  engine.noiseFilter.disconnect()
  engine.noiseGain.disconnect()
  engine.noiseDelay.disconnect()
  engine.noiseDelayGain.disconnect()

  engine.master.disconnect()

  // Close context
  engine.ctx.close().catch(() => {})

  engine = null
  globalIsPlaying = false
}

// ---------------------------------------------------------------------------
// React Hook
// ---------------------------------------------------------------------------

export function usePianoMusic() {
  const [isPlaying, setIsPlaying] = useState(globalIsPlaying)

  // Sync local state with global on mount
  useEffect(() => {
    setIsPlaying(globalIsPlaying)
  }, [])

  const start = useCallback(() => {
    if (globalIsPlaying) return

    const e = getEngine()

    // Resume suspended AudioContext (autoplay policy)
    const go = () => {
      fadeIn(e)
      startChordCycle(e)
      globalIsPlaying = true
      setIsPlaying(true)
    }

    if (e.ctx.state === 'suspended') {
      e.ctx.resume().then(go).catch(() => {
        // Autoplay blocked — will retry on next interaction
      })
    } else {
      go()
    }
  }, [])

  const stop = useCallback(async () => {
    if (!engine) return
    stopChordCycle(engine)
    await fadeOut(engine)

    // Suspend context to free CPU but keep nodes alive for resume
    engine.ctx.suspend().catch(() => {})

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

  /** Stop playback and tear down all audio resources entirely. */
  const destroy = useCallback(() => {
    destroyEngine()
    setIsPlaying(false)
  }, [])

  return { isPlaying, toggle, start, stop, destroy }
}
