import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import WorldThreatMap from '../components/WorldThreatMap';

describe('WorldThreatMap', () => {
  it('renders the heading', () => {
    render(<WorldThreatMap />);
    expect(screen.getByText('Global CCP Threat Map')).toBeTruthy();
  });

  it('renders region cards', () => {
    render(<WorldThreatMap />);
    expect(screen.getByText('Europe')).toBeTruthy();
    expect(screen.getByText('North America')).toBeTruthy();
  });

  it('shows total police stations per region', () => {
    render(<WorldThreatMap />);
    // Europe has 54 stations
    expect(screen.getByText(/54/)).toBeTruthy();
  });

  it('shows risk level when a region is selected', () => {
    render(<WorldThreatMap />);
    const europeButton = screen.getByText('Europe');
    fireEvent.click(europeButton.closest('button') || europeButton);
    // Risk level shown as "CRITICAL RISK"
    expect(screen.getByText('CRITICAL RISK')).toBeTruthy();
  });

  it('expands a region to show countries', () => {
    render(<WorldThreatMap />);
    const europeButton = screen.getByText('Europe');
    fireEvent.click(europeButton.closest('button') || europeButton);
    // Should show countries after clicking
    expect(screen.getByText('Italy') || screen.getByText('France')).toBeTruthy();
  });

  it('shows country threat details', () => {
    render(<WorldThreatMap />);
    const europeButton = screen.getByText('Europe');
    fireEvent.click(europeButton.closest('button') || europeButton);
    // Italy has 9 police stations
    expect(screen.getByText(/Italy/)).toBeTruthy();
  });

  it('renders multiple regions', () => {
    render(<WorldThreatMap />);
    expect(screen.getByText('Europe')).toBeTruthy();
    expect(screen.getByText('North America')).toBeTruthy();
    expect(screen.getByText(/South America/)).toBeTruthy();
    expect(screen.getByText(/Asia/)).toBeTruthy();
    expect(screen.getByText(/Africa/)).toBeTruthy();
  });

  it('renders globe icon or map visual', () => {
    const { container } = render(<WorldThreatMap />);
    // Should have some visual element (SVG icons)
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });
});
