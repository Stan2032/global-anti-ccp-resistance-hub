import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import XinjiangStatus from '../components/XinjiangStatus';
import { expectDisclosureSections, inSection } from './helpers/disclosure';

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
    expect(screen.getAllByText('16,000+').length).toBeGreaterThan(0);
    expect(screen.getByText('Mosques destroyed')).toBeTruthy();
    expect(screen.getByText('570,000+')).toBeTruthy();
    expect(screen.getByText('Forced labor victims')).toBeTruthy();
  });

  // --- Sections ---

  it('renders all 4 sections as native disclosures', () => {
    render(<XinjiangStatus />);
    expectDisclosureSections(['Overview', 'Detention Camps', 'Forced Labor', 'Cultural Genocide']);
  });

  it('shows the Overview section (international response)', () => {
    render(<XinjiangStatus />);
    const section = inSection('Overview');
    expect(section.getByText('International Response')).toBeTruthy();
    expect(section.getByText('🇺🇸 USA')).toBeTruthy();
    expect(section.getByText('Genocide declaration, UFLPA, sanctions')).toBeTruthy();
    expect(section.getByText('🇺🇳 UN')).toBeTruthy();
  });

  // --- Detention Camps ---

  it('shows the Detention Camps section without interaction', () => {
    render(<XinjiangStatus />);
    const section = inSection('Detention Camps');
    expect(section.getByText('Major Detention Facilities')).toBeTruthy();
    expect(section.getByText('Dabancheng')).toBeTruthy();
    expect(section.getByText('Kashgar')).toBeTruthy();
    expect(section.getByText('Hotan')).toBeTruthy();
    expect(section.getByText('Aksu')).toBeTruthy();
  });

  it('shows ASPI satellite imagery link', () => {
    render(<XinjiangStatus />);
    const section = inSection('Detention Camps');
    const aspiLink = section.getByText('ASPI Xinjiang Data Project').closest('a');
    expect(aspiLink!.getAttribute('href')).toBe('https://xjdp.aspi.org.au/');
    expect(aspiLink!.getAttribute('target')).toBe('_blank');
  });

  // --- Forced Labor ---

  it('shows the Forced Labor section without interaction', () => {
    render(<XinjiangStatus />);
    const section = inSection('Forced Labor');
    expect(section.getByText('Forced Labor by Sector')).toBeTruthy();
    expect(section.getByText('Cotton')).toBeTruthy();
    expect(section.getByText('85%')).toBeTruthy();
    expect(section.getByText('Polysilicon')).toBeTruthy();
    expect(section.getByText('35%')).toBeTruthy();
  });

  it('shows UFLPA legislation info', () => {
    render(<XinjiangStatus />);
    const section = inSection('Forced Labor');
    expect(section.getByText('Key Legislation')).toBeTruthy();
    expect(section.getAllByText(/UFLPA/).length).toBeGreaterThan(0);
  });

  // --- Cultural Genocide ---

  it('shows the Cultural Genocide section without interaction', () => {
    render(<XinjiangStatus />);
    const section = inSection('Cultural Genocide');
    expect(section.getByText('Cultural Destruction')).toBeTruthy();
    expect(section.getByText('Mosques')).toBeTruthy();
    expect(section.getByText('Cemeteries')).toBeTruthy();
    expect(section.getByText('100+')).toBeTruthy();
  });

  it('shows additional measures list', () => {
    render(<XinjiangStatus />);
    const section = inSection('Cultural Genocide');
    expect(section.getByText('Additional Measures')).toBeTruthy();
    expect(section.getByText(/Forced sterilization/)).toBeTruthy();
    expect(section.getByText(/Biometric data collection/)).toBeTruthy();
  });

  // --- Sections stay mounted ---

  it('opening one section hides nothing in the others', () => {
    render(<XinjiangStatus />);
    fireEvent.click(screen.getByText('Forced Labor'));
    expect(inSection('Overview').getByText('International Response')).toBeTruthy();
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
    expect(uhrpLink!.getAttribute('target')).toBe('_blank');
    expect(uhrpLink!.getAttribute('rel')).toContain('noopener');
    expect(uhrpLink!.getAttribute('href')).toBe('https://uhrp.org/');
  });
});
