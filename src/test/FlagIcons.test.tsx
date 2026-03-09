import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { EastTurkestanFlag, TibetanFlag } from '../components/FlagIcons';

describe('EastTurkestanFlag', () => {
  it('renders the SVG element', () => {
    const { container } = render(<EastTurkestanFlag />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('has the correct aria-label', () => {
    render(<EastTurkestanFlag />);
    expect(screen.getByLabelText('East Turkestan flag')).toBeTruthy();
  });

  it('renders a blue rect background', () => {
    const { container } = render(<EastTurkestanFlag />);
    const rect = container.querySelector('rect');
    expect(rect).toBeTruthy();
    expect(rect.getAttribute('fill')).toBe('#75AADB');
  });

  it('renders white circles for the crescent', () => {
    const { container } = render(<EastTurkestanFlag />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });

  it('renders a white star polygon', () => {
    const { container } = render(<EastTurkestanFlag />);
    const polygon = container.querySelector('polygon');
    expect(polygon).toBeTruthy();
    expect(polygon.getAttribute('fill')).toBe('white');
  });

  it('applies the default className', () => {
    const { container } = render(<EastTurkestanFlag />);
    const svg = container.querySelector('svg');
    expect(svg.getAttribute('class')).toContain('w-5 h-5');
  });
});

describe('TibetanFlag', () => {
  it('renders the SVG element', () => {
    const { container } = render(<TibetanFlag />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('has the correct aria-label', () => {
    render(<TibetanFlag />);
    expect(screen.getByLabelText('Tibetan flag')).toBeTruthy();
  });

  it('renders rect elements for the background', () => {
    const { container } = render(<TibetanFlag />);
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBe(2);
  });

  it('renders polygons for the rays and mountain', () => {
    const { container } = render(<TibetanFlag />);
    const polygons = container.querySelectorAll('polygon');
    expect(polygons.length).toBeGreaterThan(0);
  });

  it('renders a yellow sun circle', () => {
    const { container } = render(<TibetanFlag />);
    const circle = container.querySelector('circle');
    expect(circle).toBeTruthy();
    expect(circle.getAttribute('fill')).toBe('#F4D03F');
  });

  it('applies the default className', () => {
    const { container } = render(<TibetanFlag />);
    const svg = container.querySelector('svg');
    expect(svg.getAttribute('class')).toContain('w-5 h-5');
  });
});
