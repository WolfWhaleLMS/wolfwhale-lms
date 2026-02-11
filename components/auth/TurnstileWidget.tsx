'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      remove: (widgetId: string) => void
      reset: (widgetId: string) => void
    }
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void
  onExpire?: () => void
}

export function TurnstileWidget({ onVerify, onExpire }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const onVerifyRef = useRef(onVerify)
  const onExpireRef = useRef(onExpire)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  onVerifyRef.current = onVerify
  onExpireRef.current = onExpire

  useEffect(() => {
    if (!siteKey || !containerRef.current) return

    // Load Turnstile script if not already loaded
    const scriptId = 'cf-turnstile-script'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      document.head.appendChild(script)
    }

    let renderTimeout: ReturnType<typeof setTimeout> | null = null

    const renderWidget = () => {
      if (widgetIdRef.current !== null || !containerRef.current) return
      if (typeof window.turnstile === 'undefined') {
        renderTimeout = setTimeout(renderWidget, 100)
        return
      }
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => onVerifyRef.current(token),
        'expired-callback': () => onExpireRef.current?.(),
        theme: 'light',
        size: 'flexible',
      })
    }

    renderWidget()

    return () => {
      if (renderTimeout) clearTimeout(renderTimeout)
      if (
        widgetIdRef.current !== null &&
        typeof window.turnstile !== 'undefined'
      ) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [siteKey])

  if (!siteKey) return null

  return <div ref={containerRef} />
}
