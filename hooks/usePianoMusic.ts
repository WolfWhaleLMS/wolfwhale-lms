'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Note frequency map (Hz)
const NOTES: Record<string, number> = {
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50,
}

// BPM and timing
const BPM = 72
const BEAT_DURATION = 60 / BPM // ~0.833 seconds per beat

// Right hand melody: note name (or null for rest) and duration in beats
const MELODY: { note: string | null; beats: number }[] = [
  // Bar 1 - gentle opening
  { note: 'E5', beats: 1 },
  { note: 'D5', beats: 0.5 },
  { note: 'C5', beats: 0.5 },
  { note: 'D5', beats: 1 },
  { note: 'E5', beats: 1 },
  // Bar 2
  { note: 'E5', beats: 1 },
  { note: 'E5', beats: 1 },
  { note: 'D5', beats: 1 },
  { note: 'D5', beats: 1 },
  // Bar 3
  { note: 'E5', beats: 1 },
  { note: 'G5', beats: 1 },
  { note: 'G5', beats: 1 },
  { note: 'F5', beats: 1 },
  // Bar 4
  { note: 'E5', beats: 1 },
  { note: 'D5', beats: 0.5 },
  { note: 'C5', beats: 0.5 },
  { note: 'D5', beats: 1 },
  { note: 'E5', beats: 1 },
  // Bar 5
  { note: 'E5', beats: 1 },
  { note: 'E5', beats: 0.5 },
  { note: 'D5', beats: 0.5 },
  { note: 'D5', beats: 1 },
  { note: 'E5', beats: 1 },
  // Bar 6
  { note: 'D5', beats: 1 },
  { note: 'C5', beats: 1 },
  { note: 'C5', beats: 2 },
  // Rest before loop
  { note: null, beats: 2 },
]

// Left hand Alberti bass pattern (broken chords)
// Each chord spans 4 beats, with 16th-note-like subdivisions
const BASS_CHORDS: { notes: string[]; beats: number }[] = [
  // Bar 1: C major
  { notes: ['C3', 'E3', 'G3', 'E3'], beats: 4 },
  // Bar 2: C major
  { notes: ['C3', 'E3', 'G3', 'E3'], beats: 4 },
  // Bar 3: C major -> F major feel
  { notes: ['C3', 'E3', 'G3', 'E3'], beats: 2 },
  { notes: ['F3', 'A3', 'C4', 'A3'], beats: 2 },
  // Bar 4: G major -> C major
  { notes: ['G3', 'B3', 'D4', 'B3'], beats: 2 },
  { notes: ['C3', 'E3', 'G3', 'E3'], beats: 2 },
  // Bar 5: C major -> G major
  { notes: ['C3', 'E3', 'G3', 'E3'], beats: 2 },
  { notes: ['G3', 'B3', 'D4', 'B3'], beats: 2 },
  // Bar 6: F major -> C major
  { notes: ['F3', 'A3', 'C4', 'A3'], beats: 2 },
  { notes: ['C3', 'E3', 'G3', 'E3'], beats: 2 },
  // Rest
  { notes: [], beats: 2 },
]

/**
 * Play a single piano note using additive synthesis with harmonics and ADSR envelope.
 */
function playPianoNote(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  startTime: number,
  duration: number,
  velocity = 0.5
) {
  const harmonics = [1, 2, 3, 4, 5]
  const gains = [1, 0.5, 0.25, 0.125, 0.06]

  harmonics.forEach((h, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(dest)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq * h, startTime)

    // ADSR envelope
    const peakGain = velocity * gains[i] * 0.08
    const sustainGain = peakGain * 0.3
    const attackEnd = startTime + 0.01
    const decayEnd = startTime + 0.1
    const releaseStart = startTime + Math.max(duration - 0.1, 0.12)
    const releaseEnd = startTime + duration

    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(peakGain, attackEnd) // attack
    gain.gain.exponentialRampToValueAtTime(Math.max(sustainGain, 0.0001), decayEnd) // decay to sustain
    gain.gain.setValueAtTime(Math.max(sustainGain, 0.0001), releaseStart) // hold sustain
    gain.gain.exponentialRampToValueAtTime(0.0001, releaseEnd) // release

    osc.start(startTime)
    osc.stop(releaseEnd + 0.1)
  })
}

/**
 * Create a simple reverb-like effect using delay feedback.
 */
function createReverbEffect(ctx: AudioContext): { input: AudioNode; output: AudioNode } {
  const input = ctx.createGain()
  const output = ctx.createGain()

  // Dry path
  const dry = ctx.createGain()
  dry.gain.setValueAtTime(0.8, ctx.currentTime)
  input.connect(dry)
  dry.connect(output)

  // Wet path: short delay with feedback for reverb-like ambience
  const delays = [0.03, 0.07, 0.13]
  const feedbackGains = [0.3, 0.2, 0.15]

  delays.forEach((delayTime, i) => {
    const delay = ctx.createDelay(1)
    delay.delayTime.setValueAtTime(delayTime, ctx.currentTime)

    const feedback = ctx.createGain()
    feedback.gain.setValueAtTime(feedbackGains[i], ctx.currentTime)

    const wet = ctx.createGain()
    wet.gain.setValueAtTime(0.15, ctx.currentTime)

    input.connect(delay)
    delay.connect(feedback)
    feedback.connect(delay) // feedback loop
    delay.connect(wet)
    wet.connect(output)
  })

  return { input, output }
}

