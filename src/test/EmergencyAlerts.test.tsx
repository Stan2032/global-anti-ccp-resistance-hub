// @ts-nocheck
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

  it('renders first 2 active alerts initially', () => {
    render(<EmergencyAlerts />);
    expect(screen.getByText(/Joshua Wong Foreign Collusion Hearing/)).toBeTruthy();
    expect(screen.getByText(/URGENT: Jimmy Lai Sentenced/)).toBeTruthy();
    // Remaining alerts hidden behind "show more"
    expect(screen.queryByText(/Hong Kong 47: Appeals Dismissed/)).toBeFalsy();
    expect(screen.queryByText(/ESCALATION: Family Member Prosecuted/)).toBeFalsy();
    // Taiwan military alert is expired (expires 2025-06-18) — should NOT appear
    expect(screen.queryByText(/Taiwan Reports Increased PLA Activity/)).toBeFalsy();
  });

  it('shows all active alerts after clicking show more', () => {
    render(<EmergencyAlerts />);
    fireEvent.click(screen.getByText(/show --more/));
    expect(screen.getByText(/Joshua Wong Foreign Collusion Hearing/)).toBeTruthy();
    expect(screen.getByText(/URGENT: Jimmy Lai Sentenced/)).toBeTruthy();
    expect(screen.getByText(/100\+ Global Brands Linked/)).toBeTruthy();
    expect(screen.getByText(/Hong Kong 47: Appeals Dismissed/)).toBeTruthy();
    expect(screen.getByText(/ESCALATION: Family Member Prosecuted/)).toBeTruthy();
  });

  it('shows alert summaries for initially visible alerts', () => {
    render(<EmergencyAlerts />);
    expect(screen.getByText(/High Court hearing.*for foreign collusion/)).toBeTruthy();
    expect(screen.getByText(/Hong Kong media tycoon Jimmy Lai sentenced/)).toBeTruthy();
    // Hidden behind "show more"
    expect(screen.queryByText(/Court of Appeal upholds convictions/)).toBeFalsy();
    expect(screen.queryByText(/Father of US-based activist sentenced/)).toBeFalsy();
  });

  it('renders alert type badges for visible alerts', () => {
    render(<EmergencyAlerts />);
    const criticalBadges = screen.getAllByText('critical');
    expect(criticalBadges.length).toBe(2);
  });

  it('renders alert dates for visible alerts', () => {
    render(<EmergencyAlerts />);
    expect(screen.getByText('2026-03-03')).toBeTruthy();
    expect(screen.getByText('2025-12-15')).toBeTruthy();
    // Hidden behind "show more"
    expect(screen.queryByText('2024-11-19')).toBeFalsy();
    expect(screen.queryByText('2026-02-26')).toBeFalsy();
  });

  // --- External Links ---

  it('renders external action links for visible alerts', () => {
    render(<EmergencyAlerts />);
    // First alert (Joshua Wong) has Hong Kong Watch link
    expect(screen.getAllByText('Hong Kong Watch').length).toBeGreaterThanOrEqual(1);
    // Second alert (Jimmy Lai) has Free Jimmy Lai Campaign link
    expect(screen.getAllByText('Free Jimmy Lai Campaign').length).toBeGreaterThanOrEqual(1);
    // NPR Report is on the hidden Kwok alert
    expect(screen.queryByText('NPR Report')).toBeFalsy();
  });

  it('action links open in new tab with noopener', () => {
    render(<EmergencyAlerts />);
    const hkWatchLink = screen.getAllByText('Hong Kong Watch')[0];
    expect(hkWatchLink.getAttribute('target')).toBe('_blank');
    expect(hkWatchLink.getAttribute('rel')).toContain('noopener');
  });

  // --- Expand / Collapse ---

  it('renders expand buttons for visible alerts', () => {
    render(<EmergencyAlerts />);
    const expandButtons = screen.getAllByText(/expand --details/);
    expect(expandButtons.length).toBe(2);
  });

  it('expands alert details when expand button is clicked', () => {
    render(<EmergencyAlerts />);
    // Details should NOT be visible before expanding
    expect(screen.queryByText(/THE CHARGE:/)).toBeFalsy();

    // Click expand on first alert
    const expandButtons = screen.getAllByText(/expand --details/);
    fireEvent.click(expandButtons[0]);

    // Details should now be visible (Joshua Wong hearing details)
    expect(screen.getByText(/THE CHARGE:/)).toBeTruthy();
  });

  it('collapses alert details when collapse button is clicked', () => {
    render(<EmergencyAlerts />);
    // Expand first
    const expandButtons = screen.getAllByText(/expand --details/);
    fireEvent.click(expandButtons[0]);
    expect(screen.getByText(/THE CHARGE:/)).toBeTruthy();

    // Now collapse
    fireEvent.click(screen.getByText(/collapse/));
    expect(screen.queryByText(/THE CHARGE:/)).toBeFalsy();
  });

  it('shows all links in expanded view', () => {
    render(<EmergencyAlerts />);
    // Expand Joshua Wong hearing alert
    const expandButtons = screen.getAllByText(/expand --details/);
    fireEvent.click(expandButtons[0]);

    // Expanded view should show links
    const hkWatchLinks = screen.getAllByText('Hong Kong Watch');
    expect(hkWatchLinks.length).toBeGreaterThanOrEqual(1);
  });

  // --- Dismiss ---

  it('dismiss button removes an alert', () => {
    render(<EmergencyAlerts />);
    expect(screen.getByText(/Joshua Wong Foreign Collusion Hearing/)).toBeTruthy();

    // Click dismiss on first alert
    const dismissButtons = screen.getAllByLabelText('Dismiss alert');
    fireEvent.click(dismissButtons[0]);

    // Alert should be gone
    expect(screen.queryByText(/Joshua Wong Foreign Collusion Hearing/)).toBeFalsy();
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
      expect.stringContaining('joshua-wong-hearing')
    );
  });

  it('restores dismissed alerts from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(['joshua-wong-hearing', 'jimmy-lai-verdict', 'uyghur-forced-labor']));
    render(<EmergencyAlerts />);

    // Three alerts should be dismissed, remaining visible (HK47 + Kwok)
    expect(screen.queryByText(/Joshua Wong Foreign Collusion Hearing/)).toBeFalsy();
    expect(screen.queryByText(/URGENT: Jimmy Lai Sentenced/)).toBeFalsy();
    expect(screen.queryByText(/100\+ Global Brands Linked/)).toBeFalsy();
    expect(screen.getByText(/Hong Kong 47: Appeals Dismissed/)).toBeTruthy();
    expect(screen.getByText(/ESCALATION: Family Member Prosecuted/)).toBeTruthy();
  });

  it('show-dismissed button restores all alerts', () => {
    render(<EmergencyAlerts />);
    const dismissButtons = screen.getAllByLabelText('Dismiss alert');
    fireEvent.click(dismissButtons[0]);

    // Click show dismissed
    fireEvent.click(screen.getByText(/show --dismissed/));

    // Alert should reappear
    expect(screen.getByText(/Joshua Wong Foreign Collusion Hearing/)).toBeTruthy();
  });

  it('returns null when all alerts are dismissed', () => {
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify(['joshua-wong-hearing', 'jimmy-lai-verdict', 'uyghur-forced-labor', 'taiwan-military', 'hk-47-sentencing', 'kwok-family-prosecution'])
    );
    const { container } = render(<EmergencyAlerts />);
    // Component should render nothing
    expect(container.innerHTML).toBe('');
  });

  // --- Accessibility ---

  it('dismiss buttons have aria-label', () => {
    render(<EmergencyAlerts />);
    const dismissButtons = screen.getAllByLabelText('Dismiss alert');
    expect(dismissButtons.length).toBe(2);
  });

  it('expand buttons have aria-label', () => {
    render(<EmergencyAlerts />);
    const expandButtons = screen.getAllByLabelText('Expand alert details');
    expect(expandButtons.length).toBe(2);
  });

  // --- Severity Sorting ---

  it('sorts alerts by severity (critical first, then warning, then info)', () => {
    render(<EmergencyAlerts />);
    // Click show more to reveal all
    fireEvent.click(screen.getByText(/show --more/));
    
    // Get all type badges in order
    const badges = screen.getAllByText(/^(critical|warning|info)$/);
    const types = badges.map(b => b.textContent);
    
    // All critical should come before any warning
    const lastCriticalIdx = types.lastIndexOf('critical');
    const firstWarningIdx = types.indexOf('warning');
    if (lastCriticalIdx !== -1 && firstWarningIdx !== -1) {
      expect(lastCriticalIdx).toBeLessThan(firstWarningIdx);
    }
  });

  it('Taiwan military alert is excluded (expired and inactive)', () => {
    render(<EmergencyAlerts />);
    fireEvent.click(screen.getByText(/show --more/));
    expect(screen.queryByText(/Taiwan Reports Increased PLA Activity/)).toBeFalsy();
  });
});
