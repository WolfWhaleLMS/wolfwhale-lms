'use client'

import React, { useMemo } from 'react'

interface BeamConfig {
  id: number
  left: string
  width: number
  rotation: number
  opacity: number
  blur: number
  color: 'cyan' | 'aqua' | 'white'
  animDuration: number
  animDelay: number
  swayDeg: number
  scaleMin: number
  scaleMax: number
  opacityMin: number
  opacityMax: number
  clipTop: number
  clipBottom: number
}

const BEAM_CONFIGS: BeamConfig[] = [
  // Beam 0 — wide diffuse left
  { id: 0, left: '2%', width: 180, rotation: -12, opacity: 0.32, blur: 18, color: 'cyan', animDuration: 22, animDelay: 0, swayDeg: 8, scaleMin: 0.8, scaleMax: 1.3, opacityMin: 0.25, opacityMax: 0.4, clipTop: 42, clipBottom: 58 },
  // Beam 1 — thin accent
  { id: 1, left: '8%', width: 50, rotation: -8, opacity: 0.38, blur: 10, color: 'white', animDuration: 16, animDelay: -3, swayDeg: 12, scaleMin: 0.7, scaleMax: 1.4, opacityMin: 0.28, opacityMax: 0.48, clipTop: 46, clipBottom: 54 },
  // Beam 2 — medium
  { id: 2, left: '15%', width: 100, rotation: -5, opacity: 0.35, blur: 14, color: 'aqua', animDuration: 25, animDelay: -7, swayDeg: 6, scaleMin: 0.85, scaleMax: 1.25, opacityMin: 0.27, opacityMax: 0.42, clipTop: 44, clipBottom: 56 },
  // Beam 3 — wide hero beam
  { id: 3, left: '25%', width: 200, rotation: -2, opacity: 0.42, blur: 20, color: 'cyan', animDuration: 28, animDelay: -1, swayDeg: 5, scaleMin: 0.9, scaleMax: 1.2, opacityMin: 0.3, opacityMax: 0.5, clipTop: 40, clipBottom: 60 },
  // Beam 4 — thin accent
  { id: 4, left: '33%', width: 45, rotation: 3, opacity: 0.36, blur: 9, color: 'white', animDuration: 14, animDelay: -5, swayDeg: 14, scaleMin: 0.7, scaleMax: 1.4, opacityMin: 0.25, opacityMax: 0.45, clipTop: 47, clipBottom: 53 },
  // Beam 5 — medium
  { id: 5, left: '42%', width: 120, rotation: 1, opacity: 0.33, blur: 15, color: 'aqua', animDuration: 20, animDelay: -9, swayDeg: 9, scaleMin: 0.8, scaleMax: 1.3, opacityMin: 0.25, opacityMax: 0.43, clipTop: 43, clipBottom: 57 },
  // Beam 6 — wide center-right
  { id: 6, left: '52%', width: 160, rotation: 5, opacity: 0.38, blur: 17, color: 'cyan', animDuration: 24, animDelay: -4, swayDeg: 7, scaleMin: 0.85, scaleMax: 1.25, opacityMin: 0.28, opacityMax: 0.45, clipTop: 41, clipBottom: 59 },
  // Beam 7 — thin accent
  { id: 7, left: '60%', width: 55, rotation: 8, opacity: 0.4, blur: 11, color: 'white', animDuration: 13, animDelay: -2, swayDeg: 13, scaleMin: 0.7, scaleMax: 1.4, opacityMin: 0.3, opacityMax: 0.5, clipTop: 46, clipBottom: 54 },
  // Beam 8 — medium
  { id: 8, left: '70%', width: 110, rotation: 10, opacity: 0.34, blur: 14, color: 'aqua', animDuration: 19, animDelay: -6, swayDeg: 10, scaleMin: 0.8, scaleMax: 1.3, opacityMin: 0.26, opacityMax: 0.44, clipTop: 44, clipBottom: 56 },
  // Beam 9 — wide right
  { id: 9, left: '80%', width: 190, rotation: 12, opacity: 0.3, blur: 19, color: 'cyan', animDuration: 27, animDelay: -8, swayDeg: 6, scaleMin: 0.9, scaleMax: 1.2, opacityMin: 0.22, opacityMax: 0.38, clipTop: 42, clipBottom: 58 },
  // Beam 10 — thin accent far right
  { id: 10, left: '88%', width: 40, rotation: 14, opacity: 0.37, blur: 8, color: 'white', animDuration: 15, animDelay: -10, swayDeg: 15, scaleMin: 0.7, scaleMax: 1.4, opacityMin: 0.28, opacityMax: 0.48, clipTop: 47, clipBottom: 53 },
  // Beam 11 — medium far right
  { id: 11, left: '95%', width: 90, rotation: 16, opacity: 0.31, blur: 13, color: 'aqua', animDuration: 21, animDelay: -3, swayDeg: 11, scaleMin: 0.75, scaleMax: 1.35, opacityMin: 0.24, opacityMax: 0.4, clipTop: 45, clipBottom: 55 },
]

function getGradientColor(color: BeamConfig['color'], opacity: number) {
  switch (color) {
    case 'cyan':
      return {
        top: `rgba(0,191,255,${opacity})`,
        mid: `rgba(0,191,255,${opacity * 0.6})`,
        low: `rgba(0,191,255,${opacity * 0.25})`,
        bottom: `rgba(0,191,255,${opacity * 0.08})`,
      }
    case 'aqua':
      return {
        top: `rgba(0,255,255,${opacity})`,
        mid: `rgba(0,255,255,${opacity * 0.55})`,
        low: `rgba(0,255,255,${opacity * 0.22})`,
        bottom: `rgba(0,255,255,${opacity * 0.06})`,
      }
    case 'white':
      return {
        top: `rgba(255,255,255,${opacity})`,
        mid: `rgba(200,240,255,${opacity * 0.5})`,
        low: `rgba(0,191,255,${opacity * 0.2})`,
        bottom: `rgba(0,191,255,${opacity * 0.05})`,
      }
  }
}

