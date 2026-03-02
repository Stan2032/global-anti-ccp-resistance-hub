import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MemorialWall from '../components/MemorialWall';

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

  // --- Read More Modal ---

  it('opens modal when Read More is clicked', () => {
    render(<MemorialWall />);
    const readMoreButtons = screen.getAllByText(/Read More/);
    fireEvent.click(readMoreButtons[0]);
    expect(screen.getByText('Close')).toBeTruthy();
  });

  it('closes modal when Close is clicked', () => {
    render(<MemorialWall />);
    const readMoreButtons = screen.getAllByText(/Read More/);
    fireEvent.click(readMoreButtons[0]);
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByText('Close')).toBeNull();
  });
});
