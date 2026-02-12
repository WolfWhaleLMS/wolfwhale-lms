'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { useTutorStore } from '@/lib/tutor/engine'
import TutorMessageBubble from './TutorMessageBubble'
import TutorModelManager from './TutorModelManager'

interface TutorChatProps {
  compact?: boolean
}

export default function TutorChat({ compact = false }: TutorChatProps) {
  const status = useTutorStore((s) => s.status)
  const activeConversation = useTutorStore((s) => s.activeConversation)
  const sendMessage = useTutorStore((s) => s.sendMessage)

  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isReady = status === 'ready' || status === 'generating'
  const isGenerating = status === 'generating'

  // Derive messages from the active conversation
  const messages = useMemo(
    () => activeConversation?.messages ?? [],
    [activeConversation],
  )

  // Detect streaming state: when generating, the last message is an assistant
  // message whose content is being built up token-by-token by the engine.
  const lastMessage = messages[messages.length - 1]
  const isStreamingLastMessage =
    isGenerating && lastMessage?.role === 'assistant'
  const waitingForFirstToken =
    isGenerating && (!lastMessage || lastMessage.role !== 'assistant' || lastMessage.content === '')

  // For rendering: separate completed messages from the streaming one
  const displayMessages = isStreamingLastMessage
    ? messages.slice(0, -1)
    : messages
  const streamingMessage = isStreamingLastMessage ? lastMessage : null

  // ---- Auto-scroll to bottom on new messages or streaming content ---- //
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingMessage?.content])

  // ---- Auto-resize textarea ---- //
  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, compact ? 96 : 160)}px`
  }, [compact])

  useEffect(() => {
    resizeTextarea()
  }, [inputValue, resizeTextarea])

  // ---- Send handler ---- //
  const handleSend = useCallback(async () => {
    const trimmed = inputValue.trim()
    if (!trimmed || isGenerating) return

    setInputValue('')
    // Reset textarea height after clearing
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    await sendMessage(trimmed)
  }, [inputValue, isGenerating, sendMessage])

  // ---- Keyboard handler for textarea ---- //
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  // ---- If engine not ready, show the model manager ---- //
  if (!isReady) {
    return <TutorModelManager />
  }

  return (
    <div className="flex h-full flex-col" role="region" aria-label="AI Tutor Chat">
      {/* Messages area */}
      <div
        className={`flex-1 overflow-y-auto scrollbar-ocean ${
          compact ? 'px-3 py-2 space-y-3' : 'px-4 py-4 space-y-4'
        }`}
        role="list"
        aria-label="Chat messages"
      >
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground text-center px-4">
              Ask Wally anything about your courses, lessons, or study material.
            </p>
          </div>
        )}

        {/* Completed messages */}
        {displayMessages.map((msg) => (
          <TutorMessageBubble key={msg.id} message={msg} />
        ))}

        {/* Streaming response -- the last assistant message being generated */}
        {streamingMessage && streamingMessage.content.length > 0 && (
          <TutorMessageBubble
            message={streamingMessage}
            isStreaming
          />
        )}

        {/* Typing indicator -- waiting for first token */}
        {waitingForFirstToken && (
          <div className="flex items-end gap-2" role="status" aria-label="Wally is thinking">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00FFFF]/15 text-[#00FFFF]">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            </div>
            <div className="ocean-card rounded-2xl rounded-bl-md px-4 py-3">
              <div className="relative z-2 flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-[#00BFFF] animate-bounce [animation-delay:0ms]" />
                <span className="h-2 w-2 rounded-full bg-[#00BFFF] animate-bounce [animation-delay:150ms]" />
                <span className="h-2 w-2 rounded-full bg-[#00BFFF] animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* Input area */}
      <div
        className={`border-t border-[#00BFFF]/15 ${
          compact ? 'px-3 py-2' : 'px-4 py-3'
        }`}
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isGenerating ? 'Wally is thinking...' : 'Ask Wally a question...'}
            disabled={isGenerating}
            rows={1}
            className={`flex-1 resize-none rounded-xl border border-[#00BFFF]/20 bg-transparent px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-[#00BFFF]/50 focus:outline-none focus:ring-2 focus:ring-[#00BFFF]/25 disabled:cursor-not-allowed disabled:opacity-50 scrollbar-ocean ${
              compact ? 'text-sm' : 'text-sm'
            }`}
            aria-label="Type your message"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || isGenerating}
            className="btn-chrome-3d-blue flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF] focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            aria-label="Send message"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <p className="mt-1.5 text-[10px] text-muted-foreground/70 text-center">
          Wally runs locally on your device. Responses may vary.
        </p>
      </div>
    </div>
  )
}
