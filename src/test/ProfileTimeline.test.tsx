import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { ProfileTimeline, type TimelineEntry } from '../components/ProfileTimeline';

const EVENTS: TimelineEntry[] = [
  { year: '2020', title: 'Arrested', detail: 'Arrested under the NSL.', sourceUrl: 'https://example.org/a', label: 'Legal' },
  { year: '2021', title: 'Sentenced', detail: 'Sentenced to 14 months.' },
];

describe('ProfileTimeline', () => {
  it('renders each event as a native disclosure', () => {
    const { container } = render(<ProfileTimeline events={EVENTS} />);
    const details = container.querySelectorAll('ol > li > details');
    expect(details).toHaveLength(2);
    expect(details[0].querySelector('summary')!.textContent).toContain('2020');
    expect(details[0].querySelector('summary')!.textContent).toContain('Legal');
    expect(details[0].querySelector('summary')!.textContent).toContain('Arrested');
  });

  it('keeps the detail and source in the page without a click', () => {
    const { container } = render(<ProfileTimeline events={EVENTS} />);
    expect(container.textContent).toContain('Arrested under the NSL.');
    expect(container.textContent).toContain('Sentenced to 14 months.');
    const source = screen.getByRole('link', { name: /Source/ });
    expect(source.getAttribute('href')).toBe('https://example.org/a');
    // The source is outside the summary, not nested in a control.
    expect(source.closest('summary')).toBeNull();
  });

  it('offers Expand all only once JavaScript runs', () => {
    // Pre-rendered HTML: no button that would do nothing without JavaScript.
    expect(renderToString(<ProfileTimeline events={EVENTS} />)).not.toContain('Expand all');
    const { container } = render(<ProfileTimeline events={EVENTS} />);
    const details = [...container.querySelectorAll('details')];
    expect(details.every(d => !d.open)).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }));
    expect(details.every(d => d.open)).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Collapse all' }));
    expect(details.every(d => !d.open)).toBe(true);
  });
});
