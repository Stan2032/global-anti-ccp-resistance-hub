// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PetitionLinks from '../components/PetitionLinks';

describe('PetitionLinks', () => {
  // --- Structure ---

  it('renders the heading', () => {
    render(<PetitionLinks />);
    expect(screen.getByText('Active Petitions')).toBeTruthy();
  });

  it('renders campaign count', () => {
    render(<PetitionLinks />);
    expect(screen.getByText(/campaigns/i)).toBeTruthy();
  });

  it('renders petition titles', () => {
    render(<PetitionLinks />);
    expect(screen.getByText('Free Jimmy Lai')).toBeTruthy();
    expect(screen.getByText('End Uyghur Forced Labor')).toBeTruthy();
    expect(screen.getByText('Sanction CCP Officials')).toBeTruthy();
    expect(screen.getByText('Free Tibet')).toBeTruthy();
  });

  it('renders organization names', () => {
    render(<PetitionLinks />);
    expect(screen.getByText(/Committee for Freedom in Hong Kong/)).toBeTruthy();
    expect(screen.getByText(/Hong Kong Watch/)).toBeTruthy();
  });

  it('renders urgency badges', () => {
    render(<PetitionLinks />);
    expect(screen.getAllByText('CRITICAL').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('HIGH').length).toBeGreaterThanOrEqual(1);
  });

  it('renders signature counts', () => {
    render(<PetitionLinks />);
    expect(screen.getByText(/150,000\+/)).toBeTruthy();
    expect(screen.getByText(/500,000\+/)).toBeTruthy();
  });

  // --- Expand/Collapse ---

  it('expands petition details on click', () => {
    render(<PetitionLinks />);
    const expandButtons = screen.getAllByText('+');
    fireEvent.click(expandButtons[0]);
    expect(screen.getByText(/Demand the release of Hong Kong media tycoon/)).toBeTruthy();
  });

  it('shows action items when expanded', () => {
    render(<PetitionLinks />);
    const expandButtons = screen.getAllByText('+');
    fireEvent.click(expandButtons[0]);
    expect(screen.getByText('Sign petition')).toBeTruthy();
    expect(screen.getByText('Write to your MP/Representative')).toBeTruthy();
  });

  it('collapses when clicking minus button', () => {
    render(<PetitionLinks />);
    const expandButtons = screen.getAllByText('+');
    fireEvent.click(expandButtons[0]);
    expect(screen.getByText('−')).toBeTruthy();
    fireEvent.click(screen.getByText('−'));
    expect(screen.queryByText(/Demand the release of Hong Kong media tycoon/)).toBeNull();
  });

  // --- Links ---

  it('renders Sign Now links with external URLs', () => {
    render(<PetitionLinks />);
    const signLinks = screen.getAllByText('Sign Now');
    expect(signLinks.length).toBeGreaterThanOrEqual(1);
    expect(signLinks[0].closest('a').getAttribute('href')).toMatch(/^https:\/\//);
  });

  it('has target="_blank" on external links', () => {
    render(<PetitionLinks />);
    const signLinks = screen.getAllByText('Sign Now');
    expect(signLinks[0].closest('a').getAttribute('target')).toBe('_blank');
  });
});
