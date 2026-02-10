'use client'

import { useRef, useCallback, useEffect } from 'react'

type AmbientType = 'silent' | 'lofi' | 'nature' | 'ocean' | 'whitenoise' | 'rainfall'

export function useAmbientSound() {
  const ctxRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<AudioNode[]>([])
  const activeRef = useRef<AmbientType>('silent')
  const gainRef = useRef<GainNode | null>(null)

  function getCtx() {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AudioContext()
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }

  function stopAll() {
    nodesRef.current.forEach(node => {
      try {
        if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
          node.stop()
        }
        node.disconnect()
      } catch {}
    })
    nodesRef.current = []
  }

  // White Noise: Use a ScriptProcessor/AudioWorklet with random values
  function startWhiteNoise(ctx: AudioContext, masterGain: GainNode) {
    const bufferSize = 2 * ctx.sampleRate
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    // Add a low-pass filter to make it softer
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 4000

    const gain = ctx.createGain()
    gain.gain.value = 0.15

    source.connect(filter)
    filter.connect(gain)
    gain.connect(masterGain)
    source.start()
    nodesRef.current.push(source, filter, gain)
  }

  // Ocean Waves: filtered noise with LFO modulating volume (wave rhythm)
  function startOcean(ctx: AudioContext, masterGain: GainNode) {
    const bufferSize = 2 * ctx.sampleRate
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    // Bandpass filter for ocean character
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 600
    filter.Q.value = 0.5

    // LFO to modulate volume (wave crashing rhythm)
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.12 // ~7 second wave cycle
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.08

    const gain = ctx.createGain()
    gain.gain.value = 0.12

    lfo.connect(lfoGain)
    lfoGain.connect(gain.gain)
    source.connect(filter)
    filter.connect(gain)
    gain.connect(masterGain)
    lfo.start()
    source.start()
    nodesRef.current.push(source, filter, lfo, lfoGain, gain)
  }

  // Rainfall: High-pass filtered noise with subtle variation
  function startRainfall(ctx: AudioContext, masterGain: GainNode) {
    const bufferSize = 2 * ctx.sampleRate
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const highpass = ctx.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = 2000

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 8000

    // Subtle volume variation
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.3
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.03

    const gain = ctx.createGain()
    gain.gain.value = 0.18

    lfo.connect(lfoGain)
    lfoGain.connect(gain.gain)
    source.connect(highpass)
    highpass.connect(lowpass)
    lowpass.connect(gain)
    gain.connect(masterGain)
    lfo.start()
    source.start()
    nodesRef.current.push(source, highpass, lowpass, lfo, lfoGain, gain)
  }

  // Nature: Layered with a bird-like chirp oscillator + soft wind noise
  function startNature(ctx: AudioContext, masterGain: GainNode) {
    // Wind layer (soft filtered noise)
    const bufferSize = 2 * ctx.sampleRate
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const windSource = ctx.createBufferSource()
    windSource.buffer = buffer
    windSource.loop = true

    const windFilter = ctx.createBiquadFilter()
    windFilter.type = 'bandpass'
    windFilter.frequency.value = 300
    windFilter.Q.value = 0.3

    const windLfo = ctx.createOscillator()
    windLfo.type = 'sine'
    windLfo.frequency.value = 0.08
    const windLfoGain = ctx.createGain()
    windLfoGain.gain.value = 0.04

    const windGain = ctx.createGain()
    windGain.gain.value = 0.08

    windLfo.connect(windLfoGain)
    windLfoGain.connect(windGain.gain)
    windSource.connect(windFilter)
    windFilter.connect(windGain)
    windGain.connect(masterGain)
    windLfo.start()
    windSource.start()
    nodesRef.current.push(windSource, windFilter, windLfo, windLfoGain, windGain)
  }

  // Lo-fi: Layered soft tones with wobble
  function startLofi(ctx: AudioContext, masterGain: GainNode) {
    // Pad chord (C major: C4, E4, G4)
    const freqs = [261.63, 329.63, 392.00]
    freqs.forEach(freq => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq

      // Gentle vibrato
      const vibrato = ctx.createOscillator()
      vibrato.type = 'sine'
      vibrato.frequency.value = 0.5 + Math.random() * 0.5
      const vibratoGain = ctx.createGain()
      vibratoGain.gain.value = 2
      vibrato.connect(vibratoGain)
      vibratoGain.connect(osc.frequency)

      const gain = ctx.createGain()
      gain.gain.value = 0.04

      osc.connect(gain)
      gain.connect(masterGain)
      osc.start()
      vibrato.start()
      nodesRef.current.push(osc, vibrato, vibratoGain, gain)
    })

    // Add subtle noise crackle (lo-fi vinyl feel)
    const bufferSize = ctx.sampleRate
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.99 ? 1 : 0.02)
    }
    const crackle = ctx.createBufferSource()
    crackle.buffer = buffer
    crackle.loop = true
    const crackleGain = ctx.createGain()
    crackleGain.gain.value = 0.03
    crackle.connect(crackleGain)
    crackleGain.connect(masterGain)
    crackle.start()
    nodesRef.current.push(crackle, crackleGain)
  }

  const play = useCallback((type: AmbientType) => {
    stopAll()
    activeRef.current = type
    if (type === 'silent') return

    const ctx = getCtx()
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.8
    masterGain.connect(ctx.destination)
    gainRef.current = masterGain
    nodesRef.current.push(masterGain)

    switch (type) {
      case 'whitenoise': startWhiteNoise(ctx, masterGain); break
      case 'ocean': startOcean(ctx, masterGain); break
      case 'rainfall': startRainfall(ctx, masterGain); break
      case 'nature': startNature(ctx, masterGain); break
      case 'lofi': startLofi(ctx, masterGain); break
    }
  }, [])

  const stop = useCallback(() => {
    stopAll()
    activeRef.current = 'silent'
  }, [])

  const setVolume = useCallback((vol: number) => {
    if (gainRef.current) {
      gainRef.current.gain.value = Math.max(0, Math.min(1, vol))
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAll()
      if (ctxRef.current) {
        ctxRef.current.close()
      }
    }
  }, [])

  return { play, stop, setVolume, activeType: activeRef }
}
