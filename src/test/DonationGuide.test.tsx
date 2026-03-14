import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DonationGuide from '../components/DonationGuide';

describe('DonationGuide', () => {
  // --- Structure ---

  it('renders the heading', () => {
    render(<DonationGuide />);
    expect(screen.getByText('Donation Guide')).toBeTruthy();
  });

  it('renders stat boxes', () => {
    render(<DonationGuide />);
    expect(screen.getAllByText(/Organizations/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Highly Recommended/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Tax Deductible/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders category filter buttons', () => {
    render(<DonationGuide />);
    expect(screen.getByRole('tab', { name: /All Organizations/ })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Advocacy/ })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Legal Aid/ })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Research/ })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Independent Media/ })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Direct Support/ })).toBeTruthy();
  });

  it('renders cause filter buttons', () => {
    render(<DonationGuide />);
    expect(screen.getByText('All Causes')).toBeTruthy();
    expect(screen.getByText('Uyghur Rights')).toBeTruthy();
    expect(screen.getByText('Hong Kong')).toBeTruthy();
    expect(screen.getByText('Tibet')).toBeTruthy();
  });

  // --- Organization Cards ---

  it('renders organization names', () => {
    render(<DonationGuide />);
    expect(screen.getByText('Uyghur Human Rights Project')).toBeTruthy();
    expect(screen.getByText('Hong Kong Watch')).toBeTruthy();
  });

  it('renders organization acronyms', () => {
    render(<DonationGuide />);
    expect(screen.getByText(/UHRP/)).toBeTruthy();
  });

  it('renders donate buttons with external URLs', () => {
    render(<DonationGuide />);
    const donateLinks = screen.getAllByText('Donate');
    expect(donateLinks.length).toBeGreaterThanOrEqual(1);
    expect(donateLinks[0].closest('a')!.getAttribute('href')).toMatch(/^https:\/\//);
  });

  // --- Category Filtering ---

  it('filters by category when button clicked', () => {
    render(<DonationGuide />);
    fireEvent.click(screen.getByRole('tab', { name: /Legal Aid/ }));
    expect(screen.getAllByText(/Front Line Defenders|Lawyers for Lawyers/).length).toBeGreaterThanOrEqual(1);
  });

  it('returns to all organizations when All clicked', () => {
    render(<DonationGuide />);
    fireEvent.click(screen.getByRole('tab', { name: /Legal Aid/ }));
    fireEvent.click(screen.getByRole('tab', { name: /All Organizations/ }));
    expect(screen.getByText('Uyghur Human Rights Project')).toBeTruthy();
  });

  // --- Cause Filtering ---

  it('filters by cause when button clicked', () => {
    render(<DonationGuide />);
    fireEvent.click(screen.getByText('Uyghur Rights'));
    expect(screen.getByText('Uyghur Human Rights Project')).toBeTruthy();
  });

  // --- Donation Tips ---

  it('renders donation tips section', () => {
    render(<DonationGuide />);
    expect(screen.getByText(/Donation Tips/)).toBeTruthy();
  });

  // --- Disclaimer ---

  it('renders GlobalDisclaimer component', () => {
    render(<DonationGuide />);
    expect(screen.getByText(/Verify organizations independently/i)).toBeTruthy();
  });
});
