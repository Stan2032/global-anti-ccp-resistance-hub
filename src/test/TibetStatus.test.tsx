import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TibetStatus from '../components/TibetStatus';
import { expectDisclosureSections, inSection } from './helpers/disclosure';

describe('TibetStatus', () => {
  // --- Header ---

  it('renders the header with title', () => {
    render(<TibetStatus />);
    expect(screen.getByText('Tibet Status')).toBeTruthy();
    expect(screen.getByText('75 years of occupation and resistance')).toBeTruthy();
  });

  it('shows the status banner', () => {
    render(<TibetStatus />);
    expect(screen.getByText('OCCUPIED TERRITORY')).toBeTruthy();
    expect(screen.getByText(/Tibet has been under Chinese occupation since 1950/)).toBeTruthy();
  });

  // --- Key Statistics ---

  it('renders all 4 key statistics', () => {
    render(<TibetStatus />);
    expect(screen.getByText('75')).toBeTruthy();
    expect(screen.getByText('Years occupied')).toBeTruthy();
    expect(screen.getByText('157+')).toBeTruthy();
    expect(screen.getByText('Self-immolations')).toBeTruthy();
    expect(screen.getByText('1,000+')).toBeTruthy();
    expect(screen.getByText('Political prisoners')).toBeTruthy();
    expect(screen.getByText('6,000+')).toBeTruthy();
    expect(screen.getByText('Monasteries destroyed')).toBeTruthy();
  });

  // --- Sections ---

  it('renders all 4 sections as native disclosures', () => {
    render(<TibetStatus />);
    expectDisclosureSections(['Overview', 'Repression', 'Self-Immolations', 'Cultural Erasure']);
  });

  it('shows the Overview section (timeline)', () => {
    render(<TibetStatus />);
    const section = inSection('Overview');
    expect(section.getByText('Timeline of Occupation')).toBeTruthy();
    expect(section.getByText('1950')).toBeTruthy();
    expect(section.getByText('PLA invasion of Tibet begins')).toBeTruthy();
    expect(section.getByText('1959')).toBeTruthy();
  });

  // --- Repression ---

  it('shows the Repression section without interaction', () => {
    render(<TibetStatus />);
    const section = inSection('Repression');
    expect(section.getByText('Notable Political Prisoners')).toBeTruthy();
    expect(section.getByText('Gedhun Choekyi Nyima')).toBeTruthy();
    expect(section.getByText('DISAPPEARED')).toBeTruthy();
    expect(section.getByText('Rinchen Tsultrim')).toBeTruthy();
  });

  it('shows The Missing Panchen Lama section', () => {
    render(<TibetStatus />);
    const section = inSection('Repression');
    expect(section.getByText('The Missing Panchen Lama')).toBeTruthy();
    expect(section.getByText(/recognized as the 11th Panchen Lama/)).toBeTruthy();
  });

  // --- Self-Immolation ---

  it('shows the Self-Immolations section without interaction', () => {
    render(<TibetStatus />);
    const section = inSection('Self-Immolations');
    expect(section.getByText('Self-Immolation Protests')).toBeTruthy();
    expect(section.getByText('157')).toBeTruthy(); // total
    expect(section.getByText('Total cases')).toBeTruthy();
    expect(section.getByText('136')).toBeTruthy(); // deaths
    expect(section.getByText('Deaths')).toBeTruthy();
  });

  it('shows self-immolation by-year data', () => {
    render(<TibetStatus />);
    const section = inSection('Self-Immolations');
    expect(section.getByText('By Year')).toBeTruthy();
    // Check the peak year
    expect(section.getByText('2012:')).toBeTruthy();
    expect(section.getByText('85')).toBeTruthy();
  });

  // --- Cultural Erasure ---

  it('shows the Cultural Erasure section without interaction', () => {
    render(<TibetStatus />);
    const section = inSection('Cultural Erasure');
    expect(section.getAllByText('Cultural Erasure').length).toBeGreaterThan(0);
    expect(section.getByText('Monasteries')).toBeTruthy();
    expect(section.getByText('6,000+ destroyed')).toBeTruthy();
    expect(section.getByText('Language')).toBeTruthy();
    expect(section.getByText('Marginalized')).toBeTruthy();
  });

  it('shows boarding school warning', () => {
    render(<TibetStatus />);
    const section = inSection('Cultural Erasure');
    expect(section.getByText('Colonial Boarding Schools')).toBeTruthy();
    expect(section.getByText(/1 million Tibetan children/)).toBeTruthy();
  });

  // --- Sections stay mounted ---

  it('opening one section hides nothing in the others', () => {
    render(<TibetStatus />);
    fireEvent.click(screen.getByText('Repression'));
    expect(inSection('Overview').getByText('Timeline of Occupation')).toBeTruthy();
    expect(inSection('Repression').getByText('Gedhun Choekyi Nyima')).toBeTruthy();
  });

  // --- Resources ---

  it('renders resource links', () => {
    render(<TibetStatus />);
    expect(screen.getByText('ICT')).toBeTruthy();
    expect(screen.getByText('Free Tibet')).toBeTruthy();
    expect(screen.getByText('CTA')).toBeTruthy();
  });

  it('resource links open in new tab', () => {
    render(<TibetStatus />);
    const ictLink = screen.getByText('ICT').closest('a');
    expect(ictLink!.getAttribute('target')).toBe('_blank');
    expect(ictLink!.getAttribute('rel')).toContain('noopener');
    expect(ictLink!.getAttribute('href')).toBe('https://savetibet.org/');
  });
});
