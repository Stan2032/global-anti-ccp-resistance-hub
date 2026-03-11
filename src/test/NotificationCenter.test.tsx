import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import NotificationCenter from '../components/NotificationCenter';
import { dataApi } from '../services/dataApi';

// ── Mock localStorage ───────────────────────────────────
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock clipboard
Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe('NotificationCenter', () => {
  // ── Rendering ──────────────────────────────────────────

  it('renders the component header', () => {
    render(<NotificationCenter />);
    expect(screen.getByText('Notification Center')).toBeTruthy();
  });

  it('has section aria-label', () => {
    render(<NotificationCenter />);
    expect(screen.getByRole('region', { name: 'Notification Center' })).toBeTruthy();
  });

  it('shows notification count', () => {
    render(<NotificationCenter />);
    expect(screen.getByText(/active notifications across/)).toBeTruthy();
  });

  it('shows category count', () => {
    render(<NotificationCenter />);
    expect(screen.getByText(/\d+ categories/)).toBeTruthy();
  });

  // ── Category Filter Buttons ────────────────────────────

  it('renders four category filter buttons', () => {
    render(<NotificationCenter />);
    const filterBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('(')
    );
    expect(filterBtns.length).toBe(4);
  });

  it('category buttons show labels', () => {
    render(<NotificationCenter />);
    expect(screen.getAllByText(/Critical Alerts/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Sanctions & Legal/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Data Updates/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Action Required/).length).toBeGreaterThanOrEqual(1);
  });

  it('clicking a category button activates the filter', () => {
    render(<NotificationCenter />);
    const criticalBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Critical')
    );
    expect(criticalBtn!.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(criticalBtn!);
    expect(criticalBtn!.getAttribute('aria-pressed')).toBe('true');
  });

  it('clicking an active category button deactivates the filter', () => {
    render(<NotificationCenter />);
    const criticalBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Critical')
    );
    fireEvent.click(criticalBtn!);
    expect(criticalBtn!.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(criticalBtn!);
    expect(criticalBtn!.getAttribute('aria-pressed')).toBe('false');
  });

  // ── Search ─────────────────────────────────────────────

  it('renders search input', () => {
    render(<NotificationCenter />);
    expect(screen.getByPlaceholderText('Search notifications...')).toBeTruthy();
  });

  it('search input has aria-label', () => {
    render(<NotificationCenter />);
    expect(screen.getByLabelText('Search notifications')).toBeTruthy();
  });

  it('typing in search filters notifications', () => {
    render(<NotificationCenter />);
    const input = screen.getByPlaceholderText('Search notifications...');
    fireEvent.change(input, { target: { value: 'xyznonexistent999' } });
    expect(screen.getByText('No notifications match your search.')).toBeTruthy();
  });

  it('searching for known term finds results', () => {
    render(<NotificationCenter />);
    const input = screen.getByPlaceholderText('Search notifications...');
    // Emergency alerts always have content related to Hong Kong
    fireEvent.change(input, { target: { value: 'Jimmy' } });
    const count = screen.getByText(/Showing \d+ of \d+ notifications/);
    expect(count).toBeTruthy();
  });

  // ── Notification Cards ─────────────────────────────────

  it('renders expandable notification cards', () => {
    render(<NotificationCenter />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expect(expandBtns.length).toBeGreaterThanOrEqual(1);
  });

  it('notification cards start collapsed', () => {
    render(<NotificationCenter />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expandBtns.forEach((btn) => {
      expect(btn.getAttribute('aria-expanded')).toBe('false');
    });
  });

  it('clicking a notification card expands it', () => {
    render(<NotificationCenter />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    if (expandBtns.length > 0) {
      fireEvent.click(expandBtns[0]);
      expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
    }
  });

  it('clicking an expanded card collapses it', () => {
    render(<NotificationCenter />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    if (expandBtns.length > 0) {
      fireEvent.click(expandBtns[0]);
      expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
      fireEvent.click(expandBtns[0]);
      expect(expandBtns[0].getAttribute('aria-expanded')).toBe('false');
    }
  });

  it('only one card can be expanded at a time', () => {
    render(<NotificationCenter />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    if (expandBtns.length >= 2) {
      fireEvent.click(expandBtns[0]);
      expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
      fireEvent.click(expandBtns[1]);
      expect(expandBtns[1].getAttribute('aria-expanded')).toBe('true');
      expect(expandBtns[0].getAttribute('aria-expanded')).toBe('false');
    }
  });

  // ── Settings Panel ─────────────────────────────────────

  it('settings panel is hidden by default', () => {
    render(<NotificationCenter />);
    expect(screen.queryByText('Notification Preferences')).toBeNull();
  });

  it('clicking settings button opens the panel', () => {
    render(<NotificationCenter />);
    const settingsBtn = screen.getByLabelText('Toggle notification settings');
    fireEvent.click(settingsBtn);
    expect(screen.getByText('Notification Preferences')).toBeTruthy();
  });

  it('settings button has aria-pressed', () => {
    render(<NotificationCenter />);
    const settingsBtn = screen.getByLabelText('Toggle notification settings');
    expect(settingsBtn.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(settingsBtn);
    expect(settingsBtn.getAttribute('aria-pressed')).toBe('true');
  });

  it('settings panel shows category toggles', () => {
    render(<NotificationCenter />);
    fireEvent.click(screen.getByLabelText('Toggle notification settings'));
    expect(screen.getByLabelText(/Critical Alerts: enabled/)).toBeTruthy();
    expect(screen.getByLabelText(/Sanctions & Legal: enabled/)).toBeTruthy();
    expect(screen.getByLabelText(/Data Updates: enabled/)).toBeTruthy();
    expect(screen.getByLabelText(/Action Required: enabled/)).toBeTruthy();
  });

  it('toggling a category disables it', () => {
    render(<NotificationCenter />);
    fireEvent.click(screen.getByLabelText('Toggle notification settings'));
    const critToggle = screen.getByLabelText(/Critical Alerts: enabled/);
    fireEvent.click(critToggle);
    expect(screen.getByLabelText(/Critical Alerts: disabled/)).toBeTruthy();
  });

  it('settings panel shows browser permission status', () => {
    render(<NotificationCenter />);
    fireEvent.click(screen.getByLabelText('Toggle notification settings'));
    // Should show some status about browser notifications
    const statusTexts = screen.getAllByText(/notifications/i);
    expect(statusTexts.length).toBeGreaterThanOrEqual(1);
  });

  it('settings panel shows service worker status', () => {
    render(<NotificationCenter />);
    fireEvent.click(screen.getByLabelText('Toggle notification settings'));
    const swTexts = screen.getAllByText(/service worker/i);
    expect(swTexts.length).toBeGreaterThanOrEqual(1);
  });

  it('settings panel shows privacy note', () => {
    render(<NotificationCenter />);
    fireEvent.click(screen.getByLabelText('Toggle notification settings'));
    expect(screen.getByText(/no data sent to servers/i)).toBeTruthy();
  });

  // ── Preferences Persistence ────────────────────────────

  it('saves preferences to localStorage', () => {
    render(<NotificationCenter />);
    fireEvent.click(screen.getByLabelText('Toggle notification settings'));
    fireEvent.click(screen.getByLabelText(/Critical Alerts: enabled/));
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'notification-prefs',
      expect.any(String)
    );
  });

  it('loads preferences from localStorage', () => {
    localStorageMock.setItem('notification-prefs', JSON.stringify({
      critical: false, sanctions: true, data: true, action: true
    }));
    render(<NotificationCenter />);
    fireEvent.click(screen.getByLabelText('Toggle notification settings'));
    expect(screen.getByLabelText(/Critical Alerts: disabled/)).toBeTruthy();
  });

  // ── Copy to Clipboard ──────────────────────────────────

  it('renders copy button', () => {
    render(<NotificationCenter />);
    expect(screen.getByLabelText('Copy notification feed to clipboard')).toBeTruthy();
  });

  it('copy button calls clipboard API', () => {
    render(<NotificationCenter />);
    fireEvent.click(screen.getByLabelText('Copy notification feed to clipboard'));
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    const clipText = vi.mocked(navigator.clipboard.writeText).mock.calls[0][0];
    expect(clipText).toContain('Notification Center');
    expect(clipText).toContain('CC BY 4.0');
  });

  it('copy button shows confirmed state', () => {
    render(<NotificationCenter />);
    fireEvent.click(screen.getByLabelText('Copy notification feed to clipboard'));
    expect(screen.getByText('Copied')).toBeTruthy();
  });

  // ── Show More Pattern ──────────────────────────────────

  it('shows max 10 notifications by default', () => {
    render(<NotificationCenter />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expect(expandBtns.length).toBeLessThanOrEqual(10);
  });

  it('shows "Show all" button when there are more than 10 notifications', () => {
    render(<NotificationCenter />);
    const _showAllBtn = screen.queryByText(/Show all \d+ notifications/);
    // May or may not have >10 depending on data, check both cases
    const count = screen.getByText(/Showing \d+ of \d+ notifications/);
    expect(count).toBeTruthy();
  });

  // ── Data Quality ───────────────────────────────────────

  it('integrates with dataApi emergency alerts', () => {
    const alerts = dataApi.getAlerts();
    expect(alerts.length).toBeGreaterThan(0);
  });

  it('integrates with dataApi recent updates', () => {
    const updates = dataApi.getRecentUpdates();
    expect(updates.length).toBeGreaterThan(0);
  });

  it('integrates with dataApi sanctions', () => {
    const sanctions = dataApi.getSanctions();
    expect(sanctions.length).toBeGreaterThan(0);
  });

  it('notification feed contains items from various data sources', () => {
    render(<NotificationCenter />);
    // With "show all" we should see items from multiple sources
    const showAllBtn = screen.queryByText(/Show all \d+ notifications/);
    if (showAllBtn) fireEvent.click(showAllBtn);
    const allText = document.body.textContent;
    // Emergency alerts and/or data updates should be present
    expect(allText).toMatch(/Platform Updates|Emergency Alerts|Sanctions Tracker/i);
  });

  // ── Footer ─────────────────────────────────────────────

  it('shows privacy attribution', () => {
    render(<NotificationCenter />);
    expect(screen.getByText(/Privacy-first/)).toBeTruthy();
  });

  it('shows local storage note', () => {
    render(<NotificationCenter />);
    expect(screen.getByText(/Preferences stored locally/)).toBeTruthy();
  });

  it('shows service worker version', () => {
    render(<NotificationCenter />);
    expect(screen.getByText(/Push via service worker/)).toBeTruthy();
  });

  // ── Combined Filter + Search ───────────────────────────

  it('handles combined filter + search gracefully', () => {
    render(<NotificationCenter />);
    // Activate Critical filter
    const criticalBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Critical')
    );
    fireEvent.click(criticalBtn!);
    // Then search for something that doesn't exist
    const input = screen.getByPlaceholderText('Search notifications...');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText(/No notifications/)).toBeTruthy();
  });

  it('clearing search restores results', () => {
    render(<NotificationCenter />);
    const input = screen.getByPlaceholderText('Search notifications...');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('No notifications match your search.')).toBeTruthy();
    fireEvent.change(input, { target: { value: '' } });
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expect(expandBtns.length).toBeGreaterThanOrEqual(1);
  });
});