export default function UnderwaterSunbeams() {
  const keyframes = useMemo(() => {
    return BEAM_CONFIGS.map((beam) => {
      // Each beam gets unique keyframe percentages for organic feel
      const midRotation1 = beam.rotation + beam.swayDeg * 0.6
      const midRotation2 = beam.rotation - beam.swayDeg * 0.4
      const midRotation3 = beam.rotation + beam.swayDeg
      const midRotation4 = beam.rotation - beam.swayDeg * 0.8

      const midScale1 = beam.scaleMin + (beam.scaleMax - beam.scaleMin) * 0.3
      const midScale2 = beam.scaleMax
      const midScale3 = beam.scaleMin
      const midScale4 = beam.scaleMin + (beam.scaleMax - beam.scaleMin) * 0.7

      const midOp1 = beam.opacityMin + (beam.opacityMax - beam.opacityMin) * 0.5
      const midOp2 = beam.opacityMax
      const midOp3 = beam.opacityMin
      const midOp4 = beam.opacityMin + (beam.opacityMax - beam.opacityMin) * 0.8

      return `
        @keyframes beam-sway-${beam.id} {
          0% {
            transform: rotate(${beam.rotation}deg) scaleX(${midScale1});
            opacity: ${midOp1};
          }
          15% {
            transform: rotate(${midRotation1}deg) scaleX(${midScale2});
            opacity: ${midOp2};
          }
          30% {
            transform: rotate(${midRotation2}deg) scaleX(${midScale3});
            opacity: ${midOp3};
          }
          50% {
            transform: rotate(${midRotation3}deg) scaleX(${midScale4});
            opacity: ${midOp4};
          }
          65% {
            transform: rotate(${beam.rotation - beam.swayDeg * 0.2}deg) scaleX(${midScale2 * 0.95});
            opacity: ${midOp2 * 0.9};
          }
          80% {
            transform: rotate(${midRotation4}deg) scaleX(${midScale1});
            opacity: ${midOp1};
          }
          100% {
            transform: rotate(${beam.rotation}deg) scaleX(${midScale1});
            opacity: ${midOp1};
          }
        }
      `
    }).join('\n')
  }, [])

  const causticKeyframes = `
    @keyframes caustic-drift {
      0% {
        background-position: 0% 0%, 0% 0%, 0% 0%;
        opacity: 0.6;
      }
      25% {
        background-position: 30% 10%, -20% 5%, 15% -10%;
        opacity: 0.75;
      }
      50% {
        background-position: -15% -5%, 40% 15%, -25% 10%;
        opacity: 0.55;
      }
      75% {
        background-position: 20% 8%, -10% -8%, 35% 5%;
        opacity: 0.7;
      }
      100% {
        background-position: 0% 0%, 0% 0%, 0% 0%;
        opacity: 0.6;
      }
    }

    @keyframes caustic-shimmer {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      33% { opacity: 0.8; transform: scale(1.02); }
      66% { opacity: 0.4; transform: scale(0.98); }
    }
  `

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
      <style dangerouslySetInnerHTML={{ __html: `
        ${keyframes}
        ${causticKeyframes}
      `}} />

      {/* Water surface caustic shimmer layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-10%',
          width: '120%',
          height: '120px',
          zIndex: 2,
          background: `
            radial-gradient(ellipse 80px 40px at 20% 50%, rgba(0,255,255,0.35) 0%, transparent 70%),
            radial-gradient(ellipse 100px 50px at 50% 40%, rgba(0,191,255,0.3) 0%, transparent 70%),
            radial-gradient(ellipse 60px 30px at 80% 60%, rgba(255,255,255,0.25) 0%, transparent 70%)
          `,
          animation: 'caustic-drift 8s ease-in-out infinite',
          filter: 'blur(6px)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
        }}
      />

      {/* Secondary caustic ripple layer for complexity */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-5%',
          width: '110%',
          height: '100px',
          zIndex: 2,
          background: `
            radial-gradient(ellipse 120px 35px at 30% 45%, rgba(0,191,255,0.28) 0%, transparent 65%),
            radial-gradient(ellipse 90px 45px at 65% 55%, rgba(0,255,255,0.22) 0%, transparent 65%),
            radial-gradient(ellipse 70px 25px at 10% 50%, rgba(255,255,255,0.2) 0%, transparent 65%),
            radial-gradient(ellipse 110px 40px at 85% 40%, rgba(0,191,255,0.25) 0%, transparent 65%)
          `,
          animation: 'caustic-shimmer 6s ease-in-out infinite',
          filter: 'blur(8px)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
        }}
      />

      {/* Sun beams / God rays */}
      {BEAM_CONFIGS.map((beam) => {
        const colors = getGradientColor(beam.color, beam.opacity)

        return (
          <div
            key={beam.id}
            style={{
              position: 'absolute',
              top: '-5%',
              left: beam.left,
              width: `${beam.width}px`,
              height: '140%',
              transformOrigin: 'top center',
              animation: `beam-sway-${beam.id} ${beam.animDuration}s ease-in-out ${beam.animDelay}s infinite`,
              filter: `blur(${beam.blur}px)`,
              willChange: 'transform, opacity',
              // Conical / triangular shape — narrow at top, wide at bottom
              clipPath: `polygon(${beam.clipTop}% 0%, ${beam.clipBottom}% 0%, 100% 100%, 0% 100%)`,
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

      {/* Ambient glow overlay at top for extra brightness at the light source */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '30%',
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,191,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
