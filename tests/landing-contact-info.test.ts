import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const landingPage = readFileSync(join(process.cwd(), 'app/page.tsx'), 'utf8');

describe('landing page contact information', () => {
  it('shows the public info email in contact and footer areas', () => {
    expect(landingPage).toContain('PRODUCT.email');
    expect(landingPage).toContain('contactEmailHref');
    expect(landingPage).toContain('CopyEmailButton email={contactEmail}');
  });
});
