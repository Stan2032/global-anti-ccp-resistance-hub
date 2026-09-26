import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import MediaNarrativeTracker from '../components/MediaNarrativeTracker';

Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

// Fails on none, so a check run over each card cannot pass on an empty list.
const narratives = (container: HTMLElement) => {
  const cards = [...container.querySelectorAll('details')];
  expect(cards.length, 'cards render as <details>').toBeGreaterThan(0);
  return cards;
};
const narrative = (container: HTMLElement, text: string) =>
  narratives(container).find(c => c.querySelector('summary')!.textContent!.includes(text))!;

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
    const stat = screen.getByText('Categories').parentElement!;
    expect(within(stat).getByText('5')).toBeTruthy(); // 5 non-'all' categories
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
    expect(parseInt(match![1])).toBeLessThan(12);
  });

  it('filters by category dropdown', () => {
    render(<MediaNarrativeTracker />);
    const select = screen.getByLabelText('Filter by category');
    fireEvent.change(select, { target: { value: 'denial' } });
    const countText = screen.getByText(/of \d+ narratives shown/);
    const match = countText.textContent.match(/^(\d+)/);
    expect(parseInt(match![1])).toBeGreaterThan(0);
    expect(parseInt(match![1])).toBeLessThan(12);
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
    expect(parseInt(match![1])).toBeGreaterThan(0);
    expect(parseInt(match![1])).toBeLessThan(12);
    // Click again to reset
    fireEvent.click(btn);
    const resetText = screen.getByText(/of \d+ narratives shown/);
    const resetMatch = resetText.textContent.match(/^(\d+)/);
    expect(parseInt(resetMatch![1])).toBeGreaterThanOrEqual(10);
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

  // === NATIVE DISCLOSURE ===
  it('narrative cards are native disclosures, closed to start', () => {
    const { container } = render(<MediaNarrativeTracker />);
    expect(container.querySelectorAll('[aria-expanded]')).toHaveLength(0);
    const cards = narratives(container);
    expect(cards.length).toBeGreaterThanOrEqual(10);
    cards.forEach(c => {
      expect(c.firstElementChild?.tagName).toBe('SUMMARY');
      expect(c.open).toBe(false);
    });
  });

  it('every narrative carries its evidence-based debunk without a click', () => {
    const { container } = render(<MediaNarrativeTracker />);
    narratives(container).forEach(c => expect(within(c).getByText('Evidence-Based Debunk')).toBeTruthy());
    expect(within(narrative(container, 'Vocational')).getByText(/Extensive evidence documents/)).toBeTruthy();
  });

  it('every narrative carries its cross-referenced evidence without a click', () => {
    const { container } = render(<MediaNarrativeTracker />);
    narratives(container).forEach(c => expect(within(c).getByText('Cross-Referenced Evidence')).toBeTruthy());
  });

  it('a narrative shows its timeline without a click', () => {
    const { container } = render(<MediaNarrativeTracker />);
    const card = within(narrative(container, 'Vocational'));
    expect(card.getByText('Narrative Timeline')).toBeTruthy();
    expect(card.getByText('First appeared')).toBeTruthy();
    expect(card.getByText('Last used')).toBeTruthy();
  });

  it('a narrative shows its counter-evidence sources without a click', () => {
    const { container } = render(<MediaNarrativeTracker />);
    const card = within(narrative(container, 'Vocational'));
    expect(card.getByText('Counter-Evidence Sources')).toBeTruthy();
    expect(card.getAllByText(/ASPI/).length).toBeGreaterThan(0);
  });

  it('a narrative card opens and closes natively', () => {
    const { container } = render(<MediaNarrativeTracker />);
    const card = narrative(container, 'Vocational');
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(true);
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(false);
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
    const clipText = vi.mocked(navigator.clipboard.writeText).mock.calls[0][0];
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
    expect(parseInt(match![1])).toBeGreaterThanOrEqual(10);
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
    const { container } = render(<MediaNarrativeTracker />);
    const heading = within(narrative(container, 'Vocational')).getByText('Cross-Referenced Evidence');
    expect(heading.nextElementSibling!.children.length).toBeGreaterThanOrEqual(3);
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
    expect(parseInt(match![1])).toBe(0);
  });

  // === EVIDENCE POINTS ===
  it('shows evidence point counts on each card', () => {
    render(<MediaNarrativeTracker />);
    const evidenceTexts = screen.getAllByText(/\d+ evidence points/);
    expect(evidenceTexts.length).toBeGreaterThan(0);
  });
});
