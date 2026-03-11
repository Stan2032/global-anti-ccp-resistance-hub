import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DiasporaSecurityAdvisor from '../components/DiasporaSecurityAdvisor';

Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

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
    const search = screen.getByLabelText('Search countries');
    fireEvent.change(search, { target: { value: 'United Kingdom' } });
    const buttons = screen.getAllByRole('button', { expanded: false });
    const countryButtons = buttons.filter(b => b.getAttribute('aria-label')?.includes('risk'));
    expect(countryButtons.length).toBeGreaterThanOrEqual(1);
    expect(countryButtons.some(b => b.getAttribute('aria-label')?.includes('United Kingdom'))).toBe(true);
  });

  it('filters by specific country via dropdown', () => {
    render(<DiasporaSecurityAdvisor />);
    const select = screen.getByLabelText('Filter by country');
    fireEvent.change(select, { target: { value: 'Netherlands' } });
    const countryButtons = screen.getAllByRole('button', { expanded: false }).filter(b => b.getAttribute('aria-label')?.includes('risk'));
    expect(countryButtons.length).toBe(1);
    expect(countryButtons[0].getAttribute('aria-label')).toContain('Netherlands');
  });

  it('shows all activity types in dropdown', () => {
    render(<DiasporaSecurityAdvisor />);
    const select = screen.getByLabelText('Filter by activity type');
    expect(select.querySelectorAll('option').length).toBe(7);
  });

  // ── Country Cards ──────────────────────────────────
  it('renders country advisory cards', () => {
    render(<DiasporaSecurityAdvisor />);
    const cards = screen.getAllByRole('button', { expanded: false }).filter(b => b.getAttribute('aria-label')?.includes('risk'));
    expect(cards.length).toBeGreaterThan(0);
  });

  it('shows risk level badges on cards', () => {
    render(<DiasporaSecurityAdvisor />);
    const riskTexts = ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'];
    const found = riskTexts.some(r => screen.queryAllByText(r).length > 0);
    expect(found).toBe(true);
  });

  it('expands country card on click', () => {
    render(<DiasporaSecurityAdvisor />);
    const cards = screen.getAllByRole('button', { expanded: false }).filter(b => b.getAttribute('aria-label')?.includes('risk'));
    fireEvent.click(cards[0]);
    expect(screen.getByText('Security Advisory')).toBeTruthy();
  });

  it('collapses expanded card on second click', () => {
    render(<DiasporaSecurityAdvisor />);
    const cards = screen.getAllByRole('button', { expanded: false }).filter(b => b.getAttribute('aria-label')?.includes('risk'));
    fireEvent.click(cards[0]);
    expect(screen.getByText('Security Advisory')).toBeTruthy();
    fireEvent.click(screen.getAllByRole('button', { expanded: true })[0]);
    expect(screen.queryByText('Security Advisory')).toBeNull();
  });

  it('shows emergency resources in expanded card', () => {
    render(<DiasporaSecurityAdvisor />);
    const cards = screen.getAllByRole('button', { expanded: false }).filter(b => b.getAttribute('aria-label')?.includes('risk'));
    fireEvent.click(cards[0]);
    expect(screen.getByText('Emergency Resources')).toBeTruthy();
    expect(screen.getByText(/Front Line Defenders/)).toBeTruthy();
  });

  // ── Activity-Specific Safety Tips ──────────────────
  it('shows safety tips when activity type is selected', () => {
    render(<DiasporaSecurityAdvisor />);
    const activitySelect = screen.getByLabelText('Filter by activity type');
    fireEvent.change(activitySelect, { target: { value: 'protest' } });
    const cards = screen.getAllByRole('button').filter(b => b.getAttribute('aria-label')?.includes('risk'));
    fireEvent.click(cards[0]);
    expect(screen.getByText(/Safety Tips/i)).toBeTruthy();
    expect(screen.getByText(/burner phone/i)).toBeTruthy();
  });

  it('shows online activism tips', () => {
    render(<DiasporaSecurityAdvisor />);
    fireEvent.change(screen.getByLabelText('Filter by activity type'), { target: { value: 'online' } });
    const cards = screen.getAllByRole('button').filter(b => b.getAttribute('aria-label')?.includes('risk'));
    fireEvent.click(cards[0]);
    expect(screen.getByText(/Tor Browser/i)).toBeTruthy();
  });

  it('shows journalism tips', () => {
    render(<DiasporaSecurityAdvisor />);
    fireEvent.change(screen.getByLabelText('Filter by activity type'), { target: { value: 'journalism' } });
    const cards = screen.getAllByRole('button').filter(b => b.getAttribute('aria-label')?.includes('risk'));
    fireEvent.click(cards[0]);
    expect(screen.getByText(/SecureDrop/i)).toBeTruthy();
  });

  it('hides safety tips when activity is "all"', () => {
    render(<DiasporaSecurityAdvisor />);
    const cards = screen.getAllByRole('button').filter(b => b.getAttribute('aria-label')?.includes('risk'));
    fireEvent.click(cards[0]);
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
  it('displays police station details when expanded', () => {
    render(<DiasporaSecurityAdvisor />);
    const search = screen.getByLabelText('Search countries');
    fireEvent.change(search, { target: { value: 'United Kingdom' } });
    const cards = screen.getAllByRole('button').filter(b => b.getAttribute('aria-label')?.includes('United Kingdom'));
    if (cards.length > 0) {
      fireEvent.click(cards[0]);
      expect(screen.getByText(/Police Stations/)).toBeTruthy();
    }
  });

  it('displays government response when available', () => {
    render(<DiasporaSecurityAdvisor />);
    const search = screen.getByLabelText('Search countries');
    fireEvent.change(search, { target: { value: 'United States' } });
    const cards = screen.getAllByRole('button').filter(b => b.getAttribute('aria-label')?.includes('United States'));
    if (cards.length > 0) {
      fireEvent.click(cards[0]);
      expect(screen.getByText('Government Response')).toBeTruthy();
    }
  });

  // ── Accessibility ──────────────────────────────────
  it('all cards have aria-expanded attribute', () => {
    render(<DiasporaSecurityAdvisor />);
    const cards = screen.getAllByRole('button').filter(b => b.hasAttribute('aria-expanded'));
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach(card => {
      expect(card.getAttribute('aria-expanded')).toBe('false');
    });
  });

  it('expanded card has aria-expanded true', () => {
    render(<DiasporaSecurityAdvisor />);
    const cards = screen.getAllByRole('button').filter(b => b.getAttribute('aria-label')?.includes('risk'));
    fireEvent.click(cards[0]);
    expect(cards[0].getAttribute('aria-expanded')).toBe('true');
  });

  // ── Footer ─────────────────────────────────────────
  it('shows data attribution footer', () => {
    render(<DiasporaSecurityAdvisor />);
    expect(screen.getByText(/Safeguard Defenders/i)).toBeTruthy();
    expect(screen.getByText(/CC BY 4.0/)).toBeTruthy();
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
