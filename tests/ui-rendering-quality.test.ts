import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const globalsCss = readFileSync(join(root, 'app/globals.css'), 'utf8');
const buttonComponent = readFileSync(join(root, 'components/ui/button.tsx'), 'utf8');
const featureDetailPage = readFileSync(join(root, 'app/features/[slug]/page.tsx'), 'utf8');

describe('UI rendering quality guardrails', () => {
  it('keeps high-refresh motion tokens and crisp text rendering enabled', () => {
    expect(globalsCss).toContain('--motion-frame-budget: 8.333ms');
    expect(globalsCss).toContain('--motion-duration-fast: 100ms');
    expect(globalsCss).toContain('text-rendering: optimizeLegibility');
    expect(globalsCss).toContain('.sharp-text');
  });

  it('avoids blur-prone scaled button press effects', () => {
    expect(buttonComponent).not.toContain('active:scale');
    expect(buttonComponent).toContain('active:translate-y-px');
  });

  it('keeps glass hover motion from scaling text containers', () => {
    const hoverRules = [
      '.liquid-glass-hover:hover',
      '.hover-lift:hover',
      '.hub-button-ring:hover .hub-button-outer',
      '.hub-button-ring:active .hub-button-outer',
    ];

    for (const selector of hoverRules) {
      const start = globalsCss.indexOf(selector);
      expect(start, `${selector} is present`).toBeGreaterThan(-1);
      const block = globalsCss.slice(start, globalsCss.indexOf('}', start));
      expect(block).not.toMatch(/scale\(/);
    }
  });

  it('keeps the textbook resources feature copy polished', () => {
    expect(featureDetailPage).not.toContain('fully integrated with micro-lessons, flashcards, and interactive activities');
    expect(featureDetailPage).toContain('Course-ready resources with 288+ chapters, micro-lessons, flashcards, and built-in activities.');
  });
});
