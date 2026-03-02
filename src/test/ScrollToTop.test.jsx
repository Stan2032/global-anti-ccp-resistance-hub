import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import ScrollToTop from '../components/ScrollToTop';

describe('ScrollToTop', () => {
  let scrollToSpy;

  beforeEach(() => {
    vi.useFakeTimers();
    scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    scrollToSpy.mockRestore();
  });

  function renderWithRouter(initialRoute = '/') {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <ScrollToTop />
      </MemoryRouter>
    );
  }

  it('renders nothing (returns null)', () => {
    const { container } = renderWithRouter();
    expect(container.innerHTML).toBe('');
  });

  it('scrolls to top on mount', () => {
    renderWithRouter('/');
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });

  it('scrolls to top on route change', () => {
    const { unmount } = renderWithRouter('/page1');
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    unmount();

    renderWithRouter('/page2');
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });

  it('attempts to focus main-content element after timeout', () => {
    const mainEl = document.createElement('div');
    mainEl.id = 'main-content';
    document.body.appendChild(mainEl);
    const focusSpy = vi.spyOn(mainEl, 'focus');

    renderWithRouter('/');
    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    expect(mainEl.getAttribute('tabindex')).toBe('-1');

    document.body.removeChild(mainEl);
    focusSpy.mockRestore();
  });

  it('does not throw if main-content element does not exist', () => {
    renderWithRouter('/');
    act(() => {
      vi.advanceTimersByTime(150);
    });
    // Should complete without error
    expect(true).toBe(true);
  });

  it('sets tabindex=-1 only if not already present', () => {
    const mainEl = document.createElement('div');
    mainEl.id = 'main-content';
    mainEl.setAttribute('tabindex', '-1');
    document.body.appendChild(mainEl);

    renderWithRouter('/');
    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Should NOT have changed the attribute
    expect(mainEl.getAttribute('tabindex')).toBe('-1');

    document.body.removeChild(mainEl);
  });
});
