/**
 * Input sanitization utilities for Wolf Whale LMS.
 * Strips HTML tags and dangerous content from user input.
 */

export function stripHtml(input: string): string {
  let result = input
  let previous = ''
  while (result !== previous) {
    previous = result
    result = result.replace(/<[^>]*>/g, '')
  }
  result = result
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .trim()
  let afterNested = ''
  while (result !== afterNested) {
    afterNested = result
    result = result.replace(/<[^>]*>/g, '')
  }
  return result.trim()
}

/**
 * Sanitize text content — strips HTML tags and normalizes whitespace.
 * Use for description fields, feedback, etc.
 */
export function sanitizeText(input: string): string {
  return stripHtml(input)
    .replace(/\s+/g, ' ')  // Collapse multiple spaces
    .trim()
}

export function sanitizeRichText(input: string): string {
  let result = input

  result = result.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  let previous = ''
  while (result !== previous) {
    previous = result
    result = result
      .replace(/<script\b[^]*?<\/script\s*>/gi, '')
      .replace(/<script\b[^>]*>/gi, '')
      .replace(/<\/script\s*>/gi, '')
      .replace(/<iframe\b[^]*?<\/iframe\s*>/gi, '')
      .replace(/<iframe\b[^>]*\/?>/gi, '')
      .replace(/<object\b[^]*?<\/object\s*>/gi, '')
      .replace(/<object\b[^>]*\/?>/gi, '')
      .replace(/<embed\b[^>]*\/?>/gi, '')
      .replace(/<applet\b[^]*?<\/applet\s*>/gi, '')
      .replace(/<form\b[^]*?<\/form\s*>/gi, '')
      .replace(/<form\b[^>]*>/gi, '')
      .replace(/<meta\b[^>]*>/gi, '')
      .replace(/<link\b[^>]*>/gi, '')
      .replace(/<base\b[^>]*>/gi, '')
      .replace(/<svg\b[^]*?<\/svg\s*>/gi, '')
      .replace(/<svg\b[^>]*>/gi, '')
      .replace(/<math\b[^]*?<\/math\s*>/gi, '')
  }

  result = result.replace(/\bon\w+\s*=/gi, '')

  const dangerousProtocol = /(?:java|vb)\s*(?:script|[\t\n\r])*\s*:/gi
  previous = ''
  while (result !== previous) {
    previous = result
    result = result.replace(dangerousProtocol, '')
  }

  result = result
    .replace(/data\s*:[^,]*base64/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/-moz-binding\s*:/gi, '')
    .replace(/behavior\s*:/gi, '')

  return result.trim()
}

/**
 * Sanitize a URL — only allow http, https, and mailto protocols.
 */
export function sanitizeUrl(input: string): string {
  const trimmed = input.trim().replace(/[\x00-\x1F\x7F]/g, '')
  if (/^(https?:\/\/|mailto:)/i.test(trimmed)) {
    try {
      if (trimmed.toLowerCase().startsWith('mailto:')) return trimmed
      const parsed = new URL(trimmed)
      if (parsed.username || parsed.password) return ''
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return ''
      return parsed.href
    } catch {
      return ''
    }
  }
  if (/^[a-zA-Z0-9]/.test(trimmed) && !trimmed.includes(':')) {
    return `https://${trimmed}`
  }
  return ''
}

/**
 * Sanitize a filename — remove path traversal and dangerous characters.
 */
export function sanitizeFilename(input: string): string {
  let result = input
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/[/\\]/g, '')
    .replace(/[<>:"|?*]/g, '')
  let previous = ''
  while (result !== previous) {
    previous = result
    result = result.replace(/\.\./g, '')
  }
  result = result.trim()
  if (!result || result === '.' || result.startsWith('.')) {
    result = 'unnamed' + result
  }
  return result.substring(0, 255)
}
