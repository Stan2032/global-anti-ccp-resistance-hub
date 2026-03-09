import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DataComparisonTool from '../components/DataComparisonTool';

describe('DataComparisonTool', () => {
  // --- Rendering ---

  it('renders the component header', () => {
    render(<DataComparisonTool />);
    expect(screen.getByText('compare_regions')).toBeTruthy();
  });

  it('shows the subtitle', () => {
    render(<DataComparisonTool />);
    expect(screen.getByText(/Side-by-side comparison/)).toBeTruthy();
  });

  it('renders the copy summary button', () => {
    render(<DataComparisonTool />);
    expect(screen.getByText('Copy Summary')).toBeTruthy();
  });

  // --- Region Selector ---

  it('renders all 4 region buttons', () => {
    render(<DataComparisonTool />);
    // Region buttons have aria-pressed attribute — use that to find them
    const regionButtons = screen.getAllByRole('button', { pressed: true }).concat(
      screen.getAllByRole('button', { pressed: false })
    ).filter((btn) => btn.getAttribute('aria-pressed') !== null);
    expect(regionButtons.length).toBe(4);
  });

  it('starts with Hong Kong and Xinjiang selected by default', () => {
    render(<DataComparisonTool />);
    const pressedButtons = screen.getAllByRole('button', { pressed: true })
      .filter((btn) => btn.getAttribute('aria-pressed') === 'true');
    expect(pressedButtons.length).toBe(2);
    const labels = pressedButtons.map((btn) => btn.textContent);
    expect(labels.some((l) => l.includes('Hong Kong'))).toBe(true);
    expect(labels.some((l) => l.includes('Xinjiang'))).toBe(true);
  });

  it('Tibet and Mainland start unselected', () => {
    render(<DataComparisonTool />);
    const tibetBtn = screen.getByText('Tibet').closest('button');
    const mainlandBtn = screen.getByText('Mainland / National').closest('button');
    expect(tibetBtn!.getAttribute('aria-pressed')).toBe('false');
    expect(mainlandBtn!.getAttribute('aria-pressed')).toBe('false');
  });

  it('shows region selector instruction text', () => {
    render(<DataComparisonTool />);
    expect(screen.getByText(/Select 2-3 regions to compare/)).toBeTruthy();
  });

  // --- Region Selection Behavior ---

  it('can select a third region', () => {
    render(<DataComparisonTool />);
    const tibetBtn = screen.getByText('Tibet').closest('button');
    fireEvent.click(tibetBtn!);
    expect(tibetBtn!.getAttribute('aria-pressed')).toBe('true');
  });

  it('disables fourth region when 3 are selected', () => {
    render(<DataComparisonTool />);
    fireEvent.click(screen.getByText('Tibet')!.closest('button')!);
    const mainlandBtn = screen.getByText('Mainland / National').closest('button');
    expect(mainlandBtn!.disabled).toBe(true);
  });

  it('can deselect a region (keeping at least 1)', () => {
    render(<DataComparisonTool />);
    // Find the Hong Kong selector button (has aria-pressed)
    const hkBtns = screen.getAllByText('Hong Kong').map((el) => el.closest('button')).filter((btn) => btn?.getAttribute('aria-pressed') !== null);
    const hkBtn = hkBtns[0];
    fireEvent.click(hkBtn!);
    expect(hkBtn!.getAttribute('aria-pressed')).toBe('false');
  });

  it('cannot deselect the last region', () => {
    render(<DataComparisonTool />);
    // Deselect Hong Kong, leaving only Xinjiang
    const hkBtns = screen.getAllByText('Hong Kong').map((el) => el.closest('button')).filter((btn) => btn?.getAttribute('aria-pressed') !== null);
    fireEvent.click(hkBtns[0]!);
    // Try to deselect Xinjiang — should stay selected
    const xjBtns = screen.getAllByText('Xinjiang / Uyghur').map((el) => el.closest('button')).filter((btn) => btn?.getAttribute('aria-pressed') !== null);
    const xjBtn = xjBtns[0];
    fireEvent.click(xjBtn!);
    expect(xjBtn!.getAttribute('aria-pressed')).toBe('true');
  });

  // --- Comparison Table ---

  it('renders metric column header', () => {
    render(<DataComparisonTool />);
    expect(screen.getByText('Metric')).toBeTruthy();
  });

  it('renders all 5 metric rows', () => {
    render(<DataComparisonTool />);
    expect(screen.getByText('Political Prisoners')).toBeTruthy();
    expect(screen.getByText('Sanctions Actions')).toBeTruthy();
    expect(screen.getByText('Sanctioned Officials')).toBeTruthy();
    expect(screen.getByText('Timeline Events')).toBeTruthy();
    expect(screen.getByText('Detention Facilities')).toBeTruthy();
  });

  it('shows numeric values in comparison cells', () => {
    const { container } = render(<DataComparisonTool />);
    const boldValues = container.querySelectorAll('.text-lg.font-bold.text-white');
    // At least 5 metric rows * 2 selected regions = 10 values
    expect(boldValues.length).toBeGreaterThanOrEqual(10);
  });

  it('shows bar indicators for each value', () => {
    const { container } = render(<DataComparisonTool />);
    const bars = container.querySelectorAll('.h-1.bg-\\[\\#1c2a35\\]');
    expect(bars.length).toBeGreaterThanOrEqual(10);
  });

  it('renders TOTAL DATA POINTS row', () => {
    render(<DataComparisonTool />);
    expect(screen.getByText('TOTAL DATA POINTS')).toBeTruthy();
  });

  it('total values are green', () => {
    const { container } = render(<DataComparisonTool />);
    const greenTotals = container.querySelectorAll('.text-lg.font-bold.text-\\[\\#4afa82\\]');
    expect(greenTotals.length).toBeGreaterThanOrEqual(2);
  });

  // --- Expandable Details ---

  it('metric rows have aria-expanded attribute', () => {
    render(<DataComparisonTool />);
    const prisonersRow = screen.getByText('Political Prisoners').closest('button');
    expect(prisonersRow!.getAttribute('aria-expanded')).toBe('false');
  });

  it('clicking a metric row expands its detail', () => {
    render(<DataComparisonTool />);
    const prisonersRow = screen.getByText('Political Prisoners').closest('button');
    fireEvent.click(prisonersRow!);
    expect(prisonersRow!.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Breakdown')).toBeTruthy();
  });

  it('clicking an expanded metric row collapses it', () => {
    render(<DataComparisonTool />);
    const prisonersRow = screen.getByText('Political Prisoners').closest('button');
    fireEvent.click(prisonersRow!);
    expect(screen.getByText('Breakdown')).toBeTruthy();
    fireEvent.click(prisonersRow!);
    expect(screen.queryByText('Breakdown')).toBeNull();
  });

  it('expanding prisoners shows status breakdown', () => {
    render(<DataComparisonTool />);
    fireEvent.click(screen.getByText('Political Prisoners')!.closest('button')!);
    // Should show at least DETAINED in breakdown
    const breakdownCells = screen.getAllByText(/DETAINED|RELEASED|DISAPPEARED|EXILE|AT RISK/);
    expect(breakdownCells.length).toBeGreaterThanOrEqual(1);
  });

  it('expanding sanctions shows country breakdown', () => {
    render(<DataComparisonTool />);
    fireEvent.click(screen.getByText('Sanctions Actions')!.closest('button')!);
    // Should show country codes in breakdown
    const breakdownCells = screen.getAllByText(/US:|UK:|EU:|CANADA:|AUSTRALIA:/);
    expect(breakdownCells.length).toBeGreaterThanOrEqual(1);
  });

  // --- Copy Summary ---

  it('copy button changes to Copied state', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
    render(<DataComparisonTool />);
    fireEvent.click(screen.getByText('Copy Summary'));
    expect(await screen.findByText('Copied')).toBeTruthy();
  });

  it('copy includes source attribution', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText: writeTextMock } });
    render(<DataComparisonTool />);
    fireEvent.click(screen.getByText('Copy Summary'));
    await screen.findByText('Copied');
    const calledWith = writeTextMock.mock.calls[0][0];
    expect(calledWith).toContain('Global Anti-CCP Resistance Hub');
    expect(calledWith).toContain('CC BY 4.0');
  });

  // --- Source Policy ---

  it('shows source policy disclaimer', () => {
    render(<DataComparisonTool />);
    expect(screen.getByText(/keyword-based and approximate/)).toBeTruthy();
  });

  it('shows CCP state media policy', () => {
    render(<DataComparisonTool />);
    expect(screen.getByText(/CCP state media never cited/)).toBeTruthy();
  });

  it('shows database totals in footer', () => {
    render(<DataComparisonTool />);
    expect(screen.getByText(/prisoners.*sanctions.*officials.*timeline events.*facilities/)).toBeTruthy();
  });

  // --- Column updates on selection change ---

  it('adding Tibet region adds a column', () => {
    const { container } = render(<DataComparisonTool />);
    // Initially 2 regions selected
    const headersBefore = container.querySelectorAll('.text-lg.font-bold.text-white');
    const countBefore = headersBefore.length;

    fireEvent.click(screen.getByText('Tibet')!.closest('button')!);

    const headersAfter = container.querySelectorAll('.text-lg.font-bold.text-white');
    // Should have more values (5 metrics * 3 regions = 15 vs 5 * 2 = 10)
    expect(headersAfter.length).toBeGreaterThan(countBefore);
  });

  // --- No hashtags ---

  it('contains no hashtags', () => {
    const { container } = render(<DataComparisonTool />);
    const allText = container.textContent;
    const hashtagMatch = allText.match(/#[a-zA-Z]/);
    expect(hashtagMatch).toBeNull();
  });

  // --- Accessibility ---

  it('decorative icons have aria-hidden', () => {
    const { container } = render(<DataComparisonTool />);
    const svgs = container.querySelectorAll('svg');
    for (const svg of svgs) {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('copy button has aria-label', () => {
    render(<DataComparisonTool />);
    expect(screen.getByLabelText('Copy comparison summary to clipboard')).toBeTruthy();
  });
});
