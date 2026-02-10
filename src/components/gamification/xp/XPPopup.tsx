'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface XPPopupProps {
  xpAmount: number;
  coinAmount?: number;
  onComplete?: () => void;
  position?: { x: number; y: number };
}

export const XPPopup: React.FC<XPPopupProps> = ({
  xpAmount,
  coinAmount,
  onComplete,
  position = { x: 0, y: 0 },
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="pointer-events-none fixed" style={{ left: position.x, top: position.y }}>
      {/* XP Text */}
      <motion.div
        className="text-center font-bold text-xl drop-shadow-lg"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 0, y: -100 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        <p className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-500">
          +{xpAmount} XP
        </p>
      </motion.div>

      {/* Coin Text */}
      {coinAmount && coinAmount > 0 && (
        <motion.div
          className="text-center font-bold text-lg drop-shadow-lg mt-1"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -100 }}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.1 }}
        >
          <p className="text-amber-300">+{coinAmount} 🪙</p>
        </motion.div>
      )}

      {/* Particle Effects */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-lg"
          initial={{
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
          }}
          animate={{
            opacity: 0,
            x: Math.cos((i / 6) * Math.PI * 2) * 60,
            y: Math.sin((i / 6) * Math.PI * 2) * 60 - 100,
            scale: 0,
          }}
          transition={{
            duration: 2,
            ease: 'easeOut',
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
};

interface XPPopupContainerProps {
  popups: Array<{
    id: number;
    xpAmount: number;
    coinAmount?: number;
    position?: { x: number; y: number };
  }>;
  onRemove: (id: number) => void;
}

export const XPPopupContainer: React.FC<XPPopupContainerProps> = ({
  popups,
  onRemove,
}) => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {popups.map((popup) => (
        <XPPopup
          key={popup.id}
          xpAmount={popup.xpAmount}
          coinAmount={popup.coinAmount}
          position={popup.position}
          onComplete={() => onRemove(popup.id)}
        />
      ))}
    </div>
  );
};
