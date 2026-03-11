import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimelineGapAnalyzer from '../components/TimelineGapAnalyzer';
import dataApi from '../services/dataApi';

// Mock dataApi
vi.mock('../services/dataApi', () => ({
  default: {
    getTimelineEvents: vi.fn(),
  },
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

describe('TimelineGapAnalyzer', () => {
  const mockEvents = [
    {
      id: 1,
      date: '1989-06-04',
      title: 'Tiananmen Square Massacre',
      category: 'mainland',
      significance: 'critical',
    },
    {
      id: 2,
      date: '1995-05-17',
      title: 'Panchen Lama Abducted',
      category: 'tibet',
      significance: 'critical',
    },
    {
      id: 3,
      date: '1999-07-20',
      title: 'Falun Gong Persecution',
      category: 'falungong',
      significance: 'critical',
    },
    {
      id: 4,
      date: '2008-03-14',
      title: 'Tibetan Uprising',
      category: 'tibet',
      significance: 'high',
    },
    {
      id: 5,
      date: '2020-06-30',
      title: 'NSL Implementation',
      category: 'hongkong',
      significance: 'critical',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dataApi.getTimelineEvents).mockReturnValue(mockEvents);
  });

  // --- Basic Rendering ---

  it('renders component header', () => {
    render(<TimelineGapAnalyzer />);
    expect(screen.getByText('Timeline Gap Analyzer')).toBeInTheDocument();
    expect(
      screen.getByText(/Identify periods in CCP human rights history/)
    ).toBeInTheDocument();
  });

  it('displays overview statistics', () => {
    render(<TimelineGapAnalyzer />);
    expect(screen.getByText('Total Events')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // 5 mock events
    expect(screen.getByText('Year Range')).toBeInTheDocument();
    expect(screen.getByText('1989-2020')).toBeInTheDocument();
  });

  it('calculates coverage percentage', () => {
    render(<TimelineGapAnalyzer />);
    expect(screen.getByText('Coverage')).toBeInTheDocument();
    // 5 years with events out of 32 years (1989-2020) = 16%
    expect(screen.getByText('16%')).toBeInTheDocument();
  });

  it('displays gap years count', () => {
    render(<TimelineGapAnalyzer />);
    expect(screen.getByText('Gap Years')).toBeInTheDocument();
    // 32 total years - 5 years with events = 27 gap years
    expect(screen.getByText('27')).toBeInTheDocument();
  });

  // --- Major Gaps Section ---

  it('identifies and displays major gaps', () => {
    render(<TimelineGapAnalyzer />);
    expect(screen.getByText(/Major Gaps \(2\+ consecutive years\)/)).toBeInTheDocument();
    // Should show gaps like 1990-1994, 1996-1998, 2000-2007, etc.
    expect(screen.getByText('1990 – 1994')).toBeInTheDocument();
  });

  it('shows gap duration', () => {
    render(<TimelineGapAnalyzer />);
    // 1990-1994 is 5 years
    expect(screen.getByText('5 years with no documented events')).toBeInTheDocument();
  });

  it('displays research needed badge on gaps', () => {
    render(<TimelineGapAnalyzer />);
    const badges = screen.getAllByText('RESEARCH NEEDED');
    expect(badges.length).toBeGreaterThan(0);
  });

  // --- Decade Breakdown ---

  it('displays decade breakdown section', () => {
    render(<TimelineGapAnalyzer />);
    expect(screen.getByText('Event Density by Decade')).toBeInTheDocument();
  });

  it('shows events for each decade', () => {
    render(<TimelineGapAnalyzer />);
    expect(screen.getByText('1980s')).toBeInTheDocument();
    expect(screen.getByText('1990s')).toBeInTheDocument();
    expect(screen.getByText('2000s')).toBeInTheDocument();
    expect(screen.getByText('2020s')).toBeInTheDocument();
  });

  it('displays event counts per decade', () => {
    render(<TimelineGapAnalyzer />);
    // 1980s: 1 event (Tiananmen)
    expect(screen.getByText('1980s')).toBeInTheDocument();
    const counts = screen.getAllByText(/1 events \(1 critical, 0 high\)/);
    expect(counts.length).toBeGreaterThan(0);
  });

  it('expands decade details on click', () => {
    render(<TimelineGapAnalyzer />);
    const decade1990s = screen.getByText('1990s');

    // Should not show category breakdown initially
    expect(screen.queryByText('Category Breakdown:')).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(decade1990s);

    // Should now show category breakdown
    expect(screen.getByText('Category Breakdown:')).toBeInTheDocument();
    const tibetCounts = screen.getAllByText('tibet');
    expect(tibetCounts.length).toBeGreaterThan(0);
    const falungongCounts = screen.getAllByText('falungong');
    expect(falungongCounts.length).toBeGreaterThan(0);
  });

  it('collapses decade details on second click', () => {
    render(<TimelineGapAnalyzer />);
    const decade1990s = screen.getByText('1990s');

    // Expand
    fireEvent.click(decade1990s);
    expect(screen.getByText('Category Breakdown:')).toBeInTheDocument();

    // Collapse
    fireEvent.click(decade1990s);
    expect(screen.queryByText('Category Breakdown:')).not.toBeInTheDocument();
  });

  // --- Category Coverage ---

  it('displays category coverage section', () => {
    render(<TimelineGapAnalyzer />);
    expect(screen.getByText('Coverage by Category')).toBeInTheDocument();
  });

  it('shows all categories with event counts', () => {
    render(<TimelineGapAnalyzer />);
    expect(screen.getByText('tibet')).toBeInTheDocument();
    expect(screen.getByText('2 events')).toBeInTheDocument(); // tibet has 2 events
    expect(screen.getByText('hongkong')).toBeInTheDocument();
    const oneEventCounts = screen.getAllByText('1 events');
    expect(oneEventCounts.length).toBe(3); // hongkong, mainland, falungong each have 1 event
  });

  it('calculates category percentages', () => {
    render(<TimelineGapAnalyzer />);
    // tibet: 2/5 = 40%
    expect(screen.getByText('40.0% of total')).toBeInTheDocument();
    // hongkong/mainland/falungong: 1/5 = 20%
    expect(screen.getAllByText('20.0% of total')).toHaveLength(3);
  });

  // --- Research Priorities ---

  it('displays research priorities section', () => {
    render(<TimelineGapAnalyzer />);
    expect(screen.getByText('Research Priorities')).toBeInTheDocument();
  });

  it('suggests investigating multi-year gaps', () => {
    render(<TimelineGapAnalyzer />);
    expect(screen.getByText('Document events during identified multi-year gaps')).toBeInTheDocument();
  });

  it('suggests expanding underrepresented categories', () => {
    render(<TimelineGapAnalyzer />);
    expect(screen.getByText('Expand coverage in underrepresented categories')).toBeInTheDocument();
  });

  it('suggests verifying sources', () => {
    render(<TimelineGapAnalyzer />);
    expect(screen.getByText('Verify all existing events have Tier 1-2 sources')).toBeInTheDocument();
  });

  // --- Copy to Clipboard ---

  it('renders copy analysis button', () => {
    render(<TimelineGapAnalyzer />);
    expect(screen.getByLabelText('Copy analysis to clipboard')).toBeInTheDocument();
  });

  it('copies analysis to clipboard on button click', async () => {
    render(<TimelineGapAnalyzer />);
    const copyButton = screen.getByLabelText('Copy analysis to clipboard');

    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    const copiedText = vi.mocked(navigator.clipboard.writeText).mock.calls[0][0];
    expect(copiedText).toContain('Timeline Coverage Analysis');
    expect(copiedText).toContain('Total Events: 5');
    expect(copiedText).toContain('Year Range: 1989-2020');
  });

  it('shows confirmation after copying', async () => {
    render(<TimelineGapAnalyzer />);
    const copyButton = screen.getByLabelText('Copy analysis to clipboard');

    fireEvent.click(copyButton);

    // Wait for state update and check for "Copied" text
    await screen.findByText('Copied');
    expect(screen.getByText('Copied')).toBeInTheDocument();
  });

  // --- Empty State ---

  it('handles empty timeline data gracefully', () => {
    vi.mocked(dataApi.getTimelineEvents).mockReturnValue([]);
    render(<TimelineGapAnalyzer />);
    expect(screen.getByText('No timeline data available.')).toBeInTheDocument();
  });

  // --- Footer ---

  it('displays analysis metadata in footer', () => {
    render(<TimelineGapAnalyzer />);
    expect(screen.getByText(/Analysis based on 5 documented events/)).toBeInTheDocument();
    expect(screen.getByText(/from 1989-2020/)).toBeInTheDocument();
  });

  // --- Accessibility ---

  it('has proper ARIA labels on interactive elements', () => {
    render(<TimelineGapAnalyzer />);
    const copyButton = screen.getByLabelText('Copy analysis to clipboard');
    expect(copyButton).toHaveAttribute('aria-label');
  });

  it('has aria-expanded on decade buttons', () => {
    render(<TimelineGapAnalyzer />);
    const decade1990s = screen.getByText('1990s');
    const button = decade1990s.closest('button');
    expect(button).toHaveAttribute('aria-expanded');
  });

  it('provides aria-label for percentage bars', () => {
    render(<TimelineGapAnalyzer />);
    const percentageBar = screen.getByLabelText('40.0% coverage');
    expect(percentageBar).toBeInTheDocument();
  });

  // --- Terminal Design Compliance ---

  it('uses terminal color palette', () => {
    const { container } = render(<TimelineGapAnalyzer />);
    // Check for terminal green #4afa82
    expect(container.innerHTML).toContain('#4afa82');
    // Check for terminal cyan #22d3ee
    expect(container.innerHTML).toContain('#22d3ee');
    // Check for yellow warning #fbbf24
    expect(container.innerHTML).toContain('#fbbf24');
  });

  it('uses proper background colors', () => {
    const { container } = render(<TimelineGapAnalyzer />);
    // Check for dark backgrounds
    expect(container.innerHTML).toContain('#111820');
    expect(container.innerHTML).toContain('#0a0e14');
  });
});
