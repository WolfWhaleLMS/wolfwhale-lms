import { describe, it, expect } from 'vitest'
import {
  sanitizeText,
  sanitizeRichText,
  sanitizeUrl,
  stripHtml,
  sanitizeFilename,
} from '@/lib/sanitize'

// ────────────────────────────────────────────────────────────────
// sanitizeText
// ────────────────────────────────────────────────────────────────
describe('sanitizeText', () => {
  it('passes through normal text unchanged', () => {
    expect(sanitizeText('Hello world')).toBe('Hello world')
  })

  it('strips simple HTML tags', () => {
    expect(sanitizeText('<b>bold</b>')).toBe('bold')
  })

  it('strips script tags completely', () => {
    expect(sanitizeText('<script>alert("xss")</script>')).toBe('alert("xss")')
  })

  it('strips nested tags', () => {
    expect(sanitizeText('<div><span>text</span></div>')).toBe('text')
  })

  it('strips img tags with onerror payload', () => {
    const input = '<img onerror="alert(1)" src="x">'
    const result = sanitizeText(input)
    expect(result).not.toContain('<img')
    expect(result).not.toContain('onerror')
  })

  it('collapses multiple whitespace into single space', () => {
    expect(sanitizeText('hello    world')).toBe('hello world')
  })

  it('trims leading and trailing whitespace', () => {
    expect(sanitizeText('  hello  ')).toBe('hello')
  })

  it('handles empty string', () => {
    expect(sanitizeText('')).toBe('')
  })

  it('decodes HTML entities and then strips any resulting tags', () => {
    // &amp; decodes to &, &lt; decodes to <, &gt; decodes to >
    // The < and > form a tag-like structure which stripHtml then removes
    // So only & survives
    expect(sanitizeText('&amp; &lt; &gt;')).toBe('&')
    // Plain &amp; decodes correctly
    expect(sanitizeText('&amp;')).toBe('&')
  })

  it('handles deeply nested malicious tags', () => {
    const input = '<<script>script>alert(1)<</script>/script>'
    const result = sanitizeText(input)
    expect(result).not.toContain('<script')
    expect(result).not.toContain('</script')
  })
})

// ────────────────────────────────────────────────────────────────
// sanitizeRichText
// ────────────────────────────────────────────────────────────────
describe('sanitizeRichText', () => {
  it('removes script tags and their content', () => {
    const input = '<p>Hello</p><script>alert("xss")</script><p>World</p>'
    const result = sanitizeRichText(input)
    expect(result).not.toContain('script')
    expect(result).toContain('<p>Hello</p>')
    expect(result).toContain('<p>World</p>')
  })

  it('preserves safe HTML tags', () => {
    const input = '<p><strong>Bold</strong> and <em>italic</em></p>'
    expect(sanitizeRichText(input)).toBe(input)
  })

  it('removes iframe tags', () => {
    const input = '<iframe src="https://evil.com"></iframe>'
    expect(sanitizeRichText(input)).not.toContain('iframe')
  })

  it('removes object and embed tags', () => {
    const input = '<object data="evil.swf"></object><embed src="evil.swf">'
    const result = sanitizeRichText(input)
    expect(result).not.toContain('object')
    expect(result).not.toContain('embed')
  })

  it('removes event handler attributes', () => {
    const input = '<img src="x" onerror="alert(1)">'
    const result = sanitizeRichText(input)
    expect(result).not.toContain('onerror')
  })

  it('removes onclick handlers', () => {
    const input = '<a href="#" onclick="steal()">click</a>'
    const result = sanitizeRichText(input)
    expect(result).not.toContain('onclick')
  })

  it('removes javascript: protocol in attributes', () => {
    const input = '<a href="javascript:alert(1)">click</a>'
    const result = sanitizeRichText(input)
    expect(result).not.toContain('javascript:')
  })

  it('removes vbscript: protocol', () => {
    const input = '<a href="vbscript:msgbox(1)">click</a>'
    const result = sanitizeRichText(input)
    expect(result).not.toContain('vbscript:')
  })

  it('removes data:base64 payloads', () => {
    const input = '<img src="data:text/html;base64,PHNjcmlwdD4=">'
    const result = sanitizeRichText(input)
    expect(result).not.toContain('base64')
  })

  it('removes CSS expression() attacks', () => {
    const input = '<div style="width: expression(alert(1))">'
    const result = sanitizeRichText(input)
    expect(result).not.toContain('expression(')
  })

  it('removes form tags', () => {
    const input = '<form action="https://evil.com"><input></form>'
    const result = sanitizeRichText(input)
    expect(result).not.toContain('form')
  })

  it('removes svg tags', () => {
    const input = '<svg onload="alert(1)"><circle></circle></svg>'
    const result = sanitizeRichText(input)
    expect(result).not.toContain('svg')
  })

  it('removes control characters', () => {
    const input = 'Hello\x00\x01\x02World'
    const result = sanitizeRichText(input)
    expect(result).toBe('HelloWorld')
  })

  it('handles empty string', () => {
    expect(sanitizeRichText('')).toBe('')
  })
})

