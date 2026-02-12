'use client'

import React, { useMemo, useState, useEffect } from 'react'

// ---------------------------------------------------------------------------
// All rays fan outward from a single source point at top-center (50%, 0%)
// Colors: warm golden-yellow, like real sunlight filtering through water
// ---------------------------------------------------------------------------

interface BeamConfig {
  id: number
  /** Angle in degrees — 0 = straight down, negative = left, positive = right */
  angle: number
  width: number
  opacity: number
  blur: number
  /** 'bright' = pure gold, 'soft' = warm amber, 'hot' = white-gold */
  tone: 'bright' | 'soft' | 'hot'
  animDuration: number
  animDelay: number
  swayDeg: number
  scaleMin: number
  scaleMax: number
  opacityMin: number
  opacityMax: number
}

const BEAM_CONFIGS: BeamConfig[] = [
  // Far left beams — angled strongly left
  { id: 0,  angle: -38, width: 140, opacity: 0.28, blur: 18, tone: 'soft',   animDuration: 22, animDelay: 0,   swayDeg: 6,  scaleMin: 0.8,  scaleMax: 1.3,  opacityMin: 0.20, opacityMax: 0.35 },
  { id: 1,  angle: -28, width: 50,  opacity: 0.38, blur: 10, tone: 'hot',    animDuration: 16, animDelay: -3,  swayDeg: 8,  scaleMin: 0.7,  scaleMax: 1.4,  opacityMin: 0.28, opacityMax: 0.48 },
  { id: 2,  angle: -20, width: 100, opacity: 0.32, blur: 14, tone: 'bright', animDuration: 25, animDelay: -7,  swayDeg: 5,  scaleMin: 0.85, scaleMax: 1.25, opacityMin: 0.24, opacityMax: 0.40 },
  // Center-left beams
  { id: 3,  angle: -12, width: 160, opacity: 0.40, blur: 20, tone: 'bright', animDuration: 28, animDelay: -1,  swayDeg: 4,  scaleMin: 0.9,  scaleMax: 1.2,  opacityMin: 0.30, opacityMax: 0.48 },
  { id: 4,  angle: -5,  width: 45,  opacity: 0.36, blur: 9,  tone: 'hot',    animDuration: 14, animDelay: -5,  swayDeg: 10, scaleMin: 0.7,  scaleMax: 1.4,  opacityMin: 0.25, opacityMax: 0.45 },
  // Center beams — strongest
  { id: 5,  angle: 0,   width: 180, opacity: 0.45, blur: 16, tone: 'bright', animDuration: 20, animDelay: -9,  swayDeg: 3,  scaleMin: 0.85, scaleMax: 1.2,  opacityMin: 0.35, opacityMax: 0.52 },
  { id: 6,  angle: 4,   width: 55,  opacity: 0.38, blur: 11, tone: 'hot',    animDuration: 18, animDelay: -4,  swayDeg: 7,  scaleMin: 0.75, scaleMax: 1.35, opacityMin: 0.28, opacityMax: 0.46 },
  // Center-right beams
  { id: 7,  angle: 12,  width: 130, opacity: 0.36, blur: 17, tone: 'bright', animDuration: 24, animDelay: -2,  swayDeg: 5,  scaleMin: 0.85, scaleMax: 1.25, opacityMin: 0.26, opacityMax: 0.42 },
  { id: 8,  angle: 20,  width: 50,  opacity: 0.40, blur: 10, tone: 'hot',    animDuration: 13, animDelay: -6,  swayDeg: 9,  scaleMin: 0.7,  scaleMax: 1.4,  opacityMin: 0.30, opacityMax: 0.50 },
  // Far right beams
  { id: 9,  angle: 28,  width: 110, opacity: 0.30, blur: 15, tone: 'soft',   animDuration: 27, animDelay: -8,  swayDeg: 6,  scaleMin: 0.8,  scaleMax: 1.3,  opacityMin: 0.22, opacityMax: 0.38 },
  { id: 10, angle: 36,  width: 40,  opacity: 0.35, blur: 8,  tone: 'hot',    animDuration: 15, animDelay: -10, swayDeg: 11, scaleMin: 0.7,  scaleMax: 1.4,  opacityMin: 0.26, opacityMax: 0.44 },
  { id: 11, angle: 42,  width: 90,  opacity: 0.28, blur: 13, tone: 'soft',   animDuration: 21, animDelay: -3,  swayDeg: 7,  scaleMin: 0.75, scaleMax: 1.35, opacityMin: 0.20, opacityMax: 0.36 },
]

function getGradientColors(tone: BeamConfig['tone'], opacity: number) {
  switch (tone) {
    case 'bright':
      // Pure golden yellow
      return {
        top: `rgba(255,220,50,${opacity})`,
        mid: `rgba(255,200,30,${opacity * 0.6})`,
        low: `rgba(255,180,20,${opacity * 0.25})`,
        bottom: `rgba(255,170,10,${opacity * 0.08})`,
      }
    case 'soft':
      // Warm amber
      return {
        top: `rgba(255,190,60,${opacity})`,
        mid: `rgba(255,170,40,${opacity * 0.55})`,
        low: `rgba(255,150,20,${opacity * 0.22})`,
        bottom: `rgba(255,140,10,${opacity * 0.06})`,
      }
    case 'hot':
      // White-gold (brightest highlights)
      return {
        top: `rgba(255,255,200,${opacity})`,
        mid: `rgba(255,240,140,${opacity * 0.55})`,
        low: `rgba(255,220,80,${opacity * 0.22})`,
        bottom: `rgba(255,200,50,${opacity * 0.06})`,
      }
  }
}

