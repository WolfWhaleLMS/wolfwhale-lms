'use client'

import React, { useState } from 'react'
import { Info } from 'lucide-react'

/* ────────────────────────────────────────────
   SVG pictograph motifs inspired by Woodland Cree
   rock paintings of the Churchill River, Saskatchewan.
   Simplified interpretations — not exact reproductions.
   ──────────────────────────────────────────── */

const motifs: { viewBox: string; elements: React.ReactNode }[] = [
  // 1. Moose/Caribou
  {
    viewBox: '0 0 100 80',
    elements: (
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M25,40 C30,25 55,18 70,28 C78,32 82,38 78,48" fill="none" strokeWidth="3" />
        <line x1="35" y1="45" x2="32" y2="68" strokeWidth="2.5" />
        <line x1="42" y1="45" x2="40" y2="68" strokeWidth="2.5" />
        <line x1="65" y1="45" x2="63" y2="68" strokeWidth="2.5" />
        <line x1="72" y1="42" x2="71" y2="68" strokeWidth="2.5" />
        <path d="M70,28 L74,18 L78,12" fill="none" strokeWidth="2" />
        <path d="M70,28 L76,20 L82,16" fill="none" strokeWidth="2" />
        <line x1="25" y1="40" x2="18" y2="38" strokeWidth="2.5" />
      </g>
    ),
  },
  // 2. Thunderbird
  {
    viewBox: '0 0 100 70',
    elements: (
      <g strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="30" r="5" fill="currentColor" strokeWidth="0" />
        <path d="M45,32 L18,18 L8,22" fill="none" strokeWidth="2.5" />
        <path d="M18,18 L12,10" fill="none" strokeWidth="2" />
        <path d="M55,32 L82,18 L92,22" fill="none" strokeWidth="2.5" />
        <path d="M82,18 L88,10" fill="none" strokeWidth="2" />
        <line x1="50" y1="35" x2="50" y2="52" strokeWidth="2.5" />
        <line x1="50" y1="52" x2="42" y2="62" strokeWidth="2" />
        <line x1="50" y1="52" x2="58" y2="62" strokeWidth="2" />
      </g>
    ),
  },
  // 3. Standing human figure
  {
    viewBox: '0 0 60 100',
    elements: (
      <g strokeLinecap="round" strokeLinejoin="round">
        <circle cx="30" cy="15" r="8" fill="currentColor" strokeWidth="0" />
        <line x1="30" y1="23" x2="30" y2="60" strokeWidth="3" />
        <line x1="30" y1="35" x2="14" y2="50" strokeWidth="2.5" />
        <line x1="30" y1="35" x2="46" y2="50" strokeWidth="2.5" />
        <line x1="30" y1="60" x2="18" y2="82" strokeWidth="2.5" />
        <line x1="30" y1="60" x2="42" y2="82" strokeWidth="2.5" />
      </g>
    ),
  },
  // 4. Shaman with raised arms & headdress
  {
    viewBox: '0 0 80 100',
    elements: (
      <g strokeLinecap="round" strokeLinejoin="round">
        <circle cx="40" cy="22" r="8" fill="currentColor" strokeWidth="0" />
        <line x1="40" y1="30" x2="40" y2="65" strokeWidth="3" />
        <path d="M40,38 L22,18" fill="none" strokeWidth="2.5" />
        <path d="M40,38 L58,18" fill="none" strokeWidth="2.5" />
        <line x1="40" y1="65" x2="28" y2="88" strokeWidth="2.5" />
        <line x1="40" y1="65" x2="52" y2="88" strokeWidth="2.5" />
        <line x1="35" y1="14" x2="32" y2="4" strokeWidth="2" />
        <line x1="40" y1="12" x2="40" y2="2" strokeWidth="2" />
        <line x1="45" y1="14" x2="48" y2="4" strokeWidth="2" />
      </g>
    ),
  },
  // 5. Water/snake spirit
  {
    viewBox: '0 0 120 35',
    elements: (
      <g strokeLinecap="round">
        <path d="M8,18 C18,5 28,30 40,18 C52,5 62,30 75,18 C88,5 98,30 112,18" fill="none" strokeWidth="3" />
      </g>
    ),
  },
  // 6. Medicine wheel / sun
  {
    viewBox: '0 0 80 80',
    elements: (
      <g strokeLinecap="round">
        <circle cx="40" cy="40" r="16" fill="none" strokeWidth="2.5" />
        <line x1="40" y1="8" x2="40" y2="24" strokeWidth="2.5" />
        <line x1="40" y1="56" x2="40" y2="72" strokeWidth="2.5" />
        <line x1="8" y1="40" x2="24" y2="40" strokeWidth="2.5" />
        <line x1="56" y1="40" x2="72" y2="40" strokeWidth="2.5" />
        <line x1="17" y1="17" x2="29" y2="29" strokeWidth="2" />
        <line x1="51" y1="51" x2="63" y2="63" strokeWidth="2" />
        <line x1="17" y1="63" x2="29" y2="51" strokeWidth="2" />
        <line x1="51" y1="29" x2="63" y2="17" strokeWidth="2" />
      </g>
    ),
  },
  // 7. Spirit face with horns
  {
    viewBox: '0 0 80 85',
    elements: (
      <g strokeLinecap="round">
        <circle cx="40" cy="48" r="20" fill="none" strokeWidth="2.5" />
        <circle cx="32" cy="44" r="3" fill="currentColor" strokeWidth="0" />
        <circle cx="48" cy="44" r="3" fill="currentColor" strokeWidth="0" />
        <path d="M34,56 Q40,62 46,56" fill="none" strokeWidth="2" />
        <path d="M24,32 L16,12" fill="none" strokeWidth="2.5" />
        <path d="M56,32 L64,12" fill="none" strokeWidth="2.5" />
      </g>
    ),
  },
  // 8. Small deer/elk
  {
    viewBox: '0 0 80 65',
    elements: (
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M22,28 C28,18 48,14 58,22" fill="none" strokeWidth="2.5" />
        <path d="M58,22 L58,35 L58,50" fill="none" strokeWidth="2" />
        <line x1="53" y1="35" x2="53" y2="50" strokeWidth="2" />
        <line x1="28" y1="32" x2="28" y2="50" strokeWidth="2" />
        <line x1="23" y1="32" x2="23" y2="50" strokeWidth="2" />
        <path d="M58,22 L62,14 L66,10" fill="none" strokeWidth="1.8" />
        <path d="M58,22 L64,16" fill="none" strokeWidth="1.8" />
        <line x1="22" y1="28" x2="15" y2="26" strokeWidth="2" />
      </g>
    ),
  },
  // 9. Handprint
  {
    viewBox: '0 0 70 90',
    elements: (
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M22,45 L22,22 L28,22 L28,45" fill="none" strokeWidth="2" />
        <path d="M28,45 L28,15 L34,15 L34,45" fill="none" strokeWidth="2" />
        <path d="M34,45 L34,12 L40,12 L40,45" fill="none" strokeWidth="2" />
        <path d="M40,45 L40,18 L46,18 L46,45" fill="none" strokeWidth="2" />
        <path d="M46,40 L50,32 L55,35 L48,45" fill="none" strokeWidth="2" />
        <path d="M22,45 Q18,55 22,65 Q30,78 40,78 Q50,78 52,65 Q55,55 48,45" fill="none" strokeWidth="2" />
      </g>
    ),
  },
  // 10. Canoe with figures
  {
    viewBox: '0 0 120 55',
    elements: (
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M15,38 Q60,18 105,38" fill="none" strokeWidth="2.5" />
        <path d="M10,40 Q60,52 110,40" fill="none" strokeWidth="2.5" />
        <line x1="40" y1="30" x2="40" y2="18" strokeWidth="2" />
        <circle cx="40" cy="14" r="4" fill="currentColor" strokeWidth="0" />
        <line x1="65" y1="28" x2="65" y2="16" strokeWidth="2" />
        <circle cx="65" cy="12" r="4" fill="currentColor" strokeWidth="0" />
        <line x1="85" y1="32" x2="85" y2="20" strokeWidth="2" />
        <circle cx="85" cy="16" r="4" fill="currentColor" strokeWidth="0" />
      </g>
    ),
  },
]

