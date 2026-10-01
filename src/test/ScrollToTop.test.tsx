import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import React from 'react';
import ScrollToTop from '../components/ScrollToTop';

describe('ScrollToTop', () => {
  let scrollToSpy: ReturnType<typeof vi.spyOn>;
  let main: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
    scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    main = document.createElement('main');
    main.id = 'main-content';
    document.body.appendChild(main);
  });

  afterEach(() => {
    vi.useRealTimers();
    scrollToSpy.mockRestore();
    main.remove();
  });

  /** Renders ScrollToTop on `start`, with a button that navigates to `to`. */
  function renderAt(start: string, to = '/other', strict = false) {
    function GoTo() {
      const navigate = useNavigate();
      return <button onClick={() => navigate(to)}>go</button>;
    }
    const tree = (
      <MemoryRouter initialEntries={[start]}>
        <ScrollToTop />
        <GoTo />
      </MemoryRouter>
    );
    return render(strict ? <React.StrictMode>{tree}</React.StrictMode> : tree);
  }

  /** Follows the in-app link, then lets the focus timer run. */
  function followLink() {
    fireEvent.click(screen.getByText('go'));
    act(() => {
      vi.advanceTimersByTime(150);
    });
  }

  it('renders nothing (returns null)', () => {
    const { container } = render(
      <MemoryRouter>
        <ScrollToTop />
      </MemoryRouter>
    );
    expect(container.innerHTML).toBe('');
  });

  // The browser has already placed the reader on the page they arrive on:
  // at the top, or at the #fragment their link named. Focusing <main> there
  // also put keyboard users past the skip links on every page load.
  it('leaves the page the reader arrives on alone: no scroll, no focus move', () => {
    const focusSpy = vi.spyOn(main, 'focus');
    renderAt('/education');
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(scrollToSpy).not.toHaveBeenCalled();
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('leaves the arrival page alone under StrictMode, which runs effects twice', () => {
    const focusSpy = vi.spyOn(main, 'focus');
    renderAt('/education', '/other', true);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(scrollToSpy).not.toHaveBeenCalled();
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('scrolls to the top when the reader follows a link to another page', () => {
    renderAt('/page1', '/page2');
    followLink();
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });

  it('moves focus to the main content after a route change', () => {
    const focusSpy = vi.spyOn(main, 'focus');
    renderAt('/page1', '/page2');
    followLink();
    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    expect(main.getAttribute('tabindex')).toBe('-1');
  });

  it('does not throw if main-content element does not exist', () => {
    main.remove();
    renderAt('/page1', '/page2');
    followLink();
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });

  it('sets tabindex=-1 only if not already present', () => {
    main.setAttribute('tabindex', '0');
    renderAt('/page1', '/page2');
    followLink();
    expect(main.getAttribute('tabindex')).toBe('0');
  });
});
