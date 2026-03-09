// @ts-nocheck
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

describe('PWAInstallBanner', () => {
  let PWAInstallBanner;

  beforeEach(async () => {
    vi.resetModules();

    // Mock localStorage
    const store = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, val) => { store[key] = val; }),
      removeItem: vi.fn((key) => { delete store[key]; }),
    });

    // Mock navigator.userAgent for iOS detection
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
      configurable: true,
    });

    // Mock window.matchMedia to not be standalone
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));

    // Mock window.navigator.standalone
    Object.defineProperty(navigator, 'standalone', {
      value: false,
      configurable: true,
    });

    // Dynamic import to pick up mocks
    const mod = await import('../components/PWAInstallBanner');
    PWAInstallBanner = mod.default;
  });

  it('renders the install title on iOS', async () => {
    render(<PWAInstallBanner />);
    // On iOS the banner shows after a timeout; advance timers
    await vi.waitFor(() => {
      expect(screen.getByText('Install Resistance Hub')).toBeTruthy();
    }, { timeout: 5000 });
  });

  it('renders the description text', async () => {
    render(<PWAInstallBanner />);
    await vi.waitFor(() => {
      expect(screen.getByText(/Add to your home screen/)).toBeTruthy();
    }, { timeout: 5000 });
  });

  it('renders benefit items', async () => {
    render(<PWAInstallBanner />);
    await vi.waitFor(() => {
      expect(screen.getByText('Works offline')).toBeTruthy();
      expect(screen.getByText('Quick access')).toBeTruthy();
      expect(screen.getByText('No app store needed')).toBeTruthy();
      expect(screen.getByText('Always up to date')).toBeTruthy();
    }, { timeout: 5000 });
  });

  it('renders iOS install steps', async () => {
    render(<PWAInstallBanner />);
    await vi.waitFor(() => {
      expect(screen.getByText(/To install on iOS/)).toBeTruthy();
      expect(screen.getByText(/Share/)).toBeTruthy();
      expect(screen.getByText(/Add to Home Screen/)).toBeTruthy();
    }, { timeout: 5000 });
  });

  it('renders dismiss button', async () => {
    render(<PWAInstallBanner />);
    await vi.waitFor(() => {
      expect(screen.getByLabelText('Dismiss')).toBeTruthy();
    }, { timeout: 5000 });
  });

  it('dismisses banner and saves to localStorage', async () => {
    render(<PWAInstallBanner />);
    await vi.waitFor(() => {
      expect(screen.getByText('Install Resistance Hub')).toBeTruthy();
    }, { timeout: 5000 });

    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(localStorage.setItem).toHaveBeenCalledWith('pwa-banner-dismissed', expect.any(String));
  });

  it('returns null when already in standalone mode', async () => {
    vi.resetModules();
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    Object.defineProperty(navigator, 'standalone', { value: true, configurable: true });

    const mod = await import('../components/PWAInstallBanner');
    const StandaloneBanner = mod.default;
    const { container } = render(<StandaloneBanner />);
    expect(container.innerHTML).toBe('');
  });

  it('returns null when previously dismissed within 7 days', async () => {
    vi.resetModules();
    const recentTimestamp = Date.now().toString();
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => recentTimestamp),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
    Object.defineProperty(navigator, 'standalone', { value: false, configurable: true });

    const mod = await import('../components/PWAInstallBanner');
    const DismissedBanner = mod.default;
    const { container } = render(<DismissedBanner />);
    expect(container.innerHTML).toBe('');
  });
});
