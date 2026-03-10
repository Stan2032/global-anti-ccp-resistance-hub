import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import MediaBiasGuide from '../components/MediaBiasGuide';

describe('MediaBiasGuide', () => {
  it('renders the title', () => {
    render(<MediaBiasGuide />);
    expect(screen.getByText('Media Bias Guide')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    render(<MediaBiasGuide />);
    expect(screen.getByText(/Evaluate news sources on China/)).toBeTruthy();
  });

  it('renders How to Use This Guide section', () => {
    render(<MediaBiasGuide />);
    expect(screen.getByText('How to Use This Guide')).toBeTruthy();
  });

  it('renders all category filter buttons', () => {
    render(<MediaBiasGuide />);
    expect(screen.getByText('All Sources')).toBeTruthy();
    expect(screen.getByText('Trustworthy')).toBeTruthy();
    expect(screen.getByText('Use with Caution')).toBeTruthy();
    expect(screen.getByText('CCP Propaganda')).toBeTruthy();
    expect(screen.getByText('Problematic')).toBeTruthy();
  });

  it('renders sources by default', () => {
    render(<MediaBiasGuide />);
    expect(screen.getByText('Radio Free Asia (RFA)')).toBeTruthy();
    expect(screen.getByText('Global Times')).toBeTruthy();
    expect(screen.getByText('Xinhua News Agency')).toBeTruthy();
  });

  it('filters to Trustworthy sources', () => {
    render(<MediaBiasGuide />);
    fireEvent.click(screen.getByText('Trustworthy'));
    expect(screen.getByText('Radio Free Asia (RFA)')).toBeTruthy();
    expect(screen.getByText('Hong Kong Free Press (HKFP)')).toBeTruthy();
    expect(screen.queryByText('Global Times')).toBeFalsy();
    expect(screen.queryByText('The Grayzone')).toBeFalsy();
  });

  it('filters to CCP Propaganda sources', () => {
    render(<MediaBiasGuide />);
    fireEvent.click(screen.getByText('CCP Propaganda'));
    expect(screen.getByText('Global Times')).toBeTruthy();
    expect(screen.getByText('CGTN (China Global Television Network)')).toBeTruthy();
    expect(screen.getByText('Xinhua News Agency')).toBeTruthy();
    expect(screen.queryByText('Radio Free Asia (RFA)')).toBeFalsy();
  });

  it('renders the search input', () => {
    render(<MediaBiasGuide />);
    expect(screen.getByLabelText('Search')).toBeTruthy();
  });

  it('filters sources by search term', () => {
    render(<MediaBiasGuide />);
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'Reuters' } });
    expect(screen.getByText('Reuters - China Coverage')).toBeTruthy();
    expect(screen.queryByText('Global Times')).toBeFalsy();
  });

  it('renders credibility scores', () => {
    render(<MediaBiasGuide />);
    expect(screen.getAllByText(/Credibility:/).length).toBeGreaterThan(0);
  });

  it('renders Tips for Evaluating Sources section', () => {
    render(<MediaBiasGuide />);
    expect(screen.getByText('Tips for Evaluating Sources')).toBeTruthy();
    expect(screen.getByText(/Check funding:/)).toBeTruthy();
    expect(screen.getByText(/Cross-reference:/)).toBeTruthy();
  });
});
