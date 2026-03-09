// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import BackToTop from '../components/BackToTop';

describe('BackToTop', () => {
  beforeEach(() => {
    // Reset scrollY
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    window.scrollTo = vi.fn();
  });

  it('is not visible when scrollY is 0', () => {
    const { container } = render(<BackToTop />);
    expect(container.querySelector('button')).toBeFalsy();
  });

  it('becomes visible after scrolling past 400px', () => {
    const { container } = render(<BackToTop />);

    // Simulate scroll > 400
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
    fireEvent.scroll(window);

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('has correct aria-label', () => {
    render(<BackToTop />);

    Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
    fireEvent.scroll(window);

    expect(screen.getByLabelText('Back to top')).toBeTruthy();
  });

  it('calls scrollTo when clicked', () => {
    render(<BackToTop />);

    Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
    fireEvent.scroll(window);

    fireEvent.click(screen.getByLabelText('Back to top'));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('hides when scrolling back to top', () => {
    const { container } = render(<BackToTop />);

    // Scroll down first
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
    fireEvent.scroll(window);
    expect(container.querySelector('button')).toBeTruthy();

    // Scroll back up
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);
    expect(container.querySelector('button')).toBeFalsy();
  });

  it('has title attribute', () => {
    render(<BackToTop />);

    Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
    fireEvent.scroll(window);

    expect(screen.getByTitle('Back to top')).toBeTruthy();
  });
});
