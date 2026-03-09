// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DocumentaryList from '../components/DocumentaryList';

describe('DocumentaryList', () => {
  // --- Heading ---

  it('renders the heading', () => {
    render(<DocumentaryList />);
    expect(screen.getByText('Essential Documentaries')).toBeTruthy();
  });

  it('renders the description with documentary count', () => {
    render(<DocumentaryList />);
    expect(screen.getByText(/documentaries covering CCP human rights abuses/)).toBeTruthy();
  });

  // --- Documentary entries ---

  it('renders documentary titles', () => {
    render(<DocumentaryList />);
    expect(screen.getByText('The Dissident')).toBeTruthy();
    expect(screen.getByText('Revolution of Our Times')).toBeTruthy();
    expect(screen.getByText('One Child Nation')).toBeTruthy();
  });

  it('renders director information', () => {
    render(<DocumentaryList />);
    expect(screen.getByText('Dir: Bryan Fogel')).toBeTruthy();
    expect(screen.getByText('Dir: Kiwi Chow')).toBeTruthy();
  });

  it('renders relevance badges', () => {
    render(<DocumentaryList />);
    expect(screen.getAllByText('CRITICAL').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('HIGH').length).toBeGreaterThanOrEqual(1);
  });

  it('renders where to watch platforms', () => {
    render(<DocumentaryList />);
    expect(screen.getAllByText(/Where to Watch/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Amazon Prime').length).toBeGreaterThanOrEqual(1);
  });

  // --- Category filtering ---

  it('renders category filter buttons', () => {
    render(<DocumentaryList />);
    expect(screen.getAllByText(/^All/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Hong Kong/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Uyghur\/Xinjiang/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Tibet/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Tiananmen/).length).toBeGreaterThanOrEqual(1);
  });

  it('filters documentaries by category when a filter button is clicked', () => {
    render(<DocumentaryList />);
    // Click the Hong Kong filter button (contains count in parens)
    const hkBtn = screen.getAllByText(/Hong Kong/).find(el => el.tagName === 'BUTTON' || el.closest('button'));
    fireEvent.click(hkBtn.closest('button') || hkBtn);
    // Hong Kong docs visible
    expect(screen.getByText('Revolution of Our Times')).toBeTruthy();
    expect(screen.getByText('Do Not Split')).toBeTruthy();
    // Non-HK doc should be hidden
    expect(screen.queryByText('The Dissident')).toBeNull();
  });

  it('returns to all documentaries when All is clicked', () => {
    render(<DocumentaryList />);
    const hkBtn = screen.getAllByText(/Hong Kong/).find(el => el.tagName === 'BUTTON' || el.closest('button'));
    fireEvent.click(hkBtn.closest('button') || hkBtn);
    expect(screen.queryByText('The Dissident')).toBeNull();
    const allBtn = screen.getAllByText(/^All/).find(el => el.tagName === 'BUTTON' || el.closest('button'));
    fireEvent.click(allBtn.closest('button') || allBtn);
    expect(screen.getByText('The Dissident')).toBeTruthy();
  });

  it('filters to Uyghur category correctly', () => {
    render(<DocumentaryList />);
    fireEvent.click(screen.getByText(/Uyghur\/Xinjiang/));
    expect(screen.getByText('The Xinjiang Police Files')).toBeTruthy();
    expect(screen.getByText('China Undercover')).toBeTruthy();
    // Non-Uyghur doc hidden
    expect(screen.queryByText('Tank Man')).toBeNull();
  });

  // --- Disclaimer note ---

  it('renders the VPN note', () => {
    render(<DocumentaryList />);
    expect(screen.getByText(/Use a VPN if necessary/)).toBeTruthy();
  });
});
