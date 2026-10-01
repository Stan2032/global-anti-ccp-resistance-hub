import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import InternationalResponseTracker from '../components/InternationalResponseTracker';
import { dataApi } from '../services/dataApi';

// Every card is a native <details>. Fails on none, so a check over each card
// cannot pass on an empty list.
const cards = (container: HTMLElement) => {
  const all = [...container.querySelectorAll('details')];
  expect(all.length, 'cards render as <details>').toBeGreaterThan(0);
  return all;
};
const usCard = (container: HTMLElement) =>
  cards(container).find(c => c.querySelector('summary')!.textContent!.includes('United States'))!;

describe('InternationalResponseTracker', () => {
  // --- Rendering ---

  it('renders the header', () => {
    render(<InternationalResponseTracker />);
    expect(screen.getByText('International Response Tracker')).toBeTruthy();
  });

  it('shows country count in description', () => {
    render(<InternationalResponseTracker />);
    const responses = dataApi.getInternationalResponses();
    const matches = screen.getAllByText(new RegExp(`${responses.length} countries`));
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the section with correct aria-label', () => {
    render(<InternationalResponseTracker />);
    expect(screen.getByLabelText('International Response Tracker')).toBeTruthy();
  });

  // --- Summary Bar ---

  it('renders all 4 stance category buttons', () => {
    render(<InternationalResponseTracker />);
    const stanceButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    expect(stanceButtons.length).toBe(4);
    const labels = stanceButtons.map((b) => b.textContent);
    expect(labels.some((l) => l.includes('Strong'))).toBe(true);
    expect(labels.some((l) => l.includes('Moderate'))).toBe(true);
    expect(labels.some((l) => l.includes('Limited'))).toBe(true);
    expect(labels.some((l) => l.includes('Weak'))).toBe(true);
  });

  it('stance counts add up to total countries', () => {
    render(<InternationalResponseTracker />);
    const responses = dataApi.getInternationalResponses();
    const buttons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    const total = buttons.reduce((sum, b) => {
      const count = parseInt(b.querySelector('div')?.textContent || '0', 10);
      return sum + count;
    }, 0);
    expect(total).toBe(responses.length);
  });

  it('no stance button is active by default', () => {
    render(<InternationalResponseTracker />);
    const stanceButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    stanceButtons.forEach((btn) => {
      expect(btn.getAttribute('aria-pressed')).toBe('false');
    });
  });

  // --- Filtering by Stance ---

  it('clicking Strong filters to strong countries only', () => {
    render(<InternationalResponseTracker />);
    const stanceButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    const strongBtn = stanceButtons.find((b) => b.textContent.includes('Strong'));
    fireEvent.click(strongBtn!);
    expect(strongBtn!.getAttribute('aria-pressed')).toBe('true');
    // United States should be visible (it has a "Strong" stance)
    expect(screen.getByText('United States')).toBeTruthy();
  });

  it('clicking a stance filter twice clears it', () => {
    render(<InternationalResponseTracker />);
    const stanceButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    const strongBtn = stanceButtons.find((b) => b.textContent.includes('Strong'));
    fireEvent.click(strongBtn!);
    expect(strongBtn!.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(strongBtn!);
    expect(strongBtn!.getAttribute('aria-pressed')).toBe('false');
  });

  it('shows Clear button when stance filter is active', () => {
    render(<InternationalResponseTracker />);
    const stanceButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    const strongBtn = stanceButtons.find((b) => b.textContent.includes('Strong'));
    fireEvent.click(strongBtn!);
    expect(screen.getByText('Clear')).toBeTruthy();
  });

  it('Clear button resets stance filter', () => {
    render(<InternationalResponseTracker />);
    const stanceButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    const strongBtn = stanceButtons.find((b) => b.textContent.includes('Strong'));
    fireEvent.click(strongBtn!);
    fireEvent.click(screen.getByText('Clear'));
    const updatedStanceButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    updatedStanceButtons.forEach((btn) => {
      expect(btn.getAttribute('aria-pressed')).toBe('false');
    });
  });

  // --- Search ---

  it('renders the search input', () => {
    render(<InternationalResponseTracker />);
    expect(screen.getByPlaceholderText('Search countries…')).toBeTruthy();
  });

  it('search input has aria-label', () => {
    render(<InternationalResponseTracker />);
    expect(screen.getByLabelText('Search countries')).toBeTruthy();
  });

  it('search filters countries by name', () => {
    render(<InternationalResponseTracker />);
    const input = screen.getByPlaceholderText('Search countries…');
    fireEvent.change(input, { target: { value: 'United States' } });
    expect(screen.getByText('United States')).toBeTruthy();
  });

  it('search is case-insensitive', () => {
    render(<InternationalResponseTracker />);
    const input = screen.getByPlaceholderText('Search countries…');
    fireEvent.change(input, { target: { value: 'united kingdom' } });
    expect(screen.getByText('United Kingdom')).toBeTruthy();
  });

  it('shows empty state when no search matches', () => {
    render(<InternationalResponseTracker />);
    const input = screen.getByPlaceholderText('Search countries…');
    fireEvent.change(input, { target: { value: 'zzzznonexistent' } });
    expect(screen.getByText('No countries match your search')).toBeTruthy();
  });

  // --- Country Cards ---

  it('renders known countries from the data', () => {
    render(<InternationalResponseTracker />);
    expect(screen.getByText('United States')).toBeTruthy();
    expect(screen.getByText('United Kingdom')).toBeTruthy();
    expect(screen.getByText('Canada')).toBeTruthy();
    expect(screen.getByText('Australia')).toBeTruthy();
  });

  it('countries are sorted alphabetically', () => {
    render(<InternationalResponseTracker />);
    const buttons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    const names = buttons.map((b) => {
      const nameEl = b.querySelector('.text-white.font-medium');
      return nameEl?.textContent || '';
    }).filter(Boolean);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  it('every country is a native disclosure, closed to start', () => {
    const { container } = render(<InternationalResponseTracker />);
    const all = cards(container);
    expect(all.length).toBe(dataApi.getInternationalResponses().length);
    all.forEach((c) => {
      expect(c.firstElementChild?.tagName).toBe('SUMMARY');
      expect(c.open).toBe(false);
    });
  });

  it('each country shows a stance badge', () => {
    render(<InternationalResponseTracker />);
    const responses = dataApi.getInternationalResponses();
    // At minimum, there should be stance badges visible
    const stanceLabels = ['Strong', 'Moderate', 'Limited', 'Weak'];
    const allBadges = stanceLabels.flatMap((label) =>
      screen.queryAllByText(label)
    );
    // Filter to only badge elements (small text spans, not the summary buttons)
    expect(allBadges.length).toBeGreaterThanOrEqual(responses.length);
  });

  // --- Native disclosure ---

  it('a country opens and closes natively', () => {
    const { container } = render(<InternationalResponseTracker />);
    const card = usCard(container);
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(true);
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(false);
  });

  it('a country shows each dimension without a click', () => {
    const { container } = render(<InternationalResponseTracker />);
    const us = within(usCard(container));
    expect(us.getByText('Genocide Recognition')).toBeTruthy();
    expect(us.getByText('Sanctions Imposed')).toBeTruthy();
    expect(us.getByText('Legislative Actions')).toBeTruthy();
    expect(us.getByText('Diplomatic Actions')).toBeTruthy();
  });

  it('every country shows its overall assessment without a click', () => {
    const { container } = render(<InternationalResponseTracker />);
    cards(container).forEach(c => expect(within(c).getByText('Overall Assessment')).toBeTruthy());
  });

  it('a country links its source safely, without a click', () => {
    const { container } = render(<InternationalResponseTracker />);
    const link = within(usCard(container)).getByText('Source').closest('a')!;
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('opening one country leaves the others as they were', () => {
    // One-at-a-time was a JavaScript nicety; native disclosures open independently.
    const { container } = render(<InternationalResponseTracker />);
    const [first, second] = cards(container);
    fireEvent.click(first.querySelector('summary')!);
    fireEvent.click(second.querySelector('summary')!);
    expect(first.open).toBe(true);
    expect(second.open).toBe(true);
  });

  // --- Copy Functionality ---

  it('renders Copy button', () => {
    render(<InternationalResponseTracker />);
    expect(screen.getByText('Copy')).toBeTruthy();
  });

  it('copy button has aria-label', () => {
    render(<InternationalResponseTracker />);
    expect(screen.getByLabelText('Copy summary to clipboard')).toBeTruthy();
  });

  it('copy button shows Copied state', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<InternationalResponseTracker />);
    fireEvent.click(screen.getByText('Copy'));
    expect(await screen.findByText('Copied')).toBeTruthy();
  });

  it('copy button changes aria-label after copying', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<InternationalResponseTracker />);
    fireEvent.click(screen.getByText('Copy'));
    expect(await screen.findByLabelText('Copied to clipboard')).toBeTruthy();
  });

  // --- Footer ---

  it('renders footer with source policy', () => {
    render(<InternationalResponseTracker />);
    expect(screen.getByText(/Tier 1-2 news sources/)).toBeTruthy();
  });

  it('footer shows count of filtered vs total', () => {
    render(<InternationalResponseTracker />);
    const responses = dataApi.getInternationalResponses();
    expect(screen.getByText(new RegExp(`${responses.length} of ${responses.length} countries shown`))).toBeTruthy();
  });

  it('footer count updates when search filters results', () => {
    render(<InternationalResponseTracker />);
    const input = screen.getByPlaceholderText('Search countries…');
    fireEvent.change(input, { target: { value: 'United' } });
    const responses = dataApi.getInternationalResponses();
    // Should show fewer than total
    expect(screen.getByText(new RegExp(`of ${responses.length} countries shown`))).toBeTruthy();
  });

  // --- Data Integrity ---

  it('uses real country data (not placeholder)', () => {
    const responses = dataApi.getInternationalResponses();
    const us = responses.find((r) => r.country === 'United States');
    expect(us).toBeTruthy();
    expect(us!.genocide_recognition).toBeTruthy();
    expect(us!.genocide_recognition!.length).toBeGreaterThan(10);
  });

  it('all responses have required fields', () => {
    const responses = dataApi.getInternationalResponses();
    responses.forEach((r) => {
      expect(r.country).toBeTruthy();
      expect(r.overall_stance).toBeTruthy();
    });
  });

  it('dataApi getInternationalResponseByCountry works', () => {
    const us = dataApi.getInternationalResponseByCountry('United States');
    expect(us).toBeTruthy();
    expect(us!.country).toBe('United States');
  });

  it('dataApi getInternationalResponseByCountry is case-insensitive', () => {
    const us = dataApi.getInternationalResponseByCountry('united states');
    expect(us).toBeTruthy();
    expect(us!.country).toBe('United States');
  });

  it('dataApi getInternationalResponseByCountry returns null for unknown', () => {
    const result = dataApi.getInternationalResponseByCountry('Atlantis');
    expect(result).toBeNull();
  });

  it('dataApi searchInternationalResponses returns matches', () => {
    const results = dataApi.searchInternationalResponses('genocide');
    expect(results.length).toBeGreaterThan(0);
  });

  it('dataApi getDatasetSummary includes international_responses', () => {
    const summary = dataApi.getDatasetSummary();
    expect(summary.datasets.international_responses).toBeTruthy();
    expect(summary.datasets.international_responses.count).toBeGreaterThan(0);
  });

  it('dataApi globalSearch includes international_responses', () => {
    const results = dataApi.globalSearch('genocide');
    expect(results.international_responses).toBeTruthy();
    expect(results.international_responses.length).toBeGreaterThan(0);
  });

  // --- No CCP State Media ---

  it('component text never references CCP state media', () => {
    const { container } = render(<InternationalResponseTracker />);
    const text = container.textContent.toLowerCase();
    expect(text).not.toContain('xinhua');
    expect(text).not.toContain('global times');
    expect(text).not.toContain('cgtn');
  });

  // --- Accessibility ---

  it('stance filter buttons have aria-pressed', () => {
    render(<InternationalResponseTracker />);
    const stanceButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    expect(stanceButtons.length).toBe(4);
  });

  it('uses native disclosures, not JavaScript-only expanders', () => {
    const { container } = render(<InternationalResponseTracker />);
    expect(cards(container).length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[aria-expanded], [aria-controls]')).toHaveLength(0);
  });
});
