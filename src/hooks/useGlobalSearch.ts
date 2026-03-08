/**
 * useGlobalSearch — Keyboard-driven search overlay hook.
 *
 * Listens for Cmd/Ctrl+K to toggle a global search overlay.
 * Returns state and helpers for the SearchWrapper component.
 *
 * @module useGlobalSearch
 */
import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';

/** State and controls returned by the useGlobalSearch hook. */
export interface GlobalSearchState {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  open: () => void;
  close: () => void;
}

/**
 * Hook that manages global search overlay visibility.
 * Registers a keyboard listener for Cmd/Ctrl+K to toggle the overlay.
 */
const useGlobalSearch = (): GlobalSearchState => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
};

export default useGlobalSearch;
