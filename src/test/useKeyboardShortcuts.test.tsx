import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';

// Track navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const wrapper = ({ children }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('useKeyboardShortcuts', () => {
  let mockOpenSearch;
  let mockToggleHelp;

  beforeEach(() => {
    mockNavigate.mockClear();
    mockOpenSearch = vi.fn();
    mockToggleHelp = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('opens search when / is pressed', () => {
    renderHook(() => useKeyboardShortcuts({
      onOpenSearch: mockOpenSearch,
      onToggleHelp: mockToggleHelp,
    }), { wrapper });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }));
    expect(mockOpenSearch).toHaveBeenCalledTimes(1);
  });

  it('toggles help when ? is pressed', () => {
    renderHook(() => useKeyboardShortcuts({
      onOpenSearch: mockOpenSearch,
      onToggleHelp: mockToggleHelp,
    }), { wrapper });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }));
    expect(mockToggleHelp).toHaveBeenCalledTimes(1);
  });

  it('does not trigger shortcuts when typing in an input', () => {
    renderHook(() => useKeyboardShortcuts({
      onOpenSearch: mockOpenSearch,
      onToggleHelp: mockToggleHelp,
    }), { wrapper });

    // Simulate a keydown on an input element
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true }));
    expect(mockOpenSearch).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });

  it('does not trigger / when Ctrl is held (Ctrl+/)', () => {
    renderHook(() => useKeyboardShortcuts({
      onOpenSearch: mockOpenSearch,
      onToggleHelp: mockToggleHelp,
    }), { wrapper });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: '/', ctrlKey: true }));
    expect(mockOpenSearch).not.toHaveBeenCalled();
  });

  it('navigates to dashboard with g then d', async () => {
    renderHook(() => useKeyboardShortcuts({
      onOpenSearch: mockOpenSearch,
      onToggleHelp: mockToggleHelp,
    }), { wrapper });

    // Press g
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }));
    // Then press d
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to intelligence with g then i', () => {
    renderHook(() => useKeyboardShortcuts({
      onOpenSearch: mockOpenSearch,
      onToggleHelp: mockToggleHelp,
    }), { wrapper });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'i' }));
    expect(mockNavigate).toHaveBeenCalledWith('/intelligence');
  });

  it('navigates to prisoners with g then p', () => {
    renderHook(() => useKeyboardShortcuts({
      onOpenSearch: mockOpenSearch,
      onToggleHelp: mockToggleHelp,
    }), { wrapper });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
    expect(mockNavigate).toHaveBeenCalledWith('/prisoners');
  });

  it('navigates to take-action with g then t', () => {
    renderHook(() => useKeyboardShortcuts({
      onOpenSearch: mockOpenSearch,
      onToggleHelp: mockToggleHelp,
    }), { wrapper });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 't' }));
    expect(mockNavigate).toHaveBeenCalledWith('/take-action');
  });

  it('navigates to security with g then s', () => {
    renderHook(() => useKeyboardShortcuts({
      onOpenSearch: mockOpenSearch,
      onToggleHelp: mockToggleHelp,
    }), { wrapper });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
    expect(mockNavigate).toHaveBeenCalledWith('/security');
  });

  it('does not navigate with unknown second key (g then x)', () => {
    renderHook(() => useKeyboardShortcuts({
      onOpenSearch: mockOpenSearch,
      onToggleHelp: mockToggleHelp,
    }), { wrapper });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
