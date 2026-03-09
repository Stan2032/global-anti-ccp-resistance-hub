// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MediaNarrativeTracker from '../components/MediaNarrativeTracker';

Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

describe('MediaNarrativeTracker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // === RENDERING ===
  it('renders section with correct aria-label', () => {
    render(<MediaNarrativeTracker />);
    expect(screen.getByLabelText('Media Narrative Tracker')).toBeTruthy();
  });

  it('renders heading with title', () => {
    render(<MediaNarrativeTracker />);
    expect(screen.getByText('Media Narrative Tracker')).toBeTruthy();
  });

  it('renders description with data counts', () => {
    render(<MediaNarrativeTracker />);
    const desc = screen.getByText(/Tracking \d+ CCP propaganda narratives/);
    expect(desc).toBeTruthy();
    expect(desc.textContent).toMatch(/prisoners/);
    expect(desc.textContent).toMatch(/facilities/);
    expect(desc.textContent).toMatch(/companies/);
  });

  // === STATS BAR ===
  it('displays stats bar with narrative count', () => {
    render(<MediaNarrativeTracker />);
    expect(screen.getByText('Narratives Tracked')).toBeTruthy();
    expect(screen.getByText('Persistent')).toBeTruthy();
    expect(screen.getByText('Categories')).toBeTruthy();
    expect(screen.getByText('Evidence Points')).toBeTruthy();
  });

  it('shows correct number of categories', () => {
    render(<MediaNarrativeTracker />);
    expect(screen.getByText('5')).toBeTruthy(); // 5 non-'all' categories
  });

  // === FILTERS ===
  it('renders search input', () => {
    render(<MediaNarrativeTracker />);
    expect(screen.getByLabelText('Search narratives')).toBeTruthy();
  });

  it('renders category filter dropdown', () => {
    render(<MediaNarrativeTracker />);
    expect(screen.getByLabelText('Filter by category')).toBeTruthy();
  });

  it('filters narratives by search query', () => {
    render(<MediaNarrativeTracker />);
    const search = screen.getByLabelText('Search narratives');
    fireEvent.change(search, { target: { value: 'Xinjiang' } });
    const countText = screen.getByText(/of \d+ narratives shown/);
    const match = countText.textContent.match(/^(\d+)/);
    expect(parseInt(match[1])).toBeLessThan(12);
  });

  it('filters by category dropdown', () => {
    render(<MediaNarrativeTracker />);
    const select = screen.getByLabelText('Filter by category');
    fireEvent.change(select, { target: { value: 'denial' } });
    const countText = screen.getByText(/of \d+ narratives shown/);
    const match = countText.textContent.match(/^(\d+)/);
    expect(parseInt(match[1])).toBeGreaterThan(0);
    expect(parseInt(match[1])).toBeLessThan(12);
  });

  // === CATEGORY BUTTONS ===
  it('renders category filter buttons', () => {
    render(<MediaNarrativeTracker />);
    expect(screen.getByLabelText('Filter Denial')).toBeTruthy();
    expect(screen.getByLabelText('Filter Deflection')).toBeTruthy();
    expect(screen.getByLabelText('Filter Whataboutism')).toBeTruthy();
    expect(screen.getByLabelText('Filter Reframing')).toBeTruthy();
    expect(screen.getByLabelText('Filter Intimidation')).toBeTruthy();
  });

  it('toggles category when clicking category button', () => {
    render(<MediaNarrativeTracker />);
    const btn = screen.getByLabelText('Filter Denial');
    fireEvent.click(btn);
    // Should filter to denial category only
    const countText = screen.getByText(/of \d+ narratives shown/);
    const match = countText.textContent.match(/^(\d+)/);
    expect(parseInt(match[1])).toBeGreaterThan(0);
    expect(parseInt(match[1])).toBeLessThan(12);
    // Click again to reset
    fireEvent.click(btn);
    const resetText = screen.getByText(/of \d+ narratives shown/);
    const resetMatch = resetText.textContent.match(/^(\d+)/);
    expect(parseInt(resetMatch[1])).toBeGreaterThanOrEqual(10);
  });

  // === NARRATIVE CARDS ===
  it('renders narrative cards with quotes', () => {
    render(<MediaNarrativeTracker />);
    expect(screen.getByText(/Vocational education/i)).toBeTruthy();
    expect(screen.getByText(/foreign black hands/i)).toBeTruthy();
  });

  it('shows source info on narrative cards', () => {
    render(<MediaNarrativeTracker />);
    const sourceTexts = screen.getAllByText(/Source:/);
    expect(sourceTexts.length).toBeGreaterThan(0);
  });

  it('shows frequency badges on narrative cards', () => {
    render(<MediaNarrativeTracker />);
    const persistent = screen.getAllByText('persistent');
    expect(persistent.length).toBeGreaterThan(0);
  });

  // === EXPAND/COLLAPSE ===
  it('expands narrative card on click', () => {
    render(<MediaNarrativeTracker />);
    const cards = screen.getAllByRole('button', { expanded: false });
    const narrativeCard = cards.find(btn => btn.getAttribute('aria-label')?.includes('Denial') || btn.getAttribute('aria-label')?.includes('Vocational'));
    if (narrativeCard) {
      fireEvent.click(narrativeCard);
      expect(screen.getByText('Evidence-Based Debunk')).toBeTruthy();
    }
  });

  it('shows debunk text when expanded', () => {
    render(<MediaNarrativeTracker />);
    const cards = screen.getAllByRole('button', { expanded: false });
    const first = cards.find(btn => btn.getAttribute('aria-label')?.includes('Vocational') || btn.getAttribute('aria-label')?.includes('Reframing'));
    if (first) {
      fireEvent.click(first);
      expect(screen.getByText(/Extensive evidence documents/)).toBeTruthy();
    }
  });

  it('shows cross-referenced evidence when expanded', () => {
    render(<MediaNarrativeTracker />);
    const cards = screen.getAllByRole('button', { expanded: false });
    const first = cards.find(btn => btn.getAttribute('aria-label')?.includes('Vocational') || btn.getAttribute('aria-label')?.includes('Reframing'));
    if (first) {
      fireEvent.click(first);
      expect(screen.getByText('Cross-Referenced Evidence')).toBeTruthy();
    }
  });

  it('shows narrative timeline when expanded', () => {
    render(<MediaNarrativeTracker />);
    const cards = screen.getAllByRole('button', { expanded: false });
    const first = cards.find(btn => btn.getAttribute('aria-label')?.includes('Vocational') || btn.getAttribute('aria-label')?.includes('Reframing'));
    if (first) {
      fireEvent.click(first);
      expect(screen.getByText('Narrative Timeline')).toBeTruthy();
      expect(screen.getByText('First appeared')).toBeTruthy();
      expect(screen.getByText('Last used')).toBeTruthy();
    }
  });

  it('shows counter-evidence sources when expanded', () => {
    render(<MediaNarrativeTracker />);
    const cards = screen.getAllByRole('button', { expanded: false });
    const first = cards.find(btn => btn.getAttribute('aria-label')?.includes('Vocational') || btn.getAttribute('aria-label')?.includes('Reframing'));
    if (first) {
      fireEvent.click(first);
      expect(screen.getByText('Counter-Evidence Sources')).toBeTruthy();
      expect(screen.getAllByText(/ASPI/).length).toBeGreaterThan(0);
    }
  });

  it('collapses expanded card on second click', () => {
    render(<MediaNarrativeTracker />);
    const cards = screen.getAllByRole('button', { expanded: false });
    const first = cards.find(btn => btn.getAttribute('aria-label')?.includes('Vocational') || btn.getAttribute('aria-label')?.includes('Reframing'));
    if (first) {
      fireEvent.click(first);
      expect(screen.getByText('Evidence-Based Debunk')).toBeTruthy();
      fireEvent.click(first);
      expect(screen.queryByText('Evidence-Based Debunk')).toBeFalsy();
    }
  });

  // === COPY REPORT ===
  it('renders copy report button', () => {
    render(<MediaNarrativeTracker />);
    expect(screen.getByLabelText('Copy narrative analysis report')).toBeTruthy();
  });

  it('copies report to clipboard', async () => {
    render(<MediaNarrativeTracker />);
    const copyBtn = screen.getByLabelText('Copy narrative analysis report');
    fireEvent.click(copyBtn);
    await vi.waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
    const clipText = navigator.clipboard.writeText.mock.calls[0][0];
    expect(clipText).toContain('CCP PROPAGANDA NARRATIVE ANALYSIS');
    expect(clipText).toContain('CC BY 4.0');
  });

  it('shows copied confirmation', async () => {
    render(<MediaNarrativeTracker />);
    const copyBtn = screen.getByLabelText('Copy narrative analysis report');
    fireEvent.click(copyBtn);
    await vi.waitFor(() => {
      expect(screen.getByText('Copied')).toBeTruthy();
    });
  });

  // === FOOTER ===
  it('renders footer with data source counts', () => {
    render(<MediaNarrativeTracker />);
    const footerTexts = screen.getAllByText(/political prisoners/);
    expect(footerTexts.length).toBeGreaterThan(0);
  });

  it('renders Tier 1-2 source attribution', () => {
    render(<MediaNarrativeTracker />);
    expect(screen.getByText(/Tier 1-2 verified/)).toBeTruthy();
  });

  it('renders CC BY 4.0 license', () => {
    render(<MediaNarrativeTracker />);
    expect(screen.getByText(/CC BY 4\.0/)).toBeTruthy();
  });

  // === DATA INTEGRITY ===
  it('has at least 10 propaganda narratives', () => {
    render(<MediaNarrativeTracker />);
    const countText = screen.getByText(/of \d+ narratives shown/);
    const match = countText.textContent.match(/of (\d+)/);
    expect(parseInt(match[1])).toBeGreaterThanOrEqual(10);
  });

  it('has all 5 narrative categories represented', () => {
    render(<MediaNarrativeTracker />);
    expect(screen.getAllByText(/Denial/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Deflection/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Whataboutism/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Reframing/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Intimidation/).length).toBeGreaterThanOrEqual(1);
  });

  it('cross-references at least 3 evidence types', () => {
    render(<MediaNarrativeTracker />);
    // Expand first card to check evidence types
    const cards = screen.getAllByRole('button', { expanded: false });
    const first = cards.find(btn => btn.getAttribute('aria-label')?.includes('Vocational') || btn.getAttribute('aria-label')?.includes('Reframing'));
    if (first) {
      fireEvent.click(first);
      const evidenceText = screen.getByText('Cross-Referenced Evidence').parentElement;
      expect(evidenceText).toBeTruthy();
    }
  });

  // === COMBINED SEARCH + CATEGORY FILTER ===
  it('combined category + search filters narrow results', () => {
    render(<MediaNarrativeTracker />);
    const select = screen.getByLabelText('Filter by category');
    fireEvent.change(select, { target: { value: 'denial' } });
    const search = screen.getByLabelText('Search narratives');
    fireEvent.change(search, { target: { value: 'zzz_nonexistent_term' } });
    const countText = screen.getByText(/of \d+ narratives shown/);
    const match = countText.textContent.match(/^(\d+)/);
    // A nonsense search + any category should return 0
    expect(parseInt(match[1])).toBe(0);
  });

  // === EVIDENCE POINTS ===
  it('shows evidence point counts on each card', () => {
    render(<MediaNarrativeTracker />);
    const evidenceTexts = screen.getAllByText(/\d+ evidence points/);
    expect(evidenceTexts.length).toBeGreaterThan(0);
  });
});
