'use client'

import { useEffect, useState, useCallback } from 'react'
import { Command, Check } from 'lucide-react'

interface NavItem { label: string; href: string }

export function CommandPalette({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-gray-200 dark:border-white/10 text-[11px] text-gray-400 dark:text-white/30 hover:border-gray-300 dark:hover:border-white/15 transition-colors duration-100"
      >
        <Command className="h-3 w-3" />
        <span>K</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]" onClick={() => setOpen(false)}>
          <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm" />
          <nav
            className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 w-full max-w-sm overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 h-12 border-b border-gray-100 dark:border-white/5">
              <Command className="h-4 w-4 text-gray-400 dark:text-white/30" />
              <span className="text-sm text-gray-400 dark:text-white/40">Jump to...</span>
            </div>
            <div className="py-1">
              {items.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center h-11 px-4 text-sm text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors duration-100"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="flex items-center justify-end gap-1 px-4 h-8 border-t border-gray-100 dark:border-white/5 text-[10px] text-gray-400 dark:text-white/25">
              <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-white/10 font-mono">esc</kbd>
              <span>to close</span>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

export function CopyEmailButton({ label = 'Copy email', copiedLabel = 'Copied' }: { label?: string; copiedLabel?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText('info@wolfwhale.ca')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <button
      onClick={copy}
      className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 text-sm font-medium transition-all duration-100 hover:border-gray-300 dark:hover:border-white/20"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-500" />
          {copiedLabel}
        </>
      ) : label}
    </button>
  )
}

export function ScrollPersist() {
  useEffect(() => {
    const saved = sessionStorage.getItem('ww-scroll')
    if (saved) {
      requestAnimationFrame(() => window.scrollTo(0, parseInt(saved)))
    }
    const onScroll = () => sessionStorage.setItem('ww-scroll', String(window.scrollY))
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return null
}