/* Scattered positions — left and right edges */
const placements: { top: string; side: 'left' | 'right'; rotate: number; scale: number; motifIndex: number }[] = [
  { top: '3%',  side: 'left',  rotate: -8,  scale: 1,    motifIndex: 0 },
  { top: '6%',  side: 'right', rotate: 5,   scale: 0.85, motifIndex: 1 },
  { top: '12%', side: 'left',  rotate: 3,   scale: 0.9,  motifIndex: 4 },
  { top: '16%', side: 'right', rotate: -12, scale: 1.1,  motifIndex: 2 },
  { top: '22%', side: 'left',  rotate: 7,   scale: 0.8,  motifIndex: 5 },
  { top: '26%', side: 'right', rotate: -5,  scale: 0.95, motifIndex: 3 },
  { top: '32%', side: 'left',  rotate: -10, scale: 1,    motifIndex: 7 },
  { top: '36%', side: 'right', rotate: 8,   scale: 0.85, motifIndex: 6 },
  { top: '42%', side: 'left',  rotate: 4,   scale: 0.9,  motifIndex: 9 },
  { top: '46%', side: 'right', rotate: -7,  scale: 1.05, motifIndex: 8 },
  { top: '52%', side: 'left',  rotate: -3,  scale: 0.85, motifIndex: 1 },
  { top: '56%', side: 'right', rotate: 10,  scale: 0.9,  motifIndex: 0 },
  { top: '62%', side: 'left',  rotate: 6,   scale: 1,    motifIndex: 3 },
  { top: '66%', side: 'right', rotate: -8,  scale: 0.8,  motifIndex: 5 },
  { top: '72%', side: 'left',  rotate: -5,  scale: 0.95, motifIndex: 2 },
  { top: '76%', side: 'right', rotate: 3,   scale: 1.1,  motifIndex: 7 },
  { top: '82%', side: 'left',  rotate: 9,   scale: 0.85, motifIndex: 6 },
  { top: '86%', side: 'right', rotate: -6,  scale: 0.9,  motifIndex: 4 },
  { top: '92%', side: 'left',  rotate: -4,  scale: 1,    motifIndex: 9 },
  { top: '96%', side: 'right', rotate: 7,   scale: 0.85, motifIndex: 8 },
]

