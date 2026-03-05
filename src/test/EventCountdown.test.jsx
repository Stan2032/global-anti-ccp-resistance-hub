import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import EventCountdown from '../components/EventCountdown';
import { calculateTimeLeft } from '../utils/dateUtils';

describe('EventCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when no eventDate is provided', () => {
    const { container } = render(<EventCountdown />);
    expect(container.innerHTML).toBe('');
  });

  it('renders countdown when event is in the future', () => {
    // Set "now" to March 3, 2026 12:00
    vi.setSystemTime(new Date(2026, 2, 3, 12, 0, 0));
    render(<EventCountdown eventDate="2026-03-06" label="Test countdown" />);
    
    // Should show timer with role="timer"
    const timer = screen.getByRole('timer');
    expect(timer).toBeTruthy();
    
    // Should show day/hour/minute/second segments
    expect(screen.getByLabelText(/days/)).toBeTruthy();
    expect(screen.getByLabelText(/hours/)).toBeTruthy();
    expect(screen.getByLabelText(/minutes/)).toBeTruthy();
    expect(screen.getByLabelText(/seconds/)).toBeTruthy();
  });

  it('shows "Event today" when event date is today', () => {
    vi.setSystemTime(new Date(2026, 2, 6, 10, 0, 0));
    render(<EventCountdown eventDate="2026-03-06" />);
    expect(screen.getByText(/Event today/i)).toBeTruthy();
  });

  it('shows "Event date has passed" when event is in the past', () => {
    vi.setSystemTime(new Date(2026, 2, 10, 12, 0, 0));
    render(<EventCountdown eventDate="2026-03-06" />);
    expect(screen.getByText(/passed/i)).toBeTruthy();
  });

  it('uses custom label for aria-label', () => {
    vi.setSystemTime(new Date(2026, 2, 3, 12, 0, 0));
    render(<EventCountdown eventDate="2026-03-06" label="Wong hearing countdown" />);
    const timer = screen.getByRole('timer');
    expect(timer.getAttribute('aria-label')).toBe('Wong hearing countdown');
  });

  it('updates countdown every second', () => {
    vi.setSystemTime(new Date(2026, 2, 3, 12, 0, 0));
    render(<EventCountdown eventDate="2026-03-06" />);
    
    const getSeconds = () => screen.getByLabelText(/seconds/).textContent;
    const initialSeconds = getSeconds();
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // After 1 second, the display should have changed
    const newSeconds = getSeconds();
    expect(newSeconds).not.toBe(initialSeconds);
  });

  it('shows correct day count', () => {
    // March 3, 00:00:00 → March 6 = 3 days exactly
    vi.setSystemTime(new Date(2026, 2, 3, 0, 0, 0));
    render(<EventCountdown eventDate="2026-03-06" />);
    expect(screen.getByLabelText(/3 days/)).toBeTruthy();
  });
});

describe('calculateTimeLeft', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns correct values for future date', () => {
    vi.setSystemTime(new Date(2026, 2, 3, 0, 0, 0));
    const result = calculateTimeLeft('2026-03-06');
    expect(result.days).toBe(3);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
    expect(result.isPast).toBe(false);
    expect(result.isToday).toBe(false);
  });

  it('returns isPast=true for past date', () => {
    vi.setSystemTime(new Date(2026, 2, 10, 12, 0, 0));
    const result = calculateTimeLeft('2026-03-06');
    expect(result.isPast).toBe(true);
    expect(result.isToday).toBe(false);
  });

  it('returns isToday=true for current date', () => {
    vi.setSystemTime(new Date(2026, 2, 6, 10, 0, 0));
    const result = calculateTimeLeft('2026-03-06');
    expect(result.isToday).toBe(true);
    expect(result.isPast).toBe(false);
  });

  it('handles null eventDate', () => {
    const result = calculateTimeLeft(null);
    expect(result.isPast).toBe(true);
    expect(result.days).toBe(0);
  });

  it('handles undefined eventDate', () => {
    const result = calculateTimeLeft(undefined);
    expect(result.isPast).toBe(true);
  });

  it('calculates hours and minutes correctly', () => {
    // March 5, 12:30:00 → March 6 = 0 days, 11 hours, 30 minutes
    vi.setSystemTime(new Date(2026, 2, 5, 12, 30, 0));
    const result = calculateTimeLeft('2026-03-06');
    expect(result.days).toBe(0);
    expect(result.hours).toBe(11);
    expect(result.minutes).toBe(30);
    expect(result.seconds).toBe(0);
  });
});
