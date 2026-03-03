import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import LegalResourcesHub from '../components/LegalResourcesHub';

describe('LegalResourcesHub', () => {
  it('renders the title', () => {
    render(<LegalResourcesHub />);
    expect(screen.getByText('Legal Resources Hub')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    render(<LegalResourcesHub />);
    expect(screen.getByText('Country-specific legal information for asylum, immigration, and protection')).toBeTruthy();
  });

  it('renders search input', () => {
    render(<LegalResourcesHub />);
    const searchInput = screen.getByLabelText('Search');
    expect(searchInput).toBeTruthy();
  });

  it('renders country filter buttons', () => {
    render(<LegalResourcesHub />);
    expect(screen.getByText('All Countries')).toBeTruthy();
    expect(screen.getAllByText('United States').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Canada').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('United Kingdom').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Australia').length).toBeGreaterThanOrEqual(1);
  });

  it('renders topic filter buttons', () => {
    render(<LegalResourcesHub />);
    expect(screen.getByText('All Topics')).toBeTruthy();
    expect(screen.getAllByText('Asylum').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Immigration').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Transnational Repression').length).toBeGreaterThanOrEqual(1);
  });

  it('renders resource titles by default', () => {
    render(<LegalResourcesHub />);
    expect(screen.getByText('Asylum Application Guide for Chinese Dissidents')).toBeTruthy();
    expect(screen.getByText('BN(O) Visa Route for Hong Kongers')).toBeTruthy();
  });

  it('filters resources by country when country button is clicked', () => {
    render(<LegalResourcesHub />);
    const ukButtons = screen.getAllByText('United Kingdom');
    fireEvent.click(ukButtons[0]);
    expect(screen.getByText('BN(O) Visa Route for Hong Kongers')).toBeTruthy();
    expect(screen.queryByText('Asylum Application Guide for Chinese Dissidents')).toBeFalsy();
  });

  it('renders emergency contacts section', () => {
    render(<LegalResourcesHub />);
    const emergencyHeadings = screen.getAllByText('Emergency Contacts');
    expect(emergencyHeadings.length).toBeGreaterThan(0);
  });

  it('renders the legal disclaimer', () => {
    render(<LegalResourcesHub />);
    expect(screen.getByText('Important Legal Disclaimer')).toBeTruthy();
    expect(screen.getByText(/does not constitute legal advice/)).toBeTruthy();
  });

  it('renders general legal advice section', () => {
    render(<LegalResourcesHub />);
    expect(screen.getByText('General Legal Advice')).toBeTruthy();
    expect(screen.getByText(/Document everything/)).toBeTruthy();
  });
});