// ────────────────────────────────────────────────────────────────
// sanitizeUrl
// ────────────────────────────────────────────────────────────────
describe('sanitizeUrl', () => {
  it('allows https URLs', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com/')
  })

  it('allows http URLs', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com/')
  })

  it('allows mailto URLs', () => {
    expect(sanitizeUrl('mailto:user@example.com')).toBe('mailto:user@example.com')
  })

  it('blocks javascript: URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('')
  })

  it('blocks data: URLs', () => {
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('')
  })

  it('blocks vbscript: URLs', () => {
    expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('')
  })

  it('blocks ftp: URLs', () => {
    expect(sanitizeUrl('ftp://evil.com/file')).toBe('')
  })

  it('blocks URLs with embedded credentials', () => {
    expect(sanitizeUrl('https://user:pass@example.com')).toBe('')
  })

  it('prepends https:// to bare domains', () => {
    // The function uses string concatenation, not URL parsing, so no trailing slash
    expect(sanitizeUrl('example.com')).toBe('https://example.com')
  })

  it('trims whitespace', () => {
    expect(sanitizeUrl('  https://example.com  ')).toBe('https://example.com/')
  })

  it('strips control characters', () => {
    expect(sanitizeUrl('https://example\x00.com')).toBe('https://example.com/')
  })

  it('returns empty for empty string', () => {
    expect(sanitizeUrl('')).toBe('')
  })

  it('returns empty for only whitespace', () => {
    expect(sanitizeUrl('   ')).toBe('')
  })
})

// ────────────────────────────────────────────────────────────────
// stripHtml
// ────────────────────────────────────────────────────────────────
describe('stripHtml', () => {
  it('removes all HTML tags', () => {
    expect(stripHtml('<div><p>Hello <b>world</b></p></div>')).toBe('Hello world')
  })

  it('decodes HTML entities then strips resulting tags', () => {
    // &lt;script&gt; decodes to <script> which is then stripped as a tag
    expect(stripHtml('&lt;script&gt;')).toBe('')
    // &amp; alone decodes to &
    expect(stripHtml('5 &amp; 10')).toBe('5 & 10')
  })

  it('handles self-closing tags', () => {
    expect(stripHtml('Hello<br/>World')).toBe('HelloWorld')
  })
})

// ────────────────────────────────────────────────────────────────
// sanitizeFilename
// ────────────────────────────────────────────────────────────────
describe('sanitizeFilename', () => {
  it('passes through a normal filename', () => {
    expect(sanitizeFilename('report.pdf')).toBe('report.pdf')
  })

  it('removes path traversal sequences', () => {
    expect(sanitizeFilename('../../etc/passwd')).not.toContain('..')
    expect(sanitizeFilename('../../etc/passwd')).not.toContain('/')
  })

  it('removes directory separators', () => {
    expect(sanitizeFilename('foo/bar\\baz')).toBe('foobarbaz')
  })

  it('removes dangerous characters', () => {
    expect(sanitizeFilename('file<>:"|?*.txt')).toBe('file.txt')
  })

  it('prepends "unnamed" for dotfiles', () => {
    expect(sanitizeFilename('.hidden')).toBe('unnamed.hidden')
  })

  it('prepends "unnamed" for empty result', () => {
    expect(sanitizeFilename('')).toBe('unnamed')
  })

  it('truncates to 255 characters', () => {
    const longName = 'a'.repeat(300) + '.txt'
    expect(sanitizeFilename(longName).length).toBeLessThanOrEqual(255)
  })
})
