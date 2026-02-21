import React from 'react';
import GlobalSearch, { useGlobalSearch } from './GlobalSearch';

// Wrapper component that uses the hook and provides search functionality
const SearchWrapper = ({ children }) => {
  const { isOpen, setIsOpen, close } = useGlobalSearch();

  return (
    <>
      {/* Pass search opener to children */}
      {typeof children === 'function' 
        ? children({ openSearch: () => setIsOpen(true) })
        : children
      }
      
      {/* Global Search Modal */}
      <GlobalSearch isOpen={isOpen} onClose={close} />
    </>
  );
};

// Search trigger button component
export const SearchButton = ({ onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 bg-[#111820] border border-[#1c2a35] text-slate-400 hover:text-white hover:bg-[#111820] transition-colors ${className}`}
    aria-label="Open search (Ctrl+K)"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <span className="text-sm">Search...</span>
    <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-xs bg-[#1c2a35] rounded">⌘K</kbd>
  </button>
);

export default SearchWrapper;
