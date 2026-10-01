import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TaiwanDefenseStatus from '../components/TaiwanDefenseStatus';
import { expectDisclosureSections, inSection } from './helpers/disclosure';

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

  // --- Sections ---

  it('renders all 4 sections as native disclosures', () => {
    render(<TaiwanDefenseStatus />);
    expectDisclosureSections(['Overview', 'Military Balance', 'Allied Support', 'Scenarios']);
  });

  // --- Overview ---

  it('shows Recent Developments in the Overview section', () => {
    render(<TaiwanDefenseStatus />);
    const section = inSection('Overview');
    expect(section.getByText('Recent Developments')).toBeTruthy();
    expect(section.getByText(/US approves \$11\.1B arms package/)).toBeTruthy();
    expect(section.getByText(/Record 153 PLA aircraft/)).toBeTruthy();
  });

  it('shows key statistics in the Overview section', () => {
    render(<TaiwanDefenseStatus />);
    const section = inSection('Overview');
    expect(section.getByText('100nm')).toBeTruthy();
    expect(section.getByText('Taiwan Strait Width')).toBeTruthy();
    expect(section.getAllByText('$11.1B').length).toBeGreaterThan(0);
    expect(section.getByText('Latest US Arms Package')).toBeTruthy();
    expect(section.getByText('23.5M')).toBeTruthy();
    expect(section.getByText('Taiwan Population')).toBeTruthy();
  });

  // --- Military Balance ---

  it('shows the Military Balance section without interaction', () => {
    render(<TaiwanDefenseStatus />);
    const section = inSection('Military Balance');
    expect(section.getByText('PLA (China)')).toBeTruthy();
    expect(section.getByText('Taiwan (ROC)')).toBeTruthy();
    expect(section.getByText('2,000,000+')).toBeTruthy();
    expect(section.getByText('170,000 active')).toBeTruthy();
  });

  it('shows military advantages in the Military Balance section', () => {
    render(<TaiwanDefenseStatus />);
    const section = inSection('Military Balance');
    expect(section.getByText('Overwhelming numerical superiority')).toBeTruthy();
    expect(section.getByText('Defensive geography (Taiwan Strait)')).toBeTruthy();
  });

  // --- Allied Support ---

  it('shows the Allied Support section without interaction', () => {
    render(<TaiwanDefenseStatus />);
    const section = inSection('Allied Support');
    expect(section.getByText('🇺🇸 US Arms Packages to Taiwan')).toBeTruthy();
    expect(section.getByText('🇺🇸 United States')).toBeTruthy();
    expect(section.getByText('🇯🇵 Japan')).toBeTruthy();
    expect(section.getByText('🇦🇺 Australia')).toBeTruthy();
  });

  it('shows US arms packages table', () => {
    render(<TaiwanDefenseStatus />);
    const section = inSection('Allied Support');
    expect(section.getAllByText('$11.1B').length).toBeGreaterThan(0);
    expect(section.getByText('$567M')).toBeTruthy();
    expect(section.getByText('Taiwan Relations Act')).toBeTruthy();
  });

  // --- Scenarios ---

  it('shows the Scenarios section without interaction', () => {
    render(<TaiwanDefenseStatus />);
    const section = inSection('Scenarios');
    expect(section.getByText('Gray Zone Escalation')).toBeTruthy();
    expect(section.getByText('ONGOING')).toBeTruthy();
    expect(section.getByText('Quarantine/Blockade')).toBeTruthy();
    expect(section.getByText('MEDIUM-HIGH')).toBeTruthy();
    expect(section.getByText('Full Invasion')).toBeTruthy();
    expect(section.getByText('LOW-MEDIUM')).toBeTruthy();
  });

  it('shows warning indicators in the Scenarios section', () => {
    render(<TaiwanDefenseStatus />);
    const section = inSection('Scenarios');
    expect(section.getByText(/Daily ADIZ incursions/)).toBeTruthy();
    expect(section.getByText(/Amphibious capability buildup/)).toBeTruthy();
  });

  // --- Sections stay mounted ---

  it('opening one section hides nothing in the others', () => {
    render(<TaiwanDefenseStatus />);
    fireEvent.click(screen.getByText('Military Balance'));
    expect(inSection('Overview').getByText('Recent Developments')).toBeTruthy();
    expect(inSection('Military Balance').getByText('Overwhelming numerical superiority')).toBeTruthy();
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
    expect(csisLink!.getAttribute('target')).toBe('_blank');
    expect(csisLink!.getAttribute('rel')).toContain('noopener');
    expect(csisLink!.getAttribute('href')).toBe('https://www.csis.org/programs/china-power-project');
  });
});
