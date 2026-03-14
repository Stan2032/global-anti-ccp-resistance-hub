import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import DataFreshnessIndicator from '../components/DataFreshnessIndicator';

describe('DataFreshnessIndicator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when no lastVerified is provided', () => {
    const { container } = render(<DataFreshnessIndicator lastVerified="" />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when lastVerified is null', () => {
    const { container } = render(<DataFreshnessIndicator lastVerified={undefined as unknown as string} />);
    expect(container.innerHTML).toBe('');
  });

  it('shows "Verified today" for today\'s date', () => {
    vi.setSystemTime(new Date(2026, 2, 3, 12, 0, 0));
    render(<DataFreshnessIndicator lastVerified="2026-03-03" />);
    expect(screen.getByText('Verified today')).toBeTruthy();
  });

  it('shows "Verified yesterday" for 1-day-old date', () => {
    vi.setSystemTime(new Date(2026, 2, 4, 12, 0, 0));
    render(<DataFreshnessIndicator lastVerified="2026-03-03" />);
    expect(screen.getByText('Verified yesterday')).toBeTruthy();
  });

  it('shows "Verified X days ago" for older dates', () => {
    vi.setSystemTime(new Date(2026, 2, 10, 12, 0, 0));
    render(<DataFreshnessIndicator lastVerified="2026-03-03" />);
    expect(screen.getByText('Verified 7 days ago')).toBeTruthy();
  });

  it('renders compact variant with inline styling', () => {
    vi.setSystemTime(new Date(2026, 2, 3, 12, 0, 0));
    render(<DataFreshnessIndicator lastVerified="2026-03-03" compact />);
    expect(screen.getByText('Verified today')).toBeTruthy();
    // Compact variant uses span parent
    const label = screen.getByText('Verified today');
    expect(label.closest('span')).toBeTruthy();
  });

  it('renders full variant with div wrapper', () => {
    vi.setSystemTime(new Date(2026, 2, 3, 12, 0, 0));
    render(<DataFreshnessIndicator lastVerified="2026-03-03" />);
    const label = screen.getByText('Verified today');
    expect(label.closest('div')).toBeTruthy();
  });

  it('includes title attribute with raw date', () => {
    vi.setSystemTime(new Date(2026, 2, 3, 12, 0, 0));
    render(<DataFreshnessIndicator lastVerified="2026-03-03" />);
    const el = screen.getByTitle('Last verified: 2026-03-03');
    expect(el).toBeTruthy();
  });

  it('applies green color for fresh data (≤7 days)', () => {
    vi.setSystemTime(new Date(2026, 2, 5, 12, 0, 0));
    render(<DataFreshnessIndicator lastVerified="2026-03-03" />);
    const el = screen.getByTitle('Last verified: 2026-03-03');
    expect(el.className).toContain('text-green-400');
  });

  it('applies yellow color for recent data (8-30 days)', () => {
    vi.setSystemTime(new Date(2026, 2, 18, 12, 0, 0));
    render(<DataFreshnessIndicator lastVerified="2026-03-03" />);
    const el = screen.getByTitle('Last verified: 2026-03-03');
    expect(el.className).toContain('text-yellow-400');
  });

  it('applies red color for stale data (>30 days)', () => {
    vi.setSystemTime(new Date(2026, 4, 3, 12, 0, 0));
    render(<DataFreshnessIndicator lastVerified="2026-03-03" />);
    const el = screen.getByTitle('Last verified: 2026-03-03');
    expect(el.className).toContain('text-red-400');
  });
});
