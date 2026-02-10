'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, Brain, Plus } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface PetStatsProps {
  happiness: number;
  energy: number;
  knowledge: number;
  health: number;
  /** Whether to animate from 0 on mount */
  animate?: boolean;
  /** Compact mode for smaller displays */
  compact?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Stat Configuration                                                 */
/* ------------------------------------------------------------------ */

interface StatConfig {
  key: string;
  label: string;
  icon: React.ReactNode;
  color: string;        // stroke / text color
  bgColor: string;      // ring track background
  glowColor: string;    // drop-shadow / glow
  gradientId: string;   // SVG gradient ID
  gradientStops: [string, string]; // from / to colors
}

const STATS: StatConfig[] = [
  {
    key: 'happiness',
    label: 'Happiness',
    icon: <Heart className="w-5 h-5" />,
    color: 'text-pink-500',
    bgColor: 'stroke-pink-200 dark:stroke-pink-900/40',
    glowColor: 'drop-shadow-[0_0_6px_rgba(236,72,153,0.5)]',
    gradientId: 'grad-happiness',
    gradientStops: ['#ec4899', '#f472b6'],
  },
  {
    key: 'energy',
    label: 'Energy',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-yellow-500',
    bgColor: 'stroke-yellow-200 dark:stroke-yellow-900/40',
    glowColor: 'drop-shadow-[0_0_6px_rgba(234,179,8,0.5)]',
    gradientId: 'grad-energy',
    gradientStops: ['#eab308', '#facc15'],
  },
  {
    key: 'knowledge',
    label: 'Knowledge',
    icon: <Brain className="w-5 h-5" />,
    color: 'text-blue-500',
    bgColor: 'stroke-blue-200 dark:stroke-blue-900/40',
    glowColor: 'drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]',
    gradientId: 'grad-knowledge',
    gradientStops: ['#3b82f6', '#60a5fa'],
  },
  {
    key: 'health',
    label: 'Health',
    icon: <Plus className="w-5 h-5" />,
    color: 'text-green-500',
    bgColor: 'stroke-green-200 dark:stroke-green-900/40',
    glowColor: 'drop-shadow-[0_0_6px_rgba(34,197,94,0.5)]',
    gradientId: 'grad-health',
    gradientStops: ['#22c55e', '#4ade80'],
  },
];

/* ------------------------------------------------------------------ */
/*  Circular Gauge Sub-component                                       */
/* ------------------------------------------------------------------ */

interface CircularGaugeProps {
  value: number;
  stat: StatConfig;
  animate: boolean;
  compact: boolean;
}

const CircularGauge: React.FC<CircularGaugeProps> = ({ value, stat, animate, compact }) => {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value);
  const clampedValue = Math.min(100, Math.max(0, value));

  const ringSize = compact ? 72 : 100;
  const strokeWidth = compact ? 6 : 8;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (clampedValue / 100) * circumference;

  // Animated counter
  useEffect(() => {
    if (!animate) {
      setDisplayValue(clampedValue);
      return;
    }
    let start = 0;
    const end = clampedValue;
    const duration = 1200;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplayValue(current);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [clampedValue, animate]);

  const isLow = clampedValue < 30;

  return (
    <motion.div
      className={`flex flex-col items-center gap-1.5 ${compact ? 'p-2' : 'p-3'}`}
      initial={animate ? { opacity: 0, scale: 0.8 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: STATS.indexOf(stat) * 0.1 }}
    >
      {/* SVG Ring */}
      <div className="relative" style={{ width: ringSize, height: ringSize }}>
        <svg width={ringSize} height={ringSize} className="-rotate-90">
          <defs>
            <linearGradient id={stat.gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={stat.gradientStops[0]} />
              <stop offset="100%" stopColor={stat.gradientStops[1]} />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            className={stat.bgColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <motion.circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke={`url(#${stat.gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset: circumference - progress }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: animate ? 1.2 : 0.6, ease: 'easeOut' }}
            className={stat.glowColor}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`${stat.color} ${compact ? 'mb-0' : 'mb-0.5'}`}>
            {stat.icon}
          </div>
          <span className={`font-bold text-slate-900 dark:text-white ${compact ? 'text-xs' : 'text-sm'}`}>
            {displayValue}
          </span>
        </div>

        {/* Low pulse indicator */}
        {isLow && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-400"
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Label */}
      <span className={`font-semibold text-slate-700 dark:text-slate-300 ${compact ? 'text-[10px]' : 'text-xs'}`}>
        {stat.label}
      </span>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export const PetStats: React.FC<PetStatsProps> = ({
  happiness,
  energy,
  knowledge,
  health,
  animate = true,
  compact = false,
}) => {
  const values: Record<string, number> = { happiness, energy, knowledge, health };

  return (
    <div className={`grid ${compact ? 'grid-cols-4 gap-1' : 'grid-cols-2 sm:grid-cols-4 gap-3'}`}>
      {STATS.map((stat) => (
        <CircularGauge
          key={stat.key}
          value={values[stat.key]}
          stat={stat}
          animate={animate}
          compact={compact}
        />
      ))}
    </div>
  );
};
