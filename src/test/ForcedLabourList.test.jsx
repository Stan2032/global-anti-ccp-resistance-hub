import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock GlobalDisclaimer
vi.mock('../components/ui/GlobalDisclaimer', () => ({
  default: ({ type }) => <div data-testid="disclaimer">{type}</div>,
}));

import ForcedLabourList from '../components/ForcedLabourList';

describe('ForcedLabourList', () => {
  it('renders the header with title', () => {
    render(<ForcedLabourList />);
    expect(screen.getByText('Companies Implicated in Forced Labour')).toBeTruthy();
  });

  it('renders category filter buttons', () => {
    render(<ForcedLabourList />);
    expect(screen.getByText('All')).toBeTruthy();
    expect(screen.getByText('Apparel & Fashion')).toBeTruthy();
    expect(screen.getByText('Technology')).toBeTruthy();
    expect(screen.getByText('Automotive')).toBeTruthy();
  });

  it('renders search input', () => {
    render(<ForcedLabourList />);
    expect(screen.getByPlaceholderText('Search companies...')).toBeTruthy();
  });

  it('renders company cards', () => {
    render(<ForcedLabourList />);
    expect(screen.getByText('Nike')).toBeTruthy();
    expect(screen.getByText('Apple')).toBeTruthy();
    expect(screen.getByText('Volkswagen')).toBeTruthy();
  });

  it('renders status badges', () => {
    render(<ForcedLabourList />);
    expect(screen.getAllByText('IMPLICATED').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CRITICAL').length).toBeGreaterThan(0);
  });

  it('filters companies by category', () => {
    render(<ForcedLabourList />);
    fireEvent.click(screen.getByText('Technology'));
    expect(screen.getByText('Apple')).toBeTruthy();
    expect(screen.getByText('Huawei')).toBeTruthy();
    expect(screen.queryByText('Nike')).toBeFalsy();
    expect(screen.queryByText('Volkswagen')).toBeFalsy();
  });

  it('filters companies by search query', () => {
    render(<ForcedLabourList />);
    const searchInput = screen.getByPlaceholderText('Search companies...');
    fireEvent.change(searchInput, { target: { value: 'Nike' } });
    expect(screen.getByText('Nike')).toBeTruthy();
    expect(screen.queryByText('Apple')).toBeFalsy();
  });

  it('shows no results for non-matching search', () => {
    render(<ForcedLabourList />);
    const searchInput = screen.getByPlaceholderText('Search companies...');
    fireEvent.change(searchInput, { target: { value: 'zzzznonexistent' } });
    expect(screen.getByText('No companies found matching your search.')).toBeTruthy();
  });

  it('toggles ethical alternatives', () => {
    render(<ForcedLabourList />);
    // Click to show alternatives for Nike
    const altButtons = screen.getAllByText(/Ethical Alternatives/);
    fireEvent.click(altButtons[0]);
    // Should show alternatives
    expect(screen.getByText(/New Balance/)).toBeTruthy();
  });

  it('hides alternatives when toggled off', () => {
    render(<ForcedLabourList />);
    const altButtons = screen.getAllByText(/Ethical Alternatives/);
    fireEvent.click(altButtons[0]);
    expect(screen.getByText(/New Balance/)).toBeTruthy();

    // Click again to hide
    const hideButton = screen.getAllByText(/Hide/)[0];
    fireEvent.click(hideButton);
    expect(screen.queryByText(/New Balance \(USA-made 990 series\)/)).toBeFalsy();
  });

  it('renders data sources section', () => {
    render(<ForcedLabourList />);
    expect(screen.getByText('Data Sources:')).toBeTruthy();
  });

  it('renders disclaimer section', () => {
    render(<ForcedLabourList />);
    expect(screen.getByText('Important Disclaimer')).toBeTruthy();
  });
});
