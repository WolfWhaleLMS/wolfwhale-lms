'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MusicVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
}

export const MusicVisualizer: React.FC<MusicVisualizerProps> = ({
  isPlaying,
  barCount = 5,
}) => {
  const bars = Array.from({ length: barCount });

  return (
    <div className="flex items-center justify-center gap-1 h-6">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-blue-400 to-cyan-300 rounded-full"
          animate={
            isPlaying
              ? {
                  height: [
                    '8px',
                    '12px',
                    '16px',
                    '12px',
                    '20px',
                    '12px',
                    '8px',
                  ],
                }
              : { height: '4px' }
          }
          transition={{
            duration: 0.6,
            repeat: isPlaying ? Infinity : 0,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
