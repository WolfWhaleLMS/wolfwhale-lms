'use client'

import { Bot, User } from 'lucide-react'
import type { TutorMessage } from '@/lib/tutor/types'

// ---------------------------------------------------------------------------
// Simple markdown-like rendering (no external library)
// Handles: **bold**, *italic*, `inline code`, ```code blocks```, - bullet lists
// ---------------------------------------------------------------------------

function renderFormattedContent(content: string) {
  // Split on fenced code blocks first
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g
  const segments: { type: 'text' | 'codeblock'; lang?: string; value: string }[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: content.slice(lastIndex, match.index) })
    }
    segments.push({ type: 'codeblock', lang: match[1] || undefined, value: match[2] })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < content.length) {
    segments.push({ type: 'text', value: content.slice(lastIndex) })
  }

  return segments.map((seg, i) => {
    if (seg.type === 'codeblock') {
      return (
        <pre
          key={i}
          className="my-2 overflow-x-auto rounded-xl bg-[#0A2540]/80 dark:bg-[#041428]/80 p-3 text-xs text-[#E8F8FF] font-mono scrollbar-ocean"
        >
          <code>{seg.value}</code>
        </pre>
      )
    }
    return <TextBlock key={i} text={seg.value} />
  })
}

/** Renders plain text with inline formatting and bullet lists */
function TextBlock({ text }: { text: string }) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let bulletBuffer: string[] = []

  function flushBullets() {
    if (bulletBuffer.length === 0) return
    elements.push(
      <ul key={`ul-${elements.length}`} className="my-1 ml-4 list-disc space-y-0.5">
        {bulletBuffer.map((b, j) => (
          <li key={j}>{renderInline(b)}</li>
        ))}
      </ul>
    )
    bulletBuffer = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const bulletMatch = line.match(/^[-*]\s+(.+)/)
    if (bulletMatch) {
      bulletBuffer.push(bulletMatch[1])
    } else {
      flushBullets()
      if (line.trim() === '') {
        // Empty line -> paragraph break, but skip consecutive
        if (elements.length > 0) {
          elements.push(<br key={`br-${i}`} />)
        }
      } else {
        elements.push(
          <span key={`ln-${i}`}>
            {renderInline(line)}
            {i < lines.length - 1 && !lines[i + 1]?.match(/^[-*]\s+/) ? '\n' : ''}
          </span>
        )
      }
    }
  }
  flushBullets()

  return <>{elements}</>
}

/** Renders inline formatting: **bold**, *italic*, `code` */
function renderInline(text: string): React.ReactNode[] {
  // Combined regex for inline patterns
  const inlineRegex = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g
  const parts: React.ReactNode[] = []
  let lastIdx = 0
  let m: RegExpExecArray | null

  while ((m = inlineRegex.exec(text)) !== null) {
    if (m.index > lastIdx) {
      parts.push(text.slice(lastIdx, m.index))
    }
    if (m[2]) {
      // **bold**
      parts.push(<strong key={`b-${m.index}`} className="font-semibold">{m[2]}</strong>)
    } else if (m[3]) {
      // *italic*
      parts.push(<em key={`i-${m.index}`}>{m[3]}</em>)
    } else if (m[4]) {
      // `code`
      parts.push(
        <code
          key={`c-${m.index}`}
          className="rounded-md bg-[#00BFFF]/10 px-1.5 py-0.5 text-[0.85em] font-mono text-[#00BFFF] dark:bg-[#00BFFF]/15"
        >
          {m[4]}
        </code>
      )
    }
    lastIdx = m.index + m[0].length
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx))
  }

  return parts.length > 0 ? parts : [text]
}

// ---------------------------------------------------------------------------
// TutorMessageBubble
// ---------------------------------------------------------------------------

interface TutorMessageBubbleProps {
  message: TutorMessage
  isStreaming?: boolean
}

export default function TutorMessageBubble({ message, isStreaming = false }: TutorMessageBubbleProps) {
  // System messages are hidden
  if (message.role === 'system') return null

  const isUser = message.role === 'user'

  return (
    <div
      className={`flex items-end gap-2 animate-fade-in-up ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
      role="listitem"
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? 'bg-[#00BFFF]/15 text-[#00BFFF]'
            : 'bg-[#00FFFF]/15 text-[#00FFFF]'
        }`}
        aria-hidden="true"
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={`relative max-w-[80%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'btn-chrome-3d-blue text-white rounded-2xl rounded-br-md'
            : 'ocean-card text-foreground rounded-2xl rounded-bl-md'
        }`}
      >
        {/* Ensure content sits above the ocean-card pseudo-elements */}
        <div className="relative z-2">
          {renderFormattedContent(message.content)}
          {isStreaming && (
            <span
              className="ml-0.5 inline-block w-[2px] h-[1.1em] align-text-bottom bg-current animate-pulse"
              aria-label="Generating response"
            />
          )}
        </div>
      </div>
    </div>
  )
}
