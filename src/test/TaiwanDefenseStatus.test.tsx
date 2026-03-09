// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TaiwanDefenseStatus from '../components/TaiwanDefenseStatus';

describe('TaiwanDefenseStatus', () => {
  // --- Header ---

  it('renders the header with title', () => {
    render(<TaiwanDefenseStatus />);
    expect(screen.getByText('Taiwan Defense Status')).toBeTruthy();
    expect(screen.getByText('Real-time tracking of cross-strait military balance and allied support')).toBeTruthy();
  });

  it('shows the alert level banner', () => {
    render(<TaiwanDefenseStatus />);
    expect(screen.getByText('ELEVATED THREAT LEVEL')).toBeTruthy();
    expect(screen.getByText(/Unprecedented naval buildup/)).toBeTruthy();
  });

  // --- Tab Navigation ---

  it('renders all 4 tab buttons', () => {
    render(<TaiwanDefenseStatus />);
    expect(screen.getByText('Overview')).toBeTruthy();
    expect(screen.getByText('Military Balance')).toBeTruthy();
    expect(screen.getByText('Allied Support')).toBeTruthy();
    expect(screen.getByText('Scenarios')).toBeTruthy();
  });

  // --- Overview Tab (Default) ---

  it('shows Recent Developments on the default Overview tab', () => {
    render(<TaiwanDefenseStatus />);
    expect(screen.getByText('Recent Developments')).toBeTruthy();
    expect(screen.getByText(/US approves \$11\.1B arms package/)).toBeTruthy();
    expect(screen.getByText(/Record 153 PLA aircraft/)).toBeTruthy();
  });

  it('shows key statistics on Overview tab', () => {
    render(<TaiwanDefenseStatus />);
    expect(screen.getByText('100nm')).toBeTruthy();
    expect(screen.getByText('Taiwan Strait Width')).toBeTruthy();
    expect(screen.getByText('$11.1B')).toBeTruthy();
    expect(screen.getByText('Latest US Arms Package')).toBeTruthy();
    expect(screen.getByText('23.5M')).toBeTruthy();
    expect(screen.getByText('Taiwan Population')).toBeTruthy();
  });

  // --- Military Balance Tab ---

  it('switches to Military Balance tab', () => {
    render(<TaiwanDefenseStatus />);
    fireEvent.click(screen.getByText('Military Balance'));
    expect(screen.getByText('PLA (China)')).toBeTruthy();
    expect(screen.getByText('Taiwan (ROC)')).toBeTruthy();
    expect(screen.getByText('2,000,000+')).toBeTruthy();
    expect(screen.getByText('170,000 active')).toBeTruthy();
  });

  it('shows military advantages on Military Balance tab', () => {
    render(<TaiwanDefenseStatus />);
    fireEvent.click(screen.getByText('Military Balance'));
    expect(screen.getByText('Overwhelming numerical superiority')).toBeTruthy();
    expect(screen.getByText('Defensive geography (Taiwan Strait)')).toBeTruthy();
  });

  // --- Allied Support Tab ---

  it('switches to Allied Support tab', () => {
    render(<TaiwanDefenseStatus />);
    fireEvent.click(screen.getByText('Allied Support'));
    expect(screen.getByText('🇺🇸 US Arms Packages to Taiwan')).toBeTruthy();
    expect(screen.getByText('🇺🇸 United States')).toBeTruthy();
    expect(screen.getByText('🇯🇵 Japan')).toBeTruthy();
    expect(screen.getByText('🇦🇺 Australia')).toBeTruthy();
  });

  it('shows US arms packages table', () => {
    render(<TaiwanDefenseStatus />);
    fireEvent.click(screen.getByText('Allied Support'));
    expect(screen.getByText('$11.1B')).toBeTruthy();
    expect(screen.getByText('$567M')).toBeTruthy();
    expect(screen.getByText('Taiwan Relations Act')).toBeTruthy();
  });

  // --- Scenarios Tab ---

  it('switches to Scenarios tab', () => {
    render(<TaiwanDefenseStatus />);
    fireEvent.click(screen.getByText('Scenarios'));
    expect(screen.getByText('Gray Zone Escalation')).toBeTruthy();
    expect(screen.getByText('ONGOING')).toBeTruthy();
    expect(screen.getByText('Quarantine/Blockade')).toBeTruthy();
    expect(screen.getByText('MEDIUM-HIGH')).toBeTruthy();
    expect(screen.getByText('Full Invasion')).toBeTruthy();
    expect(screen.getByText('LOW-MEDIUM')).toBeTruthy();
  });

  it('shows warning indicators on Scenarios tab', () => {
    render(<TaiwanDefenseStatus />);
    fireEvent.click(screen.getByText('Scenarios'));
    expect(screen.getByText(/Daily ADIZ incursions/)).toBeTruthy();
    expect(screen.getByText(/Amphibious capability buildup/)).toBeTruthy();
  });

  // --- Tab Isolation ---

  it('hides Overview content when switching tabs', () => {
    render(<TaiwanDefenseStatus />);
    expect(screen.getByText('Recent Developments')).toBeTruthy();
    fireEvent.click(screen.getByText('Military Balance'));
    expect(screen.queryByText('Recent Developments')).toBeFalsy();
  });

  // --- Resources ---

  it('renders resource links', () => {
    render(<TaiwanDefenseStatus />);
    expect(screen.getByText('CSIS China Power')).toBeTruthy();
    expect(screen.getByText('ISW China-Taiwan')).toBeTruthy();
    expect(screen.getByText('Taiwan Defense')).toBeTruthy();
  });

  it('resource links open in new tab', () => {
    render(<TaiwanDefenseStatus />);
    const csisLink = screen.getByText('CSIS China Power').closest('a');
    expect(csisLink.getAttribute('target')).toBe('_blank');
    expect(csisLink.getAttribute('rel')).toContain('noopener');
    expect(csisLink.getAttribute('href')).toBe('https://www.csis.org/programs/china-power-project');
  });
});
