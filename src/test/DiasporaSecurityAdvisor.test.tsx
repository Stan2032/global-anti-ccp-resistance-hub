import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import DiasporaSecurityAdvisor from '../components/DiasporaSecurityAdvisor';

Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

// Country cards are native <details>: every card's advisory is in the page
// without a click, so assertions are scoped to one card.
const cards = () => [...document.querySelectorAll('details')] as HTMLDetailsElement[];
const summaryOf = (card: HTMLDetailsElement) => card.querySelector('summary')!.textContent ?? '';
const cardFor = (country: string) => {
  const card = cards().find(c => summaryOf(c).includes(country));
  expect(card, `a card for ${country}`).toBeTruthy();
  return card!;
};

describe('DiasporaSecurityAdvisor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────
  it('renders the section title', () => {
    render(<DiasporaSecurityAdvisor />);
    expect(screen.getByText('Diaspora Security Advisor')).toBeTruthy();
  });

  it('has section aria-label', () => {
    render(<DiasporaSecurityAdvisor />);
    expect(screen.getByRole('region', { name: /Diaspora Security Advisor/i })).toBeTruthy();
  });

  it('renders description with dataset counts', () => {
    render(<DiasporaSecurityAdvisor />);
    const desc = screen.getByText(/personalized security guidance/i);
    expect(desc.textContent).toMatch(/police stations/i);
    expect(desc.textContent).toMatch(/government responses/i);
    expect(desc.textContent).toMatch(/legal cases/i);
  });

  // ── Stats Bar ──────────────────────────────────────
  it('displays countries stat', () => {
    render(<DiasporaSecurityAdvisor />);
    expect(screen.getByText('Countries')).toBeTruthy();
  });

  it('displays critical risk stat', () => {
    render(<DiasporaSecurityAdvisor />);
    expect(screen.getByText('Critical Risk')).toBeTruthy();
  });

  it('displays active stations stat', () => {
    render(<DiasporaSecurityAdvisor />);
    expect(screen.getByText('Active Stations')).toBeTruthy();
  });

  it('displays strong protection stat', () => {
    render(<DiasporaSecurityAdvisor />);
    expect(screen.getByText('Strong Protection')).toBeTruthy();
  });

  // ── Filters ────────────────────────────────────────
  it('renders search input', () => {
    render(<DiasporaSecurityAdvisor />);
    expect(screen.getByLabelText('Search countries')).toBeTruthy();
  });

  it('renders activity type selector', () => {
    render(<DiasporaSecurityAdvisor />);
    expect(screen.getByLabelText('Filter by activity type')).toBeTruthy();
  });

  it('renders country selector', () => {
    render(<DiasporaSecurityAdvisor />);
    expect(screen.getByLabelText('Filter by country')).toBeTruthy();
  });

  it('filters countries by search query', () => {
    render(<DiasporaSecurityAdvisor />);
    fireEvent.change(screen.getByLabelText('Search countries'), { target: { value: 'United Kingdom' } });
    expect(cards().length).toBeGreaterThanOrEqual(1);
    expect(cards().some(c => summaryOf(c).includes('United Kingdom'))).toBe(true);
  });

  it('filters by specific country via dropdown', () => {
    render(<DiasporaSecurityAdvisor />);
    fireEvent.change(screen.getByLabelText('Filter by country'), { target: { value: 'Netherlands' } });
    expect(cards()).toHaveLength(1);
    expect(summaryOf(cards()[0])).toContain('Netherlands');
  });

  it('shows all activity types in dropdown', () => {
    render(<DiasporaSecurityAdvisor />);
    const select = screen.getByLabelText('Filter by activity type');
    expect(select.querySelectorAll('option').length).toBe(7);
  });

  // ── Country Cards ──────────────────────────────────
  it('renders country advisory cards as native disclosures', () => {
    render(<DiasporaSecurityAdvisor />);
    expect(cards().length).toBeGreaterThan(0);
    cards().forEach(card => expect(card.firstElementChild?.tagName).toBe('SUMMARY'));
  });

  it('shows risk level badges on cards', () => {
    render(<DiasporaSecurityAdvisor />);
    const riskTexts = ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'];
    const found = riskTexts.some(r => screen.queryAllByText(r).length > 0);
    expect(found).toBe(true);
  });

  it('every country card carries its advisory without a click', () => {
    render(<DiasporaSecurityAdvisor />);
    cards().forEach(card => expect(within(card).getByText('Security Advisory')).toBeTruthy());
  });

  it('a country card opens and closes natively', () => {
    render(<DiasporaSecurityAdvisor />);
    const card = cards()[0];
    expect(card.open).toBe(false);
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(true);
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(false);
  });

  it('shows emergency resources in each card', () => {
    render(<DiasporaSecurityAdvisor />);
    const card = within(cards()[0]);
    expect(card.getByText('Emergency Resources')).toBeTruthy();
    expect(card.getAllByText(/Front Line Defenders/).length).toBeGreaterThan(0);
  });

  // ── Activity-Specific Safety Tips ──────────────────
  it('shows safety tips when activity type is selected', () => {
    render(<DiasporaSecurityAdvisor />);
    fireEvent.change(screen.getByLabelText('Filter by activity type'), { target: { value: 'protest' } });
    const card = within(cards()[0]);
    expect(card.getByText(/Safety Tips/i)).toBeTruthy();
    expect(card.getAllByText(/burner phone/i).length).toBeGreaterThan(0);
  });

  it('shows online activism tips', () => {
    render(<DiasporaSecurityAdvisor />);
    fireEvent.change(screen.getByLabelText('Filter by activity type'), { target: { value: 'online' } });
    expect(within(cards()[0]).getAllByText(/Tor Browser/i).length).toBeGreaterThan(0);
  });

  it('shows journalism tips', () => {
    render(<DiasporaSecurityAdvisor />);
    fireEvent.change(screen.getByLabelText('Filter by activity type'), { target: { value: 'journalism' } });
    expect(within(cards()[0]).getAllByText(/SecureDrop/i).length).toBeGreaterThan(0);
  });

  it('hides safety tips when activity is "all"', () => {
    render(<DiasporaSecurityAdvisor />);
    expect(cards().length).toBeGreaterThan(0);
    expect(screen.queryByText(/Safety Tips/i)).toBeNull();
  });

  // ── Copy Report ────────────────────────────────────
  it('copies report to clipboard', async () => {
    render(<DiasporaSecurityAdvisor />);
    const copyBtn = screen.getByLabelText('Copy security advisory report');
    fireEvent.click(copyBtn);
    await vi.waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    });
    const clipboardText = vi.mocked(navigator.clipboard.writeText).mock.calls[0][0];
    expect(clipboardText).toContain('DIASPORA SECURITY ADVISORY');
    expect(clipboardText).toContain('CC BY 4.0');
  });

  it('shows "Copied" after clicking copy', async () => {
    render(<DiasporaSecurityAdvisor />);
    fireEvent.click(screen.getByLabelText('Copy security advisory report'));
    await vi.waitFor(() => {
      expect(screen.getByText('Copied')).toBeTruthy();
    });
  });

  // ── Data Integration ───────────────────────────────
  it('displays police station details in the United Kingdom card', () => {
    render(<DiasporaSecurityAdvisor />);
    fireEvent.change(screen.getByLabelText('Search countries'), { target: { value: 'United Kingdom' } });
    expect(within(cardFor('United Kingdom')).getByText(/Police Stations/)).toBeTruthy();
  });

  it('displays government response in the United States card', () => {
    render(<DiasporaSecurityAdvisor />);
    fireEvent.change(screen.getByLabelText('Search countries'), { target: { value: 'United States' } });
    expect(within(cardFor('United States')).getAllByText('Government Response').length).toBeGreaterThan(0);
  });

  // ── Accessibility ──────────────────────────────────
  it('uses native disclosure cards, not JavaScript-only expanders', () => {
    const { container } = render(<DiasporaSecurityAdvisor />);
    expect(container.querySelectorAll('[aria-expanded]')).toHaveLength(0);
  });

  it('cards start closed, so the list stays scannable', () => {
    render(<DiasporaSecurityAdvisor />);
    expect(cards().every(card => !card.open)).toBe(true);
  });

  // ── Footer ─────────────────────────────────────────
  it('shows data attribution footer', () => {
    render(<DiasporaSecurityAdvisor />);
    expect(screen.getAllByText(/Safeguard Defenders/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/CC BY 4.0/).length).toBeGreaterThan(0);
  });

  it('shows count totals in footer', () => {
    render(<DiasporaSecurityAdvisor />);
    const footerTexts = screen.getAllByText(/police stations/);
    expect(footerTexts.length).toBeGreaterThanOrEqual(2);
  });

  // ── CCP Source Exclusion ───────────────────────────
  it('does not include CCP/PRC propaganda sources', () => {
    render(<DiasporaSecurityAdvisor />);
    const html = document.body.innerHTML;
    expect(html).not.toContain('xinhua');
    expect(html).not.toContain('globaltimes');
    expect(html).not.toContain('people.com.cn');
    expect(html).not.toContain('chinadaily');
  });

  // ── Country counter ────────────────────────────────
  it('shows filtered count text', () => {
    render(<DiasporaSecurityAdvisor />);
    expect(screen.getByText(/countries shown/i)).toBeTruthy();
  });
});
