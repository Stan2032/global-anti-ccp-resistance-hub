import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import UrgentCaseTimer from '../components/UrgentCaseTimer';

// Mock calculateAge utility
vi.mock('../utils/dateUtils', () => ({
  calculateAge: vi.fn(() => 77)
}));

describe('UrgentCaseTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-02T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // --- Full Version ---

  describe('Full version (default)', () => {
    it('renders the header with Time in Detention title', () => {
      render(<UrgentCaseTimer />);
      expect(screen.getByText('Time in Detention')).toBeTruthy();
    });

    it('renders descriptive text about live counters', () => {
      render(<UrgentCaseTimer />);
      expect(screen.getByText(/Live counters showing how long political prisoners/)).toBeTruthy();
    });

    it('renders Jimmy Lai case', () => {
      render(<UrgentCaseTimer />);
      expect(screen.getByText('Jimmy Lai')).toBeTruthy();
      expect(screen.getByText('黎智英')).toBeTruthy();
      expect(screen.getByText('SENTENCED - 20 YEARS')).toBeTruthy();
    });

    it('renders Ilham Tohti case', () => {
      render(<UrgentCaseTimer />);
      expect(screen.getByText('Ilham Tohti')).toBeTruthy();
      expect(screen.getByText('伊力哈木·土赫提')).toBeTruthy();
      expect(screen.getByText('LIFE SENTENCE')).toBeTruthy();
    });

    it('renders Chow Hang-tung case', () => {
      render(<UrgentCaseTimer />);
      expect(screen.getByText('Chow Hang-tung')).toBeTruthy();
      expect(screen.getByText('邹幸彤')).toBeTruthy();
    });

    it('renders Gedhun Choekyi Nyima (Panchen Lama) case', () => {
      render(<UrgentCaseTimer />);
      expect(screen.getByText('Gedhun Choekyi Nyima')).toBeTruthy();
      expect(screen.getByText('DISAPPEARED')).toBeTruthy();
    });

    it('shows location for each prisoner', () => {
      render(<UrgentCaseTimer />);
      expect(screen.getByText('Stanley Prison, Hong Kong')).toBeTruthy();
      expect(screen.getByText('Urumqi Prison, Xinjiang')).toBeTruthy();
      expect(screen.getByText('Unknown, China')).toBeTruthy();
    });

    it('renders timer digits for each prisoner', () => {
      render(<UrgentCaseTimer />);
      // Timer should show YEARS, DAYS, HOURS, MINS, SECS labels
      expect(screen.getAllByText('YEARS').length).toBe(4);
      expect(screen.getAllByText('DAYS').length).toBe(4);
      expect(screen.getAllByText('HOURS').length).toBe(4);
      expect(screen.getAllByText('MINS').length).toBe(4);
      expect(screen.getAllByText('SECS').length).toBe(4);
    });

    it('renders Take Action links for each prisoner', () => {
      render(<UrgentCaseTimer />);
      const actionLinks = screen.getAllByText('Take Action');
      expect(actionLinks.length).toBe(4);
      actionLinks.forEach(link => {
        expect(link.closest('a').getAttribute('href')).toBe('/prisoners');
      });
    });

    it('renders Copy to Share buttons for each prisoner', () => {
      render(<UrgentCaseTimer />);
      const copyButtons = screen.getAllByText('Copy to Share');
      expect(copyButtons.length).toBe(4);
    });

    it('renders total days for each prisoner', () => {
      render(<UrgentCaseTimer />);
      // All prisoners should show "Total: X days"
      const totalElements = screen.getAllByText(/Total:/);
      expect(totalElements.length).toBe(4);
    });
  });

  // --- Compact Version ---

  describe('Compact version', () => {
    it('renders compact header', () => {
      render(<UrgentCaseTimer compact />);
      expect(screen.getByText('Time in Detention')).toBeTruthy();
    });

    it('shows only first 3 cases in compact mode', () => {
      render(<UrgentCaseTimer compact />);
      expect(screen.getByText('Jimmy Lai')).toBeTruthy();
      expect(screen.getByText('Ilham Tohti')).toBeTruthy();
      expect(screen.getByText('Chow Hang-tung')).toBeTruthy();
      // Panchen Lama should NOT appear in compact
      expect(screen.queryByText('Gedhun Choekyi Nyima')).toBeNull();
    });

    it('shows View all link in compact mode', () => {
      render(<UrgentCaseTimer compact />);
      const viewAll = screen.getByText('View all →');
      expect(viewAll.getAttribute('href')).toBe('/prisoners');
    });

    it('shows Chinese name alongside English name in compact mode', () => {
      render(<UrgentCaseTimer compact />);
      expect(screen.getByText('黎智英')).toBeTruthy();
    });

    it('does NOT show full timer grid in compact mode (uses inline format)', () => {
      render(<UrgentCaseTimer compact />);
      // Compact uses "Xy Xd Xh Xm Xs" format, not grid with YEARS/DAYS labels
      expect(screen.queryByText('YEARS')).toBeNull();
    });
  });
});
