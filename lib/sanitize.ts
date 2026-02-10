/**
 * Input sanitization utilities for Wolf Whale LMS.
 * Strips HTML tags and dangerous content from user input.
 */

/**
 * Strip all HTML tags from a string.
 * Use this for plain text fields (titles, names, etc.)
 */
export function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')  // Remove HTML tags
    .replace(/&lt;/g, '<')     // Decode common entities
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .trim()
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

/**
 * Sanitize rich text content — allows basic formatting but removes scripts and event handlers.
 * Use for content fields that may have markdown/basic formatting.
 */
export function sanitizeRichText(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')  // Remove event handlers (onclick, onerror, etc.)
    .replace(/javascript\s*:/gi, '')  // Remove javascript: protocol
    .replace(/data\s*:[^,]*base64/gi, '')  // Remove data: base64 URIs (potential XSS)
    .replace(/expression\s*\(/gi, '')  // Remove CSS expressions
    .replace(/vbscript\s*:/gi, '')  // Remove vbscript: protocol
    .trim()
}

/**
 * Sanitize a URL — only allow http, https, and mailto protocols.
 */
export function sanitizeUrl(input: string): string {
  const trimmed = input.trim()
  if (/^(https?:\/\/|mailto:)/i.test(trimmed)) {
    return trimmed
  }
  // If no valid protocol, assume https
  if (/^[a-zA-Z0-9]/.test(trimmed) && !trimmed.includes(':')) {
    return `https://${trimmed}`
  }
  return '' // Return empty for invalid/dangerous URLs
}

/**
 * Sanitize a filename — remove path traversal and dangerous characters.
 */
export function sanitizeFilename(input: string): string {
  return input
    .replace(/\.\./g, '')  // Remove path traversal
    .replace(/[/\\]/g, '')  // Remove path separators
    .replace(/[<>:"|?*]/g, '')  // Remove dangerous chars
    .replace(/\x00/g, '')  // Remove null bytes
    .trim()
}
