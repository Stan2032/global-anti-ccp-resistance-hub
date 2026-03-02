import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import EmergencyAlerts from '../components/EmergencyAlerts';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    _reset: () => { store = {}; },
  };
})();

beforeEach(() => {
  mockLocalStorage._reset();
  mockLocalStorage.getItem.mockReset();
  mockLocalStorage.setItem.mockReset();
  mockLocalStorage.getItem.mockImplementation(() => null);
  Object.defineProperty(window, 'localStorage', { value: mockLocalStorage, writable: true });
});

describe('EmergencyAlerts', () => {
  // --- Rendering ---

  it('renders all 4 active alerts', () => {
    render(<EmergencyAlerts />);
    expect(screen.getByText(/URGENT: Jimmy Lai Sentenced/)).toBeTruthy();
    expect(screen.getByText(/New Report: 57 Global Brands/)).toBeTruthy();
    expect(screen.getByText(/Taiwan Reports Increased PLA Activity/)).toBeTruthy();
    expect(screen.getByText(/Hong Kong 47: Mass Sentencing/)).toBeTruthy();
  });

  it('shows alert summaries', () => {
    render(<EmergencyAlerts />);
    expect(screen.getByText(/Hong Kong media tycoon Jimmy Lai sentenced/)).toBeTruthy();
    expect(screen.getByText(/Updated ASPI report identifies/)).toBeTruthy();
    expect(screen.getByText(/Taiwan defense ministry reports 47 PLA aircraft/)).toBeTruthy();
    expect(screen.getByText(/45 pro-democracy activists sentenced/)).toBeTruthy();
  });

  it('renders alert type badges', () => {
    render(<EmergencyAlerts />);
    const criticalBadges = screen.getAllByText('critical');
    expect(criticalBadges.length).toBe(2);
    expect(screen.getByText('warning')).toBeTruthy();
    expect(screen.getByText('info')).toBeTruthy();
  });

  it('renders alert dates', () => {
    render(<EmergencyAlerts />);
    expect(screen.getByText('2025-12-15')).toBeTruthy();
    expect(screen.getByText('2024-12-15')).toBeTruthy();
    expect(screen.getByText('2024-12-18')).toBeTruthy();
    expect(screen.getByText('2024-11-19')).toBeTruthy();
  });

  // --- External Links ---

  it('renders external action links for alerts', () => {
    render(<EmergencyAlerts />);
    expect(screen.getAllByText('Free Jimmy Lai Campaign').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('ASPI Report').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Taiwan MND').length).toBeGreaterThanOrEqual(1);
  });

  it('action links open in new tab with noopener', () => {
    render(<EmergencyAlerts />);
    const jimmyLink = screen.getAllByText('Free Jimmy Lai Campaign')[0];
    expect(jimmyLink.getAttribute('target')).toBe('_blank');
    expect(jimmyLink.getAttribute('rel')).toContain('noopener');
  });

  // --- Expand / Collapse ---

  it('renders expand buttons for all alerts', () => {
    render(<EmergencyAlerts />);
    const expandButtons = screen.getAllByText(/expand --details/);
    expect(expandButtons.length).toBe(4);
  });

  it('expands alert details when expand button is clicked', () => {
    render(<EmergencyAlerts />);
    // Details should NOT be visible before expanding
    expect(screen.queryByText(/ACTION NEEDED:/)).toBeFalsy();

    // Click expand on first alert
    const expandButtons = screen.getAllByText(/expand --details/);
    fireEvent.click(expandButtons[0]);

    // Details should now be visible
    expect(screen.getByText(/ACTION NEEDED:/)).toBeTruthy();
  });

  it('collapses alert details when collapse button is clicked', () => {
    render(<EmergencyAlerts />);
    // Expand first
    const expandButtons = screen.getAllByText(/expand --details/);
    fireEvent.click(expandButtons[0]);
    expect(screen.getByText(/ACTION NEEDED:/)).toBeTruthy();

    // Now collapse
    fireEvent.click(screen.getByText(/collapse/));
    expect(screen.queryByText(/ACTION NEEDED:/)).toBeFalsy();
  });

  it('shows all links in expanded view', () => {
    render(<EmergencyAlerts />);
    // Expand Jimmy Lai alert
    const expandButtons = screen.getAllByText(/expand --details/);
    fireEvent.click(expandButtons[0]);

    // Expanded view should show both links
    const jimmyLinks = screen.getAllByText('Free Jimmy Lai Campaign');
    const hkWatchLinks = screen.getAllByText('Hong Kong Watch');
    expect(jimmyLinks.length).toBeGreaterThanOrEqual(1);
    expect(hkWatchLinks.length).toBeGreaterThanOrEqual(1);
  });

  // --- Dismiss ---

  it('dismiss button removes an alert', () => {
    render(<EmergencyAlerts />);
    expect(screen.getByText(/URGENT: Jimmy Lai Sentenced/)).toBeTruthy();

    // Click dismiss on first alert
    const dismissButtons = screen.getAllByLabelText('Dismiss alert');
    fireEvent.click(dismissButtons[0]);

    // Alert should be gone
    expect(screen.queryByText(/URGENT: Jimmy Lai Sentenced/)).toBeFalsy();
  });

  it('shows dismissed count after dismissing', () => {
    render(<EmergencyAlerts />);
    const dismissButtons = screen.getAllByLabelText('Dismiss alert');
    fireEvent.click(dismissButtons[0]);

    expect(screen.getByText(/show --dismissed \(1\)/)).toBeTruthy();
  });

  it('saves dismissed alerts to localStorage', () => {
    render(<EmergencyAlerts />);
    const dismissButtons = screen.getAllByLabelText('Dismiss alert');
    fireEvent.click(dismissButtons[0]);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'dismissedAlerts',
      expect.stringContaining('jimmy-lai-verdict')
    );
  });

  it('restores dismissed alerts from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(['jimmy-lai-verdict', 'uyghur-forced-labor']));
    render(<EmergencyAlerts />);

    // Two alerts should be dismissed, two remaining
    expect(screen.queryByText(/URGENT: Jimmy Lai Sentenced/)).toBeFalsy();
    expect(screen.queryByText(/New Report: 57 Global Brands/)).toBeFalsy();
    expect(screen.getByText(/Taiwan Reports Increased PLA Activity/)).toBeTruthy();
    expect(screen.getByText(/Hong Kong 47: Mass Sentencing/)).toBeTruthy();
  });

  it('show-dismissed button restores all alerts', () => {
    render(<EmergencyAlerts />);
    const dismissButtons = screen.getAllByLabelText('Dismiss alert');
    fireEvent.click(dismissButtons[0]);

    // Click show dismissed
    fireEvent.click(screen.getByText(/show --dismissed/));

    // Alert should reappear
    expect(screen.getByText(/URGENT: Jimmy Lai Sentenced/)).toBeTruthy();
  });

  it('returns null when all alerts are dismissed', () => {
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify(['jimmy-lai-verdict', 'uyghur-forced-labor', 'taiwan-military', 'hk-47-sentencing'])
    );
    const { container } = render(<EmergencyAlerts />);
    // Component should render nothing
    expect(container.innerHTML).toBe('');
  });

  // --- Accessibility ---

  it('dismiss buttons have aria-label', () => {
    render(<EmergencyAlerts />);
    const dismissButtons = screen.getAllByLabelText('Dismiss alert');
    expect(dismissButtons.length).toBe(4);
  });

  it('expand buttons have aria-label', () => {
    render(<EmergencyAlerts />);
    const expandButtons = screen.getAllByLabelText('Expand alert details');
    expect(expandButtons.length).toBe(4);
  });
});
