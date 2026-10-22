import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
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

  it('every petition carries its details without a click', () => {
    const { container } = render(<PetitionLinks />);
    expect(container.querySelectorAll('[aria-expanded]')).toHaveLength(0);
    const all = [...container.querySelectorAll('details')];
    expect(all.length).toBe(screen.getAllByText('Sign Now').length);
    all.forEach(d => {
      expect(d.open).toBe(false);
      expect(within(d).getByText('Actions you can take:')).toBeTruthy();
    });
    expect(within(all[0]).getByText(/Demand the release of Hong Kong media tycoon/)).toBeTruthy();
  });

  it('shows action items without a click', () => {
    const { container } = render(<PetitionLinks />);
    const first = within(container.querySelector('details')!);
    expect(first.getByText('Sign petition')).toBeTruthy();
    expect(first.getByText('Write to your MP/Representative')).toBeTruthy();
  });

  it('names each details toggle after its petition, for screen readers', () => {
    const { container } = render(<PetitionLinks />);
    const names = [...container.querySelectorAll('summary')].map(s => s.textContent);
    expect(names.length).toBeGreaterThan(1);
    expect(new Set(names).size).toBe(names.length);
  });

  it('the details of a petition open and close natively', () => {
    const { container } = render(<PetitionLinks />);
    const first = container.querySelector('details')!;
    fireEvent.click(within(first).getByText('Details and actions +'));
    expect(first.open).toBe(true);
    fireEvent.click(within(first).getByText('Hide details −'));
    expect(first.open).toBe(false);
  });

  // --- Links ---

  it('renders Sign Now links with external URLs', () => {
    render(<PetitionLinks />);
    const signLinks = screen.getAllByText('Sign Now');
    expect(signLinks.length).toBeGreaterThanOrEqual(1);
    expect(signLinks[0].closest('a')!.getAttribute('href')).toMatch(/^https:\/\//);
  });

  it('has target="_blank" on external links', () => {
    render(<PetitionLinks />);
    const signLinks = screen.getAllByText('Sign Now');
    expect(signLinks[0].closest('a')!.getAttribute('target')).toBe('_blank');
  });
});
