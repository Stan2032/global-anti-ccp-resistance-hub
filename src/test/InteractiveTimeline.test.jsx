import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import InteractiveTimeline from '../components/InteractiveTimeline';

// Mock SourceAttribution to simplify rendering
vi.mock('../components/ui/SourceAttribution', () => ({
  default: ({ source }) => <span data-testid="source">{source?.name || 'source'}</span>,
}));

describe('InteractiveTimeline', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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
    expect(screen.getByText('31')).toBeTruthy();
    expect(screen.getByText('Total Events')).toBeTruthy();
  });

  it('shows event counter showing 1 / N events initially', () => {
    render(<InteractiveTimeline />);
    expect(screen.getByText('1 / 31 events')).toBeTruthy();
  });

  it('shows placeholder when no event is selected', () => {
    render(<InteractiveTimeline />);
    expect(screen.getByText('Click on a timeline marker to view event details')).toBeTruthy();
    expect(screen.getByText('Or press Play to auto-advance through events')).toBeTruthy();
  });

  it('renders legend with significance levels and categories', () => {
    render(<InteractiveTimeline />);
    expect(screen.getByText('Legend')).toBeTruthy();
    expect(screen.getByText('Critical Event')).toBeTruthy();
    expect(screen.getByText('High Significance')).toBeTruthy();
  });

  it('renders zoom controls', () => {
    render(<InteractiveTimeline />);
    expect(screen.getByTitle('Zoom in')).toBeTruthy();
    expect(screen.getByTitle('Zoom out')).toBeTruthy();
  });

  // --- Category filtering ---

  it('filters events when a category is selected', () => {
    render(<InteractiveTimeline />);
    // "Hong Kong" appears in both filter and legend — click the first (filter button)
    const hkButtons = screen.getAllByText('Hong Kong');
    fireEvent.click(hkButtons[0]);
    // 13 HK events
    expect(screen.getByText(/13 events$/)).toBeTruthy();
  });

  it('returns to all events when All Events is clicked', () => {
    render(<InteractiveTimeline />);
    const hkButtons = screen.getAllByText('Hong Kong');
    fireEvent.click(hkButtons[0]);
    expect(screen.getByText(/13 events$/)).toBeTruthy();
    fireEvent.click(screen.getByText('All Events'));
    expect(screen.getByText('1 / 31 events')).toBeTruthy();
  });

  // --- Navigation ---

  it('selects next event when forward button is clicked', () => {
    render(<InteractiveTimeline />);
    // Get the forward (ChevronRight) button — it's after the Play button
    const buttons = screen.getAllByRole('button');
    // Find the forward nav button — buttons[0] is zoom out, buttons[1] is zoom in, 
    // then category filters (7), then prev, play, next
    // Let's find by clicking forward and checking counter changes
    const nextBtn = buttons.find(b => b.querySelector('.lucide-chevron-right'));
    fireEvent.click(nextBtn);
    // Should now show event details (since clicking next selects an event)
    expect(screen.getByText('2 / 31 events')).toBeTruthy();
  });

  it('wraps around when navigating past the last event', () => {
    render(<InteractiveTimeline />);
    // Click Previous from index 0 to wrap to last
    const buttons = screen.getAllByRole('button');
    const prevBtn = buttons.find(b => b.querySelector('.lucide-chevron-left'));
    fireEvent.click(prevBtn);
    expect(screen.getByText('31 / 31 events')).toBeTruthy();
  });

  // --- Event selection ---

  it('displays event details when a timeline marker is clicked', () => {
    render(<InteractiveTimeline />);
    // Click the first timeline marker (event buttons have title attributes)
    const markers = screen.getAllByTitle(/./);
    // Filter to only timeline event markers (not zoom controls)
    const eventMarkers = markers.filter(m => !['Zoom in', 'Zoom out'].includes(m.getAttribute('title')));
    if (eventMarkers.length > 0) {
      fireEvent.click(eventMarkers[0]);
      // Should now show event details (no more placeholder)
      expect(screen.queryByText('Click on a timeline marker to view event details')).toBeNull();
    }
  });

  // --- Auto-play ---

  it('auto-plays through events when Play is clicked', async () => {
    render(<InteractiveTimeline />);
    const buttons = screen.getAllByRole('button');
    const playBtn = buttons.find(b => b.querySelector('.lucide-play'));
    
    fireEvent.click(playBtn);
    // After 3 seconds, should advance to next event
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
    // Should have advanced (counter should change)
    expect(screen.getByText('2 / 31 events')).toBeTruthy();
    // Should show event details
    expect(screen.queryByText('Click on a timeline marker to view event details')).toBeNull();
  });

  it('stops auto-play when Pause is clicked', async () => {
    render(<InteractiveTimeline />);
    const buttons = screen.getAllByRole('button');
    const playBtn = buttons.find(b => b.querySelector('.lucide-play'));
    
    // Start playing
    fireEvent.click(playBtn);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
    expect(screen.getByText('2 / 31 events')).toBeTruthy();
    
    // Pause
    const pauseBtn = screen.getAllByRole('button').find(b => b.querySelector('.lucide-pause'));
    fireEvent.click(pauseBtn);
    
    // Advance time — should NOT move forward
    await act(async () => {
      await vi.advanceTimersByTimeAsync(6000);
    });
    expect(screen.getByText('2 / 31 events')).toBeTruthy();
  });

  // --- Statistics ---

  it('shows statistics for critical events and Hong Kong events', () => {
    render(<InteractiveTimeline />);
    expect(screen.getByText('Critical Events')).toBeTruthy();
    expect(screen.getByText('Hong Kong Events')).toBeTruthy();
    expect(screen.getByText('Years Covered')).toBeTruthy();
  });
});