export function usePianoMusic() {
  const [isPlaying, setIsPlaying] = useState(false)

  const ctxRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const reverbInputRef = useRef<AudioNode | null>(null)
  const schedulerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isPlayingRef = useRef(false)

  // Scheduling state
  const melodyIndexRef = useRef(0)
  const bassChordIndexRef = useRef(0)
  const bassNoteInChordRef = useRef(0)
  const melodyTimeRef = useRef(0)
  const bassTimeRef = useRef(0)
  const bassChordStartTimeRef = useRef(0)

  const LOOKAHEAD = 0.1 // seconds to look ahead for scheduling
  const SCHEDULE_INTERVAL = 50 // ms between scheduler calls

  const initAudio = useCallback(() => {
    if (ctxRef.current) return

    const ctx = new AudioContext()
    ctxRef.current = ctx

    // Master gain (soft ambient volume)
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.15, ctx.currentTime)
    masterGain.connect(ctx.destination)
    masterGainRef.current = masterGain

    // Reverb effect
    const reverb = createReverbEffect(ctx)
    reverb.output.connect(masterGain)
    reverbInputRef.current = reverb.input
  }, [])

  const resetSchedulingState = useCallback(() => {
    melodyIndexRef.current = 0
    bassChordIndexRef.current = 0
    bassNoteInChordRef.current = 0
    melodyTimeRef.current = 0
    bassTimeRef.current = 0
    bassChordStartTimeRef.current = 0
  }, [])

  const startScheduler = useCallback(() => {
    const ctx = ctxRef.current
    const dest = reverbInputRef.current
    if (!ctx || !dest) return

    // Set the start time offset
    const startOffset = ctx.currentTime + 0.05
    melodyTimeRef.current = startOffset
    bassTimeRef.current = startOffset
    bassChordStartTimeRef.current = startOffset

    const scheduler = setInterval(() => {
      if (!isPlayingRef.current || !ctxRef.current) return

      const currentCtx = ctxRef.current
      const currentDest = reverbInputRef.current
      if (!currentDest) return

      const scheduleUntil = currentCtx.currentTime + LOOKAHEAD

      // Schedule melody notes
      while (melodyTimeRef.current < scheduleUntil) {
        const melodyEntry = MELODY[melodyIndexRef.current]
        const noteDuration = melodyEntry.beats * BEAT_DURATION

        if (melodyEntry.note && NOTES[melodyEntry.note]) {
          playPianoNote(
            currentCtx,
            currentDest,
            NOTES[melodyEntry.note],
            melodyTimeRef.current,
            noteDuration,
            0.5
          )
        }

        melodyTimeRef.current += noteDuration
        melodyIndexRef.current = (melodyIndexRef.current + 1) % MELODY.length

        // Reset bass when melody loops
        if (melodyIndexRef.current === 0) {
          bassChordIndexRef.current = 0
          bassNoteInChordRef.current = 0
          bassTimeRef.current = melodyTimeRef.current
          bassChordStartTimeRef.current = melodyTimeRef.current
        }
      }

      // Schedule bass notes (Alberti pattern)
      while (bassTimeRef.current < scheduleUntil) {
        const chordEntry = BASS_CHORDS[bassChordIndexRef.current]

        if (!chordEntry || chordEntry.notes.length === 0) {
          // Rest or end of bass pattern - advance time
          if (chordEntry) {
            bassTimeRef.current += chordEntry.beats * BEAT_DURATION
          }
          bassChordIndexRef.current = (bassChordIndexRef.current + 1) % BASS_CHORDS.length
          bassNoteInChordRef.current = 0
          bassChordStartTimeRef.current = bassTimeRef.current
          continue
        }

        const noteIndex = bassNoteInChordRef.current
        const noteName = chordEntry.notes[noteIndex % chordEntry.notes.length]

        // Each bass note is a subdivision: divide the chord's total beats evenly among repeated pattern cycles
        const totalChordDuration = chordEntry.beats * BEAT_DURATION
        const notesPerCycle = chordEntry.notes.length
        const totalNotes = Math.floor(chordEntry.beats / 0.5) * (notesPerCycle / 4) * 4
        // Simplify: play the pattern repeating to fill the chord duration, each note = 0.5 beats
        const singleNoteDuration = 0.5 * BEAT_DURATION
        const maxNotes = Math.round(totalChordDuration / singleNoteDuration)

        if (noteIndex < maxNotes && NOTES[noteName]) {
          playPianoNote(
            currentCtx,
            currentDest,
            NOTES[noteName],
            bassTimeRef.current,
            singleNoteDuration * 0.9,
            0.25 // softer bass
          )
        }

        bassTimeRef.current += singleNoteDuration
        bassNoteInChordRef.current++

        if (bassNoteInChordRef.current >= maxNotes) {
          bassChordIndexRef.current = (bassChordIndexRef.current + 1) % BASS_CHORDS.length
          bassNoteInChordRef.current = 0
          bassChordStartTimeRef.current = bassTimeRef.current
        }
      }
    }, SCHEDULE_INTERVAL)

    schedulerRef.current = scheduler
  }, [])

  const stop = useCallback(() => {
    isPlayingRef.current = false
    setIsPlaying(false)

    if (schedulerRef.current) {
      clearInterval(schedulerRef.current)
      schedulerRef.current = null
    }

    resetSchedulingState()
  }, [resetSchedulingState])

  const start = useCallback(() => {
    initAudio()

    const ctx = ctxRef.current
    if (!ctx) return

    // Resume if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    if (isPlayingRef.current) return

    isPlayingRef.current = true
    setIsPlaying(true)

    resetSchedulingState()
    startScheduler()
  }, [initAudio, resetSchedulingState, startScheduler])

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
      if (schedulerRef.current) {
        clearInterval(schedulerRef.current)
        schedulerRef.current = null
      }
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {})
        ctxRef.current = null
      }
    }
  }, [])

  return { isPlaying, toggle, start, stop }
}
