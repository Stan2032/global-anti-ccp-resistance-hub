// @ts-nocheck — Phase 2 migration: types to be added
/**
 * KeyboardShortcutsHelp — Modal overlay showing available keyboard
 * shortcuts for power users. Triggered by pressing '?'.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Callback to close the modal
 * @returns {React.ReactElement|null} Shortcuts modal or null when closed
 */
import React, { useEffect } from 'react';

const shortcuts = [
  { keys: ['?'], description: 'Toggle this help' },
  { keys: ['/', '⌘K'], description: 'Open search' },
  { keys: ['g', 'd'], description: 'Go to Dashboard' },
  { keys: ['g', 'i'], description: 'Go to Intelligence' },
  { keys: ['g', 'p'], description: 'Go to Political Prisoners' },
  { keys: ['g', 'r'], description: 'Go to Profiles' },
  { keys: ['g', 't'], description: 'Go to Take Action' },
  { keys: ['g', 'e'], description: 'Go to Education' },
  { keys: ['g', 's'], description: 'Go to Security' },
  { keys: ['Esc'], description: 'Close modal' },
];

const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape' || e.key === '?') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative bg-[#111820] border border-[#1c2a35] max-w-md w-full max-h-[80vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
      >
        <div className="p-5 border-b border-[#1c2a35]">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-[#4afa82] text-sm font-bold">
              $ keyboard_shortcuts
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-5">
          <table className="w-full">
            <tbody>
              {shortcuts.map((shortcut, i) => (
                <tr key={i} className="border-b border-[#1c2a35]/50 last:border-0">
                  <td className="py-2.5 pr-4">
                    <span className="flex items-center gap-1">
                      {shortcut.keys.map((key, j) => (
                        <span key={j} className="flex items-center gap-1">
                          {j > 0 && <span className="text-slate-500 text-xs mx-0.5">then</span>}
                          <kbd className="px-2 py-0.5 bg-[#0a0e14] border border-[#1c2a35] text-[#4afa82] font-mono text-xs rounded">
                            {key}
                          </kbd>
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-300 font-mono text-sm">
                    {shortcut.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 pb-4 text-center">
          <span className="text-slate-400 font-mono text-xs">
            Press <kbd className="px-1.5 py-0.5 bg-[#0a0e14] border border-[#1c2a35] text-slate-400 text-xs rounded">?</kbd> or <kbd className="px-1.5 py-0.5 bg-[#0a0e14] border border-[#1c2a35] text-slate-400 text-xs rounded">Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
