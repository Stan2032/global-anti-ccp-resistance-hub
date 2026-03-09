// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TibetStatus from '../components/TibetStatus';

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

  // --- Tab Navigation ---

  it('renders all 4 tab buttons', () => {
    render(<TibetStatus />);
    expect(screen.getByText('Overview')).toBeTruthy();
    expect(screen.getByText('Repression')).toBeTruthy();
    expect(screen.getByText('Self-Immolations')).toBeTruthy();
    expect(screen.getByText('Cultural Erasure')).toBeTruthy();
  });

  it('shows Overview tab content by default (timeline)', () => {
    render(<TibetStatus />);
    expect(screen.getByText('Timeline of Occupation')).toBeTruthy();
    expect(screen.getByText('1950')).toBeTruthy();
    expect(screen.getByText('PLA invasion of Tibet begins')).toBeTruthy();
    expect(screen.getByText('1959')).toBeTruthy();
  });

  // --- Repression Tab ---

  it('switches to Repression tab', () => {
    render(<TibetStatus />);
    fireEvent.click(screen.getByText('Repression'));
    expect(screen.getByText('Notable Political Prisoners')).toBeTruthy();
    expect(screen.getByText('Gedhun Choekyi Nyima')).toBeTruthy();
    expect(screen.getByText('DISAPPEARED')).toBeTruthy();
    expect(screen.getByText('Rinchen Tsultrim')).toBeTruthy();
  });

  it('shows The Missing Panchen Lama section', () => {
    render(<TibetStatus />);
    fireEvent.click(screen.getByText('Repression'));
    expect(screen.getByText('The Missing Panchen Lama')).toBeTruthy();
    expect(screen.getByText(/recognized as the 11th Panchen Lama/)).toBeTruthy();
  });

  // --- Self-Immolation Tab ---

  it('switches to Self-Immolations tab', () => {
    render(<TibetStatus />);
    fireEvent.click(screen.getByText('Self-Immolations'));
    expect(screen.getByText('Self-Immolation Protests')).toBeTruthy();
    expect(screen.getByText('157')).toBeTruthy(); // total
    expect(screen.getByText('Total cases')).toBeTruthy();
    expect(screen.getByText('136')).toBeTruthy(); // deaths
    expect(screen.getByText('Deaths')).toBeTruthy();
  });

  it('shows self-immolation by-year data', () => {
    render(<TibetStatus />);
    fireEvent.click(screen.getByText('Self-Immolations'));
    expect(screen.getByText('By Year')).toBeTruthy();
    // Check the peak year
    expect(screen.getByText('2012:')).toBeTruthy();
    expect(screen.getByText('85')).toBeTruthy();
  });

  // --- Cultural Erasure Tab ---

  it('switches to Cultural Erasure tab', () => {
    render(<TibetStatus />);
    fireEvent.click(screen.getByText('Cultural Erasure'));
    expect(screen.getAllByText('Cultural Erasure').length).toBeGreaterThan(0);
    expect(screen.getByText('Monasteries')).toBeTruthy();
    expect(screen.getByText('6,000+ destroyed')).toBeTruthy();
    expect(screen.getByText('Language')).toBeTruthy();
    expect(screen.getByText('Marginalized')).toBeTruthy();
  });

  it('shows boarding school warning', () => {
    render(<TibetStatus />);
    fireEvent.click(screen.getByText('Cultural Erasure'));
    expect(screen.getByText('Colonial Boarding Schools')).toBeTruthy();
    expect(screen.getByText(/1 million Tibetan children/)).toBeTruthy();
  });

  // --- Tab Isolation ---

  it('hides overview content when switching tabs', () => {
    render(<TibetStatus />);
    expect(screen.getByText('Timeline of Occupation')).toBeTruthy();
    fireEvent.click(screen.getByText('Repression'));
    expect(screen.queryByText('Timeline of Occupation')).toBeFalsy();
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
    expect(ictLink.getAttribute('target')).toBe('_blank');
    expect(ictLink.getAttribute('rel')).toContain('noopener');
    expect(ictLink.getAttribute('href')).toBe('https://savetibet.org/');
  });
});
