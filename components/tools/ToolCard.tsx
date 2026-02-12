'use client'

import Link from 'next/link'
import {
  Layers,
  Dices,
  Crown,
  Zap,
  Shuffle,
  Keyboard,
  Clock,
  Atom,
  Globe,
  Calculator,
  Timer,
  SpellCheck,
  FlaskConical,
  Gamepad2,
  type LucideIcon,
} from 'lucide-react'
import type { ToolDefinition } from '@/lib/tools/registry'

// ---------------------------------------------------------------------------
// Icon mapping: string name -> lucide-react component
// ---------------------------------------------------------------------------

const TOOL_ICON_MAP: Record<string, LucideIcon> = {
  Layers,
  Dices,
  Crown,
  Zap,
  Shuffle,
  Keyboard,
  Clock,
  Atom,
  Globe,
  Calculator,
  Timer,
  SpellCheck,
  FlaskConical,
  Gamepad2,
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ToolCardVariant = 'library' | 'lesson-embed' | 'editor-preview'

interface ToolCardProps {
  tool: ToolDefinition
  variant?: ToolCardVariant
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ToolCard({ tool, variant = 'library' }: ToolCardProps) {
  const Icon = TOOL_ICON_MAP[tool.icon] ?? Gamepad2
  const isComingSoon = tool.status === 'coming_soon'

  // -------------------------------------------------------------------------
  // Library variant — full card for the tools library page
  // -------------------------------------------------------------------------
  if (variant === 'library') {
    const card = (
      <div
        className={`ocean-card flex flex-col gap-3 rounded-2xl p-5 transition-all ${
          isComingSoon
            ? 'cursor-not-allowed opacity-60'
            : 'hover:scale-[1.02] hover:shadow-lg'
        }`}
      >
        {/* Icon + Coming Soon badge */}
        <div className="flex items-start justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: tool.colorHex + '1A' }}
          >
            <Icon className="h-6 w-6" style={{ color: tool.colorHex }} />
          </div>
          {isComingSoon && (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              Coming Soon
            </span>
          )}
        </div>

        {/* Name & description */}
        <div>
          <h3 className="text-base font-semibold">{tool.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* Subject tags */}
        <div className="mt-auto flex flex-wrap gap-1.5">
          {tool.subjectTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {tool.gradeRange}
          </span>
        </div>
      </div>
    )

    if (isComingSoon) return card

    return (
      <Link href={tool.route} className="block">
        {card}
      </Link>
    )
  }

  // -------------------------------------------------------------------------
  // Lesson-embed variant — compact horizontal card for lesson pages
  // -------------------------------------------------------------------------
  if (variant === 'lesson-embed') {
    return (
      <div className="ocean-card flex items-center gap-4 rounded-xl p-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: tool.colorHex + '1A' }}
        >
          <Icon className="h-5 w-5" style={{ color: tool.colorHex }} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">{tool.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {tool.description}
          </p>
        </div>

        {isComingSoon ? (
          <span className="shrink-0 text-xs font-medium text-muted-foreground">
            Coming Soon
          </span>
        ) : (
          <Link
            href={tool.route}
            className="shrink-0 rounded-lg bg-[#00BFFF] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#00BFFF]/80"
          >
            Launch
          </Link>
        )}
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // Editor-preview variant — minimal inline preview for the lesson editor
  // -------------------------------------------------------------------------
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex h-7 w-7 items-center justify-center rounded-md"
        style={{ backgroundColor: tool.colorHex + '1A' }}
      >
        <Icon className="h-4 w-4" style={{ color: tool.colorHex }} />
      </div>
      <span className="text-sm font-medium">{tool.name}</span>
      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium capitalize text-muted-foreground">
        {tool.category}
      </span>
    </div>
  )
}
