import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import QuickStartGuide, { HelpMenu } from '../components/QuickStartGuide';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    _reset: () => { store = {}; },
    _store: store,
  };
})();

beforeEach(() => {
  mockLocalStorage._reset();
  // Restore implementations after clearing (mockClear removes them)
  mockLocalStorage.getItem.mockReset();
  mockLocalStorage.setItem.mockReset();
  mockLocalStorage.removeItem.mockReset();
  // Default: getItem returns null (simulates fresh user with no localStorage data).
  // Tests that need specific values override with mockImplementation.
  mockLocalStorage.getItem.mockImplementation(() => null);
  mockLocalStorage.setItem.mockImplementation((key, value) => {});
  mockLocalStorage.removeItem.mockImplementation((key) => {});
  Object.defineProperty(window, 'localStorage', { value: mockLocalStorage, writable: true });
});

const renderGuide = () => render(
  <MemoryRouter>
    <QuickStartGuide />
  </MemoryRouter>
);

describe('QuickStartGuide', () => {
  it('shows the guide on first visit', () => {
    renderGuide();
    expect(screen.getByText('Welcome to the Resistance Hub')).toBeTruthy();
  });

  it('shows step counter', () => {
    renderGuide();
    expect(screen.getByText('1/7')).toBeTruthy();
  });

  it('shows close button', () => {
    renderGuide();
    expect(screen.getByText(/close/)).toBeTruthy();
  });

  it('advances to next step', () => {
    renderGuide();
    fireEvent.click(screen.getByText('next →'));
    expect(screen.getByText('Explore the Dashboard')).toBeTruthy();
    expect(screen.getByText('2/7')).toBeTruthy();
  });

  it('goes back to previous step', () => {
    renderGuide();
    fireEvent.click(screen.getByText('next →'));
    expect(screen.getByText('2/7')).toBeTruthy();
    fireEvent.click(screen.getByText('← back'));
    expect(screen.getByText('1/7')).toBeTruthy();
  });

  it('back button is disabled on first step', () => {
    renderGuide();
    const backBtn = screen.getByText('← back');
    expect(backBtn.disabled).toBe(true);
  });

  it('shows action link for steps with actions', () => {
    renderGuide();
    fireEvent.click(screen.getByText('next →')); // Step 2
    expect(screen.getByText(/go \//)).toBeTruthy();
  });

  it('shows "done" on last step', () => {
    renderGuide();
    // Navigate to last step (7 steps, click next 6 times)
    for (let i = 0; i < 6; i++) {
      fireEvent.click(screen.getByText('next →'));
    }
    expect(screen.getByText('done')).toBeTruthy();
  });

  it('dismisses guide when close is clicked', () => {
    const { container } = renderGuide();
    fireEvent.click(screen.getByText(/close/));
    // Should save dismissal to localStorage
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('quickStartDismissed', 'true');
  });

  it('does not show guide if previously dismissed', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'quickStartDismissed') return 'true';
      return null;
    });
    renderGuide();
    // Should show the help button instead of the guide
    expect(screen.queryByText('Welcome to the Resistance Hub')).toBeFalsy();
    expect(screen.getByTitle('Quick Start Guide')).toBeTruthy();
  });

  it('shows floating help button when dismissed', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'quickStartDismissed') return 'true';
      return null;
    });
    renderGuide();
    expect(screen.getByTitle('Quick Start Guide')).toBeTruthy();
  });

  it('renders navigation buttons', () => {
    renderGuide();
    // Should have close, back, next and step dot buttons
    expect(screen.getByText(/close/)).toBeTruthy();
    expect(screen.getByText('← back')).toBeTruthy();
    expect(screen.getByText('next →')).toBeTruthy();
  });
});

describe('HelpMenu', () => {
  it('renders help button', () => {
    render(
      <MemoryRouter>
        <HelpMenu />
      </MemoryRouter>
    );
    expect(screen.getByTitle('Help')).toBeTruthy();
  });

  it('opens menu on click', () => {
    render(
      <MemoryRouter>
        <HelpMenu />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByTitle('Help'));
    expect(screen.getByText('Quick Start Guide')).toBeTruthy();
    expect(screen.getByText('Keyboard Shortcuts')).toBeTruthy();
    expect(screen.getByText('Report an Issue')).toBeTruthy();
    expect(screen.getByText('Security Tips')).toBeTruthy();
    expect(screen.getByText('FAQ')).toBeTruthy();
  });

  it('shows 5 help items', () => {
    render(
      <MemoryRouter>
        <HelpMenu />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByTitle('Help'));
    expect(screen.getByText('Quick Start Guide')).toBeTruthy();
    expect(screen.getByText('Keyboard Shortcuts')).toBeTruthy();
    expect(screen.getByText('Report an Issue')).toBeTruthy();
    expect(screen.getByText('Security Tips')).toBeTruthy();
    expect(screen.getByText('FAQ')).toBeTruthy();
  });
});
