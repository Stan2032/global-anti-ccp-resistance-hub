import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import WitnessProtection from '../components/WitnessProtection';
import { inSection } from './helpers/disclosure';

describe('WitnessProtection', () => {
  it('renders the header with title', () => {
    render(<WitnessProtection />);
    expect(screen.getByText('Witness Protection Guide')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    render(<WitnessProtection />);
    expect(screen.getByText('Resources for at-risk activists and witnesses')).toBeTruthy();
  });

  it('renders emergency contact notice', () => {
    render(<WitnessProtection />);
    expect(screen.getByText('+353 1 210 0489')).toBeTruthy();
  });

  it('renders all section navigation buttons', () => {
    render(<WitnessProtection />);
    expect(screen.getByText('Overview')).toBeTruthy();
    expect(screen.getByText('Risk Assessment')).toBeTruthy();
    expect(screen.getByText('Immediate Steps')).toBeTruthy();
    expect(screen.getAllByText('Relocation').length).toBeGreaterThan(0);
    expect(screen.getByText('Legal Protection')).toBeTruthy();
    expect(screen.getByText('Organizations')).toBeTruthy();
  });

  it('shows overview section by default', () => {
    render(<WitnessProtection />);
    expect(screen.getByText('Who Needs Protection?')).toBeTruthy();
    expect(screen.getByText('Types of Threats')).toBeTruthy();
  });

  it('navigates to Risk Assessment section', () => {
    render(<WitnessProtection />);
    const section = inSection('Risk Assessment');
    expect(section.getByText('Personal Risk Assessment')).toBeTruthy();
    expect(section.getByText('Have you publicly criticized the CCP or spoken about human rights abuses?')).toBeTruthy();
  });

  it('shows all 8 risk assessment questions', () => {
    render(<WitnessProtection />);
    const section = inSection('Risk Assessment');
    expect(section.getByText(/publicly criticized the CCP/)).toBeTruthy();
    expect(section.getByText(/family members still in China/)).toBeTruthy();
    expect(section.getByText(/received threats/)).toBeTruthy();
    expect(section.getByText(/journalist, activist/)).toBeTruthy();
    expect(section.getByText(/approached by unknown individuals/)).toBeTruthy();
    expect(section.getByText(/under surveillance/)).toBeTruthy();
    expect(section.getByText(/testified or provided evidence/)).toBeTruthy();
    expect(section.getByText(/former CCP official/)).toBeTruthy();
  });

  it('shows Calculate button only after answering all questions', () => {
    render(<WitnessProtection />);
    const section = inSection('Risk Assessment');
    // Button should not be visible before answering all questions
    expect(section.queryByText('Calculate Risk Level')).toBeFalsy();
  });

  it('calculates critical risk level when high-weight questions answered yes', () => {
    render(<WitnessProtection />);
    const section = inSection('Risk Assessment');

    // Answer all questions - click "Yes" for high-weight, "No" for low-weight
    const yesButtons = section.getAllByText('Yes');

    // Answer all yes (should give critical)
    yesButtons.forEach(btn => fireEvent.click(btn));

    // Now calculate button should appear
    fireEvent.click(section.getByText('Calculate Risk Level'));
    expect(section.getByText('Risk Level: CRITICAL')).toBeTruthy();
  });

  it('calculates low risk level when all answered no', () => {
    render(<WitnessProtection />);
    const section = inSection('Risk Assessment');

    const noButtons = section.getAllByText('No');
    noButtons.forEach(btn => fireEvent.click(btn));

    fireEvent.click(section.getByText('Calculate Risk Level'));
    expect(section.getByText('Risk Level: LOW')).toBeTruthy();
  });

  it('navigates to Immediate Steps section', () => {
    render(<WitnessProtection />);
    const section = inSection('Immediate Steps');
    expect(section.getByText("If You're in Immediate Danger")).toBeTruthy();
    expect(section.getByText('First 48 Hours Checklist')).toBeTruthy();
  });

  it('renders immediate danger steps', () => {
    render(<WitnessProtection />);
    const section = inSection('Immediate Steps');
    expect(section.getByText(/Call local emergency services/)).toBeTruthy();
    expect(section.getByText(/Go to a safe location/)).toBeTruthy();
    expect(section.getByText(/Document everything/)).toBeTruthy();
  });

  it('navigates to Relocation section', () => {
    render(<WitnessProtection />);
    const section = inSection('Relocation');
    expect(section.getByText('Relocation Options')).toBeTruthy();
    expect(section.getByText('United Kingdom')).toBeTruthy();
    expect(section.getByText('United States')).toBeTruthy();
    expect(section.getByText('Canada')).toBeTruthy();
  });

  it('shows difficulty ratings for relocation countries', () => {
    render(<WitnessProtection />);
    const section = inSection('Relocation');
    expect(section.getAllByText('Moderate').length).toBeGreaterThan(0);
    expect(section.getByText('Difficult')).toBeTruthy();
    expect(section.getByText('Easy')).toBeTruthy();
  });

  it('navigates to Legal Protection section', () => {
    render(<WitnessProtection />);
    const section = inSection('Legal Protection');
    expect(section.getByText('Legal Protections Available')).toBeTruthy();
    expect(section.getAllByText('Asylum').length).toBeGreaterThan(0);
    expect(section.getByText('Refugee Status')).toBeTruthy();
    expect(section.getByText('Humanitarian Visas')).toBeTruthy();
  });

  it('navigates to Organizations section', () => {
    render(<WitnessProtection />);
    const section = inSection('Organizations');
    expect(section.getByText('Protection Organizations')).toBeTruthy();
    expect(section.getByText('Front Line Defenders')).toBeTruthy();
    expect(section.getByText('Safeguard Defenders')).toBeTruthy();
    expect(section.getByText('Access Now')).toBeTruthy();
  });

  it('shows 8 protection organizations', () => {
    render(<WitnessProtection />);
    const section = inSection('Organizations');
    const websiteLinks = section.getAllByText('Website →');
    expect(websiteLinks.length).toBe(8);
  });

  it('renders footer disclaimer', () => {
    render(<WitnessProtection />);
    expect(screen.getByText(/informational purposes only/)).toBeTruthy();
  });
});
