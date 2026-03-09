// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ResearchPapers from '../components/ResearchPapers';

describe('ResearchPapers', () => {
  // --- Heading ---

  it('renders the heading', () => {
    render(<ResearchPapers />);
    expect(screen.getByText('Research Papers & Reports')).toBeTruthy();
  });

  it('renders the subheading', () => {
    render(<ResearchPapers />);
    expect(screen.getByText('Academic research, investigative reports, and legal analyses')).toBeTruthy();
  });

  // --- Statistics ---

  it('renders paper count and statistics', () => {
    render(<ResearchPapers />);
    expect(screen.getByText('15')).toBeTruthy();
    expect(screen.getByText('Papers')).toBeTruthy();
    expect(screen.getByText('Total Citations')).toBeTruthy();
    expect(screen.getByText('Total Pages')).toBeTruthy();
    expect(screen.getByText('Organizations')).toBeTruthy();
  });

  // --- Papers list ---

  it('renders paper titles', () => {
    render(<ResearchPapers />);
    expect(screen.getAllByText(/Uyghur Genocide: An Examination/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Uyghurs for Sale/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/110 Overseas/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders essential reading section', () => {
    render(<ResearchPapers />);
    expect(screen.getByText('Essential Reading')).toBeTruthy();
  });

  // --- Category filtering ---

  it('renders category filter buttons', () => {
    render(<ResearchPapers />);
    expect(screen.getByText(/All Papers/)).toBeTruthy();
    expect(screen.getAllByText(/Uyghur Genocide/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Transnational Repression/).length).toBeGreaterThanOrEqual(1);
  });

  it('filters papers by category', () => {
    render(<ResearchPapers />);
    // Use getByRole to target the filter button specifically
    const hkButton = screen.getAllByText(/Hong Kong/)[0];
    fireEvent.click(hkButton);
    expect(screen.getAllByText(/National Security Law/).length).toBeGreaterThanOrEqual(1);
    // Uyghur paper should not appear
    expect(screen.queryByText(/Uyghurs for Sale/)).toBeNull();
  });

  it('hides essential reading section when a category is selected', () => {
    render(<ResearchPapers />);
    const genocideButton = screen.getAllByText(/Uyghur Genocide/)[0];
    fireEvent.click(genocideButton);
    expect(screen.queryByText('Essential Reading')).toBeNull();
  });

  // --- Search ---

  it('filters papers by search query', () => {
    render(<ResearchPapers />);
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'organ harvesting' } });
    expect(screen.getByText(/Involuntary Organ Harvesting/)).toBeTruthy();
    // Unrelated paper should disappear
    expect(screen.queryByText(/110 Overseas/)).toBeNull();
  });

  it('shows no results message when search has no matches', () => {
    render(<ResearchPapers />);
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'zzzznonexistent' } });
    expect(screen.getByText('No papers found matching your criteria')).toBeTruthy();
  });

  // --- Usage guide ---

  it('renders the how-to-use section', () => {
    render(<ResearchPapers />);
    expect(screen.getByText('How to Use These Resources')).toBeTruthy();
    expect(screen.getByText('For Advocacy:')).toBeTruthy();
    expect(screen.getByText('For Research:')).toBeTruthy();
  });

  // --- Read Paper links ---

  it('renders read-paper links for papers', () => {
    render(<ResearchPapers />);
    const readLinks = screen.getAllByText(/Read Paper/);
    expect(readLinks.length).toBeGreaterThanOrEqual(1);
  });
});
