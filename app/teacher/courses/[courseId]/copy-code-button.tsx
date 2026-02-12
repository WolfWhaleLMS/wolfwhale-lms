'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = code
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      title="Copy class code"
    >
      {copied ? (
        <Check className="h-4 w-4 text-[#33FF33]" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  )
}
