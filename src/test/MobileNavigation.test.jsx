import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React, { useState } from 'react';
import { MemoryRouter, useLocation, Link } from 'react-router-dom';

// Replicate the MobileHeader component from App.jsx for isolated testing
const MobileHeader = ({ onMenuToggle, isMenuOpen }) => (
  <header className="bg-[#111820] border-b border-[#1c2a35] sticky top-0 z-50">
    <div className="flex items-center justify-between h-14 px-4">
      <button
        onClick={onMenuToggle}
        className="p-2 -ml-2 text-slate-300 hover:text-[#4afa82] active:text-white"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[#4afa82] text-sm font-bold tracking-tight">[GRH]</span>
        <span className="font-mono text-white text-sm font-semibold">resistance_hub</span>
      </div>
      <div className="flex items-center space-x-2">
        <Link to="/security" className="px-2 py-1 bg-transparent text-[#4afa82] text-xs font-mono font-medium border border-[#1c2a35] hover:border-[#4afa82] transition-colors">
          sec
        </Link>
      </div>
    </div>
  </header>
);

// Replicate the MobileNav component from App.jsx for isolated testing
const MobileNav = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Intelligence', href: '/intelligence' },
    { name: 'Political Prisoners', href: '/prisoners' },
    { name: 'Profiles', href: '/profiles', indent: true },
    { name: 'Take Action', href: '/take-action' },
    { name: 'Education', href: '/education' },
    { name: 'Security', href: '/security' },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
        data-testid="backdrop"
      />
      <nav
        className="fixed top-14 left-0 bottom-0 w-72 max-w-[85vw] bg-[#111820] border-r border-[#1c2a35] z-50 overflow-y-auto lg:hidden"
        aria-label="Mobile navigation"
      >
        <div className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center ${item.indent ? 'pl-8 pr-3' : 'px-3'} py-3 font-mono text-sm`}
              >
                {item.indent ? <span className="text-xs">{item.name}</span> : item.name}
              </Link>
            );
          })}
        </div>
        <div className="px-4 pb-4 border-t border-[#1c2a35] mt-2 pt-4">
          <Link to="/take-action" className="flex items-center px-3 py-3 bg-red-900/20 border border-red-900/50 text-red-300 font-mono text-sm">
            <div>
              <div className="font-medium">Free Jimmy Lai</div>
              <div className="text-xs text-red-400/80">URGENT — 20 years</div>
            </div>
          </Link>
        </div>
      </nav>
    </>
  );
};

// Test wrapper that combines MobileHeader + MobileNav with state management
const MobileNavTestWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <MobileHeader onMenuToggle={() => setIsOpen(!isOpen)} isMenuOpen={isOpen} />
      <MobileNav isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

const renderMobileNav = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <MobileNavTestWrapper />
    </MemoryRouter>
  );
};

describe('Mobile Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Hamburger Button ---

  it('renders the hamburger toggle button', () => {
    renderMobileNav();
    expect(screen.getByLabelText('Toggle menu')).toBeTruthy();
  });

  it('hamburger button toggles mobile menu open', () => {
    renderMobileNav();
    expect(screen.queryByLabelText('Mobile navigation')).toBeNull();
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(screen.getByLabelText('Mobile navigation')).toBeTruthy();
  });

  it('hamburger button toggles mobile menu closed', () => {
    renderMobileNav();
    const toggle = screen.getByLabelText('Toggle menu');
    fireEvent.click(toggle);
    expect(screen.getByLabelText('Mobile navigation')).toBeTruthy();
    fireEvent.click(toggle);
    expect(screen.queryByLabelText('Mobile navigation')).toBeNull();
  });

  // --- Nav Items ---

  it('renders 7 navigation links + 1 urgent campaign when open', () => {
    renderMobileNav();
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    const nav = screen.getByLabelText('Mobile navigation');
    const links = nav.querySelectorAll('a');
    expect(links.length).toBe(8); // 7 nav + 1 urgent
  });

  it('renders correct nav item labels', () => {
    renderMobileNav();
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText('Intelligence')).toBeTruthy();
    expect(screen.getByText('Political Prisoners')).toBeTruthy();
    expect(screen.getByText('Profiles')).toBeTruthy();
    expect(screen.getByText('Take Action')).toBeTruthy();
    expect(screen.getByText('Education')).toBeTruthy();
    expect(screen.getByText('Security')).toBeTruthy();
  });

  it('does not show hidden pages in nav', () => {
    renderMobileNav();
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(screen.queryByText('Community')).toBeNull();
    expect(screen.queryByText('Resources')).toBeNull();
    expect(screen.queryByText('Data Sources')).toBeNull();
    expect(screen.queryByText('Directory')).toBeNull();
  });

  // --- Active State ---

  it('marks current page with aria-current="page"', () => {
    renderMobileNav('/');
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    const nav = screen.getByLabelText('Mobile navigation');
    const activeLinks = nav.querySelectorAll('[aria-current="page"]');
    expect(activeLinks.length).toBe(1);
  });

  // --- Backdrop Overlay ---

  it('renders backdrop overlay when menu is open', () => {
    renderMobileNav();
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(screen.getByTestId('backdrop')).toBeTruthy();
  });

  it('closes menu when backdrop is clicked', () => {
    renderMobileNav();
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(screen.getByLabelText('Mobile navigation')).toBeTruthy();
    fireEvent.click(screen.getByTestId('backdrop'));
    expect(screen.queryByLabelText('Mobile navigation')).toBeNull();
  });

  // --- Urgent Campaign ---

  it('renders Free Jimmy Lai urgent campaign link', () => {
    renderMobileNav();
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(screen.getByText('Free Jimmy Lai')).toBeTruthy();
    expect(screen.getByText(/URGENT/)).toBeTruthy();
  });

  // --- Header Branding ---

  it('renders mobile header branding', () => {
    renderMobileNav();
    expect(screen.getByText('[GRH]')).toBeTruthy();
    expect(screen.getByText('resistance_hub')).toBeTruthy();
  });

  it('renders security quick link in header', () => {
    renderMobileNav();
    expect(screen.getByText('sec')).toBeTruthy();
  });

  // --- Navigation closes on link click ---

  it('closes menu when a nav link is clicked', () => {
    renderMobileNav();
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(screen.getByLabelText('Mobile navigation')).toBeTruthy();
    fireEvent.click(screen.getByText('Intelligence'));
    expect(screen.queryByLabelText('Mobile navigation')).toBeNull();
  });
});
