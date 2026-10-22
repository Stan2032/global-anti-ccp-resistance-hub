import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import InteractiveTimeline from '../components/InteractiveTimeline';
import timelineEvents from '../data/timeline_events.json';

// Derived, not hard-coded. This is a human-rights timeline: events get added,
// and a test suite that breaks every time one is should not be what stands
// between a maintainer and recording an event.
const TOTAL = (timelineEvents as unknown[]).length;
const HK_COUNT = (timelineEvents as { category: string }[])
  .filter(e => e.category === 'hongkong').length;

// Mock SourceAttribution to simplify rendering
vi.mock('../components/ui/SourceAttribution', () => ({
  default: ({ source }: { source?: { name?: string } }) => <span data-testid="source">{source?.name || 'source'}</span>,
}));

describe('InteractiveTimeline', () => {
  // --- Rendering ---

  it('renders the timeline header', () => {
    render(<InteractiveTimeline />);
    expect(screen.getByText('Interactive Timeline')).toBeTruthy();
    expect(screen.getByText('Key events in the struggle against CCP authoritarianism')).toBeTruthy();
  });

  it('renders all category filter buttons', () => {
    render(<InteractiveTimeline />);
    expect(screen.getByText('All Events')).toBeTruthy();
    // Hong Kong, Tibet, etc. appear in both filters and legend, so use getAllByText
    expect(screen.getAllByText('Hong Kong').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Uyghur/Xinjiang').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Tibet').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Mainland China').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Falun Gong').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Global').length).toBeGreaterThanOrEqual(2);
  });

  it('shows total event count in statistics', () => {
    render(<InteractiveTimeline />);
    expect(screen.getAllByText(String(TOTAL)).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Total Events')).toBeTruthy();
  });

  it('says how many events it lists', () => {
    render(<InteractiveTimeline />);
    expect(screen.getByRole('status').textContent).toBe(`${TOTAL} events, oldest first`);
  });

  it('renders legend with significance levels and categories', () => {
    render(<InteractiveTimeline />);
    expect(screen.getByText('Legend')).toBeTruthy();
    expect(screen.getByText('Critical Event')).toBeTruthy();
    expect(screen.getByText('High Significance')).toBeTruthy();
  });

  it('renders zoom controls once JavaScript runs', () => {
    render(<InteractiveTimeline />);
    expect(screen.getByLabelText('Zoom in')).toBeTruthy();
    expect(screen.getByLabelText('Zoom out')).toBeTruthy();
  });

  // --- Every event, without JavaScript ---
  // Each event's description and details appeared only in a panel that
  // opened when a dot was clicked, so the pre-rendered page held none of
  // them: a reader without JavaScript got the dots and "Click on a timeline
  // marker". Every event is now a native <details> in the page.

  const EVENTS = timelineEvents as { id: number; date: string; title: string; description: string; details: string; impact: string; category: string }[];
  const eventDetails = (id: number) => document.getElementById(`timeline-event-${id}`) as HTMLDetailsElement;

  it('puts every event in the page before any click, each a closed native disclosure', () => {
    render(<InteractiveTimeline />);
    expect(EVENTS.length).toBeGreaterThan(0);
    for (const event of EVENTS) {
      const details = eventDetails(event.id);
      expect(details?.tagName, event.title).toBe('DETAILS');
      expect(details.open).toBe(false);
      expect(details.querySelector(':scope > summary')!.textContent).toContain(event.title);
      expect(details.textContent).toContain(event.description);
      expect(details.textContent).toContain(event.details.split('\n')[0]);
      expect(details.textContent).toContain(event.impact);
    }
    expect(screen.queryByText(/Click on a timeline marker/)).toBeNull();
  });

  it('links every dot to its event, and following one opens it', () => {
    const { container } = render(<InteractiveTimeline />);
    const dots = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="#timeline-event-"]')];
    expect(dots).toHaveLength(TOTAL);
    for (const dot of dots) {
      const id = dot.getAttribute('href')!.slice(1);
      expect(document.getElementById(id)?.tagName, id).toBe('DETAILS');
      const event = EVENTS.find(e => `timeline-event-${e.id}` === id)!;
      expect(dot.getAttribute('aria-label')).toBe(`${event.date.slice(0, 4)}: ${event.title}`);
    }
    const first = EVENTS[0];
    fireEvent.click(dots.find(d => d.getAttribute('href') === `#timeline-event-${first.id}`)!);
    expect(eventDetails(first.id).open).toBe(true);
  });

  // The date is pre-rendered. Formatted in the reader's own timezone, a
  // reader west of UTC would see the day before, and React would discard
  // the page over the mismatch.
  it('shows the same date in any timezone', () => {
    const tz = process.env.TZ;
    process.env.TZ = 'America/Los_Angeles';
    try {
      render(<InteractiveTimeline />);
      const tiananmen = EVENTS.find(e => e.date === '1989-06-04')!;
      expect(tiananmen).toBeTruthy();
      expect(eventDetails(tiananmen.id).querySelector('summary')!.textContent).toContain('June 4, 1989');
    } finally {
      process.env.TZ = tz;
    }
  });

  it("names every event's category with one the filter offers", () => {
    render(<InteractiveTimeline />);
    const group = screen.getByRole('group', { name: 'Filter timeline events by region' });
    const offered = within(group).getAllByRole('button').map(b => b.textContent);
    for (const event of EVENTS) {
      const labels = [...eventDetails(event.id).querySelectorAll('summary span span')].map(s => s.textContent);
      expect(labels.some(l => offered.includes(l)), `${event.title}: ${event.category}`).toBe(true);
    }
  });

  // --- Category filtering ---

  it('filters events when a category is selected', () => {
    render(<InteractiveTimeline />);
    const group = screen.getByRole('group', { name: 'Filter timeline events by region' });
    fireEvent.click(within(group).getByRole('button', { name: 'Hong Kong' }));
    expect(screen.getByRole('status').textContent).toBe(`${HK_COUNT} of ${TOTAL} events, oldest first`);
    expect(document.querySelectorAll('details[id^="timeline-event-"]')).toHaveLength(HK_COUNT);
  });

  it('returns to all events when All Events is clicked', () => {
    render(<InteractiveTimeline />);
    const group = screen.getByRole('group', { name: 'Filter timeline events by region' });
    fireEvent.click(within(group).getByRole('button', { name: 'Hong Kong' }));
    fireEvent.click(within(group).getByRole('button', { name: 'All Events' }));
    expect(screen.getByRole('status').textContent).toBe(`${TOTAL} events, oldest first`);
    expect(within(group).getByRole('button', { name: 'All Events' }).getAttribute('aria-pressed')).toBe('true');
  });

  // --- Statistics ---

  it('shows statistics for critical events and Hong Kong events', () => {
    render(<InteractiveTimeline />);
    expect(screen.getByText('Critical Events')).toBeTruthy();
    expect(screen.getByText('Hong Kong Events')).toBeTruthy();
    expect(screen.getByText('Years Covered')).toBeTruthy();
  });
});
