import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SanctionedOfficials from '../components/SanctionedOfficials';

describe('SanctionedOfficials', () => {
  it('renders without crashing', () => {
    render(<SanctionedOfficials />);
    expect(screen.getByText('Sanctioned CCP Officials')).toBeTruthy();
  });

  it('renders the description with official count', () => {
    render(<SanctionedOfficials />);
    expect(screen.getByText(/officials and entities tracked for human rights abuses/)).toBeTruthy();
  });

  it('renders category filter buttons', () => {
    render(<SanctionedOfficials />);
    const buttons = screen.getAllByRole('button');
    const buttonTexts = buttons.map(b => b.textContent.replace(/\s+/g, ' ').trim());
    expect(buttonTexts.some(t => t.includes('All Officials'))).toBe(true);
    expect(buttonTexts.some(t => t.includes('Xinjiang'))).toBe(true);
    expect(buttonTexts.some(t => t.includes('Hong Kong'))).toBe(true);
    expect(buttonTexts.some(t => t.includes('Central Govt'))).toBe(true);
    expect(buttonTexts.some(t => t.includes('Tibet'))).toBe(true);
    expect(buttonTexts.some(t => t.includes('Tech/Surveillance'))).toBe(true);
  });

  it('renders officials from JSON data', () => {
    render(<SanctionedOfficials />);
    expect(screen.getByText('Chen Quanguo')).toBeTruthy();
    expect(screen.getByText('陈全国')).toBeTruthy();
  });

  it('renders hardcoded tech entities', () => {
    render(<SanctionedOfficials />);
    expect(screen.getByText('Hikvision Executives')).toBeTruthy();
    expect(screen.getByText('SenseTime Executives')).toBeTruthy();
  });

  it('renders sanction badges', () => {
    render(<SanctionedOfficials />);
    expect(screen.getAllByText('ENTITY LIST').length).toBeGreaterThan(0);
  });

  it('filters officials by category when clicked', () => {
    render(<SanctionedOfficials />);
    fireEvent.click(screen.getByText(/Tech\/Surveillance/));
    expect(screen.getByText('Hikvision Executives')).toBeTruthy();
    expect(screen.getByText('SenseTime Executives')).toBeTruthy();
    expect(screen.queryByText('Chen Quanguo')).toBeNull();
  });

  it('shows all officials when All Officials is clicked after filtering', () => {
    render(<SanctionedOfficials />);
    fireEvent.click(screen.getByText(/Tech\/Surveillance/));
    expect(screen.queryByText('Chen Quanguo')).toBeNull();
    fireEvent.click(screen.getByText(/All Officials/));
    expect(screen.getByText('Chen Quanguo')).toBeTruthy();
  });

  it('filters officials by search query', () => {
    render(<SanctionedOfficials />);
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'Hikvision' } });
    expect(screen.getByText('Hikvision Executives')).toBeTruthy();
    expect(screen.queryByText('Chen Quanguo')).toBeNull();
  });

  it('renders sanctions data sources section', () => {
    render(<SanctionedOfficials />);
    expect(screen.getByText('Sanctions Data Sources')).toBeTruthy();
  });

  it('renders the advocacy call to action', () => {
    render(<SanctionedOfficials />);
    expect(screen.getByText('Advocate for More Sanctions')).toBeTruthy();
    expect(screen.getByText('CECC Sanctions Resources →')).toBeTruthy();
    expect(screen.getByText('US Treasury SDN List →')).toBeTruthy();
  });

  it('renders country sanction framework labels', () => {
    render(<SanctionedOfficials />);
    expect(screen.getByText('US Global Magnitsky Act')).toBeTruthy();
    expect(screen.getByText('UK Magnitsky Sanctions')).toBeTruthy();
    expect(screen.getByText('EU Human Rights Sanctions')).toBeTruthy();
  });
});
