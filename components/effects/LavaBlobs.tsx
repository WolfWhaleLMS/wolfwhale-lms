'use client'

import { useState, useEffect } from 'react'

export default function LavaBlobs() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <div className="absolute inset-0">
        {/* Large lava blobs — organic, slow-morphing chrome shapes */}
        <div className="lava-blob" style={{ width: '120px', height: '120px', left: '5%', animationDuration: '14s', animationDelay: '0s' }} />
        <div className="lava-blob" style={{ width: '90px', height: '90px', right: '8%', animationDuration: '18s', animationDelay: '2s' }} />
        <div className="lava-blob" style={{ width: '150px', height: '150px', left: '25%', animationDuration: '20s', animationDelay: '4s' }} />
        <div className="lava-blob" style={{ width: '70px', height: '70px', right: '25%', animationDuration: '16s', animationDelay: '6s' }} />
        <div className="lava-blob" style={{ width: '100px', height: '100px', left: '60%', animationDuration: '22s', animationDelay: '1s' }} />
        <div className="lava-blob" style={{ width: '80px', height: '80px', left: '45%', animationDuration: '15s', animationDelay: '8s' }} />
        <div className="lava-blob" style={{ width: '60px', height: '60px', right: '15%', animationDuration: '17s', animationDelay: '3s' }} />
        <div className="lava-blob" style={{ width: '110px', height: '110px', left: '80%', animationDuration: '19s', animationDelay: '5s' }} />
      </div>

      <style jsx global>{`
        .lava-blob {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(
            180deg,
            rgba(240, 248, 255, 0.85) 0%,
            rgba(192, 216, 232, 0.70) 25%,
            rgba(232, 244, 255, 0.80) 50%,
            rgba(168, 200, 224, 0.65) 75%,
            rgba(224, 240, 255, 0.75) 100%
          );
          box-shadow:
            0 0 30px rgba(0, 191, 255, 0.20),
            0 0 60px rgba(0, 191, 255, 0.10),
            inset -8px -8px 20px rgba(0, 0, 0, 0.08),
            inset 8px 8px 20px rgba(255, 255, 255, 0.60);
          animation: lava-float linear infinite;
          filter: blur(1px);
          opacity: 0.55;
          pointer-events: none;
        }
        .lava-blob::before {
          content: '';
          position: absolute;
          top: 12%;
          left: 18%;
          width: 40%;
          height: 35%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.75) 0%,
            rgba(255, 255, 255, 0.15) 60%,
            transparent 100%
          );
          border-radius: 50%;
        }
        @keyframes lava-float {
          0% {
            bottom: -15%;
            border-radius: 50% 45% 55% 48%;
            transform: scale(1) translateX(0);
            opacity: 0.55;
          }
          15% {
            border-radius: 45% 55% 48% 52%;
            transform: scale(1.08) translateX(15px);
            opacity: 0.55;
          }
          30% {
            border-radius: 52% 48% 45% 55%;
            transform: scale(0.95) translateX(-10px);
            opacity: 0.55;
          }
          46% {
            bottom: 100%;
            border-radius: 48% 52% 55% 45%;
            transform: scale(1.12) translateX(20px);
            opacity: 0.55;
          }
          /* POP — rapid scale up + fade out */
          49% {
            bottom: 102%;
            transform: scale(1.8) translateX(20px);
            opacity: 0;
            border-radius: 50%;
          }
          50% {
            bottom: -15%;
            transform: scale(0) translateX(0);
            opacity: 0;
          }
          55% {
            opacity: 0.55;
            border-radius: 55% 45% 50% 50%;
            transform: scale(1) translateX(0);
          }
          70% {
            border-radius: 45% 52% 48% 55%;
            transform: scale(1.05) translateX(-15px);
            opacity: 0.55;
          }
          85% {
            border-radius: 50% 48% 55% 45%;
            transform: scale(0.98) translateX(10px);
            opacity: 0.55;
          }
          96% {
            bottom: 100%;
            border-radius: 50% 45% 55% 48%;
            transform: scale(1.1) translateX(0);
            opacity: 0.55;
          }
          /* POP again at second rise */
          99% {
            bottom: 102%;
            transform: scale(1.8) translateX(0);
            opacity: 0;
            border-radius: 50%;
          }
          100% {
            bottom: -15%;
            transform: scale(0) translateX(0);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
