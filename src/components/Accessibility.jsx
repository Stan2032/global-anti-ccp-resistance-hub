import React, { useEffect } from 'react';
import { useLanguage } from './LanguageSelector';

/**
 * Skip Links Component
 * Provides keyboard users with quick navigation to main content areas
 * Uses i18n translations (8 languages) and terminal design system colors
 */
const SKIP_LINK_CLASSES = 'fixed top-0 z-[100] bg-[#111820] text-[#4afa82] border border-[#4afa82] px-4 py-2 font-mono font-medium focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-[#4afa82]';

export const SkipLinks = () => {
  const { t } = useLanguage();
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a href="#main-content" className={`${SKIP_LINK_CLASSES} left-0`}>
        {t('skipToMain')}
      </a>
      <a href="#navigation" className={`${SKIP_LINK_CLASSES} left-52`}>
        {t('skipToNav')}
      </a>
    </div>
  );
};

/**
 * Visually Hidden Component
 * For screen reader only content
 */
export const VisuallyHidden = ({ children, as: Component = 'span' }) => {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
};

/**
 * Focus Trap Hook
 * Traps focus within a container (useful for modals)
 */
export const useFocusTrap = (containerRef, isActive) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, isActive]);
};

/**
 * Announce to Screen Readers
 * Creates a live region for dynamic announcements
 */
export const LiveRegion = ({ message, priority = 'polite' }) => {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

/**
 * Accessible Button Component
 * Button with proper ARIA attributes
 */
export const AccessibleButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  className = '',
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      aria-disabled={disabled}
      className={`focus:outline-none focus:ring-2 focus:ring-[#4afa82] focus:ring-offset-2 focus:ring-offset-slate-900 ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="sr-only">Loading...</span>
          <span aria-hidden="true" className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
        </>
      ) : null}
      {children}
    </button>
  );
};

/**
 * Accessible Card Component
 * Card with proper semantic structure
 */
export const AccessibleCard = ({
  children,
  title,
  description,
  as: Component = 'article',
  className = '',
  ...props
}) => {
  return (
    <Component
      className={`focus-within:ring-2 focus-within:ring-[#4afa82] ${className}`}
      aria-label={title}
      {...props}
    >
      {title && (
        <h3 className="font-bold text-lg mb-2" id={`card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}>
          {title}
        </h3>
      )}
      {description && (
        <p className="text-slate-400 text-sm mb-4" id={`card-desc-${title?.replace(/\s+/g, '-').toLowerCase()}`}>
          {description}
        </p>
      )}
      {children}
    </Component>
  );
};

/**
 * Keyboard Navigation Hook
 * Handles arrow key navigation in lists
 */
export const useKeyboardNavigation = (items, onSelect) => {
  const [focusedIndex, setFocusedIndex] = React.useState(0);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect?.(items[focusedIndex], focusedIndex);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
      default:
        break;
    }
  };

  return { focusedIndex, setFocusedIndex, handleKeyDown };
};

/**
 * Accessible Tab Panel Component
 */
export const AccessibleTabs = ({ tabs, activeTab, onTabChange, children }) => {
  return (
    <div>
      <div role="tablist" aria-label="Content tabs" className="flex space-x-2 mb-4">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = (index + 1) % tabs.length;
                onTabChange(tabs[nextIndex].id);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = (index - 1 + tabs.length) % tabs.length;
                onTabChange(tabs[prevIndex].id);
              }
            }}
            className={`px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#4afa82] ${
              activeTab === tab.id
                ? 'bg-[#4afa82]/20 text-[#4afa82] border border-[#4afa82]/50'
                : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
            }`}
          >
            {tab.icon && <span className="mr-2" aria-hidden="true">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`tabpanel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          tabIndex={0}
        >
          {activeTab === tab.id && children}
        </div>
      ))}
    </div>
  );
};

/**
 * Progress Indicator with ARIA
 */
export const AccessibleProgress = ({ value, max = 100, label }) => {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-slate-400">{label}</span>
          <span className="text-sm text-slate-400">{percentage}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${percentage}%`}
        className="w-full bg-[#111820] rounded-full h-2"
      >
        <div
          className="bg-[#4afa82] h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

/**
 * Alert Component with proper ARIA role
 */
export const AccessibleAlert = ({ type = 'info', title, children, onDismiss }) => {
  const typeStyles = {
    info: 'bg-[#111820]/50 border-[#1c2a35] text-[#22d3ee]',
    warning: 'bg-yellow-900/50 border-yellow-700 text-yellow-300',
    error: 'bg-red-900/50 border-red-700 text-red-300',
    success: 'bg-green-900/50 border-green-700 text-green-300',
  };

  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    success: '✅',
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`p-4 border ${typeStyles[type]} flex items-start`}
    >
      <span className="mr-3 text-xl" aria-hidden="true">{icons[type]}</span>
      <div className="flex-1">
        {title && <h4 className="font-bold mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="ml-4 p-1 hover:bg-white/10 rounded"
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
};

export default {
  SkipLinks,
  VisuallyHidden,
  LiveRegion,
  AccessibleButton,
  AccessibleCard,
  AccessibleTabs,
  AccessibleProgress,
  AccessibleAlert,
  useFocusTrap,
  useKeyboardNavigation,
};
