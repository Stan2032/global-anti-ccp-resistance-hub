/**
 * useGlobalSearch — Keyboard-driven search overlay hook.
 *
 * Listens for Cmd/Ctrl+K to toggle a global search overlay.
 * Returns state and helpers for the SearchWrapper component.
 *
 * @module useGlobalSearch
 */
import { useState, useEffect } from 'react';

/**
 * @typedef {Object} GlobalSearchState
 * @property {boolean} isOpen - Whether the search overlay is visible
 * @property {(value: boolean) => void} setIsOpen - Direct setter
 * @property {() => void} open - Open the search overlay
 * @property {() => void} close - Close the search overlay
 */

/**
 * Hook that manages global search overlay visibility.
 * Registers a keyboard listener for Cmd/Ctrl+K to toggle the overlay.
 *
 * @returns {GlobalSearchState} Search overlay state and controls
 */
const useGlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
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
