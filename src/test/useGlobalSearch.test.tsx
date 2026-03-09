import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useGlobalSearch from '../hooks/useGlobalSearch';

describe('useGlobalSearch', () => {
  it('starts with isOpen false', () => {
    const { result } = renderHook(() => useGlobalSearch());
    expect(result.current.isOpen).toBe(false);
  });

  it('open() sets isOpen to true', () => {
    const { result } = renderHook(() => useGlobalSearch());
    act(() => { result.current.open(); });
    expect(result.current.isOpen).toBe(true);
  });

  it('close() sets isOpen to false after opening', () => {
    const { result } = renderHook(() => useGlobalSearch());
    act(() => { result.current.open(); });
    expect(result.current.isOpen).toBe(true);
    act(() => { result.current.close(); });
    expect(result.current.isOpen).toBe(false);
  });

  it('setIsOpen toggles state', () => {
    const { result } = renderHook(() => useGlobalSearch());
    act(() => { result.current.setIsOpen(true); });
    expect(result.current.isOpen).toBe(true);
    act(() => { result.current.setIsOpen(false); });
    expect(result.current.isOpen).toBe(false);
  });

  it('Ctrl+K toggles search open/close', () => {
    const { result } = renderHook(() => useGlobalSearch());
    expect(result.current.isOpen).toBe(false);

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('Meta+K (Mac) toggles search', () => {
    const { result } = renderHook(() => useGlobalSearch());
    expect(result.current.isOpen).toBe(false);

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('regular K keypress does not toggle search', () => {
    const { result } = renderHook(() => useGlobalSearch());
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('other key combos do not toggle search', () => {
    const { result } = renderHook(() => useGlobalSearch());
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'j', ctrlKey: true }));
    });
    expect(result.current.isOpen).toBe(false);
  });
});