export default function UnderwaterSunbeams() {
  // Respect prefers-reduced-motion: show static beams (no animation) or nothing
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mql.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const keyframes = useMemo(() => {
    return BEAM_CONFIGS.map((beam) => {
      const a = beam.angle
      const s = beam.swayDeg

      const r1 = a + s * 0.6
      const r2 = a - s * 0.4
      const r3 = a + s
      const r4 = a - s * 0.8

      const range = beam.scaleMax - beam.scaleMin
      const sx1 = beam.scaleMin + range * 0.3
      const sx2 = beam.scaleMax
      const sx3 = beam.scaleMin
      const sx4 = beam.scaleMin + range * 0.7

      const oRange = beam.opacityMax - beam.opacityMin
      const o1 = beam.opacityMin + oRange * 0.5
      const o2 = beam.opacityMax
      const o3 = beam.opacityMin
      const o4 = beam.opacityMin + oRange * 0.8

      return `
        @keyframes beam-sway-${beam.id} {
          0%   { transform: rotate(${a}deg) scaleX(${sx1}); opacity: ${o1}; }
          15%  { transform: rotate(${r1}deg) scaleX(${sx2}); opacity: ${o2}; }
          30%  { transform: rotate(${r2}deg) scaleX(${sx3}); opacity: ${o3}; }
          50%  { transform: rotate(${r3}deg) scaleX(${sx4}); opacity: ${o4}; }
          65%  { transform: rotate(${a - s * 0.2}deg) scaleX(${sx2 * 0.95}); opacity: ${o2 * 0.9}; }
          80%  { transform: rotate(${r4}deg) scaleX(${sx1}); opacity: ${o1}; }
          100% { transform: rotate(${a}deg) scaleX(${sx1}); opacity: ${o1}; }
        }
      `
    }).join('\n')
  }, [])

  const causticKeyframes = `
    @keyframes caustic-drift {
      0%   { background-position: 0% 0%, 0% 0%, 0% 0%; opacity: 0.6; }
      25%  { background-position: 30% 10%, -20% 5%, 15% -10%; opacity: 0.75; }
      50%  { background-position: -15% -5%, 40% 15%, -25% 10%; opacity: 0.55; }
      75%  { background-position: 20% 8%, -10% -8%, 35% 5%; opacity: 0.7; }
      100% { background-position: 0% 0%, 0% 0%, 0% 0%; opacity: 0.6; }
    }
    @keyframes caustic-shimmer {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      33%      { opacity: 0.8; transform: scale(1.02); }
      66%      { opacity: 0.4; transform: scale(0.98); }
    }
  `

  // Reduced motion: render a static warm glow instead of animated beams
  if (prefersReducedMotion) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        {/* Static warm glow at top center — the sun source without animation */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '30%',
            background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,220,50,0.15) 0%, rgba(255,200,30,0.05) 50%, transparent 80%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `${keyframes}\n${causticKeyframes}` }} />

      {/* Golden caustic shimmer at the top (water surface light ripples) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-10%',
          width: '120%',
          height: '120px',
          zIndex: 2,
          background: `
            radial-gradient(ellipse 80px 40px at 20% 50%, rgba(255,220,50,0.30) 0%, transparent 70%),
            radial-gradient(ellipse 100px 50px at 50% 40%, rgba(255,240,140,0.25) 0%, transparent 70%),
            radial-gradient(ellipse 60px 30px at 80% 60%, rgba(255,255,200,0.20) 0%, transparent 70%)
          `,
          animation: 'caustic-drift 8s ease-in-out infinite',
          filter: 'blur(6px)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
        }}
      />

      {/* Secondary caustic ripple layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-5%',
          width: '110%',
          height: '100px',
          zIndex: 2,
          background: `
            radial-gradient(ellipse 120px 35px at 30% 45%, rgba(255,200,30,0.24) 0%, transparent 65%),
            radial-gradient(ellipse 90px 45px at 65% 55%, rgba(255,220,50,0.18) 0%, transparent 65%),
            radial-gradient(ellipse 70px 25px at 10% 50%, rgba(255,255,200,0.16) 0%, transparent 65%),
            radial-gradient(ellipse 110px 40px at 85% 40%, rgba(255,190,60,0.20) 0%, transparent 65%)
          `,
          animation: 'caustic-shimmer 6s ease-in-out infinite',
          filter: 'blur(8px)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
        }}
      />

      {/* Sun beams — all fan outward from top-center (50%, 0%) */}
      {BEAM_CONFIGS.map((beam) => {
        const colors = getGradientColors(beam.tone, beam.opacity)

        return (
          <div
            key={beam.id}
            style={{
              position: 'absolute',
              // All beams originate from the same point at top center
              top: '-5%',
              left: '50%',
              marginLeft: `-${beam.width / 2}px`,
              width: `${beam.width}px`,
              height: '140%',
              // Pivot from the top center of each beam so rotation fans outward
              transformOrigin: 'top center',
              animation: `beam-sway-${beam.id} ${beam.animDuration}s ease-in-out ${beam.animDelay}s infinite`,
              filter: `blur(${beam.blur}px)`,
              willChange: 'transform, opacity',
              // Conical shape — narrow at source, wide at bottom
              clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)',
              background: `linear-gradient(
                180deg,
                ${colors.top} 0%,
                ${colors.top} 5%,
                ${colors.mid} 25%,
                ${colors.mid} 40%,
                ${colors.low} 65%,
                ${colors.low} 80%,
                ${colors.bottom} 92%,
                transparent 100%
              )`,
            }}
          />
        )
      })}

      {/* Warm glow at top center — the invisible sun source */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '25%',
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,220,50,0.18) 0%, rgba(255,200,30,0.06) 50%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
