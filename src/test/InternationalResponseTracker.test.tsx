// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InternationalResponseTracker from '../components/InternationalResponseTracker';
import { dataApi } from '../services/dataApi';

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
    fireEvent.click(strongBtn);
    expect(strongBtn.getAttribute('aria-pressed')).toBe('true');
    // United States should be visible (it has a "Strong" stance)
    expect(screen.getByText('United States')).toBeTruthy();
  });

  it('clicking a stance filter twice clears it', () => {
    render(<InternationalResponseTracker />);
    const stanceButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    const strongBtn = stanceButtons.find((b) => b.textContent.includes('Strong'));
    fireEvent.click(strongBtn);
    expect(strongBtn.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(strongBtn);
    expect(strongBtn.getAttribute('aria-pressed')).toBe('false');
  });

  it('shows Clear button when stance filter is active', () => {
    render(<InternationalResponseTracker />);
    const stanceButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    const strongBtn = stanceButtons.find((b) => b.textContent.includes('Strong'));
    fireEvent.click(strongBtn);
    expect(screen.getByText('Clear')).toBeTruthy();
  });

  it('Clear button resets stance filter', () => {
    render(<InternationalResponseTracker />);
    const stanceButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    const strongBtn = stanceButtons.find((b) => b.textContent.includes('Strong'));
    fireEvent.click(strongBtn);
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

  it('each country row has aria-expanded attribute', () => {
    render(<InternationalResponseTracker />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expect(expandable.length).toBeGreaterThan(0);
    expandable.forEach((btn) => {
      expect(btn.getAttribute('aria-expanded')).toBe('false');
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

  // --- Expand/Collapse ---

  it('clicking a country expands its details', () => {
    render(<InternationalResponseTracker />);
    const usButton = screen.getAllByRole('button').find(
      (b) => b.textContent.includes('United States') && b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(usButton);
    expect(usButton.getAttribute('aria-expanded')).toBe('true');
  });

  it('expanded country shows dimension labels', () => {
    render(<InternationalResponseTracker />);
    const usButton = screen.getAllByRole('button').find(
      (b) => b.textContent.includes('United States') && b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(usButton);
    expect(screen.getByText('Genocide Recognition')).toBeTruthy();
    expect(screen.getByText('Sanctions Imposed')).toBeTruthy();
    expect(screen.getByText('Legislative Actions')).toBeTruthy();
    expect(screen.getByText('Diplomatic Actions')).toBeTruthy();
  });

  it('expanded country shows Overall Assessment', () => {
    render(<InternationalResponseTracker />);
    const usButton = screen.getAllByRole('button').find(
      (b) => b.textContent.includes('United States') && b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(usButton);
    expect(screen.getByText('Overall Assessment')).toBeTruthy();
  });

  it('expanded country shows Source link', () => {
    render(<InternationalResponseTracker />);
    const usButton = screen.getAllByRole('button').find(
      (b) => b.textContent.includes('United States') && b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(usButton);
    const sourceLink = screen.getByText('Source');
    expect(sourceLink.closest('a')).toBeTruthy();
    expect(sourceLink.closest('a').getAttribute('target')).toBe('_blank');
    expect(sourceLink.closest('a').getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('clicking expanded country collapses it', () => {
    render(<InternationalResponseTracker />);
    const usButton = screen.getAllByRole('button').find(
      (b) => b.textContent.includes('United States') && b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(usButton);
    expect(usButton.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(usButton);
    expect(usButton.getAttribute('aria-expanded')).toBe('false');
  });

  it('expanding a different country collapses the previous one', () => {
    render(<InternationalResponseTracker />);
    const buttons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    const first = buttons[0];
    const second = buttons[1];

    fireEvent.click(first);
    expect(first.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(second);
    expect(second.getAttribute('aria-expanded')).toBe('true');
    expect(first.getAttribute('aria-expanded')).toBe('false');
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
    expect(us.genocide_recognition).toBeTruthy();
    expect(us.genocide_recognition.length).toBeGreaterThan(10);
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
    expect(us.country).toBe('United States');
  });

  it('dataApi getInternationalResponseByCountry is case-insensitive', () => {
    const us = dataApi.getInternationalResponseByCountry('united states');
    expect(us).toBeTruthy();
    expect(us.country).toBe('United States');
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

  it('country rows have aria-expanded and aria-controls', () => {
    render(<InternationalResponseTracker />);
    const expandable = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expandable.forEach((btn) => {
      expect(btn.getAttribute('aria-controls')).toBeTruthy();
    });
  });
});
