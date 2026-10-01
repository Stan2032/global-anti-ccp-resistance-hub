import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import MemorialWall from '../components/MemorialWall';

/** Every victim card's "Cause and source" disclosure. */
const disclosures = () => {
  const all = [...document.querySelectorAll('details')] as HTMLDetailsElement[];
  expect(all.length, 'victim cards have a "Cause and source" disclosure').toBeGreaterThan(0);
  return all;
};
const disclosureFor = (name: string) => {
  const found = disclosures().find(d => d.querySelector(':scope > summary')!.textContent!.includes(`for ${name}`));
  expect(found, `${name}'s disclosure`).toBeTruthy();
  return found!;
};

describe('MemorialWall', () => {
  beforeEach(() => {
    // Clear localStorage candle state between tests
    localStorage.clear();
  });

  // --- Structure ---

  it('renders the heading', () => {
    render(<MemorialWall />);
    expect(screen.getByText('Memorial Wall')).toBeTruthy();
  });

  it('renders stat boxes', () => {
    render(<MemorialWall />);
    expect(screen.getByText('Tiananmen 1989')).toBeTruthy();
    expect(screen.getByText('Tibetan Self-Immolations')).toBeTruthy();
    expect(screen.getByText('Uyghur Deaths in Camps')).toBeTruthy();
  });

  it('renders search input', () => {
    render(<MemorialWall />);
    expect(screen.getByPlaceholderText(/Search/)).toBeTruthy();
  });

  it('renders category filter buttons', () => {
    render(<MemorialWall />);
    expect(screen.getByRole('button', { name: 'All' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tiananmen' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Uyghur' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tibet' })).toBeTruthy();
  });

  // --- Victim Cards ---

  it('renders victim names', () => {
    render(<MemorialWall />);
    expect(screen.getByText('Wang Weilin')).toBeTruthy();
    expect(screen.getByText('Jiang Jielian')).toBeTruthy();
  });

  it('renders victim descriptions', () => {
    render(<MemorialWall />);
    expect(screen.getByText(/stood in front of tanks/)).toBeTruthy();
  });

  it('renders "Light a Candle" buttons', () => {
    render(<MemorialWall />);
    const candleButtons = screen.getAllByText(/Light a Candle/);
    expect(candleButtons.length).toBeGreaterThanOrEqual(1);
  });

  // --- Search ---

  it('filters victims by search query', () => {
    render(<MemorialWall />);
    const searchInput = screen.getByPlaceholderText(/Search/);
    fireEvent.change(searchInput, { target: { value: 'Wang Weilin' } });
    expect(screen.getByText('Wang Weilin')).toBeTruthy();
  });

  it('shows no results message for bad search', () => {
    render(<MemorialWall />);
    const searchInput = screen.getByPlaceholderText(/Search/);
    fireEvent.change(searchInput, { target: { value: 'zzzznotfound' } });
    expect(screen.getByText(/No victims match/)).toBeTruthy();
  });

  // --- Category Filter ---

  it('filters by category', () => {
    render(<MemorialWall />);
    fireEvent.click(screen.getByRole('button', { name: 'Uyghur' }));
    expect(screen.getByText('Abdulghafur Hapiz')).toBeTruthy();
  });

  it('returns to all when All is clicked', () => {
    render(<MemorialWall />);
    fireEvent.click(screen.getByRole('button', { name: 'Uyghur' }));
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByText('Wang Weilin')).toBeTruthy();
  });

  // --- Candle ---

  it('renders candle count in footer', () => {
    render(<MemorialWall />);
    expect(screen.getByText(/candles? lit in remembrance/)).toBeTruthy();
  });

  // --- Cause and source: in the page for everyone ---
  // This was a modal only JavaScript could open, and each card's story was
  // cut to three lines.

  it('gives every victim a closed "Cause and source" disclosure, filled before any click', () => {
    render(<MemorialWall />);
    for (const d of disclosures()) {
      expect(d.open).toBe(false);
      const terms = [...d.querySelectorAll('dt')].map(dt => dt.textContent);
      expect(terms).toEqual(['Date of death', 'Cause', 'Source']);
      for (const dd of d.querySelectorAll('dd')) expect(dd.textContent!.trim()).not.toBe('');
    }
  });

  it("puts Wang Weilin's cause of death in the page without a click", () => {
    render(<MemorialWall />);
    expect(within(disclosureFor('Wang Weilin')).getByText('Tiananmen Square')).toBeTruthy();
  });

  it('opens and closes natively', () => {
    render(<MemorialWall />);
    const d = disclosureFor('Wang Weilin');
    fireEvent.click(d.querySelector(':scope > summary')!);
    expect(d.open).toBe(true);
    fireEvent.click(d.querySelector(':scope > summary')!);
    expect(d.open).toBe(false);
  });

  it('shows every story in full, cut to no number of lines', () => {
    const { container } = render(<MemorialWall />);
    expect(container.querySelectorAll('[class*="line-clamp"]')).toHaveLength(0);
  });

  it('leaves the candle button out of the pre-rendered page, where it could do nothing', () => {
    expect(renderToString(<MemorialWall />)).not.toContain('Light a Candle');
  });
});
