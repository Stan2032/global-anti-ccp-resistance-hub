import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock lazy-loaded components
vi.mock('../components/IncidentReportForm', () => ({ default: () => <div>IncidentReportForm</div> }));
vi.mock('../components/SecurityQuiz', () => ({ default: () => <div>SecurityQuiz</div> }));
vi.mock('../components/SafetyChecklist', () => ({ default: () => <div>SafetyChecklist</div> }));
vi.mock('../components/WitnessProtection', () => ({ default: () => <div>WitnessProtection</div> }));
vi.mock('../components/ChinaExitBan', () => ({ default: () => <div>ChinaExitBan</div> }));
vi.mock('../components/ChinaTechThreats', () => ({ default: () => <div>ChinaTechThreats</div> }));
vi.mock('../components/LegalResourcesHub', () => ({ default: () => <div>LegalResourcesHub</div> }));

// Mock useWebRTCLeakCheck hook
vi.mock('../hooks/useWebRTCLeakCheck', () => ({
  default: () => ({
    status: 'idle',
    leakedIPs: [],
    isLeaking: false,
    runCheck: vi.fn(),
  }),
}));

import SecurityCenter from '../pages/SecurityCenter';

describe('SecurityCenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Header ---

  it('renders the page header', () => {
    render(<SecurityCenter />);
    expect(screen.getByText('Security Center')).toBeTruthy();
    expect(screen.getByText(/Comprehensive security assessment/)).toBeTruthy();
  });

  it('renders security notice alert', () => {
    render(<SecurityCenter />);
    expect(screen.getByText('Security Notice')).toBeTruthy();
    expect(screen.getByText(/CCP actively targets resistance activists/)).toBeTruthy();
  });

  // --- Tab Navigation ---

  it('renders 4 tabs (Assess, Tools, Guides, Tech Threats)', () => {
    render(<SecurityCenter />);
    expect(screen.getByText('Assess')).toBeTruthy();
    expect(screen.getByText('Tools')).toBeTruthy();
    expect(screen.getByText('Guides')).toBeTruthy();
    expect(screen.getByText('Tech Threats')).toBeTruthy();
  });

  it('does not render removed tabs (Protect, Whistleblower)', () => {
    render(<SecurityCenter />);
    const allButtons = screen.getAllByRole('button');
    const buttonTexts = allButtons.map(b => b.textContent);
    expect(buttonTexts).not.toContain('Protect');
    expect(buttonTexts).not.toContain('Whistleblower');
  });

  // --- Assess Tab (default) ---

  it('defaults to Assess tab with SecurityQuiz', () => {
    render(<SecurityCenter />);
    // SecurityQuiz is lazy-loaded; Suspense fallback shows
    const loadingIndicators = screen.getAllByText('$ loading');
    expect(loadingIndicators.length).toBeGreaterThanOrEqual(1);
  });

  // --- Tools Tab ---

  it('switches to Tools tab and shows security tools', () => {
    render(<SecurityCenter />);
    fireEvent.click(screen.getByText('Tools'));
    expect(screen.getByText('Essential Security Tools')).toBeTruthy();
    expect(screen.getByText('Tor Browser')).toBeTruthy();
    expect(screen.getByText('ProtonVPN')).toBeTruthy();
    expect(screen.getByText('Signal')).toBeTruthy();
  });

  it('shows WebRTC leak test section in Tools tab', () => {
    render(<SecurityCenter />);
    fireEvent.click(screen.getByText('Tools'));
    expect(screen.getByText('WebRTC Leak Test')).toBeTruthy();
    expect(screen.getByText('$ run_webrtc_test')).toBeTruthy();
  });

  it('shows Verify Your Connection section in Tools tab', () => {
    render(<SecurityCenter />);
    fireEvent.click(screen.getByText('Tools'));
    expect(screen.getByText('Verify Your Connection')).toBeTruthy();
  });

  it('shows incident report and exit ban tracker in Tools tab', () => {
    render(<SecurityCenter />);
    fireEvent.click(screen.getByText('Tools'));
    expect(screen.getByText('── incident_report ──')).toBeTruthy();
    expect(screen.getByText('── exit_ban_tracker ──')).toBeTruthy();
  });

  it('renders tool cards with download links', () => {
    render(<SecurityCenter />);
    fireEvent.click(screen.getByText('Tools'));
    const downloadButtons = screen.getAllByText('Download');
    expect(downloadButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('shows Essential/Advanced badges on tools', () => {
    render(<SecurityCenter />);
    fireEvent.click(screen.getByText('Tools'));
    const essentialBadges = screen.getAllByText('Essential');
    const advancedBadges = screen.getAllByText('Advanced');
    expect(essentialBadges.length).toBeGreaterThanOrEqual(1);
    expect(advancedBadges.length).toBeGreaterThanOrEqual(1);
  });

  // --- Guides Tab ---

  it('switches to Guides tab and shows training guides', () => {
    render(<SecurityCenter />);
    fireEvent.click(screen.getByText('Guides'));
    expect(screen.getByText('Security Training Guides')).toBeTruthy();
  });

  it('shows witness protection section in Guides tab (merged from Protect)', () => {
    render(<SecurityCenter />);
    fireEvent.click(screen.getByText('Guides'));
    expect(screen.getByText('── witness_protection ──')).toBeTruthy();
  });

  it('shows emergency procedures in Guides tab', () => {
    render(<SecurityCenter />);
    fireEvent.click(screen.getByText('Guides'));
    expect(screen.getByText('Emergency Procedures')).toBeTruthy();
    expect(screen.getByText(/Stop all online activity immediately/)).toBeTruthy();
  });

  it('shows emergency contacts in Guides tab', () => {
    render(<SecurityCenter />);
    fireEvent.click(screen.getByText('Guides'));
    expect(screen.getByText('── emergency_contacts ──')).toBeTruthy();
  });

  // --- Tech Threats Tab ---

  it('switches to Tech Threats tab', () => {
    render(<SecurityCenter />);
    fireEvent.click(screen.getByText('Tech Threats'));
    // ChinaTechThreats is lazy-loaded; Suspense fallback shows
    const loadingIndicators = screen.getAllByText('$ loading');
    expect(loadingIndicators.length).toBeGreaterThanOrEqual(1);
  });

  // --- No framer-motion ---

  it('does not use framer-motion (no motion elements)', () => {
    const { container } = render(<SecurityCenter />);
    const motionElements = container.querySelectorAll('[data-projection-id]');
    expect(motionElements.length).toBe(0);
  });
});
