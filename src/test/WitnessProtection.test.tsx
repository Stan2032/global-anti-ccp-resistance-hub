import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import WitnessProtection from '../components/WitnessProtection';

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
    expect(screen.getByText('Relocation')).toBeTruthy();
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
    fireEvent.click(screen.getByText('Risk Assessment'));
    expect(screen.getByText('Personal Risk Assessment')).toBeTruthy();
    expect(screen.getByText('Have you publicly criticized the CCP or spoken about human rights abuses?')).toBeTruthy();
  });

  it('shows all 8 risk assessment questions', () => {
    render(<WitnessProtection />);
    fireEvent.click(screen.getByText('Risk Assessment'));
    expect(screen.getByText(/publicly criticized the CCP/)).toBeTruthy();
    expect(screen.getByText(/family members still in China/)).toBeTruthy();
    expect(screen.getByText(/received threats/)).toBeTruthy();
    expect(screen.getByText(/journalist, activist/)).toBeTruthy();
    expect(screen.getByText(/approached by unknown individuals/)).toBeTruthy();
    expect(screen.getByText(/under surveillance/)).toBeTruthy();
    expect(screen.getByText(/testified or provided evidence/)).toBeTruthy();
    expect(screen.getByText(/former CCP official/)).toBeTruthy();
  });

  it('shows Calculate button only after answering all questions', () => {
    render(<WitnessProtection />);
    fireEvent.click(screen.getByText('Risk Assessment'));
    // Button should not be visible before answering all questions
    expect(screen.queryByText('Calculate Risk Level')).toBeFalsy();
  });

  it('calculates critical risk level when high-weight questions answered yes', () => {
    render(<WitnessProtection />);
    fireEvent.click(screen.getByText('Risk Assessment'));

    // Answer all questions - click "Yes" for high-weight, "No" for low-weight
    const yesButtons = screen.getAllByText('Yes');

    // Answer all yes (should give critical)
    yesButtons.forEach(btn => fireEvent.click(btn));

    // Now calculate button should appear
    fireEvent.click(screen.getByText('Calculate Risk Level'));
    expect(screen.getByText('Risk Level: CRITICAL')).toBeTruthy();
  });

  it('calculates low risk level when all answered no', () => {
    render(<WitnessProtection />);
    fireEvent.click(screen.getByText('Risk Assessment'));

    const noButtons = screen.getAllByText('No');
    noButtons.forEach(btn => fireEvent.click(btn));

    fireEvent.click(screen.getByText('Calculate Risk Level'));
    expect(screen.getByText('Risk Level: LOW')).toBeTruthy();
  });

  it('navigates to Immediate Steps section', () => {
    render(<WitnessProtection />);
    fireEvent.click(screen.getByText('Immediate Steps'));
    expect(screen.getByText("If You're in Immediate Danger")).toBeTruthy();
    expect(screen.getByText('First 48 Hours Checklist')).toBeTruthy();
  });

  it('renders immediate danger steps', () => {
    render(<WitnessProtection />);
    fireEvent.click(screen.getByText('Immediate Steps'));
    expect(screen.getByText(/Call local emergency services/)).toBeTruthy();
    expect(screen.getByText(/Go to a safe location/)).toBeTruthy();
    expect(screen.getByText(/Document everything/)).toBeTruthy();
  });

  it('navigates to Relocation section', () => {
    render(<WitnessProtection />);
    fireEvent.click(screen.getByText('Relocation'));
    expect(screen.getByText('Relocation Options')).toBeTruthy();
    expect(screen.getByText('United Kingdom')).toBeTruthy();
    expect(screen.getByText('United States')).toBeTruthy();
    expect(screen.getByText('Canada')).toBeTruthy();
  });

  it('shows difficulty ratings for relocation countries', () => {
    render(<WitnessProtection />);
    fireEvent.click(screen.getByText('Relocation'));
    expect(screen.getAllByText('Moderate').length).toBeGreaterThan(0);
    expect(screen.getByText('Difficult')).toBeTruthy();
    expect(screen.getByText('Easy')).toBeTruthy();
  });

  it('navigates to Legal Protection section', () => {
    render(<WitnessProtection />);
    fireEvent.click(screen.getByText('Legal Protection'));
    expect(screen.getByText('Legal Protections Available')).toBeTruthy();
    expect(screen.getByText('Asylum')).toBeTruthy();
    expect(screen.getByText('Refugee Status')).toBeTruthy();
    expect(screen.getByText('Humanitarian Visas')).toBeTruthy();
  });

  it('navigates to Organizations section', () => {
    render(<WitnessProtection />);
    fireEvent.click(screen.getByText('Organizations'));
    expect(screen.getByText('Protection Organizations')).toBeTruthy();
    expect(screen.getByText('Front Line Defenders')).toBeTruthy();
    expect(screen.getByText('Safeguard Defenders')).toBeTruthy();
    expect(screen.getByText('Access Now')).toBeTruthy();
  });

  it('shows 8 protection organizations', () => {
    render(<WitnessProtection />);
    fireEvent.click(screen.getByText('Organizations'));
    const websiteLinks = screen.getAllByText('Website →');
    expect(websiteLinks.length).toBe(8);
  });

  it('renders footer disclaimer', () => {
    render(<WitnessProtection />);
    expect(screen.getByText(/informational purposes only/)).toBeTruthy();
  });
});
