import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import React from 'react';
import { DisclosureSection } from '../components/DisclosureSection';

describe('DisclosureSection', () => {
  // --- Rendering ---

  it('renders the title and description', () => {
    render(
      <DisclosureSection title="Sign a petition" description="Active petitions.">
        <p>body</p>
      </DisclosureSection>
    );
    expect(screen.getByText('Sign a petition')).toBeTruthy();
    expect(screen.getByText('Active petitions.')).toBeTruthy();
  });

  it('renders children even while collapsed', () => {
    // The point of <details> over a JS accordion: the content is in the
    // document from the start, so it is pre-rendered, indexed, and reachable
    // by find-in-page and assistive technology.
    const { container } = render(
      <DisclosureSection title="Boycott list">
        <p>Forced labour brands</p>
      </DisclosureSection>
    );
    expect(container.querySelector('details')?.hasAttribute('open')).toBe(false);
    expect(screen.getByText('Forced labour brands')).toBeTruthy();
  });

  it('is closed by default and opens with defaultOpen', () => {
    const { container: closed } = render(
      <DisclosureSection title="A"><p>a</p></DisclosureSection>
    );
    expect(closed.querySelector('details')?.hasAttribute('open')).toBe(false);

    const { container: open } = render(
      <DisclosureSection title="B" defaultOpen><p>b</p></DisclosureSection>
    );
    expect(open.querySelector('details')?.hasAttribute('open')).toBe(true);
  });

  it('applies the id so a section can be linked to', () => {
    const { container } = render(
      <DisclosureSection id="petitions" title="A"><p>a</p></DisclosureSection>
    );
    expect(container.querySelector('details')?.id).toBe('petitions');
  });

  it('omits the description element when none is given', () => {
    render(<DisclosureSection title="Only a title"><p>a</p></DisclosureSection>);
    expect(screen.getByText('Only a title')).toBeTruthy();
  });

  // --- The guarantee this component exists for ---

  it('uses native <details>/<summary>, not React state', () => {
    // If someone reimplements this with useState, it stops working for
    // readers with JavaScript disabled — which is how this site tells
    // at-risk readers in China to browse (Tor Browser, Safer or Safest).
    // The control would still look interactive and would do nothing.
    const { container } = render(
      <DisclosureSection title="A"><p>a</p></DisclosureSection>
    );
    const details = container.querySelector('details');
    expect(details, 'must render a native <details>').toBeTruthy();
    expect(details!.querySelector('summary'), 'must render a native <summary>').toBeTruthy();

    const source = readFileSync(
      path.resolve(__dirname, '../components/DisclosureSection.tsx'),
      'utf-8'
    );
    expect(source, 'disclosure must not depend on React state').not.toMatch(/useState|onClick/);
  });
});

describe('open-state styling follows the element’s own <details>', () => {
  // Tailwind's group-open: matches ANY open .group ancestor. Disclosures
  // nest here (cards inside sections inside sections), so a closed card in
  // an open section showed an open chevron, and a closed case study said
  // "Close the case ↑" with its summary hidden. summary-open: (defined in
  // tailwind.config.js) looks only at the <details> the summary belongs to.
  const root = path.resolve(__dirname, '..');

  it('uses summary-open:, never group-open:', () => {
    const offenders = (readdirSync(root, { recursive: true }) as string[])
      .filter((f) => f.endsWith('.tsx') && !f.startsWith(`test${path.sep}`))
      .filter((f) => readFileSync(path.join(root, f), 'utf-8').includes('group-open:'));
    expect(offenders).toEqual([]);
  });

  it('defines summary-open: against the summary’s own parent <details>', () => {
    const config = readFileSync(path.resolve(root, '../tailwind.config.js'), 'utf-8');
    expect(config).toContain(`addVariant('summary-open', 'details[open] > summary &')`);
  });

  it('lets a preview cut short in a summary show in full once its <details> is open', () => {
    // A summary is often a one-line preview (truncate, line-clamp-N). Unless
    // opening the disclosure lifts the cut, the rest of that text is not
    // anywhere on the page: several trackers cut names, locations and
    // triggers that the card body never repeats.
    const offenders: string[] = [];
    for (const f of (readdirSync(root, { recursive: true }) as string[])) {
      if (!f.endsWith('.tsx') || f.startsWith(`test${path.sep}`)) continue;
      const source = readFileSync(path.join(root, f), 'utf-8');
      for (const summary of source.match(/<summary[\s\S]*?<\/summary>/g) ?? []) {
        for (const cls of summary.match(/className=(?:"[^"]*"|\{`[^`]*`\})/g) ?? []) {
          if (/\btruncate\b|\bline-clamp-\d/.test(cls) && !cls.includes('summary-open:')) {
            offenders.push(`${f}: ${cls.slice(0, 90)}`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('turns the section chevron with summary-open:', () => {
    const { container } = render(<DisclosureSection title="A"><p>a</p></DisclosureSection>);
    const chevron = container.querySelector('summary svg');
    expect(chevron?.getAttribute('class')).toContain('summary-open:rotate-90');
    expect(container.querySelector('details')?.className).not.toMatch(/(^|\s)group(\s|$)/);
  });
});

describe('TakeAction uses collapsible sections', () => {
  const source = readFileSync(
    path.resolve(__dirname, '../pages/TakeAction.tsx'),
    'utf-8'
  );

  it('folds its tools into DisclosureSection rather than stacking them', () => {
    // Stacked, these fifteen tools made the page 57,416px tall on desktop and
    // 124,781px on a phone — 148 screens, on the page whose whole job is to
    // get somebody to act.
    const sections = source.match(/<DisclosureSection/g) ?? [];
    expect(sections.length).toBeGreaterThanOrEqual(15);
  });

  it('leaves the two most actionable sections open', () => {
    const open = source.match(/defaultOpen/g) ?? [];
    expect(open.length).toBe(2);
  });
});