export function Pictographs() {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <>
      {/* Pictograph decorations — visible on all screen sizes */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {placements.map((p, i) => {
          const motif = motifs[p.motifIndex]
          return (
            <svg
              key={i}
              viewBox={motif.viewBox}
              className={`absolute stroke-current
                w-7 h-7 sm:w-10 sm:h-10 lg:w-14 lg:h-14
                text-gray-300/40 dark:text-white/[0.05]
                sm:text-gray-300/50 sm:dark:text-white/[0.07]
                lg:text-gray-300/60 lg:dark:text-white/[0.08]
              `}
              style={{
                top: p.top,
                left: p.side === 'left' ? '2px' : undefined,
                right: p.side === 'right' ? '2px' : undefined,
                transform: `rotate(${p.rotate}deg) scale(${p.scale})`,
              }}
            >
              {motif.elements}
            </svg>
          )
        })}
      </div>

      {/* Attribution info bubble — bottom-left corner */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 transition-colors pointer-events-auto"
          aria-label="About pictograph decorations"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
        {showInfo && (
          <div className="absolute bottom-10 left-0 w-72 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-xl pointer-events-auto">
            <p className="text-xs text-gray-600 dark:text-white/70 leading-relaxed">
              Decorative motifs inspired by Woodland Cree rock paintings found along the Churchill River, Saskatchewan.
              These pictographs, painted in red ochre on cliff faces, represent spiritual visions and connections
              to <em>pawakan</em> (spiritual power). They date to the Late Woodland period and are attributed to the
              Woods Cree people.
            </p>
            <p className="text-[10px] text-gray-400 dark:text-white/40 mt-2">
              Source: &ldquo;The Aboriginal Rock Paintings of the Churchill River&rdquo; — University of Saskatchewan
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-2 text-[10px] text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/60 underline"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </>
  )
}
