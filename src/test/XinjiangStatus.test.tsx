// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import XinjiangStatus from '../components/XinjiangStatus';

describe('XinjiangStatus', () => {
  // --- Header ---

  it('renders the header with title', () => {
    render(<XinjiangStatus />);
    expect(screen.getByText('Xinjiang / East Turkistan Status')).toBeTruthy();
    expect(screen.getByText('Tracking the Uyghur genocide and mass detention')).toBeTruthy();
  });

  it('shows the genocide banner', () => {
    render(<XinjiangStatus />);
    expect(screen.getByText('GENOCIDE IN PROGRESS')).toBeTruthy();
    expect(screen.getByText(/may constitute crimes against humanity/)).toBeTruthy();
  });

  // --- Key Statistics ---

  it('renders all 4 key statistics', () => {
    render(<XinjiangStatus />);
    expect(screen.getByText('1-3M')).toBeTruthy();
    expect(screen.getByText('Detained (est.)')).toBeTruthy();
    expect(screen.getByText('380+')).toBeTruthy();
    expect(screen.getByText('Camps identified')).toBeTruthy();
    expect(screen.getByText('16,000+')).toBeTruthy();
    expect(screen.getByText('Mosques destroyed')).toBeTruthy();
    expect(screen.getByText('570,000+')).toBeTruthy();
    expect(screen.getByText('Forced labor victims')).toBeTruthy();
  });

  // --- Tab Navigation ---

  it('renders all 4 tab buttons', () => {
    render(<XinjiangStatus />);
    expect(screen.getByText('Overview')).toBeTruthy();
    expect(screen.getByText('Detention Camps')).toBeTruthy();
    expect(screen.getByText('Forced Labor')).toBeTruthy();
    expect(screen.getByText('Cultural Genocide')).toBeTruthy();
  });

  it('shows Overview tab content by default (international response)', () => {
    render(<XinjiangStatus />);
    expect(screen.getByText('International Response')).toBeTruthy();
    expect(screen.getByText('🇺🇸 USA')).toBeTruthy();
    expect(screen.getByText('Genocide declaration, UFLPA, sanctions')).toBeTruthy();
    expect(screen.getByText('🇺🇳 UN')).toBeTruthy();
  });

  // --- Detention Camps Tab ---

  it('switches to Detention Camps tab', () => {
    render(<XinjiangStatus />);
    fireEvent.click(screen.getByText('Detention Camps'));
    expect(screen.getByText('Major Detention Facilities')).toBeTruthy();
    expect(screen.getByText('Dabancheng')).toBeTruthy();
    expect(screen.getByText('Kashgar')).toBeTruthy();
    expect(screen.getByText('Hotan')).toBeTruthy();
    expect(screen.getByText('Aksu')).toBeTruthy();
  });

  it('shows ASPI satellite imagery link', () => {
    render(<XinjiangStatus />);
    fireEvent.click(screen.getByText('Detention Camps'));
    const aspiLink = screen.getByText('ASPI Xinjiang Data Project').closest('a');
    expect(aspiLink.getAttribute('href')).toBe('https://xjdp.aspi.org.au/');
    expect(aspiLink.getAttribute('target')).toBe('_blank');
  });

  // --- Forced Labor Tab ---

  it('switches to Forced Labor tab', () => {
    render(<XinjiangStatus />);
    fireEvent.click(screen.getByText('Forced Labor'));
    expect(screen.getByText('Forced Labor by Sector')).toBeTruthy();
    expect(screen.getByText('Cotton')).toBeTruthy();
    expect(screen.getByText('85%')).toBeTruthy();
    expect(screen.getByText('Polysilicon')).toBeTruthy();
    expect(screen.getByText('35%')).toBeTruthy();
  });

  it('shows UFLPA legislation info', () => {
    render(<XinjiangStatus />);
    fireEvent.click(screen.getByText('Forced Labor'));
    expect(screen.getByText('Key Legislation')).toBeTruthy();
    expect(screen.getByText(/UFLPA/)).toBeTruthy();
  });

  // --- Cultural Genocide Tab ---

  it('switches to Cultural Genocide tab', () => {
    render(<XinjiangStatus />);
    fireEvent.click(screen.getByText('Cultural Genocide'));
    expect(screen.getByText('Cultural Destruction')).toBeTruthy();
    expect(screen.getByText('Mosques')).toBeTruthy();
    expect(screen.getByText('Cemeteries')).toBeTruthy();
    expect(screen.getByText('100+')).toBeTruthy();
  });

  it('shows additional measures list', () => {
    render(<XinjiangStatus />);
    fireEvent.click(screen.getByText('Cultural Genocide'));
    expect(screen.getByText('Additional Measures')).toBeTruthy();
    expect(screen.getByText(/Forced sterilization/)).toBeTruthy();
    expect(screen.getByText(/Biometric data collection/)).toBeTruthy();
  });

  // --- Tab Isolation ---

  it('hides overview content when switching tabs', () => {
    render(<XinjiangStatus />);
    expect(screen.getByText('International Response')).toBeTruthy();
    fireEvent.click(screen.getByText('Forced Labor'));
    expect(screen.queryByText('International Response')).toBeFalsy();
  });

  // --- Resources ---

  it('renders resource links', () => {
    render(<XinjiangStatus />);
    expect(screen.getByText('ASPI Xinjiang Data')).toBeTruthy();
    expect(screen.getByText('Xinjiang Victims Database')).toBeTruthy();
    expect(screen.getByText('UHRP')).toBeTruthy();
  });

  it('resource links open in new tab', () => {
    render(<XinjiangStatus />);
    const uhrpLink = screen.getByText('UHRP').closest('a');
    expect(uhrpLink.getAttribute('target')).toBe('_blank');
    expect(uhrpLink.getAttribute('rel')).toContain('noopener');
    expect(uhrpLink.getAttribute('href')).toBe('https://uhrp.org/');
  });
});
