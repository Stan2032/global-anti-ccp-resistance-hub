import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/** Callback options accepted by useKeyboardShortcuts. */
export interface KeyboardShortcutOptions {
  onOpenSearch?: () => void;
  onToggleHelp?: () => void;
}

/**
 * Keyboard shortcuts for power-user navigation.
 *
 * Shortcuts:
 *   ?           — Show/hide keyboard shortcut help
 *   /           — Focus search (opens global search)
 *   Escape      — Close modal / go back
 *   g then d    — Go to Dashboard
 *   g then i    — Go to Intelligence
 *   g then p    — Go to Political Prisoners
 *   g then r    — Go to Profiles
 *   g then t    — Go to Take Action
 *   g then e    — Go to Education
 *   g then s    — Go to Security
 */
const useKeyboardShortcuts = ({ onOpenSearch, onToggleHelp }: KeyboardShortcutOptions): void => {
  const navigate = useNavigate();

  const handleKeyDown = useCallback((e: KeyboardEvent): void => {
    // Don't trigger shortcuts when typing in inputs/textareas
    const target = e.target as HTMLElement;
    const tag = target.tagName;
    const isEditable = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
    if (isEditable) return;

    // ? — Toggle help
    if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onToggleHelp?.();
      return;
    }

    // / — Open search
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onOpenSearch?.();
      return;
    }

    // g prefix — navigation shortcuts
    if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
      const routes: Record<string, string> = {
        d: '/',
        i: '/intelligence',
        p: '/prisoners',
        r: '/profiles',
        t: '/take-action',
        e: '/education',
        s: '/security',
      };

      // Set up a one-time listener for the second key
      const handleSecondKey = (e2: KeyboardEvent): void => {
        // Ignore if user started typing in an input
        const target2 = e2.target as HTMLElement;
        const tag2 = target2.tagName;
        if (tag2 === 'INPUT' || tag2 === 'TEXTAREA' || tag2 === 'SELECT') return;

        const route = routes[e2.key];
        if (route) {
          e2.preventDefault();
          navigate(route);
        }
      };

      document.addEventListener('keydown', handleSecondKey, { once: true });

      // Cancel the second key listener after 1 second
      setTimeout(() => {
        document.removeEventListener('keydown', handleSecondKey);
      }, 1000);
    }
  }, [navigate, onOpenSearch, onToggleHelp]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
