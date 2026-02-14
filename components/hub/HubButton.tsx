'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

interface HubButtonProps {
  icon: ReactNode
  label: string
  href?: string
  onClick?: () => void
  gradient: string
  glowColor?: string
  badge?: number
}

export function HubButton({
  icon,
  label,
  href,
  onClick,
  gradient,
  glowColor,
  badge,
}: HubButtonProps) {
  const glowStyle = glowColor
    ? { '--hub-glow': glowColor } as React.CSSProperties
    : undefined

  const content = (
    <>
      <div className="hub-button-outer" style={glowStyle}>
        <div className={`hub-button-face ${gradient}`}>
          <div className="hub-button-highlight" />
          <div className="hub-button-icon">{icon}</div>
        </div>
        {badge != null && badge > 0 && (
          <span className="hub-button-badge">{badge > 99 ? '99+' : badge}</span>
        )}
      </div>
      <span className="hub-button-label">{label}</span>
    </>
  )

  if (href) {
    return (
      <Link href={href} className="hub-button-ring" style={glowStyle}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className="hub-button-ring" style={glowStyle}>
      {content}
    </button>
  )
}
